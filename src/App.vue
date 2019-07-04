<template>
  <div
    v-if="configBus.showCheckout"
    class="myparcel-checkout">
    <loader
      v-if="loading"
      :carriers="carriers" />

    <!--hasDeliveryOptions || hasPickupLocations-->
    <div
      v-else-if="!hasErrors"
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
          <template v-for="(errorData, type) in errors">
            <li
              v-for="error in errorData.errors"
              :key="type + '_' + error.code"
              v-text="error.message" />
          </template>
        </ul>
        <hr>
        Of:
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
import { fetchCarrierData } from './data/carriers/fetchCarriers';
import { fetchDeliveryOptions } from './data/delivery/fetchDeliveryOptions';
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

      /**
       * Array of carriers. Synchronized with configBus.carriers.
       *
       * @type {Array}
       */
      carriers: [],

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
    configBus: () => configBus,
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
     * @returns {Promise}
     */
    async fetchCarriers() {
      const carriersToFetch = configBus.config.carriers;
      const requests = [];

      carriersToFetch.forEach((carrier) => {
        requests.push(fetchCarrierData(carrier));
      });

      let errors = [], responses = [];
      const carriers = (await Promise.all(requests)).reduce((acc, response) => {
        console.log(response);
        errors = [...errors, ...response.errors];
        responses = [...responses, ...response.response];

        return { ...acc, errors, responses };
      }, {});

      this.addErrors('carriers', carriers.errors);

      const unique = new Set(carriers.responses.map((obj) => JSON.stringify(obj)));
      configBus.carrierData = Array.from(unique).map((obj) => JSON.parse(obj));

      configBus.currentCarrier = configBus.carrierData[0].name;

      console.log('configBus.carrierData', configBus.carrierData);
      this.carriers = configBus.carrierData;
    },

    /**
     * FetchDeliveryOptions.
     *
     * @param {string|number} carrier - Carrier name or id.
     *
     * @returns {Promise}
     */
    async fetchDeliveryOptions(carrier = configBus.currentCarrier) {
      const {
        response: deliveryOptions,
        errors: deliveryOptionsErrors,
      } = await fetchDeliveryOptions(carrier);

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
      await this.fetchCarriers();

      configBus.showCheckout = configBus.showCheckout || true;
      configBus.setAddress();

      const requests = [];

      // Get delivery options if enabled
      if (configBus.config.allowDeliveryOptions) {
        // requests.push(this.fetchDeliveryOptions());
      }

      // Get pickup locations if enabled
      if (configBus.config.allowPickupPoints) {
        // requests.push(this.fetchPickupLocations());
      }

      // Do all requests asynchronously
      await Promise.all(requests);

      if (!this.hasErrors) {
        const choices = [];

        if (configBus.config.allowDeliveryOptions) {
          choices.push(getDeliveryOptions(this.deliveryOptions));
        }

        if (configBus.config.allowPickupPoints) {
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
      if (data.name === 'deliveryCarrier' && data.value !== configBus.currentCarrier) {
        configBus.currentCarrier = data.value;
        console.log('fetching carrier', data.value);
        this.fetchDeliveryOptions();
      }

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
      console.log(errors);
      console.log(this.errors);
      this.errors = Object.keys(errors).length
        ? { ...this.errors, [key]: errors }
        : this.errors;
    },
  },
};
</script>
