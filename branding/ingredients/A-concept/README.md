# A 款食材选择区重绘审稿图

`ingredient-grid-v3.png` 是已确认的 3 行 × 6 列审稿图；`ingredient-grid-v1.png` 和 `ingredient-grid-v2.png` 保留作旧版对照。**整张审稿图不是可直接导入的 SpriteFrame**。现已从它导出 18 张透明 PNG 到 `branding/ingredients/A-export/`，并替换 A 菜单及共用饮料的原资源。原截图中的 FPS 面板被忽略。原物品顺序来自 `assets/Script/Framework/Manager/DataManager.ts` 的 `IngredientsList`；`assets/Script/game.ts` 按该对象顺序生成选择项，`assets/Script/view/ChooseItem.ts` 从下面的路径加载图片。

| 位置 | 物品 | 原始资源（位于 `assets/resources/texture/shicai/`） |
| --- | --- | --- |
| 1-1 | 无芝麻的上层面包 | `A/mianbaoshang.png` |
| 1-2 | 融化的黄色芝士片 | `A/jiaceng6.png` |
| 1-3 | 两片紫洋葱圈 | `A/jiaceng3.png` |
| 1-4 | 纸盒薯条 | `A/kaiweicai3.png` |
| 1-5 | 巧克力顶的猫脸奶油配料 | `A/dingcengpeiliao.png` |
| 1-6 | 红色瓶装饮料 | `yinliao/hong.png` |
| 2-1 | 汉堡肉饼 | `A/jiaceng2.png` |
| 2-2 | 两片番茄 | `A/jiaceng7.png` |
| 2-3 | 交叉摆放的培根 | `A/jiaceng1.png` |
| 2-4 | 纸盒炸鸡块 | `A/kaiweicai1.png` |
| 2-5 | 牛奶（原图为蓝白纸盒；v3 审稿图为白色圆肩奶瓶、浅蓝瓶盖和“牛奶”字样） | `yinliao/niunai.png` |
| 2-6 | 黄色瓶装饮料 | `yinliao/huang.png` |
| 3-1 | 下层面包 | `A/mianbaoxia.png` |
| 3-2 | 生菜叶 | `A/jiaceng5.png` |
| 3-3 | 煎蛋 | `A/jiaceng4.png` |
| 3-4 | 巧克力松糕／纸杯蛋糕 | `A/kaiweicai2.png` |
| 3-5 | 棕色茶底挤压瓶 | `yinliao/chadi.png` |
| 3-6 | 蓝色瓶装饮料 | `yinliao/lan.png` |

代码里的 `chadi` 类型是“茶底”，因此此处只按视觉保留棕色挤压瓶，不将其擅自改名为巧克力酱。A 菜单同一组资源同时由 `ChooseItem.ts`（选材）、`view/order/Order.ts`（右侧订单）和 `plate.ts`（盘子上的制作结果）加载；尺寸保持与旧资源一致，原 `.png.meta` 和 UUID 不变。B/C/D 菜单的食物是其他品类，本轮未替换；共用饮料图会影响所有菜单。`yinliao/*bingsha.png` 是另外的成品饮料图，共 15 款，不属于这 18 张原料图，本轮未替换。

单图导出方式：`tools/export-ingredient-a-sprites.swift` 从已确认的审稿图机械分离、去除卡片背景并缩放到原 SpriteFrame 尺寸。煎蛋的浅色蛋白无法可靠地从卡片底色分离，因此使用内置图像生成工具，参照审稿图与原煎蛋轮廓，单独生成 `egg-transparent-hires.png`，再由同一导出脚本缩小为 `A/jiaceng4.png`。重导出命令：

```sh
swift -sdk /Library/Developer/CommandLineTools/SDKs/MacOSX15.4.sdk -module-cache-path /private/tmp/miaomiao-swift-cache tools/export-ingredient-a-sprites.swift branding/ingredients/A-concept/ingredient-grid-v3.png branding/ingredients/A-concept/egg-transparent-hires.png branding/ingredients/A-export
```

煎蛋生成提示词：

> Use case: stylized-concept. Asset type: single transparent gameplay ingredient sprite for a burger stack in a 2D mobile game. Image 1 is the approved warm-outlined food-art style reference, specifically the fried egg in row 3 column 3. Image 2 is the original gameplay sprite and exact SILHOUETTE/VIEWPOINT reference. Draw ONE complete fried egg, including an irregular gently wavy WHITE egg-white oval with a warm tan outline and one glossy golden yolk slightly left of center. Keep it low, wide and horizontally flat, like image 2, suitable for stacking in a burger; approximate visible object aspect ratio 2.6:1. Match image 1's orange-brown outline, soft clean shading, and restrained 2D casual-game style. Genuinely transparent alpha background with no square card, no shadow, no text, no other food or objects. Center the egg and leave only a small transparent margin. Output a single sprite, not a contact sheet.

生成方式：内置图像生成工具。审稿图最终提示词集：

> Use case: stylized-concept. Asset type: REVIEW CONTACT SHEET for exactly 18 ingredient-choice icons in a cute 2D mobile game, arranged in exactly THREE ROWS AND SIX COLUMNS. Input image 1 is the original item grid and exact item/order reference; ignore the debug/FPS text overlay. Input image 2 is the approved '喵喵厨房' kitchen art-style reference. Redraw the SAME objects, no substitutions, with a coherent polished 2D casual-game cartoon style: clean warm brown outlines, soft restrained shading, pleasing food textures, high legibility at tiny icon size. Preserve the object's natural recognizable colors; use cream rounded square slot backgrounds with thin warm-brown edges, even spacing, no text or labels. EACH OF THE 18 CELLS CONTAINS EXACTLY ONE ICON and NO overlaps. Exact row-major mapping: ROW 1 left to right: (1) golden top hamburger bun, (2) melted yellow cheese slice, (3) two rings of purple onion, (4) orange carton of thin French fries with tiny cream paw print on carton, (5) white cat-face cream topping with dark chocolate cap, (6) short clear glass bottle of red drink. ROW 2: (7) brown cooked hamburger patty, (8) two red tomato slices, (9) crossing crispy bacon strips, (10) orange carton of golden fried chicken pieces with tiny cream paw print, (11) blue-and-white milk carton with tiny simple cow-face illustration, (12) short clear glass bottle of golden yellow drink. ROW 3: (13) golden bottom hamburger bun shown from above as a flat bun base, (14) green lettuce leaf, (15) fried egg with white and bright golden yolk, (16) dark chocolate muffin in brown paper cup, (17) brown tea-base syrup squeeze bottle lying diagonally with a narrow nozzle, (18) short clear glass bottle of deep blue drink. Important distinctions: top bun versus bottom bun; cheese versus lettuce; two onion rings versus two tomato slices; fries versus fried chicken; chocolate muffin versus cat-face cream topping; three drink bottle colors red/yellow/blue plus separate milk carton and separate brown squeeze bottle. No extra objects, no missing cells, no title, no labels, no FPS debug overlay, no characters, no logo, no photorealism, no 3D. Output as a clean high-resolution landscape 3x6 review sheet; do not change the layout or item identities.

> Correction prompt: Change ONLY icon number 1, the hamburger TOP BUN in the first row and first column: remove every sesame seed / pale oval seed from its top surface so it becomes the same plain golden-orange glossy top bun as the original game asset. Preserve the other 17 icons and the 3×6 layout unchanged.

v2 使用内置图像生成工具，以 v1 为精确编辑目标；本次只修改牛奶外观，未改动游戏资源。提示词：

> Use case: precise-object-edit. Asset type: updated 18-ingredient game-art review board. Image 1 is the exact edit target. Change ONLY the milk icon in row 2, column 5 (the blue-and-white carton with a cow face). Replace it with a charming small, squat, opaque WHITE MILK BOTTLE, rounded shoulders, short pastel sky-blue cap, and a subtle small cat-paw emblem; make the white milk clearly visible. Keep it within exactly the same card, scale and warm-outlined, softly shaded 2D cartoon style. It should look distinctly different from the transparent red, yellow, and blue juice bottles in the rightmost column. Preserve pixel-for-pixel as closely as possible the other 17 ingredient icons, all card borders, backgrounds, shadows, exact 3-by-6 layout, proportions, spacing, canvas aspect ratio, and all other details. Do not add text, labels, logos, characters, or other objects.

v3 使用内置图像生成工具，以 v2 为精确编辑目标；仅将牛奶瓶身爪印改为“牛奶”两个汉字。提示词：

> Use case: precise-object-edit. Asset type: 18-icon ingredient review sheet for a 2D cartoon mobile game. Image 1 is the exact edit target. Change ONLY the front of the white milk bottle in ROW TWO, COLUMN FIVE. Remove the pale-blue cat-paw symbol and replace it with exactly two Chinese Hanzi characters, “牛奶” (N-I-U / N-A-I in Chinese: first character 牛, second character 奶), printed together horizontally, centered on the front of the bottle. Make the two characters medium blue, rounded, bold, legible at thumbnail size; no extra characters. Preserve the bottle's white shape, blue cap, highlights and shadows, its card, the other 17 icons, all borders, backgrounds, exact 3×6 layout, image dimensions and aspect ratio. Do not redraw or alter any other item. No cat paw on the milk bottle.
