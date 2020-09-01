<template>
  <b-modal
    @shown="updateItem"
    title="自訂簽章樣式"
    id="stamp-added-dtx"
    :header-bg-variant="variants[0]"
    :header-text-variant="variants[1]"
    :footer-bg-variant="variants[2]"
    :footer-text-variant="variants[2]"
    size="lg"
  >
    <b-container fluid>
      <main class="main-grid-dtc">
        <b-input-group prepend="簽章第一行">
          <b-input v-model.trim="stamp"></b-input>
        </b-input-group>
        <b-input-group prepend="使用者姓名">
          <b-input v-model.trim="item.Name" readonly></b-input>
        </b-input-group>
      </main>
    </b-container>
    <template v-slot:modal-footer>
      <div class="w-100">
        <b-button
          variant="info"
          class="float-right ml-4"
          @click="$bvModal.hide('stamp-added-dtx')"
        >取消</b-button>
        <b-button variant="success" class="float-right ml-2" @click="addSeal" :disabled="!img">確定</b-button>
        <b-button variant="info" class="float-right ml-2" @click="getSeal" :disabled="!stamp">預覽</b-button>
        <img :src="img" class="float-right mr-4" height="48px;" />
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
      stamp:'',
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
      isAdmin: isNaN(sessionStorage.InstitutionId),
      img:'',
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
       this.stamp = "";
       this.img = "";
       this.item = store.editItem;
    },
    async addSeal(){
      this.img = await axios.get(`account/GetSeal?name=${this.item.Name}&licenseNo=${this.stamp}`);
    },
    async getSeal(){
      this.img = await axios.get(`account/GetSeal?name=${this.item.Name}&licenseNo=${this.stamp}`);
    },
    async addSeal() {
      try {
        const obj = {No:this.item.No, LicenseNo:this.stamp};
        await axios.put('account/SetLicenseNo', obj);
        this.$bvToast.toast(`新增醫師證號成功`, {
          title: "系統資訊",
          autoHideDelay: 5000,
          variant: "success"
        });
        store.accountUpdated = true;
        this.$bvModal.hide("stamp-added-dtx");
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
       this.item = store.editItem;
       //alert(JSON.stringify(this.item))
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

