<template>
  <div class="pageContent" style="min-height:820px;">
    <b-card no-body class="mx-1">
      <b-card-header class="bg-primary text-white cardHeader">
        <b-row no-gutters>
          <b-col cols="6" class="float-left text-left">
            檢查室報到．查詢作業．檢查室︰
            <span class="font-weight-bold">{{ labRoomId }}</span>
          </b-col>
        </b-row>
      </b-card-header>
      <b-card-text class="text-left py-1">
        <b-container fluid class="px-1">
          <b-row no-gutters>
            <b-col sm="2" class="px-1">
              <b-input-group>
                <b-input-group-prepend>
                  <b-button class="bg-warning text-black" style="border-color: grey;">檢查室</b-button>
                </b-input-group-prepend>
                <b-select v-model="selectedLabRoom" :options="optionsLabRoom" @change="ReloadDataContent" style="background-color:#FFCC80; border-color: grey;" />
              </b-input-group>

              <!-- <b-input-group prepend='檢查室'>
                <b-select v-model='selectedLabRoom' :options='optionsLabRoom' @change='ReloadDataContent'  style="background-color:orange;"/>
              </b-input-group>-->
            </b-col>
            <b-col sm="2" class="px-1">
              <b-input-group prepend="檢查單號" v-if="selectedLabRoom">
                <b-input v-model="accessionNo" ref="inputAccessionNo" />
              </b-input-group>
            </b-col>
            <b-col sm="2" class="px-1" v-if="selectedLabRoom">
              <b-input-group prepend="病歷編號">
                <b-input v-model="hospitalNo" />
              </b-input-group>
            </b-col>
            <!-- <b-col sm='2' class='px-1' v-if="selectedLabRoom">
              <b-input-group prepend='身分證號'>
                <b-input v-model='personId'/>
              </b-input-group>
            </b-col>-->
            <b-col sm="2" class="px-1" v-if="selectedLabRoom">
              <b-input-group prepend="病患來源">
                <b-select v-model="selectedPatientSource" :options="optionsPatientSource" @change="ChangeConditions" />
              </b-input-group>
            </b-col>

            <b-col class="px-1 text-right" v-if="selectedLabRoom">
              <b-button variant="success" @click="ClearConditions"> <font-awesome-icon icon="eraser" />清除條件 </b-button>
            </b-col>
          </b-row>
          <b-row no-gutters class="mt-1" v-if="selectedLabRoom">
            <b-col sm="2" class="px-1">
              <b-input-group prepend="檢查項目">
                <b-select v-model="selectedCheckItem" :options="optionsCheckItem" @change="ChangeConditions" />
              </b-input-group>
            </b-col>

            <b-col sm="2" class="px-1">
              <b-input-group prepend="搜尋急作">
                <b-form-radio-group name="QryEmergency" v-model="emergencySelected" class="pt-2 pl-2 rounded-right" style="border:1px solid #ced4da">
                  <b-form-radio value="Y">是</b-form-radio>
                  <b-form-radio value="N">否</b-form-radio>
                </b-form-radio-group>
              </b-input-group>
            </b-col>

            <b-col sm="2" class="px-1">
              <b-input-group prepend="作業進度">
                <b-select v-model="selectedProgress" :options="optionsOpProgress" @change="ChangeConditions" />
              </b-input-group>
            </b-col>
            <b-col sm="4" class="px-1">
              <b-input-group prepend="預定檢查日期" style="width:340px">
                <div id="spcialDatePicker" class="form-control" style="padding:0px">
                  <ejs-daterangepicker :min="minDate" :max="maxDate" :minDays="min" :strictMode="true" v-model="DateRange" placeholder="搜尋範圍"></ejs-daterangepicker>
                </div>
              </b-input-group>
            </b-col>
            <b-col class="px-1 text-right">
              <b-button variant="primary" @click="SearchConditions"> <font-awesome-icon icon="search" />進行查詢 </b-button>
            </b-col>
          </b-row>
        </b-container>
      </b-card-text>
    </b-card>

    <b-container fluid class="mt-1 mx-0 pl-1 pr-0">
      <b-row no-gutters>
        <b-col>
          <div id="block4QueryResult" class="mr-1 rounded" style="border:1px solid #ced4da; height:745px;">
            <twp
              ref="twp1"
              heightForScroll="635px"
              v-bind:FieldConfig="tableConfig4QueryResult"
              :DataFetch="GetDataContent"
              :OpButton1Func="RowClickFunction"
              CheckBox1Head
              :CheckBox1Func="itemChecked"
              :CheckBox1Lead="true"
              :MultiSelectFunc1="OpenMultiReport"
              :OpButton2Func="OnClickChangeLabRoom"
              OpButton2Text="變更檢查室"
              :OpButton3Func="OnBackState"
              OpButton3Text="取消登錄"
              :enableRowClick="true"
              :CheckIfShowRowCheckBox="CheckIfIdMatchMuitiSelect"
              :CheckIfShowHeaderCheckBox="CheckIfShowHeaderCheckBox"
              :OnHeaderCheckBoxChange="OnHeaderCheckBoxChange"
              v-on:allUnSelected="ResetFirstCheckItem"
            ></twp>
          </div>
        </b-col>
      </b-row>
    </b-container>

    <b-modal ref="changeRoomModal" hide-footer header-bg-variant="warning" header-text-variant="dark" body-class="py-1 px-1">
      <template slot="modal-title">
        <font-awesome-icon icon="syringe" class="mr-1" />
        <span class="zhTW">變更檢查室</span>
      </template>
      <div class="mr-1 rounded">
        <b-row no-gutters>
          <b-col class="p-2">
            <b-input-group>
              <b-input-group-prepend>
                <b-button class="bg-primary" style="border-style: none;">選擇檢查室</b-button>
              </b-input-group-prepend>
              <b-select v-model="selectedChangeRoom" :options="changeOptionsLabRoom" />
            </b-input-group>

            <!-- <b-input-group prepend='檢查室'>
                <b-select v-model='selectedLabRoom' :options='optionsLabRoom' @change='ReloadDataContent'  style="background-color:orange;"/>
            </b-input-group>-->
          </b-col>
        </b-row>

        <b-row no-gutters>
          <b-col class="p-2 text-right">
            <b-button variant="success" @click="ConfirmChangeRoom"> <font-awesome-icon icon="check" />確認 </b-button>
            <b-button variant="danger" @click="CancelChangeRoom" class="ml-4"> <font-awesome-icon icon="times-circle" />取消 </b-button>

            <!-- <b-input-group prepend='檢查室'>
                <b-select v-model='selectedLabRoom' :options='optionsLabRoom' @change='ReloadDataContent'  style="background-color:orange;"/>
            </b-input-group>-->
          </b-col>
        </b-row>
      </div>
    </b-modal>

    <b-modal
      ref="dialogBackState"
      centered
      hide-footer
      title="取消登錄"
      header-bg-variant="warning"
      title-class="lang-zh-Hant-TW font-weight-bold"
      body-class="lang-zh-Hant-TW"
    >
      <div class="d-block text-left">
        <p class="lang-zh-Hant-TW">將退回未排檢狀態，是否確認?</p>
      </div>
      <b-btn class="mt-3" variant="success" block @click="Click4StateBack">確認</b-btn>
      <b-btn class="mt-2" variant="secondary" block @click="CloseDialogStateBack">取消</b-btn>
    </b-modal>
  </div>
</template>

<script>
//             :CheckBox1Func="itemChecked"
import Vue from "vue";
import twp from "@/components/TWPv5";
import * as configs from "@/config";
import { DateRangePickerPlugin } from "@syncfusion/ej2-vue-calendars";

import { DataManager, WebApiAdaptor, Predicate, Query } from "@syncfusion/ej2-data";

import { dateFormatMixin } from "@/SupportLib_J.js";
import { hubConnection } from "signalr-no-jquery";

//狀態常數
const CHECKED_IN = "21";
const CHECK_INPROCESS = "31";
const EXAM_FINISHED = "36,51,56,61,63,65,71,73,75,77,79";

Vue.use(DateRangePickerPlugin);

const queryResult = require("@/assets/DataSource/DR0101001");
const todayList = require("@/assets/DataSource/DR0101002");
const checkItem = require("@/assets/DataSource/DR0407001");
const patientSource = require("@/assets/DataSource/DR0431001");
const labRoomList = require("@/assets/DataSource/DR0404001");
const opProgress = require("@/assets/DataSource/DR04X1001");

const configCollection = [
  //{ key: 'dId', label: '項次', sortable: false, thClass: "no-wrap", tdClass: "no-wrap" },
  {
    key: "EmgFlag",
    label: "急作",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap"
  },
  {
    key: "StatusName",
    label: "狀態",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap"
  },
  {
    key: "PatientSourceTypeName",
    label: "病患來源",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap"
  },
  {
    key: "OrderDate",
    label: "開單日期",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap"
  },
  {
    key: "AccessionNo",
    label: "檢查單號",
    sortable: true,
    thClass: "text-nowrap",
    tdClass: "no-wrap font-weight-bold"
  },
  {
    key: "PatientId",
    label: "病歷編號",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap"
  },
  {
    key: "ProcedureNameStr",
    label: "檢查項目",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap text-left"
  },
  {
    key: "ScheduleTime",
    label: "預定檢查日期",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap"
  },
  {
    key: "PatientName",
    label: "姓名",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap"
  },
  {
    key: "PatientSex",
    label: "性別",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap"
  },
  {
    key: "OtherPatientId",
    label: "身分證號",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap"
  }
];

const hubReconnectCountLimit = 3;

export default {
  name: "FI0201",
  components: { twp },
  mixins: [dateFormatMixin],
  data() {
    return {
      BasePath: this.$route.path,
      selectedLabRoom: null,
      state4TodayList: false,
      tableConfig4QueryResult: [],
      tableContent4QueryResult: [],
      tableConfig4TodayList: [],
      tableContent4TodayList: [],
      selectedCheckItem: null,
      selectedCheckRoom: null,
      selectedRadiographer1: null,
      selectedRadiographer2: null,
      selectedNurse: null,
      optionsCheckItem: [],
      selectedPatientSource: null,
      optionsPatientSource: [],
      optionsLabRoom: [],
      selectedProgress: CHECKED_IN,
      optionsOpProgress: [],
      optionsCheckRoom: [],
      optionsRadiographer1: [],
      optionsRadiographer2: [],
      optionsNurse: [],
      checkInstrument: null,
      emergencySelected: "N",
      ObjApp: null,

      min: 1,
      DateRange: [null, null],
      accessionNo: null,
      hospitalNo: null,

      performRadiographer1Id: null,
      performRadiographer2Id: null,
      performNurseId: null,
      // personId: null,

      //第一筆勾選的多選項目
      firstCheckedItem: null,

      //
      backObj: null,
      //
      changeOptionsLabRoom: [],
      selectedChangeRoom: null,
      //
      //webSocket objects
      sockConnection: null,
      hubProxy: null,
      hubReconnectCount: 0,
      useWebSocket: true,
      //
      //要退回未排檢的項目
      itemToBackState: null
    };
  },
  computed: {
    //
    //date picker 最小日期範圍
    minDate() {
      let now = new Date();
      now.setMonth(now.getMonth() - 12);
      return now;
    },
    //
    //date picker 最大日期範圍
    maxDate() {
      return new Date();
    },
    col4QueryResult() {
      return this.state4TodayList ? 8 : 12;
    },
    labRoomId() {
      let roomid = "";
      this.optionsLabRoom.some(r => {
        if (r.value == this.selectedLabRoom) {
          roomid = r.text;
          return true;
        }
      });
      return roomid;
    }
  },
  methods: {
    //
    //hide dialog
    CloseDialogStateBack() {
      this.$refs.dialogBackState.hide();
    },
    //
    //取消登錄
    Click4StateBack() {
      // if(!this.CheckIfRadiographerSelected()){
      // 	return
      // }

      let subPath = "/exam/CheckInBack";
      let accessionNos = [];
      accessionNos.push(this.itemToBackState.AccessionNo);
      let _this = this;

      if (this.useWebSocket) {
        this.hubProxy
          .invoke("checkInBack", accessionNos)
          .then(e => {
            if (e.Success) {
              _this.ObjApp.TimingMessage("資料已完成作業");
              _this.CloseDialogStateBack();
              _this.$refs.twp1.OnForceRefresh();
            } else {
              _this.ObjApp.TimingMessage("錯誤:" + e.Message + "! 請稍後再試.", 2);
            }
          })
          .fail(function(error) {
            console.log(error);
            _this.ObjApp.TimingMessage("錯誤:" + error + "! 請稍後再試.", 2);
          });
      } else {
        let opStatus = false;
        let opResult = "存取時發生錯誤!\r\n";
        window.axios
          .put(subPath, accessionNos)
          .then(e => {
            opStatus = true;
          })
          .catch(function(error) {
            opStatus = false;
            opResult += error;
          });

        this.ObjApp.WaitingHide();
        //
        if (opStatus) {
          this.ObjApp.TimingMessage("資料已完成存檔作業");
        } else {
          this.ObjApp.TimingMessage(opResult + "! 請稍後再試.", 2);
        }
      }
    },
    //
    //double check 取消登錄
    ShowDialogBackState() {
      this.$refs.dialogBackState.show();
    },
    //
    //web socket connection
    //hub connection
    ConnectionHubConnection() {
      // connect
      let _this = this;
      if (this.sockConnection == null) {
        this.sockConnection = hubConnection(configs.hubUrl);
        this.hubProxy = this.sockConnection.createHubProxy("examHub");
        this.sockConnection.disconnected(() => {
          setTimeout(() => {
            if (!_this.destroyed) {
              _this.hubReconnectCount++;
              if (_this.hubReconnectCount <= hubReconnectCountLimit) {
                let msg = "";
                if (_this.sockConnection.lastError) msg = _this.sockConnection.lastError.message;

                //依照指示, 不顯示重連線訊息
                // _this.$bvToast.hide("myToast");
                // _this.ShowToast(
                //   "連線中斷",
                //   `錯誤訊息: ${msg}, 重新連線中, 嘗試第 ${_this.hubReconnectCount} 次`,
                //   2
                // );

                _this.ConnectionHubConnection();
              } else {
                alert("hubconnection連線中斷, 請嘗試重新開啟頁面, 或通報資訊人員.");
              }
            }
          }, 3000);
        });
      }

      this.sockConnection
        .start({ jsonp: true, transport: ["webSockets"] })
        .done(function(conn) {
          //將斷線偵測的timeout 調整到12秒 (預設為30秒)
          conn.disconnectTimeout = 12000;
          console.log("Now connected, connection ID=" + conn.id);
          console.log("Connected, transport = " + conn.transport.name);
        })
        .fail(function(e) {
          console.log("Could not connect");
        });

      this.sockConnection.reconnecting(() => {
        console.log(_this.$logs("hubconnection reconnecting..."));
        //依照指示, 不顯示重連線訊息
        // _this.ShowToast("重新連線", `hubconnection 重新連線中...`, 3);
      });

      this.sockConnection.reconnected(() => {
        console.log(_this.$logs("hubconnection reconnected."));
        //依照指示, 不顯示重連線訊息
        // _this.$bvToast.hide("myToast");
        // _this.ShowToast("重新連線", `hubconnection 已重新連線!`, 1);
      });

      this.hubProxy.on("statusChanged", exam => {
        console.log(_this.$logs("exam list changed triggered."));
        _this.$refs.twp1.OnForceRefresh();
      });
    },
    //
    //變更condition直接Search
    ChangeConditions() {
      this.StoreSearchConditions();
      this.SearchConditions();
    },
    //
    //儲存頁面搜尋參數
    StoreSearchConditions() {
      window.checkOp_selectedProgress = this.selectedProgress;
    },
    //
    //取回已暫存頁面搜尋參數
    initUiParams() {
      if (window.checkOp_selectedProgress) {
        this.selectedProgress = window.checkOp_selectedProgress;
      }
    },

    //
    //讀取讀卡機
    initWebSocket() {
      let _this = this;
      if (this.accessionNo != "") return;
      let connection;
      connection = new WebSocket("ws://localhost:10008/Read");
      connection.onopen = function() {
        connection.send("checkNhiCard");
      };
      connection.onerror = function(e) {
        this.accessionNo = "";
      };
      connection.onmessage = function(e) {
        if (e.data.indexOf("Error:") < 0) {
          let pic = e.data.substr(32, 10);
          //因websocket屬於Jquery寫法，導致裡面無法使用VUE的data 故先建立THIS的變數 再去更改即可解決
          _this.accessionNo = pic;
          _this.SearchConditions();
        } else {
          _this.accessionNo = "";
          if (_this.accessionNo !== e.data && e.data === "Error:此晶片卡非健保卡！") _this.accessionNo = e.data;
        }
      };
    },
    //keypressed偵測
    HKWatch(event) {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        // //粗體Method自定義
        this.SearchConditions();
      }
    },
    //
    //取消firstCheckItem
    ResetFirstCheckItem() {
      this.firstCheckedItem = null;
    },
    //
    //header checkbox 勾選後 若為取消 將firstCheckedItem設為null
    //
    OnHeaderCheckBoxChange(checked) {
      if (!checked) this.ResetFirstCheckItem();
    },
    //
    //twp list判斷item是否顯示checkbox, 此處判斷item patient id是否和已選的item相同,
    //一單多檢的多選判斷
    CheckIfIdMatchMuitiSelect(item) {
      if (this.firstCheckedItem == null) return true;

      return item.PatientId == this.firstCheckedItem.PatientId;
    },
    //
    //判斷是否顯示header的checkbox, 如果list的content 皆為同patient id,
    //或 已點某筆item 判斷出相同patient id之row, 則顯示
    CheckIfShowHeaderCheckBox(items) {
      let _this = this;
      var fail = false;
      if (!items) return false;
      if (this.firstCheckedItem == null) {
        let pid = null;
        fail = items.some(element => {
          if (pid === null) pid = element.PatientId;

          if (pid !== element.PatientId) return true;
        });
      } else {
        fail = items.some(element => {
          if (element.showCheckBox && element.PatientId !== _this.firstCheckedItem.PatientId) {
            return true;
          }
        });
      }

      if (fail) return false;
      else return true;
    },
    //
    //twp list單筆item 編輯觸發
    OnBackState(x, srcParamId) {
      console.log(`Row Function Button Clicked. (${x.cid})`);
      this.ShowDialogBackState();
      this.itemToBackState = x;
      // let roomName = this.labRoomId;
      // window.examRoomData = {
      //   labRoomId: roomName,
      //   patientData: [x],
      //   backObj: this.backObj
      // };
      // this.$router.replace({
      //   name: "FI0202",
      //   params: {
      //     hubProxy: this.hubProxy
      //   }
      // });
    },
    //
    //twp list單筆item 編輯觸發
    RowClickFunction(x, srcParamId) {
      console.log(`Row Function Button Clicked. (${x.cid})`);
      let roomName = this.labRoomId;
      window.examRoomData = {
        labRoomId: roomName,
        patientData: [x],
        backObj: this.backObj
      };
      this.$router.replace({
        name: "FI0202",
        params: {
          hubProxy: this.hubProxy
        }
      });
    },
    //
    //單一item的checkbox點擊觸發
    itemChecked(item) {
      if (this.firstCheckedItem == null) this.firstCheckedItem = item;
    },
    //
    //多筆item勾選後 點編輯觸發
    OpenMultiReport(items) {
      if (this.$refs.twp1 === undefined) {
        console.log(this.$logs("Fail to refrence twp1"));
        return;
      }
      let dataList = this.$refs.twp1.checkedItems;
      let roomName = this.labRoomId;
      window.examRoomData = {
        labRoomId: roomName,
        patientData: dataList,
        backObj: this.backObj
      };
      this.$router.replace({
        name: "FI0202"
        // params: { labRoomId: roomName, patientData: dataList }
      });
      console.log(this.$logs("Passed item count: " + dataList.length));
    },
    //
    //按下變更檢查室鍵
    OnClickChangeLabRoom(item) {
      console.log(this.$logs("Onclick change labRoom"));

      //初始化可變更檢查室列表
      this.changeOptionsLabRoom = [{ value: null, text: "請選擇" }];
      this.selectedChangeRoom = null;
      this.ChangeLabRoom(item);
    },
    //
    //變更檢查室
    ChangeLabRoom(item) {
      //取得mergeItemId
      console.log(this.$logs());
      let _this = this;
      //
      this.ObjApp.WaitingShow();
      let opStatus = false;
      //
      let itemPack = null;
      //
      // let checkItemArr = [];
      // items.forEach(i => {
      //   checkItemArr.push(i.ProcedureCode);
      // });
      // let checkItems = checkItemArr.join(",");
      //
      let subPath = "../checkItem/MargeCheckItem?checkItems=" + item.ProcedureCode + "&isNo=true";
      //
      new DataManager({
        url: configs.publicPath + subPath,
        adaptor: new WebApiAdaptor(),
        crossDomain: true
      })
        .executeQuery(new Query())
        .then(async r => {
          itemPack = r.actual; //資料;
          let promises = [];
          itemPack.forEach(i => {
            promises.push(_this.GetLabRoomChangeOptions(i, item));
          });
          await Promise.all(promises);
          opStatus = true;
          this.ObjApp.WaitingHide();
        })
        .catch(e => {
          this.ObjApp.TimingMessage("變更檢查室失敗! 請稍後再試.", 2);
          this.ObjApp.WaitingHide();
        });
    },
    //
    //取得可選檢查室列表
    async GetLabRoomChangeOptions(obj, item) {
      //取得mergeItemId
      console.log(this.$logs());
      let _this = this;
      let opStatus = false;
      //
      let itemPack = null;
      //

      let subPath = "../checkItem/RoomNoList?type=" + obj.Type + "&id=" + obj.Id;
      //
      await new DataManager({
        url: configs.publicPath + subPath,
        adaptor: new WebApiAdaptor(),
        crossDomain: true
      })
        .executeQuery(new Query())
        .then(r => {
          itemPack = r.actual; //資料;
          opStatus = true;

          itemPack.Items.forEach(i => {
            if (i.No != this.selectedLabRoom) {
              let collection = { value: i.No, text: i.Name };
              _this.changeOptionsLabRoom.push(collection);
            }
          });

          if (this.changeOptionsLabRoom.length > 1) {
            this.$refs.changeRoomModal.show();
            this.$refs.changeRoomModal.id = item.AccessionNo;
          } else {
            this.ObjApp.TimingMessage("目前沒有其他檢查室可以變更.", 2);
          }
        })
        .catch(e => {
          let msg = e.error;
          this.ObjApp.TimingMessage("取得檢查室變更列表失敗! 請稍後再試. <" + msg + ">", 2);
        });
    },
    //
    //確認變更檢查室
    async ConfirmChangeRoom() {
      if (this.selectedChangeRoom == null) {
        this.ObjApp.TimingMessage("請選擇檢查室.", 2);
        return;
      }
      //取得mergeItemId
      console.log(this.$logs());
      let _this = this;
      let opStatus = false;
      //
      let itemPack = null;
      //
      this.ObjApp.WaitingShow();

      let subPath = "/exam/AssignRoom";
      let accessionNo = this.$refs.changeRoomModal.id;
      let dataBody = {
        RoomNo: this.selectedChangeRoom,
        AccessionNos: [accessionNo]
      };
      //

      if (this.useWebSocket) {
        this.hubProxy
          .invoke("assignRoom", dataBody)
          .then(e => {
            if (e.Success) {
              itemPack = e.Exams; //資料;
              opStatus = true;
              let msg = "";
              itemPack.forEach(i => {
                msg += i.AccessionNo + "\r\n";
              });

              this.ObjApp.TimingMessage("以下單號已完成檢查室變更:\n" + msg, 1);
              this.ObjApp.WaitingHide();

              this.$refs.changeRoomModal.hide();
              this.$refs.twp1.OnForceRefresh();
            } else {
              this.ObjApp.WaitingHide();
              _this.ObjApp.TimingMessage("檢查室變更失敗! 請稍後再試. <" + e.Message + ">", 2);
            }
          })
          .fail(function(error) {
            console.log(error);
            this.ObjApp.WaitingHide();
            _this.ObjApp.TimingMessage("檢查室變更失敗! 請稍後再試. <" + error + ">", 2);
          });
      } else {
        await window.axios
          .put(subPath, dataBody)
          .then(r => {
            itemPack = r; //資料;
            opStatus = true;
            let msg = "";
            itemPack.forEach(i => {
              msg += i.AccessionNo + "\r\n";
            });

            this.ObjApp.TimingMessage("以下單號已完成檢查室變更:\n" + msg, 1);
            this.ObjApp.WaitingHide();

            this.$refs.changeRoomModal.hide();
            this.$refs.twp1.OnForceRefresh();
          })
          .catch(e => {
            let msg = e.error;
            this.ObjApp.TimingMessage("檢查室變更失敗! 請稍後再試. <" + msg + ">", 2);
            this.ObjApp.WaitingHide();
          });
      }
      this.$refs.changeRoomModal.hide();
      this.$refs.twp1.OnForceRefresh();
    },
    //
    //確認變更檢查室
    CancelChangeRoom() {
      this.$refs.changeRoomModal.hide();
    },
    //
    //條件查詢
    SearchConditions() {
      this.$refs["twp1"].OnForceRefresh();
    },
    //
    //清除條件查詢
    ClearConditions() {
      this.emergencySelected = "N";
      this.accessionNo = null;
      this.hospitalNo = null;
      this.DateRange = [null, null];
      // this.personId = null
      this.selectedCheckItem = null;
      this.selectedPatientSource = null;
      this.selectedProgress = CHECKED_IN;

      this.SearchConditions();
    },

    //
    //取得檢查室列表
    async GetOptionsLabRoom() {
      console.log(this.$logs());

      //
      let itemPack = null;
      let convertedCollections = [{ value: null, text: "請選擇" }];
      //
      let subPath = "../Room/SelectNoList";
      //
      this.ObjApp.WaitingShow();
      let opStatus = false;
      //
      await new DataManager({
        url: configs.publicPath + subPath,
        adaptor: new WebApiAdaptor(),
        crossDomain: true
      })
        .executeQuery(new Query())
        .then(r => {
          itemPack = r.actual; //資料;
          opStatus = true;
        });

      itemPack.Items.forEach(i => {
        let collection = { value: i.No, text: i.Name };
        convertedCollections.push(collection);
      });
      this.optionsLabRoom = convertedCollections;

      this.ObjApp.WaitingHide();
      //
      if (opStatus) {
        this.ReloadDataContent();
        // this.ObjApp.TimingMessage('資料已完成存檔作業')
      } else {
        this.ObjApp.TimingMessage(opResult + "! 請稍後再試.", 2);
      }
    },
    //
    //取得檢查項目列表
    async GetOptionsCheckItem() {
      if (this.selectedLabRoom == null) {
        console.log(this.$logs("檢查室尚未選擇, 無法取得檢查項目列表"));
        return;
      }
      console.log(this.$logs());
      //
      let itemPack = null;
      let convertedCollections = [{ value: null, text: "請選擇" }];
      //
      let subPath = "../Room/CheckItems?no=" + this.selectedLabRoom;
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
    //
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
    //
    //list選單撈取資料
    async GetDataContent(index, toPage, nPerPage) {
      //無選取檢查室則跳出
      if (this.selectedLabRoom == null || this.selectedLabRoom == undefined || this.optionsLabRoom.length == 0) return { Items: null, Count: 0 };
      console.log(this.$logs());
      //
      let itemPack = null;
      //
      //判別日期查詢 (日期查詢無法寫在query物件裡, 只好從url帶參數)
      let subPath = "../exam/List";
      if (this.DateRange[0] != null || this.DateRange[1] != null) {
        let dateCondition = "";
        if (this.DateRange[0] != null) dateCondition += "scheduleTimeStart=" + this.DateRange[0].toJSON() + "&";

        if (this.DateRange[1] != null) dateCondition += "scheduleTimeEnd=" + this.DateRange[1].toJSON();

        subPath += "?" + dateCondition;
      } else {
        let md = this.DateToString(this.minDate, false);
        let nd = this.DateToString(this.maxDate, false);

        let dateCondition = "";
        dateCondition += "scheduleTimeStart=" + md + "&";

        dateCondition += "scheduleTimeEnd=" + nd;

        subPath += "?" + dateCondition;
      }

      if (this.selectedProgress != null) {
        if (subPath.includes("?")) {
          subPath += "&status=" + this.selectedProgress;
        } else {
          subPath += "?status=" + this.selectedProgress;
        }
      } else {
        if (subPath.includes("?")) {
          subPath += "&status=" + CHECKED_IN + "," + CHECK_INPROCESS + "," + EXAM_FINISHED;
        } else {
          subPath += "?status=" + CHECKED_IN + "," + CHECK_INPROCESS + "," + EXAM_FINISHED;
        }
      }

      //檢驗狀態
      // if (this.selectedProgress != null) {
      //   query = query.where("Status", "equal", this.selectedProgress);
      // } else {
      //   let predicateState = new Predicate("Status", "equal", CHECKED_IN);
      //   predicateState = predicateState.or("Status", "equal", CHECK_INPROCESS);
      //   predicateState = predicateState.or("Status", "equal", EXAM_FINISHED);
      //   query = query.where(predicateState);
      // }

      console.log("search dateRange:" + this.DateRange[0] + "~" + this.DateRange[1]);
      //
      this.ObjApp.WaitingShow();
      let opStatus = false;
      //
      await new DataManager({
        url: configs.publicPath + subPath,
        adaptor: new WebApiAdaptor(),
        crossDomain: true
      })
        //Query物件 包含search conditions //TODO 這裡帶的都是假變數, 確認真實狀況後變更
        .executeQuery(
          this.getDataQuery()
            .sortBy("ScheduleTime")
            .page(toPage, nPerPage)
        )
        .then(r => {
          itemPack = r.actual; //資料;
          opStatus = true;
        });

      if (itemPack.Items && itemPack.Items.length > 0) {
        itemPack.Items.filter(i => {
          i.OrderDate = this.DateToString(i.OrderDate, true);
          i.ScheduleTime = this.DateToString(i.ScheduleTime, true);
          i.ProcedureNameStr = i.ProcedureName;
          if (i.ProcedureName instanceof Array) {
            i.ProcedureNameStr = i.ProcedureName.join(",");
          }
        });

        //Sort 1: 檢查日期 降冪   2: 狀態: 升密
        itemPack.Items.sort((a, b) => {
          return b.ScheduleTime - a.ScheduleTime || a.Status - b.Status;
        });
      }
      //
      //
      this.ObjApp.WaitingHide();
      //
      if (opStatus) {
        // this.ObjApp.TimingMessage('資料已完成存檔作業')
      } else {
        this.ObjApp.TimingMessage("無法取得資料! 請稍後再試.", 2);
      }

      return itemPack;
    },
    getDataQuery: function() {
      let query = new Query();
      //startsWith, endsWith, contains, equal, notEqual, greaterThan, greaterThanOrEqual, lessThan, lessThanOrEqual

      //檢查室
      if (this.selectedLabRoom != null && this.selectedLabRoom != "") query = query.where("ScheduleLocation", "equal", this.selectedLabRoom);

      //檢查單號
      if (this.accessionNo != null && this.accessionNo != "") query = query.where("AccessionNo", "contains", this.accessionNo);

      //病歷號
      if (this.hospitalNo != null && this.hospitalNo != "") query = query.where("PatientId", "contains", this.hospitalNo);

      // if (this.personId != null && this.personId != "")
      // 	query = query.where("pId", "contains", this.personId);

      //檢查項目代碼
      if (this.selectedCheckItem != null && this.selectedCheckItem != "") query = query.where("ProcedureCode", "contains", this.selectedCheckItem);

      //病患來源
      if (this.selectedPatientSource != null && this.selectedPatientSource != "") query = query.where("PatientSourceTypeCode", "contains", this.selectedPatientSource);

      //急作
      if (this.emergencySelected === "Y") query = query.where("EmgFlag", "equal", "Y");

      //檢驗狀態
      // if (this.selectedProgress != null) {
      //   query = query.where("Status", "equal", this.selectedProgress);
      // } else {
      //   let predicateState = new Predicate("Status", "equal", CHECKED_IN);
      //   predicateState = predicateState.or("Status", "equal", CHECK_INPROCESS);
      //   predicateState = predicateState.or("Status", "equal", EXAM_FINISHED);
      //   query = query.where(predicateState);
      // }

      /*if (dtRange != null && dtRange.length > 0) {
				query = query.where("StaffStatus", "equal", e.StaffStatus);
			}*/
      return query;
    },
    ReloadDataContent() {
      if (
        !this.optionsLabRoom.some(i => {
          return i.value == this.selectedLabRoom;
        })
      )
        return;
      localStorage.selectedLabRoom = this.selectedLabRoom;
      this.GetOptionsCheckItem();
      this.$refs.twp1.OnForceRefresh();
    },
    SetFocusOnInputAccessionNo() {
      //console.log(this.$logs('setFocus'))
      setTimeout(() => {
        //console.log(this.$logs('setFocus.inner'))
        this.$nextTick(() => this.$refs["inputAccessionNo"].focus());
      }, 1000);
    }
  },
  created() {
    let methodName = "created";
    console.log(this.$logs("on", methodName));

    this.ConnectionHubConnection();
    //
    //帶入暫存搜尋參數
    // this.initUiParams();

    //
    window.addEventListener("keydown", this.HKWatch); //粗體Method自定義
    //
    if (this.selectedLabRoom == null && localStorage.selectedLabRoom) this.selectedLabRoom = localStorage.selectedLabRoom;

    // 取得 App.vue 參照
    let obj = this.$GetApp(this);
    if (obj) {
      this.ObjApp = obj[0];
      this.VueNestLevel = obj[1];
      console.log(this.$logs(`Vue Nesting Level ${this.VueNestLevel}`, methodName));
    } else {
      console.log(this.$logs("Fail to get App.vue ref.", methodName));
    }
    //
    this.tableConfig4QueryResult = configCollection; //queryResult.PresentConfig()
    //this.tableContent4QueryResult = queryResult.DataSet()
    //
    this.tableConfig4TodayList = todayList.PresentConfig();
    this.tableContent4TodayList = todayList.DataSet();
    //
    this.GetOptionsCheckItem(); //checkItem.Options()
    //
    this.GetOptionsPatientSource();
    //this.optionsPatientSource = patientSource.Options()

    this.GetOptionsLabRoom();
    //this.optionsLabRoom = labRoomList.Options()
    this.optionsOpProgress =
      //opProgress.Options()
      [
        { value: CHECKED_IN, text: "櫃台報到" },
        { value: CHECK_INPROCESS, text: "檢查中" },
        { value: EXAM_FINISHED, text: "檢查完畢暨其後狀態" }
      ];

    //讀取檢查室作業返回的資料
    // let d = (this.backObj = this.$route.params.backObj);
    // if (d !== undefined) {
    //   this.selectedLabRoom = d.ScheduleLocation;
    //   this.performRadiographer1Id = d.PerformRadiographer1Id;
    //   this.performRadiographer2Id = d.PerformRadiographer2Id;
    //   this.performNurseId = d.PerformNurseId;
    // }

    //畫面自動呼叫讀卡機程式 抓取讀卡機資料
    setInterval(() => {
      this.initWebSocket();
    }, 5000);
  },
  mounted() {
    console.log(this.$logs());
    //focus到病歷編號上
    this.SetFocusOnInputAccessionNo();
    //this.$refs['inputAccessionNo'].focus()
  },
  destroyed() {
    console.log(`${this.$logs()}`);
    // 解除監聽器:攔截 KeyPress
    window.removeEventListener("keydown", this.HKWatch);
  }
};
</script>

<style scoped>
.cardHeader {
  padding: 2px 1.25rem;
}
</style>
