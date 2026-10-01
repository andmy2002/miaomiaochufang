import * as cc from "cc";

import SdkManager from "../../resources/sdk/script/SdkManager";
import { App } from "../Manager/App";
import NotifyModel from "../model/NotifyModel";
import StartSceneModel from "../model/StartSceneModel";
import TimeControl from "../TimeControl";
import { _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export default class loadScene extends cc.Component {

    @property(cc.Label)
    public percentLabel: cc.Label = null;

    @property(cc.Sprite)
    public loadingBg: cc.Sprite = null;

    @property(cc.ProgressBar)
    public loadingBar: cc.ProgressBar = null;

    private loadSceneName: string = "game";

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        App.Facade.init(false, cc.size(720, 1280), true, false);
        App.startUp();
        App.DataManager.init();
        // TimeControl.instance.OfflineTime();
        this.initModel();
        let self = this;
        SdkManager.Instance.init("miaomiao-kitchen", (succ) => {
            console.log("--------------ad init succ: ", succ);
            if (!self.node) return;
            if (!succ) {
                this.loadScene();
                return;
            }
            SdkManager.Instance.showNativeSplash(() => {
                this.loadScene();
            });
        });

    }

    initModel(): void {
        App.Facade.registerModel(StartSceneModel);
        App.Facade.registerModel(NotifyModel);
    }

    private loadScene() {
        cc.director.preloadScene("game", this.loadHallProgress.bind(this), (res) => {
            // cc.log("Next scene preloaded",  "game");
            cc.director.loadScene("game");
        });
    }

    /**加载大厅界面进度*/
    private loadHallProgress(completedCount: number, totalCount: number, item: any) {
        let progress = completedCount / totalCount;
        this.setProgress(Math.round(progress * 100));
    }

    /**加载进度 */
    private setProgress(value: number) {
        try {
            this.loadingBar.progress = value / 100;
            this.percentLabel.getComponent(cc.Label).string = value + "%";

        } catch (err) {
            console.log('setProgress', err)
        }
    }

    // update (dt) {}
}
