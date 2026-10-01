import BaseMediator from "../../../lightMVC/core/base/BaseMediator";
import Notification from "../../Notification";
import PausePanel from "./PausePanel";

export default class PausePanelMediator extends BaseMediator {

    public view: PausePanel;

    public init(data?: any): void {
        this.view.drawView();
    }

    public viewDidAppear(): void {

    }

    public destroy(): void {

    }



}
