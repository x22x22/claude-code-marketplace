#!/bin/bash

################################################################################
# Claude Plugin Studio - 自动化环境准备脚本
#
# 用途：快速配置开发环境，包括：
#   - Node.js 版本检查
#   - Yarn 安装
#   - 项目依赖安装
#   - 中文字体包安装
#   - Playwright 浏览器安装
#   - 环境验证
#
# 使用方法：
#   bash scripts/setup-dev-environment.sh
#
# 或者分步执行：
#   bash scripts/setup-dev-environment.sh --step-by-step
#
################################################################################

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

log_success() {
    echo -e "${GREEN}✓${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

log_step() {
    echo ""
    echo -e "${BLUE}════════════════════════════════════════${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}════════════════════════════════════════${NC}"
}

# 检查是否为分步执行模式
STEP_BY_STEP=false
if [ "$1" == "--step-by-step" ]; then
    STEP_BY_STEP=true
    log_info "分步执行模式已启用"
fi

# 暂停函数（仅在分步模式下）
pause_if_step_by_step() {
    if [ "$STEP_BY_STEP" = true ]; then
        echo ""
        read -p "按 Enter 继续..." dummy
    fi
}

# 打印欢迎信息
clear
echo ""
echo -e "${BLUE}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                       ║${NC}"
echo -e "${BLUE}║     Claude Plugin Studio - 环境准备脚本               ║${NC}"
echo -e "${BLUE}║                                                       ║${NC}"
echo -e "${BLUE}║     自动化配置开发环境，包括：                        ║${NC}"
echo -e "${BLUE}║     • Node.js 和 Yarn                                ║${NC}"
echo -e "${BLUE}║     • 项目依赖                                        ║${NC}"
echo -e "${BLUE}║     • 中文字体包（6个）                               ║${NC}"
echo -e "${BLUE}║     • Playwright 浏览器                              ║${NC}"
echo -e "${BLUE}║                                                       ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════╝${NC}"
echo ""

################################################################################
# 步骤 1: 检查 Node.js 版本
################################################################################

log_step "步骤 1/7: 检查 Node.js 版本"

if ! command -v node &> /dev/null; then
    log_error "Node.js 未安装！"
    log_info "请安装 Node.js 20.x LTS："
    echo "  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -"
    echo "  sudo apt-get install -y nodejs"
    exit 1
fi

NODE_VERSION=$(node --version)
log_success "Node.js 版本: $NODE_VERSION"

# 检查版本是否为 20.x
if [[ ! "$NODE_VERSION" =~ ^v20\. ]]; then
    log_warning "建议使用 Node.js 20.x LTS 版本"
    log_info "当前版本: $NODE_VERSION"
fi

pause_if_step_by_step

################################################################################
# 步骤 2: 检查并安装 Yarn
################################################################################

log_step "步骤 2/7: 检查并安装 Yarn"

if ! command -v yarn &> /dev/null; then
    log_warning "Yarn 未安装，正在安装..."
    npm install -g yarn
    log_success "Yarn 安装完成"
else
    YARN_VERSION=$(yarn --version)
    log_success "Yarn 版本: $YARN_VERSION"
fi

pause_if_step_by_step

################################################################################
# 步骤 3: 安装项目依赖
################################################################################

log_step "步骤 3/7: 安装项目依赖"

log_info "运行: yarn install"
log_info "这可能需要几分钟时间..."

if yarn install; then
    log_success "项目依赖安装完成"
else
    log_error "项目依赖安装失败！"
    exit 1
fi

# 显示已安装的关键包
log_info "关键依赖包："
yarn list --depth=0 | grep -E "(next|react|typescript|tailwindcss|playwright)" || true

pause_if_step_by_step

################################################################################
# 步骤 4: 安装中文字体包
################################################################################

log_step "步骤 4/7: 安装中文字体包"

log_warning "此步骤需要 sudo 权限来安装系统字体"
log_info "将安装以下字体包："
echo "  • fonts-noto-cjk          (Google Noto CJK - 思源黑体)"
echo "  • fonts-noto-cjk-extra    (Noto CJK 额外变体)"
echo "  • fonts-wqy-zenhei        (文泉驿正黑)"
echo "  • fonts-wqy-microhei      (文泉驿微米黑)"
echo "  • fonts-arphic-ukai       (文鼎楷书)"
echo "  • fonts-arphic-uming      (文鼎明体)"
echo ""

# 检查字体是否已安装
FONTS_INSTALLED=true
if ! fc-list :lang=zh | grep -q "Noto Sans CJK"; then
    FONTS_INSTALLED=false
fi

if [ "$FONTS_INSTALLED" = true ]; then
    log_success "中文字体已安装"
    log_info "已安装的中文字体数量: $(fc-list :lang=zh | wc -l)"
else
    log_info "开始安装中文字体包..."
    
    # 更新包列表
    log_info "更新软件包列表..."
    sudo apt-get update -qq
    
    # 安装字体包
    log_info "安装字体包（这可能需要几分钟）..."
    sudo apt-get install -y \
        fonts-noto-cjk \
        fonts-noto-cjk-extra \
        fonts-wqy-zenhei \
        fonts-wqy-microhei \
        fonts-arphic-ukai \
        fonts-arphic-uming
    
    # 刷新字体缓存
    log_info "刷新字体缓存..."
    fc-cache -fv > /dev/null 2>&1
    
    log_success "中文字体安装完成！"
fi

# 验证字体安装
log_info "验证中文字体安装..."
FONT_COUNT=$(fc-list :lang=zh | wc -l)

if [ "$FONT_COUNT" -ge 10 ]; then
    log_success "字体验证通过！找到 $FONT_COUNT 个中文字体"
    log_info "关键字体："
    fc-list :lang=zh | grep -E "(Noto|WenQuanYi)" | head -n 5
else
    log_error "字体验证失败！仅找到 $FONT_COUNT 个中文字体"
    log_warning "预期至少 10 个字体"
    exit 1
fi

pause_if_step_by_step

################################################################################
# 步骤 5: 安装 Playwright 浏览器
################################################################################

log_step "步骤 5/7: 安装 Playwright 浏览器"

# 检查 Playwright 是否在 package.json 中
if grep -q "playwright" package.json; then
    log_success "Playwright 已在 package.json 中"
else
    log_info "添加 Playwright 到开发依赖..."
    yarn add -D playwright
fi

# 安装 Playwright 浏览器
log_info "安装 Chromium 浏览器..."
yarn playwright install chromium --with-deps

log_success "Playwright 浏览器安装完成"

# 验证 Playwright 安装
if yarn playwright --version &> /dev/null; then
    PLAYWRIGHT_VERSION=$(yarn playwright --version)
    log_success "Playwright 版本: $PLAYWRIGHT_VERSION"
else
    log_error "Playwright 安装失败！"
    exit 1
fi

pause_if_step_by_step

################################################################################
# 步骤 6: 创建截图脚本（如果不存在）
################################################################################

log_step "步骤 6/7: 检查截图脚本"

if [ -f "scripts/take-screenshots.ts" ]; then
    log_success "截图脚本已存在: scripts/take-screenshots.ts"
else
    log_warning "截图脚本不存在，请参考 DEVELOPMENT_MANUAL.md 创建"
fi

# 创建截图目录（如果不存在）
if [ ! -d "docs/screenshots" ]; then
    log_info "创建截图目录: docs/screenshots/"
    mkdir -p docs/screenshots
    log_success "截图目录已创建"
else
    log_success "截图目录已存在"
fi

pause_if_step_by_step

################################################################################
# 步骤 7: 环境验证
################################################################################

log_step "步骤 7/7: 环境验证"

log_info "运行完整的环境检查..."

CHECKS_PASSED=0
CHECKS_TOTAL=8

# 检查 1: Node.js
if command -v node &> /dev/null; then
    log_success "Node.js: $(node --version)"
    ((CHECKS_PASSED++))
else
    log_error "Node.js 未找到"
fi

# 检查 2: Yarn
if command -v yarn &> /dev/null; then
    log_success "Yarn: $(yarn --version)"
    ((CHECKS_PASSED++))
else
    log_error "Yarn 未找到"
fi

# 检查 3: 项目依赖
if [ -d "node_modules" ]; then
    log_success "项目依赖: node_modules/ 存在"
    ((CHECKS_PASSED++))
else
    log_error "项目依赖未安装"
fi

# 检查 4: Next.js
if [ -f "node_modules/.bin/next" ]; then
    log_success "Next.js: 已安装"
    ((CHECKS_PASSED++))
else
    log_error "Next.js 未找到"
fi

# 检查 5: TypeScript
if [ -f "node_modules/.bin/tsc" ]; then
    log_success "TypeScript: 已安装"
    ((CHECKS_PASSED++))
else
    log_error "TypeScript 未找到"
fi

# 检查 6: Playwright
if yarn playwright --version &> /dev/null; then
    log_success "Playwright: $(yarn playwright --version)"
    ((CHECKS_PASSED++))
else
    log_error "Playwright 未找到"
fi

# 检查 7: 中文字体
FONT_COUNT=$(fc-list :lang=zh | wc -l)
if [ "$FONT_COUNT" -ge 10 ]; then
    log_success "中文字体: $FONT_COUNT 个字体已安装"
    ((CHECKS_PASSED++))
else
    log_error "中文字体: 仅 $FONT_COUNT 个字体（至少需要 10 个）"
fi

# 检查 8: Studio 原型文件
if [ -f "app/studio/page.tsx" ] && [ -f "app/studio/StudioClient.tsx" ]; then
    log_success "Studio 原型: 文件存在"
    ((CHECKS_PASSED++))
else
    log_warning "Studio 原型: 文件不完整"
fi

echo ""
echo -e "${BLUE}════════════════════════════════════════${NC}"
log_info "环境检查完成: $CHECKS_PASSED/$CHECKS_TOTAL 通过"

if [ "$CHECKS_PASSED" -eq "$CHECKS_TOTAL" ]; then
    log_success "所有检查通过！环境配置完成！✅"
else
    log_warning "部分检查未通过，请检查上述错误"
fi

################################################################################
# 后续步骤提示
################################################################################

echo ""
echo -e "${BLUE}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                       ║${NC}"
echo -e "${BLUE}║     🎉 环境准备完成！                                 ║${NC}"
echo -e "${BLUE}║                                                       ║${NC}"
echo -e "${BLUE}║     后续步骤：                                        ║${NC}"
echo -e "${BLUE}║                                                       ║${NC}"
echo -e "${BLUE}║     1. 启动开发服务器：                               ║${NC}"
echo -e "${BLUE}║        yarn dev                                       ║${NC}"
echo -e "${BLUE}║                                                       ║${NC}"
echo -e "${BLUE}║     2. 在浏览器中访问：                               ║${NC}"
echo -e "${BLUE}║        http://localhost:3000/studio                   ║${NC}"
echo -e "${BLUE}║                                                       ║${NC}"
echo -e "${BLUE}║     3. 运行截图脚本（可选）：                         ║${NC}"
echo -e "${BLUE}║        yarn tsx scripts/take-screenshots.ts           ║${NC}"
echo -e "${BLUE}║                                                       ║${NC}"
echo -e "${BLUE}║     4. 查看开发手册：                                 ║${NC}"
echo -e "${BLUE}║        docs/DEVELOPMENT_MANUAL.md                     ║${NC}"
echo -e "${BLUE}║                                                       ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════╝${NC}"
echo ""

log_info "祝开发顺利！🚀"
echo ""

exit 0
