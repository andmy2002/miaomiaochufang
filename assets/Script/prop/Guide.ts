import * as cc from "cc";
import { App } from "../Manager/App";

import { _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export default class Guide extends cc.Component {

    @property(cc.Node)
    private firsetStep: cc.Node = null;

    @property(cc.Node)
    private secondStep: cc.Node = null;

    @property(cc.Node)
    private thirdStep: cc.Node = null;

    private guideIndex: number = 0;
    // LIFE-CYCLE CALLBACKS:

    onEnable() {
        this.firsetStep.active = true;
    }

    public NextStep() {
        this.guideIndex++;
        if (this.guideIndex == 1) {
            this.firsetStep.active = false;
            this.secondStep.active = true;
        }
        else if (this.guideIndex == 2) {
            this.secondStep.active = false;
            this.thirdStep.active = true;
        }
        else {
            console.log('新手引导结束');
            this.node.active = false;
            App.DataManager.firstEnterGame = false;
        }
    }
    // update (dt) {}
}
