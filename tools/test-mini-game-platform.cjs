#!/usr/bin/env node
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const ts = require('/Applications/Cocos/Creator/3.8.8/CocosCreator.app/Contents/Resources/resources/3d/engine/node_modules/typescript');

const source = fs.readFileSync(path.resolve(__dirname, '../assets/Script/Platform/MiniGamePlatform.ts'), 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const mod = { exports: {} };
new Function('require', 'module', 'exports', js)(
  () => ({ PLATFORM_BRAND: { title: '喵喵厨房', shareDescription: '', wechatShareImage: 'branding/share.png', bytedanceShareTemplateId: '' } }),
  mod, mod.exports,
);
const platform = mod.exports.MiniGamePlatform;
const closeCallbacks = [];
let created = 0;
let rewarded = 0;
let failed = 0;
globalThis.wx = {
  showShareMenu() {},
  onShareAppMessage() {},
  createRewardedVideoAd() {
    created++;
    return { onError() {}, onClose(fn) { closeCallbacks.push(fn); }, show() { return Promise.resolve(); } };
  },
};
const ad = { banner: '', interstitial: '', rewardedVideo: 'test-unit' };
platform.init();
platform.showRewardedVideo(ad, () => rewarded++, () => failed++);
platform.showRewardedVideo(ad, () => rewarded++, () => failed++); // concurrent call must not duplicate rewards
assert.equal(failed, 1);
closeCallbacks[0]({ isEnded: true });
assert.equal(rewarded, 1);
platform.showRewardedVideo(ad, () => rewarded++, () => failed++);
closeCallbacks[0]({ isEnded: false });
assert.equal(rewarded, 1);
assert.equal(failed, 2);
assert.equal(created, 1);
assert.equal(closeCallbacks.length, 1);
delete globalThis.wx;
console.log('mini-game bridge PASS: one rewarded-video listener, no duplicate grant, cancellation handled');
