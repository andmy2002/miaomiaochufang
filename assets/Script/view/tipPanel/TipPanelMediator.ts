import BaseMediator from "../../../lightMVC/core/base/BaseMediator";
import Notification from "../../Notification";
import TipPanel from "./TipPanel";

export default class TipPanelMediator extends BaseMediator {

    public view: TipPanel;

    public init(data?: any): void {
        this.view.drawView(data);
    }

    public viewDidAppear(): void {

    }

    public destroy(): void {

    }



}
