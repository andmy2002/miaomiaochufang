const { chromium } = require('/Users/chenkai/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

(async () => {
    const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
    try {
        const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
        page.on('pageerror', error => console.log('PAGEERROR', error.stack || error.message));
        await page.goto(process.env.CHEF_PREVIEW_URL || 'http://localhost:7456/', { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(12000);
        await page.reload({ waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(12000);
        await page.mouse.click(190, 448);
        await page.waitForTimeout(1200);
        console.log('GLOBALS', await page.evaluate(() => ({ cc: typeof window.cc, System: typeof window.System, keys: Object.keys(window).filter(k => /cc|System|game|Game/.test(k)).slice(0, 30) })));
        console.log('IMPORT', await page.evaluate(async () => {
            try {
                const cc = await window.System.import('cc');
                const scene = cc.director.getScene();
                const walk = (node, depth = 0) => depth > 8 ? [] : [{ name: node.name, active: node.active, components: node.components.map(c => c.constructor.name), children: node.children.length, position: node.position.toString() }, ...node.children.flatMap(c => walk(c, depth + 1))];
                const game = scene.getChildByName('Canvas').getChildByName('Game');
                const gameComponent = game.components.find(c => c.CurrentOrder);
                const ingredients = gameComponent.ingredientsParent;
                const item = ingredients.getChildByName('mianbaoxia');
                return { scene: scene.name, order: gameComponent?.CurrentOrder, viewport: { visible: cc.view.getVisibleSize(), canvas: cc.view.getCanvasSize(), frame: cc.view.getFrameSize() }, item: { world: item.getWorldPosition().toString(), uiWorld: item.getComponent(cc.UITransform).convertToWorldSpaceAR(new cc.Vec3()).toString() }, nodes: walk(game).slice(0, 15) };
            } catch (error) { return { error: String(error) }; }
        }));
    } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
