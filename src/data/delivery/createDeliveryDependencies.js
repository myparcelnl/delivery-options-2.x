import { ADDITIONAL_OPTIONS, DELIVERY_DATE, DELIVERY_MOMENT } from '@/config/data/formConfig';
import { LOCALE } from '@/config/data/settingsConfig';
import { configBus } from '@/config/configBus';

/**
 * Create the dependencies object for delivery options.
 *
 * @param {Object} deliveryOptions - Delivery options object.
 */
export const createDeliveryDependencies = (deliveryOptions) => {
  configBus.dependencies[DELIVERY_DATE] = deliveryOptions.reduce((acc, option) => ({
    ...acc,
    [new Date(option.date.date).toLocaleDateString(configBus.get(LOCALE))]: {

      // delivery_moment is dependant on delivery_date
      [DELIVERY_MOMENT]: option.possibilities.reduce((acc, possibility) => ({
        ...acc,
        [possibility.type]: {

          moments: possibility.delivery_time_frames.reduce((acc, timeFrame) => ({
            ...acc,
            [timeFrame.type]: configBus.formatTime(timeFrame.date_time.date),
          }), {}),

          // And additional_options is dependant on delivery_moment
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
