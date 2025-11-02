// 国际化翻译配置
export type Locale = 'zh' | 'en';

export const translations = {
  zh: {
    // 头部
    title: 'Claude Plugin Studio',
    subtitle: '可视化插件开发工具',
    backToMarketplace: '← 返回市场',
    
    // 步骤
    steps: {
      welcome: '欢迎',
      template: '选择模板',
      configure: '配置',
      agents: '设计 Agents',
      test: '测试调试',
      deploy: '部署'
    },
    
    // 欢迎页面
    welcome: {
      title: '欢迎使用 Claude Plugin Studio',
      subtitle: '使用可视化开发工具在几分钟内创建专业的 Claude Code 插件，无需编码！',
      fastDev: {
        title: '快速开发',
        desc: '使用模板和可视化工具，开发速度提升 80%'
      },
      builtInTest: {
        title: '内置测试',
        desc: '部署前测试和调试您的插件'
      },
      oneClick: {
        title: '一键部署',
        desc: '一键部署到 GitHub 和市场'
      },
      getStarted: '开始使用 →'
    },
    
    // 模板页面
    template: {
      title: '选择模板',
      subtitle: '从预建模板开始或从头创建',
      templates: {
        'code-review': {
          name: '代码审查 Agent',
          description: '自动化代码审查，检查最佳实践',
          useCase: 'PR 审查自动化'
        },
        'testing': {
          name: '测试生成器',
          description: '自动生成单元测试和集成测试',
          useCase: '测试自动化'
        },
        'documentation': {
          name: '文档编写器',
          description: '从代码生成全面的文档',
          useCase: '文档自动化'
        },
        'debugging': {
          name: '调试助手',
          description: '交互式调试和错误分析',
          useCase: '调试支持'
        },
        'custom': {
          name: '从头开始',
          description: '从零构建自定义插件',
          useCase: '自定义工作流'
        }
      },
      agentsCount: '个 agents'
    },
    
    // 配置页面
    configure: {
      title: '配置您的插件',
      subtitle: '关于您插件的基本信息',
      pluginName: '插件名称',
      pluginNamePlaceholder: '例如：my-code-reviewer',
      description: '描述',
      descriptionPlaceholder: '描述您的插件功能...',
      template: '模板',
      agentsPreconfigured: '个 agents 已预配置',
      required: '必填'
    },
    
    // Agents 页面
    agents: {
      title: '设计您的 Agents',
      subtitle: '自定义 agent 提示词和行为',
      addAgent: '+ 添加 Agent',
      agentPrompt: 'Agent 提示词',
      promptPlaceholder: '在此编写 agent 的提示词...',
      tip: '💡 提示：明确说明 agent 的角色、职责和预期行为',
      delete: '🗑️ 删除',
      types: {
        primary: '主要',
        helper: '辅助',
        validator: '验证器'
      },
      noAgents: '还没有 agents。点击"添加 Agent"创建一个。'
    },
    
    // 测试页面
    test: {
      title: '测试和调试您的插件',
      subtitle: '在部署前运行测试和调试插件',
      summary: '插件摘要',
      name: '名称',
      template: '模板',
      agentsCount: 'Agents',
      runTests: '▶️ 运行测试',
      runningTests: '🔄 正在运行测试...',
      clearOutput: '清空输出',
      debugMode: '调试模式',
      debugModeDesc: '实时查看 agents 执行，包含详细日志',
      consoleOutput: '控制台输出',
      clickToSee: '点击"运行测试"查看输出...',
      // 测试输出消息
      testMessages: {
        starting: '开始测试执行...',
        loadingConfig: '✓ 加载插件配置',
        validating: '✓ 验证 agent 提示词',
        foundAgents: '✓ 找到 {count} 个 agents',
        testing: '  → 测试 agent：{name}',
        initialized: '    ✓ Agent "{name}" 初始化成功',
        allPassed: '\n✅ 所有测试通过！',
        ready: '\n插件 "{name}" 已准备好部署。'
      }
    },
    
    // 部署页面
    deploy: {
      title: '准备部署！',
      subtitle: '您的插件已配置和测试完成。部署到 GitHub 和市场。',
      checklist: '部署检查清单',
      checklistItems: {
        configured: '插件已配置',
        agentsDefined: '{count} 个 agents 已定义',
        testsPassed: '测试通过',
        ready: '准备部署'
      },
      deployToGitHub: '部署到 GitHub',
      downloadFiles: '下载插件文件',
      features: '🔒 安全的 GitHub 集成 • 📦 自动版本控制 • 📝 自动生成文档'
    },
    
    // 通用按钮
    buttons: {
      back: '← 返回',
      next: '下一步 →'
    },
    
    // 页脚
    footer: 'Claude Plugin Studio - 让插件开发对每个人都触手可及'
  },
  
  en: {
    // Header
    title: 'Claude Plugin Studio',
    subtitle: 'Visual Plugin Development Tool',
    backToMarketplace: '← Back to Marketplace',
    
    // Steps
    steps: {
      welcome: 'Welcome',
      template: 'Choose Template',
      configure: 'Configure',
      agents: 'Design Agents',
      test: 'Test & Debug',
      deploy: 'Deploy'
    },
    
    // Welcome page
    welcome: {
      title: 'Welcome to Claude Plugin Studio',
      subtitle: 'Create professional Claude Code plugins in minutes with our visual development tool. No coding required!',
      fastDev: {
        title: 'Fast Development',
        desc: 'Create plugins 80% faster with templates and visual tools'
      },
      builtInTest: {
        title: 'Built-in Testing',
        desc: 'Test and debug your plugins before deployment'
      },
      oneClick: {
        title: 'One-Click Deploy',
        desc: 'Deploy to GitHub and marketplace with one click'
      },
      getStarted: 'Get Started →'
    },
    
    // Template page
    template: {
      title: 'Choose a Template',
      subtitle: 'Start with a pre-built template or create from scratch',
      templates: {
        'code-review': {
          name: 'Code Review Agent',
          description: 'Automated code review with best practices checking',
          useCase: 'PR review automation'
        },
        'testing': {
          name: 'Test Generator',
          description: 'Generate unit and integration tests automatically',
          useCase: 'Test automation'
        },
        'documentation': {
          name: 'Documentation Writer',
          description: 'Generate comprehensive documentation from code',
          useCase: 'Documentation automation'
        },
        'debugging': {
          name: 'Debug Assistant',
          description: 'Interactive debugging and error analysis',
          useCase: 'Debugging support'
        },
        'custom': {
          name: 'Start from Scratch',
          description: 'Build a custom plugin from the ground up',
          useCase: 'Custom workflow'
        }
      },
      agentsCount: ' agents'
    },
    
    // Configure page
    configure: {
      title: 'Configure Your Plugin',
      subtitle: 'Basic information about your plugin',
      pluginName: 'Plugin Name',
      pluginNamePlaceholder: 'e.g., my-code-reviewer',
      description: 'Description',
      descriptionPlaceholder: 'Describe what your plugin does...',
      template: 'Template',
      agentsPreconfigured: ' agents pre-configured',
      required: '*'
    },
    
    // Agents page
    agents: {
      title: 'Design Your Agents',
      subtitle: 'Customize agent prompts and behavior',
      addAgent: '+ Add Agent',
      agentPrompt: 'Agent Prompt',
      promptPlaceholder: 'Write the agent\'s prompt here...',
      tip: '💡 Tip: Be specific about the agent\'s role, responsibilities, and expected behavior',
      delete: '🗑️ Delete',
      types: {
        primary: 'Primary',
        helper: 'Helper',
        validator: 'Validator'
      },
      noAgents: 'No agents yet. Click "Add Agent" to create one.'
    },
    
    // Test page
    test: {
      title: 'Test & Debug Your Plugin',
      subtitle: 'Run tests and debug your plugin before deployment',
      summary: 'Plugin Summary',
      name: 'Name',
      template: 'Template',
      agentsCount: 'Agents',
      runTests: '▶️ Run Tests',
      runningTests: '🔄 Running Tests...',
      clearOutput: 'Clear Output',
      debugMode: 'Debug Mode',
      debugModeDesc: 'Watch your agents execute in real-time with detailed logging',
      consoleOutput: 'Console Output',
      clickToSee: 'Click "Run Tests" to see output here...',
      // Test output messages
      testMessages: {
        starting: 'Starting test execution...',
        loadingConfig: '✓ Loading plugin configuration',
        validating: '✓ Validating agent prompts',
        foundAgents: '✓ Found {count} agents',
        testing: '  → Testing agent: {name}',
        initialized: '    ✓ Agent "{name}" initialized successfully',
        allPassed: '\n✅ All tests passed!',
        ready: '\nPlugin "{name}" is ready for deployment.'
      }
    },
    
    // Deploy page
    deploy: {
      title: 'Ready to Deploy!',
      subtitle: 'Your plugin is configured and tested. Deploy it to GitHub and the marketplace.',
      checklist: 'Deployment Checklist',
      checklistItems: {
        configured: 'Plugin configured',
        agentsDefined: '{count} agents defined',
        testsPassed: 'Tests passed',
        ready: 'Ready for deployment'
      },
      deployToGitHub: 'Deploy to GitHub',
      downloadFiles: 'Download Plugin Files',
      features: '🔒 Secure GitHub integration • 📦 Automatic versioning • 📝 Auto-generated docs'
    },
    
    // Common buttons
    buttons: {
      back: '← Back',
      next: 'Next →'
    },
    
    // Footer
    footer: 'Claude Plugin Studio - Making plugin development accessible to everyone'
  }
};

// 辅助函数：替换占位符
export function replacePlaceholders(text: string, replacements: Record<string, string | number>): string {
  let result = text;
  for (const [key, value] of Object.entries(replacements)) {
    result = result.replace(`{${key}}`, String(value));
  }
  return result;
}
