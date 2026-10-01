import BaseMediator from "../../../lightMVC/core/base/BaseMediator";
import PopAView from "./PopOutPanelView";
import Notification from "../../Notification";

export default class PopOutPanelViewMediator extends BaseMediator {

    public view: PopAView;

    public init(data?: any): void {
        this.view.drawView();

         //let playerModel = this.getModel(PlayerModel);
        // this.view.setLevelDisplay(playerModel.getPlayerLv());

        // // 监听修改经验事件
        // this.bindEvent(PopAView.UPDATE_LEVEL, (exp)=>{
        //     this.sendCmd(UpdateExpCommand, exp);
        // }, this);

        // this.registerNoti(Notification.UPDATE_EXP_FINISH, ()=>{
        //     this.view.setLevelDisplay(playerModel.getPlayerLv());
        // }, this);
    }

    public viewDidAppear(): void {

    }

    public destroy(): void {

    }



}
