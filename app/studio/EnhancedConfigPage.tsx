'use client';

import { useState } from 'react';

interface EnhancedConfig {
  // 基本信息
  name: string;
  description: string;
  version: string;
  
  // 作者信息
  authorName: string;
  authorEmail: string;
  organization: string;
  
  // 仓库信息
  githubUrl: string;
  homepage: string;
  license: string;
  
  // 分类和标签
  category: string;
  tags: string[];
  
  // 触发配置
  triggers: string[];
  filePatterns: string[];
  
  // 运行配置
  language: string;
  framework: string;
  timeout: number;
  retry: number;
  
  // 高级配置
  envVars: { key: string; value: string }[];
  dependencies: string[];
}

interface Props {
  locale: 'zh' | 'en';
  onNext: (config: EnhancedConfig) => void;
  onBack: () => void;
}

export default function EnhancedConfigPage({ locale, onNext, onBack }: Props) {
  const [mode, setMode] = useState<'simple' | 'advanced'>('simple');
  const [config, setConfig] = useState<EnhancedConfig>({
    name: '',
    description: '',
    version: '1.0.0',
    authorName: '',
    authorEmail: '',
    organization: '',
    githubUrl: '',
    homepage: '',
    license: 'MIT',
    category: 'code-quality',
    tags: [],
    triggers: ['pull_request'],
    filePatterns: ['**/*.ts', '**/*.tsx'],
    language: 'TypeScript',
    framework: 'React',
    timeout: 300,
    retry: 3,
    envVars: [],
    dependencies: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newTag, setNewTag] = useState('');

  const t = locale === 'zh' ? {
    title: '配置您的插件',
    subtitle: '填写详细的插件配置信息',
    simple: '简单模式',
    advanced: '高级模式',
    basicInfo: '📝 基本信息',
    authorInfo: '👤 作者信息',
    repoInfo: '🔗 仓库信息',
    classification: '🏷️ 分类和标签',
    triggers: '⚙️ 触发配置',
    runtime: '🎯 运行配置',
    advancedConfig: '🔧 高级配置',
    pluginName: '插件名称',
    description: '描述',
    version: '版本号',
    authorName: '作者姓名',
    authorEmail: '作者邮箱',
    organization: '组织/公司',
    githubUrl: 'GitHub 仓库 URL',
    homepage: '主页 URL',
    license: '许可证',
    category: '插件类别',
    tags: '标签',
    triggerEvents: '触发事件',
    filePatterns: '文件过滤器',
    language: '目标语言',
    framework: '框架',
    timeout: '超时时间（秒）',
    retry: '重试次数',
    envVars: '环境变量',
    dependencies: '依赖项',
    next: '下一步',
    back: '返回',
    optional: '可选',
    required: '必填',
    addTag: '添加标签',
    validEmail: '邮箱格式正确',
    invalidEmail: '邮箱格式不正确',
    validUrl: 'URL 格式正确',
    invalidUrl: 'URL 格式不正确',
    tip: '💡 提示',
    tipPluginName: '使用小写字母和连字符，例如：my-awesome-plugin',
    tipDescription: '清晰描述插件的功能和价值，吸引用户使用',
    tipVersion: '遵循语义化版本规范 (SemVer): 主版本.次版本.修订号',
    tipGithubUrl: '将插件托管在 GitHub 可以方便用户查看源码和贡献代码',
    tipLicense: 'MIT 是最常用的开源许可证，适合大多数项目'
  } : {
    title: 'Configure Your Plugin',
    subtitle: 'Fill in detailed plugin configuration',
    simple: 'Simple Mode',
    advanced: 'Advanced Mode',
    basicInfo: '📝 Basic Information',
    authorInfo: '👤 Author Information',
    repoInfo: '🔗 Repository Information',
    classification: '🏷️ Classification & Tags',
    triggers: '⚙️ Trigger Configuration',
    runtime: '🎯 Runtime Configuration',
    advancedConfig: '🔧 Advanced Configuration',
    pluginName: 'Plugin Name',
    description: 'Description',
    version: 'Version',
    authorName: 'Author Name',
    authorEmail: 'Author Email',
    organization: 'Organization/Company',
    githubUrl: 'GitHub Repository URL',
    homepage: 'Homepage URL',
    license: 'License',
    category: 'Plugin Category',
    tags: 'Tags',
    triggerEvents: 'Trigger Events',
    filePatterns: 'File Patterns',
    language: 'Target Language',
    framework: 'Framework',
    timeout: 'Timeout (seconds)',
    retry: 'Retry Count',
    envVars: 'Environment Variables',
    dependencies: 'Dependencies',
    next: 'Next',
    back: 'Back',
    optional: 'Optional',
    required: 'Required',
    addTag: 'Add Tag',
    validEmail: 'Email format is valid',
    invalidEmail: 'Invalid email format',
    validUrl: 'URL format is valid',
    invalidUrl: 'Invalid URL format',
    tip: '💡 Tip',
    tipPluginName: 'Use lowercase letters and hyphens, e.g., my-awesome-plugin',
    tipDescription: 'Clearly describe the plugin functionality and value',
    tipVersion: 'Follow Semantic Versioning (SemVer): MAJOR.MINOR.PATCH',
    tipGithubUrl: 'Hosting on GitHub helps users view source code and contribute',
    tipLicense: 'MIT is the most popular open source license'
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !config.tags.includes(newTag.trim())) {
      setConfig({ ...config, tags: [...config.tags, newTag.trim()] });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setConfig({ ...config, tags: config.tags.filter(t => t !== tag) });
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    
    if (!config.name) newErrors.name = t.required;
    if (!config.description) newErrors.description = t.required;
    if (!config.authorName) newErrors.authorName = t.required;
    if (!config.authorEmail) newErrors.authorEmail = t.required;
    else if (!validateEmail(config.authorEmail)) newErrors.authorEmail = t.invalidEmail;
    
    if (Object.keys(newErrors).length === 0) {
      onNext(config);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">⚙️ {t.title}</h2>
        <p className="text-gray-600 dark:text-gray-400">{t.subtitle}</p>
      </div>

      {/* 模式切换 */}
      <div className="flex gap-4 mb-8 justify-center">
        <button
          onClick={() => setMode('simple')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            mode === 'simple'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          ● {t.simple}
        </button>
        <button
          onClick={() => setMode('advanced')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            mode === 'advanced'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          ○ {t.advanced}
        </button>
      </div>

      <div className="space-y-6">
        {/* 基本信息 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold mb-4">{t.basicInfo}</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {t.pluginName} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={config.name}
                onChange={(e) => setConfig({ ...config, name: e.target.value })}
                placeholder="e.g., my-code-reviewer"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              <p className="text-sm text-gray-500 mt-1">{t.tip} {t.tipPluginName}</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t.description} <span className="text-red-500">*</span>
              </label>
              <textarea
                value={config.description}
                onChange={(e) => setConfig({ ...config, description: e.target.value })}
                placeholder={locale === 'zh' ? '描述您的插件功能...' : 'Describe your plugin...'}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              <p className="text-sm text-gray-500 mt-1">{t.tip} {t.tipDescription}</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t.version} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={config.version}
                onChange={(e) => setConfig({ ...config, version: e.target.value })}
                placeholder="1.0.0"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              />
              <p className="text-sm text-gray-500 mt-1">{t.tip} {t.tipVersion}</p>
            </div>
          </div>
        </div>

        {/* 作者信息 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold mb-4">{t.authorInfo}</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {t.authorName} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={config.authorName}
                onChange={(e) => setConfig({ ...config, authorName: e.target.value })}
                placeholder="Zhang San"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              />
              {errors.authorName && <p className="text-red-500 text-sm mt-1">{errors.authorName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t.authorEmail} <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={config.authorEmail}
                onChange={(e) => setConfig({ ...config, authorEmail: e.target.value })}
                placeholder="zhangsan@example.com"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              />
              {config.authorEmail && validateEmail(config.authorEmail) && (
                <p className="text-green-500 text-sm mt-1">✓ {t.validEmail}</p>
              )}
              {errors.authorEmail && <p className="text-red-500 text-sm mt-1">{errors.authorEmail}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t.organization} <span className="text-gray-400">({t.optional})</span>
              </label>
              <input
                type="text"
                value={config.organization}
                onChange={(e) => setConfig({ ...config, organization: e.target.value })}
                placeholder="Example Corp"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              />
            </div>
          </div>
        </div>

        {/* 仓库信息 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold mb-4">{t.repoInfo}</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {t.githubUrl} <span className="text-gray-400">({t.optional})</span>
              </label>
              <input
                type="url"
                value={config.githubUrl}
                onChange={(e) => setConfig({ ...config, githubUrl: e.target.value })}
                placeholder="https://github.com/username/my-code-reviewer"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              />
              {config.githubUrl && validateUrl(config.githubUrl) && (
                <p className="text-green-500 text-sm mt-1">✓ {t.validUrl}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">{t.tip} {t.tipGithubUrl}</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t.homepage} <span className="text-gray-400">({t.optional})</span>
              </label>
              <input
                type="url"
                value={config.homepage}
                onChange={(e) => setConfig({ ...config, homepage: e.target.value })}
                placeholder="https://my-plugin-docs.com"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t.license} <span className="text-red-500">*</span>
              </label>
              <select
                value={config.license}
                onChange={(e) => setConfig({ ...config, license: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              >
                <option value="MIT">MIT License</option>
                <option value="Apache-2.0">Apache License 2.0</option>
                <option value="GPL-3.0">GPL-3.0</option>
                <option value="BSD-3-Clause">BSD 3-Clause</option>
                <option value="ISC">ISC License</option>
              </select>
              <p className="text-sm text-gray-500 mt-1">{t.tip} {t.tipLicense}</p>
            </div>
          </div>
        </div>

        {/* 分类和标签 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold mb-4">{t.classification}</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {t.category} <span className="text-red-500">*</span>
              </label>
              <select
                value={config.category}
                onChange={(e) => setConfig({ ...config, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              >
                <option value="code-quality">{locale === 'zh' ? '代码质量' : 'Code Quality'}</option>
                <option value="testing">{locale === 'zh' ? '测试' : 'Testing'}</option>
                <option value="documentation">{locale === 'zh' ? '文档' : 'Documentation'}</option>
                <option value="debugging">{locale === 'zh' ? '调试' : 'Debugging'}</option>
                <option value="security">{locale === 'zh' ? '安全' : 'Security'}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t.tags}</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  placeholder={locale === 'zh' ? '添加标签...' : 'Add tag...'}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                />
                <button
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  {t.addTag}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {config.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm flex items-center gap-2"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 高级配置（仅在高级模式显示） */}
        {mode === 'advanced' && (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-4">{t.triggers}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t.triggerEvents}</label>
                  <div className="space-y-2">
                    {['pull_request', 'push', 'issue_comment'].map((event) => (
                      <label key={event} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={config.triggers.includes(event)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setConfig({ ...config, triggers: [...config.triggers, event] });
                            } else {
                              setConfig({ ...config, triggers: config.triggers.filter(t => t !== event) });
                            }
                          }}
                          className="rounded"
                        />
                        <span>{event}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-4">{t.runtime}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t.language}</label>
                  <input
                    type="text"
                    value={config.language}
                    onChange={(e) => setConfig({ ...config, language: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t.framework}</label>
                  <input
                    type="text"
                    value={config.framework}
                    onChange={(e) => setConfig({ ...config, framework: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t.timeout}</label>
                  <input
                    type="number"
                    value={config.timeout}
                    onChange={(e) => setConfig({ ...config, timeout: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t.retry}</label>
                  <input
                    type="number"
                    value={config.retry}
                    onChange={(e) => setConfig({ ...config, retry: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                  />
                </div>
              </div>
            </div>
          </>
        )}
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
          onClick={handleSubmit}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          {t.next} →
        </button>
      </div>
    </div>
  );
}
