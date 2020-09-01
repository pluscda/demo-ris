<template>
  <div class="pageLeftContent pb-1">
    <searchBar
      @filter="grdEmployee_filter"
      @filterClear="grdEmployee_filterClear"
      @export="grdEmployee_export"
      :staffStatusType="staffStatusType"
      :staffTypes="staffTypes"
    ></searchBar>
    <ejs-grid
      ref="grdEmployee"
      :dataSource="dsEmployee"
      allowPaging="true"
      allowSorting="true"
      :allowTextWrap="true"
      :pageSettings="pageSettings"
      :editSettings="editSettings"
      :allowFiltering="true"
      :allowResizing="true"
      :filterSettings="{ type: 'CheckBox' }"
      :actionBegin="actionBegin"
      :actionFailure="actionFailure"
    >
      <e-columns>
        <e-column field="Id" :isPrimaryKey="true" headerText="ID" width="160" :visible="false" :allowSearching="false"></e-column>
        <e-column field="No" type="string" :isPrimaryKey="true" headerText="員工編號" width="120" :validationRules="{ required: true }"></e-column>
        <e-column field="Name" headerText="員工姓名" width="120" type="string" :validationRules="{ required: true }"></e-column>
        <e-column field="StaffType" headerText="職務" width="120" foreignKeyValue="Name" foreignKeyField="No" :dataSource="staffTypes"></e-column>
        <e-column field="TotalCount" headerText="處理件數" width="120"></e-column>
      </e-columns>
    </ejs-grid>
  </div>
</template>

<script>
import Vue from "vue";
import { GridPlugin, Page, Sort, Edit, Toolbar, Filter, Resize, ForeignKey, CommandColumn } from "@syncfusion/ej2-vue-grids";
import { DataManager, WebApiAdaptor, Query } from "@syncfusion/ej2-data";
import * as configs from "@/config";
import searchBar from "./SearchBar";
import Common from "../../library/Common";
import DateHelper from "../../library/DateHelper";

Vue.use(GridPlugin);

export default {
  data() {
    return {
      dsEmployee: [],
      staffTypes: [],
      staffStatusType: [],
      pageSettings: { pageSizes: true, pageSize: 10 },
      editSettings: {
        allowEditing: true,
        mode: "Dialog",
        showDeleteConfirmDialog: true
      }
      // toolbar: [{ text: '時間區間工作量', tooltipText: "時間區間工作量", prefixIcon: 'e-excelexport', id: 'Workload' }, { text: '年度工作量', tooltipText: "年度工作量", prefixIcon: 'e-excelexport', id: 'YearWorkload' }]
    };
  },
  provide: {
    grid: [Page, Sort, Edit, Toolbar, Filter, Resize, ForeignKey, CommandColumn]
  },
  components: {
    searchBar
  },
  methods: {
    downloadFile: function(filePath) {
      let link = document.createElement("a");
      link.href = filePath;
      link.download = filePath.substr(filePath.lastIndexOf("/") + 1);
      link.click();
    },
    grdEmployee_export: function(e) {
      this.grdEmployee_filter(e);
      new DataManager({
        url: configs.publicPath + "../employee/WorkloadReport" + this.getUrlParams(e),
        adaptor: new WebApiAdaptor(),
        crossDomain: true
      })
        .executeQuery(this.getQuery(e))
        .then(r => {
          this.downloadFile(r.result.Url);
        });
    },
    getQuery: function(e) {
      let query = new Query();
      if (e.No != "") query = query.where("No", "contains", e.No);
      if (e.Name != "") query = query.where("Name", "contains", e.Name);

      if (e.StaffType != null) query = query.where("StaffType", "equal", e.StaffType);

      if (e.StaffStatus != null) query = query.where("StaffStatus", "equal", e.StaffStatus);

      return query;
    },
    getUrlParams: function(e) {
      let stassWorkloadUrl = "?getAll=false&staffType=25,27,29,35,55";
      if (e.Tab === "day") {
        if (e.DateRange != null && e.DateRange.length == 2) {
          stassWorkloadUrl += "&startDate=" + e.DateRange[0].toJSON() + "&endDate=" + e.DateRange[1].toJSON();
        }
      } else {
        let startDate = new Date(e.Year, 0, 1);
        stassWorkloadUrl += "&isYear=true" + "&startDate=" + startDate.toJSON() + "&endDate=" + DateHelper.getYearLast(startDate).toJSON();
      }
      return stassWorkloadUrl;
    },
    grdEmployee_filter: function(e) {
      this.dsEmployee = new DataManager({
        url: configs.publicPath + "../employee/Workload" + this.getUrlParams(e),
        adaptor: new WebApiAdaptor(),
        crossDomain: true
      });

      //startsWith, endsWith, contains, equal, notEqual, greaterThan, greaterThanOrEqual, lessThan, lessThanOrEqual
      if (e.No != "") this.$refs.grdEmployee.filterByColumn("No", "contains", e.No);
      else this.$refs.grdEmployee.ej2Instances.removeFilteredColsByField("No");

      if (e.Name != "") this.$refs.grdEmployee.filterByColumn("Name", "contains", e.Name);
      else this.$refs.grdEmployee.ej2Instances.removeFilteredColsByField("Name");

      if (e.StaffType != null) this.$refs.grdEmployee.filterByColumn("StaffType", "equal", e.StaffType);
      else this.$refs.grdEmployee.ej2Instances.removeFilteredColsByField("StaffType");

      if (e.StaffStatus != null) this.$refs.grdEmployee.filterByColumn("StaffStatus", "equal", e.StaffStatus);
      else this.$refs.grdEmployee.ej2Instances.removeFilteredColsByField("StaffStatus");
    },
    grdEmployee_filterClear: function(e) {
      this.$refs.grdEmployee.clearFiltering();
    },
    actionBegin(args) {
      if (args.requestType === "save") {
        args.data.RoleNos = args.form.querySelector("#RoleNos").ej2_instances[0].value;
      }
    },
    actionFailure: function(args) {
      Common.actionFailure(args);
    }
  },
  created: function() {
    window.axios.get("/GeneralData/SelectNoList?groupNo=StaffType").then(e => {
      if (e != null) {
        this.staffTypes = e.Items;
      }
    });
    window.axios.get("/GeneralData/SelectNoList?groupNo=StaffStatus").then(e => {
      if (e != null) {
        this.staffStatusType = e.Items;
      }
    });
  }
};
</script>
