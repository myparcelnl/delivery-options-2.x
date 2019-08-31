<template>
  <form @submit.prevent="">
    <div
      v-if="showCheckout"
      class="myparcel-checkout">
      <Modal
        v-if="$configBus.showModal"
        :data="modalData"
        :component="$configBus.modalData.component" />

      <template v-else>
        <h3
          v-if="!loading && $configBus.strings.headerDeliveryOptions"
          v-text="$configBus.strings.headerDeliveryOptions" />

        <loader v-if="loading" />

        <Errors v-else-if="!hasValidAddress" />

        <div
          v-else
          class="myparcel-checkout__delivery-options">
          <recursive-form
            v-for="option in form.options"
            :key="option.name"
            :option="option" />
        </div>
      </template>
    </div>
    <input
      id="mypa-input"
      :value="externalData"
      hidden>
  </form>
</template>

<script>
import * as EVENTS from '@/config/data/eventConfig';
import { ALLOW_DELIVERY_OPTIONS, ALLOW_PICKUP_LOCATIONS } from '@/config/data/settingsConfig';
import { DELIVERY, DELIVERY_CARRIER, PICKUP, formConfig } from '@/config/data/formConfig';
import Errors from '@/Errors';
import Loader from '@/components/Loader';
import { MISSING_ADDRESS } from '@/config/data/errorConfig';
import Modal from '@/components/Modal';
import Vue from 'vue';
import { addressRequirements } from '@/config/data/platformConfig';
import { createConfigBus } from '@/config/configBus';
import debounce from 'debounce';
import { fetchAllCarriers } from '@/data/carriers/fetchAllCarriers';
import { getAddress } from '@/config/setup';
import { getDeliveryOptions } from '@/data/delivery/getDeliveryOptions';
import { getPickupLocations } from '@/data/pickup/getPickupLocations';

const debounceDelay = 200;

export default {
  name: 'App',
  components: {
    Modal,
    Errors,
    Loader,
  },
  data() {
    return {
      /**
       * Whether to show the checkout at all or not.
       */
      showCheckout: false,

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

      /**
       * Event listeners object. Stored here so we can add and remove them easily.
       */
      listeners: {
        update: debounce(this.getCheckout, debounceDelay),
        updateExternal: debounce(this.updateExternal, debounceDelay),
        error: (e) => {
          if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.warn('error:', e);
          }
          this.hideCheckout();
        },
      },
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

      const { cc } = this.$configBus.address;
      const requirements = addressRequirements[addressRequirements.hasOwnProperty(cc) ? cc : 'nl'];

      const meetsRequirements = (item) => {
        return this.$configBus.address.hasOwnProperty(item) && this.$configBus.address[item];
      };

      // False if any requirements are not met, true otherwise.
      const valid = requirements.every((item) => meetsRequirements(item));

      // If invalid, tell the configBus which fields are missing.
      if (!valid) {
        this.$configBus.addErrors(
          MISSING_ADDRESS,
          // Find only invalid fields
          requirements.filter((item) => !meetsRequirements(item))
        );
      }

      return valid;
    },

    /**
     * Check if any top level setting is enabled.
     *
     * @returns {Boolean}
     */
    hasSomethingToShow() {
      console.log(this.$configBus.get(ALLOW_PICKUP_LOCATIONS));
      return this.$configBus.get(ALLOW_PICKUP_LOCATIONS) || this.$configBus.get(ALLOW_DELIVERY_OPTIONS);
    },

    /**
     * Return modalData without component.
     *
     * @returns {Object}
     */
    modalData() {
      const { component, ...data } = this.$configBus.modalData;

      return data;
    },
  },

  created() {
    console.log('app created');
    this.listeners.update();
    document.addEventListener(EVENTS.UPDATE_CHECKOUT_IN, this.listeners.update);

    // Add the new data to the values object
    this.$configBus.$on(EVENTS.UPDATE, this.updateExternalData);

    // Debounce trigger updating the checkout
    this.$configBus.$on(EVENTS.UPDATE, this.listeners.updateExternal);

    this.$configBus.$on(EVENTS.ERROR, this.listeners.error);
  },

  beforeDestroy() {
    document.removeEventListener(EVENTS.UPDATE_CHECKOUT_IN, this.listeners.update);
    this.$configBus.$off(EVENTS.UPDATE, this.updateExternalData);
    this.$configBus.$off(EVENTS.UPDATE, this.listeners.updateExternal);
    this.$configBus.$off(EVENTS.ERROR, this.listeners.error);
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
      if (!this.hasSomethingToShow) {
        return;
      }

      // Update the address using the window config object.
      this.$configBus.address = getAddress();

      this.showCheckout = true;

      if (!this.hasValidAddress) {
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
      // This has to stay here until after testing
      // eslint-disable-next-line no-console
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
