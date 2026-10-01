import * as cc from "cc";
import { App } from "../../Manager/App";
import player from "../../player";
import AddPanel from "../addCoinPanel/AddPanel";
import AddPanelMediator from "../addCoinPanel/AddPanelMediator";
import SuperListItem from "../SuperScrollview/SuperListItem";
import TipPanel from "../tipPanel/TipPanel";
import TipPanelMediator from "../tipPanel/TipPanelMediator";

import { _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export default class UpgradeItem extends SuperListItem {
    @property(cc.Label)
    private wenzi1: cc.Label = null;
    @property(cc.Label)
    private wenzi2: cc.Label = null;
    @property(cc.Label)
    private costNum: cc.Label = null;
    @property(cc.Label)
    private jinduzi: cc.Label = null;
    @property(cc.ProgressBar)
    private progress: cc.ProgressBar = null;
    @property(cc.Node)
    private upBtn: cc.Node = null;
    @property(cc.Sprite)
    private texture: cc.Sprite = null;
    @property(cc.Node)
    private complete: cc.Node = null;

    private qianzui: string = '';
    private houzhui: string = '';
    private textureUrl: string = '';

    private datas: any = null;


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.upBtn.on(cc.Node.EventType.TOUCH_END, this.ClickUpgrade, this);
    }

    CancelSelect() {
        // throw new Error("Method not implemented.");
    }

    setData(pram: any) {
        console.log('setData:', pram);
        let key = Object.keys(App.DataManager.UpgradeList)[pram.index];
        this.node.name = key;
        this.datas = App.DataManager.UpgradeList[key];
        this.textSet(key);
        let endNum = this.datas.length;
        let currNum = App.DataManager.OtherData[key + 'Level'];
        this.jinduzi.string = currNum.toString() + '/' + endNum.toString();
        this.progress.progress = currNum / endNum;
        let showValue = (currNum == 0) ? 0 : this.datas[currNum - 1].value;
        this.wenzi1.string = this.qianzui + showValue + this.houzhui;
        if (currNum == endNum) this.AllComplete();
        else {
            this.wenzi2.string = this.datas[currNum].value + this.houzhui;
            this.costNum.string = this.datas[currNum].cost;
        }
        let self = this;
        App.DataManager.GetTexture('texture/mission/' + this.textureUrl).then((res: any) => {
            self.texture.spriteFrame = res;
        });
    }

    /**点击升级按钮 */
    private ClickUpgrade() {
        let num = App.DataManager.OtherData[this.node.name + 'Level'] + 1;
        if (num == this.datas.length) this.AllComplete();
        else {
            let cost = this.datas[num - 1].cost;
            App.DataManager.UpdateCoin(-cost, (success) => {
                if (success) {
                    App.DataManager.OtherData[this.node.name + 'Level']++;
                    this.wenzi1.string = this.qianzui + this.datas[num - 1].value + this.houzhui;
                    this.progress.progress = num / this.datas.length;
                    this.jinduzi.string = num.toString() + '/' + this.datas.length.toString();
                    console.log('消耗' + cost + "升级成功~");
                    this.wenzi2.string = this.datas[num].value + this.houzhui;
                    this.costNum.string = this.datas[num].cost;
                    App.DataManager.UpdateOtherData();


                }
                else {
                    // App.Facade.popView(TipPanelMediator, TipPanel, '硬币不足', false);
                    let data = { type: 'yingbi', clickType: 'buzu' };
                    App.Facade.popView(AddPanelMediator, AddPanel, data, false);
                }
            })
        }
        // App.DataManager.UpdateUserData();
    }

    private AllComplete() {
        this.wenzi2.string = '';
        this.wenzi1.node.position = new cc.Vec3(100, 0, 0);
        this.wenzi1.fontSize = 28;
        this.upBtn.active = false;
        this.complete.active = true;
        this.progress.node.active = false;
        this.jinduzi.node.active = true;
    }

    private textSet(str: string): string {
        let returnStr: string = '';
        switch (str) {
            case 'timeUp':
                {
                    this.qianzui = '额外的时间：';
                    this.houzhui = 's';
                    this.textureUrl = 'time';
                }; break;
            case 'coinUp': {
                this.qianzui = '额外的硬币：';
                this.houzhui = '%';
                this.textureUrl = 'jinbi';
            }; break;
            case 'diamondUp': {
                this.qianzui = '额外的宝石：';
                this.houzhui = '%';
                this.textureUrl = 'zuanshi';
            }; break;
        }
        return returnStr;
    }
}
