# 阶段 E：微信／抖音小游戏适配与构建验收

日期：2026-10-01。目标引擎：Cocos Creator 3.8.8。游戏名：喵喵厨房。

## 先列阻塞项

1. 用户确认两平台 AppID、发行主体全称暂时没有；广告位 ID 稍后提供；抖音分享图 `templateId` 暂无。构建包不能视为已经绑定用户的平台账号，也不能提交审核。
2. 原游戏代码、343 张 PNG、16 个 MP3、两套标注“方正粗圆简体”的位图字体及 lightMVC/SuperScrollView 等来源的商用权尚缺书面证据。详见 `旧品牌与来源信息专项核查.md`。第三方授权说明未删除。
3. 尚未在微信／抖音开发者工具及真机验证 SDK、广告、分享、音频与后台恢复。没有真实账号和广告位时无法证明这些链路可用。
4. 两个构建包目前均未分包，文件字节数分别约 9.74 MiB 和 10.33 MiB。微信现行主包限制需由开发者工具复核；按官方分包说明的 4 MiB 主包标准，现包体需继续拆包或裁剪。抖音当前未分包包体大小也须由其开发者工具实际校验。不能把“Creator 构建成功”当作“平台可上传”。

包体规则参考：[Cocos Creator 3.8 小游戏分包指南](https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/subpackage.html)、[抖音代码包说明](https://developer.open-douyin.com/docs/resource/zh-CN/mini-game/develop/guide/basic-function/subpackages/introduction)。平台规则可能更新，最终以对应账号的开发者工具校验和后台提示为准。

## 本轮修改

- `MiniGamePlatform.ts`：微信／抖音分享初始化避免重复注册；激励视频 `onClose` 只注册一次，并发请求不会重复发奖励，取消与失败走失败回调。
- `LocalStorageUtil.ts`：修正整数存档读取无返回值的问题。保留旧本地存档键名以免浏览器预览用户数据丢失；键名不是面向玩家的品牌展示。
- 增加双平台 Creator 3.8.8 构建配置 `build-configs/`；启动场景指定为 `loadScene.scene`，游戏名为“喵喵厨房”，平台方向为竖屏，AppID 明确留空。
- 增加构建产物审计／后处理脚本。Creator 会给空 AppID 写入示例 ID；脚本会把示例 ID 从本地产物清空，并把已确认的品牌图标复制到微信首屏实际 `logo.png`（Creator 在复制模板后会重新生成默认图标），再核对游戏名、竖屏和已知旧推广文本。每次重新构建后都必须重新运行。

## 构建与静态验收

| 项目 | 微信小游戏 | 抖音小游戏 |
| --- | --- | --- |
| Creator 命令行构建 | 成功，退出码 36 | 成功，退出码 36 |
| 产物目录 | `build/wechatgame` | `build/bytedance-mini-game` |
| 实际文件大小合计 | 10,217,737 字节 | 10,831,519 字节 |
| `project.config.json` | 项目名“喵喵厨房”，AppID 空 | 项目名“喵喵厨房”，AppID 空 |
| `game.json` | portrait | portrait |
| 旧作者／销售文案文本扫描 | 0 文件 | 0 文件 |
| 平台账号、广告、真机 | 未验收 | 未验收 |

`node tools/test-mini-game-platform.cjs` 通过：激励视频只有一个关闭监听、没有重复奖励、取消回调正确。Creator 3.8.8 TypeScript `--noEmit` 通过；`node tools/audit-compat.cjs` 为 0 缺失资产、0 无效 ID、0 空绑定。扫描范围为构建包中的 JS／JSON／TXT／XML／HTML／CSS 文本；图片／音频中的潜在水印或版权问题不能由文本扫描排除。

浏览器预览回归 `node tools/check-stage-d.cjs` 再次通过：大厅、角色／任务／成就／升级／设置面板、一局订单、9 金币结算、返回大厅、重开均完成，记录的运行错误为 0。这是浏览器验证，不等同于两平台开发者工具或真机验收。

微信分享图 `branding/share.png` 已随构建模板进入包；首屏 `logo.png` 在后处理后与已确认图标 SHA-256 一致。微信首屏仍保留 Cocos 引擎“Created with Cocos”字样，它不是旧游戏作者广告；游戏自己的加载场景使用“喵喵厨房”Logo。微信首屏图标尚未在微信开发者工具做视觉验收。新图标／启动图候选素材需在两平台后台上传并审核，文件见 `branding/platform/`。抖音分享卡片需要后台审核得到 `templateId`，当前仅设置分享标题和描述。

## 用户下一步提供

1. 微信小游戏 AppID、抖音小游戏 AppID、发行主体法定全称，以及后台确认的游戏名称。
2. 若启用广告，分别提供微信和抖音的 Banner／插屏／激励视频广告位 ID；若某种广告不用，请明确“禁用”。
3. 抖音分享图审核通过后提供 `templateId`。
4. 原素材、音乐、字体和第三方代码的可商用与再分发授权文件；无法提供的项目需替换。
5. 在平台后台上传并确认图标、启动／加载图、分享图；开发者工具和真机上检查加载、存档、背景音乐、切后台恢复、广告取消/完成、分享和一局重开。

构建命令和后处理步骤见 `build-configs/README.md`。正式 AppID 填写后应重新构建、运行产物审计，并在开发者工具查看代码包大小和上传前校验。
