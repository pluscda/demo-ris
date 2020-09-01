<template>
  <div fluid class="px-1">
    <b-row no-gutters v-show="!hasLabRoom">
      <b-col sm="12" class="px-1 mb-2">
        <b-input-group>
          <b-button disabled variant="danger" text-variant="white">此檢查項目尚未設定檢查室, 無法進行預約排程。</b-button>
        </b-input-group>
      </b-col>
    </b-row>

    <b-row no-gutters v-show="hasLabRoom">
      <b-col sm="3" class="px-1 mb-2">
        <b-input-group>
          <b-input-group-prepend>
            <b-button v-if="booked" disabled variant="success">已預約</b-button>
            <b-button v-else variant="success">快速預約</b-button>
          </b-input-group-prepend>
          <b-select
            v-if="booked"
            ref="fastSelect"
            style="background-color:gray; border-color:gray"
            v-model="selectedFastBookingSlot"
            :options="optionsFastBookingSlot"
            :disabled="booked"
            @change="fastBookingSlotChanged"
          />
          <b-select v-else ref="fastSelect" v-model="selectedFastBookingSlot" :options="optionsFastBookingSlot" :disabled="booked" @change="fastBookingSlotChanged" />
        </b-input-group>
      </b-col>
    </b-row>
    <b-row no-gutters v-show="hasLabRoom">
      <!-- <b-col sm="3" class="px-1">
        
        <b-row no-gutters>
          <b-col class="px-1">
            檢查室
            <ejs-multiselect
              :value="selectLocation"
              :dataSource="locations"
              :fields="{ text: 'Name', value: 'Id' }"
              placeholder="檢查室"
              mode="Box"
              readonly="true"
            ></ejs-multiselect>
          </b-col>
        </b-row>
        <infoCard class="q-mt-md" title="病患資訊" :itemInfo="patientInfoArr" />
        <infoCard class="q-mt-md" colorStyle="3" :title="bookStateInfo.title" :itemInfo="bookStateInfo.value" />
      </b-col>-->
      <b-col sm="12" class="px-1">
        <ejs-schedule
          ref="schLocation"
          :height="height"
          :timezone="timezone"
          :showHeaderBar="true"
          :showQuickInfo="false"
          :currentView="currentView"
          :timeScale="{ interval: 30, slotCount: 3 }"
          startHour="08:00"
          endHour="23:00"
          :workDays="[0, 1, 2, 3, 4, 5, 6]"
          :firstDayOfWeek="1"
          :workHours="{ start: '08:00', end: '23:00' }"
          :eventSettings="eventSettings"
          :editorTemplate="editorTemplate"
          :group="group"
          :actionBegin="schLocation_actionBegin"
          :navigating="schLocation_navigating"
          :popupOpen="onPopupOpen"
          :eventRendered="onEventRendered"
        >
          <e-views>
            <e-view option="Day" :eventTemplate="bookingEventTemplate"></e-view>
            <e-view option="Week" :eventTemplate="bookingEventTemplate"></e-view>
          </e-views>
          <e-resources>
            <e-resource
              field="RoomId"
              title="Location Type"
              name="LocationView"
              allowMultiple="true"
              textField="Name"
              idField="Id"
              colorField="color"
              :dataSource="dsLocationView"
            ></e-resource>
          </e-resources>
        </ejs-schedule>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Vue from "vue";
import Swal from "sweetalert2";
import { CalendarPlugin } from "@syncfusion/ej2-vue-calendars";
import { Timezone } from "@syncfusion/ej2-schedule";
import { SchedulePlugin, Day, Week } from "@syncfusion/ej2-vue-schedule";
import { MultiSelectPlugin, CheckBoxSelection } from "@syncfusion/ej2-vue-dropdowns";
import { CheckBoxPlugin } from "@syncfusion/ej2-vue-buttons";
import * as configs from "@/config";
import DateHelper from "@/library/DateHelper";
import tooltipTemplate from "./Tooltip";
import editorTemplate from "./DetailEditor";
import { hubConnection } from "signalr-no-jquery";
import infoCard from "./InfoCard";
import moment from "moment";
import BookingEventTemplate from "@/components/BookingEventTemplate";
import { DataManager, WebApiAdaptor, Predicate, Query } from "@syncfusion/ej2-data";
import { dateFormatMixin } from "@/SupportLib_J.js";

const colorList = ["#ea7a57", "#7fa900", "#5978ee", "#fec200", "#df5286", "#00bdae", "#865fcf", "#1aaa55", "#df5286", "#710193"];
let timezone = new Timezone();

const isToday = someDate => {
  const today = new Date();
  return someDate.getDate() == today.getDate() && someDate.getMonth() == today.getMonth() && someDate.getFullYear() == today.getFullYear();
};

Vue.use(CalendarPlugin);
Vue.use(SchedulePlugin);
Vue.use(MultiSelectPlugin);
Vue.use(CheckBoxPlugin);

export default {
  name: "scheduleView",
  props: ["sockConnection", "hubProxy", "type", "checkItemId", "checkItemNo", "margeCheckItemIds", "checkItemName", "viewDate", "patientInfo"],
  components: {
    infoCard
  },
  mixins: [dateFormatMixin],

  data() {
    return {
      height: "600px",
      timezone: "Asia/Taipei",
      checkItems: [],
      selectCheckItem: [],
      locations: [],
      selectLocation: [],
      patientId: 0,
      currentView: "Week",
      monthSchedule: [],
      startDate: null,
      endDate: null,
      hasLabRoom: true,
      // sockConnection: null,
      // hubProxy: null,
      group: {
        enableCompactView: false,
        resources: ["LocationView"]
      },
      dsLocationView: [{ Id: "" }],
      screenHeight: 100,
      eventSettings: {
        dataSource: [],
        fields: {
          id: "Id",
          subject: { name: "CheckItemName" },
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
      bookTimeStr: null,
      bookStateInfo: {
        title: "預約資訊",
        value: "尚未預約"
      },
      bookingEventTemplate: function() {
        return {
          template: BookingEventTemplate
        };
      },
      //
      //快速預約 屬性參數
      selectedFastBookingSlot: null,
      optionsFastBookingSlot: [],
      booked: false
    };
  },
  computed: {
    patientInfoArr: function() {
      let info = [
        {
          label: "病患姓名",
          value: this.patientInfo.name
        },
        {
          label: "身分證號",
          value: this.patientInfo.id
        },
        {
          label: "性別",
          value: this.patientInfo.gender
        },
        {
          label: "生日",
          value: moment(this.patientInfo.birthDay).format("YYYY/MM/DD")
        },
        {
          label: "病歷號碼",
          value: this.patientInfo.hrNum
        },
        {
          label: "申請單號",
          value: this.patientInfo.orderNo
        }
      ];

      return info;
    }
  },
  provide: {
    schedule: [Day, Week],
    multiselect: [CheckBoxSelection]
  },
  methods: {
    onEventRendered: function(args) {
      if (args.data.PatientId == this.patientInfo.hrNum) {
        args.element.style.backgroundColor = "#FF8C00";
        // args.element.style.color = "#FFFFFF";
        // switch (args.data.Type) {
        //   case 0:
        //     args.element.style.backgroundColor = "#F57F37";
        //     break;
        //   case 1:
        //     args.element.style.backgroundColor = "#ff2020";
        //     break;
        //   case 2:
        //     args.element.style.backgroundColor = "#4e8a20";
        //     break;
        //   case 3:
        //     args.element.style.backgroundColor = "#8e24aa";
        //     break;
        //   case 10:
        //     args.element.style.backgroundColor = "#2e20ff";
        //     break;
        // }
      } else if (args.data.Id > 0) {
        args.element.style.backgroundColor = "#BA55D3";
      } else {
        args.element.style.backgroundColor = "#2e6a00";
        // switch (args.data.Type) {
        //   case 0:
        //     args.element.style.backgroundColor = "#d55F17";
        //     break;
        //   case 1:
        //     args.element.style.backgroundColor = "#df0000";
        //     break;
        //   case 2:
        //     args.element.style.backgroundColor = "#2e6a00";
        //     break;
        //   case 3:
        //     args.element.style.backgroundColor = "#6e048a";
        //     break;
        //   case 10:
        //     args.element.style.backgroundColor = "#0e00df";
        //     break;
        // }
      }
    },
    setFocusOnSchedule() {
      this.$refs.schLocation.focus();
    },
    addTimeSlot: function(slot) {
      if (this.dateRangeOverlaps(slot)) {
        Swal.fire("時間區段重疊，無法新增！", "", "info");
        return false;
      } else if (slot.StartTime < new Date()) {
        Swal.fire("時間區段已過時，無法新增！", "", "info");
        return false;
      } else if (isToday(slot.StartTime)) {
        if (slot.StartTime.getHours() < 12) {
          Swal.fire("當日上午時段無法新增！", "", "info");
          return false;
        } else if (new Date().getHours() >= 12) {
          Swal.fire("當日時段已無法新增！", "", "info");
          return false;
        }
      }

      let _this = this;
      slot.Type = 0;
      slot.StartTime = timezone.removeLocalOffset(slot.StartTime);
      slot.EndTime = timezone.removeLocalOffset(slot.EndTime);
      slot.CheckItemNo = this.checkItemNo;
      slot.CheckItemId = this.checkItemId;
      slot.CheckItemName = this.checkItemName;
      slot.MargeCheckItemIds = this.margeCheckItemIds;
      slot.OrderNo = this.patientInfo.orderNo;
      slot.PatientId = this.patientInfo.hrNum;
      slot.FromHis = this.$route.query.token != null;

      this.hubProxy
        .invoke("addTimeSlot", slot)
        .then(e => {
          if (e.Success) {
            // if (_this.$route.params.checkItemNo == null) _this.$emit("close");
            // else _this.scheduleFilter();
            _this.$emit("AddTimeSlot", slot);
            this.bookTimeStr = slot.StartTime.toLocaleString("zh-TW", {
              timeZone: "UTC"
            });
            Swal.fire({
              type: "success",
              title: "預約成功！",
              html:
                "姓名：<b>" +
                _this.patientInfo.name +
                "</b><br>預約時間：<b>" +
                this.bookTimeStr +
                //slot.StartTime.toLocaleString("zh-TW", { timeZone: "UTC" }) +
                "</b>"
            });
            // this.$refs.schLocation.ej2Instances.readonly = true;
            // this.scheduleFilter();
            this.DisableScheduler();
            this.bookStateInfo.value = this.bookTimeStr;
          } else {
            _this.$emit("Refresh");
            Swal.fire(e.Message, "", "info");
          }
        })
        .fail(function(error) {
          console.log(error);
        });
    },
    EnableAndFilterScheduler() {
      this.$refs.schLocation.ej2Instances.readonly = false;
      this.scheduleFilter();
      this.booked = false;
      this.selectedFastBookingSlot = null;
      this.getOptionsFastBookingSlot();
    },
    DisableScheduler() {
      this.$refs.schLocation.ej2Instances.readonly = true;
      this.scheduleFilter();
      this.booked = true;
    },
    /*schLocation_actionBegin: function(args) {
      switch (args.requestType) {
        case "viewNavigate":
          break;
        case "eventCreate":
          var slot = args.data[0];
          this.addTimeSlot(slot);
          break;
        case "eventChange":
          var slot = args.data;
          this.addTimeSlot(slot);
      }
    },*/
    schLocation_actionBegin: function(args) {
      if (args.requestType == "eventCreate") {
        let slot = args.data[0];
        if (this.addTimeSlot(slot) == false) args.cancel = true;
      } else if (args.requestType == "eventChange") {
        let slot = args.data;
        if (this.addTimeSlot(slot) == false) args.cancel = true;
      }
    },
    schLocation_navigating: function(e) {
      switch (e.action) {
        case "date":
          this.startDate = e.currentDate;
          break;
        case "view":
          this.currentView = e.currentView;
          break;
      }
      if (this.currentView == "Day") {
        this.endDate.setDate(this.startDate.getDate() + 1);
      } else if (this.currentView == "Week") {
        this.startDate = DateHelper.getWeekFist(this.startDate, false);
        this.endDate = DateHelper.getWeekLast(this.startDate, false);
      }
      this.scheduleFilter();
    },
    // schLocation_eventRendered: function(args) {
    //   if (args.data.status === "free") {
    //     args.element.style.backgroundColor = "#bfbfbf";
    //   }
    // },
    /*dateRangeOverlaps: function(changeTime, prevCheck) {
      var schLocationTimeSlot = this.$refs.schLocation.ej2Instances.getEvents();
      return schLocationTimeSlot.some(
        s =>
          s.Id != changeTime.Id &&
          s.RoomId == changeTime.RoomId[0] &&
          DateHelper.dateRangeOverlaps(
            s.StartTime,
            s.EndTime,
            changeTime.StartTime,
            changeTime.EndTime
          ) &&
          (prevCheck != true || s.EndTime >= changeTime.EndTime)
      );
    },*/
    dateRangeOverlaps: function(changeTime, prevCheck) {
      var schLocationTimeSlot = this.$refs.schLocation.ej2Instances.getEvents();
      return schLocationTimeSlot.some(
        s =>
          (s.IsBlock || s.IsReadonly) &&
          (s.RoomId == changeTime.RoomId[0] || s.RoomId == changeTime.RoomId) &&
          DateHelper.dateRangeOverlaps(s.StartTime, s.EndTime, changeTime.StartTime, changeTime.EndTime) &&
          (prevCheck != true || s.EndTime >= changeTime.EndTime)
      );
    },
    onPopupOpen: function(args) {
      if (args.type === "Editor") {
        // let lstCheckItemId = args.element.querySelector("#CheckItemId")
        //   .ej2_instances[0];
        // lstCheckItemId.dataSource = this.checkItems;
        var checkItem = null;
        switch (this.type) {
          case "combo":
            args.data.CheckItemId = "c" + this.selectCheckItem;
            checkItem = this.checkItems.find(i => i.Id == args.data.CheckItemId);
            break;
          case "item":
            checkItem = this.checkItems.find(i => i.Id == args.data.CheckItemId);
            break;
          case "fix":
            var mergeCheckItemIds = args.data.MargeCheckItemIds.split(",");
            checkItem = this.checkItems.find(i => i.Id == mergeCheckItemIds[0]);
            break;
        }
        let labCheckItemName = args.element.querySelector("#CheckItemName");
        labCheckItemName.innerText = this.checkItemName;
        let labAccessionNo = args.element.querySelector("#AccessionNo");
        labAccessionNo.innerText = this.patientInfo.orderNo;
        let labDuration = args.element.querySelector("#Duration");
        labDuration.value = checkItem.Duration;
        // lstCheckItemId.value = args.data.CheckItemId;

        // var schLocationTimeSlot = this.$refs.schLocation.ej2Instances.getEvents();
        if (this.dateRangeOverlaps(args.data, true)) {
          Swal.fire("該時段已被預約，無法新增！", "", "info");
          args.cancel = true;
          return;
        }

        args.element.querySelector("#EndTime").ej2_instances[0].value = args.data.EndTime = new Date(args.data.StartTime.getTime() + checkItem.Duration * 60000);

        if (args.data.RoomId) {
          // args.element.querySelector("#LocationName").innerText = this.dsLocationView.find(
          //   l => l.Id == args.data.RoomId
          // ).Name;
          args.element.querySelector("#RoomId").ej2_instances[0].dataSource = this.dsLocationView;
          // args.data.RoomId = args.data.RoomId[0];
        }

        let btnDelete = args.element.querySelector(".e-event-delete");
        btnDelete.style.display = "none";
        let btnSave = args.element.querySelector(".e-event-save");
        btnSave.innerText = "預約";
      }
    },
    scheduleFilter: function() {
      let _this = this;
      this.$refs.schLocation.ej2Instances.selectedDate = new Date(this.startDate);
      window.axios
        .get(
          "/schedule/GetFreeTimeSlot?type=" +
            this.type +
            "&checkItemId=" +
            this.checkItemId +
            "&startTime=" +
            this.startDate.toJSON() +
            "&endTime=" +
            this.endDate.toJSON() +
            "&patientBirthDay=" +
            this.patientInfo.birthDay
        )
        .then(e => {
          _this.$refs.schLocation.ej2Instances.eventSettings.dataSource = e.Items;
        });
    },
    //
    //取得快速預約可選項目
    async getOptionsFastBookingSlot() {
      console.log(this.$logs());

      //
      let _this = this;
      let itemPack = null;
      let convertedCollections = [{ value: null, text: "請選擇" }];
      //
      let subPath = "../schedule/GetFreeTimeSlotList";
      let params = "?type=" + this.type + "&checkItemId=" + this.checkItemId + "&checkItemNo=" + this.checkItemNo + "&patientBirthDate=" + this.patientInfo.birthDay;

      //
      // this.ObjApp.WaitingShow();
      let opStatus = false;
      //
      await new DataManager({
        url: configs.publicPath + subPath + params,
        adaptor: new WebApiAdaptor(),
        crossDomain: true
      })
        .executeQuery(new Query())
        .then(r => {
          itemPack = r.actual; //資料;
          opStatus = true;
        });

      let index = 0;
      itemPack.forEach(i => {
        let dateString = _this.DateToString(i.StartTime, true);
        let locationName = i.LocationName;
        let collection = {
          value: index,
          text: dateString + " " + locationName,
          slot: i
        };
        convertedCollections.push(collection);
        index++;
      });
      this.optionsFastBookingSlot = convertedCollections;

      // this.ObjApp.WaitingHide();
      //
      if (opStatus) {
        // this.ObjApp.TimingMessage('資料已完成存檔作業')
      } else {
        // this.ObjApp.TimingMessage("! 請稍後再試.", 2);
      }
    },
    fastBookingSlotChanged(x) {
      this.optionsFastBookingSlot.some(i => {
        if (i.value === x) {
          this.addTimeSlot(i.slot);
          return true;
        }
      });
    },
    //
    //觸發翻上一週功能鍵
    triggerGoPrevious() {
      let _this = this;
      this.$refs.schLocation.$el.focus();
      let btn = window.$(".e-toolbar-item.e-prev.e-tbtn-align.e-overflow-show").find("button");
      if (btn) {
        this.$nextTick(() => {
          btn[0].click();
        });
      }
    },
    //
    //觸發翻下一週功能鍵
    triggerGoNext() {
      let _this = this;
      this.$refs.schLocation.$el.focus();
      let btn = window.$(".e-toolbar-item.e-next.e-tbtn-align.e-overflow-show").find("button");
      if (btn) {
        this.$nextTick(() => {
          btn[0].click();
        });
      }
    }
  },
  watch: {
    selectLocation: function(newValue) {
      this.dsLocationView = [];
      let _this = this;
      this.locations.forEach(item => {
        if (newValue.some(l => l == item.Id))
          _this.dsLocationView.push({
            Id: item.Id,
            Name: item.Name,
            color: colorList[_this.dsLocationView.length % 10]
          });
      });
      // this.$refs.schLocation.ej2Instances.dataBind();
    }
  },
  created: function() {
    this.startDate = this.viewDate;
    this.endDate = new Date(this.startDate);
    this.endDate.setDate(this.startDate.getDate() + 1);

    //預設以週排程 view呈現, 起始日期計算:
    this.startDate = DateHelper.getWeekFist(this.startDate, false);
    this.endDate.setDate(this.startDate.getDate() + 7);

    let _this = this;
    window.axios.get("/checkItem/ForSpecialTime?includeCombo=true").then(e => {
      _this.checkItems = e.Items;
      _this.selectCheckItem = _this.checkItemId;

      window.axios.get("/checkItem/Room?type=" + _this.type + "&id=" + _this.checkItemId).then(e => {
        _this.locations = e.Items;
        //沒有檢查室旗標切換
        if (_this.locations.length == 0) {
          _this.hasLabRoom = false;
        } else {
          _this.hasLabRoom = true;
        }
        _this.selectLocation = _this.locations.map(l => l.Id);
        _this.scheduleFilter();
      });
    });
    window.axios.get("/schedule/BookingInfo?orderNo=" + _this.patientInfo.orderNo + "&margeCheckItemIds=" + _this.margeCheckItemIds).then(e => {
      _this.booked = _this.$refs.schLocation.ej2Instances.readonly = e.length > 0;
      _this.bookStateInfo.value = "";
      e.forEach(i => {
        _this.bookStateInfo.value += "預約檢查項目:" + i.CheckItemName + "<br>預約檢查時間:" + _this.$moment(i.StartTime).format("YYYY/MM/DD HH:mm") + "<br>";
      });
    });

    // if (this.sockConnection == null) {
    //   this.sockConnection = hubConnection(configs.hubUrl);
    //   this.hubProxy = this.sockConnection.createHubProxy("bookingHub");
    //   // this.sockConnection.disconnected(() => {
    //   //   alert("hubconnection 斷線");
    //   // });
    // }

    // set up event listeners i.e. for incoming "message" event
    this.hubProxy.on("scheduleChanged", timeSlot => {
      let startTime = new Date(timeSlot.StartTime);
      if (
        _this.selectLocation.some(l => l.Id == timeSlot.RoomId) &&
        _this.selectCheckItem.Id == timeSlot.CheckItemId &&
        _this.startDate <= startTime &&
        _this.endDate >= startTime
      ) {
        _this.scheduleFilter();
      }
      console.log(timeSlot.StartTime);
    });

    // // connect
    // this.sockConnection
    //   .start({ jsonp: true, transport: ["webSockets"] })
    //   .done(function(conn) {
    //     console.log("Now connected, connection ID=" + conn.id);
    //     console.log("Connected, transport = " + conn.transport.name);
    //   })
    //   .fail(function(e) {
    //     console.log("Could not connect");
    //   });

    this.height = window.innerHeight - 190 + "px";
    //
    //取得快速預約slots
    this.getOptionsFastBookingSlot();
  },
  mounted: function() {},
  beforeDestroy: function() {
    // this.sockConnection.stop();
  }
};
</script>
