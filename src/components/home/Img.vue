<div class="dtc-chart">
    <Doughnut :chartdata="chartData" :options="chartOptions"  />
</div>

<script>
//import VueCharts from "vue-chartjs";
import { Doughnut, mixins } from "vue-chartjs";
const { reactiveData } = mixins;
export default {
  extends: Doughnut,
  mixins: [reactiveData],
  name: "homeImg",
  data() {
    return {
      chartdata: {
        // labels: ["January", "February"],
        // datasets: [
        //   {
        //     label: "Data One",
        //     backgroundColor: "#f87979",
        //     data: [40, 20]
        //   }
        // ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: true,
          labels: {
            //fontColor: "#fff"
          }
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
    let imgs = await window.axios.get("/GeneralData/SelectNoList?groupNo=ImageQuality");
    let arr = [];
    imgs = imgs.Items;
    imgs.forEach(s => {
      arr.push(s.Name);
    });

    const labels = arr;
    this.chartData = {
      labels,
      datasets: [
        {
          label: "影像品質",
          backgroundColor: ["#41B883", "#E46651", "#343a40"],
          data: [this.getRandomInt(), this.getRandomInt(), this.getRandomInt()]
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
