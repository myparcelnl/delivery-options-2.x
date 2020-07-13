import {
  AlertPlugin,
  ButtonPlugin,
  CardPlugin,
  FormCheckboxPlugin,
  FormGroupPlugin,
  FormInputPlugin,
  FormPlugin,
  FormSelectPlugin,
  FormTextareaPlugin,
  InputGroupPlugin,
  JumbotronPlugin,
  LayoutPlugin,
  ModalPlugin,
  NavbarPlugin,
  PopoverPlugin,
  SpinnerPlugin,
  TabsPlugin,
  TooltipPlugin,
} from 'bootstrap-vue';
import Vue from 'vue';

/**
 *
 * @param {import('vue').VueConstructor} vue
 */
export const useBootstrap = (vue = Vue) => {
  vue.use(AlertPlugin);
  vue.use(ButtonPlugin);
  vue.use(CardPlugin);
  vue.use(FormCheckboxPlugin);
  vue.use(FormGroupPlugin);
  vue.use(FormInputPlugin);
  vue.use(FormPlugin);
  vue.use(FormSelectPlugin);
  vue.use(FormTextareaPlugin);
  vue.use(InputGroupPlugin);
  vue.use(JumbotronPlugin);
  vue.use(LayoutPlugin);
  vue.use(ModalPlugin);
  vue.use(NavbarPlugin);
  vue.use(PopoverPlugin);
  vue.use(SpinnerPlugin);
  vue.use(TabsPlugin);
  vue.use(TooltipPlugin);
};
