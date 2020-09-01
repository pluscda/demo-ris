<div class="dtc-chart">
    <Doughnut :chartdata="chartData" :options="chartOptions"  />
</div>

<script>
//import VueCharts from "vue-chartjs";
import { Doughnut, mixins } from "vue-chartjs";
const { reactiveData } = mixins;
export default {
  labels: [],
  extends: Doughnut,
  mixins: [reactiveData],
  name: "homeImg",
  props: ["time"],
  data() {
    return {
      chartdata: {},
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    };
  },
  methods: {
    getRandomInt() {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5;
    },
    async getData() {
      //this.drawReport();
    },
    drawReport(data) {
      const labels = this.labels;
      this.chartData = {
        labels,
        datasets: [
          {
            label: "影像品質",
            backgroundColor: ["#41B883", "#E46651", "#343a40"],
            data
          }
        ]
      };
    }
  },
  async mounted() {
    let imgs = await window.axios.get("/GeneralData/SelectNoList?groupNo=ImageQuality");
    let arr = [];
    imgs = imgs.Items;
    imgs.forEach(s => {
      arr.push(s.Name);
    });
    this.labels = arr;
    const data = [];
    arr.forEach(() => data.push(this.getRandomInt()));
    this.drawReport(data);
  },
  watch: {
    time(val) {
      // val from 1 ~ 4
    }
  }
};
</script>

<style lang="scss" scoped>
.dtc-chart {
  color: white;
}
</style>
