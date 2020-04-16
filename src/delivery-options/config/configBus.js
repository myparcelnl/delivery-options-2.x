/* eslint-disable max-lines-per-function */
import * as CONFIG from '@/data/keys/configKeys';
import * as EVENTS from '@/config/eventConfig';
import * as FORM from '@/config/formConfig';
import Vue from 'vue';
import debounce from 'lodash-es/debounce';
import { getConfig } from '@/delivery-options/config/getConfig';
import { getPickupDate } from '@/delivery-options/data/pickup/getPickupDate';
import { getWeekdays } from '@/helpers/getWeekdays';

/**
 * The config bus to be used throughout the application. It's filled with `createConfigBus()`, otherwise the entire
 *  configBus will try to load before a configuration object can be provided.
 */
export let configBus;

const UPDATED_ADDRESS_DEBOUNCE_DELAY = 50;

/**
 * Creates the configBus object.
 *
 * @param {Event|CustomEvent} eventCallee - Optional event that called this function.
 *
 * @returns {configBus}
 */
export const createConfigBus = (eventCallee = null) => {
  configBus = new Vue({
    name: 'ConfigBus',

    data: {
      /**
       * Name of the last event that (re)created the configBus.
       *
       * @type {String}
       */
      eventCallee: eventCallee ? eventCallee.name : null,

      /**
       * All carrier data.
       *
       * @type {MyParcelDeliveryOptions.CarrierData[]}
       */
      carrierData: [],

      /**
       * All carrier data of carriers that have pickup locations enabled.
       *
       * @type {MyParcelDeliveryOptions.CarrierData[]}
       */
      carrierDataWithPickupLocations: [],

      /**
       * All carrier data of carriers that have delivery options enabled.
       *
       * @type {MyParcelDeliveryOptions.CarrierData[]}
       */
      carrierDataWithDeliveryOptions: [],

      /**
       * The current carrier.
       *
       * @type {MyParcel.CarrierNameOrId}
       */
      currentCarrier: null,

      /**
       * Dependency object, used for settings that depend on each other "vertically".
       *
       * Example: delivery > carrier > deliveryDate ⬅ [horizontal dependency]
       *                             | deliveryMoment
       *                             | shipmentOptions
       *                            ⬆️ [vertical dependencies that depend on siblings instead of their parent.].
       */
      dependencies: {},

      /**
       * Object to store all pickup data in to be able to send it back to the application.
       *
       * @type {Object.<MyParcel.PickupLocation>}
       */
      pickupLocations: {},

      /**
       * Whether to show a modal or not.
       */
      showModal: false,

      /**
       * Data object to pass to modalComponent.
       *
       * @type {Object}
       */
      modalData: null,

      /**
       * Array containing any errors causing the delivery options not to show.
       *
       * @type {Array}
       */
      errors: [],

      /**
       * The object where settings will be stored.
       *
       * @type {Object}
       */
      values: {},

      /**
       * String weekdays.
       *
       * @type {String[]}
       */
      weekdays: [],

      /**
       * The object where the values that are sent to the external platform will be stored. Similar to `this.values`,
       *  but this object is tweaked to comply with our API and conventions and to maximize readability for the
       *  developers using it.
       *
       * @type {Object}
       */
      exportValues: {},

      /**
       * Must be defined before it is filled in created().
       *
       * @type {MyParcelDeliveryOptions.Configuration}
       */
      config: null,

      /**
       * Must be defined before it is filled in created().
       *
       * @type {MyParcel.Strings}
       */
      strings: null,

      /**
       * Must be defined before it is filled in created().
       *
       * @type {MyParcel.Address}
       */
      address: null,
    },

    computed: {
      /**
       * Whether there are multiple carriers with delivery available or not.
       *
       * @returns {Boolean}
       */
      hasMultipleDeliveryCarriers() {
        return this.carrierDataWithDeliveryOptions.length > 1;
      },

      /**
       * Whether there are multiple carriers with pickup locations or not.
       *
       * @returns {Boolean}
       */
      hasMultiplePickupCarriers() {
        return this.carrierDataWithPickupLocations.length > 1;
      },

      /**
       * The settings specific to the current carrier from the config, if any.
       *
       * @returns {Object}
       */
      currentCarrierSettings() {
        return this.config[CONFIG.CARRIER_SETTINGS].hasOwnProperty(this.currentCarrier)
          ? this.config[CONFIG.CARRIER_SETTINGS][this.currentCarrier]
          : {};
      },
    },

    watch: {
      /**
       * When the current carrier changes update the export values.
       *
       * @param {MyParcel.CarrierName} value - New currentCarrier.
       */
      currentCarrier(value) {
        this.setExportValue(FORM.CARRIER, value);
      },

      /**
       * Send an event when the address changes for any external code to listen to.
       */
      address: {
        handler: debounce(
          function updatedAddress() {
            document.dispatchEvent(new Event(EVENTS.UPDATED_ADDRESS));
          }, UPDATED_ADDRESS_DEBOUNCE_DELAY,
        ),

        deep: true,
      },
    },

    created() {
      // Load the configuration.
      const initialize = (event) => {
        const configuration = event ? event.detail : getConfig();

        /**
         * The configuration data.
         */
        Object.keys(configuration).forEach((item) => {
          this[item] = configuration[item];
        });

        this.weekdays = getWeekdays(configuration.config.locale);

        document.dispatchEvent(new Event(EVENTS.UPDATE_DELIVERY_OPTIONS));
      };

      initialize();

      document.addEventListener(EVENTS.UPDATE_CONFIG_IN, initialize);
    },

    methods: {
      /**
       * Get the value of a given option in the config.
       *
       * ## Order of priority:
       * 1. `config.carrierData.<carrier>.<option>`        - Only if `carrier` is set!
       * 2. `config.carrierData.<currentCarrier>.<option>` - User defined carrier specific settings. Only if
       *                                                     option is not in the settingsWithCarrierOverride array.
       * 3. `config.<option>`                              - User defined default settings.
       * 4. `defaultConfig.<option>`                       - Will be in `this.config` if there are no user defined
       *                                                     default settings.
       *
       * @param {Object|String} option - Option object or name.
       * @param {String} key - Key name to use. Defaults to "name".
       * @param {String|Number} carrier - Carrier name or ID.
       *
       * @returns {*}
       */
      get(option, key = 'name', carrier = null) {
        let setting;

        if (typeof option === 'string') {
          option = { [key]: option };
        }

        // Return carrier specific settings if carrier is defined.
        if (!!carrier && key) {
          if (!this.getSettingsByCarrier(carrier)) {
            return;
          }

          return this.getSettingsByCarrier(carrier)[option[key]];
        }

        // If the setting is in the settingsWithCarrierOverride array don't check the carrierSettings object.
        if (CONFIG.settingsWithCarrierOverride.includes(option[key])
          && this.currentCarrierSettings.hasOwnProperty(option[key])) {
          setting = this.currentCarrierSettings[option[key]];
        } else {
          setting = this.config[option[key]];
        }

        return setting;
      },

      /**
       * Check if a given option is enabled in the config or not. Returns false if the option is not present in the
       *  config or if `option.enabled` is false. Only returns true if `option.enabled` is present, in the config and
       *  true.
       *
       * @param {Object} option - FormConfig options object.
       *
       * @param {String} key - String key to use with this.get().
       * @param {String|Number} carrier - Carrier name or id.
       *
       * @returns {Boolean}
       */
      isEnabled(option, key = null, carrier = null) {
        if (typeof option === 'string') {
          option = { enabled: option };
        }

        if (!option.hasOwnProperty('enabled') || !this.config.hasOwnProperty(option.enabled)) {
          return true;
        }

        const enabledInConfig = !!this.get(option.enabled, key, carrier);

        return option.hasOwnProperty('enabled') && enabledInConfig;
      },

      /**
       * Add errors to `this.errors` under a given key.
       *
       * @param {Object} error - Error to add.
       */
      addErrors(error) {
        this.errors = [...this.errors, error];
        this.$emit(EVENTS.ERROR, error);
      },

      /**
       * Get the carrier specific settings for the given carrier.
       *
       * @param {String} carrier - Carrier name.
       *
       * @returns {Object|null}
       */
      getSettingsByCarrier(carrier = this.currentCarrier) {
        const carrierSettings = this.get(CONFIG.CARRIER_SETTINGS);

        if (!carrierSettings.hasOwnProperty(carrier)) {
          return null;
        }

        return carrierSettings[carrier];
      },

      /**
       * @param {String} setting - Setting name.
       *
       * @returns {Boolean}
       */
      isEnabledInAnyCarrier(setting) {
        const carrierSettings = this.get(CONFIG.CARRIER_SETTINGS);

        return Object.keys(carrierSettings).some((carrier) => carrierSettings[carrier][setting] === true);
      },

      /**
       * Get a value by name.
       *
       * @param {String} name - Name of the property to add/update.
       *
       * @returns {*}
       */
      getValue(name) {
        return this.values[name];
      },

      /**
       * Set a property to the given value in the values object.
       *
       * @param {String} name - Name of the property to add/update.
       * @param {*} value - New value.
       */
      setExportValue(name, value) {
        this.exportValues[name] = value;
      },

      /**
       * Unset a property from the values object.
       *
       * @param {String} name - Name of the property to remove.
       */
      unsetExportValue(...name) {
        name.forEach((name) => delete this.exportValues[name]);
      },

      /**
       * Check if a value is present in the exportValues object.
       *
       * @param {String} name - Name of the item to check for.
       *
       * @returns {Boolean}
       */
      hasExportValue(name) {
        return !!this.exportValues[name];
      },

      /**
       * Sets the delivery settings, removing anything related to pickup.
       */
      setDeliveryExportValues() {
        this.unsetExportValue(
          FORM.DELIVERY,
          FORM.DELIVERY_DATE,
          FORM.DELIVERY_MOMENT,
          FORM.PICKUP_LOCATION,
          FORM.PICKUP_MOMENT,
        );

        /**
         * Add a simple boolean for the external platform to be able to distinguish between pickup and delivery without
         *  having to check for the values of deliveryType.
         */
        this.setExportValue(FORM.IS_PICKUP, false);

        /**
         * Set deliveryType to what we call deliveryMoment internally.
         *
         * @see MyParcel.DeliveryType
         */
        this.setExportValue(FORM.DELIVERY_TYPE, this.getValue(FORM.DELIVERY_MOMENT));

        this.setExportValue(FORM.DATE, this.getValue(FORM.DELIVERY_DATE));
      },

      /**
       * Sets the pickup settings, removing anything related to delivery.
       */
      setPickupExportValues() {
        this.unsetExportValue(
          FORM.DELIVERY,
          FORM.DELIVERY_DATE,
          FORM.DELIVERY_MOMENT,
          FORM.PICKUP_MOMENT,
          FORM.SHIPMENT_OPTIONS,
        );

        /**
         * Add a simple boolean for the external platform to be able to distinguish between pickup and delivery without
         *  having to check for the values of deliveryType.
         */
        this.setExportValue(FORM.IS_PICKUP, true);

        /**
         * Set deliveryType to what we call pickupMoment internally.
         *
         * @see MyParcel.DeliveryType
         */
        this.setExportValue(FORM.DELIVERY_TYPE, this.getValue(FORM.PICKUP_MOMENT));

        const pickupLocation = this.getValue(FORM.PICKUP_LOCATION);

        // Only do this after a pickup location and moment are selected.
        if (!!pickupLocation && !!this.getValue(FORM.PICKUP_MOMENT)) {
          /**
           * After changing address while pickup is selected, the current pickupLocation might not be updated yet. This
           *  causes an error because the old pickup location likely doesn't exist anymore in the pickupLocations array.
           *
           * Return, because the next time pickupLocation will be set this condition will pass.
           */
          if (!this.$configBus.pickupLocations.hasOwnProperty(pickupLocation)) {
            return;
          }

          /**
           * Take out the possibilities array to use it to get the deliveryDate, but don't add it to the exportValues.
           * Also remove carrier from the currentPickupLocation object because it's already set in exportValues.carrier.
           */
          const { carrier, possibilities, ...currentPickupLocation } = this.$configBus.pickupLocations[pickupLocation];

          /**
           * Add the complex pickup data to the exported values instead of just the name.
           */
          this.setExportValue(FORM.PICKUP_LOCATION, currentPickupLocation);

          /**
           * Get the date from the currently selected pickup possibility.
           */
          this.setExportValue(FORM.DATE, getPickupDate(possibilities));
        }
      },

      /**
       * @param {MyParcel.CarrierName} carrierName - Carrier name.
       *
       * @returns {Object}
       */
      getCarrierByName(carrierName) {
        return this.carrierData.find((carrier) => carrier.name === carrierName);
      },

      /**
       * Updates the configBus with the new delivery options data and communicate it to the external platform.
       *
       * @param {Object} obj - Destructured update event.
       * @param {String} obj.name - Name of the setting that was updated.
       * @param {*} obj.value - Setting value.
       */
      updateExternalData({ name, value }) {
        this.values[name] = value;

        this.setExportValue(name, value);
        this.updateCurrentCarrier({ name, value });

        switch (this.getValue(FORM.DELIVERY)) {
          case FORM.DELIVER:
            this.setDeliveryExportValues();
            break;
          case FORM.PICKUP:
            this.setPickupExportValues();
            break;
        }

        // Using $nextTick to emit event after this function is done.
        // @see https://forum.vuejs.org/t/do-something-after-emit-has-finished-successful/10663/10
        this.$nextTick(() => {
          this.$emit(EVENTS.AFTER_UPDATE, { name, value });
        });
      },

      /**
       * Update the current carrier.
       *
       * @param {Object} obj - Name/value object.
       * @param {String} obj.name - Setting that changed.
       * @param {MyParcel.CarrierName|Number} obj.value - New carrier or pickup location id.
       */
      updateCurrentCarrier({ name, value }) {
        switch (name) {
          case FORM.CARRIER:
            this.currentCarrier = value;
            break;
          case FORM.PICKUP_LOCATION:
            if (this.pickupLocations.hasOwnProperty(value)) {
              this.currentCarrier = this.pickupLocations[value].carrier;
            }
            break;
        }
      },

      /**
       * Set the advanced carrier data. This is not done when fetching carriers because this can change based on the
       *  entered address.
       */
      setAdvancedCarrierData() {
        this.carrierDataWithPickupLocations = this.carrierData.filter((carrier) => {
          return carrier.pickupEnabled && carrier.pickupCountries.includes(this.address.cc);
        });

        this.carrierDataWithDeliveryOptions = this.carrierData.filter((carrier) => {
          return carrier.deliveryEnabled && carrier.deliverCountries.includes(this.address.cc);
        });
      },
    },
  });

  return configBus;
};
