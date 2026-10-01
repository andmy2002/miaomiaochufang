import * as cc from "cc";
import { tween, UITransform } from "cc";
import { BaseView } from "../../../lightMVC/core/base/BaseView";
import game from "../../game";
import gameMediator from "../../gameMediator";
import { App } from "../../Manager/App";
import { SoundManager } from "../../Manager/SoundManager";
import player from "../../player";
import OrderMediator from "./OrderMediator";

import { _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export default class Order extends BaseView {

    public static _instance;
    @property(cc.ProgressBar)
    public orderTime: cc.ProgressBar = null;
    @property(cc.Node)
    public orderTimeBar: cc.Node = null;

    @property(cc.Node)
    public shiwu: cc.Node = null;
    @property(cc.Node)
    public shiwuParent: cc.Node = null;

    private hasZhushiArr: any = [];

    @property(cc.Node)
    public zhushiItem: cc.Node = null;

    @property(cc.Node)
    public yinliaoParent: cc.Node = null;
    @property(cc.Sprite)
    public yinliao: cc.Sprite = null;
    @property(cc.Sprite)
    public yinliaoDiejia: cc.Sprite = null;

    @property(cc.Sprite)
    public qita: cc.Sprite = null;

    @property(cc.Node)
    public zhizhen1: cc.Node = null;
    @property(cc.Sprite)
    public xueding: cc.Sprite = null;
    @property(cc.Node)
    public chadi: cc.Node = null;
    @property(cc.Node)
    public warning: cc.Node = null;
    //连续正确数字
    @property(cc.Label)
    private correctNumLabel: cc.Label = null;
    @property(cc.Node)
    private huo: cc.Node = null;


    /**制作中标志 */
    private cookFlag: boolean = false;

    private putOffsetY: number = 45;

    private zhushiIndex: number = 0;

    private origionY: number = -135;

    private orderTimeColor: cc.Color = new cc.Color(127, 213, 24, 255);
    private orderOverTimeColor: cc.Color = new cc.Color(254, 133, 68, 255);
    private orderOverTimeColor2: cc.Color = new cc.Color(235, 67, 74, 255);


    public static get instance() {
        return Order._instance;
    }
    public static set instance(value) {
        Order._instance = value;
    }
    onLoad() {
        Order.instance = this;
        this.ShowCorrectCount(0);
        this.registerMediator(OrderMediator, this, "订单模块");
    }

    public StopGame() {
        this.node.active = false;
        this.cookFlag = false;
        this.ShowCorrectCount(0);
    }

    /**清空订单 */
    private ClearOrder() {
        this.zhushiIndex = -1;
        this.shiwu.active = false;
        this.qita.spriteFrame = null;
        this.zhizhen1.y = 15;
        this.zhizhen1.active = false;
        this.xueding.spriteFrame = null;
        this.chadi.active = false;
        this.yinliaoParent.active = false;
        this.qita.node.parent.getChildByName('compeleteIcon').active = false;
        this.yinliaoParent.parent.getChildByName('compeleteIcon').active = false;
        this.shiwuParent.parent.getChildByName('compeleteIcon').active = false;
    }

    private StartCook() {
        this.orderTimeBar.getComponent(cc.Sprite).color = this.orderTimeColor;
        this.node.active = true;
        this.ClearOrder();
        this.cookFlag = true;
        App.DataManager.currentCookTime = App.DataManager.CookingTime;
        this.ShowOrder();
        this.zhizhen1.active = true;
    }

    private ShowOrder() {
        // if (!game.instance.gameFlag) return;
        let self = this;
        let orders = game.instance.CurrentOrder;
        if (orders.hanbao) this.InitZhushi(orders.hanbao);
        if (orders.kaiweicai) {
            App.DataManager.GetTexture('texture/shicai/' + App.DataManager.UserData.currChef + '/' + orders.kaiweicai).then((res: any) => {
                self.qita.spriteFrame = res;
            });
        }
        if (orders.bingsha) {
            this.yinliaoParent.active = true;
            App.DataManager.GetTexture('texture/shicai/yinliao/' + orders.bingsha).then((res: any) => {
                self.yinliao.spriteFrame = res;
                this.ShowDiejia(orders.bingsha);
            });
        }
        if (orders.dingcengpeiliao) {
            this.SingleInitTex('texture/shicai/' + App.DataManager.UserData.currChef + '/' + orders.dingcengpeiliao, this.xueding);
            this.yinliaoParent.active = true;
        }
        if (orders.chadi) {
            // console.log('game.instance.currentChadi~', game.instance.currentChadi)
            this.chadi.active = true;
            this.yinliaoParent.active = true;
        }
    }

    /**是否显示饮料叠加效果 */
    private ShowDiejia(name: string) {
        if (App.DataManager.yinliaohunhe.hasOwnProperty(name) && App.DataManager.yinliaohunhe[name].indexOf('niunaibingsha') != -1) {
            this.yinliaoDiejia.spriteFrame = this.yinliao.spriteFrame;
            this.yinliaoDiejia.node.parent.active = true;
        } else {
            this.yinliaoDiejia.node.parent.active = false;
        }
    }

    private InitZhushi(list: any) {
        this.shiwuParent.destroyAllChildren();
        this.shiwuParent.removeAllChildren();
        this.shiwu.active = true;
        let chefs = App.DataManager.UserData.currChef;
        for (let data in list) {
            let food = cc.instantiate(this.zhushiItem);
            let paths = chefs + "/" + list[data];
            this.SingleInitTex('texture/shicai/' + paths, food.getComponent(cc.Sprite));
            food.active = true;
            this.shiwuParent.addChild(food);
            food.x = 0;
            food.y = this.putOffsetY * (this.shiwuParent.children.length - 1) + this.origionY;
        }
        this.zhizhen1.y = this.shiwuParent.children[0].y;
    }

    /**错误后重置指针和主食位置 */
    private InitPosition() {
        let counts = 0;
        this.shiwuParent.children.forEach((food) => {
            food.y = this.putOffsetY * counts + this.origionY;
            counts++;
        })
        this.zhizhen1.y = this.shiwuParent.children[0].y;
        this.zhushiIndex = -1;
    }

    private SingleInitTex(path: string, sprite: any) {
        // console.log('点单主食路径：', path);
        App.DataManager.GetTexture(path).then((res: any) => {
            sprite.spriteFrame = res;
        });
    }

    /** 选择错误警告 */
    public ErrorWarning() {
        this.warning.active = true;
        this.node.getComponent(cc.Animation).play();
        let animTime = this.node.getComponent(cc.Animation).defaultClip.duration;
        this.scheduleOnce(() => {
            this.warning.active = false;
        }, animTime);
    }

    private CompeleteQita() {
        this.qita.node.parent.getChildByName('compeleteIcon').active = true;
    }
    private CompeleteYinliao() {
        this.yinliaoParent.parent.getChildByName('compeleteIcon').active = true;
        App.SoundManager.playEffect(SoundManager.yiliaowancheng);
    }

    public ChooseFood(data: any, foodName: any) {
        this.zhushiIndex++;
        this.hasZhushiArr.push(foodName);
        let targetIngredient = this.shiwuParent.children[this.zhushiIndex];
        let index = targetIngredient.getSiblingIndex();
        if (index > 0) {
            this.shiwuParent.children.forEach((childs) => {
                let index1 = childs.getSiblingIndex();
                if (index1 >= index) {
                    let posY = (data.offset) ? Number(data.offset) * childs.scale.x + this.shiwuParent.children[index1 - 1].y
                        : childs.getComponent(UITransform).height / 3 + this.shiwuParent.children[index1 - 1].y;
                    tween(childs)
                        .to(0.3, { position: new cc.Vec3(0, posY, childs.position.z) })
                        .start();
                }
            })
        }
        if (this.zhushiIndex + 1 == game.instance.CurrentOrder.hanbao.length) {
            this.shiwuParent.parent.getChildByName('compeleteIcon').active = true;
            this.zhizhen1.active = false;
            return;
        }
        this.MoveZhizhen(this.zhushiIndex + 1, data);
    }

    public ShowCorrectCount(count: number) {
        this.huo.active = (count >= App.DataManager.xiaofeiMax) ? true : false;
        this.correctNumLabel.string = (count == 0) ? "" : (count >= App.DataManager.xiaofeiMax) ? count.toString()
            : 'X' + count.toString();
    }

    private MoveZhizhen(targetIndex: number, data: any) {
        let childs = this.shiwuParent.children[targetIndex];
        let posY = (data.offset) ? Number(data.offset) * childs.scale.x + this.shiwuParent.children[targetIndex - 1].y
            : childs.getComponent(UITransform).height / 3 + this.shiwuParent.children[targetIndex - 1].y;
        tween(this.zhizhen1)
            .to(0.3, { position: new cc.Vec3(-57, posY, this.zhizhen1.position.z) })
            .start();
    }

    update(dt) {
        if (!this.cookFlag) return;
        App.DataManager.currentCookTime -= dt;
        this.orderTime.progress = App.DataManager.currentCookTime / App.DataManager.CookingTime;
        if (App.DataManager.currentCookTime <= App.DataManager.CookingOverTime && App.DataManager.currentCookTime > App.DataManager.CookingOverTime2) {
            player.instance.CustomerAngry();
            this.orderTimeBar.getComponent(cc.Sprite).color = this.orderOverTimeColor;
        }
        else if (App.DataManager.currentCookTime <= App.DataManager.CookingOverTime2)
            this.orderTimeBar.getComponent(cc.Sprite).color = this.orderOverTimeColor2;
        if (App.DataManager.currentCookTime <= 0) {
            console.log('食物时间已完~');
            this.cookFlag = false;
            game.instance.OnOrderExpired();
        }
    }

}
