<template>
  <div class="control-section accordion-control-section">
    <b-card no-body class="mx-1">
      <b-card-header class="bg-primary text-white cardHeader">
        <b-row no-gutters>
          <b-col cols="6">手動分派報告．查詢作業</b-col>
        </b-row>
      </b-card-header>
      <b-card-text class="text-left py-1">
        <b-container fluid class="px-1">
          <b-row no-gutters>
            <b-col sm="3" class="px-1">
              <ejs-textbox v-model="AccessionNo" floatLabelType="Always" placeholder="檢查單號" :showClearButton="true" @keyup.enter="onFilter" />
            </b-col>
            <b-col sm="3" class="px-1">
              <ejs-textbox v-model="PatientName" floatLabelType="Always" placeholder="病患姓名" :showClearButton="true" @keyup.enter="onFilter" />
            </b-col>
            <b-col sm="3" class="px-1">
              <ejs-textbox v-model="OtherPatientId" floatLabelType="Always" placeholder="身分證字號" :showClearButton="true" @keyup.enter="onFilter" />
            </b-col>
            <b-col sm="3" class="px-1">
              <ejs-textbox v-model="PatientId" floatLabelType="Always" placeholder="病歷編號" :showClearButton="true" @keyup.enter="onFilter" />
            </b-col>
          </b-row>
          <b-row no-gutters>
            <b-col sm="3" class="px-1">
              <ejs-textbox v-model="ProcedureCode" floatLabelType="Always" placeholder="檢查項目院內代碼" :showClearButton="true" @keyup.enter="onFilter" />
            </b-col>
            <!-- <b-col sm="2" class="px-1">
              <ejs-textbox v-model="ProcedureName" floatLabelType="Always" placeholder="檢查項目名稱" :showClearButton="true" @keyup.enter="onFilter" />
            </b-col> -->
            <b-col sm="3" class="px-1">
              <ejs-daterangepicker
                floatLabelType="Always"
                placeholder="檢查日期區間"
                v-model="DateRange"
                :allowEdit="false"
                :showClearButton="true"
              ></ejs-daterangepicker>
            </b-col>
            <b-col sm="3" class="px-1">
              <ejs-dropdownlist
                v-model="DxreportPhysicianId"
                :dataSource="employeeNos"
                :fields="{ text: 'Name', value: 'No' }"
                floatLabelType="Always"
                :showClearButton="true"
                placeholder="分派醫師"
              ></ejs-dropdownlist>
            </b-col>
            <b-col class="px-2 text-right" style="display: table; height: 60px;">
              <div style="display: table-cell; vertical-align: middle">
                <b-button variant="success" @click="onClear"> <font-awesome-icon icon="eraser" />清除 </b-button>&nbsp;
                <b-button variant="primary" @click="onFilter"> <font-awesome-icon icon="search" />查詢 </b-button>
              </div>
            </b-col>
          </b-row>
        </b-container>
      </b-card-text>
      <b-card-header class="bg-primary text-white cardHeader">
        <b-row no-gutters>
          <b-col cols="12">手動分派醫師</b-col>
        </b-row>
      </b-card-header>
      <b-card-body style="padding:0px; padding: 12px 4px;">
        <div class="grid-row">
          <ejs-dropdownlist
            v-model="approvalId"
            :dataSource="employeeNos"
            :fields="{ text: 'Name', value: 'No' }"
            floatLabelType="Always"
            :showClearButton="true"
          ></ejs-dropdownlist>
          <b-button variant="info" :disabled="!approvalId || !totalRows" @click="dispatchJobs"> <font-awesome-icon icon="share-square" class="mr-1" />分派醫師 </b-button>
        </div>
      </b-card-body>
    </b-card>
  </div>
</template>
<script>
import Vue from "vue";
import { DropDownListPlugin } from "@syncfusion/ej2-vue-dropdowns";
import { RadioButtonPlugin } from "@syncfusion/ej2-vue-buttons";
import { TextBoxPlugin } from "@syncfusion/ej2-vue-inputs";
import { DateRangePickerPlugin } from "@syncfusion/ej2-vue-calendars";
import Swal from "sweetalert2";

Vue.use(TextBoxPlugin);
Vue.use(RadioButtonPlugin);
Vue.use(DropDownListPlugin);
Vue.use(DateRangePickerPlugin);

export default {
  props: ["employeeNos", "gridRef", "totalRows"],
  data() {
    return {
      ObjApp: "",
      approvalId: "",
      // approvalList: [],
      OtherPatientId: "",
      PatientId: "",
      PatientName: "",
      AccessionNo: "",
      ProcedureCode: "",
      DateRange: null,
      DxreportPhysicianId: null
    };
  },
  computed: {},
  methods: {
    onFilter: function() {
      this.$emit("filter", this);
    },
    onClear: function() {
      this.OtherPatientId = "";
      this.PatientId = "";
      this.PatientName = "";
      this.AccessionNo = "";
      this.ProcedureCode = "";
      this.DateRange = null;
      this.DxreportPhysicianId = null;

      this.$emit("filterClear", this);
    },
    async dispatchJobs() {
      let rows = this.gridRef.getSelectedRecords(); // Get the selected records.
      if (!rows.length) {
        this.ObjApp.TimingMessage("尚未, 不得存檔.", 2);
        return;
      }
      //console.log(JSON.stringify(rows, 0, 2));
      let arr = [];
      rows.forEach(s => {
        arr.push(s.AccessionNo);
      });
      this.ObjApp.WaitingShow();
      await window.axios
        .put("/exam/AssignReport", { ReportPhysicianId: this.approvalId, AccessionNos: arr })
        .then(() => {
          this.ObjApp.WaitingHide();
          this.gridRef.ej2Instances.refresh();
          Swal.fire({
            type: "success",
            title: "分派醫師成功！",
            timer: 1500
          });
        })
        .catch(function(error) {
          Swal.fire("分派醫師失敗！", error, "error");
        });
    }
  },
  async beforeMount() {
    this.ObjApp = this.$GetApp(this)[0];
  }
};
</script>
<style lang="scss" scoped>
.grid-row {
  display: grid;
  padding: 0px;
  margin: 0px;
  grid-template-columns: 320px 150px 120px 1fr;
  grid-column-gap: 12px;
}
</style>
