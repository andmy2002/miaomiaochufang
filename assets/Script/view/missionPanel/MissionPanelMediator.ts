import BaseMediator from "../../../lightMVC/core/base/BaseMediator";
import { App } from "../../Manager/App";
import Notification from "../../Notification";
import MissionPanel from "./MissionPanel";

export default class MissionPanelMediator extends BaseMediator {

    public view: MissionPanel;

    public init(data?: any): void {
        this.view.drawView(data);
    }

    public viewDidAppear(): void {

    }

    public destroy(): void {
    }



}
