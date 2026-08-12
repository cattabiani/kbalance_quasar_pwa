import { boot } from 'quasar/wrappers';
import VueApexCharts from 'vue3-apexcharts';

export default boot(({ app }) => {
  // register the component globally
  // eslint-disable-next-line vue/multi-word-component-names -- name is fixed by the vue3-apexcharts library
  app.component('apexchart', VueApexCharts);
});
