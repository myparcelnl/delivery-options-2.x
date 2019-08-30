import 'bootstrap-vue';
import './assets/scss/style.scss';
import App from './App.vue';
import Vue from 'vue';
import VuePrism from 'vue-prismjs';
import { i18n } from './services/vue-i18n';

Vue.config.productionTip = false;

Vue.component('prism', VuePrism);

new Vue({
  i18n,
  render: (h) => h(App),
}).$mount('#app');
