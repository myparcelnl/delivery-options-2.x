import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Vue from 'vue';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons/faEllipsisH';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { library } from '@fortawesome/fontawesome-svg-core';

library.add(faEllipsisH, faTimes);

/**
 * Font Awesome 5 Vue component.
 *
 * @see https://github.com/FortAwesome/vue-fontawesome
 */
Vue.component('font-awesome-icon', FontAwesomeIcon);
