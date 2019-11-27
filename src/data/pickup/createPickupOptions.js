import { PICKUP_LOCATION } from '@/config/data/formConfig';
import Pickup from '@/components/Pickup/Pickup';
import { createPickupChoices } from '@/data/pickup/createPickupChoices';

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
