<template>
  <div class="pageLeftContent pb-1">
    <b-card no-body class="mx-1">
      <b-card-header class="bg-primary text-white cardHeader">
        <b-row no-gutters>
          <b-col cols="6">檢查室每週例行排程</b-col>
        </b-row>
      </b-card-header>
      <b-card-text class="text-left py-1">
        <b-container fluid class="px-1">
          <b-row no-gutters>
            <b-col sm="2" class="px-1">
              <b-row no-gutters>
                <b-col sm="12" class="px-1">
                  <ejs-dropdownlist v-model="year" :dataSource="years" floatLabelType="Always" placeholder="時段年份"></ejs-dropdownlist>
                </b-col>
              </b-row>
              <b-row no-gutters>
                <b-col class="px-1">
                  <ejs-dropdownlist v-model="month" :dataSource="months" floatLabelType="Always" placeholder="時段月份"></ejs-dropdownlist>
                </b-col>
              </b-row>
              <b-row no-gutters>
                <b-col class="px-1">
                  <ejs-dropdownlist
                    v-model="location"
                    :dataSource="locations"
                    :fields="{ text: 'Name', value: 'Id' }"
                    floatLabelType="Always"
                    placeholder="檢查室"
                  ></ejs-dropdownlist>
                </b-col>
              </b-row>
              <b-row style="padding: 10px;">
                <b-col sm="6" class="px-2 text-right">
                  <b-button variant="success" @click="onClear"><font-awesome-icon icon="undo" /> 還原</b-button>
                </b-col>
                <b-col sm="6" class="px-1">
                  <b-button variant="primary" @click="onSave" :disabled="!specialTimeChanged"><font-awesome-icon icon="save" /> 儲存</b-button>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="10" class="px-1">
              <ejs-schedule
                ref="schSpecialTime"
                width="100%"
                :showHeaderBar="true"
                :showQuickInfo="false"
                startHour="08:00"
                endHour="23:00"
                currentView="Week"
                timezone="Asia/Taipei"
                :workDays="[0, 1, 2, 3, 4, 5, 6]"
                :firstDayOfWeek="1"
                :selectedDate="selectedDate"
                :timeScale="{ interval: 30, slotCount: 3 }"
                :workHours="{ start: '08:00', end: '23:00' }"
                :eventRendered="onEventRendered"
                :eventSettings="eventSettings"
                :editorTemplate="editorTemplate"
                :actionBegin="actionBegin"
                :popupOpen="onPopupOpen"
                :dragStop="dragStop"
              >
                <e-views>
                  <e-view option="Week"></e-view>
                  <e-view option="Month"></e-view>
                </e-views>
              </ejs-schedule>
            </b-col>
          </b-row>
        </b-container>
      </b-card-text>
    </b-card>
  </div>
</template>
<script>
import Vue from "vue";
import Swal from "sweetalert2";
import { CalendarPlugin } from "@syncfusion/ej2-vue-calendars";
import { SchedulePlugin, Day, Week, Month, Resize, DragAndDrop } from "@syncfusion/ej2-vue-schedule";
import { DropDownListPlugin, CheckBoxSelection } from "@syncfusion/ej2-vue-dropdowns";
import * as configs from "@/config";
import DateHelper from "@/library/DateHelper";
import BatchModify from "@/library/BatchModify";
import editorTemplate from "./DetailEditor";
import tooltipTemplate from "./Tooltip";
import * as lodash from "lodash";
import Common from "@/library/Common";

Vue.use(CalendarPlugin);
Vue.use(SchedulePlugin);
Vue.use(DropDownListPlugin);
let batchModify = new BatchModify();

export default {
  data() {
    return {
      years: [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030],
      year: DateHelper.getNextMonthFirst().getFullYear(),
      months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      month: DateHelper.getNextMonthFirst().getMonth() + 1,
      // devices: [],
      // device: null,
      locations: [],
      location: null,
      selectedDate: new Date(),
      loadStartTime: new Date(),
      loadEndTime: new Date(),
      dsSpecialTimeView: [{ text: "" }],
      screenHeight: 100,
      specialTimeChanged: false,
      dsLocationCheckItem: [],
      eventSettings: {
        dataSource: [],
        fields: {
          id: "Id",
          Type: { name: "Type", validation: { required: true } },
          subject: { name: "TypeName" },
          description: { name: "Description" },
          startTime: { name: "StartTime", validation: { required: true } },
          endTime: { name: "EndTime", validation: { required: true } }
        },
        enableTooltip: true,
        tooltipTemplate: function() {
          return { template: tooltipTemplate };
        }
      },
      editorTemplate: function() {
        return { template: editorTemplate };
      },
      slotStart: DateHelper.getNextMonthFirst()
    };
  },
  provide: {
    schedule: [Day, Week, Month, Resize, DragAndDrop],
    multiselect: [CheckBoxSelection]
  },
  computed: {},
  methods: {
    onEventRendered: function(args) {
      if (args.data.IsDefaultSpecialTime) {
        switch (args.data.Type) {
          case 0:
            args.element.style.backgroundColor = "#F57F37";
            break;
          case 1:
            args.element.style.backgroundColor = "#ff2020";
            break;
          case 2:
            args.element.style.backgroundColor = "#4e8a20";
            break;
          case 3:
            args.element.style.backgroundColor = "#8e24aa";
            break;
          case 10:
            args.element.style.backgroundColor = "#2e20ff";
            break;
        }
      } else {
        switch (args.data.Type) {
          case 0:
            args.element.style.backgroundColor = "#d55F17";
            break;
          case 1:
            args.element.style.backgroundColor = "#df0000";
            break;
          case 2:
            args.element.style.backgroundColor = "#2e6a00";
            break;
          case 3:
            args.element.style.backgroundColor = "#6e048a";
            break;
          case 10:
            args.element.style.backgroundColor = "#0e00df";
            break;
        }
      }
    },
    InDateRange(time) {
      let slotStart = new Date(this.year, this.month - 1, 1);
      let slotEnd = DateHelper.getMonthLast(new Date(this.year, this.month - 1, 1));
      return time >= slotStart && time <= slotEnd;
    },
    actionFailure: function(args) {
      Common.actionFailure(args);
    },
    cloneSpecialTimes: function(specialTime, duration, cloneEndTime) {
      let nextSlotStart = new Date(specialTime.StartTime);
      let nextSlotEnd = new Date(specialTime.EndTime);
      nextSlotStart.setTime(nextSlotStart.getTime() + duration);
      nextSlotEnd.setTime(nextSlotEnd.getTime() + duration);
      while (nextSlotEnd.getTime() <= cloneEndTime) {
        let nextSlot = lodash.cloneDeep(specialTime);
        nextSlot.StartTime = new Date(nextSlotStart);
        nextSlot.EndTime = new Date(nextSlotEnd);
        nextSlot.RepeatRule = null;
        nextSlot.isClone = true;
        this.$refs.schSpecialTime.addEvent(nextSlot);
        nextSlotStart.setTime(nextSlotStart.getTime() + duration);
        nextSlotEnd.setTime(nextSlotEnd.getTime() + duration);
      }
    },
    actionBegin: function(args) {
      var specialTime;
      switch (args.requestType) {
        case "eventCreate":
          specialTime = args.data[0];
          if (this.dateRangeOverlaps(specialTime)) {
            if (!specialTime.isClone) Swal.fire("時間區段重疊，無法新增！", "", "info");
            else specialTime.isClone = null;
            args.cancel = true;
            return;
          }
          this.specialTimeChanged = true;
          specialTime.RoomId = this.location;
          batchModify.insert(specialTime);
          if (specialTime.RepeatRule) {
            // let slotStart = new Date(this.year, this.month - 1, 1);
            let slotEnd = DateHelper.getMonthLast(new Date(this.year, this.month - 1, 1));
            switch (specialTime.RepeatRule) {
              case "DayRepeat":
                this.cloneSpecialTimes(specialTime, 24 * 60 * 60000, slotEnd);
                break;
              case "WeekRepeat":
                this.cloneSpecialTimes(specialTime, 7 * 24 * 60 * 60000, slotEnd);
                break;
            }
          }
          break;
        case "eventChange":
          specialTime = args.data;
          if (this.dateRangeOverlaps(specialTime)) {
            Swal.fire("時間區段重疊，無法變更！", "", "info");
            args.cancel = true;
            return;
          }
          this.specialTimeChanged = true;

          //fix ej2-schedule bug {
          var schSpecialTime = this.$refs.schSpecialTime.ej2Instances.eventSettings.dataSource;
          var specialTimeIndex = schSpecialTime.findIndex(s => s.Id == specialTime.Id);
          schSpecialTime[specialTimeIndex] = specialTime;
          //fix ej2-schedule bug }

          batchModify.update(specialTime);
          break;
        case "eventRemove":
          batchModify.delete(args.data[0]);
          this.specialTimeChanged = batchModify.hasChanged();
          break;
      }
    },
    dateRangeOverlaps: function(changeSpecialTime, prevCheck) {
      var schSpecialTime = this.$refs.schSpecialTime.ej2Instances.getEvents();
      var checkEndTime = changeSpecialTime.EndTime;
      var checkSpecialTime = schSpecialTime.some(
        s =>
          s.IsDefaultSpecialTime != true &&
          s.Id != changeSpecialTime.Id &&
          DateHelper.dateRangeOverlaps(s.StartTime, s.EndTime, changeSpecialTime.StartTime, checkEndTime) &&
          (prevCheck != true || s.EndTime >= checkEndTime)
      );
      if (checkSpecialTime) return true;
      var checkDefaultSpecialTime = schSpecialTime.some(
        s =>
          s.Id != changeSpecialTime.Id &&
          DateHelper.dateRangeOverlaps(s.StartTime, s.EndTime, changeSpecialTime.StartTime, checkEndTime) &&
          (prevCheck != true || s.EndTime >= checkEndTime)
      );
      if (checkDefaultSpecialTime && prevCheck != true) Swal.fire("此排程與每週例行排程重疊，將覆蓋重疊的每週例行排程！", "", "info");
      return false;
    },
    dragStop: function(args) {
      if (!this.InDateRange(args.data.StartTime)) {
        args.cancel = true;
        Swal.fire("目前點擊的時間點超出編輯的月份範圍！", "", "info");
        return;
      }
      if (this.dateRangeOverlaps(args.data)) {
        Swal.fire("時間區段重疊，無法變更！", "", "info");
        args.cancel = true;
      }
      if (args.data.IsDefaultSpecialTime == true) {
        args.cancel = true;
        Swal.fire("每週例行排程，在此作業無法變更！", "", "info");
      }
    },
    onPopupOpen: function(args) {
      if (args.type === "Editor") {
        if (!this.InDateRange(args.data.StartTime)) {
          args.cancel = true;
          Swal.fire("目前點擊的時間點超出編輯的月份範圍！", "", "info");
          return;
        }
        if (this.dateRangeOverlaps(args.data, true)) {
          Swal.fire("時間區段重疊，無法新增！", "", "info");
          args.cancel = true;
          return;
        }
        if (args.data.IsDefaultSpecialTime == true) {
          args.cancel = true;
        } else {
          args.element.querySelector("#CheckItemId").ej2_instances[0].dataSource = this.dsLocationCheckItem;
          args.element.querySelector("#CheckItemIds").ej2_instances[0].dataSource = this.dsLocationCheckItem;
        }
      }
    },
    // removeLocalOffset: function(specialTime) {
    //   let timezone = new Timezone();
    //   specialTime.StartTime = timezone.removeLocalOffset(specialTime.StartTime);
    //   specialTime.EndTime = timezone.removeLocalOffset(specialTime.EndTime);
    // },
    onSave: function() {
      this.specialTimeChanged = false;
      let _this = this;
      window.axios
        .put("/room/UpdateSpecialTimes", batchModify.modifyData)
        .then(() => {
          batchModify.reset();
          Swal.fire({
            type: "success",
            title: "儲存成功！",
            timer: 1500
          });
          _this.scheduleFilter();
        })
        .catch(function(error) {
          _this.specialTimeChanged = true;
          Swal.fire("儲存失敗！", error, "error");
        });
    },
    onClear: function() {
      let _this = this;
      Swal.fire({
        title: "確認還原？",
        text: "這樣將會放棄您本次所有的修改！",
        type: "question",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "確定還原！",
        cancelButtonText: "取消"
      }).then(function(e) {
        if (e.value) {
          _this.scheduleFilter();
        }
      });
    },
    scheduleFilter: function(day) {
      let _this = this;
      window.axios.get("/room/SpecialTimes?id=" + this.location + "&year=" + this.year + "&month=" + this.month).then(e => {
        _this.$refs.schSpecialTime.ej2Instances.eventSettings.dataSource = e.Items;
        if (day) this.selectedDate = day;
        else _this.selectedDate = new Date(_this.year, _this.month - 1, 1);
        _this.specialTimeChanged = false;
        batchModify.reset();
      });
    }
  },
  watch: {
    year: function() {
      let today = new Date();
      var day;
      if (this.year == today.getFullYear() && this.month == today.getMonth() + 1) {
        day = today;
      }
      this.scheduleFilter(day);
    },
    month: function() {
      let today = new Date();
      var day;
      if (this.year == today.getFullYear() && this.month == today.getMonth() + 1) {
        day = today;
      }
      this.scheduleFilter(day);
    },
    location: function(newValue) {
      this.scheduleFilter();
      let _this = this;
      if (newValue)
        window.axios.get("/room/SpecialTimeCheckItem?id=" + newValue).then(e => {
          _this.dsLocationCheckItem = e.Items;
        });
    }
  },
  created: function() {
    window.axios.get("/room/SelectList").then(e => {
      this.locations = e.Items;
      this.location = this.locations[0].Id;
    });
  }
};
</script>
<style></style>
