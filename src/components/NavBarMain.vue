<template>
  <b-container id="topNav" fluid>
    <b-navbar fixed="top" toggleable="sm" type="dark" id="mainNav">
      <b-navbar-brand to="/" replace>
        <b-img :src="`${publicPath}LogoWF4NB_128x128.png`" class="mr-1 logo" />
        <span class="title">萬芳醫院．影像報告系統</span>
      </b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="mr-auto">
          <b-nav-item-dropdown v-if="counter" text="櫃台作業">
            <b-dropdown-item to="/MI01/FI0101" replace>報到櫃台</b-dropdown-item>
            <b-dropdown-item to="/MI01/FI0102" replace>健診櫃台</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item-dropdown v-if="checkRoom" text="檢查室作業">
            <b-dropdown-item to="/MI02/FI0201" replace>報到前台</b-dropdown-item>
            <b-dropdown-item to="/MI02/FI0203" replace>藥品耗材登打</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item-dropdown v-if="report" text="診斷報告">
            <b-dropdown-item to="/MI03/FI0302" replace>報告片語維護</b-dropdown-item>
            <!-- <b-dropdown-item v-if="functions.includes('FI0303')" to="/MI03/FI0303" replace>癌篩樣版維護</b-dropdown-item> -->
            <b-dropdown-item v-if="functions.includes('FI0301')" hidden to="/MI03/FI0301" replace>報告撰寫作業v1</b-dropdown-item>
            <!-- JAMES UPDATED -->
            <b-dropdown-item v-if="functions.includes('FI0303')" to="/MI03/FI0303" replace>癌篩樣版維護</b-dropdown-item>
            <!-- JAMES UPDATED -->
            <b-dropdown-item v-if="functions.includes('FI0304')" to="/MI03/FI0304" replace>報告待打清單</b-dropdown-item>
            <!-- thomas UPDATED -->
            <b-dropdown-item v-if="functions.includes('FI0305')" to="/MI03/FI0305" replace>交班紀錄</b-dropdown-item>
            <b-dropdown-item v-if="functions.includes('FI0306')" to="/MI03/FI0306" replace>匿名評分</b-dropdown-item>
            <b-dropdown-item v-if="functions.includes('FI0307')" to="/MI03/FI0307" replace>報告搜尋作業</b-dropdown-item>
            <!-- JAMES UPDATED -->
            <b-dropdown-item v-if="functions.includes('FI0308')" to="/MI03/FI0308" replace>個案追蹤</b-dropdown-item>

            <!--
						<b-dropdown-item to="/" replace disabled>Home</b-dropdown-item>
						<b-dropdown-divider></b-dropdown-divider>
						<b-dropdown-item to="/about" replace disabled>About</b-dropdown-item>
            -->
          </b-nav-item-dropdown>
          <b-nav-item-dropdown v-if="Author" text="權限管理作業">
            <b-dropdown-item v-if="functions.includes('Account')" to="/Account" replace>系統帳號管理</b-dropdown-item>
            <b-dropdown-item v-if="functions.includes('Role')" to="/Role" replace>系統角色管理</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item-dropdown v-if="GernerData" text="基本資料維護">
            <b-dropdown-item v-if="functions.includes('ProcedureGroup')" to="/ProcedureGroup" replace>專長群組維護</b-dropdown-item>
            <b-dropdown-item v-if="functions.includes('Employee')" to="/Employee" replace>員工管理</b-dropdown-item>
            <b-dropdown-item v-if="functions.includes('Patient')" to="/Patient" replace>病患管理</b-dropdown-item>
            <b-dropdown-item v-if="functions.includes('CheckCategory')" to="/CheckCategory" replace>檢查類別維護</b-dropdown-item>
            <b-dropdown-item v-if="functions.includes('CheckCombo')" to="/CheckCombo" replace>檢查套餐維護</b-dropdown-item>
            <b-dropdown-item v-if="functions.includes('CheckItem')" to="/CheckItem" replace>檢查項目維護</b-dropdown-item>
            <b-dropdown-item v-if="functions.includes('Medication')" to="/Medication" replace>藥品維護</b-dropdown-item>
            <b-dropdown-item v-if="functions.includes('Medication')" to="/SubMedication" replace>部門藥品子代碼維護</b-dropdown-item>
            <b-dropdown-item v-if="functions.includes('Institution')" to="/Institution" replace>部門維護</b-dropdown-item>
            <b-dropdown-item v-if="functions.includes('Room')" to="/Room" replace>檢查室維護</b-dropdown-item>
            <b-dropdown-item v-if="functions.includes('Device')" to="/Device" replace>檢查儀器維護</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item-dropdown v-if="schedule" text="排程維護">
            <b-dropdown-item v-if="functions.includes('DefaultSpecialTime')" to="/DefaultSpecialTime" replace>檢查室每週例行排程</b-dropdown-item>
            <b-dropdown-item v-if="functions.includes('SpecialTime')" to="/SpecialTime" replace>檢查室特定時段排程</b-dropdown-item>
            <b-dropdown-item v-if="functions.includes('Schedule')" to="/Schedule" replace>排程總覽</b-dropdown-item>
            <b-dropdown-item v-if="functions.includes('BookingTest')" to="/BookingTest" replace>排程 Booking</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item-dropdown v-if="doctor" text="報告醫師排程維護">
            <b-dropdown-item v-if="functions.includes('WeekScheduling')" to="/WeekScheduling" replace>日班週排程</b-dropdown-item>
            <!-- <b-dropdown-item v-if="functions.includes('MonthScheduling')" to="/MonthScheduling" replace>小夜班月排程</b-dropdown-item> -->
            <b-dropdown-item v-if="functions.includes('ManualAssign')" to="/ManualAssign" replace>手動分派報告醫師</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item-dropdown v-if="statistics" text="統計作業">
            <b-dropdown-item v-if="functions.includes('EmployeeWorkload')" to="/EmployeeWorkload" replace>檢查人員工作量</b-dropdown-item>
            <b-dropdown-item v-if="functions.includes('DeviceWorkload')" to="/DeviceWorkload" replace>儀器使用量</b-dropdown-item>
            <b-dropdown-item to="/MI02/FI0204" replace>藥品耗材統計作業</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown text="登出" right>
            <b-dropdown-item @click.prevent="logout" replace>登出</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </b-container>
</template>
<script>
import store from "../store";
export default {
  data() {
    return {
      publicPath: process.env.BASE_URL
    };
  },
  computed: {
    //櫃檯作業
    counter: {
      get: function() {
        //判定 回來的Functions中 是否有包含某些值 有包含到就給True;
        let show = false;
        let Fn = store.state.Profile4User.functions;
        Fn.forEach(x => {
          if (x.includes("FI0101") || x.includes("FI0102")) {
            show = true;
          }
        });
        return show;
      }
    },

    //檢查室作業
    checkRoom: {
      get: function() {
        //判定 回來的Functions中 是否有包含某些值 有包含到就給True;
        let show = false;
        let Fn = store.state.Profile4User.functions;
        Fn.forEach(x => {
          if (x.includes("FI0201") || x.includes("FI0203")) {
            show = true;
          }
        });
        return show;
      }
    },
    //診斷報告
    report: {
      get: function() {
        //判定 回來的Functions中 是否有包含某些值 有包含到就給True;
        let show = false;
        let Fn = store.state.Profile4User.functions;
        Fn.forEach(x => {
          if (x.includes("FI0302") || x.includes("FI0304") || x.includes("FI0305") || x.includes("FI0306")) {
            show = true;
          }
        });
        return show;
      }
    },
    //權限管理作業
    Author: {
      get: function() {
        //判定 回來的Functions中 是否有包含某些值 有包含到就給True;
        let show = false;
        let Fn = store.state.Profile4User.functions;
        Fn.forEach(x => {
          if (x.includes("Account") || x.includes("Role")) {
            show = true;
          }
        });
        return show;
      }
    },
    //基本資料維護
    GernerData: {
      get: function() {
        //判定 回來的Functions中 是否有包含某些值 有包含到就給True;
        let show = false;
        let Fn = store.state.Profile4User.functions;
        Fn.forEach(x => {
          if (
            x.includes("Employee") ||
            x.includes("Patient") ||
            x.includes("CheckCategory") ||
            x.includes("CheckCombo") ||
            x.includes("CheckItem") ||
            x.includes("Medication") ||
            x.includes("SubMedication") ||
            x.includes("Institution") ||
            x.includes("Room") ||
            x.includes("Device")
          ) {
            show = true;
          }
        });
        return show;
      }
    },
    //排程維護
    schedule: {
      get: function() {
        //判定 回來的Functions中 是否有包含某些值 有包含到就給True;
        let show = false;
        let Fn = store.state.Profile4User.functions;
        Fn.forEach(x => {
          if (x.includes("DefaultSpecialTime") || x.includes("SpecialTime") || x.includes("Schedule") || x.includes("BookingTest")) {
            show = true;
          }
        });
        return show;
      }
    },
    //報告醫師排程維護
    doctor: {
      get: function() {
        //判定 回來的Functions中 是否有包含某些值 有包含到就給True;
        let show = false;
        let Fn = store.state.Profile4User.functions;
        Fn.forEach(x => {
          if (x.includes("WeekScheduling") || x.includes("MonthScheduling") || x.includes("ManualAssign")) {
            show = true;
          }
        });
        return show;
      }
    },
    //統計
    statistics: {
      get: function() {
        //判定 回來的Functions中 是否有包含某些值 有包含到就給True;
        let show = false;
        let Fn = store.state.Profile4User.functions;
        Fn.forEach(x => {
          if (x.includes("EmployeeWorkload") || x.includes("DeviceWorkload")) {
            show = true;
          }
        });
        return show;
      }
    },
    functions: {
      get: function() {
        return store.state.Profile4User.functions;
      }
    }
  },
  methods: {
    logout() {
      //呼叫Store內的mutations才可更改state內的值
      this.$store.state.isLogin = false;
      this.$store.commit({
        type: "UserLogout",
        userData: this.$store.state.Profile4User
      });
      this.$router.replace("/Login");
    }
  },
  created() {}
};
</script>
