# 阶段 D：兼容性清理与回归验收

日期：2026-09-30。工程：当前桌面项目，Cocos Creator 3.8.8。

## 本轮修复

- 静态扫描定位并清除了 8 个预制体中共 16 个失效的旧按钮 `pressedSprite`/`hoverSprite` 字段；3.x 正在使用的 `_pressedSprite`/`_hoverSprite` 保留。涉及 `AddPanel`、`BuyRolePanel` 和 6 个 SDK 广告预制体。
- `XButton.ts` 改为 3.x `Tween.stopAllByTarget`，去掉无效的临时 Tween `stop()`/`removeSelf()` 调用；触摸监听使用可解绑的方法引用。
- 顾客 3 缺失 `texture/guke/3/zui.png` 和 `bizui.png`。补齐素材前，`player.ts` 暂时只从顾客 1、2、4、5、6 中随机选择，避免顾客脸部缺图；顾客 3 的资源未删除。
- 删除根目录仅服务于 Cocos 2.x 的 `creator.d.ts`（约 3.2 万行）；`tsconfig.json` 改为只纳入 `assets` 内脚本，直接使用 Creator 3.8.8 类型。删除文件可从用户原始存档恢复，但当前工程不再依赖它。

## 静态与运行时核查

- `tools/audit-compat.cjs` 扫描 600 个资产元数据文件、22 个场景/预制体文件，并对照项目与 3.8.8 内置资产 UUID：缺失资源引用 0、越界节点索引 0、所扫描的空绑定字段 0。此检查不等同于对每个脚本所有可选属性的语义验证。
- `assets/resources/configs/food.json` 的 39 种订单在 4 套厨师食材图中均有对应文件；10 套角色部件齐全。6 套顾客部件中仅顾客 3 缺上述两张嘴部图。
- 浏览器中批量加载 10 个游戏 UI 预制体和 8 个 SDK 预制体，连同场景检查 562 个节点：无加载失败、Missing Script 或控制台错误。
- Creator 3.8.8 自带 TypeScript 编译器执行 `--noEmit -p tsconfig.json`，结果 0 错误。移除 `creator.d.ts` 后重新打开工程并再次完成预览。

## 完整浏览器回归

同一个隔离 Chrome 浏览器上下文按“启动 → 大厅 → 角色 → 任务 → 成就 → 升级 → 设置 → 游戏 → 交付 → 自然结算 → 领取 → 返回大厅 → 重开”执行。最终一轮随机到混合饮料订单，正确点击 3 次、错误 0 次，交付收入 3；自然计时结束后普通奖励入账，大厅余额 1003；重开后本局金币和食材计数回到 0。页面异常和控制台错误均为 0。

截图及机器报告在 `temp/stage-d-regression/`（`01-startup.png` 至 `07-returned.png`、`report.json`）。`temp` 为可清理缓存；复现脚本为 `tools/check-stage-d.cjs`、`tools/check-runtime-assets.cjs` 和 `tools/audit-compat.cjs`。

## 旧品牌、推广与授权分类

| 类别 | 当前发现 | 处理状态 |
| --- | --- | --- |
| 旧游戏 Logo/名称 | `assets/scene/loadScene.scene` 引用 `xxchushizhang` / `xxcslogo` 龙骨；`assets/texture/dragons/logo/xxcslogo_ske.json`、`xxcslogo_tex.json`、`xxcslogo_tex.png` 中含可见的“小小厨师长”图形 | 等用户提供新名称和 Logo，不能擅自替换为猜测的品牌 |
| 旧作者标记 | `assets/Script/Manager/` 中 `App.ts`、`GameInfo.ts`、`LayerManager.ts`、`SingleClass.ts`、`SoundManager.ts` 标有 `@author xiongjian` | 来源/授权待核查，暂不删除 |
| 框架作者标记 | `assets/lightMVC/core/` 中 `BaseMediator.ts`、`ViewEvent.ts` 标有 `@author Yue`；`CommandManager.ts`、`ViewManager.ts` 标有 `@author ituuz` | 可能是第三方框架署名，按授权条款处理，暂不删除 |
| 销售广告/联系信息 | 扫描 `assets`、`settings` 和项目配置中的源码销售、邮箱、Telegram、QQ群、微信号类文本，当前没有检出待清理命中 | 此前已清理的推广文案没有在本轮回归中重现 |
| 发布配置占位 | `package.json` 名称 `little-chef-cocos3`；`settings/v2/packages/cocos-service.json` 为“未知游戏”/`UNKNOW`；`settings/services.json` 仍为 `UNKNOW`；`settings/project.json` AppID 为空，`PlatformAdConfig.ts` 广告位为空 | 这些不是确认的新品牌；平台构建前须按用户信息填写 |
| 第三方声明 | `extensions/plugin-import-2x/node_modules/` 内有多个依赖的 LICENSE 文件；广告 SDK 预制体的 `native_ad_logo_img` 是广告标识，不是旧游戏 Logo | 未删除；轻量框架、SDK、图片、音乐、字体和龙骨素材的来源与可商用权利仍需核查 |

## 不阻塞当前预览、但仍待处理

- 旧脚本 `SharePanel.ts`、`PopOutPanelView.ts` 引用尚不存在的 `prefabs/SharePanel`、`prefabs/PopOutPanel`；`DefaultSceneMediator.ts` 指向不存在的 `FriendScene`。项目当前没有调用这些入口，完整回归没有触发；恢复这些功能需原始预制体/场景，或确认废弃后再移除相关代码。
- `TipsManager.ts` 的旧提示/奖励路径 `new_tips`、`prefabs/rewardTips` 及若干图名在当前 resources 中不存在；其调用仅见于上述未启用的 `PopOutPanelView`，不是当前主流程阻塞项。
- 微信/抖音广告奖励、分享、存档及真机表现仍未测试；不能用浏览器回归代替平台验收。

## 需要人工确认

1. 新游戏正式名称、发行主体和用于替换“小小厨师长”的新 Logo；发布图标、启动图、分享图。
2. 顾客 3 的 `zui.png`、`bizui.png` 原素材，或同意保持该顾客暂不出现。
3. 原代码、lightMVC 框架、SDK、图片、音频、字体、龙骨的来源和微信/抖音商用授权；必要时提供可替换素材。
4. 分享页、训练/工作弹窗和 `FriendScene` 是保留开发还是正式废弃；不要由迁移过程自行猜测。
5. 平台阶段提供微信/抖音 AppID、广告位 ID 与发布账号参数。

## 下一步建议提示词

```text
请阅读“阶段D_兼容性清理与回归验收.md”，继续旧品牌与来源授权专项核查。先根据我提供的新游戏名称、发行主体和 Logo 替换加载场景旧“小小厨师长”标志及发布配置；逐项区分源码销售推广、项目作者标记、第三方框架/SDK 署名和素材授权。对无法确认商用权利的图片、音频、字体与龙骨列替换清单，不擅自删掉许可证或冒充原创。确认顾客 3 缺图和未启用的分享/弹窗功能如何处理后，重新做浏览器回归；暂不构建微信或抖音小游戏。
```
