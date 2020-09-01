<div class="dtc-chart">
    <Bar :chartdata="chartData" :options="chartOptions"  />
</div>

<script>
//import VueCharts from "vue-chartjs";
import { Bar, mixins } from "vue-chartjs";
const { reactiveData } = mixins;
export default {
  extends: Bar,
  mixins: [reactiveData],
  name: "homeCST",
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
    }
  },
  mounted() {
    this.renderChart(this.chartdata, this.options);
    //alert("w");
  },
  async created() {
    let reports = await window.axios.get("/employee/SelectList?staffType=35");
    const labels = reports.Items.slice(0, 10).map(s => s.Name);
    this.chartData = {
      labels,
      datasets: [
        {
          label: "醫師報告件數",
          backgroundColor: "#28a745",
          data: [
            this.getRandomInt(),
            this.getRandomInt(),
            this.getRandomInt(),
            this.getRandomInt(),
            this.getRandomInt(),
            this.getRandomInt(),
            this.getRandomInt(),
            this.getRandomInt(),
            this.getRandomInt(),
            this.getRandomInt()
          ]
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
.dtc-chart {
  color: white;
}
</style>
