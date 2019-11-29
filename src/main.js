import '@/assets/scss/style.scss';
import '@/services/polyfills';
import '@/services/fontAwesome';
import '@/services/directives';
import { MYPARCEL, SENDMYPARCEL } from '@/config/data/platformConfig';
import { RENDER_DELIVERY_OPTIONS, UPDATE_DELIVERY_OPTIONS } from '@/config/data/eventConfig';
import App from '@/App.vue';
import AsyncComputed from 'vue-async-computed';
import RecursiveForm from '@/components/RecursiveForm/RecursiveForm';
import Vue from 'vue';
import { createConfigBus } from '@/config/configBus';
import { defaultAddress } from '../tests/mockConfigBus';
import { defaultConfig } from '@/config/data/defaultConfig';
import { showDeveloperInfo } from '@/services/showDeveloperInfo';

/**
 * Load the application.
 *
 * @param {CustomEvent} event - Optional event.
 */
function loadApp(event) {
  if (event instanceof CustomEvent) {
    window.MyParcelConfig = event.detail;
  }

  /**
   * Only let update_delivery_options render it the first time. Use render_delivery_options after to reload the app.
   */
  document.removeEventListener(UPDATE_DELIVERY_OPTIONS, loadApp);

  /**
   * Async computed properties plugin.
   *
   * @see https://github.com/foxbenjaminfox/vue-async-computed
   */
  Vue.use(AsyncComputed);

  /**
   * Register a component globally so it's available in all templates.
   *
   * @see https://vuejs.org/v2/guide/components.html#Organizing-Components
   */
  Vue.component('recursive-form', RecursiveForm);

  /**
   * Create the config bus and set it as a global property in the entire application.
   */
  Vue.prototype.$configBus = createConfigBus();

  /**
   * Set the base class as global attribute.
   *
   * @type {String}
   *
   * @see https://stackoverflow.com/questions/50828904/using-environment-variables-with-vue-js
   */
  Vue.prototype.$classBase = process.env.VUE_APP_CLASS_BASE;

  /**
   * Create the Vue instance.
   */
  new Vue({
    render: (createElement) => createElement(App),
  }).$mount(`#${Vue.prototype.$classBase}`);
}

// This is not present in the compiled code.
if (process.env.NODE_ENV === 'development' && !window.hasOwnProperty('MyParcelConfig')) {
  window.onload = showDeveloperInfo;
}

document.addEventListener(RENDER_DELIVERY_OPTIONS, loadApp);
document.addEventListener(UPDATE_DELIVERY_OPTIONS, loadApp);
