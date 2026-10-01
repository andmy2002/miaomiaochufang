import * as cc from "cc";
import { App } from "./App";
import { SoundManager } from "./SoundManager";
import { _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export default class XButton extends cc.Component {

    onLoad() {

    }
    private onTouchDown() {
        this.playOutAnim();
        App.SoundManager.playEffect(SoundManager.click);
    }
    private onTouchUp() {
        this.playBackAnim();
    }
    //播放扩展动画
    private playOutAnim() {
        cc.Tween.stopAllByTarget(this.node);
        cc.tween(this.node).to(0.2, { scale: new cc.Vec3(0.9, 0.9, 1) }).start();
    }
    //播放收缩动画
    private playBackAnim() {
        cc.Tween.stopAllByTarget(this.node);
        cc.tween(this.node).to(0.2, { scale: new cc.Vec3(1, 1, 1) }).start();
    }


    start() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchUp, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchUp, this);
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchDown, this);
    }

    onDestroy() {
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchUp, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchUp, this);
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchDown, this);
        cc.Tween.stopAllByTarget(this.node);
    }

    // update (dt) {}
}
