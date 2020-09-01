// 載入模組:組態設定
import * as configs from "@/config";

import Vue from "vue";
import Router from "vue-router";
import store from "./store";
import VueJwtDecode from "vue-jwt-decode";

Vue.use(Router);

export const router = new Router({
  path: "/",
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("./views/Home.vue")
    },
    {
      path: "/home",
      name: "home",
      component: () => import("./views/Home.vue")
    },
    {
      path: "/MI01/FI0101",
      name: "FI0101",
      component: () => import("./views/MI01/FI0101.vue")
    },
    //2020/1/10 Light Add
    {
      path: "/MI01/FI0102",
      name: "FI0102",
      component: () => import("./views/MI01/FI0102.vue")
    },
    //JAMES UPDATED
    {
      path: "/MI02/FI0201",
      name: "FI0201",
      component: () => import("./views/MI02/FI0201-2.vue")
    },
    {
      path: "/MI02/FI0202",
      name: "FI0202",
      component: () => import("./views/MI02/FI0202-2.vue")
    },
    {
      path: "/MI02/FI0203",
      name: "FI0203",
      component: () => import("./views/MI02/FI0203.vue")
    },
    {
      path: "/MI02/FI0203-1",
      name: "FI0203-1",
      component: () => import("./views/MI02/FI0203-1.vue")
    },
    {
      path: "/MI02/FI0204",
      name: "FI0204",
      component: () => import("./views/MI02/FI0204.vue")
    },
    // {
    //   path: "/MI02/FI0201",
    //   name: "FI0201",
    //   component: () => import("./views/MI02/FI0201.vue")
    // },
    // {
    //   path: "/MI02/FI0201/:guid",
    //   name: "FI0202",
    //   component: () => import("./views/MI02/FI0202.vue")
    // },
    {
      path: "/MI03/FI0301",
      name: "FI0301",
      component: () => import("./views/MI03/FI0301.vue")
    },
    {
      path: "/MI03/FI0302",
      name: "FI0302",
      component: () => import("./views/MI03/FI0302.vue")
    },
    {
      path: "/MI03/FI0303",
      name: "FI0303",
      component: () => import("./views/MI03/FI0303.vue")
    },
    //JAMES UPDATED
    {
      path: "/MI03/FI0304",
      name: "FI0304",
      component: () => import("./views/MI03/FI0304.vue")
    },
    {
      path: "/MI03/FI0305",
      name: "FI0305",
      component: () => import("./views/MI03/FI0305.vue")
    },
    {
      path: "/MI03/FI0305-1",
      name: "FI0305-1",
      component: () => import("./views/MI03/FI0305-1.vue")
    },
    {
      path: "/MI03/FI0306-1",
      name: "FI0306-1",
      component: () => import("./views/MI03/FI0306-1.vue")
    },
    {
      path: "/MI03/FI0306",
      name: "FI0306",
      component: () => import("./views/MI03/FI0306.vue")
    },
    {
      path: "/MI03/FI0307",
      name: "FI0307",
      component: () => import("./views/MI03/FI0307.vue")
    },
    {
      path: "/MI03/FI0308",
      name: "FI0308",
      component: () => import("./views/MI03/FI0308.vue")
    },
    {
      path: "/MI03/FI0309",
      name: "FI0309",
      component: () => import("./views/MI03/FI0309.vue")
    },
    // {
    // 	path: '/MI03/FI0301-2',
    // 	name: 'FI0301-2',
    // 	component: () => import('./views/MI03/FI0301-2.vue')
    // },
    {
      path: "/Employee",
      name: "Employee",
      component: () => import("./views/Employee/Index")
    },
    {
      path: "/Account",
      name: "Account",
      component: () => import("./views/Account/Index")
    },
    {
      path: "/Role",
      name: "Role",
      component: () => import("./views/Role/Index")
    },
    {
      path: "/Patient",
      name: "Patient",
      component: () => import("./views/Patient/Index.vue")
    },
    {
      path: "/CheckCategory",
      name: "CheckCategory",
      component: () => import("./views/CheckCategory/Index")
    },
    {
      path: "/CheckCombo",
      name: "CheckCombo",
      component: () => import("./views/CheckCombo/Index")
    },
    {
      path: "/CheckItem",
      name: "CheckItem",
      component: () => import("./views/CheckItem/Index")
    },
    {
      path: "/Device",
      name: "Device",
      component: () => import("./views/Device/Index")
    },
    {
      path: "/Room",
      name: "Room",
      component: () => import("./views/Room/Index")
    },
    {
      path: "/Medication",
      name: "Medication",
      component: () => import("./views/Medication/Index")
    },
    {
      path: "/SubMedication",
      name: "SubMedication",
      component: () => import("./views/SubMedication/Index")
    },
    {
      path: "/Institution",
      name: "Institution",
      component: () => import("./views/Institution/Index")
    },
    {
      path: "/DeviceWorkload",
      name: "DeviceWorkload",
      component: () => import("./views/DeviceWorkload/Index")
    },
    {
      path: "/EmployeeWorkload",
      name: "EmployeeWorkload",
      component: () => import("./views/EmployeeWorkload/Index")
    },
    {
      path: "/DefaultSpecialTime",
      name: "DefaultSpecialTime",
      component: () => import("./views/DefaultSpecialTime/Index")
    },
    {
      path: "/SpecialTime",
      name: "SpecialTime",
      component: () => import("./views/SpecialTime/Index")
    },
    {
      path: "/Schedule",
      name: "Schedule",
      component: () => import("./views/Schedule/Index")
    },
    {
      path: "/WeekScheduling",
      name: "WeekScheduling",
      component: () => import("./views/WeekScheduling/Index")
    },
    {
      path: "/MonthScheduling",
      name: "MonthScheduling",
      component: () => import("./views/MonthScheduling/Index")
    },
    {
      path: "/ManualAssign",
      name: "ManualAssign",
      component: () => import("./views/ManualAssign/Index")
    },
    {
      path: "/ProcedureGroup",
      name: "ProcedureGroup",
      component: () => import("./views/ProcedureGroup/Index")
    },
    {
      path: "/BookingTest",
      name: "BookingTest",
      component: () => import("./views/BookingTest/Index")
    },
    {
      path: "/BookingWindow",
      name: "bookingWindow",
      component: () => import("./components/Booking/Index")
    },
    {
      path: "/Login",
      name: "LogIn",
      component: () => import("./views/Login.vue")
    }
    // 404 Not found:
    //{ path: '*', redirect: '/' }
  ]
});

router.beforeEach(async (to, from, next) => {
  if (to.query.token) {
    store.state.Profile4User.Authorized = true;
    store.state.Profile4User[configs.JWTTokenName] = to.query.token;
  }
  // - 注意: 別造成 endless recursive !
  // if (configs.Mode4Dev) console.log('router.beforeEach')
  // if (configs.Mode4Dev) console.log(`to.path = ${to.path}`)
  // 將JWT回傳 並驗證是否過期
  if (store.state.Profile4User.Authorized && store.state.Profile4User[configs.JWTTokenName]) {
    let success = false;

    let tokenData = VueJwtDecode.decode(store.state.Profile4User[configs.JWTTokenName]);

    let TokenTime = new Date(tokenData.exp * 1000);
    //驗證toekn是否過期
    //若現在時間大於Token時間則表示Token過期 重登!
    if (new Date() > TokenTime) {
      success = false;
    } else {
      success = true;
    }

    if (success) {
      next();
    } else {
      if (to.path !== "/Login") {
        next("/Login");
      } else next();
    }
    // next();
  } else {
    if (to.path !== "/Login") next("/Login");
    else next();
  }
});
