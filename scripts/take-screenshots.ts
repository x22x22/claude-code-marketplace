/**
 * Claude Plugin Studio - 自动化截图脚本
 * 
 * 功能：
 * - 启动 Playwright 浏览器
 * - 访问原型各个页面
 * - 捕获高质量全页截图
 * - 保存到 docs/screenshots/ 目录
 * 
 * 前置条件：
 * - 开发服务器正在运行（yarn dev）
 * - Playwright 已安装（yarn playwright install）
 * - 中文字体已安装（见 DEVELOPMENT_MANUAL.md）
 * 
 * 使用方法：
 *   yarn tsx scripts/take-screenshots.ts
 */

import { chromium, Browser, BrowserContext, Page } from 'playwright';
import path from 'path';
import fs from 'fs';

// 配置
const BASE_URL = 'http://localhost:3000/studio';
const SCREENSHOT_DIR = path.join(__dirname, '..', 'docs', 'screenshots');
const VIEWPORT = { width: 1280, height: 720 };
const LOCALE = 'zh-CN';

/**
 * 日志工具
 */
const log = {
  info: (msg: string) => console.log(`ℹ ${msg}`),
  success: (msg: string) => console.log(`✓ ${msg}`),
  error: (msg: string) => console.error(`✗ ${msg}`),
  step: (msg: string) => console.log(`\n→ ${msg}`),
};

/**
 * 确保截图目录存在
 */
function ensureScreenshotDir() {
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    log.info(`创建截图目录: ${SCREENSHOT_DIR}`);
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }
  log.success(`截图目录准备就绪: ${SCREENSHOT_DIR}`);
}

/**
 * 启动浏览器
 */
async function launchBrowser(): Promise<Browser> {
  log.step('启动 Chromium 浏览器...');
  
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--font-render-hinting=none',  // 更好的字体渲染
      '--disable-font-subpixel-positioning',  // 禁用子像素定位
      '--force-device-scale-factor=1',  // 确保 1:1 像素比
    ]
  });
  
  log.success('浏览器启动成功');
  return browser;
}

/**
 * 创建浏览器上下文
 */
async function createContext(browser: Browser): Promise<BrowserContext> {
  log.step('创建浏览器上下文...');
  
  const context = await browser.newContext({
    viewport: VIEWPORT,
    locale: LOCALE,
    colorScheme: 'light',  // 使用浅色主题
    deviceScaleFactor: 1,  // 1:1 像素比
  });
  
  log.success(`上下文创建完成（${VIEWPORT.width}x${VIEWPORT.height}, ${LOCALE}）`);
  return context;
}

/**
 * 等待页面完全加载
 */
async function waitForPageReady(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);  // 等待字体加载和动画完成
}

/**
 * 截取并保存截图
 */
async function takeScreenshot(
  page: Page,
  filename: string,
  description: string
) {
  const filepath = path.join(SCREENSHOT_DIR, filename);
  
  await page.screenshot({
    path: filepath,
    fullPage: true,
    type: 'png',
  });
  
  const stats = fs.statSync(filepath);
  const sizeKB = Math.round(stats.size / 1024);
  
  log.success(`${description} - ${filename} (${sizeKB} KB)`);
}

/**
 * 主函数：执行所有截图流程
 */
async function main() {
  console.log('\n╔═══════════════════════════════════════════════════════╗');
  console.log('║                                                       ║');
  console.log('║     Claude Plugin Studio - 自动化截图脚本             ║');
  console.log('║                                                       ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');
  
  // 确保截图目录存在
  ensureScreenshotDir();
  
  let browser: Browser | null = null;
  let context: BrowserContext | null = null;
  let page: Page | null = null;
  
  try {
    // 启动浏览器
    browser = await launchBrowser();
    context = await createContext(browser);
    page = await context.newPage();
    
    log.step(`访问原型: ${BASE_URL}`);
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await waitForPageReady(page);
    log.success('页面加载完成');
    
    // ========================================
    // 截图 1: 欢迎页面
    // ========================================
    log.step('截图 1/7: 欢迎页面');
    await takeScreenshot(page, '01-welcome-zh.png', '欢迎页面');
    
    // ========================================
    // 截图 2: 模板选择
    // ========================================
    log.step('截图 2/7: 模板选择');
    await page.click('button:has-text("开始使用")');
    await page.waitForTimeout(500);
    await takeScreenshot(page, '02-templates-zh.png', '模板选择');
    
    // ========================================
    // 截图 3: 配置插件
    // ========================================
    log.step('截图 3/7: 配置插件');
    // 选择"代码审查 Agent"模板
    await page.click('text=代码审查 Agent');
    await page.waitForTimeout(500);
    await takeScreenshot(page, '03-configure-zh.png', '配置插件');
    
    // ========================================
    // 截图 4: 设计 Agents
    // ========================================
    log.step('截图 4/7: 设计 Agents');
    // 填写表单
    await page.fill('input[placeholder*="my-code-reviewer"]', 'my-code-reviewer');
    await page.fill('textarea', '这是一个专业的代码审查插件，可以自动检测代码质量问题');
    await page.click('button:has-text("下一步")');
    await page.waitForTimeout(500);
    
    // 滚动到顶部确保完整截图
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    await takeScreenshot(page, '04-agents-zh.png', '设计 Agents');
    
    // ========================================
    // 截图 5: 测试调试 - 初始状态
    // ========================================
    log.step('截图 5/7: 测试调试 - 初始状态');
    await page.click('button:has-text("下一步")');
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollTo(0, 0));
    await takeScreenshot(page, '05-test-initial-zh.png', '测试调试 - 初始');
    
    // ========================================
    // 截图 6: 测试调试 - 执行完成
    // ========================================
    log.step('截图 6/7: 测试调试 - 执行完成');
    // 运行测试
    await page.click('button:has-text("运行测试")');
    log.info('等待测试执行完成...');
    await page.waitForTimeout(3500);  // 等待测试动画完成
    await takeScreenshot(page, '06-test-complete-zh.png', '测试调试 - 完成');
    
    // ========================================
    // 截图 7: 部署页面
    // ========================================
    log.step('截图 7/7: 部署页面');
    await page.click('button:has-text("下一步")');
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollTo(0, 0));
    await takeScreenshot(page, '07-deploy-zh.png', '部署页面');
    
    // ========================================
    // 完成
    // ========================================
    console.log('\n╔═══════════════════════════════════════════════════════╗');
    console.log('║                                                       ║');
    console.log('║     ✅ 所有截图完成！                                 ║');
    console.log('║                                                       ║');
    console.log('║     共 7 张高质量 PNG 截图                           ║');
    console.log('║     保存位置: docs/screenshots/                       ║');
    console.log('║                                                       ║');
    console.log('║     验证截图：                                        ║');
    console.log('║     ls -lh docs/screenshots/                          ║');
    console.log('║                                                       ║');
    console.log('╚═══════════════════════════════════════════════════════╝\n');
    
    // 列出所有截图文件
    log.info('截图文件列表：');
    const files = fs.readdirSync(SCREENSHOT_DIR).filter(f => f.endsWith('.png'));
    files.forEach(file => {
      const filepath = path.join(SCREENSHOT_DIR, file);
      const stats = fs.statSync(filepath);
      const sizeKB = Math.round(stats.size / 1024);
      console.log(`  • ${file} (${sizeKB} KB)`);
    });
    
    const totalSize = files.reduce((sum, file) => {
      const filepath = path.join(SCREENSHOT_DIR, file);
      return sum + fs.statSync(filepath).size;
    }, 0);
    const totalSizeKB = Math.round(totalSize / 1024);
    
    console.log(`\n  总大小: ${totalSizeKB} KB`);
    console.log(`  平均大小: ${Math.round(totalSizeKB / files.length)} KB/张\n`);
    
  } catch (error) {
    log.error('截图过程出错！');
    console.error(error);
    process.exit(1);
  } finally {
    // 清理资源
    if (page) await page.close();
    if (context) await context.close();
    if (browser) await browser.close();
    log.info('浏览器已关闭');
  }
}

// 执行主函数
main().catch(error => {
  log.error('脚本执行失败！');
  console.error(error);
  process.exit(1);
});
