import { getDependencies } from '@/components/RecursiveForm/getDependencies';
import { mockConfigBus } from '../../mockConfigBus';

const getDependenciesCases = [
  {
    dependencies: {
      deliveryDate: {
        '2019-12-03T00:00:00.000Z': {
          deliveryMoment: {
            standard: {
              moments: {
                start: '09:00',
                end: '17:00',
              },
              shipmentOptions: {},
            },
          },
        },
      },
    },
    dependencyName: 'deliveryDate',
    deps: {
      deliveryMoment: {
        standard: {
          moments: {
            start: '09:00',
            end: '17:00',
          },
          shipmentOptions: {},
        },
      },
    },
  },
  //
  {
    dependencies: {
      deliveryDate: {
        '2019-12-03T00:00:00.000Z': {
          deliveryMoment: {
            standard: {
              moments: {
                start: '09:00',
                end: '17:00',
              },
              shipmentOptions: {},
            },
          },
        },
      },
    },
    dependencyName: [
      'deliveryDate',
      'deliveryMoment',
    ],
    deps: {
      moments: {
        start: '09:00',
        end: '17:00',
      },
      shipmentOptions: {},
    },
  },
  //
  {
    dependencies: {
      deliveryDate: {
        '2019-12-03T00:00:00.000Z': {
          deliveryMoment: {
            standard: {
              moments: {
                start: '09:00',
                end: '17:00',
              },
              shipmentOptions: {},
            },
          },
        },
      },
    },
    dependencyName: [
      'deliveryDate',
      'deliveryMoment',
    ],
    deps: {
      moments: {
        start: '09:00',
        end: '17:00',
      },
      shipmentOptions: {},
    },
  },
  {
    dependencies: {
      deliveryDate: {
        '2019-12-03T00:00:00.000Z': {
          deliveryMoment: {
            standard: {
              moments: {
                start: '09:00',
                end: '17:00',
              },
              shipmentOptions: {},
            },
          },
        },
      },
    },
    dependencyName: [
      'deliveryDate',
      'deliveryMoment',
    ],
    deps: {
      moments: {
        start: '09:00',
        end: '17:00',
      },
      shipmentOptions: {},
    },
  },
];

describe('RecursiveForm – getDependencies', () => {
  beforeAll(() => {
    mockConfigBus({
      config: {
        carriers: [
          'bpost',
          'dpd',
        ],
        platform: 'belgie',
        locale: 'nl-BE',
        currency: 'EUR',
        carrierSettings: {
          bpost: {
            allowDeliveryOptions: true,
            allowPickupLocations: true,
            allowSignature: false,
            cutoffTime: '17:00',
            deliveryDaysWindow: 1,
            dropOffDays: [
              '1',
              '2',
              '3',
              '4',
              '5',
            ],
            dropOffDelay: 0,
            pricePickup: -0.14,
            priceSignature: 0,
            priceSaturdayDelivery: 0,
          },
          dpd: {
            allowDeliveryOptions: true,
            allowPickupLocations: true,
            allowSignature: false,
            cutoffTime: '17:00',
            deliveryDaysWindow: 1,
            dropOffDays: [
              '1',
              '2',
              '3',
              '4',
              '5',
            ],
            dropOffDelay: 0,
            pricePickup: -0.2,
            priceSignature: 0,
            priceSaturdayDelivery: 0,
          },
        },
      },
      strings: {
        addressNotFound: 'Adresgegevens zijn niet ingevuld',
        city: 'Plaats',
        closed: 'Gesloten',
        deliveryStandardTitle: 'Standaard bezorging',
        deliveryTitle: 'Thuis of op het werk bezorgd',
        headerDeliveryOptions: 'Bezorgopties',
        houseNumber: 'Huisnummer',
        openingHours: 'Openingstijden',
        pickUpFrom: 'Ophalen vanaf',
        pickupTitle: 'Afhalen',
        postcode: 'Postcode',
        retry: 'Opnieuw',
        wrongHouseNumberCity: 'Postcode/plaats combinatie onbekend',
        signatureTitle: 'Handtekening voor ontvangst',
      },
      address: {
        cc: 'be',
        postalCode: '2000',
        number: '16',
        city: 'Antwerpen',
      },
    });
  });

  test.each(getDependenciesCases)('works as expected', ({ dependencies, dependencyName, deps }) => {
    expect(getDependencies(dependencies, dependencyName)).toEqual(deps);
  });
});
