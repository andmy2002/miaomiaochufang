import * as cc from "cc";
import { _decorator, CCFloat } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export default class animationFrame extends cc.Component {

    private changeIntervalTime: number = 0;//当前切换图片间隔时间
    @property([CCFloat])
    private changeTimeArr: number[] = [];//切换时间组
    @property
    public flags: boolean = false;

    @property([cc.SpriteFrame])
    public textureArr: cc.SpriteFrame[] = [];// 动画帧组
    private _index: number = 0;


    start() {
        this.changeIntervalTime = this.changeTimeArr[0];
    }

    public StopAnim() {
        this.flags = false;
    }


    public StartAnim() {
        this.flags = true;
    }
    update(dt) {
        if (!this.flags) return;
        this.changeIntervalTime -= dt;
        if (this.changeIntervalTime <= 0) {
            if (this._index < this.textureArr.length - 1) {
                this._index++;
            } else {
                this._index = 0;
            }
            this.changeIntervalTime = this.changeTimeArr[this._index];
            this.node.getComponent(cc.Sprite).spriteFrame = this.textureArr[this._index];
        }
    }
}
