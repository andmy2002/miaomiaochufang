import BaseMediator from "../../../lightMVC/core/base/BaseMediator";
import Notification from "../../Notification";
import AddPanel from "./AddPanel";

export default class AddPanelMediator extends BaseMediator {

    public view: AddPanel;

    public init(data?: any): void {
        this.view.drawView(data);
    }

    public viewDidAppear(): void {

    }

    public destroy(): void {

    }



}
