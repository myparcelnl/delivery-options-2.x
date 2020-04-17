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
   * @type {MyParcelDeliveryOptions.ShipmentOption[]}
   */
  shipmentOptions = [];

  update(values) {
    this.deliveryDate = values[FORM.DELIVERY_DATE] || this.deliveryDate;
    this.shipmentOptions = values[FORM.SHIPMENT_OPTIONS] || this.shipmentOptions;

    this.setCarrier(values[FORM.CARRIER]);
    this.setDeliveryType(values[FORM.DELIVERY_MOMENT]);
  }

  toObject() {
    return {
      isPickup: this.isPickup,
      date: this.deliveryDate,
      carrier: this.carrier,
      deliveryType: this.deliveryType,
      shipmentOptions: this.shipmentOptions,
    };
  }
}
