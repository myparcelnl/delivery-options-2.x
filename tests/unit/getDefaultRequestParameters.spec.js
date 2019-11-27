import { DEFAULT_PLATFORM, MYPARCEL, SENDMYPARCEL } from '@/config/data/platformConfig';
import { defaultAddress, mockConfigBus } from '../mockConfigBus';
import { getDefaultRequestParameters } from '@/data/request/getDefaultRequestParameters';

let configBus = mockConfigBus();

describe('request parameters', () => {

  test('gets the correct default parameters', () => {
    mockConfigBus({ address: {} });

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

  test('removes city from parameters when carrier is dpd', () => {
    configBus = mockConfigBus(SENDMYPARCEL, {
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
