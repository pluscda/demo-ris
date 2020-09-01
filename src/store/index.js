import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    fontSize: 14,
  },
  mutations: {
    SET_FONTSIZE(state, size) {
      state.fontSize = size;
    },
  },
  actions: {},
  modules: {},
});
