<div class="dtc-chart">
    <Radar :chartdata="chartData" :options="chartOptions"  />
</div>

<script>
//import VueCharts from "vue-chartjs";
import { Radar, mixins } from "vue-chartjs";
const { reactiveData } = mixins;
export default {
  extends: Radar,
  mixins: [reactiveData],
  name: "homeDevice",
  props: ["time"],
  data() {
    return {
      labels: [],
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
      //this.drawReport(data);
    },
    drawReport(data) {
      const labels = this.labels;
      this.chartData = {
        labels,
        datasets: [
          {
            label: "儀器使用次數",
            backgroundColor: "rgba(255,99,132,0.2)",
            borderColor: "rgba(255,99,132,1)",
            pointBackgroundColor: "rgba(255,99,132,1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(255,99,132,1)",
            // backgroundColor: ["#41B883", "#E46651", "#343a40", "#20c997", "#17a2b8", "#e83e8c", "#ffc107"],
            data
          }
        ]
      };
    }
  },
  async mounted() {
    const map = await window.axios.get("/api/Device");
    let arr = [];
    map.Items.forEach(s => {
      arr.push(s.Name);
    });
    const labels = arr;
    const data = [];
    labels.forEach(() => {
      data.push(this.getRandomInt());
    });
    this.labels = labels;
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
