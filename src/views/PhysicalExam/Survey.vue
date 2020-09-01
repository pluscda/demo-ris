<template>
  <div class="survery">
    <header class="dtc-title">
      <h4>役男身心狀況評量表</h4>
      <div></div>
      <h6 @click="tab = 1" v-if="checkMind">基本資料與健康狀況</h6>
      <h6 @click="tab = 2" v-if="checkMind">身心狀況檢查表</h6>
      <b-button size="sm" variant="primary" @click="$root.$emit('close-servey-dlg')">關閉(F9)</b-button>
    </header>
    <Survery1 v-if="tab == 1"></Survery1>
    <Survery2 v-if="tab == 2"></Survery2>
  </div>
</template>
<style lang="scss" scoped>
</style>
<script>
import { store, actions } from "@/store/global.js";
import Survery1 from "./Survey1.vue";
import Survery2 from "./Survey2.vue";
export default {
  data() {
    return {
      tab: 1
    };
  },
  props:["checkMind"],
  components: {
    Survery1,
    Survery2
  },
  methods: {},
  mounted() {
    this.$root.$on("switch-tab-dtxxx", n => (this.tab = n));
  }
};
</script>
<style lang="scss" scoped>
.survery {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.dtc-title {
  background: var(--primary);
  position: sticky;
  top: 0;
  left: 0;
  color: white;
  height: 40px;
  line-height: 40px;
  padding-left: 1rem;
  border-radius: 5px;
  font-size: 20px;
  display: grid;
  grid-template-columns: max-content 1fr repeat(3, max-content);
  grid-gap: 1rem;
  padding-right: 10px;
  h6,
  h4 {
    line-height: 40px;
  }
  h6 {
    cursor: pointer;
  }
  button {
    height: 30px;
    margin-top: 5px;
  }
}
</style>
