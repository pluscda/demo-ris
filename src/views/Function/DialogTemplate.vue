<style>
.form-group.col-md-6 {
  width: 250px;
}
#ShipAddress {
  resize: vertical;
}
:-ms-fullscreen,
.e-dialog.e-edit-dialog {
  max-width: 552px;
}
@import "../../../node_modules/@syncfusion/ej2-base/styles/material.css";
/* @import "../../../node_modules/@syncfusion/ej2-vue-inputs/styles/material.css"; */
@import "../../../node_modules/@syncfusion/ej2-vue-dropdowns/styles/material.css";
</style>

<template>
  <div formGroup="userForm" class="q-pa-md row items-start q-gutter-md">
    <q-card style="width: 200px; min-height: 200px;">
      <q-card-section class="bg-primary text-white">
        <div class="text-subtitle2">使用者</div>
      </q-card-section>
      <q-separator />
      <q-card-actions class="row">
        <q-input ref="No" name="No" v-model="data.No" label="使用者代碼" :readonly="!data.isAdd" />
        <q-input ref="Name" name="Name" v-model="data.Name" label="使用者姓名" />
      </q-card-actions>
      <q-card-actions class="row">
        <div class="form-row"><input class="e-field e-boolcell e-control e-checkbox e-lib" type="checkbox" name="IsEnabled" v-model="data.IsEnabled" />啟用</div>
      </q-card-actions>
    </q-card>

    <q-card style="width: 200px;">
      <q-card-section class="bg-teal text-white">
        <div class="text-subtitle2">授權角色</div>
      </q-card-section>
      <q-separator />
      <q-card-actions>
        <ejs-listbox
          id="RoleNos"
          name="RoleNos"
          :selectionSettings="{ mode: 'Multiple', showCheckbox: true }"
          :dataSource="dsRole"
          :fields="{ text: 'Name', value: 'No' }"
          v-model="data.RoleNos"
        ></ejs-listbox>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import Vue from "vue";
import { DataManager, WebApiAdaptor } from "@syncfusion/ej2-data";
import { ListBoxPlugin, CheckBoxSelection } from "@syncfusion/ej2-vue-dropdowns";
import * as configs from "@/config";

Vue.use(ListBoxPlugin);

export default {
  data() {
    return {
      data: {},
      dsRole: new DataManager({
        url: configs.publicPath + "../role/SelectList",
        adaptor: new WebApiAdaptor(),
        crossDomain: true
      })
    };
  },
  provide: {
    // Injecting CheckBoxSelection module
    listbox: [CheckBoxSelection]
  },
  mounted() {
    // Set initail Focus
    if (this.data.isAdd) {
      this.$refs.No.focus();
    } else {
      this.$refs.Name.focus();
    }
  }
};
</script>
