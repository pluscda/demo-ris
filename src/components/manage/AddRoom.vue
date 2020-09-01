<template>
  <b-modal
    v-model="show"
    @shown="updateItem"
    title="新增診間"
    id="room-added-dtx"
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
        <b-input-group prepend="診間編號">
          <b-input v-model.trim="item.No"></b-input>
        </b-input-group>
        <b-input-group prepend="診間名稱">
          <b-input v-model.trim="item.Name"></b-input>
        </b-input-group>
        <b-input-group prepend="啟用狀態">
          <b-select :options="acts" v-model="act"></b-select>
        </b-input-group>
      </main>
    </b-container>
    <template v-slot:modal-footer>
      <div class="w-100">
        <b-button
          variant="info"
          class="float-right ml-4"
          @click="$bvModal.hide('room-added-dtx')"
        >取消</b-button>
        <b-button variant="success" class="float-right" @click="addRoom" :disabled="!fillAll">確定</b-button>
      </div>
    </template>
  </b-modal>
</template>

<script>
import { store, actions } from "@/store/global.js";
let types = new Array(15).fill().map((s, i) => "Dummy " + (1 + i));
const acts = [
  { value: 1, text: "啟用" },
  { value: 2, text: "停用" }
];
export default {
  name: "EditACcount222",
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
      act: 1,
      acts,
      item: {},
      myRoles: [],
      myDate: "",
      isAdmin: isNaN(sessionStorage.InstitutionId)
    };
  },
  props: ["roles", "accountStatus", "hospitals"],
  computed: {
    fillAll() {
      let all = this.item.Name  && this.item.No? true : false;
      if (this.isAdmin && all) {
        all = this.item.InstitutionId ? true : false;
      }
      return all;
    }
  },
  methods: {
    updateItem() {
      this.act = 1;
      this.item.InstitutionId = null;
    },
    async addRoom() {
      try {
        this.act == 1
          ? (this.item.IsActivated = true)
          : (this.item.IsActivated = false);
        await actions.addRoom(this.item);
        this.$bvToast.toast(`新增診間成功`, {
          title: "系統資訊",
          autoHideDelay: 5000,
          variant: "success"
        });
        store.accountUpdated = true;
        this.$bvModal.hide("room-added-dtx");
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

