import * as cc from "cc";
import { dragonBones } from "cc";
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { App } from "./App";
import { AnimData } from "./AnimData";
import TipsManager from "./TipsManager";
import { ERewardType, EConsume } from "../Framework/Const/EnumDefine";
import player from "../player";
import { _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export default class DragonAnim extends cc.Component {

    private static _instance: DragonAnim = null;

    @property
    hasStartPlayAnim: boolean = false;//是否开始播放

    @property
    playTimes: number = 1;//播放次数

    private AnimStatus: string = "";//动画状态

    public static getInstance(): any {
        if (this._instance == null) {
            this._instance = new DragonAnim();
        }
        return this._instance;
    }


    onLoad() {
        DragonAnim._instance = this;
        App.DragonManager.armatureDisplay = this.node.getComponent(dragonBones.ArmatureDisplay);
    }

    start() {
        // if (this.hasStartPlayAnim) this.Idel();// this.getPathStartAnim();
    }

    /**开始播放动画 */
    public Idel() {
        if (App.DragonManager.currentAnimName == AnimData.idel) return;
        App.DragonManager.PlayDragonAnimation(AnimData.idel, this.completeCallback.bind(this), 0);
    }

    public Run() {
        if (App.DragonManager.currentAnimName == AnimData.run) return;
        App.DragonManager.PlayDragonAnimation(AnimData.run, this.completeCallback.bind(this), 0);
    }
    public Jump() {
        if (App.DragonManager.currentAnimName == AnimData.jump) return;
        App.DragonManager.PlayDragonAnimation(AnimData.jump, this.completeCallback.bind(this), 1);
    }


    // //获取路径开始动画
    // public getPathStartAnim() {
    //     App.DragonManager.armatureDisplay = this.node.getComponent(dragonBones.ArmatureDisplay);
    //     let path = "dogAnim/" + AnimData[this.AnimName].name;
    //     this.AnimStatus = this.AnimationName;
    //     App.DragonManager.dragonDaoJuBoneAnim(this.Node, path, AnimData[this.AnimName].name, AnimData[this.AnimName][this.AnimationName], this.completeCallback.bind(this), this.playTimes);

    // }
    private completeCallback() {
        // App.DragonManager.removeDaoJuListen();
        // let data = { "101": "8" };

        // console.log("完成。。");
    }


    // update (dt) {}
}
