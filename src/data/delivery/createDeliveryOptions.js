import { DELIVERY, DELIVERY_DATE, DELIVERY_MOMENT, SHIPMENT_OPTIONS } from '@/config/data/formConfig';
import { configBus } from '@/config/configBus';
import { createDeliveryDependencies } from '@/data/delivery/createDeliveryDependencies';
import { fetchDeliveryOptions } from '@/data/delivery/fetchDeliveryOptions';
import { formatDeliveryMoments } from '@/data/delivery/formatDeliveryMoments';
import { formatShipmentOptions } from '@/data/delivery/formatShipmentOptions';
import { getDeliveryDates } from '@/data/delivery/getDeliveryDates';

/**
 * If multi carrier, return another level of settings.
 *
 * @param {MyParcel.CarrierName} carrier - Carrier name or id.
 *
 * @returns {Promise<DeliveryOptionsFormChoice[]>}
 */
export async function createDeliveryOptions(carrier = configBus.currentCarrier) {
  const deliveryOptions = await fetchDeliveryOptions(carrier);

  if (!deliveryOptions.length) {
    return [];
  }

  configBus.dependencies[carrier] = createDeliveryDependencies(deliveryOptions);

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
      name: SHIPMENT_OPTIONS,
      type: 'checkbox',
      dependency: {
        name: [DELIVERY_DATE, DELIVERY_MOMENT],
        parent: SHIPMENT_OPTIONS,
        transform: formatShipmentOptions,
      },
      choices: [],
    },
  ];
}
