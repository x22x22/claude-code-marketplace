# Marketplace Discovery Scripts

This directory contains automation scripts for discovering and managing Claude Code plugin marketplaces.

## Available Scripts

### `discover-marketplaces.ts`

Automatically discovers new Claude Code plugin marketplaces from GitHub.

**Features:**
- Searches GitHub for repositories with `.claude-plugin/marketplace.json`
- Validates marketplace manifests
- Checks for duplicates
- Generates marketplace entries
- Supports dry-run mode

**Usage:**

```bash
# Dry run (preview only)
yarn discover

# Save changes
yarn discover:save

# Limit results
yarn discover --max=50
```

**Environment Variables:**
- `GITHUB_TOKEN`: Required. GitHub Personal Access Token for API access

**Output:**
- In dry-run mode: Creates `discovered-marketplaces.json` preview file
- In save mode: Updates `.claude-plugin/marketplaces.json` directly

## Development

### Adding New Scripts

When adding new scripts:

1. Create TypeScript file in this directory
2. Add shebang: `#!/usr/bin/env tsx`
3. Add script entry in `package.json`
4. Document usage in this README

### Testing Scripts

Always test scripts in dry-run mode first:

```bash
yarn discover  # Safe, no changes made
```

## Troubleshooting

### Rate Limiting

If you hit GitHub API rate limits:
- Use an authenticated token
- Reduce `--max` parameter
- Wait for rate limit reset

### Permission Errors

Ensure your `GITHUB_TOKEN` has these permissions:
- `public_repo` (for public repository access)
- `read:org` (optional, for organization repositories)

## Related Documentation

- [Automated Discovery Guide](../docs/automated-discovery.md)
- [Development Guide](../docs/development.md)
