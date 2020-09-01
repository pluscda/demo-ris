//
// $ npm i ckeditor4
// $ npm i ckeditor/ckeditor-releases#full/latest
//
import "@babel/polyfill";
import "mutationobserver-shim";
import Vue from "vue";
import "./plugins/bootstrap-vue";
import "./plugins/fontawesome";
import "./plugins/axios";
import "@/styles/ejs2.css";
import App from "./App.vue";
import { router } from "./router";
import store from "./store";
import "@/assets/LayoutBase.css";
import jssl from "./SupportLib";
import moment from "moment";
import ToggleButton from "vue-js-toggle-button";
import VueTabs from "vue-nav-tabs/dist/vue-tabs.js";
import "vue-nav-tabs/themes/vue-tabs.css";
import * as configs from "@/config";
import IdleVue from "idle-vue";
const eventsHub = new Vue();

Vue.use(IdleVue, {
  eventEmitter: eventsHub,
  store,
  idleTime: 3000, // 3 seconds,
  startAtIdle: false
});
Vue.use(VueTabs);
Vue.use(ToggleButton);
Vue.prototype.$moment = moment;

Vue.use(jssl);

window.$ = require("jquery");
require("@/assets/jquery.blockUI.js");
window.onbeforeunload = function() {
  return "Are you sure";
};
window.onkeyup = function(keyEvent) {
  let keyBoardMove = keyEvent.isTrusted;
  if (keyBoardMove) {
    store.state.Profile4User.ActionTime = new Date();
  }
};

// let checkmove = setTimeout(function() {
//   // return;
//   console.log("你沒有動鍵盤過了5s");
// }, 5000);
import Axios_Test from "./_services/Axios_Test";
Vue.use(Axios_Test);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
