import { boot } from 'quasar/wrappers';
import VueApexCharts from 'vue3-apexcharts';

export default boot(({ app }) => {
  // register the component globally
  app.component('apexchart', VueApexCharts);
});