import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Vue from 'vue';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons/faCaretDown';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { library } from '@fortawesome/fontawesome-svg-core';

library.add(faCaretDown, faTimes);

Vue.component('font-awesome-icon', FontAwesomeIcon);
