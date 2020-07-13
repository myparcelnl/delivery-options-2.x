import { PICKUP_LOCATION } from '@/config/formConfig';
import Pickup from '@/delivery-options/components/Pickup/Pickup';
import { createPickupChoices } from '@/delivery-options/data/pickup/createPickupChoices';

/**
 * Create the pickup options array.
 *
 * @returns {Promise.<MyParcelDeliveryOptions.FormEntry[]>}
 */
export const createPickupOptions = async() => [
  {
    name: PICKUP_LOCATION,
    type: 'radio',
    component: Pickup,
    choices: await createPickupChoices(),
    loop: false,
  },
];
