<template>
  <form
    v-if="showDeliveryOptions"
    v-show="fakeShowDeliveryOptions"
    :class="`${$classBase}`"
    @submit.prevent="">
    <Modal
      v-if="$configBus.showModal"
      :modal-data="modalData"
      :has-close-button="$configBus.modalData.hasCloseButton"
      :component="$configBus.modalData.component" />

    <template v-else>
      <h3
        v-if="!loading && $configBus.strings.headerDeliveryOptions"
        v-text="$configBus.strings.headerDeliveryOptions" />

      <Loader
        v-if="loading"
        v-test="'loader'" />

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
import isEqual from 'lodash.isequal';

const debounceDelay = 300;

export default {
  name: 'App',
  components: {
    Modal,
    Loader,
  },
  data() {
    return {
      /**
       * Whether to show the delivery options module at all or not.
       */
      showDeliveryOptions: false,

      /**
       * "fake" version of showDeliveryOptions, only hides the module visually by using v-show instead of v-if.
       *
       * Used while hiding the delivery options to disappear instantly but allow the module to clean up and send events
       *  before actually removing itself.
       */
      fakeShowDeliveryOptions: true,

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
        /**
         * Empty the export values and force sending an update with the empty data.
         */
        removeData: () => {
          this.$configBus.exportValues = {};
          this.updateExternal(false);
        },
        show: () => {
          if (this.showDeliveryOptions === true) {
            return;
          }

          this.showDeliveryOptions = true;
          this.listeners.update();
          document.addEventListener(EVENTS.UPDATE_DELIVERY_OPTIONS, this.listeners.update);
        },
        hide: () => {
          this.$configBus.exportValues = {};
          this.fakeShowDeliveryOptions = false;

          const listenForLastUpdate = () => {
            this.showDeliveryOptions = false;
            document.removeEventListener(EVENTS.UPDATE_DELIVERY_OPTIONS, this.listeners.update);
            document.removeEventListener(EVENTS.UPDATED_DELIVERY_OPTIONS, listenForLastUpdate);
          };

          document.addEventListener(EVENTS.UPDATED_DELIVERY_OPTIONS, listenForLastUpdate);
        },
        update: debounce(this.getDeliveryOptions, debounceDelay),
        updateExternal: debounce(this.updateExternal, debounceDelay),
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
     * @returns {Boolean}
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
      const valid = requirements.every(meetsRequirements);

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
                  type: 'address',
                  error: item,
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
      const { isEnabledInAnyCarrier } = this.$configBus;

      return isEnabledInAnyCarrier(ALLOW_PICKUP_LOCATIONS) || isEnabledInAnyCarrier(ALLOW_DELIVERY_OPTIONS);
    },

    /**
     * Return modalData without component.
     *
     * @returns {Object}
     */
    modalData() {
      const { component, hasCloseButton, ...data } = this.$configBus.modalData;

      return data;
    },
  },

  created() {
    this.listeners.update();
    document.addEventListener(EVENTS.UPDATE_DELIVERY_OPTIONS, this.listeners.update);

    document.addEventListener(EVENTS.DISABLE_DELIVERY_OPTIONS, this.listeners.removeData);
    document.addEventListener(EVENTS.SHOW_DELIVERY_OPTIONS, this.listeners.show);
    document.addEventListener(EVENTS.HIDE_DELIVERY_OPTIONS, this.listeners.hide);

    // Add the new data to the values object
    this.$configBus.$on(EVENTS.UPDATE, this.$configBus.updateExternalData);

    // Debounce trigger updating the checkout
    this.$configBus.$on(EVENTS.UPDATE, this.listeners.updateExternal);

    this.$configBus.$on(EVENTS.ERROR, this.handleError);
  },

  beforeDestroy() {
    document.removeEventListener(EVENTS.UPDATE_DELIVERY_OPTIONS, this.listeners.update);

    document.removeEventListener(EVENTS.SHOW_DELIVERY_OPTIONS, this.listeners.show);
    document.removeEventListener(EVENTS.HIDE_DELIVERY_OPTIONS, this.listeners.hide);
    this.$configBus.$off(EVENTS.UPDATE, this.$configBus.updateExternalData);
    this.$configBus.$off(EVENTS.UPDATE, this.listeners.updateExternal);
    this.$configBus.$off(EVENTS.ERROR, this.handleError);
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

      // Filter the choices checking if any of the given carriers have any above setting enabled. Also checks if the
      //  carrier is allowed to have the above options in the current country.
      const choices = Object.keys(map).reduce((acc, setting) => {
        const formData = map[setting]();

        if (!formData) {
          return acc;
        }

        return this.$configBus.isEnabledInAnyCarrier(settingsMap[setting]) ? [...acc, formData] : acc;
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
     * Show the delivery options, getting all necessary data in the process.
     *
     * @param {CustomEvent|Object} event - Address.
     *
     * @returns {Promise}
     */
    async getDeliveryOptions(event) {
      let addressChanged = false;
      let newAddress;

      /**
       * Get the address from the CustomEvent if that is how this function was called.
       */
      if (event instanceof CustomEvent) {
        newAddress = event.detail.address || {};
      } else {
        newAddress = getAddress();
      }

      /**
       * Return if address didn't change, but only if the delivery options are already showing.
       */
      if (this.showDeliveryOptions && isEqual(this.$configBus.address, newAddress)) {
        return;
      }

      if (!this.$configBus.address.cc !== newAddress.cc) {
        addressChanged = true;
      }

      // Update the address in the config bus
      this.$configBus.address = newAddress;

      // Don't start loading if there's nothing to load, and hide if needed.
      if (!this.hasSomethingToShow) {
        this.showDeliveryOptions = false;
        return;
      }

      // Close any modal in case the update was triggered by the retry modal.
      this.$configBus.showModal = false;
      this.showDeliveryOptions = true;

      if (!this.hasValidAddress) {
        this.showAddressErrors();
        return;
      }

      this.$configBus.showModal = false;
      this.$configBus.modalData = {};

      if (!this.$configBus.carrierData.length || addressChanged) {
        this.loading = true;
        await fetchAllCarriers();
      }

      this.$configBus.setAdvancedCarrierData();

      this.createForm();
      this.loading = false;
    },

    /**
     * Hide the checkout completely.
     */
    hideSelf() {
      this.showDeliveryOptions = false;
    },

    /**
     * Trigger an update on the checkout. Throttled to avoid overloading the external platform with updates.
     *
     * @param {Object|Boolean} data - If data is false, sends empty update.
     * @param {String} data.name - Name of the changed option (if called through update).
     * @param {*} data.value - New value of the changed option (if called through update).
     */
    updateExternal(data) {
      const isEmptied = data === false || (data.name === CONFIG.DELIVERY && data.value === null);

      /*
       * If delivery type is not set it means either delivery or pickup was clicked but the subsequent request is not
       * finished yet. Once that finishes loading any delivery type will immediately be selected, triggering another
       * update event which will allow this condition to pass.
       */
      if (!isEmptied && !this.$configBus.hasExportValue(CONFIG.DELIVERY_TYPE)) {
        return;
      }

      /*
       * Send a CustomEvent with the values as data.
       */
      document.dispatchEvent(new CustomEvent(
        EVENTS.UPDATED_DELIVERY_OPTIONS,
        {
          detail: isEmptied ? null : this.$configBus.exportValues,
        },
      ));
    },

    /**
     * Handle incoming errors from the configBus. Hide on "fatal" errors and show the address error modal otherwise.
     *
     * @param {Object} e - Error object.
     */
    handleError(e) {
      if (e.type === 'fatal') {
        this.hideSelf();
      }

      this.showAddressErrors();
    },

    /**
     * Show the modal with the Errors component.
     */
    showAddressErrors() {
      this.loading = false;
      this.$configBus.showModal = true;
      this.$configBus.modalData = {
        component: Errors,
      };
    },
  },
};
</script>
