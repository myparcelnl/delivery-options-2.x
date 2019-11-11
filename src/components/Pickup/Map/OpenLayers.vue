<template>
  <div class="openlayers">
    <component
      :is="'link'"
      rel="stylesheet"
      href="https://unpkg.com/vuelayers/lib/style.css"
      @load="loaded++" />
    <component
      :is="'script'"
      src="https://unpkg.com/openlayers/dist/ol.js"
      @load="loaded++" />
    <component
      :is="'script'"
      src="https://unpkg.com/vuelayers/lib/index.umd.js"
      @load="loaded++" />

    <div class="openlayers__wrapper">
      <vl-map
        v-if="showMap"
        ref="map"
        :load-tiles-while-animating="true"
        :load-tiles-while-interacting="true"
        data-projection="EPSG:4326"
        style="height: 700px;">
        <vl-view
          :zoom.sync="zoom"
          :center.sync="center"
          :rotation.sync="rotation" />

        <vl-geoloc @update:position="geolocPosition = $event">
          <template slot-scope="geoloc">
            <vl-feature
              v-if="geoloc.position"
              id="position-feature">
              <vl-geom-point :coordinates="geoloc.position" />
              <vl-style-box>
                <vl-style-icon
                  src="_media/marker.png"
                  :scale="0.4"
                  :anchor="[0.5, 1]" />
              </vl-style-box>
            </vl-feature>
          </template>
        </vl-geoloc>

        <vl-layer-tile id="osm">
          <vl-source-osm />
        </vl-layer-tile>
      </vl-map>
    </div>
  </div>
</template>

<script>
import * as CONFIG from '@/config/data/settingsConfig';
import PickupDetails from '@/components/Pickup/PickupDetails';
/* eslint-disable babel/new-cap */

export default {
  name: 'OpenLayers',
  components: { PickupDetails },
  props: {
    data: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      showMap: false,
      loaded: 0,
      attribution: null,
      center: null,
      marker: null,
      markers: [],
      maxZoom: null,
      token: null,
      url: null,
      zoom: 13,
    };
  },

  computed: {
    loadedScripts() {
      return this.loaded === 3;
    },
  },
  watch: {
    loadedScripts(value) {
      if (value) {
        this.createMap();
      }
    },
  },
  methods: {
    createMap() {
      // this.setTileLayer();
      // this.showMap = true;
      //
      // this.$nextTick(() => {
      //   this.map = this.$refs.map.mapObject;
      //
      //   console.log(this.map);
      //   this.markers = this.data.reduce((acc, val) => {
      //     const { location } = val.pickupData;
      //     const latLng = L.latLng(location.latitude, location.longitude);
      //
      //     return [...acc,
      //       {
      //         latLng,
      //         data: val.pickupData,
      //       }];
      //   }, []);
      //
      //   const bounds = this.markers.map((marker) => L.marker(marker.latLng));
      //
      //   const featureGroup = L.featureGroup(bounds);
      //   this.map.fitBounds(featureGroup.getBounds());
      // });
    },

    select(marker) {
      console.log('selected marker', marker);
    },
  },
};
</script>
