<template>
  <section class="details-note hide-while-print">
    <main class="doctor">
      <!-- <header>醫院(師)建議事項{{examresult}}</header> -->
      <div style="margin:2px 0px 2px 20px;">(共{{examresult.length}}筆)</div>
      <header class="dtc-grid-header my-dark ml-1" style="margin:0;">
        <div v-for="(item, i) in headers" :key="i">{{ item.name }}</div>
      </header>
      <main
        class="dtc-grid-header main-dtc-body"
        v-for="(item, i) in examresult"
        :key="i"
        style="color:black;"
        :style="
        i % 2 == 0 ? 'background-color: #F5F5F5;' : 'background-color: #E0E0E0;'"
      >
        <div>{{i+1}}</div>
        <div>{{item.AccountName}}</div>
        <div :title="item.Note" style="z-index:999999">{{item.Note}}</div>
      </main>
    </main>
  </section>
</template>
<script> 
import { store, actions } from "@/store/global.js";
const headers = [
  { name: "項次", key: "Word", sortDesc: null },
  { name: "醫生", key: "CreateAccountNo", sortDesc: null },
  { name: "醫生註記", key: "CreateTime", sortDesc: null }
];
export default {
  data() {
    return {
     alldata:[],
     headers,
    };
  },
  props: ["examresult"],
  components: {},
  async mounted() {  
    this.$root.$emit("click-final-esc");  
  },
};
</script>
<style lang="scss" scoped>
.details-note {
  width: 80vw;
  height: 891.914px;
  max-width: 1440px;
  color: black !important;
  font-size: 15px;
  overflow-y: auto;
  .doctor {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
  }

  header {
    background: #1661a7;
    color: white;
    text-align: center;
    font-size: 20px;
    line-height: 40px;
  }
}
.dtc-grid-header {
  display: grid;
  grid-template-columns: 90px 140px 1fr; //repeat(4, 1fr);
  grid-auto-flow: column;
  text-align: center;
  padding-right: 0px;
  border: 1px solid white;
  > div {
    border-right: 1px solid white;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    font-size: 14px;
    padding: 4px 0;
  }
  > div:last-child {
    border-right: none;
  }
}
.my-dark {
  > div {
    background: var(--gray);
    color: white;
  }
}
.main-dtc-body {
  &:hover {
    background-color: rgba(0, 0, 0, 0.075);
  }
  > div {
    line-height: 24px;
  }
}
</style>
