<template>
  <section class="dtc-main-section">
    <div class="close-dlg" v-if="showCloseBtn" @click="closePhraseUi">
      <i class="fas fa-times-circle"></i>
    </div>
    <header class="ask-header">黑名單用語維護</header>
    <div class="dtc-search pl-2">
      <b-input-group prepend="關鍵字">
        <b-input v-model.trim="Code" placeholder="搜尋關鍵字"></b-input>
      </b-input-group>
      <b-button class="mr-1" variant="light" @click="searchDb" size="sm">
        <i class="fas fa-search"></i>進行查詢
      </b-button>
      <b-button variant="info" @click="clearSearch" size="sm">
        <i class="fas fa-eraser"></i>清除條件
      </b-button>
      <b-button class="mr-1" variant="dark" @click="addNewBlackPhrase" size="sm">
        <i class="fas fa-plus"></i>新增黑名單
      </b-button>
    </div>
    <header class="dtc-grid-header my-dark ml-1" style="margin:0;">
      <div>操作</div>
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
    <main v-if="!items.length" class="dtc-grid-header main-dtc-body ml-1">
      <div style="grid-column: 1 / -1;padding: 20px 0px;font-size:24px;color:black;">暫無資料</div>
    </main>
    <main
      class="dtc-grid-header main-dtc-body"
      v-for="(item, i) in items"
      :key="i"
      style="color:black;"
      :style="
        i % 2 == 0 ? 'background-color: #F5F5F5;' : 'background-color: #E0E0E0;'
      "
    >
      <div class="edit-row-dtc">
        <b-button size="sm" variant="danger" @click="del(item)">刪除</b-button>
      </div>
      <b-input @change="updateStatus(item)" v-model="item.Word "></b-input>
      <div>{{ item.CreateAccountNo }}</div>
      <div>{{ $formatDate(item.CreateTime) }}</div>

      <b-check switch v-model="item.IsActivated" @change="updateStatus(item)"></b-check>
      <!-- <div>{{ item.IsActivated }}</div> -->
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
    <AddBlackPhrase></AddBlackPhrase>
  </section>
</template>

<script>
import queryString from "query-string";
import buildQuery from "odata-query";
import { store, actions } from "@/store/global.js";
import AddBlackPhrase from "./Modal/AddBlackPhrase.vue";

const headers = [
  { name: "關鍵字", key: "Word", sortDesc: null },
  { name: "建立者", key: "CreateAccountNo", sortDesc: null },
  { name: "建立日期", key: "CreateTime", sortDesc: null },
  { name: "是否啟用", key: "IsActivated", sortDesc: null },
];

const zero = "T00:00:00";
const rows = [10, 20, 50];
export default {
  name: "totalSpendPhraseBlackList",
  data() {
    return {
      orderBy: [],
      Code: "",
      Text: "",
      dtcPublic: false,
      showEdit: false,
      number: "",
      name: "",
      id: "",
      headers,
      items:[],
      currentPageNum: 1,
      rowCount: 0,
      pagingRowPerPage: 20,
      search: false,
      rows,
      totalCountStr: "",
      editItem: "",
    };
  },
  components: {
    AddBlackPhrase,
  },
  computed: {
    myEditItem(){
      return store.editItem;
    }
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
    addNewBlackPhrase() {
      this.$bvModal.show("dtcAddBlacklist");
    },
    async del(item) {
      try {
        await actions.deleteBlackWord(item.Id);
        this.getData();
      } catch (e) {
        alert(e);
      }
    },
    async editMyItem(item) {
      store.editItem = { ...item };
      this.$bvModal.show("dtcEditBlackWord");
      console.log("item.Id", item.Id);
    },
   
    closePhraseUi() {
      store.showPhraseDlg = false;
    },
    async edit(item) {
      // get personal info
      store.editItem = await actions.getInfoById(item.IdNo);
      this.$router.push("details");
    },
    async updateStatus(item) {
      const obj = {
        Id: item.Id,
        Word: item.Word,
        IsActivated: !item.IsActivated,
        CreateTime: item.CreateTime,
        CreateAccountNo: item.CreateAccountNo,
      };
      try {
        await actions.editBlackWord(obj);
        this.$bvToast.toast(`啟用狀態更新成功`, {
          title: "黑名單管理",
          autoHideDelay: 5000,
          variant: "success",
        });
      } catch (e) {
        this.$bvToast.toast(`啟用狀態更新失敗 ` + e, {
          title: "黑名單管理",
          autoHideDelay: 5000,
          variant: "danger",
        });
      }
    },
    searchDb() {
      this.search = true;
      this.getData();
    },
    async clearSearch() {
      this.Code  = "";
      this.search = false;
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
        qs = this.$dataFilter("Word", qs, this.Code);
      }
      let { Items, Count } = await actions.getBlackWordList(qs);
     
      this.items = Items;
      this.rowCount = Count;
      this.totalCountStr = `共${Count} 筆`;
    },
  },
  async mounted() {
    this.sort(headers[0]);
  },

  watch: {
    currentPageNum(v) {
      this.currentPageNum = v;
      this.getData().catch((e) => {});
    },
    pagingRowPerPage(v) {
      this.getData().catch((e) => {});
    },
    myEditItem(){
        this.getData().catch((e) => {});
    }
   
  },
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
  grid-template-columns: 80px 1fr 160px 180px 180px; //repeat(4, 1fr);
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
