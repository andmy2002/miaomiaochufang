import * as cc from "cc";
import { MiniGamePlatform } from "../../../Script/Platform/MiniGamePlatform";
import { PLATFORM_AD_UNITS } from "../../../Script/Platform/PlatformAdConfig";

/**
 * Compatibility facade for existing gameplay UI.
 * The former SDK only targeted Vivo/OPPO. This one targets WeChat and
 * ByteDance mini games and is deliberately a safe no-op in editor/web preview.
 */
export default class SdkManager {
    private static instance: SdkManager;
    public fristGame = false;
    public canShowBannerAd = false;
    public static DEBUG = true;

    public static get Instance(): SdkManager {
        return this.instance || (this.instance = new SdkManager());
    }

    private get config() {
        const kind = MiniGamePlatform.kind;
        return kind === "web" ? null : PLATFORM_AD_UNITS[kind];
    }

    public init(_gameCode: string, callback?: (success: boolean) => void): void { MiniGamePlatform.init(callback); }
    public showNativeBanner(_top = false, _y = 0): void { this.showBanner(); }
    public showNativeBannerLittleButton(): void { this.showBanner(); }
    public showNativeBannerAdButton(): void { this.showBanner(); }
    public showNativeBannerAddButton(_top = false): void { this.showBanner(); }
    public hideNativeBanner(): void { this.hideBanner(); }
    public hideNativeIcon(): void { /* Native icon ads are not used by target platforms. */ }
    public showNativeIconAd(_x: number, _y: number, _id = 0): void { /* no-op */ }
    public showNativeSplash(callback?: () => void): void { callback?.(); }

    public showBanner(_id = 0): void { if (this.config) MiniGamePlatform.showBanner(this.config); }
    public hideBanner(): void { MiniGamePlatform.hideBanner(); }
    public showNativeInterstitial(_forever = false, _id = 0): void { this.showInterstitial(); }
    public showInterstitial(_id = 0): void { if (this.config) MiniGamePlatform.showInterstitial(this.config); }
    public showRewardVideo(success: () => void, failure?: () => void, noAd?: () => void): void {
        if (!this.config) { (noAd || failure)?.(); return; }
        MiniGamePlatform.showRewardedVideo(this.config, success, failure || noAd);
    }
    public showToast(message: string): void { MiniGamePlatform.toast(message); }
    public vibrateShort(): void { MiniGamePlatform.vibrateShort(); }
    public jumpGame(appId: string, envVersion?: string): void { MiniGamePlatform.navigateToMiniGame(appId, envVersion); }
    public loadSubpackage(names: string[], callback?: () => void): void { MiniGamePlatform.loadSubpackages(names || [], callback || (() => undefined)); }

    // Shortcuts and legacy analytics were Vivo/OPPO-only. Keep old call sites safe.
    public installShortcut(callback?: () => void): void { callback?.(); }
    public showShortcut(_pos: cc.Vec2): void { /* unsupported on target platforms */ }
    public setStartLevelTime(): void { /* analytics intentionally removed */ }
    public endLevelTime(_level: number): void { /* analytics intentionally removed */ }
    public reportLog(_type: number, _content?: unknown): void { /* analytics intentionally removed */ }
    public durationLog(_seconds: number, _level = 0): void { /* analytics intentionally removed */ }
}
