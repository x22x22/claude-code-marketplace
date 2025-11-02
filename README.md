# Claude Code Marketplace Hub

The decentralized hub for discovering Claude Code plugin marketplaces. Browse multiple community-maintained marketplaces in one place.

Visit the hub at [claudecodemarketplace.com](https://claudecodemarketplace.com)

## What is the Marketplace Hub?

Instead of hosting plugins directly, this hub connects you to multiple specialized plugin marketplaces maintained by different communities. Each marketplace can focus on specific topics, frameworks, or use cases.

**Benefits:**
- 🚀 **Decentralized** - No single bottleneck for plugin submissions
- 🎯 **Specialized** - Marketplaces can focus on specific niches
- ⚡ **Fast Updates** - Each marketplace controls its own plugin listings
- 🌐 **Community Driven** - Anyone can create and maintain a marketplace

## 📊 Plugin Analysis & Design

We've analyzed **161 Claude Code plugins** from 15 repositories to understand common patterns, pain points, and opportunities. Based on this analysis, we've designed **Claude Plugin Studio** - a visual web development tool for creating plugins.

**📚 Read the Analysis:**
- [English Analysis & Design](./PLUGIN_ANALYSIS_AND_DESIGN.md) - Comprehensive analysis and tool design
- [Implementation Guide](./PLUGIN_STUDIO_IMPLEMENTATION_GUIDE.md) - Detailed technical specifications
- [中文摘要](./CLAUDE_PLUGIN_STUDIO_CN.md) - Chinese summary
- [Analysis README](./docs/PLUGIN_ANALYSIS_README.md) - Overview and quick start

**🔑 Key Findings:**
- 80% of plugins use `agents` folder structure
- Code review is the #1 use case (45% of plugins)
- 10 major pain points identified in plugin development
- Visual development tool could reduce development time by 80%

**🚀 Run the Analysis:**
```bash
npm run analyze-plugins
```

## Submit Your Marketplace

Have a Claude Code plugin marketplace you'd like to list in the hub? We'd love to include it!

### Prerequisites

Your marketplace must:
1. Be hosted on GitHub
2. Contain a `.claude-plugin/marketplace.json` file following [Anthropic's schema](https://anthropic.com/claude-code/marketplace.schema.json)
3. Host open-source plugins with publicly viewable code
4. Provide valid repository URLs for all plugins

### How to Submit

1. **Fork this repository**
2. **Edit `.claude-plugin/marketplaces.json`** and add your marketplace entry:

```json
{
  "id": "unique-marketplace-id",
  "name": "Your Marketplace Name",
  "description": "Brief description of what your marketplace focuses on",
  "owner": {
    "name": "Your Name or Organization",
    "url": "https://your-website.com"
  },
  "repository": "https://github.com/yourusername/your-marketplace-repo",
  "manifestUrl": "https://raw.githubusercontent.com/yourusername/your-marketplace-repo/main/.claude-plugin/marketplace.json",
  "tags": ["relevant", "tags", "here"],
  "homepage": "https://your-marketplace-site.com",
  "verified": false,
  "addedAt": "2025-10-10"
}
```

3. **Submit a Pull Request**

### Marketplace Entry Fields

| Field | Required | Description |
|-------|----------|-------------|
| `id` | Yes | Unique identifier (lowercase, hyphens only) |
| `name` | Yes | Display name for your marketplace |
| `description` | Yes | Brief description (1-2 sentences) |
| `owner.name` | Yes | Marketplace owner/maintainer name |
| `owner.url` | No | Link to owner's website/profile |
| `repository` | Yes | GitHub repository URL |
| `manifestUrl` | Yes | Direct URL to your marketplace.json file |
| `tags` | No | Array of relevant tags/categories |
| `homepage` | No | Marketplace website (if different from repo) |
| `verified` | No | Set to false (verification granted by maintainers) |
| `addedAt` | Yes | Date added in YYYY-MM-DD format |

### Marketplace Manifest Format

Your repository's `.claude-plugin/marketplace.json` should follow this structure:

```json
{
  "$schema": "https://anthropic.com/claude-code/marketplace.schema.json",
  "name": "your-marketplace-name",
  "owner": {
    "name": "Your Name",
    "url": "https://your-site.com"
  },
  "metadata": {
    "description": "Your marketplace description",
    "version": "1.0.0"
  },
  "plugins": [
    {
      "name": "plugin-name",
      "source": "username/plugin-repo",
      "description": "Plugin description",
      "version": "1.0.0",
      "author": "Plugin Author",
      "license": "MIT",
      "tags": ["tag1", "tag2"]
    }
  ]
}
```

See [Anthropic's documentation](https://docs.claude.com/en/docs/claude-code/plugin-marketplaces) for the complete schema.

## Create Your Own Marketplace

Want to start your own specialized marketplace? Here's how:

### 1. Create a Repository

```bash
mkdir my-claude-marketplace
cd my-claude-marketplace
git init
mkdir .claude-plugin
```

### 2. Create Your Marketplace Manifest

Create `.claude-plugin/marketplace.json`:

```json
{
  "$schema": "https://anthropic.com/claude-code/marketplace.schema.json",
  "name": "my-marketplace",
  "owner": {
    "name": "Your Name",
    "url": "https://github.com/yourusername"
  },
  "metadata": {
    "description": "A curated collection of [your focus area] plugins",
    "version": "1.0.0"
  },
  "plugins": []
}
```

### 3. Add Plugins

Add plugins to your `plugins` array following the schema. See [Plugin Entry Schema](https://docs.claude.com/en/docs/claude-code/plugin-marketplaces#plugin-entries) for details.

### 4. Push to GitHub

```bash
git add .
git commit -m "Initial marketplace setup"
git remote add origin https://github.com/yourusername/your-marketplace
git push -u origin main
```

### 5. Submit to the Hub

Follow the "Submit Your Marketplace" instructions above to list your marketplace in the hub.

## For Plugin Developers

If you want to get your plugin listed, you have two options:

1. **Submit to an existing marketplace** - Find a marketplace that matches your plugin's category and submit a PR there
2. **Create your own marketplace** - Follow the guide above and include your plugin

Each marketplace has its own submission process and requirements, so check their individual guidelines.

## Development

Want to contribute to the hub itself?

### Prerequisites
- Node.js 20+
- Yarn or npm

### Setup

```bash
git clone https://github.com/joesaunderson/claude-code-marketplace.git
cd claude-code-marketplace
yarn install
yarn dev
```

### Project Structure

```
.claude-plugin/
  └── marketplaces.json    # Hub's marketplace listings
app/
  ├── page.tsx            # Homepage (marketplace grid)
  ├── marketplace/[id]/   # Marketplace detail pages
  └── about/              # About page
components/
  ├── MarketplaceCard.tsx # Marketplace display card
  ├── PluginCard.tsx      # Plugin display card
  └── ClientHome.tsx      # Client-side filtering
lib/
  └── github.ts           # GitHub API utilities
types/
  ├── marketplace.ts      # Marketplace types
  └── plugin.ts          # Plugin types
```

## Contributing

Contributions are welcome! Whether you're:
- Submitting a marketplace
- Improving the hub
- Fixing bugs
- Enhancing documentation

Please open an issue or PR on GitHub.

## Important Notes

This hub is a **directory service only**. We:
- ✅ List marketplaces and help users discover them
- ✅ Dynamically fetch and display marketplace data
- ✅ Provide a unified search and discovery experience
- ❌ Don't host plugin files
- ❌ Don't control marketplace contents
- ❌ Don't verify individual plugins (marketplaces do that)

Each marketplace is responsible for:
- Curating and reviewing their plugins
- Maintaining plugin metadata
- Ensuring code quality and security
- Providing installation instructions

## License

MIT

## Links

- [Hub Website](https://claudecodemarketplace.com)
- [GitHub Repository](https://github.com/joesaunderson/claude-code-marketplace)
- [Claude Code Plugins Documentation](https://www.anthropic.com/news/claude-code-plugins)
- [Plugin Marketplace Schema](https://docs.claude.com/en/docs/claude-code/plugin-marketplaces)
