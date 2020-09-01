<!-- 
input:
//取得報告醫師列表 (搜尋住院醫師, 主治醫師)
GetOptionsDxreportPhysician()

//取得檢查項目列表
GetOptionsCheckItem()

//取得儀器類別列表
GetOptionsInspectDevice()

//取得檢查單
//params: 
//index: 病患來源索引值 0:全部exclude健診, 1:急診含急件, 2:門診, 3:住院, 5:健診
//toPage: 分頁碼
//nPerPage: 每頁資料筆數
GetDataContent(index, toPage, nPerPage)


傳出資料: 檢查單資訊
output: examData 

sample data:

-->
<template>
  <div id="FI0304" class="pageContent pb-1">
    <b-card no-body class="mx-1">
      <b-card-header class="bg-warning text-dark cardHeader">
        <b-row no-gutters>
          <b-col cols="6" class="float-left text-left font-weight-bold"
            >報告待打清單 用戶: [{{ $store.state.Profile4User.staffName }}] {{ $store.state.Profile4User.employeeName }}</b-col
          >
          <b-col cols="6" class="float-right text-right">
            <b-dropdown id="dropdown-1" text="背景更換" dropleft class="m-md-1">
              <b-dropdown-item :active="isWhite" class="bg-clr" @click="bgUpdate('white', $event)">白色</b-dropdown-item>
              <b-dropdown-item :active="isBlack" class="bg-clr" @click="bgUpdate('black', $event)">黑色</b-dropdown-item>
              <b-dropdown-item :active="isGray" class="bg-clr" @click="bgUpdate('#868e96', $event)">灰色</b-dropdown-item>
            </b-dropdown>
            <!-- <font-awesome-icon icon="circle" class="mr-2 text-black cursor-pointer" @click="ThemeSwitch" /> -->
          </b-col>
        </b-row>
      </b-card-header>
      <b-card-text class="text-left py-1">
        <b-container fluid class="px-1">
          <b-row no-gutters>
            <!-- <b-col sm="2" class="px-1">
              <b-input-group prepend="報告醫師">
                <b-input v-model="theProcedure.RequestingPhysicianName" readonly />
              </b-input-group>
            </b-col>-->

            <b-col sm="2" class="px-1">
              <b-input-group prepend="報告醫師">
                <b-select v-model="theProcedure.DxreportPhysicianId" :options="optionsDxreportPhysician" @change="ChangeSearchConditions" />
              </b-input-group>
            </b-col>

            <b-col sm="2" class="px-1">
              <b-input-group prepend="檢查單號">
                <b-input v-model="theProcedure.AccessionNo" ref="inputAccessionNo" />
              </b-input-group>
            </b-col>

            <b-col sm="2" class="px-1">
              <b-input-group prepend="檢查項目">
                <b-select v-model="selectedCheckItem" :options="optionsCheckItem" @change="ChangeSearchConditions" />
                <!-- <b-form-input list="optionsCheckItem" />
                <datalist id="optionsCheckItem">
                  <option
                    style="color:black;"
                    v-for="checkItem in optionsCheckItem"
                    :key="checkItem.value"
                  >{{ checkItem.text }}</option>
                </datalist>-->
              </b-input-group>
            </b-col>

            <b-col sm="2" class="px-1">
              <b-input-group prepend="檢查儀器">
                <b-select v-model="selectedInspectDevice" :options="optionsInspectDevice" @change="ChangeSearchConditions" />
              </b-input-group>
            </b-col>

            <b-col class="px-1 text-right">
              <b-button variant="success" @click="ClearConditions"> <font-awesome-icon icon="eraser" />清除條件 </b-button>
            </b-col>
          </b-row>
          <b-row no-gutters class="mt-1">
            <b-col sm="2" class="px-1">
              <b-input-group prepend="登打狀態">
                <b-select v-model="selectedStatus" :options="optionsStatus" @change="ChangeStatus" />
              </b-input-group>
            </b-col>

            <b-col sm="4" class="px-1">
              <b-input-group prepend="檢查日期" style="width:340px">
                <div id="spcialDatePicker" class="form-control" style="padding:0px">
                  <ejs-daterangepicker :strictMode="true" :minDays="min" v-model="DateRange" placeholder="搜尋範圍"></ejs-daterangepicker>
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

    <!--
		<b-card no-body id="cardTabs" class="my-1 mx-1 py-2 px-2 border rounded">
    -->
    <b-card no-body id="cardTabs" class="m-1">
      <!--
			<b-tabs v-model="tabIndex" fill content-class="px-1 py-1" title-link-class="bg-primary">
				<b-tab card v-for="(tab, index) in tabs" :disabled="tab.disabled" v-bind:key="tab.label" :title="tabTitle(tab)" :title-link-class="linkClass(index)">
					<b-row no-gutters>
						<b-col>
							<div id="block4QueryResult" class="rounded" style="border:1px solid #ced4da; min-height:610px;">
								<twp v-if="index == 4" ref="twp3" CheckBox1Head="" v-bind:CheckBox1Func="itemChecked" :CheckBox1Lead="true" v-bind:FieldConfig="tableConfig4QueryResult" v-bind:RowData="tableContent4QueryResult[index]" v-bind:OpButton1Func="RowClickFunction"></twp>
								<twp v-else ref="twp3" v-bind:FieldConfig="tableConfig4QueryResult" v-bind:RowData="tableContent4QueryResult[index]" v-bind:OpButton1Func="RowClickFunction"></twp>
							</div>
						</b-col>
					</b-row>
				</b-tab>
			</b-tabs>
      -->
      <b-tabs v-model="tabIndex" fill title-link-class="bg-primary">
        <b-tab card v-for="(tab, index) in tabs" :disabled="tab.disabled" v-bind:key="tab.label" :title="tabTitle(tab)" :title-link-class="linkClass(tab, index)">
          <div id="block4QueryResult" class="mr-1 rounded" style="border:0px solid #ced4da; height:680px;" overflow="auto">
            <b-row no-gutters>
              <b-col>
                <!--
								<twp v-if="index == 5" ref="twp3" CheckBox1Head="" v-bind:CheckBox1Func="itemChecked" :CheckBox1Lead="true" v-bind:FieldConfig="tableConfig4QueryResult" v-bind:RowData="tableContent4QueryResult[index]" v-bind:OpButton1Func="RowClickFunction"></twp>
								<twp v-else ref="twp3" v-bind:FieldConfig="tableConfig4QueryResult" v-bind:RowData="tableContent4QueryResult[index]" v-bind:OpButton1Func="RowClickFunction"></twp>
                -->
                <twp
                  v-if="tab.id == 'FI0304_hr'"
                  ref="twpMulti"
                  :TableId="tab.id"
                  heightForScroll="570px"
                  CheckBox1Head
                  :CheckBox1Func="itemChecked"
                  :CheckBox1Lead="true"
                  :FieldConfig="tableConfig4QueryResult"
                  :DataFetch="GetDataContent"
                  :MultiSelectFunc1="OpenMultiReport"
                  :MultiSelectFunc2="AssignReport"
                  selectFunc2String="分派其他醫師"
                  :enableRowClick="true"
                  :OpButton1Func="RowClickFunction"
                  :OpButton2Func="OnClickMyFavorite"
                  OpButton2Text="加入個案追蹤"
                  :ifSendBackTheList="true"
                  :CheckIfShowRowCheckBox="CheckIfShowRowCheckBox"
                ></twp>

                <twp
                  v-else-if="tab.id == 'FI0304_pendingAppr'"
                  ref="twp3"
                  :TableId="tab.id"
                  heightForScroll="570px"
                  CheckBox1Head
                  :CheckBox1Func="itemChecked"
                  :CheckBox1Lead="true"
                  :FieldConfig="tableConfig4QueryResult"
                  :DataFetch="GetDataContent"
                  :MultiSelectFunc2="AssignReport"
                  :MultiSelectFunc3="BatchApprove"
                  selectFunc2String="分派其他醫師"
                  selectFunc3String="批次審核上傳"
                  :enableRowClick="true"
                  :OpButton1Func="RowClickFunction"
                  :OpButton2Func="OnClickMyFavorite"
                  OpButton2Text="加入個案追蹤"
                  :ifSendBackTheList="true"
                ></twp>

                <twp
                  v-else
                  ref="twp3"
                  :TableId="tab.id"
                  heightForScroll="570px"
                  CheckBox1Head
                  :CheckBox1Func="itemChecked"
                  :CheckBox1Lead="true"
                  :FieldConfig="tableConfig4QueryResult"
                  :DataFetch="GetDataContent"
                  :MultiSelectFunc2="AssignReport"
                  selectFunc2String="分派其他醫師"
                  :enableRowClick="true"
                  :OpButton1Func="RowClickFunction"
                  :OpButton2Func="OnClickMyFavorite"
                  OpButton2Text="加入個案追蹤"
                  :ifSendBackTheList="true"
                ></twp>
              </b-col>
            </b-row>
          </div>
        </b-tab>
      </b-tabs>
    </b-card>

    <b-modal
      id="WinReportEdit0304"
      ref="Window4ReportEdit"
      centered
      hide-footer
      size="xl"
      no-fade
      header-bg-variant="warning"
      header-text-variant="dark"
      body-class="py-1 px-1 themeModal"
    >
      <template slot="modal-title">
        <font-awesome-icon icon="edit" class="mr-1" />
        <span class="zhTW">登打報告{{ reportEditTitle }}</span>
      </template>

      <reportEdit :GetParams="GetParams" @CloseReportEdit="CloseReportEdit" @RefreshCheckedItems="RefreshCheckedItems" />
    </b-modal>

    <b-modal ref="win4assignReport" hide-footer header-bg-variant="warning" header-text-variant="dark" body-class="py-1 px-1 themeModal">
      <template slot="modal-title">
        <font-awesome-icon icon="user-friends" class="mr-1" />
        <span class="zhTW">分派報告{{ reportAssignTitle }}</span>
      </template>
      <div class="mr-1 rounded">
        <b-row no-gutters>
          <b-col class="p-2">
            <b-input-group>
              <b-input-group-prepend>
                <b-button class="bg-primary" style="border-style: none;">選擇分派醫師</b-button>
              </b-input-group-prepend>
              <b-select v-model="selectedAssignDoctor" :options="optionsAssignDoctor" @change="ChangeAssignDoctor" />
            </b-input-group>

            <!-- <b-input-group prepend='檢查室'>
                <b-select v-model='selectedLabRoom' :options='optionsLabRoom' @change='ReloadDataContent'  style="background-color:orange;"/>
            </b-input-group>-->
          </b-col>
        </b-row>

        <b-row no-gutters>
          <b-col class="p-2 text-right">
            <b-button variant="success" @click="ConfirmAssignReport"> <font-awesome-icon icon="user-check" />確認分派 </b-button>
            <b-button variant="danger" @click="CancelAssignReport" class="ml-4"> <font-awesome-icon icon="times-circle" />取消 </b-button>

            <!-- <b-input-group prepend='檢查室'>
                <b-select v-model='selectedLabRoom' :options='optionsLabRoom' @change='ReloadDataContent'  style="background-color:orange;"/>
            </b-input-group>-->
          </b-col>
        </b-row>
      </div>
    </b-modal>
  </div>
</template>

<script>
import Vue from "vue";
import twp from "@/components/TWPv5";
import reportEdit from "@/components/ReportEdit";
import * as configs from "@/config";
import { DateRangePickerPlugin } from "@syncfusion/ej2-vue-calendars";

import { DataManager, WebApiAdaptor, Predicate, Query } from "@syncfusion/ej2-data";

import { dateFormatMixin } from "@/SupportLib_J.js";

Vue.use(DateRangePickerPlugin);

const checkItem = require("@/assets/DataSource/DR0407001");
const queryResult = require("@/assets/DataSource/DR0101001");
const patientSource = require("@/assets/DataSource/DR0431001");

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
    label: "登打狀態",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap"
  },
  {
    key: "DxreportPhysicianName",
    label: "報告醫師",
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
    key: "DueTimeStr",
    label: "逾期",
    sortable: true,
    thClass: "text-nowrap",
    tdClass: "no-wrap font-weight-bold"
  },
  {
    key: "EncounterNo",
    label: "批價序號",
    sortable: true,
    thClass: "text-nowrap",
    tdClass: "no-wrap font-weight-bold"
  },
  {
    key: "AccessionNo",
    label: "檢查單號",
    sortable: true,
    thClass: "text-nowrap",
    tdClass: "no-wrap font-weight-bold"
  },
  {
    key: "ProcedureNameStr",
    label: "檢查項目",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap text-left"
  },
  {
    key: "Modality",
    label: "儀器類別",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap text-left"
  },
  {
    key: "PatientSourceTypeName",
    label: "病患來源",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap"
  },
  {
    key: "PatientId",
    label: "病歷編號",
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
  // {
  //   key: "PatientBirthday",
  //   label: "生日",
  //   sortable: true,
  //   thClass: "no-wrap",
  //   tdClass: "no-wrap"
  // },
  {
    key: "PatientAge",
    label: "年齡",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap"
  },
  {
    key: "ProcedureCompleted",
    label: "檢查日期",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap"
  },
  {
    key: "StudyTime",
    label: "影像到位日期",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap"
  }
];

const dataCollection = [
  {
    guid: "1234567890",
    dId: 1,
    eId: "急作",
    cId: "R123456789",
    cDt: "2019/08/12",
    pSr: 1,
    pSrt: "急診",
    hId: "H123456789",
    iId: 1,
    iNe: "XXXX檢驗",
    pNe: "趙大升",
    pId: "A123456789",
    pGd: "男性",
    bdy: "1943/12/31",
    bedNo: "71556",
    age: 76,
    sta: "未登打",
    _rowVariant: "danger"
  },
  {
    guid: "1234567891",
    dId: 2,
    eId: "一般",
    cId: "R123456790",
    cDt: "2019/08/13",
    pSr: 2,
    pSrt: "門診",
    hId: "H987654321",
    iId: 2,
    iNe: "ZZZZ檢驗",
    pNe: "錢春枝",
    pId: "B223456789",
    pGd: "女性",
    bdy: "1944/01/01",
    bedNo: "45855",
    age: 75,
    sta: "未登打"
  },
  {
    guid: "1234567892",
    dId: 3,
    eId: "急作",
    cId: "R123456791",
    cDt: "2019/08/14",
    pSr: 3,
    pSrt: "住院",
    hId: "H123456789",
    iId: 3,
    iNe: "YYYY檢驗",
    pNe: "甄友虔",
    pId: "A123456789",
    pGd: "男性",
    bdy: "1943/12/31",
    bedNo: "5578",
    age: 76,
    sta: "未登打",
    _rowVariant: "danger"
  },
  {
    guid: "1234567892",
    dId: 3,
    eId: "急作",
    cId: "R123456791",
    cDt: "2019/08/14",
    pSr: 3,
    pSrt: "住院",
    hId: "H123456789",
    iId: 3,
    iNe: "YYYY檢驗",
    pNe: "甄友虔",
    pId: "A123456789",
    pGd: "男性",
    bdy: "1943/12/31",
    bedNo: "5578",
    age: 76,
    sta: "未登打",
    _rowVariant: "danger"
  },
  {
    guid: "1234567893",
    dId: 4,
    eId: "一般",
    cId: "R123456792",
    cDt: "2019/08/15",
    pSr: 5,
    pSrt: "健診",
    hId: "H987654321",
    iId: 4,
    iNe: "XXXX檢驗",
    pNe: "錢甄多",
    pId: "B223456789",
    pGd: "女性",
    bdy: "1944/01/01",
    bedNo: "7565",
    age: 75,
    sta: "未登打"
  },
  {
    guid: "1234567894",
    dId: 5,
    eId: "一般",
    cId: "R123456793",
    cDt: "2019/08/16",
    pSr: 1,
    pSrt: "急診",
    hId: "H123456789",
    iId: 1,
    iNe: "YYYY檢驗",
    pNe: "郝努立",
    pId: "A123456789",
    pGd: "男性",
    bdy: "1943/12/31",
    bedNo: "5245",
    age: 76,
    sta: "未登打"
  },
  {
    guid: "1234567895",
    dId: 6,
    eId: "一般",
    cId: "R123456794",
    cDt: "2019/08/17",
    pSr: 2,
    pSrt: "門診",
    hId: "H987654321",
    iId: 2,
    iNe: "ZZZZ檢驗",
    pNe: "潘彼得",
    pId: "B223456789",
    pGd: "女性",
    bdy: "1944/01/01",
    bedNo: "3355",
    age: 75,
    sta: "未登打"
  },
  {
    guid: "1234567896",
    dId: 7,
    eId: "一般",
    cId: "R123456795",
    cDt: "2019/08/18",
    pSr: 3,
    pSrt: "住院",
    hId: "H123456789",
    iId: 3,
    iNe: "XXXX檢驗",
    pNe: "王土干",
    pId: "A123456789",
    pGd: "男性",
    bdy: "1943/12/31",
    bedNo: "12245",
    age: 76,
    sta: "未登打"
  },
  {
    guid: "1234567897",
    dId: 8,
    eId: "一般",
    cId: "R123456796",
    cDt: "2019/08/19",
    pSr: 5,
    pSrt: "健診",
    hId: "H987654321",
    iId: 4,
    iNe: "YYYY檢驗",
    pNe: "柳卯卵",
    pId: "B223456789",
    pGd: "女性",
    bdy: "1944/01/01",
    bedNo: "5445",
    age: 75,
    sta: "未登打"
  },
  {
    guid: "1234567898",
    dId: 9,
    eId: "一般",
    cId: "R123456797",
    cDt: "2019/08/20",
    pSr: 1,
    pSrt: "急診",
    hId: "H123456789",
    iId: 1,
    iNe: "XXXX檢驗",
    pNe: "午卯酉",
    pId: "A123456789",
    pGd: "男性",
    bdy: "1943/12/31",
    bedNo: "8557",
    age: 76,
    sta: "未登打"
  },
  {
    guid: "1234567899",
    dId: 10,
    eId: "一般",
    cId: "R123456798",
    cDt: "2019/08/21",
    pSr: 2,
    pSrt: "門診",
    hId: "H987654321",
    iId: 2,
    iNe: "ZZZZ檢驗",
    pNe: "邁願探",
    pId: "B223456789",
    pGd: "女性",
    bdy: "1944/01/01",
    bedNo: "7878",
    age: 75,
    sta: "未登打"
  }
];

export default {
  name: "FI0304",
  components: { twp, reportEdit },
  mixins: [dateFormatMixin],
  data() {
    return {
      // //用戶資訊
      userInfo: {
        userId: this.$store.state.Profile4User.id,
        userName: this.$store.state.Profile4User.employeeName,
        roleId: this.$store.state.Profile4User.staffType,
        roleName: this.$store.state.Profile4User.staffName
      },
      optionsDxreportPhysician: [],
      selectedCheckItem: null,
      selectedInspectDevice: null,
      optionsCheckItem: [],
      optionsInspectDevice: [],
      theProcedure: {
        AccessionNo: "", //檢查單號(大單號)
        RequestingPhysicianName: "開單醫師",
        DxreportPhysicianId: this.$store.state.Profile4User.id
      },
      tableConfig4QueryResult: [],
      casePriorityCode: "Y",
      selectedPatientSource: 0,
      optionsPatientSource: [],
      tabIndex: 0,

      // 佈景主題
      themePacks: {
        themeBlack: false,
        //emeBlackName: 'themeBlack',
        themeBlackName: configs.ThemeId4Black
      },
      min: 1,
      DateRange: [null, null],
      //
      reportEditTitle: "",
      reportAssignTitle: "",
      //
      isWhite: false,
      isBlack: true,
      isGray: false,
      //
      selectedStatus: "51",
      //
      ObjApp: null,
      //
      selectedAssignDoctor: null,
      reportsOnAssign: []
    };
  },
  computed: {
    optionsStatus() {
      if (this.userInfo.roleId != "21") {
        if (this.userInfo.userId != this.theProcedure.DxreportPhysicianId) {
          return [
            { value: "51", text: "自動分派" },
            { value: "61", text: "退件重寫" },
            { value: "63", text: "報告撰寫" }
          ];
        } else {
          return [
            { value: "51", text: "自動分派" },
            { value: "61", text: "退件重寫" },
            { value: "63", text: "報告撰寫" },
            { value: "71", text: "正式報告" }
          ];
        }
      } else if (this.userInfo.userId != this.theProcedure.DxreportPhysicianId) {
        return [
          { value: "51", text: "自動分派" },
          { value: "61", text: "退件重寫" },
          { value: "63", text: "報告撰寫" },
          { value: "65", text: "等待審核" }
        ];
      } else {
        return [
          { value: "51", text: "自動分派" },
          { value: "61", text: "退件重寫" },
          { value: "63", text: "報告撰寫" },
          { value: "65", text: "等待審核" },
          { value: "71", text: "正式報告" }
        ];
      }
    },
    tabs() {
      if (this.userInfo.roleId == "21") {
        return [
          { label: "全部", id: "FI0304_all", count: 0, disabled: false },
          { label: "急診/件", id: "FI0304_emy", count: 0, disabled: false },
          { label: "門診", id: "FI0304_door", count: 0, disabled: false },
          { label: "住院", id: "FI0304_live", count: 0, disabled: false },
          {
            label: "待審核",
            id: "FI0304_pendingAppr",
            count: 0,
            disabled: false
          },
          { label: "", id: "", count: 0, disabled: true },
          { label: "健診", id: "FI0304_hr", count: 0, disabled: false }
        ];
      } else {
        return [
          { label: "全部", id: "FI0304_all", count: 0, disabled: false },
          { label: "急診/件", id: "FI0304_emy", count: 0, disabled: false },
          { label: "門診", id: "FI0304_door", count: 0, disabled: false },
          { label: "住院", id: "FI0304_live", count: 0, disabled: false },
          { label: "", id: "", count: 0, disabled: true },
          { label: "健診", id: "FI0304_hr", count: 0, disabled: false }
        ];
      }
    },
    optionsAssignDoctor() {
      let arr = this.optionsDxreportPhysician.filter(i => i.value != this.theProcedure.DxreportPhysicianId);
      arr.unshift({ value: null, text: "請選擇" });
      return arr;
    },
    OptionsCasePriority() {
      // 案件優先度
      return [
        { text: "急件", value: "Y" },
        { text: "一般", value: "N" }
      ];
    }
  },
  created() {
    //
    //初始UI參數
    // this.InitUiParams();
    //
    let methodName = "created";
    //
    //
    window.addEventListener("keydown", this.HKWatch); //粗體Method自定義
    // 取得 App.vue 參照
    let obj = this.$GetApp(this);
    if (obj) {
      this.ObjApp = obj[0];
      this.VueNestLevel = obj[1];
      console.log(this.$logs(`Vue Nesting Level ${this.VueNestLevel}`, methodName));
    } else {
      console.log(this.$logs("Fail to get App.vue ref.", methodName));
    }

    // this.optionsCheckItem = checkItem.Options()
    this.tableConfig4QueryResult = configCollection; //queryResult.PresentConfig()
    // this.optionsPatientSource = patientSource.Options()

    //
    this.theProcedure.RequestingPhysicianName = this.userInfo.userName;

    //
    this.GetOptionsCheckItem();

    //
    this.GetOptionsInspectDevice();

    this.GetOptionsDxreportPhysician();
  },
  methods: {
    //
    //時間比較
    diff_mins(dt2, dt1) {
      var diff = (dt2.getTime() - dt1.getTime()) / 1000;
      diff /= 60;
      return Math.abs(Math.round(diff));
    },
    //批次審核上傳
    async BatchApprove(items) {
      let status = 71;
      // 啟動 報告存檔 作業
      console.log(this.$logs("save report:" + status));

      //
      // 報告存檔 - 後台存取
      this.ObjApp.WaitingShow();
      //
      //開始儲存
      let _this = this;
      let opStatus = false;
      let opResult = "存取時發生錯誤!";

      let subPath = "/report/Approval?employeeNo=" + this.userInfo.userId;
      let dataBody = [];
      items.forEach(i => dataBody.push(i.AccessionNo));
      await window.axios
        .post(subPath, dataBody)
        .then(e => {
          opStatus = true;
          _this.$refs["twp3"].forEach(t => {
            if (t.TableId && t.TableId == "FI0304_pendingAppr") {
              t.OnForceRefresh();
              t.OnCancelAllSelects();
            }
          });
        })
        .catch(function(error) {
          opStatus = false;
          opResult += error;
        });

      this.ObjApp.WaitingHide();
      //
      if (opStatus) {
        this.ObjApp.TimingMessage("資料已完成批次審核上傳");
      } else {
        this.ObjApp.TimingMessage(opResult + "! 請稍後再試.", 2);
      }
      return opStatus;
    },

    //
    //確認分派報告
    async ConfirmAssignReport() {
      if (this.selectedAssignDoctor == null) {
        this.ObjApp.TimingMessage("請選擇分派醫師", 2);
        return;
      }
      // 報告存檔 - 後台存取
      this.ObjApp.WaitingShow();

      let opStatus = false;
      let opResult = "存取時發生錯誤!";
      //console.log(this.theReport)
      let accessionNos = [];
      this.reportsOnAssign.forEach(obj => {
        accessionNos.push(obj.AccessionNo);
      });
      let dataBody = {
        ReportPhysicianId: this.selectedAssignDoctor,
        AccessionNos: accessionNos
      };
      let subPath = "/exam/AssignReport";
      let _this = this;
      await window.axios
        .put(subPath, dataBody)
        .then(e => {
          opStatus = true;

          _this.$refs["twp3"].forEach(t => {
            if (t.TableId && t.TableId == _this.tabs[_this.tabIndex].id) {
              t.OnForceRefresh();
              t.OnCancelAllSelects();
            }
          });
        })
        .catch(function(error) {
          opStatus = false;
          opResult += error;
        });

      this.ObjApp.WaitingHide();
      //
      if (opStatus) {
        this.ObjApp.TimingMessage("已完成分派作業");
      } else {
        this.ObjApp.TimingMessage(opResult + "! 請稍後再試.", 2);
      }

      this.SearchConditions();
      this.$refs.win4assignReport.hide();
      return opStatus;
    },
    //
    //取消分派
    CancelAssignReport() {
      this.$refs.win4assignReport.hide();
    },
    //
    //變更分派醫師
    ChangeAssignDoctor() {},
    //
    //變更搜尋登打狀態 立刻刷新list
    ChangeStatus() {
      this.SearchConditions();
    },
    //
    //變更報告醫師
    ChangeSearchConditions() {
      //
      //如果Search的報告醫師不是自己 且 搜尋登打狀態設定為 正式報告, 則調回 '自動分派' 以避免搜尋到非本人可編輯之正式報告
      if (this.theProcedure.DxreportPhysicianId != this.userInfo.userId) {
        if (this.selectedStatus == "71") {
          this.selectedStatus = "51";
        }
      }
      //
      this.SearchConditions();
    },
    //
    //初始頁面UI 暫存參數
    InitUiParams() {
      if (window.reportList_tabIndex) {
        this.tabIndex = window.reportList_tabIndex;
      }

      if (window.reportList_AccessionNo) {
        this.theProcedure.AccessionNo = window.reportList_AccessionNo;
      }

      if (window.reportList_selectedCheckItem) {
        this.selectedCheckItem = window.reportList_selectedCheckItem;
      }

      if (window.reportList_selectedInspectDevice) {
        this.selectedInspectDevice = window.reportList_selectedInspectDevice;
      }

      if (window.reportList_selectedStatus) {
        this.selectedStatus = window.reportList_selectedStatus;
      }

      if (window.reportList_DateRange) {
        this.DateRange = window.reportList_DateRange;
      }
    },
    //
    StoreUiParams() {
      window.reportList_tabIndex = this.tabIndex;
    },
    //
    StoreSearchConditions() {
      window.reportList_ReportPhysician = this.theProcedure.DxreportPhysicianId;
      window.reportList_AccessionNo = this.theProcedure.AccessionNo;
      window.reportList_selectedCheckItem = this.selectedCheckItem;
      window.reportList_selectedInspectDevice = this.selectedInspectDevice;
      window.reportList_selectedStatus = this.selectedStatus;
      window.reportList_DateRange = this.DateRange;
    },
    //keypressed偵測
    HKWatch(event) {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        // //粗體Method自定義
        this.SearchConditions();
      }
    },
    //
    //
    SetFocusOnInputAccessionNo() {
      //console.log(this.$logs('setFocus'))
      setTimeout(() => {
        //console.log(this.$logs('setFocus.inner'))
        this.$nextTick(() => this.$refs["inputAccessionNo"].focus());
      }, 1000);
    },
    GetRawData() {
      console.log(this.$logs());
      let methodName = "get fake_report_list.json";
      console.log(this.$logs("Call", methodName));
      return this.$http
        .get("fake_report_list.json")
        .then(r => {
          console.log(this.$logs("Done", methodName));
          return r.data;
        })
        .catch(e => {
          this.$stdErr(err, methodName);
        });
    },

    //
    //取得醫師列表
    async GetOptionsDxreportPhysician() {
      console.log(this.$logs());

      //
      let itemPack = null;
      let convertedCollections = [
        // { value: null, text: '請選擇' },
      ];
      //
      let subPath = "../Employee/SelectNoList?staffType=21,25,28&getAll=false";
      //
      this.ObjApp.WaitingShow();
      let opStatus = false;
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
          opStatus = true;
        });

      itemPack.Items.forEach(i => {
        let collection = { value: i.No, text: i.Name };
        convertedCollections.push(collection);
      });
      this.optionsDxreportPhysician = convertedCollections;
    },
    //
    //取得儀器類別列表
    async GetOptionsInspectDevice() {
      console.log(this.$logs());

      //
      let itemPack = null;
      let convertedCollections = [{ value: null, text: "請選擇" }];
      //
      let subPath = "../device/SelectNoList";
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
      this.optionsInspectDevice = convertedCollections;
    },
    //
    //取得檢查項目列表
    async GetOptionsCheckItem() {
      console.log(this.$logs());

      //
      let itemPack = null;
      let convertedCollections = [{ value: null, text: "請選擇" }];
      //
      let subPath = "../checkItem/SelectNoList";
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
      this.optionsCheckItem = convertedCollections;
    },
    //
    //
    async GetAllExamList(index) {
      console.log(this.$logs());
      //
      let itemPack = null;
      //
      //判別日期查詢 (日期查詢無法寫在query物件裡, 只好從url帶參數)
      let subPath = "../exam/List";
      if (this.DateRange[0] != null || this.DateRange[1] != null) {
        let dateCondition = "";
        if (this.DateRange[0] != null) dateCondition += "procedureCompletedStart=" + this.DateRange[0].toJSON() + "&";

        if (this.DateRange[1] != null) dateCondition += "procedureCompletedEnd=" + this.DateRange[1].toJSON();

        subPath += "?" + dateCondition;
      }
      //
      //判斷檢單狀態
      let statusConditions = "status=";
      if (this.selectedStatus != null) statusConditions += this.selectedStatus;
      else {
        let allStatus = "";
        this.optionsStatus.filter(i => {
          if (i.value != null) allStatus += i.value + ",";
        });
        allStatus = allStatus.replace(/,\s*$/, "");
        statusConditions += allStatus;
      }

      //等待審核 tab
      if (index == "FI0304_pendingAppr") {
        statusConditions = "status=65";
      }

      if (subPath.includes("?")) {
        subPath += "&" + statusConditions;
      } else {
        subPath += "?" + statusConditions;
      }

      //急診/件 搜尋判斷
      if (index == "FI0304_emy") {
        if (subPath.includes("?")) {
          subPath += "&isEmg=true";
        } else {
          subPath += "?isEmg=true";
        }
      }

      subPath += "&employeeNo=" + this.theProcedure.DxreportPhysicianId;

      console.log("search dateRange:" + this.DateRange[0] + "~" + this.DateRange[1]);
      //
      let opResult = "";
      let opStatus = false;
      window.dtcUrl = configs.publicPath + subPath;
      window.dtcQuery = this.getDataQuery(index);
    },
    //
    //
    async GetDataContent(index, toPage, nPerPage) {
      console.log(this.$logs());
      //
      let itemPack = null;
      //
      //判別日期查詢 (日期查詢無法寫在query物件裡, 只好從url帶參數)
      let subPath = "../exam/List";
      if (this.DateRange[0] != null || this.DateRange[1] != null) {
        let dateCondition = "";
        if (this.DateRange[0] != null) dateCondition += "procedureCompletedStart=" + this.DateRange[0].toJSON() + "&";

        if (this.DateRange[1] != null) dateCondition += "procedureCompletedEnd=" + this.DateRange[1].toJSON();

        subPath += "?" + dateCondition;
      }

      //
      //判斷檢單狀態
      let statusConditions = "status=";
      if (this.selectedStatus != null) statusConditions += this.selectedStatus;
      else {
        let allStatus = "";
        this.optionsStatus.filter(i => {
          if (i.value != null) allStatus += i.value + ",";
        });
        allStatus = allStatus.replace(/,\s*$/, "");
        statusConditions += allStatus;
      }

      let employeeNo = this.theProcedure.DxreportPhysicianId;

      //等待審核 tab
      if (index == "FI0304_pendingAppr") {
        statusConditions = "status=65";
        employeeNo = this.userInfo.userId;
      }

      if (subPath.includes("?")) {
        subPath += "&" + statusConditions;
      } else {
        subPath += "?" + statusConditions;
      }

      //急診/件 搜尋判斷
      if (index == "FI0304_emy") {
        if (subPath.includes("?")) {
          subPath += "&isEmg=true";
        } else {
          subPath += "?isEmg=true";
        }
      }

      if (subPath.includes("?")) {
        subPath += "&employeeNo=" + employeeNo;
      } else {
        subPath += "?employeeNo=" + employeeNo;
      }

      console.log("search dateRange:" + this.DateRange[0] + "~" + this.DateRange[1]);
      //
      this.ObjApp.WaitingShow();
      let opResult = "";
      let opStatus = false;
      let _this = this;
      //
      await new DataManager({
        url: configs.publicPath + subPath,
        adaptor: new WebApiAdaptor(),
        crossDomain: true
      })
        .executeQuery(
          this.getDataQuery(index)
            .sortBy("ProcedureCompleted")
            .page(toPage, nPerPage)
        )
        .then(r => {
          itemPack = r.actual; //資料;
          // r.actual.Count = r.actual.Items.length;
          let ii = _this.tabs.findIndex(i => i.id == index);
          _this.$nextTick(() => {
            _this.tabs[ii].count = r.actual.Count; //總筆數
          });

          opStatus = true;
        });

      this.ObjApp.WaitingHide();
      //
      if (opStatus) {
        // this.ObjApp.TimingMessage('資料已完成存檔作業')
      } else {
        this.ObjApp.TimingMessage(opResult + "! 請稍後再試.", 2);
      }

      itemPack.Items.filter(i => {
        //逾期時間判斷
        let dueTime_mins = this.diff_mins(new Date(), i.ProcedureCompleted);
        if (index == "FI0304_emy" || i.EmgFlag == "Y") dueTime_mins = 24 * 60 - dueTime_mins;
        else if (index == "FI0304_door") dueTime_mins = 72 * 60 - dueTime_mins;
        else dueTime_mins = 120 * 60 - dueTime_mins;
        let dueTimeStr =
          dueTime_mins <= 0
            ? "-" + this.SinglgeNumTo2Digit(Math.floor(Math.abs(dueTime_mins) / 60)) + "小時" + this.SinglgeNumTo2Digit(Math.abs(dueTime_mins) % 60) + "分"
            : this.SinglgeNumTo2Digit(Math.floor(dueTime_mins / 60)) + "小時" + this.SinglgeNumTo2Digit(dueTime_mins % 60) + "分";
        i.Due = false;
        i.DueTimeStr = dueTimeStr;
        i.DueTimeMins = dueTime_mins;
        if (dueTime_mins <= 0) i.Due = true;

        //正式報告不顯示逾期
        if (i.Status == "71") {
          i.Due = false;
          i.DueTimeStr = "-";
          i.DueTimeMins = 0;
        }

        // if (
        //   (index == "FI0304_emy" || i.EmgFlag == "Y") &&
        //   i.DueTimeMins >= 24 * 60
        // )
        //   i.Due = true;
        // else if (index == "FI0304_door" && i.DueTimeMins >= 72 * 60)
        //   i.Due = true;
        // else if (i.DueTimeMins >= 120 * 60) i.Due = true;
        if (i.Due) {
          i.FontColor = "#BE77FF";
        } else {
          i.FontColor = this.themePacks.themeBlack ? "#FFFFFF" : "#000000";
        }

        //時間 to string
        i.ProcedureCompleted = this.DateToString(i.ProcedureCompleted, true);
        i.PatientBirthday = this.DateToString(i.PatientBirthday, false);

        //影像到位時間
        i.StudyTime = i.StudyTime == null ? "無影像" : this.DateToString(i.StudyTime, true);

        if (i.EmgFlag === "Y" || i.PatientSourceTypeCode === "E") {
          i._rowVariant = "danger";
        }

        if (i.Status == "71") {
          i._rowVariant = "success";
        }

        //若為多檢查項目合併為arr, 此處拆解為string with comma
        i.ProcedureNameStr = i.ProcedureName;
        if (i.ProcedureName instanceof Array) {
          i.ProcedureNameStr = i.ProcedureName.join(",");
        }
      });

      this.$forceUpdate();

      return itemPack;
    },
    //門診-2 急診-1 住院-3 健診-6  (全部-0)  //急件
    getDataQuery: function(src) {
      let query = new Query();

      //TODO - remove the codes below when api is rephrased for settled data schema
      let tp = this.theProcedure;
      let chItem = this.selectedCheckItem;
      let insDev = this.selectedInspectDevice;
      let chItemT = null;

      if (chItem != null)
        chItemT = this.optionsCheckItem.filter(c => {
          if (c.value === chItem) return c;
        })[0].text;

      if (tp.AccessionNo != null && tp.AccessionNo != "") query = query.where("AccessionNo", "contains", tp.AccessionNo);

      if (this.selectedCheckItem != null && this.selectedCheckItem != "") query = query.where("ProcedureCode", "contains", this.selectedCheckItem);

      if (this.selectedInspectDevice != null && this.selectedInspectDevice != "") query = query.where("Modality", "contains", this.selectedInspectDevice);

      //(全部)1:急 2:門診 3:住院
      if (src == "FI0304_all") {
        query = query.where("PatientSourceTypeCode", "notEqual", "G");
      }
      // //急診 或 急作
      // else if (src == 1) {
      //   let predicateState = new Predicate("PatientSourceTypeCode", "equal", "E");
      //   predicateState = predicateState.or("EmgFlag", "equal", "Y");
      //   query = query.where(predicateState);
      // }
      //個別來源
      else if (src != "FI0304_emy" && src != "FI0304_pendingAppr") {
        let code = src == "FI0304_emy" ? "E" : src == "FI0304_door" ? "O" : src == "FI0304_live" ? "I" : "G";
        query = query.where("PatientSourceTypeCode", "equal", code);
      }

      // query = query.where("DxreportPhysicianId", "contains", this.theProcedure.DxreportPhysicianId)

      return query;
    },
    SearchConditions() {
      this.$refs["twpMulti"].forEach(twp => twp.OnForceRefresh());
      this.$refs["twp3"].forEach(twp => twp.OnForceRefresh());
      this.StoreSearchConditions();
    },
    ClearConditions() {
      this.selectedCheckItem = null;
      this.selectedInspectDevice = null;
      this.theProcedure.AccessionNo = "";
      this.DateRange = [null, null];
      this.selectedStatus = "51";
      this.theProcedure.DxreportPhysicianId = this.userInfo.userId;
      this.SearchConditions();
    },
    //
    //判斷權限是否允許進入此報告狀態登打
    CheckIfReportStatusMeetRoleType(status) {
      if (
        status == "56" || //尚未分派
        status == "71" || //核准送出
        status == "73" || //失敗重傳
        status == "75" || //改版重傳
        status == "77" || //等待同步
        status == "79" //同步成功
      ) {
        return false;
      }

      //住院醫師
      if (this.userInfo.roleId == "25") {
        if (status == "65") {
          //等待審核
          return false;
        }
      }
      //主治醫師
      else if (this.userInfo.roleId == "21") {
      }
      return true;
    },
    RowClickFunction(x, SrcParamId) {
      if (!this.CheckIfReportStatusMeetRoleType(x.Status)) {
        this.ObjApp.TimingMessage("此檢驗單狀態已不允許再做登打動作。", 2);
        return;
      }

      let data = {
        sourceIndex: SrcParamId,
        dataList: x
        //dataList: Array.isArray(x) ? x : [x]
      };
      //alert(JSON.stringify(x));
      this.GetAllExamList(SrcParamId); // keep this line do not remove and the order of this call should be kept too
      this.DirectToF0301(data);
      // let dataList =
      // this.DirectToF0301(dataList)
    },
    OnClickMyFavorite(x) {},
    DirectToF0301(x) {
      // console.log(`Row Function Button Clicked. (${x.length})`);
      //this.$router.replace(this.BasePath + "/" + x.guid);
      window.dtcDataList = x.dataList ? x.dataList : [];
      this.$router.replace({ name: "FI0301" });
      //{ path: '/MI03/FI0301', name: 'FI0301', component: () => import('./views/MI03/FI0301.vue') },
    },
    itemChecked(x) {},

    linkClass(tab, idx) {
      if (tab.disabled) return null;

      if (this.tabIndex === idx) {
        if (tab.id == "FI0304_emy") return ["bg-danger", "text-white", "font-weight-bold"];
        else if (tab.id == "FI0304_pendingAppr") return ["bg-warning", "text-black", "font-weight-bold"];
        else return ["bg-primary", "text-white", "font-weight-bold"];
      } else {
        if (tab.id == "FI0304_emy") {
          if (this.themePacks.themeBlack) return ["bg-dark", "text-danger", "font-weight-bold", "border-secondary"];
          else return ["bg-light", "text-danger", "font-weight-bold", "border-secondary"];
        } else if (tab.id == "FI0304_pendingAppr") {
          if (this.themePacks.themeBlack) return ["bg-dark", "text-warning", "font-weight-bold", "border-secondary"];
          else return ["bg-light", "text-warning", "font-weight-bold", "border-secondary"];
        } else {
          if (this.themePacks.themeBlack) return ["bg-dark", "text-info", "font-weight-bold", "border-secondary"];
          else return ["bg-light", "text-info", "font-weight-bold", "border-secondary"];
        }
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
        document.documentElement.style.setProperty("--theme-modal-bg-color", cls);
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
    SwtchTableTheme() {
      this.$refs["twpMulti"].filter(i => {
        i.UsingThemeBlack = this.$IsThemeBlack();
        i.OnForceRefresh();
      });
      this.$refs["twp3"].filter(i => {
        i.UsingThemeBlack = this.$IsThemeBlack();
        i.OnForceRefresh();
      });
    },
    // ThemeSwitch() {
    // 	// Theme:Black 切換
    // 	//
    // 	this.themePacks.themeBlack = !this.themePacks.themeBlack
    // 	//
    // 	let activate = this.themePacks.themeBlack
    // 	let className = this.themePacks.themeBlackName
    // 	const el = document.body
    // 	//
    // 	if (activate) {
    // 		el.classList.add(className)
    // 	} else {
    // 		el.classList.remove(className)
    // 	}

    // 	this.$refs['twp3'].forEach(element => element.switchThemeBlack(this.themePacks.themeBlack))
    // 	this.$refs['twpMulti'].forEach(element => element.switchThemeBlack(this.themePacks.themeBlack))

    // 	console.log(this.$logs(this.$IsThemeBlack() ? 'Black' : 'White'))
    // },
    tabTitle(tab) {
      if (!tab.disabled) return tab.label + " (" + tab.count + ")";
      else return null;
    },
    OpenMultiReport(items) {
      this.$refs["Window4ReportEdit"].show();
    },
    AssignReport(items) {
      console.log(this.$logs("Doctor assign report:"));
      this.reportAssignTitle = " : " + items.length + "筆報告";
      this.reportsOnAssign = items;
      this.$refs.win4assignReport.show();
    },
    CheckIfShowRowCheckBox(item) {
      if (item.Status == "51") return true;
      else return false;
    },
    GetParams() {
      if (this.$refs.twpMulti === undefined) return null;

      this.reportEditTitle = " : " + this.$refs.twpMulti[0].checkedItems.length + " 筆報告";
      let params = {
        accessionNos: this.$refs.twpMulti[0].checkedItems,
        dxreportPhysicianId: this.userInfo.userId,
        userId: this.userInfo.userId,
        staffType: this.userInfo.roleId
      };
      return params; //this.$refs.twpMulti[0].checkedItems
    },
    RefreshCheckedItems(items) {
      this.$refs["twpMulti"].find(t => t.OnForceRefresh());
      items.forEach(i => {
        this.$refs["twpMulti"].find(t => {
          t.RemoveItemFromChecked(i);
        });
      });
    },
    CloseReportEdit() {
      this.$refs["Window4ReportEdit"].hide();
    },

    setDefaultBackgroundColor() {
      // 引入 Theme:Black, 日後再調成是從 個人設定 中轉入
      let cls = localStorage["theme-modal-bg-color"];
      this.isWhite = cls == "white" || !cls;
      this.isBlack = cls == "black";
      this.isGray = !this.isWhite && !this.isBlack && cls == "#868e96";
      !cls ? (cls = "white") : "";
      this.ThemeSwitch(cls);
      if (!this.isWhite) {
        document.documentElement.style.setProperty("--theme-modal-bg-color", cls);
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
    }
  },
  watch: {
    selectedPatientSource(newName, oldName) {}
  },
  mounted() {
    //
    // 引入 Theme:Black, 日後再調成是從 個人設定 中轉入
    // this.ThemeSwitch()
    this.setDefaultBackgroundColor();

    //set focus 在檢查單號
    this.SetFocusOnInputAccessionNo();
  },
  beforeDestroy: function() {
    console.log(this.$logs("Before destroy"));
    this.StoreUiParams();
  },
  destroyed() {
    console.log(`${this.$logs()}`);
    // 解除 Theme:Black
    const el = document.body;
    el.classList.remove(this.themePacks.themeBlackName);
    //
    // 解除監聽器:攔截 KeyPress
    window.removeEventListener("keydown", this.HKWatch);
  }
};
</script>

<style scoped>
/* -- 這行必須放在這裡, 才有作用 --*/
.themeBlack .input-group-text {
  background-color: rgba(0, 0, 0, 0.7);
  color: rgba(255, 255, 255, 0.7);
}

.themeBlack .form-control {
  background-color: rgba(0, 0, 0, 0.7);
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

<style>
/* schedule 取消 button  */
.themeBlack .e-cancel {
  background-color: rgba(205, 92, 92, 1) !important;
  color: rgba(255, 255, 255, 1) !important;
}

/* schedule 確認 button  */
.themeBlack .e-apply {
  background-color: rgba(70, 130, 180, 1) !important;
  color: rgba(255, 255, 255, 1) !important;
}
</style>
