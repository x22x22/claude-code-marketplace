#!/usr/bin/env node
/**
 * Script to identify all plugins with "agent" from all marketplaces
 * Reads marketplaces.json and fetches each marketplace's manifest to find agent plugins
 * 
 * Usage: npm run list-agent-plugins
 * Or: npx tsx scripts/list-agent-plugins.ts
 */

import * as fs from 'fs';
import * as path from 'path';

interface Marketplace {
  id: string;
  name: string;
  description: string;
  manifestUrl: string;
  repository: string;
  homepage?: string;
}

interface Plugin {
  name: string;
  description?: string;
  tags?: string[];
  keywords?: string[];
  version?: string;
  author?: string;
  source?: string;
  repository?: string;
}

interface MarketplaceManifest {
  name: string;
  plugins?: Plugin[];
}

interface AgentPlugin {
  marketplaceName: string;
  marketplaceId: string;
  pluginName: string;
  description?: string;
  tags?: string[];
  source?: string;
  manifestUrl: string;
  detectionMethod?: string; // How the agent was detected
}

async function checkForAgentsFolder(repository: string, source: string): Promise<boolean> {
  if (!repository || !source) return false;
  
  try {
    // Extract owner and repo from repository URL
    const match = repository.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) return false;
    
    const [, owner, repo] = match;
    const cleanSource = source.replace(/^\.\//, '').replace(/\/$/, '');
    
    // Try to check if there's an agents folder in the plugin source
    const possiblePaths = [
      `https://raw.githubusercontent.com/${owner}/${repo}/main/${cleanSource}/agents/README.md`,
      `https://raw.githubusercontent.com/${owner}/${repo}/master/${cleanSource}/agents/README.md`,
      `https://raw.githubusercontent.com/${owner}/${repo}/main/${cleanSource}/agents/.gitkeep`,
      `https://raw.githubusercontent.com/${owner}/${repo}/master/${cleanSource}/agents/.gitkeep`,
    ];
    
    for (const url of possiblePaths) {
      try {
        const response = await fetch(url, { method: 'HEAD' });
        if (response.ok) {
          return true;
        }
      } catch {
        // Continue to next path
      }
    }
    
    // Also try checking via GitHub API
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${cleanSource}/agents`;
    try {
      const response = await fetch(apiUrl);
      if (response.ok) {
        return true;
      }
    } catch {
      // Ignore API errors
    }
    
    return false;
  } catch (error) {
    return false;
  }
}

async function fetchMarketplaceManifest(url: string): Promise<MarketplaceManifest | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return null;
  }
}

function containsAgent(text: string | undefined): boolean {
  if (!text) return false;
  // Use word boundary matching to avoid false positives with substrings
  // Match both "agent" and "agents" (singular and plural)
  // e.g., "management" should not match "agent"
  return /\bagents?\b/i.test(text);
}

function hasAgentInPlugin(plugin: Plugin): boolean {
  // Check if "agent" appears in name, description, tags, keywords, or source path
  if (containsAgent(plugin.name)) return true;
  if (containsAgent(plugin.description)) return true;
  if (plugin.tags && plugin.tags.some(tag => containsAgent(tag))) return true;
  if (plugin.keywords && plugin.keywords.some(keyword => containsAgent(keyword))) return true;
  if (containsAgent(plugin.source)) return true;
  return false;
}

async function main() {
  // Read marketplaces.json
  const marketplacesPath = path.join(__dirname, '..', '.claude-plugin', 'marketplaces.json');
  const marketplacesData = JSON.parse(fs.readFileSync(marketplacesPath, 'utf-8'));
  const marketplaces: Marketplace[] = marketplacesData.marketplaces;

  console.log(`Found ${marketplaces.length} marketplaces to check\n`);
  console.log('Fetching marketplace manifests...\n');

  const agentPlugins: AgentPlugin[] = [];
  let processedCount = 0;
  let errorCount = 0;
  let deepScanCount = 0;

  // Fetch and process each marketplace
  for (const marketplace of marketplaces) {
    processedCount++;
    process.stdout.write(`\rProcessing: ${processedCount}/${marketplaces.length} marketplaces...`);

    const manifest = await fetchMarketplaceManifest(marketplace.manifestUrl);
    
    if (!manifest || !manifest.plugins) {
      errorCount++;
      continue;
    }

    // Check each plugin for "agent"
    for (const plugin of manifest.plugins) {
      let detectionMethod = '';
      let isAgentPlugin = false;
      
      // First check metadata
      if (hasAgentInPlugin(plugin)) {
        isAgentPlugin = true;
        detectionMethod = 'metadata';
      }
      
      // If not found in metadata, check for agents folder in repository
      if (!isAgentPlugin && plugin.repository && plugin.source) {
        const hasAgentsFolder = await checkForAgentsFolder(plugin.repository, plugin.source);
        if (hasAgentsFolder) {
          isAgentPlugin = true;
          detectionMethod = 'repository-structure';
          deepScanCount++;
        }
      }
      
      if (isAgentPlugin) {
        agentPlugins.push({
          marketplaceName: marketplace.name,
          marketplaceId: marketplace.id,
          pluginName: plugin.name,
          description: plugin.description,
          tags: plugin.tags,
          source: plugin.source,
          manifestUrl: marketplace.manifestUrl,
          detectionMethod
        });
      }
    }
  }

  console.log(`\n\nProcessing complete!`);
  console.log(`Successfully processed: ${processedCount - errorCount}/${marketplaces.length} marketplaces`);
  console.log(`Errors: ${errorCount}`);
  console.log(`Found via repository scan: ${deepScanCount}`);
  console.log(`\nTotal agent plugins found: ${agentPlugins.length}\n`);

  // Output results
  console.log('='.repeat(80));
  console.log('PLUGINS WITH "AGENT"');
  console.log('='.repeat(80));
  console.log();

  // Group by marketplace
  const pluginsByMarketplace = agentPlugins.reduce((acc, plugin) => {
    if (!acc[plugin.marketplaceId]) {
      acc[plugin.marketplaceId] = {
        name: plugin.marketplaceName,
        plugins: []
      };
    }
    acc[plugin.marketplaceId].plugins.push(plugin);
    return acc;
  }, {} as Record<string, { name: string; plugins: AgentPlugin[] }>);

  // Sort marketplaces by number of agent plugins (descending)
  const sortedMarketplaces = Object.entries(pluginsByMarketplace)
    .sort(([, a], [, b]) => b.plugins.length - a.plugins.length);

  for (const [marketplaceId, data] of sortedMarketplaces) {
    console.log(`\n## ${data.name} (${data.plugins.length} agent plugins)`);
    console.log(`Marketplace ID: ${marketplaceId}`);
    console.log('-'.repeat(80));
    
    for (const plugin of data.plugins) {
      console.log(`\n### ${plugin.pluginName}`);
      if (plugin.description) {
        console.log(`Description: ${plugin.description}`);
      }
      if (plugin.tags && plugin.tags.length > 0) {
        console.log(`Tags: ${plugin.tags.join(', ')}`);
      }
      if (plugin.source) {
        console.log(`Source: ${plugin.source}`);
      }
    }
  }

  // Write results to a file
  const outputPath = path.join(__dirname, '..', 'agent-plugins-report.md');
  const markdown = generateMarkdownReport(agentPlugins, pluginsByMarketplace);
  fs.writeFileSync(outputPath, markdown);
  console.log(`\n\nReport saved to: ${outputPath}`);
}

/**
 * Convert text to URL-safe slug for markdown anchors
 * Note: This implementation only handles ASCII characters (a-z, 0-9).
 * All other characters (including Unicode, spaces, and special chars) are replaced with hyphens.
 * Multiple consecutive hyphens are collapsed into one, and leading/trailing hyphens are removed.
 * 
 * Examples:
 *   "Hello World" -> "hello-world"
 *   "User's Guide" -> "user-s-guide"
 *   "中文测试" -> "" (empty, as all chars are non-ASCII)
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function generateMarkdownReport(
  agentPlugins: AgentPlugin[],
  pluginsByMarketplace: Record<string, { name: string; plugins: AgentPlugin[] }>
): string {
  const lines: string[] = [];
  
  lines.push('# Agent Plugins Report');
  lines.push('');
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push('');
  lines.push(`Total agent plugins found: **${agentPlugins.length}**`);
  lines.push('');
  lines.push('---');
  lines.push('');

  // Table of contents
  lines.push('## Table of Contents');
  lines.push('');
  const sortedMarketplaces = Object.entries(pluginsByMarketplace)
    .sort(([, a], [, b]) => b.plugins.length - a.plugins.length);
  
  for (const [marketplaceId, data] of sortedMarketplaces) {
    const anchor = slugify(data.name);
    lines.push(`- [${data.name}](#${anchor}) (${data.plugins.length} plugins)`);
  }
  lines.push('');
  lines.push('---');
  lines.push('');

  // Detailed listings
  for (const [marketplaceId, data] of sortedMarketplaces) {
    lines.push(`## ${data.name}`);
    lines.push('');
    lines.push(`**Marketplace ID:** \`${marketplaceId}\`  `);
    lines.push(`**Agent Plugins Count:** ${data.plugins.length}`);
    lines.push('');
    
    for (const plugin of data.plugins) {
      lines.push(`### ${plugin.pluginName}`);
      lines.push('');
      if (plugin.description) {
        lines.push(`**Description:** ${plugin.description}`);
        lines.push('');
      }
      if (plugin.tags && plugin.tags.length > 0) {
        lines.push(`**Tags:** ${plugin.tags.map(t => `\`${t}\``).join(', ')}`);
        lines.push('');
      }
      if (plugin.source) {
        lines.push(`**Source:** \`${plugin.source}\``);
        lines.push('');
      }
      if (plugin.detectionMethod === 'repository-structure') {
        lines.push(`**Detection:** Found via repository scan (has agents folder)  `);
        lines.push('');
      }
      lines.push('---');
      lines.push('');
    }
  }

  return lines.join('\n');
}

main().catch(console.error);
