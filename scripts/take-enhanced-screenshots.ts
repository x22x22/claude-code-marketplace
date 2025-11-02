import { chromium } from 'playwright';
import { writeFileSync, mkdirSync, statSync } from 'fs';
import { join } from 'path';

const SCREENSHOTS_DIR = join(process.cwd(), 'docs', 'screenshots');

// 确保截图目录存在
try {
  mkdirSync(SCREENSHOTS_DIR, { recursive: true });
} catch (e) {
  // 目录已存在
}

async function takeScreenshots() {
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║                                                       ║');
  console.log('║  Claude Plugin Studio - 增强功能截图脚本              ║');
  console.log('║                                                       ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');

  const browser = await chromium.launch({
    args: ['--lang=zh-CN'],
    headless: true
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    locale: 'zh-CN',
  });

  const page = await context.newPage();

  const screenshots: { name: string; size: number }[] = [];

  try {
    console.log('→ 启动 Chromium 浏览器...');
    console.log('✓ 浏览器启动成功\n');

    // 1. 增强配置页面 - 初始状态
    console.log('→ 截图 1/6: 增强配置页面（初始状态）');
    await page.goto('http://localhost:3000/studio-demo', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000); // 等待渲染
    const screenshot1Path = join(SCREENSHOTS_DIR, '08-enhanced-config-initial-zh.png');
    await page.screenshot({ path: screenshot1Path, fullPage: true });
    const size1 = statSync(screenshot1Path).size;
    screenshots.push({ name: '08-enhanced-config-initial-zh.png', size: size1 });
    console.log(`✓ 增强配置页面（初始）- 08-enhanced-config-initial-zh.png (${Math.round(size1 / 1024)} KB)\n`);

    // 2. 增强配置页面 - 填写部分数据
    console.log('→ 截图 2/6: 增强配置页面（已填写）');
    await page.fill('input[placeholder="e.g., my-code-reviewer"]', 'my-code-reviewer');
    await page.fill('textarea[placeholder*="描述您的插件"]', '自动化代码审查插件，帮助团队保持高质量的代码标准');
    await page.fill('input[type="text"][placeholder="Zhang San"]', '张三');
    await page.fill('input[type="email"]', 'zhangsan@example.com');
    await page.fill('input[type="text"][placeholder="Example Corp"]', 'Example Corp');
    await page.waitForTimeout(1000);
    const screenshot2Path = join(SCREENSHOTS_DIR, '09-enhanced-config-filled-zh.png');
    await page.screenshot({ path: screenshot2Path, fullPage: true });
    const size2 = statSync(screenshot2Path).size;
    screenshots.push({ name: '09-enhanced-config-filled-zh.png', size: size2 });
    console.log(`✓ 增强配置页面（已填写）- 09-enhanced-config-filled-zh.png (${Math.round(size2 / 1024)} KB)\n`);

    // 3. 增强配置页面 - 高级模式
    console.log('→ 截图 3/6: 增强配置页面（高级模式）');
    await page.click('text=高级模式');
    await page.waitForTimeout(1000);
    const screenshot3Path = join(SCREENSHOTS_DIR, '10-enhanced-config-advanced-zh.png');
    await page.screenshot({ path: screenshot3Path, fullPage: true });
    const size3 = statSync(screenshot3Path).size;
    screenshots.push({ name: '10-enhanced-config-advanced-zh.png', size: size3 });
    console.log(`✓ 增强配置页面（高级模式）- 10-enhanced-config-advanced-zh.png (${Math.round(size3 / 1024)} KB)\n`);

    // 4. AI 辅助设计器 - 初始状态
    console.log('→ 截图 4/6: AI 辅助设计器（初始状态）');
    await page.click('text=AI 辅助设计器');
    await page.waitForTimeout(2000);
    const screenshot4Path = join(SCREENSHOTS_DIR, '11-ai-designer-initial-zh.png');
    await page.screenshot({ path: screenshot4Path, fullPage: true });
    const size4 = statSync(screenshot4Path).size;
    screenshots.push({ name: '11-ai-designer-initial-zh.png', size: size4 });
    console.log(`✓ AI 辅助设计器（初始）- 11-ai-designer-initial-zh.png (${Math.round(size4 / 1024)} KB)\n`);

    // 5. AI 辅助设计器 - 对话中
    console.log('→ 截图 5/6: AI 辅助设计器（对话中）');
    const inputSelector = 'input[placeholder*="输入您的回复"]';
    await page.waitForSelector(inputSelector);
    await page.fill(inputSelector, '我需要一个代码审查的 Agent');
    await page.click('button:has-text("发送")');
    await page.waitForTimeout(2000);
    const screenshot5Path = join(SCREENSHOTS_DIR, '12-ai-designer-chatting-zh.png');
    await page.screenshot({ path: screenshot5Path, fullPage: true });
    const size5 = statSync(screenshot5Path).size;
    screenshots.push({ name: '12-ai-designer-chatting-zh.png', size: size5 });
    console.log(`✓ AI 辅助设计器（对话中）- 12-ai-designer-chatting-zh.png (${Math.round(size5 / 1024)} KB)\n`);

    // 6. AI 辅助设计器 - 完成状态
    console.log('→ 截图 6/6: AI 辅助设计器（完成状态）');
    // 选择所有复选框
    await page.waitForSelector('text=代码风格');
    await page.click('text=全选');
    await page.waitForTimeout(500);
    await page.click('button:has-text("继续")');
    await page.waitForTimeout(2000);
    const screenshot6Path = join(SCREENSHOTS_DIR, '13-ai-designer-complete-zh.png');
    await page.screenshot({ path: screenshot6Path, fullPage: true });
    const size6 = statSync(screenshot6Path).size;
    screenshots.push({ name: '13-ai-designer-complete-zh.png', size: size6 });
    console.log(`✓ AI 辅助设计器（完成）- 13-ai-designer-complete-zh.png (${Math.round(size6 / 1024)} KB)\n`);

  } catch (error) {
    console.error('❌ 截图过程出错:', error);
    throw error;
  } finally {
    await browser.close();
  }

  console.log('\n✅ 所有截图完成！');
  console.log(`共 ${screenshots.length} 张高质量 PNG 截图`);
  console.log(`保存位置: ${SCREENSHOTS_DIR}\n`);

  const totalSize = screenshots.reduce((sum, s) => sum + s.size, 0);
  console.log(`总大小: ${Math.round(totalSize / 1024)} KB`);
  console.log(`平均大小: ${Math.round(totalSize / screenshots.length / 1024)} KB/张\n`);

  console.log('文件列表:');
  screenshots.forEach(s => {
    console.log(`  - ${s.name} (${Math.round(s.size / 1024)} KB)`);
  });
}

takeScreenshots().catch(console.error);
