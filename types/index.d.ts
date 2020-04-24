import './jest';
import { Vue } from 'vue/types/vue';

declare namespace MyParcel {
  type Environment = 'dev' | 'staging' | 'acceptance' | 'prod'

  type CarrierName = 'postnl' | 'bpost' | 'dpd'
  type CarrierNameOrId = CarrierName | number
  type Platform = 'myparcel' | 'belgie' | 'flespakket'

  /**
   * @see https://myparcelnl.github.io/api/#6_A_1
   */
  type PackageType = 'package' | 'mailbox' | 'digital_stamp' | string

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
    cc: string
    number: string | number
    postalCode: string
    city?: string
  }

  /**
   * Strings object from the external platform.
   */
  interface Strings {
    addressNotFound?: string
    cc?: string
    city?: string
    closed?: string
    deliveryEveningTitle?: string
    deliveryMorningTitle?: string
    deliveryStandardTitle?: string
    deliveryTitle?: string
    free?: string
    from?: string
    headerDeliveryOptions?: string
    loadMore?: string
    number?: string
    onlyRecipientTitle?: string
    openingHours?: string
    options?: string
    packageTypeDigitalStamp?: string
    packageTypeMailbox?: string
    pickUpFrom?: string
    pickupLocationsListButton?: string
    pickupLocationsMapButton?: string
    pickupTitle?: string
    postalCode?: string
    retry?: string
    signatureTitle?: string

    // NL only
    mondayDeliveryTitle?: string
    wrongnumberPostalCode?: string

    // BE only
    beDeliveryStandardTitle?: string
    beDeliveryTitle?: string
    saturdayDeliveryTitle?: string
    wrongPostalCodeCity?: string
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
      cc: string
      city: string
      number: string
      postal_code: string
      street: string
    }
    location: {
      distance: string
      latitude: string
      location_code: string
      location_name: string
      longitude: string
      phone_number: string
      retail_network_id: string
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
    apiBaseUrl?: string
    locale?: string
    platform?: MyParcel.Platform
    currency?: string

    allowDeliveryOptions?: boolean
    allowPickupLocations?: boolean

    packageType?: MyParcel.PackageType

    cutoffTime?: string
    deliveryDaysWindow?: string | number
    dropOffDays?: string
    dropOffDelay?: string | number

    // NL only
    mondayCutoffTime?: string

    // BE only
    saturdayCutoffTime?: string

    carrierSettings?: CarrierSettings

    // Feature toggles
    allowRetry?: boolean
    pickupLocationsDefaultView?: 'map' | 'list'
    pickupShowDistance?: boolean

    // Can be JSON string or object.
    pickupLocationsMapTileLayerData?: string | MapTileLayerData
  }

  type CarrierSettings = {
    [key in MyParcel.CarrierName]?: {
      allowEveningDelivery?: boolean
      allowMorningDelivery?: boolean
      allowOnlyRecipient?: boolean
      allowPickupExpress?: boolean
      allowSignature?: boolean

      // NL only
      allowSaturdayDelivery?: boolean

      // BE only
      allowMondayDelivery?: boolean

      priceEveningDelivery?: number
      priceMorningDelivery?: number
      priceOnlyRecipient?: number
      pricePickup?: number
      pricePickupExpress?: number
      priceSignature?: number
      priceStandardDelivery?: number
    }
  }

  interface CarrierData {
    id: number
    name: MyParcel.CarrierName
    human: string
    meta: {
      logo_png: string
      logo_svg: string
    },
    deliveryEnabled?: boolean,
    pickupEnabled?: boolean
  }

  interface Timestamp {
    date: string
    timezone: string
    timezone_type: number
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
      type: string
      enum: boolean[]
    }
  }

  interface DeliveryTimeFrame {
    type: string
    date_time: Timestamp
  }

  interface DeliveryPossibility {
    type: MyParcel.DeliveryType
    shipment_options: ShipmentOption[]
    collect_date: any
    delivery_time_frames: DeliveryTimeFrame[]
  }

  interface PickupPossibility {
    delivery_type_id: number
    delivery_type_name: MyParcel.DeliveryType
    moment: {
      start: Timestamp
    }
  }

  interface FormEntry {
    name: string
    type?: 'radio' | 'select' | 'checkbox' | 'text' | string
    choices?: FormEntryChoice[]
    component?: Vue
    dependency?: FormEntryDependency
    loop?: boolean
    pagination?: number
  }

  interface FormEntryChoice {
    name: string
    label?: string
    plainLabel?: string
    price?: number
    disabled?: boolean
    selected?: boolean
  }

  interface FormEntryDependency {
    name: string,
    parent: string,
    transform?: Function,
  }

  interface MapTileLayerData {
    url: string
    attribution: string
    token?: string
    maxZoom?: number
  }
}

declare module 'MyParcel' {
  export = MyParcel
}

declare module 'MyParcelDeliveryOptions' {
  export = MyParcelDeliveryOptions
}
