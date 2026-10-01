import * as cc from "cc";
import { UIOpacity } from "cc";

export enum EasingEnum {
    quadIn = 0,
    quadOut = 1,
    quadInOut = 2,
    cubicIn = 3,
    cubicOut = 4,
    cubicInOut = 5,
    quartIn = 6,
    quartOut = 7,
    quartInOut = 8,
    quintIn = 9,
    quintOut = 10,
    quintInOut = 11,
    sineIn = 12,
    sineOut = 13,
    sineInOut = 14,
    expoIn = 15,
    expoOut = 16,
    expoInOut = 17,
    circIn = 18,
    circOut = 19,
    circInOut = 20,
    elasticIn = 21,
    elasticOut = 22,
    elasticInOut = 23,
    backIn = 24,
    backOut = 25,
    backInOut = 26,
    bounceIn = 27,
    bounceOut = 28,
    bounceInOut = 29,
    smooth = 30,
    fade = 31
}
import { _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property({ type: cc.Enum(EasingEnum) })
    public easings: EasingEnum = EasingEnum.smooth;
    @property
    duration: number = 2;

    @property
    private playOnLoad: boolean = true;

    @property
    isScale: boolean = false;
    @property
    startScale: number = 2;
    @property
    targetScale: number = 1;



    /**初始隐藏 */
    @property
    isStartHide: boolean = false;
    @property
    isMove: boolean = false;
    @property(cc.Vec3)
    startPos: cc.Vec3 = new cc.Vec3(0, 50, 0);
    @property(cc.Vec3)
    endPos: cc.Vec3 = new cc.Vec3(0, 0, 0);


    @property
    isInterval: boolean = false;
    @property
    intervalTime: number = 1;

    @property
    isLoop: boolean = false;
    // LIFE-CYCLE CALLBACKS:

    start() {
        if (this.playOnLoad) this.TweenStart();
    }

    public TweenStart() {
        this.Init();
        (this.isInterval) ? this.scheduleOnce(() => { this.TweenFunc(); }, this.intervalTime) : this.TweenFunc();
    }

    private Init() {
        if (this.isMove) this.node.position = this.startPos;
        if (this.isScale) this.node.setScale(this.startScale, this.startScale, 1);
        if (this.isStartHide) (this.node.getComponent(UIOpacity) || this.node.addComponent(UIOpacity)).opacity = 0;
    }

    private TweenFunc() {
        if (this.isStartHide) (this.node.getComponent(UIOpacity) || this.node.addComponent(UIOpacity)).opacity = 255;
        let tweens = cc.tween();
        //, position: this.currentPos
        const easing = EasingEnum[this.easings] as cc.TweenEasing;
        if (this.isScale) tweens.to(this.duration, { scale: new cc.Vec3(this.targetScale, this.targetScale, 1) }, { easing });
        if (this.isMove) tweens.to(this.duration, { position: this.endPos }, { easing });
        tweens.call(() => {
            // this.node.setScale(this.startScale);
            console.log('缓动结束回调');
            // if (this.callback) this.callback();
        });
        (this.isLoop) ? cc.tween(this.node).repeatForever(tweens).start() : cc.tween(this.node).repeat(1, tweens).start();
    }

    private easeOutElastic(x: number): number {
        const c4 = (2 * Math.PI) / 3;

        return x === 0
            ? 0
            : x === 1
                ? 1
                : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
    }

    // update (dt) {}
}
