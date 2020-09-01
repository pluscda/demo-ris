<div class="dtc-chart">
    <Bar :chartdata="chartData" :options="chartOptions"  />
</div>

<script>
//import VueCharts from "vue-chartjs";
import { Bar, mixins } from "vue-chartjs";
const { reactiveData } = mixins;
export default {
  labels: [],
  extends: Bar,
  mixins: [reactiveData],
  name: "workload",
  props: ["time", "type"],
  data() {
    return {
      chartdata: {},
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [
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
      //this.drawReport();
    },
    drawReport(data) {
      const labels = this.labels;
      this.chartData = {
        labels,
        datasets: [
          {
            label: "報告件數",
            backgroundColor: "#28a745",
            data
          }
        ]
      };
    }
  },
  async mounted() {
    let reports = await window.axios.get("/employee/SelectList?staffType=35");
    const labels = reports.Items.slice(0, 10).map(s => s.Name);
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
    }
  }
};
</script>

<style lang="scss" scoped>
.dtc-chart {
  color: white;
}
</style>
