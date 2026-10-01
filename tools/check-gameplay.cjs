const { chromium } = require('/Users/chenkai/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('fs');
const path = require('path');
const assert = require('assert').strict;

const output = path.resolve(__dirname, '../temp/gameplay-verification');
const drinkMix = {
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
        const canvas = document.querySelector('canvas').getBoundingClientRect();
        const scene = cc.director.getScene();
        const root = scene.getChildByName('Canvas');
        const gameNode = root.getChildByName('Game');
        const game = gameNode.components.find(c => c.CurrentOrder);
        const order = gameNode.getChildByName('dingdan').components.find(c => 'cookFlag' in c);
        const itemNodes = game.ingredientsParent.children;
        const scale = canvas.width / cc.view.getVisibleSize().width;
        const verticalInset = (canvas.height - cc.view.getVisibleSize().height * scale) / 2;
        const itemPositions = Object.fromEntries(itemNodes.map(node => {
            const pos = node.getWorldPosition();
            return [node.name, { x: canvas.left + pos.x * scale,
                y: canvas.top + verticalInset + (cc.view.getVisibleSize().height - pos.y) * scale }];
        }));
        const success = root.children.find(n => /success/i.test(n.name) && n.active);
        const startNode = root.getChildByName('Start');
        const startComponent = startNode.components.find(c => c.coinLabel);
        return { order: game.CurrentOrder, coin: game.totalNum, earnedCoin: game.getCoinNum, correct: game.shicaiNum, mistakes: game.errorShicaiNum, cookTime: order?.orderTime?.progress,
            totalTime: game.currentTotalTime, cookFlag: order?.cookFlag, gameFlag: game.gameFlag,
            gameActive: gameNode.active, startActive: startNode.active, hallCoin: startComponent?.coinLabel?.string,
            success: success?.name, itemPositions, canvas: { x: canvas.x, y: canvas.y, width: canvas.width, height: canvas.height } };
    });
}

(async () => {
    fs.mkdirSync(output, { recursive: true });
    const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
    try {
        const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
        const errors = [], consoleErrors = [];
        page.on('pageerror', error => errors.push(error.stack || error.message));
        page.on('console', message => {
            if (message.type() !== 'error') return;
            const summary = message.text().split('\n')[0];
            if (!consoleErrors.includes(summary) && consoleErrors.length < 50) consoleErrors.push(summary);
        });
        await page.goto(process.env.CHEF_PREVIEW_URL || 'http://localhost:7456/', { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(11000);
        await page.reload({ waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(10000);
        await page.screenshot({ path: path.join(output, 'hall.png') });
        await page.mouse.click(190, 448);
        await page.waitForTimeout(500);
        let before = await state(page);
        let timeout = null;
        if (process.env.CHEF_SIMULATE_TIMEOUT === '1') {
            await page.evaluate(() => {
                const root = window.cc.director.getScene().getChildByName('Canvas');
                const order = root.getChildByName('Game').getChildByName('dingdan').components.find(c => 'cookFlag' in c);
                order.update(11);
            });
            await page.waitForTimeout(900);
            timeout = { before, after: await state(page) };
            before = timeout.after;
            await page.screenshot({ path: path.join(output, 'after-timeout.png') });
            console.log('TIMEOUT', JSON.stringify({ oldOrder: timeout.before.order, newOrder: timeout.after.order,
                cookFlag: timeout.after.cookFlag, cookTime: timeout.after.cookTime, gameFlag: timeout.after.gameFlag }));
        }
        await page.screenshot({ path: path.join(output, 'order.png') });
        console.log('BEFORE', JSON.stringify({ order: before.order, canvas: before.canvas, cookTime: before.cookTime, totalTime: before.totalTime }));
        const names = [...(before.order.hanbao || [])];
        if (before.order.chadi) names.push(before.order.chadi);
        if (before.order.bingsha) names.push(...(drinkMix[before.order.bingsha] || [before.order.bingsha]));
        if (before.order.dingcengpeiliao) names.push(before.order.dingcengpeiliao);
        if (before.order.kaiweicai) names.push(...(Array.isArray(before.order.kaiweicai) ? before.order.kaiweicai : [before.order.kaiweicai]));
        const steps = [];
        for (const name of names) {
            const pos = before.itemPositions[name];
            if (!pos) { steps.push({ name, missing: true }); break; }
            await page.mouse.click(pos.x, pos.y);
            const current = await state(page);
            steps.push({ name, position: pos, coin: current.coin, correct: current.correct, mistakes: current.mistakes, cookTime: current.cookTime, gameFlag: current.gameFlag });
            if (current.coin > 0) break;
        }
        await page.waitForTimeout(1800);
        const afterOrder = await state(page);
        await page.screenshot({ path: path.join(output, 'after-order.png') });
        console.log('STEPS', JSON.stringify(steps));
        console.log('AFTER_ORDER', JSON.stringify({ coin: afterOrder.coin, order: afterOrder.order, cookTime: afterOrder.cookTime, totalTime: afterOrder.totalTime }));
        if (process.env.CHEF_ACCELERATE_SETTLEMENT === '1') {
            await page.evaluate(() => {
                const game = window.cc.director.getScene().getChildByName('Canvas').getChildByName('Game').components.find(c => c.CurrentOrder);
                game.currentTotalTime = 0.05;
            });
            await page.waitForTimeout(150);
            await page.evaluate(() => {
                const order = window.cc.director.getScene().getChildByName('Canvas').getChildByName('Game').getChildByName('dingdan').components.find(c => 'cookFlag' in c);
                order.update(11);
            });
            await page.waitForTimeout(500);
        } else {
            await page.waitForTimeout(Math.max(0, Math.ceil(afterOrder.totalTime * 1000) + 2500));
        }
        let settlement = await state(page);
        for (let i = 0; !settlement.success && i < 20; i++) {
            await page.waitForTimeout(500);
            settlement = await state(page);
        }
        await page.screenshot({ path: path.join(output, 'settlement.png') });
        console.log('SETTLEMENT', JSON.stringify({ coin: settlement.coin, success: settlement.success, gameActive: settlement.gameActive, gameFlag: settlement.gameFlag }));
        await page.mouse.click(190, 585);
        await page.waitForTimeout(1500);
        const returned = await state(page);
        await page.screenshot({ path: path.join(output, 'returned-hall.png') });
        console.log('RETURNED', JSON.stringify({ gameActive: returned.gameActive, startActive: returned.startActive, hallCoin: returned.hallCoin, success: returned.success, errors }));
        await page.mouse.click(190, 448);
        await page.waitForTimeout(700);
        const secondRound = await state(page);
        console.log('SECOND_ROUND', JSON.stringify({ coin: secondRound.coin, earnedCoin: secondRound.earnedCoin, correct: secondRound.correct, mistakes: secondRound.mistakes, gameFlag: secondRound.gameFlag, cookFlag: secondRound.cookFlag }));
        fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify({ timeout, before, steps, afterOrder, settlement, returned, secondRound, errors, consoleErrors }, null, 2));
        assert(before.gameFlag && before.cookFlag, '未从大厅开始正常营业');
        assert(afterOrder.coin > 0 && afterOrder.correct > 0, '订单未通过触摸完成');
        assert.equal(settlement.success, 'SuccessPanel', '未出现结算面板');
        assert(!returned.gameActive && returned.startActive && !returned.success, '领奖后未返回大厅');
        assert.equal(Number(returned.hallCoin), 1000 + settlement.coin, '普通奖励未正确入账');
        assert(secondRound.gameFlag && secondRound.cookFlag && secondRound.earnedCoin === 0 && secondRound.correct === 0, '再次开局统计未清零');
        assert.deepEqual(errors, [], '存在未处理的页面异常');
        assert.deepEqual(consoleErrors, [], '浏览器控制台存在错误');
    } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
