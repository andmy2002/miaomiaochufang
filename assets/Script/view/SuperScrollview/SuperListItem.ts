import * as cc from "cc";


import { _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export default abstract class SuperListItem extends cc.Component {

    // 子类必须要实现
    abstract setData(param: any);

    abstract CancelSelect();
    // update (dt) {}
}
