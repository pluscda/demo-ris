<template>
  <div style="position:sticky;top:0;z-index:1;">
    <b-navbar type="dark" class="dtc-bg" toggleable="lg">
      <b-navbar-brand
        @click="
          tab = 1;
          $router.push('home');
        "
        style="curosr:pointer"
      >
        <img :src="imgs[1]" class="dtx-title-img" style="cursor:pointer;" />
      </b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-4">
          <b-nav-item
            :active="tab === 1"
            v-on:click="tab = 1"
            @click="
              tab = 1;
              $router.push('home');
            "
          >首頁</b-nav-item>
          <b-nav-item @click="$router.push('finalResult')" hidden>役男體格檢查表</b-nav-item>

          <b-nav-item-dropdown text="體檢醫院" v-if="!serviceManager && !distinctRole">
            <b-dropdown-item
              v-if="masterRole"
              href="#"
              @click="$router.push('tracelist?masterEdiable_dtc=true')"
            >總醫師清冊查詢</b-dropdown-item>
            <b-dropdown-item href="#" @click="$router.push('tracelist')">體檢結果登錄</b-dropdown-item>
            <b-dropdown-item href="#" @click="$router.push('historylist')">役男清冊查詢</b-dropdown-item>
            <b-dropdown-item href="#" @click="$router.push('upload')">體檢檢驗報告上傳</b-dropdown-item>
            <b-dropdown-item href="#" @click="$router.push('phraselist')">系統片語維護</b-dropdown-item>
            <b-dropdown-item href="#" @click="$router.push('stamp')">簽章作業</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item-dropdown text="區公所" v-if="distinctRole">
            <b-dropdown-item href="#" @click="$router.push('enrolllist')">役男報到作業</b-dropdown-item>
            <b-dropdown-item href="#" @click="$router.push('editlist')">役男資料編輯</b-dropdown-item>
            <b-dropdown-item href="#" @click="$router.push('districtlist')">役男清冊查詢</b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item-dropdown text="兵役局" v-if="serviceManager">
            <b-dropdown-item href="#">判定體位</b-dropdown-item>
            <b-dropdown-item href="#" @click="$router.push('historylist')">役男清冊查詢</b-dropdown-item>
            <b-dropdown-item href="#" @click="$router.push('servicelist')">收件檢核作業</b-dropdown-item>
            <b-dropdown-item href="#" @click="$router.push('phraselist?service=true')">系統片語維護</b-dropdown-item>
            <!-- <b-dropdown-item href="#">黑名單用語維護</b-dropdown-item> -->
            <b-dropdown-item href="#" @click="$router.push('blacklist')">黑名單用語維護</b-dropdown-item>
            <b-dropdown-item href="#">統計報表</b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item-dropdown text="設定" v-if="viewSettingMenu == 'YES'">
            <b-dropdown-item href="#" @click="$router.push('account')">帳號管理</b-dropdown-item>
            <b-dropdown-item href="#" @click="$router.push('room')">診間管理</b-dropdown-item>
            <b-dropdown-item href="#" @click="$router.push('role')">權限管理</b-dropdown-item>
            <b-dropdown-item href="#">稽核管理</b-dropdown-item>
            <b-dropdown-item href="#">組織維護</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <div class="login-name">Welcome {{ name }}</div>
          <div class="bar-icon" id="popover-3" style="color:black;">
            <i class="fas fa-ellipsis-h"></i>
          </div>
          <b-popover target="popover-3" triggers="click" :placement="placement">
            <b-button size="sm" variant="danger" @click="logout">登出</b-button>
            <b-button size="sm" variant="success" class="ml-2" @click="changePwd">更改密碼</b-button>
          </b-popover>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <ChangePwd></ChangePwd>
  </div>
</template>

<script>
//
import { store, mutations } from "@/store/global.js";
import queryString from "query-string";
import ChangePwd from "./ChangePwd.vue";
const menus = [
  "account",
  "historylist",
  "phraselist",
  "role",
  "room",
  "tracelist",
];

const sysMenus = ["account", "room", "role"];
//my-nav-dropdown
export default {
  name: "navPageDTC",
  data() {
    return {
      FunctionNos: "", //sessionStorage.FunctionNos.split(","),
      tab: 1,
      name: sessionStorage.name,
      title: sessionStorage.title != "null" ? sessionStorage.title : "",
      placement: "bottom",
      imgs: [require("./dtxTitle.png"), require("./logo.png")],
      masterRole: sessionStorage.role == "HospitalMasterDoctor",
      distinctRole: sessionStorage.role == "DistrictOffice",
      serviceManager: sessionStorage.role == "ServiceManager",
      viewSettingMenu: sessionStorage.viewSettingMenu,
    };
  },
  components: {
    ChangePwd,
  },
  computed: {
    isLogin() {
      return store.isLogin;
    },
  },

  methods: {
    async changePwd() {
      this.$bvModal.show("dtcPwdChange");
    },
    logout() {
      mutations.logout();
      this.$vlf.clear();
      this.$router.push("login");
    },
    parseUrl() {
      const str = location.href.includes("?")
        ? location.href.split("?")[1]
        : "";
      const obj = queryString.parse(str);
      if (obj && obj.map) {
        this.tab = Number(obj.map) + 1;
        this.$router.push("applyMaps?map=" + Number(obj.map));
      } else this.tab = 1;
    },
    initRbac() {
      const hideList = menus.filter(
        (s) => !this.FunctionNos.find((t) => t == s)
      );

      //alert(hideList.length);
      hideList.forEach((s) => {
        document.querySelector("#" + s).style.display = "none";
      });

      const neededHide = sysMenus.every((s) => hideList.find((t) => t == s));
      if (neededHide) {
        document.querySelector("#my-nav-dropdown").style.display = "none";
      }
    },
  },
  mounted() {
    //this.parseUrl();
    //this.initRbac();
    this.$root.$on("nav-tab-dtc", (num) => (this.tab = Number(num) + 1));
  },
  beforeCreate() {
    // this.$root.$on("login", () => (this.showLogout = true));
  },
  watch: {
    $route() {
      document.documentElement.scrollTop = 0;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
/deep/ .nav-link {
  // tab not clicked yet color
  color: #a2cbed !important;
  font-weight: 600;
  font-size: 18px;
}
.nav-item {
  color: #ffffff !important;
  // .active {
  //   // tab  clicked  color
  //   color: #ffffff !important;
  //   transform: scale(1);
  //   display: inline-block;
  //   // box-shadow: 0px 2px 0px 0px var(--orange);
  // }
}
.dtx-title-img {
  display: inline-block;
  width: 300px;
  height: 50px;
  object-fit: cover;
}
.bar-icon {
  border-radius: 50%;
  background: var(--light);
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  cursor: pointer;
}
.login-name {
  margin-right: 12px;
  padding: 4px 12px;
  font-size: 14px;
  color: var(--primary);
  background: white;
  border-radius: 5px;
  width: max-content;
}
.dtc-bg {
  background: #10579b;
}
</style>
