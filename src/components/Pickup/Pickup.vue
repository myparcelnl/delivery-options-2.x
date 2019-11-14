<template>
  <td>
    <div v-if="hasMap">
      <button @click="() => select('list')">
        Lijst
      </button>
      <button @click="() => select('map')">
        Kaart
      </button>
    </div>

    <transition
      name="shove">
      <keep-alive>
        <div :class="$classBase + '__pickup-locations--list'">
          <recursive-form
            v-if="selected === 'list'"
            :option="listOption" />
        </div>
      </keep-alive>
    </transition>
    <transition
      v-if="hasMap"
      name="shove">
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
      selected: 'list',
      listOption: {
        name: PICKUP_LOCATION,
        type: 'radio',
        component: PickupOption,
        pagination: this.$configBus.get(FEATURE_MAX_PAGE_ITEMS),
        choices: this.data.choices,
      },
    };
  },
  computed: {
    hasMap() {
      return this.$configBus.get(FEATURE_PICKUP_LOCATIONS_MAP);
    },
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
