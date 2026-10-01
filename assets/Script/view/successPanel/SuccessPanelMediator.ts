import BaseMediator from "../../../lightMVC/core/base/BaseMediator";
import Notification from "../../Notification";
import SuccessPanel from "./SuccessPanel";

export default class SuccessPanelMediator extends BaseMediator {

    public view: SuccessPanel;

    public init(data?: any): void {
        this.view.drawView();
    }

    public viewDidAppear(): void {

    }

    public destroy(): void {

    }



}
