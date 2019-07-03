/**
 *
 * @param {Object} deliveryOptions - Delivery options object.
 *
 * @returns {Array|null}
 */
export function getDeliveryDates(deliveryOptions) {
  return deliveryOptions ? deliveryOptions.map((option) => option.date) : null;
}
