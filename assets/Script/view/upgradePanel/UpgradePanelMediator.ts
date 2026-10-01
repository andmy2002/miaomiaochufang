import BaseMediator from "../../../lightMVC/core/base/BaseMediator";
import Notification from "../../Notification";
import UpgradePanel from "./UpgradePanel";

export default class UpgradePanelMediator extends BaseMediator {

    public view: UpgradePanel;

    public init(data?: any): void {
        this.view.drawView();
    }

    public viewDidAppear(): void {

    }

    public destroy(): void {

    }



}
