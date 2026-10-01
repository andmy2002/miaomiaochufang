import * as cc from "cc";
import { UITransform } from "cc";
/**
 * 图层管理类
 * @author chenk <hzzhewu@163.com>
 * @date 2016/6/27
 * 
 */
import { SingleClass } from "./SingleClass";
import FrameworkCfg from "../../lightMVC/core/FrameworkCfg";
import { _decorator } from "cc";
const { ccclass, property } = _decorator;
@ccclass
export default class LayerManager extends SingleClass {
    /**根容器*/
    private rootLayer: cc.Node;
    /**锁定动画层*/
    public lockLayer: cc.Node;
    /**提示语层*/
    public tipLayer: cc.Node;


    public constructor() {
        super();

        this.rootLayer = new cc.Node("rootLayer");
        //this.rootLayer.addComponent(cc.BlockInputEvents);
        cc.game.addPersistRootNode(this.rootLayer);
        this.rootLayer.addComponent(UITransform).setContentSize(FrameworkCfg.DESIGN_RESOLUTION);
        this.rootLayer.x = 360;
        this.rootLayer.y = 640;

        this.lockLayer = new cc.Node("lockLayer");
        this.lockLayer.addComponent(UITransform);
        this.rootLayer.addChild(this.lockLayer);

        this.tipLayer = new cc.Node("tipLayer");
        this.tipLayer.addComponent(UITransform);
        this.rootLayer.addChild(this.tipLayer);
    }



}
