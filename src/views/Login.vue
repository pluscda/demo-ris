<template>
  <div id="Login">
    <!-- 設置背景顏色 吃全畫面 -->
    <b-container class="modal-backdrop" fluid>
      <b-row class="locate">
        <b-img src="\DTC_Icon.png" width="300"></b-img>
        <b-form-input placeholder="帳號" ref="Account" class="mt-5" v-model="myAuth.AccId"></b-form-input>
        <b-form-input placeholder="密碼" class="mt-3" type="password" v-model="myAuth.Password"></b-form-input>
        <b-button block class="mt-3 button" @click="login">Log In</b-button>
        <b-form-checkbox v-if="showCheat" id="checkbox-1" v-model="status" name="checkbox-1">是否長久登入</b-form-checkbox>
      </b-row>
    </b-container>
    <b-modal
      no-close-on-backdrop
      no-close-on-esc
      ref="LoginFailed"
      centered
      hide-footer
      title="帳號或密碼錯誤"
      @close="AddMethod"
    >
      <b-col class="px-1 text-center">
        <b-button variant="info" ref="btn" class="mr-1" @click="confirm">
          <font-awesome-icon icon="trash" class="mr-1" />確定
        </b-button>
      </b-col>
    </b-modal>
  </div>
</template>

<script>
// 載入模組:KeyPressIdentifier
import KeyPressIdentifier from "@/assets/KeyPressIdentifier";
import * as configs from "@/config";
import state from "../store";
export default {
  name: "Login",
  data() {
    return {
      myAuth: {
        AccId: "",
        Password: ""
      },
      Loginmethod: null,
      status: false,
      //是否開啟作弊按鈕
      showCheat: false
    };
  },
  methods: {
    AddMethod() {
      this.$refs["LoginFailed"].hide();
      window.addEventListener("keydown", this.HKWatch); //粗體Method自定義
    },
    //之後會打API傳入後台查詢是否符合 並回傳True及相關變數(待定)判定畫面上的資料呈現
    //需有加密手段將資料加密後傳入API
    //用replace目的是不要殘留history的資料
    HKWatch(event) {
      if (event.key === "Enter") {
        this.login();
      }
      if (event.key === "/") {
        this.showCheat = !this.showCheat;
        if (this.showCheat) {
          return;
        } else {
          this.status = false;
        }
      }
    },
    //     new Date() - new Date(this.$store.state.Profile4User.ActionTime)
    confirm() {
      this.$refs["LoginFailed"].hide();
      window.addEventListener("keydown", this.HKWatch); //粗體Method自定義
    },
    async login() {
      //之後會打API傳入後台查詢是否符合 並回傳True及相關變數(待定)判定畫面上的資料呈現
      //需有加密手段將資料加密後傳入API TO-do
      //用replace目的是不要殘留history的資料

      let result = null;
      let Account = {
        Name: this.myAuth.AccId,
        Password: this.myAuth.Password,
        IsLongTime: true
      };
      //呼叫Store內的mutations才可更改state內的值
      let _this = this;

      await window.axios
        .post("/Auth/Login", Account)
        .then(e => {
          result = e;
          this.$store.commit(configs.XUserAuthorized, result);
          if (this.status) {
            console.log("不增加定時功能");
            this.$router.replace("/home");
          } else {
            console.log("增加定時功能");
            this.$store.state.isLogin = true;
            this.$router.replace("/home");
          }

          //推撥到首頁
        })
        .catch(function(error) {
          window.removeEventListener("keydown", _this.HKWatch);
          _this.myAuth.AccId = "";
          _this.myAuth.Password = "";
          _this.$refs["LoginFailed"].show();
          setTimeout(x => {
            _this.$nextTick(() => _this.$refs["btn"].focus());
          }, 500);
          return error;
        });
    }
  },
  computed: {},
  created() {
    window.addEventListener("keydown", this.HKWatch); //粗體Method自定義
    // 取得 App.vue 參照
    let obj = this.$GetApp(this);
    if (obj) {
      this.ObjApp = obj[0];
      this.VueNestLevel = obj[1];
    } else {
      // console.log(this.$logs("Fail to get App.vue ref.", methodName));
    }
    setTimeout(x => {
      this.$nextTick(() => this.$refs["Account"].focus());
    }, 500);
  },
  destroyed() {
    console.log(`${this.$logs()}`);
    // 解除監聽器:攔截 KeyPress
    window.removeEventListener("keydown", this.HKWatch);
  }
};
</script>
<style scoped>
.modal-backdrop {
  background-color: #01579b;
  opacity: 1;
}
.locate {
  position: absolute;
  left: 50%;
  top: 50%;
  margin-top: -150px;
  margin-left: -150px;
  width: 300px;
}
::placeholder {
  color: #01579b;
  font-weight: bold;
}
button {
  background-color: #013e6d;
  font-weight: bold;
}
</style>
