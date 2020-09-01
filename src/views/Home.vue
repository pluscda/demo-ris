<template>
  <div class="dashboard">
    <grid-layout
      :layout.sync="layout"
      :responsive="true"
      :col-num="12"
      :row-height="30"
      :is-draggable="true"
      :is-resizable="false"
      :is-mirrored="false"
      :vertical-compact="true"
      :margin="[10, 10]"
      :use-css-transforms="true"
    >
      <grid-item v-for="(item, idx) in layout" :x="item.x" :y="item.y" :w="item.w" :h="item.h" :i="item.i" :key="item.i">
        <div class="header">
          <div>{{ item.text }}</div>
          <div class="opts" :class="item.spec ? 'long-list' : ''">
            <!-- <b-button style="min-width: 110px;margin-right:4px;" size="sm" v-if="item.spec" variant="info">報告完成時間</b-button> -->
            <!-- <b-form-select size="sm" style="margin-right:4px;" v-if="item.ops3" v-model="item.val3" :options="item.ops3"></b-form-select> -->
            <b-form-select size="sm" style="margin-right:4px;" v-if="item.ops2" v-model="item.val2" :options="item.ops2"></b-form-select>
            <b-form-select size="sm" v-model="item.val" :options="item.ops"></b-form-select>
          </div>
        </div>
        <div class="dtc-chart-item">
          <CstChart v-if="idx == 0"></CstChart>
          <ImgDtc v-if="idx == 1"></ImgDtc>
          <ReportNotDone v-if="idx == 2"></ReportNotDone>
          <Workload v-if="idx == 3"></Workload>
          <Device v-if="idx == 4"></Device>
          <Finish v-if="idx == 5"></Finish>
          <Delay v-if="idx == 6"></Delay>
          <Person v-if="idx == 7"></Person>
        </div>
      </grid-item>
    </grid-layout>
  </div>
</template>

<script>
import VueGridLayout from "vue-grid-layout";
import CstChart from "@/components/home/Cst";
import Device from "@/components/home/Device";
import ReportNotDone from "@/components/home/ReportNotDone";
import Workload from "@/components/home/Workload";
import ImgDtc from "@/components/home/Img";
import Finish from "@/components/home/Finish";
import Delay from "@/components/home/Delay";
import Person from "@/components/home/Person";

const timeOps = [
  { value: 1, text: "按月統計" },
  { value: 2, text: "按季統計" },
  { value: 3, text: "按半年統計" },
  { value: 4, text: "按年統計" }
];

const personOps = [
  { value: 1, text: "醫師報告件數" },
  { value: 2, text: "醫師審核件數" },
  { value: 3, text: "放射師" },
  { value: 4, text: "護理師" }
];

const reportOps = [{ value: null, text: "選擇檢查儀器" }];

const layout = [
  { x: 0, y: 0, w: 3, h: 11, text: "陰性報告", i: "1", val: 1, ops: timeOps },
  { x: 3, y: 0, w: 3, h: 11, text: "影像品質", i: "2", val: 1, val2: 1, ops: timeOps, ops2: [] },
  { x: 6, y: 0, w: 3, h: 11, text: "報告未完成", i: "3", val: 1, ops: timeOps },
  { x: 9, y: 0, w: 3, h: 11, text: "工作總量", i: "4", val: 1, val2: 1, ops: timeOps, ops2: personOps },
  { x: 0, y: 4, w: 3, h: 11, text: "儀器使用", i: "5", val: 1, val2: 1, ops: timeOps, ops2: [] },
  { x: 3, y: 4, w: 3, h: 11, text: "完成時間", i: "6", val: 1, val2: null, ops: timeOps, ops2: [] },
  { x: 6, y: 4, w: 3, h: 11, text: "逾時報告", i: "7", val: 1, ops: timeOps },
  { x: 9, y: 4, w: 3, h: 11, text: "個別逾時", i: "8", val: 1, val2: null, ops: timeOps, ops2: [] }
];

export default {
  name: "home",
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    CstChart,
    Device,
    ReportNotDone,
    Workload,
    ImgDtc,
    Finish,
    Delay,
    Person
  },
  data() {
    return {
      layout,
      //cmps: [CstChart, ImgDtc, ReportNotDone, Workload, Device, Finish, Person],
      selected: null,
      timeOp4TestResult: 1,
      timeOps
    };
  },
  async created() {
    let imgs = await window.axios.get("/GeneralData/SelectNoList?groupNo=ImageQuality");
    let arr = [];
    imgs = imgs.Items;
    imgs.forEach(s => {
      arr.push({ value: s.No, text: s.Name });
    });
    let reports = await window.axios.get("/employee/SelectList?staffType=35");
    const persons = [...reports.Items.slice(0, 20).map(s => ({ text: s.Name, value: s.Name }))];
    this.layout[1].ops2 = [...arr];
    this.layout[1].val2 = arr[0].value;
    const map = await window.axios.get("/api/Device");
    arr = [];
    map.Items.forEach(s => {
      arr.push({ value: s.Id, text: s.Name });
    });
    this.layout[4].ops2 = arr;
    this.layout[5].ops2 = [...reportOps, ...arr];
    this.layout[4].val2 = arr[0].value;
    this.layout[7].ops2 = [...persons];
    this.layout[7].val2 = persons[0].value;
    // arr = [...this.layout];
    // arr.forEach((s, i) => {
    //   s.cmp = this.cmps[i];
    // });
    // this.layout = [...arr];
  },
  mounted() {}
};
</script>

<style lang="scss">
.chartjs-render-monitor {
  height: 330px !important;
}
</style>

<style lang="scss" scoped>
.dashboard {
  background: black !important;
  margin-top: 56px;
  min-height: calc(100vh - 56px);
}
.vue-grid-item {
  background: var(--light); // var(--gray-dark) !important;
  color: var(--dark);
  border-radius: 5px;
  padding: 0.5rem;
  .dtc-chart-item {
    width: 100%;
    max-height: calc(100% - 50px);
    // border: 1px solid white;
  }
  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
    font-size: 1rem;
    > div:first-child {
      margin-top: 4px;
    }
    .opts {
      display: flex;
      justify-content: flex-end;
      width: 230px;
    }
  }
}
.long-list {
  width: 530px !important;
}
</style>
