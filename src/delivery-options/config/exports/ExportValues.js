export class ExportValues {
  /**
   * @type {MyParcel.CarrierName}
   */
  carrier;

  /**
   * @type {MyParcel.DeliveryType}
   */
  deliveryType;

  /**
   * Method to check if the values are complete and should be communicated with the external platform.
   *
   * @returns {Boolean}
   */
  isComplete() {
    return !!this.deliveryType;
  }

  /**
   * @param {MyParcel.CarrierName} carrier
   */
  setCarrier(carrier) {
    this.carrier = carrier || this.carrier;
  }

  /**
   * @param {MyParcel.DeliveryType} deliveryType
   */
  setDeliveryType(deliveryType) {
    this.deliveryType = deliveryType;
  }
}
