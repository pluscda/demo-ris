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
            >匿名評分清單 用戶: [{{ $store.state.Profile4User.staffName }}] {{ $store.state.Profile4User.employeeName }}</b-col
          >
          <b-col cols="6" class="float-right text-right">
            <b-dropdown id="dropdown-1" text="背景更換" dropleft class="m-md-1">
              <b-dropdown-item :active="isWhite" class="bg-clr" @click="bgUpdate('white', $event)">白色</b-dropdown-item>
              <b-dropdown-item :active="isBlack" class="bg-clr" @click="bgUpdate('black', $event)">黑色</b-dropdown-item>
              <b-dropdown-item :active="isGray" class="bg-clr" @click="bgUpdate('#868e96', $event)">灰色</b-dropdown-item>
            </b-dropdown>
          </b-col>
        </b-row>
      </b-card-header>
      <b-card-text class="text-left py-1">
        <b-container fluid class="px-1">
          <b-row no-gutters>
            <b-col sm="2" class="px-1">
              <b-input-group prepend="登打狀態">
                <b-select v-model="selectedStatus" :options="optionsStatus" />
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
              </b-input-group>
            </b-col>
            <b-col sm="2" class="px-1">
              <b-input-group prepend="儀器類別">
                <b-select v-model="selectedInspectDevice" :options="optionsInspectDevice" @change="ChangeSearchConditions" />
              </b-input-group>
            </b-col>
            <b-col class="px-1 text-right">
              <b-button variant="success" @click="ClearConditions"> <font-awesome-icon icon="eraser" />清除條件 </b-button>
            </b-col>
          </b-row>
          <b-row no-gutters class="mt-1">
            <b-col sm="4" class="px-1">
              <b-input-group prepend="檢查日期" style="width:340px">
                <div id="spcialDatePicker" class="form-control" style="padding:0px">
                  <ejs-daterangepicker :minDays="min" v-model="DateRange" placeholder="搜尋範圍"></ejs-daterangepicker>
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
    <b-card no-body id="cardTabs" class="m-1" style="overflow:hidden">
      <twp ref="test" :FieldConfig="tableConfig4QueryResult" :DataFetch="GetDataContent" :OpButton1Func="RowClickFunction"></twp>
    </b-card>
  </div>
</template>

<script>
import Vue from "vue";
import twp from "@/components/TWPv5";
// import reportEdit from "@/components/ReportEdit";
import * as configs from "@/config";
import { DateRangePickerPlugin } from "@syncfusion/ej2-vue-calendars";
import { DataManager, WebApiAdaptor, Predicate, Query } from "@syncfusion/ej2-data";
import { dateFormatMixin } from "@/SupportLib_J.js";

Vue.use(DateRangePickerPlugin);

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
    key: "AccessionNo",
    label: "檢查單號",
    sortable: true,
    thClass: "text-nowrap",
    tdClass: "no-wrap font-weight-bold"
  },
  {
    key: "ProcedureName",
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
  {
    key: "PatientBirthday",
    label: "生日",
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
  name: "FI0306",
  components: { twp },
  mixins: [dateFormatMixin],
  data() {
    return {
      //用戶資訊
      userInfo: {
        //user ID
        userId: this.$store.state.Profile4User.id,
        //user name
        userName: this.$store.state.Profile4User.employeeName,
        //staff type (ex: 25)
        roleId: this.$store.state.Profile4User.staffType,
        //staff name (ex: 住院醫師)
        roleName: this.$store.state.Profile4User.staffName
      },
      //醫師
      optionsDxreportPhysician: [],
      //檢查項目
      optionsCheckItem: [],
      //儀器類別
      optionsInspectDevice: [],
      selectedCheckItem: null,
      selectedInspectDevice: null,
      // 檢查程序
      theProcedure: {
        AccessionNo: "", //檢查單號(大單號)
        RequestingPhysicianName: "開單醫師",
        DxreportPhysicianId: this.$store.state.Profile4User.id
      },
      //twp 欄位
      tableConfig4QueryResult: [],
      //？？
      selectedPatientSource: 0,
      //？？
      optionsPatientSource: [],
      //FI0304在用的tabindex
      tabIndex: 0,

      // 佈景主題 (configs的ThemeId4Black 為'themeBlack' 20200114)
      themePacks: {
        themeBlack: false,
        themeBlackName: configs.ThemeId4Black
      },
      //ejs minDays綁定的值
      min: 1,
      //ejs DateRange
      DateRange: [null, null],
      //？？
      reportEditTitle: "",
      reportAssignTitle: "",
      //
      isWhite: false,
      isBlack: true,
      isGray: false,
      //狀態 71(正式報告)
      selectedStatus: "71",
      //GetApp.vue
      ObjApp: null,
      //
      selectedAssignDoctor: null,
      reportsOnAssign: []
    };
  },
  computed: {
    optionsStatus() {
      return [{ value: "71", text: "正式報告" }];
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
    //userID
    console.log(this.$logs("userID " + this.userInfo.userId));
    //初始UI參數
    this.InitUiParams();
    //
    let methodName = "created";
    //
    //
    window.addEventListener("keydown", this.HKWatch); //粗體Method自定義
    // 取得 App.vue 參照
    let obj = this.$GetApp(this);
    console.log(obj);
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

    //取得檢查項目
    this.GetOptionsCheckItem();
    //取得儀器類別列表
    this.GetOptionsInspectDevice();
    //取得醫師列表
    this.GetOptionsDxreportPhysician();
  },
  methods: {
    //初始頁面UI 暫存參數
    InitUiParams() {
      if (window.reportList_tabIndex) {
        this.tabIndex = window.reportList_tabIndex;
      }

      if (window.reportEvaluationList_AccessionNo) {
        this.theProcedure.AccessionNo = window.reportEvaluationList_AccessionNo;
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

    //
    StoreUiParams() {
      window.reportList_tabIndex = this.tabIndex;
    },
    //
    StoreSearchConditions() {
      //帳號
      window.reportList_ReportPhysician = this.theProcedure.DxreportPhysicianId;
      //目前看起來沒有東西
      window.reportEvaluationList_AccessionNo = this.theProcedure.AccessionNo;
      window.reportList_selectedCheckItem = this.selectedCheckItem;
      //儀器類別
      window.reportList_selectedInspectDevice = this.selectedInspectDevice;
      //正常來說本支都是71 正式報告
      window.reportList_selectedStatus = this.selectedStatus;
      //檢查時間range
      window.reportList_DateRange = this.DateRange;

      console.log(window.reportList_DateRange);
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
      // let opStatus = false;
      //
      //改成用axios
      await window.axios.get(configs.publicPath + subPath).then(res => {
        itemPack = res;
        console.log("取得儀器類別列表");
        console.log(itemPack);
      });
      // await new DataManager({
      //   url: configs.publicPath + subPath,
      //   adaptor: new WebApiAdaptor(),
      //   crossDomain: true
      // })
      //   .executeQuery(new Query())
      //   .then(r => {
      //     itemPack = r.actual; //資料;
      //     console.log(itemPack);
      //     // opStatus = true;
      //   });

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
      //改用axios
      await window.axios.get(configs.publicPath + subPath).then(res => {
        itemPack = res;
        console.log("取得檢查項目列表");
        console.log(itemPack);
      });
      // await new DataManager({
      //   url: configs.publicPath + subPath,
      //   adaptor: new WebApiAdaptor(),
      //   crossDomain: true
      // })
      //   .executeQuery(new Query())
      //   .then(r => {
      //     itemPack = r.actual; //資料;
      //     opStatus = true;
      //   });

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
      let subPath = "/exam/List";
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
      window.dtcUrl = subPath;
      window.dtcQuery = this.getDataQuery(index);
    },
    //
    //
    async GetDataContent(index, toPage, nPerPage) {
      console.log(this.$logs());
      //
      let itemPack = null;
      //判斷時間range後進行search
      let dateCondition = "";
      if (this.DateRange[0] != null) dateCondition += "&procedureCompletedStart=" + this.DateRange[0].toJSON() + "&";

      if (this.DateRange[1] != null) dateCondition += "procedureCompletedEnd=" + this.DateRange[1].toJSON();
      //進行search
      await new DataManager({
        url: configs.publicPath + "../exam/List" + "?status=" + "71" + dateCondition,
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
          console.log("取得表單資料內容");
          console.log(itemPack);
          // r.actual.Count = r.actual.Items.length;
        });

      //時間變成user可接受模式
      itemPack.Items.filter(i => {
        i.ProcedureCompleted = this.DateToString(i.ProcedureCompleted, true);
        i.PatientBirthday = this.DateToString(i.PatientBirthday, false);
        i.StudyTime = i.StudyTime == null ? "無影像" : this.DateToString(i.StudyTime, true);

        if (i.EmgFlag === "Y") {
          i._rowVariant = "danger";
        }
        // IssuePhysicianId 審合醫師
        // DxreportPhysicianName 報告醫師
        this.theProcedure.RequestingPhysicianName = i.RequestingPhysicianName;
      });
      //Sort 1: 檢查日期 降冪   2: 狀態: 升密
      itemPack.Items.sort((a, b) => {
        return b.ProcedureCompleted - a.ProcedureCompleted || a.Status - b.Status;
      });
      //關掉loading的modal視窗
      this.ObjApp.WaitingHide();
      return itemPack;
    },
    //門診-2 急診-1 住院-3 健診-6  (全部-0)  //急件
    getDataQuery: function() {
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
      //過濾 撰寫醫師 & 審核醫師
      query = query.where("DxreportPhysicianId", "notEqual", this.userInfo.userId);
      query = query.where("IssuePhysicianId ", "notEqual", this.userInfo.userId);
      //
      if (tp.AccessionNo != null && tp.AccessionNo != "") query = query.where("AccessionNo", "contains", tp.AccessionNo);

      if (this.selectedCheckItem != null && this.selectedCheckItem != "") query = query.where("ProcedureCode", "contains", this.selectedCheckItem);

      if (this.selectedInspectDevice != null && this.selectedInspectDevice != "") query = query.where("Modality", "contains", this.selectedInspectDevice);

      return query;
    },
    SearchConditions() {
      this.$refs["test"].OnForceRefresh();
      this.StoreSearchConditions();
    },
    ClearConditions() {
      this.selectedCheckItem = null;
      this.selectedInspectDevice = null;
      this.theProcedure.AccessionNo = "";
      this.DateRange = [null, null];
      this.selectedStatus = "71";
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
        //todo
        return false;
      }
      return true;
    },
    //double click的時候
    RowClickFunction(x, SrcParamId) {
      // console.log(x);
      // console.log(SrcParamId);
      // if (!this.CheckIfReportStatusMeetRoleType(x.Status)) {
      //   this.ObjApp.TimingMessage("此檢驗單狀態已不允許再做登打動作。", 2);
      //   return;
      // }

      let data = {
        sourceIndex: SrcParamId,
        dataList: x
        //dataList: Array.isArray(x) ? x : [x]
      };
      console.log(data.dataList);
      //alert(JSON.stringify(x));
      //判斷所選
      this.GetAllExamList(SrcParamId); // keep this line do not remove and the order of this call should be kept too
      this.DirectToF0306_1(data);

      // let dataList =
      // this.DirectToF0301(dataList)
    },
    DirectToF0306_1(x) {
      // console.log(`Row Function Button Clicked. (${x.length})`);
      //this.$router.replace(this.BasePath + "/" + x.guid);
      // alert("passData");
      console.log(x.dataList);
      window.dtcEvaluationDataList = x.dataList ? x.dataList : [];
      // alert("FI0306");
      console.log(window.dtcEvaluationDataList);

      this.$router.replace({ name: "FI0306-1" });
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
      this.$refs["test"].UsingThemeBlack = this.$IsThemeBlack();
    },
    //
    tabTitle(tab) {
      if (!tab.disabled) return tab.label + " (" + tab.count + ")";
      else return null;
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
