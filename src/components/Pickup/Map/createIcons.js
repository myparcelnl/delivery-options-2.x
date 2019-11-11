import { configBus } from '@/config/configBus';

const iconSize = 38;
const iconHalfSize = iconSize / 2;

/**
 *
 */
export function createIcons() {
  const icons = configBus.carrierData.reduce((acc, carrier) => ({
    ...acc,
    [carrier.name]: L.icon({
      iconUrl: carrier.image,
      iconSize: [iconSize, 'auto'],
      iconAnchor: [iconSize, iconSize],
      popupAnchor: [-iconHalfSize, -iconSize],
    }),
  }), {});

  icons.loading = L.icon({
    iconUrl: require('@/assets/images/loading.gif'),
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

  icons.default = new L.Icon.Default();

  return icons;
}
