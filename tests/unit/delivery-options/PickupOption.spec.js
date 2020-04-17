import { BPOST } from '@/data/keys/carrierKeys';
import PickupOption from '@/delivery-options/components/Pickup/PickupOption';
import { SENDMYPARCEL } from '@/data/keys/platformKeys';
import { defaultAddress } from '@/data/defaultAddress';
import { defaultConfiguration } from '@/config/defaultConfiguration';
import { mockVue } from './mockVue';
import { mount } from '@vue/test-utils';

describe('PickupOption.vue', () => {
  let component;

  beforeAll(() => {
    component = mount(PickupOption, {
      localVue: mockVue(defaultConfiguration(SENDMYPARCEL)),
      propsData: {
        // Required prop
        data: {
          name: 'test',
          pickupData: {
            carrier: BPOST,
            address: defaultAddress[SENDMYPARCEL],
          },
        },
      },
    });
  });

  it('formats distances correctly', () => {
    const { formatDistance } = component.vm;
    expect(formatDistance(0)).toBe('0m');
    expect(formatDistance(100)).toBe('100m');
    expect(formatDistance(2450)).toBe('2,5km');
    expect(formatDistance(10210)).toBe('10,2km');
  });
});
