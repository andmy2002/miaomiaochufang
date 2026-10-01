import { MiniGameAdConfig } from "./MiniGamePlatform";

/** Replace empty values with production ad-unit IDs before release. */
export const PLATFORM_AD_UNITS: Record<"wechat" | "bytedance", MiniGameAdConfig> = {
    wechat: { banner: "", interstitial: "", rewardedVideo: "" },
    bytedance: { banner: "", interstitial: "", rewardedVideo: "" },
};
