import * as cc from "cc";

import { _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export default class BaseProp extends cc.Component {

    /**
     * 初始化数据
     * @param element json道具数据
     */
    public SetData(element: any): void {
       
    }

    /**
     * 道具内部特殊设置
     * @param element 
     */
    public SpecicalSet(element: any) {

    }

   

}
