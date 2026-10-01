import * as cc from "cc";
import { BaseView } from "../../../lightMVC/core/base/BaseView";
import { App } from "../../Manager/App";
import game from "../../game";
import SdkManager from "../../../resources/sdk/script/SdkManager";
import { _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export default class PausePanel extends BaseView {

    public drawView(): void {
        SdkManager.Instance.showNativeBannerAddButton();
        SdkManager.Instance.showNativeInterstitial();
        // 返回主页
        let back = this.ui.getNode("back");
        back.on(cc.Node.EventType.TOUCH_END, () => {
            game.instance.backMain();
            this.closeView();
        }, this);
        // 继续游戏
        let continues = this.ui.getNode("continue");
        continues.on(cc.Node.EventType.TOUCH_END, () => {
            game.instance.ContinueGame();
            this.closeView();
            SdkManager.Instance.showNativeBanner();
        }, this);

        // let shuomingNode = this.ui.getNode("shuomingNode");
        // shuomingNode.active = false;
        
        // let shuoming = this.ui.getNode("shuoming");
        // shuoming.on(cc.Node.EventType.TOUCH_END, () => {
        //     shuomingNode.active = true;
        // }, this);
        // let confirm = this.ui.getNode("confirm");
        // confirm.on(cc.Node.EventType.TOUCH_END, () => {
        //     shuomingNode.active = false;
        // }, this);
    }

    public static path(): string {
        return "prefabs/PausePanel";
    }
}
