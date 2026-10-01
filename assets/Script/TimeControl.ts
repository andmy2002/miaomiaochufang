import * as cc from "cc";
import { App } from "./Manager/App";
// import hallModel from "./model/hallModel";

import { _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export default class TimeControl extends cc.Component {

    // public static _instance;
    // private currentTimeCount = 180;//_当前倒计时秒数
    // private timeCount = 180;//体力倒计时长
    // private consumeTili = -5;// 每局消耗体力
    // private tiliMax: number = 25;//体力最大值
    // private currentTili: number = 25;//当前体力
    // public static get instance() {
    //     return TimeControl._instance;
    // }
    // public static set instance(value) {
    //     TimeControl._instance = value
    // }

    // onLoad(): void {
    //     TimeControl.instance = this;
    //     App.Facade.registerModel(hallModel);
    //     this.InitTimeLocal();
    // }

    // /**
    //  * 初始化当前缓存
    //  */
    // InitTimeLocal(): void {
    //     var SausageCountTime = App.LocalStorageUtil.getNumber(App.LocalStorageUtil.lst_CountTime);
    //     if (!SausageCountTime) App.LocalStorageUtil.setNumber(App.LocalStorageUtil.lst_CountTime, Date.parse(new Date().toString()));
    //     var SausageCountSecond = App.LocalStorageUtil.getNumber(App.LocalStorageUtil.lst_CountSecond);
    //     if (!SausageCountSecond) App.LocalStorageUtil.setNumber(App.LocalStorageUtil.lst_CountSecond, 0);

    // }

    // private CountTili() {//倒计时体力
    //     App.Facade.getModel(hallModel).updateTiliNumber();
    //     if (App.DataManager.TimeFlag) return;
    //     App.DataManager.TimeFlag = true;
    //     this.schedule(this.CountFunc, 1);
    // }
    // private CountFunc() {
    //     if (this.currentTili >= this.tiliMax) {
    //         this.StopCount();
    //         return;
    //     }
    //     this.currentTimeCount -= 1;
    //     App.Facade.getModel(hallModel).updateTiliJishi(true, App.DataManager.TimeChange(this.currentTimeCount));
    //     if (this.currentTimeCount <= 0) {
    //         this.currentTimeCount = this.timeCount;
    //         App.DataManager.UpdateTili(1);
    //         App.Facade.getModel(hallModel).updateTiliNumber();
    //     }
    // }


    // private OfflineTime() {
    //     var _currentTime = Date.parse(new Date().toString());
    //     var _lastTime = App.LocalStorageUtil.getNumber(App.LocalStorageUtil.lst_CountTime);
    //     var _miaoshu = App.LocalStorageUtil.getNumber(App.LocalStorageUtil.lst_CountSecond);
    //     this.currentTimeCount = Number(_miaoshu);
    //     var timeInterval = (_currentTime - Number(_lastTime)) / 1000;
    //     var _temp = timeInterval - this.currentTimeCount;
    //     if (_temp < 0) {
    //         this.currentTimeCount = Math.abs(_temp);
    //     } else {
    //         if (_temp < this.timeCount) {
    //             // this.currentTili += 1;
    //             App.DataManager.UpdateTili(1);
    //             this.currentTimeCount = this.timeCount - _temp;
    //         } else {
    //             var _temp2 = Math.floor(_temp / this.timeCount);
    //             var _temp3 = Math.floor(_temp % this.timeCount);
    //             var tempTili = this.currentTili + _temp2;
    //             if (tempTili >= this.tiliMax) {
    //                 this.currentTili = this.tiliMax;
    //                 // App.DataManager.SaveMessage();
    //             } else {
    //                 App.DataManager.UpdateTili(_temp2);
    //             }
    //             App.Facade.getModel(hallModel).updateTiliNumber();
    //             this.currentTimeCount = this.timeCount - _temp3;
    //         }
    //         if (this.currentTili >= this.tiliMax) {
    //             this.StopCount();
    //         }
    //     }
    //     // console.log('OfflineTime:this.currentTimeCount', this.currentTimeCount, typeof (this.currentTimeCount));
    // }


    // private StopCount() {
    //     this.currentTimeCount = this.timeCount;
    //     this.unschedule(this.CountFunc);
    //     App.Facade.getModel(hallModel).updateTiliJishi(false);
    //     App.DataManager.TimeFlag = false;
    //     console.log('StopCount：隐藏倒计时文本********************', App.DataManager.TimeFlag);
    // }



}
