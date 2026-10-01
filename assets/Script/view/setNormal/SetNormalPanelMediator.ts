import BaseMediator from "../../../lightMVC/core/base/BaseMediator";
import Notification from "../../Notification";
import SetNormalPanel from "./SetNormalPanel";

export default class SetNormalPanelMediator extends BaseMediator {

    public view: SetNormalPanel;

    public init(data?: any): void {
        this.view.drawView();
    }

    public viewDidAppear(): void {

    }

    public destroy(): void {

    }



}
