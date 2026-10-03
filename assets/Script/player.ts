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

    // Approved full-character poses are used for every playable role. Keep the
    // original layered sprites in the scene as a fallback if loading fails.
    private motionActive = false;
    private motionCelebrating = false;
    private motionCheering = false;
    private motionLoadToken = 0;
    private motionFrames: Record<string, cc.SpriteFrame> = {};
    private readonly motionBlink = () => {
        if (!this.motionActive || this.huoFlag || this.motionCelebrating || this.motionCheering) return;
        this.showMotionPose('blink');
        this.scheduleOnce(this.motionEndBlink, 0.13);
    };
    private readonly motionEndBlink = () => {
        if (this.motionActive && !this.huoFlag && !this.motionCelebrating && !this.motionCheering) this.showMotionPose('idle');
    };
    private readonly motionEndCheer = () => {
        this.motionCheering = false;
        if (this.motionActive && !this.motionCelebrating) this.showMotionPose(this.huoFlag ? 'fire' : 'idle');
    };

    private huoFlag: boolean = false;
    private angryFlag: boolean = false;
    private readonly availableCustomerIds: string[] = ['1', '2', '3', '4', '5', '6'];
    // Bound in game.scene so the six approved customers are included in the scene
    // and can appear immediately, without depending on an asynchronous load.
    @property({ type: [cc.SpriteFrame] })
    private customerIdleFrames: cc.SpriteFrame[] = [];
    private customerMotionActive = false;
    private customerMotionLoadToken = 0;
    private customerMotionFrames: Record<string, cc.SpriteFrame> = {};
    private readonly customerBlink = () => {
        if (!this.customerMotionActive || this.angryFlag) return;
        this.showCustomerPose('blink');
        this.scheduleOnce(this.customerEndBlink, 0.13);
    };
    private readonly customerEndBlink = () => {
        if (this.customerMotionActive && !this.angryFlag) this.showCustomerPose('idle');
    };

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

    onDestroy() {
        this.stopMotion();
        this.stopCustomerMotion();
        if (player._instance === this) player._instance = null;
    }

    /**初始化角色 */
    public InitRole() {
        const selectedRole = App.DataManager.UserData.currRole;
        const loadToken = ++this.motionLoadToken;
        this.stopMotion();
        this.loadRoleMotion(selectedRole, loadToken);
    }

    private loadLegacyRole(selectedRole: string) {
        this.showLegacyRoleParts();
        App.DataManager.LoadTextureList(selectedRole, (list: any) => {
            if (App.DataManager.UserData.currRole !== selectedRole) return;
            this.textureList = list;
            for (let i = 0; i < this.body.children.length; i++) {
                let childs = this.body.children[i];
                childs.getComponent(cc.Sprite).spriteFrame = list[childs.name];
            }
            this.zuoyan.node.getComponent(animationFrame).textureArr = [this.textureList['yan'], this.textureList['zhayan']];
            this.youyan.node.getComponent(animationFrame).textureArr = [this.textureList['yan'], this.textureList['zhayan']];
            this.zuoyan.node.getComponent(animationFrame).StartAnim();
            this.youyan.node.getComponent(animationFrame).StartAnim();
        })
    }

    private async loadRoleMotion(selectedRole: string, loadToken: number) {
        const base = `texture/juese/${selectedRole}/pose_`;
        const [idle, blink, cheer, fire] = await Promise.all(
            ['idle', 'blink', 'cheer', 'fire'].map(pose => App.DataManager.GetTexture(base + pose))
        );
        if (!this.isValid || loadToken !== this.motionLoadToken || App.DataManager.UserData.currRole !== selectedRole) return;
        if (!idle) {
            console.warn(`第 ${selectedRole} 位猫咪动作素材加载失败，回退到旧分层角色`);
            this.loadLegacyRole(selectedRole);
            return;
        }
        this.motionFrames = {
            idle: idle as cc.SpriteFrame,
            blink: (blink || idle) as cc.SpriteFrame,
            cheer: (cheer || idle) as cc.SpriteFrame,
            fire: (fire || idle) as cc.SpriteFrame,
        };
        this.motionActive = true;
        this.motionCelebrating = false;
        this.motionCheering = false;
        this.huoFlag = false;
        for (const child of this.body.children) child.active = child.name === 'shenti';
        this.zuoyan.node.getComponent(animationFrame).StopAnim();
        this.youyan.node.getComponent(animationFrame).StopAnim();
        this.showMotionPose('idle');
        this.schedule(this.motionBlink, 3.2);
    }

    private showMotionPose(pose: string) {
        const bodySprite = this.body.getChildByName('shenti')?.getComponent(cc.Sprite);
        if (bodySprite && this.motionFrames[pose]) bodySprite.spriteFrame = this.motionFrames[pose];
    }

    private stopMotion() {
        this.unschedule(this.motionBlink);
        this.unschedule(this.motionEndBlink);
        this.unschedule(this.motionEndCheer);
        this.motionActive = false;
        this.motionCelebrating = false;
        this.motionCheering = false;
        this.motionFrames = {};
    }

    private showLegacyRoleParts() {
        for (const child of this.body.children) child.active = true;
        this.zuoshou.active = true;
        this.youshou.active = true;
        this.zuoshouyao.active = false;
        this.youshouyao.active = false;
        this.zuoyan.node.children[0].active = false;
        this.youyan.node.children[0].active = false;
        this.huoFlag = false;
    }

    /**新顾客 */
    public NewCustomer() {
        const index = App.DataManager.RandomNum(this.availableCustomerIds.length - 1);
        const selectedCustomer = this.availableCustomerIds[index];
        const loadToken = ++this.customerMotionLoadToken;
        this.stopCustomerMotion();
        this.angryFlag = false;
        this.customerTextureList = [];
        this.gukeshenti.active = false;
        this.gukeshou.active = false;
        const idle = this.customerIdleFrames[index];
        if (!idle) {
            console.error(`第 ${selectedCustomer} 位顾客缺少场景绑定的形象`);
            return;
        }
        this.customerMotionFrames = { idle, blink: idle, angry: idle };
        this.customerMotionActive = true;
        for (const child of this.gukeshenti.children) child.active = child.name === 'shenti';
        this.gukeshou.getComponent(cc.Animation)?.stop();
        this.showCustomerPose('idle');
        this.gukeshenti.active = true;
        this.CustomerStartAct();
        this.schedule(this.customerBlink, 3.5);
        void this.loadCustomerExpressions(selectedCustomer, loadToken);
    }

    private async loadCustomerExpressions(selectedCustomer: string, loadToken: number) {
        const base = `texture/guke/${selectedCustomer}/pose_`;
        const [blink, angry] = await Promise.all(
            ['blink', 'angry'].map(pose => App.DataManager.GetTexture(base + pose))
        );
        if (!this.isValid || loadToken !== this.customerMotionLoadToken) return;
        if (blink) this.customerMotionFrames.blink = blink as cc.SpriteFrame;
        if (angry) this.customerMotionFrames.angry = angry as cc.SpriteFrame;
        if (this.angryFlag) this.showCustomerPose('angry');
    }

    private loadLegacyCustomer(selectedCustomer: string, loadToken: number) {
        for (const child of this.gukeshenti.children) child.active = true;
        App.DataManager.LoadCustomsTextureList(selectedCustomer, (list: any) => {
            if (!this.isValid || loadToken !== this.customerMotionLoadToken) return;
            this.customerTextureList = list;
            this.gukeshenti.getChildByName('zuoyan').getComponent(cc.Sprite).spriteFrame = list['yan'];
            this.gukeshenti.getChildByName('youyan').getComponent(cc.Sprite).spriteFrame = list['yan'];
            this.gukeshenti.getChildByName('shenti').getComponent(cc.Sprite).spriteFrame = list['shenti'];
            this.gukeshenti.getChildByName('zui').getComponent(cc.Sprite).spriteFrame = list['zui'];
            this.gukeshou.getChildByName('zuoshou').getComponent(cc.Sprite).spriteFrame = list['shou'];
            this.gukeshou.getChildByName('youshou').getComponent(cc.Sprite).spriteFrame = list['shou'];
            const anim = this.gukeshou.getComponent(cc.Animation);
            anim.stop();
            App.DataManager.AnimationRecovery(anim, 'gukeshou');
            this.gukeshenti.active = true;
            this.CustomerStartAct();
        });
    }

    private showCustomerPose(pose: string) {
        const sprite = this.gukeshenti.getChildByName('shenti')?.getComponent(cc.Sprite);
        if (sprite && this.customerMotionFrames[pose]) sprite.spriteFrame = this.customerMotionFrames[pose];
    }

    private stopCustomerMotion() {
        this.unschedule(this.customerBlink);
        this.unschedule(this.customerEndBlink);
        this.customerMotionActive = false;
        this.customerMotionFrames = {};
    }

    /**顾客生气 */
    public CustomerAngry() {
        if (this.angryFlag) return;
        game.instance.HuoDisppear();
        this.angryFlag = true;
        if (this.customerMotionActive) {
            this.unschedule(this.customerBlink);
            this.unschedule(this.customerEndBlink);
            this.showCustomerPose('angry');
            return;
        }
        // A customer can still be loading when the order timer expires.
        // The pending expression is applied once its full-character frame arrives.
        if (!this.customerTextureList?.['zhayan'] || !this.customerTextureList?.['bizui']) return;
        this.gukeshenti.getChildByName('zuoyan').getComponent(cc.Sprite).spriteFrame = this.customerTextureList['zhayan'];
        this.gukeshenti.getChildByName('youyan').getComponent(cc.Sprite).spriteFrame = this.customerTextureList['zhayan'];
        this.gukeshenti.getChildByName('zui').getComponent(cc.Sprite).spriteFrame = this.customerTextureList['bizui'];
        this.gukeshou.getComponent(cc.Animation).play();
    }

    private CustomerStartAct() {
        this.gukeshou.active = false;
        cc.Tween.stopAllByTarget(this.gukeshenti);
        let customerStartY = 220;
        let customerEndY = 364;
        this.gukeshenti.y = customerStartY;
        tween(this.gukeshenti)
            .to(0.3, { position: new cc.Vec3(this.gukeshenti.position.x, customerEndY, this.gukeshenti.position.z) })
            .call(() => { this.gukeshou.active = !this.customerMotionActive; })
            .start();
    }

    public CustomerEndAct() {
        ++this.customerMotionLoadToken;
        this.unschedule(this.customerBlink);
        this.unschedule(this.customerEndBlink);
        cc.Tween.stopAllByTarget(this.gukeshenti);
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
        if (this.motionActive) {
            this.huoFlag = true;
            if (!this.motionCelebrating && !this.motionCheering) this.showMotionPose('fire');
            App.SoundManager.playEffect(SoundManager.onfire);
            return;
        }
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
        if (this.motionActive) {
            this.huoFlag = false;
            if (!this.motionCelebrating && !this.motionCheering) this.showMotionPose('idle');
            return;
        }
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
        if (this.motionActive) {
            this.unschedule(this.motionEndBlink);
            this.unschedule(this.motionEndCheer);
            this.motionCheering = true;
            this.showMotionPose('cheer');
            this.scheduleOnce(this.motionEndCheer, 0.28);
            return;
        }
        this.dirFlag = !this.dirFlag;
        this.zuoshou.active = this.dirFlag;
        this.youshouyao.active = this.dirFlag;
        this.youshou.active = !this.dirFlag;
        this.zuoshouyao.active = !this.dirFlag;
    }

    /**选择完成 */
    public AllCompelet() {
        if (this.motionActive) {
            this.unschedule(this.motionEndCheer);
            this.motionCheering = false;
            this.motionCelebrating = true;
            this.showMotionPose('cheer');
        } else {
            this.zuoshou.active = false;
            this.youshouyao.active = true;
            this.youshou.active = false;
            this.zuoshouyao.active = true;
            this.zuoyan.spriteFrame = this.textureList['zhayan'];
            this.youyan.spriteFrame = this.textureList['zhayan'];
            this.zuiba.spriteFrame = this.textureList['kaixinzui'];
            this.zuoyan.node.children[0].active = false;
            this.youyan.node.children[0].active = false;
        }
        this.CustomerEndAct();
        // console.log('笑脸~~~', game.instance.perCoinNum)
        GetEffect.instance.createTargets(this.gukeshenti, game.instance.coinLabel.node.parent, 'jinbi', game.instance.perCoinNum);
    }

    /**恢复初始状态 */
    public AllBack() {
        if (this.motionActive) {
            this.motionCelebrating = false;
            this.motionCheering = false;
            this.showMotionPose(this.huoFlag ? 'fire' : 'idle');
            return;
        }
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
