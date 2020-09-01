<template>
  <div>
    <header class="header-row">
      <div>聽力</div>
      <b-check switch size="lg" v-model="pass" value="1" class="mt-1">正常</b-check>
      <b-check switch size="lg" v-model="pass" value="2" class="mt-1">異常</b-check>
      <b-check switch size="lg" v-model="pass" value="3" class="mt-1">專檢</b-check>
      <b-button variant="primary" size="sm" @click="save" :disabled="notFill">儲存</b-button>
    </header>
    <section class="my-item">
      <main class="input-area">
        <div style="margin-top:6px;margin-right:10px;">語音:</div>
        <b-input-group prepend="左耳" style="max-width:190px; max-height:40px;" append="/20">
          <b-input placeholder="請輸入" v-model="vl"></b-input>
        </b-input-group>
        <b-input-group
          prepend="右耳"
          style="max-width:190px;max-height:40px;margin-left:10px;"
          append="/20"
        >
          <b-input placeholder="請輸入" v-model="vr"></b-input>
        </b-input-group>
        <div style="margin-top:6px;margin-right:10px;margin-left:3rem">金屬音:</div>
        <b-input-group prepend="左耳" style="max-width:190px; max-height:40px;" append="/20">
          <b-input placeholder="請輸入" v-model="ml"></b-input>
        </b-input-group>
        <b-input-group
          prepend="右耳"
          style="max-width:190px;max-height:40px;margin-left:10px;"
          append="/20"
        >
          <b-input placeholder="請輸入" v-model="mr"></b-input>
        </b-input-group>
      </main>

      <div class="main-area">
        <div>
          <header class="my-note1">臨時記載</header>
          <b-textarea placeholder="請輸入" spellcheck="false" v-model="item.GeneralComments"></b-textarea>
        </div>
        <div>
          <header class="my-note2">各項缺點之總評(包括儀表缺失)</header>
          <b-textarea placeholder="請輸入" spellcheck="false" v-model="item.JudgementAdvice"></b-textarea>
        </div>
        <div>
          <header class="my-note3">註記</header>
          <b-textarea placeholder="請輸入" spellcheck="false" v-model="item.Note"></b-textarea>
        </div>
      </div>
    </section>
  </div>
</template>
<style lang="scss" scoped>
.main-area {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  textarea {
    min-height: calc(100vh - 480px);
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
</style>
<script>
import { store, actions } from "@/store/global.js";
export default {
  data() {
    return {
      pass: 1,
      item: {},
      ml: "",
      mr: "",
      vl: "",
      vr: ""
    };
  },
  computed: {
    notFill() {
      return !this.ml || !this.mr || !this.vl || !this.vr;
    }
  },
  methods: {
    normorlize() {
      const obj = {
        Serial: 25,
        Note: this.item.Note,
        JudgementAdvice: this.item.JudgementAdvice,
        GeneralComments: this.item.GeneralComments,
        Signature: "",
        Judge: +this.pass
      };
      //alert(this.pass);
      const arr = [
        { ...obj, SubSerial: "ML", Value: +this.ml },
        { ...obj, SubSerial: "MR", Value: +this.mr },
        { ...obj, SubSerial: "VL", Value: +this.vl },
        { ...obj, SubSerial: "VR", Value: +this.vr }
        //{ ...obj, SubSerial: "", Value: +this.vr }
      ];
      return arr;
    },
    async save() {
      const arr = this.normorlize();
      const obj = {
        MilitaryId: store.editItem.Id,
        Examines: [...arr]
      };
      try {
        const ret = await actions.updateExamInfos(obj);
        if(ret == "errors") return;
        this.$bvToast.toast(`儲存成功`, {
          title: "檢查狀態",
          autoHideDelay: 5000,
          variant: "success"
        });
        store.editItem = { ...store.editItem };
      } catch (e) {
        alert(e);
      }
    }
  },
  mounted() {
    const items = store.savedExam.filter(s => s.Serial == 25 && s.SubSerial);
    const item = store.savedExam.find(s => s.Serial == 25);
    if (items && items.length) {
      items.forEach((s, i) => {
        switch (s.SubSerial) {
          case "ML":
            this.ml = s.Value;
            break;
          case "MR":
            this.mr = s.Value;
            break;
          case "VL":
            this.vl = s.Value;
            break;
          case "VR":
            this.vr = s.Value;
            break;
        }
      });
      this.item = items[0];
      this.pass = items[0].Judge;
    } else if (item) {
      this.item = item;
      this.pass = this.item.Judge;
    }
    this.$mousetrap.bind("f2", this.save);
  }
};
</script>
<style lang="scss" scoped>
.my-item {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 480px);
  position: relative;
}
.input-area {
  border: 1px solid white;
  height: 60px;
  display: grid;
  grid-template-columns: repeat(2, max-content 190px 190px);
  background: #ccc;
  color: black;
  padding: 10px;
}

.header-row {
  height: 40px;
  font-size: 20px;
  background: #cbcbcb;
  color: black;
  border-radius: 5px;
  padding-left: 10px;
  display: grid;
  grid-template-columns: repeat(34, max-content);
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
/deep/ .input-group-append .input-group-text {
  background: white !important;
  border-left: 0px;
}
</style>
