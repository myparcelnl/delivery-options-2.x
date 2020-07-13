import { DELIVERY_DATE, DELIVERY_MOMENT, SHIPMENT_OPTIONS } from '@/config/formConfig';
import { createIsoString } from '@/delivery-options/data/dates/createIsoString';
import { createLocaleString } from '@/delivery-options/data/dates/createLocaleString';

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
    [createIsoString(option.date.date)]: {

      // delivery_moment is dependant on delivery_date
      [DELIVERY_MOMENT]: option.possibilities.reduce((deliveryMoments, possibility) => ({
        ...deliveryMoments,
        [possibility.type]: {

          moments: possibility.delivery_time_frames.reduce((acc, timeFrame) => ({
            ...acc,
            [timeFrame.type]: createLocaleString(timeFrame.date_time.date),
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
