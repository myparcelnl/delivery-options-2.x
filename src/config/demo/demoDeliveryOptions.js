export default {
  data: {
    deliveries: [
      {
        date: '2019-07-04',
        delivery_possibilities: [
          {
            type: 'morning',
            deliver_options: [],
            delivery_time_frames: [
              {
                type: 'start',
                date_time: {
                  date: '2019-07-04 08:00:00.000000',
                  timezone_type: 3,
                  timezone: 'Europe/Amsterdam',
                },
              },
              {
                type: 'end',
                date_time: {
                  date: '2019-07-04 12:00:00.000000',
                  timezone_type: 3,
                  timezone: 'Europe/Amsterdam',
                },
              },
            ],
          },
          {
            type: 'standard',
            deliver_options: [],
            delivery_time_frames: [
              {
                type: 'start',
                date_time: {
                  date: '2019-07-04 14:15:00.000000',
                  timezone_type: 3,
                  timezone: 'Europe/Amsterdam',
                },
              },
              {
                type: 'end',
                date_time: {
                  date: '2019-07-04 16:45:00.000000',
                  timezone_type: 3,
                  timezone: 'Europe/Amsterdam',
                },
              },
            ],
          },
          {
            type: 'evening',
            deliver_options: [],
            delivery_time_frames: [
              {
                type: 'start',
                date_time: {
                  date: '2019-07-04 18:00:00.000000',
                  timezone_type: 3,
                  timezone: 'Europe/Amsterdam',
                },
              },
              {
                type: 'end',
                date_time: {
                  date: '2019-07-04 22:00:00.000000',
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
