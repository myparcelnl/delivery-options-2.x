import RecursiveForm from '@/delivery-options/components/RecursiveForm/RecursiveForm';
import { SENDMYPARCEL } from '@/data/keys/platformKeys';
import { defaultConfig } from '@/config/defaultConfig';
import { mockVue } from '../mockVue';
import { mount } from '@vue/test-utils';

describe('RecursiveForm.vue', () => {
  let component;

  beforeAll(() => {
    component = mount(RecursiveForm, {
      localVue: mockVue(defaultConfig(SENDMYPARCEL)),
      propsData: {
        option: {
          name: 'carrier',
          type: 'radio',
          choices: [],
        },
      },
    });
  });

  it('correctly formats prices', () => {
    const { formatPrice } = component.vm;
    // The spaces in the expected strings are non-breaking spaces.
    expect(formatPrice(0)).toBe('€ 0,00');
    expect(formatPrice(100)).toBe('€ 100,00');
    expect(formatPrice(24.50)).toBe('€ 24,50');
  });
});
