/* eslint-disable no-magic-numbers */
import MarkerSvg from '!raw-loader!@/assets/images/marker.svg';
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
    const iconSize = [36, 40];
    const [iconWidth, iconHeight] = iconSize;

    const iconHalfWidth = iconWidth / 2;

    const CarrierIcon = L.DivIcon.extend({
      options: {
        className: `${className} ${className}--${carrier.name}`,
        html: `
          ${MarkerSvg}
          <img
            class="${className}__logo"
            src="${carrier.image}"
            height="${iconHeight * .5}"
            alt="${carrier.label} logo" />
        `,
        iconSize: iconSize,
        iconAnchor: iconSize,
        popupAnchor: [-iconHalfWidth, -iconWidth],
      },
    });

    return {
      ...acc,
      [carrier.name]: new CarrierIcon(),
      /**
       * Add an active version of each carrier icon.
       */
      [`${carrier.name}_active`]: new CarrierIcon({
        className: `${className} ${className}--${carrier.name} leaflet-marker-active`,
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
