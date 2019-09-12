declare namespace MyParcel {
  type CarrierName = 'postnl' | 'bpost' | 'dpd'
  type CarrierNameOrId = CarrierName | Number
  type Platform = 'myparcel' | 'belgie' | 'flespakket'

  type DeliveryType = 'morning' | 'standard' | 'evening' | 'pickup' | 'pickup_express'
  type AdditionalOptionName = 'cooled_delivery' | 'large_format' | 'only_recipient' | 'signature' | 'return'

  /**
   * Configuration object supplied by the platform.
   */
  interface DeliveryOptionsConfiguration {
    address: DeliveryOptionsAddress
    strings: DeliveryOptionsStrings
    config: DeliveryOptionsConfig
  }

  /**
   * Address object from the external platform.
   */
  interface DeliveryOptionsAddress {
    cc: String
    number: String | Number
    postalCode: String
    city?: String
  }

  /**
   * Strings object from the external platform.
   */
  interface DeliveryOptionsStrings {
    city: String
    postcode: String
    houseNumber: String
    addressNotFound: String
    again: String
    closed: String
    discount: String
    free: String
    from: String
    loadMore: String
    retry: String
    headerDeliveryOptions: String
    deliveryEveningTitle: String
    deliveryMorningTitle: String
    deliveryStandardTitle: String
    deliveryTitle: String
    onlyRecipientTitle: String
    pickUpFrom: String
    pickupTitle: String
    signatureTitle: String
    openingHours: String

    // BE only
    saturdayDeliveryTitle?: String
    wrongPostalCodeCity?: String

    // NL only
    beDeliveryStandardTitle?: String
    beDeliveryTitle?: String
    wrongHouseNumberPostcode?: String
  }

  /**
   * Response from /delivery_options
   */
  interface DeliveryOption {
    date: Timestamp
    possibilities: DeliveryPossibility[]
  }

  /**
   * Response from /pickup_locations
   */
  interface PickupLocation {
    address: {
      cc: String
      city: String
      number: String
      postal_code: String
      street: String
    }
    location: {
      distance: String
      latitude: String
      location_code: String
      location_name: String
      longitude: String
      phone_number: String
      retail_network_id: String
      opening_hours: {
        monday: StartEndDate[]
        tuesday: StartEndDate[]
        wednesday: StartEndDate[]
        thursday: StartEndDate[]
        friday: StartEndDate[]
        saturday: StartEndDate[]
        sunday: StartEndDate[]
      }
    }
    possibilities: PickupPossibility[]
  }

  /**
   * Configuration object from the external platform.
   */
  interface DeliveryOptionsConfig {
    apiBaseUrl: String
    locale: String
    carriers: String | Array<String>
    platform: Platform
    currency: String

    allowDeliveryOptions: Boolean
    allowPickupLocations: Boolean

    cutoffTime: String
    deliveryDaysWindow: String | Number
    dropOffDays: String
    dropOffDelay: String | Number

    // BE only
    saturdayCutoffTime?: String

    carrierSettings: CarrierSettings

    // Feature toggles
    allowRetry: Boolean
    pickupShowDistance: Boolean
  }

  type CarrierSettings = {
    [key in CarrierName]?: {
      allowEveningDelivery?: Boolean
      allowMorningDelivery?: Boolean
      allowOnlyRecipient?: Boolean
      allowPickupExpress?: Boolean
      allowSignature?: Boolean

      // NL only
      allowSaturdayDelivery?: Boolean

      // BE only
      allowMondayDelivery?: Boolean

      priceEveningDelivery?: Number
      priceMorningDelivery?: Number
      priceOnlyRecipient?: Number
      pricePickup?: Number
      pricePickupExpress?: Number
      priceSignature?: Number
      priceStandardDelivery?: Number
    }
  }

  interface CarrierData {
    id: Number
    name: CarrierName
    human: String
    meta: {
      logo_png: String
      logo_svg: String
    },
    deliveryEnabled?: boolean,
    pickupEnabled?: boolean
  }

  interface Timestamp {
    date: String
    timezone: String
    timezone_type: Number
  }

  /**
   * A start and end date object.
   */
  interface StartEndDate {
    start: Timestamp
    end: Timestamp
  }

  interface ShipmentOption {
    name: AdditionalOptionName
    schema: {
      type: String
      enum: Boolean[]
    }
  }

  interface DeliveryTimeFrame {
    type: String
    date_time: Timestamp
  }

  interface DeliveryPossibility {
    type: DeliveryType
    shipment_options: ShipmentOption[]
    collect_date: any
    delivery_time_frames: DeliveryTimeFrame[]
  }

  interface PickupPossibility {
    delivery_type_id: Number
    delivery_type_name: DeliveryType
    moment: {
      start: Timestamp
    }
  }
}

declare module 'MyParcel' {
  export = MyParcel
}
