import Vue from 'vue';
import demoConfig from './demoConfig';
import { formConfig } from './formConfig';

const mock = true;

/**
 * @typedef {Object} window.MyParcelConfig
 * @description Global configuration object from the external platform.
 */
if (!window.hasOwnProperty('MyParcelConfig') || mock === true) {
  if (process.env.NODE_ENV === 'development') {
    window.MyParcelConfig = JSON.stringify(demoConfig);
  } else {
    throw 'No config found! (window.MyParcelConfig is required.)';
  }
}

/**
 * Get data from the window config object.
 *
 * @returns {{txtWeekDays, address, textToTranslate, config}}
 */
const getConfig = () => {
  // console.log('getConfig; address:',
  //   (typeof window.MyParcelConfig === 'string' ? JSON.parse(window.MyParcelConfig) : window.MyParcelConfig).address);
  const data = typeof window.MyParcelConfig === 'string' ? JSON.parse(window.MyParcelConfig) : window.MyParcelConfig;

  // TODO temp default to euro
  if (!data.config.hasOwnProperty('currency')) {
    data.config.currency = 'EUR';
  }

  data.config.carrierData = data.config.carriers.split(',').map((carrier) => {
    return formConfig.carriers[carrier];
  });

  return data;
};

/**
 * Config bus.
 */
export const configBus = new Vue({
  data: {
    values: {},
    mock,
    mockDelay: 200,
    showCheckout: true,
    ...getConfig(),
  },
  computed: {
    isMultiCarrier() {
      return this.config.carrierData.length > 1;
    },

    /**
     * Parameters for the delivery options request.
     *
     * @returns {{
     *  cc: *,
     *  number: *,
     *  monday_delivery: number,
     *  dropoff_delay: string,
     *  deliverydays_window: number,
     *  carriers: (formConfig.carriers|{}|string),
     *  postal_code: (string|string),
     *  dropoff_days: string,
     *  cutoff_time: string
     *  }}
     */
    requestParameters() {
      return {
        cc: this.address.cc,
        postal_code: this.address.postalCode,
        number: this.address.number,
        cutoff_time: this.config.cutoffTime,
        deliverydays_window: this.config.deliverydaysWindow,
        dropoff_days: this.config.dropOffDays,
        dropoff_delay: this.config.dropoffDelay,
        monday_delivery: this.config.allowMondayDelivery,
        carriers: this.config.carriers,
      };
    },
  },
  methods: {

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
        }
      );

      return formatter.format(Math.abs(price));
    },

    /**
     * Update the values with given data.
     *
     * @param {{name: String, value: *}} data - Data object.
     */
    // updateData(data) {
    //   // console.log('updateData');
    //   // this.values[data.name] = data.value;
    //   // console.log(this.values);
    //   this.$emit('update', data);
    // },

    /**
     * Check if a given option is enabled in the config or not. Returns false if the option is not present in the config
     * or if `option.enabled` is false. Only returns true if `option.enabled` is present, in the config and true.
     *
     * @param {Object} option - FormConfig options object.
     *
     * @returns {boolean}
     */
    isEnabled(option) {
      if (!this.config.hasOwnProperty(option.enabled)) {
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
