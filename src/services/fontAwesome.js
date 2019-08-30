import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Vue from 'vue';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons/faAngleDown';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { library } from '@fortawesome/fontawesome-svg-core';

library.add(faAngleDown, faTimes);

/**
 * Font Awesome 5 Vue component.
 *
 * @see https://github.com/FortAwesome/vue-fontawesome
 */
Vue.component('font-awesome-icon', FontAwesomeIcon);
