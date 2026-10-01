import * as cc from "cc";
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { BaseView } from "../../../lightMVC/core/base/BaseView";
import { App } from "../../Manager/App";
import { EConsume } from "../../Framework/Const/EnumDefine";

import { _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export default class SharePanel extends BaseView {
    private money: number = 20;
    public drawView(): void {
        // 关闭按钮
        let closeBtn = this.ui.getNode("closeBtn");
        closeBtn.on(cc.Node.EventType.TOUCH_END, () => {
            this.closeView();
        }, this);
        // 观看按钮
        let watchBtn = this.ui.getNode("watchBtn");
        // let watchLabel = watchBtn.getChildByName("label").getComponent(cc.Label);
        // watchLabel.string = App.DataManager.getFreeWatchTimes() + '/' + App.DataManager.FREE_WATCH_TIMES;
        watchBtn.on(cc.Node.EventType.TOUCH_END, () => {
            this.addCoin();
            // if (App.DataManager.getFreeWatchTimes() > 0) {
            //     App.DataManager.subWatchTimes()
            //     this.addCoin(watchLabel);
            // } else {
            //     App.TipsManager.showmid("今天可观看广告次数已用完，请明天再看");
            // }

        }, this);
    }
    //增加金币
    private addCoin() {
        let data = { "1": this.money };
        // label.string = App.DataManager.getFreeWatchTimes() + '/' + App.DataManager.FREE_WATCH_TIMES;
    }

    public static path(): string {
        return "prefabs/SharePanel";
    }
}
