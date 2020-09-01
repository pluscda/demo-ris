<template>
  <div class="servant-list p-2" :style="{ '--globalFontSize': `${fontSize}px` }">
    <table>
      <thead>
        <tr>
          <th
            v-for="[key, text] in Object.entries(theads)"
            :key="key"
            v-text="text"
            class="p-1 bg-dark text-white"
          />
          <th class="p-1 bg-dark text-white" />
        </tr>
      </thead>
      <tbody>
        <tr v-for="(servant, idx) in servants" :key="servant.id">
          <td v-for="key in Object.keys(theads)" :key="idx + key" class="p-1">
            <span
              class="d-md-none bg-info text-white rounded px-1 mr-1"
              style="padding-top: 1px; padding-bottom: 1px;"
              v-text="theads[key]"
            />
            {{ servant[key] }}
          </td>
          <td class="text-center p-1">
            <b-button
              size="sm"
              variant="success"
              @click.stop="$router.push({ path: 'servant-form/' + servant['id'] })"
            >查詢</b-button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import servants from "@/assets/js/servantDummy.js";
import { mapState } from "vuex";
import moment from "moment";
export default {
  data() {
    return {
      theads: {
        name: "姓　　名",
        id: "身分證號",
        birthday: "出生日期",
        telPhone: "聯絡電話",
        phone: "行動電話",
        addr: "戶籍地址",
        date: "體檢日期",
        hospital: "體檢醫院",
        type: "判定體位",
      },
      servants: servants(),
    };
  },
  created() {
    this.servants.forEach((servant) => (servant.date = moment(servant.date).format("YYYY-MM-DD")));
  },
  computed: {
    ...mapState(["fontSize"]),
  },
};
</script>

<style lang="scss">
.servant-list {
  box-sizing: border-box;
  width: 100vw;
  margin-top: 59px;
  table {
    width: 100%;
    font-size: var(--globalFontSize);
    th {
      text-align: center;
      border: 1px solid #555;
    }
    td {
      border: 1px solid #555;
    }
  }
}

@media all and (min-width: 768px) {
  .servant-list {
    table {
      tbody {
        tr {
          background-color: #eee;
          &:nth-child(odd) {
            background-color: #ccc;
          }
        }
      }
    }
  }
}

@media all and (max-width: 768px) {
  .servant-list {
    width: 100%;
    table {
      thead {
        display: none;
      }
      tbody {
        > tr {
          display: block;
          margin-bottom: 15px;
          border-bottom: 1px solid #555;
        }
        td {
          display: block;
          width: 100%;
          border-bottom: none;
          background-color: #eee;
          &:nth-child(odd) {
            background-color: #ccc;
          }
          span {
            font-size: 12px;
          }
        }
      }
    }
  }
  .dtx-main-scetion {
    display: block;
    width: 100%;
  }
}

// $sizes: (
//   tn: 0px,
//   sm: 576px,
//   md: 813px,
//   lg: 992px,
//   xl: 1200px,
//   ll: 1610px,
// );

// @each $key, $size in $sizes {
//   @if $key != "tn" {
//     @media all and (min-width: $size) {
//       @include responseSize("-" + $key);
//       // @if clear-units($size) > 1200 {
//       //     .container {
//       //         width: 1120px;
//       //     }
//       // } @else if clear-units($size) > 992 {
//       //     .container {
//       //         width: 970px;
//       //     }
//       // } @else if clear-units($size) > 768 {
//       //     .container {
//       //         width: 760px;
//       //     }
//       // }
//     }
//   } @else {
//     @include responseSize();
//   }
// }
</style>
