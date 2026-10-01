import * as cc from "cc";
import { App } from "../../Manager/App";
import player from "../../player";
import BuyRolePanel from "../buyRolePanel/BuyRolePanel";
import BuyRolePanelMediator from "../buyRolePanel/BuyRolePanelMediator";
import SuperListItem from "../SuperScrollview/SuperListItem";
import TipPanel from "../tipPanel/TipPanel";
import TipPanelMediator from "../tipPanel/TipPanelMediator";

import { _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export default class LevelItem extends SuperListItem {

    @property(cc.Node)
    private mask1: cc.Node = null;
    @property(cc.Node)
    private lock: cc.Node = null;
    @property(cc.Node)
    private mask2: cc.Node = null;
    @property(cc.Sprite)
    private texture: cc.Sprite = null;

    private hasFlag: boolean = false;
    @property(cc.Label)
    private numLabel: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            if (!this.hasFlag) {
                console.log('角色未解锁~');
                let sendMessage = { sprite: this.texture.spriteFrame, index: this.node.name };
                App.Facade.popView(BuyRolePanelMediator, BuyRolePanel, sendMessage, false);
                return;
            }
            this.ChangeRole();
        }, this);
    }

    /**更换角色 */
    private ChangeRole() {
        if (App.DataManager.UserData.currRole == this.node.name) return;
        App.DataManager.UserData.currRole = this.node.name;
        App.DataManager.UpdateUserData();
        player.instance.InitRole();
        this.node.parent.emit('ChangeRole');
        this.mask1.active = false;
    }

    /**取消选择 */
    public CancelSelect() {
        this.mask1.active = true;
    }

    setData(pram: any) {
        this.texture.spriteFrame = pram.data;
        this.node.name = (pram.index + 1).toString();
        this.hasFlag = (App.DataManager.UserData.roleList.indexOf(this.node.name) != -1) ? true : false;
        this.numLabel.node.parent.active = !this.hasFlag;
        if (!this.hasFlag) this.numLabel.string = App.DataManager.roleBuyCount[pram.index - 1].toString();
        this.lock.active = !this.hasFlag;
        this.mask2.active = !this.hasFlag;
        this.mask1.active = (App.DataManager.UserData.currRole == this.node.name) ? false : true;
    }
}
