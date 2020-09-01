<template>
  <div fluid class="px-1 cal-bg" :style="linkStyle">
    <b-row no-gutters>
      <b-col sm="3" class="px-1 py-1">
        <!-- <b-row no-gutters>
          <b-col class="px-1">
            預約檢查項目
            <ejs-dropdownlist
              :value="selectCheckItem"
              :dataSource="checkItems"
              :fields="{ text: 'Name', value: 'Id' }"
              placeholder="檢查項目"
              readonly="true"
            ></ejs-dropdownlist>
          </b-col>
        </b-row>-->
        <b-row no-gutters>
          <b-col class="px-1">
            <infoCard
              class="q-mt-md"
              title="病患資訊"
              :itemInfo="patientInfoArr"
              :maxHeight="patientInfoCardMaxHeight"
            />

            <infoCard
              class="q-mt-md"
              colorStyle="3"
              :title="bookingInfoCardTitle"
              :itemInfo="bookStateInfo"
              :BtnClick="CancelScheduleItem"
              :maxHeight="bookingInfoCardMaxHeight"
              :toEmit="ClickBookingInfoTag"
            />
          </b-col>
        </b-row>
        <!-- <infoCard class="q-mt-md" title="病患資訊" :itemInfo="patientInfoArr" />
        <infoCard class="q-mt-md" colorStyle="3" :title="bookStateInfo.title" :itemInfo="bookStateInfo.value" />-->
      </b-col>

      <b-col sm="9" class="px-1">
        <b-card no-body class="m-2" ref="scheduleCard">
          <b-tabs v-model="currentTabItemId" lazy>
            <b-tab
              card
              :title="itemTab.Name"
              v-for="(itemTab, index) in itemTabs"
              :key="itemTab.No"
              class="py-2"
              :title-link-class="linkClass(index, itemTab)"
            >
              <template v-slot:title>
                <font-awesome-icon icon="check" v-if="itemTab.Type == 'item'" />
                <font-awesome-icon icon="box" v-if="itemTab.Type == 'fix'" />
                <font-awesome-icon icon="cubes" v-if="itemTab.Type == 'combo'" />
                {{ itemTab.Name }}
              </template>
              <scheduleView
                :ref="itemTab.MargeCheckItemIds"
                :type="itemTab.Type"
                :checkItemId="itemTab.Id"
                :checkItemNo="itemTab.No"
                :margeCheckItemIds="itemTab.MargeCheckItemIds"
                :checkItemName="itemTab.Name"
                :viewDate="viewDate"
                :patientInfo="patientInfos"
                v-on:AddTimeSlot="AddTimeSlot"
                v-on:Refresh="RefreshScheduleItemFromList"
                :sockConnection="sockConnection"
                :hubProxy="hubProxy"
              ></scheduleView>
            </b-tab>
          </b-tabs>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Vue from "vue";
import scheduleView from "./ScheduleMain";
import * as configs from "@/config";
import moment from "moment";
import infoCard from "./InfoCard";
import { hubConnection } from "signalr-no-jquery";
import Swal from "sweetalert2";

const colorList = [
  "#ea7a57",
  "#7fa900",
  "#5978ee",
  "#fec200",
  "#df5286",
  "#00bdae",
  "#865fcf",
  "#1aaa55",
  "#df5286",
  "#710193"
];
const hubReconnectCountLimit = 3;

const tabVariant_bright = [
  ["mr-1", "bg-info", "text-white", "font-weight-bold"],
  ["mr-1", "bg-warning", "text-white", "font-weight-bold"],
  ["mr-1", "bg-primary", "text-white", "font-weight-bold"],
  ["mr-1", "bg-danger", "text-white", "font-weight-bold"]
];

const tabVariant_dark = [
  ["mr-1", "bg-dark", "text-info", "border-secondary"],
  ["mr-1", "bg-dark", "text-warning", "border-secondary"],
  ["mr-1", "bg-dark", "text-primary", "border-secondary"],
  ["mr-1", "bg-dark", "text-danger", "border-secondary"]
];

//import "muse-ui/dist/muse-ui.css";
export default {
  name: "bookingView",
  props: ["bookingObjs", "bookingDate", "patientInfo"],
  data() {
    return {
      selectLocation: [],
      locations: [],
      bookStateInfo: [],
      ObjApp: null,
      sockConnection: null,
      hubProxy: null,
      hubReconnectCount: 0,
      destroyed: false,
      bookingInfo: [],

      currentTabItemId: null,
      itemTabs: [],
      viewDate: new Date(),
      patientInfos: null,
      checkItems: null,

      // 佈景主題
      themePacks: {
        themeBlack: false,
        //emeBlackName: 'themeBlack',
        themeBlackName: configs.ThemeId4Black
      },

      //資訊卡最大高度 (程式內調整)
      patientInfoCardMaxHeight: 500,
      bookingInfoCardMaxHeight: 500
    };
  },
  components: {
    scheduleView,
    infoCard
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
  methods: {
    //
    //
    ShowToast(title, msg, type = 1) {
      let hClass = ["bg-success", "text-light", "zhTW"];
      let bClass = ["bg-light", "text-dark", "zhTW"];
      let hideDelay = 3000;
      let noHide = false;
      if (type == 2) {
        hClass = ["bg-danger", "text-light", "zhTW"];
        bClass = ["bg-light", "text-danger", "zhTW"];
      } else if (type == 3) {
        hClass = ["bg-warning", "text-dark", "zhTW"];
        bClass = ["bg-light", "text-danger", "zhTW"];
        hideDelay = 0;
        noHide = true;
      }

      this.$bvToast.toast(msg, {
        id: "myToast",
        title: title,
        headerClass: hClass,
        bodyClass: bClass,
        autoHideDelay: hideDelay,
        noAutoHide: noHide,
        appendToast: true
      });
    },
    //hub connection
    ConnectionHubConnection() {
      // connect
      let _this = this;
      if (this.sockConnection == null) {
        this.sockConnection = hubConnection(configs.hubUrl);
        this.hubProxy = this.sockConnection.createHubProxy("bookingHub");
        this.sockConnection.disconnected(() => {
          setTimeout(() => {
            if (!_this.destroyed) {
              _this.hubReconnectCount++;
              if (_this.hubReconnectCount <= hubReconnectCountLimit) {
                let msg = "";
                if (_this.sockConnection.lastError)
                  msg = _this.sockConnection.lastError.message;

                //依照指示, 不顯示重連線訊息
                // _this.$bvToast.hide("myToast");
                // _this.ShowToast(
                //   "連線中斷",
                //   `錯誤訊息: ${msg}, 重新連線中, 嘗試第 ${_this.hubReconnectCount} 次`,
                //   2
                // );

                _this.ConnectionHubConnection();
              } else {
                alert(
                  "hubconnection連線中斷, 請嘗試重新開啟頁面, 或通報資訊人員."
                );
              }
            }
          }, 3000);
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
    },
    //keypressed偵測
    HKWatch(event) {
      if (event.code === "ArrowLeft") {
        // //粗體Method自定義
        this.GoPrevious();
      } else if (event.code === "ArrowRight") {
        // //粗體Method自定義
        this.GoNext();
      }
    },
    GoPrevious() {
      let _this = this;
      let index = 0;
      this.itemTabs.forEach(i => {
        if (index == _this.currentTabItemId) {
          console.log("" + i.MargeCheckItemIds);
          if (_this.$refs[i.MargeCheckItemIds]) {
            _this.$refs[i.MargeCheckItemIds].forEach(y =>
              y.triggerGoPrevious()
            );
            return;
          }
        }
        index++;
      });
    },
    GoNext() {
      let _this = this;
      let index = 0;
      this.itemTabs.forEach(i => {
        if (index == _this.currentTabItemId) {
          console.log("" + i.MargeCheckItemIds);
          if (_this.$refs[i.MargeCheckItemIds]) {
            _this.$refs[i.MargeCheckItemIds].forEach(y => y.triggerGoNext());
            return;
          }
        }
        index++;
      });
    },
    //
    //刷新預約資訊
    RefreshScheduleItemFromList() {
      this.bookStateInfo = [];
      this.GetBookingInfo();
    },
    //
    //取消預約
    CancelScheduleItem(x) {
      console.log(this.$logs("取消預約"));
      let _this = this;
      this.hubProxy
        .invoke("removeTimeSlot", x.obj.OrderNo, x.obj.MargeCheckItemIds)
        .then(e => {
          if (e.Success) {
            // this.ObjApp.TimingMessage("已取消預約！", 1);
            _this.RefreshScheduleItemFromList(x);
            _this.itemTabs.some(i => {
              if (i.MargeCheckItemIds.includes("" + x.obj.CheckItemId)) {
                console.log("" + i.MargeCheckItemIds);
                _this.$refs[i.MargeCheckItemIds].forEach(y =>
                  y.EnableAndFilterScheduler()
                );
                return true;
              }
            });
            if (_this.itemTabs) x.obj.CheckItemId;

            // _this.ShowToast("提示", "已取消預約！", 1);
            Swal.fire({
              type: "success",
              title: "已取消預約！"
            });
          } else {
            Swal.fire("取消預約失敗！" + e.Message, "", "info");
            // this.ObjApp.TimingMessage("取消預約失敗！" + e.Message, 2);
          }
        })
        .fail(function(error) {
          console.log(error);
          Swal.fire("取消預約失敗！" + error, "", "info");
          // this.ObjApp.TimingMessage("取消預約失敗！" + error, 2);
        });
    },
    //
    //取得預約資訊
    async GetBookingInfo() {
      let _this = this;
      this.bookingInfo.forEach(b => {
        this.itemTabs.forEach(i => {
          window.axios
            .get(
              "/schedule/BookingInfo?orderNo=" +
                b.orderNo +
                "&margeCheckItemIds=" +
                i.MargeCheckItemIds
            )
            .then(e => {
              // _this.$refs.schLocation.ej2Instances.readonly = e.length > 0;
              e.forEach(i => {
                // let item1 = {
                //   label: "預約項目",
                //   value: i.CheckItemName
                // };

                // let item2 = {
                //   label: "預約時間",
                //   value: _this.$moment(i.StartTime).format("YYYY/MM/DD HH:mm")
                // };

                let item = {
                  label: i.CheckItemName,
                  value:
                    _this.$moment(i.StartTime).format("YYYY/MM/DD HH:mm") +
                    "  " +
                    i.RoomName,
                  obj: i
                };

                this.itemTabs.forEach(j => {
                  if (j.Name == i.CheckItemName) {
                    item.prependVariant = j.variant[1].replace("bg-", "");
                  }
                });

                _this.bookStateInfo.push(item);
                // _this.bookStateInfo.value += "預約檢查項目:" + i.CheckItemName + "<br>預約檢查時間:" + _this.$moment(i.StartTime).format("YYYY/MM/DD HH:mm") + "<br>";
              });
            })
            .catch(error => {
              alert(error);
            });
        });
      });
    },
    //
    //新增預約
    AddTimeSlot(i) {
      this.RefreshScheduleItemFromList();
      // let item = {
      //   label: i.CheckItemName,
      //   value: this.$moment(i.StartTime).format("YYYY/MM/DD HH:mm"),
      //   obj: i
      // };
      // this.bookStateInfo.push(item);
    },
    //
    //
    //
    //
    //
    setDefaultBackgroundColor() {
      // 引入 Theme:Black, 日後再調成是從 個人設定 中轉入
      let cls = localStorage["theme-modal-bg-color"];
      this.isWhite = cls == "white" || !cls;
      this.isBlack = cls == "black";
      this.isGray = !this.isWhite && !this.isBlack && cls == "#868e96";
      !cls ? (cls = "white") : "";
      this.ThemeSwitch(cls);
      if (!this.isWhite) {
        document.documentElement.style.setProperty(
          "--theme-modal-bg-color",
          cls
        );
      }

      document.addEventListener("fullscreenchange", () => {
        // document.fullscreenElement will point to the element that
        // is in fullscreen mode if there is one. If there isn't one,
        // the value of the property is null.
        document.querySelector("#blkReportInput").scrollTop = 0;
        if (document.fullscreenElement) {
          this.fullScreen = true;
        } else {
          this.fullScreen = false;
          document.querySelector(".close").click();
        }
      });
    },
    //
    linkClass(idx, itemTab) {
      let n = idx % 4;
      itemTab.variant = tabVariant_bright[n];
      if (this.currentTabItemId === idx) {
        return tabVariant_bright[n];
        // if (idx % 4 == 0) {
        //   return tabVariant_bright[n]
        // } else if (idx % 4 == 1) {
        //   return ["mr-1", "bg-warning", "text-white", "font-weight-bold"];
        // } else if (idx % 4 == 2) {
        //   return ["mr-1", "bg-primary", "text-white", "font-weight-bold"];
        // } else if (idx % 4 == 3) {
        //   return ["mr-1", "bg-danger", "text-white", "font-weight-bold"];
        // } else {
        //   return ["mr-1", "bg-info", "text-white", "font-weight-bold"];
        // }
      } else {
        return tabVariant_dark[n];
        // if (idx % 4 == 0) {
        //   return ["mr-1", "bg-secondary", "text-info", "border-secondary"];
        // } else if (idx % 4 == 1) {
        //   return ["mr-1", "bg-secondary", "text-warning", "border-secondary"];
        // } else if (idx % 4 == 2) {
        //   return ["mr-1", "bg-secondary", "text-primary", "border-secondary"];
        // } else if (idx % 4 == 3) {
        //   return ["mr-1", "bg-secondary", "text-danger", "border-secondary"];
        // } else {
        //   return ["mr-1", "bg-secondary", "text-info", "border-secondary"];
        // }
      }
    },
    bgUpdate(cls) {
      this.isWhite = this.isBlack = this.isGray = false;
      if (cls == "white") {
        this.isWhite = true;
      } else if (cls == "black") {
        this.isBlack = true;
      } else {
        this.isGray = true;
      }
      localStorage["theme-modal-bg-color"] = cls;
      this.ThemeSwitch(cls);
      if (!this.isWhite) {
        document.documentElement.style.setProperty(
          "--theme-modal-bg-color",
          cls
        );
      }
    },
    ThemeSwitch(color) {
      // Theme:Black 切換
      //
      // this.themePacks.themeBlack = !this.themePacks.themeBlack
      this.themePacks.themeBlack = color !== "white";
      //
      let activate = this.themePacks.themeBlack;
      let className = this.themePacks.themeBlackName;
      const el = document.body;
      //
      if (activate) {
        el.classList.add(className);
      } else {
        el.classList.remove(className);
      }

      //連動改變table component的背景主題
      this.SwtchTableTheme();

      console.log(this.$logs(this.$IsThemeBlack() ? "Black" : "White"));
    },
    SwtchTableTheme() {},
    //
    //
    async GetMergeItemIds() {
      //取得mergecheckitemids
      let strCheckItemId = "";
      let _this = this;

      // await this.bookingObjs.forEach(obj => {
      //   _this.GetCheckItemIds(obj).then(value => {
      //     bookingCheckItems.concat(value);
      //   });
      //   // bookingCheckItems.concat(gotCheckItems);

      //   // window.axios.get(configs.publicPath + "../checkItem/ForSpecialTime").then(e => {
      //   //   _this.checkItems = e.Items;
      //   //   obj.checkItemNos.forEach(no => {
      //   //     bookingCheckItems.push(_this.checkItems.find(j => j.No == no));
      //   //   });
      //   //   strCheckItemId = bookingCheckItems.map(i => i.Id).join(",");
      //   // });
      // });
      this.GetCheckItemIds().then(checkItems => {
        if (checkItems != null) {
          checkItems.forEach(i => {
            let itemIds = i.map(i => i.Id).join(",");
            if (strCheckItemId != "") strCheckItemId += ",";
            strCheckItemId += itemIds;
          });
          window.axios
            .get("/checkItem/MargeCheckItem?checkItems=" + strCheckItemId)
            .then(e => {
              _this.itemTabs = _this.itemTabs.concat(e);
              _this.currentTabItemId = _this.itemTabs[0].Id;

              _this.GetBookingInfo();
            });
        }
      });
    },
    async GetCheckItemIds() {
      let _this = this;
      let bookingCheckItems = [];
      let promises = [];
      await this.bookingInfo.forEach(obj => {
        promises.push(
          new Promise((resolve, reject) => {
            _this.MapSelectedItems(obj).then(value => {
              // bookingCheckItems.concat(value);
              resolve(value);
            });
          })
        );
      });
      // let promiseResult = Promise.all(promises);
      // let strCheckItemId = promiseResult.map(i => i.Id).join(",");

      return Promise.all(promises);
    },
    async MapSelectedItems(obj) {
      let _this = this;
      let bookingCheckItems = [];
      await window.axios.get("/checkItem/ForSpecialTime").then(e => {
        _this.checkItems = e.Items;
        obj.checkItemNos.forEach(no => {
          bookingCheckItems.push(_this.checkItems.find(j => j.No == no));
        });
      });
      return bookingCheckItems;
    },
    ClickBookingInfoTag(x) {
      let _this = this;
      for (var i = 0; i < this.itemTabs.length; i++) {
        if (this.itemTabs[i].MargeCheckItemIds == x.obj.MargeCheckItemIds) {
          this.currentTabItemId = i;
          return;
        }
      }
    }
  },
  computed: {
    bookingInfoCardTitle: function() {
      return "預約資訊: " + this.bookStateInfo.length + "筆";
    },
    orderNumbers: function() {
      let result = [];
      this.bookingInfo.forEach(n => {
        result.push(n.orderNo);
      });
      return result.join(",");
    },
    patientInfoArr: function() {
      let info = [
        {
          label: "病患姓名",
          value: this.patientInfos.name
        },
        {
          label: "身分證號",
          value: this.patientInfos.id
        },
        {
          label: "病患性別",
          value: this.patientInfos.gender
        },
        {
          label: "病患生日",
          value: moment(this.patientInfos.birthDay).format("YYYY/MM/DD")
        },
        {
          label: "病歷號碼",
          value: this.patientInfos.hrNum
        },
        {
          label: "申請單號",
          value: this.orderNumbers
        }
      ];

      return info;
    },
    linkStyle() {
      return {
        height: window.innerHeight + "px"
      };
    }
  },
  created: function() {
    //
    window.addEventListener("keydown", this.HKWatch); //粗體Method自定義
    // connect
    this.ConnectionHubConnection();
    // if (this.sockConnection == null) {
    //   this.sockConnection = hubConnection(configs.hubUrl);
    //   this.hubProxy = this.sockConnection.createHubProxy("bookingHub");
    //   this.sockConnection.disconnected(() => {
    //     alert("hubconnection 未連接");
    //   });
    // }

    // this.sockConnection
    //   .start({ jsonp: true, transport: ["webSockets"] })
    //   .done(function(conn) {
    //     console.log("Now connected, connection ID=" + conn.id);
    //     console.log("Connected, transport = " + conn.transport.name);
    //   })
    //   .fail(function(e) {
    //     console.log("Could not connect");
    //   });
    //
    // 取得 App.vue 參照
    let methodName = "created";
    let obj = this.$GetApp(this);
    if (obj) {
      this.ObjApp = obj[0];
      this.VueNestLevel = obj[1];
      console.log(
        this.$logs(`Vue Nesting Level ${this.VueNestLevel}`, methodName)
      );
    } else {
      console.log(this.$logs("Fail to get App.vue ref.", methodName));
    }
    //
    if (this.bookingObjs != null) {
      this.bookingInfo = this.bookingObjs;
      this.viewDate = this.bookingDate;
      this.patientInfos = this.patientInfo;
    } else {
      if (this.$route.query.orders) {
        let orders = JSON.parse(this.$route.query.orders);
        this.bookingInfo = orders.bookingInfo;
        this.viewDate = new Date();
        this.patientInfos = orders.patientInfo;
      }

      // let patientInfo = this.$route.params.patientInfo.split(",");
      // //{檢查單號,病歷編號,身分證號,病患姓名,出生日期,性別}
      // this.patientInfos = {
      //   orderNo: patientInfo[0],
      //   hrNum: patientInfo[1],
      //   id: patientInfo[2],
      //   name: patientInfo[3],
      //   gender: patientInfo[5]
      // };
      // if (patientInfo[4] != null) this.patientInfos.birthDay = moment(patientInfo[4], "YYYYMMDD");
      // this.viewDate = new Date();
    }

    let _this = this;
    // window.axios.get(configs.publicPath + "../checkItem/ForSpecialTime").then(e => {
    //   _this.checkItems = e.Items;
    //   let bookingCheckItems = [];
    //   let checkItemNos = (_this.checkItemNos == null ? _this.$route.params.checkItemNo : _this.checkItemNos).split(",");
    //   checkItemNos.forEach(no => {
    //     bookingCheckItems.push(_this.checkItems.find(j => j.No == no));
    //   });
    //   let strCheckItemId = bookingCheckItems.map(i => i.Id).join(",");

    //   window.axios.get(configs.publicPath + "../checkItem/MargeCheckItem?checkItems=" + strCheckItemId).then(e => {
    //     _this.itemTabs = e;
    //     _this.currentTabItemId = _this.itemTabs[0].Id;

    //     this.GetBookingInfo();
    //   });
    // });
    //
    //取得mergecheckitemids
    this.GetMergeItemIds();
    // this.bookingObjs.forEach(obj => {
    //   let bookingCheckItems = [];
    //   window.axios.get(configs.publicPath + "../checkItem/ForSpecialTime").then(e => {
    //     _this.checkItems = e.Items;
    //     obj.checkItemNos.forEach(no => {
    //       bookingCheckItems.push(_this.checkItems.find(j => j.No == no));
    //     });
    //     let strCheckItemId = bookingCheckItems.map(i => i.Id).join(",");

    //     window.axios.get(configs.publicPath + "../checkItem/MargeCheckItem?checkItems=" + strCheckItemId).then(e => {
    //       _this.itemTabs = _this.itemTabs.concat(e);
    //       _this.currentTabItemId = _this.itemTabs[0].Id;

    //       this.GetBookingInfo();
    //     });
    //   });
    // });
  },
  mounted() {
    // 引入 Theme:Black, 日後再調成是從 個人設定 中轉入
    // this.ThemeSwitch()
    this.setDefaultBackgroundColor();

    //計算高度
    let sh = this.$refs.scheduleCard.clientHeight;
  },
  beforeDestroy: function() {
    this.destroyed = true;
    this.sockConnection.stop();
  },
  destroyed() {
    console.log(`${this.$logs()}`);
    // 解除 Theme:Black
    const el = document.body;
    el.classList.remove(this.themePacks.themeBlackName);

    // 解除監聽器:攔截 KeyPress
    window.removeEventListener("keydown", this.HKWatch);
  }
};
</script>
<style>
.swal2-container {
  z-index: 30141225 !important;
}

/* schedule 檢查室header */
.themeBlack .e-header-cells {
  background-color: rgba(60, 60, 60, 1) !important;
  color: rgba(255, 255, 255, 0.7) !important;
}

/* schedule 日期header */
.themeBlack .e-resource-cells {
  background-color: rgba(60, 60, 60, 1) !important;
  color: rgba(255, 255, 255, 0.7) !important;
}

/* schedule slot bg */
.themeBlack .e-work-cells {
  background-color: rgba(60, 60, 60, 0.7) !important;
  color: rgba(255, 255, 255, 0.7) !important;
}

/* schedule slot blocked */
.themeBlack .e-block-appointment {
  background-color: rgba(0, 0, 0, 0.7) !important;
  color: rgba(255, 255, 255, 0.7) !important;
}

/* schedule time section left column */
.themeBlack .e-time-slots {
  background-color: rgba(60, 60, 60, 1) !important;
  color: rgba(255, 255, 255, 0.7) !important;
}

/* schedule time range header bar */
.themeBlack .e-toolbar-items {
  background-color: rgba(40, 40, 40, 1) !important;
  color: rgba(255, 255, 255, 0.7) !important;
}

/* schedule buttons */
.themeBlack .e-btn {
  background-color: rgba(0, 0, 0, 0) !important;
  color: rgba(255, 255, 255, 0.7) !important;
}

/* schedule left top square area */
.themeBlack .e-left-indent {
  background-color: rgba(60, 60, 60, 1) !important;
  color: rgba(255, 255, 255, 0.7) !important;
}

/* schedule left top square area */
.themeBlack .e-tbar-btn-text {
  color: rgba(255, 255, 255, 1) !important;
}

/* schedule left top square area */
.themeBlack .e-btn-icon {
  color: rgba(255, 255, 255, 1) !important;
}

/* schedule dialog bg  */
.themeBlack .e-dialog {
  background-color: rgba(60, 60, 60, 1) !important;
  color: rgba(255, 255, 255, 1) !important;
}

/* schedule dialog content  */
.themeBlack .e-dlg-content {
  background-color: rgba(60, 60, 60, 1) !important;
  color: rgba(255, 255, 255, 1) !important;
}

/* schedule dialog header  */
.themeBlack .e-dlg-header-content {
  background-color: rgba(70, 130, 180, 1) !important;
  color: rgba(255, 255, 255, 1) !important;
}

/* schedule dialog header text */
.themeBlack .e-title-text {
  color: rgba(255, 255, 255, 1) !important;
}

/* schedule dialog inputs  */
.themeBlack .e-input-group {
  background-color: rgba(30, 30, 30, 1) !important;
  color: rgba(255, 255, 255, 1) !important;
}

/* schedule dialog inputs  */
.themeBlack .e-footer-content {
  background-color: rgba(70, 130, 180, 1) !important;
  color: rgba(255, 255, 255, 1) !important;
}

/* schedule dialog inputs  */
.themeBlack .e-event-save {
  background-color: rgba(0, 0, 0, 1) !important;
  color: rgba(255, 255, 255, 1) !important;
}

/* schedule tabs bar bg */
.themeBlack .nav {
  background-color: rgba(30, 30, 30, 1) !important;
  color: rgba(255, 255, 255, 0.7) !important;
}
</style>

<style scoped>
/* -- 這行必須放在這裡, 才有作用 --*/
.themeBlack .input-group-text {
  background-color: rgba(0, 0, 0, 0.7);
  color: rgba(255, 255, 255, 0.7);
}

.themeBlack .cal-bg {
  background-color: rgba(60, 60, 60, 1);
  color: rgba(255, 255, 255, 0.7);
}

.cardHeader {
  padding: 0 1.25rem; /*2px 1.25rem;*/
  white-space: nowrap;
}

.scrollBox {
  width: 100%;
  height: 132px; /*132px*/
  white-space: nowrap;
  overflow: auto;
}

.sb4RHis {
  width: 100%;
  height: 344px;
  white-space: nowrap;
  overflow: auto;
}

.themeBlack select {
  color: #fff;
  background-color: rgba(0, 0, 0, 0.7);
}
</style>
