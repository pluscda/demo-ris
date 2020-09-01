<template>
  <b-modal
    @shown="updateItem"
    title="新增黑名單關鍵字"
    id="dtcAddBlacklist"
    :header-bg-variant="variants[0]"
    :header-text-variant="variants[1]"
    :footer-bg-variant="variants[2]"
    :footer-text-variant="variants[2]"
  >
    <b-container fluid>
      <main class="main-grid-dtc">
        <b-input-group prepend="黑名單片語" class="mb-2 w-100">
          <b-input v-model="Code" maxlength="300" placeholder="請輸入"></b-input>
        </b-input-group>
        <b-input-group prepend="啟用" class="mb-2">
          <b-check switch v-model="enable" style="margin-left:12px;margin-top:4.5px" size="lg"></b-check>
        </b-input-group>
      </main>
    </b-container>
    <template v-slot:modal-footer>
      <div class="w-100">
        <b-button
          variant="info"
          class="float-right ml-4"
          @click="$bvModal.hide('dtcAddBlacklist')"
        >取消</b-button>
        <b-button variant="success" class="float-right" @click="addPhrase" :disabled="!Code">確定</b-button>
      </div>
    </template>
  </b-modal>
</template>

<script>
import { store, actions } from "@/store/global.js";
let types = new Array(15).fill().map((s, i) => "Dummy " + (1 + i));
let vueData = {};
vueData.mydate = new Date();
const allowPhraseTypes = sessionStorage.allowPhraseTypes.split(",");

export default {
  name: "AddPhroase",
  data() {
    return {
      inspectsArr: [],
      inputText: "",
      item: {},
      ProcedureSerial: "",
      Text: "",
      Code: "",
      allowPhraseTypes,
      allow: "個人片語",
      username: sessionStorage.name,
      userno: JSON.parse(sessionStorage.store).No,
      enable: true,
      todayyear: new Date().getFullYear(),
      todaymonth: new Date().getMonth() + 1,
      todayday: new Date().getDate(),
      todaytime: "",
      formData: vueData,
      variants: [
        "warning",
        "dark",
        "light",
        "warning",
        "danger",
        "info",
        "light",
        "dark",
      ],
    };
  },
  computed: {},
  methods: {
    async updateItem() {
      this.Code = "";
      this.Text = "";
    },
    async addPhrase() {
      const obj = {
        Id: this.Code,
        Word: this.Code,
        IsActivated: this.enable,
        CreateTime: this.todaytime,
        CreateAccountNo: this.username,
      };

      try {
        await actions.addNewBlackWord(obj);
        this.$bvToast.toast(`新增黑名單成功`, {
          title: "系統資訊",
          autoHideDelay: 5000,
          variant: "success",
        });
        store.editItem = { ...store.editItem };
        this.$bvModal.hide("dtcAddBlacklist");
      } catch (e) {
        this.$bvToast.toast(`` + e, {
          title: "系統資訊",
          autoHideDelay: 5000,
          variant: "danger",
        });
      }
    },
  },
  async mounted() {
    this.todaytime = `${this.todayyear}-${this.todaymonth}-${this.todayday}`;
  },
};
</script>

<style scoped>
p {
  font-size: 2em;
  text-align: center;
}
.input-group-text {
  width: 150px;
  max-width: 150px;
  min-width: 150px;
}
.code-dtc {
  display: grid;
  grid-template-columns: 60px minmax(400px, 525px);
}
</style>
