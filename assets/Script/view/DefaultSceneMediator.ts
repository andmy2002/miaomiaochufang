import * as cc from "cc";
import BaseMediator from "../../lightMVC/core/base/BaseMediator";


import { _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export default class DefaultSceneMediator extends BaseMediator {

    private _data: any;
    
    public init(data?: any): void {
        console.log("打开场景时传递的参数:", data);
        this._data = data;
    }    
    
    public viewDidAppear(): void {
        console.log("viewDidAppear ===>>>", this._data);
        cc.director.loadScene("FriendScene");
       
    }

    public destroy(): void {

    }

}
