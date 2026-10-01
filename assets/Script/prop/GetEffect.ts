import * as cc from "cc";
import { UITransform } from "cc";
import { App } from "../Manager/App";

import { _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export default class GetEffect extends cc.Component {

    public static _instance;
    @property(cc.Prefab)
    private jinbiPrefab: cc.Prefab = null;

    private jinbiPool: cc.Node[] = [];
    // LIFE-CYCLE CALLBACKS:

    public static get instance() {
        return GetEffect._instance;
    }
    public static set instance(value) {
        GetEffect._instance = value;
    }
    onLoad() {
        GetEffect.instance = this;
    }
    start() {
        this.Init();
    }

    private Init() {
        this.jinbiPool.length = 0;
        let initCount = 5;
        for (let i = 0; i < initCount; ++i) {
            let jinbi = cc.instantiate(this.jinbiPrefab); // 创建节点
            this.jinbiPool.push(jinbi);
        }
    }
    private createTargets(node: any, target: any, iconType: string, count: number = 1) {
        // let orderIndex = this.node.getSiblingIndex();
        this.node.setSiblingIndex(100);
        let value = (count > 40) ? 40 : count;
        for (let i = 0; i < value; i++) {
            this.createTarget(node, target, iconType);
        }
    }


    private createTarget(node: any, target: any, iconType: string,) {
        const worldPos = node.getComponent(UITransform).convertToWorldSpaceAR(cc.Vec3.ZERO);
        const pos = this.node.getComponent(UITransform).convertToNodeSpaceAR(worldPos);
        let jinbi = null;
        if (this.jinbiPool.length > 0) {
            jinbi = this.jinbiPool.pop();
        } else {
            jinbi = cc.instantiate(this.jinbiPrefab);
        }
        jinbi.parent = this.node;
        jinbi.x = App.DataManager.RandomNum(pos.x + 100, pos.x - 100,);//(pos.x + window.RandomNum(-100, 100));
        jinbi.y = pos.y + App.DataManager.RandomNum(100);
        // jinbi.position = pos;
        jinbi.getComponent('Effect').SetTarget(target, iconType);
    }


    // private EffectGet(effectParent: any, target: any, num: number) {
    //     let count = (num < effectParent.children.length) ? num : effectParent.children.length;
    //     for (var i = 0; i < count; i++) {
    //         let tempNode = effectParent.children[i];
    //         tempNode.active = true;
    //         tempNode.angle = App.DataManager.RandomNum(360);
    //         tempNode.x = App.DataManager.RandomNum(100, -100,);//(pos.x + window.RandomNum(-100, 100));
    //         tempNode.y = -200 + App.DataManager.RandomNum(100);//(pos.y + window.RandomNum(0, 100));
    //         var rx = App.DataManager.RandomNum(400, 100);
    //         var ry = App.DataManager.RandomNum(400, 300);
    //         let times = Math.random() + 0.5;// Math.random() + 1;
    //         var bezier = [cc.v2(tempNode.x, tempNode.y), cc.v2(rx, ry), cc.v2(target.x, target.y)];
    //         var bezierTo = cc.bezierTo(times, bezier);
    //         var finished = cc.callFunc(function (target, jingbi) { // 
    //             jingbi.active = false;
    //         }, this, tempNode);
    //         var myAction = cc.sequence(bezierTo, finished);
    //         tempNode.runAction(myAction);
    //     }
    // }
    private onEnemyKilled(node: any) {
        node.removeFromParent();
        this.jinbiPool.push(node);
    }
}
