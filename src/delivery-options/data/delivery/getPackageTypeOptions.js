import { packageTypeLabelMap, packageTypePriceMap } from '@/data/keys/packageTypeConfig';
import { PACKAGE_TYPE } from '@/config/formConfig';

/**
 * @param {MyParcel.PackageType} packageType
 * @returns {MyParcelDeliveryOptions.FormEntry}
 */
export function getPackageTypeOptions(packageType) {
  return {
    name: PACKAGE_TYPE,
    type: 'heading',
    choices: [
      {
        name: packageType,
        type: 'radio',
        label: packageTypeLabelMap[packageType],
        price: packageTypePriceMap[packageType],
      },
    ],
  };
}
