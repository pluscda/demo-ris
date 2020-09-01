<template>
  <section class="my-grid" style="border-right:1px solid black;">
    <main class="details">
      <div
        :style="i == 0 ? 'margin-top:10px;' : ''"
        v-for="(item, i) in inspectsArr"
        :key="item"
        v-html="item"
        style="color:black;padding-left:10px;font-size:15px;padding-bottom:2px;line-height:23px"
      ></div>
      <div style="height:5px;"></div>
    </main>
    <div class="vertical-line-dtc"></div>
    <button class="my-btn-38" style="position:relative;">
      檢查醫師簽章
      <img :src="img" v-if="img" />
    </button>
    <main class="my-39" style="grid-column:1/-1">
      39. 臨時記載：{{Comments}}
      <footer v-if="tooLong39">（請至下一頁繼續閱覽）</footer>
    </main>
    <div class="my-39 my-40">
      40.各項缺失總評(包括儀表缺陷): {{Advices}}
      <footer v-if="tooLong40">（請至下一頁繼續閱覽）</footer>
    </div>
    <div class="vertical-line-dtc"></div>
    <button class="my-btn-38" style="position:relative;">
      檢查醫師簽章
      <img :src="ChiefSeal" />
    </button>
    <main class="my-39 my-41" style="grid-column:1/-1">41. 判定體位：</main>
    <footer style="grid-column:1/-1" class="my-footer-header">
      <div class="my-flex">
        <div>日期</div>
        <div class="my-dates">
          <div>年</div>
          <div>月</div>
          <div>日</div>
        </div>
      </div>
      <div class="my-flex">
        <div>區分標準</div>
        <div class="my-class">
          <div>體位</div>
          <div>項次</div>
        </div>
      </div>
      <div class="title">指定醫院代表</div>
      <div class="title">縣市政府代表</div>
      <div class="title">體檢組長</div>
    </footer>

    <footer style="grid-column:1/-1" class="my-last-footer" v-for="item in 3" :key="item">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </footer>
  </section>
</template>
<script>
import { store, actions } from "@/store/global.js";

const inspectsArr = [
  "34.梅毒血清檢查（RPR/VDRL）： {%0}",
  "35. 愛滋病檢查（EIA 酵素免疫法）：  {%1}",
  "36. 血液常規檢查",
  "&nbsp; &nbsp; 白血球(WBC)： {%3} X 1000/ul",
  "&nbsp; &nbsp; 紅血球(RBC)： {%4} X 1000/ul",
  "&nbsp; &nbsp; 血色素(HB)： {%5}gm%",
  "&nbsp; &nbsp; 血比容(HCT)： {%6}%",
  "&nbsp; &nbsp;  平均血球容積(MCV)：{%7} fl",
  "37. 肝功能：SGOT： {%8} 1U / L ( 正常值:13-39 )",
  "&nbsp; &nbsp;  &nbsp; &nbsp;  &nbsp; &nbsp;  &nbsp; &nbsp;  &nbsp; &nbsp; SGPT： {%9} 1U / L ( 正常值:7-52 )",
  "38. 尿液檢查： 尿蛋白：{%10}",
  "&nbsp; &nbsp;  &nbsp; &nbsp;  &nbsp; &nbsp;   &nbsp; &nbsp;&nbsp;  &nbsp;&nbsp; &nbsp;  &nbsp; &nbsp;尿 糖：{%11} mg/dL",
];

const inspectsArrReset = [
  "34.梅毒血清檢查（RPR/VDRL）： 未檢",
  "35. 愛滋病檢查（EIA 酵素免疫法）：  未檢",
  "36. 血液常規檢查",
  "&nbsp; &nbsp; 白血球(WBC)： 未檢",
  "&nbsp; &nbsp; 紅血球(RBC)： 未檢",
  "&nbsp; &nbsp; 血色素(HB)： 未檢",
  "&nbsp; &nbsp; 血比容(HCT)： 未檢",
  "&nbsp; &nbsp;  平均血球容積(MCV)：未檢",
  "37. 肝功能：SGOT：未檢",
  "&nbsp; &nbsp;  &nbsp; &nbsp;  &nbsp; &nbsp;  &nbsp; &nbsp;  &nbsp; &nbsp; SGPT：未檢",
  "38. 尿液檢查： 尿蛋白：未檢",
  "&nbsp; &nbsp;  &nbsp; &nbsp;  &nbsp; &nbsp;   &nbsp; &nbsp;&nbsp;  &nbsp;&nbsp; &nbsp;  &nbsp; &nbsp;尿 糖：未檢",
];
const examTypes = ["全部", "異常", , "專檢", "異常+專檢", "正常", "未檢"];
const MAXLEN = 130;
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
      img: '',
      tooLong39: false,
      tooLong40: false

    };
  },
  computed:{
    Comments(){
      let str = this.GeneralComments;
      //alert(this.GeneralComments)
      if(this.GeneralComments?.length > MAXLEN){
        this.tooLong39 = true;
        str = this.GeneralComments.substring(0,MAXLEN).trim() + "...";
      }
      return str;
    },
    Advices(){
      let str = this.JudgementAdvice;
      //alert(this.GeneralComments)
      if(this.JudgementAdvice?.length > MAXLEN){
        this.tooLong40 = true;
        str = this.JudgementAdvice.substring(0,MAXLEN).trim() + "...";
      }
      return str;
    }

  },
  props:[ "GeneralComments","JudgementAdvice","inspects","ChiefSeal"],
  components: {},
  methods:{
    resetRegx(myStr){
       myStr = myStr.replace(/{%0}/,"");
       myStr = myStr.replace(/{%1}/,"");
       myStr = myStr.replace(/{%2}/,"");
       myStr = myStr.replace(/{%3}/,"");
       myStr = myStr.replace(/{%4}/,"");
       myStr = myStr.replace(/{%5}/,"");
       myStr = myStr.replace(/{%5}/,"");
       myStr = myStr.replace(/{%7}/,"");
       myStr = myStr.replace(/{%8}/,"");
       myStr = myStr.replace(/{%9}/,"");
       myStr = myStr.replace(/{%10}/,"");
       myStr = myStr.replace(/{%11}/,"");
       return myStr;
    },
    getData(){
      const items = this.inspects.filter(s => s.Serial == 34 && s.SubSerial);
      if(!items.length){
        this.inspectsArr = inspectsArrReset;
        return;
      }
      items.sort((a,b) => a.SubSerial.localeCompare(b.SubSerial));
      const imgObj = this.inspects.find(s => s.Serial == 34 && s.SubSerial == 'AIDS');
      this.img = imgObj?.Seal;
      const str = this.inspectsArr.join("&&&");
      let myStr = "";
      items.forEach((s, i) => {
          switch (s.SubSerial) {
            case "AIDS":
              myStr = str.replace(/{%1}/,s.Judge == 1 ? "陰性" : s.Judge > 1 ? "陽性" : "未檢");
              break;
            case "TP":
              myStr = myStr.replace(/{%0}/,s.Judge == 1 ? "陰性" : s.Judge > 1 ? "陽性" : "未檢");
              break;
            case "Hb":
              myStr = myStr.replace(/{%5}/,s.Value);
              break;
            case "HCT":
              myStr = myStr.replace(/{%6}/,s.Value);
              break;
            case "MCV":
              myStr = myStr.replace(/{%7}/,s.Value);
              break;
            case "RBC":
              myStr = myStr.replace(/{%4}/,s.Value);
              break;
            case "WBC":
              myStr = myStr.replace(/{%3}/,s.Value);
              break;
            case "SGOT":
              myStr = myStr.replace(/{%8}/,s.Value);
              break;
            case "SGPT":
              myStr = myStr.replace(/{%9}/,s.Value);
              break;
            case "GLU":
              myStr = myStr.replace(/{%11}/,s.Value);
              break;
            case "PRO":
              myStr = myStr.replace(/{%10}/,s.Value);
              break;
          }
        });
        myStr = this.resetRegx(myStr);
        this.inspectsArr = [...myStr.split("&&&")];

    }

  },
  async mounted() {
    setTimeout(() => this.getData(), 500);
  }
};
</script>
<style lang="scss" scoped>
.my-grid {
  display: grid;
  grid-template-columns: 1fr 2px 160px;
  border-bottom: 1px solid black;
  > button {
    all: unset;
    text-align: center;
    justify-self: start;
    align-self: start;
    width: 160px;
    height: 76px;
    background: #1661a7;
    color: white;
    font-size: 18px;
  }
}
.vertical-line-dtc {
  width: 2px;
  background: black;
}
.my-39 {
  border: 1px solid black;
  height: 120px;
  color: black;
  padding-left: 10px;
  padding-top: 4px;
  position: relative;
  > footer {
    position: absolute;
    font-size: 13px;
    color: black;
    right: 0;
    bottom: 0px;
    display: block;
  }
}

.my-40 {
  height: 158px;
}
.my-41 {
  height: 51px;
}
.my-footer-header {
  height: 59px;
  color: white;
  text-align: center;
  display: grid;
  grid-template-columns: 120px 120px repeat(3, 1fr);
  .title {
    background: #1661a7;
    line-height: 59px;
  }
}
.my-flex {
  display: flex;
  flex-direction: column;
  > div:first-child {
    height: 30px;
    color: white;
    text-align: center;
    background: #1661a7;
    line-height: 30px;
  }
  > div:last-child {
    flex: 1;
  }
}
.my-dates {
  display: grid;
  color: black;
  grid-template-columns: 1fr 1fr 1fr;
  padding-top: 3px;
  > div {
    border-right: 1px solid black;
  }
}
.my-class {
  display: grid;
  grid-template-columns: 1fr 1fr;
  color: black;
  padding-top: 3px;
  > div {
    border-right: 1px solid black;
  }
}
.my-last-footer {
  display: grid;
  grid-template-columns: repeat(3, 40px) repeat(2, 60px) repeat(3, 1fr);
  border: 1px solid black;
  > div {
    border-right: 1px solid black;
    height: 48px;
  }
}
.my-btn-38 {
  position: relative;
  img {
    position: absolute;
    display: block;
    top: 120px;
    left: 10px;
    width: 140px;
    height: 44px;
    margin-top: 4px;
    object-fit: scale-down;
  }
}
.my-btn-38 {
  position: relative;
  > img {
    position: absolute;
    display: block;
    top: 90px;
    left: 5px;
    width: 150px;
    height: 44px;
    margin-top: 4px;
    object-fit: scale-down;
  }
}
</style>
