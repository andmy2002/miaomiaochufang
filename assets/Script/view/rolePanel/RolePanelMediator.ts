import BaseMediator from "../../../lightMVC/core/base/BaseMediator";
import Notification from "../../Notification";
import RolePanel from "./RolePanel";

export default class RolePanelMediator extends BaseMediator {

    public view: RolePanel;

    public init(data?: any): void {
        this.view.drawView();
    }

    public viewDidAppear(): void {

    }

    public destroy(): void {

    }



}
