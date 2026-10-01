import BaseMediator from "../../../lightMVC/core/base/BaseMediator";
import Order from "./Order";

import { _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export default class OrderMediator extends BaseMediator {

    public view: Order;
    public init(data?: any): void {
        //将mediator添加到了layer数组中
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
        throw new Error("Method not implemented.");
    }
    public destroy(): void {
        throw new Error("Method not implemented.");
    }
}
