import BaseMediator from "../lightMVC/core/base/BaseMediator";
import Notification from "./Notification";
import { ViewManager } from "../lightMVC/core/manager/ViewManager";
import game from "./game";

export default class gameMediator extends BaseMediator {

    public view: game;

    public init(data?: any): void {
        //将mediator添加到了layer数组中
        ViewManager.getInstance().pushLayerList(this);
        // this.registerNoti("UPDATE_COIN", () => {
        //     this.view.UpdateCoinLabel();
        // }, this);
        // this.registerNoti("UPDATE_TILI", () => {
        //     this.view.ShowPhysicalValue();
        // }, this);
        // this.registerNoti("UPDATE_TILI_JISHI", (data) => {
        //     this.view.TiliCountShow(data);
        // }, this);

    }

    public viewDidAppear(): void {

    }

    public destroy(): void {

    }



}
