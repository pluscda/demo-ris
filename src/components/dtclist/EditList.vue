<template>
  <section class="dtc-main-section">
    <header class="ask-header">役男資料編輯</header>
    <div class="dtc-search">
      <main class="left-header">
        <b-input-group prepend="體檢時間">
          <b-input type="date" v-model="time"></b-input>
        </b-input-group>
        <b-input-group prepend="身份證號">
          <b-input v-model.trim="id" :autofocus="autofocus" placeholder="搜尋身份證字號"></b-input>
        </b-input-group>
        <b-input-group prepend="檢查狀態">
          <b-select :options="sizes" v-model="size" @change="searchDb"></b-select>
        </b-input-group>
        <b-button class variant="light" @click="searchDb" size="sm">
          <i class="fas fa-search"></i>進行查詢
        </b-button>
        <b-button variant="info" @click="clearSearch" size="sm">
          <i class="fas fa-eraser"></i>清除條件
        </b-button>
        <b-input-group prepend="體檢醫院">
          <b-select :options="wheres" v-model="where" @change="searchDb"></b-select>
        </b-input-group>
        <b-input-group prepend="役男姓名">
          <b-input v-model.trim="name" placeholder="搜尋役男姓名"></b-input>
        </b-input-group>
      </main>
      <div></div>

      <div></div>
    </div>

    <header class="dtc-grid-header my-dark">
      <div>編輯</div>
      <div v-for="(item, i) in headers" :key="i" @click="sort(item)">
        {{ item.name }}
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
    <main v-if="!items.length" class="dtc-grid-header main-dtc-body">
      <div style="grid-column: 1 / -1;padding: 20px 0px;font-size:24px;color:#000;">暫無資料</div>
    </main>
    <main
      class="dtc-grid-header main-dtc-body"
      v-for="(item, i) in items"
      :key="i"
      style="color:black;"
      :style="i % 2 == 0 ? 'background-color: #F5F5F5;' : 'background-color: #E0E0E0;'"
    >
      <div>
        <b-button variant="success" size="sm" @click="editPersonItem(item)">編輯</b-button>
      </div>
      <div>{{ item.ExamDate.split("T")[0] }}</div>
      <div>{{ item.BatchId }}</div>
      <div>{{ wheres.length && wheres.find( s => s.value == item.InstitutionId).text}}</div>
      <div>{{ item.Name }}</div>
      <div>{{ item.IdNo }}</div>
      <div>{{ item.Birthday ? item.Birthday.split("T")[0] : "" }}</div>
      <div>{{item.Unknown}}</div>
      <div>{{item.ContactPhone}}</div>
      <div>{{ item.NotifierPhone }}</div>
      <div>{{ item.Address }}</div>
      <div>{{item.Notes}}</div>
      <div>{{ sizes.length && sizes.find(s => s.value == item.ExamStatus).text }}</div>
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
      <div class="mt-3" style="color:black;">{{ totalCountStr }}</div>
    </footer>
    <div v-if="showFinalResult" class="final-result">
      <FinalResult></FinalResult>
    </div>
    <EdlitistItem :wheres="wheres"></EdlitistItem>
  </section>
</template>

<script>
import queryString from "query-string";
import buildQuery from "odata-query";
import { store, actions } from "@/store/global.js";
import FinalResult from "../../views/PhysicalExam/FinalResult";
import EdlitistItem from "./EdlitistItem";

const status = [
  { value: "0", text: "未確認" },
  { value: "1", text: "確認" },
  { value: "2", text: "通知修正" },
];

const status2 = [
  { value: null, text: "全部" },
  { value: "0", text: "未確認" },
  { value: "1", text: "確認" },
  { value: "2", text: "通知修正" },
];

const headers = [
  { name: "體檢時間", key: "ExamDate", sortDesc: null },
  { name: "體檢梯次", key: "BatchId", sortDesc: null },
  { name: "檢查醫院", key: "InstitutionId", sortDesc: null },
  { name: "役男姓名", key: "Name", sortDesc: null },
  { name: "身分證號", key: "IdNo", sortDesc: null },
  { name: "出生日期", key: "Birthday", sortDesc: null },
  { name: "列管編號", key: "UnKnow", sortDesc: null },
  { name: "聯絡電話", key: "ContactPhone", sortDesc: null },
  { name: "通報人聯絡電話", key: "NotifierPhone", sortDesc: null },
  { name: "戶籍地址", key: "Address", sortDesc: null },
  { name: "備考", key: "Notes", sortDesc: null },
  { name: "檢查狀態", key: "ExamStatus", sortDesc: null },
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
  key9: "判定體位",
};
let items = new Array(1).fill(dummyRow);
const keys = Object.keys(items[0]);
items = [];
//alert(headers.length);
const zero = "T00:00:00";
const rows = [10, 20, 50];
export default {
  name: "totalSpend833",
  data() {
    return {
      // editPerson: false,
      showFinalResult: false,
      curStatus: [],
      autofocus: true,
      judges: store.judges,
      mode: "2",
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
      year: window.year - 1,
      years: window.years,
      areas: [],
      area: null,
      wheres: [],
      where: null,
      search: false,
      rows,
      totalCountStr: "",
      editItem: "",
      status,
      status2,
      mode2: null,
      note: "",
      countries: [],
      country: null,
      sizes: [],
      size: null,
      startDate: "",
      endDate: "",
      time: "",
      orderBy: [],
    };
  },

  components: {
    FinalResult,
    EdlitistItem,
  },
  computed: {
    editPerson() {
      return store.editItem;
    },
  },
  methods: {
    sort(item) {
      if (item.sortDesc) {
        item.sortDesc = null;
      } else if (false === item.sortDesc) {
        item.sortDesc = true;
      } else if (null === item.sortDesc) {
        item.sortDesc = false;
      }
      this.orderBy = [];
      this.headers.forEach((s) => {
        if (s.sortDesc !== null) {
          this.orderBy.push(s.sortDesc ? `${s.key} desc` : `${s.key}`);
        }
      });
      this.getData();
    },
    async getCountryList() {
      if (!this.countries.length) {
        const { Items: list } = await window.axios.get(
          "countryidentity/CountryIdentityList"
        );
        this.countries = list.map((s) => ({
          value: s.SeqNo,
          text: s.CountryIdentityName,
        }));
        this.countries.unshift({ value: null, text: "全部" });
      }
    },
    async editPersonItem(item) {
      store.editItem = { ...item };
      this.$bvModal.show("dtcEditPerson");
    },
    async edit(item) {
      this.showFinalResult = true;
    },
    async viewPdf(item) {
      window.open(item.Src);
    },
    searchDb() {
      this.search = true;
      this.getData();
    },
    async clearSearch() {
      this.id = "";
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
      if (this.search && this.id) {
        qs = this.$dataFilter("IdNo", qs, this.id);
      }

      if (this.search && this.size) {
        if (this.id) {
          qs += ` and ExamStatus eq ${this.size}`;
        } else {
          qs += `&$filter=ExamStatus eq ${this.size}`;
        }
      }
      if (this.search && this.name) {
        if (this.id || this.size) {
          qs = this.$appendFilter("Name", qs, this.name);
        } else {
          qs = this.$dataFilter("Name", qs, this.name);
        }
      }

      if (this.search && this.time) {
        const time = this.time + zero;
        if (this.id || this.size || this.name) {
          qs = this.$appendEqualFilter("ExamDate", qs, `"${time}"`);
        } else {
          qs = this.$equalFilter("ExamDate", qs, `"${time}"`);
        }
      }
      if (this.search && this.area) {
        if (this.id || this.size || this.name || this.time) {
          qs = this.$appendFilter("Location", qs, this.area);
        } else {
          qs = this.$dataFilter("Location", qs, this.area);
        }
      }
      if (this.search && this.where) {
        if (this.id || this.size || this.name || this.time || this.area) {
          qs = this.$appendEqualFilter("InstitutionId", qs, this.where);
        } else {
          qs = this.$equalFilter("InstitutionId", qs, this.where);
        }
      } //InstitutionId
      const { Items, Count } = await actions.getHistoryList(qs);
      // const { Items, Count } = await window.axios.get(
      //   "api/Military" + qs + str
      // );
      Items.length ? (this.keys = Object.keys(Items[0])) : "";
      //alert(this.keys.length);
      this.items = Items;
      this.rowCount = Count;
      this.totalCountStr = `共${Count} 筆`;
    },
  },
  async mounted() {
    this.curStatus = (await axios.get("reference/ExamStatus")).map((s) => ({
      value: s.Id,
      text: s.Name,
    }));
    this.getData();
    document.body.classList.remove("steps");
    this.areas = [...window.taipeis];
    this.areas.unshift({ value: null, text: "全部" });
    this.$root.$on("close-final-result", () => (this.showFinalResult = false));
    this.sizes = (await axios.get("reference/ExamStatus")).map((s) => ({
      value: s.Id,
      text: s.Name,
    }));
    this.sizes.unshift({ value: null, text: "全部" });
    this.wheres = (await axios.get("institution/SelectList")).map((s) => ({
      value: s.Id,
      text: s.Name,
    }));
    this.wheres = this.wheres.filter((s) => s.text.includes("醫院"));
    this.wheres.unshift({ value: null, text: "全部" });
  },

  watch: {
    currentPageNum(v) {
      this.currentPageNum = v;
      this.getData().catch((e) => {});
    },
    pagingRowPerPage(v) {
      this.getData().catch((e) => {});
    },
    editPerson() {
      this.getData().catch((e) => {});
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.dtc-main-section {
  overflow-x: auto;
  background: #fbfbfb;
  position: relative;
  min-height: calc(100vh - 76px);
}
.dtc-grid-header {
  display: grid;
  grid-template-columns: 60px repeat(2, 120px) 180px repeat(6, 120px) 1fr 1fr 120px;
  grid-auto-flow: column;
  text-align: center;
  padding-right: 0px;

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
  max-height: 80px;
  margin-bottom: 12px;
  grid-template-columns: 1260px 1fr max-content 10px;
  grid-gap: 1rem;
  padding-left: 10px;
  .left-header {
    display: grid;
    grid-template-columns: repeat(3, 1fr) max-content max-content;
    grid-gap: 4px;
  }
  .right-header {
    display: flex;
    flex-direction: column;
  }
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
  background: #0f579b;
  border-color: #0f579b;
}
/deep/ .page-item.active .page-link {
  background: #808080;
  border-color: #808080;
}
/deep/ .input-group-text {
  min-width: 90px;
}

.final-result {
  position: fixed;
  z-index: 999999999;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  display: grid;
  place-items: center;
  background: rgba(#000, 0.8);
}
.edit-person {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(#000, 0.8);
  display: grid;
  place-items: center;
  z-index: 99999;
  main {
    width: 900px;
    height: 425px;
    background: white;
    header {
      background: #10579b;
      position: relative;
      height: 40px;
      line-height: 40px;
      font-size: 24px;
      padding-left: 1rem;
    }
    section {
      padding: 1.2rem;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(4, 40px) 92px;
      gap: 10px;
    }
    footer {
      display: grid;
      place-items: center;
    }
  }
}

.close-dlg {
  float: right;
  color: var(--light);
  font-size: 24px;
  cursor: pointer;
  margin-top: 0px;
  margin-right: 10px;
}
</style>
