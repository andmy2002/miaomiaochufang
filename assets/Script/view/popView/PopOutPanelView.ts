import * as cc from "cc";
import { BaseView } from "../../../lightMVC/core/base/BaseView";
import { App } from "../../Manager/App";

import { _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export default class PopOutPanelView extends BaseView {

    public static readonly UPDATE_LEVEL = "UPDATE_LEVEL";

    public drawView (): void {
        // 关闭按钮
        let closeBtn = this.ui.getNode("close_button");
        closeBtn.on(cc.Node.EventType.TOUCH_END, ()=>{
            //this.node.parent.getChildByName("blackBg").destroy();
            this.closeView();
        }, this);
        let out_rule = this.ui.getNode("out_rule");
        out_rule.on(cc.Node.EventType.TOUCH_END, ()=>{
            // App.Facade.popView(RulePanelMediator, RulePanel, "规则", true);
        }, this);
        this.xunlian();
        this.work();
    }

    public setLevelDisplay(lv: number): void {
        let levelLabel = this.ui.getComponent("des_label", cc.Label);
        levelLabel.string = "当前等级为：" + lv;
    }

    //训练
    private xunlian(){
        let xunlian = this.ui.getNode("xunlian");
        let join = xunlian.getChildByName("out_join");
        join.on(cc.Node.EventType.TOUCH_END, ()=>{
            App.TipsManager.showmid("功能暂未开放，敬请期待");
        }, this);
    }
    //训练
    private work(){
        let work = this.ui.getNode("work");
        let join = work.getChildByName("out_join");
        join.on(cc.Node.EventType.TOUCH_END, ()=>{
            App.TipsManager.showmid("功能暂未开放，敬请期待");
        }, this);
    }

    public static path(): string {
        return "prefabs/PopOutPanel";
    }
}
