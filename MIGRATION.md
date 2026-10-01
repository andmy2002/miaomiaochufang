# Cocos Creator 3.8.8 migration

This project is being migrated from Cocos Creator 2.4.13.

The original 2.x source assets remain in place until their 3.x replacements have
been visually verified. New 3.x scenes use the `.scene` extension and are kept
under `assets/scenes`. The legacy `.fire` files are retained only as migration
references and must not be assigned as build start scenes.

Migration order: boot scene, resource/audio services, gameplay scene, popups,
then platform SDK adapters. Platform-specific advertising code is isolated from
the web-preview path while it is being ported.

## Mini-game targets

The only release targets are WeChat Mini Game and ByteDance Mini Game. The
former Vivo/OPPO `qg` advertising SDK has been removed. Set the three ad-unit
IDs for each target in `assets/Script/Platform/PlatformAdConfig.ts` before
uploading a production build. With empty IDs the game remains playable and ads
are intentionally skipped in editor and web preview.
