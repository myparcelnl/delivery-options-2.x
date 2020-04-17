import * as FORM from '@/config/formConfig';
import { DEFAULT_PACKAGE_TYPE } from '@/data/keys/settingsConsts';
import { ExportValues } from '@/delivery-options/config/exports/ExportValues';

export class DeliveryExportValues extends ExportValues {
  /**
   * @type {Boolean}
   */
  isPickup = false;

  /**
   * @type {String}
   */
  deliveryDate;

  /**
   * @type {MyParcel.PackageType}
   */
  packageType = DEFAULT_PACKAGE_TYPE;

  /**
   * @type {MyParcelDeliveryOptions.ShipmentOption[]}
   */
  shipmentOptions = [];

  update(values) {
    this.deliveryDate = values[FORM.DELIVERY_DATE] || this.deliveryDate;
    this.shipmentOptions = values[FORM.SHIPMENT_OPTIONS] || this.shipmentOptions;

    this.setCarrier(values[FORM.CARRIER]);
    this.setDeliveryType(values[FORM.DELIVERY_MOMENT]);

    this.setPackageType(values[FORM.PACKAGE_TYPE] || this.packageType);
  }

  /**
   * @param {MyParcel.PackageType} packageType
   */
  setPackageType(packageType) {
    if (packageType === DEFAULT_PACKAGE_TYPE) {
      return;
    }

    this.deliveryType = null;
    this.date = null;
    this.shipmentOptions = [];
    this.packageType = packageType;
  }

  /**
   * There's no delivery type with other package types (yet) so super.isComplete() will return false forever.
   *
   * @returns {Boolean|Boolean}
   */
  isComplete() {
    if (this.packageType === DEFAULT_PACKAGE_TYPE) {
      return super.isComplete();
    }

    return true;
  }

  toObject() {
    return {
      isPickup: this.isPickup,
      date: this.deliveryDate,
      carrier: this.carrier,
      packageType: this.packageType,
      deliveryType: this.deliveryType,
      shipmentOptions: this.shipmentOptions,
    };
  }
}
