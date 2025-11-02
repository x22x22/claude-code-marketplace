'use client';

import { useState } from 'react';
import EnhancedConfigPage from '../studio/EnhancedConfigPage';
import AIAgentDesigner from '../studio/AIAgentDesigner';

type Page = 'enhanced-config' | 'ai-designer';

export default function StudioDemoClient() {
  const [currentPage, setCurrentPage] = useState<Page>('enhanced-config');
  const [locale, setLocale] = useState<'zh' | 'en'>('zh');

  const toggleLocale = () => {
    setLocale(locale === 'zh' ? 'en' : 'zh');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* 头部导航 */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎨</span>
              <div>
                <h1 className="text-2xl font-bold">Claude Plugin Studio</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {locale === 'zh' ? '可视化插件开发工具 - 增强功能演示' : 'Visual Plugin Development Tool - Enhanced Features Demo'}
                </p>
              </div>
            </div>
            
            <button
              onClick={toggleLocale}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {locale === 'zh' ? 'English' : '中文'}
            </button>
          </div>
        </div>
      </header>

      {/* 页面选择器 */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setCurrentPage('enhanced-config')}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                currentPage === 'enhanced-config'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <div className="text-2xl mb-1">⚙️</div>
              <div className="text-sm font-bold">
                {locale === 'zh' ? '增强配置页面' : 'Enhanced Config Page'}
              </div>
              <div className="text-xs opacity-80 mt-1">
                {locale === 'zh' ? '10+ 配置项 | 实时验证 | 智能建议' : '10+ Config Items | Live Validation | Smart Suggestions'}
              </div>
            </button>

            <button
              onClick={() => setCurrentPage('ai-designer')}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                currentPage === 'ai-designer'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <div className="text-2xl mb-1">🤖</div>
              <div className="text-sm font-bold">
                {locale === 'zh' ? 'AI 辅助设计器' : 'AI Agent Designer'}
              </div>
              <div className="text-xs opacity-80 mt-1">
                {locale === 'zh' ? 'AI 对话 | 规范预览 | 代码生成' : 'AI Chat | Spec Preview | Code Generation'}
              </div>
            </button>
          </div>
        </div>

        {/* 页面内容 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          {currentPage === 'enhanced-config' ? (
            <EnhancedConfigPage
              locale={locale}
              onNext={(config) => {
                console.log('Config submitted:', config);
                alert(locale === 'zh' ? '配置已保存！' : 'Configuration saved!');
              }}
              onBack={() => {}}
            />
          ) : (
            <AIAgentDesigner
              locale={locale}
              onNext={(spec) => {
                console.log('Agent spec generated:', spec);
                alert(locale === 'zh' ? 'Agent 设计完成！' : 'Agent design completed!');
              }}
              onBack={() => {}}
            />
          )}
        </div>
      </div>

      {/* 页脚 */}
      <footer className="mt-12 pb-8 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>Claude Plugin Studio - {locale === 'zh' ? '让插件开发变得简单、高效、智能' : 'Making plugin development simple, efficient, and intelligent'}</p>
      </footer>
    </div>
  );
}
