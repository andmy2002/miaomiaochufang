import { App } from "../../Manager/App";
import { fuli_day, fuli_watch } from "../Config/ConfigConst";

/** 福利 */
export class WelFare{
    
    private _fuliDay: fuli_day[];
    private _fuliWatch: fuli_watch[];
    public get fuliDay(): fuli_day[] {
        return this._fuliDay;
    }
    public set fuliDay(value: fuli_day[]) {
        this._fuliDay = value;
        this.updateLocalStorate();
    }

    public get fuliWatch(): fuli_watch[] {
        return this._fuliWatch;
    }
    public set fuliWatch(value: fuli_watch[]) {
        this._fuliWatch = value;
        this.updateLocalStorate();
    }

    public constructor() {
        this.initData();
    }

    public initData() {
        let dailyTask = App.LocalStorageUtil.getJsonObj(App.LocalStorageUtil.lst_welfare) as WelFare;
        if (dailyTask){
            this.fuliDay = dailyTask._fuliDay;
            this.fuliWatch = dailyTask._fuliWatch;
        }
        else{
            this.fuliDay = App.ConfigMgr.getFuLiDayList();
            this.fuliWatch = App.ConfigMgr.getFuLiWatchList();
        }
    }

    private updateLocalStorate() {
        App.LocalStorageUtil.setJsonObj(App.LocalStorageUtil.lst_welfare, this);
        console.log("设置福利数据:", this);
    }


}
