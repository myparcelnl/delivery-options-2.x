<template>
  <div>
    <div
      v-if="showCheckout"
      class="myparcel-checkout">
      <loader v-if="loading" />

      <Errors v-else-if="!hasValidAddress || $configBus.hasErrors" />

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
import { MISSING_ADDRESS } from '@/config/data/errorConfig';
import { addressRequirements } from '@/config/data/platformConfig';
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
       * Whether to show the checkout at all or not.
       */
      showCheckout: false,

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
    /**
     * False if:
     *  - CC is undefined
     *  - Not all properties in addressRequirements for the current CC are present.
     *
     * Otherwise returns true.
     *
     * @returns {boolean}
     */
    hasValidAddress() {
      if (!this.$configBus.address || !this.$configBus.address.cc) {
        return false;
      }

      const cc = this.$configBus.address.cc.toUpperCase();
      const requirements = addressRequirements[addressRequirements.hasOwnProperty(cc) ? cc : 'NL'];
      const doesntMeetRequirements = (item) => {
        return !this.$configBus.address.hasOwnProperty(item) || !this.$configBus.address[item];
      };

      // False if any requirements are not met, true otherwise.
      const valid = !requirements.some((item) => doesntMeetRequirements(item));

      // If invalid, tell the configBus which fields are missing.
      if (!valid) {
        this.$configBus.addErrors(
          MISSING_ADDRESS,
          requirements.filter((item) => doesntMeetRequirements(item))
        );
      }

      return valid;
    },

    /**
     * Check if any top level setting is enabled.
     *
     * @returns {Boolean}
     */
    hasNothingToShow() {
      return !this.$configBus.config[ALLOW_PICKUP_POINTS] && !this.$configBus.config[ALLOW_DELIVERY_OPTIONS];
    },
  },

  created() {
    const debounceDelay = 200;

    document.addEventListener(EVENTS.UPDATE_CHECKOUT_IN, debounce(() => {
      this.getCheckout();
    }, debounceDelay));

    // Add the new data to the values object
    this.$configBus.$on(EVENTS.UPDATE, this.updateExternalData);

    // Debounce trigger updating the checkout
    this.$configBus.$on(EVENTS.UPDATE, debounce(this.updateExternal, debounceDelay));

    this.$configBus.$on(EVENTS.ERROR, (e) => {
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
      // Don't start loading if there's nothing to load
      if (this.hasNothingToShow) {
        return;
      }

      this.$configBus.setAddress();
      this.showCheckout = true;

      if (!this.$configBus.hasValidAddress) {
        this.loading = false;
        return;
      }

      this.loading = true;
      await fetchAllCarriers();
      this.createForm();
      this.loading = false;
    },

    /**
     * Hide the checkout completely.
     */
    hideCheckout() {
      console.trace('would hide checkout');
      // this.showCheckout = false;
    },

    /**
     * Trigger an update on the checkout. Throttled to avoid overloading the external platform with updates.
     */
    updateExternal() {
      document.dispatchEvent(new Event(EVENTS.UPDATE_CHECKOUT_OUT));
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
  },
};
</script>
