import * as cc from "cc";
import GetEffect from "./GetEffect";

import { _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export default class Effect extends cc.Component {

    @property(cc.SpriteFrame)
    private jinbiSprite: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private zuanshiSprite: cc.SpriteFrame = null;

    private targetNode: cc.Node = null;
    @property
    private speed: number = 600;

    private _angle: number = 0;

    // onLoad () {}

    start() {

    }
    private SetTarget(node: any, iconType: string) {
        this.getComponent(cc.Sprite).spriteFrame = (iconType == "zuanshi") ? this.zuanshiSprite : this.jinbiSprite;
        this.targetNode = node;
    }
    private _getAngle(point: any): number {
        if (!this.targetNode.isValid) return;
        //角度
        var pos = this.node.getPosition();
        this._angle = Math.atan2(this.targetNode.y - pos.y, this.targetNode.x - pos.x) * (180 / Math.PI);
        this.node.angle = this._angle;
        return this._angle;
    }
    private huishou() {
        GetEffect.instance.onEnemyKilled(this.node);
    }
    update(dt) {
        if (!this.targetNode) return;
        if (!this.targetNode.isValid) {
            this.targetNode = null;
            this.huishou();
            return;
        }
        const parentTransform = this.node.parent.getComponent(cc.UITransform);
        const targetPos = parentTransform.convertToNodeSpaceAR(this.targetNode.getWorldPosition());
        const oldPos = this.node.position;
        const dx = targetPos.x - oldPos.x;
        const dy = targetPos.y - oldPos.y;
        const distance = Math.hypot(dx, dy);
        const step = this.speed * dt;
        if (distance <= Math.max(20, step)) {
            this.node.setPosition(targetPos);
            this.targetNode = null;
            this.huishou();
            return;
        }
        this.node.setPosition(oldPos.x + dx / distance * step, oldPos.y + dy / distance * step, oldPos.z);
    }
}
