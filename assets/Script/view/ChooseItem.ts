import * as cc from "cc";
import game from "../game";
import { App } from "../Manager/App";

import { _decorator } from "cc";
const { ccclass, property } = _decorator;
@ccclass
export default class ChooseItem extends cc.Component {

    @property(cc.Sprite)
    sprites: cc.Sprite = null;

    @property(cc.Node)
    clcikBtn: cc.Node = null;

    private datas: any = null;

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.ChooseIngredients, this);
        this.node.on(cc.Node.EventType.TOUCH_START, this.OnTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.OnTouchCancel, this);
    }

    private OnTouchStart() {
        this.clcikBtn.active = true;
    }

    private OnTouchCancel() {
        this.clcikBtn.active = false;
    }

    public setData(data: any) {
        this.datas = data;
        var self = this;
        let chefs = App.DataManager.UserData.currChef;
        let types = App.DataManager.IngredientType;
        let paths = (data.type == types.A || data.type == types.C || data.type == types.E) ? chefs + "/" + data.path : 'yinliao/' + data.path;
        App.DataManager.GetTexture('texture/shicai/' + paths).then((res: any) => {
            self.sprites.spriteFrame = res;
        });
        this.sprites.node.angle = (data.ang) ? Number(data.ang) : 0;
        if (data.scale) this.sprites.node.setScale(Number(data.scale), Number(data.scale), 1);
    }

    private ChooseIngredients() {
        // let str = (this.datas.matchPath) ? this.datas.matchPath : this.node.name;
        game.instance.ChooseIngredient(this.datas, this.node.name);// str);
        this.clcikBtn.active = false;
    }


    onDestroy() {
        this.node.off(cc.Node.EventType.TOUCH_END, this.ChooseIngredients, this);
        this.node.off(cc.Node.EventType.TOUCH_START, this.OnTouchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.OnTouchCancel, this);
    }
}
