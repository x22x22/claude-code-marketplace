# Claude Plugin Studio - 增强配置页面设计

## 📐 界面设计

### 完整配置页面布局

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  🎨 Claude Plugin Studio                                         [English] [中文]│
│  ┌─────────┬──────────┬──────────┬──────────┬──────────┬──────────┐           │
│  │👋 欢迎  │ 📋 模板  │ ⚙️ 配置  │🤖 Agents │ 🧪 测试  │ 🚀 部署  │           │
│  └─────────┴──────────┴──────────┴──────────┴──────────┴──────────┘           │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│                        ⚙️ Configure Your Plugin                                │
│                         配置您的插件详细信息                                    │
│                                                                                │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │ 配置模式:  ● 简单模式   ○ 高级模式                                       │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                                │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │                          📝 基本信息                                       │ │
│  ├──────────────────────────────────────────────────────────────────────────┤ │
│  │                                                                          │ │
│  │  插件名称 *                                                               │ │
│  │  ┌────────────────────────────────────────────────────────────────────┐  │ │
│  │  │ my-code-reviewer                                                    │  │ │
│  │  └────────────────────────────────────────────────────────────────────┘  │ │
│  │  💡 提示：使用小写字母和连字符，例如：my-awesome-plugin                   │ │
│  │                                                                          │ │
│  │  描述 *                                                                   │ │
│  │  ┌────────────────────────────────────────────────────────────────────┐  │ │
│  │  │ 自动化代码审查插件，帮助团队保持高质量的代码标准                      │  │ │
│  │  │                                                                      │  │ │
│  │  └────────────────────────────────────────────────────────────────────┘  │ │
│  │  💡 提示：清晰描述插件的功能和价值，吸引用户使用                          │ │
│  │                                                                          │ │
│  │  版本号 *                                                                 │ │
│  │  ┌────────────────────────────────────────────────────────────────────┐  │ │
│  │  │ 1.0.0                                                                │  │ │
│  │  └────────────────────────────────────────────────────────────────────┘  │ │
│  │  💡 提示：遵循语义化版本规范 (SemVer): 主版本.次版本.修订号              │ │
│  │                                                                          │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                                │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │                          👤 作者信息                                       │ │
│  ├──────────────────────────────────────────────────────────────────────────┤ │
│  │                                                                          │ │
│  │  作者姓名 *                                                               │ │
│  │  ┌────────────────────────────────────────────────────────────────────┐  │ │
│  │  │ Zhang San                                                            │  │ │
│  │  └────────────────────────────────────────────────────────────────────┘  │ │
│  │                                                                          │ │
│  │  作者邮箱 *                                                               │ │
│  │  ┌────────────────────────────────────────────────────────────────────┐  │ │
│  │  │ zhangsan@example.com                                                │  │ │
│  │  └────────────────────────────────────────────────────────────────────┘  │ │
│  │  ✓ 邮箱格式正确                                                          │ │
│  │                                                                          │ │
│  │  组织/公司（可选）                                                        │ │
│  │  ┌────────────────────────────────────────────────────────────────────┐  │ │
│  │  │ Example Corp                                                         │  │ │
│  │  └────────────────────────────────────────────────────────────────────┘  │ │
│  │                                                                          │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                                │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │                          🔗 仓库信息                                       │ │
│  ├──────────────────────────────────────────────────────────────────────────┤ │
│  │                                                                          │ │
│  │  GitHub 仓库 URL（可选）                                                  │ │
│  │  ┌────────────────────────────────────────────────────────────────────┐  │ │
│  │  │ https://github.com/username/my-code-reviewer                        │  │ │
│  │  └────────────────────────────────────────────────────────────────────┘  │ │
│  │  💡 提示：将插件托管在 GitHub 可以方便用户查看源码和贡献代码              │ │
│  │                                                                          │ │
│  │  主页 URL（可选）                                                         │ │
│  │  ┌────────────────────────────────────────────────────────────────────┐  │ │
│  │  │ https://my-plugin-docs.com                                          │  │ │
│  │  └────────────────────────────────────────────────────────────────────┘  │ │
│  │                                                                          │ │
│  │  许可证 *                                                                 │ │
│  │  ┌────────────────────────────────────────────────────────────────────┐  │ │
│  │  │ MIT License                          ▼                              │  │ │
│  │  └────────────────────────────────────────────────────────────────────┘  │ │
│  │  可选：MIT, Apache 2.0, GPL-3.0, BSD-3-Clause, ISC, 自定义              │ │
│  │  💡 MIT 是最常用的开源许可证，适合大多数项目                              │ │
│  │                                                                          │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                                │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │                          🏷️ 分类和标签                                     │ │
│  ├──────────────────────────────────────────────────────────────────────────┤ │
│  │                                                                          │ │
│  │  插件类别 *                                                               │ │
│  │  ┌────────────────────────────────────────────────────────────────────┐  │ │
│  │  │ Code Quality                         ▼                              │  │ │
│  │  └────────────────────────────────────────────────────────────────────┘  │ │
│  │  可选：Code Quality, Testing, Documentation, Security, Debugging,        │ │
│  │        Performance, Deployment, DevOps, AI/ML, Custom                   │ │
│  │                                                                          │ │
│  │  标签（用空格或逗号分隔）                                                 │ │
│  │  ┌────────────────────────────────────────────────────────────────────┐  │ │
│  │  │ code-review typescript react best-practices security                │  │ │
│  │  └────────────────────────────────────────────────────────────────────┘  │ │
│  │                                                                          │ │
│  │  已选标签:                                                                │ │
│  │  [code-review ×] [typescript ×] [react ×] [best-practices ×]            │ │
│  │  [security ×]                                                            │ │
│  │                                                                          │ │
│  │  💡 热门标签建议:                                                         │ │
│  │  [+ linting] [+ testing] [+ automation] [+ ci-cd] [+ github-actions]    │ │
│  │                                                                          │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                                │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │                          ⚙️ 触发配置                                       │ │
│  ├──────────────────────────────────────────────────────────────────────────┤ │
│  │                                                                          │ │
│  │  触发条件 *（可多选）                                                     │ │
│  │                                                                          │ │
│  │  ┌──────────────────────────────────────────────────────────────────┐   │ │
│  │  │ ☑ Pull Request 创建时                                             │   │ │
│  │  │   └─ pull_request.opened                                         │   │ │
│  │  │                                                                  │   │ │
│  │  │ ☑ Pull Request 更新时                                             │   │ │
│  │  │   └─ pull_request.synchronize                                   │   │ │
│  │  │                                                                  │   │ │
│  │  │ ☑ Pull Request 重新打开时                                         │   │ │
│  │  │   └─ pull_request.reopened                                      │   │ │
│  │  │                                                                  │   │ │
│  │  │ ☐ 代码推送时                                                      │   │ │
│  │  │   └─ push                                                        │   │ │
│  │  │                                                                  │   │ │
│  │  │ ☐ 手动触发                                                        │   │ │
│  │  │   └─ workflow_dispatch                                          │   │ │
│  │  │                                                                  │   │ │
│  │  │ ☐ 定时执行                                                        │   │ │
│  │  │   └─ schedule                                                    │   │ │
│  │  │       ┌────────────────────────────────────────┐                │   │ │
│  │  │       │ Cron 表达式: 0 0 * * *                │                │   │ │
│  │  │       └────────────────────────────────────────┘                │   │ │
│  │  │       💡 每天午夜执行                                           │   │ │
│  │  └──────────────────────────────────────────────────────────────────┘   │ │
│  │                                                                          │ │
│  │  文件过滤（可选）                                                         │ │
│  │  ┌────────────────────────────────────────────────────────────────────┐  │ │
│  │  │ **/*.ts, **/*.tsx, **/*.js, **/*.jsx                               │  │ │
│  │  └────────────────────────────────────────────────────────────────────┘  │ │
│  │  💡 只在这些文件变更时触发，支持通配符                                    │ │
│  │                                                                          │ │
│  │  忽略文件（可选）                                                         │ │
│  │  ┌────────────────────────────────────────────────────────────────────┐  │ │
│  │  │ **/*.test.ts, **/*.spec.ts, **/dist/**                             │  │ │
│  │  └────────────────────────────────────────────────────────────────────┘  │ │
│  │  💡 这些文件变更时不触发                                                  │ │
│  │                                                                          │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                                │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │                          🎯 运行配置                                       │ │
│  ├──────────────────────────────────────────────────────────────────────────┤ │
│  │                                                                          │ │
│  │  支持的语言（可多选）                                                     │ │
│  │  ☑ TypeScript    ☑ JavaScript    ☑ Python       ☐ Java                 │ │
│  │  ☐ Go            ☐ Rust          ☐ C++          ☐ Ruby                 │ │
│  │  ☐ PHP           ☐ Swift         ☐ Kotlin       ☐ 其他                 │ │
│  │                                                                          │ │
│  │  支持的框架（可多选）                                                     │ │
│  │  ☑ React         ☑ Node.js       ☐ Vue.js       ☐ Angular              │ │
│  │  ☐ Next.js       ☐ Express       ☐ NestJS       ☐ Django               │ │
│  │  ☐ Flask         ☐ FastAPI       ☐ Spring       ☐ 其他                 │ │
│  │                                                                          │ │
│  │  超时设置                                                                 │ │
│  │  ┌────────────────────────────────────────────────────────────────────┐  │ │
│  │  │ 120                                        秒                        │  │ │
│  │  └────────────────────────────────────────────────────────────────────┘  │ │
│  │  [━━━━━━━━━━━━━━━━━━━━━━━━━━━━━] 120 秒 / 600 秒                        │ │
│  │  💡 建议：简单检查 60s，代码审查 120s，深度分析 300s                      │ │
│  │                                                                          │ │
│  │  重试次数                                                                 │ │
│  │  ┌────────────────────────────────────────────────────────────────────┐  │ │
│  │  │ 3                                          次                        │  │ │
│  │  └────────────────────────────────────────────────────────────────────┘  │ │
│  │  💡 失败后自动重试次数，0 表示不重试                                      │ │
│  │                                                                          │ │
│  │  并发限制                                                                 │ │
│  │  ┌────────────────────────────────────────────────────────────────────┐  │ │
│  │  │ 5                                          个                        │  │ │
│  │  └────────────────────────────────────────────────────────────────────┘  │ │
│  │  💡 同时运行的最大实例数                                                  │ │
│  │                                                                          │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                                │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │                          📊 模板信息                                       │ │
│  ├──────────────────────────────────────────────────────────────────────────┤ │
│  │                                                                          │ │
│  │  💡 模板: Code Review Agent                                               │ │
│  │                                                                          │ │
│  │  ✓ 3 个 Agents 已预配置                                                  │ │
│  │    • reviewer (主要)                                                     │ │
│  │    • style-checker (辅助)                                                │ │
│  │    • security-scanner (验证器)                                           │ │
│  │                                                                          │ │
│  │  📝 建议的工作流程:                                                       │ │
│  │    1. reviewer 检查整体代码质量                                          │ │
│  │    2. style-checker 验证代码风格                                         │ │
│  │    3. security-scanner 扫描安全问题                                      │ │
│  │                                                                          │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                                │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │                          ✅ 配置验证                                       │ │
│  ├──────────────────────────────────────────────────────────────────────────┤ │
│  │                                                                          │ │
│  │  ✓ 所有必填字段已填写                                                     │ │
│  │  ✓ 插件名称格式正确                                                       │ │
│  │  ✓ 版本号遵循 SemVer 规范                                                │ │
│  │  ✓ 邮箱格式正确                                                           │ │
│  │  ✓ GitHub URL 格式正确                                                   │ │
│  │  ✓ 至少选择了一个触发条件                                                 │ │
│  │  ✓ 配置完整，可以继续下一步                                               │ │
│  │                                                                          │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                                │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │ [← 上一步]                  [保存草稿]                [下一步：设计 Agents →]│ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                                │
└────────────────────────────────────────────────────────────────────────────────┘
```

## 高级模式

当用户切换到"高级模式"时，显示更多专业配置选项：

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  配置模式:  ○ 简单模式   ● 高级模式                                           │
└────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                          🔧 高级配置                                           │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  环境变量                                                                     │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │ KEY                           VALUE                          [删除]     │  │
│  ├────────────────────────────────────────────────────────────────────────┤  │
│  │ GITHUB_TOKEN                  ${{ secrets.GITHUB_TOKEN }}   [×]        │  │
│  │ OPENAI_API_KEY                ${{ secrets.OPENAI_KEY }}     [×]        │  │
│  │ LOG_LEVEL                     info                          [×]        │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│  [+ 添加环境变量]                                                             │
│                                                                              │
│  依赖项                                                                       │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │ 包名                          版本                           [删除]     │  │
│  ├────────────────────────────────────────────────────────────────────────┤  │
│  │ @anthropic-ai/sdk             ^0.27.0                       [×]        │  │
│  │ @octokit/rest                 ^20.0.0                       [×]        │  │
│  │ zod                           ^3.22.0                       [×]        │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│  [+ 添加依赖项]                                                               │
│                                                                              │
│  自定义配置（YAML）                                                           │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │ # 自定义插件配置                                                        │  │
│  │ advanced:                                                               │  │
│  │   cache:                                                                │  │
│  │     enabled: true                                                       │  │
│  │     ttl: 3600                                                           │  │
│  │   monitoring:                                                           │  │
│  │     enabled: true                                                       │  │
│  │     metrics:                                                            │  │
│  │       - execution_time                                                  │  │
│  │       - error_rate                                                      │  │
│  │   notifications:                                                        │  │
│  │     slack:                                                              │  │
│  │       enabled: true                                                     │  │
│  │       webhook_url: ${{ secrets.SLACK_WEBHOOK }}                        │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│  [验证 YAML]  [格式化]                                                        │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

## 📊 配置数据结构

```typescript
interface PluginConfig {
  // 基本信息
  basic: {
    name: string;              // 插件名称（必填）
    description: string;        // 描述（必填）
    version: string;            // 版本号（必填，SemVer格式）
  };
  
  // 作者信息
  author: {
    name: string;              // 作者姓名（必填）
    email: string;             // 作者邮箱（必填）
    organization?: string;      // 组织/公司（可选）
  };
  
  // 仓库信息
  repository: {
    url?: string;              // GitHub 仓库 URL（可选）
    homepage?: string;         // 主页 URL（可选）
    license: string;           // 许可证（必填）
  };
  
  // 分类和标签
  classification: {
    category: string;          // 插件类别（必填）
    tags: string[];            // 标签数组（可选）
  };
  
  // 触发配置
  triggers: {
    events: string[];          // 触发事件数组（必填，至少一个）
    filePatterns?: string[];   // 文件过滤模式（可选）
    ignorePatterns?: string[]; // 忽略文件模式（可选）
    schedule?: string;         // Cron 表达式（可选）
  };
  
  // 运行配置
  runtime: {
    languages: string[];       // 支持的语言（可选）
    frameworks: string[];      // 支持的框架（可选）
    timeout: number;           // 超时时间（秒）
    retries: number;           // 重试次数
    concurrency: number;       // 并发限制
  };
  
  // 模板信息
  template: {
    id: string;                // 模板 ID
    name: string;              // 模板名称
    agentsCount: number;       // 预配置的 Agents 数量
  };
  
  // 高级配置（高级模式）
  advanced?: {
    environment?: Record<string, string>;  // 环境变量
    dependencies?: Record<string, string>; // 依赖项
    customConfig?: string;                 // 自定义 YAML 配置
  };
}
```

## 💡 交互细节

### 1. 实时验证

```typescript
// 插件名称验证
const validatePluginName = (name: string) => {
  const errors: string[] = [];
  
  if (!name) {
    errors.push('插件名称不能为空');
  }
  if (!/^[a-z0-9-]+$/.test(name)) {
    errors.push('只能包含小写字母、数字和连字符');
  }
  if (name.length < 3) {
    errors.push('名称至少需要 3 个字符');
  }
  if (name.length > 50) {
    errors.push('名称不能超过 50 个字符');
  }
  if (name.startsWith('-') || name.endsWith('-')) {
    errors.push('不能以连字符开头或结尾');
  }
  
  return errors;
};

// 版本号验证（SemVer）
const validateVersion = (version: string) => {
  const semverRegex = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
  
  if (!semverRegex.test(version)) {
    return ['版本号必须遵循 SemVer 规范（例如：1.0.0）'];
  }
  
  return [];
};

// 邮箱验证
const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return ['邮箱格式不正确'];
  }
  
  return [];
};

// GitHub URL 验证
const validateGitHubUrl = (url: string) => {
  if (!url) return [];
  
  const githubRegex = /^https:\/\/github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+$/;
  
  if (!githubRegex.test(url)) {
    return ['GitHub URL 格式不正确（例如：https://github.com/user/repo）'];
  }
  
  return [];
};
```

### 2. 智能建议

```typescript
// 根据插件类别推荐标签
const suggestTags = (category: string): string[] => {
  const tagMap: Record<string, string[]> = {
    'Code Quality': ['linting', 'code-review', 'best-practices', 'refactoring'],
    'Testing': ['unit-test', 'integration-test', 'e2e', 'coverage'],
    'Documentation': ['docs', 'api-docs', 'readme', 'comments'],
    'Security': ['security', 'vulnerability', 'audit', 'cve'],
    'Debugging': ['debug', 'error-tracking', 'logging', 'profiling'],
    'Performance': ['optimization', 'profiling', 'benchmarking', 'metrics'],
    'Deployment': ['ci-cd', 'deployment', 'release', 'versioning'],
    'DevOps': ['automation', 'infrastructure', 'monitoring', 'alerting'],
  };
  
  return tagMap[category] || [];
};

// 根据超时时间给出建议
const suggestTimeout = (category: string): { value: number; reason: string } => {
  const timeoutMap: Record<string, { value: number; reason: string }> = {
    'Code Quality': { value: 120, reason: '代码审查通常需要 1-2 分钟' },
    'Testing': { value: 180, reason: '运行测试可能需要 2-3 分钟' },
    'Security': { value: 300, reason: '安全扫描可能需要 3-5 分钟' },
    'Documentation': { value: 60, reason: '文档生成通常较快' },
  };
  
  return timeoutMap[category] || { value: 120, reason: '默认超时时间' };
};
```

### 3. 自动填充

```typescript
// 根据 GitHub URL 自动填充作者信息
const autofillFromGitHub = async (githubUrl: string) => {
  try {
    const match = githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) return null;
    
    const [, owner, repo] = match;
    
    // 调用 GitHub API 获取仓库信息
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
    const data = await response.json();
    
    return {
      author: {
        name: data.owner.login,
        organization: data.owner.type === 'Organization' ? data.owner.login : undefined,
      },
      repository: {
        homepage: data.homepage || data.html_url,
        license: data.license?.spdx_id || 'MIT',
      },
      classification: {
        tags: data.topics || [],
      },
    };
  } catch (error) {
    console.error('Failed to fetch GitHub data:', error);
    return null;
  }
};
```

### 4. 进度保存

```typescript
// 自动保存草稿
const autosaveDraft = useCallback(
  debounce((config: PluginConfig) => {
    try {
      localStorage.setItem('plugin-config-draft', JSON.stringify(config));
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  }, 1000),
  []
);

// 恢复草稿
const restoreDraft = (): PluginConfig | null => {
  try {
    const draft = localStorage.getItem('plugin-config-draft');
    return draft ? JSON.parse(draft) : null;
  } catch (error) {
    console.error('Failed to restore draft:', error);
    return null;
  }
};

// 清空草稿
const clearDraft = () => {
  try {
    localStorage.removeItem('plugin-config-draft');
  } catch (error) {
    console.error('Failed to clear draft:', error);
  }
};
```

## 🎨 UI 组件

### 1. 配置表单组件

```typescript
interface ConfigFormProps {
  mode: 'simple' | 'advanced';
  initialConfig?: PluginConfig;
  template?: Template;
  onConfigChange: (config: PluginConfig) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ConfigForm({
  mode,
  initialConfig,
  template,
  onConfigChange,
  onNext,
  onBack
}: ConfigFormProps) {
  const [config, setConfig] = useState<PluginConfig>(
    initialConfig || getDefaultConfig(template)
  );
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  
  // 验证配置
  const validateConfig = () => {
    const newErrors: Record<string, string[]> = {};
    
    // 验证各个字段
    newErrors.name = validatePluginName(config.basic.name);
    newErrors.version = validateVersion(config.basic.version);
    newErrors.email = validateEmail(config.author.email);
    // ... 更多验证
    
    setErrors(newErrors);
    
    // 返回是否有错误
    return Object.values(newErrors).every(errs => errs.length === 0);
  };
  
  // 处理字段变更
  const handleFieldChange = (field: string, value: any) => {
    const newConfig = { ...config };
    set(newConfig, field, value); // 使用 lodash.set
    setConfig(newConfig);
    onConfigChange(newConfig);
    
    // 自动保存
    autosaveDraft(newConfig);
  };
  
  // 处理下一步
  const handleNext = () => {
    if (validateConfig()) {
      clearDraft(); // 清空草稿
      onNext();
    }
  };
  
  return (
    <div className="config-form">
      {/* 基本信息部分 */}
      <ConfigSection title="基本信息">
        <TextField
          label="插件名称"
          required
          value={config.basic.name}
          onChange={(value) => handleFieldChange('basic.name', value)}
          error={errors.name}
          placeholder="例如：my-code-reviewer"
          hint="使用小写字母和连字符"
        />
        
        <TextAreaField
          label="描述"
          required
          value={config.basic.description}
          onChange={(value) => handleFieldChange('basic.description', value)}
          error={errors.description}
          placeholder="描述您的插件功能..."
          hint="清晰描述插件的功能和价值"
        />
        
        <TextField
          label="版本号"
          required
          value={config.basic.version}
          onChange={(value) => handleFieldChange('basic.version', value)}
          error={errors.version}
          placeholder="1.0.0"
          hint="遵循语义化版本规范 (SemVer)"
        />
      </ConfigSection>
      
      {/* 作者信息部分 */}
      <ConfigSection title="作者信息">
        {/* ... */}
      </ConfigSection>
      
      {/* 仓库信息部分 */}
      <ConfigSection title="仓库信息">
        {/* ... */}
      </ConfigSection>
      
      {/* 分类和标签部分 */}
      <ConfigSection title="分类和标签">
        {/* ... */}
      </ConfigSection>
      
      {/* 触发配置部分 */}
      <ConfigSection title="触发配置">
        {/* ... */}
      </ConfigSection>
      
      {/* 运行配置部分 */}
      <ConfigSection title="运行配置">
        {/* ... */}
      </ConfigSection>
      
      {/* 模板信息部分 */}
      {template && (
        <ConfigSection title="模板信息">
          <TemplateInfo template={template} />
        </ConfigSection>
      )}
      
      {/* 配置验证部分 */}
      <ConfigSection title="配置验证">
        <ValidationStatus errors={errors} />
      </ConfigSection>
      
      {/* 操作按钮 */}
      <div className="actions">
        <Button variant="secondary" onClick={onBack}>
          ← 上一步
        </Button>
        <Button variant="secondary" onClick={handleSaveDraft}>
          保存草稿
        </Button>
        <Button variant="primary" onClick={handleNext}>
          下一步：设计 Agents →
        </Button>
      </div>
    </div>
  );
}
```

## 📈 预期效果

### 用户体验
- ✅ 配置界面清晰直观
- ✅ 实时验证和反馈
- ✅ 智能建议和自动填充
- ✅ 支持简单/高级模式切换
- ✅ 自动保存草稿
- ✅ 完整的帮助提示

### 配置完整性
- ✅ 10+ 配置项
- ✅ 必填/可选字段明确
- ✅ 格式验证准确
- ✅ 默认值合理

### 开发效率
- 传统方式：手写配置文件 30-60 分钟
- 使用此页面：3-5 分钟完成
- **效率提升：10x+**

---

**状态**: 🎨 设计完成，待实施
