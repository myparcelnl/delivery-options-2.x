declare namespace MyParcelCheckout {
  type Carrier = 'postnl' | 'bpost' | 'dpd';
  type Platform = 'myparcel' | 'belgie' | 'flespakket';

  /**
   * Configuration object supplied by the platform.
   */
  interface Configuration {
    address: Address,
    strings: Strings,
    config: Config,
  }

  /**
   * Address object from the external platform.
   */
  interface Address {
    cc: String,
    number: String | Number,
    postalCode: String,
    city?: String
  }

  /**
   * Strings object from the external platform.
   */
  interface Strings {
    city: String,
    postcode: String,
    houseNumber: String,
    addressNotFound: String,
    again: String,
    closed: String,
    discount: String,
    free: String,
    from: String,
    loadMore: String,
    retry: String,
    deliveryEveningTitle: String,
    deliveryMorningTitle: String,
    deliveryStandardTitle: String,
    deliveryTitle: String,
    onlyRecipientTitle: String,
    pickUpFrom: String,
    pickupTitle: String,
    signatureTitle: String,
    openingHours: String,

    // BE only
    saturdayDeliveryTitle?: String,
    wrongPostalCodeCity?: String,

    // NL only
    beDeliveryStandardTitle?: String,
    beDeliveryTitle?: String,
    wrongHouseNumberPostcode?: String,
  }

  /**
   * Configuration object from the external platform.
   */
  interface Config {
    apiBaseUrl: String,
    locale: String,
    carriers: String | Array<String>,
    platform: Platform,
    currency: String,

    cutoffTime: String,
    deliveryDaysWindow: String | Number,
    dropOffDays: String,
    dropOffDelay: String | Number,

    // BE only
    saturdayCutoffTime?: String,

    allowDeliveryOptions: Boolean,
    allowPickupPoints: Boolean,

    carrierSettings: CarrierSettings,
  }

  type CarrierSettings = {
    [key in Carrier]?: {
      allowEveningDelivery?: Boolean,
      allowMorningDelivery?: Boolean,
      allowOnlyRecipient?: Boolean,
      allowPickupExpress?: Boolean,
      allowSignature?: Boolean,

      // NL only
      allowSaturdayDelivery?: Boolean,

      // BE only
      allowMondayDelivery?: Boolean,

      priceEveningDelivery?: Number,
      priceMorningDelivery?: Number,
      priceOnlyRecipient?: Number,
      pricePickup?: Number,
      pricePickupExpress?: Number,
      priceSignature?: Number,
      priceStandardDelivery?: Number,
    };
  };

  interface CarrierData {
    id: Number,
    name: String,
    human: String,
    meta: {
      logo_png: String,
      logo_svg: String,
    }
  }

  interface StartEndDate {
    start: {
      date: String,
      timezone: String,
    },
    end: {
      date: String,
      timezone: String,
    },
  }
}

declare module 'MyParcelCheckout' {
  export = MyParcelCheckout;
}
