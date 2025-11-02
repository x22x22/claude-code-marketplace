'use client';

import { useState } from 'react';

interface Message {
  role: 'ai' | 'user';
  content: string;
  timestamp: Date;
}

interface AgentSpec {
  name: string;
  role: string;
  responsibilities: string[];
  checkItems: string[];
  inputs: string[];
  outputs: string[];
  language: string;
  framework: string;
}

interface Props {
  locale: 'zh' | 'en';
  onNext: (spec: AgentSpec) => void;
  onBack: () => void;
}

export default function AIAgentDesigner({ locale, onNext, onBack }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content: locale === 'zh' 
        ? '您好！我是您的 Agent 设计助手。让我帮您设计一个专业的 Agent。\n\n请用一句话描述：这个 Agent 要做什么？'
        : 'Hello! I\'m your Agent design assistant. Let me help you design a professional Agent.\n\nPlease describe in one sentence: What should this Agent do?',
      timestamp: new Date()
    }
  ]);
  
  const [userInput, setUserInput] = useState('');
  const [currentStep, setCurrentStep] = useState<'describe' | 'checkitems' | 'refine' | 'complete'>('describe');
  const [selectedCheckItems, setSelectedCheckItems] = useState<string[]>([]);
  const [agentSpec, setAgentSpec] = useState<AgentSpec>({
    name: 'reviewer',
    role: locale === 'zh' ? '主要审查 Agent' : 'Primary Review Agent',
    responsibilities: [],
    checkItems: [],
    inputs: [],
    outputs: [],
    language: 'TypeScript',
    framework: 'React'
  });

  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [qualityScore, setQualityScore] = useState({
    total: 0,
    completeness: 0,
    clarity: 0,
    executable: 0,
    bestPractices: 0
  });

  const t = locale === 'zh' ? {
    title: '使用 AI 助手设计您的 Agents',
    aiMode: 'AI 辅助模式',
    standardMode: '标准模式',
    advancedMode: '高级模式',
    aiChat: '💬 AI 对话',
    specPreview: '📋 规范预览',
    generatedResults: '📦 生成结果',
    inputPlaceholder: '输入您的回复...',
    send: '发送',
    agentName: 'Agent 名称',
    role: '角色',
    responsibilities: '职责',
    checkItems: '检查项目',
    inputs: '输入',
    outputs: '输出',
    configuration: '配置',
    language: '语言',
    framework: '框架',
    optimizeSpec: '优化规范',
    validationResults: '✅ 验证结果',
    specComplete: '规范完整',
    specClear: '职责明确',
    promptClear: '提示词清晰',
    suggestAddExample: '建议添加示例',
    viewDetails: '查看详情',
    agentConfig: 'Agent 配置',
    prompt: 'Prompt',
    testCases: '测试用例',
    copyConfig: '复制配置',
    copyPrompt: '复制 Prompt',
    download: '下载',
    qualityScore: '质量评分',
    totalScore: '总分',
    completeness: '完整性',
    clarity: '清晰度',
    executable: '可执行',
    bestPractices: '最佳实践',
    suggestions: '💡 智能建议',
    addErrorHandling: '添加错误处理',
    setPriority: '设置优先级',
    configureNotifications: '配置通知规则',
    referBestPractices: '参考最佳实践',
    viewAllSuggestions: '查看所有建议',
    next: '下一步',
    back: '返回'
  } : {
    title: 'Design Your Agents with AI Assistant',
    aiMode: 'AI-Assisted Mode',
    standardMode: 'Standard Mode',
    advancedMode: 'Advanced Mode',
    aiChat: '💬 AI Chat',
    specPreview: '📋 Spec Preview',
    generatedResults: '📦 Generated Results',
    inputPlaceholder: 'Type your response...',
    send: 'Send',
    agentName: 'Agent Name',
    role: 'Role',
    responsibilities: 'Responsibilities',
    checkItems: 'Check Items',
    inputs: 'Inputs',
    outputs: 'Outputs',
    configuration: 'Configuration',
    language: 'Language',
    framework: 'Framework',
    optimizeSpec: 'Optimize Spec',
    validationResults: '✅ Validation Results',
    specComplete: 'Spec Complete',
    specClear: 'Responsibilities Clear',
    promptClear: 'Prompt Clear',
    suggestAddExample: 'Suggest Adding Examples',
    viewDetails: 'View Details',
    agentConfig: 'Agent Config',
    prompt: 'Prompt',
    testCases: 'Test Cases',
    copyConfig: 'Copy Config',
    copyPrompt: 'Copy Prompt',
    download: 'Download',
    qualityScore: 'Quality Score',
    totalScore: 'Total Score',
    completeness: 'Completeness',
    clarity: 'Clarity',
    executable: 'Executable',
    bestPractices: 'Best Practices',
    suggestions: '💡 Smart Suggestions',
    addErrorHandling: 'Add error handling',
    setPriority: 'Set priority',
    configureNotifications: 'Configure notifications',
    referBestPractices: 'Reference best practices',
    viewAllSuggestions: 'View All Suggestions',
    next: 'Next',
    back: 'Back'
  };

  const checkItemOptions = locale === 'zh' ? [
    '代码风格',
    '命名规范',
    '最佳实践',
    '安全问题',
    '性能优化',
    '测试覆盖'
  ] : [
    'Code Style',
    'Naming Conventions',
    'Best Practices',
    'Security Issues',
    'Performance',
    'Test Coverage'
  ];

  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    const newMessage: Message = {
      role: 'user',
      content: userInput,
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    
    // 模拟 AI 响应
    setTimeout(() => {
      let aiResponse = '';
      
      if (currentStep === 'describe') {
        aiResponse = locale === 'zh'
          ? `很好！让我问几个问题来完善设计：\n\n这个 Agent 应该检查哪些方面？\n（请选择适用的选项）`
          : `Great! Let me ask a few questions to refine the design:\n\nWhat aspects should this Agent check?\n(Please select applicable options)`;
        
        // 更新规范
        setAgentSpec({
          ...agentSpec,
          name: 'reviewer',
          role: locale === 'zh' ? '主要审查 Agent' : 'Primary Review Agent',
          responsibilities: [
            locale === 'zh' ? '审查 PR 代码' : 'Review PR code',
            locale === 'zh' ? '检查代码质量' : 'Check code quality',
            locale === 'zh' ? '提供改进建议' : 'Provide improvement suggestions'
          ]
        });
        
        setCurrentStep('checkitems');
      } else if (currentStep === 'checkitems') {
        aiResponse = locale === 'zh'
          ? `太好了！基于您的选择，我已经生成了一个完整的 Agent 规范。\n\n请查看右侧的规范预览和生成的代码。您可以继续优化，或者点击"下一步"继续。`
          : `Excellent! Based on your selections, I've generated a complete Agent specification.\n\nPlease review the spec preview and generated code on the right. You can continue optimizing or click "Next" to proceed.`;
        
        // 更新规范
        setAgentSpec({
          ...agentSpec,
          checkItems: selectedCheckItems,
          inputs: [
            'PR diff',
            locale === 'zh' ? '文件列表' : 'File list',
            locale === 'zh' ? '项目上下文' : 'Project context'
          ],
          outputs: [
            locale === 'zh' ? '审查报告' : 'Review report',
            locale === 'zh' ? '改进建议列表' : 'Improvement suggestions',
            locale === 'zh' ? '严重程度评级' : 'Severity rating'
          ]
        });
        
        // 生成 Prompt
        const prompt = locale === 'zh'
          ? `You are a code review agent. Your role is to:

1. Analyze code changes in pull requests
2. Check for issues related to:
${selectedCheckItems.map(item => `   - ${item}`).join('\n')}
3. Provide actionable suggestions

Focus on:
- Code style and consistency
- Best practices
- Security concerns
- Performance optimization

Provide clear, constructive feedback.`
          : `You are a code review agent. Your role is to:

1. Analyze code changes in pull requests
2. Check for issues related to:
${selectedCheckItems.map(item => `   - ${item}`).join('\n')}
3. Provide actionable suggestions

Focus on:
- Code style and consistency
- Best practices
- Security concerns
- Performance optimization

Provide clear, constructive feedback.`;
        
        setGeneratedPrompt(prompt);
        
        // 计算质量分数
        setQualityScore({
          total: 95,
          completeness: 95,
          clarity: 90,
          executable: 98,
          bestPractices: 92
        });
        
        setCurrentStep('complete');
      }
      
      const aiMessage: Message = {
        role: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, aiMessage]);
    }, 1000);

    setUserInput('');
  };

  const toggleCheckItem = (item: string) => {
    if (selectedCheckItems.includes(item)) {
      setSelectedCheckItems(selectedCheckItems.filter(i => i !== item));
    } else {
      setSelectedCheckItems([...selectedCheckItems, item]);
    }
  };

  const handleSelectAllCheckItems = () => {
    setSelectedCheckItems(checkItemOptions);
  };

  const handleContinue = () => {
    if (currentStep === 'checkitems' && selectedCheckItems.length > 0) {
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">🤖 {t.title}</h2>
      </div>

      {/* 模式切换 */}
      <div className="flex gap-4 mb-8 justify-center">
        <button className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium">
          {t.aiMode}
        </button>
        <button className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium">
          {t.standardMode}
        </button>
        <button className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium">
          {t.advancedMode}
        </button>
      </div>

      {/* 三栏布局 */}
      <div className="grid grid-cols-12 gap-6 h-[600px]">
        {/* AI 对话区 (40%) */}
        <div className="col-span-5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold">{t.aiChat}</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'ai' && (
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white">🤖</span>
                  </div>
                )}
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  msg.role === 'ai'
                    ? 'bg-gray-100 dark:bg-gray-700'
                    : 'bg-blue-500 text-white'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white">👤</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 复选框（仅在 checkitems 步骤显示） */}
          {currentStep === 'checkitems' && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-2 mb-4">
                {checkItemOptions.map((item) => (
                  <label key={item} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedCheckItems.includes(item)}
                      onChange={() => toggleCheckItem(item)}
                      className="rounded"
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSelectAllCheckItems}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {locale === 'zh' ? '全选' : 'Select All'}
                </button>
                <button
                  onClick={handleContinue}
                  disabled={selectedCheckItems.length === 0}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {locale === 'zh' ? '继续' : 'Continue'}
                </button>
              </div>
            </div>
          )}

          {/* 输入框 */}
          {(currentStep === 'describe' || currentStep === 'complete') && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={t.inputPlaceholder}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  {t.send}
                </button>
              </div>
            </div>
          )}

          {/* 智能建议 */}
          {currentStep === 'complete' && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-yellow-50 dark:bg-yellow-900/20">
              <h4 className="font-semibold mb-2">{t.suggestions}</h4>
              <ul className="text-sm space-y-1">
                <li>• {t.addErrorHandling}</li>
                <li>• {t.setPriority}</li>
                <li>• {t.configureNotifications}</li>
                <li>• {t.referBestPractices}</li>
              </ul>
              <button className="mt-2 text-blue-500 hover:text-blue-600 text-sm">
                {t.viewAllSuggestions}
              </button>
            </div>
          )}
        </div>

        {/* 规范预览区 (30%) */}
        <div className="col-span-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold">{t.specPreview}</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div>
              <h4 className="font-bold text-lg mb-2"># {agentSpec.name}</h4>
              
              <div className="space-y-3">
                <div>
                  <p className="font-semibold">{t.role}:</p>
                  <p className="text-gray-600 dark:text-gray-400">{agentSpec.role}</p>
                </div>

                {agentSpec.responsibilities.length > 0 && (
                  <div>
                    <p className="font-semibold">{t.responsibilities}:</p>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                      {agentSpec.responsibilities.map((resp, idx) => (
                        <li key={idx}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {agentSpec.checkItems.length > 0 && (
                  <div>
                    <p className="font-semibold">{t.checkItems}:</p>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                      {agentSpec.checkItems.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {agentSpec.inputs.length > 0 && (
                  <div>
                    <p className="font-semibold">{t.inputs}:</p>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                      {agentSpec.inputs.map((input, idx) => (
                        <li key={idx}>{input}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {agentSpec.outputs.length > 0 && (
                  <div>
                    <p className="font-semibold">{t.outputs}:</p>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                      {agentSpec.outputs.map((output, idx) => (
                        <li key={idx}>{output}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <p className="font-semibold">{t.configuration}:</p>
                  <p className="text-gray-600 dark:text-gray-400">• {t.language}: {agentSpec.language}</p>
                  <p className="text-gray-600 dark:text-gray-400">• {t.framework}: {agentSpec.framework}</p>
                </div>
              </div>
            </div>

            {currentStep === 'complete' && (
              <div>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 w-full">
                  {t.optimizeSpec}
                </button>
              </div>
            )}
          </div>

          {/* 验证结果 */}
          {currentStep === 'complete' && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-green-50 dark:bg-green-900/20">
              <h4 className="font-semibold mb-2">{t.validationResults}</h4>
              <div className="text-sm space-y-1">
                <p>✓ {t.specComplete}</p>
                <p>✓ {t.specClear}</p>
                <p>✓ {t.promptClear}</p>
                <p>⚠ {t.suggestAddExample}</p>
              </div>
              <button className="mt-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 text-sm">
                {t.viewDetails}
              </button>
            </div>
          )}
        </div>

        {/* 生成结果区 (30%) */}
        <div className="col-span-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold">{t.generatedResults}</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {currentStep === 'complete' ? (
              <>
                <div>
                  <h4 className="font-semibold mb-2">💾 {t.agentConfig}</h4>
                  <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded text-xs overflow-x-auto">
{`name: ${agentSpec.name}
type: primary
role: code_reviewer
triggers:
  - pull_request`}
                  </pre>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">📝 {t.prompt}</h4>
                  <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded text-xs overflow-x-auto whitespace-pre-wrap">
{generatedPrompt}
                  </pre>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">🧪 {t.testCases}</h4>
                  <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded text-xs overflow-x-auto">
{`// Test case 1:
// PR with style issues
const input = {...};
const expected = {...};`}
                  </pre>
                </div>

                <div className="space-y-2">
                  <button className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm">
                    {t.copyConfig}
                  </button>
                  <button className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm">
                    {t.copyPrompt}
                  </button>
                  <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm">
                    {t.download}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-400 py-8">
                {locale === 'zh' ? '完成对话后，生成的代码将显示在这里' : 'Generated code will appear here after completing the conversation'}
              </div>
            )}
          </div>

          {/* 质量评分 */}
          {currentStep === 'complete' && qualityScore.total > 0 && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20">
              <h4 className="font-semibold mb-2">📊 {t.qualityScore}</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>{t.totalScore}:</span>
                  <span className="font-bold text-blue-600">{qualityScore.total}/100</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.completeness}:</span>
                  <span>{qualityScore.completeness}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.clarity}:</span>
                  <span>{qualityScore.clarity}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.executable}:</span>
                  <span>{qualityScore.executable}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.bestPractices}:</span>
                  <span>{qualityScore.bestPractices}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 导航按钮 */}
      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          ← {t.back}
        </button>
        <button
          onClick={() => onNext(agentSpec)}
          disabled={currentStep !== 'complete'}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t.next} →
        </button>
      </div>
    </div>
  );
}
