import { BaseView } from "../../../lightMVC/core/base/BaseView";
import { App } from "../../Manager/App";
import StartScene from "../../StartScene";
import SuperListItem from "../SuperScrollview/SuperListItem";
import SuperScrollView from "../SuperScrollview/SuperScrollView";
import { _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export default class UpgradePanel extends BaseView {

    public drawView(): void {
        this.node.parent = StartScene.instance.dibuBg;
        this.node.y = 0;
        let view = this.ui.getNode("SuperScrollview");
       
        let list = Object.values(App.DataManager.UpgradeList);
        view.getComponent(SuperScrollView).setData(list, false, null);

    }

    public static path(): string {
        return "prefabs/UpgradePanel";
    }
}
