<template>
  <div class="survery" ref="mySurvey">
    <header class="dtc-title">
      <h4>役男身心狀況評量表</h4>
      <div></div>
      <h6 @click="tab = 1">基本資料與健康狀況</h6>
      <h6 @click="tab = 2">身心狀況檢查表</h6>
    </header>
    <SurveyFull1 v-if="tab == 1" :popup="popup"></SurveyFull1>
    <SurveyFull2 v-if="tab == 2" :popup="popup"></SurveyFull2>
  </div>
</template>
<style lang="scss" scoped>
</style>
<script>
import { store, actions } from "@/store/global.js";
import SurveyFull1 from "./SurveyFull1.vue";
import SurveyFull2 from "./SurveyFull2.vue";
export default {
  data() {
    return {
      tab: 1
    };
  },
  props: ["popup"],
  components: {
    SurveyFull1,
    SurveyFull2
  },
  methods: {},
  mounted() {
    this.$root.$on('go-s2', () => {
      this.tab = 0;
      requestAnimationFrame(() =>  this.tab = 2);
    });
  }
};
</script>
<style lang="scss" scoped>
.survery {
  display: flex;
  flex-direction: column;
  background: white !important;
  color: black !important;
  height: 100%;
}
.dtc-title {
  background: var(--primary);
  position: sticky;
  z-index: 99999;
  top: 0;
  left: 0;
  color: white;
  height: 40px;
  line-height: 40px;
  padding-left: 1rem;
  //border-radius: 5px;
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
