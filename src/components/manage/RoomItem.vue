<template>
  <label class="dtx-item">
    <b-check v-model="source.hasRoom" class="ml-4" size="lg" @change="updateRoom(source)"></b-check>
    <div>{{source.No}}</div>
    <div>{{ hospitals.length ? hospitals.find(s => s.value == source.InstitutionId).text :''}}</div>
    <div>{{source.Title}}</div>
  </label>
</template>

<script>
//授權作業代碼 //授權作業名稱
import queryString from "query-string";
import buildQuery from "odata-query";
import Swal from "sweetalert2";

import { store, actions } from "@/store/global.js";
const status = ["全部", "已啟用", "未啟用"];

const headers = [
  { name: "診間名稱", key: "Name", sortDesc: null },
  { name: "啟用狀態", key: "IsActivated", sortDesc: null }
];

const rows = [10, 20, 50];
export default {
  name: "RoleDtcRoomItem",
  data() {
    return {
      hospitals: []
    };
  },
  props: {
    index: {
      // index of current item
      type: Number
    },
    source: {
      // here is: {uid: 'unique_1', text: 'abc'}
      type: Object,
      default() {
        return {};
      }
    }
  },
  components: {},
  methods: {
    updateRoom(source) {
      requestAnimationFrame(async () => {
        try {
          source.hasRoom
            ? await actions.addDoctorByRoomId(source.roomId, source.No)
            : await actions.removeDoctorByRoomId(source.roomId, source.No);
          // this.$bvToast.toast(`診間狀態更新成功`, {
          //   title: "診間管理",
          //   autoHideDelay: 5000,
          //   variant: "success"
          // });
        } catch (e) {
          this.$bvToast.toast(`診間狀態失敗` + e, {
            title: "診間管理",
            autoHideDelay: 5000,
            variant: "danger"
          });
        }
      });
    }
  },
  async mounted() {
    const { Items } = await actions.getHospitalList();
    this.hospitals = Items.map(s => ({
      value: s.Id,
      text: s.Name
    }));
    this.hospitals.unshift({ value: null, text: "全部" });
  },

  watch: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "sweetalert2/src/sweetalert2.scss";

.dtx-item {
  display: grid;
  grid-template-columns: 90px repeat(3, 1fr);
  border: none;
  border-bottom: 1px solid white;
  background: var(--dark);
  cursor: pointer;
  color: white;
  padding: 2px 0px;
  margin-bottom: 0px;
}
</style>
