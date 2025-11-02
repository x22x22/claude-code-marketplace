# Agent Plugins 摘要 / Summary

## 概述 / Overview

根据项目中的 `.claude-plugin/marketplaces.json` 文件，我们识别了所有市场下的所有带有 "agent" 的插件。

Based on the `.claude-plugin/marketplaces.json` file in this project, we have identified all plugins containing "agent" across all marketplaces.

## 统计数据 / Statistics

- **总市场数量 / Total Marketplaces**: 174
- **成功处理的市场 / Successfully Processed**: 168
- **包含 Agent 插件的市场数量 / Marketplaces with Agent Plugins**: 68
- **Agent 插件总数 / Total Agent Plugins Found**: **386**
  - **通过元数据检测 / Via Metadata**: 242
  - **通过仓库扫描 / Via Repository Scan**: 144

*Note: Uses word-boundary matching (`\bagents?\b`) to match both "agent" and "agents"*

### 检测方法 / Detection Methods

插件通过以下方式被识别为包含 agent:
Plugins are identified as containing agents through:

1. **元数据检测 / Metadata Detection**: 在插件的名称、描述、标签或关键词中包含 "agent" 或 "agents"
   - Checking for "agent" or "agents" in plugin name, description, tags, or keywords

2. **仓库结构扫描 / Repository Structure Scan**: 使用 `git clone --depth 1` 克隆仓库并检查插件源代码目录中是否有 `agents` 文件夹
   - Clones repositories with `git clone --depth 1` and checks for `agents` folder in plugin source
   - **成功检测到 144 个额外插件！/ Successfully detected 144 additional plugins!**

### 示例：检测到的插件 / Example: Detected Plugins

- ✅ **eyaltoledano/claude-task-master**: 通过仓库扫描检测到 `agents` 文件夹
  - Detected via repository scan with `agents` folder
- ✅ **其他 143 个插件 / 143 other plugins**: 仅通过仓库扫描发现
  - Found only through repository scanning

### 使用方法 / Usage

```bash
# 启用深度扫描（默认）/ Enable deep scanning (default)
npm run list-agent-plugins

# 禁用深度扫描（仅元数据）/ Disable deep scanning (metadata only)
npx tsx scripts/list-agent-plugins.ts --no-deep-scan
```

## 前 10 个市场（按 Agent 插件数量排序）/ Top 10 Marketplaces (by Agent Plugin Count)

1. **ccplugins/awesome-claude-code-plugins** - 76 agent plugins
2. **ananddtyagi/claude-code-marketplace** - 74 agent plugins
3. **jmanhype/claude-code-plugin-marketplace** - 10 agent plugins
4. **jmanhype/claude-code-plugins** - 10 agent plugins
5. **aws-solutions-library-samples/guidance-for-claude-code-with-amazon-bedrock** - 9 agent plugins
6. **kivilaid/plugin-marketplace** - 7 agent plugins
7. **henkisdabro/claudecode-marketplace** - 4 agent plugins
8. **anthropics/claude-code** - 4 agent plugins
9. **wshobson/agents** - 3 agent plugins
10. **otrebu/agents** - 3 agent plugins

*注：这些数字包含了通过元数据和仓库扫描检测到的所有插件*
*Note: These counts include plugins detected via both metadata and repository scanning*

## 报告文件 / Report Files

完整的 agent 插件列表已生成在以下文件中：
The complete list of agent plugins has been generated in:

- **详细报告 / Detailed Report**: `agent-plugins-report.md`
- **生成脚本 / Generation Script**: `scripts/list-agent-plugins.ts`

## 如何运行脚本 / How to Run the Script

```bash
# 安装依赖 / Install dependencies
npm install

# 运行脚本（推荐） / Run the script (recommended)
npm run list-agent-plugins

# 或使用 npx / Or use npx
npx tsx scripts/list-agent-plugins.ts
```

脚本会：
The script will:
1. 读取所有市场的 manifest URL / Read all marketplace manifest URLs
2. 获取每个市场的插件列表 / Fetch plugin lists from each marketplace
3. 识别包含 "agent" 的插件（在名称、描述或标签中）/ Identify plugins containing "agent" (in name, description, or tags)
4. 生成详细报告到 `agent-plugins-report.md` / Generate detailed report to `agent-plugins-report.md`

## 示例 Agent 插件 / Example Agent Plugins

一些有趣的 agent 插件包括：
Some interesting agent plugins include:

- **ultrathink**: Coordinator Agent with specialist sub-agents (Architect, Research, Coder, Tester)
- **web-dev**: Expert assistance with web development using React, Next.js, TypeScript
- **architect**: System design and technical decision-making agent
- **security-expert**: Security auditing and vulnerability assessment agent
- **agent-sdk-dev**: Development kit for working with the Claude Agent SDK

## 注意事项 / Notes

- 脚本会跳过无法访问或格式不正确的市场 manifest
- The script skips marketplaces with inaccessible or malformed manifests
- "agent" 关键词匹配不区分大小写
- The "agent" keyword matching is case-insensitive
- 某些市场可能暂时不可用
- Some marketplaces may be temporarily unavailable

---

生成时间 / Generated: 2025-11-01  
版本 / Version: 1.0
