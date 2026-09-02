import { PlatformPackRegistry } from "./platform-pack.registry";
import { arduinoExtPack } from "./arduino-ext/arduino-ext.pack";
import { escornabotPack } from "./escornabot/escornabot.pack";
import { ottoPack } from "./otto/otto.pack";
import { mrtPack } from "./mrt/mrt.pack";
import { bybytePack } from "./bybyte/bybyte.pack";

export { PlatformPackRegistry } from "./platform-pack.registry";
export type { IPlatformPack } from "./platform-pack.types";
export {
  PLATFORM_BOARDS,
  PLATFORM_PROFILES,
  getPlatformBoards,
  getPlatformProfiles,
} from "./device-catalog";

/**
 * Register platform packs and initialize their categories + blocks.
 */
export function initializePlatformPacks(): void {
  PlatformPackRegistry.register(arduinoExtPack);
  PlatformPackRegistry.register(ottoPack);
  PlatformPackRegistry.register(escornabotPack);
  PlatformPackRegistry.register(mrtPack);
  PlatformPackRegistry.register(bybytePack);

  PlatformPackRegistry.initializeAll();
}
