import './jest';
import {Vue} from 'vue/types/vue';

declare namespace MyParcel {
  type CarrierName = 'postnl' | 'bpost' | 'dpd'
  type CarrierNameOrId = CarrierName | Number
  type Platform = 'myparcel' | 'belgie' | 'flespakket'

  /**
   * @see https://myparcelnl.github.io/api/#6_A_2
   */
  type DeliveryType = 'morning' | 'standard' | 'evening' | 'pickup' | 'pickup_express'

  /**
   * @see https://myparcelnl.github.io/api/#6_A_3
   */
  type ShipmentOptionName = 'cooled_delivery' | 'large_format' | 'only_recipient' | 'signature' | 'return'
}

declare namespace MyParcelDeliveryOptions {

  /**
   * Configuration object supplied by the platform.
   */
  interface Configuration {
    address: Address
    strings: Strings
    config: Config
  }

  /**
   * Address object from the external platform.
   */
  interface Address {
    cc: String
    number: String | Number
    postalCode: String
    city?: String
  }

  /**
   * Strings object from the external platform.
   */
  interface Strings {
    city: String
    postalCode: String
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
    pickupLocationsListButton: String
    pickupLocationsMapButton: String

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
  interface Config {
    apiBaseUrl: String
    locale: String
    carriers: String | Array<String>
    platform: MyParcel.Platform
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
    pickupLocationsDefaultView: 'map' | 'list'
    pickupShowDistance: Boolean

    pickupLocationsMapTileLayerData: MapTileLayerData
  }

  type CarrierSettings = {
    [key in MyParcel.CarrierName]?: {
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
    name: MyParcel.CarrierName
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
    name: MyParcel.ShipmentOptionName
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
    type: MyParcel.DeliveryType
    shipment_options: ShipmentOption[]
    collect_date: any
    delivery_time_frames: DeliveryTimeFrame[]
  }

  interface PickupPossibility {
    delivery_type_id: Number
    delivery_type_name: MyParcel.DeliveryType
    moment: {
      start: Timestamp
    }
  }

  interface FormEntry {
    name: String
    type: String
    choices?: Array<Object>
    component?: Vue
    dependency?: Object
    loop?: Boolean
    pagination?: Number
  }

  interface MapTileLayerData {
    url: string
    attribution: string
    token?: string
    maxZoom?: Number
  }
}


declare module 'MyParcel' {
  export = MyParcel
}

declare module 'MyParcelDeliveryOptions' {
  export = MyParcelDeliveryOptions
}
