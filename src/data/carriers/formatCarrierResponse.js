import { appConfig } from '@/config/data/appConfig';

/**
 * Format the carriers response to fit in the checkout form.
 *
 * @param {Array} response - Response array from /carriers.
 *
 * @returns {Array}
 */
export const formatCarrierResponse = (response) => {
  return response.map((carrier) => ({
    id: carrier.id,
    name: carrier.name,
    label: carrier.human,
    image: `${appConfig.assetsUrl}/${carrier.meta.logo_svg}`,
  }));
};
