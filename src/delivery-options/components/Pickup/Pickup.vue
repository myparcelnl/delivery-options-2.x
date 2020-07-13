<template>
  <td>
    <div>
      <button
        @click="selected = views.list"
        v-text="$configBus.strings.pickupLocationsListButton" />
      <button
        @click="selected = views.map"
        v-text="$configBus.strings.pickupLocationsMapButton" />
    </div>

    <transition name="shove">
      <div :class="$classBase + '__pickup-locations--list'">
        <recursive-form
          v-if="selected === views.list"
          :option="listOption" />
      </div>
    </transition>
    <transition name="shove">
      <keep-alive>
        <Leaflet
          v-if="selected === views.map"
          :data="data" />
      </keep-alive>
    </transition>
  </td>
</template>

<script>
import * as CONFIG from '@/data/keys/configKeys';
import * as FORM from '@/config/formConfig';
import Leaflet from '@/delivery-options/components/Pickup/Map/Leaflet';
import PickupOption from '@/delivery-options/components/Pickup/PickupOption';

const MAP_VIEW = 'map';
const LIST_VIEW = 'list';

export default {
  name: 'Pickup',
  components: { Leaflet },
  props: {
    data: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      selected: null,
      listOption: {
        name: FORM.PICKUP_LOCATION,
        type: 'radio',
        component: PickupOption,
        pagination: this.$configBus.get(CONFIG.FEATURE_MAX_PAGE_ITEMS),
        choices: this.data.choices,
      },
      views: {
        map: MAP_VIEW,
        list: LIST_VIEW,
      },
    };
  },
  created() {
    this.selected = this.getDefaultMapView();
  },
  methods: {
    /**
     * Get the default map view setting or fall back to default.
     *
     * @returns {String}
     */
    getDefaultMapView() {
      const setting = this.$configBus.get(CONFIG.FEATURE_PICKUP_LOCATIONS_DEFAULT_VIEW);

      if (setting && this.views.hasOwnProperty(setting)) {
        return setting;
      }

      return this.views.map;
    },
  },
};
</script>
