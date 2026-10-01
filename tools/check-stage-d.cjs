const { chromium } = require('/Users/chenkai/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');

const output = path.resolve(__dirname, '../temp/stage-d-regression');
const mix = {
    lvbingsha: ['huangbingsha', 'lanbingsha'], zibingsha: ['hongbingsha', 'lanbingsha'],
    chengbingsha: ['hongbingsha', 'huangbingsha'], tangjiangbingsha: ['hongbingsha', 'huangbingsha', 'lanbingsha'],
    qianchengbingsha: ['hongbingsha', 'huangbingsha', 'niunaibingsha'], qianhuangbingsha: ['huangbingsha', 'niunaibingsha'],
    qianlanbingsha: ['lanbingsha', 'niunaibingsha'], qianlvbingsha: ['huangbingsha', 'lanbingsha', 'niunaibingsha'],
    qianzibingsha: ['hongbingsha', 'lanbingsha', 'niunaibingsha'], zongbingsha: ['hongbingsha', 'huangbingsha', 'lanbingsha', 'niunaibingsha'],
    fenbingsha: ['hongbingsha', 'niunaibingsha'],
};

async function state(page) {
    return page.evaluate(() => {
        const cc = window.cc;
        const scene = cc.director.getScene();
        const canvas = scene.getChildByName('Canvas');
        const gameNode = canvas.getChildByName('Game');
        const startNode = canvas.getChildByName('Start');
        const game = gameNode.components.find(c => c.CurrentOrder);
        const order = gameNode.getChildByName('dingdan').components.find(c => 'cookFlag' in c);
        const start = startNode.components.find(c => c.coinLabel);
        const frame = document.querySelector('canvas').getBoundingClientRect();
        const scale = frame.width / cc.view.getVisibleSize().width;
        const inset = (frame.height - cc.view.getVisibleSize().height * scale) / 2;
        const items = Object.fromEntries(game.ingredientsParent.children.map(node => {
            const pos = node.getWorldPosition();
            return [node.name, { x: frame.left + pos.x * scale,
                y: frame.top + inset + (cc.view.getVisibleSize().height - pos.y) * scale }];
        }));
        const success = canvas.children.find(n => /success/i.test(n.name) && n.active);
        return { order: game.CurrentOrder, coin: game.totalNum, correct: game.shicaiNum, mistakes: game.errorShicaiNum,
            cookFlag: order.cookFlag, gameFlag: game.gameFlag, gameActive: gameNode.active, startActive: startNode.active,
            hallCoin: start.coinLabel.string, remaining: game.currentTotalTime, success: success?.name, items };
    });
}

(async () => {
    fs.mkdirSync(output, { recursive: true });
    const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
    try {
        const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
        const errors = new Set();
        page.on('pageerror', error => errors.add(error.message));
        page.on('console', message => { if (message.type() === 'error') errors.add(message.text().split('\n')[0]); });
        await page.goto(process.env.CHEF_PREVIEW_URL || 'http://localhost:7456/', { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(500);
        await page.screenshot({ path: path.join(output, '01-startup.png') });
        await page.waitForTimeout(11000);
        await page.reload({ waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(10000);
        await page.screenshot({ path: path.join(output, '02-hall.png') });
        const hall = await state(page);
        const panelClicks = [
            ['role', 38, 690], ['mission', 140, 690], ['achievement', 338, 690],
            ['upgrade', 240, 690], ['settings', 38, 125],
        ];
        for (const [name, x, y] of panelClicks) {
            await page.mouse.click(x, y);
            await page.waitForTimeout(650);
            await page.screenshot({ path: path.join(output, `03-${name}.png`) });
        }
        await page.mouse.click(315, 325);
        await page.waitForTimeout(250);
        await page.mouse.click(38, 690);
        await page.waitForTimeout(400);
        await page.mouse.click(190, 450);
        await page.waitForTimeout(600);
        const started = await state(page);
        assert(started.gameFlag && started.cookFlag, '大厅开始按钮未进入游戏');
        await page.screenshot({ path: path.join(output, '04-order.png') });
        const names = [...(started.order.hanbao || [])];
        if (started.order.chadi) names.push(started.order.chadi);
        if (started.order.bingsha) names.push(...(mix[started.order.bingsha] || [started.order.bingsha]));
        if (started.order.dingcengpeiliao) names.push(started.order.dingcengpeiliao);
        if (started.order.kaiweicai) names.push(...(Array.isArray(started.order.kaiweicai) ? started.order.kaiweicai : [started.order.kaiweicai]));
        for (const name of names) {
            const pos = started.items[name];
            assert(pos, `订单食材不存在: ${name}`);
            await page.mouse.click(pos.x, pos.y);
        }
        await page.waitForTimeout(900);
        const delivered = await state(page);
        assert(delivered.coin > 0, '订单交付没有增加金币');
        await page.screenshot({ path: path.join(output, '05-delivered.png') });
        await page.waitForTimeout(Math.max(0, Math.ceil(delivered.remaining * 1000) + 500));
        let settlement = await state(page);
        for (let i = 0; !settlement.success && i < 24; i++) {
            await page.waitForTimeout(500);
            settlement = await state(page);
        }
        assert.equal(settlement.success, 'SuccessPanel', '自然计时后未结算');
        await page.waitForTimeout(700);
        await page.screenshot({ path: path.join(output, '06-settlement.png') });
        await page.mouse.click(190, 585);
        await page.waitForTimeout(1100);
        const returned = await state(page);
        assert(!returned.gameActive && returned.startActive && !returned.success, '领取奖励后未回大厅');
        assert.equal(Number(returned.hallCoin), 1000 + settlement.coin, '领取奖励后大厅金币错误');
        await page.screenshot({ path: path.join(output, '07-returned.png') });
        await page.mouse.click(190, 450);
        await page.waitForTimeout(600);
        const restarted = await state(page);
        assert(restarted.gameFlag && restarted.cookFlag && restarted.coin === 0 && restarted.correct === 0, '重开未重置本局状态');
        assert.equal(errors.size, 0, '浏览器控制台或页面存在错误');
        const report = { hall: { coin: hall.hallCoin }, panels: panelClicks.map(s => s[0]),
            order: started.order, delivered: { coin: delivered.coin, correct: delivered.correct, mistakes: delivered.mistakes },
            settlement: { coin: settlement.coin }, returned: { hallCoin: returned.hallCoin },
            restarted: { coin: restarted.coin, correct: restarted.correct }, errors: [...errors] };
        fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
        console.log(JSON.stringify(report, null, 2));
    } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
