<template>
  <div class="pageLeftContent pb-1">
    <searchBar @filter="grdLab_filter" @filterClear="grdLab_filterClear" :employeeNos="employeeNos" :totalRows="rows" :gridRef="$refs.grdLab"></searchBar>
    <b-container fluid class="mt-1 px-1">
      <ejs-grid
        ref="grdLab"
        v-on:click.native="clickedGrid"
        :dataSource="dsLab"
        :allowPaging="true"
        :allowSorting="true"
        :allowResizing="true"
        :allowTextWrap="true"
        :pageSettings="pageSettings"
        :actionFailure="actionFailure"
        :allowFiltering="true"
        :filterSettings="{ type: 'CheckBox' }"
      >
        <e-columns>
          <e-column field="Id" :isPrimaryKey="true" headerText="ID" :visible="false"></e-column>
          <e-column field="DxreportPhysicianId" :visible="false"></e-column>
          <e-column type="checkbox" field="IsChecked" width="50" textAlign="Center" :allowFiltering="false" :allowResizing="false"></e-column>
          <e-column field="AccessionNo" headerText="檢查單號" width="180"></e-column>
          <e-column field="PatientName" headerText="病患姓名" width="100" :allowSorting="false"></e-column>
          <e-column field="OtherPatientId" headerText="身分證字號" width="120"></e-column>
          <e-column field="PatientId" headerText="病歷編號" width="120"></e-column>

          <e-column field="ProcedureCode" :isPrimaryKey="true" headerText="檢查項目院內代碼" width="180"></e-column>
          <e-column field="ProcedureName" headerText="檢查項目名稱"></e-column>
          <e-column
            field="ProcedureCompleted"
            headerText="檢查時間"
            :allowSearching="false"
            :format="{ type: 'dateTime', format: 'yyyy/MM/dd HH:mm' }"
            width="150"
          ></e-column>
          <e-column field="DxreportPhysicianName" headerText="分派醫師" width="100"></e-column>
        </e-columns>
      </ejs-grid>
    </b-container>
  </div>
</template>
<script>
import Vue from "vue";
import { DataManager, WebApiAdaptor } from "@syncfusion/ej2-data";
import { GridPlugin, Page, Sort, ForeignKey, Filter, Resize, CommandColumn, DetailRow } from "@syncfusion/ej2-vue-grids";
import * as configs from "@/config";
import searchBar from "./SearchBar";
import Common from "../../library/Common";

Vue.use(GridPlugin);

export default {
  data() {
    return {
      rows: 0,
      approvalList: [],
      checkCategories: [],
      employeeNos: [],
      dsLab: [],
      pageSettings: {
        pageSizes: true,
        pageSize: 10
      },
      numericParams: {
        params: {
          validateDecimalOnType: true,
          decimals: 0,
          format: "N"
        }
      },
      sortSettings: {
        columns: [{ field: "No" }]
      }
    };
  },
  provide: {
    grid: [Page, Sort, Filter, Resize, CommandColumn, DetailRow, ForeignKey]
  },
  components: {
    searchBar
  },
  methods: {
    clickedGrid() {
      requestAnimationFrame(() => {
        this.rows = this.$refs.grdLab.getSelectedRecords().length;
      });
    },
    grdLab_filter(e) {
      var urlParam = "?status=36,51,56";

      if (e.PatientName != "") urlParam += "&patientName=" + e.PatientName;
      if (e.DateRange != null && e.DateRange.length == 2) {
        urlParam += "&procedureCompletedStart=" + e.DateRange[0].toJSON() + "&procedureCompletedEnd=" + e.DateRange[1].toJSON();
      }

      this.dsLab = new DataManager({
        url: configs.publicPath + "../exam/List" + urlParam,
        adaptor: new WebApiAdaptor(),
        crossDomain: true
      });

      //startsWith, endsWith, contains, equal, notEqual, greaterThan, greaterThanOrEqual, lessThan, lessThanOrEqual
      if (e.OtherPatientId != "") this.$refs.grdLab.filterByColumn("OtherPatientId", "contains", e.OtherPatientId);
      else this.$refs.grdLab.ej2Instances.removeFilteredColsByField("OtherPatientId");
      if (e.PatientId != "") this.$refs.grdLab.filterByColumn("PatientId", "contains", e.PatientId);
      else this.$refs.grdLab.ej2Instances.removeFilteredColsByField("Patient.NaturalPerson.Name");
      if (e.AccessionNo != "") this.$refs.grdLab.filterByColumn("AccessionNo", "contains", e.AccessionNo);
      else this.$refs.grdLab.ej2Instances.removeFilteredColsByField("AccessionNo");
      if (e.ProcedureCode != "") this.$refs.grdLab.filterByColumn("ProcedureCode", "contains", e.ProcedureCode);
      else this.$refs.grdLab.ej2Instances.removeFilteredColsByField("ProcedureCode");
      if (e.DxreportPhysicianId != null) this.$refs.grdLab.filterByColumn("DxreportPhysicianId", "equal", e.DxreportPhysicianId);
      else this.$refs.grdLab.ej2Instances.removeFilteredColsByField("DxreportPhysicianId");
    },
    grdLab_filterClear: function() {
      this.$refs.grdLab.clearFiltering();
      this.grdLab_filter({
        OtherPatientId: "",
        PatientId: "",
        PatientName: "",
        AccessionNo: "",
        ProcedureCode: "",
        DateRange: null,
        DxreportPhysicianId: null
      });
    },
    actionFailure: function(args) {
      Common.actionFailure(args);
    }
  },

  created() {
    let _this = this;
    window.axios.get("/employee/SelectNoList?StaffType=21,23,25,27,28,29").then(e => {
      _this.employeeNos = e.Items;
    });
    window.axios.get("/checkCategory/SelectList?isAll=true").then(e => {
      _this.checkCategories = e.Items;
    });
  },
  mounted() {
    this.grdLab_filter({
      OtherPatientId: "",
      PatientId: "",
      PatientName: "",
      AccessionNo: "",
      ProcedureCode: "",
      DateRange: null,
      DxreportPhysicianId: null
    });
  }
};
</script>
<style></style>
