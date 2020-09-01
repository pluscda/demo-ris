<template>
  <b-modal
    v-model="show"
    @shown="updateItem"
    title="新增帳號(所有欄位皆必填)"
    id="add-account-dtx"
    :header-bg-variant="variants[0]"
    :header-text-variant="variants[1]"
    :footer-bg-variant="variants[2]"
    :footer-text-variant="variants[2]"
    size="lg"
  >
    <b-container fluid>
      <main class="main-grid-dtc">
        <b-input-group prepend="醫院名稱" v-if="isAdmin">
          <b-select :options="hospitals.slice(1,100)" v-model="item.InstitutionId"></b-select>
        </b-input-group>
        <b-input-group prepend="帳號名稱">
          <b-input v-model.trim="item.No"></b-input>
        </b-input-group>
        <b-input-group prepend="帳號姓名">
          <b-input v-model="item.Name"></b-input>
        </b-input-group>
        <b-input-group prepend="帳號狀態">
          <b-select :options="accountStatus.slice(1,200)" v-model="item.Status"></b-select>
        </b-input-group>
        <b-input-group prepend="有效日期">
          <b-input v-model="myDate" type="date"></b-input>
        </b-input-group>
        <b-input-group prepend="郵件信箱">
          <b-input v-model.trim="item.Email"></b-input>
        </b-input-group>
        <b-input-group prepend="授權角色">
          <b-form-checkbox-group switches v-model="myRoles" size="lg" class="pl-3" :options="roles"></b-form-checkbox-group>
        </b-input-group>
      </main>
    </b-container>
    <template v-slot:modal-footer>
      <div class="w-100">
        <b-button
          variant="info"
          class="float-right ml-4"
          @click="$bvModal.hide('add-account-dtx')"
        >取消</b-button>
        <b-button variant="success" class="float-right" @click="addAccount" :disabled="!fillAll">確定</b-button>
      </div>
    </template>
  </b-modal>
</template>

<script>
import { store, actions } from "@/store/global.js";
let types = new Array(15).fill().map((s, i) => "Dummy " + (1 + i));
export default {
  name: "EditACcount",
  data() {
    return {
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
      item: {},
      // cat: types[0],
      // status: types[0],
      myRoles: [],
      myDate: "",
      isAdmin: isNaN(sessionStorage.InstitutionId)
    };
  },
  props: ["roles", "accountStatus", "hospitals"],
  computed: {
    fillAll() {
      const all =
        this.item.No &&
        this.item.Name &&
        this.myDate &&
        this.item.Email &&
        this.myRoles.length;
      return all;
    }
  },
  methods: {
    updateItem() {
      this.myRoles = [];
      this.myDate = "";
      this.item = {
        InstitutionId: this.hospitals[1].value,
        Status: this.accountStatus[2].value
      };
    },
    async addAccount() {
      try {
        this.item.Expiration = new Date(this.myDate).toISOString();
        this.item.RoleNos = this.myRoles;
        delete this.item.RoleNames;
        await actions.addNewAccount(this.item);
        this.$bvToast.toast(`新增帳號成功`, {
          title: "系統資訊",
          autoHideDelay: 5000,
          variant: "success"
        });
        store.accountUpdated = true;
        this.$bvModal.hide("add-account-dtx");
      } catch (e) {
        this.$bvToast.toast(`` + e, {
          title: "系統資訊",
          autoHideDelay: 5000,
          variant: "danger"
        });
      }
    }
  },
  mounted() {
    //if (store.editItem) this.item = store.editItem;
  }
};
</script>

<style lang="scss" scoped>
p {
  font-size: 2em;
  text-align: center;
}
.main-grid-dtc {
  display: flex;
  flex-direction: column;
  > div {
    margin-bottom: 10px;
  }
}
</style>

