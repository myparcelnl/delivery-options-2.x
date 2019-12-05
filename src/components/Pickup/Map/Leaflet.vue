<template>
  <div
    :class="{
      [baseClass]: true,
      [`${baseClass}--modal`]: showModal,
    }">
    <Modal
      v-if="showModal"
      inline
      :component="modalComponent"
      :modal-data="selectedMarker.data"
      :has-close-button="true"
      @close="showModal = false" />

    <div v-show="!showModal">
      <l-map
        v-if="showMap"
        ref="map"
        :class="mapClass"
        :zoom="zoom"
        :center="center">
        <l-marker
          v-for="marker in markers"
          :key="'marker_' + marker.id"
          :ref="marker.id"
          :lat-lng="marker.latLng"
          :icon="marker.icon"
          @click="onClickMarker(marker)" />
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
import { SENDMYPARCEL } from '@/config/data/platformConfig';
import Vue from 'vue';
import { createIcons } from '@/components/Pickup/Map/createIcons';
import { createPickupChoices } from '@/data/pickup/createPickupChoices';
import { createScript } from '@/services/createScript';
import debounce from 'debounce';

/**
 * @var this.$refs.map
 * @property {L} mapObject
 */

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
    const DEBOUNCE_DELAY = 300;
    const defaultLat = 52.2906535;
    const defaultLong = 4.7070306;
    const defaultMaxZoom = 12;
    const defaultZoom = 14;

    return {
      showModal: false,
      modalComponent: PickupDetails,
      modalData: null,

      center: [defaultLat, defaultLong],
      maxZoom: defaultMaxZoom,
      zoom: defaultZoom,

      /**
       * The Leaflet map will be stored in this variable.
       *
       * @type {L}
       */
      map: null,

      /**
       * All pickup location markers.
       */
      markers: [],

      /**
       * The marker icons.
       */
      icons: [],

      /**
       * The marker that is displayed in the center of the map.
       */
      centerMarker: null,

      choices: null,

      showMap: false,

      selectedMarker: null,

      /**
       * Whether the onmove event can trigger searching for new pickup locations.
       */
      allowDrag: false,

      /**
       * Base class to use with the map and its child elements.
       */
      baseClass: `${this.$classBase}__pickup-locations--map`,

      /**
       * Listeners object for easy adding/removing.
       */
      listeners: {
        moveEnd: debounce(this.onMoveEnd, DEBOUNCE_DELAY),
        zoomEnd: debounce(this.onZoomEnd, DEBOUNCE_DELAY),
      },
    };
  },

  computed: {
    mapClass() {
      return `${this.baseClass}__leaflet`;
    },
  },

  /**
   * On mounting the map component, load all the needed scripts externally. This is done to not bloat the bundle size
   *  and only load the map when the user selects it.
   */
  async mounted() {
    // Skip all script loading if RequireJS is detected. It does NOT like us loading scripts manually.
    const loadScripts = typeof requirejs === 'undefined';

    if (loadScripts) {
      const scripts = [];
      const leafletCss = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.5.1/leaflet.css';
      const leafletJs = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.5.1/leaflet.js';
      const vue2LeafletJs = 'https://cdnjs.cloudflare.com/ajax/libs/Vue2Leaflet/1.0.2/vue2-leaflet.min.js';

      if (!document.querySelector(`link[href="${leafletCss}"]`)) {
        scripts.push(leafletCss);
      }

      if (typeof L === 'undefined') {
        scripts.push(leafletJs);
      }

      await Promise.all(scripts.map((script) => createScript(script)));

      /**
       * This scripts depends on leaflet.js so has to wait until it's loaded.
       */
      if (typeof Vue2Leaflet === 'undefined') {
        await createScript(vue2LeafletJs);
      }
    }

    this.onLoadedScripts();
  },

  created() {
    this.choices = this.data.choices;
  },

  /**
   * This element is used in a <keep-alive> component. This hook will be triggered on "reactivating" the element.
   *
   * @see https://vuejs.org/v2/api/#keep-alive
   */
  activated() {
    this.showModal = false;
    const selectedPickupLocation = this.$configBus.getValue(CONFIG.PICKUP_LOCATION);
    const selectedMarker = this.getMarkerByLocationCode(selectedPickupLocation);

    if (selectedPickupLocation && selectedMarker) {
      this.selectMarker(selectedMarker);
    }
  },

  methods: {
    /**
     * When all Leaflet scripts are loaded, initialize the Vue2Leaflet components and start creating the map.
     */
    onLoadedScripts() {
      Vue.component('l-map', Vue2Leaflet.LMap);
      Vue.component('l-marker', Vue2Leaflet.LMarker);
      Vue.component('l-popup', Vue2Leaflet.LPopup);
      Vue.component('l-tile-layer', Vue2Leaflet.LTileLayer);
      this.createMap();
    },

    createMap() {
      this.showMap = true;

      this.$nextTick(() => {
        if (!this.$refs.map) {
          return;
        }

        this.map = this.$refs.map.mapObject;
        this.icons = createIcons(`${this.mapClass}__marker`);

        this.setTileLayer();
        this.createMarkers();
        this.fitToMarkers();
        this.createCenterMarker();
        this.addMapEvents();
      });
    },

    getMarkerByLocationCode(code) {
      return this.markers.find((marker) => marker.id === code);
    },

    /**
     * Add the tile layer to the map.
     */
    setTileLayer() {
      const { url, ...tileLayerData } = this.$configBus.get(SETTINGS.PICKUP_LOCATIONS_MAP_TILE_LAYER_DATA);
      const tileLayer = L.tileLayer(url, tileLayerData);

      tileLayer.addTo(this.map);
    },

    selectMarker(marker) {
      if (this.selectedMarker) {
        // Replace the active icon with the regular icon if there already was a selected marker.
        this.selectedMarker.icon = this.icons[this.selectedMarker.data.carrier.name];
      }

      this.selectedMarker = marker;

      // Replace the icon with the active version.
      this.selectedMarker.icon = this.icons[`${this.selectedMarker.data.carrier.name}_active`];

      // Add the currently selected pickup location's option to the selectedMarker.
      this.selectedMarker.data = {
        ...this.selectedMarker.data,
        ...this.getChoiceByMarkerId(this.selectedMarker.id),
      };
    },

    onClickMarker(marker) {
      this.selectMarker(marker);
      this.showModal = true;
      this.$emit(EVENTS.UPDATE, { name: CONFIG.PICKUP_LOCATION, value: marker.id });
    },

    createMarkers() {
      this.markers = this.choices.reduce((acc, val) => {
        const { location } = val.pickupData;
        const latLng = L.latLng(location.latitude, location.longitude);

        return [
          ...acc,
          {
            latLng,
            id: val.pickupData.location.location_code,
            icon: this.icons[val.carrier.name],
            data: val.pickupData,
            isActive: false,
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

      this.map.setZoom(this.zoom);
      const listener = () => {
        this.onZoomEnd();
        this.map.off('moveend', listener);
      };

      this.map.on('moveend', listener);
    },

    addMapEvents() {
      /**
       * TODO: Disables the listeners for BE temporarily.
       *  When we can look up pickup points using coordinates for bpost and dpd this can be removed.
       *  Research: https://jira.dmp.zone/browse/MY-16566.
       */
      if (this.$configBus.get(SETTINGS.PLATFORM) !== SENDMYPARCEL) {
        this.map.on('moveend', this.listeners.moveEnd);
        this.map.on('zoomend', this.listeners.zoomEnd);
      }
    },

    /**
     * When the user stops dragging or zooming, update the center marker, fetch new pickup locations for the new center
     *  and replace the existing ones on the map.
     *
     * @see https://leafletjs.com/reference-1.6.0.html#map-moveend
     */
    async onMoveEnd() {
      if (!this.allowDrag) {
        return;
      }

      const center = this.map.getCenter();

      this.centerMarker._icon.classList.add(`${this.mapClass}__marker--center--loading`);
      this.centerMarker.setLatLng(center);

      this.choices = await createPickupChoices();
      this.createMarkers();

      this.centerMarker._icon.classList.remove(`${this.mapClass}__marker--center--loading`);
    },

    /**
     * Place the center marker on the map.
     */
    createCenterMarker() {
      const zIndexOffset = 999;
      this.centerMarker = L.marker(this.map.getCenter(), { icon: this.icons.default, zIndexOffset });

      this.centerMarker.addTo(this.map);
    },
    isSelected(marker) {
      return marker.location.location_code === this.$configBus.get(CONFIG.PICKUP_LOCATION);
    },

    /**
     * Try to postpone allowing to drag the map to when the initial zooming by fitBounds() is complete to avoid the map
     *  looking for new pickup locations immediately.
     *
     * @see https://leafletjs.com/reference-1.6.0.html#map-zoomend
     */
    onZoomEnd() {
      const allowDragDelay = 200;

      setTimeout(() => {
        this.allowDrag = true;
      }, allowDragDelay);

      this.map.off('zoomend', this.listeners.zoomEnd);
    },

    /**
     * Get the option relating to the given pickup location id.
     *
     * @param {String} id - Marker id, which is a pickup location id.
     *
     * @returns {Object}
     */
    getChoiceByMarkerId(id) {
      return this.data.choices.find((choice) => choice.name === id);
    },
  },
};
</script>
