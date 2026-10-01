import BaseMediator from "../lightMVC/core/base/BaseMediator";
import Notification from "./Notification";
import { ViewManager } from "../lightMVC/core/manager/ViewManager";
import plate from "./plate";

export default class plateMediator extends BaseMediator {

    public view: plate;

    public init(data?: any): void {
        //将mediator添加到了layer数组中
        ViewManager.getInstance().pushLayerList(this);

    }

    public viewDidAppear(): void {

    }

    public destroy(): void {

    }



}
