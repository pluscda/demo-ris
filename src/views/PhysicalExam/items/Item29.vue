<template>
  <div>
    <header class="header-row">
      <div>視力</div>
      <b-check switch size="lg" v-model="pass" value="1" class="mt-1">正常</b-check>
      <b-check switch size="lg" v-model="pass" value="2" class="mt-1">異常</b-check>
      <b-check switch size="lg" v-model="pass" value="3" class="mt-1">專檢</b-check>
      <b-button variant="primary" size="sm" @click="save">儲存 (F2)</b-button>
    </header>
    <section class="my-item">
      <main class="input-area2">
        <div style="margin-top:6px;margin-right:10px;">裸視:</div>
        <b-input-group prepend="左眼" style="max-width:120px; max-height:40px;">
          <b-input placeholder="請輸入" v-model="UCVAL"></b-input>
        </b-input-group>
        <b-input-group prepend="右眼" style="max-width:120px;max-height:40px;">
          <b-input placeholder="請輸入" v-model="UCVAR"></b-input>
        </b-input-group>
        <div style="margin-top:6px;margin-left:1.5rem;margin-right:5px;">矯正視力:</div>
        <b-input-group prepend="左眼" style="max-width:120px; max-height:40px;">
          <b-input placeholder="請輸入" v-model="CVAL"></b-input>
        </b-input-group>
        <b-input-group prepend="右眼" style="max-width:120px;max-height:40px;">
          <b-input placeholder="請輸入" v-model="CVAR"></b-input>
        </b-input-group>
        <div style="margin-top:6px;margin-left:1.5rem;margin-right:5px;">驗光度數:</div>
        <b-input-group prepend="左眼" style="max-width:160px; max-height:40px;">
          <b-input placeholder="請輸入" v-model="L"></b-input>
        </b-input-group>
        <div></div>
        <b-input-group prepend="右眼" style="max-width:160px;max-height:40px;">
          <b-input placeholder="請輸入" v-model="R"></b-input>
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
    height: calc(100vh - 720px);
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
      CVAL: "",
      CVAR: "",
      UCVAL: "",
      UCVAR: "",
      L: "",
      R: "",
      LDS: "",
      RDS: ""
    };
  },
  computed: {},
  methods: {
    normorlize() {
      const obj = {
        Serial: 29,
        Note: this.item.Note,
        JudgementAdvice: this.item.JudgementAdvice,
        GeneralComments: this.item.GeneralComments,
        Signature: "",
        Judge: +this.pass
      };
      //alert(this.pass);
      const arr = [
        { ...obj, SubSerial: "CVAL", Value: this.CVAL },
        { ...obj, SubSerial: "CVAR", Value: this.CVAR },
        { ...obj, SubSerial: "UCVAL", Value: this.UCVAL },
        { ...obj, SubSerial: "UCVAR", Value: this.UCVAR },
        { ...obj, SubSerial: "L", Value: this.L },
        { ...obj, SubSerial: "R", Value: this.R },
        { ...obj, SubSerial: "LDS", Value: this.L },
        { ...obj, SubSerial: "RDS", Value: this.R }
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
    const items = store.savedExam.filter(s => s.Serial == 29 && s.SubSerial);
    const item = store.savedExam.find(s => s.Serial == 29);
    if (items && items.length) {
      items.forEach((s, i) => {
        switch (s.SubSerial) {
          case "CVAL":
            this.CVAL = s.Value;
            break;
          case "CVAR":
            this.CVAR = s.Value;
            break;
          case "UCVAL":
            this.UCVAL = s.Value;
            break;
          case "UCVAR":
            this.UCVAR = s.Value;
            break;
          case "L":
            this.L = s.Value;
            break;
          case "LDS":
            this.LDS = s.Value;
            break;
          case "R":
            this.R = s.Value;
            break;
          case "RDS":
            this.RDS = s.Value;
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
.input-area2 {
  border: 1px solid white;
  height: 60px;
  display: grid;
  grid-template-columns: repeat(2, max-content 130px 130px) max-content 160px 10px 160px;
  background: #ccc;
  color: black;
  padding: 10px;
}
.main-area {
  min-height: 100%;
  textarea {
    min-height: 100%;
  }
}
.my-note {
  height: 30px;
  font-size: 20px;
  background: var(--info);
  color: white;
  border-radius: 5px;
  padding-left: 10px;
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
.input-group-prepend {
  max-height: 38px;
}
</style>
