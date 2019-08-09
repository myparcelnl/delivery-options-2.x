import '@/assets/scss/style.scss';
import '@/services/fontAwesome';
import App from '@/App.vue';
import AsyncComputed from 'vue-async-computed';
import RecursiveForm from '@/components/RecursiveForm';
import Vue from 'vue';
import { configBus } from '@/config/configBus';

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
 * Set the configBus as a global property in the entire application.
 *
 * @type {Vue}
 */
Vue.prototype.$configBus = configBus;

Vue.config.productionTip = false;
Vue.config.devtools = process.env.NODE_ENV === 'development';

/**
 * Load the application.
 */
function loadApp() {
  console.log('checkout loaded');
  const instance = new Vue({
    render: (createElement) => createElement(App),
  }).$mount('#myparcel-checkout');

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

window.onload = loadApp;
