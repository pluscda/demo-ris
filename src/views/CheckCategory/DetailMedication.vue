<template>
  <div style="max-width:1000px;">
    <ejs-grid
      ref="grdMedication"
      :dataSource="dsMedication"
      :allowSorting="false"
      height="385"
      :toolbar="[{ text: '儲存變更', tooltipText: '儲存變更', prefixIcon: 'e-update', id: 'btnSave' }]"
      :toolbarClick="onSave"
      :checkBoxChange="checkBoxChange"
      :selectionSettings="{ checkboxOnly: true }"
      :actionComplete="actionComplete"
      :actionFailure="actionFailure"
    >
      <e-columns>
        <e-column type="checkbox" field="IsChecked" width="90" textAlign="Center"></e-column>
        <e-column field="Id" :isPrimaryKey="true" headerText="ID" width="160" :visible="false"></e-column>
        <e-column field="No" :isPrimaryKey="true" headerText="藥品代碼" width="160" :validationRules="{ required: true }"></e-column>
        <!-- <e-column field="EngName" headerText="藥品英文名稱" :validationRules="{ required: true }"></e-column> -->
        <e-column field="Name" headerText="藥品名稱" :validationRules="{ required: true }"></e-column>
      </e-columns>
    </ejs-grid>
  </div>
</template>

<script>
import { Sort, Toolbar, Page } from "@syncfusion/ej2-vue-grids";
import { DataManager, WebApiAdaptor } from "@syncfusion/ej2-data";
import * as configs from "@/config";
import Swal from "sweetalert2";
import Common from "../../library/Common";

export default {
  data() {
    return {
      data: {},
      selectMedications: [],
      // detailChanged: false,
      dsMedication: []
    };
  },
  provide: {
    grid: [Sort, Page, Toolbar]
  },
  methods: {
    actionComplete: function() {
      this.$refs.grdMedication.ej2Instances.toolbarModule.enableItems(["btnSave"], false); //Disable toolbar items.
    },
    actionFailure: function(args) {
      Common.actionFailure(args);
    },
    checkBoxChange: function() {
      this.$refs.grdMedication.ej2Instances.toolbarModule.enableItems(["btnSave"], true); //Enable toolbar items.
    },
    onSave: function(args) {
      if (args.item.id === "btnSave") {
        window.axios
          .put("/checkCategory/UpdateMedications", {
            Id: this.data.Id,
            Items: this.$refs.grdMedication.getSelectedRecords()
          })
          .then(() => {
            this.$refs.grdMedication.ej2Instances.toolbarModule.enableItems(["btnSave"], false); //Disable toolbar items.
            Swal.fire({
              type: "success",
              title: "儲存成功！",
              timer: 1500
            });
          })
          .catch(function(error) {
            Swal.fire("儲存失敗！", error, "error");
          });
      }
    }
  },
  mounted: function() {
    this.dsMedication = new DataManager({
      url: configs.publicPath + "../checkCategory/Medications?id=" + this.data.Id,
      adaptor: new WebApiAdaptor(),
      crossDomain: true
    });
  }
};
</script>
<style></style>
