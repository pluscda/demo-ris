import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    name: "Home",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../components/land/Login.vue"),
  },
  {
    path: "/historylist",
    name: "waitlist",
    component: () => import("../components/dtclist/HistoryList.vue"),
  },
  {
    path: "/tracelist",
    name: "waitlist",
    component: () => import("../components/dtclist/TraceList.vue"),
  },
  {
    path: "/servicelist",
    name: "servicelist",
    component: () => import("../components/dtclist/ServiceList.vue"),
  },
  {
    path: "/enrolllist",
    name: "enrolllist",
    component: () => import("../components/dtclist/EnrollList.vue"),
  },
  {
    path: "/editlist",
    name: "editlist",
    component: () => import("../components/dtclist/EditList.vue"),
  },
  {
    path: "/districtlist",
    name: "districtlist",
    component: () => import("../components/dtclist/DistrictList.vue"),
  },
  {
    path: "/blacklist",
    name: "blacklist",
    component: () => import("../components/dtclist/BlackList.vue"),
  },
  {
    path: "/stamp",
    name: "stamp",
    component: () => import("../views/PhysicalExam/Stamp.vue"),
  },
  {
    path: "/upload",
    name: "uploadfile",
    component: () => import("../components/UploadFile.vue"),
  },
  {
    path: "/phraselist",
    name: "phraselist",
    component: () => import("../views/PhysicalExam/items/Phrase.vue"),
  },
  {
    path: "/details",
    name: "PhysicalExam",
    component: () => import("../views/PhysicalExam/Index.vue"),
  },
  {
    path: "/serviceDetails", // for 兵役局承辦人 view only
    name: "ServiceDetails",
    component: () => import("../views/PhysicalExam/Service.vue"),
  },
  {
    path: "/account",
    name: "account",
    component: () => import("../components/manage/Account.vue"),
  },
  {
    path: "/role",
    name: "role",
    component: () => import("../components/manage/Role.vue"),
  },
  {
    path: "/room",
    name: "room",
    component: () => import("../components/manage/Room.vue"),
  },
];
//alert(process.env.BASE_URL)
const router = new VueRouter({
  //mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.afterEach((to, from) => {
  setTimeout(() => {
    if (!to.path.includes("login") && !sessionStorage.token) {
      router.push("login");
    }
  }, 300);
});

export default router;
