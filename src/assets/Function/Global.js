export default {
  install(Vue) {
    console.log("test");
    Vue.prototype.$logb = "global Function";
  },
};
