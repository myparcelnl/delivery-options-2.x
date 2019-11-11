import { DEFAULT_PLATFORM, MYPARCEL, SENDMYPARCEL } from '@/config/data/platformConfig';
import { defaultAddress, getConfigBus } from './testConfig';
import { getDefaultRequestParameters } from '@/data/request/getDefaultRequestParameters';

let configBus = getConfigBus(DEFAULT_PLATFORM);

describe('getting default request parameters', () => {

  test('gets the correct default parameters', () => {
    expect(getDefaultRequestParameters())
      .toEqual({
        carrier: 'postnl',
        include: 'shipment_options',
        platform: DEFAULT_PLATFORM,
      });
  });

  test('removes undefined parameters', () => {
    configBus = getConfigBus(MYPARCEL, {
      config: {
        carriers: ['postnl'],
      },
      address: {
        ...defaultAddress[MYPARCEL],
        postalCode: undefined,
      },
    });

    configBus.$data.currentCarrier = 'postnl';

    expect(getDefaultRequestParameters())
      .toEqual({
        carrier: 'postnl',
        cc: 'nl',
        include: 'shipment_options',
        number: 66,
        platform: 'myparcel',
      });
  });

  test('removes city from parameters when carrier is dpd', () => {
    configBus = getConfigBus(SENDMYPARCEL, {
      config: {
        carriers: ['bpost', 'dpd'],
      },
      address: defaultAddress[SENDMYPARCEL],
    });

    configBus.$data.currentCarrier = 'dpd';

    expect(getDefaultRequestParameters())
      .toEqual({
        carrier: 'dpd',
        cc: 'be',
        include: 'shipment_options',
        number: 16,
        platform: 'belgie',
        postal_code: '2000',
      });
  });
});
