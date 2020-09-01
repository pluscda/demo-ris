<template>
  <b-modal
    @shown="init"
    id="enterDlg"
    title="手動開單"
    size="xl"
    :header-bg-variant="variants[3]"
    :header-text-variant="variants[7]"
    :body-bg-variant="headerBgVariant"
    :body-text-variant="headerTextVariant"
    :footer-bg-variant="headerBgVariant"
    :footer-text-variant="headerTextVariant"
  >
    <b-container fluid class="dtc-grid">
      <b-input-group prepend="檢查單號">
        <b-input ref="AccessionNo1" v-model="map.inspectId" />
      </b-input-group>
      <b-input-group prepend="病歷編號">
        <b-input v-model="map.personNum" />
      </b-input-group>
      <b-input-group prepend="病患姓名">
        <b-input v-model="map.name" />
      </b-input-group>
      <b-input-group prepend="病患性別">
        <div class="form-control" style="padding: 0.4rem;">
          <b-form-radio-group v-model="map.sex">
            <b-form-radio value="M">M</b-form-radio>
            <b-form-radio value="F">F</b-form-radio>
          </b-form-radio-group>
        </div>
      </b-input-group>
      <b-input-group prepend="身分證號">
        <b-input v-model="map.personId" />
      </b-input-group>
      <b-input-group prepend="開單日期">
        <div class="form-control" style="padding:0px;margin:0px">
          <ejs-datepicker placeholder="請選擇" v-model="map.today" :showTodayButton="false"></ejs-datepicker>
        </div>
      </b-input-group>

      <b-input-group prepend="檢查項目">
        <b-select v-model="map.inspectItem" :options="optionsCheckItem" />
      </b-input-group>
      <b-input-group prepend="病患來源" v-if="optionsPatientSource && optionsPatientSource.length">
        <b-select v-model="map.source" :options="optionsPatientSource" />
      </b-input-group>
      <b-input-group prepend="檢查室">
        <b-select v-model="map.room" :options="optionsLocationSource" />
      </b-input-group>
      <b-input-group prepend="報到狀態">
        <b-select v-model="map.status" :options="CheckinStatusSource" />
      </b-input-group>
      <b-input-group prepend="急作類型">
        <div class="form-control" style="padding: 0.4rem;">
          <b-form-radio-group v-model="map.urgent">
            <b-form-radio value="Y">是</b-form-radio>
            <b-form-radio value="N">否</b-form-radio>
          </b-form-radio-group>
        </div>
      </b-input-group>
    </b-container>

    <template v-slot:modal-footer>
      <div class="w-100">
        <p class="float-left ml-3">溫馨提醒 : 所有欄位均必填</p>
        <b-button size="lg" class="float-right" @click="$bvModal.hide('enterDlg')"> <font-awesome-icon icon="undo" /> 取消開單</b-button>
        <div class="float-right mx-3">&nbsp;&nbsp;&nbsp;&nbsp;</div>
        <b-button @click="add" size="lg" variant="warning" class="float-right"> <font-awesome-icon icon="edit" />手動開單 </b-button>
      </div>
    </template>
  </b-modal>
</template>

<script>
import Vue from "vue";
import Swal from "sweetalert2";
import { DatePickerPlugin } from "@syncfusion/ej2-vue-calendars";

Vue.use(DatePickerPlugin);

export default {
  data() {
    return {
      map: {
        today: new Date(),
        inspectItem: null,
        source: null,
        room: null,
        status: null,
        sex: "M",
        urgent: "N",
        inspectId: "",
        personNum: "",
        personId: "",
        name: ""
      },
      variants: ["primary", "secondary", "success", "warning", "danger", "info", "light", "dark"],
      headerBgVariant: "dark",
      headerTextVariant: "light",
      cloneMap: ""
    };
  },
  props: ["optionsCheckItem", "optionsPatientSource", "optionsLocationSource", "CheckinStatusSource"],

  methods: {
    init() {
      if (!this.cloneMap) {
        this.cloneMap = Object.assign({}, this.map);
        return;
      }
      this.map = Object.assign({}, this.cloneMap);
    },
    async add() {
      const keys = Object.keys(this.map);
      let ok = true;
      for (let i = 0; i < keys.length; ++i) {
        if (!this.map[keys[i]]) {
          ok = false;
          //alert(keys[i]);
          break;
        }
      }
      if (!ok) {
        Swal.fire("溫馨提醒 : 所有欄位均必填");
        return;
      }
      //TODO add
      Swal.fire("手動開單成功!", "", "success");
      this.$bvModal.hide("enterDlg");
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
.dtc-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1.6rem;
}
</style>
