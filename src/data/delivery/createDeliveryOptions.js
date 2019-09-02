import { ADDITIONAL_OPTIONS, DELIVERY, DELIVERY_DATE, DELIVERY_MOMENT } from '@/config/data/formConfig';
import { configBus } from '@/config/configBus';
import { createDeliveryDependencies } from '@/data/delivery/createDeliveryDependencies';
import { fetchDeliveryOptions } from '@/data/delivery/fetchDeliveryOptions';
import { formatAdditionalOptions } from '@/data/delivery/getDeliveryAdditionalOptions';
import { formatDeliveryMoments } from '@/data/delivery/formatDeliveryMoments';
import { getDeliveryDates } from '@/data/delivery/getDeliveryDates';

/**
 * If multi carrier, return another level of settings.
 *
 * @param {String|Number} carrier - Carrier name or id.
 *
 * @returns {Promise<Object[]>}
 */
export async function createDeliveryOptions(carrier = configBus.currentCarrier) {
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
          transform: formatDeliveryMoments,
        },
        choices: [],
      },
      {
        name: ADDITIONAL_OPTIONS,
        type: 'checkbox',
        dependency: {
          name: [DELIVERY_DATE, DELIVERY_MOMENT],
          parent: ADDITIONAL_OPTIONS,
          transform: formatAdditionalOptions,
        },
        choices: [],
      },
    ];
  }
}
