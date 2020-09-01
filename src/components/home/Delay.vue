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
  name: "homeDelay",
  props: ["time"],
  data() {
    return {
      labels: [],
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
      // TODO: get data from  time
      //this.drawReport(data);
    },
    drawReport(data) {
      const labels = this.labels;
      this.chartData = {
        labels,
        datasets: [
          {
            label: "平均逾時時間(分鐘)TOP 10人員",
            backgroundColor: "#dc3545",
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
    }
  }
};
</script>

<style lang="scss" scoped>
.dtc-chart {
  color: white;
}
</style>
