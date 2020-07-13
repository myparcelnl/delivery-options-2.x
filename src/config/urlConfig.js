import { appConfig } from '@/config/appConfig';

export const getUrl = {
  /**
   * Get the carrier logo as .svg.
   *
   * @param {MyParcel.CarrierName} carrier
   *
   * @returns {String}
   */
  carrierLogo(carrier) {
    return `${appConfig.assetsUrl}/skin/general-images/carrier-logos/svg/${carrier}.svg`;
  },
};
