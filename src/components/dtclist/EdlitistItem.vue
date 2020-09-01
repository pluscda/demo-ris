<template>
  <b-modal
    @shown="updateItem"
    title="編輯役男資料"
    id="dtcEditPerson"
    :header-bg-variant="variants[0]"
    :header-text-variant="variants[1]"
    :footer-bg-variant="variants[2]"
    :footer-text-variant="variants[2]"
    size="lg"
  >
    <b-container fluid>
      <main class="main-grid-dtc">
        <b-input-group prepend="體檢時間">
          <b-input type="date" v-model="myExam" readonly></b-input>
        </b-input-group>
        <b-input-group prepend="體檢醫院">
          <!-- <b-select v-model="item.InstitutionId" :options="wheres.slice(1,100)"></b-select> -->
          <b-input v-model="wheres.find( s => s.value == item.InstitutionId).text" readonly></b-input>
        </b-input-group>
        <b-input-group prepend="役男姓名">
          <b-input v-model="item.Name" readonly></b-input>
        </b-input-group>
        <b-input-group prepend="身分證號">
          <b-input v-model="item.IdNo" readonly></b-input>
        </b-input-group>
        <b-input-group prepend="出生日期">
          <b-input type="date" v-model="myBirth" readonly></b-input>
        </b-input-group>
        <b-input-group prepend="列管編號">
          <b-input v-model="item.Unknown"></b-input>
        </b-input-group>
        <b-input-group prepend="聯絡電話">
          <b-input v-model="item.ContactPhone"></b-input>
        </b-input-group>
        <b-input-group prepend="通報人聯絡電話">
          <b-input v-model="item.NotifierPhone"></b-input>
        </b-input-group>
        <b-input-group style="grid-column:1/-1" prepend="戶籍地址">
          <b-input v-model="item.Address"></b-input>
        </b-input-group>
        <b-input-group style="grid-column:1/-1" prepend="備考">
          <b-textarea spellcheck="false" v-model="item.Notes"></b-textarea>
        </b-input-group>
      </main>
    </b-container>
    <template v-slot:modal-footer>
      <div class="w-100">
        <b-button variant="info" class="float-right ml-4" @click="$bvModal.hide('dtcEditPerson')">取消</b-button>
        <b-button variant="success" class="float-right" @click="editPerson">確定</b-button>
      </div>
    </template>
  </b-modal>
</template>

<script>
import { store, actions } from "@/store/global.js";
export default {
  name: "EditPersonItem",
  data() {
    return {
      item: { ...store.editItem },
      Text: "",
      Code: "",
      place:"",
      myBirth:"",
      myExam:"",
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
  props: ["wheres"],
  computed: {},
  methods: {
    updateItem() {
      this.item = { ...store.editItem };
      this.myBirth = this.item.Birthday
        ? this.item.Birthday.split("T")[0]
        : "";
      this.myExam = this.item.ExamDate
        ? this.item.ExamDate.split("T")[0]
        : "";
    },
    async editPerson() {
      try {
        await actions.setGeneralInfo(this.item);
        this.$bvToast.toast(`編輯役男資料成功`, {
          title: "系統資訊",
          autoHideDelay: 5000,
          variant: "success",
        });
        store.editItem = { ...store.editItem };
        this.$bvModal.hide("dtcEditPerson");
      } catch (e) {
        this.$bvToast.toast(`` + e, {
          title: "系統資訊",
          autoHideDelay: 5000,
          variant: "danger",
        });
      }
    },
  },
  mounted() {
    
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
.input-group {
  margin-bottom: 10px;
}
</style>
