import * as cc from "cc";
import { App } from "../../Manager/App";
import { SoundManager } from "../../Manager/SoundManager";
import player from "../../player";
import GetEffect from "../../prop/GetEffect";
import StartScene from "../../StartScene";
import SuperListItem from "../SuperScrollview/SuperListItem";
import TipPanel from "../tipPanel/TipPanel";
import TipPanelMediator from "../tipPanel/TipPanelMediator";

import { _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export default class AchieveItem extends SuperListItem {
    @property(cc.Label)
    private wenzi1: cc.Label = null;
    @property(cc.Label)
    private jinduzi: cc.Label = null;
    @property(cc.ProgressBar)
    private progress: cc.ProgressBar = null;
    @property(cc.Node)
    private lingqu: cc.Node = null;
    @property(cc.Node)
    private lingquMask: cc.Node = null;
    @property(cc.Node)
    private yilingqu: cc.Node = null;
    @property(cc.Node)
    private bgIcon: cc.Node = null;
    @property(cc.Node)
    private tishi: cc.Node = null;

    private getFlag: boolean = false;



    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.lingqu.on(cc.Node.EventType.TOUCH_END, () => {
            if (!this.getFlag) return;
            App.SoundManager.playEffect(SoundManager.getAward);
            this.getFlag = false;
            App.DataManager.OtherData.hasAchieve[this.node.name].hasGet = true;
            let datas = App.DataManager.showAchieveList[this.node.name]
            App.DataManager.UpdateDiamand(Number(datas.Get), (success) => {
                GetEffect.instance.createTargets(this.lingqu, StartScene.instance.diomandLabel.node.parent, 'zuanshi', datas.Get);
                App.DataManager.UpdateOtherData();
            })
            this.SetGeted();
        }, this);
    }

    CancelSelect() {
        // throw new Error("Method not implemented.");
    }

    setData(pram: any) {
        // console.log('setData:', pram);
        this.wenzi1.string = pram.data.desc;
        let key = Object.keys(App.DataManager.showAchieveList)[pram.index];
        this.node.name = key;
        let targetNum = App.DataManager.showAchieveList[key].count;
        let currNum = App.DataManager.OtherData.hasAchieve[key].count;
        let showNum = (currNum > targetNum) ? targetNum : currNum;
        this.jinduzi.string = showNum.toString() + '/' + targetNum.toString();
        this.progress.progress = showNum / targetNum;
        if (currNum >= targetNum) {
            (!App.DataManager.OtherData.hasAchieve[this.node.name].hasGet) ? this.getFlag = true : this.SetGeted();
        }
        this.lingquMask.active = !this.getFlag;
        this.tishi.active = this.getFlag;
    }

    /**设置已领取 */
    private SetGeted() {
        this.yilingqu.active = true;
        this.lingqu.active = false;
        this.bgIcon.active = false;
        this.tishi.active = false;
    }
}
