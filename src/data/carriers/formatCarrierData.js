import { appConfig } from '@/config/appConfig';

/**
 * Format the carriers response to fit in the checkout form.
 *
 * @param {Array} response - Response array from /carriers.
 *
 * @returns {Array}
 */
export const formatCarrierData = (response) => {
  return response.reduce((acc, val) => [
    {
      ...acc,
      id: val.id,
      name: val.name,
      label: val.human,
      image: `${appConfig.assetsUrl}/${val.meta.logo_svg}`,
    },
  ], []);
};
