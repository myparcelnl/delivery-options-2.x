<template>
  <form
    v-if="showDeliveryOptions"
    :class="`${$classBase}`"
    @submit.prevent="">
    <Modal
      v-if="$configBus.showModal"
      :data="modalData"
      :component="$configBus.modalData.component" />

    <template v-else>
      <h3
        v-if="!loading && $configBus.strings.headerDeliveryOptions"
        v-text="$configBus.strings.headerDeliveryOptions" />

      <loader
        v-if="loading"
        v-test="'loader'" />

      <Errors v-else-if="!hasValidAddress" />

      <recursive-form
        v-for="option in form.options"
        v-else
        :key="option.name"
        v-test="option.name"
        :option="option" />
    </template>
  </form>
</template>

<script>
import * as CONFIG from '@/config/data/formConfig';
import * as EVENTS from '@/config/data/eventConfig';
import { ALLOW_DELIVERY_OPTIONS, ALLOW_PICKUP_LOCATIONS } from '@/config/data/settingsConfig';
import { ADDRESS_ERROR } from '@/config/data/errorConfig';
import Errors from '@/components/Errors';
import Loader from '@/components/Loader';
import Modal from '@/components/Modal';
import { addressRequirements } from '@/config/data/platformConfig';
import debounce from 'debounce';
import { fetchAllCarriers } from '@/data/carriers/fetchAllCarriers';
import { getAddress } from '@/config/setup';
import { getDeliveryOptions } from '@/data/delivery/getDeliveryOptions';
import { getPickupLocations } from '@/data/pickup/getPickupLocations';

const debounceDelay = 300;

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
       * Whether to show the delivery options module at all or not.
       */
      showDeliveryOptions: false,

      /**
       * Whether the delivery options are loading or not.
       *
       * @type {Boolean}
       */
      loading: true,

      /**
       * The form object which will be filled with all delivery options fields and options.
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
        update: debounce(this.getDeliveryOptions, debounceDelay),
        updateExternal: debounce(this.updateExternal, debounceDelay),
        error: (e) => {
          if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.warn('error:', e);
          }
          this.hideSelf();
        },
      },
    };
  },

  computed: {
    configBus() {
      return this.$configBus;
    },

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
          // Add the invalid fields to errors
          requirements.reduce((acc, item) => {
            return meetsRequirements(item)
              ? acc
              : [
                ...acc,
                {
                  code: ADDRESS_ERROR,
                  message: item,
                },
              ];
          }, []),
        );
      }

      return valid;
    },

    /**
     * Check if the cc in the given address allows delivery options and if any top level setting is enabled.
     *
     * @returns {Boolean}
     */
    hasSomethingToShow() {
      return this.$configBus.isValidCountry
        && (this.$configBus.isEnabledInAnyCarrier(ALLOW_PICKUP_LOCATIONS)
        || this.$configBus.isEnabledInAnyCarrier(ALLOW_DELIVERY_OPTIONS));
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
    this.listeners.update();
    document.addEventListener(EVENTS.UPDATE_DELIVERY_OPTIONS, this.listeners.update);

    // Add the new data to the values object
    this.$configBus.$on(EVENTS.UPDATE, this.$configBus.updateExternalData);

    // Debounce trigger updating the checkout
    this.$configBus.$on(EVENTS.UPDATE, this.listeners.updateExternal);

    this.$configBus.$on(EVENTS.ERROR, this.listeners.error);
  },

  beforeDestroy() {
    document.removeEventListener(EVENTS.UPDATE_DELIVERY_OPTIONS, this.listeners.update);
    this.$configBus.$off(EVENTS.UPDATE, this.$configBus.updateExternalData);
    this.$configBus.$off(EVENTS.UPDATE, this.listeners.updateExternal);
    this.$configBus.$off(EVENTS.ERROR, this.listeners.error);
  },

  methods: {
    /**
     * Create the checkout form.
     */
    createForm() {
      // Map form entries to functions to retrieve their content.
      const map = {
        [CONFIG.DELIVERY]: getDeliveryOptions,
        [CONFIG.PICKUP]: getPickupLocations,
      };

      // Map form entries to setting names.
      const settingsMap = {
        [CONFIG.DELIVERY]: ALLOW_DELIVERY_OPTIONS,
        [CONFIG.PICKUP]: ALLOW_PICKUP_LOCATIONS,
      };

      // Filter the choices checking if any of the given carriers have any above setting enabled.
      const choices = Object.keys(map).reduce((acc, setting) => {
        return this.$configBus.isEnabledInAnyCarrier(settingsMap[setting]) ? [...acc, map[setting]()] : acc;
      }, []);

      // Hide the checkout if there are no choices.
      if (!choices.length) {
        this.hideSelf();
        return;
      }

      this.form = {
        options: [
          {
            name: CONFIG.DELIVERY,
            type: 'radio',
            choices,
          },
        ],
      };
    },

    /**
     * Show the delivery options, getting all necessary data in the process..
     *
     * @returns {Promise}
     */
    async getDeliveryOptions() {
      // Update the address using the window config object.
      this.$configBus.address = getAddress();

      // Don't start loading if there's nothing to load
      if (!this.hasSomethingToShow) {
        return;
      }

      this.showDeliveryOptions = true;

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
    hideSelf() {
      // This has to stay here until after testing
      // eslint-disable-next-line no-console
      console.trace('hiding delivery options');
      this.showDeliveryOptions = false;
    },

    /**
     * Trigger an update on the checkout. Throttled to avoid overloading the external platform with updates.
     */
    updateExternal() {
      /*
       * If delivery type is not set it means either delivery or pickup was clicked but the subsequent request is not
       * finished yet. Once that finishes loading any delivery type will immediately be selected, triggering another
       * update event which will allow this condition to pass.
       */
      if (!this.$configBus.hasExportValue(CONFIG.DELIVERY_TYPE)) {
        return;
      }

      /*
       * Send a CustomEvent with the values as data.
       */
      document.dispatchEvent(new CustomEvent(
        EVENTS.UPDATED_DELIVERY_OPTIONS,
        {
          detail: this.$configBus.exportValues,
        }
      ));
    },
  },
};
</script>
