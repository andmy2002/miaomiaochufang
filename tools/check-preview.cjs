const { chromium } = require('/Users/chenkai/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('fs');
const path = require('path');
(async () => {
    const output = path.resolve(__dirname, '../temp/visual-verification');
    fs.mkdirSync(output, { recursive: true });
    const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
    try {
        const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
        const errors = [], logs = [];
        page.on('pageerror', e => errors.push(e.stack));
        page.on('console', m => { if (['error', 'warning'].includes(m.type())) logs.push(m.text()); });
        await page.goto(process.env.CHEF_PREVIEW_URL || 'http://localhost:7456/', { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(500);
        await page.screenshot({ path: path.join(output, 'loading.png') });
        await page.waitForTimeout(12000);
        await page.screenshot({ path: path.join(output, 'preview.png') });
        // Reuse only this isolated browser context's save to verify returning-player hall.
        await page.reload({ waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(6000);
        await page.screenshot({ path: path.join(output, 'hall.png') });
        const state = await page.evaluate(() => ({ title: document.title, text: document.body.innerText.slice(0, 1500), frames: [...document.querySelectorAll('iframe')].map(f => f.src) }));
        console.log(JSON.stringify({ state, errors: [...new Set(errors.map(e => e.split('\n').slice(0, 3).join('\n')))].slice(0, 15), logs: [...new Set(logs.map(e => e.split('\n')[0]))].slice(0, 25) }, null, 2));
        fs.writeFileSync(path.join(output, 'preview-log.json'), JSON.stringify({ state, errors, logs }, null, 2));
    } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
