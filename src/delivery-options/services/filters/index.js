import Vue from 'vue';
import { capitalize } from '@/delivery-options/services/filters/capitalize';
import { formatCode } from '@/delivery-options/services/filters/formatCode';

Vue.filter('capitalize', capitalize);
Vue.filter('formatCode', formatCode);
