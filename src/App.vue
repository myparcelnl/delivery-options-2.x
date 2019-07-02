<template>
  <div
    v-if="showCheckout"
    class="myparcel-checkout">
    <loader v-if="loading" />
    <div
      v-else-if="!errors && !!deliveryOptions && deliveryOptions.length > 0"
      class="myparcel-checkout__delivery-options">
      <recursive-form
        v-for="option in form.options"
        :key="option.name"
        :option="option" />
      <input
        id="mypa-input"
        :value="externalData"
        hidden>
    </div>

    <div
      v-else
      class="myparcel-checkout__errors">
      <div class="alert alert-danger mt-2">
        Check de volgende errors:
        <ul>
          <li v-text="strings.addressNotFound" />
          <li v-text="strings.wrongHouseNumberPostcode" />
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import {
  CARRIER_POSTNL,
  DELIVERY_PICKUP_EXPRESS,
  formConfig,
} from './config/formConfig';
import { Delivery } from '../myparcel-js-sdk/src/endpoint/delivery';
import Loader from './components/Loader';
import { Pickup } from '../myparcel-js-sdk/src/endpoint/pickup';
import { configBus } from './config/configBus';
import debounce from 'debounce';
import demoDeliveryOptions from './config/demoDeliveryOptions';

export default {
  name: 'App',
  components: { Loader },

  data() {
    return {
      /**
       * Whether the checkout is loading or not.
       * @type {Boolean}
       */
      loading: true,

      /**
       * Whether there are errors causing the checkout not to show or not.
       *
       * @type {Boolean}
       */
      errors: false,

      /**
       * The form object which will be filled with all checkout fields and options.
       *
       * @type {Object}
       */
      form: {},

      /**
       * Delivery options array from the API.
       *
       * @type {Array}
       */
      deliveryOptions: null,

      /**
       * Pickup options array from the API.
       *
       * @type {Array}
       */
      pickupOptions: null,

      /**
       * The object that will be converted to a JSON string and put in `#mypa-input`.
       *
       * @type {String}
       */
      externalData: null,
    };
  },

  computed: {
    configBus: () => configBus,
    config: () => configBus.config,
    strings: () => configBus.textToTranslate,
    showCheckout: () => configBus.showCheckout,

    additionalOptions() {
      const options = [];

      if (this.config.allowOnlyRecipient) {
        options.push(formConfig.additionalOptions.onlyRecipient);
      }

      if (this.config.allowSignature) {
        options.push(formConfig.additionalOptions.signature);
      }

      return options;
    },

    deliveryDates() {
      return this.deliveryOptions ? this.deliveryOptions.map((option) => option.date) : null;
    },

    pickupPoints() {
      return this.pickupOptions ? this.pickupOptions.map((option) => option.date) : null;
    },
  },

  created() {
    this.getCheckout();

    // Add the new data to the values object
    configBus.$on('update', this.updateExternalData);
    // Debounce trigger updating the checkout
    configBus.$on('update', debounce(this.updateExternal, 300));
  },

  methods: {

    /**
     * Get the checkout.
     *
     * @returns {Promise}
     */
    async getCheckout() {
      if (!configBus.showCheckout) {
        configBus.showCheckout = true;
      }

      this.reset();
      configBus.setAddress();

      const carrier = configBus.hasOwnProperty('carrier') ? configBus.carrier : CARRIER_POSTNL;
      await this.fetchDeliveryOptions(carrier);

      if (!this.errors) {
        const choices = [
          this.getDeliverOptions(),
        ];

        if (configBus.config.allowPickupPoints) {
          choices.push(this.getPickupOptions());
        }

        this.form = {
          options: [
            {
              name: 'delivery',
              type: 'radio',
              choices,
            },
          ],
        };
      }

      this.loading = false;
    },

    hideCheckout() {
      configBus.showCheckout = false;
    },

    /**
     * Get delivery option.
     *
     * @param {Object} time - Time object from delivery_options.
     */
    getDeliveryOption(time) {
      const option = formConfig.delivery[time.type];

      // Return if the current delivery type is turned off in the config.
      if (configBus.isEnabled(option)) {

        // If the current label isn't in the config or is an empty string show the delivery time as the title
        if (!option.hasOwnProperty('label')
          || !configBus.textToTranslate.hasOwnProperty(option.label)
          || !configBus.textToTranslate[option.label]) {
          // Remove the regular label and add a custom one
          delete option.label;
          option.plainLabel = `${time.start} – ${time.end}`;
        }

        return option;
      }
    },

    /**
     * Get pickup moments.
     *
     * @param {Object} key - Key.
     *
     * @returns {Object}
     */
    getPickupMoments(key) {
      if (!this.pickupOptions.length) {
        return null;
      }

      const moments = [];

      this.pickupOptions[key].time.forEach((time) => {
        const pickupText = `${this.strings.pickUpFrom} ${time.start}`;

        if (DELIVERY_PICKUP_EXPRESS === time.type && !this.config.allowPickupExpress) {
          return;
        }

        moments.push({
          ...formConfig.pickup[time.type],
          plainLabel: pickupText,
        });
      });

      return moments;
    },

    /**
     * Get delivery moments.
     *
     * @param {Object} carrier - Carrier.
     *
     * @returns {Object}
     */
    getDeliveryMoments(carrier) {
      if (!this.deliveryOptions || !this.deliveryOptions.length) {
        console.log('!this.deliveryOptions || !this.deliveryOptions.length');
        return null;
      }

      const index = configBus.values.deliveryMoment || 0;

      return this.deliveryOptions[index].time.map((time) => {
        const deliveryOption = this.getDeliveryOption(time);

        if (!!deliveryOption) {
          return deliveryOption;
        }
      });
    },

    /**
     * Get deliver options for carriers in the config.
     *
     * @returns {Object}
     */
    getDeliverOptions() {
      const deliver = {
        name: 'deliver',
        label: 'deliveryTitle',
      };

      const options = (carrier = null) => [
        {
          name: 'deliveryDate',
          type: 'select',
          choices: this.deliveryDates,
        },
        {
          name: 'deliveryMoment',
          type: 'radio',
          choices: this.getDeliveryMoments(carrier),
        },
        {
          name: 'additionalOptions',
          type: 'checkbox',
          choices: this.additionalOptions,
        },
      ];

      if (configBus.isMultiCarrier) {
        deliver.type = 'radio';
        deliver.options = [
          {
            type: 'radio',
            name: 'deliveryCarrier',
            label: 'carrier',
            choices: this.config.carrierData.map((carrier) => ({
              ...carrier,
              options: options(carrier),
            })),
          },
        ];
      } else {
        deliver.options = options();
      }

      return deliver;
    },

    /**
     * Get the pickup options if they are enabled in the config.
     *
     * @returns {Object|undefined}
     */
    getPickupOptions() {
      if (configBus.config.allowPickupPoints) {
        return {
          name: 'pickup',
          label: 'pickupTitle',
          options: [
            {
              name: 'pickupMoment',
              type: 'radio',
              component: 'PickupOption',
              overflow: true,
              choices: this.pickupOptions.map((option, key) => {
                const pickup = {
                  ...option,
                  name: key,
                  label: option.location,
                  // TODO: Random carrier right now
                  carrier: Math.round((Math.random() * (this.config.carrierData.length - 1)) + 1),
                };

                pickup.image = formConfig.carriers[pickup.carrier].image;
                pickup.options = [
                  {
                    name: 'pickupLocationTime',
                    type: 'radio',
                    choices: this.getPickupMoments(key),
                  },
                ];

                return pickup;
              }),
            },
          ],
        };
      }
    },

    /**
     * Fetch delivery options.
     *
     * @returns {Promise}
     */
    async fetchDeliveryOptions(carrier) {
      const { cc, number, postalCode } = configBus.address;

      if (!cc || !postalCode || !number) {
        this.errors = true;
        return;
      }

      const deliveryOptionsEndpoint = new Delivery();
      const pickupOptionsEndpoint = new Pickup();

      try {
        // const pickupOptions = await pickupOptionsEndpoint.search(params);
        // const deliveryOptions = await deliveryOptionsEndpoint.search(params);

        const url = new URL('https://api.myparcel.nl/delivery_options');

        Object.keys(configBus.requestParameters).forEach((param) => {
          url.searchParams.append(param, configBus.requestParameters[param]);
        });

        let response;

        if (configBus.mock) {
          response = await new Promise((resolve) => {
            setTimeout(() => {
              resolve(demoDeliveryOptions);
            }, configBus.mockDelay || 0);
          });
        } else {
          response = await (await fetch(url.href)).json();
        }

        const deliveryOptions = response.data.delivery;
        const pickupOptions = response.data.pickup;

        if (response.hasOwnProperty('errors')) {
          this.errors = response.errors;
        } else {
          this.deliveryOptions = deliveryOptions.length ? deliveryOptions : null;
          this.pickupOptions = pickupOptions.length ? pickupOptions : null;
        }
      } catch (e) {
        this.errors = true;
        console.error(e);
      }
    },

    /**
     * Trigger an update on the checkout. Throttled to avoid overloading the external platform with updates.
     */
    updateExternal() {
      const event = document.createEvent('HTMLEvents');
      event.initEvent('update_checkout', true, false);

      document.querySelector('body').dispatchEvent(event);
    },

    /**
     * Updates the configBus and the #mypa-input element with the new checkout data.
     *
     * @param {Object} data - Data object. Can only contain properties `name` and `value`.
     */
    updateExternalData(data) {
      configBus.values[data.name] = data.value;
      this.externalData = JSON.stringify(configBus.values);
    },

    /**
     * Reset all data.
     */
    reset() {
      configBus.values = {};
      this.loading = true;
      this.errors = false;
      this.deliveryOptions = null;
      this.pickupOptions = null;
    },
  },
};
</script>
