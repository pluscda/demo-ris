<template>
  <section>
    <b-overlay :show="showLoading" rounded="sm" variant="dark">
      <main class="dtc-login">
        <section class="dtc-login-sec">
          <img :src="imgs[1]" class="my-title-img" />
          <div class="main-sec">
            <b-select :options="accounts" v-model="name"></b-select>
            <b-input size="lg" v-model="pwd" placeholder="密碼" type="password"></b-input>
            <b-button class="login-btn" @click="login">登入</b-button>
          </div>
        </section>
      </main>
    </b-overlay>
  </section>
</template>
<script>
import queryString from "query-string";
import { store, mutations, actions } from "@/store/global.js";
const accounts = ["s1", "3md", "manager", "admin", "3d1", "3d2", "3d3", "3d4", "la", "ld1", "ld2", "ld3", "ld4"];
export default {
  name: "home",
  data() {
    return {
      hot: null,
      hotList: [],
      accounts,
      name: "3d1",
      pwd: "admin",
      showLoading: false,
      imgs: [require("./dtxTitle.png"), require("./logo.png")],
    };
  },
  components: {},

  methods: {
    async login() {
      this.$root.$emit("loginSuccess", map);
      const obj = {
        Name: this.name,
        Password: this.pwd,
        IsLongTime: true,
      };
      try {
        this.showLoading = true;
        const map = await window.axios.post("auth/Login", obj);
        this.showLoading = false;
        mutations.login(map);
        this.$root.$emit("loginSuccess", map);
        this.$router.push("home");
      } catch (e) {
        this.showLoading = false;
        this.$bvToast.toast(`帳號或密碼錯誤: ` + e, {
          title: "登入失敗",
          autoHideDelay: 8000,
          variant: "danger",
        });
      }
    },
  },
  async mounted() {
    this.hotList = (await actions.getLoginHotList()).map((s) => ({
      value: s.Id,
      text: s.Name,
    }));
  },
};
</script>

<style lang="scss" scoped>
.dtc-login {
  width: 100vw;
  height: 100vh;
  background: #10579b;
  display: grid;
  place-items: center;
}

.dtc-login-sec {
  width: 400px;
  min-height: 370px;
  // border: 1px solid white;
  display: grid;
  grid-template-columns: 1fr;
}

.my-title-img {
  width: 100%;
  height: 87px;
}
.main-sec {
  display: grid;
  grid-template-columns: 1fr;
  padding: 12px;
  > div {
    margin-bottom: 30px;
  }
}
.login-btn {
  background: #013e6d;
}
</style>
