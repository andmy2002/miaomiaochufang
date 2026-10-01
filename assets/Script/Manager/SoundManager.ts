import * as cc from "cc";
import { AudioSource, director, Node, resources } from "cc";
/**
 * 声音管理类
 * @author chenk <hzzhewu@163.com>
 * @date 2016/6/30
 */
import { SingleClass } from "./SingleClass";
import { dogType } from "./GameInfo";
import { App } from "./App";
export class SoundManager extends SingleClass {
    private soundList = {};                    //声音列表
    private soundActList = {};                  //动作列表
    private actChannelList = {};                //动作音道列表

    // AudioEngine's numeric channel IDs no longer exist in Creator 3.x. Keep
    // dedicated AudioSource components instead, so volume and stop semantics
    // remain owned by this manager.
    private effectSource: AudioSource;
    private bgmSource: AudioSource;
    private clockSource: AudioSource;
    private actSound: cc.AudioClip;//动作声音
    private _allowPlayEffect: boolean = true;   //是否允许播放音效
    private _allowPlayBGM: boolean = true;      //是否允许播放背景音乐
    private _effectVolume: number = 1;          //音效音量
    private _bgmVolume: number = 1;             //背景音量

    private jumpID: number = -1;      //跳跃音道

    public static hallBgm: string = "startbgm.mp3";          //大厅背景音乐
    public static gameBgm: string = "gameBgm.mp3";          //大厅背景音乐
    public currentPlayBgm: string = '';

    public static click: string = "click.mp3";//按钮点击
    public static clickcError: string = "clickerror.mp3";//点击错误食材
    public static getAward: string = "getAward.mp3";// 领取奖励
    public static onfire: string = "onfire.mp3";// 上头音效
    public static perComplete: string = "perComplete.mp3";// 每份订单完成
    public static success: string = "success.mp3";// 胜利音效
    public static yiliaowancheng: string = "yiliaowancheng.mp3";// 胜利音效
    private huanyingCount: number = 7;

    public constructor() {
        super();
    }

    private getSource(kind: "effect" | "bgm" | "clock"): AudioSource {
        const property = `${kind}Source` as const;
        if (this[property]) return this[property];

        const node = new Node(`MiaomiaoKitchen-${kind}-audio`);
        const scene = director.getScene();
        if (scene) scene.addChild(node);
        cc.game.addPersistRootNode(node);
        this[property] = node.addComponent(AudioSource);
        return this[property];
    }

    private loadClip(soundName: string, callback: (clip: cc.AudioClip) => void): void {
        const cached = this.soundList[soundName] as cc.AudioClip;
        if (cached) {
            callback(cached);
            return;
        }
        const resourceName = soundName.replace(/\.(mp3|wav|ogg)$/i, '');
        resources.load(`Audio/${resourceName}`, cc.AudioClip, (error, clip) => {
            if (error || !clip) {
                console.error(`音频加载失败: ${soundName}`, error);
                return;
            }
            this.soundList[soundName] = clip;
            callback(clip);
        });
    }

    /**将牌值转换未音效名 */
    private changeCardValue(cardValue) {
        return
    }

    /**
     * 播放音效
     * @param soundName 声音名
     * @param loops 循环次数
     */
    public playEffect(soundName: string, loops: boolean = false) {
        if (!this.allowPlayEffect) {
            return;
        }
        this.loadClip(soundName, (clip) => {
            const source = this.getSource("effect");
            source.volume = this._effectVolume;
            if (loops) {
                source.stop();
                source.clip = clip;
                source.loop = true;
                source.play();
            } else {
                source.playOneShot(clip, this._effectVolume);
            }
        });
    }
    public playHuanYingEffect() {
        let randomIndex = App.DataManager.RandomNum(this.huanyingCount - 1);
        let effectName = 'huanying' + randomIndex.toString() + '.mp3';
        this.playEffect(effectName);
    }

    /**
     * 停止播放音效
     */
    public stopEffect() {
        this.effectSource?.stop();
    }


    private videoEffect: boolean = false;
    private videoMusic: boolean = false;
    /**观看视频音量关闭 */
    public VideoStartStop() {
        this.videoEffect = this._allowPlayEffect;
        this.videoMusic = this._allowPlayBGM;
        this._allowPlayEffect = false;

        this.stopBGM();
    }

    /**观看视频音量开启*/
    public VideoEndOpen() {
        if (this.videoMusic) this.playBGM(this.currentPlayBgm);
        this._allowPlayEffect = this.videoEffect;
    }



    /**
     * 播放背景音乐
     * @param bgmName 背景音名
     * @param startTime 播放起始位置
     * @param loops 循环次数
     */
    public playBGM(bgmName: string, loops: boolean = true) {
        if (this.allowPlayBGM == false) {// || this.bgmChannelID != null
            return;
        }
        this.currentPlayBgm = bgmName;
        this.stopBGM();
        console.log('播放背景音乐：bgmName', bgmName)
        this.loadClip(bgmName, (clip) => {
            const source = this.getSource("bgm");
            source.stop();
            source.clip = clip;
            source.loop = loops;
            source.volume = this._bgmVolume;
            source.play();
        });

    }

    /**停止背景音乐*/
    public stopBGM() {
        // if (this.bgmChannelID) {
        this.bgmSource?.stop();
    }


    /**停止背景音乐*/
    public stopClock() {
        this.clockSource?.stop();
    }

    /**获取是否允许播放音效*/
    public get allowPlayEffect() {
        return this._allowPlayEffect;
    }

    /**设置是否允许播放音效*/
    public set allowPlayEffect(bAllow: boolean) {
        this._allowPlayEffect = bAllow;
    }

    /**获取是否允许播放背景音*/
    public get allowPlayBGM() {
        return this._allowPlayBGM;
    }

    /**设置是否允许播放背景音*/
    public set allowPlayBGM(bAllow: boolean) {
        this._allowPlayBGM = bAllow;
        if (this._allowPlayBGM == false) {
            this.stopBGM();
        } else {
            this.playBGM(SoundManager.hallBgm);
        }
    }

    /**获取音效音量*/
    public get effectVolume() {
        return this._effectVolume;
    }

    /**设置音效音量*/
    public set effectVolume(value: number) {
        this._effectVolume = value;
    }

    /**获取BGM音量*/
    public get bgmVolume() {
        return this._bgmVolume;
    }

    /**设置BGM音量*/
    public set bgmVolume(value: number) {
        this._bgmVolume = value;
        if (this.bgmSource) this.bgmSource.volume = this._bgmVolume;
    }




}
