<template>
  <section class="dtc-main-section">
    <div class="close-dlg" v-if="showCloseBtn" @click="closePhraseUi">
      <i class="fas fa-times-circle"></i>
    </div>
    <AddPhrase></AddPhrase>
    <AddSysPhrase></AddSysPhrase>
    <EditPhrase></EditPhrase>
    <header class="ask-header">{{fromService ? '系統' :''}}片語維護</header>
    <div class="dtc-search pl-2">
      <b-input-group prepend="片語代號">
        <b-input v-model.trim="Code" placeholder="搜尋片語代號"></b-input>
      </b-input-group>
      <b-input-group prepend="置換內文">
        <b-input v-model.trim="Text" placeholder="搜尋置換內文"></b-input>
      </b-input-group>
      <b-button class="mr-1" variant="light" @click="searchDb" size="sm">
        <i class="fas fa-search"></i>進行查詢
      </b-button>
      <b-button variant="info" @click="clearSearch" size="sm">
        <i class="fas fa-eraser"></i>清除條件
      </b-button>
      <b-button class="mr-1" variant="success" @click="addNew" size="sm">
        <i class="fas fa-plus"></i>新增片語
      </b-button>
    </div>
    <vue-tabs
      v-if="!fromService"
      active-tab-color="#6c757d"
      active-text-color="white"
      @tab-change="handleTabChange"
      class="mt-4 ml-1"
    >
      <v-tab title="個人片語維護" icon="ti-user"></v-tab>

      <v-tab title="公用片語維護" icon="ti-settings"></v-tab>
    </vue-tabs>

    <header class="dtc-grid-header my-dark ml-1">
      <div>操作</div>
      <div v-for="(item,i) in headers" :key="i" @click="sort(item);">
        {{item.name}}
        <span v-show="item.sortDesc === null">
          <i class="fas fa-sort"></i>
        </span>
        <span v-show="item.sortDesc === false">
          <i class="fas fa-sort-up"></i>
        </span>
        <span v-show="item.sortDesc">
          <i class="fas fa-sort-down"></i>
        </span>
      </div>
    </header>
    <main v-if="!items.length" class="dtc-grid-header main-dtc-body ml-1">
      <div style="grid-column: 1 / -1;padding: 20px 0px;font-size:24px;color:black;">暫無資料</div>
    </main>
    <main
      class="dtc-grid-header main-dtc-body"
      v-for="(item,i) in items"
      :key="i"
      style="color:black;"
      :style="i % 2 == 0 ? 'background-color: #F5F5F5;':'background-color: #E0E0E0;'"
    >
      <div class="edit-row-dtc">
        <b-button
          size="sm"
          variant="success"
          @click="del(item)"
          v-show="canEditGroup || !dtcPublic"
          v-if="!item.IsSystem"
        >刪除</b-button>
        <b-button
          size="sm"
          variant="info"
          class="ml-2"
          @click="editMyItem(item)"
          v-show="canEditGroup || !dtcPublic"
          v-if="!item.IsSystem"
        >編輯</b-button>
        <b-button
          size="sm"
          variant="light"
          class="ml-2"
          v-clipboard:copy="item.Text"
          v-clipboard:success="onCopy"
        >複製</b-button>
      </div>
      <div>{{item.Code}}</div>
      <div>{{inspectsArr[+item.ProcedureSerial]}}</div>
      <div
        style="text-align:left;padding-left:6px;"
        class="ellipsis"
        :title="item.Text"
      >{{item.Text}}</div>
    </main>
    <footer class="dtx-footer">
      <b-pagination
        v-model="currentPageNum"
        :total-rows="rowCount"
        :per-page="pagingRowPerPage"
        aria-controls="dataTable1"
        align="center"
        class="mt-2"
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
      <b-select :options="rows" class="mt-2" v-model="pagingRowPerPage"></b-select>
      <div class="mt-3">{{totalCountStr}}</div>
    </footer>
  </section>
</template>

<script>
import queryString from "query-string";
import buildQuery from "odata-query";
import { store, actions } from "@/store/global.js";
import AddPhrase from "../Modal/AddPhrase";
import AddSysPhrase from "../Modal/AddSysPhrase";
import EditPhrase from "../Modal/EditPhrase";
const status = [
  { value: "0", text: "未確認" },
  { value: "1", text: "確認" },
  { value: "2", text: "通知修正" }
];

const status2 = [
  { value: null, text: "全部" },
  { value: "0", text: "未確認" },
  { value: "1", text: "確認" },
  { value: "2", text: "通知修正" }
];
const sizes = ["全部", "常備役", "替代役", "免役"];

const headers = [
  { name: "片語代號", key: "Code", sortDesc: null },
  { name: "檢查項目", key: "ProcedureSerial", sortDesc: null },
  { name: "片語內文", key: "Text", sortDesc: null }
];

const startTime = `${years[1] + 1911}-01-01`;
const endTime = `${years[1] + 1911}-12-31`;
//alert(startTime);
const dummyRow = {
  key1: "姓名",
  key2: "身分證號",
  key3: "出生日期",
  key4: "聯絡電話",
  key5: "行動電話",
  key6: "戶籍地址",
  key7: "體檢日期",
  key8: "體檢醫院",
  key9: "判定體位"
};
const inspectsArr = [
  "",
  "身高",
  "體重",
  "體格指標值(BMI)",
  "血壓",
  "脈搏",
  "牙科檢查",
  "頭部顏面頸頭皮",
  "皮膚及淋巴腺",
  "鼻",
  "竇",
  "口腔",
  "咽喉",
  "肺部及胸部",
  "胸部X光",
  "腹部",
  "心臟",
  "內分泌腺",
  "血管(曲張)",
  "肛門及直腸",
  "生殖器",
  "上肢及關節",
  "下肢及關節",
  "耳器",
  "鼓膜",
  "聽力",
  "眼",
  "眼底",
  "辨色力",
  "視力",
  "神經系統",
  "精神",
  "智能",
  "心電圖",
  "梅毒",
  "愛滋",
  "血液常規檢查",
  "肝功能",
  "尿液檢查"
];
let items = new Array(1).fill(dummyRow);
const keys = Object.keys(items[0]);
items = [];

const zero = "T00:00:00";
const rows = [10, 20, 50];
export default {
  name: "totalSpendPhrase",
  data() {
    return {
      fromService: location.href.includes('?service=true'),
      orderBy: [],
      Code: "",
      Text: "",
      dtcPublic: false,
      inspectsArr,
      showEdit: false,
      number: "",
      name: "",
      id: "",
      headers,
      items,
      keys,
      currentPageNum: 1,
      rowCount: 0,
      pagingRowPerPage: 20,
      search: false,
      rows,
      totalCountStr: "",
      editItem: "",
      canEditGroup: sessionStorage.role.includes("HospitalAdmins")
    };
  },
  components: {
    AddPhrase,
    AddSysPhrase,
    EditPhrase
  },
  props: ["showClose"],
  computed: {
    showCloseBtn() {
      return store.showPhraseDlg;
    },
    editPhrase() {
      return store.editItem ;
    }
  },
  methods: {
    onCopy() {
      this.$bvToast.toast(`片語成功複製`, {
        title: "系統資訊",
        autoHideDelay: 5000,
        variant: "success"
      });
    },
    sort(item) {
      if (item.sortDesc) {
        item.sortDesc = null;
      } else if (false === item.sortDesc) {
        item.sortDesc = true;
      } else if (null === item.sortDesc) {
        item.sortDesc = false;
      }
      this.orderBy = [];
      this.headers.forEach(s => {
        if (s.sortDesc !== null) {
          this.orderBy.push(s.sortDesc ? `${s.key} desc` : `${s.key}`);
        }
      });
      this.getData();
    },
    addNew() {
     
      if(this.fromService){
        this.$bvModal.show("dtcAddSysPhrase");
      }else{
        this.$bvModal.show("dtcAddPhrase");
      }
    },
    async del(item) {
      try {
        await actions.deletePhrase(item.Id);
        this.getData();
        let arr = await this.$vlf.getItem("phrase");
        const ret = arr.find(s => s.Code == item.Code);
        if (ret) {
          ret.Text = "";
          ret.Code = "";
        }
        this.$vlf.setItem("phrase", arr);
      } catch (e) {
        alert(e);
      }
    },
    async editMyItem(item) {
      store.editItem = { ...item };
      this.$bvModal.show("dtcEditPhrase");
    },
    handleTabChange(tabIndex, newTab, oldTab) {
      if (newTab == oldTab) return;
      this.headers = [
        { name: "片語代號", key: "Code", sortDesc: true },
        { name: "檢查項目", key: "ProcedureSerial", sortDesc: null },
        { name: "片語內文", key: "Text", sortDesc: null }
      ];
      this.currentPageNum = 1;
      //your code here
      if (tabIndex == 0) {
        //personal
        this.dtcPublic = false;
      } else {
        //group
        this.dtcPublic = true;
      }
      this.getData();
    },
    closePhraseUi() {
      store.showPhraseDlg = false;
    },
    async edit(item) {
      // get personal info
      store.editItem = await actions.getInfoById(item.IdNo);
      //store.editItem.hot =
      this.$router.push("details");
    },
    async viewPdf(item) {
      window.open(item.Src);
    },
    searchDb() {
      this.search = true;
      this.getData();
    },
    async clearSearch() {
      this.Code = this.Text = "";
      this.getData();
    },
    async getData() {
      //odata3 qs
      const page = this.currentPageNum;
      const skip = (page - 1) * this.pagingRowPerPage;
      const top = this.pagingRowPerPage;
      const orderBy = this.orderBy;
      const obj = orderBy.length ? { top, skip, orderBy } : { top, skip };
      let qs = buildQuery(obj); // + no + filter + filter2;

      if (this.search && this.Code) {
        qs = this.$dataFilter("Code", qs, this.Code);
      }
      if (this.search && this.Text) {
        qs = this.Code
          ? this.$appendFilter("Text", qs, this.Text)
          : this.$dataFilter("Text", qs, this.Text);
      }
 
      let { Items, Count } = this.fromService
        ? await axios.get('phrase/SystemPhrase' + qs)
        : this.dtcPublic ? await actions.getPublicPhrases(qs) : await actions.getPrivatePhrases(qs);

      Items.length ? (this.keys = Object.keys(Items[0])) : "";
      //alert(this.keys.length);
      this.items = Items;
      this.rowCount = Count;
      this.totalCountStr = `共${Count} 筆`;
    }
  },
  async mounted() {
    //this.getData();
    this.sort(headers[0]);
    this.$mousetrap.bind("esc", this.closePhraseUi);
    //this.$mousetrap.bind("f6", this.closePhraseUi);
  },

  watch: {
    currentPageNum(v) {
      this.currentPageNum = v;
      this.getData().catch(e => {});
    },
    pagingRowPerPage(v) {
      this.getData().catch(e => {});
    },
    editPhrase() {
      this.getData().catch(e => {});
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.dtc-main-section {
  overflow-x: auto;
  background: #fbfbfb;
  position: relative;
  min-height: calc(100vh - 75px);
}
.dtc-grid-header {
  display: grid;
  grid-template-columns: 180px 160px 180px 1fr; //repeat(4, 1fr);
  grid-auto-flow: column;
  text-align: center;
  padding-right: 0px;
  border: 1px solid white;

  > div {
    border-right: 1px solid white;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    font-size: 14px;
    padding: 4px 0;
  }
  > div:last-child {
    border-right: none;
  }
}
.my-dark {
  > div {
    background: var(--gray);
    color: white;
  }
}
.dtc-link {
  color: var(--primary);
  cursor: pointer;
}
.dtc-search {
  position: relative;
  display: grid;
  max-height: 40px;
  margin-bottom: 12px;
  grid-template-columns: repeat(34, max-content);
  grid-gap: 1rem;
}
.search-btns {
  position: absolute;
  display: flex;
  flex-direction: column;
  > button:not(:first-child) {
    margin-top: 1rem;
  }
  right: 2px;
  top: 0px;
}
.dtx-footer {
  display: grid;
  grid-template-columns: max-content max-content max-content;
  justify-content: center;
  grid-gap: 12px;
}
.container-dtx {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(#000, 0.8);
  display: grid;
  place-items: center;
  z-index: 999;
}
.dtx-form {
  width: 800px;
  height: 300px;
  padding: 12px;
  border-radius: 5px;
  background: var(--light);
  display: grid;
  grid-template-columns: repeat(2, 1fr);

  grid-gap: 12px;
  > div {
    max-height: 40px;
  }
  button {
    justify-self: center;
    max-height: 40px;
  }
}
.main-dtc-body {
  &:hover {
    background-color: rgba(0, 0, 0, 0.075);
  }
  > div {
    line-height: 24px;
  }
}
.input-group-text {
  color: white;
  background: #757575;
}

.close-phrase-icon {
  cursor: pointer;
  float: right;
  font-size: 30px;
  color: var(--success);
  transform: translate(-20px, -20px);
}
.edit-row-dtc {
  display: grid;
  grid-template-columns: max-content max-content;
  grid-gap: 4px;
}
.close-dlg {
  float: right;
  color: var(--light);
  font-size: 24px;
  cursor: pointer;
  margin-top: 0px;
  margin-right: 10px;
}
.ask-header {
  background: #646b74;
  height: 42px;
  color: white;
  font-size: 20px;
  padding-left: 10px;
  line-height: 42px;
  margin-bottom: 12px;
}
/deep/ .btn-light {
  background: #1f7cd3;
  border-color: #1f7cd3;
  color: white;
}
/deep/ .btn-info {
  background: #0f579b;
  border-color: #0f579b;
}
/deep/ .btn-success {
  background: #17a2b8;
  border-color: #17a2b8;
}
/deep/ .page-item.active .page-link {
  background: #808080;
  border-color: #808080;
}
</style>
