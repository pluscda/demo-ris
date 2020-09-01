<template>
  <section class="dtc-main-section mt-2 mr-2">
    <nav class="dtc-search">
      <AddRoom :hospitals="hospitals"></AddRoom>
      <h4>診間管理:</h4>
      <b-input-group prepend="啟用狀態">
        <b-select :options="status" v-model="type" @change="searchDb"></b-select>
      </b-input-group>
      <b-input-group prepend="診間名稱">
        <b-input v-model.trim="name" placeholder="搜尋診間名稱"></b-input>
      </b-input-group>

      <b-button class="mr-1" variant="primary" @click="searchDb" size="sm">
        <i class="fas fa-search"></i>進行查詢
      </b-button>
      <b-button variant="success" @click="clearSearch" size="sm">
        <i class="fas fa-eraser"></i>清除條件
      </b-button>
      <b-button variant="warning" @click="$bvModal.show('room-added-dtx')" size="sm">
        <i class="fas fa-plus"></i>新增診間
      </b-button>
    </nav>

    <header class="dtc-grid-header my-dark">
      <div>操作</div>
      <div v-for="(item,i) in adminHeaders" :key="i" @click="sort(item);" v-show="!isAdmin">
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
      <div v-for="(item,i) in adminHeaders" :key="i" @click="sort(item);" v-show="isAdmin">
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
      <main class="dtxx-edit">
        <b-button variant="danger" size="sm" class="mr-2" @click="removeRoomById(item)">刪除</b-button>
        <b-check
          switch
          @change="openSystemAccount(item)"
          v-model="item.viewSystem"
          class="mt-2"
          value="1"
        >授權作業</b-check>
        <b-check
          switch
          @change="openRoomSteps(item)"
          v-model="item.viewSteps"
          class="mt-2"
          value="2"
        >檢查項目</b-check>
      </main>
      <b-input v-model.trim="item.Name" maxlength="300" @change="updateRoomName(item)"></b-input>
      <div>{{item.No}}</div>
      <b-select
        :options="hospitals.slice(1,100)"
        v-model="item.InstitutionId"
        v-if2="isAdmin"
        @change="updateRoomName(item)"
      ></b-select>

      <b-check v-model="item.IsActivated" @change="updateRoomStatus(item)"></b-check>
      <div class="my-steps-grid my-light" v-if="item.viewSteps">
        <header>
          <div class="ml-2"></div>
          <div>序號</div>
          <div>檢查項目</div>
        </header>
        <label v-for="step in item.rowsStep" :key="step.value">
          <b-check v-model="step.check" class="ml-2" size="lg" @change="updateStep(step)"></b-check>
          <div class="ml-2">{{step.value}}</div>
          <div>{{step.text}}</div>
        </label>
      </div>
      <div class="view-details my-light" v-if="item.viewSystem">
        <header>
          <div class="ml-2">共{{item.roomItems.length}}筆</div>
          <div>使用者帳號</div>
          <div>醫院名稱</div>
          <div>職稱</div>
        </header>

        <header class="my-filter mb-1">
          <div></div>
          <b-input size="sm" v-model="item.s1" placeholder="搜尋使用者帳號" @change="searchBy(item)"></b-input>
          <b-select size="sm" :options="hospitals" v-model="item.s2" @change="searchBy(item)"></b-select>
          <b-input size="sm" placeholder="搜尋職稱" v-model="item.s3" @change="searchBy(item)"></b-input>
        </header>
        <virtual-list
          v-if="item.roomItems && item.roomItems.length"
          style="height: 360px; overflow-y: auto; background:black;"
          :data-key="'No'"
          :data-sources="item.roomItems"
          :data-component="itemComponent"
        />
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
import Swal from "sweetalert2";
import RoomItem from "./RoomItem.vue";
import VirtualList from "vue-virtual-scroll-list";
import AddRoom from "./AddRoom.vue";

import { store, actions } from "@/store/global.js";
const status = ["全部", "已啟用", "未啟用"];
const adminHeaders = [
  { name: "診間名稱", key: "Name", sortDesc: null },
  { name: "診間編號", key: "No", sortDesc: null },
  { name: "醫院名稱", key: "InstitutionId", sortDesc: null },
  { name: "啟用狀態", key: "IsActivated", sortDesc: null }
];

const rows = [10, 20, 50];
export default {
  name: "RoomDtc",
  data() {
    return {
      hot: null,
      itemComponent: RoomItem,
      adminHeaders,
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
      name: "",
      hospitals: [],
      listSteps: [],
      isAdmin: isNaN(sessionStorage.InstitutionId)
    };
  },
  components: { "virtual-list": VirtualList, RoomItem, AddRoom },
  computed: {
    accountUpdated() {
      return store.accountUpdated;
    }
  },
  methods: {
    async removeRoomById(item) {
      await window.axios.delete("api/Room/" + item.Id);
      this.getData();
    },
    async updateStep(step) {
      requestAnimationFrame(async () => {
        try {
          if (step.check) await actions.addRoomNum(step.id, step.value);
          else await actions.removeRoomNum(step.id, step.value);
        } catch (e) {
          alert(e);
        }
      });
    },
    updateCheckBox(item, row) {
      //once tigger , it will send out AJAX at once
      //let obj = { Name: item.Name, No: row.No, IsActivated: row.IsActivated };
      requestAnimationFrame(async () => {
        try {
          if (row.IsActivated) await actions.addRole(item.No, row.No);
          else await actions.removeRole(item.No, row.No);
        } catch (e) {
          alert(e);
        }
      });
    },
    async updateRoomName(item) {
      try {
        await actions.updateRoom(item);
        this.$bvToast.toast(`更新成功`, {
          title: "診間管理",
          autoHideDelay: 5000,
          variant: "success"
        });
      } catch (e) {
        this.$bvToast.toast(`` + e, {
          title: "診間管理",
          autoHideDelay: 5000,
          variant: "danger"
        });
      }
    },
    async updateRoomStatus(item) {
      try {
        await actions.updateRoom(item);
        this.$bvToast.toast(`啟用狀態更新成功`, {
          title: "診間管理",
          autoHideDelay: 5000,
          variant: "success"
        });
      } catch (e) {
        this.$bvToast.toast(`啟用狀態更新失敗`, {
          title: "診間管理",
          autoHideDelay: 5000,
          variant: "danger"
        });
      }
    },
    async openRoomSteps(item) {
      //step1 : get steps below in this room
      const steps = await actions.getRoomNums(item.Id);
      //step2: update the steps list
      const rowsStep = this.listSteps.map(s => {
        return {
          ...s,
          check: steps.find(t => t == s.value) ? true : false,
          id: item.Id
        };
      });
      item.rowsStep = [...rowsStep];
      item.viewSystem = false;
      //Step3 trigger MVC
      this.items = [...this.items];
    },
    async openSystemAccount(item) {
      //?$inlinecount=allpages
      try {
        //step1: get all user
        const { Items } = await actions.getUserAccount(
          "?$inlinecount=allpages"
        );
        //Step2: get user that below to this room id
        // Nos will be like: ['abc', 'efg']
        const NOs = await actions.getDoctorNumListByRoomId(item.Id);
        //Step3. update hasRoom for each user
        Items.forEach(s => {
          {
            s.hasRoom = NOs.find(t => t == s.No) ? true : false;
            s.roomId = item.Id;
          }
        });
        item.roomItems = [...Items];
        item.holders = [...Items];
        item.viewSteps = false;

        //Step4 trigger MVC
        this.items = [...this.items];
      } catch (e) {
        alert(e);
      }
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
    sort(item) {
      if (item.sortDesc) {
        item.sortDesc = null;
      } else if (false === item.sortDesc) {
        item.sortDesc = true;
      } else if (null === item.sortDesc) {
        item.sortDesc = false;
      }
      this.orderBy = [];
      this.adminHeaders.forEach(s => {
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
      this.name = "";
      this.type = "全部";
      this.getData();
    },
    async getData() {
      //odata3 qs
      const page = this.currentPageNum;
      const skip = (page - 1) * this.pagingRowPerPage;
      const top = this.pagingRowPerPage;
      const orderBy = this.orderBy;
      //alert(orderBy.length)
      const obj = orderBy.length ? { top, skip, orderBy } : { top, skip };
      let qs = buildQuery(obj); // + no + filter + filter2;
      //`&$filter=substringof('${lower}',tolower(Replacement)) eq true`
      if (this.search && this.name) {
        qs = this.$dataFilter("Name", qs, this.name);
      }

      if (this.search && this.type != "全部") {
        if (!this.name) {
          this.type == "已啟用"
            ? (qs += `&$filter=IsActivated eq true`)
            : (qs += `&$filter=IsActivated eq false`);
        } else {
          this.type == "已啟用"
            ? (qs += ` and IsActivated eq true`)
            : (qs += ` and IsActivated eq false`);
        }
      }
      const { Items, Count } = await actions.getRoomList(qs);
      this.items = Items;
      this.rowCount = Count;
      this.totalCountStr = `共${Count} 筆`;
    },

    async getDDL() {
      const { Items } = await actions.getHospitalList();
      this.hospitals = Items.map(s => ({
        value: s.Id,
        text: s.Name
      }));
      this.hospitals.unshift({ value: null, text: "全部" });
      const { Items: list } = await actions.getSteps();
      this.listSteps = list.map(s => ({
        value: s.Serial,
        text: s.Name
      }));
    },
    searchBy(item) {
      item.roomItems = [...item.holders];
      if (!item.s1 && !item.s2 && !item.s3) {
        this.items = [...this.items];
        rerturn;
      }
      if (item.s1) {
        // by No
        item.roomItems = item.roomItems.filter(s => s.No.includes(item.s1));
      }

      if (item.s2) {
        item.roomItems = item.roomItems.filter(s => s.InstitutionId == item.s2);
      }

      if (item.s3) {
        item.roomItems = item.roomItems.filter(
          s => s.Title && s.Title.includes(item.s3)
        );
      }
      this.items = [...this.items];
    }
  },
  async mounted() {
    this.getDDL();
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
  grid-template-columns: 320px 220px 120px 1fr 120px;
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
  grid-template-columns: max-content max-content max-content;
  grid-gap: 1rem;
  padding-left: 1rem;
}

.view-details,
.my-steps-grid {
  grid-column: 1 / -1;
  display: grid;
  background: black;
  color: white;
  min-height: 400px;
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
    grid-template-columns: 90px repeat(3, 1fr);
    background: var(--gray);
  }
  label,
  main {
    border: none;
    border-bottom: 1px solid white;
    background: var(--dark);
    cursor: pointer;
  }
  .my-filter {
    border: 1px solid black;
  }
}
.my-steps-grid {
  header,
  label {
    display: grid;
    border: 1px solid white;
    border-top: none;
    grid-template-columns: 90px 120px 1fr;
    background: var(--gray);
  }
  label {
    border: none;
    border-bottom: 1px solid white;
    background: var(--dark);
    cursor: pointer;
  }
}
</style>
