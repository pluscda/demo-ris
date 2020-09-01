<template>
  <div class="pageLeftContent pb-1">
    <searchBar @filter="grdPermission_filter" @filterClear="grdPermission_filterClear"></searchBar>
    <ejs-grid
      ref="grdPermission"
      :dataSource="dsPermission"
      :allowPaging="true"
      :allowSorting="true"
      :pageSettings="pageSettings"
      :editSettings="editSettings"
      :toolbar="toolbar"
      :allowFiltering="true"
      :allowResizing="true"
      :allowTextWrap="true"
      :filterSettings="{ type: 'CheckBox' }"
      :actionBegin="actionBegin"
      :actionComplete="actionComplete"
      :actionFailure="actionFailure"
    >
      <e-columns>
        <e-column field="No" :isPrimaryKey="true" headerText="授權作業代碼" width="160" :validationRules="{ required: true }"></e-column>
        <e-column field="Name" headerText="授權作業" :validationRules="{ required: true }"></e-column>
        <e-column field="UserNames" headerText="授權使用者" :allowEditing="false" :allowSorting="false"></e-column>
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
  </div>
</template>

<script>
import Vue from "vue";
import Swal from "sweetalert2";
import { Browser } from "@syncfusion/ej2-base";
import { GridPlugin, Page, Sort, Edit, Toolbar, Filter, Resize, CommandColumn } from "@syncfusion/ej2-vue-grids";
import { DataManager, WebApiAdaptor } from "@syncfusion/ej2-data";
import * as configs from "@/config";
import searchBar from "./SearchBar";
import DialogTemplate from "./DialogTemplate";
import Common from "../../library/Common";

Vue.use(GridPlugin);

export default {
  data() {
    return {
      dsPermission: new DataManager({
        url: configs.publicPath + "../api/Permission",
        adaptor: new WebApiAdaptor(),
        crossDomain: true
      }),
      // roles: [],
      pageSettings: { pageSizes: true, pageSize: 10 },
      editSettings: {
        allowEditing: true,
        allowAdding: true,
        allowDeleting: false,
        mode: "Dialog",
        showConfirmDialog: true,
        template: function() {
          return { template: DialogTemplate };
        }
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
    grid: [Page, Sort, Edit, Toolbar, Filter, Resize, CommandColumn]
  },
  components: {
    searchBar
  },
  methods: {
    grdPermission_filter: function(e) {
      if (e.no != null) this.$refs.grdPermission.filterByColumn("No", "contains", e.no);
      else this.$refs.grdDevice.ej2Instances.removeFilteredColsByField("No");
      if (e.name != null) this.$refs.grdPermission.filterByColumn("Name", "contains", e.name);
      else this.$refs.grdDevice.ej2Instances.removeFilteredColsByField("Name");

      if (e.isEnabled != "") this.$refs.grdPermission.filterByColumn("IsEnabled", "equal", e.isEnabled === "true");
      else this.$refs.grdDevice.ej2Instances.removeFilteredColsByField("IsEnabled");
    },
    grdPermission_filterClear: function() {
      this.$refs.grdPermission.clearFiltering();
    },
    actionBegin(args) {
      if (args.requestType === "save") {
        args.data.UserNos = args.form.querySelector("#UserNos").ej2_instances[0].value;
      }
    },
    actionComplete: function(args) {
      if (args.requestType === "beginEdit" || args.requestType === "add") {
        let dialog = args.dialog;
        window.$("div[role='dialog']").css("max-height", "");
        // change the header of the dialog
        if (args.requestType === "beginEdit") dialog.header = "編輯『" + args.rowData["Name"] + "』";
        if (Browser.isDevice) {
          dialog.height = window.innerHeight - 90 + "px";
          dialog.dataBind();
        }
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
  }
};
</script>
