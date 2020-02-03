import { DEFAULT_PLATFORM, MYPARCEL } from '@/config/data/platformConfig';
import { defaultAddress, mockConfigBus } from '../mockConfigBus';
import { CARRIER_SETTINGS } from '@/config/data/settingsConfig';
import { getDefaultRequestParameters } from '@/data/request/getDefaultRequestParameters';

let configBus = mockConfigBus();

describe('request parameters', () => {
  test('gets the correct default parameters', () => {
    const configBus = mockConfigBus({ address: {} });
    configBus.currentCarrier = Object.keys(configBus.get(CARRIER_SETTINGS))[0];

    expect(getDefaultRequestParameters()).toEqual({
      carrier: 'postnl',
      include: 'shipment_options',
      platform: DEFAULT_PLATFORM,
    });
  });

  test('removes undefined parameters', () => {
    const { postalCode, ...address } = defaultAddress[MYPARCEL];
    configBus = mockConfigBus({ address });
    configBus.$data.currentCarrier = 'postnl';

    expect(getDefaultRequestParameters())
      .toEqual({
        carrier: 'postnl',
        include: 'shipment_options',
        platform: MYPARCEL,
        ...address,
      });
  });
});
