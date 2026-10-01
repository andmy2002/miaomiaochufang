import * as cc from "cc";
import { App } from "../../Manager/App";
import { SoundManager } from "../../Manager/SoundManager";
import StartSceneModel from "../../model/StartSceneModel";
import player from "../../player";
import GetEffect from "../../prop/GetEffect";
import StartScene from "../../StartScene";
import SuperListItem from "../SuperScrollview/SuperListItem";
import TipPanel from "../tipPanel/TipPanel";
import TipPanelMediator from "../tipPanel/TipPanelMediator";

import { _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export default class MissionItem extends SuperListItem {
    @property(cc.Label)
    private wenzi1: cc.Label = null;
    @property(cc.Label)
    private jinduzi: cc.Label = null;
    @property(cc.Sprite)
    private texture: cc.Sprite = null;
    @property(cc.ProgressBar)
    private progress: cc.ProgressBar = null;

    @property(cc.Node)
    private weihuode: cc.Node = null;
    @property(cc.Node)
    private yihuode: cc.Node = null;
    @property(cc.Node)
    private yilingqu: cc.Node = null;

    private datas: any = null;
    private key: string = '';


    @property(cc.Node)
    private lingquBtn: cc.Node = null;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.lingquBtn.on(cc.Node.EventType.TOUCH_END, this.ClickGet, this);
    }

    CancelSelect() {
        // throw new Error("Method not implemented.");
    }

    setData(pram: any) {
        this.key = Object.keys(App.DataManager.OtherData.currMission)[pram.index];
        this.datas = App.DataManager.MissionList[this.key];
        this.wenzi1.string = this.datas.desc;
        this.node.name = this.key;
        let targetNum = App.DataManager.OtherData.currMission[this.key].count;
        let currNum = App.DataManager.OtherData.hasMission[this.key].count;
        let showNum = (currNum > targetNum) ? targetNum : currNum;
        this.jinduzi.string = showNum.toString() + '/' + targetNum.toString();
        this.progress.progress = showNum / targetNum;
        let self = this;
        App.DataManager.GetTexture('texture/mission/' + this.key).then((res: any) => {
            self.texture.spriteFrame = res;
        });
        (currNum >= targetNum) ? ((App.DataManager.OtherData.hasMission[this.key].getFlag)
            ? this.ShowYilingqu() : this.ShowYihuode()) : this.ShowWeilingqu();

    }

    // 点击领取奖励
    public ClickGet() {
        App.SoundManager.playEffect(SoundManager.getAward);
        let awardType = this.datas.awardType;
        let getCount = this.datas.Get;
        // App.DataManager.UpdateDatas(awardType, getCount);
        App.DataManager.UpdateCoin(Number(getCount));
        GetEffect.instance.createTargets(this.lingquBtn, StartScene.instance.coinLabel.node.parent, 'jinbi', getCount);
        this.ShowYilingqu();
        App.DataManager.UpdateOtherData();
        this.node.parent.emit('UpdateMissions');
        console.log('领取任务奖励');
    }

    private ShowYihuode() {
        this.weihuode.active = false;
        this.yihuode.active = true;
        this.yilingqu.active = false;
        this.texture.node.active = true;
    }

    private ShowWeilingqu() {
        this.weihuode.active = true;
        this.yihuode.active = false;
        this.yilingqu.active = false;
        this.texture.node.active = true;
    }

    private ShowYilingqu() {
        this.weihuode.active = false;
        this.yihuode.active = false;
        this.yilingqu.active = true;
        this.texture.node.active = false;
        App.DataManager.OtherData.hasMission[this.key].getFlag = true;
    }
}
