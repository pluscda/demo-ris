<template>
  <section class="details-note">
    <main class="left">
      <header>醫院(師)建議事項</header>
      <div style="padding:4px;">臨時記載(呈上一頁): {{Comments}}</div>
      <div style="background:black;"></div>
      <div style="padding:4px;">各項缺失總評(呈上一頁): {{Advices}}</div>
    </main>
    <div class="center"></div>
    <main class="right">
      <header>醫院印信欄</header>
      <div style="padding:4px;"></div>
    </main>
  </section>
</template>
<script>
import { store, actions } from "@/store/global.js";
const MAXLEN = 130;
export default {
  data() {
    return {
     
    };
  },
   props:[ "GeneralComments","JudgementAdvice","inspects"],
   computed:{
    Comments(){
      let str = "";
      if(this.GeneralComments?.length > MAXLEN){
        str = this.GeneralComments.substring(MAXLEN).trim() ;
      }
      return str;
    },
    Advices(){
      let str = '';
      if(this.JudgementAdvice?.length > MAXLEN){
        str = this.JudgementAdvice.substring(MAXLEN).trim();
      }
      return str;
    }

  },
  components: {},
  mounted(){
    //alert(this.GeneralComments)
  }
};
</script>
<style lang="scss" scoped>
.details-note {
  display: grid;
  width: 1440px;
  height: 854px;
  grid-template-columns: 1fr 2px 1fr;
  color: black !important;
  font-size: 15px;
  .left {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 40px 1fr 1px 1fr;
  }
  .right {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 40px 1fr;
  }
  .center {
    background: black;
  }
  header {
    background: #1661a7;
    color: white;
    text-align: center;
    font-size: 20px;
    line-height: 40px;
  }
}
</style>
