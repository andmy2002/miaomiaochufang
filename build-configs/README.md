# 喵喵厨房小游戏构建配置

`wechatgame.json` 和 `bytedance-mini-game.json` 是 Cocos Creator 3.8.8 的命令行构建参数。当前 AppID 留空，不能作为正式发布配置；抖音 AppID 是 Creator 的必填项。收到真实 AppID 后分别填写 `packages.wechatgame.appid` 和 `packages["bytedance-mini-game"].appid`。游戏名已设置为“喵喵厨房”，启动场景是 `loadScene.scene`。

微信构建：`CocosCreator --project <项目绝对路径> --build "configPath=build-configs/wechatgame.json"`

抖音构建：`CocosCreator --project <项目绝对路径> --build "configPath=build-configs/bytedance-mini-game.json"`

两次构建后执行 `node tools/audit-mini-game-build.cjs`。Creator 在 AppID 留空时会自动写入平台示例 ID；此后处理会将示例 ID 从本地产物清空、把已确认的微信图标复制到实际首屏 `logo.png`，再核对游戏名称、竖屏方向和旧推广文本。每次重新构建后必须重新执行。留空 AppID 的包仅供本地审查，不能提交审核。

平台图标和分享图候选文件在 `branding/platform/`；需要在平台后台上传。抖音审核分享图后，把返回的 `templateId` 填入 `assets/Script/Platform/PlatformBrandConfig.ts`。广告位填入 `assets/Script/Platform/PlatformAdConfig.ts`；空值表示不请求广告，不会发放激励视频奖励。
