import { defaultConfig } from '@/config/data/defaultConfig';
import { SENDMYPARCEL } from '@/config/data/platformConfig';
import { createConfigBus } from '@/config/configBus';

/**
 * @param config
 */
export function createMockConfigBus(config = defaultConfig(SENDMYPARCEL)) {
  window.MyParcelConfig = config;
  return createConfigBus();
}
