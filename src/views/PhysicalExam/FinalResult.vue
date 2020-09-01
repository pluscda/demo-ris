<template>
  <section class="details" id="dtc-print-it">
    <header class="top-title">
      <span class="top-title-word">役男體格檢查表</span>
      <div class="close-dlg hide-while-print" v-if="!commentBtn && !commentMilitary">
        <b-button
          size="sm"
          v-if="fromService"
          style="transform:translateX(-50px);background-color:transparent !important;color:white !important; border:0px;"
          @click="pushMilitarybtn"
        >兵役局備註(F6)</b-button>
        <b-button
          size="sm"
          v-if="fromService"
          style="transform:translateX(-40px);background-color:transparent !important;color:white !important; border:0px;"
          @click="pushDoctorbtn"
        >醫生註記(F7)</b-button>
        <b-button
          size="sm"
          variant="success"
          v-if="fromService"
          style="transform:translateX(-30px);"
          @click="viewComplete(item.IdNo)"
        >檢核完成(F8)</b-button>
        <b-button
          size="sm"
          @click.stop="printPage"
          variant="success"
          style="transform:translateX(-20px);"
        >列 印(F9)</b-button>
        <span @click="closeDlg">
          <i class="fas fa-times-circle"></i>
        </span>
      </div>
      <b-button
        size="sm"
        variant="success"
        v-if="commentBtn || commentMilitary"
        class="backbtn"
        @click="rollbackPage"
      >返 回(Esc)</b-button>
    </header>
    <DoctorComments v-if="commentBtn" :examresult="examresult"></DoctorComments>
    <MilitaryComments v-if="commentMilitary" :PersonInfo="PersonInfo"></MilitaryComments>
    <span v-show="!commentBtn  && !commentMilitary">
      <main class="main-body" v-show="!nextPage || showAllDetails">
        <div class="TL-ALL-FLEX">
          <main class="tl-upper430">
            <header
              class="long-header"
              style="background:#1661A7;color:white;writing-mode: vertical-lr;"
            >基 本 資 料</header>
            <div
              style="display:flex;flex-direction:column;"
              :style="showAllDetails ? 'border:1px solid black;':'border:1px solid #BFBFBF;'"
              class="upper2"
            >
              <div
                :style="showAllDetails ? 'border-bottom:1px solid black;':'border-bottom:1px solid #BFBFBF;'"
              >
                <h6 class="mb-2">檢查日期： {{ item.ExamDate }}</h6>
                <h6>檢查醫院：{{ item.InstitutionId }}</h6>
              </div>
              <div class="many-info">
                <div>姓名：{{ item.Name }}</div>
                <div>身分證字號：{{ item.IdNo }}</div>
                <div>出生日期：{{ item.Birthday }}</div>
                <div style="grid-column:1/-1">
                  行動電話：本人：{{ item.MobilePhone ? item.MobilePhone : "暫無資料" }}
                  <span>/ 家屬(父或母): {{ item.ContactPhone }}</span>
                  <span
                    style="display:inline-block;margin-left:2.2rem;"
                  >聯絡電話: {{ item.ContactPhone }}</span>
                </div>
                <div style="grid-column:1/-1">戶籍地址：{{ item.Address ? item.Address : "暫無資料" }}</div>
              </div>
            </div>
            <div :style="showAllDetails ? 'border:1px solid black;':'border:1px solid #BFBFBF;'">
              <img :src="base64" width="160" height="160" style="border-radius:4px;" v-if="base64" />
            </div>
            <header
              style="background:#1661A7;color:white;writing-mode: vertical-lr; text-align: center;"
              :style="showAllDetails ? 'border-top:1px solid black;':'border-top:1px solid #BFBFBF;'"
            >病 史</header>
            <div
              style="padding:4px;font-size:14px;"
              :style="showAllDetails ? 'border:0px solid black;':'border:0px solid #BFBFBF;'"
            >過去病史(重要疾病手術時地):</div>
            <div
              style="background: #1661A7;color:white;text-align:center;line-height:70px;"
              :style="showAllDetails ? 'border:1px solid black;':'border:1px solid #BFBFBF;'"
            >檢查醫師簽章</div>
            <section
              style="grid-column:1/-1;border-top:none;"
              :style="showAllDetails ? 'border:1px solid black;':'border:1px solid #BFBFBF;'"
              class="upper430-sec"
            >
              <div
                class="info1"
                :style="showAllDetails ? 'border:1px solid black;':'border:1px solid #BFBFBF;'"
              >
                <div>1.身高 {{ s1 }} 公分</div>
                <div>2.體重 {{ s2 }} 公斤</div>
                <div>3.體格指標值(BMI) {{ s3 }}</div>
              </div>
              <div
                class="big-seal"
                :style="showAllDetails ? 'border:1px solid black;':'border:1px solid #BFBFBF;'"
              >
                <img :src="sealOne" style="transform:translateY(-3px)" v-if="sealOne" />
              </div>
              <div
                class="info45"
                :style="showAllDetails ? 'border:1px solid black;':'border:1px solid #BFBFBF;'"
              >
                <div>4.血壓</div>
                <div style="font-size:12px" v-html="s4 ? s4 + 'mmHg' : '未檢'"></div>
                <div>5.脈搏 {{ s5 }} 次/分</div>
              </div>
              <div
                class="small-seal"
                :style="showAllDetails ? 'border:1px solid black;':'border:1px solid #BFBFBF;'"
              >
                <img :src="sealTwo" v-if="sealTwo" />
              </div>
              <div
                class="info3"
                style="border:none;"
                :style="showAllDetails ? 'border:1px solid black;':'border:1px solid #BFBFBF;'"
              >
                <div class="pl-2">
                  <pre>6.牙科檢查： Ｏ可矯治  /不可治  Ｘ缺齒齟生齒  ＸＸ假牙固定牙橋</pre>
                  <main class="input-area" style="margin-left:60px; transform:translateY(-13px); ">
                    <div id="R8U" style="border-left:1px solid black;">8</div>
                    <div id="R7U">7</div>
                    <div id="R6U">6</div>
                    <div id="R5U">5</div>
                    <div id="R4U">4</div>
                    <div id="R3U">3</div>
                    <div id="R2U">2</div>
                    <div id="R1U">1</div>
                    <div></div>
                    <div id="L1U">1</div>
                    <div id="L2U">2</div>
                    <div id="L3U">3</div>
                    <div id="L4U">4</div>
                    <div id="L5U">5</div>
                    <div id="L6U">6</div>
                    <div id="L7U">7</div>
                    <div id="L8U">8</div>
                    <div class="no-bottom" id="R8D" style="border-left:1px solid black;">8</div>
                    <div class="no-bottom" id="R7D">7</div>
                    <div class="no-bottom" id="R6D">6</div>
                    <div class="no-bottom" id="R5D">5</div>
                    <div class="no-bottom" id="R4D">4</div>
                    <div class="no-bottom" id="R3D">3</div>
                    <div class="no-bottom" id="R2D">2</div>
                    <div class="no-bottom" id="R1D">1</div>
                    <div class="no-bottom"></div>
                    <div class="no-bottom" id="L1D">1</div>
                    <div class="no-bottom" id="L2D">2</div>
                    <div class="no-bottom" id="L3D">3</div>
                    <div class="no-bottom" id="L4D">4</div>
                    <div class="no-bottom" id="L5D">5</div>
                    <div class="no-bottom" id="L6D">6</div>
                    <div class="no-bottom" id="L7D">7</div>
                    <div class="no-bottom" id="L8D">8</div>
                  </main>
                </div>
              </div>
              <div
                style="transform:translateX(-1px);"
                class="big-seal"
                :style="showAllDetails ? 'border:1px solid black; border-right:none !important;':'border:1px solid #BFBFBF;border-right:none !important;'"
              >
                <img :src="sealThree" v-if="sealThree" />
              </div>
            </section>
          </main>
          <main class="tl-bottom">
            <Final1 :inspects="inspects" v-show="!showAllDetails"></Final1>
            <Final2 :inspects="inspects" v-show="!showAllDetails"></Final2>
            <FinalPrint1 :inspects="inspects" v-show="showAllDetails"></FinalPrint1>
            <FinalPrint2 :inspects="inspects" v-show="showAllDetails"></FinalPrint2>
          </main>
        </div>
        <div class="top-right">
          <Final3
            v-show="!showAllDetails"
            v-if2="ChiefSeal"
            :inspects="inspects"
            :GeneralComments="GeneralComments"
            :JudgementAdvice="JudgementAdvice"
            :ChiefSeal="ChiefSeal"
          ></Final3>
          <FinalPrint3
            v-show="showAllDetails"
            :inspects="inspects"
            :GeneralComments="GeneralComments"
            :JudgementAdvice="JudgementAdvice"
            :ChiefSeal="ChiefSeal"
          ></FinalPrint3>
        </div>
      </main>
      <div v-if="showAllDetails" style="height:7rem;"></div>
      <main v-show="nextPage || showAllDetails">
        <FinalNote
          v-show="!showAllDetails"
          :GeneralComments="GeneralComments"
          :JudgementAdvice="JudgementAdvice"
        ></FinalNote>
        <FinalPrintNote
          v-show="showAllDetails"
          :GeneralComments="GeneralComments"
          :JudgementAdvice="JudgementAdvice"
        ></FinalPrintNote>
      </main>
      <footer
        class="next-btn hide-while-print"
        id="dtc-next-btn"
        @click="nextPage = true"
        v-if="!nextPage"
      >下一頁</footer>
      <footer
        class="next-btn hide-while-print"
        id="dtc-next-btn2"
        @click="nextPage = false"
        v-if="nextPage"
      >上一頁</footer>
    </span>
  </section>
</template>
<script>
import { store, actions } from "@/store/global.js";
import Final1 from "./Final33-1.vue";
import Final2 from "./Final33-2.vue";
import FinalPrint1 from "./FinalPrint33-1.vue";
import FinalPrint2 from "./FinalPrint33-2.vue";
import Final3 from "./Final38.vue";
import FinalPrint3 from "./FinalPrint38.vue";
import FinalNote from "./FinalNotes";
import FinalPrintNote from "./FinalPrintNotes";
import DoctorComments from "./DoctorComments.vue";
import MilitaryComments from "./MilitaryComments.vue";
let s1, s2, s3, s4, s5;

export default {
  data() {
    return {
      nextPage: false,
      buttonType: "success",
      item: store.editItem,
      inspects: [],
      hospitals: [],
      inspectItem: 1,
      masterRole: true,
      showAllDetails: false,
      base64: store.base64Img,
      s1,
      s2,
      s3,
      s4,
      s5,
      inspects: [],
      sealOne: '',
      sealTwo:'',
      sealThree:'',
      GeneralComments:'',
      JudgementAdvice:'',
      ChiefSeal:'',
      commentBtn:false,
      commentMilitary:false,
      examresult:[],
      PersonInfo:[],
    };
  },
  components: {
    Final1,
    Final2,
    Final3,
    FinalNote,
    FinalPrint1,
    FinalPrint2,
    FinalPrint3,
    FinalPrintNote,
    DoctorComments,
    MilitaryComments,

  },
  props:["fromService"],
  methods: {
     clickF1(str) {
      //this.maps.set(str, 1);
      const el = document.querySelector("#" + str);
      //this.removeClass(el);
      el.classList.add("canFix");
    },
    clickF2(str) {
      //this.maps.set(str, 2);
      const el = document.querySelector("#" + str);
      //this.removeClass(el);
      el.classList.add("canNotFix");
    },
    clickF3(str) {
      //this.maps.set(str, 3);
      const el = document.querySelector("#" + str);
      //this.removeClass(el);
      el.classList.add("canX");
    },
    clickF4(str) {
      //this.maps.set(str, 4);
      const el = document.querySelector("#" + str);
      //this.removeClass(el);
      el.classList.add("canXX");
    },
    initUi() {
      const items = this.inspects.filter(s => s.Serial == 6 && s.SubSerial);
      if (items && items.length) {
        items.forEach((s, i) => {
          s.Value = Number(s.Value);
          switch (s.Value) {
            case 1:
              this.clickF1(s.SubSerial);
              break;
            case 2:
              this.clickF2(s.SubSerial);
              break;
            case 3:
              this.clickF3(s.SubSerial);
              break;
            case 4:
              this.clickF4(s.SubSerial);
              break;
          }
        });
      }
    },
    normalize() {
      store.editItem.Birthday = store.editItem.Birthday ? store.editItem.Birthday.split("T")[0] : "";
      store.editItem.PreActionFinish = store.editItem.PreActionFinish ? "是" : "否";
      //ExamDate
      store.editItem.ExamDate = store.editItem.ExamDate && store.editItem.ExamDate.split("T")[0] == "0001-01-01" ? "暫無資料" : store.editItem.ExamDate.split("T")[0];
      //InstitutionId
      const obj = this.hospitals.find((s) => s.value == store.editItem.InstitutionId);
      if (obj) {
        store.editItem.InstitutionId = obj.text;
      }
      this.item = { ...store.editItem };
    },
    async getDDL() {
      try {
        const { Items } = await actions.getHospitalList();
        this.hospitals = Items.map((s) => ({
          value: s.Id,
          text: s.Name,
        }));
      } catch (e) {
        alert(e);
      }
    },
    async getData() {
      //get previous exam saved result
      store.savedExam = await axios.get('military/AllExamines?militaryId=' + store.editItem.Id);//actions.getExamResults(store.editItem.Id);
      store.savedExam.forEach(e => {
        if(e.Note){
        this.examresult.push(e)
        }
        
      });
      if (!store.savedExam) {
        store.savedExam = [];
      }
      this.inspects = [...store.savedExam];
    },
    findBasicInfo() {
      let item;
      //1. find height
      item = this.item.BasicExamines.find((s) => s.Serial == 1);
      //alert(JSON.stringify(item.Examines[0].Value + "cm"));
      item ? (this.s1 = item.Examines[0].Value) : (this.s1 = "");
      //2.find weight
      item = this.item.BasicExamines.find((s) => s.Serial == 2);
      item ? (this.s2 = item.Examines[0].Value) : (this.s2 = "");
      //3.find bmi
      item = this.item.BasicExamines.find((s) => s.Serial == 3);
      item ? (this.s3 = (+item.Examines[0].Value).toFixed(2)) : (this.s3 = "");

      //4.find plus
      item = this.item.BasicExamines.find((s) => s.Serial == 5);
      item ? (this.s5 = item.Examines[0].Value) : (this.s5 = "");

      //5. find bloood presure
      item = this.item.BasicExamines.find((s) => s.Serial == 4);
      let str = "";
      item.Examines.forEach((s, idx) => {
        str += `(${idx + 1})${s.Value} `;
      });
      this.s4 = str;
      if (item.Examines.length == 1) {
        this.s4 = item.Examines[0].Value;
      }
    },
    async getImg() {
      const img = await actions.getImg(this.item.IdNo);
      if (img) {
        sessionStorage.base64Img = img;
        store.base64Img = img;
        this.base64 = img;
      } else {
        sessionStorage.base64Img = "";
        store.base64Img = "";
      }
    },
    printPage() {
      this.showAllDetails = true;
      this.$root.$emit("print-final-report");
      setTimeout(() => (this.showAllDetails = false), 1000);
    },
    closeDlg() {
      this.nextPage = false;
      setTimeout(() => this.$root.$emit("close-final-result"), 0);
    },
    pushDoctorbtn(){
      this.commentBtn = !this.commentBtn;
      this.commentMilitary = false;
    },
    pushMilitarybtn(){
      this.commentMilitary = true;
      this.commentBtn = false;
    },
    rollbackPage(){
      this.commentMilitary = false;
      this.commentBtn = false;
    },
    async viewComplete(item) {
      let obj = {
        MilitaryIdNo: item,
      };
      try {
       await actions.examComplete(obj);
       requestAnimationFrame(() => this.$bvToast.toast(`檢核完成`, {
          title: "檢查狀態",
          autoHideDelay: 5000,
          variant: "success"
        }));
        store.editItem = { ...store.editItem };        
        this.closeDlg();
      } catch (e) {
        this.$bvToast.toast(`` + e, {
          title: "檢核失敗",
          autoHideDelay: 5000,
          variant: "danger",
        });
      }
    },
  },
  async mounted() {    
    try {
      await this.getData();
      await this.getDDL();
      this.normalize();
      await this.getImg();
      await this.findBasicInfo();
      this.sealOne = this.inspects.find((s) => s.Serial == 1).Seal;
      this.sealTwo = this.inspects.find((s) => s.Serial == 5).Seal;
      this.sealThree = this.inspects.find((s) => s.Serial == 6).Seal;
      this.initUi();
      const obj = await axios.get('military/Find?militaryIdNo=' + this.item.IdNo);
      this.PersonInfo = obj;
      this.GeneralComments = obj.ChiefGeneralComments + " , " + obj.GeneralComments;
      this.JudgementAdvice = obj.ChiefJudgementAdvice   + " , " +  obj.JudgementAdvice;
      this.ChiefSeal = obj.ChiefSeal;
    } catch (e) {
      console.log("" + e);
    }
    this.$root.$on('click-final-esc', () => {
      this.$mousetrap.bind("esc", () => {
        this.commentBtn = false;
        this.commentMilitary = false;
      });
    });
    this.$mousetrap.bind("f7", () => this.commentBtn = true);
    this.$mousetrap.bind("f8", () => this.viewComplete(this.item.IdNo));
    this.$mousetrap.bind("f9", () => this.printPage());
  }

};
</script>
<style lang="scss" scoped>
.tl-bottom {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.details {
  margin: 0 auto;
  background: white;
  max-width: 1440px;
}
.top-title {
  height: 55px;
  background: #1f7cd3;
  text-align: center;
  color: white;
  font-size: 24px;
  line-height: 55px;
  position: relative;
  .top-title-word {
    position: absolute;
    right: 47%;
  }
  .backbtn {
    position: absolute;
    top: 14px;
    right: 27px;
  }
}
.main-body {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  height: auto;
  background: white;
}
.many-info {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1rem;
  font-size: 14px;
}
.TL-ALL-FLEX {
  display: flex;
  flex-direction: column;
  .tl-upper430 {
    height: 400px;
    display: grid;
    grid-template-columns: 25px 1fr 160px;
    grid-template-rows: 160px 76px 1fr;
    color: black;
    //border: 1px solid red;
  }
  .tl-bottom {
    flex: 1;
    //border: 1px solid red;
  }
  .long-header {
    text-align: center;
  }
  .upper430-sec {
    display: grid;
    grid-template-columns: 1fr 158px;
    grid-template-rows: repeat(2, 40px) 83px;
    > div {
      border: 1px solid #bfbfbf;
    }
  }
  .upper2 {
    h6 {
      font-size: 14px;
    }
    > div {
      flex: 1;
      padding: 4px;
    }
    > div:first-child {
      border-bottom: 1px solid #bfbfbf;
      max-height: 55px;
    }
  }
}
.basic-info {
  display: grid;
  grid-template-columns: 40px 1fr;
  header {
    background: #1661a7;
    font-size: 16px;
    color: white;
    height: 166px;
    text-align: center;
    //writing-mode: vertical-lr;
  }
  .nav-1 {
    display: flex;
    flex-direction: column;
    > div {
      height: 120px;
      border-bottom: #ccc;
    }
    > div:first-child {
      height: 50px;
    }
  }
}
.info1,
.info2 {
  display: grid;
  grid-template-columns: repeat(4, max-content);
  grid-gap: 2rem;
  padding: 8px;
  font-size: 14px;
}

.info45 {
  display: grid;
  grid-template-columns: repeat(3, max-content);
  font-size: 14px;
  padding: 8px;
  > div:nth-child(2) {
    margin-top: 3px;
    margin-left: 2px;
  }
  > div:nth-child(3) {
    margin-left: 1rem;
  }
}
.input-area {
  width: max-content;
  position: relative;
  display: grid;
  grid-template-columns: repeat(17, 25px);
  > div {
    border-right: 1px solid black;
    border-bottom: 1px solid black;
    text-align: center;
    cursor: pointer;
    position: relative;
  }
  &::before,
  &::after {
    color: black;
    content: "右";
    position: absolute;
    left: -20px;
    top: 50%;
    font-size: 14px;
    transform: translateY(-50%);
  }
  &::after {
    content: "左";
    left: auto;
    right: -20px;
    top: 50%;
  }
}
.close-dlg {
  float: right;
  color: var(--light);
  font-size: 24px;
  cursor: pointer;
  margin-top: 0px;
  margin-right: 10px;
}
.next-btn {
  color: black;
  height: 39px;
  line-height: 39px;
  text-align: center;
  font-size: 18px;
  cursor: pointer;
  background: #dbdbdb;
}

/deep/ .btn-success {
  background: #f0f0f0 !important;
  border-color: #f0f0f0 !important;
  color: #454545 !important;
}
.big-seal,
.small-seal {
  position: relative;
  img {
    display: block;
    width: 140px;
    height: 40px;
    margin-top: 4px;
    object-fit: scale-down;
  }
}
.small-seal {
  img {
    height: 25px;
    width: 100%;
  }
}

.input-area > div.canFix::after,
.input-area > div.canNotFix::after,
.input-area > div.canXX::after,
.input-area > div.canX::after {
  position: absolute;
  content: "O";
  color: var(--success);
  font-size: 30px;
  top: -9px;
  left: 50%;
  transform: translateX(-50%);
}
.input-area > div.canNotFix::after {
  content: "/";
  color: var(--primary);
  font-size: 27px;
  font-weight: bold;
}
.input-area > div.canX::after {
  content: "X";
  color: var(--danger);
  font-size: 27px;
}

.input-area > div.canXX::after {
  content: "XX";
  color: var(--info);
  font-size: 19px;
  left: 25%;
  top: 1px;
  transform: translateX(-25%);
}
</style>
