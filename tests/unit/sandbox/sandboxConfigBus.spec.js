import * as CONFIG from '@/data/keys/configKeys';
import { MYPARCEL, SENDMYPARCEL } from '@/data/keys/platformKeys';
import { sandboxConfigBus } from '@/sandbox/sandboxConfigBus';

describe('sandboxConfigBus', () => {
  it('is a renderless Vue instance', () => {
    expect(sandboxConfigBus._isVue).toBe(true);
    expect(sandboxConfigBus.render).toBeFalsy();
  });

  it('updates settings by path correctly', () => {
    const currencyPath = [SENDMYPARCEL, CONFIG.KEY, CONFIG.CURRENCY].join('.');

    expect(sandboxConfigBus.getSetting(currencyPath)).toBe('EUR');

    sandboxConfigBus.update({ name: currencyPath, value: 'JPY' });

    expect(sandboxConfigBus.getSetting(currencyPath)).toBe('JPY');
  });

  it('can switch platforms', () => {
    expect(sandboxConfigBus.platform).toBe(SENDMYPARCEL);
    sandboxConfigBus.setPlatform(MYPARCEL);
    expect(sandboxConfigBus.platform).toBe(MYPARCEL);
  });
});
