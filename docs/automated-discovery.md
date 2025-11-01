# Automated Marketplace Discovery

This document explains how the Claude Code Marketplace Hub automatically discovers and collects new plugin marketplaces from GitHub.

## Overview

The marketplace hub uses an automated discovery system to find repositories on GitHub that contain Claude Code plugin marketplaces. This system runs periodically to ensure the hub stays up-to-date with the growing ecosystem.

## How It Works

### 1. GitHub Code Search

The discovery script searches GitHub for repositories containing the file `.claude-plugin/marketplace.json`. This is the standard location for Claude Code marketplace manifests.

**Search Query:**
```
path:.claude-plugin/marketplace.json
```

### 2. Validation

For each discovered repository, the script:

1. **Fetches the manifest** from the raw GitHub URL
2. **Validates the structure** ensuring required fields are present:
   - `name`: Marketplace identifier
   - `plugins`: Array of plugin entries
3. **Checks plugin count** to ensure the marketplace has actual content
4. **Verifies accessibility** by attempting to fetch the manifest

### 3. Entry Creation

Valid marketplaces are automatically converted to marketplace entries with:

- **ID**: Generated from repository name (e.g., `username/repo` → `username-repo`)
- **Name**: Repository full name
- **Description**: From manifest or repository description
- **Owner**: Repository owner information
- **Repository URL**: GitHub repository link
- **Manifest URL**: Direct link to the marketplace.json file
- **Tags**: Initially tagged as `community`
- **Verified**: Set to `false` (requires manual verification)
- **Added Date**: Current date

## Running Discovery Manually

### Prerequisites

- Node.js 20+
- Yarn package manager
- GitHub Personal Access Token (for API access)

### Local Execution

1. **Set up environment:**

```bash
export GITHUB_TOKEN=your_github_token_here
```

2. **Dry run (preview only):**

```bash
yarn discover
```

This will:
- Search GitHub for marketplaces
- Validate discovered marketplaces
- Generate a preview file: `discovered-marketplaces.json`
- Not modify the actual marketplace list

3. **Save discoveries:**

```bash
yarn discover:save
```

This will actually add the discovered marketplaces to `.claude-plugin/marketplaces.json`.

### Command Options

- `--no-dry-run`: Disable dry-run mode and save changes
- `--max=N`: Limit search results (default: 100)

Example:
```bash
yarn discover --max=50
```

## Automated Workflow

The discovery process runs automatically via GitHub Actions.

### Schedule

- **Weekly**: Every Monday at 00:00 UTC
- **Manual**: Can be triggered via GitHub Actions UI

### Workflow Steps

1. **Search & Validate**: Find and validate new marketplaces
2. **Create PR**: If new marketplaces found, automatically create a PR
3. **Review**: Maintainers review and merge the PR

### Manual Trigger

You can trigger the workflow manually from GitHub:

1. Go to **Actions** tab in the repository
2. Select **"Discover New Marketplaces"** workflow
3. Click **"Run workflow"**
4. Choose options:
   - **Dry run**: Preview without creating PR
   - **Max results**: Limit number of results

## Quality Assurance

### Automatic Checks

The discovery script performs several automatic checks:

- ✅ Valid JSON structure
- ✅ Required fields present
- ✅ Manifest is accessible
- ✅ Not already in the marketplace list

### Manual Review

Discovered marketplaces require manual review before being added:

1. **Manifest Quality**: Check plugin descriptions and metadata
2. **Repository Health**: Verify active maintenance
3. **No Duplicates**: Ensure no duplicate entries
4. **No Spam**: Filter out low-quality or spam repositories

## Excluding Repositories

If a repository should not be included in automated discovery, maintainers can:

1. **Add to exclusion list** (to be implemented)
2. **Mark as reviewed** to skip in future runs
3. **Close the automated PR** with explanation

## Privacy & Ethics

The discovery system:

- ✅ Only searches **public** repositories
- ✅ Respects GitHub API rate limits
- ✅ Does not collect private data
- ✅ Validates manifest accessibility before adding
- ✅ Allows repository owners to opt-out

## Troubleshooting

### Rate Limiting

If you encounter rate limiting errors:

1. Ensure `GITHUB_TOKEN` is set correctly
2. Use a token with appropriate permissions
3. Reduce `--max` parameter
4. Wait for rate limit reset

### Invalid Manifests

Common reasons for rejection:

- Missing required fields (`name`, `plugins`)
- Invalid JSON syntax
- Manifest not at correct path
- Network/accessibility issues

## Future Enhancements

Planned improvements:

- [ ] Marketplace quality scoring
- [ ] Automatic tagging based on plugins
- [ ] Duplicate detection improvements
- [ ] Owner verification system
- [ ] Exclusion list management
- [ ] Incremental updates (only new changes)
- [ ] Statistics and analytics

## Contributing

To improve the discovery system:

1. **Report Issues**: Found a bug or false positive?
2. **Suggest Features**: Ideas for better discovery?
3. **Submit PRs**: Improvements to the discovery script

See the main [README](../README.md) for contribution guidelines.

## Related Documentation

- [Development Guide](./development.md)
- [Marketplace Submission Guide](../README.md#submit-your-marketplace)
- [Claude Code Plugin Documentation](https://docs.claude.com/en/docs/claude-code/plugin-marketplaces)
