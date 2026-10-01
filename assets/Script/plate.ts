import * as cc from "cc";
import { tween, UITransform } from "cc";
import { BaseView } from "../lightMVC/core/base/BaseView";
import game from "./game";
import { App } from "./Manager/App";
import plateMediator from "./plateMediator";
import UIAction from "./UIAction";

import { _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export default class plate extends BaseView {

    public static _instance;

    @property(cc.Node)
    private shiwuParent: cc.Node = null;
    @property(cc.Node)
    private shiwuItem: cc.Node = null;

    @property(cc.Node)
    private yinliaoParent: cc.Node = null;

    @property(cc.Node)
    private xueding: cc.Node = null;

    @property(cc.Node)
    private chadi: cc.Node = null;

    @property(cc.Sprite)
    private yinliao: cc.Sprite = null;


    @property(cc.Sprite)
    private yinliaoDiejia: cc.Sprite = null;


    private yinliaoArr: any = [];

    @property(cc.Sprite)
    private qita: cc.Sprite = null;

    public moveOver: boolean = false;

    private moveTime: number = 0.3;

    public static get instance() {
        return plate._instance;
    }
    public static set instance(value) {
        plate._instance = value;
    }
    onLoad() {
        plate.instance = this;
        this.registerMediator(plateMediator, this, "放置模块");
    }

    public StartGame() {
        this.node.active = true;
        this.Appear();
        let self = this;
        App.DataManager.GetTexture('texture/shicai/' + App.DataManager.UserData.currChef + '/dingcengpeiliao').then((res: any) => {
            self.xueding.getComponent(cc.Sprite).spriteFrame = res;
        });
    }

    /**清空盘子 */
    private ResetPlate() {
        this.ResetZhushi();
        this.ResetYinliao();
        this.ResetQita();
    }

    public ResetZhushi() {
        this.shiwuParent.destroyAllChildren();
        this.shiwuParent.removeAllChildren();
    }

    public ResetYinliao() {
        this.yinliaoParent.active = false;
        this.xueding.active = false;
        this.yinliao.spriteFrame = null;
        this.chadi.active = false;
        this.yinliaoArr = [];
    }

    public ResetQita() {
        this.qita.spriteFrame = null;
    }

    public ChadiShow() {
        this.yinliaoParent.active = true;
        this.chadi.active = true;
        this.yinliaoParent.getComponent(cc.Animation).play();
    }

    public XuedingShow() {
        this.xueding.active = true;
        this.yinliaoParent.getComponent(cc.Animation).play();
    }

    public ChangeDrinkColor(list: any) {
        if (this.chadi.active == true) this.chadi.children[0].active = false;
        let self = this;
        this.yinliaoParent.active = true;
        if (list.length == 1) {
            App.DataManager.GetTexture('texture/shicai/yinliao/' + list[0]).then((res: any) => {
                self.yinliao.spriteFrame = res;
                this.ShowDiejia(list[0]);
            });
        } else {
            for (let element in App.DataManager.yinliaohunhe) {
                if (App.DataManager.arrayEqual(list, App.DataManager.yinliaohunhe[element])) {
                    App.DataManager.GetTexture('texture/shicai/yinliao/' + element).then((res: any) => {
                        self.yinliao.spriteFrame = res;
                        this.ShowDiejia(element);
                    });
                }
            }
        }
        this.yinliaoParent.getComponent(cc.Animation).play();
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


    public InitFood(data: any) {
        let food = cc.instantiate(this.shiwuItem);
        App.DataManager.GetTexture('texture/shicai/' + App.DataManager.UserData.currChef + '/' + data.path).then((res: any) => {
            food.getComponent(cc.Sprite).spriteFrame = res;
        });
        food.active = true;
        this.shiwuParent.addChild(food);
        food.x = 0;
        const foodHeight = food.getComponent(UITransform).height;
        let posY = (this.shiwuParent.children.length - 1 == 0) ? 0 : (data.offset) ? Number(data.offset) + this.shiwuParent.children[this.shiwuParent.children.length - 2].y : foodHeight / 3 + this.shiwuParent.children[this.shiwuParent.children.length - 2].y;
        food.y = posY;
        this.shiwuParent.getComponent(cc.Animation).play();
    }

    public ChangeQita(data) {
        let self = this;
        App.DataManager.GetTexture('texture/shicai/' + App.DataManager.UserData.currChef + '/' + data.path).then((res: any) => {
            self.qita.spriteFrame = res;
        });
        this.qita.node.parent.getComponent(cc.Animation).play();
    }

    public StopGame() {
        this.node.active = false;
    }

    public Appear() {
        console.log('')
        if (!game.instance.gameFlag) return;
        this.ResetPlate();
        this.node.x = 700;
        tween(this.node)
            .by(this.moveTime, { position: new cc.Vec3(-700, 0, 0) })
            .call(() => { this.moveOver = true; })
            .start();
    }

    public DisAppear() {
        this.moveOver = false;
        tween(this.node)
            .by(this.moveTime, { position: new cc.Vec3(-700, 0, 0) })
            .call(() => this.Appear())
            .start();
    }

}
