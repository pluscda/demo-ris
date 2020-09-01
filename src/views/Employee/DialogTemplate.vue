<template>
  <b-container fluid class="mt-1 px-1">
    <b-row no-gutters>
      <b-col sm="8">
        <b-card no-body class="mx-1">
          <b-card-header class="bg-primary text-white cardHeader">
            <b-row no-gutters>
              <b-col cols="6" class="float-left text-left">員工資料</b-col>
            </b-row>
          </b-card-header>
          <b-card-text class="text-left py-1">
            <b-container fluid class="px-1">
              <b-row no-gutters>
                <div formGroup="userForm">
                  <div class="form-row row">
                    <div class="form-group col-md-6">
                      <ejs-textbox ref="No" id="No" name="No" v-model="data.No" type="text" floatLabelType="Always" placeholder="員工編號"></ejs-textbox>
                    </div>
                    <div class="form-group col-md-6">
                      <ejs-textbox ref="Name" id="Name" name="Name" v-model="data.Name" type="text" floatLabelType="Always" placeholder="員工姓名"></ejs-textbox>
                    </div>
                  </div>
                  <div class="form-row row">
                    <div class="form-group col-md-6">
                      <ejs-maskedtextbox
                        id="PhoneNo"
                        name="PhoneNo"
                        v-model="data.PhoneNo"
                        mask="0999-999999"
                        type="text"
                        floatLabelType="Always"
                        placeholder="手機號碼"
                      ></ejs-maskedtextbox>
                    </div>
                    <div class="form-group col-md-6">
                      <ejs-textbox ref="Email" id="Email" name="Email" v-model="data.Email" type="text" floatLabelType="Always" placeholder="電子郵件"></ejs-textbox>
                    </div>
                    <!-- <div class="form-group col-md-6">
                      <ejs-maskedtextbox
                        id="NaturalPerson___PhoneNo4Residence"
                        name="NaturalPerson___PhoneNo4Residence"
                        v-model="data.NaturalPerson.PhoneNo4Residence"
                        mask="(099)9999-9999"
                        type="text"
                        floatLabelType="Always"
                        placeholder="住家電話"
                      ></ejs-maskedtextbox>
                    </div> -->
                  </div>
                  <div class="form-row row">
                    <div class="form-group col-md-6">
                      <ejs-dropdownlist
                        id="InstitutionId"
                        name="InstitutionId"
                        floatLabelType="Always"
                        placeholder="隸屬部門"
                        :fields="{ text: 'Name', value: 'Id' }"
                        v-model="data.InstitutionId"
                      ></ejs-dropdownlist>
                    </div>
                    <div class="form-group col-md-6">
                      <ejs-dropdownlist
                        id="StaffType"
                        name="StaffType"
                        floatLabelType="Always"
                        placeholder="職務"
                        :fields="{ text: 'Name', value: 'No' }"
                        v-model="data.StaffType"
                      ></ejs-dropdownlist>
                    </div>
                  </div>
                  <div class="form-row row">
                    <div class="form-group col-md-6">
                      <ejs-dropdownlist
                        id="StaffStatus"
                        name="StaffStatus"
                        floatLabelType="Always"
                        placeholder="員工狀態"
                        :fields="{ text: 'Name', value: 'No' }"
                        v-model="data.StaffStatus"
                      ></ejs-dropdownlist>
                    </div>
                    <div class="form-group col">
                      <div class="e-float-input">
                        <ejs-checkbox label="啟用" id="IsActive" name="IsActive" :checked="data.IsActive"></ejs-checkbox>
                        <span class="e-float-line"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </b-row>
            </b-container>
          </b-card-text>
        </b-card>
      </b-col>
      <b-col sm="4">
        <b-card no-body class="mx-1">
          <b-card-header class="bg-primary text-white cardHeader">
            <b-row no-gutters>
              <b-col cols="6" class="float-left text-left">授權角色</b-col>
            </b-row>
          </b-card-header>
          <b-card-text class="text-left py-1">
            <ejs-listbox
              id="RoleNos"
              name="RoleNos"
              height="450"
              :selectionSettings="{ mode: 'Multiple', showCheckbox: true }"
              :fields="{ text: 'Name', value: 'No' }"
              v-model="data.RoleNos"
            ></ejs-listbox>
          </b-card-text>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import Vue from "vue";
import { ListBoxPlugin, CheckBoxSelection, DropDownListPlugin } from "@syncfusion/ej2-vue-dropdowns";
import { CheckBoxPlugin } from "@syncfusion/ej2-vue-buttons";
import { TextBoxPlugin, MaskedTextBoxPlugin } from "@syncfusion/ej2-vue-inputs";
import { DatePickerPlugin } from "@syncfusion/ej2-vue-calendars";

Vue.use(ListBoxPlugin);
Vue.use(DropDownListPlugin);
Vue.use(TextBoxPlugin);
Vue.use(MaskedTextBoxPlugin);
Vue.use(CheckBoxPlugin);
Vue.use(DatePickerPlugin);

export default {
  data() {
    return {
      data: {}
    };
  },
  provide: {
    // Injecting CheckBoxSelection module
    listbox: [CheckBoxSelection]
  },
  mounted() {
    // Set initail Focus
    if (this.data.isAdd) {
      this.data.No = "";
      // this.$refs.No.focus();
    } else {
      // this.$refs.Name.focus();
    }
  }
};
</script>
<style>
.col-md-6,
.col-md-3 {
  padding-right: 15px;
  padding-left: 15px;
  padding-top: 5px;
}
</style>
