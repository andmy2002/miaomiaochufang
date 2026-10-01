import BaseMediator from "../lightMVC/core/base/BaseMediator";
import Notification from "./Notification";
import { ViewManager } from "../lightMVC/core/manager/ViewManager";
import StartScene from "./StartScene";

export default class StartSceneMediator extends BaseMediator {

    public view: StartScene;

    public init(data?: any): void {
        //将mediator添加到了layer数组中
        ViewManager.getInstance().pushLayerList(this);
        this.registerNoti("UPDATE_COIN", () => {
            this.view.UpdateCoinLabel();
        }, this);
        this.registerNoti("UPDATE_DIAMAND", () => {
            this.view.UpdateDiamandLabel();
        }, this);


        this.registerNoti("missionTishi", () => {
            this.view.ShowMissionTishi(true);
        }, this);

        this.registerNoti("missionTishiClose", () => {
            this.view.ShowMissionTishi(false);
        }, this);


        this.registerNoti("achieveTishi", () => {
            this.view.ShowAchieveTishi(true);
        }, this);

        this.registerNoti("achieveTishiClose", () => {
            this.view.ShowAchieveTishi(false);
        }, this);
    }

    public viewDidAppear(): void {

    }

    public destroy(): void {

    }



}
