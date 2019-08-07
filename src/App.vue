<template>
  <div>
    <div
      v-if="$configBus.showCheckout"
      class="myparcel-checkout">
      <loader v-if="loading" />

      <Errors v-else-if="hasErrors || $configBus.hasErrors" />

      <div
        v-else
        class="myparcel-checkout__delivery-options">
        <recursive-form
          v-for="option in form.options"
          :key="option.name"
          :option="option" />
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
import Errors from '@/Errors';
import Loader from '@/components/Loader';
import debounce from 'debounce';
import { fetchAllCarriers } from '@/data/carriers/fetchAllCarriers';
import { getDeliveryOptions } from '@/data/delivery/getDeliveryOptions';
import { getPickupLocations } from '@/data/pickup/getPickupLocations';

export default {
  name: 'App',
  components: { Errors, Loader },

  data() {
    return {
      /**
       * TODO: Remove. This is a temporary solution to be able to debug the configBus with Vue DevTools.
       */
      configBus: this.$configBus,

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
      if (!this.$configBus.hasValidAddress) {
        this.hideCheckout();
        return;
      }

      const map = {
        [DELIVERY]: getDeliveryOptions(),
        [PICKUP]: getPickupLocations(),
      };

      const choices = Object.keys(map).map((setting) => {
        if (this.$configBus.isEnabled(formConfig[setting])) {
          return map[setting];
        }
      });

      if (!choices.length) {
        this.hideCheckout();
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
     * Show the checkout, getting all necessary data in the process..
     *
     * @returns {Promise}
     */
    async getCheckout() {
      this.$configBus.setAddress();

      console.log(this.$configBus.address);
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
      const event2 = new Event(EVENTS.UPDATE_CHECKOUT_OUT);

      console.log({ event2 });
      document.querySelector('body').dispatchEvent(event2);
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
