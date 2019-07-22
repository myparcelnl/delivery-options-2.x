import { FLESPAKKET, MYPARCEL } from '@/config/platformConfig';
import Vue from 'vue';
import _merge from 'lodash.merge';
import { defaultConfig } from './defaultConfig';

const mock = false;

/**
 * @typedef {Object} window.MyParcelConfig
 * @description Global configuration object from the external platform.
 */
if (!window.hasOwnProperty('MyParcelConfig') || mock === true) {
  if (process.env.NODE_ENV === 'development') {
    window.MyParcelConfig = JSON.stringify(defaultConfig('myparcel'));
  } else {
    throw 'No config found! (window.MyParcelConfig is required.)';
  }
}

/**
 * Get data from the window config object and convert some variables.
 *
 * @returns {{txtWeekDays: Object, address: Object, strings: Object, config: Object}}
 */
const getConfig = () => {
  const windowObject = typeof window.MyParcelConfig === 'string'
    ? JSON.parse(window.MyParcelConfig)
    : window.MyParcelConfig;

  console.log(windowObject);
  const data = _merge(defaultConfig(null || MYPARCEL), windowObject); // windowObject.platform

  if (typeof data.config.carriers === 'string') {
    data.config.carriers = data.config.carriers.split(',');
  }

  // data.config.carrierData = data.config.carriers.split(',').map((carrier) => {
  //   return formConfig.carriers[carrier];
  // });

  // Merge the config data with the default config
  return data;
};

/**
 * Config bus.
 */
export const configBus = new Vue({
  data: {
    /**
     * Dependency object
     */
    dependencies: {},

    /**
     * Object containing any errors causing the checkout not to show.
     *
     * @type {Object}
     */
    errors: {},

    values: {},

    mock,

    mockDelay: 0,

    /**
     * Whether to show the checkout at all or not.
     */
    showCheckout: true,

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
     * The config data
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
  },

  methods: {
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
          selected = firstChoice;
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
     * @param {Array} errors - Errors to add.
     */
    addErrors(key, errors) {
      if (!errors.length) {
        return;
      }

      if (this.errors.hasOwnProperty(key)) {
        this.errors[key] = [...this.errors[key], ...errors];
      } else {
        this.errors[key] = errors;
      }

      this.$emit('error', { [key]: errors });
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
        monday_delivery: this.config.allowMondayDelivery,
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

        cutoff_time: this.config.cutoffTime,
        deliverydays_window: this.config.deliverydaysWindow,
        dropoff_days: this.config.dropOffDays,
        dropoff_delay: this.config.dropoffDelay,

        // delivery_time: 'time',
        // delivery_date: 'date',
        // exclude_delivery_type: 'delivery_type',
        // latitude: 'coordinates',
        // longitude: 'coordinates',
      };

      parameters = { ...parameters, ...parametersByPlatform[this.config.platform] };

      return parameters;
    },

    /**
     * Update the address using the config.
     */
    setAddress() {
      this.address = getConfig().address;
    },

    /**
     *
     * @param {Number} price - Price.
     *
     * @returns {string}
     */
    formatPrice(price) {
      if (typeof price === 'string') {
        price = this.config[price];
      }

      const formatter = new Intl.NumberFormat(
        'nl-NL',
        {
          style: 'currency',
          currency: this.config.currency,
        },
      );

      return formatter.format(Math.abs(price));
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

    /**
     * Format distance for given amount of meters.
     *
     * @param {Number|String} distance - Distance in meters.
     * @returns {string}
     */
    formatDistance(distance) {
      let unit = 'm';
      if (distance >= 1000) {
        distance = (distance / 1000).toFixed(1).toString().replace(/\./, ',');
        unit = 'km';
      }

      return distance + unit;
    },
  },
});
