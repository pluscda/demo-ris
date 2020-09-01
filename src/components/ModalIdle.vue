<template>
  <div>
    <b-modal ref="modal-1" centered hide-footer hide-header>
      <p style="color: black !important;">您已經超過一段時間未操作，如需繼續使用，請移動滑鼠或鍵盤!!</p>
    </b-modal>
  </div>
</template>

<script>
export default {
  computed: {
    Waittingtime_show() {
      return (this.Logouttime - this.Waittingtime) / 1000;
    },
    realWaittingtime() {
      return this.Time / 1000;
    }
  },
  data() {
    return {
      // //共閒置時間 預設七分鐘跟他說剩下三分鐘若未動作則強制登出
      Waittingtime: 420000,
      // // //
      Logouttime: 600000,
      //共閒置時間 預設七分鐘跟他說剩下三分鐘若未動作則強制登出
      // Waittingtime: 5000,
      //顯示目前閒置多久
      Time: 0
      //
      // Logouttime: 10000
    };
  },
  created() {
    let timerId = setInterval(() => {
      this.Waittingtime -= 1000;
      if (!this.$store.state.idleVue.isIdle) clearInterval(timerId);
      if (this.Waittingtime < 1) {
        //彈視窗提醒告知已閒置 預設七分鐘
        this.$refs["modal-1"].show();
        clearInterval(timerId);
      }
    }, 1000);
    let timerId2 = setInterval(() => {
      this.Logouttime -= 1000;
      this.Time += 1000;
      if (!this.$store.state.idleVue.isIdle) clearInterval(timerId2);
      if (this.Logouttime < 1) {
        clearInterval(timerId2);
        this.$store.state.isLogin = false;
        this.$store.commit({
          type: "UserLogout",
          userData: this.$store.state.Profile4User
        });
        this.$router.replace("/Login");
        //Logout
      }
    }, 1000);
  }
};
</script>
