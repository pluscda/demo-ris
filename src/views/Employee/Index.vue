<template>
  <div class="pageLeftContent pb-1">
    <searchBar
      @filter="grdEmployee_filter"
      @filterClear="grdEmployee_filterClear"
      :staffStatusType="staffStatusType"
      :staffTypes="staffTypes"
      :roles="dsRole"
      :departments="departments"
    ></searchBar>
    <b-container fluid class="mt-1 px-1">
      <ejs-grid
        ref="grdEmployee"
        :dataSource="dsEmployee"
        allowPaging="true"
        allowSorting="true"
        :allowTextWrap="true"
        :pageSettings="pageSettings"
        :editSettings="editSettings"
        :toolbar="toolbar"
        :allowFiltering="true"
        :allowResizing="true"
        :filterSettings="{ type: 'CheckBox' }"
        :detailTemplate="DetailProcedureGroup"
        :actionBegin="actionBegin"
        :actionComplete="actionComplete"
        :actionFailure="actionFailure"
      >
        <e-columns>
          <e-column field="Id" :isPrimaryKey="true" :visible="false" :allowSearching="false"></e-column>
          <e-column
            field="InstitutionId"
            headerText="隸屬部門"
            :dataSource="departments"
            foreignKeyValue="Name"
            foreignKeyField="Id"
            :validationRules="{ required: true }"
          ></e-column>
          <!-- <e-column
            field="NaturalPerson.PhoneNo4Residence"
            :visible="false"
          ></e-column> -->
          <!-- <e-column
            field="NaturalPerson.Sex"
            :visible="false"
          ></e-column> -->
          <!-- <e-column
            field="NaturalPerson.Sex"
            headerText=""
            width="0"
            :allowResizing="false"
            :validationRules="{ required: true }"
          ></e-column> -->
          <e-column field="No" type="string" :isPrimaryKey="true" headerText="員工編號" width="120" :validationRules="{ required: true }"></e-column>
          <e-column field="Name" headerText="員工姓名" width="120" type="string" :validationRules="{ required: true }" :allowSearching="false"></e-column>
          <e-column field="PhoneNo" headerText="手機號碼" width="120" type="string"></e-column>
          <e-column field="Email" headerText="電子郵件" width="120" type="string"></e-column>
          <e-column
            field="StaffType"
            headerText="職務"
            width="100"
            foreignKeyValue="Name"
            foreignKeyField="No"
            :dataSource="staffTypes"
            :validationRules="{ required: true }"
          ></e-column>
          <e-column
            field="MDLicenseNo"
            type="string"
            :isPrimaryKey="true"
            headerText="執業執照號碼"
            width="120"
            :allowSorting="false"
            :allowSearching="false"
            :allowFiltering="false"
          ></e-column>
          <e-column
            field="MDPId"
            type="string"
            :isPrimaryKey="true"
            headerText="醫事人員編號"
            width="120"
            :allowSorting="false"
            :allowSearching="false"
            :allowFiltering="false"
          ></e-column>
          <e-column
            field="StaffStatus"
            headerText="員工狀態"
            width="100"
            :allowResizing="false"
            foreignKeyValue="Name"
            foreignKeyField="No"
            :dataSource="staffStatusType"
            :validationRules="{ required: true }"
          ></e-column>
          <!-- <e-column
            field="RoleNames"
            headerText="授權角色"
            :allowSorting="false"
            :allowSearching="false"
            :allowFiltering="false"
          ></e-column> -->
          <!-- <e-column
            field="NaturalPerson.Birthday"
            headerText="出生日期"
            headerTextAlign="center"
            :format="{ type: 'date', format: 'yyyy/MM/dd' }"
            width="100"
            :allowSorting="false"
            :allowSearching="false"
            :allowFiltering="false"
          ></e-column> -->
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
import { GridPlugin, Page, Sort, Edit, Toolbar, Filter, Resize, ForeignKey, CommandColumn, DetailRow } from "@syncfusion/ej2-vue-grids";
import { DataManager, WebApiAdaptor } from "@syncfusion/ej2-data";
import * as configs from "@/config";
import searchBar from "./SearchBar";
import DialogTemplate from "./DialogTemplate";
import DetailProcedureGroup from "./DetailProcedureGroup";
import Common from "@/library/Common";

Vue.use(GridPlugin);

export default {
  data() {
    return {
      dsEmployee: new DataManager({
        url: configs.publicPath + "../api/employee",
        adaptor: new WebApiAdaptor(),
        crossDomain: true
      }),
      staffTypes: [],
      staffStatusType: [],
      sexs: [],
      dsRole: [],
      departments: [],
      pageSettings: { pageSizes: true, pageSize: 10 },
      editSettings: {
        allowEditing: true,
        allowAdding: true,
        mode: "Dialog",
        showDeleteConfirmDialog: true,
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
          // },
          // {
          //   type: "Delete",
          //   buttonOption: {
          //     iconCss: " e-icons e-delete",
          //     cssClass: "e-flat"
          //   }
        }
      ],
      DetailProcedureGroup: function() {
        return { template: DetailProcedureGroup };
      },
      toolbar: ["Add"]
    };
  },
  provide: {
    grid: [Page, Sort, Edit, Toolbar, Filter, Resize, ForeignKey, CommandColumn, DetailRow]
  },
  components: {
    searchBar
  },
  methods: {
    grdEmployee_filter(e) {
      //startsWith, endsWith, contains, equal, notEqual, greaterThan, greaterThanOrEqual, lessThan, lessThanOrEqual
      if (e.No != "") this.$refs.grdEmployee.filterByColumn("No", "contains", e.No);
      else this.$refs.grdEmployee.ej2Instances.removeFilteredColsByField("No");

      if (e.Name != "") this.$refs.grdEmployee.filterByColumn("Name", "contains", e.Name);
      else this.$refs.grdEmployee.ej2Instances.removeFilteredColsByField("Name");

      if (e.StaffType != null) this.$refs.grdEmployee.filterByColumn("StaffType", "equal", e.StaffType);
      else this.$refs.grdEmployee.ej2Instances.removeFilteredColsByField("StaffType");

      if (e.StaffStatus != null) this.$refs.grdEmployee.filterByColumn("StaffStatus", "equal", e.StaffStatus);
      else this.$refs.grdEmployee.ej2Instances.removeFilteredColsByField("StaffStatus");

      if (e.IsActive != "") this.$refs.grdEmployee.filterByColumn("IsActive", "equal", e.IsActive == "Y");
      else this.$refs.grdEmployee.ej2Instances.removeFilteredColsByField("IsActive");

      if (e.Department != null) this.$refs.grdEmployee.filterByColumn("InstitutionId", "equal", e.Department);
      else this.$refs.grdEmployee.ej2Instances.removeFilteredColsByField("InstitutionId");
    },
    grdEmployee_filterClear() {
      this.$refs.grdEmployee.clearFiltering();
    },
    actionBegin(args) {
      if (args.requestType === "save") {
        args.data.RoleNos = args.form.querySelector("#RoleNos").ej2_instances[0].value;
      }
    },
    actionComplete: function(args) {
      if (args.requestType === "beginEdit" || args.requestType === "add") {
        let dialog = args.dialog;
        window.$("div[role='dialog']").css("max-height", "");
        // change the header of the dialog
        if (args.requestType === "beginEdit") dialog.header = "編輯『" + args.rowData["No"] + "』";
        dialog.element.querySelector("#RoleNos").ej2_instances[0].dataSource = this.dsRole;

        dialog.element.querySelector("#StaffType").ej2_instances[0].dataSource = this.staffTypes;

        dialog.element.querySelector("#StaffStatus").ej2_instances[0].dataSource = this.staffStatusType;
        dialog.element.querySelector("#InstitutionId").ej2_instances[0].dataSource = this.departments;

        // dialog.element.querySelector(
        //   "#NaturalPerson___Sex"
        // ).ej2_instances[0].dataSource = this.sexs;

        if (args.requestType === "add") {
          dialog.element.querySelector("#StaffType").ej2_instances[0].index = 0;
          dialog.element.querySelector("#StaffStatus").ej2_instances[0].index = 0;
          // dialog.element.querySelector("#NaturalPerson___Sex").ej2_instances[0].index = 0;
        }
      }
      if ((args.action == "edit" || args.action == "add") && args.requestType != "cancel")
        Swal.fire({
          type: "success",
          title: "儲存成功！",
          timer: 1000
        });
    },
    actionFailure: function(args) {
      Common.actionFailure(args);
    }
  },
  created: function() {
    window.axios.get("/institution/SelectList?getAll=true").then(e => {
      this.departments = e.Items;
    });
    window.axios.get("/role/SelectList").then(e => {
      if (e != null) {
        this.dsRole = e.Items;
      }
    });
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
    window.axios.get("/GeneralData/SelectNoList?groupNo=Sex").then(e => {
      if (e != null) {
        this.sexs = e.Items;
      }
    });
  }
};
</script>
