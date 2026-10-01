import * as cc from "cc";
import { dragonBones } from "cc";
import { SingleClass } from "./SingleClass";

import { _decorator } from "cc";
const { ccclass, property } = _decorator;
export enum AnimType {
    Dog = 1,
    Daoju = 2,
}
@ccclass
export default class DragonManager extends SingleClass {
    public armatureDisplay: dragonBones.ArmatureDisplay = null;//动画
    public armature: dragonBones.Armature;
    public factory: dragonBones.CCFactory;
    public currentAnimName: string = '';

    /**
     * 播放龙骨动画
     * @param animationName 动画名称
     * @param completeCallback 播放回调
     * @param playTimes 播放次数
     */
    public PlayDragonAnimation(animationName: string, completeCallback: any = null, playTimes: number = 1) {
        // this.armatureDisplay.armatureName = armatureName;
        this.currentAnimName = animationName;
        this.armatureDisplay.playAnimation(animationName, playTimes);
        this.armatureDisplay.addEventListener(dragonBones.EventObject.COMPLETE, completeCallback.bind(this, this.armatureDisplay.node), this);
    }

    /**
     * 更换龙骨皮肤
     */
    public ChangeDragonSkin(skinName: string) {
        try {
            let skinNames = ["shou1", "shou", "pigu_"];
            let skinIndexArr = {
                "default": [0, 0, 0],
                "skin_one": [1, 1, 3],
                "skin_two": [0, 0, 1],
                "skin_three": [2, 2, 2],
            };
            let currentIndexArr = skinIndexArr[skinName];
            for (var i = 0; i < skinNames.length - 1; i++) {
                var bones = this.armatureDisplay.armature().getSlot(skinNames[i]);
                bones.displayIndex = currentIndexArr[i] - 0;
                // console.log('bones****', bones, '  ', currentIndexArr[i]);
            }
            let slot = this.armatureDisplay.armature().getSlot("Armature");
            slot.displayList[0].getSlot("pigu_").displayIndex = skinIndexArr[skinName][2];
            slot.displayList[0].getSlot("yan").displayIndex = (skinName == "skin_one") ? -1 : 0;
            // console.log('slot.armature.name:', slot);
        } catch (err) {

        }
    }

    // /**删除道具动画完毕的监听 */
    // public removeDaoJuListen() {
    //     if (this.daoju_armatureDisplay)
    //         this.daoju_armatureDisplay.removeEventListener(dragonBones.EventObject.COMPLETE);
    // }

    // /**
    //  *初始化骨骼动画资源
    //  */
    // public initArmatureFile(skeletonData, textureData, texturePng) {
    //     let factory = this.getFactory;
    //     //this.armatureDisplay.getArmatureKey
    //     //factory.parseTextureAtlasData(cc.resources.load(textureData), cc.resources.load(texturePng));
    // }
    // /**获取骨骼工厂 */
    // public get getFactory(): dragonBones.CCFactory {
    //     return dragonBones.CCFactory.getInstance();
    // }
    /**获取动画对象 */
    // public buildArmature(armatureName): dragonBones.Armature {
    //     this.armature = this.getFactory.buildArmature(armatureName);
    //     return this.armature;
    // }
    // /**
    // * 播放动作
    // * @param action
    // * @param playNum 播放次数
    // */
    // public play(action: string, playNum: number = 1) {
    //     if (this.dog_armatureDisplay)
    //         this.dog_armatureDisplay.playAnimation(action, playNum);
    // }

    // /**
    //  * 替换动画
    //  */
    // public replaceAnim(armatureName: string) {

    // }

    // /**
    //  * 生成骨骼动画
    //  * @param node 当前的节点
    //  * @param path 龙骨地址
    //  * @param armatureName Armature名称
    //  * @param newAnimation      Animation名称
    //  * @param completeCallback  动画播放完毕的回调
    //  * @param playTimes         播放次数 -1是根据龙骨文件 0五险循环 >0是播放次数
    //  */
    // public dragonBoneAnim(node: cc.Node, path: string, armatureName: string, newAnimation: string, completeCallback, playTimes: number = 1) {
    //     let armatureDisplay = null;
    //     // if (!this.dog_armatureDisplay) {
    //     this.dog_armatureDisplay = node.getComponent(dragonBones.ArmatureDisplay);
    //     armatureDisplay = this.dog_armatureDisplay;
    //     //  }

    //     cc.resources.loadDir(path, (err, assets) => {
    //         assets.forEach(asset => {
    //             if (asset instanceof dragonBones.DragonBonesAsset) {
    //                 armatureDisplay.dragonAsset = asset;
    //             }
    //             if (asset instanceof dragonBones.DragonBonesAtlasAsset) {
    //                 armatureDisplay.dragonAtlasAsset = asset;
    //             }
    //         });
    //         armatureDisplay.armatureName = armatureName;
    //         armatureDisplay.playAnimation(newAnimation, playTimes);
    //         armatureDisplay.addEventListener(dragonBones.EventObject.COMPLETE, completeCallback);
    //     });
    // }

    // /**
    //  * 获取当前的动画
    //  */
    // public getCurrentAnim(node: cc.Node): dragonBones.ArmatureDisplay {
    //     let armatureDisplay = node.getComponent(dragonBones.ArmatureDisplay);
    //     armatureDisplay.removeEventListener(dragonBones.EventObject.COMPLETE);
    //     return armatureDisplay;
    // }
}
