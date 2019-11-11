import { PICKUP, PICKUP_EXPRESS, PICKUP_MOMENT, PICKUP_STANDARD, formConfig } from '@/config/data/formConfig';
import { configBus } from '@/config/configBus';
import { createLocaleString } from '@/data/dates/createLocaleString';

/**
 * Get pickup moments.
 *
 * @param {object} pickupLocation - Pickup location to render.
 *
 * @param {Array} pickupLocation.possibilities - Possibilities array.
 * @param {object} pickupLocation.possibilities.delivery_type_name - Possibilities array.
 *
 * @returns {DeliveryOptionsFormChoice[]}
 */
export function getPickupMoments(pickupLocation) {

  /**
   * Sort moments by pickup time, from early to late.
   *
   * @param {object} dateA
   * @param {MyParcel.StartEndDate} dateA.moment
   * @param {object} dateB
   * @param {MyParcel.StartEndDate} dateB.moment
   */
  pickupLocation.possibilities.sort((dateA, dateB) => {
    return new Date(dateA.moment.start.date) - new Date(dateB.moment.start.date);
  });

  return [
    {
      name: PICKUP_MOMENT,
      type: 'radio',
      choices: pickupLocation.possibilities.map((possibility) => {
        const pickupTime = createLocaleString(possibility.moment.start.date);
        const pickupText = `${configBus.strings.pickUpFrom} ${pickupTime}`;

        if (!configBus.isEnabled(possibility.delivery_type_name)) {
          return;
        }

        const deliveryTypeMap = {
          pickup: PICKUP_STANDARD,
          pickup_express: PICKUP_EXPRESS,
        };

        return {
          ...formConfig[PICKUP].options[deliveryTypeMap[possibility.delivery_type_name]],
          plainLabel: pickupText,
        };
      }),
    },
  ];
}
