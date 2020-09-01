<template>
  <b-modal
    v-model="show"
    @shown="updateItem"
    title="更改密碼"
    id="dtcPwdChange"
    :header-bg-variant="variants[0]"
    :header-text-variant="variants[1]"
    :footer-bg-variant="variants[2]"
    :footer-text-variant="variants[2]"
    size="lg"
  >
    <b-container fluid>
      <main class="main-grid-dtc">
        <b-input-group prepend="舊密碼" class="mb-2">
          <b-input v-model="pwd1" type="password"></b-input>
        </b-input-group>
        <b-input-group prepend="新密碼" class="mb-2">
          <b-input v-model="pwd2" type="password"></b-input>
        </b-input-group>
        <b-input-group prepend="再次輸入新密碼">
          <b-input v-model="pwd3" type="password"></b-input>
        </b-input-group>
      </main>
    </b-container>
    <template v-slot:modal-footer>
      <div class="w-100">
        <b-button variant="info" class="float-right ml-4" @click="$bvModal.hide('dtcPwdChange')">取消</b-button>
        <b-button variant="success" class="float-right" @click="updatePwd" :disabled="!hasPwds">確定</b-button>
      </div>
    </template>
  </b-modal>
</template>

<script>
//帳號資料. 帳號類別,帳號狀態,授權角色
import { store, actions } from "@/store/global.js";
let types = new Array(15).fill().map((s, i) => "Dummy " + (1 + i));
export default {
  name: "EditACcountPwd",
  data() {
    return {
      pwd1: "",
      pwd2: "",
      pwd3: "",
      variants: [
        "warning",
        "dark",
        "light",
        "warning",
        "danger",
        "info",
        "light",
        "dark"
      ],
      types,
      item: {}
    };
  },
  computed: {
    hasPwds() {
      return this.pwd1 && this.pwd2 && this.pwd3;
    }
  },
  methods: {
    updateItem() {
      this.pwd1 = this.pwd2 = this.pwd3 = "";
    },
    async updatePwd() {
      if (this.pwd2 != this.pwd3) {
        this.$bvToast.toast(`更改密碼失敗,請再次確認新密碼`, {
          title: "系統資訊",
          autoHideDelay: 5000,
          variant: "danger"
        });
        return;
      }
      try {
        await actions.updatePwd(this.pwd1, this.pwd2);
        this.$bvToast.toast(`更改密碼成功`, {
          title: "系統資訊",
          autoHideDelay: 5000,
          variant: "success"
        });
        this.$bvModal.hide("dtcPwdChange");
      } catch (e) {
        alert(e);
      }
    }
  },
  mounted() {
    //if (store.editItem) this.item = store.editItem;
  }
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
</style>