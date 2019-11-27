<template>
  <div :class="`${$classBase}__pickup-details`">
    <table :class="`${$classBase}__table`">
      <tr>
        <td colspan="2">
          <h3 v-text="data.location.location_name" />
        </td>
      </tr>
      <tr>
        <td :colspan="$configBus.isMultiCarrier ? 1 : 2">
          <p>
            <span v-text="data.address.street + ' ' + data.address.number" /><br>
            <span v-text="data.address.postal_code + ' ' + data.address.city" />

            <template v-if="!!data.location.phone_number">
              <br>
              <span v-text="data.location.phone_number" /><br>
            </template>
          </p>
        </td>

        <td v-if="$configBus.isMultiCarrier">
          <img
            :class="[
              `${$classBase}__image`,
              `${$classBase}__image--lg`,
              `${$classBase}__h-auto`,
              `${$classBase}__float--right`
            ]"
            :src="data.carrier.image"
            :alt="data.carrier.human">
        </td>
      </tr>
    </table>
    <table :class="`${$classBase}__table`">
      <tr>
        <td colspan="2">
          <h3 v-text="strings.openingHours" />
        </td>
      </tr>
      <tr
        v-for="(day, index) in Object.keys(openingHours)"
        :key="day">
        <td :class="`${$classBase}__pickup-details__opening-days`">
          <span v-text="$configBus.weekdays[index]" />
        </td>
        <td :class="`${$classBase}__pickup-details__opening-hours`">
          <span
            :class="`${$classBase}__float--right`"
            v-text="openingHours[day]" />
        </td>
      </tr>
    </table>
    <table :class="`${$classBase}__table`">
      <tr>
        <td>
          <h3 v-text="strings.options" />
        </td>
      </tr>
      <tr>
        <td>
          <recursive-form
            v-for="(option, index) in data.options"
            :key="'pickup_' + index"
            :option="option" />
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import { createLocaleString } from '@/data/dates/createLocaleString';

export default {
  name: 'PickupDetails',
  props: {
    /**
     * @type {MyParcel.PickupLocation}
     */
    data: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      weekdays: null,
    };
  },
  computed: {
    strings() {
      return this.$configBus.strings;
    },

    carrierData() {
      return this.$configBus.currentCarrier;
    },

    /**
     * Return opening hours with "closed" string from config where needed and format the time strings.
     *
     * @returns {{}}
     */
    openingHours() {
      const openingHours = this.data.location.opening_hours;

      return Object.keys(openingHours).reduce((acc, item) => {
        let dateString;

        if (openingHours[item].length) {
          const time = openingHours[item][0];

          dateString = `${createLocaleString(time.start.date)} – ${createLocaleString(time.end.date)}`;
        } else {
          dateString = this.strings.closed;
        }

        return {
          ...acc,
          [item]: dateString,
        };
      }, {});
    },
  },
};
</script>
