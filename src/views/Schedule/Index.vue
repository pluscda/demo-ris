<template>
  <div class="pageLeftContent pb-1">
    <b-card no-body class="mx-1">
      <b-card-header class="bg-primary text-white cardHeader">
        <b-row no-gutters>
          <b-col cols="6">排程總覽</b-col>
        </b-row>
      </b-card-header>
      <b-card-text class="text-left py-1">
        <b-container fluid class="px-1">
          <b-row no-gutters>
            <b-col sm="3" class="px-1">
              <!-- <b-row no-gutters>
                <b-col sm="12" class="px-1">
                  檢查項目
                  <ejs-multiselect
                    v-model="selectCheckItem"
                    :dataSource="checkItems"
                    :fields="{ text: 'Name', value: 'Id' }"
                    placeholder="檢查項目"
                    mode="Box"
                  ></ejs-multiselect>
                </b-col>
              </b-row> -->
              <b-row no-gutters>
                <b-col class="px-1">
                  檢查室
                  <ejs-multiselect
                    v-model="selectLocation"
                    :dataSource="locations"
                    :fields="{ text: 'Name', value: 'Id' }"
                    placeholder="檢查室"
                    mode="Box"
                  ></ejs-multiselect>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="9" class="px-1">
              <ejs-schedule
                ref="schLocation"
                width="100%"
                :timezone="timezone"
                :showHeaderBar="true"
                :showQuickInfo="true"
                currentView="Day"
                :timeScale="{ interval: 30, slotCount: 3 }"
                startHour="08:00"
                endHour="23:00"
                :workDays="[0, 1, 2, 3, 4, 5, 6]"
                :firstDayOfWeek="1"
                :workHours="{ start: '08:00', end: '23:00' }"
                :readonly="true"
                :eventSettings="eventSettings"
                :group="group"
                :navigating="schLocation_navigating"
                :eventRendered="schLocation_eventRendered"
              >
                <e-views>
                  <e-view option="Day"></e-view>
                  <e-view option="Week"></e-view>
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
        </b-container>
      </b-card-text>
    </b-card>
  </div>
</template>
<script>
import Vue from "vue";
import { extend } from "@syncfusion/ej2-base";
import { SchedulePlugin, Day, Week } from "@syncfusion/ej2-vue-schedule";
import * as configs from "@/config";
import DateHelper from "@/library/DateHelper";
import tooltipTemplate from "./Tooltip";
import { hubConnection } from "signalr-no-jquery";
import { TextBoxPlugin } from "@syncfusion/ej2-vue-inputs";
import { MultiSelectPlugin } from "@syncfusion/ej2-vue-dropdowns";

const colorList = ["#ea7a57", "#7fa900", "#5978ee", "#fec200", "#df5286", "#00bdae", "#865fcf", "#1aaa55", "#df5286", "#710193"];
Vue.use(SchedulePlugin);
Vue.use(TextBoxPlugin);
Vue.use(MultiSelectPlugin);

export default {
  data() {
    return {
      sockConnection: null,
      hubProxy: null,
      timezone: "Asia/Taipei",
      checkItems: [],
      // selectCheckItem: [],
      locations: [],
      selectLocation: [],
      currentView: "Day",
      startDate: new Date(),
      endDate: null,
      monthSchedule: [],
      group: {
        enableCompactView: false,
        resources: ["LocationView"]
      },
      dsLocationView: [{ Id: "" }],
      screenHeight: 100,
      eventSettings: {
        dataSource: [],
        fields: {
          id: "id",
          Type: { name: "Type", validation: { required: true } },
          subject: { name: "CheckItemName" },
          description: { name: "Description", validation: { required: true } },
          startTime: { name: "StartTime", validation: { required: true } },
          endTime: { name: "EndTime", validation: { required: true } }
        },
        enableTooltip: true,
        tooltipTemplate: function() {
          return { template: tooltipTemplate };
        }
      }
    };
  },
  provide: {
    schedule: [Day, Week]
  },
  methods: {
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
    schLocation_eventRendered: function(args) {
      if (args.data.status === "free") {
        args.element.style.backgroundColor = "#bfbfbf";
      }

      if (args.data.IsBlock) {
        args.element.style.backgroundColor = "#444444";
      } else {
        args.element.style.backgroundColor = "#EE7700";
      }
    },
    scheduleFilter: function() {
      let _this = this;
      this.$refs.schLocation.ej2Instances.selectedDate = new Date(this.startDate);
      window.axios.get("/schedule/GetUsingTimeSlot?startTime=" + this.startDate.toJSON() + "&endTime=" + this.endDate.toJSON()).then(e => {
        _this.monthSchedule = e.Items;
        _this.$refs.schLocation.ej2Instances.eventSettings.dataSource = extend([], _this.monthSchedule, null, true);
      });
    }
  },
  watch: {
    year: function(newValue, oldValue) {
      this.scheduleFilter(newValue, this.month);
    },
    month: function(newValue, oldValue) {
      this.scheduleFilter(this.year, newValue);
    },
    // selectCheckItem: function(newValue, oldValue) {
    //   let _this = this;
    //   this.$refs.schLocation.ej2Instances.eventSettings.dataSource = extend(
    //     [],
    //     this.monthSchedule.filter(t =>
    //       _this.selectCheckItem.some(c => c == t.CheckItemId)
    //     ),
    //     null,
    //     true
    //   );
    // },
    selectLocation: function(newValue, oldValue) {
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
      localStorage.schedule_selectLocation = this.selectLocation;

      this.$refs.schLocation.ej2Instances.dataBind();
    }
  },
  created: function() {
    let _this = this;

    // this.startDate = DateHelper.getNextMonthFirst();
    this.startDate = new Date();
    this.endDate = new Date(this.startDate);
    this.endDate.setDate(this.startDate.getDate() + 1);
    window.axios.get("/checkItem/SelectList").then(e => {
      if (e != null) {
        _this.checkItems = e.Items;
        // _this.selectCheckItem = _this.checkItems.map(i => i.Id);
      }
    });
    window.axios.get("/room/SelectList").then(e => {
      _this.locations = e.Items;
      //
      //從localStorage讀取上次選取的檢查室
      if (localStorage.schedule_selectLocation && localStorage.schedule_selectLocation != "null") {
        let temp = localStorage.schedule_selectLocation.split(",");
        temp.forEach(i => {
          _this.selectLocation.push(parseInt(i));
        });
      }
      // _this.selectLocation = _this.locations.map(i => i.Id);
      if (_this.selectLocation.length == 0) _this.selectLocation.push(_this.locations[0].Id);
      _this.scheduleFilter(_this.year, _this.month, _this.location);
    });
    if (this.sockConnection == null) {
      this.sockConnection = hubConnection(configs.hubUrl);
      this.hubProxy = this.sockConnection.createHubProxy("bookingHub");
    }
    // set up event listeners i.e. for incoming "message" event
    this.hubProxy.on("scheduleChanged", timeSlot => {
      let startTime = new Date(timeSlot.StartTime);
      if (
        _this.selectLocation.some(l => l.Id == timeSlot.RoomId) &&
        // _this.selectCheckItem.some(i => i.Id == timeSlot.CheckItemId) &&
        _this.startDate <= startTime &&
        _this.endDate >= startTime
      ) {
        _this.scheduleFilter();
      }
      console.log(timeSlot.StartTime);
    });
    // this.sockConnection.events.on("onDisconnect", function() {
    //   setTimeout(function() {
    //     _this.hubProxy.start();
    //   }, 5000); // Restart connection after 5 seconds.you can set the time based your requirement
    // });
    this.sockConnection
      .start({ jsonp: true, transport: ["webSockets"] })
      .done(function(conn) {
        console.log("Now connected, connection ID=" + conn.id);
        console.log("Connected, transport = " + conn.transport.name);
      })
      .fail(function() {
        console.log("Could not connect");
      });
  },
  mounted() {}
};
</script>
