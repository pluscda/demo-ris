<template>
  <section class="details">
    <header class="my-3-grid my-dark">
      <div style="border-left: 1px solid black;">正常</div>
      <div>異常</div>
      <div style="grid-column: 3/-1;text-align:left;padding-left:2px;">於正常或異常欄Ｖ表示之</div>
    </header>
    <main class="my-3-grid my-body" v-for="(item, i) in inspectsArr" :key="i">
      <div v-if="!specialCase(item)" style="color:var(--success)">
        <img src="tick.svg" width="13" height="13" v-if="getResult(item) == 1" />
        <span v-if="getResult(item) == 3" style="color:black;">專</span>
        <span v-if="getResult(item) == 4" style="color:black;">已</span>
        <span v-if="!getResult(item)" style="color:black;">未</span>
      </div>
      <div v-if="!specialCase(item)" style="color:var(--danger)">
        <img src="close.svg" width="12" height="12" v-if="getResult(item) == 2" />
        <span v-if="getResult(item) == 3" style="color:black;">檢</span>
        <span v-if="getResult(item) == 4" style="color:black;">檢</span>
        <span v-if="!getResult(item)" style="color:black;">檢</span>
      </div>
      <div
        v-if="!specialCase(item)"
        style="background: #F5F5F5; color:black;text-align:left;;padding-left:2px;"
        v-html="item"
      ></div>
      <div
        v-html="item"
        v-if="specialCase(item)"
        :style="!needBB(item) ? 'border-bottom:none;' : 'border-bottom:1px solid black;'"
        style="grid-column: 1/4;background: #F5F5F5; color:black;text-align:left;;padding-left:2px;"
      ></div>

      <div
        style="width:206px;border:none;"
        :style="getSealStatus(item) > 1 ? 'border-bottom:1px solid black !important;': ''"
      >
        <img :src="getSealImg(item)" :style="getSealStyle(item)" style="inline-block;" />
      </div>
    </main>
  </section>
</template>
<script>
import { store, actions } from "@/store/global.js";

let inspectsArr = [
  "23.耳器",
  "24.鼓膜",
  "25.聽力",
  "<span style='font-size:13px'>語音:右 {%0}/20, 左 {%1}/20</span> ",
  "<span style='font-size:13px'>金屬音:右 {%2}/20, 左 {%3}/20</span> ",
  "26.眼",
  "27.眼底",
  "28.辨色力",
  "29.視力",
  "<span style='font-size:12px'>裸 視：右{%4} 左{%5}</span> ",
  "<span style='font-size:12px'>驗光度數：右{%6} 左{%7}</span> ",
  "<span style='font-size:12px'>矯正視力：右{%8} 左{%9}</span> ",
  "30.神經系統",
  "31.精神",
  "32.智能",
  "33.心電圖",
];
let inspectsArrReset = [
  "23.耳器",
  "24.鼓膜",
  "25.聽力",
  "<span style='font-size:13px'>語音: 未檢</span> ",
  "<span style='font-size:13px'>金屬音: 未檢</span> ",
  "26.眼",
  "27.眼底",
  "28.辨色力",
  "29.視力",
  "<span style='font-size:13px'>裸 視：未檢</span> ",
  "<span style='font-size:13px'>驗光度數： 未檢</span> ",
  "<span style='font-size:13px'>矯正視力： 未檢</span> ",
  "30.神經系統",
  "31.精神",
  "32.智能",
  "33.心電圖",
];
// need to preapre all of them, so we can find related index with serial #
// DO NOT MODIFY
const fullArr = [
  "",
  "身高",
  "體重",
  "體格指標值(BMI)",
  "血壓",
  "脈搏",
  "牙科檢查",
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
  "耳器",
  "鼓膜",
  "聽力",
  "眼",
  "眼底",
  "辨色力",
  "視力",
  "神經系統",
  "精神",
  "智能",
  "心電圖",
  "生化檢查",
];
const examTypes = ["全部", "異常", , "專檢", "異常+專檢", "正常", "未檢"];

export default {
  data() {
    return {
      inspectsArr,
      buttonType: "success",
      item: store.editItem,
      inspectItem: 1,
      examTypes,
      examType: "全部",
      masterRole: true,
    };
  },
  props:["inspects"],
  components: {},
  methods: {
    getItem29Detail(myStr){
       const items = this.inspects.filter(s => s.Serial == 29 && s.SubSerial);
       items.forEach((s, i) => {
        switch (s.SubSerial) {
          case "CVAL":
            myStr = myStr.replace(/{%9}/,s.Value);
            break;
          case "CVAR":
           myStr = myStr.replace(/{%8}/,s.Value);
            break;
          case "UCVAL":
            myStr = myStr.replace(/{%5}/,s.Value);
            break;
          case "UCVAR":
            myStr = myStr.replace(/{%4}/,s.Value);
            break;
          case "L":
            myStr = myStr.replace(/{%7}/,s.Value);
            break;
          case "R":
           myStr = myStr.replace(/{%6}/,s.Value);
            break;

        }
      });
      return myStr;

    },
    getItemDetail(){
       const items = this.inspects.filter(s => s.Serial == 25 && s.SubSerial);
       if(!items.length){
         this.inspectsArr = inspectsArrReset;
         return;
       }
       items.sort((a,b) => a.SubSerial.localeCompare(b.SubSerial));
       const str = this.inspectsArr.join("&&&");
       let myStr = "";
       items.forEach((s, i) => {
        switch (s.SubSerial) {
          case "ML":
            myStr = str.replace(/{%0}/,s.Value);
            break;
          case "MR":
            myStr = myStr.replace(/{%1}/,s.Value);
            break;
          case "VL":
             myStr = myStr.replace(/{%2}/,s.Value);
            break;
          case "VR":
            myStr = myStr.replace(/{%3}/,s.Value);
            break;
        }
       });
       myStr = this.getItem29Detail(myStr);
       this.inspectsArr = [...myStr.split("&&&")];
    },
    getSealStatus(item){
      if(item.includes('金屬音') || item.includes("矯正視力")){
        return 2;
      }
      const id = fullArr.findIndex((s) => s == item.split(".")[1]);
      if(Number(id) < 30) return 0;
      const obj = this.inspects.find((s) => s.Serial == id);
      let n = id + 1;
      const obj2 = this.inspects.find((s) => s.Serial == n);
      if(obj?.Seal && obj2?.Seal){
        return 2;
      }else if(!obj?.Seal &&  obj2?.Seal){
        return 3;
      }else if(obj?.Seal && !obj2?.Seal){
        return 1;
      }else {
        return 0;
      }

    },
    getSealImg(item){
      const n = Number(item.substring(0,2));
      if(isNaN(n)) return null;
      const id = fullArr.findIndex((s) => s == item.split(".")[1]);
      const obj = this.inspects.find((s) => s.Serial == id);
      return obj?.Seal;
    },
    getSealStyle(item){
      let n = Number(item.substring(0,2));
      if(isNaN(n)) return "display:none;";
      const obj = this.inspects.find((s) => s.Serial == n);
      n = n +1 ;
      const obj2 = this.inspects.find((s) => s.Serial ==  n);
      let str = "";
      if(obj?.Seal && obj2?.Seal){ // small img
        str = `width:100%;height:25px;object-fit:scale-down;`;
      }else if(obj?.Seal){  //big img
        str = `width:150px;height:44px;margin-top:4px;object-fit:scale-down;`;
      }

      if(obj?.Seal && n == 29){
        str = `width:150px;height:44px;margin-top:4px;object-fit:scale-down;`;
      }

      if(obj?.Seal && n == 33){
         str = `width:100%;height:25px;object-fit:scale-down;`;
      }
      return str;
    },
    getResult(item) {
      const id = fullArr.findIndex((s) => s == item.split(".")[1]);
      const obj = this.inspects.find((s) => s.Serial == id);
      let judge = "";
      if (obj) {
        judge = obj.Judge;
      }
      return judge;
    },
    specialCase(item) {
      let special = false;
      if (item.includes("25") || item.includes("span") || item.includes("29")) {
        special = true;
      }
      return special;
    },
    needBB(item) {
      let need = false;
      if (item.includes("金屬音") || item.includes("矯正視力")) {
        need = true;
      }
      return need;
    },
  },
  mounted(){
    setTimeout(()=>this.getItemDetail(), 500);
  }
};
</script>
<style lang="scss" scoped>
.my-3-grid {
  display: grid;
  color: white;
  grid-template-columns: repeat(2, 39px) 160px 1fr;
  font-size: 14px;
  > div {
    border-right: 1px solid black;
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
  border-right: 1px solid black;
  > div {
    border-right: 1px solid black;
    border-bottom: 1px solid black;
    height: 26px;
  }
}
</style>
