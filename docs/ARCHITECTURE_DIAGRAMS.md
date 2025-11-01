# Claude Code Plugin Marketplace Hub - Architecture Diagrams

## 1. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        End Users / Developers                        │
│                   (访问网站 & 使用 Claude Code CLI)                   │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     Next.js Web Application                          │
│                  (claudecodemarketplace.com)                         │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐│
│  │  Frontend (Client Components)                                   ││
│  │  - HomeClient.tsx: 市场列表和搜索                                ││
│  │  - MarketplaceCard.tsx: 市场卡片展示                             ││
│  │  - PluginCard.tsx: 插件卡片展示                                  ││
│  │  - SearchBar.tsx: 搜索和过滤                                     ││
│  └────────────────────────────────────────────────────────────────┘│
│                                 │                                     │
│                                 ▼                                     │
│  ┌────────────────────────────────────────────────────────────────┐│
│  │  Backend (Server Actions & API Routes)                          ││
│  │  - actions.ts: 服务器操作                                        ││
│  │  - lib/github.ts: GitHub 数据获取                                ││
│  └────────────────────────────────────────────────────────────────┘│
│                                 │                                     │
│                                 ▼                                     │
│  ┌────────────────────────────────────────────────────────────────┐│
│  │  Data Layer                                                      ││
│  │  - .claude-plugin/marketplaces.json                             ││
│  │  - ISR Cache (Next.js)                                          ││
│  └────────────────────────────────────────────────────────────────┘│
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                    ▼                         ▼
    ┌──────────────────────────┐  ┌──────────────────────────┐
    │   GitHub Raw Content     │  │    GitHub REST API       │
    │  (Raw Manifests)         │  │  (Repo Metadata)         │
    │                          │  │                          │
    │  raw.githubusercontent   │  │  api.github.com          │
    │  .com/{user}/{repo}/     │  │  /repos/{user}/{repo}    │
    │  {branch}/.claude-plugin/│  │                          │
    │  marketplace.json        │  │  Returns:                │
    │                          │  │  - stars                 │
    │                          │  │  - last_updated          │
    └──────────┬───────────────┘  └────────┬─────────────────┘
               │                           │
               └───────────┬───────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │  Individual Marketplace Repositories  │
        │                                       │
        │  ┌─────────────────────────────────┐ │
        │  │  anthropics/claude-code         │ │
        │  │  - .claude-plugin/              │ │
        │  │    marketplace.json             │ │
        │  │  - plugins/                     │ │
        │  └─────────────────────────────────┘ │
        │                                       │
        │  ┌─────────────────────────────────┐ │
        │  │  wshobson/agents                │ │
        │  │  - .claude-plugin/              │ │
        │  │    marketplace.json             │ │
        │  │  - agents/                      │ │
        │  └─────────────────────────────────┘ │
        │                                       │
        │  ┌─────────────────────────────────┐ │
        │  │  ... 200+ more marketplaces     │ │
        │  └─────────────────────────────────┘ │
        └───────────────────────────────────────┘
```

## 2. Data Flow Diagram

### 2.1 Page Load Data Flow

```
用户访问首页
User visits homepage
       │
       ▼
┌──────────────────────┐
│   Next.js Server     │
│   (SSR/ISR)          │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ getMarketplacesData()│  (Server Action)
│ in actions.ts        │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────────────────┐
│ fetchMarketplaces()              │
│ in lib/github.ts                 │
│                                  │
│ 并行处理所有市场                   │
│ Process all marketplaces in      │
│ parallel using Promise.all()     │
└──────────┬───────────────────────┘
           │
           ├─────────────┬─────────────┬─────────────┐
           ▼             ▼             ▼             ▼
    ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
    │Market 1 │   │Market 2 │   │Market 3 │   │Market N │
    └────┬────┘   └────┬────┘   └────┬────┘   └────┬────┘
         │             │             │             │
         ▼             ▼             ▼             ▼
    对每个市场执行 fetchMarketplace()
    Execute fetchMarketplace() for each
         │
         ├──────────────┬──────────────┐
         ▼              ▼              ▼
    ┌─────────┐   ┌─────────┐   ┌─────────┐
    │ Fetch   │   │ Fetch   │   │ Parse & │
    │Manifest │   │ GitHub  │   │ Combine │
    │         │   │ Data    │   │ Data    │
    └────┬────┘   └────┬────┘   └────┬────┘
         │             │             │
         └─────────────┴─────────────┘
                       │
                       ▼
              ┌────────────────┐
              │ Return enriched│
              │ marketplace    │
              │ data array     │
              └────────┬───────┘
                       │
                       ▼
              ┌────────────────┐
              │ Render in      │
              │ HomeClient     │
              └────────────────┘
```

### 2.2 Search & Filter Data Flow

```
用户输入搜索
User enters search
       │
       ▼
┌──────────────────────┐
│ HomeClient State     │
│ - searchQuery        │
│ - selectedTags       │
│ - sortBy             │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────────────┐
│ useMemo Hook                 │
│ 客户端过滤和排序               │
│ Client-side filter & sort    │
└──────────┬───────────────────┘
           │
           ├────────────────────┬────────────────────┐
           │                    │                    │
           ▼                    ▼                    ▼
    ┌──────────┐        ┌──────────┐        ┌──────────┐
    │ Filter   │        │ Sort by  │        │ Search   │
    │ by tags  │        │ criteria │        │ plugins  │
    └─────┬────┘        └─────┬────┘        └─────┬────┘
          │                   │                   │
          └───────────────────┴───────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ Filtered Results │
                    │ - Marketplaces   │
                    │ - Plugins        │
                    └─────────┬────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ Re-render UI     │
                    └──────────────────┘
```

## 3. Component Hierarchy

```
App
│
├── layout.tsx (Root Layout)
│   │
│   ├── Header
│   │   ├── AnimatedHeader
│   │   ├── ThemeToggle
│   │   └── Submit Button
│   │
│   ├── Main Content
│   │   │
│   │   ├── page.tsx (Home Page - Server Component)
│   │   │   │
│   │   │   └── HomeClient (Client Component)
│   │   │       │
│   │   │       ├── SearchBar
│   │   │       │
│   │   │       ├── Filter Controls
│   │   │       │   ├── Tag Chips
│   │   │       │   └── Sort Dropdown
│   │   │       │
│   │   │       └── Marketplace Grid
│   │   │           └── MarketplaceCard (multiple)
│   │   │               ├── Card Header
│   │   │               │   ├── Name
│   │   │               │   ├── Owner
│   │   │               │   └── Verified Badge
│   │   │               │
│   │   │               ├── Description
│   │   │               │
│   │   │               ├── GitHub Stats
│   │   │               │   ├── Stars
│   │   │               │   └── Last Updated
│   │   │               │
│   │   │               ├── Tags
│   │   │               │
│   │   │               ├── Install Command Box
│   │   │               │
│   │   │               └── Action Buttons
│   │   │                   ├── View Plugins
│   │   │                   └── GitHub Link
│   │   │
│   │   └── marketplace/[id]/page.tsx (Detail Page)
│   │       │
│   │       └── MarketplaceDetailClient
│   │           │
│   │           ├── Marketplace Header
│   │           │
│   │           ├── Install Instructions
│   │           │   └── MarketplaceInstallBox
│   │           │
│   │           └── Plugin Grid
│   │               └── PluginCard (multiple)
│   │                   ├── Plugin Name
│   │                   ├── Description
│   │                   ├── Version
│   │                   ├── Author
│   │                   ├── Tags
│   │                   └── Install Command
│   │
│   └── Footer
│       ├── Description
│       └── Navigation Links
│
└── Metadata & SEO
    ├── StructuredData (JSON-LD)
    └── MarketplaceStructuredData
```

## 4. Caching Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                     Caching Layers                           │
└─────────────────────────────────────────────────────────────┘

Layer 1: Browser Cache
┌────────────────────────────────────────────┐
│ Static Assets                              │
│ - JS bundles                               │
│ - CSS files                                │
│ - Images                                   │
│ Cache: Browser default (vary by resource) │
└────────────────────────────────────────────┘
                    ↓
Layer 2: Next.js ISR (Incremental Static Regeneration)
┌────────────────────────────────────────────┐
│ Page Level Cache                           │
│ - /: 1 hour                                │
│ - /marketplace/[id]: 1 hour                │
│                                            │
│ export const revalidate = 3600;            │
└────────────────────────────────────────────┘
                    ↓
Layer 3: Data Fetching Cache
┌────────────────────────────────────────────┐
│ fetchMarketplaceManifest()                 │
│ - Cache: 1 hour (3600s)                    │
│ - next: { revalidate: 3600 }               │
│                                            │
│ fetchGitHubRepoData()                      │
│ - Cache: 24 hours (86400s)                 │
│ - next: { revalidate: 86400 }              │
└────────────────────────────────────────────┘
                    ↓
Layer 4: External APIs
┌────────────────────────────────────────────┐
│ raw.githubusercontent.com                  │
│ - No cache control from our side           │
│                                            │
│ api.github.com                             │
│ - Rate limit: 60/hour (unauthenticated)    │
│ - Rate limit: 5000/hour (authenticated)    │
└────────────────────────────────────────────┘

Cache Invalidation Strategy:
┌────────────────────────────────────────────┐
│ 1. On-demand revalidation (not used)       │
│ 2. Time-based revalidation (ISR)          │
│ 3. Manual cache clear (server restart)     │
└────────────────────────────────────────────┘
```

## 5. Security Model

```
┌─────────────────────────────────────────────────────────────┐
│                    Security Layers                           │
└─────────────────────────────────────────────────────────────┘

Input Validation
┌────────────────────────────────────────────┐
│ URL Validation                             │
│ - Must be HTTPS only                       │
│ - Must be valid URL format                 │
│ - GitHub domain check                      │
│                                            │
│ const validateUrl = (url) => {             │
│   const parsed = new URL(url);             │
│   if (parsed.protocol !== 'https:')        │
│     return null;                           │
│ }                                          │
└────────────────────────────────────────────┘
                    ↓
Content Security
┌────────────────────────────────────────────┐
│ External Links                             │
│ - rel="noopener noreferrer"                │
│ - target="_blank"                          │
│                                            │
│ XSS Prevention                             │
│ - React automatic escaping                 │
│ - No dangerouslySetInnerHTML               │
└────────────────────────────────────────────┘
                    ↓
Trust System
┌────────────────────────────────────────────┐
│ Verification Badge                         │
│ - Manual review process                    │
│ - Official sources only                    │
│ - verified: true in config                 │
│                                            │
│ Examples:                                  │
│ ✓ anthropics/claude-code                   │
│ ✓ docker/claude-plugins                    │
└────────────────────────────────────────────┘
                    ↓
Code Review
┌────────────────────────────────────────────┐
│ PR Review Process                          │
│ - Manual inspection of new marketplaces    │
│ - Check manifest URL validity              │
│ - Verify repository exists                 │
│ - Review marketplace description           │
└────────────────────────────────────────────┘
```

## 6. Marketplace Registration Flow

```
Developer Journey
═════════════════

Step 1: Create Repository
┌────────────────────────────────────────────┐
│ github.com/username/my-marketplace         │
│                                            │
│ 创建新的 GitHub 仓库                        │
│ Create new GitHub repository               │
└────────────────────────────────────────────┘
                    ↓
Step 2: Add Marketplace Manifest
┌────────────────────────────────────────────┐
│ .claude-plugin/marketplace.json            │
│                                            │
│ {                                          │
│   "name": "my-marketplace",                │
│   "owner": {...},                          │
│   "plugins": [...]                         │
│ }                                          │
└────────────────────────────────────────────┘
                    ↓
Step 3: Fork Hub Repository
┌────────────────────────────────────────────┐
│ Fork: joesaunderson/claude-code-marketplace│
│                                            │
│ 创建 Hub 仓库的 fork                        │
│ Create fork of Hub repository              │
└────────────────────────────────────────────┘
                    ↓
Step 4: Edit Marketplaces Config
┌────────────────────────────────────────────┐
│ .claude-plugin/marketplaces.json           │
│                                            │
│ Add entry:                                 │
│ {                                          │
│   "id": "my-marketplace",                  │
│   "name": "My Marketplace",                │
│   "repository": "github.com/.../...",      │
│   "manifestUrl": "raw.github...",          │
│   ...                                      │
│ }                                          │
└────────────────────────────────────────────┘
                    ↓
Step 5: Submit Pull Request
┌────────────────────────────────────────────┐
│ Create PR to main repository               │
│                                            │
│ Title: "Add [marketplace-name] marketplace"│
│ Description: Brief description             │
└────────────────────────────────────────────┘
                    ↓
Step 6: Review Process
┌────────────────────────────────────────────┐
│ Hub Maintainer Review                      │
│                                            │
│ ✓ Check manifest URL is accessible         │
│ ✓ Verify repository exists                 │
│ ✓ Review marketplace metadata              │
│ ✓ Check for spam/malicious content         │
└────────────────────────────────────────────┘
                    ↓
Step 7: Merge & Deploy
┌────────────────────────────────────────────┐
│ PR Merged to main branch                   │
│                                            │
│ Vercel Auto-Deploy                         │
│ ↓                                          │
│ Marketplace appears on website             │
│ within minutes                             │
└────────────────────────────────────────────┘
                    ↓
Step 8: Users Can Discover
┌────────────────────────────────────────────┐
│ Marketplace visible on Hub                 │
│                                            │
│ - Searchable                               │
│ - Filterable by tags                       │
│ - Sortable                                 │
│ - Installable via CLI                      │
└────────────────────────────────────────────┘
```

## 7. Plugin Installation Flow

```
User Journey
════════════

Step 1: Discover Marketplace
┌────────────────────────────────────────────┐
│ claudecodemarketplace.com                  │
│                                            │
│ Browse or search for marketplace           │
│ Click "View Plugins →"                     │
└────────────────────────────────────────────┘
                    ↓
Step 2: View Marketplace Details
┌────────────────────────────────────────────┐
│ /marketplace/anthropics-claude-code        │
│                                            │
│ See all plugins in marketplace             │
│ Copy install commands                      │
└────────────────────────────────────────────┘
                    ↓
Step 3: Install Marketplace
┌────────────────────────────────────────────┐
│ In Claude Code CLI:                        │
│                                            │
│ $ /plugin marketplace add anthropics/      │
│   claude-code                              │
│                                            │
│ Claude Code fetches and validates          │
│ marketplace from GitHub                    │
└────────────────────────────────────────────┘
                    ↓
Step 4: Browse Available Plugins
┌────────────────────────────────────────────┐
│ $ /plugin list                             │
│                                            │
│ Shows all plugins from installed           │
│ marketplaces                               │
└────────────────────────────────────────────┘
                    ↓
Step 5: Install Plugin
┌────────────────────────────────────────────┐
│ $ /plugin install {plugin-name}            │
│                                            │
│ Claude Code:                               │
│ 1. Resolves plugin source                  │
│ 2. Clones plugin code from GitHub          │
│ 3. Validates plugin structure              │
│ 4. Loads plugin                            │
└────────────────────────────────────────────┘
                    ↓
Step 6: Use Plugin
┌────────────────────────────────────────────┐
│ Plugin is now active                       │
│                                            │
│ - Slash commands available                 │
│ - Agents available                         │
│ - Hooks active                             │
│ - MCP servers running                      │
└────────────────────────────────────────────┘
```

## 8. Error Handling Flow

```
Error Scenarios
═══════════════

Scenario 1: Manifest Not Found (404)
┌────────────────────────────────────────────┐
│ fetchMarketplaceManifest()                 │
│ → 404 Response                             │
│                                            │
│ Return: {                                  │
│   data: null,                              │
│   error: "Marketplace file not found"      │
│ }                                          │
│                                            │
│ UI shows:                                  │
│ ⚠️ Setup incomplete: Marketplace file      │
│    not found                               │
└────────────────────────────────────────────┘

Scenario 2: Invalid JSON
┌────────────────────────────────────────────┐
│ JSON.parse() fails                         │
│                                            │
│ Catch error and return:                    │
│ {                                          │
│   data: null,                              │
│   error: "Invalid manifest format"         │
│ }                                          │
│                                            │
│ UI shows error badge                       │
└────────────────────────────────────────────┘

Scenario 3: Network Error
┌────────────────────────────────────────────┐
│ fetch() throws                             │
│                                            │
│ Catch and return:                          │
│ {                                          │
│   data: null,                              │
│   error: "Network error"                   │
│ }                                          │
│                                            │
│ Marketplace still shown with error         │
└────────────────────────────────────────────┘

Scenario 4: GitHub API Rate Limit
┌────────────────────────────────────────────┐
│ GitHub API returns 403                     │
│                                            │
│ Return null for GitHub data                │
│ Marketplace shows without stars/update     │
│                                            │
│ Solution: Add GITHUB_TOKEN env var         │
│ for 5000/hour rate limit                   │
└────────────────────────────────────────────┘

Graceful Degradation
┌────────────────────────────────────────────┐
│ ✓ Marketplace shown even with errors       │
│ ✓ Missing data handled gracefully          │
│ ✓ User can still view repo and info        │
│ ✓ Error messages guide marketplace owners  │
└────────────────────────────────────────────┘
```

## 9. Deployment Architecture

```
Development → Production Pipeline
═════════════════════════════════

Local Development
┌────────────────────────────────────────────┐
│ $ yarn dev                                 │
│                                            │
│ Next.js Dev Server                         │
│ - Hot reload                               │
│ - Fast refresh                             │
│ - Source maps                              │
└────────────────────────────────────────────┘
                    ↓
GitHub Repository
┌────────────────────────────────────────────┐
│ joesaunderson/claude-code-marketplace      │
│                                            │
│ Main Branch                                │
│ - Auto-deploy enabled                      │
│ - Protected branch                         │
└────────────────────────────────────────────┘
                    ↓
Vercel Platform
┌────────────────────────────────────────────┐
│ Production Deployment                      │
│                                            │
│ - Auto-deploy on push to main              │
│ - Preview deploys for PRs                  │
│ - Edge network CDN                         │
│ - Automatic HTTPS                          │
│ - ISR caching                              │
└────────────────────────────────────────────┘
                    ↓
Custom Domain
┌────────────────────────────────────────────┐
│ claudecodemarketplace.com                  │
│                                            │
│ - SSL certificate                          │
│ - Global CDN                               │
│ - DDoS protection                          │
└────────────────────────────────────────────┘
```

## Summary

这些架构图展示了 Claude Code Plugin Marketplace Hub 的完整技术架构：

These architecture diagrams showcase the complete technical architecture of Claude Code Plugin Marketplace Hub:

1. **系统架构** - System architecture with multiple layers
2. **数据流** - Data flow from user to external APIs
3. **组件层级** - React component hierarchy
4. **缓存策略** - Multi-layer caching strategy
5. **安全模型** - Security validation and trust system
6. **注册流程** - Marketplace registration workflow
7. **安装流程** - Plugin installation user journey
8. **错误处理** - Error handling and graceful degradation
9. **部署架构** - Development to production pipeline

每个图表都说明了系统的不同方面，帮助理解整个生态系统如何协同工作。

Each diagram illustrates different aspects of the system, helping to understand how the entire ecosystem works together.
