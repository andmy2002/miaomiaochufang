import BaseMediator from "../../../lightMVC/core/base/BaseMediator";
import { App } from "../../Manager/App";
import Notification from "../../Notification";
import AchievePanel from "./AchievePanel";

export default class AchievePanelMediator extends BaseMediator {

    public view: AchievePanel;

    public init(data?: any): void {
        this.view.drawView();
    }

    public viewDidAppear(): void {

    }

    public destroy(): void {
        console.log('关闭成就界面~~~~')
        App.DataManager.achieveOpenFlag = false;
    }



}
