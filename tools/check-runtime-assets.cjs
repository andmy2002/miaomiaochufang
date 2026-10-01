const { chromium } = require('/Users/chenkai/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert = require('assert').strict;

(async () => {
    const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
    try {
        const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
        const errors = new Set();
        page.on('pageerror', error => errors.add(error.message));
        page.on('console', message => { if (message.type() === 'error') errors.add(message.text().split('\n')[0]); });
        await page.goto(process.env.CHEF_PREVIEW_URL || 'http://localhost:7456/', { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(10000);
        const result = await page.evaluate(async () => {
            const cc = window.cc;
            const load = dir => new Promise(resolve => cc.resources.loadDir(dir, cc.Prefab, (error, prefabs) => resolve({ error: error?.message, prefabs: prefabs || [] })));
            const [gamePanels, sdkPanels] = await Promise.all([load('prefabs'), load('sdk/res/prefabs')]);
            const missingScripts = [];
            let nodes = 0;
            const inspect = (node, assetName) => {
                nodes++;
                for (const component of node.components) {
                    const name = cc.js.getClassName(component);
                    if (/MissingScript|MissingClass/.test(name)) missingScripts.push({ asset: assetName, node: node.name, component: name });
                }
                for (const child of node.children) inspect(child, assetName);
            };
            inspect(cc.director.getScene(), 'game.scene');
            for (const prefab of [...gamePanels.prefabs, ...sdkPanels.prefabs]) inspect(prefab.data, prefab.name);
            return { gamePrefabs: gamePanels.prefabs.length, sdkPrefabs: sdkPanels.prefabs.length,
                loadErrors: [gamePanels.error, sdkPanels.error].filter(Boolean), nodes, missingScripts };
        });
        console.log(JSON.stringify({ ...result, browserErrors: [...errors] }, null, 2));
        assert.equal(result.loadErrors.length, 0, '预制体批量加载失败');
        assert.equal(result.missingScripts.length, 0, '场景或预制体存在 Missing Script');
        assert.equal(errors.size, 0, '浏览器有运行时错误');
    } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
