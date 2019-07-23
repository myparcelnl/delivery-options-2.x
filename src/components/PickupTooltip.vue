<template>
  <div
    v-if="show"
    class="myparcel-checkout__tooltip__content">
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
        <td>
          <span v-text="data.address.street + ' ' + data.address.number" /><br>
          <span v-text="data.address.postal_code + ' ' + data.address.city" />

          <template v-if="!!data.location.phone_number">
            <br>
            <span v-text="data.location.phone_number" /><br>
          </template>
          <!-- <span v-text="strings.pickUpFrom + ' ' + $configBus.formatTime(data.possibilities[0].moment.start.date)" />-->
        </td>
        <td>
          <img
            class="myparcel-checkout__image myparcel-checkout__image--lg myparcel-checkout__float-right"
            :src="carrierLogo"
            alt="">
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <h3 v-text="strings.openingHours" />
        </td>
      </tr>
      <tr
        v-for="day in Object.keys(openingHours)"
        :key="day">
        <td>
          <span v-text="strings[day]" />
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
import { appConfig } from '@/config/appConfig';

export default {
  name: 'PickupTooltip',
  props: {
    data: {
      type: Object,
      default: null,
    },
    show: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    config() {
      return this.$configBus.config;
    },

    strings() {
      return this.$configBus.strings;
    },

    carrierData() {
      return this.$configBus.getCarrier(this.data.carrier || 1);
    },

    carrierLogo() {
      return appConfig.assetsUrl + this.carrierData.meta.logo_svg;
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
