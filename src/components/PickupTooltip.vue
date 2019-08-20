<template>
  <div class="myparcel-checkout__tooltip">
    <div
      class="myparcel-checkout__tooltip__close"
      @click="$emit('close')">
      <font-awesome-icon icon="times" />
    </div>
    <table>
      <tr>
        <td colspan="2">
          <h3 v-text="data.location.location_name" />
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
            class="myparcel-checkout__float-right"
            v-text="openingHours[day]" />
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'PickupTooltip',
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
