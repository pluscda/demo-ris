<div class="dtc-chart">
    <HorizontalBar :chartdata="chartData" :options="chartOptions"  />
</div>

<script>
//import VueCharts from "vue-chartjs";
import { HorizontalBar, mixins } from "vue-chartjs";
const { reactiveData } = mixins;
export default {
  extends: HorizontalBar,
  mixins: [reactiveData],
  name: "homeFinish",
  props: ["time", "type"],
  data() {
    return {
      lables: [],
      chartdata: {},
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
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
            label: "平均完成時間(分鐘)TOP 10人員",
            backgroundColor: "#ffc107",
            data
          }
        ]
      };
    }
  },
  async mounted() {
    let reports = await window.axios.get("/employee/SelectList?staffType=35");
    const labels = reports.Items.slice(10, 20).map(s => s.Name);
    this.labels = labels;
    const data = [];
    labels.forEach(() => {
      data.push(this.getRandomInt());
    });
    this.drawReport(data);
  },
  watch: {
    time(val) {
      // val from 1 ~ 4
    },
    type(val) {
      // device id
    }
  }
};
</script>

<style lang="scss" scoped>
.dtc-chart {
  color: white;
}
</style>
