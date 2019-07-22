const getDate = (addDays = 0) => {
  const date = new Date();

  const dd = date.getDate() + addDays;
  const mm = date.getMonth();
  const yyyy = date.getFullYear();

  return `${yyyy}-${mm}-${dd}`;
};

export default {
  data: {
    deliveries: [
      {
        date: getDate(1),
        delivery_possibilities: [
          {
            type: 'morning',
            shipment_options: [
              {
                name: 'only_recipient',
                schema: {
                  type: 'boolean',
                  enum: [false],
                },
              },
              {
                name: 'signature',
                schema: {
                  type: 'boolean',
                  enum: [false],
                },
              },

            ],
            delivery_time_frames: [
              {
                type: 'start',
                date_time: {
                  date: `${getDate(1)} 09:00:00.000000`,
                  timezone_type: 3,
                  timezone: 'Europe/Amsterdam',
                },
              },
              {
                type: 'end',
                date_time: {
                  date: `${getDate(1)} 12:00:00.000000`,
                  timezone_type: 3,
                  timezone: 'Europe/Amsterdam',
                },
              },
            ],
          },
          {
            type: 'standard',
            shipment_options: [
              {
                name: 'age_check',
                schema: {
                  type: 'boolean',
                  enum: [true, false],
                },
              },
              {
                name: 'large_format',
                schema: {
                  type: 'boolean',
                  enum: [true, false],
                },
              },
              {
                name: 'only_recipient',
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
              {
                name: 'return',
                schema: {
                  type: 'boolean',
                  enum: [true, false],
                },
              },
            ],
            delivery_time_frames: [
              {
                type: 'start',
                date_time: {
                  date: `${getDate(1)} 15:30:00.000000`,
                  timezone_type: 3,
                  timezone: 'Europe/Amsterdam',
                },
              },
              {
                type: 'end',
                date_time: {
                  date: `${getDate(1)} 18:00:00.000000`,
                  timezone_type: 3,
                  timezone: 'Europe/Amsterdam',
                },
              },
            ],
          },
          {
            type: 'evening',
            shipment_options: [
              {
                name: 'cooled_delivery',
                schema: {
                  type: 'boolean',
                  enum: [true, false],
                },
              },
              {
                name: 'large_format',
                schema: {
                  type: 'boolean',
                  enum: [true, false],
                },
              },
              {
                name: 'only_recipient',
                schema: {
                  type: 'boolean',
                  enum: [true],
                },
              },
              {
                name: 'signature',
                schema: {
                  type: 'boolean',
                  enum: [true, false],
                },
              },
              {
                name: 'return',
                schema: {
                  type: 'boolean',
                  enum: [true, false],
                },
              },
            ],
            delivery_time_frames: [
              {
                type: 'start',
                date_time: {
                  date: `${getDate(1)} 18:00:00.000000`,
                  timezone_type: 3,
                  timezone: 'Europe/Amsterdam',
                },
              },
              {
                type: 'end',
                date_time: {
                  date: `${getDate(1)} 22:00:00.000000`,
                  timezone_type: 3,
                  timezone: 'Europe/Amsterdam',
                },
              },
            ],
          },
        ],
      },
      {
        date: getDate(2),
        delivery_possibilities: [
          {
            type: 'standard',
            shipment_options: [
              {
                name: 'age_check',
                schema: {
                  type: 'boolean',
                  enum: [true, false],
                },
              },
              {
                name: 'large_format',
                schema: {
                  type: 'boolean',
                  enum: [true, false],
                },
              },
              {
                name: 'only_recipient',
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
              {
                name: 'return',
                schema: {
                  type: 'boolean',
                  enum: [true, false],
                },
              },
            ],
            delivery_time_frames: [
              {
                type: 'start',
                date_time: {
                  date: `${getDate(2)} 14:30:00.000000`,
                  timezone_type: 3,
                  timezone: 'Europe/Amsterdam',
                },
              },
              {
                type: 'end',
                date_time: {
                  date: `${getDate(2)} 17:00:00.000000`,
                  timezone_type: 3,
                  timezone: 'Europe/Amsterdam',
                },
              },
            ],
          },
          {
            type: 'evening',
            shipment_options: [
              {
                name: 'cooled_delivery',
                schema: {
                  type: 'boolean',
                  enum: [true, false],
                },
              },
              {
                name: 'large_format',
                schema: {
                  type: 'boolean',
                  enum: [true, false],
                },
              },
              {
                name: 'only_recipient',
                schema: {
                  type: 'boolean',
                  enum: [true],
                },
              },
              {
                name: 'signature',
                schema: {
                  type: 'boolean',
                  enum: [true, false],
                },
              },
              {
                name: 'return',
                schema: {
                  type: 'boolean',
                  enum: [true, false],
                },
              },
            ],
            delivery_time_frames: [
              {
                type: 'start',
                date_time: {
                  date: `${getDate(2)} 18:00:00.000000`,
                  timezone_type: 3,
                  timezone: 'Europe/Amsterdam',
                },
              },
              {
                type: 'end',
                date_time: {
                  date: `${getDate(2)} 22:00:00.000000`,
                  timezone_type: 3,
                  timezone: 'Europe/Amsterdam',
                },
              },
            ],
          },
        ],
      },
      {
        date: getDate(3),
        delivery_possibilities: [
          {
            type: 'morning',
            shipment_options: [],
            delivery_time_frames: [
              {
                type: 'start',
                date_time: {
                  date: `${getDate(3)} 08:00:00.000000`,
                  timezone_type: 3,
                  timezone: 'Europe/Amsterdam',
                },
              },
              {
                type: 'end',
                date_time: {
                  date: `${getDate(3)} 12:00:00.000000`,
                  timezone_type: 3,
                  timezone: 'Europe/Amsterdam',
                },
              },
            ],
          },
          {
            type: 'standard',
            shipment_options: [
              {
                name: 'age_check',
                schema: {
                  type: 'boolean',
                  enum: [true, false],
                },
              },
              {
                name: 'large_format',
                schema: {
                  type: 'boolean',
                  enum: [true, false],
                },
              },
              {
                name: 'only_recipient',
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
              {
                name: 'return',
                schema: {
                  type: 'boolean',
                  enum: [true, false],
                },
              },
            ],
            delivery_time_frames: [
              {
                type: 'start',
                date_time: {
                  date: `${getDate(3)} 14:30:00.000000`,
                  timezone_type: 3,
                  timezone: 'Europe/Amsterdam',
                },
              },
              {
                type: 'end',
                date_time: {
                  date: `${getDate(3)} 17:00:00.000000`,
                  timezone_type: 3,
                  timezone: 'Europe/Amsterdam',
                },
              },
            ],
          },
        ],
      },
    ],
  },
};
