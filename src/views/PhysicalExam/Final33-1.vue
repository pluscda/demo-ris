<template>
  <section class="details">
    <header class="my-3-grid my-dark">
      <div style="border-left: 1px solid #bfbfbf;">正常</div>
      <div>異常</div>
      <div style="grid-column: 3/-1;text-align:left;padding-left:2px;">於正常或異常欄Ｖ表示之</div>
    </header>
    <main class="my-3-grid my-body" v-for="(item, i) in inspectsArr" :key="item">
      <div>
        <img
          src="tick.svg"
          width="13"
          height="13"
          v-if="getResult(i + 7) == 1"
          style="color:black;"
        />
        <span v-if="getResult(i + 7) == 3" style="color:blue;">專</span>
        <span v-if="getResult(i + 7) == 4" style="color:rgb(253, 126, 20);">已</span>
        <span v-if="!getResult(i + 7)" style="color:red;">未</span>
      </div>
      <div>
        <img src="close.svg" width="12" height="12" v-if="getResult(i + 7) == 2" />
        <span v-if="getResult(i + 7) == 3" style="color:blue;">檢</span>
        <span v-if="getResult(i + 7) == 4" style="color:rgb(253, 126, 20);">檢</span>
        <span v-if="!getResult(i + 7)" style="color:red;">檢</span>
      </div>
      <div
        style="background: #F5F5F5; color:black;text-align:left;;padding-left:2px;"
      >{{ i + 7 }}.{{ item }}</div>
      <div
        style="width:206px;border:none;"
        :style="getSealStatus(i +7) > 1 ? 'border-bottom:1px solid #bfbfbf !important;': ''"
      >
        <img :src="getSealImg(i +7)" :style="getSealStyle(i +7)" style="inline-block;" />
      </div>
    </main>
  </section>
</template>
<script>
import { store, actions } from "@/store/global.js";

const inspectsArr = [
  "頭部顏面頸頭皮",
  "皮膚及淋巴腺",
  "鼻",
  "竇",
  "口腔",
  "咽喉",
  "肺部及胸部",
  "胸部X光",
  "腹部",
  "心臟",
  "內分泌腺",
  "血管(曲張)",
  "肛門及直腸",
  "生殖器",
  "上肢及關節",
  "下肢及關節",
];
const examTypes = ["全部", "異常", , "專檢", "異常+專檢", "正常", "未檢"];

export default {
  data() {
    return {
      inspectsArr,
      buttonType: "success",
      item: store.editItem,
      examTypes,
      examType: "全部",
      masterRole: true,
    };
  },
  props: ["inspects"],
  components: {},
  methods: {
    getSealStatus(n){
      const obj = this.inspects.find((s) => s.Serial == n);
      n += 1;
      const obj2 = this.inspects.find((s) => s.Serial ==  n);
      if(obj?.Seal && obj2?.Seal){
        return 2;
      }else if(!obj?.Seal && obj2?.Seal){
        return 3;
      }else if(obj?.Seal && !obj2?.Seal){
        return 1;
      }else {
        return 0;
      }
    },
     getSealImg(n){
      const obj = this.inspects.find((s) => s.Serial == n);
      return obj?.Seal;
    },
    getSealStyle(n){
      const obj = this.inspects.find((s) => s.Serial == n);
      n = n +1 ;
      const obj2 = this.inspects.find((s) => s.Serial ==  n);
      let str = "";
      if(obj && obj.Seal && obj2 && obj2.Seal){ // small img
        str = `width:100%;height:25px;object-fit:scale-down;`;
      }else if(obj && obj.Seal){  //big img
        str = `width:150px;height:44px;margin-top:4px;object-fit: scale-down;`;
      }
      return str;
    },
    getResult(n) {
      //alert(n);
      const obj = this.inspects.find((s) => s.Serial == n);
      let judge = "";
      if (obj) {
        judge = obj.Judge;
      }
      return judge;
    },
  },
};
</script>
<style lang="scss" scoped>
.details {
}
.my-3-grid {
  display: grid;
  color: white;
  grid-template-columns: repeat(2, 39px) 122px 1fr;
  font-size: 14px;
  > div {
    border-right: 1px solid #bfbfbf;
    text-align: center;
  }
  > div:last-child {
    border-right: none;
  }
}
.my-dark {
  background: #1661a7;
  height: 37px;
  line-height: 37px;
}
.my-body {
  border-right: 1px solid #bfbfbf;
  > div {
    border-right: 1px solid #bfbfbf;
    border-bottom: 1px solid #bfbfbf;
    height: 26px;
  }
}
</style>
