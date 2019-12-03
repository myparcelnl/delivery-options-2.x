<template>
  <td>
    <div>
      <button
        @click="() => select('list')"
        v-text="$configBus.strings.pickupLocationsListButton" />
      <button
        @click="() => select('map')"
        v-text="$configBus.strings.pickupLocationsMapButton" />
    </div>

    <transition name="shove">
      <keep-alive>
        <div :class="$classBase + '__pickup-locations--list'">
          <recursive-form
            v-if="selected === 'list'"
            :option="listOption" />
        </div>
      </keep-alive>
    </transition>
    <transition name="shove">
      <keep-alive>
        <leaflet
          v-if="selected === 'map'"
          :data="data"
          @update="emitUpdate" />
      </keep-alive>
    </transition>
  </td>
</template>

<script>
import * as EVENTS from '@/config/data/eventConfig';
import { FEATURE_MAX_PAGE_ITEMS, FEATURE_PICKUP_LOCATIONS_MAP } from '@/config/data/settingsConfig';
import Leaflet from '@/components/Pickup/Map/Leaflet';
import { PICKUP_LOCATION } from '@/config/data/formConfig';
import PickupOption from '@/components/Pickup/PickupOption';

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
      selected: this.$configBus.get(FEATURE_PICKUP_LOCATIONS_MAP) ? 'map' : 'list',
      listOption: {
        name: PICKUP_LOCATION,
        type: 'radio',
        component: PickupOption,
        pagination: this.$configBus.get(FEATURE_MAX_PAGE_ITEMS),
        choices: this.data.choices,
      },
    };
  },
  methods: {
    select(item) {
      this.selected = item;
    },

    /**
     * @param {Object} event - Event object.
     */
    emitUpdate(event) {
      this.$configBus.$emit(EVENTS.UPDATE, event);
    },
  },
};
</script>
