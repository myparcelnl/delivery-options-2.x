<template>
  <div
    v-if="Config.showCheckout"
    class="myparcel-checkout">
    <loader
      v-if="loading"
      :carrier="carrier" />
    <div
      v-else-if="!hasErrors && (hasDeliveryOptions || hasPickupLocations)"
      class="myparcel-checkout__delivery-options">
      <recursive-form
        v-for="option in form.options"
        :key="option.name"
        :option="option" />
      <input
        id="mypa-input"
        :value="externalData"
        hidden>
    </div>

    <div
      v-else
      class="myparcel-checkout__errors">
      <div class="alert alert-danger mt-2">
        Check de volgende errors:
        <ul>
          <li v-text="strings.addressNotFound" />
          <li v-text="strings.wrongHouseNumberPostcode" />
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from './components/Loader';
import { appConfig } from './config/appConfig';
import { configBus } from './config/configBus';
import debounce from 'debounce';
import { CARRIER_POSTNL } from './config/formConfig';
import { fetchCarrierData } from './data/carriers/fetchCarriers';
import { fetchDeliveryOptions } from './data/delivery/fetchDeliveryOptions';
import { fetchPickupOptions } from './data/pickup/fetchPickupLocations';
import { getDeliveryOptions } from './data/delivery/getDeliveryOptions';
import { getPickupLocations } from './data/pickup/getPickupLocations';

export default {
  name: 'App',
  components: { Loader },

  data() {
    return {
      /**
       * Whether the checkout is loading or not.
       * @type {Boolean}
       */
      loading: true,

      /**
       * Whether there are errors causing the checkout not to show or not.
       *
       * @type {Object}
       */
      errors: {},

      /**
       * The form object which will be filled with all checkout fields and options.
       *
       * @type {Object}
       */
      form: {},

      carrier: null,

      /**
       * Delivery options array from the API.
       *
       * @type {Array}
       */
      deliveryOptions: [],

      /**
       * Pickup options array from the API.
       *
       * @type {Array}
       */
      pickupLocations: [],

      /**
       * The object that will be converted to a JSON string and put in `#mypa-input`.
       *
       * @type {String}
       */
      externalData: null,
    };
  },

  computed: {
    Config: () => configBus,
    config: () => configBus.config,
    strings: () => configBus.textToTranslate,
    showCheckout: () => configBus.showCheckout,

    hasErrors() {
      return Object.keys(this.errors).length;
    },

    hasPickupLocations() {
      return Object.keys(this.pickupLocations).length;
    },

    hasDeliveryOptions() {
      return Object.keys(this.deliveryOptions).length;
    },

    pickupPoints() {
      return this.pickupLocations ? this.pickupLocations.map((option) => option.date) : null;
    },
  },

  created() {
    this.getCheckout();

    // Add the new data to the values object
    configBus.$on('update', this.updateExternalData);

    // Debounce trigger updating the checkout
    configBus.$on('update', debounce(this.updateExternal, 300));
  },

  methods: {
    /**
     * FetchCarriers.
     *
     * @param {Number|String} carrier - Carrier id or name.
     *
     * @returns {Promise}
     */
    async fetchCarrier(carrier = configBus.config.carriers.split(',')[0]) {
      const {
        response: carriers,
        errors: carriersErrors,
      } = await fetchCarrierData(carrier);

      this.addErrors('carriers', carriersErrors);
      configBus.carrierData = [...new Set([...configBus.carrierData, ...carriers]).values()];
      this.carrier = configBus.carrierData;
    },

    /**
     * FetchDeliveryOptions.
     *
     * @returns {Promise}
     */
    async fetchDeliveryOptions() {
      const {
        response: deliveryOptions,
        errors: deliveryOptionsErrors,
      } = await fetchDeliveryOptions();

      this.addErrors('deliveryOptions', deliveryOptionsErrors);
      this.deliveryOptions = deliveryOptions;
    },

    /**
     * TODO: awaiting https://jira.dmp.zone/browse/MY-13194.
     * FetchPickupLocations.
     *
     * @returns {Promise}
     */
    async fetchPickupLocations() {
      const url = new URL(`${appConfig.apiUrl}/deliveryoptions/pickup`);
      const requestParams = configBus.getRequestParameters();

      Object.keys(requestParams).forEach((param) => {
        url.searchParams.append(param, requestParams[param]);
      });

      const pickupOptions = await (await fetch(url.href)).json();

      // const {
      //   response: pickupOptions,
      //   errors: pickupLocationsErrors,
      // } = await fetchPickupOptions();

      // this.addErrors('pickupLocations', pickupLocationsErrors);

      this.pickupLocations = pickupOptions.data.base;
    },

    /**
     * Get the checkout.
     *
     * @returns {Promise}
     */
    async getCheckout() {
      this.reset();
      await this.fetchCarrier();

      configBus.showCheckout = configBus.showCheckout || true;
      configBus.setAddress();

      const requests = [];

      // Get delivery options if enabled
      if (configBus.config.allowDeliveryOptions) {
        requests.push(this.fetchDeliveryOptions());
      }

      // Get pickup locations if enabled
      if (configBus.config.allowPickupPoints) {
        requests.push(this.fetchPickupLocations());
      }

      // Do all requests asynchronously
      await Promise.all(requests);

      if (!this.hasErrors) {
        const choices = [];

        if (this.hasDeliveryOptions) {
          choices.push(getDeliveryOptions(this.deliveryOptions));
        }

        if (this.hasPickupLocations) {
          choices.push(getPickupLocations(this.pickupLocations));
        }

        if (choices.length) {
          this.form = {
            options: [
              {
                name: 'delivery',
                type: 'radio',
                choices,
              },
            ],
          };
        } else {
          console.log('nothing, hiding checkout');
          this.hideCheckout();
        }
      }

      this.loading = false;
    },

    /**
     * Hide the checkout completely.
     */
    hideCheckout() {
      configBus.showCheckout = false;
    },

    /**
     * Trigger an update on the checkout. Throttled to avoid overloading the external platform with updates.
     */
    updateExternal() {
      const event = document.createEvent('HTMLEvents');
      event.initEvent('update_checkout', true, false);

      document.querySelector('body').dispatchEvent(event);
    },

    /**
     * Updates the configBus and the #mypa-input element with the new checkout data.
     *
     * @param {Object} data - Data object. Can only contain properties `name` and `value`.
     */
    updateExternalData(data) {
      configBus.values[data.name] = data.value;
      this.externalData = JSON.stringify(configBus.values);
    },

    /**
     * Reset all data.
     */
    reset() {
      configBus.values = {};
      this.loading = true;
      this.errors = {};
      this.deliveryOptions = [];
      this.pickupLocations = [];
    },

    /**
     * Add errors to `this.errors` under a given key, if there are any.
     *
     * @param {string} key - Key to add to errors object.
     * @param {Object} errors - Errors to add.
     */
    addErrors(key, errors) {
      this.errors = Object.keys(errors).length
        ? { ...this.errors, [key]: errors }
        : this.errors;
    },
  },
};
</script>
