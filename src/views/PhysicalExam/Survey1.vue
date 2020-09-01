<template>
  <div class="survery1">
    <h4 class="title-center">基本資料與健康狀況</h4>
    <div>
      1.學歷：
      <span>{{edu}}</span>
    </div>
    <div>
      2.國小國中的學業成績大約為：
      <span>{{grade}}</span>
    </div>
    <div>
      3.有沒有機車或是汽車駕照：
      <span>{{driveLic}}</span>
    </div>
    <div>
      4.您過去有沒有工作過的經驗：
      <span>{{work}}</span>
    </div>
    <div>
      5.有沒有領有身心障礙或重大傷病證明：
      <span>{{disable}}</span>
    </div>
    <div>
      6.曾經有過傷害自己行為：
      <span>{{selfDestory}}</span>
    </div>
    <div>
      7.有沒有住過精神科(身心科)的醫院：
      <span>{{crazyb4}}</span>
    </div>
    <div>
      8.有沒有看過精神科(身心科)門診:
      <span>{{crazyPaid}}</span>
    </div>
    <div>
      9.曾經有過腦部受傷的情形？
      <span>{{brainBreak}}</span>
    </div>
    <div>
      10.目前的婚姻狀況：
      <span>{{marry}}</span>
    </div>
    <div>
      11.目前跟誰住在一起：
      <span>{{liveWith.join(",")}}</span>
    </div>
    <div>
      12.自認為身體健康良好:
      <span>{{goodHealth ? goodHealth : "否"}}</span>
    </div>
    <template v-if="!goodHealth">
      <div>
        13.可能免兵役體檢原因:
        <span v-if="!waves.length">無</span>
        <ol style="list-style-type:circle;" class="mt-2" v-if="waves.length">
          <li v-for="(item,i) in waves" :key="i">{{waves[i]}}</li>
        </ol>
      </div>
      <div>
        14.曾患或目前患有以下病症：且
        <span style="color:#003b80;">{{attched}}{{attchedText}}</span>診斷書或相關病症
        <ol style="list-style-type:circle;" class="mt-2">
          <li style="color:black;">
            內科：
            <ol style="list-style-type:circle;" class="mt-2">
              <li style="color:black;">
                皮膚疾病：
                <span v-if="!skins.length">無</span>
              </li>

              <ol v-if="skins.length">
                <li v-for="(item,i) in skins" :key="i">{{skins[i]}}</li>
              </ol>
            </ol>
          </li>
          <ol style="list-style-type:circle;" class="mt-2">
            <li style="color:black;">
              肺結核：
              <span v-if="!lung">無</span>
              <span v-if="lung">{{lung}}</span>
            </li>
          </ol>
          <ol style="list-style-type:circle;" class="mt-2">
            <li style="color:black;">
              自發性氣胸：
              <span v-if="!airLungs.length">無</span>
              <ol v-if="airLungs.length">
                <li v-show="airLungs[i]" v-for="(item,i) in skins" :key="i">{{airLungs[i]}}</li>
              </ol>
            </li>
          </ol>
          <ol style="list-style-type:circle;" class="mt-2">
            <li style="color:black;">
              氣喘：
              <span v-if="!lungs.length">無</span>
              <ol v-if="lungs.length">
                <li v-show="lungs[i]" v-for="(item,i) in skins" :key="i">{{lungs[i]}}</li>
              </ol>
            </li>
          </ol>
          <ol style="list-style-type:circle;" class="mt-2">
            <li style="color:black;">
              其他：
              <span v-if="!innterOthers.length">無</span>
              <ol v-if="innterOthers.length">
                <li
                  v-show="innterOthers[i]"
                  v-for="(item,i) in innterOthers"
                  :key="i"
                >{{innterOthers[i]}}</li>
              </ol>
            </li>
          </ol>
        </ol>
        <ol style="list-style-type:circle;" class="mt-2">
          <li style="color:black;">
            骨外科：
            <span v-if="!bones.length">無</span>
            <ol class="mt-2" v-if="bones.length">
              <li v-for="(item,i) in bones" :key="i">{{bones[i]}}</li>
            </ol>
          </li>
        </ol>

        <ol style="list-style-type:circle;" class="mt-2">
          <li style="color:black;">
            眼科：
            <span v-if="!eyes.length">無</span>
            <ol class="mt-2" v-if="eyes.length">
              <li v-for="(item,i) in eyes" :key="i">{{eyes[i]}}</li>
            </ol>
          </li>
        </ol>

        <ol style="list-style-type:circle;" class="mt-2">
          <li style="color:black;">
            精神科：
            <span v-if="!py">無</span>
            <span v-if="py">{{py}}</span>
          </li>
        </ol>

        <ol style="list-style-type:circle;" class="mt-2">
          <li style="color:black;">
            其他疾病或病史：
            <span v-if="!lastone">無</span>
            <span v-if="lastone">{{lastone}}</span>
          </li>
        </ol>
      </div>
    </template>
  </div>
</template>
<style lang="scss" scoped>
</style>
<script>
import { store, actions } from "@/store/global.js";
const eduLevls = [
  "",
  "不識字",
  "小學",
  "國中",
  "高中高職",
  "大專大學",
  "研究所"
];
const types = ["", "未附", "已附"];
const grades = ["", "30分以下", "30-50分", "50-60分", "60分以上"];
const hasornot = ["", "有", "沒有"];
const yesno = ["", "是", "否"];
const marrys = [
  "",
  "未婚",
  "同居，以前未結婚 ",
  "已婚且住在一起 ",
  "分居",
  "同居，以前已結婚",
  "再婚",
  "離婚",
  "鰥寡"
];
export default {
  data() {
    return {
      edu: "",
      grade: "",
      driveLic: "",
      work: "",
      disable: "",
      selfDestory: "",
      crazyb4: "",
      crazyPaid: "",
      brainBreak: "",
      marry: "",
      goodHealth: "",
      liveWith: [],
      waves: [],
      attched: "",
      attchedText: "",
      skins: [],
      lung: "",
      airLungs: [],
      lungs: [],
      bones: [],
      eyes: [],
      py: "",
      lastone: "",
      innterOthers: [],
      formHistory: {}
    };
  },
  methods: {},
  async created() {
    const items = await window.axios.get(
      "military/Answers?militaryIdNo=" + store.editItem.IdNo
    );
    let item = items.find(s => s.QuestionNo == "2.5");
    item ? (this.edu = eduLevls[+item.Value]) : "";
    item = items.find(s => s.QuestionNo == "2.6");
    item ? (this.grade = grades[+item.Value]) : "";
    item = items.find(s => s.QuestionNo == "2.7");
    item ? (this.driveLic = hasornot[+item.Value]) : "";
    if (item.Value == 2) {
      this.driveLic += `(${item.Text})`;
    }
    item = items.find(s => s.QuestionNo == "2.8");
    item ? (this.work = hasornot[+item.Value]) : "";
    if (item.Value == 1 && item.Text) {
      const [a1, a2] = item.Text.split("~~~~^");
      this.work += `( 做最久工作是: ${a1} / 多久: ${a2} )`;
    }
    item = items.find(s => s.QuestionNo == "2.9");
    item ? (this.disable = hasornot[+item.Value]) : "";
    if (item.Value == 1 && item.Text) {
      this.disable += `(障礙或重大傷病是: ${item.Text})`;
    }
    item = items.find(s => s.QuestionNo == "2.10");
    item ? (this.selfDestory = hasornot[+item.Value]) : "";
    if (item.Value == 1 && item.Text) {
      this.selfDestory += `(傷害情形：${item.Text})`;
    }
    item = items.find(s => s.QuestionNo == "2.11");
    item ? (this.crazyb4 = hasornot[+item.Value]) : "";
    if (item.Value == 1 && item.Text) {
      this.crazyb4 += `(@${item.Text})`;
    }

    // has issue on this one, cannot find text; alex
    item = items.find(s => s.QuestionNo == "2.12");
    item ? (this.crazyPaid = hasornot[+item.Value]) : "";
    //alert(JSON.stringify(item));
    if (item.Value == 1 && item.Text) {
      this.crazyPaid += `(@${item.Text})`;
    }

    item = items.find(s => s.QuestionNo == "2.13");
    item ? (this.brainBreak = hasornot[+item.Value]) : "";
    if (item.Value == 1 && item.Text) {
      this.brainBreak += `(傷害情形：${item.Text})`;
    }
    item = items.find(s => s.QuestionNo == "2.14");
    item ? (this.marry = marrys[+item.Value]) : "";
    item = items.find(s => s.QuestionNo == "2.15#1");
    item ? this.liveWith.push("父母") : "";
    item = items.find(s => s.QuestionNo == "2.15#2");
    item ? this.liveWith.push("兄弟姊妹") : "";
    item = items.find(s => s.QuestionNo == "2.15#3");
    item ? this.liveWith.push("配偶") : "";
    item = items.find(s => s.QuestionNo == "2.15#4");
    item ? this.liveWith.push("子女") : "";
    item = items.find(s => s.QuestionNo == "2.15#5");
    item ? this.liveWith.push("其他親戚") : "";
    item = items.find(s => s.QuestionNo == "2.15#6");
    item ? this.liveWith.push("朋友(室友)") : "";
    item = items.find(s => s.QuestionNo == "2.15#7");
    item ? this.liveWith.push("自己獨居") : "";
    item = items.find(s => s.QuestionNo == "2.15#8");
    item ? this.liveWith.push("收容機構") : "";

    item = items.find(s => s.QuestionNo == "1.1#1");
    item ? (this.goodHealth = yesno[+item.Value]) : "";

    item = items.find(s => s.QuestionNo == "1.1#2");
    item ? this.waves.push("領有效期內之身心障礙證明") : "";
    item = items.find(s => s.QuestionNo == "1.1#3");
    item ? this.waves.push("重大傷病證明") : "";
    item = items.find(s => s.QuestionNo == "1.1#4");
    item ? this.waves.push("全國醫療服務卡") : "";
    item = items.find(s => s.QuestionNo == "1.1#5");
    item
      ? this.waves.push("目前或曾就讀「身心障礙特殊教育班」或「特殊教育學校」")
      : "";

    item = items.find(s => s.QuestionNo == "1.2");
    item ? (this.attched = types[+item.Value]) : "";
    item ? (this.attchedText = item.Text) : "";

    item = items.find(s => s.QuestionNo == "1.3#1");
    item ? this.skins.push("乾癬") : "";
    item = items.find(s => s.QuestionNo == "1.3#2");
    item ? this.skins.push("濕疹(異位性皮膚炎)") : "";
    item = items.find(s => s.QuestionNo == "1.3#3");
    item ? this.skins.push("其他: " + item.Text) : "";

    item = items.find(s => s.QuestionNo == "1.4");
    if (item && item.Value == 1) {
      this.lung = "已完治";
    } else if (item && item.Value == 2) {
      this.lung = "治療中";
    }

    item = items.find(s => s.QuestionNo == "1.5#1");
    item ? this.airLungs.push("曾兩側皆發作，或三年內同側發作二次以上者") : "";
    item = items.find(s => s.QuestionNo == "1.5#2");
    item ? this.airLungs.push("有接受肺組織切除手術") : "";
    item = items.find(s => s.QuestionNo == "1.5#3");
    item ? this.airLungs.push("有輕度以上肺功能障礙") : "";

    item = items.find(s => s.QuestionNo == "1.6#1");
    item ? this.lungs.push("最近1年內發作有就醫紀錄") : "";
    item = items.find(s => s.QuestionNo == "1.6#2");
    item ? this.lungs.push("有輕度以上肺功能障礙") : "";

    item = items.find(s => s.QuestionNo == "1.7#1");
    let name = items.find(s => s.QuestionNo == "1.7#2");
    name ? (name = name.Text) : (name = "");
    item
      ? this.innterOthers.push(
          `心臟血管或心律不整:病症名稱: ${item.Text} 手術名稱${name}`
        )
      : "";
    item = items.find(s => s.QuestionNo == "1.7#3");
    item ? this.innterOthers.push("肝功能異常或肝臟疾病") : "";
    item = items.find(s => s.QuestionNo == "1.7#4");
    item ? this.innterOthers.push("腎功能異常或腎臟疾病") : "";
    item = items.find(s => s.QuestionNo == "1.7#5");
    item ? this.innterOthers.push("有癲癇病史") : "";

    item = items.find(s => s.QuestionNo == "1.8#1");
    name = items.find(s => s.QuestionNo == "1.8#2");
    name ? (name = name.Text) : (name = "");
    item ? this.bones.push(`骨折部位: ${item.Text} 發生年月約為${name}`) : "";
    item = items.find(s => s.QuestionNo == "1.8#3");
    item ? this.bones.push("膝關節韌帶或十字韌帶斷裂") : "";
    item = items.find(s => s.QuestionNo == "1.8#4");
    item ? this.bones.push(`半月板軟骨損傷，發生年月約為 ${item.Text}`) : "";
    item = items.find(s => s.QuestionNo == "1.8#5");
    item ? this.bones.push("扁平足") : "";
    item = items.find(s => s.QuestionNo == "1.8#6");
    item ? this.bones.push("顱腦損傷:曾經開顱手術移除顱骨內病灶者") : "";

    item = items.find(s => s.QuestionNo == "1.9#1");
    item ? this.eyes.push(`眼(視網膜)接受手術名稱: ${item.Text}`) : "";
    item = items.find(s => s.QuestionNo == "1.9#2");
    item ? this.eyes.push(`裝置人工水晶體`) : "";

    item = items.find(s => s.QuestionNo == "1.10");
    item ? (this.py = "有精神疾病病史") : "";

    item = items.find(s => s.QuestionNo == "1.11");
    item ? (this.lastone = item.Text) : "";
  }
};
</script>
<style lang="scss" scoped>
.survery1 {
  display: flex;
  flex-direction: column;
  padding-top: 12px;
  padding-left: 4px;
  max-height: calc(100px);
  height: 100px;
  > div {
    margin-bottom: 10px;
    padding-left: 1.3rem;
    > span {
      color: #003b80;
    }
  }
}
li {
  color: #003b80;
  span {
    color: #003b80;
  }
}
.title-center {
  align-self: center;
  justify-self: center;
}
</style>
