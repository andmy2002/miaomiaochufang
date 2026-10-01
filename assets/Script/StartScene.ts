import * as cc from "cc";
import { BaseView } from "../lightMVC/core/base/BaseView";
import NotificationManager from "../lightMVC/core/manager/NotificationManager";
import SdkManager from "../resources/sdk/script/SdkManager";
import bgControl from "./bgControl";
import game from "./game";
import { App } from "./Manager/App";
import { SoundManager } from "./Manager/SoundManager";
import StartSceneModel from "./model/StartSceneModel";
import GetEffect from "./prop/GetEffect";
import StartSceneMediator from "./StartSceneMediator";
import TimeControl from "./TimeControl";
import AchievePanel from "./view/achievePanel/AchievePanel";
import AchievePanelMediator from "./view/achievePanel/AchievePanelMediator";
import AddPanel from "./view/addCoinPanel/AddPanel";
import AddPanelMediator from "./view/addCoinPanel/AddPanelMediator";
import MissionPanel from "./view/missionPanel/MissionPanel";
import MissionPanelMediator from "./view/missionPanel/MissionPanelMediator";
import RolePanel from "./view/rolePanel/RolePanel";
import RolePanelMediator from "./view/rolePanel/RolePanelMediator";
import SetNormalPanel from "./view/setNormal/SetNormalPanel";
import SetNormalPanelMediator from "./view/setNormal/SetNormalPanelMediator";
import UpgradePanel from "./view/upgradePanel/UpgradePanel";
import UpgradePanelMediator from "./view/upgradePanel/UpgradePanelMediator";

import { _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export default class StartScene extends BaseView {

    public static _instance;
    /**开始按钮 */
    @property(cc.Node)
    public startGameBtn: cc.Node = null;
    /**设置按钮 */
    @property(cc.Node)
    public setNormalBtn: cc.Node = null;
    // /**视频加金币按钮 */
    // @property(cc.Node)
    // public addCoin: cc.Node = null;

    /**视频加金币按钮 */
    @property(cc.Node)
    public addCoin2: cc.Node = null;
    /**视频加钻石按钮 */
    @property(cc.Node)
    public addDiamand: cc.Node = null;
    /**选择按钮父级 */
    @property(cc.Node)
    public chooseParent: cc.Node = null;
    /**当前选择文本 */
    @property(cc.Label)
    public chooseLabel: cc.Label = null;

    /**选择角色按钮 */
    @property(cc.Node)
    public roleBtn: cc.Node = null;
    /**任务按钮 */
    @property(cc.Node)
    public missionBtn: cc.Node = null;
    /**升级按钮 */
    @property(cc.Node)
    public upgradeBtn: cc.Node = null;
    /**成就按钮 */
    @property(cc.Node)
    public acheievementBtn: cc.Node = null;
    /**钻石 */
    @property(cc.Label)
    public diomandLabel: cc.Label = null;
    /**金币 */
    @property(cc.Label)
    public coinLabel: cc.Label = null;
    @property(cc.Node)
    public dibuBg: cc.Node = null;

    public static get instance() {
        return StartScene._instance;
    }
    public static set instance(value) {
        StartScene._instance = value;
    }
    onLoad() {
        StartScene.instance = this;
        // 保持大厅可作为 Creator 3.x 的独立预览入口。加载场景也会调用
        // 这些初始化方法；DataManager 已做幂等保护，不会重复注册事件。
        App.Facade.init(false, cc.size(720, 1280), true, false);
        App.startUp();
        App.DataManager.init();
        // 3.x 编辑器可以直接预览当前场景。旧项目只在 LoadScene 中注册
        // 这个模型，直接预览大厅时会导致未读提示访问到 undefined。
        if (!App.Facade.getModel(StartSceneModel)) {
            App.Facade.registerModel(StartSceneModel);
        }
        this.registerMediator(StartSceneMediator, this, "主界面");
        // SdkManager.Instance.showNativeBanner();
        // SdkManager.Instance.showNativeInterstitial(false);
        if (App.DataManager.firstEnterGame)
            this.scheduleOnce(() => { this.ClickStartGame(); }, 0);
    }
    onEnable() {
        this.ClickChooseRole();
        bgControl.instance.ShowArrow();
        App.SoundManager.playBGM(SoundManager.hallBgm);
        App.DataManager.ShowMissionTi();
        App.DataManager.ShowAchieveTi();
        SdkManager.Instance.showNativeBanner();
        SdkManager.Instance.showNativeInterstitial();
        SdkManager.Instance.showShortcut(new cc.Vec2(286.811, 122.108));
    }

    start() {
        this.startGameBtn.on(cc.Node.EventType.TOUCH_END, this.ClickStartGame, this);
        this.setNormalBtn.on(cc.Node.EventType.TOUCH_END, this.ClickSetNormal, this);
        // this.addCoin.on(cc.Node.EventType.TOUCH_END, this.ClickAddCoin, this);
        this.addCoin2.on(cc.Node.EventType.TOUCH_END, this.ClickShowAddCoin, this);
        this.addDiamand.on(cc.Node.EventType.TOUCH_END, this.ClickShowAddDia, this);

        this.roleBtn.on(cc.Node.EventType.TOUCH_END, this.ClickChooseRole, this);
        this.missionBtn.on(cc.Node.EventType.TOUCH_END, this.ClickMission, this);
        this.upgradeBtn.on(cc.Node.EventType.TOUCH_END, this.ClickUpgrade, this);

        this.acheievementBtn.on(cc.Node.EventType.TOUCH_END, this.ClickAchieve, this);
        this.UpdateCoinLabel();
        this.UpdateDiamandLabel();
    }

    private ClickShowAddCoin() {
        let data = { type: 'yingbi', clickType: 'qita' }
        App.Facade.popView(AddPanelMediator, AddPanel, data, false);
    }
    private ClickShowAddDia() {
        let data = { type: 'zuanshi', clickType: 'qita' }
        App.Facade.popView(AddPanelMediator, AddPanel, data, false);
    }

    public ShowMissionTishi(flag: boolean) {
        const reminder = StartScene.instance?.missionBtn?.getChildByName('tishi');
        if (reminder) {
            reminder.active = flag;
        }
        console.log('HasMissionUnreceive00000000000000********', flag);
    }

    public ShowAchieveTishi(flag: boolean) {
        const reminder = StartScene.instance?.acheievementBtn?.getChildByName('tishi');
        if (reminder) {
            reminder.active = flag;
        }
    }
    public UpdateCoinLabel() {
        StartScene.instance.coinLabel.string = App.DataManager.UserData.jinbi.toString();
    }

    public UpdateDiamandLabel() {
        console.log('zuanshi:', App.DataManager.UserData.zuanshi)
        StartScene.instance.diomandLabel.string = App.DataManager.UserData.zuanshi.toString();
    }
    /**清除按钮选择 */
    private ClearChoose() {
        this.closeAllPopView();
        this.chooseParent.children.forEach((childs) => {
            childs.getChildByName('choose').active = false;
        })
    }

    /**打开角色选择界面 */
    private ClickChooseRole() {
        let hasSelect = this.roleBtn.getChildByName('choose').active;
        if (hasSelect) return;
        this.ClearChoose();
        this.roleBtn.getChildByName('choose').active = true;
        this.chooseLabel.string = '角色';
        App.Facade.popView(RolePanelMediator, RolePanel, '角色选择', false);
    }

    /**打开任务选择界面 */
    private ClickMission() {
        let hasSelect = this.missionBtn.getChildByName('choose').active;
        if (hasSelect) return;
        this.ClearChoose();
        this.missionBtn.getChildByName('choose').active = true;
        this.chooseLabel.string = '任务';
        App.Facade.popView(MissionPanelMediator, MissionPanel, '任务界面', false);
    }

    private ClickAchieve() {
        let hasSelect = this.acheievementBtn.getChildByName('choose').active;
        if (hasSelect) return;
        this.ClearChoose();
        this.acheievementBtn.getChildByName('choose').active = true;
        this.chooseLabel.string = '成就';
        App.Facade.popView(AchievePanelMediator, AchievePanel, '成就界面', false);
    }

    private ClickUpgrade() {
        let hasSelect = this.upgradeBtn.getChildByName('choose').active;
        if (hasSelect) return;
        this.ClearChoose();
        this.upgradeBtn.getChildByName('choose').active = true;
        this.chooseLabel.string = '升级';
        App.Facade.popView(UpgradePanelMediator, UpgradePanel, '升级界面', false);
    }
    /**
     * 点击开始游戏按钮直接开始
     */
    private ClickStartGame() {
        console.log('点击开始游戏');
        bgControl.instance.HideArrow();
        game.instance.StartGame();
        this.closeAllPopView();
        this.ClearChoose();
        this.node.active = false;
    }

    // /**
    //  * 点击观看视频加金币
    //  */
    // private ClickAddCoin() {
    //     console.log('点击观看视频加金币~');

    //     App.SoundManager.VideoStartStop();
    //     let go = () => {

    //         App.DataManager.UpdateCoin(App.DataManager.VideoAddCoin);

    //         GetEffect.instance.createTargets(this.addCoin, this.coinLabel.node.parent, 'jinbi', App.DataManager.VideoAddCoin);
    //         App.SoundManager.VideoEndOpen();
    //     }
    //     SdkManager.Instance.showRewardVideo(go, () => {
    //         App.SoundManager.VideoEndOpen();
    //         SdkManager.Instance.showToast("暂无广告");
    //     }, () => {
    //         App.SoundManager.VideoEndOpen();
    //         SdkManager.Instance.showToast("暂无广告");
    //     });

    // }


    /**
     * 打开设置界面
     */
    private ClickSetNormal() {
        App.Facade.popView(SetNormalPanelMediator, SetNormalPanel, "设置", false);
    }

    onDisable() {
        // this.startGameBtn.off(cc.Node.EventType.TOUCH_END, this.ClickStartGame, this);
        // this.setNormalBtn.off(cc.Node.EventType.TOUCH_END, this.ClickSetNormal, this);
        // this.addCoin.off(cc.Node.EventType.TOUCH_END, this.ClickAddCoin, this);
    }

    // update (dt) {}
}
