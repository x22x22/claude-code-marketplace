# Architecture Diagrams

## 架构图解 (Visual Architecture Guide)

This document provides visual representations of the Claude Code Marketplace Hub architecture using ASCII diagrams.

---

## 1. System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CLAUDE CODE MARKETPLACE HUB                       │
│                     (Decentralized Aggregator)                       │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                ┌───────────────────┼───────────────────┐
                │                   │                   │
                ▼                   ▼                   ▼
┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐
│  Marketplace A      │ │  Marketplace B      │ │  Marketplace N      │
│  (React Plugins)    │ │  (DevOps Tools)     │ │  (Custom Domain)    │
├─────────────────────┤ ├─────────────────────┤ ├─────────────────────┤
│ - Plugin A1         │ │ - Plugin B1         │ │ - Plugin N1         │
│ - Plugin A2         │ │ - Plugin B2         │ │ - Plugin N2         │
│ - Plugin A3         │ │ - Plugin B3         │ │ - Plugin N3         │
└─────────────────────┘ └─────────────────────┘ └─────────────────────┘
```

---

## 2. Three-Tier Data Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│ TIER 1: HUB CONFIGURATION                                           │
│ Location: .claude-plugin/marketplaces.json                          │
│                                                                      │
│ {                                                                    │
│   "marketplaces": [                                                 │
│     {                                                               │
│       "id": "react-marketplace",                                    │
│       "name": "React Plugins",                                      │
│       "manifestUrl": "https://raw.github.com/.../marketplace.json"  │
│     }                                                               │
│   ]                                                                 │
│ }                                                                   │
└──────────────────────────────┬──────────────────────────────────────┘
                               │ manifestUrl reference
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│ TIER 2: MARKETPLACE MANIFEST                                        │
│ Location: Each marketplace's .claude-plugin/marketplace.json        │
│                                                                      │
│ {                                                                    │
│   "name": "react-marketplace",                                      │
│   "plugins": [                                                      │
│     {                                                               │
│       "name": "react-component-gen",                                │
│       "source": "react-tools/component-gen",                        │
│       "description": "Generate React components"                    │
│     }                                                               │
│   ]                                                                 │
│ }                                                                   │
└──────────────────────────────┬──────────────────────────────────────┘
                               │ source reference
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│ TIER 3: PLUGIN SOURCE CODE                                          │
│ Location: Individual plugin repositories                            │
│                                                                      │
│ react-tools/component-gen/                                          │
│ ├── .claude-plugin/                                                 │
│ │   └── plugin.json                                                 │
│ ├── agents/                                                         │
│ ├── commands/                                                       │
│ └── README.md                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Data Flow: GitHub to Browser

```
┌────────────────────────────────────────────────────────────────────┐
│                      GITHUB REPOSITORIES                            │
└──────────────────────────┬─────────────────────────────────────────┘
                           │
                           │ Raw Content API
                           │ https://raw.githubusercontent.com/...
                           │
                           ▼
┌────────────────────────────────────────────────────────────────────┐
│                    DATA FETCHING LAYER                              │
│                     (lib/github.ts)                                 │
├────────────────────────────────────────────────────────────────────┤
│  Promise.all([                                                      │
│    fetchMarketplaceManifest(manifestUrl),                          │
│    fetchGitHubRepoData(repoUrl)                                    │
│  ])                                                                 │
└──────────────────────────┬─────────────────────────────────────────┘
                           │
                           │ Fetched data with metadata
                           │
                           ▼
┌────────────────────────────────────────────────────────────────────┐
│                   SERVER ACTIONS LAYER                              │
│                    (app/actions.ts)                                 │
├────────────────────────────────────────────────────────────────────┤
│  'use server'                                                       │
│                                                                     │
│  async function getMarketplacesData() {                            │
│    return fetchMarketplaces(hub.marketplaces);                     │
│  }                                                                  │
└──────────────────────────┬─────────────────────────────────────────┘
                           │
                           │ Server-side data preparation
                           │
                           ▼
┌────────────────────────────────────────────────────────────────────┐
│                  SERVER COMPONENT LAYER                             │
│                     (app/page.tsx)                                  │
├────────────────────────────────────────────────────────────────────┤
│  export default async function Home() {                            │
│    const marketplaces = await getMarketplacesData();               │
│    return <HomeClient marketplaces={marketplaces} />;             │
│  }                                                                  │
└──────────────────────────┬─────────────────────────────────────────┘
                           │
                           │ Props passed to client
                           │ (Static HTML + Hydration data)
                           │
                           ▼
┌────────────────────────────────────────────────────────────────────┐
│                  CLIENT COMPONENT LAYER                             │
│                  (app/HomeClient.tsx)                               │
├────────────────────────────────────────────────────────────────────┤
│  'use client'                                                       │
│                                                                     │
│  - useState for search & filters                                   │
│  - useMemo for real-time filtering                                 │
│  - Renders: MarketplaceCard, PluginCard                           │
└──────────────────────────┬─────────────────────────────────────────┘
                           │
                           │ Rendered React components
                           │ Interactive UI
                           │
                           ▼
┌────────────────────────────────────────────────────────────────────┐
│                       USER BROWSER                                  │
│                   (claudecodemarketplace.com)                       │
├────────────────────────────────────────────────────────────────────┤
│  - Browse marketplaces                                             │
│  - Search plugins                                                   │
│  - Filter by tags                                                   │
│  - Copy install commands                                            │
└────────────────────────────────────────────────────────────────────┘
```

---

## 4. Plugin Installation Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                    USER DISCOVERS PLUGIN                          │
│            (via search on claudecodemarketplace.com)              │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│              STEP 1: INSTALL MARKETPLACE                          │
│                                                                   │
│  User runs:                                                       │
│  /plugin marketplace add owner/marketplace-repo                   │
│                                                                   │
│  Claude Code:                                                     │
│  1. Fetches marketplace.json from GitHub                          │
│  2. Adds marketplace to local config                              │
│  3. Makes all plugins in marketplace available                    │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         │ Marketplace now available
                         │
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│              STEP 2: INSTALL PLUGIN                               │
│                                                                   │
│  User runs:                                                       │
│  /plugin install plugin-name                                      │
│                                                                   │
│  Claude Code:                                                     │
│  1. Searches installed marketplaces for plugin                    │
│  2. Fetches plugin source from GitHub                             │
│  3. Installs to .claude-plugin/ directory                         │
│  4. Registers commands, agents, hooks                             │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         │ Plugin now active
                         │
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│                  PLUGIN IS READY TO USE                           │
│                                                                   │
│  User can now:                                                    │
│  - Run plugin's slash commands (/command)                         │
│  - Use plugin's custom agents (@agent)                            │
│  - Benefit from git hooks                                         │
│  - Access MCP servers                                             │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Search and Filter Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                      USER INPUT                                   │
│  - Search query: "react component"                                │
│  - Selected tags: ["react", "typescript"]                         │
│  - Sort by: "popular"                                             │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│              CLIENT-SIDE FILTERING (useMemo)                      │
│                 No server round-trip needed                       │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  const filtered = useMemo(() => {                                │
│    // 1. Filter by tags                                          │
│    let result = marketplaces.filter(m =>                          │
│      m.tags.includes(selectedTags)                                │
│    );                                                             │
│                                                                   │
│    // 2. Filter by search query                                  │
│    result = result.filter(m =>                                   │
│      searchableText.includes(query)                               │
│    );                                                             │
│                                                                   │
│    // 3. Sort by selected criteria                               │
│    result.sort((a, b) => sortFn(a, b, sortBy));                  │
│                                                                   │
│    // 4. Also search within plugins                              │
│    const plugins = searchPlugins(query);                          │
│                                                                   │
│    return { marketplaces: result, plugins };                      │
│  }, [searchQuery, selectedTags, sortBy]);                        │
│                                                                   │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         │ Filtered results (<50ms)
                         │
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│                     RENDERED RESULTS                              │
│                                                                   │
│  Marketplaces (12)                                                │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐                  │
│  │Marketplace │ │Marketplace │ │Marketplace │                  │
│  │     A      │ │     B      │ │     C      │                  │
│  └────────────┘ └────────────┘ └────────────┘                  │
│                                                                   │
│  Plugins (45)                                                     │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                │
│  │Plugin│ │Plugin│ │Plugin│ │Plugin│ │Plugin│                │
│  │  1   │ │  2   │ │  3   │ │  4   │ │  5   │                │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘                │
└──────────────────────────────────────────────────────────────────┘
```

---

## 6. Caching Strategy

```
┌──────────────────────────────────────────────────────────────────┐
│                     USER REQUEST                                  │
│             GET /marketplace/react-marketplace                    │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         ▼
                    ┌─────────┐
                    │  HIT?   │
                    └────┬────┘
                         │
        ┌────────────────┼────────────────┐
        │ YES                             │ NO
        ▼                                 ▼
┌─────────────────┐              ┌─────────────────┐
│ LEVEL 1: EDGE   │              │  CACHE MISS     │
│ Vercel CDN      │              │  Continue...    │
│ (Instant)       │              └────────┬────────┘
└────────┬────────┘                       │
         │ Return cached                  ▼
         │ HTML/JSON                 ┌─────────┐
         │                           │  HIT?   │
         ▼                           └────┬────┘
┌─────────────────┐                      │
│  USER BROWSER   │    ┌─────────────────┼────────────────┐
└─────────────────┘    │ YES                              │ NO
                       ▼                                  ▼
              ┌─────────────────┐              ┌─────────────────┐
              │ LEVEL 2: ISR    │              │  CACHE MISS     │
              │ Next.js Cache   │              │  Continue...    │
              │ (1 hour TTL)    │              └────────┬────────┘
              └────────┬────────┘                       │
                       │ Return static                  ▼
                       │ page + revalidate         ┌─────────┐
                       │                           │  HIT?   │
                       ▼                           └────┬────┘
              ┌─────────────────┐                      │
              │  USER BROWSER   │    ┌─────────────────┼──────────┐
              └─────────────────┘    │ YES                         │ NO
                                     ▼                             ▼
                            ┌─────────────────┐         ┌──────────────────┐
                            │ LEVEL 3: FETCH  │         │ FETCH FROM SOURCE│
                            │ API Cache       │         │ GitHub API       │
                            │ (Manifest: 1h)  │         │ (Rate limited)   │
                            │ (GitHub: 24h)   │         └────────┬─────────┘
                            └────────┬────────┘                  │
                                     │ Return cached             │
                                     │ API response              │ Fresh data
                                     │                           │
                                     └─────────┬─────────────────┘
                                               │
                                               ▼
                                     ┌─────────────────┐
                                     │ GENERATE PAGE   │
                                     │ Cache for next  │
                                     │ request         │
                                     └────────┬────────┘
                                              │
                                              ▼
                                     ┌─────────────────┐
                                     │  USER BROWSER   │
                                     └─────────────────┘

CACHE DURATION:
- Edge Cache: Until deployment (Vercel)
- ISR Cache: 1 hour (revalidate: 3600)
- Manifest Fetch: 1 hour (next: { revalidate: 3600 })
- GitHub API: 24 hours (next: { revalidate: 86400 })
```

---

## 7. Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                       app/page.tsx                               │
│                    (Server Component)                            │
│                                                                  │
│  - Fetches all marketplace data                                 │
│  - Static generation with ISR                                   │
│  - SEO metadata generation                                      │
└──────────────────────────┬──────────────────────────────────────┘
                           │ Props: marketplaces[]
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    app/HomeClient.tsx                            │
│                    (Client Component)                            │
│                                                                  │
│  - useState: searchQuery, selectedTags, sortBy                  │
│  - useMemo: filtered results                                    │
│  - Handles user interactions                                    │
└───┬─────────────────────────────────────────────────┬───────────┘
    │                                                 │
    │ Map marketplaces                                │ Map plugins
    ▼                                                 ▼
┌───────────────────┐                    ┌──────────────────────┐
│ MarketplaceCard   │                    │    PluginCard        │
│ (Component)       │                    │   (Component)        │
├───────────────────┤                    ├──────────────────────┤
│ - Name & desc     │                    │ - Name & desc        │
│ - Plugin count    │                    │ - Tags               │
│ - Stars           │                    │ - Install command    │
│ - Install command │                    │ - Copy button        │
│ - Copy button     │                    └──────────────────────┘
│ - Link to detail  │
└───────────────────┘
```

---

## 8. Type System Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    types/marketplace.ts                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  MarketplaceEntry (Static)                                      │
│  ├─ id: string                                                  │
│  ├─ name: string                                                │
│  ├─ repository: string                                          │
│  └─ manifestUrl: string                                         │
│                                                                  │
│            ↓ enriched with runtime data                         │
│                                                                  │
│  FetchedMarketplace (Dynamic)                                   │
│  ├─ ...extends MarketplaceEntry                                 │
│  ├─ manifest?: MarketplaceManifest ← fetched                   │
│  ├─ pluginCount?: number          ← calculated                  │
│  ├─ stars?: number                ← GitHub API                  │
│  ├─ lastUpdated?: string          ← GitHub API                  │
│  └─ error?: string                ← error handling              │
└─────────────────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      types/plugin.ts                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  PluginSource (Union Type)                                      │
│  ├─ string                 → "owner/repo"                       │
│  ├─ GitHubSource          → { source: "github", ... }          │
│  ├─ URLSource             → { source: "url", ... }             │
│  └─ CustomSource          → { type: string, ... }              │
│                                                                  │
│  PluginEntry                                                    │
│  ├─ name: string                                                │
│  ├─ source: PluginSource                                        │
│  ├─ description?: string                                        │
│  ├─ version?: string                                            │
│  ├─ tags?: string[]                                             │
│  ├─ commands?: string[]                                         │
│  ├─ agents?: string[]                                           │
│  └─ ... (extensible)                                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9. Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────┐
│               API Request (fetch manifest)                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
                    ┌─────────┐
                    │SUCCESS? │
                    └────┬────┘
                         │
        ┌────────────────┼────────────────┐
        │ YES                             │ NO
        ▼                                 ▼
┌─────────────────┐              ┌─────────────────┐
│ RETURN DATA     │              │  ERROR TYPE?    │
│ {               │              └────────┬────────┘
│   data: {...},  │                       │
│   error: null   │         ┌─────────────┼─────────────┐
│ }               │         │             │             │
└────────┬────────┘         ▼             ▼             ▼
         │            ┌──────────┐  ┌──────────┐  ┌──────────┐
         │            │  404     │  │ Network  │  │  Other   │
         │            │Not Found │  │  Error   │  │  Error   │
         │            └────┬─────┘  └────┬─────┘  └────┬─────┘
         │                 │             │             │
         │                 └─────────────┼─────────────┘
         │                               │
         │                               ▼
         │                    ┌─────────────────────┐
         │                    │ RETURN ERROR INFO   │
         │                    │ {                   │
         │                    │   data: null,       │
         │                    │   error: "..."      │
         │                    │ }                   │
         │                    └──────────┬──────────┘
         │                               │
         └───────────────────────────────┘
                         │
                         ▼
            ┌──────────────────────────┐
            │   DISPLAY IN UI          │
            ├──────────────────────────┤
            │ Success:                 │
            │   ✓ Show plugins         │
            │   ✓ Enable install       │
            │                          │
            │ Error:                   │
            │   ⚠️ Show error message  │
            │   ⚠️ Partial data if any │
            │   ⚠️ Suggest retry       │
            └──────────────────────────┘
```

---

## 10. Development to Production Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                  DEVELOPMENT WORKFLOW                             │
└──────────────────────────────────────────────────────────────────┘

  Local Development
  ┌────────────────┐
  │ yarn dev       │
  │ (Turbopack)    │
  └───────┬────────┘
          │
          ▼
  ┌────────────────┐
  │ Edit code      │
  │ Hot reload     │
  │ Test locally   │
  └───────┬────────┘
          │
          ▼
  ┌────────────────┐
  │ Git commit     │
  │ Git push       │
  └───────┬────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    VERCEL DEPLOYMENT                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Build Process                                               │
│     ┌────────────────┐                                          │
│     │ next build     │                                          │
│     │ (Turbopack)    │                                          │
│     └───────┬────────┘                                          │
│             │                                                    │
│             ▼                                                    │
│     ┌────────────────┐                                          │
│     │ Static pages   │                                          │
│     │ generated      │                                          │
│     └───────┬────────┘                                          │
│             │                                                    │
│  2. Deploy to Edge                                              │
│             │                                                    │
│             ▼                                                    │
│     ┌────────────────┐                                          │
│     │ Edge Functions │                                          │
│     │ worldwide      │                                          │
│     └───────┬────────┘                                          │
│             │                                                    │
│  3. ISR Setup                                                   │
│             │                                                    │
│             ▼                                                    │
│     ┌────────────────┐                                          │
│     │ Background     │                                          │
│     │ revalidation   │                                          │
│     └───────┬────────┘                                          │
└─────────────┼────────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      PRODUCTION                                  │
│                                                                  │
│  https://claudecodemarketplace.com                              │
│                                                                  │
│  - Static HTML (instant)                                        │
│  - ISR updates (hourly)                                         │
│  - Global CDN                                                    │
│  - Analytics enabled                                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## Legend

```
Symbol Meanings:
┌─┐  Box/Container
│    Vertical line
─    Horizontal line
▼    Flow direction (down)
→    Flow direction (right)
├─┤  Connection points
└─┘  Box corners
```

---

## References

For more detailed explanations of these diagrams, see:
- [Architecture Analysis](MARKETPLACE_ARCHITECTURE_ANALYSIS.md)
- [Technical Deep Dive](TECHNICAL_DEEP_DIVE.md)
- [Practical Guide](PRACTICAL_GUIDE.md)

---

**Last Updated:** November 1, 2025
