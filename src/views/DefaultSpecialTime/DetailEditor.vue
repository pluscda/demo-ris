<template>
  <table class="custom-event-editor default" width="100%" cellpadding="6">
    <tbody>
      <tr>
        <td class="e-textlabel" style="width:120px;">時段類型</td>
        <td colspan="3">
          <ejs-dropdownlist
            ref="Type"
            id="Type"
            name="Type"
            class="e-field"
            placeholder="選擇時段類型"
            :validationRules="{ required: true }"
            :fields="{ text: 'label', value: 'value' }"
            :dataSource="[
              { label: '85歲以上優先', value: 0 },
              { label: '停用(維修、保養...)', value: 1 },
              { label: '限制可檢查項目、來源(正向表列)', value: 2 },
              { label: '限制不可檢查項目、來源(負向表列)', value: 3 },
              { label: '檢查項目直接預約格', value: 10 },
              { label: '保留時段', value: 99 }
            ]"
            @change="selectType_change"
            v-model="data.Type"
          ></ejs-dropdownlist>
          <input id="Id" class="e-field e-input" type="text" name="Id" style="display: none;" />
          <input
            id="TypeName"
            class="e-field e-input"
            type="text"
            name="TypeName"
            style="display: none;"
            v-model="data.TypeName"
          />
          <input
            id="CheckItemName"
            class="e-field e-input"
            type="text"
            name="CheckItemName"
            style="display: none;"
          />
        </td>
      </tr>
      <tr v-show="showCheckItemIds">
        <td class="e-textlabel">限制檢查項目</td>
        <td colspan="3">
          <ejs-multiselect
            ref="CheckItemIds"
            id="CheckItemIds"
            name="CheckItemIds"
            class="e-field"
            placeholder="選擇檢查項目"
            :fields="{ text: 'Name', value: 'Id', groupBy: 'CheckCategoryName' }"
            v-model="data.CheckItemIds"
            mode="Box"
            :enableSelectionOrder="false"
            filterBarPlaceholder="搜尋檢查項目"
            :enableGroupCheckBox="true"
          ></ejs-multiselect>
        </td>
      </tr>
      <tr v-show="showCheckItemId">
        <td class="e-textlabel">指定檢查項目</td>
        <td colspan="3">
          <ejs-dropdownlist
            ref="CheckItemId"
            id="CheckItemId"
            name="CheckItemId"
            class="e-field"
            placeholder="指定檢查項目"
            :fields="{ text: 'Name', value: 'Id' }"
            v-model="data.CheckItemId"
            @change="checkItemId_change"
          ></ejs-dropdownlist>
        </td>
      </tr>
      <tr v-show="showSource">
        <td class="e-textlabel">限制就診來源</td>
        <td colspan="2">
          <ejs-multiselect
            ref="ExamineSources"
            id="ExamineSources"
            name="ExamineSources"
            class="e-field"
            placeholder="指定就診來源"
            mode="Box"
            :allowFiltering="false"
            :fields="{ text: 'Name', value: 'Id' }"
            :dataSource="dsExamineSource"
            v-model="data.ExamineSources"
          ></ejs-multiselect>
        </td>
      </tr>
      <tr>
        <td class="e-textlabel">開始時間</td>
        <td colspan="3">
          <ejs-datetimepicker
            ref="StartTime"
            id="StartTime"
            class="e-field"
            name="StartTime"
            v-model="data.StartTime"
            step="5"
            :allowEdit="false"
            :validationRules="{ required: true }"
            :format="customFormat"
            :showClearButton="false"
            :showTodayButton="false"
          ></ejs-datetimepicker>
        </td>
      </tr>
      <tr>
        <td class="e-textlabel">結束時間</td>
        <td colspan="3">
          <ejs-datetimepicker
            ref="EndTime"
            id="EndTime"
            name="EndTime"
            class="e-field"
            step="5"
            :allowEdit="false"
            :min="data.StartTime"
            v-model="data.EndTime"
            :format="customFormat"
            :validationRules="{ required: true }"
            :showClearButton="false"
            :showTodayButton="false"
          ></ejs-datetimepicker>
        </td>
      </tr>
      <tr>
        <td class="e-textlabel">備註</td>
        <td colspan="3">
          <textarea
            id="Description"
            class="e-field e-input"
            name="Description"
            style="width:100%;"
            placeholder="輸入提示備註資訊"
            rows="3"
          ></textarea>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import Vue from "vue";
import { DateTimePickerPlugin } from "@syncfusion/ej2-vue-calendars";
import {
  DropDownListPlugin,
  MultiSelectPlugin,
  CheckBoxSelection
} from "@syncfusion/ej2-vue-dropdowns";
import { CheckBoxPlugin } from "@syncfusion/ej2-vue-buttons";
import { RecurrenceEditorPlugin } from "@syncfusion/ej2-vue-schedule";
import { TextBoxPlugin } from "@syncfusion/ej2-vue-inputs";

Vue.use(TextBoxPlugin);
Vue.use(RecurrenceEditorPlugin);
Vue.use(DropDownListPlugin);
Vue.use(MultiSelectPlugin);
Vue.use(DateTimePickerPlugin);
Vue.use(CheckBoxPlugin);

export default {
  data() {
    return {
      data: {},
      customFormat: "HH:mm",
      dsExamineSource: [
        { Id: 1, Name: "門診" },
        { Id: 2, Name: "健檢" },
        { Id: 3, Name: "急診" },
        { Id: 4, Name: "住院" }
      ],
      showCheckItemId: false,
      showCheckItemIds: false,
      showSource: false,
      endTimeDisabled: true,
      filterBarPlaceholder: ""
    };
  },
  provide: {
    multiselect: [CheckBoxSelection]
  },
  methods: {
    selectType_change: function(e) {
      if (e.itemData == null) return;
      if (e.itemData.value == 2 || e.itemData.value == 3) {
        this.showCheckItemIds = true;
        this.showCheckItemId = false;
        this.showSource = true;
        this.data.ExamineSources = [];
      } else if (e.itemData.value == 10) {
        this.showCheckItemIds = false;
        this.showCheckItemId = true;
        this.data.ExamineSources = [];
        this.showSource = true;
      } else {
        this.showCheckItemIds = false;
        this.showCheckItemId = false;
        this.showSource = e.itemData.value == 0;
        this.SpecialTimeChange();
      }
      this.data.TypeName = e.itemData.label;

      //將string轉成int, db才能存入
      // if (this.data.CheckItemId instanceof String) {
      //   this.data.CheckItemId = parseInt(this.data.CheckItemId);
      // }

      // if (
      //   this.data.CheckItemIds &&
      //   this.data.CheckItemIds.length > 0 &&
      //   this.data.CheckItemIds[0] instanceof String
      // ) {
      //   this.data.CheckItemIds = this.data.CheckItemIds.map(i => {
      //     return parseInt(i);
      //   });
      // }

      // if (
      //   this.data.CheckItemIds &&
      //   this.data.CheckItemIds.length > 0 &&
      //   this.data.CheckItemIds[0] instanceof String
      // ) {
      //   this.data.ExamineSources = this.data.ExamineSources.map(i => {
      //     return parseInt(i);
      //   });
      // }
    },
    checkItemId_change: function(e) {
      if (e.itemData == null) return;
      this.data.CheckItemName = e.itemData.Name;
      this.SpecialTimeChange();
    },
    SpecialTimeChange: function() {
      this.$refs.EndTime.ej2Instances.enabled = this.data.Type != 10;
      if (this.data.Type === 10) {
        var checkItem = this.$refs.CheckItemId.ej2Instances.dataSource.find(
          c => this.data.CheckItemId == c.Id
        );
        if (checkItem) {
          var duration = checkItem.Duration;
          if (this.$refs.StartTime.ej2Instances.value)
            this.data.EndTime = new Date(
              this.$refs.StartTime.ej2Instances.value.getTime() +
                duration * 60000
            );
        }
      }
    }
  },
  watch: {
    "data.StartTime": function(newValue) {
      if (this.data.EndTime < newValue)
        this.data.EndTime.setMinutes(newValue.getMinutes() + 10);
      this.SpecialTimeChange();
    }
  },
  mounted() {
    if (this.data.Type == null) {
      this.$refs.Type.ej2Instances.index = 0;
    }
    this.showCheckItemIds = this.data.Type == 2 || this.data.Type == 3;
    this.showCheckItemId = this.data.Type == 10;
    this.showSource = this.data.Type != 1;

    //將id轉成string, 元件才能判讀;
    if (Number.isInteger(this.data.CheckItemId)) {
      this.data.CheckItemId = this.data.CheckItemId.toString();
    }

    // if (!Number.isInteger(this.data.Id)) {
    //   this.data.Id = parseInt(this.data.Id);
    // }

    if (
      this.data.CheckItemIds &&
      this.data.CheckItemIds.length > 0 &&
      Number.isInteger(this.data.CheckItemIds[0])
    ) {
      this.data.CheckItemIds = this.data.CheckItemIds.map(i => {
        return i.toString();
      });
    }

    // if (
    //   this.data.ExamineSources &&
    //   this.data.ExamineSources.length > 0 &&
    //   Number.isInteger(this.data.ExamineSources[0])
    // ) {
    //   this.data.ExamineSources = this.data.ExamineSources.map(i => {
    //     return i.toString();
    //   });
    // }
  }
};
</script>
<style>
.custom-event-editor .e-date-icon {
  display: none !important;
}
</style>
