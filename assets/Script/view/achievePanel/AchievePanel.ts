import { BaseView } from "../../../lightMVC/core/base/BaseView";
import { App } from "../../Manager/App";
import StartSceneModel from "../../model/StartSceneModel";
import StartScene from "../../StartScene";
import SuperListItem from "../SuperScrollview/SuperListItem";
import SuperScrollView from "../SuperScrollview/SuperScrollView";
import { _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export default class AchievePanel extends BaseView {

    public drawView(): void {
        App.Facade.getModel(StartSceneModel).achieveTishiClose();
        App.DataManager.achieveOpenFlag = true;
        this.node.parent = StartScene.instance.dibuBg;
        this.node.y = 0;
        let view = this.ui.getNode("SuperScrollview");
        /**未领取成就列表 */
        let notReceivedList = [];
        /**已领取成就列表 */
        let receivedList = [];
        /**未完成成就列表 */
        let otherList = [];
        App.DataManager.showAchieveList = [];
        for (let element in App.DataManager.AchievementList) {
            let achi = App.DataManager.AchievementList[element];
            let hasAchi = App.DataManager.OtherData.hasAchieve[element];
            if (hasAchi.count >= achi.count) {
                (hasAchi.hasGet) ? receivedList[element] = App.DataManager.AchievementList[element]
                    : notReceivedList[element] = App.DataManager.AchievementList[element];
            } else {
                otherList[element] = App.DataManager.AchievementList[element];
            }
        }
        App.DataManager.showAchieveList = Object.assign(notReceivedList, otherList, receivedList);
        // console.log('未领取成就列表:', notReceivedList);
        // console.log('未完成成就列表:', otherList);
        // console.log('已领取成就列表:', receivedList);
        // console.log('显示成就列表:',  App.DataManager.showAchieveList);
        let list = Object.values(App.DataManager.showAchieveList);//(App.DataManager.AchievementList);
        view.getComponent(SuperScrollView).setData(list, false, null);

    }
    onDisable() {
        App.DataManager.achieveOpenFlag = false;
        App.DataManager.ShowAchieveTi();
    }

    public static path(): string {
        return "prefabs/AchievePanel";
    }
}
