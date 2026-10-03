# 喵喵厨房 · 营业员形象资源

## 角色对应

| 编号 | 新形象 | 旧装扮中保留的识别元素 |
| --- | --- | --- |
| 1 | 白色布偶猫 | 紫色贝雷帽、粉色爱心 |
| 2 | 蓝灰英短 | 白色厨师帽、蓝色领结 |
| 3 | 金棕虎斑猫 | 汉堡帽、棕色厨师服 |
| 4 | 黑白奶牛猫 | 汉堡薯条帽、红色领巾 |
| 5 | 奶油色暹罗猫 | 高厨师帽、蓝色领结 |
| 6 | 奶油色折耳猫 | 蓬松白厨师帽 |
| 7 | 黑猫 | 红色厨师帽、红黑制服 |
| 8 | 橘色长毛猫 | 红白厨师帽、红色领巾 |
| 9 | 玳瑁猫 | 樱桃蛋糕帽、蓝色厨师服；替代带国旗的废稿 |
| 10 | 薄荷色头巾三花猫 | 薄荷绿头巾、浅色制服 |

## 资源规格与用途

- `masters/1.png` 至 `masters/10.png`：高清 RGBA PNG 定稿；不直接作为低分辨率 UI SpriteFrame，也不在动作制作时重画待机造型。
- `cards/1.png` 至 `cards/10.png`：从高清原图等比缩放并置于 **116 × 142 px** 透明画布的候选角色卡图。
- `../../assets/resources/texture/rolechoose/1.png` 至 `10.png`：已接入角色选择卡；沿用原文件名与 `.meta`，不改变 SpriteFrame UUID。角色列表和购买弹窗使用这些图。第 10 位薄荷头巾三花猫在本轮动作接入时同步替换了旧卡图。
- `approved-variants/tortoiseshell-no-flag-master.png`：用户确认用于替代带国旗汉堡帽废稿的玳瑁小猫高清原图；`tortoiseshell-no-flag-card.png` 是 116 × 142 px 透明角色卡规格。用户已指定该形象为第 9 位；`masters/9.png`、`cards/9.png` 和游戏角色卡 `rolechoose/9.png` 均已同步。第 1–8 位未改动。
- `archive/9-noodle-master.png` 和 `9-noodle-card.png`：被替换的第 9 位面食帽候选稿，仅归档，不再由游戏加载。
- 角色卡导出方式：`swift tools/export-role-portraits.swift branding/roles/masters branding/roles/cards`。
- 保留已确认的原画：第 3、4、8 位在 2026-10-02 恢复为最初确认稿，之前清理背景时重画的近似稿不再使用。原确认稿的背景色晕尚待单独处理；未经再次确认，不重画这些角色。
- 透明背景：所有文件保留 RGBA；新增角色不应混入背景光晕、广告、文字、旗帜或第三方 Logo。

## 游戏内动作素材

10 位角色均已在 `assets/resources/texture/juese/<编号>/pose_{idle,blink,cheer,fire}.png` 接入四帧整身动作，分别用于待机、眨眼、答对／结算举爪、连击火焰眼。共 **40 张 RGBA PNG**；每位的画布尺寸与自己的旧 `shenti.png` 相同。高清动作源图存放在 `motion-<编号>/masters/`。其中 `idle.png` 是对应 `masters/<编号>.png` 的原样副本，已确认的第 1–8 位和第 9 位待机造型没有重画。

第 1–8、10 位的导出命令为 `swift tools/export-role-motion.swift <编号> assets/resources/texture/juese/<编号>/shenti.png branding/roles/motion-<编号>/masters assets/resources/texture/juese/<编号>`；第 9 位保留既有 `tools/export-role9-motion.swift`。`player.ts` 对全部 10 位切换整身动作帧；若待机帧加载失败，回退旧分层角色。旧分层图片没有删除。

## 图像生成说明

使用内置 `image_gen`，以原有角色图片作为帽子、服装参考，以已经确认的布偶猫图片作为统一画风参考；每个角色独立生成。共同要求为可爱的正面 Q 版小猫、清晰深色描边、适合手机游戏的小尺寸识别度、无文字和旧品牌。第 9 位是已确认的樱桃蛋糕帽玳瑁猫。曾生成过带国旗的汉堡帽角色稿，但该稿未进入 `masters`、`cards` 或 `assets`，不得使用。

第 9 位动作帧使用内置 `image_gen` 以 `masters/9.png` 为唯一编辑目标生成：眨眼只闭合双眼；举爪帧抬起双爪并闭眼欢笑；火焰眼帧只在绿色瞳孔内增加金橙色火焰亮点。三次编辑都要求保持同一只猫的花纹、帽子、制服、画风、位置和透明画布，禁止旗帜、品牌和文字。

第 1–8、10 位动作帧采用相同方式，以各自 `masters/<编号>.png` 为唯一编辑目标；眨眼只闭眼，欢呼时双爪略抬并微笑，连击时只在瞳孔内增加金橙色高光。要求保留脸型、毛色花纹、帽子、制服、配色、画风和构图，不添加文字、品牌或额外道具。第 3、4、8 位原画固有的边缘色晕未被擅自重画，建议在游戏绿底上重点人工检查。

### 10 位角色本地预览验收

用 Creator 3.8.8 打开项目、等待资源导入后浏览器预览，逐个选择 10 位角色并开始游戏。待机时应周期性眨眼；答对订单时短暂举爪；连击时瞳孔出现火焰；完成订单时保持欢呼动作；重开后回到待机。切换角色后，不应串用前一位的图片或出现旧分层部件。第 10 位角色卡应显示薄荷头巾三花猫。

若待验收角色尚未解锁，可**仅在本地预览的浏览器控制台**执行以下代码，先备份浏览器存档再临时选用任意编号。把 `previewRole` 改成 `1` 至 `10`：

```js
const previewRole = '10';
sessionStorage.setItem('role_motion_preview_backup', localStorage.getItem('chef_userData') ?? '__MISSING__');
const rolePreviewData = JSON.parse(localStorage.getItem('chef_userData') || '{}');
rolePreviewData.currRole = previewRole;
rolePreviewData.roleList = [...new Set([...(rolePreviewData.roleList || ['1']), previewRole])];
localStorage.setItem('chef_userData', JSON.stringify(rolePreviewData));
location.reload();
```

验收结束后，在**同一浏览器标签页**恢复原存档：

```js
const roleBackup = sessionStorage.getItem('role_motion_preview_backup');
if (roleBackup === '__MISSING__') localStorage.removeItem('chef_userData');
else if (roleBackup !== null) localStorage.setItem('chef_userData', roleBackup);
sessionStorage.removeItem('role_motion_preview_backup');
location.reload();
```
