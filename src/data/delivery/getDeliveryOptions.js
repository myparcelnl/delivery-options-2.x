import {
  ADDITIONAL_OPTIONS,
  DELIVER,
  DELIVERY,
  DELIVERY_CARRIER,
  DELIVERY_DATE,
  DELIVERY_MOMENT,
} from '@/config/data/formConfig';
import { DELIVERY_TITLE } from '@/config/data/settingsConfig';
import { configBus } from '@/config/configBus';
import { deliveryAdditionalOptions } from './getDeliveryAdditionalOptions';
import { fetchDeliveryOptions } from './fetchDeliveryOptions';
import { getDeliveryDates } from '@/data/delivery/getDeliveryDates';
import { getDeliveryPossibility } from '@/data/delivery/getDeliveryPossibility';

/**
 * Get deliver options for carriers in the config.
 *
 * @returns {Object}
 */
export function getDeliveryOptions() {
  return {
    name: DELIVER,
    label: DELIVERY_TITLE,
    type: 'radio',
    // If multi carrier, return another level of settings and their options based on carrier.
    options: configBus.isMultiCarrier
      ? [{
        name: DELIVERY_CARRIER,
        type: 'radio',
        choices: configBus.carrierData.map((carrier) => ({
          ...carrier,
          options: () => options(carrier.name),
        })),
      }]
      : options,
  };
}

/**
 * If multi carrier, return another level of settings.
 *
 * @param {String|Number} carrier - Carrier name or id.
 *
 * @returns {Promise<Object[]>}
 */
async function options(carrier = configBus.currentCarrier) {
  const { response: deliveryOptions } = await fetchDeliveryOptions(carrier);

  if (deliveryOptions.length) {
    configBus.deliveryOptions = deliveryOptions;
    createDeliveryDependencies(deliveryOptions);

    return [
      {
        name: DELIVERY_DATE,
        type: 'select',
        choices: getDeliveryDates(deliveryOptions),
      },
      {
        name: DELIVERY_MOMENT,
        type: 'radio',
        dependency: {
          name: DELIVERY_DATE,
          parent: DELIVERY,
          transform: getDeliveryPossibility,
        },
        choices: [],
      },
      {
        name: ADDITIONAL_OPTIONS,
        type: 'checkbox',
        dependency: {
          name: [DELIVERY_DATE, DELIVERY_MOMENT],
          parent: ADDITIONAL_OPTIONS,
          transform: deliveryAdditionalOptions,
        },
        choices: [],
      },
    ];
  }
}

/**
 * Create the dependencies object for delivery options.
 *
 * @param {Object} deliveryOptions - Delivery options object.
 */
const createDeliveryDependencies = (deliveryOptions) => {
  configBus.dependencies[DELIVERY_DATE] = deliveryOptions.reduce((acc, option) => ({
    ...acc,
    [new Date(option.date.date).toLocaleDateString(configBus.config.locale)]: {

      [DELIVERY_MOMENT]: option.possibilities.reduce((acc, possibility) => ({
        ...acc,
        [possibility.type]: {

          moments: possibility.delivery_time_frames.reduce((acc, timeFrame) => ({
            ...acc,
            [timeFrame.type]: configBus.formatTime(timeFrame.date_time.date),
          }), {}),

          [ADDITIONAL_OPTIONS]: {
            ...possibility.shipment_options.reduce((acc, shipmentOption) => ({
              ...acc,
              [shipmentOption.name]: shipmentOption.schema,
            }), {}),
          },
        },
      }), {}),
    },
  }), {});
};
