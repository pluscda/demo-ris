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
    const map = await window.axios.get("/api/Device");
    let arr = [];
    map.Items.forEach(s => {
      arr.push(s.Name);
    });
    const labels = arr.splice(0, 10);
    this.chartData = {
      labels,
      datasets: [
        {
          label: "個別逾時",
          backgroundColor: "#007bff",
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
