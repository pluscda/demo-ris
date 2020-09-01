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
  name: "homeReportNot",
  props: ["time", "page"],
  data() {
    return {
      pageHolder: 1,
      labels: [],
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
      //this.drawReport(data1, data2);
    },
    drawReport(data1, data2) {
      const labels = this.labels;
      this.chartData = {
        labels,
        datasets: [
          {
            label: "報告未完成",
            backgroundColor: "#E46651",
            data: data1
          },
          {
            label: "報告完成",
            backgroundColor: "#28a745",
            data: data2
          }
        ]
      };
    }
  },
  async mounted() {
    let reports = await window.axios.get("/employee/SelectList?staffType=35");
    const labels = reports.Items.slice(10, 25).map(s => s.Name);
    this.labels = labels;
    const data1 = [];
    const data2 = [];
    labels.forEach(() => {
      data1.push(this.getRandomInt());
      data2.push(this.getRandomInt());
    });
    this.drawReport(data1, data2);
    //alert("w");
  },
  watch: {
    time(val) {
      // val from 1 ~ 4
      this.pageHolder = 1;
    },
    page(val) {
      if (this.pageHolder == val) return;
      this.pageHolder = val;
      //alert(val);
    }
  }
};
</script>

<style lang="scss" scoped>
.dtc-chart {
  color: white;
}
</style>
