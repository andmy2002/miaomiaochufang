import * as cc from "cc";
import { App } from "../Manager/App";
import StartScene from "../StartScene";
import MissionPanel from "../view/missionPanel/MissionPanel";
import MissionPanelMediator from "../view/missionPanel/MissionPanelMediator";

import { _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export default class TimeCount extends cc.Component {



    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    onEnable() {
        App.DataManager.OtherData.missionCountTime = (App.DataManager.OtherData.missionCountTime <= 0) ? App.DataManager.ResetMissionTime
            : App.DataManager.OtherData.missionCountTime;
        this.OfflineTime();
    }
    private CountFunc() {
        App.DataManager.OtherData.missionCountTime -= 1;
        let timeData = App.DataManager.TimeChange(App.DataManager.OtherData.missionCountTime);
        this.node.getComponent(cc.Label).string = timeData.minute + '分' + timeData.second;
        if (App.DataManager.OtherData.missionCountTime <= 0) {
            this.ResetMissionFun();
            this.StopCount();
        }
    }

    private OfflineTime() {
        var _currentTime = Date.parse(new Date().toString());
        var _lastTime = (App.DataManager.OtherData.missionTimeStamp == 0) ? Date.parse(new Date().toString()) : App.DataManager.OtherData.missionTimeStamp;
        App.DataManager.OtherData.missionTimeStamp = _currentTime;
        App.DataManager.UpdateOtherData();
        var timeInterval = (_currentTime - Number(_lastTime)) / 1000;
        App.DataManager.OtherData.missionCountTime = App.DataManager.OtherData.missionCountTime - timeInterval;
        if (App.DataManager.OtherData.missionCountTime <= 0) {
            this.ResetMissionFun();
            return;
        }
        let timeData = App.DataManager.TimeChange(App.DataManager.OtherData.missionCountTime);
        this.node.getComponent(cc.Label).string = timeData.minute + '分' + timeData.second;
        this.schedule(this.CountFunc, 1);
    }

    private ResetMissionFun() {
        App.DataManager.OtherData.missionTimeStamp = 0;
        App.DataManager.OtherData.missionCountTime = 0;
        App.DataManager.UpdateOtherData();
        App.DataManager.OtherData.currMission = {};
        App.DataManager.OtherData.hasMission = {};
        App.DataManager.OtherData.hasGetBigMission = false;
        App.DataManager.RandomMission();
        StartScene.instance.closeAllPopView();
        App.Facade.popView(MissionPanelMediator, MissionPanel, '更新任务界面', false);
    }

    private StopCount() {
        this.unschedule(this.CountFunc);
    }

    onDisable() {
        var _currentTime = Date.parse(new Date().toString());
        App.DataManager.OtherData.missionTimeStamp = _currentTime;
        App.DataManager.UpdateOtherData();
        this.StopCount();
    }

    // update (dt) {}
}
