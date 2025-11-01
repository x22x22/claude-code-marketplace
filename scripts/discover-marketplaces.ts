#!/usr/bin/env tsx

/**
 * Automated Marketplace Discovery Script
 * 
 * This script searches GitHub for repositories containing `.claude-plugin/marketplace.json`
 * and validates them for addition to the marketplace hub.
 */

import { Octokit } from '@octokit/rest';
import * as fs from 'fs/promises';
import * as path from 'path';

interface GitHubSearchResult {
  items: Array<{
    repository: {
      full_name: string;
      html_url: string;
      description?: string | null;
      owner: {
        login: string;
        html_url: string;
        type?: string;
      };
      stargazers_count?: number;
      updated_at?: string;
      default_branch?: string;
    };
    path: string;
  }>;
}

interface MarketplaceEntry {
  id: string;
  name: string;
  description: string;
  owner: {
    name: string;
    url: string;
  };
  repository: string;
  manifestUrl: string;
  tags: string[];
  homepage: string;
  verified: boolean;
  addedAt: string;
}

interface MarketplaceManifest {
  name: string;
  owner?: {
    name: string;
    url?: string;
  };
  metadata?: {
    description?: string;
    version?: string;
  };
  plugins: any[];
}

// Load existing marketplaces
async function loadExistingMarketplaces(): Promise<Set<string>> {
  try {
    const data = await fs.readFile(
      path.join(process.cwd(), '.claude-plugin', 'marketplaces.json'),
      'utf-8'
    );
    const parsed = JSON.parse(data);
    return new Set(parsed.marketplaces.map((m: MarketplaceEntry) => m.repository.toLowerCase()));
  } catch (error) {
    console.error('Failed to load existing marketplaces:', error);
    return new Set();
  }
}

// Validate a marketplace manifest
async function validateManifest(url: string): Promise<{ valid: boolean; manifest?: MarketplaceManifest; error?: string }> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      return { valid: false, error: `HTTP ${response.status}` };
    }

    const manifest = await response.json();

    // Basic validation
    if (!manifest.name) {
      return { valid: false, error: 'Missing required field: name' };
    }

    if (!Array.isArray(manifest.plugins)) {
      return { valid: false, error: 'Missing or invalid plugins array' };
    }

    return { valid: true, manifest };
  } catch (error) {
    return { valid: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Generate marketplace ID from repository name
function generateMarketplaceId(fullName: string): string {
  return fullName.toLowerCase().replace('/', '-');
}

// Create marketplace entry from GitHub data
async function createMarketplaceEntry(
  repo: GitHubSearchResult['items'][0]['repository'],
  manifest: MarketplaceManifest
): Promise<MarketplaceEntry> {
  const id = generateMarketplaceId(repo.full_name);
  const description = manifest.metadata?.description || repo.description || 'Claude Code plugins and tools';
  
  const defaultBranch = repo.default_branch || 'main';
  
  return {
    id,
    name: repo.full_name,
    description,
    owner: {
      name: manifest.owner?.name || repo.owner.login,
      url: manifest.owner?.url || repo.owner.html_url,
    },
    repository: repo.html_url,
    manifestUrl: `https://raw.githubusercontent.com/${repo.full_name}/${defaultBranch}/.claude-plugin/marketplace.json`,
    tags: ['community'],
    homepage: repo.html_url,
    verified: false,
    addedAt: new Date().toISOString().split('T')[0],
  };
}

// Main discovery function
async function discoverMarketplaces(options: {
  githubToken?: string;
  dryRun?: boolean;
  maxResults?: number;
}) {
  const { githubToken, dryRun = true, maxResults = 100 } = options;

  if (!githubToken) {
    console.error('GitHub token is required. Set GITHUB_TOKEN environment variable.');
    process.exit(1);
  }

  const octokit = new Octokit({ auth: githubToken });

  console.log('🔍 Searching GitHub for Claude Code marketplaces...\n');

  // Load existing marketplaces to avoid duplicates
  const existingRepos = await loadExistingMarketplaces();
  console.log(`📦 Found ${existingRepos.size} existing marketplaces\n`);

  const newMarketplaces: MarketplaceEntry[] = [];
  const errors: Array<{ repo: string; error: string }> = [];

  try {
    // Search for repositories with .claude-plugin/marketplace.json
    const searchQuery = 'path:.claude-plugin/marketplace.json';
    
    console.log(`🔎 Searching with query: "${searchQuery}"\n`);

    const searchResults = await octokit.rest.search.code({
      q: searchQuery,
      per_page: Math.min(maxResults, 100),
      sort: 'indexed',
    });

    console.log(`✨ Found ${searchResults.data.items.length} potential marketplaces\n`);

    for (const item of searchResults.data.items) {
      const repoUrl = item.repository.html_url;
      const repoKey = repoUrl.toLowerCase();

      // Skip if already in our list
      if (existingRepos.has(repoKey)) {
        console.log(`⏭️  Skipping existing: ${item.repository.full_name}`);
        continue;
      }

      console.log(`\n🔍 Checking: ${item.repository.full_name}`);

      // Construct manifest URL
      const manifestUrl = `https://raw.githubusercontent.com/${item.repository.full_name}/${item.repository.default_branch}/.claude-plugin/marketplace.json`;

      // Validate manifest
      const validation = await validateManifest(manifestUrl);

      if (!validation.valid) {
        console.log(`   ❌ Invalid: ${validation.error}`);
        errors.push({ repo: item.repository.full_name, error: validation.error || 'Unknown error' });
        continue;
      }

      console.log(`   ✅ Valid manifest with ${validation.manifest!.plugins.length} plugins`);

      // Create entry
      const entry = await createMarketplaceEntry(item.repository, validation.manifest!);
      newMarketplaces.push(entry);

      console.log(`   📝 Created entry: ${entry.id}`);
      console.log(`   ⭐ Stars: ${item.repository.stargazers_count}`);
    }

    console.log(`\n\n📊 Discovery Summary:`);
    console.log(`   Total found: ${searchResults.data.items.length}`);
    console.log(`   New marketplaces: ${newMarketplaces.length}`);
    console.log(`   Errors: ${errors.length}`);

    if (errors.length > 0) {
      console.log('\n❌ Repositories with errors:');
      errors.forEach(({ repo, error }) => {
        console.log(`   - ${repo}: ${error}`);
      });
    }

    if (newMarketplaces.length > 0) {
      console.log('\n✨ New marketplaces discovered:');
      newMarketplaces.forEach((m) => {
        console.log(`   - ${m.name} (${m.repository})`);
      });

      if (dryRun) {
        console.log('\n🔬 DRY RUN MODE: Not saving changes');
        console.log('   Run with --no-dry-run to save discovered marketplaces');
        
        // Write to a preview file
        const previewPath = path.join(process.cwd(), 'discovered-marketplaces.json');
        await fs.writeFile(previewPath, JSON.stringify(newMarketplaces, null, 2));
        console.log(`\n📄 Preview saved to: ${previewPath}`);
      } else {
        console.log('\n💾 Saving new marketplaces...');
        
        // Load current marketplaces file
        const marketplacesPath = path.join(process.cwd(), '.claude-plugin', 'marketplaces.json');
        const currentData = JSON.parse(await fs.readFile(marketplacesPath, 'utf-8'));
        
        // Add new marketplaces
        currentData.marketplaces.push(...newMarketplaces);
        
        // Sort by ID
        currentData.marketplaces.sort((a: MarketplaceEntry, b: MarketplaceEntry) => 
          a.id.localeCompare(b.id)
        );
        
        // Write back
        await fs.writeFile(marketplacesPath, JSON.stringify(currentData, null, 2) + '\n');
        console.log(`✅ Saved ${newMarketplaces.length} new marketplaces`);
      }
    } else {
      console.log('\n✨ No new marketplaces discovered');
    }

  } catch (error) {
    console.error('\n❌ Error during discovery:', error);
    process.exit(1);
  }
}

// CLI
const args = process.argv.slice(2);
const dryRun = !args.includes('--no-dry-run');
const maxResults = parseInt(args.find(arg => arg.startsWith('--max='))?.split('=')[1] || '100');

discoverMarketplaces({
  githubToken: process.env.GITHUB_TOKEN,
  dryRun,
  maxResults,
});
