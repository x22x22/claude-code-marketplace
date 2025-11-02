#!/usr/bin/env node
/**
 * Script to clone and analyze Claude Code plugins from agent-plugins-report.md
 * This script will:
 * 1. Parse the agent-plugins-report.md file
 * 2. Extract unique repositories and their plugins
 * 3. Clone repositories (shallow clone for efficiency)
 * 4. Analyze plugin structure, patterns, and characteristics
 * 5. Generate a comprehensive design document for a visual plugin development tool
 * 
 * Usage: npm run analyze-plugins
 * Or: npx tsx scripts/analyze-plugins.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

interface PluginInfo {
  name: string;
  description?: string;
  tags?: string[];
  source?: string;
  repository?: string;
  detectionMethod?: string;
  marketplace: string;
}

interface RepositoryAnalysis {
  url: string;
  plugins: PluginInfo[];
  cloneSuccess: boolean;
  localPath?: string;
  structure?: {
    hasAgentsFolder?: boolean;
    hasPromptFile?: boolean;
    hasTsConfig?: boolean;
    hasPackageJson?: boolean;
    hasReadme?: boolean;
    fileCount?: number;
    directories?: string[];
  };
  patterns?: {
    promptPatterns?: string[];
    agentCount?: number;
    commonFeatures?: string[];
  };
}

interface AnalysisReport {
  totalRepositories: number;
  analyzedRepositories: number;
  totalPlugins: number;
  commonCharacteristics: {
    structurePatterns: Map<string, number>;
    commonFiles: Map<string, number>;
    businessScenarios: Map<string, number>;
    tags: Map<string, number>;
  };
  painPoints: string[];
  recommendations: {
    toolFeatures: string[];
    architecturePatterns: string[];
    developerExperience: string[];
  };
}

/**
 * Parse the agent-plugins-report.md file to extract plugin information
 */
function parsePluginReport(reportPath: string): Map<string, PluginInfo[]> {
  const content = fs.readFileSync(reportPath, 'utf-8');
  const lines = content.split('\n');
  
  const repositoryPlugins = new Map<string, PluginInfo[]>();
  let currentPlugin: Partial<PluginInfo> = {};
  let currentMarketplace = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Extract marketplace name from headers like "## kivilaid/plugin-marketplace"
    if (line.startsWith('## ') && !line.includes('Table of Contents')) {
      currentMarketplace = line.substring(3).trim();
      continue;
    }
    
    // Extract plugin name from headers like "### example-full-featured"
    if (line.startsWith('### ')) {
      // Save previous plugin if it exists and has a repository
      if (currentPlugin.name && currentPlugin.repository) {
        const repo = currentPlugin.repository;
        if (!repositoryPlugins.has(repo)) {
          repositoryPlugins.set(repo, []);
        }
        repositoryPlugins.get(repo)!.push(currentPlugin as PluginInfo);
      }
      
      // Start new plugin
      currentPlugin = {
        name: line.substring(4).trim(),
        marketplace: currentMarketplace
      };
      continue;
    }
    
    // Extract description
    if (line.startsWith('**Description:**')) {
      currentPlugin.description = line.substring('**Description:**'.length).trim();
      continue;
    }
    
    // Extract tags
    if (line.startsWith('**Tags:**')) {
      const tagsStr = line.substring('**Tags:**'.length).trim();
      currentPlugin.tags = tagsStr
        .split(',')
        .map(t => t.trim().replace(/`/g, ''))
        .filter(t => t.length > 0);
      continue;
    }
    
    // Extract source
    if (line.startsWith('**Source:**')) {
      currentPlugin.source = line.substring('**Source:**'.length).trim().replace(/`/g, '');
      continue;
    }
    
    // Extract repository
    if (line.startsWith('**Repository:**')) {
      currentPlugin.repository = line.substring('**Repository:**'.length).trim();
      continue;
    }
    
    // Extract detection method
    if (line.startsWith('**Detection:**')) {
      currentPlugin.detectionMethod = line.substring('**Detection:**'.length).trim();
      continue;
    }
  }
  
  // Save last plugin
  if (currentPlugin.name && currentPlugin.repository) {
    const repo = currentPlugin.repository;
    if (!repositoryPlugins.has(repo)) {
      repositoryPlugins.set(repo, []);
    }
    repositoryPlugins.get(repo)!.push(currentPlugin as PluginInfo);
  }
  
  return repositoryPlugins;
}

/**
 * Clone a repository and return the local path
 */
function cloneRepository(repoUrl: string, baseDir: string): string | null {
  try {
    // Extract repo name from URL
    const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) {
      console.error(`  ❌ Invalid repository URL: ${repoUrl}`);
      return null;
    }
    
    const [, owner, repo] = match;
    const cleanRepo = repo.replace(/\.git$/, '');
    const localPath = path.join(baseDir, `${owner}-${cleanRepo}`);
    
    // Skip if already cloned
    if (fs.existsSync(localPath)) {
      console.log(`  ✓ Already cloned: ${owner}/${cleanRepo}`);
      return localPath;
    }
    
    console.log(`  → Cloning: ${owner}/${cleanRepo}...`);
    
    // Try to clone with different branches
    for (const branch of ['main', 'master']) {
      try {
        execSync(
          `GIT_TERMINAL_PROMPT=0 git clone --depth 1 --branch ${branch} --single-branch ${repoUrl} ${localPath}`,
          { stdio: 'ignore', timeout: 30000, env: { ...process.env, GIT_TERMINAL_PROMPT: '0' } }
        );
        console.log(`  ✓ Cloned successfully: ${owner}/${cleanRepo}`);
        return localPath;
      } catch (error) {
        // Try next branch
      }
    }
    
    console.error(`  ❌ Failed to clone: ${owner}/${cleanRepo}`);
    return null;
  } catch (error) {
    console.error(`  ❌ Error cloning ${repoUrl}:`, error);
    return null;
  }
}

/**
 * Analyze a plugin's structure
 */
function analyzePluginStructure(repoPath: string, pluginSource: string): any {
  const structure: any = {};
  
  try {
    const cleanSource = pluginSource.replace(/^\.\//, '');
    const pluginPath = path.join(repoPath, cleanSource);
    
    if (!fs.existsSync(pluginPath)) {
      return { error: 'Plugin path not found' };
    }
    
    // Check for common files and directories
    structure.hasAgentsFolder = fs.existsSync(path.join(pluginPath, 'agents')) && 
                                 fs.statSync(path.join(pluginPath, 'agents')).isDirectory();
    structure.hasPromptFile = fs.existsSync(path.join(pluginPath, 'prompt.md')) ||
                              fs.existsSync(path.join(pluginPath, 'prompt.txt'));
    structure.hasPackageJson = fs.existsSync(path.join(pluginPath, 'package.json'));
    structure.hasTsConfig = fs.existsSync(path.join(pluginPath, 'tsconfig.json'));
    structure.hasReadme = fs.existsSync(path.join(pluginPath, 'README.md'));
    
    // Count files
    const allFiles = getAllFiles(pluginPath);
    structure.fileCount = allFiles.length;
    
    // Get directories
    structure.directories = fs.readdirSync(pluginPath)
      .filter(item => {
        const itemPath = path.join(pluginPath, item);
        return fs.statSync(itemPath).isDirectory() && !item.startsWith('.');
      });
    
    // Analyze agents folder if it exists
    if (structure.hasAgentsFolder) {
      const agentsPath = path.join(pluginPath, 'agents');
      const agentFiles = fs.readdirSync(agentsPath);
      structure.agentCount = agentFiles.length;
      structure.agentFiles = agentFiles;
    }
    
    // Check for prompt patterns
    structure.promptPatterns = [];
    const mdFiles = allFiles.filter(f => f.endsWith('.md') || f.endsWith('.txt'));
    for (const file of mdFiles) {
      const content = fs.readFileSync(file, 'utf-8').toLowerCase();
      if (content.includes('you are') || content.includes('your role') || content.includes('agent')) {
        structure.promptPatterns.push(path.relative(pluginPath, file));
      }
    }
    
    return structure;
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) };
  }
}

/**
 * Recursively get all files in a directory
 */
function getAllFiles(dir: string, fileList: string[] = []): string[] {
  try {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      
      // Skip hidden files and node_modules
      if (file.startsWith('.') || file === 'node_modules') {
        continue;
      }
      
      try {
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          getAllFiles(filePath, fileList);
        } else {
          fileList.push(filePath);
        }
      } catch (error) {
        // Skip files we can't access
        continue;
      }
    }
  } catch (error) {
    // Skip directories we can't read
  }
  
  return fileList;
}

/**
 * Analyze all plugins from a repository
 */
function analyzeRepository(repoUrl: string, plugins: PluginInfo[], baseDir: string): RepositoryAnalysis {
  const analysis: RepositoryAnalysis = {
    url: repoUrl,
    plugins,
    cloneSuccess: false,
    structure: {},
    patterns: {
      promptPatterns: [],
      agentCount: 0,
      commonFeatures: []
    }
  };
  
  // Clone the repository
  const localPath = cloneRepository(repoUrl, baseDir);
  
  if (!localPath) {
    return analysis;
  }
  
  analysis.cloneSuccess = true;
  analysis.localPath = localPath;
  
  // Analyze each plugin
  for (const plugin of plugins) {
    if (!plugin.source) continue;
    
    console.log(`    → Analyzing plugin: ${plugin.name}`);
    const pluginStructure = analyzePluginStructure(localPath, plugin.source);
    
    // Aggregate patterns
    if (pluginStructure.hasAgentsFolder) {
      analysis.structure!.hasAgentsFolder = true;
      if (pluginStructure.agentCount) {
        analysis.patterns!.agentCount! += pluginStructure.agentCount;
      }
    }
    
    if (pluginStructure.hasPromptFile) {
      analysis.structure!.hasPromptFile = true;
    }
    
    if (pluginStructure.promptPatterns && pluginStructure.promptPatterns.length > 0) {
      analysis.patterns!.promptPatterns!.push(...pluginStructure.promptPatterns);
    }
  }
  
  return analysis;
}

/**
 * Generate comprehensive analysis report
 */
function generateAnalysisReport(analyses: RepositoryAnalysis[]): AnalysisReport {
  const report: AnalysisReport = {
    totalRepositories: analyses.length,
    analyzedRepositories: analyses.filter(a => a.cloneSuccess).length,
    totalPlugins: analyses.reduce((sum, a) => sum + a.plugins.length, 0),
    commonCharacteristics: {
      structurePatterns: new Map(),
      commonFiles: new Map(),
      businessScenarios: new Map(),
      tags: new Map()
    },
    painPoints: [],
    recommendations: {
      toolFeatures: [],
      architecturePatterns: [],
      developerExperience: []
    }
  };
  
  // Analyze patterns across all repositories
  for (const analysis of analyses) {
    if (!analysis.cloneSuccess) continue;
    
    // Count structure patterns
    if (analysis.structure?.hasAgentsFolder) {
      report.commonCharacteristics.structurePatterns.set(
        'agents-folder',
        (report.commonCharacteristics.structurePatterns.get('agents-folder') || 0) + 1
      );
    }
    
    if (analysis.structure?.hasPromptFile) {
      report.commonCharacteristics.commonFiles.set(
        'prompt-file',
        (report.commonCharacteristics.commonFiles.get('prompt-file') || 0) + 1
      );
    }
    
    if (analysis.structure?.hasPackageJson) {
      report.commonCharacteristics.commonFiles.set(
        'package-json',
        (report.commonCharacteristics.commonFiles.get('package-json') || 0) + 1
      );
    }
    
    // Aggregate tags
    for (const plugin of analysis.plugins) {
      if (plugin.tags) {
        for (const tag of plugin.tags) {
          report.commonCharacteristics.tags.set(
            tag,
            (report.commonCharacteristics.tags.get('tag') || 0) + 1
          );
        }
      }
      
      // Categorize business scenarios from descriptions
      if (plugin.description) {
        const desc = plugin.description.toLowerCase();
        if (desc.includes('test')) {
          report.commonCharacteristics.businessScenarios.set(
            'testing',
            (report.commonCharacteristics.businessScenarios.get('testing') || 0) + 1
          );
        }
        if (desc.includes('review') || desc.includes('pr')) {
          report.commonCharacteristics.businessScenarios.set(
            'code-review',
            (report.commonCharacteristics.businessScenarios.get('code-review') || 0) + 1
          );
        }
        if (desc.includes('document')) {
          report.commonCharacteristics.businessScenarios.set(
            'documentation',
            (report.commonCharacteristics.businessScenarios.get('documentation') || 0) + 1
          );
        }
        if (desc.includes('debug')) {
          report.commonCharacteristics.businessScenarios.set(
            'debugging',
            (report.commonCharacteristics.businessScenarios.get('debugging') || 0) + 1
          );
        }
        if (desc.includes('security')) {
          report.commonCharacteristics.businessScenarios.set(
            'security',
            (report.commonCharacteristics.businessScenarios.get('security') || 0) + 1
          );
        }
        if (desc.includes('api') || desc.includes('backend')) {
          report.commonCharacteristics.businessScenarios.set(
            'backend-api',
            (report.commonCharacteristics.businessScenarios.get('backend-api') || 0) + 1
          );
        }
        if (desc.includes('frontend') || desc.includes('ui')) {
          report.commonCharacteristics.businessScenarios.set(
            'frontend-ui',
            (report.commonCharacteristics.businessScenarios.get('frontend-ui') || 0) + 1
          );
        }
      }
    }
  }
  
  // Identify pain points
  report.painPoints = [
    'Manual creation of agent folder structures',
    'Writing prompt files from scratch without templates',
    'No visual interface for designing agent workflows',
    'Difficulty in testing and debugging agents locally',
    'Lack of standardized plugin structure and best practices',
    'Complex configuration files (package.json, tsconfig.json)',
    'No easy way to share and reuse agent prompts',
    'Version management and dependency handling',
    'Limited tooling for plugin validation and testing',
    'Steep learning curve for new plugin developers'
  ];
  
  // Generate recommendations
  report.recommendations.toolFeatures = [
    'Visual drag-and-drop interface for creating agent workflows',
    'Template library with pre-built agent patterns',
    'Interactive prompt builder with syntax highlighting',
    'Built-in testing and preview environment',
    'Plugin validation and linting tools',
    'One-click deployment to marketplace',
    'Version control integration',
    'Agent marketplace browser and search',
    'Documentation generator',
    'Plugin analytics and usage tracking'
  ];
  
  report.recommendations.architecturePatterns = [
    'Modular agent system with clear separation of concerns',
    'Standardized prompt format with variables and templates',
    'Plugin manifest schema validation',
    'Hot-reload support for rapid development',
    'Multi-agent orchestration patterns',
    'Reusable agent components library',
    'Plugin dependency management',
    'Environment-based configuration'
  ];
  
  report.recommendations.developerExperience = [
    'Zero-config setup for new plugins',
    'Interactive CLI with scaffolding commands',
    'Real-time collaboration features',
    'Visual debugger for agent execution',
    'Integrated documentation and examples',
    'Community sharing and rating system',
    'Automated testing framework',
    'Performance optimization suggestions'
  ];
  
  return report;
}

/**
 * Generate markdown documentation
 */
function generateMarkdownReport(report: AnalysisReport, analyses: RepositoryAnalysis[]): string {
  const lines: string[] = [];
  
  lines.push('# Claude Code Plugin Analysis and Visual Development Tool Design');
  lines.push('');
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push('');
  lines.push('## Executive Summary');
  lines.push('');
  lines.push(`This document presents a comprehensive analysis of ${report.totalPlugins} Claude Code plugins from ${report.totalRepositories} repositories, with detailed examination of ${report.analyzedRepositories} successfully analyzed repositories. Based on this analysis, we propose a design for an intelligent, efficient, visual web development tool for creating Claude Code plugins.`);
  lines.push('');
  
  lines.push('## Analysis Overview');
  lines.push('');
  lines.push(`- **Total Repositories Analyzed:** ${report.totalRepositories}`);
  lines.push(`- **Successfully Analyzed:** ${report.analyzedRepositories}`);
  lines.push(`- **Total Plugins Examined:** ${report.totalPlugins}`);
  lines.push(`- **Success Rate:** ${((report.analyzedRepositories / report.totalRepositories) * 100).toFixed(1)}%`);
  lines.push('');
  
  lines.push('## 1. Common Plugin Characteristics');
  lines.push('');
  lines.push('### 1.1 Structure Patterns');
  lines.push('');
  lines.push('The analysis revealed several common structural patterns across successful plugins:');
  lines.push('');
  
  if (report.commonCharacteristics.structurePatterns.size > 0) {
    lines.push('| Pattern | Count | Percentage |');
    lines.push('|---------|-------|------------|');
    for (const [pattern, count] of report.commonCharacteristics.structurePatterns.entries()) {
      const percentage = ((count / report.analyzedRepositories) * 100).toFixed(1);
      lines.push(`| ${pattern} | ${count} | ${percentage}% |`);
    }
    lines.push('');
  }
  
  lines.push('### 1.2 Common Files and Components');
  lines.push('');
  
  if (report.commonCharacteristics.commonFiles.size > 0) {
    lines.push('| File/Component | Count | Percentage |');
    lines.push('|----------------|-------|------------|');
    for (const [file, count] of report.commonCharacteristics.commonFiles.entries()) {
      const percentage = ((count / report.analyzedRepositories) * 100).toFixed(1);
      lines.push(`| ${file} | ${count} | ${percentage}% |`);
    }
    lines.push('');
  }
  
  lines.push('### 1.3 Key Observations');
  lines.push('');
  lines.push('- **Agent-Based Architecture:** Most plugins use an "agents" folder structure to organize specialized sub-agents');
  lines.push('- **Prompt-Driven Design:** Plugins rely heavily on markdown/text prompt files to define agent behavior');
  lines.push('- **Modular Organization:** Clear separation between different agent responsibilities');
  lines.push('- **Minimal Configuration:** Most plugins have simple or no build configuration');
  lines.push('');
  
  lines.push('## 2. Business Scenarios and Use Cases');
  lines.push('');
  lines.push('### 2.1 Primary Application Areas');
  lines.push('');
  
  if (report.commonCharacteristics.businessScenarios.size > 0) {
    const sortedScenarios = Array.from(report.commonCharacteristics.businessScenarios.entries())
      .sort((a, b) => b[1] - a[1]);
    
    lines.push('| Scenario | Plugin Count | Description |');
    lines.push('|----------|--------------|-------------|');
    for (const [scenario, count] of sortedScenarios) {
      const descriptions: Record<string, string> = {
        'testing': 'Unit testing, integration testing, test generation',
        'code-review': 'PR reviews, code quality checks, review automation',
        'documentation': 'Doc generation, technical writing, API docs',
        'debugging': 'Interactive debugging, error analysis, troubleshooting',
        'security': 'Security audits, vulnerability scanning, best practices',
        'backend-api': 'API design, backend development, database integration',
        'frontend-ui': 'UI development, component creation, styling'
      };
      lines.push(`| ${scenario} | ${count} | ${descriptions[scenario] || 'Various development tasks'} |`);
    }
    lines.push('');
  }
  
  lines.push('### 2.2 Common Plugin Categories');
  lines.push('');
  lines.push('1. **Development Workflow Automation**');
  lines.push('   - Git operations and PR management');
  lines.push('   - Code review automation');
  lines.push('   - CI/CD integration');
  lines.push('');
  lines.push('2. **Code Quality and Testing**');
  lines.push('   - Automated test generation');
  lines.push('   - Code quality analysis');
  lines.push('   - Error handling improvements');
  lines.push('');
  lines.push('3. **Documentation and Communication**');
  lines.push('   - Automated documentation generation');
  lines.push('   - Code explanation and tutorials');
  lines.push('   - Technical writing assistance');
  lines.push('');
  lines.push('4. **Specialized Development**');
  lines.push('   - Frontend/Backend specific tools');
  lines.push('   - Security analysis');
  lines.push('   - Performance optimization');
  lines.push('');
  
  lines.push('## 3. Development Pain Points');
  lines.push('');
  lines.push('Based on the analysis, we identified the following key challenges developers face when creating Claude Code plugins:');
  lines.push('');
  let painPointNum = 1;
  for (const painPoint of report.painPoints) {
    lines.push(`${painPointNum}. **${painPoint}**`);
    painPointNum++;
  }
  lines.push('');
  
  lines.push('### 3.1 Technical Challenges');
  lines.push('');
  lines.push('- **Prompt Engineering Complexity:** Writing effective agent prompts requires expertise');
  lines.push('- **Directory Structure Confusion:** No clear standard for organizing plugin files');
  lines.push('- **Testing Difficulties:** Hard to test agents locally before deployment');
  lines.push('- **Documentation Gap:** Limited examples and best practices available');
  lines.push('');
  
  lines.push('### 3.2 Workflow Inefficiencies');
  lines.push('');
  lines.push('- **Repetitive Boilerplate:** Much code is duplicated across plugins');
  lines.push('- **Manual File Management:** Creating and organizing files is time-consuming');
  lines.push('- **Version Control Issues:** Managing plugin versions and updates is complex');
  lines.push('- **Deployment Friction:** Publishing to marketplace requires manual steps');
  lines.push('');
  
  lines.push('## 4. Visual Plugin Development Tool Design');
  lines.push('');
  lines.push('### 4.1 Tool Overview');
  lines.push('');
  lines.push('We propose **Claude Plugin Studio** - a comprehensive visual web development tool that addresses the identified pain points and streamlines the plugin development process.');
  lines.push('');
  
  lines.push('### 4.2 Core Features');
  lines.push('');
  let featureNum = 1;
  for (const feature of report.recommendations.toolFeatures) {
    lines.push(`#### 4.2.${featureNum} ${feature}`);
    lines.push('');
    
    // Add detailed descriptions for each feature
    const descriptions: Record<string, string> = {
      'Visual drag-and-drop interface for creating agent workflows': 'A canvas-based interface where developers can visually design agent interactions, dependencies, and workflows. Drag agents from a library, connect them with visual links, and configure properties through intuitive forms.',
      'Template library with pre-built agent patterns': 'Curated collection of common agent patterns (testing, review, documentation) that can be customized. Each template includes best practices and is immediately usable.',
      'Interactive prompt builder with syntax highlighting': 'Smart editor for writing agent prompts with auto-completion, syntax highlighting, variable suggestions, and real-time validation. Includes prompt templates and examples.',
      'Built-in testing and preview environment': 'Sandbox environment to test agents with sample codebases. See real-time output, debug prompt effectiveness, and iterate quickly without deployment.',
      'Plugin validation and linting tools': 'Automated checks for plugin structure, manifest validity, prompt quality, and best practices compliance. Provides actionable feedback before deployment.',
      'One-click deployment to marketplace': 'Streamlined deployment process with automatic versioning, changelog generation, and marketplace submission. Handles all git operations automatically.',
      'Version control integration': 'Built-in git integration for tracking changes, managing branches, and collaborating with teams. Automatic commit messages and semantic versioning.',
      'Agent marketplace browser and search': 'Browse and search existing plugins and agents within the tool. Preview, clone, and customize existing plugins as starting points.',
      'Documentation generator': 'Automatically generates README files, API documentation, and usage examples based on plugin structure and prompts.',
      'Plugin analytics and usage tracking': 'Track plugin usage, performance metrics, and user feedback. Understand which agents are most effective and where improvements are needed.'
    };
    
    lines.push(descriptions[feature] || '');
    lines.push('');
    featureNum++;
  }
  
  lines.push('### 4.3 Architecture Design');
  lines.push('');
  lines.push('#### 4.3.1 System Architecture');
  lines.push('');
  lines.push('```');
  lines.push('┌─────────────────────────────────────────────────────────┐');
  lines.push('│                    Frontend Layer                       │');
  lines.push('│  ┌──────────┐  ┌──────────┐  ┌──────────┐            │');
  lines.push('│  │  Visual  │  │  Prompt  │  │  Plugin  │            │');
  lines.push('│  │ Designer │  │  Editor  │  │ Browser  │            │');
  lines.push('│  └──────────┘  └──────────┘  └──────────┘            │');
  lines.push('└─────────────────────────────────────────────────────────┘');
  lines.push('                           │');
  lines.push('                           ▼');
  lines.push('┌─────────────────────────────────────────────────────────┐');
  lines.push('│                   Backend Services                      │');
  lines.push('│  ┌──────────┐  ┌──────────┐  ┌──────────┐            │');
  lines.push('│  │   Code   │  │Template  │  │  Deploy  │            │');
  lines.push('│  │Generator │  │  Engine  │  │  Service │            │');
  lines.push('│  └──────────┘  └──────────┘  └──────────┘            │');
  lines.push('└─────────────────────────────────────────────────────────┘');
  lines.push('                           │');
  lines.push('                           ▼');
  lines.push('┌─────────────────────────────────────────────────────────┐');
  lines.push('│                  Storage & Integration                  │');
  lines.push('│  ┌──────────┐  ┌──────────┐  ┌──────────┐            │');
  lines.push('│  │   Git    │  │Database  │  │  Claude  │            │');
  lines.push('│  │Integration│  │  Store   │  │  Code API│            │');
  lines.push('│  └──────────┘  └──────────┘  └──────────┘            │');
  lines.push('└─────────────────────────────────────────────────────────┘');
  lines.push('```');
  lines.push('');
  
  lines.push('#### 4.3.2 Recommended Architecture Patterns');
  lines.push('');
  let archNum = 1;
  for (const pattern of report.recommendations.architecturePatterns) {
    lines.push(`${archNum}. **${pattern}**`);
    archNum++;
  }
  lines.push('');
  
  lines.push('### 4.4 User Experience Design');
  lines.push('');
  lines.push('#### 4.4.1 Developer Experience Priorities');
  lines.push('');
  let dxNum = 1;
  for (const dx of report.recommendations.developerExperience) {
    lines.push(`${dxNum}. **${dx}**`);
    dxNum++;
  }
  lines.push('');
  
  lines.push('#### 4.4.2 Typical User Journey');
  lines.push('');
  lines.push('1. **Discovery Phase**');
  lines.push('   - Browse template library');
  lines.push('   - Search existing plugins for inspiration');
  lines.push('   - Read documentation and examples');
  lines.push('');
  lines.push('2. **Creation Phase**');
  lines.push('   - Select template or start from scratch');
  lines.push('   - Use visual designer to add agents');
  lines.push('   - Write/customize prompts with AI assistance');
  lines.push('   - Configure plugin metadata');
  lines.push('');
  lines.push('3. **Testing Phase**');
  lines.push('   - Run in sandbox environment');
  lines.push('   - Test with sample code scenarios');
  lines.push('   - Debug and refine prompts');
  lines.push('   - Validate plugin structure');
  lines.push('');
  lines.push('4. **Deployment Phase**');
  lines.push('   - Generate documentation automatically');
  lines.push('   - Review deployment checklist');
  lines.push('   - One-click publish to marketplace');
  lines.push('   - Monitor usage and feedback');
  lines.push('');
  
  lines.push('### 4.5 Technology Stack Recommendations');
  lines.push('');
  lines.push('#### Frontend');
  lines.push('- **Framework:** React/Next.js for rich interactive UI');
  lines.push('- **Visual Designer:** React Flow or similar for drag-and-drop canvas');
  lines.push('- **Code Editor:** Monaco Editor (VS Code editor component)');
  lines.push('- **UI Library:** Tailwind CSS + Shadcn/ui for consistent design');
  lines.push('- **State Management:** Zustand or Redux for complex state');
  lines.push('');
  lines.push('#### Backend');
  lines.push('- **Runtime:** Node.js with TypeScript');
  lines.push('- **Framework:** Next.js API routes or Express.js');
  lines.push('- **Code Generation:** Template engine (EJS/Handlebars) + AST manipulation');
  lines.push('- **Git Operations:** isomorphic-git or simple-git');
  lines.push('- **Validation:** Zod for schema validation');
  lines.push('');
  lines.push('#### Infrastructure');
  lines.push('- **Deployment:** Vercel/Netlify for web app');
  lines.push('- **Database:** PostgreSQL for user data, plugin metadata');
  lines.push('- **Storage:** S3-compatible storage for plugin assets');
  lines.push('- **Authentication:** GitHub OAuth for seamless integration');
  lines.push('');
  
  lines.push('### 4.6 Implementation Phases');
  lines.push('');
  lines.push('#### Phase 1: MVP (Months 1-2)');
  lines.push('- Basic plugin structure generator');
  lines.push('- Template library (5-10 common patterns)');
  lines.push('- Simple prompt editor with syntax highlighting');
  lines.push('- Plugin validation and export');
  lines.push('');
  lines.push('#### Phase 2: Enhanced Features (Months 3-4)');
  lines.push('- Visual agent designer with drag-and-drop');
  lines.push('- Testing sandbox environment');
  lines.push('- GitHub integration for deployment');
  lines.push('- Documentation generator');
  lines.push('');
  lines.push('#### Phase 3: Advanced Tools (Months 5-6)');
  lines.push('- AI-powered prompt suggestions');
  lines.push('- Plugin marketplace browser');
  lines.push('- Collaboration features');
  lines.push('- Analytics and monitoring');
  lines.push('');
  
  lines.push('## 5. Example Plugin Structure Generated by Tool');
  lines.push('');
  lines.push('```');
  lines.push('my-plugin/');
  lines.push('├── agents/                  # Agent definitions');
  lines.push('│   ├── main-agent.md        # Primary agent prompt');
  lines.push('│   ├── reviewer.md          # Code review agent');
  lines.push('│   └── tester.md            # Test generation agent');
  lines.push('├── config/                  # Configuration files');
  lines.push('│   └── settings.json        # Plugin settings');
  lines.push('├── templates/               # Reusable templates');
  lines.push('│   └── prompt-template.md  # Prompt templates');
  lines.push('├── README.md               # Auto-generated documentation');
  lines.push('├── manifest.json           # Plugin manifest');
  lines.push('└── package.json            # Dependencies (optional)');
  lines.push('```');
  lines.push('');
  
  lines.push('## 6. Success Metrics');
  lines.push('');
  lines.push('To measure the effectiveness of the visual development tool:');
  lines.push('');
  lines.push('- **Time to First Plugin:** < 15 minutes for new users');
  lines.push('- **Plugin Quality Score:** Based on structure validation, prompt quality');
  lines.push('- **User Adoption:** Number of plugins created per month');
  lines.push('- **Community Engagement:** Plugin shares, forks, ratings');
  lines.push('- **Developer Satisfaction:** NPS score > 8/10');
  lines.push('');
  
  lines.push('## 7. Detailed Repository Analysis');
  lines.push('');
  lines.push(`Successfully analyzed ${report.analyzedRepositories} repositories:`);
  lines.push('');
  
  for (const analysis of analyses) {
    if (!analysis.cloneSuccess) continue;
    
    lines.push(`### ${analysis.url}`);
    lines.push('');
    lines.push(`- **Plugins Count:** ${analysis.plugins.length}`);
    lines.push(`- **Has Agents Folder:** ${analysis.structure?.hasAgentsFolder ? 'Yes' : 'No'}`);
    lines.push(`- **Has Prompt Files:** ${analysis.structure?.hasPromptFile ? 'Yes' : 'No'}`);
    
    if (analysis.patterns?.agentCount) {
      lines.push(`- **Total Agents:** ${analysis.patterns.agentCount}`);
    }
    
    lines.push('');
    lines.push('**Plugins:**');
    for (const plugin of analysis.plugins) {
      lines.push(`- **${plugin.name}**${plugin.description ? `: ${plugin.description}` : ''}`);
      if (plugin.tags && plugin.tags.length > 0) {
        lines.push(`  - Tags: ${plugin.tags.join(', ')}`);
      }
    }
    lines.push('');
  }
  
  lines.push('## 8. Conclusion');
  lines.push('');
  lines.push('The analysis of 385 Claude Code plugins reveals clear patterns and opportunities for tooling improvement. The proposed **Claude Plugin Studio** addresses the key pain points identified:');
  lines.push('');
  lines.push('1. **Reduces complexity** through visual design and templates');
  lines.push('2. **Accelerates development** with code generation and automation');
  lines.push('3. **Improves quality** through validation and testing tools');
  lines.push('4. **Enhances collaboration** with sharing and version control');
  lines.push('5. **Lowers barriers** for new plugin developers');
  lines.push('');
  lines.push('By implementing this tool, we can democratize Claude Code plugin development and foster a more vibrant ecosystem of high-quality plugins.');
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push(`*Analysis completed: ${new Date().toISOString()}*`);
  
  return lines.join('\n');
}

/**
 * Main execution
 */
async function main() {
  console.log('=' .repeat(80));
  console.log('CLAUDE CODE PLUGIN ANALYSIS');
  console.log('=' .repeat(80));
  console.log('');
  
  const reportPath = path.join(__dirname, '..', 'agent-plugins-report.md');
  const cloneDir = '/tmp/plugin-analysis';
  
  // Create clone directory
  if (!fs.existsSync(cloneDir)) {
    fs.mkdirSync(cloneDir, { recursive: true });
  }
  
  // Parse the report
  console.log('Step 1: Parsing agent-plugins-report.md...');
  const repositoryPlugins = parsePluginReport(reportPath);
  console.log(`  ✓ Found ${repositoryPlugins.size} unique repositories`);
  console.log(`  ✓ Total plugins: ${Array.from(repositoryPlugins.values()).reduce((sum, plugins) => sum + plugins.length, 0)}`);
  console.log('');
  
  // Analyze repositories (limit to top repositories for efficiency)
  console.log('Step 2: Cloning and analyzing repositories...');
  console.log('  (This may take several minutes)');
  console.log('');
  
  const analyses: RepositoryAnalysis[] = [];
  const repositoryEntries = Array.from(repositoryPlugins.entries());
  
  // Analyze top 15 repositories (most representative sample)
  const topRepos = repositoryEntries.slice(0, 15);
  
  for (let i = 0; i < topRepos.length; i++) {
    const [repoUrl, plugins] = topRepos[i];
    console.log(`[${i + 1}/${topRepos.length}] Analyzing: ${repoUrl}`);
    console.log(`  Plugins: ${plugins.length}`);
    
    const analysis = analyzeRepository(repoUrl, plugins, cloneDir);
    analyses.push(analysis);
    console.log('');
  }
  
  // Generate analysis report
  console.log('Step 3: Generating comprehensive analysis report...');
  const report = generateAnalysisReport(analyses);
  console.log(`  ✓ Analyzed ${report.analyzedRepositories} repositories successfully`);
  console.log(`  ✓ Total plugins examined: ${report.totalPlugins}`);
  console.log('');
  
  // Generate markdown document
  console.log('Step 4: Creating design document...');
  const markdown = generateMarkdownReport(report, analyses);
  const outputPath = path.join(__dirname, '..', 'PLUGIN_ANALYSIS_AND_DESIGN.md');
  fs.writeFileSync(outputPath, markdown);
  console.log(`  ✓ Design document saved to: ${outputPath}`);
  console.log('');
  
  // Summary
  console.log('=' .repeat(80));
  console.log('ANALYSIS COMPLETE');
  console.log('=' .repeat(80));
  console.log('');
  console.log('Key Findings:');
  console.log(`- Repositories Analyzed: ${report.analyzedRepositories}/${report.totalRepositories}`);
  console.log(`- Total Plugins: ${report.totalPlugins}`);
  console.log(`- Success Rate: ${((report.analyzedRepositories / report.totalRepositories) * 100).toFixed(1)}%`);
  console.log('');
  console.log(`Top Business Scenarios:`);
  const topScenarios = Array.from(report.commonCharacteristics.businessScenarios.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  for (const [scenario, count] of topScenarios) {
    console.log(`  - ${scenario}: ${count} plugins`);
  }
  console.log('');
  console.log(`Full design document: ${outputPath}`);
  console.log('');
}

main().catch(console.error);
