import BaseModel from "../../lightMVC/core/base/BaseModel";
import Notification from "../Notification";

export default class StartSceneModel extends BaseModel {

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
     * 更新钻石
     */
    public updateDiamandNumber(): void {
        this.sendNoti('UPDATE_DIAMAND', '更新钻石');
    }

    public missionTishi() {
        this.sendNoti('missionTishi', '任务提示');
    }

    public missionTishiClose() {
        this.sendNoti('missionTishiClose', '任务提示关闭');
    }

    
    public achieveTishi() {
        this.sendNoti('achieveTishi', '成就提示');
    }

    public achieveTishiClose() {
        this.sendNoti('achieveTishiClose', '成就提示关闭');
    }
    // /**
    //  * 更新体力倒计时
    //  */
    // public updateTiliJishi(isShow: boolean, timeStr?: string): void {
    //     let data = { "isShow": isShow };
    //     if (timeStr) data['timeStr'] = timeStr;
    //     this.sendNoti('UPDATE_TILI_JISHI', data);
    // }
    public clear(): void {

    }
}
