import * as cc from "cc";
import { UITransform } from "cc";
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export default class XProcess extends cc.Component {

    @property(cc.Node)
    process: cc.Node = null;
    @property(cc.Label)
    processLabel: cc.Label = null;

    private ProcessWidth: number = 0;

    onLoad() {
        this.ProcessWidth = this.node.getComponent(UITransform).width;
    }
    public showProcessLabel() {
        if (!this.processLabel.node.activeInHierarchy)
            this.processLabel.node.active = true;
    }
    public setProcess(processNum: number, processstr: string = "0/0") {
        
        this.processLabel.string = processstr;
        if (processNum > 1)
            processNum = 1;
        const processTransform = this.process.getComponent(UITransform);
        processTransform.width = this.ProcessWidth * processNum;
    }

    start() {

    }

    // update (dt) {}
}
