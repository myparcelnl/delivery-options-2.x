<template>
  <div :class="`${$classBase}__pickup-locations--map`">
    <Modal
      v-if="showModal"
      inline
      :component="modalComponent"
      :modal-data="selectedMarker"
      :has-close-button="true"
      @close="showModal = false" />

    <div
      v-show="!showModal"
      :class="`${$classBase}__pickup-locations--map`">
      <component
        :is="'link'"
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.5.1/leaflet.css"
        @load="loaded++" />
      <component
        :is="'script'"
        v-if="loaded > 0"
        src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.5.1/leaflet.js"
        @load="loaded++" />
      <component
        :is="'script'"
        v-if="loaded > 1"
        src="https://cdnjs.cloudflare.com/ajax/libs/Vue2Leaflet/1.0.2/vue2-leaflet.min.js"
        @load="loaded++" />
      <l-map
        v-if="showMap"
        ref="map"
        :class="`${$classBase}__pickup-locations__leaflet`"
        :zoom="zoom"
        :center="center">
        <l-marker
          v-for="marker in markers"
          :key="'marker_' + marker.data.location.location_code"
          :ref="marker.data.location.location_code"
          :class="`${$classBase}__pickup-locations__leaflet__marker`"
          :lat-lng="marker.latLng"
          :icon="marker.icon"
          @click="() => onClickMarker(marker.data)" />
      </l-map>
    </div>
  </div>
</template>

<script>
import * as CONFIG from '@/config/data/formConfig';
import * as EVENTS from '@/config/data/eventConfig';
import * as SETTINGS from '@/config/data/settingsConfig';
import Modal from '@/components/Modal';
import PickupDetails from '@/components/Pickup/PickupDetails';
import Vue from 'vue';
import { createIcons } from '@/components/Pickup/Map/createIcons';
import { createPickupChoices } from '@/data/pickup/createPickupChoices';
import debounce from 'debounce';
import { fetchMultiple } from '@/data/request/fetchMultiple';
import { fetchPickupLocations } from '@/data/pickup/fetchPickupLocations';

/* eslint-disable babel/new-cap */
export default {
  name: 'Leaflet',
  components: {
    Modal,
  },
  props: {
    data: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      showModal: false,
      modalComponent: PickupDetails,
      modalData: null,
      center: [52.2906535, 4.7070306],
      centerMarker: null,
      loaded: false,
      map: null,
      markers: [],
      maxZoom: 14,
      choices: null,
      showMap: false,
      zoom: 16,
      selectedMarker: null,
    };
  },
  watch: {
    loaded(bool) {
      if (bool) {
        Vue.component('l-map', Vue2Leaflet.LMap);
        Vue.component('l-marker', Vue2Leaflet.LMarker);
        Vue.component('l-popup', Vue2Leaflet.LPopup);
        Vue.component('l-tile-layer', Vue2Leaflet.LTileLayer);
        this.createMap();
      }
    },

    // markers() {
    //   const mapMarkers = [];
    //
    //   this.markers.forEach((marker) => {
    //     const { latLng, ...markerData } = marker;
    //     const lMarker = L.marker(latLng, markerData);
    //
    //     // lMarker.setPopupContent(PickupDetails.render());
    //
    //     lMarker.addTo(this.map);
    //     mapMarkers.push(lMarker);
    //   });
    //   console.log(mapMarkers);
    // },
  },

  created() {
    this.choices = this.data.choices;
  },

  beforeDestroy() {
    this.map.remove();
  },
  methods: {
    findMarkerByLocationCode(code) {
      console.log(this.$refs[code]);
      return this.$refs[code];
    },

    createMap() {
      this.showMap = true;

      this.$nextTick(() => {
        this.map = this.$refs.map.mapObject;
        this.icons = createIcons();

        this.setTileLayer();
        this.createMarkers();
        this.fitToMarkers();
        this.createCenterMarker();
        this.addMapEvents();
      });
    },

    /**
     * Add the tile layer to the map.
     */
    setTileLayer() {
      const { url, ...tileLayerData } = this.$configBus.get(SETTINGS.PICKUP_LOCATIONS_MAP_TILE_LAYER_DATA);
      const tileLayer = L.tileLayer(url, tileLayerData);

      tileLayer.addTo(this.map);
    },

    onSelectMarker(clickedMarker) {
      // const markerToSelect = this.markers.find((marker) => marker.data.location.location_code === clickedMarker);
      const markerToSelect = this.findMarkerByLocationCode(clickedMarker);

      console.log(this.map);
      console.log(markerToSelect);
      markerToSelect[0].mapObject.openPopup();
      // console.log(markerToSelect[0].$children);
      // console.log(markerToSelect[0].$children[0]);
      // markerToSelect.openPopup();

      this.onClickMarker(clickedMarker);
    },

    onClickMarker(marker) {
      this.$emit(EVENTS.UPDATE, { name: CONFIG.PICKUP_LOCATION, value: marker.location.location_code });
      this.showModal = true;
      this.selectedMarker = marker;
    },

    createMarkers() {
      this.markers = this.choices.reduce((acc, val) => {
        const { location } = val.pickupData;
        const latLng = L.latLng(location.latitude, location.longitude);

        return [
          ...acc,
          {
            latLng,
            icon: this.icons[val.carrier.name],
            data: val.pickupData,
          },
        ];
      }, []);
    },

    /**
     * Fit the bounds of the map to the visible markers.
     */
    fitToMarkers() {
      const bounds = this.markers.map((marker) => marker.latLng);

      this.map.fitBounds(bounds);
    },

    addMapEvents() {
      this.map.on('resize', debounce(this.fitToMarkers, 300));
      // this.map.on('moveend', debounce(this.onMoveEnd, 300));
      // this.map.on('movestart', debounce(this.onMoveStart, 300));
    },

    onMoveStart(event) {
      console.log('movestart', event);
      console.log('movestart', event.target);
    },

    async onMoveEnd(event) {
      const center = this.map.getCenter();

      this.centerMarker.setIcon(this.icons.loading);
      this.centerMarker.setLatLng(center);

      const requests = this.$configBus.carrierData.reduce((acc, carrier) => {
        return [
          ...acc,
          () => fetchPickupLocations(
            carrier,
            {
              latitude: center.lat,
              longitude: center.lng,
            },
          ),
        ];
      }, []);

      const responses = await fetchMultiple(requests);

      // console.log('locations', responses.responses.map((res) => res.location.location_name));

      this.choices = createPickupChoices(responses.responses);
      this.createMarkers();
      this.centerMarker.setIcon(this.icons.default);
    },

    createCenterMarker() {
      this.centerMarker = L.marker(this.map.getCenter());

      this.centerMarker.addTo(this.map);
    },
    isSelected(marker) {
      return marker.location.location_code === this.$configBus.get(CONFIG.PICKUP_LOCATION);
    },
  },
};
</script>
