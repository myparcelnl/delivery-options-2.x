import * as EVENTS from '@/config/data/eventConfig';
import {
  ALLOW_MONDAY_DELIVERY,
  CURRENCY,
  CUTOFF_TIME,
  DELIVERY_DAYS_WINDOW,
  DROP_OFF_DAYS,
  DROP_OFF_DELAY,
} from '@/config/data/settingsConfig';
import { FLESPAKKET, MYPARCEL, addressRequirements } from '@/config/data/platformConfig';
import { getAddress, getConfig } from '@/config/setup';
import Vue from 'vue';

/**
 * Config bus.
 */
export const configBus = new Vue({
  data: {
    /**
     * Dependency object.
     */
    dependencies: {},

    /**
     * Object containing any errors causing the checkout not to show.
     *
     * @type {Object}
     */
    errors: {},

    values: {},

    /**
     * Whether to show the checkout at all or not.
     */
    showCheckout: false,

    /**
     * @type {MyParcel.CarrierData[]}
     */
    carrierData: [],

    currentCarrier: null,

    /**
     * Delivery options array from the API.
     *
     * @type {Array}
     */
    deliveryOptions: [],

    /**
     * Pickup options array from the API.
     *
     * @type {Array}
     */
    pickupLocations: [],

    /**
     * The configuration data.
     */
    ...getConfig(),
  },
  computed: {
    hasErrors() {
      return Object.keys(this.errors).length > 0;
    },

    isMultiCarrier() {
      return this.carrierData.length > 1;
    },

    platform() {
      return this.config.platform;
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
      if (!this.address || !this.address.cc) {
        return false;
      }

      let requirements;
      const cc = this.address.cc.toUpperCase();
      if (addressRequirements.hasOwnProperty(cc)) {
        requirements = addressRequirements[cc];
      } else {
        requirements = addressRequirements.NL;
      }

      requirements.forEach((requirement) => {
        if (!!this.address[requirement]) {
          return false;
        }
      });

      return true;
    },

    /**
     * The settings specific to the current carrier from the config, if any.
     *
     * @returns {Object}
     */
    currentCarrierSettings() {
      return this.config.carrierSettings.hasOwnProperty(this.currentCarrier)
        ? this.config.carrierSettings[this.currentCarrier]
        : {};
    },
  },

  methods: {
    /**
     * Get the price from the config if present.
     * Priority order: price set in current carrier > default value > 0.
     *
     * @param {Object|string} option - Option object or price config item.
     *
     * @returns {Number}
     */
    getPrice(option) {
      if (typeof option === 'string') {
        option = { price: option };
      }

      // If price is set per carrier return that price
      if (this.currentCarrierSettings.hasOwnProperty(option.price)) {
        return this.currentCarrierSettings[option.price];
      }

      // If price is not set in the config return 0
      if (!option.hasOwnProperty('price') || !this.config.hasOwnProperty(option.price)) {
        return 0;
      }

      return this.config[option.price];
    },

    /**
     * Get the name of the selected choice for given option. The chosen value is either the previously set value for the
     * current option, the option that has 'selected: true' or the first option.
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
     * Add errors to `this.errors` under a given key, if there are any.
     *
     * @param {string} key - Key to add to errors object.
     * @param {Array} responseErrors - Errors to add.
     */
    addErrors(key, responseErrors) {
      if (!responseErrors.length) {
        return;
      }

      responseErrors = responseErrors[0].errors;

      if (this.errors.hasOwnProperty(key)) {
        this.errors[key] = [...this.errors[key], ...responseErrors];
      } else {
        this.errors[key] = responseErrors;
      }

      this.$emit(EVENTS.ERROR, { [key]: responseErrors });
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
        return typeof search === 'number'
          ? carrier.id === search
          : carrier.name === search;
      });
    },

    /**
     * Parameters for the delivery options request.
     *
     * @param {string} carrier - Carrier to use.
     *
     * @returns {Object}
     */
    getRequestParameters(carrier = this.currentCarrier) {
      const parametersNL = {
        monday_delivery: this.config[ALLOW_MONDAY_DELIVERY],
      };

      const parametersByPlatform = {
        [MYPARCEL]: parametersNL,
        [FLESPAKKET]: parametersNL,
      };

      let parameters = {
        cc: this.address.cc,
        postal_code: this.address.postalCode,
        number: this.address.number,
        platform: this.platform,
        carrier,

        cutoff_time: this.config[CUTOFF_TIME],
        deliverydays_window: this.config[DELIVERY_DAYS_WINDOW],
        dropoff_days: this.config[DROP_OFF_DAYS],
        dropoff_delay: this.config[DROP_OFF_DELAY],
      };

      parameters = { ...parameters, ...parametersByPlatform[this.config.platform] };

      return parameters;
    },

    /**
     * Update the address using the config.
     */
    setAddress() {
      this.address = getAddress();
    },

    /**
     * @param {String|Number} price - Price config item or value.
     *
     * @returns {string}
     */
    formatPrice(price) {
      if (typeof price === 'string') {
        price = this.getPrice(price);
      }

      const formatter = new Intl.NumberFormat(
        this.config.locale,
        {
          style: 'currency',
          currency: this.config[CURRENCY],
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
        distance = (distance / mToKm)
          .toFixed(1)
          .toString()
          .replace(/\./, ',');
        unit = 'km';
      }

      return distance + unit;
    },

    /**
     * Check if a given option is enabled in the config or not. Returns false if the option is not present in the config
     * or if `option.enabled` is false. Only returns true if `option.enabled` is present, in the config and true.
     *
     * @param {Object} option - FormConfig options object.
     *
     * @returns {boolean}
     */
    isEnabled(option) {
      if (!option.hasOwnProperty('enabled') || !this.config.hasOwnProperty(option.enabled)) {
        return true;
      }

      const enabledInConfig = !!this.config[option.enabled];

      return !option.hasOwnProperty('enabled') || (option.hasOwnProperty('enabled') && enabledInConfig);
    },
  },
});
