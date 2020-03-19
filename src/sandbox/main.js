import '../assets/scss/sandbox/style.scss';
import '@/sandbox/services/fontAwesome';
import '@/delivery-options/services/filters';
import Sandbox from '@/sandbox/Sandbox';
import Vue from 'vue';
import { appConfig } from '@/config/appConfig';
import { configObject } from '@/sandbox/config';
import { getUrl } from '@/config/urlConfig';
import { i18n } from '@/sandbox/services/vue-i18n';
import { isDev } from '@/helpers/environment';
import { sandboxConfigBus } from './sandboxConfigBus';
import { useBootstrap } from '@/sandbox/services/bootstrap';

useBootstrap();

// Set this in advance to be able to load the delivery options later without a config set.
window.MyParcelConfig = {};

Vue.prototype.$appConfig = appConfig;
Vue.prototype.$classBase = process.env.VUE_APP_CLASS_BASE;
Vue.prototype.$config = configObject;
Vue.prototype.$configBus = sandboxConfigBus;
Vue.prototype.$getUrl = getUrl;

Vue.config.performance = isDev;

export const app = new Vue({
  name: 'MyParcelDeliveryOptionsSandbox',
  i18n,
  render: (h) => h(Sandbox),
}).$mount('#app');
