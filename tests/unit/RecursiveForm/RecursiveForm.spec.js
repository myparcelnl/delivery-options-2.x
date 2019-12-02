import RecursiveForm from '@/components/RecursiveForm/RecursiveForm';
import { SENDMYPARCEL } from '@/config/data/platformConfig';
import { createDeliveryOptions } from '@/data/delivery/createDeliveryOptions';
import { defaultConfig } from '@/config/data/defaultConfig';
import { mockVue } from '../../mockVue';
import { mount } from '@vue/test-utils';

describe.skip('RecursiveForm.vue', () => {
  let recursiveForm;

  beforeAll(() => {
    recursiveForm = mount(RecursiveForm, {
      localVue: mockVue(defaultConfig(SENDMYPARCEL)),
      propsData: {
        option: {
          name: 'carrier',
          type: 'radio',
          choices: createDeliveryOptions,
        },
      },
    });
  });

  test('getChoicesByDependency()', async() => {
    await recursiveForm.vm._async_computed$chosenOptions;

    expect(recursiveForm.vm._async_computed$chosenOptions).toBe('');
  });
});
