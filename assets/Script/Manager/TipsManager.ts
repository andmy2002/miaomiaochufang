import * as cc from "cc";
import { UITransform } from "cc";
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { SingleClass } from "./SingleClass";
import { App } from "./App";
import { ERewardType, EConsume } from "../Framework/Const/EnumDefine";
import { _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export default class TipsManager extends SingleClass {
    private hasShowTips: boolean = true;
    private hasShowRewardTips: boolean = true;
    public showmid(str: string, waitTime: number = 0.8) {
        if (!this.hasShowTips)
            return;
        this.hasShowTips = false;
        if (App.LayerManager.tipLayer && App.LayerManager.tipLayer.getChildByName("tipsBg")) {
            let bgnode = App.LayerManager.tipLayer.getChildByName("tipsBg");
            let nodeText = bgnode.getChildByName("tips");
            nodeText.getComponent(cc.Label).string = str;
            App.EffectUtils.smallToLarge(bgnode, waitTime, () => {
                this.hasShowTips = true;
            });
        } else {
            var nodeText = new cc.Node("tips");
            var showtext = nodeText.addComponent(cc.Label);
            var bgnode = new cc.Node("tipsBg");
            let tipsBg: cc.Sprite = bgnode.addComponent(cc.Sprite);
            cc.resources.load("new_tips", cc.SpriteFrame, (err, spriteFrame) => {
                if (err) {
                    console.error(err);
                    return;
                }
                tipsBg.spriteFrame = spriteFrame;
                App.LayerManager.tipLayer && App.LayerManager.tipLayer.addChild(bgnode);
                bgnode.x = 0;
                bgnode.y = 0;
                bgnode.addChild(nodeText);
                showtext.string = str;
                showtext.fontFamily = "SimHei";
                showtext.fontSize = 30;
                showtext.isBold = true;
                showtext.color = new cc.Color(255, 255, 255);
                const textTransform = nodeText.getComponent(UITransform) || nodeText.addComponent(UITransform);
                const backgroundTransform = bgnode.getComponent(UITransform) || bgnode.addComponent(UITransform);
                textTransform.anchorX = 0;
                textTransform.setContentSize(backgroundTransform.width - 145, backgroundTransform.height);
                nodeText.y = 0;
                nodeText.x = -145;
                showtext.overflow = cc.Label.Overflow.CLAMP;
                showtext.horizontalAlign = cc.Label.HorizontalAlign.LEFT;
                showtext.verticalAlign = cc.Label.VerticalAlign.CENTER;
                App.EffectUtils.smallToLarge(bgnode, waitTime, () => {
                    this.hasShowTips = true;
                });
            });
        }
    }
    public showReward(type: any[], data: any, waitTime: number = 0.5) {
        if (!this.hasShowRewardTips)
            return;
        this.hasShowRewardTips = false;
        let rewardTips = null;
        // if (App.LayerManager.lockLayer && App.LayerManager.lockLayer.getChildByName("rewardTips")) {
        //     rewardTips = App.LayerManager.lockLayer.getChildByName("rewardTips");
        //     this.setRewardImg(rewardTips, type);
        //     this.setRewardNum(rewardTips, data);
        //     App.EffectUtils.bottomToTop(rewardTips, waitTime, () => {
        //         this.hasShowRewardTips = true;
        //     });
        // } else {
        App.LayerManager.lockLayer.addComponent(cc.Layout);
        App.LayerManager.lockLayer.getComponent(cc.Layout).type = cc.Layout.Type.HORIZONTAL;
        App.LayerManager.lockLayer.getComponent(cc.Layout).spacingX = 80;
        App.LayerManager.lockLayer.getComponent(UITransform).setContentSize(0, 0);

        App.LayerManager.lockLayer.y = 0;
        cc.resources.load("prefabs/rewardTips", cc.Prefab, (err, prefab) => {
            if (err) {
                console.error(err);
                return;
            }
            for (let i = 0; i < type.length; i++) {
                rewardTips = cc.instantiate(prefab);
                rewardTips.name = "rewardTips" + i;
                this.setRewardImg(rewardTips, type[i]);
                this.setRewardNum(rewardTips, data[type[i]]);
                App.LayerManager.lockLayer && App.LayerManager.lockLayer.addChild(rewardTips);
                rewardTips.y = 20;
                App.LayerManager.lockLayer.x = -20 * (type.length - 1);
            }

            App.EffectUtils.bottomToTop(App.LayerManager.lockLayer, waitTime, () => {
                this.hasShowRewardTips = true;
                App.LayerManager.lockLayer.removeAllChildren();
            });
        });
    }
    //设置获奖的图片
    private setRewardImg(node: cc.Node, type: EConsume) {
        let rewardImgArray = {
            "1": "icon.png",
            "201": "hall_icon_weishi_new.png",
            "203": "clear1.png",
            "202": "feipan1.png",
            "101": "qinmidu.png",
            "102": "mp_t3",
            "103": "mp_t2",
            "104": "mp_t1",
        }
        cc.resources.load(rewardImgArray[type], cc.SpriteFrame, (err, SpriteFrame) => {
            if (err) {
                console.error(err);
                return;
            }
            node.getChildByName("image").getComponent(cc.Sprite).spriteFrame = SpriteFrame;
        });

        // let rewardImgArray = ["icon.png", "hall_icon_weishi_new.png", "clear1.png", "feipan1.png", "qinmidu.png"];

    }
    //设置获奖的数量
    private setRewardNum(node: cc.Node, sum: string) {
        node.getChildByName("image").getChildByName("label").getComponent(cc.Label).string = '+' + sum;
    }
}
