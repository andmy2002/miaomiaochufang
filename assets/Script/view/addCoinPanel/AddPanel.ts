import * as cc from "cc";
import { BaseView } from "../../../lightMVC/core/base/BaseView";
import { App } from "../../Manager/App";
import NotifyModel from "../../model/NotifyModel";
import GetEffect from "../../prop/GetEffect";
import StartScene from "../../StartScene";
import SdkManager from "../../../resources/sdk/script/SdkManager";
import { _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export default class AddPanel extends BaseView {

    private zuanshiFlag: boolean = false;
    public drawView(data: any): void {
        SdkManager.Instance.showNativeInterstitial();
        // 返回
        this.zuanshiFlag = (data.type == 'zuanshi') ? true : false;
        this.ui.getNode("zuanshi").active = this.zuanshiFlag;
        this.ui.getNode("jinbi").active = !this.zuanshiFlag;
        let nums = this.ui.getNode("num");
        let addnums = (this.zuanshiFlag) ? App.DataManager.VideoAddDiamand : App.DataManager.VideoAddCoin;
        nums.getComponent(cc.Label).string = "+" + addnums.toString();
        let message = this.ui.getNode("message");
        let showStr = '';
        if (data.clickType == 'buzu') {
            showStr = (this.zuanshiFlag) ? "钻石不足，是否观看视频？" : "硬币不足，是否观看视频？";
        } else {
            showStr = "看视频获得奖励，是否确定？";
        }
        message.getComponent(cc.Label).string = showStr;
        let closeBtn = this.ui.getNode("close");
        closeBtn.on(cc.Node.EventType.TOUCH_END, () => {
            this.closeView();
        }, this);
        let confirmBtn = this.ui.getNode("confirm");
        confirmBtn.on(cc.Node.EventType.TOUCH_END, () => {
            App.SoundManager.VideoStartStop();
            let go = () => {
                (this.zuanshiFlag) ? App.DataManager.UpdateDiamand(App.DataManager.VideoAddDiamand)
                    : App.DataManager.UpdateCoin(App.DataManager.VideoAddCoin);
                (this.zuanshiFlag) ? GetEffect.instance.createTargets(confirmBtn, StartScene.instance.diomandLabel.node.parent, 'zuanshi', App.DataManager.VideoAddDiamand)
                    : GetEffect.instance.createTargets(confirmBtn, StartScene.instance.coinLabel.node.parent, 'jinbi', App.DataManager.VideoAddCoin);
                App.SoundManager.VideoEndOpen();
                this.closeView();
            }
            SdkManager.Instance.showRewardVideo(go, () => {
                App.SoundManager.VideoEndOpen();
                SdkManager.Instance.showToast("暂无广告");
            }, () => {
                SdkManager.Instance.showToast("暂无广告");
                App.SoundManager.VideoEndOpen();
            });
        }, this);

    }

    public static path(): string {
        return "prefabs/AddPanel";
    }
}
