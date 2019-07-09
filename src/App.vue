<template>
  <div>
    <div
      v-if="$configBus.showCheckout"
      class="myparcel-checkout">
      <loader
        v-if="loading"
        :carriers="carriers" />

      <div
        v-else-if="!$configBus.hasErrors"
        class="myparcel-checkout__delivery-options">
        <recursive-form
          v-for="option in form.options"
          :key="option.name"
          :option="option" />
      </div>

      <div
        v-else
        class="myparcel-checkout__errors">
        <div class="alert alert-danger mt-2">
          Check de volgende errors:
          <ul>
            <template v-for="(errorData, type) in $configBus.errors">
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
    <input
      id="mypa-input"
      :value="externalData"
      hidden>
  </div>
</template>

<script>
import Loader from '@/components/Loader';
import { appConfig } from '@/config/appConfig';
import debounce from 'debounce';
import { fetchCarrierData } from '@/data/carriers/fetchCarriers';
import { fetchDeliveryOptions } from '@/data/delivery/fetchDeliveryOptions';
import { getDeliveryOptions } from '@/data/delivery/getDeliveryOptions';
import { getPickupLocations } from '@/data/pickup/getPickupLocations';

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
    config() {
      return this.$configBus.config;
    },
    strings() {
      return this.$configBus.textToTranslate;
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
    this.$configBus.$on('update', this.updateExternalData);

    // Debounce trigger updating the checkout
    this.$configBus.$on('update', debounce(this.updateExternal, 300));
  },

  methods: {
    /**
     * FetchCarriers.
     *
     * @returns {Promise}
     */
    async fetchCarriers() {
      const carriersToFetch = this.config.carriers;
      const requests = [];

      carriersToFetch.forEach((carrier) => {
        requests.push(fetchCarrierData(carrier));
      });

      let errors = [], responses = [];
      const carriers = (await Promise.all(requests)).reduce((acc, response) => {
        errors = [...errors, ...response.errors];
        responses = [...responses, ...response.response];

        return { ...acc, errors, responses };
      }, {});

      this.$configBus.addErrors('carriers', carriers.errors);

      const unique = new Set(carriers.responses.map((obj) => JSON.stringify(obj)));
      this.$configBus.carrierData = Array.from(unique).map((obj) => JSON.parse(obj));

      this.$configBus.currentCarrier = this.$configBus.carrierData[0].name;

      this.carriers = this.$configBus.carrierData;
    },

    /**
     * FetchDeliveryOptions.
     *
     * @param {String|Number} carrier - Carrier name or id.
     *
     * @returns {Promise}
     */
    async fetchDeliveryOptions(carrier = this.$configBus.currentCarrier) {
      this.deliveryOptions = (await fetchDeliveryOptions(carrier)).response;
      // const {
      //   response: deliveryOptions,
      //   errors: deliveryOptionsErrors,
      // } = await fetchDeliveryOptions(carrier);
      //
      // configBus.addErrors('deliveryOptions', deliveryOptionsErrors);
      // this.deliveryOptions = deliveryOptions;
    },

    /**
     * TODO: awaiting https://jira.dmp.zone/browse/MY-13194.
     * FetchPickupLocations.
     *
     * @returns {Promise}
     */
    async fetchPickupLocations() {
      const url = new URL(`${appConfig.apiUrl}/deliveryoptions/pickup`);
      const requestParams = this.$configBus.getRequestParameters();

      Object.keys(requestParams).forEach((param) => {
        url.searchParams.append(param, requestParams[param]);
      });

      const pickupOptions = await (await fetch(url.href)).json();

      // const {
      //   response: pickupOptions,
      //   errors: pickupLocationsErrors,
      // } = await fetchPickupOptions();

      // configBus.addErrors('pickupLocations', pickupLocationsErrors);

      this.pickupLocations = pickupOptions.data.base;
    },

    /**
     * Get the checkout.
     *
     * @returns {Promise}
     */
    async getCheckout() {
      const choices = [];
      this.reset();
      await this.fetchCarriers();

      this.$configBus.showCheckout = this.$configBus.showCheckout || true;
      this.$configBus.setAddress();

      // const requests = [];
      //
      // // Get delivery options if enabled
      // if (configBus.config.allowDeliveryOptions) {
      //   // requests.push(this.fetchDeliveryOptions());
      // }
      //
      // // Get pickup locations if enabled
      // if (configBus.config.allowPickupPoints) {
      //   // requests.push(this.fetchPickupLocations());
      // }
      //
      // // Do all requests asynchronously
      // await Promise.all(requests);

      if (!this.hasErrors) {
        if (this.config.allowDeliveryOptions) {
          choices.push(getDeliveryOptions());
        }

        if (this.config.allowPickupPoints) {
          choices.push(getPickupLocations());
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
      this.$configBus.showCheckout = false;
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
      // ignore loading
      if (data.name === 'loading') {
        return;
      }

      if (data.name === 'deliveryCarrier' && data.value !== this.$configBus.currentCarrier) {
        this.$configBus.currentCarrier = data.value;
        this.fetchDeliveryOptions();
      }

      this.$configBus.values[data.name] = data.value;
      this.externalData = JSON.stringify(this.$configBus.values);
    },

    /**
     * Reset all data.
     */
    reset() {
      this.$configBus.values = {};
      this.$configBus.errors = {};
      this.loading = true;
      this.deliveryOptions = [];
      this.pickupLocations = [];
    },
  },
};
</script>
