<template>
  <section class="details-note hide-while-print">
    <b-form-textarea id="textarea" v-model="PersonInfo.Note" placeholder="請輸入備註" rows="22"></b-form-textarea>
    <div>
      <b-alert
        :show="dismissCountDown"
        dismissible
        fade
        variant="success"
        @dismiss-count-down="countDownChanged"
      >儲 存 成 功</b-alert>
    </div>
    <footer>
      <b-button size="sm" variant="primary" class="saveBtn" @click="saveMilitary">儲 存(F4)</b-button>
    </footer>
  </section>
</template>
<script> 
import { store, actions } from "@/store/global.js";
export default {
  data() {
    return {
      dismissSecs: 2,
      dismissCountDown: 0,
      showDismissibleAlert: false
    };
  },
  props: ["PersonInfo"],
  components: {},
  methods: {
      async saveMilitary() {
      const obj = {
        MilitaryIdNo: this.PersonInfo.IdNo,
        Note: this.PersonInfo.Note,
      };
      try {
        await actions.updateSetExamNote(obj);
        this.dismissCountDown = this.dismissSecs;
      } catch (e) {
        this.$bvToast.toast(`備註更新失敗 ` + e, {
          title: "兵役局備註",
          autoHideDelay: 5000,
          variant: "danger",
        });
      }
    },
    countDownChanged(dismissCountDown) {
        this.dismissCountDown = dismissCountDown
      },

  },
  async mounted() {
    console.log("this.PersonInfo",this.PersonInfo);  
    this.$root.$emit("click-final-esc"); 
  },
};
</script>
<style lang="scss" scoped>
.details-note {
  display: grid;
  grid-template-rows: 85.5% 5.5% 8.6%;
  width: 80vw;
  min-height: 891.914px;
  max-width: 1440px;
  color: black !important;
  font-size: 15px;
  overflow-y: auto;
  .doctor {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
  }
}

.my-dark {
  > div {
    background: var(--gray);
    color: white;
  }
}
.main-dtc-body {
  &:hover {
    background-color: rgba(0, 0, 0, 0.075);
  }
  > div {
    line-height: 24px;
  }
}
footer {
  // height: 55px;
  text-align: center;
  background: #f2f2f2;
  .saveBtn {
    padding: 7px;
    margin-top: 22px;
  }
}
.alert-success {
  text-align: center;
  padding-left: 65px;
}
.form-control {
  border: 0px;
}
</style>
