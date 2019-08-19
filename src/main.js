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

  // This is not present in the compiled code.
  if (process.env.NODE_ENV === 'development') {
    /* eslint-disable no-console */
    const styleHeader1 = [
      'color: white',
      'font-size: 2em',
      'font-family: sans-serif',
      'padding: .2em 0;',
    ];

    const styleHeader2 = [
      'color: gray',
      'font-size: 1.4em',
      'font-style: italic',
      'font-family: sans-serif',
      'padding: .2em 0;',
    ];

    const styleText = [
      'color: white',
      'font-size: 1.2em',
      'font-family: sans-serif',
      'padding: .2em .3em;',
      'background-color: #21C493',
      'border-radius: 3px',
      'margin: .1em 0',
      'border-left: 3px solid #14785A',
    ];

    const styleCode = [
      'font-size: 1.2em',
      'padding: .2em 0;',
    ];

    console.log('%cWelcome to the MyParcel checkout!', styleHeader1.join(';'));
    console.log('%cCheck out README.md for the full documentation.', styleHeader2.join(';'));
    console.log('%cBy default, the checkout is not visible. \n'
      + 'To show it you must provide window.MyParcelConfig with at least the following data:', styleText.join(';'));
    console.log('%cwindow.MyParcelConfig = {\n'
          + '  config: {\n'
          + '    platform: \'belgie\',  \n'
          + '  },\n'
          + '  address: {\n'
          + '    cc: \'BE\',\n'
          + '    city: \'Antwerpen\',\n'
          + '    postalCode: \'1000\',\n'
          + '  }\n'
          + '};', styleCode.join(';'));
    console.log('%cAnd then send an event to tell the checkout to update its data:', styleText.join(';'));
    console.log('%cdocument.dispatchEvent(new Event(\'myparcel_update_checkout\'));', styleCode.join(';'));
    console.log('%c⬇ You can try it right here in your browser console. ⬇', styleText.join(';'));
    /* eslint-enable no-console */
  }
}

window.onload = loadApp;
