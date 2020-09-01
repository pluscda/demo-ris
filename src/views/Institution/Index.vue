<template>
  <div class="pageLeftContent pb-1">
    <searchBar @filter="grdOrangization_filter" @filterClear="grdOrangization_filterClear" :hospitals="hospitals"></searchBar>
    <b-container fluid class="mt-1 px-1">
      <ejs-grid
        ref="grdOrangization"
        :dataSource="dsInstitution"
        :allowPaging="true"
        :allowSorting="true"
        :allowResizing="true"
        :allowTextWrap="true"
        :pageSettings="pageSettings"
        :editSettings="editSettings"
        :toolbar="toolbar"
        :actionComplete="actionComplete"
        :actionFailure="actionFailure"
        :allowFiltering="true"
        :filterSettings="{ type: 'CheckBox' }"
      >
        <e-columns>
          <e-column field="Id" :isPrimaryKey="true" headerText="ID" width="160" :visible="false"></e-column>
          <e-column field="No" :isPrimaryKey="true" headerText="部門代碼" width="200" :validationRules="{ required: true }"></e-column>
          <e-column field="Name" headerText="部門名稱" :validationRules="{ required: true }"></e-column>
          <e-column
            field="ParentInstitutionId"
            headerText="隸屬醫院(部門)"
            :dataSource="hospitals"
            foreignKeyValue="Name"
            foreignKeyField="Id"
            :validationRules="{ required: true }"
          ></e-column>
          <e-column
            field="IsActive"
            headerText="啟用"
            width="70"
            textAlign="Center"
            type="boolean"
            displayAsCheckBox="true"
            editType="booleanedit"
            :allowResizing="false"
          ></e-column>
          <e-column headerText :commands="commands" width="50" :allowResizing="false"></e-column>
        </e-columns>
      </ejs-grid>
    </b-container>
  </div>
</template>
<script>
import Vue from "vue";
import Swal from "sweetalert2";
import { DataManager, WebApiAdaptor, Query } from "@syncfusion/ej2-data";
import { GridPlugin, Page, Sort, ForeignKey, Edit, Toolbar, Filter, Resize, CommandColumn, DetailRow } from "@syncfusion/ej2-vue-grids";
import * as configs from "@/config";
import searchBar from "./SearchBar";
import Common from "../../library/Common";

Vue.use(GridPlugin);

export default {
  data() {
    return {
      hospitals: [],
      dsInstitution: new DataManager({
        url: configs.publicPath + "../api/Institution",
        adaptor: new WebApiAdaptor(),
        crossDomain: true
      }),
      pageSettings: {
        pageSizes: true,
        pageSize: 10
      },
      editSettings: {
        allowEditing: true,
        allowAdding: true,
        allowDeleting: false,
        mode: "Dialog",
        showConfirmDialog: true
      },
      sortSettings: {
        columns: [{ field: "No" }]
      },
      commands: [
        {
          type: "Edit",
          buttonOption: {
            iconCss: " e-icons e-edit",
            cssClass: "e-flat"
          }
        }
      ],
      toolbar: ["Add"]
    };
  },
  provide: {
    grid: [Page, Sort, Edit, Toolbar, Filter, Resize, CommandColumn, DetailRow, ForeignKey]
  },
  components: {
    searchBar
  },
  methods: {
    grdOrangization_filter: function(e) {
      //startsWith, endsWith, contains, equal, notEqual, greaterThan, greaterThanOrEqual, lessThan, lessThanOrEqual
      if (e.No != "") this.$refs.grdOrangization.filterByColumn("No", "contains", e.No);
      else this.$refs.grdOrangization.ej2Instances.removeFilteredColsByField("No");
      if (e.Name != "") this.$refs.grdOrangization.filterByColumn("Name", "contains", e.Name);
      else this.$refs.grdOrangization.ej2Instances.removeFilteredColsByField("Name");
      if (e.Hospital != null) this.$refs.grdOrangization.filterByColumn("ParentInstitutionId", "equal", e.Hospital);
      else this.$refs.grdOrangization.ej2Instances.removeFilteredColsByField("ParentInstitutionId");
      if (e.IsActive != "") this.$refs.grdOrangization.filterByColumn("IsActive", "equal", e.IsActive == "Y");
      else this.$refs.grdOrangization.ej2Instances.removeFilteredColsByField("IsActive");
    },
    grdOrangization_filterClear: function() {
      this.$refs.grdOrangization.clearFiltering();
    },
    actionComplete: function(args) {
      if (args.requestType === "beginEdit" || args.requestType === "add") {
        let dialog = args.dialog;
        window.$("div[role='dialog']").css("max-height", "");
        // change the header of the dialog
        if (args.requestType === "beginEdit") dialog.header = "編輯『" + args.rowData["No"] + "』";
      }
      if ((args.action == "edit" || args.action == "add") && args.requestType != "cancel")
        Swal.fire({
          type: "success",
          title: "儲存成功！",
          timer: 1500
        });
    },
    actionFailure: function(args) {
      Common.actionFailure(args);
    }
  },
  created: function() {
    window.axios.get("/institution/SelectList?getAll=false").then(e => {
      this.hospitals = e.Items;
    });

    // var query = new Query().where("ParentInstitutionId", "notEqual", null);
    this.dsInstitution = new DataManager({
      url: configs.publicPath + "../api/Institution",
      adaptor: new WebApiAdaptor(),
      crossDomain: true
    });
  }
};
</script>
