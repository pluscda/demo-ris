import Vue from "vue";
import "./plugins/axios";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import $ from "jquery";
window.$ = $;
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import contenteditable from "vue-contenteditable";
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import moment from "moment";
Vue.use(contenteditable);
import VueTabs from "vue-nav-tabs";
import "vue-nav-tabs/themes/vue-tabs.css";
Vue.use(VueTabs);

import VueClipboard from "vue-clipboard2";
Vue.use(VueClipboard);
import Vlf from "vlf";
import localforage from "localforage";
Vue.use(Vlf, localforage);

import VueRx from "vue-rx";
Vue.use(VueRx);

//global CSS
import "./assets/Style/ResetStyle.css"; //reset style
import "./assets/Style/Color.css"; //color
import ToggleButton from "vue-js-toggle-button";

Vue.use(ToggleButton);

import VueMousetrap from "vue-mousetrap";
Vue.use(VueMousetrap);
// Install BootstrapVue
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);

Vue.config.productionTip = false;
/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

Vue.prototype.$formatPrice = function(value) {
  value = Number(value);
  if (!value || isNaN(value)) return "";
  let val = (value / 1).toFixed(0).replace(".", ",");
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

Vue.prototype.$formatDate = function(str) {
  if (!str) return "";
  let date1 = moment(str).format();
  return date1.split("T")[0];
};

Vue.prototype.$dataFilter = function(key, qs, str) {
  str = "" + str;
  const lower = str.toLowerCase();
  return qs + `&$filter=substringof('${lower}', tolower(${key})) eq true`;
};

Vue.prototype.$appendFilter = function(key, qs, str) {
  str = "" + str;
  const lower = str.toLowerCase();
  return qs + ` and substringof('${lower}',tolower(${key})) eq true`;
};

Vue.prototype.$equalFilter = function(key, qs, v) {
  return qs + `&$filter=${key} eq ${v}`;
};

Vue.prototype.$appendEqualFilter = function(key, qs, v) {
  return qs + ` and ${key} eq ${v}`;
};

window.level4 = ["一", "二", "三", "四"];
window.level6 = ["一", "二", "三", "四", "五", "六"];

let year = new Date().getFullYear() - 1911;
const years = new Array(7).fill().map((s, i) => year - i);
window.year = year;
window.years = years;
window.taipeis = ["北投區", "士林區", "中山區", "內湖區", "大同區", "松山區", "萬華區", "中正區", "大安區", "信義區", "南港區", "文山區"];
