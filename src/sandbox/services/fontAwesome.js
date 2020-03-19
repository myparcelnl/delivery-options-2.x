import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Vue from 'vue';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons/faExternalLinkAlt';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import { faRedo } from '@fortawesome/free-solid-svg-icons/faRedo';
import { library } from '@fortawesome/fontawesome-svg-core';

library.add(faRedo, faExternalLinkAlt, faInfoCircle);

/**
 * Font Awesome 5 Vue component.
 *
 * @see https://github.com/FortAwesome/vue-fontawesome
 */
Vue.component('FontAwesomeIcon', FontAwesomeIcon);
