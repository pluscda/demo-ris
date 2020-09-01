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
  props: ["time"],
  data() {
    return {
      chartdata: {},
      labels: [],
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
      // TODO: get data from  time
      //this.drawReport(data1, data2);
    },
    async drawReport(data1, data2) {
      const labels = this.labels;
      this.chartData = {
        labels,
        datasets: [
          {
            label: "陽性反應",
            backgroundColor: "#f87979",
            data: data1
          },
          {
            label: "陰性反應",
            backgroundColor: "#28a745",
            data: data2
          }
        ]
      };
      //if (draw) this.renderChart(this.chartdata, this.options);
    }
  },
  async mounted() {
    let reports = await window.axios.get("/cst/List");
    const labels = reports.map(s => s.CSTName);
    const data1 = [];
    const data2 = [];
    labels.forEach(() => {
      data1.push(this.getRandomInt());
      data2.push(this.getRandomInt());
    });
    this.labels = [...labels];
    this.drawReport(data1, data2);
  },
  watch: {
    time(val) {
      // val from 1 ~ 4
      const data1 = [];
      const data2 = [];
      this.labels.forEach(() => {
        data1.push(this.getRandomInt());
        data2.push(this.getRandomInt());
      });
      this.drawReport(data1, data2);
    }
  }
};
</script>

<style lang="scss" scoped>
.dtc-chart {
  color: white;
}
</style>
