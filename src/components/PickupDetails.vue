<template>
  <table>
    <tr>
      <td :colspan="$configBus.isMultiCarrier ? 1 : 2">
        <h3 v-text="data.location.location_name" />
      </td>

      <td v-if="$configBus.isMultiCarrier">
        <img
          :class="[
            `${$classBase}__image--lg`,
            `${$classBase}__float-right`
          ]"
          :src="data.carrier.image"
          :alt="data.carrier.human">
      </td>
    </tr>
    <tr>
      <td colspan="2">
        <span v-text="data.address.street + ' ' + data.address.number" /><br>
        <span v-text="data.address.postal_code + ' ' + data.address.city" />

        <template v-if="!!data.location.phone_number">
          <br>
          <span v-text="data.location.phone_number" /><br>
        </template>
      </td>
    </tr>
    <tr>
      <td colspan="2">
        <h3 v-text="strings.openingHours" />
      </td>
    </tr>
    <tr
      v-for="(day, index) in Object.keys(openingHours)"
      :key="day">
      <td>
        <span v-text="$configBus.weekdays[index]" />
      </td>
      <td>
        <span
          :class="`${$classBase}__float-right`"
          v-text="openingHours[day]" />
      </td>
    </tr>
  </table>
</template>

<script>
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

          dateString = `${this.$configBus.formatTime(time.start.date)} – ${this.$configBus.formatTime(time.end.date)}`;
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
