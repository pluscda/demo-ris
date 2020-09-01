
<template>
  <div>
    <header class="header-row">
      <div>血壓</div>
      <!-- <b-check switch size="lg" v-model="pass" value="1" class="mt-1">正常</b-check>
      <b-check switch size="lg" v-model="pass" value="2" class="mt-1">異常</b-check>-->
      <b-button variant="primary" size="sm" @click="save">儲存 (F2)</b-button>
    </header>
    <section class="my-item">
      <main class="input-area">
        <b-input-group prepend="1.收縮壓/舒張壓">
          <b-input placeholder="請輸入" v-model="items[0].value"></b-input>
        </b-input-group>
        <b-input-group prepend="時間">
          <b-input placeholder="00:00" v-model="items[0].time"></b-input>
        </b-input-group>
        <b-input-group prepend="5.收縮壓/舒張壓">
          <b-input placeholder="請輸入" v-model="items[4].value"></b-input>
        </b-input-group>
        <b-input-group prepend="時間">
          <b-input placeholder="00:00" v-model="items[4].time"></b-input>
        </b-input-group>
        <b-input-group prepend="2.收縮壓/舒張壓">
          <b-input placeholder="請輸入" v-model="items[1].value"></b-input>
        </b-input-group>
        <b-input-group prepend="時間">
          <b-input placeholder="00:00" v-model="items[1].time"></b-input>
        </b-input-group>
        <b-input-group prepend="6.收縮壓/舒張壓">
          <b-input placeholder="請輸入" v-model="items[5].value"></b-input>
        </b-input-group>
        <b-input-group prepend="時間">
          <b-input placeholder="00:00" v-model="items[5].time"></b-input>
        </b-input-group>
        <b-input-group prepend="3.收縮壓/舒張壓">
          <b-input placeholder="請輸入" v-model="items[2].value"></b-input>
        </b-input-group>
        <b-input-group prepend="時間">
          <b-input placeholder="00:00" v-model="items[2].time"></b-input>
        </b-input-group>
        <b-input-group prepend="7.收縮壓/舒張壓">
          <b-input placeholder="請輸入" v-model="items[6].value"></b-input>
        </b-input-group>
        <b-input-group prepend="時間">
          <b-input placeholder="00:00" v-model="items[6].time"></b-input>
        </b-input-group>
        <b-input-group prepend="4.收縮壓/舒張壓">
          <b-input placeholder="請輸入" v-model="items[3].value"></b-input>
        </b-input-group>
        <b-input-group prepend="時間">
          <b-input placeholder="00:00" v-model="items[3].time"></b-input>
        </b-input-group>
        <b-input-group prepend="8.收縮壓/舒張壓">
          <b-input placeholder="請輸入" v-model="items[7].value"></b-input>
        </b-input-group>
        <b-input-group prepend="時間">
          <b-input placeholder="00:00" v-model="items[7].time"></b-input>
        </b-input-group>
      </main>
      <div class="main-area">
        <header class="my-note">註記</header>
        <b-textarea placeholder="請輸入" spellcheck="false" v-model="item.Note"></b-textarea>
      </div>
    </section>
  </div>
</template>
<script>
import { store, actions } from "@/store/global.js";
const items = new Array(8).fill().map(s => ({ value: "", time: "" }));
export default {
  data() {
    return {
      pass: 1,
      items,
      item: {}
    };
  },
  methods: {
    checkValidItems() {
      const arr = [];
      for (let i = 0; i < this.items.length; ++i) {
        !isNaN(this.items[i]) && +this.items[i] > 0
          ? arr.push(+this.items[i])
          : (this.items[i] = "");
        if (!this.items[i]) break;
      }
      this.items = [...arr];
    },
    normalize() {
      const arr = [];
      let counter = 1;
      const obj = {
        MilitaryId: store.editItem.Id,
        Serial: 4,
        SubSerial: "",
        Note: this.item.Note,
        Signature: "",
        Judge: +this.pass
      };

      this.items.forEach((s, i) => {
        obj.Value = s.value;
        obj.ActionTime = s.time;
        obj.Action = counter;
        if (s.value && s.time) {
          ++counter;
          arr.push({ ...obj });
        }
      });
      return arr;
    },
    async save() {
      //this.checkValidItems();
      const arr = this.normalize();
      if (!arr || !arr.length) {
        this.$bvToast.toast(`請輸入血壓值`, {
          title: "檢查狀態",
          autoHideDelay: 5000,
          variant: "danger"
        });
        return;
      }
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
    const items = store.savedExam.filter(s => s.Serial == 4);
    if (items && items.length) {
      items.forEach((s, i) => {
        this.items[i] = { value: s.Value, time: s.ActionTime };
      });
      this.item = items[0];
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
  height: calc(100vh - 580px);
  position: relative;
}
.input-area {
  // border: 1px solid white;
  display: grid;
  grid-template-columns: 1fr 180px 1fr 180px;
  grid-template-rows: repeat(4, 40px);
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
  grid-template-columns: repeat(24, max-content);
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
</style>
