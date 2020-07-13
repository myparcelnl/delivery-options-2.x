const today = new Date()
  .toISOString()
  .replace(/T.*$/, '');

export const fakeDeliveryOptionsResponse = [
  {
    date: {
      date: `${today} 00:00:00.000000`,
      timezone_type: 3,
      timezone: 'Europe/Amsterdam',
    },
    possibilities: [
      {
        type: 'standard',
        shipment_options: [
          {
            name: 'saturday_delivery',
            schema: {
              type: 'boolean',
              enum: [true, false],
            },
          },
          {
            name: 'signature',
            schema: {
              type: 'boolean',
              enum: [true, false],
            },
          },
        ],
        collect_date: null,
        delivery_time_frames: [
          {
            type: 'start',
            date_time: {
              date: `${today} 08:00:00.000000`,
              timezone_type: 1,
              timezone: '+02:00',
            },
          },
          {
            type: 'end',
            date_time: {
              date: `${today} 17:00:00.000000`,
              timezone_type: 1,
              timezone: '+02:00',
            },
          },
        ],
      },
    ],
  },
];
