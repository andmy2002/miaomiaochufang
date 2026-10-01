import * as cc from "cc";
import { BaseView } from "../../../lightMVC/core/base/BaseView";
import { App } from "../../Manager/App";
import SdkManager from "../../../resources/sdk/script/SdkManager";
import TipPanelMediator from "../tipPanel/TipPanelMediator";
import TipPanel from "../tipPanel/TipPanel";
import player from "../../player";
import StartScene from "../../StartScene";
import RolePanelMediator from "../rolePanel/RolePanelMediator";
import RolePanel from "../rolePanel/RolePanel";
import AddPanel from "../addCoinPanel/AddPanel";
import AddPanelMediator from "../addCoinPanel/AddPanelMediator";
import { _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export default class BuyRolePanel extends BaseView {

    private roleIndex: number = 0;
    private costCoin: number = 0;
    private roleName: string = '';
    public drawView(data): void {
        SdkManager.Instance.showNativeBannerAddButton();
        SdkManager.Instance.showNativeInterstitial();
        // 返回
        let closeBtn = this.ui.getNode("close");
        closeBtn.on(cc.Node.EventType.TOUCH_END, () => {
            this.closeView();
            SdkManager.Instance.showNativeBanner();
        }, this);
        let num = this.ui.getNode("num");
        this.roleIndex = Number(data.index - 2);
        this.costCoin = App.DataManager.roleBuyCount[this.roleIndex];
        this.roleName = data.index.toString();
        num.getComponent(cc.Label).string = this.costCoin.toString();
        let texture = this.ui.getNode("icon");
        texture.getComponent(cc.Sprite).spriteFrame = data.sprite;
        let buyBtn = this.ui.getNode("buy");
        buyBtn.on(cc.Node.EventType.TOUCH_END, this.ClickBuy, this);
        console.log('goumaijuese')
    }

    private ClickBuy() {
        App.DataManager.UpdateCoin(-this.costCoin, (success) => {
            if (success) {
                App.DataManager.UserData.currRole = this.roleName;
                App.DataManager.UserData.roleList.push(this.roleName);
                App.DataManager.UpdateUserData();
                player.instance.InitRole();
                App.DataManager.SetPass('juese');
                StartScene.instance.closeAllPopView();
                App.Facade.popView(RolePanelMediator, RolePanel, '更新角色界面', false);
                SdkManager.Instance.showNativeBanner();
                this.closeView();
            } else {
                let data = { type: 'yingbi', clickType: 'buzu' };
                App.Facade.popView(AddPanelMediator, AddPanel, data, false);
                // App.Facade.popView(TipPanelMediator, TipPanel, '硬币不足~', false);
            }
        })
    }

    public static path(): string {
        return "prefabs/BuyRolePanel";
    }
}
