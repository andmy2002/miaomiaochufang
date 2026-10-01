#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const targets = [
  { name: 'wechatgame', exampleId: 'wx6ac3f5090a6b99c5' },
  { name: 'bytedance-mini-game', exampleId: 'testappId' },
];
const legacy = /xiongjian|更多源码|更多游戏源码|源码出售|厨师游戏|厨师经营|sausage\s*run|加微信|加vx|微信号[:：]|vx号[:：]/i;
let failed = false;

for (const target of targets) {
  const dir = path.join(root, 'build', target.name);
  const config = path.join(root, 'build-configs', `${target.name}.json`);
  if (!fs.existsSync(dir)) { console.error(`${target.name}: no build output`); failed = true; continue; }
  const expectedId = JSON.parse(fs.readFileSync(config, 'utf8')).packages[target.name].appid;
  const projectConfigPath = path.join(dir, 'project.config.json');
  const projectConfig = JSON.parse(fs.readFileSync(projectConfigPath, 'utf8'));
  // Creator substitutes a vendor example AppID when the supplied one is blank.
  // Never leave that example in a handoff package that could be mistaken for a real account.
  if (!expectedId && projectConfig.appid === target.exampleId) {
    projectConfig.appid = '';
    fs.writeFileSync(projectConfigPath, `${JSON.stringify(projectConfig)}\n`);
  }
  if (target.name === 'wechatgame') {
    // Creator regenerates its built-in first-screen logo after copying templates.
    // Apply the approved brand icon to the actual emitted asset at handoff time.
    fs.copyFileSync(path.join(root, 'build-templates/wechatgame/logo.png'), path.join(dir, 'logo.png'));
  }
  const findings = [];
  function walk(folder) {
    for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
      const file = path.join(folder, entry.name);
      if (entry.isDirectory()) { walk(file); continue; }
      if (!/\.(?:js|json|txt|xml|html|css)$/i.test(entry.name)) continue;
      if (legacy.test(fs.readFileSync(file, 'utf8'))) findings.push(path.relative(dir, file));
    }
  }
  walk(dir);
  const game = JSON.parse(fs.readFileSync(path.join(dir, 'game.json'), 'utf8'));
  const ok = projectConfig.projectname === '喵喵厨房' &&
    game.deviceOrientation === 'portrait' &&
    projectConfig.appid === expectedId && findings.length === 0 &&
    (target.name !== 'wechatgame' || fs.readFileSync(path.join(dir, 'logo.png')).equals(
      fs.readFileSync(path.join(root, 'build-templates/wechatgame/logo.png'))));
  console.log(`${target.name}: ${ok ? 'PASS' : 'FAIL'}; AppID ${expectedId ? 'configured' : 'empty'}; legacy text files ${findings.length}`);
  for (const file of findings) console.error(`  legacy text: ${file}`);
  if (!ok) failed = true;
}
if (failed) process.exitCode = 1;
