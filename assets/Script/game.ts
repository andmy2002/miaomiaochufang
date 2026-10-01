import * as cc from "cc";
import { dragonBones, UIOpacity, UITransform } from "cc";
import { BaseView } from "../lightMVC/core/base/BaseView";
import NotificationManager from "../lightMVC/core/manager/NotificationManager";
import SdkManager from "../resources/sdk/script/SdkManager";
import gameMediator from "./gameMediator";
import { App } from "./Manager/App";
import { SoundManager } from "./Manager/SoundManager";
import plate from "./plate";
import player from "./player";
import Guide from "./prop/Guide";
import StartScene from "./StartScene";
import TimeControl from "./TimeControl";
import ChooseItem from "./view/ChooseItem";
import Order from "./view/order/Order";
import PausePanel from "./view/pausePanel/PausePanel";
import PausePanelMediator from "./view/pausePanel/PausePanelMediator";
import SuccessPanel from "./view/successPanel/SuccessPanel";
import SuccessPanelMediator from "./view/successPanel/SuccessPanelMediator";

import { _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export default class game extends BaseView {

    public static _instance;

    /**食材选择父级 */
    @property(cc.Node)
    private ingredientsParent: cc.Node = null;
    @property(cc.Node)
    private GuideParentNode: cc.Node = null;

    /**食材选择父级 */
    @property(cc.Node)
    private zantingBtn: cc.Node = null;
    /**点击龙骨 */
    @property(cc.Node)
    private dianjiDragon: cc.Node = null;
    /**点击龙骨 */
    @property(cc.Node)
    private messageNode: cc.Node = null;
    /**金币数 */
    @property(cc.Label)
    private coinLabel: cc.Label = null;

    @property(cc.Prefab)
    private ingredientsItem: cc.Prefab = null;

    @property(cc.ProgressBar)
    public totalTimeProgress: cc.ProgressBar = null;
    private currentTotalTime: number = 0;

    private currentFoodList: any = null;
    public gameFlag: boolean = false;

    private hasZhushi: boolean = false;
    private hasYinliao: boolean = false;
    private hasQita: boolean = false;
    private hasXueding: boolean = false;
    private hasChadi: boolean = false;

    private zhushiIndex: number = -1;
    private hasZhushiArr: any = [];
    private hasYinliaoArr: any = [];

    public CurrentOrder: any = {};

    private CompleteTime: number = 0.5;



    private shicaiNum: number = 0;
    private errorShicaiNum: number = 0;

    private countxiaofei: number = 0;
    private xiaofeiNum: number = 0;

    /**当次营业总额（顾客金币+小费） */
    private totalNum: number = 0;
    private getCoinNum: number = 0;

    private foodIngreCount: number = 0;
    private getXiaofeiCount: number = 0;
    private perGetXiaofei: number = 0;
    private currentClickIngreName: string = '';


    private perCoinNum: number = 0;


    public static get instance() {
        return game._instance;
    }
    public static set instance(value) {
        game._instance = value;
    }
    onLoad() {
        game.instance = this;
        this.registerMediator(gameMediator, this, "主界面");
        this.zantingBtn.on(cc.Node.EventType.TOUCH_END, this.ClickPauseGame, this);
    }

    public StartGame() {
        this.unscheduleAllCallbacks();
        App.SoundManager.playHuanYingEffect();
        App.SoundManager.playBGM(SoundManager.gameBgm);
        App.DataManager.TotalTimeCal();
        this.foodIngreCount = 0;
        this.getXiaofeiCount = 0;
        this.shicaiNum = 0;
        this.errorShicaiNum = 0;
        this.countxiaofei = 0;
        this.xiaofeiNum = 0;
        this.totalNum = 0;
        this.getCoinNum = 0;
        this.perCoinNum = 0;
        this.perGetXiaofei = 0;
        this.hasYinliaoArr = [];
        this.hasZhushiArr = [];
        this.zhushiIndex = -1;
        (this.node.getComponent(UIOpacity) || this.node.addComponent(UIOpacity)).opacity = 255;
        this.node.active = true;
        this.coinLabel.string = this.totalNum.toString();
        console.log('this.totalNum', this.totalNum, this.coinLabel)
        this.InitFoodList();
        this.currentFoodList = App.DataManager.FoodList;
        this.RandomFood();
        this.currentTotalTime = App.DataManager.TotalOpeningTime;
        this.gameFlag = true;
        player.instance.NewCustomer();
        plate.instance.StartGame();
        Order.instance.StartCook();
        if (App.DataManager.firstEnterGame) this.GuideParentNode.active = true;
        SdkManager.Instance.showNativeBanner();
        SdkManager.Instance.showNativeInterstitial(true, 1);
    }

    private StopGame() {
        this.unscheduleAllCallbacks();
        this.gameFlag = false;
        App.Facade.popView(SuccessPanelMediator, SuccessPanel, '游戏结束界面', false);
        Order.instance.StopGame();
        plate.instance.StopGame();
    }

    /**订单超时后让顾客离开，并在营业时间内接待下一位顾客。*/
    public OnOrderExpired() {
        if (!this.gameFlag || this.currentTotalTime <= 0) {
            this.StopGame();
            return;
        }
        this.HuoDisppear();
        player.instance.CustomerEndAct();
        plate.instance.DisAppear();
        this.scheduleOnce(() => {
            if (!this.gameFlag) return;
            this.foodIngreCount = 0;
            this.hasYinliaoArr = [];
            this.hasZhushiArr = [];
            this.zhushiIndex = -1;
            this.RandomFood();
            Order.instance.StartCook();
            player.instance.AllBack();
            player.instance.NewCustomer();
        }, this.CompleteTime);
    }
    public backMain() {
        this.node.active = false;
        player.instance.backInit();
        player.instance.CustomerEndAct();
        App.DataManager.SetPass('wanyouxi');
        StartScene.instance.node.active = true;
    }


    // 继续游戏
    public ContinueGame() {
        this.gameFlag = true;
        Order.instance.cookFlag = true;
    }

    public ClickPauseGame() {
        App.Facade.popView(PausePanelMediator, PausePanel, '暂停界面', false);
        this.gameFlag = false;
        Order.instance.cookFlag = false;
    }

    /**点击打开饮料说明 */
    public ClickOpenMessage() {
        this.messageNode.active = true;
    }
    /**点击关闭饮料说明 */
    public ClickCloseMessage() {
        this.messageNode.active = false;
    }

    /**返回主页 */
    public BackStart() {
        this.node.active = false;
        StartScene.instance.node.active = true;
    }

    update(dt) {
        if (!this.gameFlag) return;
        this.currentTotalTime -= dt;
        this.totalTimeProgress.progress = this.currentTotalTime / App.DataManager.TotalOpeningTime;
        let showTimes = (this.currentTotalTime <= 0) ? "暂停营业" : ((this.currentTotalTime).toFixed(0)).toString();
        this.totalTimeProgress.node.getChildByName('num').getComponent(cc.Label).string = showTimes;
        if (this.currentTotalTime <= 0) {
            this.gameFlag = false;
            if (!Order.instance.cookFlag) {
                console.log('游戏结束,弹出结算界面3333333333');
                this.StopGame();
            }
        }
    }

    /**初始化食物列表 */
    private InitFoodList() {
        let currentIngredients = App.DataManager.IngredientsList;
        this.InitIngredients(currentIngredients);
    }

    /**初始化食材列表 */
    private InitIngredients(list: any) {
        if (this.ingredientsParent.children.length > 0) {
            for (let name in list) {
                let names = (list[name].matchPath) ? list[name].matchPath : name;
                let ingredienet = this.ingredientsParent.getChildByName(names);
                ingredienet.getComponent(ChooseItem).setData(list[name])
            }
        } else {
            for (let name in list) {
                let ingredienet = cc.instantiate(this.ingredientsItem);
                ingredienet.name = (list[name].matchPath) ? list[name].matchPath : name;
                this.ingredientsParent.addChild(ingredienet);
                ingredienet.getComponent(ChooseItem).setData(list[name])
            }
        }
    }


    /**点击食材 */
    public ChooseIngredient(data: any, name: any) {
        if (!Order.instance.cookFlag) return;
        this.currentClickIngreName = name;
        let ingreType = App.DataManager.IngredientType;
        switch (data.type) {
            case ingreType.A: {//食物 
                this.zhushiIndex++;
                if (!this.hasZhushi || this.CurrentOrder.hanbao[this.zhushiIndex] != name) {
                    if (App.DataManager.firstEnterGame) { this.zhushiIndex--; return }
                    // console.log('错误****', this.hasZhushi, this.zhushiIndex, this.CurrentOrder.hanbao, name);
                    this.ClickError();
                    if (!this.hasZhushi) return;
                    if (this.hasZhushiArr.length == this.CurrentOrder.hanbao.length) return;
                    this.zhushiIndex = -1;
                    this.hasZhushiArr = [];
                    plate.instance.ResetZhushi();
                    Order.instance.InitPosition();
                    return;
                }
                this.hasZhushiArr.push(name);
                plate.instance.InitFood(data);
                Order.instance.ChooseFood(data, name);
                this.ClickCorrect();
                if (this.hasZhushiArr.length == this.CurrentOrder.hanbao.length) {
                    // console.log('主食完成~');
                    this.zhushiIndex = -1;
                    this.hasZhushi = false;
                }
            }; break;
            case ingreType.B: {//饮料 
                /**茶底优先 */
                if (this.CurrentOrder.chadi && this.hasChadi) { this.ResetYinliao(); return; }
                if (!this.CurrentOrder.bingsha || App.DataManager.currentBingshaArr.indexOf(name) == -1 || this.hasYinliaoArr.indexOf(name) != -1) {
                    if (this.hasYinliaoArr.length == App.DataManager.currentBingshaArr.length && !this.hasXueding) {
                        this.ClickError(); return;
                    }
                    this.ResetYinliao();
                    return;
                }
                this.ClickCorrect();
                this.hasYinliaoArr.push(name);
                plate.instance.ChangeDrinkColor(this.hasYinliaoArr);//data
                if (this.hasYinliaoArr.length == App.DataManager.currentBingshaArr.length) {
                    this.hasYinliao = false;
                    if (!this.hasXueding) Order.instance.CompeleteYinliao();
                }
            }; break;
            case ingreType.C: {//雪顶 
                if (!this.hasXueding) {
                    if (!this.hasYinliao) { this.ClickError(); return; }
                    this.ResetYinliao();
                    return;
                }
                if (this.hasYinliao) { this.ClickError(); this.ResetYinliao(); return; }
                this.ClickCorrect();
                Order.instance.CompeleteYinliao();
                plate.instance.XuedingShow();
                this.hasXueding = false;
            }; break;
            case ingreType.D: {//茶底 
                if (!this.hasChadi) {
                    if (!this.hasYinliao) { this.ClickError(); return; }
                    this.ResetYinliao();
                    return;
                }
                this.ClickCorrect();
                plate.instance.ChadiShow();
                this.hasChadi = false;
            }; break;
            case ingreType.E: {//其他
                if (!this.CurrentOrder.kaiweicai || this.CurrentOrder.kaiweicai.indexOf(name) == -1) {
                    this.ClickError(); plate.instance.ResetQita();
                    return;
                }
                this.ClickCorrect();
                plate.instance.ChangeQita(data);
                Order.instance.CompeleteQita();
                this.hasQita = false;
            }; break;
        }
        if (!this.hasZhushi && !this.hasYinliao && !this.hasQita && !this.hasXueding && !this.hasChadi) {
            this.CompeleteOrder();
        }
    }

    private ClickError() {
        // if (App.DataManager.firstEnterGame) return;
        Order.instance.ErrorWarning();
        App.SoundManager.playEffect(SoundManager.clickcError);
        this.errorShicaiNum++;
        this.HuoDisppear();
    }

    public HuoDisppear() {
        this.countxiaofei = 0;
        player.instance.HideHuo();
        Order.instance.ShowCorrectCount(this.countxiaofei);
    }

    /**选择正确 */
    private ClickCorrect() {
        if (App.DataManager.firstEnterGame) this.GuideParentNode.getComponent(Guide).NextStep();
        player.instance.ClickCorrect();
        this.shicaiNum++;
        this.countxiaofei++;
        if (this.countxiaofei >= App.DataManager.xiaofeiMax) {
            this.xiaofeiNum++;
            this.perGetXiaofei++;
            player.instance.ShowHuo();
            this.ShowClickEffect();
        }
        Order.instance.ShowCorrectCount(this.countxiaofei);
    }

    private ShowClickEffect() {
        let childs = this.ingredientsParent.getChildByName(this.currentClickIngreName);
        const pos1 = childs.parent.getComponent(UITransform).convertToWorldSpaceAR(childs.position);
        const newVec2 = this.ingredientsParent.parent.getComponent(UITransform).convertToNodeSpaceAR(pos1);
        this.dianjiDragon.position = new cc.Vec3(newVec2.x, newVec2.y, 0);
        this.dianjiDragon.getComponent(dragonBones.ArmatureDisplay).playAnimation('xingxing', 1);
    }

    /**
     * 完成一个订单
     */
    private CompeleteOrder() {
        console.log('订单完成~', this.CurrentOrder);
        this.CalculateTotal();
        player.instance.AllCompelet();
        App.SoundManager.playEffect(SoundManager.perComplete);
        this.perGetXiaofei = 0;
        this.foodIngreCount = 0;
        this.coinLabel.string = this.totalNum.toString();
        for (let data in this.CurrentOrder) {
            (data == 'bingsha') ? App.DataManager.SetPass(this.CurrentOrder[data]) : App.DataManager.SetPass(data);
        }
        this.hasYinliaoArr = [];
        this.zhushiIndex = -1;
        this.hasZhushiArr = [];
        App.DataManager.SetPass('guke');
        if (!game.instance.gameFlag) {
            console.log('游戏结束,弹出结算界面111111111111111');
            Order.instance.cookFlag = false;
            game.instance.StopGame();
            return;
        }
        this.scheduleOnce(() => {
            if (!this.gameFlag) return;
            App.SoundManager.playHuanYingEffect();
            plate.instance.DisAppear();
            this.RandomFood();
            Order.instance.StartCook();
            player.instance.AllBack();
            player.instance.NewCustomer();
        }, this.CompleteTime);
    }

    private ResetYinliao() {
        this.ClickError();
        this.hasYinliaoArr = [];
        plate.instance.ResetYinliao();
        this.hasXueding = (this.CurrentOrder.dingcengpeiliao) ? true : false;
        this.hasChadi = (this.CurrentOrder.chadi) ? true : false;
    }

    /**随机食物 完成后再次随机食物 */
    private RandomFood() {
        let orderArray = App.DataManager.FoodList;
        let randomIndex = App.DataManager.RandomNum(orderArray.length - 1);
        this.CurrentOrder = (App.DataManager.firstEnterGame) ? App.DataManager.GuideFood : orderArray[randomIndex];
        this.hasZhushi = (this.CurrentOrder.hanbao) ? true : false;
        this.hasYinliao = (this.CurrentOrder.bingsha) ? true : false;
        this.hasQita = (this.CurrentOrder.kaiweicai) ? true : false;
        this.hasXueding = (this.CurrentOrder.dingcengpeiliao) ? true : false;
        this.hasChadi = (this.CurrentOrder.chadi) ? true : false;
        App.DataManager.currentBingshaArr = (App.DataManager.yinliaohunhe.hasOwnProperty(this.CurrentOrder.bingsha)) ?
            App.DataManager.yinliaohunhe[this.CurrentOrder.bingsha] : [this.CurrentOrder.bingsha];//true为混合饮料
        this.FoodIngredientCal();
    }

    private FoodIngredientCal() {
        if (this.hasYinliao) this.foodIngreCount = App.DataManager.currentBingshaArr.length;
        if (this.CurrentOrder.hanbao) this.foodIngreCount += this.CurrentOrder.hanbao.length;
        if (this.hasXueding) this.foodIngreCount += 1;
        if (this.hasChadi) this.foodIngreCount += 1;
        if (this.hasQita) this.foodIngreCount += 1;
    }

    private CalculateTotal() {
        let add = (App.DataManager.OtherData.coinUpLevel == 0) ? 0 : App.DataManager.UpgradeList.coinUp[App.DataManager.OtherData.coinUpLevel - 1].value;
        let perAddCoin = this.foodIngreCount + Math.ceil(this.foodIngreCount * add * 0.01);
        let perAddXiaofei = this.perGetXiaofei + Math.ceil(this.perGetXiaofei * add * 0.01);
        this.getXiaofeiCount += perAddXiaofei;
        this.getCoinNum += perAddCoin;
        this.perCoinNum = perAddCoin + perAddXiaofei;
        this.totalNum += this.perCoinNum;
        // console.log('营业总额  this.getXiaofeiCount ', this.getXiaofeiCount, ' this.getCoinNum', this.getCoinNum);
    }

    onDisable() {
        // this.zantingBtn.off(cc.Node.EventType.TOUCH_END, this.ClickPauseGame, this);
    }
}
