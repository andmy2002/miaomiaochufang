import * as cc from "cc";
import { UIOpacity } from "cc";
import { App } from "./Manager/App";
import StartScene from "./StartScene";
import AddPanel from "./view/addCoinPanel/AddPanel";
import AddPanelMediator from "./view/addCoinPanel/AddPanelMediator";
import TipPanel from "./view/tipPanel/TipPanel";
import TipPanelMediator from "./view/tipPanel/TipPanelMediator";

import { _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export default class bgControl extends cc.Component {

    public static _instance;
    @property(cc.Sprite)
    private bg1: cc.Sprite = null;

    @property(cc.Sprite)
    private chuang: cc.Sprite = null;
    @property(cc.Sprite)
    private yizi: cc.Sprite = null;
    @property(cc.Sprite)
    private zhuozi: cc.Sprite = null;
    @property(cc.Sprite)
    private taibu: cc.Sprite = null;
    @property(cc.Sprite)
    private zhuangshi: cc.Sprite = null;
    @property(cc.Node)
    private guizi: cc.Node = null;
    @property(cc.Sprite)
    private canbu: cc.Sprite = null;
    @property(cc.Sprite)
    private panzi: cc.Sprite = null;
    @property(cc.Node)
    private styleLockUp: cc.Node = null;
    @property(cc.Node)
    private styleLock: cc.Node = null;
    @property(cc.Node)
    private unLockBtn: cc.Node = null;
    @property(cc.Label)
    private btnCostLabel: cc.Label = null;
    @property(cc.Node)
    private zuojiantou: cc.Node = null;
    @property(cc.Node)
    private youjiantou: cc.Node = null;


    private bg1SprName: string = 'npg_bg1';
    private chuangSprName: string = 'img_xiaoxiongbg';
    private yiziSprName: string = 'img_yizi';
    private zhuoziSprName: string = 'npg_bg2';
    private taibuSprName: string = 'img_taibu';
    private zhuangshiSprName: string = 'img_zhuangshi';
    private guiziSprName: string = 'img_bg3_img';
    private canbuSprName: string = 'img_zhubu';
    private panziSprName: string = 'img_panzi';

    private pathQianZhui: string = '';

    public BgOrderArr: string[] = ['A', 'B', 'C', 'D'];


    private canChange: boolean = true;

    private moveBgOffset: number = 20;
    @property(cc.Node)
    public changeBgNode: cc.Node = null;
    private moveFlag: boolean = false;

    private currentSelectChef: string = '';



    public static get instance() {
        return bgControl._instance;
    }
    public static set instance(value) {
        bgControl._instance = value;
    }

    onLoad() {
        bgControl.instance = this;
        this.changeBgNode.on(cc.Node.EventType.TOUCH_MOVE, this.MoveChangeBg, this);
        this.changeBgNode.on(cc.Node.EventType.TOUCH_END, () => { this.moveFlag = false; }, this);
        this.changeBgNode.on(cc.Node.EventType.TOUCH_CANCEL, () => { this.moveFlag = false; }, this);
        this.unLockBtn.on(cc.Node.EventType.TOUCH_END, this.ClickUnLockStyle, this)

        this.zuojiantou.on(cc.Node.EventType.TOUCH_END, this.ChangeLeft, this);
        this.youjiantou.on(cc.Node.EventType.TOUCH_END, this.ChangeRight, this);
    }

    start() {
        this.ChangeBg(App.DataManager.UserData.currChef);
    }

    private MoveChangeBg(event): void {
        if (this.moveFlag || !this.canChange) return;
        let moveOffset = Math.abs(event.touch.getDelta().x)
        if (moveOffset > this.moveBgOffset) {
            (event.touch.getDelta().x > 0) ? bgControl.instance.ChangeLeft() : bgControl.instance.ChangeRight();
            this.moveFlag = true;
        }
    }

    public ChangeRight() {
        if (!this.canChange) return;
        let index = this.BgOrderArr.indexOf(this.currentSelectChef);
        if (index + 1 < this.BgOrderArr.length) {
            this.ChangeBg(this.BgOrderArr[index + 1]);
            this.zuojiantou.active = true;
        } else {
            console.log("最右方");
            this.youjiantou.active = false;
        }
    }


    public ChangeLeft() {
        if (!this.canChange) return;
        let index = this.BgOrderArr.indexOf(this.currentSelectChef);
        if (index - 1 >= 0) {
            this.ChangeBg(this.BgOrderArr[index - 1]);
            this.youjiantou.active = true;
        } else {
            // this.ChangeBg(this.BgOrderArr[this.BgOrderArr.length - 1]);
            console.log("最左方");
            this.zuojiantou.active = false;
        }
    }

    public ShowArrow() {
        this.canChange = true;
        (this.zuojiantou.getComponent(UIOpacity) || this.zuojiantou.addComponent(UIOpacity)).opacity = 255;
        (this.youjiantou.getComponent(UIOpacity) || this.youjiantou.addComponent(UIOpacity)).opacity = 255;
    }

    public HideArrow() {
        this.canChange = false;
        (this.zuojiantou.getComponent(UIOpacity) || this.zuojiantou.addComponent(UIOpacity)).opacity = 0;
        (this.youjiantou.getComponent(UIOpacity) || this.youjiantou.addComponent(UIOpacity)).opacity = 0;
    }

    /**更换背景风格 */
    public ChangeBg(chef: string) {
        this.currentSelectChef = chef;
        let index = this.BgOrderArr.indexOf(this.currentSelectChef);
        this.zuojiantou.active = (index > 0) ? true : false;
        this.youjiantou.active = (index < this.BgOrderArr.length) ? true : false;
        if (App.DataManager.UserData.chefList.indexOf(chef) == -1) {
            // App.Facade.popView(TipPanelMediator, TipPanel, '风格未解锁~', false);
            this.LockStyle();
            return;
        }
        this.HideLockStyle();
        App.DataManager.UserData.currChef = this.currentSelectChef;
        App.DataManager.UpdateUserData();
        this.pathQianZhui = 'texture/chufang/' + chef + '/';
        this.GetSingleTexture(this.bg1SprName, this.bg1);
        this.GetSingleTexture(this.chuangSprName, this.chuang);
        this.GetSingleTexture(this.yiziSprName, this.yizi);
        this.GetSingleTexture(this.zhuoziSprName, this.zhuozi);
        this.GetSingleTexture(this.taibuSprName, this.taibu);
        this.GetSingleTexture(this.zhuangshiSprName, this.zhuangshi);
        this.GetSingleTexture(this.canbuSprName, this.canbu);
        this.GetSingleTexture(this.panziSprName, this.panzi);
        this.guizi.children.forEach((childs) => {
            this.GetSingleTexture(this.guiziSprName, childs.getComponent(cc.Sprite));
        })
    }

    private LockStyle() {
        this.btnCostLabel.string = App.DataManager.BgCost[this.currentSelectChef].cost;
        if (this.styleLockUp.active == true) return;
        this.styleLockUp.active = true;
        this.styleLockUp.getComponent(cc.Animation).play();
        this.styleLock.active = true;
        this.styleLock.getComponentInChildren(cc.Animation).play();
        StartScene.instance.startGameBtn.active = false;
    }

    private HideLockStyle() {
        this.styleLockUp.active = false;
        this.styleLock.active = false;
        StartScene.instance.startGameBtn.active = true;
    }

    public ClickUnLockStyle() {
        let cost = Number(App.DataManager.BgCost[this.currentSelectChef].cost);
        App.DataManager.UpdateDiamand(-cost, (success) => {
            if (success) {
                App.DataManager.UserData.chefList.push(this.currentSelectChef);
                App.DataManager.UserData.currChef = this.currentSelectChef;
                App.DataManager.UpdateUserData();
                this.ChangeBg(this.currentSelectChef);
                this.HideLockStyle();
                App.DataManager.SetPass('canting');
            } else {
                // App.Facade.popView(TipPanelMediator, TipPanel, '钻石不足~', false);
                let data = { type: 'zuanshi', clickType: 'buzu' }
                App.Facade.popView(AddPanelMediator, AddPanel, data, false);
            }
        })

    }

    private GetSingleTexture(path: string, sprite: any) {
        let paths = this.pathQianZhui + path;
        App.DataManager.GetTexture(paths).then((res: any) => {
            sprite.spriteFrame = res;
        });
    }

    // update (dt) {}
}
