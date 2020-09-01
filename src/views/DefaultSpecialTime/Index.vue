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
                  <b-button variant="success" @click="onClear">
                    <font-awesome-icon icon="undo" />還原
                  </b-button>
                </b-col>
                <b-col sm="6" class="px-1">
                  <b-button variant="primary" @click="onSave" :disabled="!specialTimeChanged">
                    <font-awesome-icon icon="save" />儲存
                  </b-button>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="10" class="px-1">
              <ejs-schedule
                class="default"
                ref="schDefaultSpecialTime"
                width="100%"
                timezone="Asia/Taipei"
                :showHeaderBar="false"
                :showQuickInfo="false"
                :showTimeIndicator="false"
                startHour="08:00"
                endHour="23:00"
                currentView="Week"
                :workDays="[0, 1, 2, 3, 4, 5, 6]"
                :firstDayOfWeek="1"
                :selectedDate="selectedDate"
                :timeScale="{ interval: 30, slotCount: 3 }"
                :workHours="{ start: '08:00', end: '23:00' }"
                :eventRendered="onEventRendered"
                :eventSettings="eventSettings"
                :dateHeaderTemplate="dateHeaderTemplate"
                :editorTemplate="editorTemplate"
                :actionBegin="actionBegin"
                :resizeStart="resizeStart"
                :dragStop="dragStop"
                :popupOpen="onPopupOpen"
                :dataBinding="onDataBinding"
              >
                <e-views>
                  <e-view option="Week"></e-view>
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
import {
  SchedulePlugin,
  Day,
  Week,
  Resize,
  DragAndDrop
} from "@syncfusion/ej2-vue-schedule";
import {
  DropDownListPlugin,
  CheckBoxSelection
} from "@syncfusion/ej2-vue-dropdowns";
import * as configs from "@/config";
import DateHelper from "@/library/DateHelper";
import editorTemplate from "./DetailEditor";
import tooltipTemplate from "./Tooltip";
import DayHeaderTemplate from "@/components/DayHeaderTemplate";
import BatchModify from "@/library/BatchModify";

// let deleteSpecialTime;
// let specialTime;
Vue.use(CalendarPlugin);
Vue.use(SchedulePlugin);
Vue.use(DropDownListPlugin);
let batchModify = new BatchModify();

// WebApiAdaptor.prototype.beforeSend = function(dm, request, settings) {
//   if (settings.url.lastIndexOf("$batch") > 0) {
//     let urls = settings.url.split("/");
//     if (deleteSpecialTime && settings.type == "POST") {
//       settings.data = null;
//       settings.httpRequest.open(
//         "DELETE",
//         settings.url.split("?")[0] + "/" + deleteSpecialTime.Id,
//         settings.mode
//       );
//     } else {
//       settings.data = JSON.stringify(specialTime);
//       settings.httpRequest.open(
//         settings.type,
//         settings.url.split("?")[0],
//         settings.mode
//       );
//     }
//   }
// };

export default {
  data() {
    return {
      locations: [],
      location: null,
      selectedDate: new Date(2001, 0, 1),
      screenHeight: 100,
      specialTimeChanged: false,
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
      dateHeaderTemplate: function() {
        return {
          template: DayHeaderTemplate
        };
      },
      slotStart: DateHelper.getNextMonthFirst(),
      slotEnd: DateHelper.getNextMonthLast(),
      readonly: true,
      slotNoChanged: true,
      dsLocationCheckItem: []
    };
  },
  provide: {
    schedule: [Day, Week, Resize, DragAndDrop],
    multiselect: [CheckBoxSelection]
  },
  methods: {
    onEventRendered: function(args) {
      switch (args.data.Type) {
        case 0:
          args.element.style.backgroundColor = "#F57F37";
          break;
        case 1:
          args.element.style.backgroundColor = "#ff2020";
          break;
        case 2:
          args.element.style.backgroundColor = "#8e24aa";
          break;
        case 3:
          args.element.style.backgroundColor = "#6e208a";
          break;
        case 10:
          args.element.style.backgroundColor = "#2e20ff";
          break;
      }
    },
    InDateRange(time) {
      let slotStart = new Date(this.year, this.month - 1, 1);
      let slotEnd = DateHelper.getMonthLast(
        new Date(this.year, this.month - 1, 1)
      );
      return time >= slotStart && time <= slotEnd;
    },
    actionFailure: function(args) {
      if (
        args.error != null &&
        args.error.error != null &&
        args.error.error.constructor === XMLHttpRequest
      )
        Swal.fire("伺服器錯誤！", args.error.error.response, "error");
      else if (args.length > 0) {
        let error = args[0].error;
        Swal.fire(
          error.status === 409 ? "驗證錯誤！" : "伺服器錯誤！",
          error.response,
          "error"
        );
      }
    },
    actionBegin: function(args) {
      var specialTime;
      switch (args.requestType) {
        case "eventCreate":
          specialTime = args.data[0];
          if (this.dateRangeOverlaps(specialTime)) {
            Swal.fire("時間區段重疊，無法新增！", "", "info");
            args.cancel = true;
            return;
          }
          this.specialTimeChanged = true;
          specialTime.RoomId = this.location;
          batchModify.insert(specialTime);
          // specialTime.StartTime = timezone.removeLocalOffset(
          //   specialTime.StartTime
          // );
          // specialTime.EndTime = timezone.removeLocalOffset(specialTime.EndTime);
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
          var schDefaultSpecialTime = this.$refs.schDefaultSpecialTime
            .ej2Instances.eventSettings.dataSource;
          var specialTimeIndex = schDefaultSpecialTime.findIndex(
            s => s.Id == specialTime.Id
          );
          schDefaultSpecialTime[specialTimeIndex] = specialTime;
          //fix ej2-schedule bug }

          batchModify.update(specialTime);
          break;
        case "eventRemove":
          batchModify.delete(args.data[0]);
          this.specialTimeChanged = batchModify.hasChanged();
          break;
      }
    },
    resizeStart: function(args) {
      if (args.data.Type == 3) {
        args.cancel = true;
        Swal.fire("直接預約格時間區段會依照檢查時間，無法變更！", "", "info");
      }
    },
    dateRangeOverlaps: function(changeSpecialTime, prevCheck) {
      var schDefaultSpecialTime = this.$refs.schDefaultSpecialTime.ej2Instances.getEvents();
      var checkEndTime = changeSpecialTime.EndTime;
      return schDefaultSpecialTime.some(
        s =>
          s.Id != changeSpecialTime.Id &&
          DateHelper.dateRangeOverlaps(
            s.StartTime,
            s.EndTime,
            changeSpecialTime.StartTime,
            checkEndTime
          ) &&
          (prevCheck != true || s.EndTime >= checkEndTime)
      );
    },
    dragStop: function(args) {
      if (this.dateRangeOverlaps(args.data)) {
        Swal.fire("時間區段重疊，無法變更！", "", "info");
        args.cancel = true;
      }
    },
    onDataBinding: function(args) {
      //
      //因為每次紀錄完event, 會將event id變成字串,
      //所以在這裡將字串的id轉回int, 避免error
      args.result.forEach(i => {
        if (!Number.isInteger(i.Id)) {
          i.Id = parseInt(i.Id);
        }
      });
    },
    onPopupOpen: function(args) {
      if (args.type === "Editor") {
        if (this.dateRangeOverlaps(args.data, true)) {
          Swal.fire("時間區段重疊，無法新增！", "", "info");
          args.cancel = true;
          return;
        }

        if (!Number.isInteger(args.data.Id)) {
          args.data.Id = parseInt(args.data.Id);
        }

        let newArr = Array.from(this.dsLocationCheckItem);
        // newArr.forEach(i => {
        //   if (!Number.isInteger(i.Id)) {
        //     i.Id = parseInt(i.Id);
        //   }
        // });

        args.element.querySelector(
          "#CheckItemId"
        ).ej2_instances[0].dataSource = newArr; //this.dsLocationCheckItem;
        args.element.querySelector(
          "#CheckItemIds"
        ).ej2_instances[0].dataSource = newArr; //this.dsLocationCheckItem;
      }
    },
    onSave: function() {
      this.specialTimeChanged = false;
      let _this = this;
      window.axios
        .put("/room/UpdateDefaultSpecialTimes", batchModify.modifyData)
        .then(() => {
          batchModify.reset();
          Swal.fire({
            type: "success",
            title: "儲存成功！",
            timer: 1500
          });
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
    scheduleFilter: function() {
      let _this = this;
      window.axios
        .get("/room/DefaultSpecialTimes?id=" + this.location)
        .then(e => {
          _this.$refs.schDefaultSpecialTime.ej2Instances.eventSettings.dataSource =
            e.Items;
          _this.specialTimeChanged = false;
          batchModify.reset();
        });
      window.axios
        .get("/room/SpecialTimeCheckItem?id=" + this.location)
        .then(e => {
          _this.dsLocationCheckItem = e.Items;
        });
    }
  },
  watch: {
    location: function() {
      this.scheduleFilter();
    }
  },
  created: function() {
    let _this = this;
    window.axios.get("/room/SelectList").then(e => {
      _this.locations = e.Items;
      _this.location = _this.locations[0].Id;
    });
  }
};
</script>
<style>
.schedule-cell-dimension.e-schedule
  .e-vertical-view
  .e-date-header-wrap
  table
  col,
.schedule-cell-dimension.e-schedule .e-vertical-view .e-content-wrap table col {
  width: 200px;
}

.schedule-cell-dimension.e-schedule
  .e-vertical-view
  .e-time-cells-wrap
  table
  td,
.schedule-cell-dimension.e-schedule .e-vertical-view .e-work-cells {
  height: 100px;
}
</style>
