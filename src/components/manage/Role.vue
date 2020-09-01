<template>
  <section class="dtc-main-section mt-2 mr-2">
    <AddRole></AddRole>
    <nav class="dtc-search">
      <h4>權限管理:</h4>
      <b-input-group prepend="角色代碼">
        <b-input v-model.trim="roleCode" placeholder="搜尋角色代碼"></b-input>
      </b-input-group>

      <b-input-group prepend="角色名稱">
        <b-input v-model.trim="roleName" placeholder="搜尋角色名稱"></b-input>
      </b-input-group>
      <b-input-group prepend="啟用狀態">
        <b-select :options="status" v-model="type" @change="searchDb"></b-select>
      </b-input-group>
      <b-button class="mr-1" variant="primary" @click="searchDb" size="sm">
        <i class="fas fa-search"></i>進行查詢
      </b-button>
      <b-button variant="success" @click="clearSearch" size="sm">
        <i class="fas fa-eraser"></i>清除條件
      </b-button>
      <b-button variant="warning" @click="addRole" size="sm">
        <i class="fas fa-plus"></i>新增角色
      </b-button>
    </nav>

    <header class="dtc-grid-header my-dark">
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
    <main
      class="dtc-grid-header main-dtc-body"
      v-for="(item,i) in items"
      :key="i"
      style="color:black;"
      :style="i % 2 == 0 ? 'background-color: #F5F5F5;':'background-color: #E0E0E0;'"
    >
      <main class="dtxx-edit" style="border-right:1px solid white;">
        <b-button variant="danger" size="sm" class="mr-2" @click="delRole(item)" hidden>刪除</b-button>
        <b-check
          switch
          @change="openSystemAccount(item)"
          v-model="item.viewSystem"
          class="mt-2"
        >授權作業</b-check>
      </main>
      <div>{{ item.No}}</div>
      <b-input v-model="item.Name" @change="updateRoleName(item)"></b-input>
      <b-check v-model="item.IsActivated" @change="updateRoleStatus(item)"></b-check>
      <div>{{ item.CreateTime.split('T')[0]}}</div>

      <div class="view-details my-light" v-if="item.viewSystem">
        <header>
          <!-- <b-check class="ml-2" size="lg" @change="viewSystemChange(item)" v-model="allChekced"></b-check> -->
          <div></div>
          <div>授權作業代碼</div>
          <div>授權作業名稱</div>
        </header>
        <label v-for="(row,rowId) in item.rows" :key="rowId">
          <b-check
            v-model="row.IsActivated"
            class="ml-2"
            size="lg"
            @change="updateCheckBox(item, row)"
          ></b-check>
          <div>{{row.No}}</div>
          <div>{{row.Name}}</div>
        </label>
      </div>
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
//授權作業代碼 //授權作業名稱
import queryString from "query-string";
import buildQuery from "odata-query";
import AddRole from "./AddRole.vue";
import Swal from "sweetalert2";

import { store, actions } from "@/store/global.js";
const status = ["全部", "已啟用", "未啟用"];

const headers = [
  { name: "角色代碼", key: "No", sortDesc: null },
  { name: "角色名稱", key: "Name", sortDesc: null },
  { name: "啟用狀態", key: "IsActivated", sortDesc: null },
  { name: "創建時間", key: "CreateTime", sortDesc: null }
];

const rows = [10, 20, 50];
export default {
  name: "RoleDtc",
  data() {
    return {
      headers,
      items: [],
      currentPageNum: 1,
      rowCount: 0,
      pagingRowPerPage: 20,
      search: false,
      rows,
      totalCountStr: "",
      editItem: "",
      status,
      orderBy: [],
      type: "全部",
      allChekced: false,
      roleName: "",
      roleCode: ""
    };
  },
  components: { AddRole },
  computed: {
    accountUpdated() {
      return store.accountUpdated;
    }
  },
  methods: {
    async delRole(item) {
      await actions.deleteRole(item.Id);
      this.getData();
    },
    addRole() {
      this.$bvModal.show("role-added-dtx");
    },
    updateCheckBox(item, row) {
      //once tigger , it will send out AJAX at once
      let obj = { functionNo: row.No, roleNo: item.No };
      const qs = queryString.stringify(obj);
      //alert(qs);
      requestAnimationFrame(async () => {
        if (row.IsActivated) await actions.addRoleFunction(qs);
        else await actions.removeRoleFunction(qs);
      });
    },
    async updateRoleName(item) {
      try {
        await actions.updateRole(item);
        this.$bvToast.toast(`角色名稱更新成功`, {
          title: "權限管理",
          autoHideDelay: 5000,
          variant: "success"
        });
      } catch (e) {
        this.$bvToast.toast(`角色名稱更新失敗`, {
          title: "權限管理",
          autoHideDelay: 5000,
          variant: "danger"
        });
      }
    },
    async updateRoleStatus(item) {
      try {
        await actions.updateRole(item);
        this.$bvToast.toast(`啟用狀態更新成功`, {
          title: "權限管理",
          autoHideDelay: 5000,
          variant: "success"
        });
      } catch (e) {
        this.$bvToast.toast(`啟用狀態更新失敗`, {
          title: "權限管理",
          autoHideDelay: 5000,
          variant: "danger"
        });
      }
    },
    async openSystemAccount(item) {
      try {
        //step1: get all functions list
        const { Items } = await actions.getFunctions();
        //Step2: get all selected functions NO for this 角色代碼
        // Nos will be like: ['abc', 'efg']
        const NOs = await actions.getRoleNos(item.No);
        //Step3: find all selected function NO 's name
        item.rows = Items.filter(s => NOs.find(t => t == s.No));
        //Step4: turn the IsActivated = true
        item.rows.forEach(s => (s.IsActivated = true));
        //Step5: find not selected list
        const notCheckedList = Items.filter(s => !NOs.find(t => t == s.No));
        //Step6: select item's IsActivated to false
        notCheckedList.forEach(s => (s.IsActivated = false));
        //Step7: merge 2 lists : selected and not selected list into one
        item.rows = [...item.rows, ...notCheckedList];
        item.rows.sort((a, b) => a.No.localeCompare(b.No));
        //alert(JSON.stringify(item.rows));
      } catch (e) {
        alert(e);
      }
      this.items = [...this.items];
    },
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
      //alert();
      this.$bvModal.show("edit-account-dtx");
    },

    searchDb() {
      this.search = true;
      this.getData();
    },
    async clearSearch() {
      this.search = false;
      this.roleName = "";
      this.roleCode = "";
      this.type = "全部";
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
      //`&$filter=substringof('${lower}',tolower(Replacement)) eq true`
      if (this.search && this.roleName) {
        qs = this.$dataFilter("Name", qs, this.roleName);
      }

      if (this.search && this.roleCode) {
        const lower = this.roleCode.toLowerCase();
        if (!this.roleName) {
          qs = this.$dataFilter("No", qs, this.roleCode);
        } else {
          qs = this.$appendFilter("No", qs, this.roleCode);
        }
      }
      if (this.search && this.type != "全部") {
        if (!this.roleName && !this.roleCode) {
          this.type == "已啟用"
            ? (qs += `&$filter=IsActivated eq true`)
            : (qs += `&$filter=IsActivated eq false`);
        } else {
          this.type == "已啟用"
            ? (qs += ` and IsActivated eq true`)
            : (qs += ` and IsActivated eq false`);
        }
      }
      const { Items, Count } = await actions.getRoleList(qs);
      this.items = Items;
      this.rowCount = Count;
      this.totalCountStr = `共${Count} 筆`;
    },
    async bingoSearch() {
      await window.axios.get("/bingo/Search?keyword=" + "abc");
    },
    async getDDL() {
      await actions.getRoleList();
      await actions.getHospitalList();
    }
  },
  async mounted() {
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
  grid-template-columns: 140px repeat(4, 1fr);
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
.my-light {
  > div {
    background: var(--light);
    color: black;
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
    //line-height: 24px;
  }
}
.input-group-text {
  color: white;
  background: #757575;
}

main.dtxx-edit {
  display: grid;
  grid-template-columns: max-content max-content;
  grid-gap: 1rem;
  padding-left: 1rem;
}

.view-details {
  grid-column: 1 / -1;
  display: grid;
  background: black;
  color: white;
  min-height: 200px;
  font-size: 16px;
  margin: 10px;
  border-radius: 0px;
  text-align: left;
  line-height: 30px;
  label {
    all: unset;
  }
  header,
  main,
  label {
    display: grid;
    border: 1px solid white;
    border-top: none;
    grid-template-columns: 90px 300px 1fr;
    background: var(--gray);
  }
  label,
  main {
    border: none;
    border-bottom: 1px solid white;
    background: var(--dark);
    cursor: pointer;
  }
}
</style>
