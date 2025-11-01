# Practical Guide: Creating and Submitting a Marketplace

## 实践指南 (Practical Guide)

This guide provides step-by-step instructions for creating your own plugin marketplace and submitting it to the Claude Code Marketplace Hub.

## Table of Contents

1. [Creating Your Marketplace](#creating-your-marketplace)
2. [Marketplace Manifest Structure](#marketplace-manifest-structure)
3. [Adding Plugins to Your Marketplace](#adding-plugins-to-your-marketplace)
4. [Submitting to the Hub](#submitting-to-the-hub)
5. [Plugin Development Guide](#plugin-development-guide)
6. [Common Patterns and Examples](#common-patterns-and-examples)
7. [Testing Your Marketplace](#testing-your-marketplace)

---

## 1. Creating Your Marketplace

### Step 1: Create a GitHub Repository

```bash
# Create a new repository
mkdir my-claude-marketplace
cd my-claude-marketplace
git init

# Create the required directory structure
mkdir -p .claude-plugin
```

### Step 2: Create Marketplace Manifest

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
    "description": "A curated collection of [your focus area] plugins for Claude Code",
    "version": "1.0.0"
  },
  "plugins": []
}
```

### Step 3: Initialize Git and Push

```bash
git add .
git commit -m "Initial marketplace setup"
git remote add origin https://github.com/yourusername/my-claude-marketplace
git branch -M main
git push -u origin main
```

---

## 2. Marketplace Manifest Structure

### Complete Schema

```json
{
  "$schema": "https://anthropic.com/claude-code/marketplace.schema.json",
  "name": "marketplace-name",
  "owner": {
    "name": "Owner Name",
    "email": "optional@email.com",
    "url": "https://your-website.com"
  },
  "metadata": {
    "description": "Detailed description of your marketplace",
    "version": "1.0.0",
    "pluginRoot": ".claude-plugin"
  },
  "plugins": [
    // Plugin entries (see next section)
  ]
}
```

### Field Explanations

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `$schema` | Yes | String | Schema URL for validation |
| `name` | Yes | String | Unique marketplace identifier |
| `owner.name` | Yes | String | Marketplace owner/maintainer |
| `owner.email` | No | String | Contact email |
| `owner.url` | No | String | Website or GitHub profile |
| `metadata.description` | No | String | Marketplace description |
| `metadata.version` | No | String | Semantic version |
| `metadata.pluginRoot` | No | String | Default: `.claude-plugin` |
| `plugins` | Yes | Array | List of plugin entries |

---

## 3. Adding Plugins to Your Marketplace

### Plugin Entry Formats

#### Format 1: Simple GitHub Source

```json
{
  "name": "my-plugin",
  "source": "username/plugin-repo",
  "description": "Brief description of what this plugin does",
  "version": "1.0.0",
  "author": "Plugin Author",
  "license": "MIT",
  "tags": ["productivity", "automation"]
}
```

#### Format 2: Detailed GitHub Source

```json
{
  "name": "advanced-plugin",
  "source": {
    "source": "github",
    "repo": "username/plugin-repo",
    "path": "plugins/my-plugin",
    "ref": "v1.0.0"
  },
  "description": "Advanced plugin with custom path and version",
  "version": "1.0.0",
  "author": {
    "name": "Author Name",
    "email": "author@example.com",
    "url": "https://author-website.com"
  },
  "homepage": "https://plugin-website.com",
  "repository": "https://github.com/username/plugin-repo",
  "license": "MIT",
  "keywords": ["keyword1", "keyword2"],
  "category": "Development Tools",
  "tags": ["development", "tools"],
  "commands": ["/my-command", "/another-command"],
  "agents": ["agent-name"],
  "hooks": {
    "pre-commit": "path/to/hook.sh"
  },
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["my-mcp-server"]
    }
  }
}
```

#### Format 3: URL Source

```json
{
  "name": "external-plugin",
  "source": {
    "source": "url",
    "url": "https://example.com/plugin.zip"
  },
  "description": "Plugin hosted outside GitHub",
  "version": "1.0.0",
  "author": "Plugin Author",
  "license": "MIT",
  "tags": ["external"]
}
```

### Plugin Entry Fields Reference

#### Essential Fields

```typescript
interface PluginEntry {
  // Required
  name: string;              // Unique plugin identifier
  source: PluginSource;      // Where to get the plugin
  
  // Strongly Recommended
  description: string;       // What the plugin does
  version: string;          // Semantic version
  author: string | PluginAuthor;  // Who created it
  license: string;          // License type (MIT, Apache, etc.)
  tags: string[];           // Searchable tags
  
  // Optional
  homepage?: string;        // Plugin website
  repository?: string;      // Source code URL
  keywords?: string[];      // Search keywords
  category?: string;        // Category classification
}
```

#### Extended Fields

```typescript
interface ExtendedPluginEntry extends PluginEntry {
  // Claude Code specific
  commands?: string | string[];           // Slash commands provided
  agents?: string | string[];             // Custom agents
  hooks?: string | Record<string, any>;   // Git hooks or lifecycle hooks
  mcpServers?: string | Record<string, MCPServerConfig>;  // MCP servers
  
  // Constraints
  strict?: boolean;         // Strict mode enforcement
}
```

---

## 4. Submitting to the Hub

### Step 1: Fork the Hub Repository

```bash
# Using GitHub CLI
gh repo fork joesaunderson/claude-code-marketplace

# Or fork via GitHub web interface
```

### Step 2: Edit marketplaces.json

Add your marketplace entry to `.claude-plugin/marketplaces.json`:

```json
{
  "id": "your-unique-marketplace-id",
  "name": "Your Marketplace Name",
  "description": "Brief description (1-2 sentences)",
  "owner": {
    "name": "Your Name or Organization",
    "url": "https://your-website.com"
  },
  "repository": "https://github.com/yourusername/your-marketplace-repo",
  "manifestUrl": "https://raw.githubusercontent.com/yourusername/your-marketplace-repo/main/.claude-plugin/marketplace.json",
  "tags": ["relevant", "tags", "here"],
  "homepage": "https://your-marketplace-site.com",
  "verified": false,
  "addedAt": "2025-11-01"
}
```

### Step 3: Create Pull Request

```bash
# Create a new branch
git checkout -b add-my-marketplace

# Commit your changes
git add .claude-plugin/marketplaces.json
git commit -m "Add My Awesome Marketplace"

# Push to your fork
git push origin add-my-marketplace

# Create PR using GitHub CLI
gh pr create --title "Add My Awesome Marketplace" --body "This marketplace focuses on [your niche]"
```

### PR Template

Use this template for your pull request description:

```markdown
## Marketplace Submission

**Marketplace Name:** Your Marketplace Name

**Repository:** https://github.com/yourusername/your-marketplace

**Focus Area:** Brief description of your marketplace's specialty

**Plugin Count:** X plugins

**Checklist:**
- [ ] Repository contains `.claude-plugin/marketplace.json`
- [ ] Manifest follows Anthropic's schema
- [ ] All plugins have valid repository URLs
- [ ] Plugins are open-source with visible code
- [ ] Manifest is publicly accessible via raw.githubusercontent.com
- [ ] Tags are relevant and descriptive
- [ ] Description is clear and concise

**Additional Notes:**
Any special features or information about your marketplace
```

---

## 5. Plugin Development Guide

### Plugin Structure

A typical plugin follows this structure:

```
my-plugin/
├── .claude-plugin/
│   └── plugin.json          # Plugin metadata
├── agents/
│   ├── code-reviewer.md     # Custom agent prompts
│   └── test-generator.md
├── commands/
│   ├── review.md            # Slash command definitions
│   └── test.md
├── hooks/
│   ├── pre-commit.sh        # Git hooks
│   └── post-merge.sh
├── mcp-servers/
│   └── my-server/
│       ├── index.js         # MCP server implementation
│       └── package.json
├── README.md
└── LICENSE
```

### Plugin Metadata Example

`.claude-plugin/plugin.json`:

```json
{
  "name": "code-quality-suite",
  "version": "1.0.0",
  "description": "Comprehensive code quality tools for Claude Code",
  "author": {
    "name": "Your Name",
    "email": "you@example.com"
  },
  "license": "MIT",
  "homepage": "https://github.com/you/code-quality-suite",
  "repository": "https://github.com/you/code-quality-suite",
  "tags": ["quality", "testing", "review"],
  "commands": [
    {
      "name": "/review",
      "description": "Review code for quality issues",
      "file": "commands/review.md"
    }
  ],
  "agents": [
    {
      "name": "code-reviewer",
      "description": "Expert code reviewer",
      "file": "agents/code-reviewer.md"
    }
  ],
  "hooks": {
    "pre-commit": {
      "script": "hooks/pre-commit.sh",
      "description": "Run quality checks before commit"
    }
  }
}
```

### Custom Agent Example

`agents/code-reviewer.md`:

```markdown
# Code Reviewer Agent

You are an expert code reviewer with deep knowledge of software engineering best practices.

## Your Responsibilities

1. Review code for:
   - Code quality and readability
   - Potential bugs and edge cases
   - Security vulnerabilities
   - Performance issues
   - Best practices adherence

2. Provide constructive feedback:
   - Be specific about issues found
   - Suggest improvements with examples
   - Explain the reasoning behind suggestions
   - Balance between nitpicking and major issues

3. Review scope:
   - Focus on changed lines and their context
   - Consider broader architectural impacts
   - Check for consistent style and patterns

## Review Format

Structure your reviews as:
1. Summary of changes
2. Critical issues (if any)
3. Suggestions for improvement
4. Positive feedback on good practices

## Examples

Good feedback:
- "This function could benefit from error handling for network failures"
- "Consider extracting this logic into a separate function for reusability"

Avoid:
- Vague comments like "this doesn't look right"
- Personal preference comments without justification
```

### Slash Command Example

`commands/review.md`:

```markdown
# /review Command

Review the current changes or specified files for code quality issues.

## Usage

```
/review [file1] [file2] ...
```

If no files specified, reviews all changed files.

## What Gets Checked

- Code style and formatting
- Potential bugs and edge cases
- Security vulnerabilities
- Performance concerns
- Best practices
- Documentation completeness

## Output Format

Provides a structured review with:
1. Summary of findings
2. Critical issues (must fix)
3. Suggestions (should consider)
4. Positive notes

## Examples

Review all changes:
```
/review
```

Review specific files:
```
/review src/utils.ts src/components/Button.tsx
```
```

---

## 6. Common Patterns and Examples

### Example 1: Framework-Specific Marketplace

**Use Case:** React-specific plugins

```json
{
  "name": "react-marketplace",
  "owner": {
    "name": "React Community"
  },
  "metadata": {
    "description": "Curated React development plugins for Claude Code"
  },
  "plugins": [
    {
      "name": "react-component-generator",
      "source": "react-tools/component-gen",
      "description": "Generate React components with TypeScript",
      "tags": ["react", "typescript", "generator"]
    },
    {
      "name": "react-hooks-linter",
      "source": "react-tools/hooks-lint",
      "description": "Lint and optimize React hooks usage",
      "tags": ["react", "hooks", "linting"]
    }
  ]
}
```

### Example 2: Company Internal Marketplace

**Use Case:** Company-specific tools and standards

```json
{
  "name": "acme-internal",
  "owner": {
    "name": "Acme Corp",
    "url": "https://acme.com"
  },
  "metadata": {
    "description": "Internal development tools and standards for Acme Corp"
  },
  "plugins": [
    {
      "name": "acme-code-standards",
      "source": {
        "source": "github",
        "repo": "acme/code-standards",
        "path": "claude-plugin",
        "ref": "main"
      },
      "description": "Enforce Acme coding standards",
      "tags": ["standards", "internal", "quality"],
      "strict": true
    },
    {
      "name": "acme-deployment",
      "source": "acme/deployment-tools",
      "description": "Deployment automation for Acme infrastructure",
      "tags": ["deployment", "devops", "internal"]
    }
  ]
}
```

### Example 3: Educational Marketplace

**Use Case:** Teaching and learning tools

```json
{
  "name": "learn-to-code",
  "owner": {
    "name": "Code Academy"
  },
  "metadata": {
    "description": "Educational plugins for learning programming with Claude Code"
  },
  "plugins": [
    {
      "name": "beginner-hints",
      "source": "edu/beginner-helper",
      "description": "Provide contextual hints for beginners",
      "tags": ["education", "learning", "beginners"]
    },
    {
      "name": "code-explainer",
      "source": "edu/code-explainer",
      "description": "Explain code concepts in simple terms",
      "tags": ["education", "explanation", "learning"]
    },
    {
      "name": "practice-generator",
      "source": "edu/practice-gen",
      "description": "Generate coding exercises and challenges",
      "tags": ["education", "practice", "exercises"]
    }
  ]
}
```

---

## 7. Testing Your Marketplace

### Local Testing

#### Step 1: Add Your Marketplace Locally

```bash
/plugin marketplace add yourusername/your-marketplace
```

#### Step 2: List Available Plugins

```bash
/plugin marketplace list
```

#### Step 3: Install a Plugin

```bash
/plugin install your-plugin-name
```

#### Step 4: Verify Installation

```bash
/plugin list
```

### Validation Checklist

Before submitting your marketplace, verify:

- [ ] **Manifest Accessibility**
  ```bash
  curl https://raw.githubusercontent.com/yourusername/your-marketplace/main/.claude-plugin/marketplace.json
  ```
  Should return valid JSON

- [ ] **JSON Validity**
  ```bash
  cat .claude-plugin/marketplace.json | jq .
  ```
  Should parse without errors

- [ ] **Plugin Repositories Exist**
  - All plugin source repositories are public
  - Repository URLs are valid
  - Plugins contain required files

- [ ] **Schema Compliance**
  - Use an online JSON validator
  - Validate against Anthropic's schema

- [ ] **Tags Relevance**
  - Tags accurately describe content
  - Use lowercase, hyphen-separated format
  - Avoid excessive tags (5-10 is reasonable)

### Testing with Real Users

Consider:
1. **Beta Testing** - Share with a small group first
2. **Documentation** - Provide clear README
3. **Examples** - Include usage examples
4. **Support** - Set up GitHub Issues for feedback

### Continuous Integration

Set up GitHub Actions to validate your marketplace:

`.github/workflows/validate.yml`:

```yaml
name: Validate Marketplace

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Validate JSON
        run: |
          jq empty .claude-plugin/marketplace.json
      
      - name: Check Required Fields
        run: |
          jq -e '.name' .claude-plugin/marketplace.json
          jq -e '.owner' .claude-plugin/marketplace.json
          jq -e '.plugins' .claude-plugin/marketplace.json
      
      - name: Validate Plugin Sources
        run: |
          # Add your validation logic here
          echo "Checking plugin sources..."
```

---

## Best Practices

### For Marketplace Maintainers

1. **Quality Over Quantity**
   - Curate plugins carefully
   - Test before adding
   - Remove outdated plugins

2. **Clear Documentation**
   - README with marketplace purpose
   - Installation instructions
   - Plugin summaries

3. **Regular Updates**
   - Keep plugin versions current
   - Monitor for breaking changes
   - Update descriptions as needed

4. **Community Engagement**
   - Accept plugin submissions
   - Respond to issues
   - Collaborate with plugin authors

### For Plugin Developers

1. **Follow Standards**
   - Use semantic versioning
   - Include comprehensive README
   - Provide examples

2. **Open Source**
   - Choose appropriate license
   - Make code publicly visible
   - Accept contributions

3. **Maintenance**
   - Keep dependencies updated
   - Fix reported issues
   - Deprecate gracefully

4. **Documentation**
   - Clear usage instructions
   - API documentation
   - Troubleshooting guide

---

## Troubleshooting

### Common Issues

#### Issue: Marketplace Not Found

**Symptom:** `/plugin marketplace add` fails

**Solutions:**
- Verify GitHub repository is public
- Check manifest URL is accessible
- Ensure file is at correct path

#### Issue: Plugin Installation Fails

**Symptom:** `/plugin install` fails

**Solutions:**
- Verify plugin source URL
- Check plugin repository exists
- Ensure plugin format is correct

#### Issue: Plugins Not Appearing

**Symptom:** Marketplace added but plugins not listed

**Solutions:**
- Validate manifest JSON format
- Check plugins array is not empty
- Verify plugin entries have required fields

### Getting Help

- **GitHub Issues:** Open an issue in the hub repository
- **Documentation:** Read official Claude Code docs
- **Community:** Join Claude Code community forums

---

## Additional Resources

- [Claude Code Documentation](https://docs.claude.com/en/docs/claude-code)
- [Plugin Marketplace Schema](https://anthropic.com/claude-code/marketplace.schema.json)
- [Hub Repository](https://github.com/joesaunderson/claude-code-marketplace)
- [Example Marketplaces](https://claudecodemarketplace.com)

---

## Conclusion

Creating a marketplace is straightforward:
1. Create GitHub repository
2. Add marketplace.json
3. List your plugins
4. Submit to hub

The decentralized model allows anyone to contribute and helps build a rich ecosystem of Claude Code plugins.

Happy marketplace building! 🚀
