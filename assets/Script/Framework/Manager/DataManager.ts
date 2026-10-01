import * as cc from "cc";

import { Singleton } from "../Utils/Singleton";
import { ETaskID } from "../Const/EnumDefine";
import { App } from "../../Manager/App";
import { DateUtil } from "../Utils/DateUtil";
import StartSceneModel from "../../model/StartSceneModel";
import MissionPanelMediator from "../../view/missionPanel/MissionPanelMediator";
import MissionPanel from "../../view/missionPanel/MissionPanel";
import StartScene from "../../StartScene";
import AchievePanelMediator from "../../view/achievePanel/AchievePanelMediator";
import AchievePanel from "../../view/achievePanel/AchievePanel";
/**
 * 数据管理器
 */
export class DataManager extends Singleton {

    /**看视频得金币数*/
    public VideoAddCoin: number = 1000;
    /**看视频得钻石数*/
    public VideoAddDiamand: number = 10;

    /**重置任务需要钻石数 */
    public ResetMissionDiamand: number = 0;

    public ResetMissionTime: number = 600;

    /**倒计时标志*/
    public TimeFlag: boolean = false;

    public HasLoadingTexture: any = {};

    /**开店总时长 */
    public OriginOpenTime: number = 60;
    public TotalOpeningTime: number = 0;// 20;

    /**每道菜的时长 */
    public CookingTime: number = 10;
    /**每道菜当前已使用时长 */
    public currentCookTime: number = 0;
    /**每道菜的超时时长 */
    public CookingOverTime: number = 4;
    /**每道菜的超时时长2 */
    public CookingOverTime2: number = 2;
    //小费开始个数，超出的个数加小费
    public xiaofeiMax: number = 15;

    /**每局游戏获得钻石的初始概率 */
    public originDiamandPercent = 0.05;
    /**每局游戏获得钻石的概率 */
    public getDiamandPercent = 0;
    
    public roleBuyCount: any = [250, 500, 1000, 1500, 1700, 2000, 2500, 3000, 3500, 3700];

    public missionOpenFlag: boolean = false;
    public achieveOpenFlag: boolean = false;
    public openCountAwarad: number = 10;

    public firstEnterGame: boolean = false;
    /** 防止从加载场景和大厅场景重复进入时重复注册生命周期事件。 */
    private initialized: boolean = false;

    public GuideFood: any = { "hanbao": ["mianbaoxia", "jiaceng2", "mianbaoshang"] };

    public UpgradeList: any = {
        timeUp: [
            { cost: 500, value: 2 },
            { cost: 1000, value: 4 },
            { cost: 1500, value: 6 },
            { cost: 2000, value: 8 },
            { cost: 2500, value: 10 },
            { cost: 3000, value: 12 },
            { cost: 3500, value: 14 },
            { cost: 4000, value: 16 },
            { cost: 5000, value: 18 },
            { cost: 6000, value: 20 },
            { cost: 7000, value: 22 },
            { cost: 8000, value: 24 },
            { cost: 9000, value: 26 },
            { cost: 10000, value: 28 },
            { cost: 20000, value: 30 },
        ],
        coinUp: [
            { cost: 1000, value: 5 },
            { cost: 1500, value: 10 },
            { cost: 2000, value: 15 },
            { cost: 2500, value: 20 },
            { cost: 3000, value: 25 },
            { cost: 3500, value: 30 },
            { cost: 4000, value: 35 },
            { cost: 4500, value: 40 },
            { cost: 5000, value: 45 },
            { cost: 10000, value: 50 },
            { cost: 15000, value: 60 },
            { cost: 20000, value: 70 },
            { cost: 25000, value: 80 },
            { cost: 50000, value: 90 },
            { cost: 75000, value: 100 },
        ],
        diamondUp: [
            { cost: 2500, value: 1 },
            { cost: 5000, value: 1.5 },
            { cost: 10000, value: 2 },
            { cost: 15000, value: 2.5 },
            { cost: 20000, value: 3 },
            { cost: 25000, value: 3.5 },
            { cost: 30000, value: 4 },
            { cost: 40000, value: 4.5 },
            { cost: 50000, value: 5 },
            { cost: 75000, value: 6 },
        ]
    }

    public UserData: any = {
        jinbi: 0,
        zuanshi: 0,
        currChef: 'A',
        chefList: ['A'],
        currRole: '1',
        roleList: ['1'],
        openCount: 0,
    }
    public OtherData: any = {
        /**当前任务列表，完成后再次随机任务（固定三个） */
        currMission: {},// { },
        /**已完成当前任务 */
        hasMission: {},
        /**是否领取大任务礼包 */
        hasGetBigMission: false,
        /**已完成成就部份 */
        hasAchieve: {},
        timeUpLevel: 0,
        coinUpLevel: 0,
        diamondUpLevel: 0,
        /**钻石重置任务次数 */
        resetMissionCount: 0,
        missionCountTime: 0,
        missionTimeStamp: 0,
    }
    public BgCost: any = {
        B: { cost: 15, type: 'zuanshi' },
        C: { cost: 25, type: 'zuanshi' },
        D: { cost: 40, type: 'zuanshi' }
    }

    public TotalTimeCal() {
        let addTime = (this.OtherData.timeUpLevel == 0) ? 0 : this.UpgradeList.timeUp[this.OtherData.timeUpLevel - 1].value;
        this.TotalOpeningTime = this.OriginOpenTime + addTime;
        console.log(' this.TotalOpeningTime ', this.TotalOpeningTime, typeof (this.TotalOpeningTime))
    }

    /**游戏完成后是否获得钻石 */
    public HasGetDiamand() {
        let percent = (this.OtherData.diamondUpLevel == 0) ? this.originDiamandPercent : this.UpgradeList.timeUp[this.OtherData.diamondUpLevel - 1].value;
        let roundValue = percent * 10000;
        let randomValue = this.RandomNum(10000);
        let getDiamandFlags = (randomValue <= roundValue) ? true : false;
        // console.log('游戏完成后是否获得钻石:', roundValue, randomValue, getDiamandFlags);
        return getDiamandFlags;
    }

    public IngredientType: any = {
        A: "shiwu",
        B: "yinliao",
        C: "xueding",
        D: "chadi",
        E: "qita"
    };

    private RolePartName: any = ['shenti', 'shou', 'shou_dong', 'yan', 'yan_huo', 'zhayan', 'zuiba', 'kaixinzui'];
    private CustomerPartName: any = ['shenti', 'shou', 'bizui', 'yan', 'zhayan', 'zui'];
    public CustomerTypes: number = 6;//顾客种类

    /**已加载角色图片组*/
    public TextureList: any = [];
    /**已加载顾客图片组*/
    public CustomsTextureList: any = [];

    /**已加载背景图片组 */
    public BgTextureList: any = [];

    /**厨师对应食材列表 */
    public IngredientsList: any = {
        'mianbaoshang': {
            type: this.IngredientType.A,
            path: 'mianbaoshang',
            offset: 25,
            ang: 30
        },
        "jiaceng6":
        {
            type: this.IngredientType.A,
            path: 'jiaceng6',
            offset: 13,
            ang: 30
        },
        "jiaceng3":
        {
            type: this.IngredientType.A,
            path: 'jiaceng3',
            offset: 15,
            ang: 30
        },
        "kaiweicai3":
        {
            type: this.IngredientType.E,
            path: 'kaiweicai3'
        },
        "dingcengpeiliao":
        {
            type: this.IngredientType.C,
            path: 'dingcengpeiliao'
        },
        "hong":
        {
            type: this.IngredientType.B,
            path: 'hong',
            matchPath: 'hongbingsha',
            scale: 1
        },
        "jiaceng2":
        {
            type: this.IngredientType.A,
            path: 'jiaceng2',
            offset: 16,
            ang: 30
        },
        "jiaceng7":
        {
            type: this.IngredientType.A,
            path: 'jiaceng7',
            offset: 8,
            ang: 30
        },
        "jiaceng1":
        {
            type: this.IngredientType.A,
            path: 'jiaceng1',
            offset: 13,
            ang: 30
        },
        "kaiweicai1":
        {
            type: this.IngredientType.E,
            path: 'kaiweicai1'
        },
        "niunai":
        {
            type: this.IngredientType.B,
            path: 'niunai',
            matchPath: 'niunaibingsha',
            scale: 1
        },
        "huang":
        {
            type: this.IngredientType.B,
            path: 'huang',
            matchPath: 'huangbingsha',
            scale: 1
        },
        "mianbaoxia":
        {
            type: this.IngredientType.A,
            path: 'mianbaoxia',
            ang: 30
        },
        "jiaceng5":
        {
            type: this.IngredientType.A,
            path: 'jiaceng5',
            offset: 10,
            ang: 30
        },
        "jiaceng4":
        {
            type: this.IngredientType.A,
            path: 'jiaceng4',
            offset: 10,
            ang: 30
        },
        "kaiweicai2":
        {
            type: this.IngredientType.E,
            path: 'kaiweicai2',
        },
        "chadi":
        {
            type: this.IngredientType.D,
            path: 'chadi',
            scale: 1
        },
        "lan":
        {
            type: this.IngredientType.B,
            path: 'lan',
            matchPath: 'lanbingsha',
            scale: 1
        }
    };


    public CalculateResetDiamand(): number {
        let counts = this.OtherData.resetMissionCount * 2;
        return counts
    }

    /** 导入配置文件 */
    public loadConfigs(cb: Function) {
        this.FoodList = [];
        let url = "configs/food"
        let self = this;
        cc.resources.loadDir(url, cc.JsonAsset, function (err, res: cc.JsonAsset[]) {
            self.FoodList = res[0].json;
            console.log("食物配置文件解析完成", self.FoodList);
            cb && cb();
        })
    }
    /**食物对应食材组 */
    public FoodList: any = [];

    public BingShaList: any = ['chengbingsha', 'fenbingsha', 'hongbingsha',
        'huangbingsha', 'lanbingsha', 'lvbingsha', 'niunaibingsha', 'qianchengbingsha'
        , 'qianhuangbingsha', 'qianlanbingsha', 'qianlvbingsha', 'qianzibingsha',
        'tangjiangbingsha', 'zibingsha', 'zongbingsha'];

    public currentBingshaArr: any = [];

    /**饮料混合方式 */
    public yinliaohunhe: any = {
        "lvbingsha": ['huangbingsha', 'lanbingsha'],
        "zibingsha": ['hongbingsha', 'lanbingsha'],
        "chengbingsha": ['hongbingsha', 'huangbingsha'],
        "tangjiangbingsha": ['hongbingsha', 'huangbingsha', 'lanbingsha'],
        "qianchengbingsha": ['hongbingsha', 'huangbingsha', 'niunaibingsha'],
        "qianhuangbingsha": ['huangbingsha', 'niunaibingsha'],
        "qianlanbingsha": ['lanbingsha', 'niunaibingsha'],
        "qianlvbingsha": ['huangbingsha', 'lanbingsha', 'niunaibingsha'],
        "qianzibingsha": ['hongbingsha', 'lanbingsha', 'niunaibingsha'],
        "zongbingsha": ['hongbingsha', 'huangbingsha', 'lanbingsha', 'niunaibingsha'],
        "fenbingsha": ['hongbingsha', 'niunaibingsha'],
    }

    /**显示成就列表 */
    public showAchieveList: any = {};

    /**成就列表 */
    public AchievementList: any = {
        'jinbi': { 'desc': '获得25000个硬币', 'count': 25000, 'Get': 1, 'awardType': 'zuanshi' },
        'zuanshi': { 'desc': '获得50个钻石', 'count': 50, 'Get': 1, 'awardType': 'zuanshi' },
        'hanbao': { 'desc': '制作50个汉堡', 'count': 50, 'Get': 1, 'awardType': 'zuanshi' },
        'bingsha': { 'desc': '供应50份冰沙', 'count': 50, 'Get': 1, 'awardType': 'zuanshi' },
        'kaiweicai': { 'desc': '供应50份开胃菜', 'count': 50, 'Get': 1, 'awardType': 'zuanshi' },
        'hongbingsha': { 'desc': '供应10份红色冰沙', 'count': 10, 'Get': 1, 'awardType': 'zuanshi' },
        'huangbingsha': { 'desc': '供应10份黄色冰沙', 'count': 10, 'Get': 1, 'awardType': 'zuanshi' },
        'lanbingsha': { 'desc': '供应10份蓝色冰沙', 'count': 10, 'Get': 1, 'awardType': 'zuanshi' },
        'niunaibingsha': { 'desc': '供应10份牛奶冰沙', 'count': 10, 'Get': 1, 'awardType': 'zuanshi' },
        'chengbingsha': { 'desc': '供应10份橙色冰沙', 'count': 10, 'Get': 1, 'awardType': 'zuanshi' },
        'lvbingsha': { 'desc': '供应10份绿色冰沙', 'count': 10, 'Get': 1, 'awardType': 'zuanshi' },
        'zibingsha': { 'desc': '供应10份紫色冰沙', 'count': 10, 'Get': 1, 'awardType': 'zuanshi' },
        'zongbingsha': { 'desc': '供应10份棕色冰沙', 'count': 10, 'Get': 1, 'awardType': 'zuanshi' },
        'fenbingsha': { 'desc': '供应10份粉色冰沙', 'count': 10, 'Get': 1, 'awardType': 'zuanshi' },
        // 'danhuangbingsha': { 'desc': '供应10份淡黄色冰沙', 'count': 10, 'Get': 1, 'awardType': 'zuanshi' },
        'qianlanbingsha': { 'desc': '供应10份浅蓝色冰沙', 'count': 10, 'Get': 1, 'awardType': 'zuanshi' },
        'qianchengbingsha': { 'desc': '供应10份浅橙色冰沙', 'count': 10, 'Get': 1, 'awardType': 'zuanshi' },
        'qianlvbingsha': { 'desc': '供应10份浅绿色冰沙', 'count': 10, 'Get': 1, 'awardType': 'zuanshi' },
        'qianzibingsha': { 'desc': '供应10份淡紫色冰沙', 'count': 10, 'Get': 1, 'awardType': 'zuanshi' },
        'qianhebingsha': { 'desc': '供应10份浅褐色冰沙', 'count': 10, 'Get': 1, 'awardType': 'zuanshi' },
        'tangjiangbingsha': { 'desc': '供应10份糖浆冰沙', 'count': 10, 'Get': 1, 'awardType': 'zuanshi' },
        'dingcengpeiliao': { 'desc': '供应10份顶层配料冰沙', 'count': 10, 'Get': 1, 'awardType': 'zuanshi' },
        'canting': { 'desc': '解锁1个餐厅', 'count': 1, 'Get': 1, 'awardType': 'zuanshi' },
        'guke': { 'desc': '招待100个顾客', 'count': 100, 'Get': 1, 'awardType': 'zuanshi' },
        'juese': { 'desc': '解锁1个角色', 'count': 1, 'Get': 1, 'awardType': 'zuanshi' },
        'wanyouxi': { 'desc': '玩100次', 'count': 100, 'Get': 1, 'awardType': 'zuanshi' }
    };

    public CurrentMissionList: any = [];
    public hasMissionList: any = {};

    /**成就列表 */
    public MissionList: any = {
        'hanbao': { 'desc': '制作15个汉堡', "type": 'hanbao', 'count': 15, 'Get': 50, 'awardType': 'jinbi' },
        'lanbingsha': { 'desc': '供应10个蓝色冰沙', "type": 'lanbingsha', 'count': 10, 'Get': 20, 'awardType': 'jinbi' },
        'jinbi': { 'desc': '获得250个硬币小费', "type": 'jinbi', 'count': 250, 'Get': 50, 'awardType': 'jinbi' },
        'bingsha': { 'desc': '提供15份冰沙', "type": 'bingsha', 'count': 15, 'Get': 20, 'awardType': 'jinbi' },
        'hongbingsha': { 'desc': '提供10份红色冰沙', "type": 'hongbingsha', 'count': 10, 'Get': 20, 'awardType': 'jinbi' },
        'wanyouxi': { 'desc': '玩3次', "type": 'wanyouxi', 'count': 3, 'Get': 100, 'awardType': 'jinbi' },
        'guke': { 'desc': '招待25个顾客', "type": 'guke', 'count': 25, 'Get': 100, 'awardType': 'jinbi' },
        'kaiweicai': { 'desc': '提供15份开胃菜', "type": 'kaiweicai', 'count': 15, 'Get': 20, 'awardType': 'jinbi' },
        'tangjiangbingsha': { 'desc': '供应10份糖浆冰沙', "type": 'tangjiangbingsha', 'count': 10, 'Get': 20, 'awardType': 'jinbi' },
        'dingcengpeiliao': { 'desc': '提供10份顶层配料冰沙', "type": 'dingcengpeiliao', 'count': 10, 'Get': 20, 'awardType': 'jinbi' }
    };

    private missionCount: number = 3;
    /**随机任务列表（每十份钟刷新一次） */
    public RandomMission() {
        if (Object.keys(this.OtherData.currMission).length >= this.missionCount) return;
        let tempList = Object.assign({}, this.MissionList);
        for (let i = 0; i < this.missionCount; i++) {
            let length = Object.keys(tempList).length;
            let randomIndex = App.DataManager.RandomNum(length - 1);
            let key = Object.keys(tempList)[randomIndex];
            this.OtherData.currMission[key] = { 'count': tempList[key].count };// tempList[key];
            delete tempList[key];
        }
        for (let temp in this.OtherData.currMission) {
            this.OtherData.hasMission[temp] = { 'count': 0, getFlag: false };
        }
        console.log('随机任务列表:', this.OtherData.currMission, this.OtherData.hasMission);
        this.UpdateOtherData();
    }

    public RandomNum(maxNum: number, minNum: number = 0): number {
        let index = Math.round(Math.random() * (maxNum - minNum)) + minNum;
        return index;
    }


    /**是否有任务奖励未领取 */
    private HasMissionUnreceive() {
        if (!this.OtherData?.currMission || !this.OtherData?.hasMission) {
            return false;
        }
        let flag = false;
        let xiaorenwu = true;
        for (let key in this.OtherData.hasMission) {
            const mission = this.OtherData.currMission[key];
            const progress = this.OtherData.hasMission[key];
            if (!mission || !progress) {
                continue;
            }
            let targetNum = mission.count;
            let currNum = progress.count;
            if (currNum >= targetNum && !progress.getFlag) {
                flag = true;
                console.log('HasMissionUnreceive********key', key);
            } else {
                xiaorenwu = false;
            }
        }
        if (!flag && !this.OtherData.hasGetBigMission && xiaorenwu) flag = true;
        console.log('HasMissionUnreceive222222222222********', flag);
        return flag;
    }

    /**是否有成就奖励未领取 */
    private HasAchieveUnreceive() {
        if (!this.OtherData?.hasAchieve) {
            return false;
        }
        let flag = false;
        for (let key in this.AchievementList) {
            let targetNum = this.AchievementList[key].count;
            const progress = this.OtherData.hasAchieve[key];
            if (progress && progress.count >= targetNum && !progress.hasGet) flag = true;
        }
        return flag;
    }

    /**设置完成任务和成就 */
    public SetPass(type: string, count: number = 1) {
        if (!this.AchievementList.hasOwnProperty(type)) return;
        if (type.indexOf('bingsha') != -1) this.UpdatePass('bingsha', count);
        this.UpdatePass(type, count);
        if (this.missionOpenFlag) {
            StartScene.instance.closeAllPopView();
            App.Facade.popView(MissionPanelMediator, MissionPanel, '更新任务界面', false);
        }

        if (this.achieveOpenFlag) {
            StartScene.instance.closeAllPopView();
            App.Facade.popView(AchievePanelMediator, AchievePanel, '更新成就界面', false);
        }
    }
    /**更新任务和成就 */
    public UpdatePass(type: string, count: number) {
        // console.log('updatePass**********', type, count);
        this.OtherData.hasAchieve[type].count += count;
        if (this.AchievementList[type].count == this.OtherData.hasAchieve[type].count) {
            console.log(this.AchievementList[type].desc + '********成就完成');
        }
        App.DataManager.ShowAchieveTi();
        this.UpdateMission(type, count);
        this.UpdateOtherData();
    }

    public UpdateMission(type: string, count: number) {
        if (!this.OtherData.hasMission.hasOwnProperty(type)) return;
        this.OtherData.hasMission[type].count += count;
        // console.log('UpdateMission::::::type', type);
        if (this.OtherData.currMission[type].count == this.OtherData.hasMission[type].count) {
            console.log(this.OtherData.currMission[type].desc + '********当前任务完成');
        }
        this.ShowMissionTi();
    }
    public ShowMissionTi() {
        if (this.HasMissionUnreceive()) {
            const model = App.Facade.getModel(StartSceneModel);
            model?.missionTishi();
        }
    }

    public ShowAchieveTi() {
        if (this.HasAchieveUnreceive()) {
            const model = App.Facade.getModel(StartSceneModel);
            model?.achieveTishi();
        }
    }
    public UpdateUserData() {
        App.LocalStorageUtil.setJsonObj(App.LocalStorageUtil.lst_userData, this.UserData);
    }
    public UpdateOtherData() {
        App.LocalStorageUtil.setJsonObj(App.LocalStorageUtil.lst_otherData, this.OtherData);
    }

    public arrayEqual(arr1: any, arr2: any) {
        if (arr1 === arr2) return true;
        if (arr1.length != arr2.length) return false;
        for (var i = 0; i < arr1.length; i++) {
            if (arr2.indexOf(arr1[i]) == -1) return false;
        }
        return true;
    }

    public UpdateDatas(type: string, count: number) {
        App.DataManager.UserData[type] += count;
        this.UpdateUserData();
    }

    public constructor() {
        super();
    }

    public init() {
        if (this.initialized) {
            return;
        }
        this.initialized = true;
        console.log("初始化用户数据");
        cc.game.on(cc.Game.EVENT_SHOW, () => {
            this.OnShow();
            console.log('进入游戏&&&&&&&&&&&&&&');
        });
        cc.game.on(cc.Game.EVENT_HIDE, () => {
            this.OnHide();
            console.log('退出游戏&&&&&&&&&&&&&&');
        });
        let userData = App.LocalStorageUtil.getJsonObj(App.LocalStorageUtil.lst_userData);
        if (!userData) {
            App.LocalStorageUtil.setJsonObj(App.LocalStorageUtil.lst_userData, this.UserData);
            this.firstEnterGame = true;
        }
        else this.UserData = userData;

        let otherData = App.LocalStorageUtil.getJsonObj(App.LocalStorageUtil.lst_otherData);
        if (!otherData) App.LocalStorageUtil.setJsonObj(App.LocalStorageUtil.lst_otherData, this.OtherData);
        else this.OtherData = otherData;
        this.initAchieve();
        App.DataManager.RandomMission();
        this.loadConfigs(null);
    }

    private initAchieve() {
        if (Object.keys(this.OtherData.hasAchieve).length >= Object.keys(this.AchievementList).length) return;
        for (let temp in this.AchievementList) {
            this.OtherData.hasAchieve[temp] = { 'count': 0, 'hasGet': false };
        }
        this.UpdateOtherData();
    }



    public GetTexture(name: string) {
        var self = this;
        return new Promise((resolve) => {
            if (self.HasLoadingTexture[name]) {
                resolve(self.HasLoadingTexture[name]);
            } else {
                const framePath = name.endsWith('/spriteFrame') ? name : `${name}/spriteFrame`;
                cc.resources.load(framePath, cc.SpriteFrame, function (err, spriteFrame) {
                    if (err) {
                        console.warn(`精灵帧加载失败: ${framePath}`, err);
                        resolve(null);
                    } else {
                        self.HasLoadingTexture[name] = spriteFrame;
                        resolve(spriteFrame);
                    }
                })
            }
        });
    }

    public UpdateCoin(num: number, cb: Function = null): void {
        if (num > 0) {
            this.SetPass('jinbi', num);
        }
        let shengyu = Number(this.UserData.jinbi) + num;
        if (shengyu < 0) {
            if (cb) cb(false);
            return;
        }
        if (cb) cb(true);
        this.UserData.jinbi = Number(shengyu);
        this.UpdateUserData();
        App.Facade.getModel(StartSceneModel).updateCoinNumber();

    }
    public UpdateDiamand(num: number, cb: Function = null): void {
        if (num > 0) this.SetPass('zuanshi', num);
        let shengyu = Number(this.UserData.zuanshi) + num;
        if (shengyu < 0) {
            cb && cb(false);
            return;
        }
        cb && cb(true);
        this.UserData.zuanshi = Number(shengyu);
        this.UpdateUserData();
        App.Facade.getModel(StartSceneModel).updateDiamandNumber();
    }
    private tempList = [];
    public LoadTextureList(fileName: string, cb: Function): void {
        if (this.TextureList[fileName]) {
            cb && cb(this.TextureList[fileName]);
            return;
        }
        this.tempList = [];
        for (let i = 0; i < this.RolePartName.length; i++) {
            this.LoadPieceTexture(this.RolePartName[i], fileName, cb)
        }
    }
    
    private LoadPieceTexture(path: string, fileName: string, cb: Function) {
        App.DataManager.GetTexture('texture/juese/' + fileName + '/' + path).then((res: any) => {
            this.tempList[path] = res;
            if (Object.keys(this.tempList).length == this.RolePartName.length) {
                // console.log('tempList', this.tempList)
                this.TextureList[fileName] = this.tempList;
                console.log('this.TextureList', this.TextureList);
                cb && cb(this.tempList);
            }
        });
    }

    private tempList2 = [];
    public LoadCustomsTextureList(fileName: string, cb: Function): void {
        if (this.CustomsTextureList[fileName]) {
            cb && cb(this.CustomsTextureList[fileName]);
            return;
        }
        this.tempList2 = [];
        for (let i = 0; i < this.CustomerPartName.length; i++) {
            this.LoadPieceTexture2(this.CustomerPartName[i], fileName, cb)
        }
    }
    private LoadPieceTexture2(path: string, fileName: string, cb: Function) {
        App.DataManager.GetTexture('texture/guke/' + fileName + '/' + path).then((res: any) => {
            this.tempList2[path] = res;
            if (Object.keys(this.tempList2).length == this.CustomerPartName.length) {
                // console.log('tempList', this.tempList)
                this.CustomsTextureList[fileName] = this.tempList2;
                cb && cb(this.tempList2);
            }
        });
    }

    public TimeChange(time: number): any {
        // var h = Math.floor(time / 3600) < 10 ? '0' + Math.floor(time / 3600) : Math.floor(time / 3600);
        var min = Math.floor((time / 60 % 60)) < 10 ? '0' + Math.floor((time / 60 % 60)) : Math.floor((time / 60 % 60));
        var sec = Math.floor((time % 60)) < 10 ? '0' + Math.floor((time % 60)) : Math.floor((time % 60));
        //return result = h + ":" + m + ":" + s;
        var returnValue = { minute: min, second: sec };
        return returnValue;
    }

    private OnShow() {
        App.SoundManager.VideoEndOpen();
    }

    private OnHide() {
        if (App.DataManager.OtherData.missionTimeStamp != 0) {
            var _currentTime = Date.parse(new Date().toString());
            App.DataManager.OtherData.missionTimeStamp = _currentTime;
            App.DataManager.UpdateOtherData();
        }
        App.SoundManager.VideoStartStop();
    }

    /**动画恢复 */
    public AnimationRecovery(animation: cc.Animation, name: string) {
        const state = animation.getState(name);
        if (!state) return;
        state.time = 0;
        state.sample();
    }
}
