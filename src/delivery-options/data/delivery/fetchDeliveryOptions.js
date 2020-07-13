import * as CONFIG from '@/data/keys/configKeys';
import { fetchFromEndpoint, METHOD_SEARCH } from '@/delivery-options/data/request/fetchFromEndpoint';
import { allowedInCarrier } from '@/sandbox/settings/conditions/allowedInCarrier';
import { configBus } from '@/delivery-options/config/configBus';
import { getRequestParameters } from '@/delivery-options/data/request/getRequestParameters';

/**
 * Fetch delivery options.
 *
 * @param {MyParcel.CarrierName} carrier - Carrier name.
 *
 * @returns {Promise}
 */
export function fetchDeliveryOptions(carrier = configBus.currentCarrier) {
  const carrierAllowsPackageType = allowedInCarrier(carrier, [
    CONFIG.ALLOW_PACKAGE_TYPE_MAILBOX,
    CONFIG.ALLOW_PACKAGE_TYPE_DIGITAL_STAMP,
  ]);

  const packageType = carrierAllowsPackageType
    ? {
      package_type: configBus.get(CONFIG.PACKAGE_TYPE),
    }
    : {};

  return fetchFromEndpoint(
    'delivery_options',
    {
      method: METHOD_SEARCH,
      params: {
        ...packageType,
        ...getRequestParameters(carrier),
      },
    },
  );
}
