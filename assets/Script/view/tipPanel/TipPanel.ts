import * as cc from "cc";
import { tween, Tween, UIOpacity } from "cc";
import { BaseView } from "../../../lightMVC/core/base/BaseView";
import { _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export default class TipPanel extends BaseView {

    public drawView(data?: any): void {
        let label = this.ui.getNode("label");
        label.getComponent(cc.Label).string = (data) ? data : '';
        Tween.stopAllByTarget(this.node);
        this.node.position = new cc.Vec3(0, -100, 0);
        this.PlayAction();
    }

    /**
     * 播放tip动作
     */
    public PlayAction(): void {
        const opacity = this.node.getComponent(UIOpacity) || this.node.addComponent(UIOpacity);
        opacity.opacity = 255;
        tween(this.node)
            .to(1, { position: new cc.Vec3(0, 100, this.node.position.z) })
            .call(() => tween(opacity).to(1, { opacity: 0 }).call(() => this.closeView()).start())
            .start();
    }

    public static path(): string {
        return "prefabs/TipPanel";
    }
}
