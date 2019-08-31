/* eslint-disable max-lines-per-function */
import App from '@/App';
import * as EVENTS from '@/config/data/eventConfig';
import {
  ALLOW_MONDAY_DELIVERY, CARRIER_SETTINGS,
  CURRENCY,
  CUTOFF_TIME,
  DELIVERY_DAYS_WINDOW,
  DROP_OFF_DAYS,
  DROP_OFF_DELAY, LOCALE, PLATFORM,
  settingsWithoutCarrierOverride,
} from '@/config/data/settingsConfig';
import { FLESPAKKET, MYPARCEL, SENDMYPARCEL } from '@/config/data/platformConfig';
import Vue from 'vue';
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
       * @type {MyParcel.Carrier}
       */
      currentCarrier: null,

      /**
       * Dependency object, used for settings that depend on each other "vertically".
       *
       * Example: delivery > carrier > deliveryDate ⬅ [horizontal dependency]
       *                             | deliveryMoment
       *                             | additionalOptions
       *                            ⬆️ [vertical dependencies that depend on siblings instead of their parent.].
       */
      dependencies: {},

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
       * Object containing any errors causing the checkout not to show.
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
       * @type {MyParcel.CheckoutConfig}
       */
      config: null,

      /**
       * Must be defined before it is filled in created().
       *
       * @type {MyParcel.CheckoutStrings}
       */
      strings: null,

      /**
       * Must be defined before it is filled in created().
       *
       * @type {MyParcel.CheckoutAddress}
       */
      address: null,
    },
    computed: {
      isMultiCarrier() {
        return this.carrierData.length > 1;
      },

      /**
       * The settings specific to the current carrier from the config, if any.
       *
       * @returns {Object}
       */
      currentCarrierSettings() {
        return this.config[CARRIER_SETTINGS].hasOwnProperty(this.currentCarrier)
          ? this.config[CARRIER_SETTINGS][this.currentCarrier]
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

        document.dispatchEvent(new Event(EVENTS.UPDATE_CHECKOUT_IN));
      };

      initialize();

      document.addEventListener(EVENTS.UPDATE_CONFIG, initialize);
    },

    methods: {
      /**
       * Get the value of a given option in the config.
       *
       * ## Order of priority:
       *  1. `this.config.<carrier>.<option>` - User defined carrier specific settings. Only if option is not in
       *                                        the settingsWithoutCarrierOverride array.
       *  2. `this.config.<option>`           - User defined default settings.
       *  3. `defaultConfig.<option>`         - Will be in `this.config` if there are no user defined default settings.
       *
       * @param {Object|String} option - Option object or name.
       * @param {String} key - Key name to use. Defaults to "name".
       *
       * @returns {*}
       */
      get(option, key = 'name') {
        let setting;
        if (typeof option === 'string') {
          option = { [key]: option };
        }

        // If the setting is in the settingsWithoutCarrierOverride array don't check the carrierSettings object.
        if (!settingsWithoutCarrierOverride.includes(option[key])
        && this.currentCarrierSettings.hasOwnProperty(option[key])) {
          setting = this.currentCarrierSettings[option[key]];
        } else {
          setting = this.config[option[key]];
        }

        return setting;
      },

      /**
       * Get the name of the selected choice for given option. The chosen value is either the previously set value for
       *  current option, the option that has 'selected: true' or the first option.
       *
       * @param {Object} option - Option object.
       *
       * @param {Array} option.choices - Object choices.
       * @param {String} option.type - Object type.
       * @param {String} option.name - Object name.
       *
       * @returns {String}
       */
      getSelected(option) {
        const { choices, type, name } = option;
        const [firstChoice] = choices;
        const isSet = this.values.hasOwnProperty(name);
        const setValue = this.values[name];
        const hasChoices = !!choices && choices.length > 0;

        let selected;

        if (type === 'checkbox') {
        // setValue is always an array for type checkbox
          const copiedSetValue = [...setValue || []];

          // If there's a value set dedupe the array of values, otherwise set empty array.
          const selectedChoices = choices.reduce((acc, choice) => {
            if (choice.selected === true) {
              acc.push(choice.name);
            }

            if (choice.disabled === true && copiedSetValue.includes(choice.name)) {
              copiedSetValue.splice(copiedSetValue.findIndex((name) => name === choice.name), 1);
            }

            return acc;
          }, []);

          selected = isSet ? [...new Set([...copiedSetValue, ...selectedChoices])] : selectedChoices;
        } else if (type === 'select') {
          if (isSet) {
            selected = setValue;
          } else if (hasChoices) {
            selected = firstChoice.name;
          }
        } else if (isSet && !!setValue) {
        // If this option is in configBus.values, select it.
          selected = (choices.find((choice) => choice.name === setValue) || firstChoice).name;
        } else if (hasChoices) {
        // If nothing was selected, choose the option with a selected attribute or just get the first option.
          selected = (choices.find((choice) => choice.selected === true) || firstChoice).name;
        }

        return selected;
      },

      /**
       * Format a given date string to "hh:mm".
       *
       * @param {Date|string} date - Date string to format.
       * @param {Object} options - Options for formatting.
       *
       * @returns {string}
       */
      formatTime(date = new Date(), options = { hour: '2-digit', minute: '2-digit' }) {
        const dateClass = date instanceof Date ? date : new Date(date);
        return dateClass.toLocaleTimeString('default', options);
      },

      /**
       * Get carrier by id or name.
       *
       * @param {Number|String} search - Id or name of the carrier.
       *
       * @returns {{id: Number, name: String, human: String, meta: Object}|undefined} - Carrier object.
       */
      getCarrier(search) {
        return this.carrierData.find((carrier) => {
          return isNaN(parseInt(search))
            ? carrier.id === search
            : carrier.name === search;
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
          this.get(LOCALE),
          {
            style: 'currency',
            currency: this.get(CURRENCY),
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
          const intl = new Intl.NumberFormat(this.get(LOCALE), { maximumFractionDigits: 1 });
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
       * @returns {boolean}
       */
      isEnabled(option) {
        if (!option.hasOwnProperty('enabled') || !this.config.hasOwnProperty(option.enabled)) {
          return true;
        }

        const enabledInConfig = !!this.get(option.enabled);

        return !option.hasOwnProperty('enabled') || (option.hasOwnProperty('enabled') && enabledInConfig);
      },

      /**
       * Get the array of weekdays by using a (slightly) hacky trick with dates.
       *
       * @returns {String[]}
       */
      getWeekdays() {
        const dates = [];
        for (let day = 5; day <= 11; day++) {
          dates.push(new Date(1970, 1 - 1, day).toLocaleString(
            this.get(LOCALE),
            { weekday: 'long' }
          ));
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
       * Parameters for the delivery options request.
       *
       * @see https://myparcelnl.github.io/api/#8
       *
       * @param {string} carrier - Carrier to use.
       * @returns {Object}
       */
      getRequestParameters(carrier = this.currentCarrier) {
        const parametersNL = {
          monday_delivery: this.get(ALLOW_MONDAY_DELIVERY),
        };

        const parametersBE = {
        // TODO:
        //  "Day-picker is nog niet van toepassing voor SendMyParcel. De data die terugkomt is zelf opgebouwd door JW en
        //  komt niet officieel uit bpost/DPD." < uit https://jira.dmp.zone/browse/MY-12648
        //  Wanneer dit niet meer van toepassing is moet deze override weg.
          deliverydays_window: 1,
        };

        const parametersByPlatform = {
          [MYPARCEL]: parametersNL,
          [FLESPAKKET]: parametersNL,
          [SENDMYPARCEL]: parametersBE,
        };

        const parameters = {
        /**
         * The endpoints we use in this application follow the JSON API "Inclusion of Related Resources" standard.
         *
         * @see https://jsonapi.org/format/#fetching-includes
         */
          include: 'shipment_options',

          platform: this.get(PLATFORM),
          carrier,

          cc: this.address.cc,
          postal_code: this.address.postalCode,
          number: this.address.number,

          cutoff_time: this.get(CUTOFF_TIME),
          deliverydays_window: this.get(DELIVERY_DAYS_WINDOW),
          dropoff_days: this.get(DROP_OFF_DAYS),
          dropoff_delay: this.get(DROP_OFF_DELAY),
        };

        return { ...parameters, ...parametersByPlatform[this.get(PLATFORM)] };
      },
    },
  });

  return configBus;
};
