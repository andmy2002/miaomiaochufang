import * as cc from "cc";

import { Singleton } from "../Utils/Singleton";
import { attr, consume, exp, fuli_day, task, fuli_watch, nick } from "../Config/ConfigConst";
import { NumberUtil } from "../Utils/NumberUtil";
import { App } from "../../Manager/App";
import { EConfigAttrProp, EAgeGroup } from "../Const/EnumDefine";

/**
 * 配置管理类
 */
export class ConfigDataMgr extends Singleton {

    private _config: any;

    constructor() {
        super();
    }

    private get attrs(): attr[] { return this._config["attr"] as attr[]; }
    private get consumes(): consume[] { return this._config["consume"] as consume[]; }
    private get exps(): exp[] { return this._config["exp"] as exp[]; }
    private get tasks(): task[] { return this._config["task"] as task[]; }
    private get fuli_days(): fuli_day[] { return this._config["fuli_day"] as fuli_day[]; }
    // private get fuli_times(): fuli_time[] { return this._config["fuli_time"] as fuli_time[]; }
    private get fuli_watchs(): fuli_watch[] { return this._config["fuli_watch"] as fuli_watch[]; }
    private get nicks(): nick[] { return this._config["nick"] as nick[]; }

    public set configs(res) {
        console.log("解析配置文件");
        if (!res) return;
        for (let i = 0; i < res.length; i++) {
            let arr = [];
            let json = res[i]["json"];
            for (let j = 0; j < json.length; j++) {
                arr.push(json[j]);
            }
            this._config[res[i].name] = arr;
        }
    }

    public get configs() {
        if (this._config)
            return this._config;
        else {
            console.log("config配置文件还未读取!!");
            return null;
        }
    }

    /** 导入配置文件 */
    public loadConfigs(cb: Function) {
        console.log("读取配置文件");
        this._config = {};
        let url = "configs"
        let self = this;
        cc.resources.loadDir(url, cc.Asset, function (err, res) {
            self.configs = res;
            console.log("配置文件解析完成");
            console.log(self.attrs);
            App.DataManager.init();
            cb();
        })
    }

    /** 随机生成昵称 */
    public getNick() {
        let range = this.nicks.length;
        return this.nicks[NumberUtil.getRandomInt(0, range)];
    }

    /** 获取消耗列表 */
    public getConsumeList(): consume[] {
        return this.consumes;
    }

    /** 获取任务列表 */
    public getTaskList(): task[] {
        return this.tasks;
    }

    /** 获取福利Day列表 */
    public getFuLiDayList(): fuli_day[] {
        return this.fuli_days;
    }

    /** 获取福利Watch列表 */
    public getFuLiWatchList(): fuli_watch[] {
        return this.fuli_watchs;
    }

    /** 获取指定狗的初始属性 */
    public getBeginingAttr(prop: EConfigAttrProp): attr {
        let result;
        for (let i = 0; i < this.attrs.length; i++) {
            let item = this.attrs[i];
            if (item.prop == EConfigAttrProp[prop]) {
                result = item;
                break;
            }
        }
        return result;
    }

    /** 获取年龄段 */
    public getAgeGroup(level: number): EAgeGroup {
        return level < 11 ? EAgeGroup.PERIOD_KIDS
            : level < 31 ? EAgeGroup.PERIOD_YOUNG : EAgeGroup.PERIOD_GROWNUP;
    }

    /** 获取指定狗的成长属性 */
    public getGrowingAttr(level: number): attr {
        let prop = level < 11 ? EConfigAttrProp.cq_childhood
            : level < 31 ? EConfigAttrProp.cq_youth : EConfigAttrProp.cq_adulthood;
        let result: attr;
        for (let i = 0; i < this.attrs.length; i++) {
            let item = this.attrs[i];
            if (item.prop == EConfigAttrProp[prop]) {
                result = item;
                break;
            }
        }
        return result;
    }

    /** 通过亲密度等级获取升级所需经验 */
    public getExpByLv(lv: number): number {
        for (let i = 0; i < this.exps.length; i++) {
            let item = this.exps[i];
            if (item.lv == lv) {
                return item.exp;
            }
        }
        return -1;
    }

    /** 获取狗的最高等级 */
    public get DOG_MAX_LEVEL(): number {
        return this.exps.length;
    }

    /** 获取每日签到奖励 */
    public getFuLiDayReward(day: number) {
        for (let i = 0; i < this.fuli_days.length; i++) {
            if (this.fuli_days[i].day == day)
                return this.fuli_days[i].reward;
        }
        console.log("出错了");
    }

}
