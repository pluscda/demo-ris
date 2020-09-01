<template>
  <div>
    <header class="header-row">
      <div>胸部X光</div>
      <b-button variant="primary" size="sm" @click="save">設定為採檢已完成並儲存註記 (F2)</b-button>
    </header>
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
  </div>
</template>
<style lang="scss" scoped>
.main-area {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  textarea {
    height: calc(100vh - 420px);
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
      item: {}
    };
  },
  methods: {
    async save() {
      const obj = {
        MilitaryId: store.editItem.Id,
        Serial: 14,
        JudgementAdvice: this.item.JudgementAdvice,
        GeneralComments: this.item.GeneralComments,
      };
      try {
        await axios.post('military/SetGained',obj);
        this.$bvToast.toast(`採檢完成`, {
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
    const item = store.savedExam.find(s => s.Serial == 14);
    if (item) {
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
  height: calc(100vh - 420px);
  position: relative;
}
.input-area {
  border: 1px solid white;
  height: 40px;
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
</style>
