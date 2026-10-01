import BaseModel from "../../lightMVC/core/base/BaseModel";
import Notification from "../Notification";

export default class gameModel extends BaseModel {

    public init(): void {

    }

    public sendNotify(notify: string, data?: any): void {
        this.sendNoti(notify, data);
    }

    /**
     * 更新金币
     */
    public updateCoinNumber(): void {
        this.sendNoti('UPDATE_COIN', '更新金币');
    }
    /**
     * 更新体力
     */
    public updateTiliNumber(): void {
        this.sendNoti('UPDATE_TILI', '更新体力');
    }

    /**
     * 更新体力倒计时
     */
    public updateTiliJishi(isShow: boolean, timeStr?: string): void {
        let data = { "isShow": isShow };
        if (timeStr) data['timeStr'] = timeStr;
        this.sendNoti('UPDATE_TILI_JISHI', data);
    }
    public clear(): void {

    }
}
