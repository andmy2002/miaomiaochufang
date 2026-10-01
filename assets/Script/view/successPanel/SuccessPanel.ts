import * as cc from "cc";
import { tween, UITransform, view } from "cc";
import { BaseView } from "../../../lightMVC/core/base/BaseView";
import { App } from "../../Manager/App";
import game from "../../game";
import { SoundManager } from "../../Manager/SoundManager";
import GetEffect from "../../prop/GetEffect";
import StartScene from "../../StartScene";
import SdkManager from "../../../resources/sdk/script/SdkManager";
import { _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export default class SuccessPanel extends BaseView {

    private hasBigAward: boolean = false;
    private rewardClaimed: boolean = false;
    public drawView(): void {
        SdkManager.Instance.showNativeBannerAdButton();
        SdkManager.Instance.showNativeInterstitial(true);
        App.SoundManager.playEffect(SoundManager.success);
       
        if(!SdkManager.Instance.fristGame){
            SdkManager.Instance.fristGame = true;
            SdkManager.Instance.installShortcut(null);
        }
       
        this.SetInit();
        this.SetMove();
        let main = this.ui.getNode("main");
        main.on(cc.Node.EventType.TOUCH_END, () => {
            if (this.rewardClaimed) return;
            this.rewardClaimed = true;
            App.DataManager.UpdateCoin(game.instance.totalNum);
            this.GetAward(main, game.instance.totalNum);
            this.closeView();
            game.instance.backMain();
        }, this);
        let shuangbei = this.ui.getNode("shuangbei");
        shuangbei.on(cc.Node.EventType.TOUCH_END, () => {
            if (this.rewardClaimed) return;
            let go=()=>{
                if (this.rewardClaimed) return;
                this.rewardClaimed = true;
                App.DataManager.UpdateCoin(game.instance.totalNum * 2);
                this.GetAward(shuangbei, game.instance.totalNum * 2);
                console.log('看视频双倍奖励~');
                this.closeView();
                game.instance.backMain();
                App.SoundManager.VideoEndOpen();
            }
          

            App.SoundManager.VideoStartStop();
            SdkManager.Instance.showRewardVideo(go, () => {
                App.SoundManager.VideoEndOpen();
                SdkManager.Instance.showToast("暂无广告");
            }, () => {
                App.SoundManager.VideoEndOpen();
                SdkManager.Instance.showToast("暂无广告");
            });
        }, this);
        let wubei = this.ui.getNode("wubei");
        wubei.on(cc.Node.EventType.TOUCH_END, () => {
            if (this.rewardClaimed) return;
          
            let go=()=>{
                if (this.rewardClaimed) return;
                this.rewardClaimed = true;
                App.DataManager.UpdateCoin(game.instance.totalNum * 5);
                this.GetAward(wubei, game.instance.totalNum * 5);
                console.log('看视频五倍奖励~');
                this.closeView();
                game.instance.backMain();
                App.SoundManager.VideoEndOpen();
            }
            App.SoundManager.VideoStartStop();
            SdkManager.Instance.showRewardVideo(go, () => {
                App.SoundManager.VideoEndOpen();
                SdkManager.Instance.showToast("暂无广告");
            }, () => {
                App.SoundManager.VideoEndOpen();
                SdkManager.Instance.showToast("暂无广告");
            });
        }, this);
        this.BigAward();
        shuangbei.active = !this.hasBigAward;
        wubei.active = this.hasBigAward;
    }

    private GetAward(node: any, num: number) {
        GetEffect.instance.createTargets(node, StartScene.instance.coinLabel.node.parent, 'jinbi', num);
    }

    private SetInit() {
        let shicainum = this.ui.getNode("shicainum");
        shicainum.getComponent(cc.Label).string = game.instance.shicaiNum.toString();
        let errshicainum = this.ui.getNode("errshicainum");
        errshicainum.getComponent(cc.Label).string = game.instance.errorShicaiNum.toString();
        let jinbinum = this.ui.getNode("jinbinum");
        jinbinum.getComponent(cc.Label).string = '+' + game.instance.getCoinNum.toString();
        let huonum = this.ui.getNode("huonum");
        huonum.getComponent(cc.Label).string = '+' + game.instance.getXiaofeiCount.toString();
        let zuannum = this.ui.getNode("zuannum");
        let getDiamand = (App.DataManager.HasGetDiamand()) ? 1 : 0;
        zuannum.getComponent(cc.Label).string = '+' + getDiamand.toString();
        if (getDiamand > 0) App.DataManager.UpdateDiamand(getDiamand, null);
        let zongnum = this.ui.getNode("zongnum");
        zongnum.getComponent(cc.Label).string = game.instance.totalNum.toString();
    }

    private BigAward() {


  
        let go = () => {

            App.DataManager.UpdateCoin(App.DataManager.VideoAddCoin);

            let tishi = this.ui.getNode('tishi');
            App.DataManager.UserData.openCount++;
            let shengyu = App.DataManager.openCountAwarad - App.DataManager.UserData.openCount;
            if (shengyu == 0) {
                this.hasBigAward = true;
                App.DataManager.UserData.openCount = 0;
            }
            App.DataManager.UpdateUserData();
            tishi.getComponent(cc.Label).string = '再营业' + shengyu.toString() + '次可获得5倍奖励';
        }
        go();
   

    }

    private SetMove() {
        let offset = 20;
        let papel_ticket = this.ui.getNode("papel_ticket");
        const visibleHeight = view.getVisibleSize().height;
        let startPosY = visibleHeight * 0.5 + papel_ticket.getComponent(UITransform).height - offset;
        papel_ticket.y = startPosY;
        tween(papel_ticket)
            .to(0.5, { position: new cc.Vec3(0, visibleHeight * 0.5, papel_ticket.position.z) })
            .start();
    }


    public static path(): string {
        return "prefabs/SuccessPanel";
    }
}
