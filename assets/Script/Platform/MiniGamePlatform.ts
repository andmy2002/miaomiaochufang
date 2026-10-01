/** Thin bridge for WeChat and ByteDance mini-game APIs. */
import { PLATFORM_BRAND } from "./PlatformBrandConfig";
export type MiniGameKind = "wechat" | "bytedance" | "web";

export interface MiniGameAdConfig {
    banner: string;
    interstitial: string;
    rewardedVideo: string;
}

export class MiniGamePlatform {
    private static bannerAd: any;
    private static interstitialAd: any;
    private static rewardedVideoAd: any;
    private static pendingReward: { success: () => void; failure?: () => void } | null = null;
    private static shareConfigured = false;

    public static get kind(): MiniGameKind {
        if ((globalThis as any).wx) return "wechat";
        if ((globalThis as any).tt) return "bytedance";
        return "web";
    }

    private static get api(): any { return (globalThis as any).wx || (globalThis as any).tt || null; }
    public static init(onReady?: (success: boolean) => void): void {
        this.configureShare();
        onReady?.(true);
    }

    private static configureShare(): void {
        const api = this.api;
        if (!api || this.shareConfigured) return;
        this.shareConfigured = true;
        api.showShareMenu?.(this.kind === "wechat" ? { withShareTicket: false } : undefined);
        if (this.kind === "wechat") {
            api.onShareAppMessage?.(() => ({
                title: PLATFORM_BRAND.title,
                imageUrl: PLATFORM_BRAND.wechatShareImage,
            }));
        } else if (this.kind === "bytedance") {
            api.onShareAppMessage?.(() => ({
                title: PLATFORM_BRAND.title,
                desc: PLATFORM_BRAND.shareDescription,
                ...(PLATFORM_BRAND.bytedanceShareTemplateId
                    ? { templateId: PLATFORM_BRAND.bytedanceShareTemplateId }
                    : {}),
            }));
        }
    }

    public static showBanner(config: MiniGameAdConfig): void {
        const api = this.api;
        if (!api || !config.banner) return;
        if (!this.bannerAd) {
            this.bannerAd = api.createBannerAd?.({ adUnitId: config.banner, style: { left: 0, top: 0, width: 300 } });
            this.bannerAd?.onError?.((error: unknown) => console.warn("Banner 广告加载失败", error));
        }
        this.bannerAd?.show?.().catch?.((error: unknown) => console.warn("Banner 广告展示失败", error));
    }
    public static hideBanner(): void { this.bannerAd?.hide?.(); }

    public static showInterstitial(config: MiniGameAdConfig): void {
        const api = this.api;
        if (!api || !config.interstitial) return;
        if (!this.interstitialAd) {
            this.interstitialAd = api.createInterstitialAd?.({ adUnitId: config.interstitial });
            this.interstitialAd?.onError?.((error: unknown) => console.warn("插屏广告加载失败", error));
        }
        this.interstitialAd?.show?.().catch?.((error: unknown) => console.warn("插屏广告展示失败", error));
    }

    public static showRewardedVideo(config: MiniGameAdConfig, onReward: () => void, onFailure?: () => void): void {
        const api = this.api;
        if (!api || !config.rewardedVideo) { onFailure?.(); return; }
        if (this.pendingReward) { onFailure?.(); return; }
        if (!this.rewardedVideoAd) {
            this.rewardedVideoAd = api.createRewardedVideoAd?.({ adUnitId: config.rewardedVideo });
            this.rewardedVideoAd?.onError?.((error: unknown) => {
                console.warn("激励视频加载失败", error);
                this.finishReward(false);
            });
            this.rewardedVideoAd?.onClose?.((result: { isEnded?: boolean } | undefined) => {
                this.finishReward(result?.isEnded !== false);
            });
        }
        if (!this.rewardedVideoAd) { onFailure?.(); return; }
        this.pendingReward = { success: onReward, failure: onFailure };
        try {
            Promise.resolve(this.rewardedVideoAd.show()).catch(() => {
                if (!this.pendingReward) return;
                if (!this.rewardedVideoAd.load) { this.finishReward(false); return; }
                Promise.resolve(this.rewardedVideoAd.load())
                    .then(() => this.rewardedVideoAd.show())
                    .catch(() => this.finishReward(false));
            });
        } catch (error) {
            console.warn("激励视频展示失败", error);
            this.finishReward(false);
        }
    }
    private static finishReward(completed: boolean): void {
        const pending = this.pendingReward;
        this.pendingReward = null;
        if (!pending) return;
        if (completed) pending.success(); else pending.failure?.();
    }
    public static toast(message: string): void { this.api?.showToast?.({ title: message, icon: "none" }); }
    public static vibrateShort(): void { this.api?.vibrateShort?.(); }
    public static navigateToMiniGame(appId: string, envVersion?: string): void { this.api?.navigateToMiniProgram?.({ appId, envVersion }); }
    public static loadSubpackages(names: string[], done: () => void): void {
        const api = this.api;
        if (!api?.loadSubpackage || names.length === 0) { done(); return; }
        let remaining = names.length;
        names.forEach((name) => api.loadSubpackage({ name, success: () => { if (--remaining === 0) done(); }, fail: () => { if (--remaining === 0) done(); } }));
    }
}
