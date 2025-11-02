# 快速参考指南

## 🚀 快速开始

### 对于新智能体

```bash
# 1. 自动化环境配置（推荐）
bash scripts/setup-dev-environment.sh

# 2. 启动开发服务器
yarn dev

# 3. 访问原型
# http://localhost:3000/studio

# 4. （可选）截图
yarn tsx scripts/take-screenshots.ts
```

## 📚 关键文档

| 文档 | 用途 |
|------|------|
| `docs/DEVELOPMENT_MANUAL.md` | **完整开发手册**（必读） |
| `PLUGIN_ANALYSIS_AND_DESIGN.md` | 插件分析和工具设计 |
| `PLUGIN_STUDIO_IMPLEMENTATION_GUIDE.md` | 技术实现指南 |
| `docs/STUDIO_PROTOTYPE_GUIDE.md` | 原型使用指南 |

## 🔧 常用命令速查

### 环境准备
```bash
# 自动化环境配置
bash scripts/setup-dev-environment.sh

# 分步执行（学习模式）
bash scripts/setup-dev-environment.sh --step-by-step

# 手动安装中文字体
sudo apt-get install -y fonts-noto-cjk fonts-wqy-zenhei fonts-wqy-microhei
fc-cache -fv

# 验证字体
fc-list :lang=zh | grep -i noto
```

### 开发
```bash
# 安装依赖
yarn install

# 启动开发服务器
yarn dev

# 构建生产版本
yarn build

# 类型检查
yarn tsc --noEmit
```

### 截图
```bash
# 确保开发服务器运行中
yarn dev

# 在另一个终端运行截图脚本
yarn tsx scripts/take-screenshots.ts

# 查看截图
ls -lh docs/screenshots/
```

### 分析
```bash
# 运行插件分析
npm run analyze-plugins

# 查看分析结果
cat PLUGIN_ANALYSIS_AND_DESIGN.md
```

## ✅ 环境检查清单

快速检查环境是否正确配置：

```bash
# Node.js (应该是 v20.x)
node --version

# Yarn
yarn --version

# 项目依赖
ls node_modules/ | wc -l  # 应该 > 100

# 中文字体 (应该 >= 10)
fc-list :lang=zh | wc -l

# Playwright
yarn playwright --version

# Studio 原型文件
ls app/studio/
```

## 🐛 常见问题速查

### 中文显示为方框 □□□□

```bash
# 解决方案
sudo apt-get install -y fonts-noto-cjk fonts-wqy-zenhei
fc-cache -fv
```

### 截图脚本连接失败

```bash
# 解决方案
# 1. 确保开发服务器运行
yarn dev

# 2. 验证服务器
curl http://localhost:3000/studio
```

### Playwright 浏览器未找到

```bash
# 解决方案
yarn playwright install chromium --with-deps
```

## 📂 目录结构速查

```
项目根目录/
├── app/studio/          # 原型代码（3个文件）
├── docs/               # 文档
│   ├── screenshots/    # 截图（7张PNG）
│   └── *.md           # 各类文档
├── scripts/           # 脚本
│   ├── setup-dev-environment.sh  # 环境配置
│   ├── take-screenshots.ts       # 截图
│   └── analyze-plugins.ts        # 分析
└── *.md               # 设计文档
```

## 🎯 开发流程速查

```
1. 环境准备 → bash scripts/setup-dev-environment.sh
2. 启动服务器 → yarn dev
3. 开发原型 → 编辑 app/studio/*
4. 测试功能 → 访问 http://localhost:3000/studio
5. 截图验证 → yarn tsx scripts/take-screenshots.ts
6. 提交代码 → 使用 report_progress 工具
```

## 📞 获取帮助

1. 查看完整手册：`docs/DEVELOPMENT_MANUAL.md`
2. 查看 Git 历史：`git log --oneline`
3. 查看特定实现：`app/studio/StudioClient.tsx`

## 🔗 外部资源

- Next.js: https://nextjs.org/docs
- Playwright: https://playwright.dev
- Tailwind CSS: https://tailwindcss.com/docs

---

**提示**: 这是快速参考，详细内容请查看 `docs/DEVELOPMENT_MANUAL.md`
