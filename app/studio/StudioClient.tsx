'use client';

import { useState } from 'react';

type Step = 'welcome' | 'template' | 'configure' | 'agents' | 'test' | 'deploy';

interface PluginConfig {
  name: string;
  description: string;
  template: string;
  agents: Agent[];
}

interface Agent {
  id: string;
  name: string;
  prompt: string;
  type: 'primary' | 'helper' | 'validator';
}

interface Template {
  id: string;
  name: string;
  description: string;
  icon: string;
  agents: string[];
  useCase: string;
}

const templates: Template[] = [
  {
    id: 'code-review',
    name: 'Code Review Agent',
    description: 'Automated code review with best practices checking',
    icon: '📝',
    agents: ['reviewer', 'style-checker', 'security-scanner'],
    useCase: 'PR review automation'
  },
  {
    id: 'testing',
    name: 'Test Generator',
    description: 'Generate unit and integration tests automatically',
    icon: '🧪',
    agents: ['test-generator', 'coverage-analyzer'],
    useCase: 'Test automation'
  },
  {
    id: 'documentation',
    name: 'Documentation Writer',
    description: 'Generate comprehensive documentation from code',
    icon: '📚',
    agents: ['doc-generator', 'example-creator'],
    useCase: 'Documentation automation'
  },
  {
    id: 'debugging',
    name: 'Debug Assistant',
    description: 'Interactive debugging and error analysis',
    icon: '🐛',
    agents: ['error-analyzer', 'fix-suggester'],
    useCase: 'Debugging support'
  },
  {
    id: 'custom',
    name: 'Start from Scratch',
    description: 'Build a custom plugin from the ground up',
    icon: '⚡',
    agents: [],
    useCase: 'Custom workflow'
  }
];

export default function StudioClient() {
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [config, setConfig] = useState<PluginConfig>({
    name: '',
    description: '',
    template: '',
    agents: []
  });
  const [testOutput, setTestOutput] = useState<string>('');
  const [isDebugging, setIsDebugging] = useState(false);

  const steps: { id: Step; title: string; icon: string }[] = [
    { id: 'welcome', title: 'Welcome', icon: '👋' },
    { id: 'template', title: 'Choose Template', icon: '📋' },
    { id: 'configure', title: 'Configure', icon: '⚙️' },
    { id: 'agents', title: 'Design Agents', icon: '🤖' },
    { id: 'test', title: 'Test & Debug', icon: '🧪' },
    { id: 'deploy', title: 'Deploy', icon: '🚀' }
  ];

  const getCurrentStepIndex = () => steps.findIndex(s => s.id === currentStep);

  const handleNext = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };

  const handleBack = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  const selectTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setConfig({
        ...config,
        template: templateId,
        agents: template.agents.map(name => ({
          id: Math.random().toString(36).substr(2, 9),
          name,
          prompt: `You are a ${name} agent specialized in ${template.useCase}.`,
          type: name.includes('main') ? 'primary' : 'helper'
        }))
      });
      handleNext();
    }
  };

  const runTest = async () => {
    setIsDebugging(true);
    setTestOutput('Starting test execution...\n');
    
    await new Promise(resolve => setTimeout(resolve, 500));
    setTestOutput(prev => prev + '✓ Loading plugin configuration\n');
    
    await new Promise(resolve => setTimeout(resolve, 500));
    setTestOutput(prev => prev + '✓ Validating agent prompts\n');
    
    await new Promise(resolve => setTimeout(resolve, 500));
    setTestOutput(prev => prev + `✓ Found ${config.agents.length} agents\n`);
    
    for (const agent of config.agents) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setTestOutput(prev => prev + `  → Testing agent: ${agent.name}\n`);
      await new Promise(resolve => setTimeout(resolve, 400));
      setTestOutput(prev => prev + `    ✓ Agent "${agent.name}" initialized successfully\n`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    setTestOutput(prev => prev + '\n✅ All tests passed!\n');
    setTestOutput(prev => prev + `\nPlugin "${config.name}" is ready for deployment.\n`);
    
    setIsDebugging(false);
  };

  const addAgent = () => {
    const newAgent: Agent = {
      id: Math.random().toString(36).substr(2, 9),
      name: `custom-agent-${config.agents.length + 1}`,
      prompt: 'You are a helpful assistant.',
      type: 'helper'
    };
    setConfig({
      ...config,
      agents: [...config.agents, newAgent]
    });
  };

  const updateAgent = (id: string, updates: Partial<Agent>) => {
    setConfig({
      ...config,
      agents: config.agents.map(agent => 
        agent.id === id ? { ...agent, ...updates } : agent
      )
    });
  };

  const deleteAgent = (id: string) => {
    setConfig({
      ...config,
      agents: config.agents.filter(agent => agent.id !== id)
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🎨</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Claude Plugin Studio
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Visual Plugin Development Tool
                </p>
              </div>
            </div>
            <a
              href="/"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              ← Back to Marketplace
            </a>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    currentStep === step.id
                      ? 'bg-blue-600 text-white'
                      : index < getCurrentStepIndex()
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}
                >
                  <span className="text-xl">{step.icon}</span>
                  <span className="text-sm font-medium hidden sm:inline">
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-600 mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          {/* Welcome Step */}
          {currentStep === 'welcome' && (
            <div className="text-center max-w-2xl mx-auto">
              <div className="text-6xl mb-6">👋</div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Welcome to Claude Plugin Studio
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                Create professional Claude Code plugins in minutes with our visual development tool.
                No coding required!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-3xl mb-2">⚡</div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Fast Development
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Create plugins 80% faster with templates and visual tools
                  </p>
                </div>
                <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-3xl mb-2">🧪</div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Built-in Testing
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Test and debug your plugins before deployment
                  </p>
                </div>
                <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-3xl mb-2">🚀</div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    One-Click Deploy
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Deploy to GitHub and marketplace with one click
                  </p>
                </div>
              </div>
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Get Started →
              </button>
            </div>
          )}

          {/* Template Selection */}
          {currentStep === 'template' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Choose a Template
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start with a pre-built template or create from scratch
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map(template => (
                  <div
                    key={template.id}
                    onClick={() => selectTemplate(template.id)}
                    className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 cursor-pointer transition-all hover:shadow-lg"
                  >
                    <div className="text-4xl mb-3">{template.icon}</div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {template.description}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-500">
                      <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {template.agents.length} agents
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Configure Step */}
          {currentStep === 'configure' && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Configure Your Plugin
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Basic information about your plugin
              </p>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Plugin Name *
                  </label>
                  <input
                    type="text"
                    value={config.name}
                    onChange={e => setConfig({ ...config, name: e.target.value })}
                    placeholder="e.g., my-code-reviewer"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={config.description}
                    onChange={e => setConfig({ ...config, description: e.target.value })}
                    placeholder="Describe what your plugin does..."
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">💡</div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                        Template: {templates.find(t => t.id === config.template)?.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {config.agents.length} agents pre-configured
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Agents Design Step */}
          {currentStep === 'agents' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Design Your Agents
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Customize agent prompts and behavior
                  </p>
                </div>
                <button
                  onClick={addAgent}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  + Add Agent
                </button>
              </div>
              <div className="space-y-4">
                {config.agents.map(agent => (
                  <div
                    key={agent.id}
                    className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={agent.name}
                          onChange={e => updateAgent(agent.id, { name: e.target.value })}
                          className="text-lg font-semibold bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:border-blue-500 outline-none text-gray-900 dark:text-white px-2 py-1 -ml-2"
                        />
                        <select
                          value={agent.type}
                          onChange={e => updateAgent(agent.id, { type: e.target.value as Agent['type'] })}
                          className="ml-3 px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white"
                        >
                          <option value="primary">Primary</option>
                          <option value="helper">Helper</option>
                          <option value="validator">Validator</option>
                        </select>
                      </div>
                      <button
                        onClick={() => deleteAgent(agent.id)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Agent Prompt
                      </label>
                      <textarea
                        value={agent.prompt}
                        onChange={e => updateAgent(agent.id, { prompt: e.target.value })}
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Write the agent's prompt here..."
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        💡 Tip: Be specific about the agent's role, responsibilities, and expected behavior
                      </p>
                    </div>
                  </div>
                ))}
                {config.agents.length === 0 && (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-500">
                    No agents yet. Click "Add Agent" to create one.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Test & Debug Step */}
          {currentStep === 'test' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Test & Debug Your Plugin
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Run tests and debug your plugin before deployment
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Test Controls */}
                <div>
                  <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Plugin Summary
                    </h3>
                    <dl className="space-y-3">
                      <div>
                        <dt className="text-sm text-gray-600 dark:text-gray-400">Name:</dt>
                        <dd className="text-gray-900 dark:text-white font-medium">
                          {config.name || 'Unnamed Plugin'}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-600 dark:text-gray-400">Template:</dt>
                        <dd className="text-gray-900 dark:text-white font-medium">
                          {templates.find(t => t.id === config.template)?.name || 'None'}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-600 dark:text-gray-400">Agents:</dt>
                        <dd className="text-gray-900 dark:text-white font-medium">
                          {config.agents.length}
                        </dd>
                      </div>
                    </dl>
                    <div className="mt-6 space-y-3">
                      <button
                        onClick={runTest}
                        disabled={isDebugging}
                        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {isDebugging ? '🔄 Running Tests...' : '▶️ Run Tests'}
                      </button>
                      <button
                        onClick={() => setTestOutput('')}
                        className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                      >
                        Clear Output
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-start space-x-3">
                      <div className="text-xl">🐛</div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                          Debug Mode
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Watch your agents execute in real-time with detailed logging
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Test Output */}
                <div>
                  <div className="bg-gray-900 text-green-400 p-6 rounded-lg font-mono text-sm h-[500px] overflow-y-auto">
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-700">
                      <span className="text-gray-400">Console Output</span>
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                    </div>
                    {testOutput ? (
                      <pre className="whitespace-pre-wrap">{testOutput}</pre>
                    ) : (
                      <div className="text-gray-600">
                        Click "Run Tests" to see output here...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Deploy Step */}
          {currentStep === 'deploy' && (
            <div className="max-w-2xl mx-auto text-center">
              <div className="text-6xl mb-6">🚀</div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Ready to Deploy!
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                Your plugin is configured and tested. Deploy it to GitHub and the marketplace.
              </p>
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700 mb-8 text-left">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Deployment Checklist
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-700 dark:text-gray-300">
                    <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                    Plugin configured
                  </li>
                  <li className="flex items-center text-gray-700 dark:text-gray-300">
                    <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                    {config.agents.length} agents defined
                  </li>
                  <li className="flex items-center text-gray-700 dark:text-gray-300">
                    <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                    Tests passed
                  </li>
                  <li className="flex items-center text-gray-700 dark:text-gray-300">
                    <span className="text-gray-400 mr-2">○</span>
                    Ready for deployment
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <button className="w-full px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg">
                  Deploy to GitHub
                </button>
                <button className="w-full px-8 py-4 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium">
                  Download Plugin Files
                </button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-6">
                🔒 Secure GitHub integration • 📦 Automatic versioning • 📝 Auto-generated docs
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          {currentStep !== 'welcome' && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleBack}
                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                ← Back
              </button>
              {currentStep !== 'deploy' && (
                <button
                  onClick={handleNext}
                  disabled={
                    (currentStep === 'configure' && (!config.name || !config.description))
                  }
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 pb-8 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>Claude Plugin Studio - Making plugin development accessible to everyone</p>
      </footer>
    </div>
  );
}
