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
        page.on('console', message => {
            if (['error', 'warning'].includes(message.type())) warnings.push(message.text().split('\n')[0]);
        });
        const url = process.env.CHEF_PREVIEW_URL || 'http://localhost:7456/';
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(6000);
        await page.reload({ waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(6000);
        const steps = [
            ['role', 38, 690],
            ['mission', 140, 690],
            ['achievement', 338, 690],
            ['upgrade', 240, 690],
            ['settings', 38, 125]
        ];
        const results = [];
        for (const [name, x, y] of steps) {
            const start = errors.length;
            await page.mouse.click(x, y);
            await page.waitForTimeout(1500);
            await page.screenshot({ path: path.join(output, name + '.png') });
            const newErrors = errors.slice(start);
            results.push({ name, errorCount: newErrors.length,
                newErrors: [...new Set(newErrors.map(e => e.split('\n').slice(0, 3).join('\n')))].slice(0, 10) });
            if (name === 'role') {
                const beforePurchase = errors.length;
                await page.mouse.click(147, 556);
                await page.waitForTimeout(1200);
                await page.screenshot({ path: path.join(output, 'role-purchase.png') });
                const purchaseErrors = errors.slice(beforePurchase);
                results.push({ name: 'role-purchase', errorCount: purchaseErrors.length,
                    newErrors: [...new Set(purchaseErrors.map(e => e.split('\n').slice(0, 3).join('\n')))].slice(0, 10) });
                await page.mouse.click(319, 335);
                await page.waitForTimeout(350);
            }
        }
        const report = { url, results, errors: [...new Set(errors.map(e => e.split('\n')[0]))],
            warnings: [...new Set(warnings)].slice(0, 60) };
        fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
        console.log(JSON.stringify(report, null, 2));
    } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
