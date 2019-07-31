import { configBus } from '@/config/configBus';
import { defaultConfig } from '@/config/defaultConfig';
import { fakeConfig } from '../fakeConfig';

Object.defineProperty(window, 'MyParcelConfig', defaultConfig);

const settingCases = [
  'allowDeliveryOptions',
  'allowEveningDelivery',
  'allowMorningDelivery',
  'allowOnlyRecipient',
  'allowPickupExpress',
  'allowPickupPoints',
  'allowSignature',
];

describe('configBus', () => {
  it('is a Vue instance', () => {
    expect(configBus._isVue).toBe(true);
    expect(configBus.render).toBeFalsy();
  });

  it('formats distances', () => {
    expect(configBus.formatDistance(0)).toBe('0m');
    expect(configBus.formatDistance(100)).toBe('100m');
    expect(configBus.formatDistance(2450)).toBe('2,5km');
    expect(configBus.formatDistance(10210)).toBe('10,2km');
  });

  it('formats prices', () => {
    expect(configBus.formatPrice(0)).toBe('€0.00');
    expect(configBus.formatPrice(100)).toBe('€100.00');
    expect(configBus.formatPrice(24.50)).toBe('€24.50');
  });

  it.each(settingCases)('enables %p by default', (arg) => {
    expect(configBus.isEnabled({ enabled: arg })).toBe(true);
  });
});
