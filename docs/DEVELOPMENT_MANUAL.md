# Claude Plugin Studio 开发手册

## 📋 概述

本手册记录了 Claude Plugin Studio 原型开发的完整流程，包括环境配置、开发步骤、测试方法、截图流程等。其他智能体可以按照本手册的指引完成类似的开发任务。

## 🎯 开发目标

1. 分析 161 个 Claude Code 插件，识别模式和痛点
2. 设计可视化的插件开发工具
3. 构建交互式原型（Next.js + React + TypeScript）
4. 实现国际化支持（中文/英文，默认中文）
5. 生成高质量的中文界面截图

## 🛠️ 技术栈

### 前端框架
- **Next.js**: 15.5.4 (App Router)
- **React**: 18+
- **TypeScript**: 5+
- **Tailwind CSS**: 3+

### 开发工具
- **Node.js**: v20+
- **Yarn**: 包管理器
- **Playwright**: 浏览器自动化和截图

### 字体支持
- **Noto Sans CJK**: Google 思源黑体（主字体）
- **WenQuanYi**: 文泉驿系列字体（备用）
- **AR PL**: 文鼎系列字体（补充）

---

## 📦 环境准备

### 1. 系统要求

```bash
OS: Ubuntu 22.04+ / Debian 11+
Node.js: v20.x LTS
RAM: 最低 4GB，推荐 8GB+
磁盘: 至少 10GB 可用空间
```

### 2. 快速环境配置（自动化脚本）

项目提供了自动化环境准备脚本：

```bash
# 运行自动化脚本（推荐）
bash scripts/setup-dev-environment.sh

# 或者分步执行
bash scripts/setup-dev-environment.sh --step-by-step
```

该脚本会自动完成：
- ✅ 检查 Node.js 版本
- ✅ 安装 Yarn（如果未安装）
- ✅ 安装项目依赖
- ✅ 安装中文字体包（6个）
- ✅ 安装 Playwright 浏览器
- ✅ 验证环境配置

### 3. 手动环境配置

如果需要手动配置，请按以下步骤操作：

#### 3.1 安装 Node.js 和 Yarn

```bash
# 安装 Node.js 20.x LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证版本
node --version  # 应该输出 v20.x.x
npm --version

# 安装 Yarn
npm install -g yarn
yarn --version
```

#### 3.2 安装项目依赖

```bash
# 进入项目目录
cd /home/runner/work/claude-code-marketplace/claude-code-marketplace

# 安装依赖
yarn install

# 验证依赖
yarn list --depth=0
```

#### 3.3 安装中文字体包

**重要：** 这是确保中文显示正常的关键步骤！

```bash
# 更新软件包列表
sudo apt-get update

# 安装完整的中文字体包
sudo apt-get install -y \
  fonts-noto-cjk \           # Google Noto CJK（支持中日韩，必装）
  fonts-noto-cjk-extra \     # 额外的 CJK 变体
  fonts-wqy-zenhei \         # 文泉驿正黑（开源黑体）
  fonts-wqy-microhei \       # 文泉驿微米黑（紧凑黑体）
  fonts-arphic-ukai \        # 文鼎楷书（衬线字体）
  fonts-arphic-uming         # 文鼎明体（传统字体）

# 刷新字体缓存（必须执行！）
fc-cache -fv

# 验证中文字体安装
fc-list :lang=zh | head -n 10

# 应该看到类似输出：
# /usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc: Noto Sans CJK SC:style=Regular
# /usr/share/fonts/truetype/wqy/wqy-zenhei.ttc: WenQuanYi Zen Hei:style=Regular
```

**字体安装验证清单：**
- ✅ `fc-list :lang=zh` 输出至少 10+ 个字体
- ✅ 包含 "Noto Sans CJK" 系列
- ✅ 包含 "WenQuanYi" 系列
- ✅ `fc-cache -fv` 无错误输出

#### 3.4 安装 Playwright 浏览器

```bash
# 安装 Playwright
yarn add -D playwright

# 安装浏览器（Chromium, Firefox, WebKit）
yarn playwright install

# 安装浏览器依赖
yarn playwright install-deps

# 验证安装
yarn playwright --version
```

---

## 🚀 开发流程

### 第一阶段：分析插件仓库（已完成）

#### 1. 创建分析脚本

创建 `scripts/analyze-plugins.ts`：

```typescript
// 解析 agent-plugins-report.md
// 克隆仓库（浅克隆）
// 分析目录结构
// 提取插件特征
// 生成分析报告
```

#### 2. 运行分析

```bash
npm run analyze-plugins
```

输出：`PLUGIN_ANALYSIS_AND_DESIGN.md`

**关键发现：**
- 80% 使用 `agents/` 文件夹结构
- 95%+ 使用 Markdown 提示词
- 45% 用于代码审查
- 10 个主要开发痛点

### 第二阶段：设计可视化工具（已完成）

#### 1. 创建设计文档

基于分析结果，创建：
- `PLUGIN_ANALYSIS_AND_DESIGN.md` - 完整分析和设计
- `PLUGIN_STUDIO_IMPLEMENTATION_GUIDE.md` - 技术实现指南
- `CLAUDE_PLUGIN_STUDIO_CN.md` - 中文摘要

#### 2. 定义核心功能

**友好的开发流程：**
- 6 步向导界面
- 5 个预建模板
- 可视化进度跟踪
- 实时验证

**便利的调试能力：**
- 实时测试执行
- 终端风格控制台
- 步骤级日志
- 成功/失败指示器

### 第三阶段：构建原型（已完成）

#### 1. 创建 Next.js 应用结构

```bash
# 项目已存在，扩展 app/ 目录
mkdir -p app/studio
```

#### 2. 实现核心组件

**文件结构：**
```
app/studio/
├── page.tsx          # 服务器组件（元数据）
├── StudioClient.tsx  # 客户端组件（700+ 行）
└── i18n.ts           # 国际化配置
```

**StudioClient.tsx 核心功能：**
- ✅ 6 个步骤的状态管理
- ✅ 5 个模板的数据结构
- ✅ Agent CRUD 操作
- ✅ 实时测试模拟
- ✅ 表单验证
- ✅ 响应式设计

**i18n.ts 翻译配置：**
- ✅ 200+ 翻译条目
- ✅ 中文（zh）和英文（en）
- ✅ 默认语言：中文
- ✅ 动态切换

#### 3. 开发技巧

**状态管理：**
```typescript
const [currentStep, setCurrentStep] = useState(0);
const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
const [pluginConfig, setPluginConfig] = useState({ name: '', description: '' });
const [agents, setAgents] = useState<Agent[]>([]);
const [testOutput, setTestOutput] = useState<string[]>([]);
const [language, setLanguage] = useState<'zh' | 'en'>('zh');
```

**国际化使用：**
```typescript
const t = translations[language];
<h1>{t.welcome.title}</h1>
```

**Tailwind CSS 样式：**
```typescript
<button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
  {t.welcome.getStarted}
</button>
```

---

## 🖼️ 截图流程

### 1. 启动开发服务器

```bash
# 在项目根目录
yarn dev

# 服务器启动在 http://localhost:3000
# 访问原型: http://localhost:3000/studio
```

### 2. 使用 Playwright 自动化截图

创建截图脚本 `scripts/take-screenshots.ts`：

```typescript
import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

async function takeScreenshots() {
  // 启动浏览器
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--font-render-hinting=none',  // 更好的字体渲染
      '--disable-font-subpixel-positioning',
    ]
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    locale: 'zh-CN',  // 设置中文语言环境
  });
  
  const page = await context.newPage();
  
  // 确保截图目录存在
  const screenshotDir = path.join(__dirname, '..', 'docs', 'screenshots');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }
  
  // 访问原型
  await page.goto('http://localhost:3000/studio', {
    waitUntil: 'networkidle'
  });
  
  // 等待字体加载
  await page.waitForTimeout(2000);
  
  // 截图 1: 欢迎页面
  await page.screenshot({
    path: path.join(screenshotDir, '01-welcome-zh.png'),
    fullPage: true
  });
  console.log('✓ 截图 1: 欢迎页面');
  
  // 点击"开始使用"进入模板选择
  await page.click('button:has-text("开始使用")');
  await page.waitForTimeout(500);
  
  // 截图 2: 模板选择
  await page.screenshot({
    path: path.join(screenshotDir, '02-templates-zh.png'),
    fullPage: true
  });
  console.log('✓ 截图 2: 模板选择');
  
  // 选择"代码审查 Agent"模板
  await page.click('text=代码审查 Agent');
  await page.waitForTimeout(500);
  
  // 截图 3: 配置插件
  await page.screenshot({
    path: path.join(screenshotDir, '03-configure-zh.png'),
    fullPage: true
  });
  console.log('✓ 截图 3: 配置插件');
  
  // 填写表单
  await page.fill('input[placeholder*="my-code-reviewer"]', 'my-code-reviewer');
  await page.fill('textarea[placeholder*="描述"]', '这是一个专业的代码审查插件');
  await page.click('button:has-text("下一步")');
  await page.waitForTimeout(500);
  
  // 截图 4: 设计 Agents（滚动到顶部）
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  await page.screenshot({
    path: path.join(screenshotDir, '04-agents-zh.png'),
    fullPage: true
  });
  console.log('✓ 截图 4: 设计 Agents');
  
  // 进入测试页面
  await page.click('button:has-text("下一步")');
  await page.waitForTimeout(500);
  
  // 截图 5: 测试初始状态
  await page.screenshot({
    path: path.join(screenshotDir, '05-test-initial-zh.png'),
    fullPage: true
  });
  console.log('✓ 截图 5: 测试初始状态');
  
  // 运行测试
  await page.click('button:has-text("运行测试")');
  await page.waitForTimeout(3000);  // 等待测试完成
  
  // 截图 6: 测试完成
  await page.screenshot({
    path: path.join(screenshotDir, '06-test-complete-zh.png'),
    fullPage: true
  });
  console.log('✓ 截图 6: 测试完成');
  
  // 进入部署页面
  await page.click('button:has-text("下一步")');
  await page.waitForTimeout(500);
  
  // 截图 7: 部署页面
  await page.screenshot({
    path: path.join(screenshotDir, '07-deploy-zh.png'),
    fullPage: true
  });
  console.log('✓ 截图 7: 部署页面');
  
  await browser.close();
  console.log('\n✅ 所有截图完成！共 7 张图片保存到 docs/screenshots/');
}

takeScreenshots().catch(console.error);
```

### 3. 运行截图脚本

```bash
# 确保开发服务器正在运行（另一个终端）
yarn dev

# 运行截图脚本
yarn tsx scripts/take-screenshots.ts

# 输出：
# ✓ 截图 1: 欢迎页面
# ✓ 截图 2: 模板选择
# ✓ 截图 3: 配置插件
# ✓ 截图 4: 设计 Agents
# ✓ 截图 5: 测试初始状态
# ✓ 截图 6: 测试完成
# ✓ 截图 7: 部署页面
# ✅ 所有截图完成！
```

### 4. 截图质量检查清单

**验证步骤：**

```bash
# 检查文件是否生成
ls -lh docs/screenshots/

# 应该看到 7 个 PNG 文件，每个约 100-150KB

# 使用 file 命令验证格式
file docs/screenshots/*.png

# 输出应该是：PNG image data, 1280 x XXXX, 8-bit/color RGB

# 在浏览器中查看图片
# 或使用 eog (Eye of GNOME) 查看
eog docs/screenshots/01-welcome-zh.png
```

**质量检查：**
- ✅ 所有中文文本清晰可读（无方框 □）
- ✅ 标点符号正确显示（、。！？）
- ✅ 中英文混排正常对齐
- ✅ 字体平滑抗锯齿
- ✅ Emoji 彩色显示（🎨🚀✨）
- ✅ 布局无错位
- ✅ 颜色正确（蓝色按钮、绿色控制台等）
- ✅ 文件大小合理（100-200KB/张）

### 5. 常见问题排查

**问题 1：中文显示为方框 □□□□**

原因：系统缺少中文字体

解决方案：
```bash
# 重新安装字体
sudo apt-get install -y fonts-noto-cjk fonts-wqy-zenhei fonts-wqy-microhei
fc-cache -fv

# 验证字体
fc-list :lang=zh | grep -i noto
```

**问题 2：截图全黑或空白**

原因：Playwright 浏览器未启动或页面加载失败

解决方案：
```bash
# 重新安装 Playwright 浏览器
yarn playwright install chromium --with-deps

# 检查开发服务器是否运行
curl http://localhost:3000/studio
```

**问题 3：截图尺寸不对**

原因：viewport 设置错误

解决方案：
```typescript
// 在脚本中调整 viewport
const context = await browser.newContext({
  viewport: { width: 1280, height: 720 }
});
```

**问题 4：字体渲染模糊**

原因：浏览器字体渲染设置不当

解决方案：
```typescript
const browser = await chromium.launch({
  args: [
    '--font-render-hinting=none',
    '--disable-font-subpixel-positioning',
  ]
});
```

---

## 📝 测试验证

### 1. 本地开发测试

```bash
# 启动开发服务器
yarn dev

# 在浏览器中访问
# http://localhost:3000/studio

# 手动测试所有步骤：
# 1. 欢迎页面 → 点击"开始使用"
# 2. 模板选择 → 选择任一模板
# 3. 配置插件 → 填写表单
# 4. 设计 Agents → 编辑提示词
# 5. 测试调试 → 运行测试
# 6. 部署 → 查看部署选项
```

### 2. 国际化测试

```bash
# 测试语言切换
# 1. 点击右上角 "English" 按钮
# 2. 验证所有文本切换为英文
# 3. 点击 "中文" 按钮
# 4. 验证所有文本切换回中文
# 5. 刷新页面，确认默认为中文
```

### 3. 响应式测试

```bash
# 在浏览器开发者工具中：
# 1. 切换设备模拟器
# 2. 测试移动设备（375px 宽）
# 3. 测试平板（768px 宽）
# 4. 测试桌面（1280px+ 宽）
# 5. 验证布局正确
```

---

## 🔧 常用命令

### 开发命令

```bash
# 安装依赖
yarn install

# 启动开发服务器
yarn dev

# 构建生产版本
yarn build

# 启动生产服务器
yarn start

# 类型检查
yarn tsc --noEmit

# 运行分析脚本
npm run analyze-plugins

# 运行截图脚本
yarn tsx scripts/take-screenshots.ts
```

### 环境命令

```bash
# 安装字体
sudo apt-get install -y fonts-noto-cjk fonts-wqy-zenhei fonts-wqy-microhei
fc-cache -fv

# 安装 Playwright
yarn playwright install --with-deps

# 检查 Node.js 版本
node --version

# 检查 Yarn 版本
yarn --version

# 检查已安装的中文字体
fc-list :lang=zh
```

### Git 命令

```bash
# 查看状态
git status

# 添加文件
git add .

# 提交（将通过 report_progress 工具自动完成）
# git commit -m "message"

# 查看提交历史
git log --oneline -10

# 查看文件变更
git diff

# 查看某个提交的内容
git show <commit-hash>
```

---

## 📂 项目结构

```
claude-code-marketplace/
├── app/
│   └── studio/                    # Studio 原型
│       ├── page.tsx               # 服务器组件
│       ├── StudioClient.tsx       # 客户端组件（700+ 行）
│       └── i18n.ts                # 国际化配置
├── docs/
│   ├── screenshots/               # 原型截图（7张 PNG）
│   │   ├── 01-welcome-zh.png
│   │   ├── 02-templates-zh.png
│   │   ├── 03-configure-zh.png
│   │   ├── 04-agents-zh.png
│   │   ├── 05-test-initial-zh.png
│   │   ├── 06-test-complete-zh.png
│   │   └── 07-deploy-zh.png
│   ├── PLUGIN_ANALYSIS_README.md  # 分析文档索引
│   ├── STUDIO_PROTOTYPE_GUIDE.md  # 原型使用指南
│   ├── STUDIO_SCREENSHOTS_ZH.md   # 截图文档
│   └── DEVELOPMENT_MANUAL.md      # 本文档
├── scripts/
│   ├── analyze-plugins.ts         # 插件分析脚本
│   ├── take-screenshots.ts        # 截图脚本
│   ├── setup-dev-environment.sh   # 环境准备脚本
│   └── list-agent-plugins.ts      # 插件列表脚本
├── PLUGIN_ANALYSIS_AND_DESIGN.md  # 完整分析和设计
├── PLUGIN_STUDIO_IMPLEMENTATION_GUIDE.md  # 实现指南
├── CLAUDE_PLUGIN_STUDIO_CN.md     # 中文摘要
├── package.json                   # 项目配置
├── tsconfig.json                  # TypeScript 配置
├── next.config.ts                 # Next.js 配置
├── tailwind.config.ts             # Tailwind CSS 配置
└── README.md                      # 项目说明
```

---

## 🎯 开发检查清单

### 环境准备 ✅
- [ ] Node.js 20.x 已安装
- [ ] Yarn 已安装
- [ ] 项目依赖已安装（`yarn install`）
- [ ] 中文字体包已安装（6个）
- [ ] 字体缓存已刷新（`fc-cache -fv`）
- [ ] Playwright 浏览器已安装
- [ ] 字体验证通过（`fc-list :lang=zh` 有输出）

### 原型开发 ✅
- [ ] `app/studio/page.tsx` 已创建
- [ ] `app/studio/StudioClient.tsx` 已创建（700+ 行）
- [ ] `app/studio/i18n.ts` 已创建
- [ ] 6 个步骤正常工作
- [ ] 5 个模板正常显示
- [ ] Agent CRUD 操作正常
- [ ] 测试功能正常
- [ ] 表单验证正常

### 国际化 ✅
- [ ] 翻译文件完整（200+ 条目）
- [ ] 默认语言为中文
- [ ] 语言切换按钮正常
- [ ] 切换后所有文本更新
- [ ] 刷新后保持默认中文

### 截图 ✅
- [ ] 开发服务器启动（`yarn dev`）
- [ ] 截图脚本创建（`scripts/take-screenshots.ts`）
- [ ] 7 张截图全部生成
- [ ] 中文文本清晰可读（无方框）
- [ ] 文件大小合理（100-200KB）
- [ ] 截图保存到 `docs/screenshots/`
- [ ] 文档引用截图路径正确

### 文档 ✅
- [ ] `PLUGIN_ANALYSIS_AND_DESIGN.md` 已创建
- [ ] `PLUGIN_STUDIO_IMPLEMENTATION_GUIDE.md` 已创建
- [ ] `CLAUDE_PLUGIN_STUDIO_CN.md` 已创建
- [ ] `docs/STUDIO_PROTOTYPE_GUIDE.md` 已创建
- [ ] `docs/STUDIO_SCREENSHOTS_ZH.md` 已创建
- [ ] `docs/DEVELOPMENT_MANUAL.md` 已创建（本文档）
- [ ] README.md 已更新

---

## 🚨 注意事项

### 关键要点

1. **中文字体必须安装**：这是最关键的步骤，没有字体所有中文都会显示为方框

2. **字体缓存必须刷新**：安装字体后必须运行 `fc-cache -fv`

3. **Playwright 需要依赖**：使用 `--with-deps` 参数安装完整依赖

4. **等待页面加载**：截图前使用 `waitUntil: 'networkidle'` 和 `waitForTimeout`

5. **默认语言检查**：确保 `useState` 初始值为 `'zh'`

6. **fullPage 截图**：使用 `fullPage: true` 获取完整页面

7. **开发服务器必须运行**：截图前确保 `yarn dev` 正在运行

8. **使用 TypeScript**：所有脚本使用 `.ts` 扩展名，通过 `tsx` 运行

### 常见错误

❌ **错误 1**：忘记安装字体
```
症状：截图中文显示为 □□□□
解决：sudo apt-get install fonts-noto-cjk && fc-cache -fv
```

❌ **错误 2**：忘记刷新字体缓存
```
症状：安装字体后仍显示为方框
解决：fc-cache -fv
```

❌ **错误 3**：Playwright 浏览器未安装
```
症状：截图脚本报错 "Browser not found"
解决：yarn playwright install chromium --with-deps
```

❌ **错误 4**：开发服务器未运行
```
症状：截图脚本报错 "net::ERR_CONNECTION_REFUSED"
解决：另开终端运行 yarn dev
```

❌ **错误 5**：默认语言不是中文
```
症状：截图显示英文界面
解决：检查 StudioClient.tsx 中 useState('zh')
```

---

## 📚 参考资料

### 官方文档
- Next.js: https://nextjs.org/docs
- React: https://react.dev
- TypeScript: https://www.typescriptlang.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- Playwright: https://playwright.dev

### 字体资源
- Google Noto CJK: https://github.com/googlefonts/noto-cjk
- WenQuanYi: http://wenq.org/wqy2/index.cgi
- Fontconfig: https://www.freedesktop.org/wiki/Software/fontconfig/

### 工具
- Node.js: https://nodejs.org
- Yarn: https://yarnpkg.com
- Ubuntu Fonts: https://packages.ubuntu.com

---

## 🎓 学习要点

### 对其他智能体的建议

1. **严格按照顺序执行**：环境准备 → 开发 → 测试 → 截图 → 文档

2. **验证每个步骤**：使用检查清单确保每步完成

3. **出现问题立即排查**：参考"常见问题排查"章节

4. **使用自动化脚本**：运行 `setup-dev-environment.sh` 节省时间

5. **保持文档同步**：代码变更后及时更新文档

6. **截图前检查字体**：运行 `fc-list :lang=zh | grep -i noto`

7. **测试所有功能**：手动测试每个步骤和交互

8. **提交前验证**：确保所有文件正确，无临时文件

---

## ✅ 完成标准

### 项目被认为"完成"的标准：

1. ✅ 原型完全可交互，所有 6 个步骤正常工作
2. ✅ 国际化完整，中英文无遗漏，默认中文
3. ✅ 7 张高质量截图，中文完美显示
4. ✅ 所有文档完整，包括本开发手册
5. ✅ 自动化脚本可用，能快速配置环境
6. ✅ 代码整洁，符合 TypeScript/React 最佳实践
7. ✅ 无构建错误，`yarn build` 成功
8. ✅ 无类型错误，`yarn tsc --noEmit` 通过
9. ✅ Git 提交清晰，通过 `report_progress` 工具
10. ✅ README 更新，包含项目概述和快速开始

---

## 📞 支持

如果其他智能体在执行过程中遇到问题：

1. 查看本手册的"常见问题排查"章节
2. 运行自动化脚本：`bash scripts/setup-dev-environment.sh`
3. 逐步验证环境准备检查清单
4. 查看 Git 提交历史了解变更：`git log --oneline`
5. 查看具体实现：`app/studio/StudioClient.tsx`

---

## 📝 更新日志

### 2025-11-02
- ✅ 创建完整的开发手册
- ✅ 记录环境配置步骤
- ✅ 记录开发流程
- ✅ 记录截图方法
- ✅ 创建自动化环境准备脚本
- ✅ 添加检查清单和常见问题

---

**文档版本**: 1.0  
**最后更新**: 2025-11-02  
**维护者**: Claude Copilot Agent  
**用途**: 供其他智能体参考，完成类似的 Next.js + React + TypeScript 原型开发任务
