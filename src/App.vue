<template>
  <div>
    <div
      v-if="!hasNothingToShow && $configBus.showCheckout"
      class="myparcel-checkout">
      <loader v-if="loading" />

      <div v-else-if="!$configBus.hasValidAddress">
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
            <li v-text="$configBus.strings.addressNotFound" />
            <li v-text="$configBus.strings.wrongHouseNumberPostcode" />
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
import * as EVENTS from '@/config/data/eventConfig';
import { ALLOW_DELIVERY_OPTIONS, ALLOW_PICKUP_POINTS } from '@/config/data/settingsConfig';
import { DELIVERY, DELIVERY_CARRIER, PICKUP, formConfig } from '@/config/data/formConfig';
import Loader from '@/components/Loader';
import debounce from 'debounce';
import { fetchAllCarriers } from '@/data/carriers/fetchAllCarriers';
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

    /**
     * Quick check if the checkout needs to be showed at all.
     *
     * @returns {Boolean}
     */
    hasNothingToShow() {
      return (!this.$configBus.config[ALLOW_PICKUP_POINTS] && !this.$configBus.config[ALLOW_DELIVERY_OPTIONS])
        || !this.$configBus.hasValidAddress;
    },
  },

  created() {
    this.getCheckout();

    const debounceDelay = 200;

    // todo remove
    for (const eventsKey in EVENTS) {
      document.addEventListener(EVENTS[eventsKey], () => {
        // eslint-disable-next-line no-console
        console.log('document event:', EVENTS[eventsKey]);
      });
    }

    document.addEventListener(EVENTS.UPDATE_CHECKOUT_IN, debounce(() => {
      this.getCheckout();
    }, debounceDelay));

    // Add the new data to the values object
    this.$configBus.$on(EVENTS.UPDATE, this.updateExternalData);

    // Debounce trigger updating the checkout
    this.$configBus.$on(EVENTS.UPDATE, debounce(this.updateExternal, debounceDelay));

    this.$configBus.$on(EVENTS.ERROR, (e) => {
      this.reset();
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.warn('error:', e);
      }
      this.hideCheckout();
    });
  },

  methods: {
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

      this.$configBus.showCheckout = true;
      this.gettingCheckout = true;
      this.reset();

      await fetchAllCarriers();

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
      event.initEvent(EVENTS.UPDATE_CHECKOUT_OUT, true, false);

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
      if (DELIVERY_CARRIER === name && this.$configBus.currentCarrier !== value) {
        this.$configBus.currentCarrier = value;
      }

      this.$configBus.values[name] = value;
      this.externalData = JSON.stringify(this.$configBus.values);

      // Using $nextTick to emit event after this function is done.
      // @see https://forum.vuejs.org/t/do-something-after-emit-has-finished-successful/10663/10
      this.$nextTick(() => {
        this.$configBus.$emit(EVENTS.AFTER_UPDATE, { name, value });
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
