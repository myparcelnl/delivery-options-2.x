/* eslint-disable max-lines-per-function */
import * as EVENTS from '@/config/data/eventConfig';
import * as SETTINGS from '@/config/data/settingsConfig';
import Vue from 'vue';
import { allowedCountryCodesForPlatform } from '@/config/data/countryConfig';
import { getConfig } from '@/config/setup';

/**
 * The config bus to be used throughout the application. It's filled with `createConfigBus()`, otherwise the entire
 *  configBus will try to load before a configuration object can be provided.
 */
export let configBus;

/**
 * Creates the configBus object.
 *
 * @returns {configBus}
 */
export const createConfigBus = () => {
  configBus = new Vue({
    data: {
      /**
       * @type {MyParcel.CarrierData[]}
       */
      carrierData: [],

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
      pickupLocations: null,

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
       * Object containing any errors causing the delivery options not to show.
       *
       * @type {Object}
       */
      errors: {},

      /**
       * The object where settings will be stored.
       */
      values: {},

      /**
       * Must be defined before it is filled in created().
       *
       * @type {MyParcel.DeliveryOptionsConfig}
       */
      config: null,

      /**
       * Must be defined before it is filled in created().
       *
       * @type {MyParcel.DeliveryOptionsStrings}
       */
      strings: null,

      /**
       * Must be defined before it is filled in created().
       *
       * @type {MyParcel.DeliveryOptionsAddress}
       */
      address: null,
    },
    computed: {
      /**
       * Whether the cc of the current address is in the list of valid codes for the current platform.
       *
       * @returns {boolean}
       */
      isValidCountry() {
        return allowedCountryCodesForPlatform().includes(this.address.cc);
      },

      /**
       * Whether there are multiple carriers available or not.
       *
       * @returns {boolean}
       */
      isMultiCarrier() {
        return this.carrierData.length > 1;
      },

      /**
       * The settings specific to the current carrier from the config, if any.
       *
       * @returns {Object}
       */
      currentCarrierSettings() {
        return this.config[SETTINGS.CARRIER_SETTINGS].hasOwnProperty(this.currentCarrier)
          ? this.config[SETTINGS.CARRIER_SETTINGS][this.currentCarrier]
          : {};
      },
    },

    created() {
      // Load the configuration.
      const initialize = () => {
        const configuration = getConfig();

        /**
         * The configuration data.
         */
        Object.keys(configuration).forEach((item) => {
          this[item] = configuration[item];
        });

        this.weekdays = this.getWeekdays();

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
       *                                                     option is not in the settingsWithoutCarrierOverride array.
       * 3. `config.<option>`                              - User defined default settings.
       * 4. `defaultConfig.<option>`                       - Will be in `this.config` if there are no user defined
       *                                                     default settings.
       *
       * @param {Object|String} option  - Option object or name.
       * @param {String} key            - Key name to use. Defaults to "name".
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
        if (!!carrier) {
          return this.getSettingsByCarrier(carrier)[option[key]];
        }

        // If the setting is in the settingsWithoutCarrierOverride array don't check the carrierSettings object.
        if (!SETTINGS.settingsWithoutCarrierOverride.includes(option[key])
          && this.currentCarrierSettings.hasOwnProperty(option[key])) {
          setting = this.currentCarrierSettings[option[key]];
        } else {
          setting = this.config[option[key]];
        }

        return setting;
      },

      /**
       * Format a given date string to "hh:mm".
       *
       * @param {Date|string} date - Date string to format.
       * @param {Object} options - Options for formatting.
       *
       * @returns {string}
       */
      formatTime(date = new Date(),
        options = {
          hour: '2-digit',
          minute: '2-digit',
        }) {
        const dateClass = date instanceof Date ? date : new Date(date);
        return dateClass.toLocaleTimeString('default', options);
      },

      /**
       * Get carrier data by id or name.
       *
       * @param {MyParcel.CarrierNameOrId} search - Carrier name or id.
       *
       * @returns {MyParcel.CarrierData} - Carrier object.
       */
      getCarrier(search) {
        return this.carrierData.find((carrier) => {
          return isNaN(parseInt(search))
            ? carrier.name === search
            : carrier.id === search;
        });
      },

      /**
       * @param {String|Number} price - Price config item or value.
       *
       * @returns {string}
       */
      formatPrice(price) {
        if (typeof price === 'string') {
          price = this.get(price, 'price');
        }

        const formatter = new Intl.NumberFormat(
          this.get(SETTINGS.LOCALE),
          {
            style: 'currency',
            currency: this.get(SETTINGS.CURRENCY),
          },
        );

        return formatter.format(Math.abs(price));
      },

      /**
       * Format distance for given amount of meters.
       *
       * @param {Number|String} distance - Distance in meters.
       *
       * @returns {string}
       */
      formatDistance(distance) {
        const mToKm = 1000;

        let unit = 'm';

        if (distance >= mToKm) {
          const intl = new Intl.NumberFormat(this.get(SETTINGS.LOCALE), { maximumFractionDigits: 1 });
          distance = intl.format(distance / mToKm);
          unit = 'km';
        }

        return distance + unit;
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
       * @returns {boolean}
       */
      isEnabled(option, key = null, carrier = null) {
        if (!option.hasOwnProperty('enabled') || !this.config.hasOwnProperty(option.enabled)) {
          return true;
        }

        const enabledInConfig = !!this.get(option.enabled, key, carrier);

        return option.hasOwnProperty('enabled') && enabledInConfig;
      },

      /**
       * Get the array of weekdays by using a (slightly) hacky trick with dates.
       *
       * @returns {String[]}
       */
      getWeekdays() {
        const dates = [];
        for (let day = 5; day <= 11; day++) {
          let date = new Date(1970, 1 - 1, day).toLocaleString(
            this.get(SETTINGS.LOCALE),
            { weekday: 'long' },
          );

          // Uppercase first letter.
          date = date.charAt(0).toUpperCase() + date.substring(1);

          dates.push(date);
        }

        return dates;
      },

      /**
       * Add errors to `this.errors` under a given key, if there are any.
       *
       * @param {string} key - Key to add to errors object.
       * @param {Array} responseErrors - Errors to add.
       */
      addErrors(key, responseErrors) {
        if (!responseErrors.length) {
          return;
        }

        if (this.errors.hasOwnProperty(key)) {
          this.errors[key] = [...this.errors[key], ...responseErrors];
        } else {
          this.errors[key] = responseErrors;
        }
      },

      /**
       * Get the carrier specific settings for the given carrier.
       *
       * @param {String} carrier - Carrier name.
       *
       * @returns {Object|boolean}
       */
      getSettingsByCarrier(carrier = this.currentCarrier) {
        if (!this.config.carrierSettings.hasOwnProperty(carrier)) {
          return false;
        }

        return this.config.carrierSettings[carrier];
      },

      /**
       * @param {String} setting - Setting name.
       *
       * @returns {boolean}
       */
      isEnabledInAnyCarrier(setting) {
        return Object.keys(this.config.carrierSettings).some((carrier) => this.getSettingsByCarrier(carrier)[setting]);
      },
    },
  });

  return configBus;
};
