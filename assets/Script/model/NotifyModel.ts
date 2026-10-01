import BaseModel from "../../lightMVC/core/base/BaseModel";
import Notification from "../Notification";

export default class NotifyModel extends BaseModel {

    public init(): void {

    }

    public sendNotify(notify: string, data?: any): void {
        this.sendNoti(notify,data);
    }

    public clear(): void {

    }
}
