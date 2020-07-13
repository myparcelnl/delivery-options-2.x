import '@/assets/scss/delivery-options/style.scss';
import '@/delivery-options/services/polyfills';
import '@/delivery-options/services/fontAwesome';
import '@/delivery-options/services/directives';
import '@/delivery-options/services/filters';
import { RENDER_DELIVERY_OPTIONS, UPDATE_DELIVERY_OPTIONS } from '@/config/eventConfig';
import AsyncComputed from 'vue-async-computed';
import DeliveryOptions from '@/delivery-options/DeliveryOptions';
import RecursiveForm from '@/delivery-options/components/RecursiveForm/RecursiveForm';
import Vue from 'vue';
import { checkSelector } from '@/delivery-options/checkSelector';
import { createConfigBus } from '@/delivery-options/config/configBus';
import { showDeveloperInfo } from '@/delivery-options/showDeveloperInfo';

// This is not present in the compiled code.
if (process.env.NODE_ENV === 'development' && !window.hasOwnProperty('MyParcelConfig')) {
  window.onload = showDeveloperInfo;
}

/**
 * @type {Vue}
 */
let instance;

/**
 * The initial selector the app will try to mount in. It's possible to pass a different selector using CustomEvents.
 *
 * @type {String}
 */
const baseSelector = `#${process.env.VUE_APP_CLASS_BASE}`;

/**
 * Load the application.
 *
 * @param {CustomEvent|Event} event - Event.
 * @param {String} selector - CSS selector of the element to render in.
 */
function loadApp(event, selector = baseSelector) {
  if (event instanceof CustomEvent) {
    window.MyParcelConfig = event.detail;
  }

  selector = checkSelector(event, selector);

  if (!selector) {
    return;
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
  Vue.component('RecursiveForm', RecursiveForm);

  /**
   * Set the base class as global attribute.
   *
   * @type {String}
   *
   * @see https://stackoverflow.com/questions/50828904/using-environment-variables-with-vue-js
   */
  Vue.prototype.$classBase = process.env.VUE_APP_CLASS_BASE;

  renderApp(event, selector);
}

/**
 * Set up the configBus and render the Vue app.
 *
 * @param {CustomEvent|Event} event - Event.
 * @param {String} selector - CSS selector of the element to render in.
 */
function renderApp(event, selector = baseSelector) {
  selector = checkSelector(event, selector);

  if (!selector) {
    return;
  }

  /**
   * Create the config bus and set it as a global property in the entire application.
   */
  Vue.prototype.$configBus = createConfigBus(event);

  /**
   * Create the Vue instance.
   */
  instance = new Vue({
    name: 'MyParcelDeliveryOptions',
    render: (createElement) => createElement(DeliveryOptions),
  }).$mount(selector);
}

document.addEventListener(RENDER_DELIVERY_OPTIONS, loadApp);

/**
 * Rerenders the app by destroying the instance if it already exists before running renderApp().
 *
 * @param {Event} event
 */
function rerenderApp(event) {
  if (instance) {
    instance.$destroy();
  }

  renderApp(event);
}

// Add a v2 for the new behaviour instead of replacing it for compatibility.
document.addEventListener(`${RENDER_DELIVERY_OPTIONS}@v2`, rerenderApp);
document.addEventListener(UPDATE_DELIVERY_OPTIONS, loadApp);
