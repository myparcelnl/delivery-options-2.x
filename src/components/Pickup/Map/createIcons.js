/* eslint-disable no-magic-numbers */
import { configBus } from '@/config/configBus';

/**
 * Create icons for carriers and the default and loading states.
 *
 * @param {String} className - Class to add to all markers.
 *
 * @returns {Object}
 */
export const createIcons = (className = null) => {
  const carrierIcons = configBus.carrierData.reduce((acc, carrier) => {
    const iconSize = 38;
    const iconHalfSize = iconSize / 2;

    const CarrierIcon = L.Icon.extend({
      options: {
        className,
        iconUrl: carrier.image,
        iconSize: [iconSize, 'auto'],
        iconAnchor: [iconSize, iconSize],
        popupAnchor: [-iconHalfSize, -iconSize],
      },
    });

    return {
      ...acc,
      [carrier.name]: new CarrierIcon(),
      /**
       * Add an active version of each carrier icon.
       */
      [`${carrier.name}_active`]: new CarrierIcon({
        className: `${className} ${className}--active`,
      }),
    };
  }, {});

  return {
    ...carrierIcons,
    default: L.divIcon({
      className: `${className} ${className}--center`,
      iconSize: [10, 10],
      iconAnchor: [5, 5],
    }),
  };
};
