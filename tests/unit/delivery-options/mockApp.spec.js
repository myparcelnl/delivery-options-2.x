import Vue from 'vue';
import { Wrapper } from '@vue/test-utils';
import { configBus } from '@/delivery-options/config/configBus';
import { defaultConfiguration } from '@/config/defaultConfiguration';
import { mockApp } from './mockApp';

describe('app mocking', () => {
  let app;

  test('sets up the default config correctly', async() => {
    app = await mockApp();

    expect(app).toBeInstanceOf(Wrapper);
    expect(configBus).toBeInstanceOf(Vue);

    const { config, strings } = configBus;

    expect({ config, strings, address: {} }).toEqual(defaultConfiguration());
  });
});
