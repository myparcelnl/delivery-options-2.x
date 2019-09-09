/**
 * Copied from /carriers responses. Last updated: 06/09/2019 14:01.
 *
 * @type {{dpd: Object, bpost: Object, postnl: Object}}
 */
const data = {
  postnl: {
    id: 1,
    name: 'postnl',
    human: 'PostNL',
    meta: {
      logo_svg: '/skin/general-images/carrier-logos/svg/postnl.svg',
      logo_png: '/skin/general-images/carrier-logos/postnl.png',
    },
  },
  bpost: {
    id: 2,
    name: 'bpost',
    human: 'bpost',
    meta: {
      logo_svg: '/skin/general-images/carrier-logos/svg/bpost.svg',
      logo_png: '/skin/general-images/carrier-logos/bpost.png',
    },
  },
  dpd: {
    id: 4,
    name: 'dpd',
    human: 'DPD',
    meta: {
      logo_svg: '/skin/general-images/carrier-logos/svg/dpd.svg',
      logo_png: '/skin/general-images/carrier-logos/dpd.png',
    },
  },
};

/**
 * Get fake carrier data by carrier name.
 *
 * @param {String} carrier - Carrier name.
 *
 * @returns {Object}
 */
export const carrierData = (carrier) => data[carrier];
