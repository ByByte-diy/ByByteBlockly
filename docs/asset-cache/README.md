# Asset cache module

Уніфікований кеш завантажуваних bundle (WASM зараз; locales/media — майбутнє).

## Код

```
src/app/modules/asset-cache/
  asset-cache.module.ts
  config/asset-cache.config.ts
  models/asset-cache.model.ts
  services/
    asset-cache.service.ts
    asset-cache-manifest.service.ts
    asset-cache-registry.service.ts
    asset-cache-store.ts
```

## Підключення

`AppModule` імпортує `AssetCacheModule` один раз.

Platform consumers (наприклад `WasmAssetProvider` у `platform/web/`) інжектять сервіси з `@modules/asset-cache`.

## Manifest

- Build: `src/assets/cache-manifest.json` — `generate-catalog.mjs` (`generateCacheManifest`)
- Runtime: `AssetCacheRegistry.validate()` на boot; `ensureBundleValid()` перед compile

Деталі WASM: [compile-upload/wasm-avr-assets.md](../compile-upload/wasm-avr-assets.md). Production deploy: [deploy/README.md](../../deploy/README.md).
