import { appConfig } from '@/config/appConfig';

export default {
  data: {
    carriers: [
      {
        id: 1,
        name: 'postnl',
        label: 'PostNL',
        image: `${appConfig.assetsUrl}/skin/general-images/carrier-logos/svg/postnl.svg`,
      },
      {
        id: 2,
        name: 'bpost',
        label: 'bpost',
        image: `${appConfig.assetsUrl}/skin/general-images/carrier-logos/svg/bpost.svg`,
      },
      {
        id: 4,
        name: 'dpd',
        label: 'DPD',
        image: `${appConfig.assetsUrl}/skin/general-images/carrier-logos/svg/dpd.svg`,
      },
    ],
  },
};
