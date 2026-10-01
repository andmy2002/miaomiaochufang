import BaseMediator from "../../../lightMVC/core/base/BaseMediator";
import Notification from "../../Notification";
import BuyRolePanel from "./BuyRolePanel";

export default class BuyRolePanelMediator extends BaseMediator {

    public view: BuyRolePanel;

    public init(data?: any): void {
        this.view.drawView(data);
    }

    public viewDidAppear(): void {

    }

    public destroy(): void {

    }



}
