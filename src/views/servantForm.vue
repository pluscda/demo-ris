<template>
  <div class="servant-form px-2 pb-2 mt-3" :style="{ '--globalFontSize': `${fontSize}px` }">
    <h3>臺北市兵役局役男體檢數位化系統</h3>
    <div v-if="servant">{{ servant.id }} 身分證字號條碼</div>
    <h4 class="bg-primary text-white">兵役表</h4>
    <div class="d-flex flex-wrap">
      <div class="base w-sm-100 w-md-50">
        <div class="title">基本資料</div>

        <fillTexts
          :servant="servant"
          :rows="[
            [
              { text: '姓名', name: 'name', readonly: true },
              { text: '身分證字號', name: 'id', readonly: true },
            ],
            [
              { text: '出生日期', name: 'birthday', readonly: false },
              { text: '聯絡電話', name: 'telPhone', readonly: false },
              { text: '行動電話', name: 'phone', readonly: false },
            ],
            [{ text: '戶籍地址', name: 'addr', readonly: false }],
          ]"
        />
      </div>

      <div class="w-sm-100 w-md-50 d-flex align-items-start border-right border-left border-bottom">
        <div class="history flex-1">
          <div class="title bg-success">病史</div>
          <div class="p-1">過去病史(重要疾病，手術，時地)</div>
        </div>

        <div class="head-photo">
          <img :src="require('@/assets/images/head.jpg')" />
        </div>
      </div>

      <div class="item w-sm-100 w-md-50 d-flex">
        <div class="flex-2">
          <fillTexts
            :servant="servant"
            :rows="[
              [
                { text: '身高', append: '公分', name: 'height', readonly: false },
                { text: '體重', append: '公斤', name: 'weight', readonly: false },
              ],
              [
                { text: '體格指標值', append: '(BMI)', name: 'bmi', readonly: false },
                { text: '血壓', append: 'mmHg', name: 'press', readonly: false },
              ],
              [{ text: '脈博', append: '次/分', name: 'plus', readonly: false }],
            ]"
          />
        </div>

        <div class="stamp flex-md-1 border-right">
          <div class="label text-center">檢查醫師簽章</div>
        </div>
      </div>

      <div class="item w-sm-100 w-md-50 d-flex border-left">
        <div class="flex-md-2 d-flex flex-column justify-content-between py-1">
          <div class="d-flex justify-content-between px-1">
            <div class="pr-2">6. 牙科檢查</div>
            <div class="detist">
              <span class="mr-1 text-primary">F1可矯治</span>
              <span class="mr-1 text-secondary">F2不可治缺牙(/)</span>
              <span class="mr-1 text-danger">F3齒生齒(X)</span>
              <span class="text-success">F4假商固定牙橋(XX)</span>
            </div>
          </div>

          <div class="px-1">
            <div class="tooth-mark align-items-center">
              <div class="direction">右</div>
              <div class="bot" v-for="li in 8" v-text="9 - li" :key="'li' + li"></div>
              <div class="bot" v-text="'　'" />
              <div class="bot" v-for="ri in 8" v-text="ri" :key="'ri' + ri"></div>
              <div class="direction">左</div>
              <div v-for="li in 8" v-text="9 - li" :key="'li2' + li"></div>
              <div v-text="'　'" />
              <div v-for="ri in 8" v-text="ri" :key="'ri2' + ri"></div>
            </div>
          </div>
        </div>

        <div class="stamp flex-md-1 border-left border-right">
          <div class="label text-center">檢查醫師簽章</div>
        </div>
      </div>

      <div class="item w-sm-100 w-md-50">
        <div class="d-md-flex">
          <div class="w-md-50">
            <choose :items="itemOne" />
          </div>
          <div class="w-md-50">
            <choose :items="itemTwo" />
          </div>
        </div>
      </div>

      <div class="item w-sm-100 w-md-50">
        <div class="d-md-flex">
          <div class="w-md-50">
            <choose :items="itemThree" />
          </div>
          <div class="w-md-50">
            <choose :items="itemFour" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Servants from "@/assets/js/servantDummy.js";
import choose from "@/components/forms/choose.vue";
import fillTexts from "@/components/forms/fillTexts.vue";
import { mapState } from "vuex";
export default {
  data() {
    return {
      servant: null,
      itemOne: [
        { key: 7, text: "頭部顏面頸頭皮" },
        { key: 8, text: "皮膚及淋巴腺" },
        { key: 9, text: "鼻" },
        { key: 10, text: "竇" },
        { key: 11, text: "口腔" },
        { key: 12, text: "咽喉" },
        { key: 13, text: "肺部及胸部" },
        { key: 14, text: "胸部X光" }
      ],
      itemTwo: [
        { key: 15, text: "腹部" },
        { key: 16, text: "心臟" },
        { key: 17, text: "血管(曲張)" },
        { key: 18, text: "內分沁線" },
        { key: 19, text: "肛門及直腸" },
        { key: 20, text: "生殖器" },
        { key: 21, text: "上肢及關節" },
        { key: 22, text: "下肢及關節" }
      ],
      itemThree: [
        { key: 23, text: "耳器" },
        { key: 24, text: "鼓膜" },
        {
          key: 25,
          text: "聽力",
          options: [
            { pre: "語音:右", after: "/20" },
            { pre: "左", after: "/20" },
            { pre: "金屬:右", after: "/20" },
            { pre: "左", after: "/20" }
          ]
        },
        { key: 26, text: "眼" },
        { key: 27, text: "眼底" },
        { key: 28, text: "辨色力" }
      ],
      itemFour: [
        {
          key: 29,
          text: "視力",
          options: [
            { pre: "裸視:右", after: "" },
            { pre: "左", after: "" },
            { pre: "矯正視力:右", after: "" },
            { pre: "左", after: "" },
            { pre: "驗光度數:右", after: "" },
            { pre: "左", after: "" }
          ]
        },
        { key: 30, text: "神經系統" },
        { key: 31, text: "精神" },
        { key: 32, text: "智能" },
        { key: 33, text: "心電圖" }
      ]
    };
  },
  created() {
    if (this.$route.params.id) {
      this.servant = Servants(this.$route.params.id);

      ["height", "weight", "bmi", "press", "plus"].forEach(k => {
        this.servant[k] = "";
      });
    }
  },
  computed: {
    ...mapState(["fontSize"])
  },
  components: {
    choose,
    fillTexts
  }
};
</script>

<style lang="scss">
$border-color: #ccc;
.servant-form {
  width: 100vw;
  padding-top: 59px;
  font-size: 30px;
  color: white !important;
  h3,
  h4 {
    text-align: center;
    font-size: 10px;
    color: red;
  }
  h3 {
    line-height: 1.5;
    border-bottom: 3px solid #1221ef;
  }
  h4 {
    line-height: 1.8;
  }
  .title {
    font-size: 21px;
    line-height: 2;
    text-align: center;
    color: #fff;
    font-weight: bold;
  }
  .base {
    .title {
      background-color: cyan;
    }
  }
  .head-photo {
    img {
      width: 100%;
      max-width: 120px;
    }
  }
  input[type="text"] {
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 0 5px;
    &[readonly] {
      cursor: not-allowed;
    }
  }

  .tRow {
    border-left: 1px solid $border-color;
    > div {
      border-right: 1px solid $border-color;
      border-bottom: 1px solid $border-color;
    }
  }

  .stamp {
    .label {
      background-color: #1223ea;
      color: #fff;
    }
  }

  .tooth-mark {
    display: grid;
    grid-template-columns: repeat(19, 1fr);
    grid-gap: 0;
    grid-row-gap: 0;
    > div {
      border-right: 1px solid $border-color;
      text-align: center;
      &.bot {
        border-bottom: 1px solid $border-color;
      }
      &.direction {
        border-right: none;
        grid-row: span 2;
      }
    }
  }

  .detist {
    font-size: 12px;
  }
}

@media all and (min-width: 768px) {
  .w-md-50 {
    width: 50%;
  }
}

@media all and (max-width: 768px) {
  .dtx-main-scetion {
    display: block;
    width: 100%;
  }

  .w-sm-100 {
    width: 100%;
  }

  .servant-form {
    width: 100%;
    .head-photo {
      img {
        width: 85px;
      }
    }
  }
}

@for $i from 1 through 10 {
  .flex-#{$i} {
    flex: $i 0 0;
  }
  @media all and (min-width: 768px) {
    .flex-md-#{$i} {
      flex: $i 0 0;
    }
  }

  @media all and (max-width: 768px) {
    .flex-sm-#{$i} {
      flex: $i 0 0;
    }
  }
}
</style>
