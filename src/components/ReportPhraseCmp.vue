<template>
  <div id="twpv21">
    <b-row no-gutters class="mt-1">
      <b-col xl="12">
        <b-table
          bordered
          striped
          small
          hover
          responsive
          primary-key="dtcTablex"
          head-variant="dark"
          :dark="true"
          :items="records"
          :fields="CalcFieldConfig"
          :sort-by.sync="TableSortBy"
          :sort-desc.sync="TableSortDesc"
          show-empty
          :empty-html="HTML4EmptyContent"
          class="px-1"
          no-local-sorting
        >
          <!-- Table BUSY state -->
          <div slot="table-busy" class="text-center text-danger my-2">
            <b-spinner class="align-middle"></b-spinner>&nbsp;
            <strong>載入中, 請稍待 ...</strong>
          </div>
          <!-- 列編輯功能欄位.按鈕 -->
          >
          <template v-slot:cell(OpColumnType1)="row">
            <b-btn
              size="sm"
              variant="success"
              class="no-wrap"
              @click="OnColumnButton1Click(row.item)"
            >{{ Text4OpColButton1 }}</b-btn>
          </template>
          <template v-slot:cell(Replacement)="row">
            <div
              :title="row.item.Replacement"
              style="text-overflow: ellipsis;white-space:nowrap;overflow:hidden;max-width:60vw;text-align:left;"
              :id="row.item.PhraseCode"
            >
              {{ row.item.Replacement }}
              <b-tooltip :target="row.item.PhraseCode" triggers="hover">{{ row.item.Replacement }}</b-tooltip>
            </div>
          </template>
          <template v-slot:cell(UPDATEDTTM)="row">{{ row.item.UPDATEDTTM }}</template>
          <template v-slot:cell(OpColumnType2)="row">
            <b-btn
              size="sm"
              v-if="showCopyPasteBtn"
              variant="primary"
              class="no-wrap mr-1"
              @click="OnCopyPaste(row.item)"
            >複製</b-btn>
            <b-btn
              size="sm"
              variant="success"
              :disabled="disableBtn"
              class="no-wrap mr-1"
              @click="OnColumnButton1Click(row.item)"
            >{{ Text4OpColButton1 }}</b-btn>
            <b-btn
              size="sm"
              variant="info"
              :disabled="disableBtn"
              class="no-wrap"
              @click="OnColumnButton2Click(row.item)"
            >{{ Text4OpColButton2 }}</b-btn>
          </template>
          <!-- 列編輯功能欄位.CheckBox -->
          <template v-slot:cell(CheckBoxColumnType1)="row">
            <b-check
              v-model="row.item.TWPCheckBox1Value"
              @change="OnColumnCheckBox1Change(row.item)"
            >{{ Text4CBColCheckBox1 }}</b-check>
          </template>
        </b-table>
      </b-col>
    </b-row>
    <b-row no-gutters class="mb-1" v-if="PagingEnabled">
      <b-col sm="4">
        <div class="float-left my-1 px-1 w-100">
          <b-form-group class="mb-0 ml-4">
            <b-input-group style="margin-left:12px;">
              <b-form-input v-model.trim.lazy="searchCode" placeholder="搜尋片語代號" size="md"></b-form-input>
              <div class="mx-3 text-light mt-2">或是</div>
              <b-form-input v-model.trim.lazy="SearchFilter" placeholder="搜尋置換內文" size="md"></b-form-input>
            </b-input-group>
          </b-form-group>
        </div>
      </b-col>
      <b-col sm="4">
        <b-pagination
          v-model="PagingCurrentPage"
          :total-rows="RowCount"
          :per-page="PagingRowPerPage"
          aria-controls="dataTable1"
          align="center"
        >
          <span slot="first-text">
            <i class="fas fa-fast-backward"></i>
          </span>
          <span slot="prev-text">
            <i class="fas fa-step-backward"></i>
          </span>
          <span slot="next-text">
            <i class="fas fa-step-forward"></i>
          </span>
          <span slot="last-text">
            <i class="fas fa-fast-forward"></i>
          </span>
          <span slot="page" slot-scope="{ page, active }">
            <b v-if="active">{{ page }}</b>
            <i v-else>{{ page }}</i>
          </span>
        </b-pagination>
      </b-col>
      <b-col sm="4">
        <div class="float-right my-1 pr-4">
          <label for="pagingPerPageOption" class="float-left my-1" v-html="GetPageOptionLabel"></label>
          <b-form-select
            id="pagingPerPageOption"
            size="sm"
            plain
            v-if="PagingEnabled"
            v-model="PagingRowPerPage"
            :options="this.$DefaultPerPageOption"
          ></b-form-select>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
// 異動歷
// 20191114 Pollux,
//	因 Bootstrap-Vue 版本變更, 其 slot 語法改變, 本功能必須因應調整
// 20191114.1817 Pollux, 測試 CI/CD off

// 載入組態設定模組
import buildQuery from "odata-query";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import { dateFormatMixin } from "@/SupportLib_J.js";
export default {
  name: "TWPv2",
  mixins: [dateFormatMixin],
  props: {
    FieldConfig: { type: Array, required: true },
    DataFetch: { type: Function },
    NoPaging: { type: Boolean },
    Operatable: { type: Boolean },
    OpButton1Func: { type: Function },
    OpButton1Text: { type: String },
    OpButton2Func: { type: Function },
    OpButton2Text: { type: String },
    CheckBox1Head: { type: String },
    CheckBox1Text: { type: String },
    CheckBox1Func: { type: Function },
    CheckBox1Lead: { type: Boolean },
    ThemeBlack: { type: Boolean, default: false },
    selectedDtcTab: { type: Number, default: 1 }
  },
  data() {
    return {
      ObjApp: "",
      records: [],
      showCopyPasteBtn: false,
      currentPageNum: 1,
      id: this.$store.state.Profile4User.id,
      Wait4AsyncLoad: false,
      PagingEnabled: true,
      PagingRowPerPage: 10,
      PagingCurrentPage: 1,
      TableSortBy: "",
      TableSortDesc: false,
      RowCount: 0,
      SearchFilter: null,
      searchCode: null,
      SlotId4OpColType1: "OpColumnType1",
      SlotId4OpColType2: "OpColumnType2",
      Text4OpColButton1: "",
      Text4OpColButton2: "",
      SlotId4CBColType1: "CheckBoxColumnType1",
      Text4CBColCheckBox1: "",
      UsingThemeBlack: false
    };
  },
  computed: {
    CalcFieldConfig() {
      return [
        {
          key: "PhraseCode",
          label: "片語代號",
          sortable: true,
          thClass: "no-wrap",
          tdClass: "no-wrap text-center"
        },
        {
          key: "Modality",
          label: "儀器名稱",
          sortable: true,
          thClass: "no-wrap",
          tdClass: "no-wrap text-center"
        },
        {
          key: "Replacement",
          label: "置換內文",
          sortable: true,
          thClass: "no-wrap",
          tdClass: "no-wrap text-center"
        },
        {
          key: "UPDATEDTTM",
          label: "異動日期",
          sortable: true,
          thClass: "no-wrap",
          tdClass: "no-wrap text-center"
        },
        {
          key: "OpColumnType2",
          label: "操作",
          thClass: "no-wrap",
          tdClass: "no-wrap"
        }
      ];
    },

    disableBtn() {
      const ret = this.$store.state.Profile4User.functions.find(
        s => s === "CommonReportPhrase"
      );
      return ret ? false : true;
    },

    GetPageOptionLabel() {
      return (
        "<span class='text-light'>共計 <b>" +
        this.$FormatForceInteger(this.RowCount) +
        "</b> 筆, 每頁顯示&nbsp; </span"
      );
    },
    HTML4EmptyContent() {
      return this.Wait4AsyncLoad
        ? '<b class="text-light"><i class="fas fa-spinner fa-spin"></i>&nbsp;內容載入中, 請稍待 ...</b>'
        : '<b class="text-light">很抱歉, 目前並無任何內容可供呈現.</b>';
    },
    HTML4EmptyResult() {
      return '<b class="text-light">抱歉, 並無任何吻合條件的內容.</b>';
    }
  },
  methods: {
    Formatter4NTD(x) {
      return this.$FormatForceInteger(x);
    },
    OnCopyPaste(item) {
      this.$root.$emit("dtc-copy-paste", item.Replacement);
      Swal.fire({
        position: "center",
        icon: "success",
        title: "複製並貼上至報告內容完成!!",
        showConfirmButton: false,
        timer: 600
      });
    },

    OnColumnButton1Click(x) {
      this.OpButton1Func(x);
    },
    OnColumnButton2Click(x) {
      this.OpButton2Func(x);
    },
    OnColumnCheckBox1Change(x) {
      this.CheckBox1Func(x);
    },
    async AsyncFetch() {
      const page = this.currentPageNum;
      const skip = (page - 1) * this.PagingRowPerPage;
      const top = this.PagingRowPerPage;
      const dir = this.TableSortDesc ? "desc" : "asc";
      const orderBy = this.TableSortBy ? [`${this.TableSortBy} ${dir}`] : "";
      const lower = this.SearchFilter ? this.SearchFilter.toLowerCase() : "";
      const lower2 = this.searchCode ? this.searchCode.toLowerCase() : "";
      const obj = this.TableSortBy ? { top, skip, orderBy } : { top, skip };
      // support substringof
      const filter = this.SearchFilter
        ? `&$filter=substringof('${lower}',tolower(Replacement)) eq true`
        : "";
      const filter2 = this.searchCode
        ? `&$filter=substringof('${lower2}',tolower(PhraseCode)) eq true`
        : "";
      // server not support ODtata contains.
      //const filter = this.SearchFilter ? { Replacement: { contains: this.SearchFilter } } : "";

      const no = this.selectedDtcTab == 1 ? `&employeeNo=${this.id}` : "";
      let qs = buildQuery(obj) + no + filter + filter2;
      this.ObjApp.WaitingShow();
      const map = await window.axios.get(`/reportPhrase/Get` + qs);
      this.ObjApp.WaitingHide();
      this.RowCount = map.Count;
      //this.records = map.Items;
      map.Items.map(
        s => (s.UPDATEDTTM = this.DateToString(new Date(s.UPDATEDTTM), true))
      );
      this.records = [...map.Items];
    },
    GetCheckBox1Text() {
      return this.CheckBox1Text ? this.CheckBox1Text : "";
    },
    GetCheckBox1Object() {
      return {
        key: this.SlotId4CBColType1,
        label: this.CheckBox1Head ? this.CheckBox1Head : "",
        thClass: "no-wrap"
      };
    }
  },
  created() {
    //showCopyPasteBtn
    location.href.includes("FI0301")
      ? (this.showCopyPasteBtn = true)
      : (this.showCopyPasteBtn = false);
    this.$root.$on("reload-report-phrase", () => this.AsyncFetch());
    let obj = this.$GetApp(this);
    this.ObjApp = obj[0];
  },
  mounted() {
    this.UsingThemeBlack = this.$IsThemeBlack();
    if (this.Operatable || this.OpButton1Func) {
      this.FieldConfig.push({
        key: this.OpButton2Func
          ? this.SlotId4OpColType2
          : this.SlotId4OpColType1,
        label: "操作",
        thClass: "no-wrap",
        tdClass: "no-wrap"
      });
      this.Text4OpColButton1 = !this.OpButton1Text
        ? "編輯"
        : this.OpButton1Text;
      if (this.OpButton2Func) {
        this.Text4OpColButton2 = !this.OpButton2Text
          ? "管理"
          : this.OpButton2Text;
      }
    }
    //
    if (this.CheckBox1Func && !this.CheckBox1Lead) {
      this.Text4CBColCheckBox1 = this.GetCheckBox1Text();
      this.FieldConfig.push(this.GetCheckBox1Object());
    }

    this.AsyncFetch(this.currentPageNum).catch(e => {});
  },
  watch: {
    PagingCurrentPage(v) {
      this.currentPageNum = v;
      this.AsyncFetch().catch(e => {});
    },

    selectedDtcTab() {
      this.currentPageNum = 1;
      this.SearchFilter = "";
      this.AsyncFetch().catch(e => {});
    },
    PagingRowPerPage() {
      this.currentPageNum = 1;
      this.AsyncFetch().catch(e => {});
    },
    SearchFilter(v) {
      this.currentPageNum = 1;
      v ? (this.searchCode = "") : "";
      this.AsyncFetch().catch(e => {});
    },
    TableSortDesc() {
      this.currentPageNum = 1;
      //alert(this.TableSortBy);
      this.AsyncFetch().catch(e => {});
    },
    searchCode(v) {
      this.currentPageNum = 1;
      //alert(this.TableSortBy);
      v ? (this.SearchFilter = "") : "";
      this.AsyncFetch().catch(e => {});
    }
  }
};
</script>

<style scope>
#pagingPerPageOption {
  width: 5.5rem;
}
ul.pagination {
  margin-bottom: 0;
}
</style>

<style>
#WinMass0301 .nav-link {
  color: white;
  cursor: pointer;
}
#WinMass0301 .nav-link:hover {
  color: white;
}
#WinEdit0302___BV_modal_body_ .custom-select {
  background: black;
  color: white;
}
</style>
