<template>
  <div class="details-bg-dtx">
    <div class="dtx-phrase" v-if="showPhraseDlg">
      <section class="main-phrase">
        <Phrase></Phrase>
      </section>
    </div>
    <section class="pl-2 pb-2 mt-2 forms-status" v-if="distinctRole">
      <h4>役男體檢作業程序完成狀態:</h4>
      <b-check switch size="lg" v-model="item.InquiryFinished" disabled>健康狀況調查表</b-check>
      <b-check switch size="lg" v-model="item.EvalFinished" disabled>身心狀況評量表</b-check>
      <b-check switch size="lg" v-model="item.PhotoFinished" disabled>照片已上傳</b-check>
      <b-button variant="success" class="master-btn" @click="enrollOk">報到完成</b-button>
      <b-button variant="info" @click="$router.push('tracelist')">返回清單</b-button>
    </section>
    <Info class="info"></Info>
    <ServeyFull v-if="distinctRole"></ServeyFull>
    <main
      class="dtc-doc-area"
      :class="masterRole ? 'master-view' :''"
      v-if="!distinctRole"
      ref="mainArea"
    >
      <section class="dtc-left" v-if="!masterRole">
        <header class="left-grid my-dark">
          <div style="padding-left:4px;">序號</div>
          <div>檢查項目</div>
          <div>檢查狀態</div>
        </header>
        <label
          v-for="(item, i) in inspects"
          :key="item"
          class="left-grid left-grid-label"
          :style="i % 2 == 0 ? 'background-color: #F5F5F5;':'background-color: #E0E0E0;'"
        >
          <div style="padding-left:2px;">
            <span :style="inspectItem == item.value ? 'color:var(--orange)':'color:#d2cfcf;'">
              <i class="fas fa-check"></i>
            </span>
            <input
              hidden
              type="radio"
              v-model="inspectItem"
              @change="updateInspectItem(item)"
              :value="item.value"
            />
            {{i + 1}}
          </div>
          <div>{{item.text}}</div>
          <div v-if="item.pass == 0">未檢</div>
          <div v-if="item.pass == 1" style="color:green">正常</div>
          <div v-if="item.pass == 2" style="color:red">異常</div>
          <div v-if="item.pass == 3" style="color:blue">專檢</div>
          <div v-if="item.pass == 4" style="color:#fd7e14;">已檢</div>
        </label>
      </section>

      <section class="dtc-master" v-if="masterRole">
        <header class="left-grid my-dark" style="color:white;">
          <div style="padding-left:4px;">序號</div>
          <div>檢查項目</div>
          <div>檢查醫師</div>
          <div>檢查狀態({{`共${masterInspectArr.length}筆`}})</div>
        </header>
        <header class="left-grid my-dark" style="color:white;">
          <div></div>
          <div></div>
          <b-select
            size="sm"
            :options="names"
            v-model="name"
            style="transform:translate(-12px, -3px)"
            :disabled="!names.length"
          ></b-select>
          <b-select
            :options="examTypes"
            size="sm"
            v-model="examType"
            style="transform:translate(-2px, -3px)"
          ></b-select>
        </header>
        <label
          v-for="(item, i) in masterInspectArr"
          :key="item"
          class="left-grid left-grid-label"
          :style="i % 2 == 0 ? 'background-color: #F5F5F5;':'background-color: #E0E0E0;'"
        >
          <div style="padding-left:2px;">
            <span :style="inspectItem == item.value ? 'color:var(--orange)':'color:#d2cfcf;'">
              <i class="fas fa-check"></i>
            </span>
            <input
              hidden
              type="radio"
              v-model="inspectItem"
              @change="updateInspectItem(item)"
              :value="item.value"
            />
            {{i + 1}}
          </div>
          <div>{{item.text}}</div>
          <div>{{item.name}}</div>
          <div v-if="item.pass == 0">未檢</div>
          <div v-if="item.pass == 1" style="color:green">正常</div>
          <div v-if="item.pass == 2" style="color:red">異常</div>
          <div v-if="item.pass == 3" style="color:blue">專檢</div>
          <div v-if="item.pass == 4" style="color:#fd7e14;">已檢</div>
        </label>
      </section>
      <section class="dtc-right" v-if="!distinctRole">
        <nav class="master-aside-note" v-show="showMasterComment">
          <header class="header2">
            <div>總醫師註記</div>
            <b-button variant="info" size="sm" class="mr-4" @click="showDlg4Phrase">片語維護 (F3)</b-button>
            <b-button variant="primary" size="sm" @click="saveMasterNote">儲存(F6)</b-button>
            <b-button variant="secondary" size="sm" @click="showMasterComment=false">返回(F7)</b-button>
          </header>
          <main class="main2">
            <div class="dtc-kfc">
              <div class="my-note2">各項缺點之總評(包括儀表缺失)</div>
              <b-textarea
                class="master-innn"
                placeholder="請輸入"
                spellcheck="false"
                v-model="item.ChiefJudgementAdvice"
              ></b-textarea>
            </div>
            <div class="dtc-kfc">
              <div class="my-note3">註記</div>
              <b-textarea
                class="master-innn"
                placeholder="請輸入"
                spellcheck="false"
                v-model="item.ChiefGeneralComments"
              ></b-textarea>
            </div>
          </main>
        </nav>
        <div class="dtc-btns">
          <b-button
            variant="danger"
            size="sm"
            @click="showMasterComment = true"
            class="mr-4 master-btn"
            v-if="masterRole"
          >總醫師註記(F5)</b-button>
          <b-button
            variant="light"
            size="sm"
            class="mr-4"
            @click="splitView = !splitView"
          >役男身心狀況評量表(F9)</b-button>
          <b-button variant="success" size="sm" class="mr-4" @click="showDlg4Phrase">片語維護 (F3)</b-button>
          <b-button variant="info" size="sm" @click="$router.push('tracelist')">返回清單 (F4)</b-button>
        </div>
        <keep-alive>
          <span
            :style="masterRole ? 'pointer-events:none;':''"
            v-if="savedExamItems"
            class="dtc-span-2"
          >
            <Item1 v-if="inspectItem == 1"></Item1>
            <Item2 v-if="inspectItem == 2"></Item2>
            <Item3 v-if="inspectItem == 3"></Item3>
            <Item4 v-if="inspectItem == 4"></Item4>
            <Item5 v-if="inspectItem == 5"></Item5>
            <Item6 v-if="inspectItem == 6"></Item6>
            <Item7 v-if="inspectItem == 7"></Item7>
            <Item8 v-if="inspectItem == 8"></Item8>
            <Item9 v-if="inspectItem == 9"></Item9>
            <Item10 v-if="inspectItem == 10"></Item10>
            <Item11 v-if="inspectItem == 11"></Item11>
            <Item12 v-if="inspectItem == 12"></Item12>
            <Item13 v-if="inspectItem == 13"></Item13>
            <Item14 v-if="inspectItem == 14"></Item14>
            <Item15 v-if="inspectItem == 15"></Item15>
            <Item16 v-if="inspectItem == 16"></Item16>
            <Item17 v-if="inspectItem == 17"></Item17>
            <Item18 v-if="inspectItem == 18"></Item18>
            <Item19 v-if="inspectItem == 19"></Item19>
            <Item20 v-if="inspectItem == 20"></Item20>
            <Item21 v-if="inspectItem == 21"></Item21>
            <Item22 v-if="inspectItem == 22"></Item22>
            <Item23 v-if="inspectItem == 23"></Item23>
            <Item24 v-if="inspectItem == 24"></Item24>
            <Item25 v-if="inspectItem == 25"></Item25>
            <Item26 v-if="inspectItem == 26"></Item26>
            <Item27 v-if="inspectItem == 27"></Item27>
            <Item28 v-if="inspectItem == 28"></Item28>
            <Item29 v-if="inspectItem == 29"></Item29>
            <Item30 v-if="inspectItem == 30"></Item30>
            <item31 v-if="inspectItem == 31"></item31>
            <Item32 v-if="inspectItem == 32"></Item32>
            <Item33 v-if="inspectItem == 33"></Item33>
            <Item34 v-if="inspectItem == 34"></Item34>

            <div v-if="splitView && !showPhraseDlg" class="split-view">
              <Survey :checkMind="checkMind"></Survey>
            </div>
          </span>
        </keep-alive>
      </section>
    </main>
    <AddPhrase></AddPhrase>
    <!-- <main class="show-person-survey" v-if="showReadOnlyForm">
      <div>
        <ServeyFull :popup="popup"></ServeyFull>
      </div>
    </main>-->
  </div>
</template>
<script>
import { store, actions } from "@/store/global.js";
import Info from "@/views/PhysicalExam/Information.vue";
import Item1 from "./items/Item1.vue";
import Item2 from "./items/Item2.vue";
import Item3 from "./items/Item3.vue";
import Item4 from "./items/Item4.vue";
import Item5 from "./items/Item5.vue";
import Item6 from "./items/Item6.vue";
import Item7 from "./items/Item7.vue";
import Item8 from "./items/Item8.vue";
import Item9 from "./items/Item9.vue";
import Item10 from "./items/Item10.vue";
import Item11 from "./items/Item11.vue";
import Item12 from "./items/Item12.vue";
import Item13 from "./items/Item13.vue";
import Item14 from "./items/Item14.vue";
import Item15 from "./items/Item15.vue";
import Item16 from "./items/Item16.vue";
import Item17 from "./items/Item17.vue";
import Item18 from "./items/Item18.vue";
import Item19 from "./items/Item19.vue";
import Item20 from "./items/Item20.vue";
import Item21 from "./items/Item21.vue";
import Item22 from "./items/Item22.vue";
import Item23 from "./items/Item23.vue";
import Item24 from "./items/Item24.vue";
import Item25 from "./items/Item25.vue";
import Item26 from "./items/Item26.vue";
import Item27 from "./items/Item27.vue";
import Item28 from "./items/Item28.vue";
import Item29 from "./items/Item29.vue";
import Item30 from "./items/Item30.vue";
import Item31 from "./items/Item31.vue";
import Item32 from "./items/Item32.vue";
import Item33 from "./items/Item33.vue";
import Item34 from "./items/Item34.vue";
import Phrase from "./items/Phrase.vue";
import AddPhrase from "./Modal/AddPhrase";
import Survey from "./Survey.vue";
import ServeyFull from "./SurveyFull.vue";
let formsError = [
  "要完成: ",
  ",健康狀況調查表",
  ",身心狀況評量表",
  ",並且要照片上傳",
  ",才能報到完成"
];
const inspectsArr = [
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
  "生化檢查"
];

store.inspectsArr = [...inspectsArr];
const examTypes = ["全部", "異常", , "專檢", "異常+專檢", "正常", "未檢","已檢"];

formsError = formsError.join("");
export default {
  data() {
    return {
      popup: true,
      checkMind: false,
      showReadOnlyForm: false,
      splitView: false,
      showMasterComment: false,
      buttonType: "success",
      item: {}, 
      distinctRole: sessionStorage.role == "DistrictOffice" ? true : false,
      masterRole: sessionStorage.role == "HospitalMasterDoctor" && !location.href.includes('masterEdiable_dtc') ? true : false,
      inspects: [],
      inspectItem: 1,
      examTypes,
      examType: "全部",
      phrases: [],
      names: [],
      name: "全部"
    };
  },
  components: {
    Info,
    Item1,
    Item2,
    Item3,
    Item4,
    Item5,
    Item6,
    Item7,
    Item8,
    Item9,
    Item10,
    Item11,
    Item12,
    Item13,
    Item14,
    Item15,
    Item16,
    Item17,
    Item18,
    Item19,
    Item20,
    Item21,
    Item22,
    Item23,
    Item24,
    Item25,
    Item26,
    Item27,
    Item28,
    Item29,
    Item30,
    Item31,
    Item32,
    Item33,
    Item34,
    Phrase,
    AddPhrase,
    Survey,
    ServeyFull
  },
  computed: {
    blackMsg(){
      return store.ExceptionMessage;
    },
    showPhraseDlg() {
      return store.showPhraseDlg;
    },
    savedExamItems() {
      return store.savedExam;
    },
    headerName() {
      const name = inspectsArr.find((s, i) => i == this.inspectItem);
      return name;
    },
    itemEdited() {
      return store.editItem;
    },
    masterInspectArr() {
      let arr = [];
      if (this.examType.includes("未檢")) {
        const ret = this.inspects.filter(s => s.pass == 0);
        ret ? (arr = [...arr, ...ret]) : "";
      }
      if (this.examType.includes("正常")) {
        const ret = this.inspects.filter(s => s.pass == 1);
        ret ? (arr = [...arr, ...ret]) : "";
      }
      if (this.examType.includes("異常")) {
        const ret = this.inspects.filter(s => s.pass == 2);
        ret ? (arr = ret) : "";
      }
      if (this.examType.includes("專檢")) {
        const ret = this.inspects.filter(s => s.pass == 3);
        ret ? (arr = [...arr, ...ret]) : "";
      }
      if (this.examType.includes("已檢")) {
        const ret = this.inspects.filter(s => s.pass == 4);
        ret ? (arr = [...arr, ...ret]) : "";
      }
      if (this.name != "全部" && arr.length) {
        const ret = arr.filter(s => s.name == this.name);
        ret ? (arr = [...ret]) : "";
      } else if (this.name != "全部") {
        const ret = this.inspects.filter(s => s.name == this.name);
        ret ? (arr = [...ret]) : "";
      }

      if (this.examType.includes("全部") && this.name.includes("全部")) {
        arr = [...this.inspects];
      }
      this.inspectItem = arr && arr.length ? arr[0].value : "";
      return arr;
    }
  },
  methods: {
    async showDlg4Phrase(f3) {
      let str = window.getSelection().toString();
      if (f3 && !str && document.activeElement.selectionStart !== undefined) {
        // fix FF issue
        try {
          str = document.activeElement.value.substring(
            document.activeElement.selectionStart,
            document.activeElement.selectionEnd
          );
        } catch (e) {
          store.showPhraseDlg = true;
        }
      }

      if (str) {
        const obj = { Code: this.inspectItem, Text: str };
        await this.$vlf.setItem("addPhrase", obj);
        this.$bvModal.show("dtcAddPhrase");
      } else {
        store.showPhraseDlg = true;
      }
    },
    finalJudge() {
      alert("建置中...");
    },
    checkLastWord(word) {
      const obj = this.phrases.find(s => s.Code == word);
      if (!obj) {
        return "";
      }
      return obj.Text + " ";
    },
    watchTextArea(el) {
      el.addEventListener("keyup", event => {
        if (event.keyCode !== 32 || !event.target.value) {
          return;
        }
        let words = event.target.value.trim().split(" ");
        const lastWord = words[words.length - 1];
        const ret = this.checkLastWord(lastWord);
        if (ret) {
          words.length = words.length - 1;
          event.target.value = words.join(" ") + " " + ret;
        }
      });
    },
    updateInspectItem() {
      this.$refs.mainArea.scrollTop = 0;
      requestAnimationFrame(() => {
        const els = [...document.querySelectorAll(".dtc-right textarea")];
        const inputs = [...document.querySelectorAll(".dtc-right input")];
        els.forEach(s => {
          this.watchTextArea(s);
          s.classList.add("mousetrap");
        });
        inputs.forEach(s => {
          s.classList.add("mousetrap");
        });
        this.checkViews();
      });
    },
    async enrollOk() {
      const item = await actions.getInfoById(this.item.IdNo);
      if (!item.PreActionFinish) {
        this.$bvToast.toast(formsError, {
          title: "系統資訊",
          autoHideDelay: 15000,
          variant: "danger"
        });
      } else {
        try {
          await actions.checkInSystem(this.item.IdNo);
          this.$bvToast.toast(`報到成功`, {
            title: "系統資訊",
            autoHideDelay: 5000,
            variant: "success"
          });
        } catch (e) {
          alert(e);
        }
      }
    },
    canViewMindTabs(){
        let ret = false;
        if(sessionStorage.procedureSerial.indexOf("31") != -1 ||
           sessionStorage.procedureSerial.indexOf("31") != -1 ||
           sessionStorage.procedureSerial.indexOf("31") != -1){
             ret = true;
           }
        return ret;
    },
    async getData(skipReadOnlyForm) {
      //step1 get previous exam saved result
      store.savedExam = await actions.getExamResults(store.editItem.Id);
      if (!store.savedExam) {
        store.savedExam = [];
      }
      if (
        sessionStorage.procedureSerial &&
        sessionStorage.procedureSerial.length &&
        this.canViewMindTabs()
      ) {
        this.showReadOnlyForm = true;
        this.checkMind = true;
      }
      //step2 get doc exam list ; ex[1,2,3]; max has 34 items
      let nums = sessionStorage.procedureSerial.split(",");
      if (this.masterRole) {
        nums = new Array(34).fill().map((s, i) => i + 1);
      }
      //const nums = await actions.getAccountNums();
      let inspects = inspectsArr.map((s, i) => ({
        value: i, // Searial #
        text: s,
        pass: 0, // set 未檢 : 0 as default val, 1 ok, 2 not ok, 3 transfer
        name: store.savedExam.find(s => s.Serial == i)
          ? store.savedExam.find(s => s.Serial == i).AccountName
          : ""
      }));

      if (nums && nums.length) {
        inspects = inspects.filter(s => nums.find(t => t == s.value));
        store.savedExam.forEach(s => {
          const item = inspects.find(ins => ins.value == s.Serial);
          item ? (item.pass = s.Judge) : "";
        });
        // item 34 , last one is special case
        if (nums.find(s => s == 34)) {
          const _a = store.savedExam.filter(s => s.Serial == 34);
          _a.forEach(s => {
            if (s.Judge) {
              const item = inspects.find(ins => ins.value == 34);
              item.pass = 4;
              //alert(item.pass)
            }
          });
        }
        const nameSet = new Set(inspects.map(s => s.name));
        this.names = [...nameSet];
        if (!this.names[0]) {
          this.names = [];
        } else this.names.unshift("全部");
        this.inspects = [...inspects];
      } else {
        this.inspects = [];
      }
      this.nameList = this.inspects.map(s => s.name);
    },
    checkViews() {
      if (this.masterRole) {
        const els = [...document.querySelectorAll(".header-row .btn-primary")];
        els.forEach(el => (el.style.opacity = "0"));
      }
    },
    async saveMasterNote() {
      const obj = {
        MilitaryIdNo: store.editItem.IdNo,
        ChiefJudgementAdvice: this.item.ChiefJudgementAdvice,
        ChiefGeneralComments: this.item.ChiefGeneralComments
      };
      try {
        await axios.post("/military/ChiefGeneralComments", obj);
        this.$bvToast.toast(`儲存成功`, {
          title: "總醫師註記",
          autoHideDelay: 5000,
          variant: "success"
        });
        store.editItem = { ...store.editItem };
      } catch (e) {
        alert(e);
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    store.showPhraseDlg = false;
    next();
  },
  async created() {
    store.savedExam = "";
    if (store.editItem) {
      this.item = store.editItem;
      this.$vlf.setItem("detailsItem", store.editItem);
    } else if (sessionStorage.token) {
      this.item = await this.$vlf.getItem("detailsItem");
      store.editItem = this.item;
    }
    this.getData();
  },
  async mounted() {
    setTimeout(() => this.updateInspectItem(), 500);
    setTimeout(() => this.checkViews(), 500);
    this.phrases = await this.$vlf.getItem("phrase");
    if (!this.phrases) {
      const { Items: p1 } = await actions.getPrivatePhrases(
        "?$inlinecount=allpages"
      );
      const { Items: p2 } = await actions.getPublicPhrases(
        "?$inlinecount=allpages"
      );
      const sum = [...p1, ...p2];
      this.$vlf.setItem("phrase", sum);
      this.phrases = sum;
    }
    //alert(this.phrases.length);

    // keys and functions binding
    this.$mousetrap.bind("f3", () => this.showDlg4Phrase("f3"));
    this.$mousetrap.bind("f4", () => this.$router.push("tracelist"));
    if (this.masterRole) {
      this.$mousetrap.bind("f5", () => (this.showMasterComment = true));
      this.$mousetrap.bind("f6", this.saveMasterNote);
      this.$mousetrap.bind("f7", () => (this.showMasterComment = false));
    }
    this.$mousetrap.bind("f9", () => (this.splitView = !this.splitView));
    // listen for events
    this.$root.$on("close-servey-dlg", () => {
      this.splitView = false;
    });
    this.$root.$on("close-dtc-dlg-readonly", () => {
      this.showReadOnlyForm = false;
    });
  },
  watch: {
    itemEdited(v) {
      this.getData(true);
    },
    blackMsg(v){
      if(!v)return;
      this.$bvToast.toast('' + v, {
          title: "儲存失敗",
          autoHideDelay: 5000,
          variant: "danger"
      });
      store.ExceptionMessage = "";

    }

  }
};
</script>
<style lang="scss" scoped>
.phy {
  height: calc(100vh - 60px);
  display: grid;
  grid-template-columns: minmax(250px, 20%) 80%;
  grid-template-rows: auto auto 1fr;
  grid-gap: 3px;
  padding-right: 10px;
  .info,
  .basic {
    grid-column: 1 / 3;
    width: 90%;
  }
  .info,
  .basic {
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
    border-radius: 5px;
    overflow: hidden;
  }
  .ckeck-item,
  .notes {
    // height: 100px;
    border: 1px solid #ddd;
    overflow: auto;
    // background-color: red;
  }
}
.forms-status {
  display: grid;
  grid-template-columns: repeat(34, max-content);
  grid-gap: 1rem;
}

/deep/ .custom-control-input:disabled ~ .custom-control-label {
  color: white;
}
/deep/
  .custom-switch
  .custom-control-input:disabled:checked
  ~ .custom-control-label::before {
  background-color: var(--primary) !important;
}
</style>
<style lang="scss" scoped>
label {
  all: unset;
}
.dtc-doc-area,
.master-view {
  display: grid;
  grid-template-columns: 300px 1fr;
  min-height: calc(100vh - 350px);
  max-height: calc(100vh - 350px);
  overflow-y: auto;
}
.master-view {
  grid-template-columns: 520px 1fr;
}

.dtc-left,
.dtc-master {
  border-radius: 5px;
  border: 1px solid white;
  max-height: calc(100vh - 350px);
  overflow-y: auto;
  background: white;
}

.dtc-right {
  margin-left: 3px;
  padding-right: 10px;
  position: relative;
  header {
    position: relative;
    height: 40px;
    font-size: 20px;
    background: var(--warning);
    color: black;
    border-radius: 5px;
    padding-left: 10px;
    display: grid;
    grid-template-columns: repeat(6, max-content);
    grid-gap: 1rem;
    > div {
      line-height: 40px;
    }
    button {
      max-height: 35px;
      margin-top: 3px;
      line-height: 12px;
    }
  }
}
.dtc-btns {
  position: absolute;
  top: 4px;
  right: 1rem;
  display: grid;
  grid-template-columns: repeat(23, max-content);
}
.left-grid {
  display: grid;
  grid-template-columns: 70px 1fr 70px;
  color: black;
}
.dtc-master {
  .left-grid {
    display: grid;
    grid-template-columns: 70px 1fr 160px 130px;
    color: black;
  }
}
.my-dark {
  background: var(--gray);
  color: white;
}
.left-grid-label {
  > div {
    padding: 4px;
    cursor: pointer;
  }
}
.left-grid-label:not(:last-child) {
  border-bottom: 1px solid white;
}

.dtx-phrase {
  position: fixed;
  top: 80px;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(#000, 0.95);
  z-index: 8;
}
.master-btn {
  //animation: myMasterBtn 1s ease-in-out infinite;
}
@keyframes myMasterBtn {
  0% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}

.master-aside-note {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  z-index: 3;
  background: white;
  .header2 {
    display: grid;
    height: 50px;
    background: var(--warning);
    color: black;
    width: 100%;
  }
  .main2 {
    display: grid;
    flex: 1;
    grid-template-columns: 1fr 1fr;
  }
}

.my-note1,
.my-note2,
.my-note3 {
  height: 30px;
  font-size: 20px;
  background: var(--info);
  color: white;
  border-radius: 5px;
  padding-left: 10px;
}
.my-note2 {
  background: var(--success);
}
.my-note3 {
  background: var(--primary);
}
.dtc-kfc {
  display: flex;
  flex-direction: column;
}
.master-innn {
  flex: 1;
}
.dtc-span-2 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(50%, 1fr));
}
/deep/ .btn-light {
  background: #1383e3;
  color: white;
  border-color: #1383e3;
}
.split-view {
  background: white;
  border-left: 1px solid black;
  border-radius: 5px;
  z-index: 9;
  min-height: calc(100vh - 355px) !important;
  //border: 1px solid red;
  position: relative;
  overflow-y: auto;
  color: var(--dark);
  .close-dlg {
    float: right;
    color: var(--dark);
    font-size: 24px;
    cursor: pointer;
    margin-top: 5px;
    margin-right: 10px;
  }
}

.details-bg-dtx {
  background: #616161;
  box-shadow: 0 -120px 0 0 #616161;
  position: relative;
}
.show-person-survey {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(#000, 0.8);
  display: grid;
  place-items: center;
  z-index: 999;
  > div {
    z-index: 9999;
    background: white;
    margin-top: 10px;
    width: 90vw;
    height: 90vh;
    position: relative;
    overflow-y: auto;
  }
}
</style>

