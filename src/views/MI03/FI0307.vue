<script src="//unpkg.com/vue"></script>
<script src="//unpkg.com/element-ui"></script>
<script src="//unpkg.com/element-ui/lib/umd/locale/zh-TW.js"></script>
<template>
  <div class="pageContent zhTW" style="min-height:829px;">
    <b-card no-body class="mx-1">
      <b-card-header class="bg-primary text-white cardHeader">
        <b-row no-gutters>
          <b-col cols="6" class="float-left text-left">報告搜尋作業</b-col>
        </b-row>
      </b-card-header>
      <b-card-text class="text-left py-1">
        <b-container fluid class="px-1">
          <b-row no-gutters>
            <b-col class="px-1 grid" md="6">
              <b-form-group
                id="fieldset-horizontal"
                label="白名單"
                label-for="input-horizontal"
                style="width:100%; height:40px; line-height: 40px; border:1px solid #D8DDE2 ;border-radius:5px"
                class="m-0 px-2"
              >
                <el-select
                  class="mx-1"
                  style="float:right ;width:calc(100% - 100px) ;position:absolute; right:0px;top:0px"
                  v-model="Whitevalue"
                  multiple
                  filterable
                  allow-create
                  default-first-option
                  placeholder="白名單內容"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </b-form-group>
            </b-col>
            <b-col class="px-1" md="6">
              <b-form-group
                id="fieldset-horizontal"
                label="黑名單"
                label-for="input-horizontal"
                style="width:100%; height:40px; line-height: 40px;border:1px solid #D8DDE2 ;border-radius:5px "
                class="m-0 px-2"
              >
                <el-select
                  class="mx-1"
                  style="float:right ;width:calc(100% - 100px) ;position:absolute; right:0px;top:0px"
                  v-model="Blackvalue"
                  multiple
                  filterable
                  allow-create
                  default-first-option
                  placeholder="黑名單內容"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row no-gutters class="mt-1">
            <b-col sm="2" class="px-1">
              <b-input-group prepend="檢查單號">
                <b-input ref="AccessionNo1" v-model="ViewData.AccessionNo" />
              </b-input-group>
            </b-col>
            <b-col sm="2" class="px-1">
              <b-input-group prepend="病歷編號">
                <b-input v-model="ViewData.PatientId" />
              </b-input-group>
            </b-col>
            <b-col sm="2" class="px-1">
              <b-input-group prepend="病患年齡">
                <b-input min="0" v-model="ViewData.PatientAge" type="number" />
              </b-input-group>
            </b-col>
            <b-col sm="2" class="px-1">
              <b-input-group prepend="病患來源">
                <b-select v-model="ViewData.PatientSourceCode" :options="PatientSource" />
              </b-input-group>
            </b-col>
            <b-col sm="2" class="px-1">
              <b-input-group prepend="檢查項目">
                <b-form-input v-model="ViewData.ProcedureCode" list="my-list-id"></b-form-input>
                <!--  :disabled="medicineDisable" -->
                <datalist id="my-list-id">
                  <option
                    v-for="(Item,idx) in checkItemSource"
                    v-bind:key="Item.idx"
                  >{{ Item.value}}--{{ Item.text}}</option>
                </datalist>
                <!-- <b-select v-model="ViewData.ProcedureCode" :options="checkItemSource" /> -->
              </b-input-group>
            </b-col>
            <b-col sm="2" class="px-1">
              <b-input-group prepend="病患性別">
                <b-form-radio-group
                  class="pt-2 pl-2 rounded-right"
                  style="border:1px solid #ced4da"
                  v-model="ViewData.PatientSex"
                >
                  <b-form-radio value="Male">男</b-form-radio>
                  <b-form-radio value="Female">女</b-form-radio>
                </b-form-radio-group>
              </b-input-group>
            </b-col>
          </b-row>
          <b-row no-gutters class="mt-1">
            <b-col sm="2" class="px-1" style="width:340px">
              <b-input-group prepend="報告撰寫者">
                <b-form-input v-model="ViewData.DxreportPhysicianId" list="DxreportPhysicianSource"></b-form-input>
                <!--  :disabled="medicineDisable" -->
                <datalist id="DxreportPhysicianSource">
                  <option
                    v-for="(Item,idx) in DxreportPhysicianSource"
                    v-bind:key="Item.idx"
                    :value="Item.value"
                  >{{ Item.text}}</option>
                </datalist>
              </b-input-group>
            </b-col>
            <b-col sm="2" class="px-1">
              <b-input-group prepend="審核醫師">
                <b-form-input v-model="ViewData.IssuePhysicianId" list="IssuePhysicianSource"></b-form-input>
                <!--  :disabled="medicineDisable" -->
                <datalist id="IssuePhysicianSource">
                  <option
                    v-for="(Item,idx) in IssuePhysicianSource"
                    v-bind:key="Item.idx"
                  >{{ Item.value}}--{{ Item.text}}</option>
                </datalist>
              </b-input-group>
            </b-col>
            <b-col sm="2" class="px-1">
              <b-input-group prepend="開單科別">
                <b-form-input v-model="ViewData.RequestingServiceId" list="RequestingServiceSource"></b-form-input>
                <!--  :disabled="medicineDisable" -->
                <datalist id="RequestingServiceSource">
                  <option
                    v-for="(Item,idx) in RequestingServiceSource"
                    v-bind:key="Item.idx"
                  >{{ Item.value}}--{{ Item.text}}</option>
                </datalist>
                <!-- <b-select v-model="ViewData.RequestingServiceId" :options="RequestingServiceSource" /> -->
              </b-input-group>
            </b-col>
            <b-col class="pl-1">
              <b-input-group prepend="檢查日期" style="width:340px">
                <div id="CheckDataPicker" class="form-control" style="padding: 0px 0px ;">
                  <ejs-daterangepicker v-model="CheckDateRange"></ejs-daterangepicker>
                </div>
              </b-input-group>
            </b-col>
          </b-row>
          <b-row no-gutters class="mt-1">
            <b-button variant="primary" @click="Query">
              <font-awesome-icon icon="search" />進行查詢
            </b-button>
            <b-button class="ml-1" variant="success" @click="clear">
              <font-awesome-icon icon="eraser" />清除條件
            </b-button>
            <!-- <b-button class="ml-1" variant="success" @click="print"> -->
            <b-button class="ml-1" variant="success" @click="print">
              <font-awesome-icon icon="eraser" />報告列印
            </b-button>
            <b-col sm="2" class="px-1">
              <b-input-group prepend="列印格式">
                <b-form-radio-group
                  class="pt-2 pl-2 rounded-right"
                  style="border:1px solid #ced4da"
                  v-model="ViewData.printType"
                >
                  <b-form-radio value="0">A4</b-form-radio>
                  <b-form-radio value="1">B6</b-form-radio>
                </b-form-radio-group>
              </b-input-group>
            </b-col>
          </b-row>
        </b-container>
      </b-card-text>
    </b-card>
    <b-container fluid class="mt-1 mx-0 pl-1 pr-0">
      <b-row no-gutters>
        <b-col>
          <div id="block4QueryResult" class="mr-1 rounded" style="border:1px solid #ced4da;">
            <!-- v-bind:OpButton1Func="RowClickFunction" -->
            <twp
              ref="twp1"
              v-bind:FieldConfig="tableConfig4QueryResult"
              v-bind:RowData="tableContent4QueryResult"
              CheckBox1Head
              :CheckBox1Lead="true"
              :isBackEndPagination="false"
              :CheckBox1Func="itemChecked"
              :OnHeaderCheckBoxChange="OnHeaderCheckBoxChange"
              v-on:allUnSelected="ResetFirstCheckItem"
              :CheckIfShowRowCheckBox="CheckIfIdMatchMuitiSelect"
              :CheckIfShowHeaderCheckBox="CheckIfShowHeaderCheckBox"
              :OpButton1Func="getReportData"
              OpButton1Text="確認報告"
            ></twp>
          </div>
        </b-col>
      </b-row>
    </b-container>
    <!-- thomas edit -->
    <b-modal
      ref="showAlert"
      header-bg-variant="danger"
      header-text-variant="light"
      hide-footer
      title="貼心提醒"
    >
      <p>請至少設定一組條件，再進行搜尋</p>
    </b-modal>
  </div>
</template>

<script>
const configCollection = [
  //{ key: 'dId', label: '項次', sortable: false, thClass: "no-wrap", tdClass: "no-wrap" },DxrVersion
  {
    key: "AccessionNo",
    label: "檢查單號",
    sortable: true,
    thClass: "text-nowrap",
    tdClass: "no-wrap font-weight-bold"
  },
  {
    key: "DxrVersion",
    label: "報告版次",
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
    key: "ScheduleTime",
    label: "檢查日期",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap"
  },
  {
    key: "ProcedureName",
    label: "檢查項目",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap text-left"
  },
  {
    key: "PatientSex",
    label: "性別",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap"
  },
  {
    key: "PatientAge",
    label: "年齡",
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
    key: "DxreportPhysicianName",
    label: "報告撰寫者",
    sortable: true,
    thClass: "text-nowrap",
    tdClass: "no-wrap font-weight-bold"
  },
  {
    key: "IssuePhysicianName",
    label: "審核醫師",
    sortable: true,
    thClass: "text-nowrap",
    tdClass: "no-wrap font-weight-bold"
  },
  {
    key: "RequestingServiceName",
    label: "開單科別",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap"
  }
];
import Vue from "vue";
import twp from "@/components/TWPv5_1";
import { Select } from "element-ui";
import lang from "element-ui/lib/locale/lang/zh-TW";
import locale from "element-ui/lib/locale";
locale.use(lang);
var moment = require("moment");
import * as configs from "@/config";
import { DateRangePickerPlugin } from "@syncfusion/ej2-vue-calendars";
import { dateFormatMixin } from "@/SupportLib_J.js";
import {
  DataManager,
  WebApiAdaptor,
  Predicate,
  Query
} from "@syncfusion/ej2-data";
Vue.component(Select.name, Select);
Vue.use(DateRangePickerPlugin);
export default {
  //報告搜尋作業
  name: "FI0307",
  components: { twp },
  mixins: [dateFormatMixin],
  data() {
    return {
      theProcedure: {
        OrderNo: "",
        StatusName: "",
        AccessionNo: "123A567BC", //檢查單號(大單號)
        StudyDate: "2019/10/14", //檢查日期
        Modality: "CT/MRI", //檢查儀器
        PatientId: "1234567-8", //病歷編號
        PatientSourceType: "O-門診", //病患來源
        PatientName: "趙大升",
        PatientSex: "M-男性",
        PatientBirthday: "1943/12/31",
        PatientAge: 76,
        Subjective: "這裡放的是病患主訴",
        Objective: "這裡是醫師客訴",
        //RadiographerNote: '這是放射師的檢查註記',
        RadiographerNote:
          "這是放射師的檢查註記\n這是放射師的檢查註記\n這是放射師的檢查註記\n這是放射師的檢查註記\n這是放射師的檢查註記\n這是放射師的檢查註記\n這是放射師的檢查註記\n這是放射師的檢查註記\n",
        RequestingPhysicianId: "1231",
        RequestingPhysicianName: "開單醫師",
        BedNo: "701221", //床號
        ShiftNote: "這是交班記錄"
      },
      firstCheckedItem: null,
      //檢查項目來源
      checkItemSource: [],
      //病患來源
      PatientSource: [],
      //報告醫生
      DxreportPhysicianSource: [],
      //審核醫生
      IssuePhysicianSource: [],
      //開單科別來源
      RequestingServiceSource: [],
      ObjApp: null,
      Whitevalue: [],
      Blackvalue: [],
      options: [],
      value: [],
      tableConfig4QueryResult: configCollection,
      tableContent4QueryResult: null,
      //檢查起訖日
      CheckDateRange: ["", ""],
      //for query
      ViewData: {
        //檢查單號
        AccessionNo: "",
        //病歷編號
        PatientId: "",
        //檢查起
        ScheduleTimeStart: "",
        //檢查訖
        ScheduleTimeEnd: "",
        //檢查項目
        ProcedureCode: "",
        //性別
        PatientSex: "",
        //年齡
        PatientAge: "",
        //病患來源
        PatientSourceCode: "",
        //報告醫生
        DxreportPhysicianId: "",
        //審核醫生
        IssuePhysicianId: "",
        //開單科別
        RequestingServiceId: "",
        //列印格式0:A4 1:B6 預設0
        printType: 0
      },
      checkItemList: []
    };
  },
  methods: {
    //查詢報告
    async Query() {
      let length =
        this.Whitevalue.length +
        this.Blackvalue.length +
        this.ViewData.AccessionNo.length +
        this.ViewData.PatientId.length +
        this.CheckDateRange[0].length +
        this.ViewData.ProcedureCode.length +
        this.ViewData.PatientSex.length +
        this.ViewData.PatientAge.length +
        this.ViewData.PatientSourceCode.length +
        this.ViewData.DxreportPhysicianId.length +
        this.ViewData.IssuePhysicianId.length +
        this.ViewData.RequestingServiceId.length;
      console.log(length);
      if (length > 0) {
        let White = Object.values(this.Whitevalue).join(",");
        let Black = Object.values(this.Blackvalue).join(",");
        this.ViewData.Whitelist = White == "" ? [] : [White];
        this.ViewData.BlackList = Black == "" ? [] : [Black];
        //表示有KEY入時間
        if (this.CheckDateRange != null) {
          if (this.CheckDateRange[0] != "" && this.CheckDateRange.length == 2) {
            this.ViewData.ScheduleTimeStart = this.CheckDateRange[0];
            this.ViewData.ScheduleTimeEnd = this.CheckDateRange[1];
          }
        }
        console.log(this.ViewData);
        this.ObjApp.WaitingShow();

        await window.axios
          .post("/report/Search", this.ViewData)
          .then(e => {
            e.Items.forEach(x => {
              x.ScheduleTime = moment(x.ProcedureCompleted).format(
                "YYYY/MM/DD"
              );
            });
            this.tableContent4QueryResult = e.Items;

            console.log(this.tableContent4QueryResult);
          })
          .catch(function(error) {
            this.ObjApp.TimingMessage("存取時發生錯誤! 請稍後再試.", 2);
          });
        this.ObjApp.WaitingHide();
      } else {
        this.$refs["showAlert"].show();
      }
    },
    //清除條件
    clear() {
      //檢查單號
      (this.ViewData.AccessionNo = ""),
        //病歷編號
        (this.ViewData.PatientId = ""),
        //檢查起
        (this.ViewData.scheduleTimeStart = ""),
        //檢查訖
        (this.ViewData.scheduleTimeEnd = ""),
        //檢查項目
        (this.ViewData.ProcedureCode = ""),
        //性別
        (this.ViewData.PatientSex = ""),
        //年齡
        (this.ViewData.PatientAge = ""),
        //病患來源
        (this.ViewData.PatientSourceCode = ""),
        //報告醫生
        (this.ViewData.DxreportPhysicianId = ""),
        //審核醫生
        (this.ViewData.IssuePhysicianId = ""),
        //開單科別
        (this.ViewData.RequestingServiceId = "");
      this.CheckDateRange = ["", ""];

      this.Whitevalue = [];
      this.Blackvalue = [];
    },
    //單一item的checkbox點擊觸發
    itemChecked(item) {
      if (this.firstCheckedItem == null) this.firstCheckedItem = item;
      if (item) {
        if (item.showCheckBox) {
          if (item.TWPCheckBox1Value) item.TWPCheckBox1Value = false;
          else item.TWPCheckBox1Value = true;
        }
      }
      // setTimeout(x => {
      //   //快速排檢按鈕顯示 ROLE:
      //   // this.QuickcheckinBtn=false;
      //   let data = this.$refs["twp1"].checkedItems;
      //   let checkList = [];
      //   data.forEach(x => {
      //     checkList.push(x.Status);
      //   });
      // }, 500);
    },
    async getReportData(data) {
      //利用AccessionNo反查報告相關內容
      console.log(this.$refs["twp1"].checkedItems);
      console.log(data.AccessionNo);
      await new DataManager({
        //status 11 未排檢、12已排檢、21已報到
        url: configs.publicPath + "../exam/List",
        adaptor: new WebApiAdaptor(),
        crossDomain: true
      })
        //
        .executeQuery(
          new Query().where("AccessionNo", "contains", data.AccessionNo)
        )
        .then(r => {
          let dataList = r.actual.Items[0];
          dataList.isFromFI0307 = true;
          dataList.ProcedureCompleted = this.DateToString(
            dataList.ProcedureCompleted,
            true
          );
          dataList.PatientBirthday = this.DateToString(
            dataList.PatientBirthday,
            false
          );
          dataList.StudyTime =
            dataList.StudyTime == null
              ? "無影像"
              : this.DateToString(dataList.StudyTime, true);
          //時間變成user可接受模式
          // dataList.forEach(i => {
          //   i.ProcedureCompleted = this.DateToString(
          //     i.ProcedureCompleted,
          //     true
          //   );
          //   i.PatientBirthday = this.DateToString(i.PatientBirthday, false);
          //   i.StudyTime =
          //     i.StudyTime == null
          //       ? "無影像"
          //       : this.DateToString(i.StudyTime, true);

          //   if (i.EmgFlag === "Y") {
          //     i._rowVariant = "danger";
          //   }
          //   // IssuePhysicianId 審合醫師
          //   // DxreportPhysicianName 報告醫師
          //   this.theProcedure.RequestingPhysicianName =
          //     i.RequestingPhysicianName;
          // });
          console.log(r);
          //偷塞DxrVersion給
          dataList.DxrVersion = data.DxrVersion;
          console.log(dataList);
          window.dtcEvaluationDataList = dataList ? dataList : [];
          console.log(window.dtcEvaluationDataList);

          this.$router.replace({
            name: "FI0306-1",
            params: {
              FI0307TempData: this.tableContent4QueryResult,
              FI0307TempCheckItems: this.$refs["twp1"].checkedItems
            }
          });
        });
      // console.log(this.theProcedure);
      // window.dtcEvaluationDataList = x ? x : [];
      // // alert("FI0306");
      // console.log(window.dtcEvaluationDataList);
      // this.$router.replace({ name: "FI0306-1" });
    },
    OnHeaderCheckBoxChange(checked) {
      if (!checked) this.ResetFirstCheckItem();
    },
    ResetFirstCheckItem() {
      this.firstCheckedItem = null;
    },
    //twp list判斷item是否顯示checkbox, 此處判斷item patient id是否和已選的item相同,
    //一單多檢的多選判斷
    CheckIfIdMatchMuitiSelect(item) {
      if (this.firstCheckedItem == null) return true;

      return item.PatientId == this.firstCheckedItem.PatientId;
    },
    //判斷是否顯示header的checkbox, 如果list的content 皆為同patient id,
    //或 已點某筆item 判斷出相同patient id之row, 則顯示
    CheckIfShowHeaderCheckBox() {
      if (this.firstCheckedItem == null) {
        return false;
      } else {
        return true;
      }
    },
    generatePrintData(ReportResults) {
      const printPart = document.createElement('div');
      printPart.setAttribute('id', 'print_parts');
      ReportResults.forEach(d => {
        const structures = new Array(6).fill('1').reduce((a,c,k)=> {
          let content = d[`StructureContent${k+1}`];
          let iptval = JSON.parse(d[`StructureData${k+1}`]);
          iptval = !iptval ? null : iptval.reduce((a,c)=> Object.assign(a, {[c.name]:c.value}), {});
          if(iptval) {
            let tmpDiv = document.createElement('div');
            tmpDiv.style.display = "none";
            document.body.appendChild(tmpDiv);
            tmpDiv.innerHTML = content;
            tmpDiv.querySelectorAll('input, textarea').forEach( ipt => {
              if(iptval[ipt.name]) {
                if(ipt.type==='text' || ipt.type==='textarea') {
                  let tpd = document.createElement('div');
                  (ipt.type==='text') && (ipt.setAttribute('value', iptval[ipt.name]));
                  tpd.setAttribute('class', `editable${ipt.type==='textarea'?' txtarea':''}`);
                  tpd.innerHTML = iptval[ipt.name].replace(/\r\n/g, "<br class='keep' />");
                  ipt.parentNode.insertBefore(tpd, ipt.nextSibling);
                  ipt.parentNode.removeChild(ipt);
                } else if( (ipt.type=='checkbox' || ipt.type=='radio') && ipt.value == iptval[ipt.name]) {
                  ipt.setAttribute('checked', 'checked');
                }
              }
            });
            content = tmpDiv.innerHTML;
            document.body.removeChild(tmpDiv);
          }
          return a + content.replace(/\n/g, '<br />')
        } , '');

        printPart.innerHTML += `
          <div class='inner'>
            <h1 class='py-2 m-0'>${ d.ReportName }</h1>
            <div class='row py-2'>
              <div class='col-4'>病患姓名： ${d.PatientName}</div><div class='col-4'>科  別： ${d.Modality}</div><div class='col-4'>病歷號碼： ${d.PatientId}</div>
              <div class='col-4'>主治醫生： ${d.DoctorName}</div><div class='col-4'>性  別： ${d.Sex}</div><div class='col-4'>檢查日期： ${d.CheckDate}</div>
              <div class='col-4'>出生日期： ${d.Birthday}</div><div class='col-4'>年  齡： ${d.Age}</div><div class='col-4'>檢查日期： ${d.CheckTime}</div>
              <div class='col-4'>病床號碼： ${d.HospitalBedNo}</div><div class='col-4'>申請日期： ${d.CreateDate}</div><div class='col-4'>檢查單號： ${d.AccessionNo}</div>
              <div class='col-4'>檢查項目： ${d.CheckItem}</div>
            </div>
            <h2 class='p-2 m-0'>Summy:</h2>
            <div class='p-1'>${d.Summary.replace(/\n/g, "<br class='keep' />")}</div>
            <h2 class='p-2 m-0'>ReportContent:</h2>
            <div class='p-1'>${d.ReportContent.replace(/\n/g, "<br class='keep' />")}</div>
            <h2 class='p-2'>Imaging finding:</h2>
            <div class='imaging-finding p-1'>${structures}</div>
          <div>
        `;
      });
      
      this.$root.$el.classList.add('noPrint');
      document.body.appendChild(printPart);
      printPart.querySelectorAll('input[type=radio], p, br, fieldset, div, table').forEach( el => {
        switch(el.tagName) {
          case 'INPUT':
            let trad = document.createElement('div');
            trad.setAttribute('class', `radio${el.getAttribute('checked')?' checked':''}`);
            el.parentNode.insertBefore(trad, el.nextSibling);
            el.parentNode.removeChild(el);
            break;
          case 'TABLE':
          case 'DIV':
          case 'FIELDSET':
          case 'P':
            el.removeAttribute('style');
            break;
          case 'BR':
            (!el.classList.contains('keep')) && (el.parentNode.removeChild(el));            
            break;
          default:
            break;
        }
      });
      window.print();
      document.body.removeChild(document.getElementById('print_parts'));
      this.$root.$el.classList.remove('noPrint');
    },
    print() {
      // console.log(this.ViewData);
      //判斷是否有勾選至少一筆，此方法有問題，進入報告後再出來會無資料 需另外處理
      let data = this.$refs["twp1"].checkedItems;
      if(data.length === 0) {this.ObjApp.TimingMessage("請至少選擇一筆報告.", 2);return;}
      const checkItemList = Array.from(new Set(data.map(d => d.AccessionNo)));
      window.axios
        .get(`/exam/ExamReport?accession_no=${checkItemList.join(',')}&category=${this.ViewData.printType}`)
        .then(({ReportResults}) => {
          this.generatePrintData(ReportResults);
        })
        .catch((error) => {
          console.log(error);
          this.ObjApp.TimingMessage("存取時發生錯誤! 請稍後再試.", 2);
        });
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
      this.checkItemSource = convertedCollections;
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
      this.PatientSource = convertedCollections;
    },
    //取得打字員與報告醫師資料
    async GetOptionsDxreportPhysician() {
      console.log(this.$logs());

      //
      let itemPack = null;
      let convertedCollections = [{ value: null, text: "請選擇" }];
      //
      let subPath = "../Employee/SelectNoList?staffType=25,28&getAll=false";
      //
      //
      //不同類型醫師或打字員代碼的query
      // let query = new Query()
      // let predicateState = new Predicate("StaffType", "equal", "25")//住院醫師
      // predicateState = predicateState.or("StaffType", "equal", "28")//打字員
      // predicateState = predicateState.or("StaffType", "equal", "21")//主治
      // query = query.where(predicateState)
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

      this.DxreportPhysicianSource = convertedCollections;
    },
    //取得主治醫師
    async GetOptionsIssuePhysicianSource() {
      console.log(this.$logs());

      let itemPack = null;
      let convertedCollections = [{ value: null, text: "請選擇" }];
      let subPath = "../Employee/SelectNoList?staffType=21&getAll=false";
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

      this.IssuePhysicianSource = convertedCollections;
    },
    //取得開單科別
    async GetOptionsRequestingServiceSource() {
      console.log(this.$logs());

      let itemPack = null;
      let convertedCollections = [{ value: null, text: "請選擇" }];
      let subPath = "../institution/SelectNoList?parentId=WAN_FANG";
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

      this.RequestingServiceSource = convertedCollections;
    }
  },
  created() {
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
    // //若從FI0306-1回來 此時應該有資料才對...
    // if (this.$route.params.FI0307TempData) {
    //   console.log(this.$route.params.FI0307TempData);
    //   this.tableContent4QueryResult = this.$route.params.FI0307TempData;
    //   this.$refs["twp1"].checkedItems = this.$route.params.FI0307TempCheckItems;
    // }

    //檢查項目下拉選單
    this.GetOptionsCheckItem();
    //病患來源下拉選單
    this.GetOptionsPatientSource();
    //住院(打字員)醫師列表
    this.GetOptionsDxreportPhysician();
    //審核醫師列表
    this.GetOptionsIssuePhysicianSource();
    //取得開單科別
    this.GetOptionsRequestingServiceSource();
  },
  mounted() {
    //若從FI0306-1回來 此時應該有資料才對...
    if (this.$route.params.FI0307TempData) {
      console.log(this.$route.params.FI0307TempData);
      this.tableContent4QueryResult = this.$route.params.FI0307TempData;
      this.$refs["twp1"].checkedItems = this.$route.params.FI0307TempCheckItems;
    }
  }
};
</script>

<style scoped >
@import url("//unpkg.com/element-ui@2.13.0/lib/theme-chalk/index.css");
.cardHeader {
  padding: 2px 1.25rem;
}
#ModalButton {
  width: 766px;
  background-color: #01579b;
}
#Button_color {
  background-color: #01579b;
}
</style>
<style lang="scss" >
@import '../../styles/print.scss';
@media (min-width: 992px) {
  #ModalSize .modal .modal-huge {
    max-width: 100% !important;
    width: 100% !important;
  }
}

#ModalSize .modal-dialog {
  max-width: 95%;
  width: 95%;
}

#ModalSize .modal .modal-huge {
  max-width: 95%;
  width: 95%;
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
</style>
<style lang="scss" scoped>
.grid {
  display: flex;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: 1fr;
}
* {
  // border: 1px solid;
}
</style>
