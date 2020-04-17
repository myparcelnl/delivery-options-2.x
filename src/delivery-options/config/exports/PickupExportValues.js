import * as FORM from '@/config/formConfig';
import { ExportValues } from '@/delivery-options/config/exports/ExportValues';
import { configBus } from '@/delivery-options/config/configBus';
import { getPickupDate } from '@/delivery-options/data/pickup/getPickupDate';

export class PickupExportValues extends ExportValues {
  /**
   * @type {String}
   */
  deliveryDate;

  /**
   * @type {MyParcelDeliveryOptions.PickupLocation}
   */
  pickupLocation;

  update(values) {
    this.setCarrier(values[FORM.CARRIER]);
    this.setDeliveryType(values[FORM.PICKUP_MOMENT]);

    this.setPickupLocation(values);
  }

  /**
   * Set pickup location and moment, but only after they're both selected.
   *
   * @param {Object} values
   */
  setPickupLocation(values) {
    const pickupLocationName = values[FORM.PICKUP_LOCATION];

    if (!pickupLocationName || !values[FORM.PICKUP_MOMENT]) {
      return;
    }

    /*
     * After changing address while pickup is selected, the current pickupLocation might not be updated yet. This
     *  causes an error because the old pickup location likely doesn't exist anymore in the pickupLocations array.
     *
     * Return, because the next time pickupLocation will be set this condition will pass.
     */
    if (!configBus.pickupLocations.hasOwnProperty(pickupLocationName)) {
      return;
    }

    /*
     * Take out the possibilities array to use it to get the deliveryDate, but don't add it to the exportValues.
     * Also remove carrier from the pickupLocation object because it's already set in exportValues.carrier.
     */
    const { carrier, possibilities, ...pickupLocation } = configBus.pickupLocations[pickupLocationName];

    this.deliveryDate = getPickupDate(possibilities);
    this.pickupLocation = pickupLocation;
  }

  toObject() {
    return {
      isPickup: true,
      date: this.deliveryDate,
      carrier: this.carrier,
      deliveryType: this.deliveryType,
      pickupLocation: this.pickupLocation,
    };
  }
}
