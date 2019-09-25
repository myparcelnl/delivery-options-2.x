import { DELIVERY_DATE, DELIVERY_MOMENT, SHIPMENT_OPTIONS } from '@/config/data/formConfig';
import { LOCALE } from '@/config/data/settingsConfig';
import { configBus } from '@/config/configBus';

/**
 * Create the dependencies object for delivery options.
 *
 * @param {Object} deliveryOptions - Delivery options object.
 *
 * @returns {Object}
 */
export const createDeliveryDependencies = (deliveryOptions) => ({
  [DELIVERY_DATE]: deliveryOptions.reduce((deliveryDates, option) => ({
    ...deliveryDates,
    [new Date(option.date.date).toLocaleDateString(configBus.get(LOCALE))]: {

      // delivery_moment is dependant on delivery_date
      [DELIVERY_MOMENT]: option.possibilities.reduce((deliveryMoments, possibility) => ({
        ...deliveryMoments,
        [possibility.type]: {

          moments: possibility.delivery_time_frames.reduce((acc, timeFrame) => ({
            ...acc,
            [timeFrame.type]: configBus.formatTime(timeFrame.date_time.date),
          }), {}),

          // And shipment_options is dependant on delivery_moment
          [SHIPMENT_OPTIONS]: possibility.shipment_options
            .reduce((shipmentOptions, shipmentOption) => ({
              ...shipmentOptions,
              [shipmentOption.name]: shipmentOption.schema,
            }), {}),
        },
      }), {}),
    },
  }), {}),
});
