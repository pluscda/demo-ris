<template>
  <div class="control-section accordion-control-section">
    <b-card no-body class="mx-1">
      <b-card-header class="bg-primary text-white cardHeader">
        <b-row no-gutters>
          <b-col cols="6">角色管理．查詢作業</b-col>
        </b-row>
      </b-card-header>
      <b-card-text class="text-left py-1">
        <b-container fluid class="px-1">
          <b-row no-gutters>
            <b-col sm="2" class="px-1">
              <ejs-textbox
                v-model="No"
                floatLabelType="Always"
                placeholder="病歷編號"
                :showClearButton="true"
                @keyup.enter="onFilter"
              />
            </b-col>
            <b-col sm="2" class="px-1">
              <ejs-textbox
                v-model="Name"
                floatLabelType="Always"
                placeholder="病患姓名"
                :showClearButton="true"
                @keyup.enter="onFilter"
              />
            </b-col>
            <b-col sm="2" class="px-1">
              <ejs-dropdownlist
                v-model="PatientStatus"
                :dataSource="patientStatusType"
                :fields="{ text: 'Name', value: 'No' }"
                floatLabelType="Always"
                placeholder="病患狀態"
                :showClearButton="true"
              ></ejs-dropdownlist>
            </b-col>
            <b-col
              class="px-2 text-right"
              style="display: table; height: 60px;"
            >
              <div style="display: table-cell; vertical-align: middle">
                <b-button variant="success" @click="onClear"
                  ><font-awesome-icon icon="eraser" /> 清除</b-button
                >&nbsp;
                <b-button variant="primary" @click="onFilter"
                  ><font-awesome-icon icon="search" /> 查詢</b-button
                >
              </div>
            </b-col>
          </b-row>
        </b-container>
      </b-card-text>
    </b-card>
  </div>
</template>
<script>
import Vue from "vue";
import { DropDownListPlugin } from "@syncfusion/ej2-vue-dropdowns";
import { TextBoxPlugin } from '@syncfusion/ej2-vue-inputs';

Vue.use(TextBoxPlugin);
Vue.use(DropDownListPlugin);

export default {
  props: ['patientStatusType'],
  data() {
    return {
      No: "",
      Name: "",
      PatientStatus: null
    };
  },
  methods: {
    onFilter: function() {
      this.$emit("filter", this);
    },
    onClear: function() {
      this.No = "";
      this.Name = "";
      this.PatientStatus = null;

      this.$emit("filterClear", this);
    }
  }
};
</script>
