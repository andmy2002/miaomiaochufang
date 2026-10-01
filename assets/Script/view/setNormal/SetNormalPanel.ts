import * as cc from "cc";
import { BaseView } from "../../../lightMVC/core/base/BaseView";
import { App } from "../../Manager/App";
import SdkManager from "../../../resources/sdk/script/SdkManager";
import { _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export default class SetNormalPanel extends BaseView {

    public drawView(): void {
        // 返回
        let closeBtn = this.ui.getNode("close");
        closeBtn.on(cc.Node.EventType.TOUCH_END, () => {
            this.closeView();
        }, this);
        this.setMusic();
        this.setEffect();
        SdkManager.Instance.showNativeBannerAddButton();
        SdkManager.Instance.showNativeInterstitial();
    }

    //设置音乐
    public setMusic(): void {
        let MusicBtn = this.ui.getNode("music");
        let musicOn = MusicBtn.getChildByName('on');
        let musicOff = MusicBtn.getChildByName('off');
        musicOn.active = (App.SoundManager.allowPlayBGM) ? true : false;
        musicOff.active = (App.SoundManager.allowPlayBGM) ? false : true;
        MusicBtn.on(cc.Node.EventType.TOUCH_END, () => {
            App.SoundManager.allowPlayBGM = !App.SoundManager.allowPlayBGM;
            musicOn.active = (App.SoundManager.allowPlayBGM) ? true : false;
            musicOff.active = (App.SoundManager.allowPlayBGM) ? false : true;
            App.LocalStorageUtil.setBoolean(App.LocalStorageUtil.lst_music, App.SoundManager.allowPlayBGM);
            console.log('点击音乐', App.SoundManager.allowPlayBGM);
        }, this);
    }

    //设置音效
    public setEffect(): void {
        let EffectBtn = this.ui.getNode("audio");
        let effectOn = EffectBtn.getChildByName('on');
        let effectOff = EffectBtn.getChildByName('off');
        effectOn.active = (App.SoundManager.allowPlayEffect) ? true : false;
        effectOff.active = (App.SoundManager.allowPlayEffect) ? false : true;
        EffectBtn.on(cc.Node.EventType.TOUCH_END, () => {
            App.SoundManager.allowPlayEffect = !App.SoundManager.allowPlayEffect;
            effectOn.active = (App.SoundManager.allowPlayEffect) ? true : false;
            effectOff.active = (App.SoundManager.allowPlayEffect) ? false : true;
            App.LocalStorageUtil.setBoolean(App.LocalStorageUtil.lst_effect, App.SoundManager.allowPlayEffect);
            console.log('点击音效', App.SoundManager.allowPlayEffect);
        }, this);
    }

    public static path(): string {
        return "prefabs/SetNormalPanel";
    }
}
