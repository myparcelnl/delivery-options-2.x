import '@/assets/scss/style.scss';
import '@/services/fontAwesome';
import '@/services/directives';
import App from '@/App.vue';
import AsyncComputed from 'vue-async-computed';
import RecursiveForm from '@/components/RecursiveForm';
import { UPDATE_CHECKOUT_IN } from '@/config/data/eventConfig';
import Vue from 'vue';
import { createConfigBus } from '@/config/configBus';
import { showDeveloperInfo } from '@/showDeveloperInfo';

/**
 * Load the application.
 */
function loadApp() {
  document.removeEventListener(UPDATE_CHECKOUT_IN, loadApp);

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
   * The Vue instance.
   */
  const instance = new Vue({
    render: (createElement) => createElement(App),
  }).$mount(`#${Vue.prototype.$classBase}`);

  /**
   * The top level component (the one rendered above).
   */
  const app = instance.$children[0];

  /**
   * The legacy checkout window object.
   *
   * @deprecated Since v4.0.0. Use events instead.
   *
   * @type {{callDeliveryOptions: function, showAllDeliveryOptions: function, hideAllDeliveryOptions: function}}
   */
  window.MyParcel = {
    /**
     * Get the checkout.
     *
     * @deprecated Since v4.0.0. Use event: `myparcel_update_checkout` instead.
     *
     * @type {function}
     */
    callDeliveryOptions: app.getCheckout,

    /**
     * Hide the checkout.
     *
     * @deprecated Since v4.0.0.
     *
     * @type {function}
     */
    hideAllDeliveryOptions: app.hideCheckout,

    /**
     * Show the checkout. Does the same as getCheckout because it's no longer needed.
     *
     * @deprecated Since v4.0.0. Use event: `myparcel_update_checkout` instead.
     *
     * @type {function}
     */
    showAllDeliveryOptions: app.getCheckout,
  };
}

// This is not present in the compiled code.
if (process.env.NODE_ENV === 'development' && !window.hasOwnProperty('MyParcelConfig')) {
  window.onload = showDeveloperInfo;
}

document.addEventListener(UPDATE_CHECKOUT_IN, loadApp);
