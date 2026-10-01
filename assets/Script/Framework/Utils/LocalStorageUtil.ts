import * as cc from "cc";
import { Singleton } from "./Singleton";

export class LocalStorageUtil extends Singleton {
    /**音乐 */
    public lst_music: string = "chef_music";
    /**音效 */
    public lst_effect: string = "chef_effect";
    /**倒计时时间*/
    public lst_CountTime: string = "chefCountTime";
    /**倒计时秒数*/
    public lst_CountSecond: string = "chefCountSecond";

    /** 新手引导标志*/
    public lst_guide: string = "chef_guide";


    public lst_userData: string = 'chef_userData';

    public lst_otherData: string = 'chef_otherData';
    public lst_dailytask: string = 'chef_dailytask';
    public lst_welfare: string = 'chef_welfare';


    // /** 免费视频次数 */
    // public lst_free_watch_times: string = "sausage_free_watch_times";
    // /** 每日签到数据 */
    // public lst_daily_signin: string = "sausage_daily_signin";

    private secretkey: string = 'ccxh_ws111'; // 加密密钥
    private isSecret: boolean = false;
    private set(key: string, value: any) {
        try {
            if (key) {
                if (this.isSecret) {
                    let dataString = JSON.stringify(value);
                    value = window["encryptjs"].encrypt(dataString, this.secretkey, 256);
                }
                cc.sys.localStorage.setItem(key, value);
            }
        } catch (e) {
            console.error("设置数据出错!!!");
        }
    }

    //不存在key时返回null
    private get(key: string): any {
        try {
            if (key) {
                let value = cc.sys.localStorage.getItem(key);
                if (value) {
                    if (this.isSecret)
                        return JSON.parse(window["encryptjs"].decrypt(value, this.secretkey, 256));
                    else
                        return value;
                }
            }
            return null;
        } catch (e) {
            console.error("获取数据出错!!!");
            return null;
        }
    }

    /**存string */
    public setString(key: string, value: string) {
        this.set(key, value);
    }

    /**取string */
    public getString(key: string): string {
        let value = this.get(key);
        return value;
    }

    /**存boolean */
    public setBoolean(key: string, value: boolean) {
        let temp = value ? "1" : "0";
        this.set(key, temp);
    }

    /**取boolean */
    public getBoolean(key: string): boolean {
        let value = this.get(key);
        if (value) {
            if (value == "1")
                return true;
            else
                return false;
        }
        return null;
    }

    /**存number */
    public setNumber(key: string, value: number, encode?: boolean) {
        if (value != null && value != undefined) {
            // if (value == Math.floor(value) && encode) { //整数
            // 	value = EncryptUtil.enValue(value);
            // }
            this.set(key, value.toString());
        }
    }

    /**取number */
    public getNumber(key: string, decode?: boolean): number {
        let temp = this.get(key);
        if (temp == null || temp === "") return null;
        const value = Number(temp);
        return Number.isFinite(value) ? value : null;
    }

    /**存json */
    public setJsonObj(key: string, value: Object) {
        if (value != null && value != undefined) {
            this.set(key, JSON.stringify(value));
        }
    }

    /**取json */
    public getJsonObj(key: string): Object {
        let temp = this.get(key);
        if (temp != null) {
            return JSON.parse(temp);
        }
        return temp;
    }

    /**清空本地存在数据 */
    public clearAll() {
        cc.sys.localStorage.clear();
    }

    /**删除数据key */
    public deleteKey(key: string) {
        let temp = this.get(key);
        if (temp != null) {
            cc.sys.localStorage.removeItem(key);
        }
    }
}
