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
  name: "homeCST",
  data() {
    return {
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
          label: "人員名稱",
          backgroundColor: "#ffc107",
          //type: "horizontalBar",
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
