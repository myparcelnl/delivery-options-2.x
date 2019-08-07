import '@/assets/scss/style.scss';
import App from '@/App.vue';
import AsyncComputed from 'vue-async-computed';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import RecursiveForm from '@/components/RecursiveForm';
import Vue from 'vue';
import { configBus } from '@/config/configBus';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons/faAngleDown';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { library } from '@fortawesome/fontawesome-svg-core';

library.add(faAngleDown, faTimes);

Vue.use(AsyncComputed);

Vue.component('font-awesome-icon', FontAwesomeIcon);
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
 * Load the app.
 */
function loadApp() {
  window.MyParcel = new Vue({
    render: (h) => h(App),
  }).$mount('#myparcel-checkout');

  const app = window.MyParcel.$children[0];

  /**
   * Get the checkout.
   *
   * @deprecated Since v4.0.0. Use event: `myparcel_update_checkout` instead.
   *
   * @type {function}
   */
  window.MyParcel.callDeliveryOptions = app.getCheckout;

  /**
   * Hide the checkout.
   *
   * @deprecated Since v4.0.0.
   *
   * @type {function}
   */
  window.MyParcel.hideAllDeliveryOptions = app.hideCheckout;

  /**
   * Show the checkout. Does the same as getCheckout because it's no longer needed.
   *
   * @deprecated Since v4.0.0. Use event: `myparcel_update_checkout` instead.
   *
   * @type {function}
   */
  window.MyParcel.showAllDeliveryOptions = app.getCheckout;
}

window.onload = loadApp;
