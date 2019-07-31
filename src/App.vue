<template>
  <div>
    <div
      v-if="!hasNothingToShow && $configBus.showCheckout"
      class="myparcel-checkout">
      <loader
        v-if="loading"
        :carriers="carriers" />

      <div v-else-if="!hasAddress">
        Please enter an address
      </div>

      <div
        v-else-if="!hasErrors"
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
    <input
      id="mypa-input"
      :value="externalData"
      hidden>
  </div>
</template>

<script>
import { ALLOW_DELIVERY_OPTIONS, ALLOW_PICKUP_POINTS } from '@/config/settingsConfig';
import { DELIVERY, PICKUP, formConfig } from '@/config/formConfig';
import Loader from '@/components/Loader';
import debounce from 'debounce';
import { fetchCarrierData } from '@/data/carriers/fetchCarriers';
import { getDeliveryOptions } from '@/data/delivery/getDeliveryOptions';
import { getPickupLocations } from '@/data/pickup/getPickupLocations';

export default {
  name: 'App',
  components: { Loader },

  data() {
    return {
      /**
       * Whether the checkout is loading or not.
       *
       * @type {Boolean}
       */
      loading: true,

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
       * The object that will be converted to a JSON string and put in `#mypa-input`.
       *
       * @type {String}
       */
      externalData: null,
    };
  },

  computed: {
    // Explicitly declared to make it reactive
    hasErrors() {
      return this.$configBus.hasErrors;
    },

    errors() {
      return this.$configBus.errors;
    },

    config() {
      return this.$configBus.config;
    },

    strings() {
      return this.$configBus.strings;
    },

    /**
     * Quick check if the checkout needs to be showed at all.
     *
     * @returns {Boolean}
     */
    hasNothingToShow() {
      return !this.config[ALLOW_PICKUP_POINTS] && !this.config[ALLOW_DELIVERY_OPTIONS];
    },

    hasAddress() {
      return !!this.$configBus.address.cc && this.$configBus.address.postalCode && this.$configBus.address.number;
    },
  },

  created() {
    this.getCheckout();

    // Add the new data to the values object
    this.$configBus.$on('update', this.updateExternalData);

    // Debounce trigger updating the checkout
    this.$configBus.$on('update', debounce(this.updateExternal, 300));

    this.$configBus.$on('error', (e) => {
      this.reset();
      this.hideCheckout();
    });
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

      this.$configBus.currentCarrier = this.$configBus.carrierData.length ? this.$configBus.carrierData[0].name : null;

      this.carriers = this.$configBus.carrierData;
    },

    /**
     * Create the checkout form.
     */
    createForm() {
      if (this.hasNothingToShow) {
        this.hideCheckout();
        return;
      }

      const choices = [];

      if (this.$configBus.isEnabled(formConfig[DELIVERY])) {
        choices.push(getDeliveryOptions());
      }

      if (this.$configBus.isEnabled(formConfig[PICKUP])) {
        choices.push(getPickupLocations());
      }

      if (!choices.length) {
        return;
      }

      this.form = {
        options: [
          {
            name: DELIVERY,
            type: 'radio',
            choices,
          },
        ],
      };

    },

    /**
     * Get the checkout.
     *
     * @returns {Promise}
     */
    async getCheckout() {
      this.$configBus.setAddress();

      // Stop multiple getCheckout() calls or don't start loading if there's nothing to load
      if (this.gettingCheckout || this.hasNothingToShow) {
        return;
      }

      this.gettingCheckout = true;
      this.reset();

      await this.fetchCarriers();

      this.$configBus.showCheckout = true;

      this.createForm();

      this.gettingCheckout = false;
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
     * @param {Object} <ObjectPattern> - Destructured update event.
     * @param {String} name - Name of the setting that was updated.
     * @param {*} value - Setting value.
     */
    updateExternalData({ name, value }) {
      if (name === 'deliveryCarrier' && value !== this.$configBus.currentCarrier) {
        this.$configBus.currentCarrier = value;
      }

      this.$configBus.values[name] = value;
      this.externalData = JSON.stringify(this.$configBus.values);

      // Using $nextTick to emit event after this function is done.
      // @see https://forum.vuejs.org/t/do-something-after-emit-has-finished-successful/10663/10
      this.$nextTick(() => {
        this.$configBus.$emit('afterUpdate', { name, value });
      });
    },

    /**
     * Reset checkout data.
     */
    reset() {
      this.$configBus.values = {};
      this.$configBus.errors = {};
      this.loading = true;
    },
  },
};
</script>
