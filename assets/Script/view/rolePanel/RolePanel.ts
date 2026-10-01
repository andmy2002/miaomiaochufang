import * as cc from "cc";
import { BaseView } from "../../../lightMVC/core/base/BaseView";
import { App } from "../../Manager/App";
import StartScene from "../../StartScene";
import SuperListItem from "../SuperScrollview/SuperListItem";
import SuperScrollView from "../SuperScrollview/SuperScrollView";
import RolePanelMediator from "./RolePanelMediator";
import { _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export default class RolePanel extends BaseView {

    private textureList: any = [];
    public drawView(): void {
        let chooseRole = this.ui.getNode("chooseRole");
        this.node.parent = StartScene.instance.dibuBg;
        this.node.y = 0;
        this.loadRoleChoose(() => {
            chooseRole.getComponent(SuperScrollView).setData(this.textureList, false, null);
        })
        let contant = this.ui.getNode("contant");
        contant.on("ChangeRole", () => {
            contant.children.forEach((childs) => {
                childs.getComponent(SuperListItem).CancelSelect();
            })
        })
    }


    /** 导入角色选择图片组 */
    private loadRoleChoose(cb: Function) {
        console.log("角色选择图片加载$$$$$$$$$$$$$$$");
        let url = "texture/rolechoose"
        let self = this;
        cc.resources.loadDir(url, cc.SpriteFrame, (err, res) => {
            res.sort((a: any, b: any) => { return Number(a._name) - Number(b._name) });
            self.textureList = res;
            // console.log("角色选择图片加载完成", self.textureList);
            cb();
        })
    }

    public static path(): string {
        return "prefabs/RolePanel";
    }
}
