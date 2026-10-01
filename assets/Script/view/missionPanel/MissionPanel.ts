import * as cc from "cc";
import { BaseView } from "../../../lightMVC/core/base/BaseView";
import { App } from "../../Manager/App";
import { SoundManager } from "../../Manager/SoundManager";
import StartSceneModel from "../../model/StartSceneModel";
import GetEffect from "../../prop/GetEffect";
import StartScene from "../../StartScene";
import AddPanel from "../addCoinPanel/AddPanel";
import AddPanelMediator from "../addCoinPanel/AddPanelMediator";
import SuperListItem from "../SuperScrollview/SuperListItem";
import SuperScrollView from "../SuperScrollview/SuperScrollView";
import { _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export default class MissionPanel extends BaseView {
    private dormancy: cc.Node = null;
    private BiglingquBtn: cc.Node = null;
    private xiangzi: cc.Node = null;
    private resetTimes: cc.Node = null;
    private resetTimes2: cc.Node = null;
    private missionNode: cc.Node = null;
    private bigAward: number = 100;
    private ResetCount: number = 0;
    public drawView(data: any): void {
        App.Facade.getModel(StartSceneModel).missionTishiClose();
        App.DataManager.missionOpenFlag = true;
        this.node.parent = StartScene.instance.dibuBg;
        this.node.y = 0;
        this.missionNode = this.ui.getNode("mission");
        this.xiangzi = this.ui.getNode("xiangzi");
        this.BiglingquBtn = this.ui.getNode("BiglingquBtn");
        this.resetTimes = this.ui.getNode("resetTime");
        this.resetTimes2 = this.ui.getNode("resetTime2");
        let list = Object.values(App.DataManager.OtherData.currMission);
        this.missionNode.getComponent(SuperScrollView).setData(list, false, null);
        this.dormancy = this.ui.getNode("dormancy");
        this.dormancy.active = false;
        this.SetBigMission();
        let contant = this.ui.getNode("contant");
        contant.on('UpdateMissions', () => {
            this.SetBigMission();
        });
    }

    private SetBigMission() {
        if (this.hasBigAward() && App.DataManager.OtherData.hasGetBigMission) {
            console.log('显示重置任务界面');
            this.ShowResetView();
            return;
        }
        if (this.hasBigAward() && !App.DataManager.OtherData.hasGetBigMission) {
            console.log('已完成所有小任务~~');
            this.resetTimes.getComponent(cc.Label).string = '10分0秒';
            let compeleteLabel = this.ui.getNode("compeleteLabel");
            compeleteLabel.active = false;
            this.BiglingquBtn.on(cc.Node.EventType.TOUCH_END, this.GetBigAward, this);
            this.BiglingquBtn.active = true;
            this.xiangzi.getComponent(cc.Animation).play();
        }
    }

    private ShowResetView() {
        this.missionNode.active = false;
        this.dormancy.active = true;
        this.resetTimes2.getComponent(cc.Label).string = '10分0秒';
        let resetNum = this.ui.getNode("resetNum");
        this.ResetCount = App.DataManager.CalculateResetDiamand();
        resetNum.getComponent(cc.Label).string = this.ResetCount.toString();
        let resetBtn = this.ui.getNode("resetBtn");
        resetBtn.on(cc.Node.EventType.TOUCH_END, this.ResetMission, this);
    }

    /**是否通过所有小任务 */
    private hasBigAward() {
        let passFlag = true;
        for (let key in App.DataManager.OtherData.hasMission) {
            let targetNum = App.DataManager.OtherData.currMission[key].count;
            let currNum = App.DataManager.OtherData.hasMission[key].count;
            if (currNum < targetNum || !App.DataManager.OtherData.hasMission[key].getFlag) passFlag = false;
        }
        return passFlag;
    }

    /**重置任务 */
    private ResetMission() {
        console.log('消耗0钻石重置任务~');
        App.DataManager.UpdateDiamand(-this.ResetCount, (success) => {
            if (success) {
                App.DataManager.OtherData.resetMissionCount++;
                App.DataManager.UpdateOtherData();
                this.SuccessReset();
            } else {
                let data = { type: 'zuanshi', clickType: 'buzu' };
                App.Facade.popView(AddPanelMediator, AddPanel, data, false);
            }
        })
    }

    private SuccessReset() {
        App.DataManager.OtherData.currMission = {};
        App.DataManager.OtherData.hasMission = {};
        App.DataManager.OtherData.hasGetBigMission = false;
        App.DataManager.RandomMission();
        this.missionNode.active = true;
        let list = Object.values(App.DataManager.OtherData.currMission);
        this.missionNode.getComponent(SuperScrollView).setData(list, false, null);
        this.dormancy.active = false;
        let compeleteLabel = this.ui.getNode("compeleteLabel");
        compeleteLabel.active = true;
        this.BiglingquBtn.active = false;
        this.xiangzi.getComponent(cc.Animation).stop();
    }

    private GetBigAward() {
        // console.log('领取大任务奖励~');
        App.SoundManager.playEffect(SoundManager.getAward);
        App.DataManager.UpdateCoin(this.bigAward);
        GetEffect.instance.createTargets(this.BiglingquBtn, StartScene.instance.coinLabel.node.parent, 'jinbi', this.bigAward);
        App.DataManager.OtherData.hasGetBigMission = true;
        App.DataManager.UpdateOtherData();
        this.ShowResetView();
    }


    onDisable() {
        App.DataManager.missionOpenFlag = false;
        App.DataManager.ShowMissionTi();
    }

    public static path(): string {
        return "prefabs/MissionPanel";
    }
}
