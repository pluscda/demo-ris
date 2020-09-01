<template>
  <section class="dtc-main-section mt-2 mr-2">
    <nav class="dtc-search">
      <h4>帳號管理:</h4>
      <b-input-group prepend="帳號狀態">
        <b-select :options="accountStatus" v-model="status" @change="searchDb"></b-select>
      </b-input-group>
      <b-input-group prepend="醫院名稱" v-if="isAdmin">
        <b-select :options="hospitals2" v-model="hot" @change="searchDb"></b-select>
      </b-input-group>

      <b-input-group prepend="使用者帳號">
        <b-input v-model.trim="account" placeholder="搜尋使用者帳號"></b-input>
      </b-input-group>

      <b-button class="mr-1" variant="primary" @click="searchDb" size="sm">
        <i class="fas fa-search"></i>進行查詢
      </b-button>
      <b-button variant="success" @click="clearSearch" size="sm">
        <i class="fas fa-eraser"></i>清除條件
      </b-button>
      <b-button variant="warning" size="sm" @click="$bvModal.show('add-account-dtx')">
        <i class="fas fa-plus"></i>新增帳號
      </b-button>
    </nav>

    <header class="dtc-grid-header my-dark">
      <div>操作</div>
      <div v-for="(item,i) in headers" :key="i" @click="sort(item);">
        {{item.name}}
        <span v-show="item.sortDesc === null" v-if="item.key != 'RoleNames'">
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
    <main
      class="dtc-grid-header main-dtc-body"
      v-for="(item,i) in items"
      :key="i"
      style="color:black;"
      :style="i % 2 == 0 ? 'background-color: #F5F5F5;':'background-color: #E0E0E0;'"
    >
      <div style="dtxx-edit">
        <b-button variant="danger" size="sm" @click="updatePwd(item)" class="mr-2">重置密碼</b-button>
        <b-button variant="success" size="sm" @click="edit(item)" class="mr-2">編輯帳號</b-button>
        <b-button variant="warning" size="sm" @click="editStamp(item)" class="mr-2">簽章管理</b-button>
      </div>
      <div>{{ hospitals.length ? hospitals.find(s => s.value == item.InstitutionId).text :''}}</div>
      <div>{{ item.No}}</div>
      <div>{{ item.Name}}</div>
      <div>{{ item.Title}}</div>
      <div>{{ accountStatus.find( s => s.value == item.Status).text}}</div>
      <div>{{ item.RoleNames}}</div>
      <div>{{ item.Email}}</div>
      <div>{{ item.Expiration ? item.Expiration.split("T")[0] : ''}}</div>
      <div>{{ item.CreateTime ? item.CreateTime.split("T")[0] : ''}}</div>
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
    <EditAccount :roles="roles" :accountStatus="accountStatus" :hospitals="hospitals2"></EditAccount>
    <AddAccount :roles="roles" :accountStatus="accountStatus" :hospitals="hospitals2"></AddAccount>
    <AddStamp :roles="roles" :accountStatus="accountStatus" :hospitals="hospitals2"></AddStamp>
  </section>
</template>

<script>
import queryString from "query-string";
import buildQuery from "odata-query";
import Swal from "sweetalert2";
import EditAccount from "./EditAccount.vue";
import AddAccount from "./AddAccount.vue";
import AddStamp from "./AddStamp.vue";
import { store, actions } from "@/store/global.js";

const sizes = ["全部", "常備役", "替代役", "免役"];
const headers = [
  { name: "醫院名稱", key: "InstitutionId", sortDesc: null },
  { name: "使用者帳號", key: "No", sortDesc: null },
  { name: "帳號姓名", key: "Name", sortDesc: null },
  { name: "職稱", key: "Title", sortDesc: null },
  { name: "帳號狀態", key: "Status", sortDesc: null },
  { name: "授權角色", key: "RoleNames", sortDesc: null },
  { name: "郵件信箱", key: "Email", sortDesc: null },
  { name: "帳號有效日期", key: "Expiration", sortDesc: null },
  { name: "帳號建立日期", key: "CreateTime", sortDesc: null }
];

//hospitals.find(s => s.InstitutionId == item.InstitutionId).text;

const startTime = `${years[1] + 1911}-01-01`;
const endTime = `${years[1] + 1911}-12-31`;

const zero = "T00:00:00";
const rows = [10, 20, 50];

export default {
  name: "ACcount",
  data() {
    return {
      isAdmin: isNaN(sessionStorage.InstitutionId),
      hot: null,
      headers,
      items: [],
      currentPageNum: 1,
      rowCount: 0,
      pagingRowPerPage: 20,
      search: false,
      rows,
      totalCountStr: "",
      editItem: "",
      sortDesc: true,
      orderBy: [],
      accountStatus: [],
      status: null,
      hospitals: [],
      hospitals2: [],
      account: "",
      roles: []
    };
  },
  components: { EditAccount, AddAccount , AddStamp},

  computed: {
    accountUpdated() {
      return store.accountUpdated;
    }
  },
  methods: {
    async editRow() {
      const obj = {
        No: this.editItem.No,
        CheckReg: this.mode,
        CheckRegUser: sessionStorage.Account,
        CheckRegNote: this.note
      };
      try {
        await window.axios.post("real_studentModels/studentRegPut", obj);
        this.$bvToast.toast(`修改成功`, {
          title: "系統資訊",
          autoHideDelay: 5000,
          variant: "success"
        });
        this.getData();
        this.showEdit = false;
      } catch (e) {
        alert(e);
      }
    },
    async resetPwd() {
      //await window.axios.get();
      this.$bvToast.toast(`重置密碼成功`, {
        title: "系統資訊",
        autoHideDelay: 5000,
        variant: "success"
      });
    },
    sort(item) {
      if (item.key == "RoleNames") return;
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
      //alert(JSON.stringify(this.orderBy));
      this.getData();
    },
    edit(item) {
      store.editItem = item;
      this.$bvModal.show("edit-account-dtx");
    },
    editStamp(item){
      store.editItem = item;
      this.$bvModal.show("stamp-added-dtx");
    },
    async del(item) {
      const result = await Swal.fire({
        title: "是否刪除帳號？",
        html: `刪除帳號`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "確定",
        cancelButtonText: "取消"
      });
      if (!result.value) return;
      await axios.delete("api/Account/" + item.Id);
      this.getData();
    },
    async updatePwd(item) {
      //this.$router.push("details");
      const result = await Swal.fire({
        title: "是否重置密碼？",
        html: `密碼將重置為：<b>${item.No}</b>`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "確定",
        cancelButtonText: "取消"
      });
      if (result.value) this.resetPwd();
    },
    async viewPdf(item) {
      window.open(item.Src);
    },
    searchDb() {
      this.search = true;
      this.getData();
    },
    async clearSearch() {
      this.account = this.hot = this.status = null;
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
      let qs = buildQuery(obj);
      if (this.search && this.status != null) {
        qs += `&$filter=Status eq '${this.status}'`;
      }

      if (this.search && this.hot != null) {
        this.status == null
          ? (qs += `&$filter=InstitutionId eq ${this.hot}`)
          : (qs += ` and InstitutionId eq ${this.hot}`);
      }
      if (this.search && this.account) {
        if (this.status == null && this.hot == null) {
          qs = this.$dataFilter("No", qs, this.account);
        } else {
          qs = this.$appendFilter("No", qs, this.account);
        }
      }

      const { Items, Count } = await actions.getAccountList(qs);
      this.items = Items;
      this.rowCount = Count;
      this.totalCountStr = `共${Count} 筆`;
    },

    async getDDL() {
      try {
        const { Items } = await actions.getHospitalList();
        this.hospitals = Items.map(s => ({
          value: s.Id,
          text: s.Name
        }));
        this.hospitals2 = [...this.hospitals];
        this.hospitals2.unshift({ value: null, text: "全部" });
        this.hospitals.unshift({ value: null, text: "" });
        this.accountStatus = (await actions.getAccountStatus()).map(s => ({
          value: s.Id,
          text: s.Name
        }));
        this.accountStatus.unshift({ value: null, text: "全部" });
        this.judgeStatus = (await actions.getJudgeStatus()).map(s => ({
          value: s.Id,
          text: s.Name
        }));
        this.examStatus = (await actions.getExamStatus()).map(s => ({
          value: s.Id,
          text: s.Name
        }));

        this.roles = (await actions.getRoleList("?$top=10000")).Items.map(
          s => ({
            value: s.No,
            text: s.Name
          })
        );
      } catch (e) {
        alert(e);
      }
    }
  },
  async mounted() {
    try {
      await this.getDDL();
    } catch (e) {
      alert("account get instintation API: " + e);
    }
    this.getData();
  },

  watch: {
    currentPageNum(v) {
      this.currentPageNum = v;
      this.getData().catch(e => {});
    },
    pagingRowPerPage(v) {
      this.getData().catch(e => {});
    },
    accountUpdated() {
      this.getData().catch(e => {});
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "sweetalert2/src/sweetalert2.scss";
.dtc-main-section {
  overflow-x: auto;
  padding: 12px;
  position: relative;
}
.dtc-grid-header {
  display: grid;
  grid-template-columns: 260px 260px repeat(8, 1fr);
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

.dtxx-edit {
  display: grid;
  grid-template-columns: max-content max-content max-content;
  grid-gap: 1rem;
}
</style>
