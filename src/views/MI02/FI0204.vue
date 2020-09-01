<template>
  <div class="pageContent zhTW" style="min-height:829px;">
    <b-card no-body class="mx-1">
      <b-card-header class="bg-primary text-white cardHeader">
        <b-row no-gutters>
          <b-col cols="6" class="float-left text-left">藥品耗材查詢作業</b-col>
        </b-row>
      </b-card-header>

      <b-card-text class="text-left py-1">
        <b-container fluid class="px-1">
          <b-row no-gutters>
            <b-col sm="2" class="px-1">
              <b-input-group prepend="產製報表方式">
                <b-form-radio-group
                  class="pt-2 pl-2 rounded-right"
                  style="border:1px solid #ced4da"
                  v-model="ReportType"
                  v-on:change="changeShow"
                >
                  <b-form-radio value="A">產製日月報表明細</b-form-radio>
                  <b-form-radio value="B">檢查室使用耗材明細</b-form-radio>
                  <b-form-radio value="C">藥品耗材使用明細</b-form-radio>
                </b-form-radio-group>
              </b-input-group>
            </b-col>
            <b-col sm="2" class="px-1" v-if="ReportType=='A'">
              <b-input-group prepend="年度">
                <b-select :options="YearList" />
              </b-input-group>
            </b-col>
            <b-col sm="2" class="px-1" v-if="ReportType=='A'">
              <b-input-group prepend="月份">
                <b-select :options="MonthList" />
              </b-input-group>
            </b-col>
            <b-col sm="2" class="px-1" v-if="ReportType=='B'">
              <b-input-group prepend="檢查室">
                <!-- v-model="checkQuery.Location" -->
                <b-select :options="optionsLocationSource" />
              </b-input-group>
            </b-col>
            <b-col sm="2" class="px-1" v-if="ReportType=='C'">
              <b-input-group>
                <b-input-group-text slot="prepend" list="my-list-id" class="field-Must">藥品耗材</b-input-group-text>
                <!-- v-on:submit.prevent="Filter" -->
                <!--  v-on:blur="Filter" -->
                <b-form-input
                  v-on:keyup.enter="Fliter"
                  v-model.lazy="medicineList.selectedItem"
                  list="my-list-id"
                ></b-form-input>
                <!--  :disabled="medicineDisable" -->
                <datalist id="my-list-id">
                  <option
                    v-for="(optionsItem, idx) in medicineList"
                    v-bind:key="optionsItem.idx"
                  >{{ optionsItem.No }}--{{ optionsItem.Name }}--{{ optionsItem.SubName }}</option>
                </datalist>
              </b-input-group>
            </b-col>
            <b-col sm="2" class="px-1" v-if="ReportType=='B' || ReportType=='C'">
              <b-input-group prepend="日期區間" style="width:340px">
                <div id="CheckDataPicker" class="form-control" style="padding: 0px 0px ;">
                  <ejs-daterangepicker :strictMode="true" v-model="CheckDateRange"></ejs-daterangepicker>
                </div>
              </b-input-group>
            </b-col>
          </b-row>

          <b-row no-gutters class="mt-1">
            <b-col class="px-1 text-right">
              <!-- @click="clear" -->
              <b-button variant="success">
                <font-awesome-icon icon="eraser" />清除條件
              </b-button>&nbsp;
              <!-- @click="getQueryBtn" -->
              <b-button variant="primary">
                <font-awesome-icon icon="search" />進行查詢
              </b-button>&nbsp;
            </b-col>
          </b-row>
        </b-container>
      </b-card-text>
    </b-card>

    <b-container fluid class="mt-1 px-1">
      <b-row no-gutters>
        <b-col>
          <div
            id="block4QueryResult"
            class="mr-1 rounded"
            style="border:1px solid #ced4da; min-height:690px;"
            v-if="ReportType=='A'"
          >
            <twp
              ref="twp1"
              v-bind:FieldConfig="dayMonthReport"
              :DataFetch="getFliterData"
              :isBackEndPagination="true"
              :onRowdbClick="medicineinput"
            ></twp>
          </div>
          <!-- <div
            id="block4QueryResult"
            class="mr-1 rounded"
            style="border:1px solid #ced4da; min-height:690px;"
            v-if="ReportType=='B'"
          >
            <twp
              ref="twp1"
              v-bind:FieldConfig="tableConfig4QueryResult"
              :DataFetch="getFliterData"
              :isBackEndPagination="true"
              :onRowdbClick="medicineinput"
            ></twp>
          </div>
          <div
            id="block4QueryResult"
            class="mr-1 rounded"
            style="border:1px solid #ced4da; min-height:690px;"
            v-if="ReportType=='C'"
          >
            <twp
              ref="twp1"
              v-bind:FieldConfig="tableConfig4QueryResult"
              :DataFetch="getFliterData"
              :isBackEndPagination="true"
              :onRowdbClick="medicineinput"
            ></twp>
          </div>-->
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Vue from "vue";
import twp from "@/components/TWPv5_1";
import { Dialog, AppBar } from "muse-ui";
var moment = require("moment");
import {
  DataManager,
  WebApiAdaptor,
  Predicate,
  Query
} from "@syncfusion/ej2-data";
import * as configs from "@/config";
import { DateRangePickerPlugin } from "@syncfusion/ej2-vue-calendars";
import Swal from "sweetalert2";

// 載入模組:KeyPressIdentifier
import KeyPressIdentifier from "@/assets/KeyPressIdentifier";

//for booking (must import and css have some trobule...)
// import "muse-ui/dist/muse-ui.css";

Vue.use(AppBar);
Vue.use(Dialog);
Vue.use(DateRangePickerPlugin);

export default {
  name: "home",
  components: { twp },
  data() {
    return {
      //日月報表資料
      dayMonthReport: [
        {
          key: "MedicationNo",
          label: "代碼",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "MedicationName",
          label: "藥品名稱",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "SubName",
          label: "子類別",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "sex",
          label: "註記",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "Total",
          label: "總計",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "day1",
          label: "1",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "day2",
          label: "2",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "day3",
          label: "3",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "day4",
          label: "4",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "day5",
          label: "5",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "day6",
          label: "6",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "day7",
          label: "7",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "day8",
          label: "8",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "day9",
          label: "9",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "day10",
          label: "10",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "day11",
          label: "11",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "day12",
          label: "12",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "day13",
          label: "13",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "day14",
          label: "14",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "day15",
          label: "15",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "day16",
          label: "16",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "day17",
          label: "17",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "day18",
          label: "18",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "day19",
          label: "19",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "day20",
          label: "20",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "day21",
          label: "21",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "day22",
          label: "22",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "day23",
          label: "23",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "day24",
          label: "24",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "day25",
          label: "25",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "day26",
          label: "26",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "day27",
          label: "27",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "day28",
          label: "28",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "day29",
          label: "29",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "day30",
          label: "30",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "day31",
          label: "31",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        }
      ],
      //報告樣板
      ReportType: null,
      //檢查室選單
      optionsLocationSource: [],
      //年下拉選單
      YearList: [],
      MonthList: [],
      //藥品下拉選單
      medicineList: [],
      ObjApp: null,
      optionsCheckItem: [],
      //日期區間
      OpenDateRange: ["", ""],
      //檢查起訖日
      CheckDateRange: ["", ""],
      //按鈕顯示
      checkinBtn: false,
      CancelBtn: false,
      changeBtn: false,
      //選擇檢查室
      choice_room: [],
      //Modal上的檢查室資料
      room_list: [],
      //病患檢查項目
      PatientcheckItem_List: [],
      //病患今日檢查項目類型:0.無檢查1.今日有檢查3.有檢查不再今日
      checkTypeList: "A",
      //HostoryModel
      HistoryModel: {
        //預計檢查時間
        ScheduleTime: "",
        //櫃台報到時間
        CounterRegister: "",
        //開始檢查時間
        ProcedureStart: "",
        //檢查完畢時間
        ProcedureCompleted: "",
        //取消檢查時間及原因
        CancelDescription: "",
        //取消檢查時間
        CancelTime: ""
      }
    };
  },
  computed: {},
  methods: {
    //更改Radio時 同步變動輸入的資料以及
    changeShow() {
      this.$nextTick(() => alert(this.ReportType));
    },
    Fliter() {
      let tempList = [];
      let queryStr = this.medicineList.selectedItem;
      let strlength = queryStr.length;

      this.TempoptionsItems.forEach(x => {
        let str = "";
        str = str + x.No + "--" + x.Name + "--" + x.SubName;
        if (str.substring(0, strlength) == queryStr) {
          tempList.push(x);
        }
      });

      setTimeout(x => {
        this.$nextTick(() => {
          this.medicineList.optionsItems = tempList;
          if (queryStr == "") {
            this.medicineList.optionsItems = this.TempoptionsItems;
          }
        });
      }, 500);

      //需特別判斷 無輸入資料時

      // console.log(this.medicineList.optionsItems[0]);
      // this.medicineList.optionsItems.forEach(x => {
      //   // if (x.value) {
      //   console.log(x.No);
      //   // }

      //   // if (res.substring(0, strlength) == queryStr) {
      //   //   tempList.push(x);
      //   // }
      //   // console.log(res.substring(0, 4));
      // });
      // console.log(tempList);
      // this.medicineList.optionsItems = tempList;
    },
    //取得檢查室相關資料
    getRoomAPI() {
      let i = 0;
      this.choice_room.forEach(async x => {
        let ProcedureCode = x.ProcedureCode;
        let itemPack = null;
        let convertedCollections = [{ value: null, text: "請選擇" }];
        //
        let subPath = "../checkItem/NonScheduleRoom" + "?no=" + ProcedureCode;
        //
        await new DataManager({
          url: configs.publicPath + subPath,
          adaptor: new WebApiAdaptor(),
          crossDomain: true
        })
          .executeQuery(new Query())
          .then(r => {
            itemPack = r.actual; //資料;
          });

        itemPack.Items.forEach(i => {
          let collection = { value: i.No, text: i.Name };
          convertedCollections.push(collection);
        });
        x.rommselect = "";
        x.roomList = convertedCollections;
        this.$set(this.choice_room, i, x);
        ++i;
      });
      console.log(this.choice_room);
    },
    //取得檢查項目列表
    async GetOptionsCheckItem() {
      console.log(this.$logs());
      //
      let itemPack = null;
      let convertedCollections = [{ value: null, text: "請選擇" }];
      //
      let subPath = "../checkItem/SelectNoList";
      //
      await new DataManager({
        url: configs.publicPath + subPath,
        adaptor: new WebApiAdaptor(),
        crossDomain: true
      })
        .executeQuery(new Query())
        .then(r => {
          itemPack = r.actual; //資料;
        });

      itemPack.Items.forEach(i => {
        let collection = { value: i.No, text: i.Name };
        convertedCollections.push(collection);
      });
      this.optionsCheckItem = convertedCollections;
    },
    //取得病患來源列表
    async GetOptionsPatientSource() {
      console.log(this.$logs());
      //
      let itemPack = null;
      let convertedCollections = [{ value: null, text: "請選擇" }];
      //
      let subPath = "../GeneralData/SelectNoList?groupNo=PatientSource";
      //
      await new DataManager({
        url: configs.publicPath + subPath,
        adaptor: new WebApiAdaptor(),
        crossDomain: true
      })
        .executeQuery(new Query())
        .then(r => {
          itemPack = r.actual; //資料;
        });

      itemPack.Items.forEach(i => {
        let collection = { value: i.No, text: i.Name };
        convertedCollections.push(collection);
      });
      this.optionsPatientSource = convertedCollections;
    },
    //檢查室清單
    async GetLocationSource() {
      console.log(this.$logs());
      //
      let itemPack = null;
      let convertedCollections = [{ value: null, text: "請選擇" }];
      //
      let subPath = "../Room/SelectNoList";
      //
      await new DataManager({
        url: configs.publicPath + subPath,
        adaptor: new WebApiAdaptor(),
        crossDomain: true
      })
        .executeQuery(new Query())
        .then(r => {
          itemPack = r.actual; //資料;
        });

      itemPack.Items.forEach(i => {
        let collection = { value: i.No, text: i.Name };
        convertedCollections.push(collection);
      });
      this.optionsLocationSource = convertedCollections;
    },
    //取得報到狀態的清單
    async GetStatusSource() {
      console.log(this.$logs());
      //
      let itemPack = null;
      let convertedCollections = [{ value: null, text: "請選擇" }];
      //
      let subPath = "../GeneralData/SelectNoList" + "?groupNo=ExamState";
      //
      await new DataManager({
        url: configs.publicPath + subPath,
        adaptor: new WebApiAdaptor(),
        crossDomain: true
      })
        .executeQuery(new Query())
        .then(r => {
          itemPack = r.actual; //資料;
        });

      itemPack.Items.forEach(i => {
        let collection = { value: i.No, text: i.Name };
        convertedCollections.push(collection);
      });

      let _tempList = [];
      convertedCollections.forEach(x => {
        _tempList.push(x);
      });

      this.CheckinStatusSource = this.$DeepCopy(_tempList);
      //綜合查詢的Source
      this.TotalStatusSource = this.$DeepCopy(convertedCollections);
    },
    //取得藥品下拉選單
    async GetMedicationList() {
      let convertedCollections = [{ value: null, text: "請選擇" }];
      //打API並塞入所有藥品
      let subPath = "../medication/ExamMedicationList";
      await new DataManager({
        url: configs.publicPath + subPath,
        adaptor: new WebApiAdaptor(),
        crossDomain: true
      })
        .executeQuery(new Query().sortBy("Id"))
        .then(r => {
          let data = r.result; //資料;

          data.forEach(i => {
            let collection = {
              No: i.No,
              Name: i.Name,
              SubName: i.SubName
            };
            convertedCollections.push(collection);
          });
          this.TempoptionsItems = convertedCollections;
          this.medicineList = convertedCollections;
        });
    }
  },
  created() {
    //取得打API時 需 Hold住畫面的Mehtod
    let methodName = "created";
    console.log(this.$logs(null, methodName));

    // 取得 App.vue 參照
    let obj = this.$GetApp(this);
    if (obj) {
      this.ObjApp = obj[0];
      this.VueNestLevel = obj[1];
    } else {
      console.log(this.$logs("Fail to get App.vue ref.", methodName));
    }
    // 宣告監聽器:攔截 KeyPress
    window.addEventListener("keydown", this.HKWatch);
    //

    //病患來源下拉選單
    this.GetOptionsPatientSource();
    //檢查室下拉選單
    this.GetLocationSource();
    //取得藥品資料
    this.GetMedicationList();
    //病患狀態下拉選單
    //focus到病歷編號上
    //新增年度下拉選單
    let year = new Date().getFullYear();
    for (let i = -2; i <= 2; i++) {
      this.YearList.push(year + i);
    }
    //新增月份下拉選單

    for (let i = 1; i <= 12; i++) {
      this.MonthList.push(i);
    }

    // 畫面自動呼叫讀卡機程式 抓取讀卡機資料TO-DO
    // setInterval(() => {
    //   this.initWebSocket();
    // }, 5000);
    // let _this = this;
    // window.axios
    //   .get(configs.publicPath + "../checkItem/SelectList")
    //   .then(e => {
    //     _this.checkItems = e.data.Items;
    //     _this.selectCheckItems.push(_this.checkItems[0].Id);
    //   });
  },
  destroyed() {
    console.log(`${this.$logs()}`);
    // 解除監聽器:攔截 KeyPress
    window.removeEventListener("keydown", this.HKWatch);
    // this.websock.close(); //离开路由之后断开websocket连接
  },
  mounted() {
    console.log(this.$logs());
  }
};
</script>

<style scoped>
.cardHeader {
  padding: 2px 1.25rem;
}
</style>
<style>
#OpenDataPicker .e-input-group {
  padding-top: 3px !important;
  border-style: none !important;
  background-color: transparent !important;
  height: 36px !important;
}
#OpenDataPicker .e-input-group-icon {
  margin-top: -3px !important;
  border-right-width: 0 !important;
}
#CheckDataPicker .e-input-group {
  padding-top: 3px !important;
  border-style: none !important;
  background-color: transparent !important;
  height: 36px !important;
}
#CheckDataPicker .e-input-group-icon {
  margin-top: -3px !important;
  border-right-width: 0 !important;
}
</style>-