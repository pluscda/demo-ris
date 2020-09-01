<template>
  <div class="basic">
    <section class="dtx-img">
      <img height="220px" width="198px" :src="require('@/assets/images/PhyExam/Head.jpg')" v-show="!base64Img" />
      <img height="220px" :src="base64Img" v-if="base64Img && distinctRole" class="my-img" />
      <img height="255px" :src="base64Img" v-if="base64Img && !distinctRole" class="my-img" />

      <b-button v-if="distinctRole" variant="primary" size="sm" style="margin-top:0 px;" v-b-toggle.sidebar-right @click="openCamera">擷取LIVE相片</b-button>
    </section>

    <div class="grid">
      <h5 class="b-data">基本資料</h5>
      <InputGroup :label="label[0]">
        <b-input v-model="item.ExamDate" readonly></b-input>
      </InputGroup>

      <InputGroup :label="myStr[2]">
        <b-input v-model="item.Name" readonly></b-input>
      </InputGroup>
      <InputGroup :label="label[3]">
        <b-input v-model="item.IdNo" readonly></b-input>
      </InputGroup>
      <InputGroup :label="label[1]">
        <b-input v-model="item.InstitutionId" readonly></b-input>
      </InputGroup>
      <InputGroup :label="label[4]">
        <b-input v-model="item.Birthday" readonly></b-input>
      </InputGroup>
      <InputGroup :label="label[5]">
        <b-input v-model="item.ContactPhone" readonly></b-input>
      </InputGroup>
      <InputGroup :label="label[6]">
        <b-input v-model="item.MobilePhone" readonly></b-input>
      </InputGroup>
      <InputGroup :label="myStr[1]">
        <b-input v-model="item.JudgementAdvice" readonly></b-input>
      </InputGroup>
      <InputGroup :label="myStr[0]">
        <b-input v-model="item.PreActionFinish" readonly></b-input>
      </InputGroup>
      <InputGroup class="address" :label="label[9]" :wth100="true">
        <b-input v-model="item.Address" readonly></b-input>
      </InputGroup>
      <h5 class="history">役男病史</h5>
      <textarea readonly spellcheck="false" v-model="item.MedicalHistory"></textarea>
      <div class="dtc-txt-info">
        <div class="left">
          <div>身高</div>
          <div class="sep-dtc"></div>
          <div v-text="s1"></div>
          <div>體重</div>
          <div class="sep-dtc"></div>
          <div v-text="s2"></div>
        </div>
        <div class="center">
          <div>BMI</div>
          <div class="sep-dtc"></div>
          <div v-html="s3"></div>
          <div>脈搏</div>
          <div class="sep-dtc"></div>
          <div v-html="s5"></div>
        </div>
        <div class="right" v-html="s4"></div>
      </div>
    </div>
  </div>
</template>
<script>
//次/分
//getInfoById
import { store, actions } from "@/store/global.js";
import InputGroup from "@/components/BSComps/InputGroup.vue";
const basicLabel = ["檢查日期", "檢查醫院", "姓名", "身分證號", "出生日期", "聯絡電話", "行動電話", "本人電話", "家屬(父母)", "戶籍地址"];
export default {
  components: { InputGroup },
  data() {
    return {
      s1: "",
      s2: "",
      s3: "",
      s4: "",
      s5: "",
      myStr: ["報到完成", "判定體位", "役男姓名"],
      label: basicLabel,
      distinctRole: sessionStorage.role == "DistrictOffice" ? true : false,
      item: {},
      judges: store.judges,
      hospitals: [],
      masterRole: sessionStorage.role == "HospitalMasterDoctor" ? true : false,
      formHistory: "",
    };
  },
  computed: {
    base64Img() {
      store.base64Img = sessionStorage.base64Img;
      return store.base64Img;
    },
    infoUpdate() {
      return store.editItem;
    },
  },
  async created() {},
  async mounted() {
    sessionStorage.base64Img = "";
    let vlfObj = await this.$vlf.getItem("detailsItem");
    if (!store.base64Img && vlfObj) {
      store.editItem = vlfObj;
    }
    try {
      await this.getDDL();
      this.normalize();
      await this.getImg();
      this.findBasicInfo();
    } catch (e) {
      console.log("" + e);
    }

    //setTimeout(() => this.getImg, 500);
  },
  methods: {
    normalize() {
      store.editItem.Birthday = store.editItem.Birthday ? store.editItem.Birthday.split("T")[0] : "";
      store.editItem.PreActionFinish = store.editItem.PreActionFinish ? "是" : "否";
      //ExamDate
      store.editItem.ExamDate = store.editItem.ExamDate && store.editItem.ExamDate.split("T")[0] == "0001-01-01" ? "暫無資料" : store.editItem.ExamDate.split("T")[0];
      //InstitutionId
      store.editItem.InstitutionId = this.hospitals.find((s) => s.value == store.editItem.InstitutionId).text;
      this.item = { ...store.editItem };
    },
    findBasicInfo() {
      let item;

      //1. find height
      item = this.item.BasicExamines.find((s) => s.Serial == 1);
      //alert(JSON.stringify(item.Examines[0].Value + "cm"));
      item ? (this.s1 = item.Examines[0].Value + "cm") : (this.s1 = "");
      //2.find weight
      item = this.item.BasicExamines.find((s) => s.Serial == 2);
      item ? (this.s2 = item.Examines[0].Value + "kg") : (this.s2 = "");
      //3.find bmi
      item = this.item.BasicExamines.find((s) => s.Serial == 3);
      item ? (this.s3 = (+item.Examines[0].Value).toFixed(2) + " kg/m2") : (this.s3 = "");
      //4. find bloood presure
      item = this.item.BasicExamines.find((s) => s.Serial == 4);
      const prefix = `<div>血壓</div>
          <div class="sep-dtc"></div>`;

      const prefix2 = `
           <div style="font-size:15px;">(mmHg)</div>
          <div class="sep-dtc"></div>`;

      const html = `
          <div>{%0}</div>
          <div class="small-text">
            <img src="clock.png" class="small-dtc-clock" width="14" height="14"/>{%1}
          </div>`;
      let str = "";
      if (item) {
        item.Examines.forEach((s, idx) => {
          const time = s.ActionTime ? s.ActionTime : "";
          if (idx == 3) {
            str += prefix2;
          }
          str += html.replace("{%0}", s.Value).replace("{%1}", time);
        });
        this.s4 = prefix + str;
      } else {
        this.s4 = prefix;
      }
      //5.find last
      item = this.item.BasicExamines.find((s) => s.Serial == 5);
      item ? (this.s5 = item.Examines[0].Value + "次/分") : (this.s5 = "");
    },
    openCamera() {
      store.openCamera = this.item.IdNo;
    },
    async getImg() {
      //alert('img');
      const img = await actions.getImg(this.item.IdNo);
      if (img) {
        sessionStorage.base64Img = img;
        store.base64Img = img;
      } else {
        sessionStorage.base64Img = "";
        store.base64Img = "";
      }
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
  },
  watch: {
    async infoUpdate(v) {
      this.item = {
        ...(await actions.getInfoById(this.item.IdNo)),
      };
      Object.keys(this.item).forEach((s) => {
        store.editItem[s] = this.item[s];
      });
      this.normalize();
      this.findBasicInfo();
    },
  },
};
</script>
<style lang="scss" scoped>
.basic {
  display: flex;
  img {
    padding-left: 5px;
    padding-top: 5px;
  }
}
textarea {
  resize: none;
  overflow: auto;
}
.grid {
  width: 100%;
  display: grid;
  grid-gap: 10px;
  padding: 10px;
  grid-template-columns: 30px repeat(4, auto);
  grid-template-rows: repeat(4, auto);
  .b-data {
    grid-row: 1 / 4;
    border: 1px solid #ddd;
    writing-mode: vertical-rl;
    padding-top: 20px;
    margin-right: 4px;
  }
  .address {
    grid-column: 3 / 6;
  }
  .history {
    grid-column: 1 / 2;
    grid-row: 4 / 5;
    padding: 10px 0px;
    border: 1px solid #ddd;
    writing-mode: vertical-rl;
    margin-right: 4px;
  }
  textarea {
    grid-column: 2 / 5;
    border-radius: 5px;
  }
  .dtc-txt-info {
    grid-column: 5/ -1;
    background: #e9ecef 0% 0% no-repeat padding-box;
    border-radius: 5px;
    color: #3b3b3b;
    font-size: 17px;
    display: grid;
    grid-template-columns: 120px 140px 1fr;
    grid-gap: 9px;
    padding: 7px;
    justify-content: space-around;
    .left,
    .center {
      display: grid;
      grid-template-columns: max-content 7px max-content;
    }
    .right {
      display: grid;
      grid-template-columns: max-content 7px repeat(6, max-content);
      grid-template-rows: repeat(3, 1fr);
      grid-gap: 3px;
      justify-content: center;
      img {
        display: inline-block;
        width: 14px;
        height: 14px;
        transform: translate(-2px, -3px);
      }
      .small-text {
        font-size: 12px !important;
        padding-top: 5px;
      }
    }
    .sep-dtc {
      height: 18px;
      width: 2px;
      background: #ced4da;
      margin-top: 5px;
      margin-left: 2px;
      margin-right: 0px;
    }
  }
}

.dtx-img {
  display: grid;
  grid-template-columns: 1fr;
  padding: 3px;
}
.my-img {
  object-fit: cover;
}
</style>

<style lang="scss">
.right {
  display: grid;
  grid-template-columns: max-content 7px repeat(6, max-content);
  grid-template-rows: repeat(3, 1fr);
  grid-gap: 3px;
  justify-content: center;
  .small-dtc-clock {
    display: inline-block;
    width: 14px;
    height: 14px;
    transform: scale(0.7) translate(2px, -2px);
  }
  .small-text {
    font-size: 12px !important;
    padding-top: 5px;
    transform: translateX(-5px);
  }
}
.sep-dtc {
  height: 18px;
  width: 2px;
  background: #ced4da;
  margin-top: 5px;
  margin-left: 2px;
  margin-right: 0px;
}
</style>
