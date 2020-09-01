<template>
  <section class="dtc-main-section">
    <nav class="dtc-popme dtc-small-pop" v-if="stampOk">
      <div>
        <img src="success_green.svg" />
        <main>
          <div style="font-size:24px;">簽章成功！</div>
          <div
            class="ok-btn"
            @click="stampOk = false"
            style="transform:translateY(20px);cursor:pointer;"
          >確認</div>
        </main>
      </div>
    </nav>

    <nav class="dtc-popme" v-if="noCard">
      <div>
        <header>
          <img src="warning.svg" />
        </header>
        <main>
          <h5 class="pt-3">請先插入醫事人員卡</h5>
          <div class="mt-3" @click="noCard = false">確定</div>
        </main>
      </div>
    </nav>

    <nav class="dtc-popme card-ok" v-if="cardOk">
      <div>
        <header>
          <img src="success_green.svg" />
          <span style="display:inline-block;font-size:24px;transform:translateY(12px)">卡片確認成功</span>
        </header>
        <main>
          <h5 class="pt-3">請執行簽章作業</h5>
          <div class="mt-3" @click="cardOk = false" style="background:#2E8301;">確定</div>
        </main>
      </div>
    </nav>

    <nav class="dtc-popme" v-if="cardError">
      <div>
        <header>
          <img src="error.svg" />
          <span style="display:inline-block;font-size:24px;transform:translateY(12px)">卡片確認失敗</span>
        </header>
        <main>
          <h5 class="pt-3">錯誤原因：API ERROR</h5>
          <div class="mt-3" @click="cardError = false">確定</div>
        </main>
      </div>
    </nav>

    <nav class="dtc-popme verifycard" v-if="stamping">
      <div>
        <h6 style="text-align:center;color:#10579B;font-size:26px;">
          簽章中
          <h6
            style="text-align:center;color:#10579B;font-size:26px;margin-left:20px; margin-top:10px;"
          >
            請稍候
            <b-spinner type="grow" label="Spinning" class="mr-2"></b-spinner>
            <b-spinner type="grow" label="Spinning" class="mr-2"></b-spinner>
            <b-spinner type="grow" label="Spinning"></b-spinner>
          </h6>
        </h6>
      </div>
    </nav>

    <nav class="dtc-popme verifycard" v-if="verifyCard">
      <div>
        <h6 style="text-align:center;color:#10579B;font-size:26px;">
          卡片認證中
          <h6
            style="text-align:center;color:#10579B;font-size:26px;margin-left:20px; margin-top:10px;"
          >
            請稍候
            <b-spinner type="grow" label="Spinning" class="mr-2"></b-spinner>
            <b-spinner type="grow" label="Spinning" class="mr-2"></b-spinner>
            <b-spinner type="grow" label="Spinning"></b-spinner>
          </h6>
        </h6>
      </div>
    </nav>

    <nav class="dtc-popme passwd" v-if="noPass">
      <div>
        <header>輸入密碼</header>
        <main>
          <b-input type="password" autofocus="true" placeholder="請輸入您的密碼"></b-input>
          <div class="mt-3 my-btns">
            <div @click="noPass = false">確定</div>
            <div @click="noPass = false">取消</div>
          </div>
        </main>
      </div>
    </nav>
    <header class="ask-header">簽章作業</header>
    <div class="dtc-search">
      <main class="left-header">
        <b-input-group prepend="項次">
          <b-select></b-select>
        </b-input-group>
        <b-input-group prepend="身份證號">
          <b-input v-model.trim="id" :autofocus="autofocus" placeholder="身份證號"></b-input>
        </b-input-group>

        <b-input-group prepend="役男姓名">
          <b-input v-model.trim="name" placeholder="搜尋姓名"></b-input>
        </b-input-group>
        <b-input-group prepend="體檢完成場次">
          <b-select></b-select>
        </b-input-group>

        <b-input-group prepend="體檢完成日期">
          <b-input type="date" size="md"></b-input>
          <div style="color:black;line-height:39px;margin-left:2px;margin-right:2px;">至</div>
          <b-input type="date" size="md"></b-input>
        </b-input-group>

        <b-button class variant="light" @click="searchDb" size="sm">
          <i class="fas fa-search"></i>進行查詢
        </b-button>
        <b-button variant="info" @click="clearSearch" size="sm">
          <i class="fas fa-eraser"></i>清除條件
        </b-button>
      </main>
    </div>
    <nav class="actions-btns">
      <b-button class variant="light" @click="noPass = true" size="sm">執行簽章</b-button>
      <b-button variant="info" @click="noCard = true" size="sm">醫事卡片認證</b-button>
      <div class="mt-1">(執行簽章前請先確認醫事卡片)</div>
    </nav>
    <header class="dtc-grid-header my-dark">
      <div>查詢</div>
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
        <b-button variant="success" size="sm" @click="edit(item)">查詢</b-button>
      </div>
      <div>{{ item.IdNo }}</div>
      <div>{{ item.BatchId }}</div>
      <div>{{ item.Name }}</div>
      <div>{{ item.ExamDate.split("T")[0] }}</div>
      <div>{{ item.Birthday ? item.Birthday.split("T")[0] : "" }}</div>
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
  </section>
</template>

<script>
import queryString from "query-string";
import buildQuery from "odata-query";
import { store, actions } from "@/store/global.js";
import { webSocket } from "rxjs/webSocket";
import {Observable} from "rxjs"
import { map, tap, retryWhen,delay } from 'rxjs/operators';

// NOTE: the nodejs websocket server demo code at this project's public , ws.js; to start it run: node ws.js
const WS_URL = 'ws://localhost:7777';

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
const sizes = ["全部", "常備役", "替代役", "免役"];

const headers = [
  { name: "役男身分證號", key: "Name", sortDesc: null },
  { name: "檢查場次", key: "Name", sortDesc: null },
  { name: "體檢醫院", key: "Name", sortDesc: null },
  { name: "體檢日期", key: "IdNo", sortDesc: null },
  { name: "結果登入者", key: "Birthday", sortDesc: null },
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
  name: "totalSpend8",
  data() {
    return {
      //subject : webSocket("ws://localhost:8081"),
      stampOk: false,
      stamping: false,
      cardOk: false,
      cardError: false,
      verifyCard: false,
      noPass: false,
      noCard: false,
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
      wheres: [{ value: null, text: "全部" }],
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
      sizes,
      size: "全部",
      startDate: "",
      endDate: "",
      startTime,
      endTime,
      orderBy: [],
    };
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
        const { Items: list } = await window.axios.get("countryidentity/CountryIdentityList");
        this.countries = list.map((s) => ({
          value: s.SeqNo,
          text: s.CountryIdentityName,
        }));
        this.countries.unshift({ value: null, text: "全部" });
      }
    },
    async edit(item) {
      // get personal info
      store.editItem = await actions.getInfoById(item.IdNo);
      if (sessionStorage.role == "ServiceManager") {
        this.$router.push("serviceDetails");
      } else {
        this.$router.push("details");
      }
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

      const { Items, Count } = await actions.getTodayList(qs);
      // const { Items, Count } = await window.axios.get(
      //   "api/Military" + qs + str
      // );
      Items.length ? (this.keys = Object.keys(Items[0])) : "";
      //alert(this.keys.length);
      this.items = Items;
      this.rowCount = Count;
      this.totalCountStr = `共${Count} 筆`;
    },
    createWebSocket(uri){
      //ref:https://itnext.io/websocket-error-handling-with-rxjs-17125c6f2159
     return Observable.create(observer => {
        try {
            const subject = webSocket(uri);
            // test it only
            const handler = setInterval(() => {
              subject.next('hi there');
            }, 1000);

            const subscription = subject.asObservable()
              .subscribe(data => 
                        observer.next(data), // Called whenever there is a message from the server.
                        error => observer.error(error), // Called if at any point WebSocket API signals some kind of error.
                        () => observer.complete() // Called when connection is closed (for whatever reason).
               );

            return () => {
              // test it only
              clearInterval(handler);
              if (!subscription.closed) {
                subscription.unsubscribe();
              }
            };
        } catch (error) {
          observer.error(error);
        }
        });
    }
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
    // this.createWebSocket(WS_URL)
    //   .pipe(
    //     retryWhen(errors =>
    //       errors.pipe(
    //         tap(err => {
    //           console.error('Got error', err);
    //         }),
    //         delay(1000)
    //       )
    //     )
    //   )
    //   .subscribe(data => console.log(data), err => console.error(err));
  },

  watch: {
    currentPageNum(v) {
      this.currentPageNum = v;
      this.getData().catch((e) => {});
    },
    pagingRowPerPage(v) {
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
  grid-template-columns: 60px repeat(5, 1fr);
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
  grid-template-columns: 1535px 1fr max-content 10px;
  grid-gap: 1rem;
  padding-left: 10px;
  .left-header {
    display: grid;
    grid-template-columns: repeat(4, 1fr) max-content max-content max-content;
    grid-template-rows: 40px;
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

.actions-btns {
  margin-left: 1rem;
  display: grid;
  grid-template-columns: max-content max-content max-content;
  gap: 10px;
  margin-bottom: 10px;
  color: black;
}

.verifycard {
  > div {
    display: grid;
    place-items: center;
    padding-top: 49px;
  }
}

.dtc-popme {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  z-index: 99999;
  background: rgba(#000, 0.8);
  place-items: center;
  > div {
    width: 410px;
    height: 234px;
    display: grid;
    grid-template-rows: 93px 1fr;
    background: white;
    header {
      background: #dd6060;
      text-align: center;
      img {
        display: inline-block;
        width: 68px;
        height: 61px;
        margin-top: 14px;
      }
    }
    main {
      display: grid;
      place-items: center;
      color: black;
      > div:last-child {
        cursor: pointer;
        width: 128px;
        height: 43px;
        border-radius: 23px;
        background: #dd6060;
        text-align: center;
        line-height: 43px;
        color: white;
      }
    }
  }
}

.card-ok {
  header {
    background: #2e8301 !important;
  }
}

.passwd {
  header {
    background: #1f7cd3 !important;
    color: white;
    font-size: 24px;
    line-height: 88px;
  }
  main {
    input {
      margin-top: 20px;
      max-width: 250px;
    }
    .my-btns {
      display: grid;
      grid-template-columns: repeat(2, max-content);
      gap: 10px;
      transform: translateX(-60px);
      > div {
        cursor: pointer;
        color: white;
        background: #a0a0a0;
        width: 128px;
        height: 43px;
        border-radius: 23px;
      }
      > div:first-child {
        background: #1f7cd3;
      }
    }
  }
}

.dtc-small-pop {
  > div {
    position: relative;
    width: 282px;
    height: 165px;
    padding-top: 40px;
    border-radius: 10px;
  }
  img {
    position: absolute;
    top: -60px;
    left: 50%;
    transform: translateX(-50%);
  }
  .ok-btn {
    background: #369b01 !important;
    width: 266px !important;
    height: 43px !important;
    border-radius: 5px !important;
  }
}
</style>
