const { chromium } = require('/Users/chenkai/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('fs');
const path = require('path');
(async () => {
    const output = path.resolve(__dirname, '../temp/panel-verification');
    fs.mkdirSync(output, { recursive: true });
    const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
    try {
        const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
        const errors = [], warnings = [];
        page.on('pageerror', error => errors.push(error.stack || error.message));
        page.on('console', message => { if (['error', 'warning'].includes(message.type())) warnings.push(message.text().split('\n')[0]); });
        await page.goto(process.env.CHEF_PREVIEW_URL || 'http://localhost:7456/', { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(12000);
        await page.reload({ waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(12000);
        await page.mouse.click(190, 448);
        await page.waitForTimeout(2500);
        await page.screenshot({ path: path.join(output, 'game-before-pause.png') });
        await page.mouse.click(32, 119);
        await page.waitForTimeout(1000);
        await page.screenshot({ path: path.join(output, 'pause.png') });
        await page.mouse.click(190, 476);
        await page.waitForTimeout(65000);
        await page.screenshot({ path: path.join(output, 'success-after-timer.png') });
        const report = { errors: [...new Set(errors.map(e => e.split('\n').slice(0, 3).join('\n')))], warnings: [...new Set(warnings)] };
        fs.writeFileSync(path.join(output, 'game-panels-report.json'), JSON.stringify(report, null, 2));
        console.log(JSON.stringify(report, null, 2));
    } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
