import * as cc from "cc";
import { tween } from "cc";
import game from "./game";
import { App } from "./Manager/App";
import { SoundManager } from "./Manager/SoundManager";
import animationFrame from "./prop/animationFrame";
import GetEffect from "./prop/GetEffect";

import { _decorator } from "cc";
const { ccclass, property } = _decorator;
@ccclass
export default class player extends cc.Component {
    private static _instance: player = null;

    @property(cc.Node)
    private body: cc.Node = null;

    // 方向标志，true：左摇，false：右摇
    private dirFlag: boolean = false;

    @property(cc.Node)
    private zuoshou: cc.Node = null;
    @property(cc.Node)
    private zuoshouyao: cc.Node = null;

    @property(cc.Node)
    private youshou: cc.Node = null;
    @property(cc.Node)
    private youshouyao: cc.Node = null;
    @property(cc.Sprite)
    private zuoyan: cc.Sprite = null;
    @property(cc.Sprite)
    private youyan: cc.Sprite = null;
    @property(cc.Sprite)
    private zuiba: cc.Sprite = null;

    private textureList: any = [];
    private customerTextureList: any = [];

    private huoFlag: boolean = false;
    private angryFlag: boolean = false;
    // 顾客 3 缺少 zui/bizui 图片，补齐素材前不参与随机出场。
    private readonly availableCustomerIds: string[] = ['1', '2', '4', '5', '6'];

    /**顾客部分 */

    @property(cc.Node)
    private gukeshenti: cc.Node = null;
    @property(cc.Node)
    private gukeshou: cc.Node = null;

    public static get instance() {
        return player._instance;
    }
    public static set instance(value) {
        player._instance = value;
    }

    onLoad() {
        player._instance = this;
        this.InitRole();
    }

    /**初始化角色 */
    public InitRole() {
        App.DataManager.LoadTextureList(App.DataManager.UserData.currRole, (list: any) => {
            this.textureList = list;
            for (let i = 0; i < this.body.children.length; i++) {
                let childs = this.body.children[i];
                childs.getComponent(cc.Sprite).spriteFrame = list[childs.name];
            }
            this.zuoyan.node.getComponent(animationFrame).textureArr = [this.textureList['yan'], this.textureList['zhayan']];
            this.youyan.node.getComponent(animationFrame).textureArr = [this.textureList['yan'], this.textureList['zhayan']];
        })
    }

    /**新顾客 */
    public NewCustomer() {
        let index = App.DataManager.RandomNum(this.availableCustomerIds.length - 1);
        App.DataManager.LoadCustomsTextureList(this.availableCustomerIds[index], (list: any) => {
            this.customerTextureList = list;
            this.gukeshenti.getChildByName('zuoyan').getComponent(cc.Sprite).spriteFrame = this.customerTextureList['yan'];
            this.gukeshenti.getChildByName('youyan').getComponent(cc.Sprite).spriteFrame = this.customerTextureList['yan'];
            this.gukeshenti.getChildByName('shenti').getComponent(cc.Sprite).spriteFrame = this.customerTextureList['shenti'];
            this.gukeshenti.getChildByName('zui').getComponent(cc.Sprite).spriteFrame = this.customerTextureList['zui'];
            this.gukeshou.getChildByName('zuoshou').getComponent(cc.Sprite).spriteFrame = this.customerTextureList['shou'];
            this.gukeshou.getChildByName('youshou').getComponent(cc.Sprite).spriteFrame = this.customerTextureList['shou'];
        })
        this.CustomerStartAct();
        let anim = this.gukeshou.getComponent(cc.Animation);
        anim.stop();
        App.DataManager.AnimationRecovery(anim, 'gukeshou'); this.angryFlag = false;
    }

    /**顾客生气 */
    public CustomerAngry() {
        if (this.angryFlag) return;
        game.instance.HuoDisppear();
        this.angryFlag = true;
        this.gukeshenti.getChildByName('zuoyan').getComponent(cc.Sprite).spriteFrame = this.customerTextureList['zhayan'];
        this.gukeshenti.getChildByName('youyan').getComponent(cc.Sprite).spriteFrame = this.customerTextureList['zhayan'];
        this.gukeshenti.getChildByName('zui').getComponent(cc.Sprite).spriteFrame = this.customerTextureList['bizui'];
        this.gukeshou.getComponent(cc.Animation).play();
    }

    private CustomerStartAct() {
        this.gukeshou.active = false;
        let customerStartY = 220;
        let customerEndY = 364;
        this.gukeshenti.y = customerStartY;
        tween(this.gukeshenti)
            .to(0.3, { position: new cc.Vec3(this.gukeshenti.position.x, customerEndY, this.gukeshenti.position.z) })
            .call(() => { this.gukeshou.active = true; })
            .start();
    }

    public CustomerEndAct() {
        let customerStartY = 220;
        // let customerEndY = 364;
        // this.gukeshenti.y = customerStartY;
        this.gukeshou.active = false;
        tween(this.gukeshenti)
            .to(0.3, { position: new cc.Vec3(this.gukeshenti.position.x, customerStartY, this.gukeshenti.position.z) })
            .start();
    }

    public ShowHuo() {
        if (this.huoFlag) return;
        this.zuoyan.spriteFrame = this.textureList['yan_huo'];
        this.youyan.spriteFrame = this.textureList['yan_huo'];
        this.zuoyan.node.children[0].active = true;
        this.youyan.node.children[0].active = true;
        this.zuoyan.node.getComponent(animationFrame).StopAnim();
        this.youyan.node.getComponent(animationFrame).StopAnim();
        this.huoFlag = true;
        App.SoundManager.playEffect(SoundManager.onfire);
    }
    public HideHuo() {
        this.zuoyan.spriteFrame = this.textureList['yan'];
        this.youyan.spriteFrame = this.textureList['yan'];
        this.zuoyan.node.children[0].active = false;
        this.youyan.node.children[0].active = false;
        this.zuoyan.node.getComponent(animationFrame).StartAnim();
        this.youyan.node.getComponent(animationFrame).StartAnim();
        this.huoFlag = false;
    }

    /**选择正确后播放手动作 */
    public ClickCorrect() {
        this.dirFlag = !this.dirFlag;
        this.zuoshou.active = this.dirFlag;
        this.youshouyao.active = this.dirFlag;
        this.youshou.active = !this.dirFlag;
        this.zuoshouyao.active = !this.dirFlag;
    }

    /**选择完成 */
    public AllCompelet() {
        this.zuoshou.active = false;
        this.youshouyao.active = true;
        this.youshou.active = false;
        this.zuoshouyao.active = true;
        this.zuoyan.spriteFrame = this.textureList['zhayan'];
        this.youyan.spriteFrame = this.textureList['zhayan'];
        this.zuiba.spriteFrame = this.textureList['kaixinzui'];
        this.zuoyan.node.children[0].active = false;
        this.youyan.node.children[0].active = false;
        this.CustomerEndAct();
        // console.log('笑脸~~~', game.instance.perCoinNum)
        GetEffect.instance.createTargets(this.gukeshenti, game.instance.coinLabel.node.parent, 'jinbi', game.instance.perCoinNum);
    }

    /**恢复初始状态 */
    public AllBack() {
        this.zuoshou.active = true;
        this.youshouyao.active = false;
        this.youshou.active = true;
        this.zuoshouyao.active = false;
        this.zuoyan.spriteFrame = this.textureList['yan'];
        this.youyan.spriteFrame = this.textureList['yan'];
        this.zuiba.spriteFrame = this.textureList['zuiba'];
        this.zuoyan.node.children[0].active = this.huoFlag;
        this.youyan.node.children[0].active = this.huoFlag;
        // console.log('恢复默认');
    }

    public backInit() {
        this.HideHuo();
        this.AllBack();
    }
}
