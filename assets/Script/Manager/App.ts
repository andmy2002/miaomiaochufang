import * as cc from "cc";
import { view } from "cc";
/**
 * App主类
 * @author chenk <hzzhewu@163.com>
 * @since 2018-1-22

 */
import { SingleClass } from "./SingleClass";
import { SoundManager } from "./SoundManager";
import DragonManager from "./DragonManager";
import LayerManager from "./LayerManager";
import TipsManager from "./TipsManager";
import EffectUtils from "./EffectUtils";
import { BaseView } from "../../lightMVC/core/base/BaseView";
import { Facade } from "../../lightMVC/core/Facade";
import { ConfigDataMgr } from "../Framework/Manager/ConfigDataMgr";
import { LocalStorageUtil } from "../Framework/Utils/LocalStorageUtil";
import { DataManager } from "../Framework/Manager/DataManager";
export class App extends SingleClass {

    /** 配置管理类 */
    public static get ConfigMgr(): ConfigDataMgr {
        return ConfigDataMgr.getInstance<ConfigDataMgr>();
    }

    /** 数据管理类 */
    public static get DataManager(): DataManager {
        return DataManager.getInstance<DataManager>();
    }


    /**启动框架*/
    public static startUp(): void {
        // Both loadScene and direct game-scene preview use the original portrait canvas.
        view.setDesignResolutionSize(720, 1280, cc.ResolutionPolicy.SHOW_ALL);
        //声音设置
        let allowBGM = App.LocalStorageUtil.getBoolean(App.LocalStorageUtil.lst_music);
        App.SoundManager.allowPlayBGM = (allowBGM == null || allowBGM) ? true : false;
        let allowEffec = App.LocalStorageUtil.getBoolean(App.LocalStorageUtil.lst_effect);
        App.SoundManager.allowPlayEffect = (allowEffec == null || allowEffec) ? true : false;
        App.LocalStorageUtil.setBoolean(App.LocalStorageUtil.lst_music, App.SoundManager.allowPlayBGM);
        App.LocalStorageUtil.setBoolean(App.LocalStorageUtil.lst_effect, App.SoundManager.allowPlayEffect);
        console.log('音乐：', App.SoundManager.allowPlayBGM, '音效:', App.SoundManager.allowPlayEffect)
    }

    /**声音管理器 */
    public static get SoundManager(): SoundManager {
        return SoundManager.getInstance();
    }
    /**存储管理器 */
    public static get LocalStorageUtil(): LocalStorageUtil {
        return LocalStorageUtil.getInstance<LocalStorageUtil>();
    }
    /**动画管理器 */
    public static get DragonManager(): DragonManager {
        return DragonManager.getInstance();
    }
    /**图层管理器 */
    public static get LayerManager(): LayerManager {
        return LayerManager.getInstance();
    }
    /**提示管理器 */
    public static get TipsManager(): TipsManager {
        return TipsManager.getInstance();
    }
    /**缓动系统 */
    public static get EffectUtils(): EffectUtils {
        return EffectUtils.getInstance();
    }
    /**屏幕宽高 */
    public static get StageUtils(): cc.Size {
        return view.getVisibleSize();
    }
    /**加载场景 */
    public static get Facade(): Facade {
        return Facade.getInstance();
    }

}
