import * as cc from "cc";
import { UIOpacity } from "cc";
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { SingleClass } from "./SingleClass";

import { _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export default class EffectUtils extends SingleClass {

    /**
    * 由小到大
    */
    public smallToLarge(obj: cc.Node, waitTime: number = 1, callback: Function = null) {
        obj.setScale(0.5, 0.5, 1);
        const opacity = obj.getComponent(UIOpacity) || obj.addComponent(UIOpacity);
        opacity.opacity = 255;
        cc.tween(obj).to(0.3, { scale: new cc.Vec3(1, 1, 1) }, { easing: 'quadOut' })
            .delay(waitTime)
            .call(() => opacity.opacity = 0).call(() => {
                if (callback)
                    callback();
            }).start();
        // var scale = cc.scaleTo(0.5, 1, 1).easing(cc.easeOut(1));
        // var ac1 = cc.fadeIn(0.5);
        // var delay = cc.delayTime(waitTime);
        // var ac2 = cc.fadeOut(0.5);
        // var cfunc = cc.callFunc(() => {
        //     obj.stopAction(seq);
        //     console.log("我是最后一个动作");
        //     if (callback)
        //         callback();
        // });
        // var seq = cc.sequence(scale,ac1,delay,ac2, cfunc);
        // obj.runAction(seq);
    }
    /**
     * 从下向上
     */
    public bottomToTop(obj:cc.Node,waitTime:number=1,callback:Function = null){
        const opacity = obj.getComponent(UIOpacity) || obj.addComponent(UIOpacity);
        opacity.opacity = 0;
        obj.setPosition(obj.position.x, -80, obj.position.z);
        cc.tween(obj).to(0.3, { position: new cc.Vec3(0, 0, obj.position.z) })
        .delay(waitTime)
        .call(() => opacity.opacity = 255).call(() => opacity.opacity = 0).call(() => {
            if (callback)
                callback();
        }).start();
    }
}
