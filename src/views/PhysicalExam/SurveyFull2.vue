<template>
  <div class="survery2" ref="mySurvey">
    <h4 class="title-center mb-4 mt-4">身心狀況檢查表</h4>
    <main class="dtx-main" data-msg="第一部分" style="box-shadow: 0 30px 0 0 white;">
      <div>
        1.做過最久的工作為：
        <span>{{p1_13}}</span>
      </div>
      <div>
        2.最近是不是覺得頭痛或是頭部有壓迫感?
        <span :class="p1_1 == 1 ? 'red':''">{{p1_1 == 1 ? "是": "否"}}</span>
      </div>
      <div>
        3.最近是不是覺得心悸或是心跳加快，擔心可能得心臟病?
        <span :class="p1_2 == 1 ? 'red':''">{{p1_2 == 1 ? "是": "否"}}</span>
      </div>
      <div>
        4.最近是不是感到胸部不適或是壓迫感？
        <span :class="p1_3 == 1 ? 'red':''">{{p1_3 == 1 ? "是": "否"}}</span>
      </div>
      <div>
        5.最近是不是覺得手腳發抖或發麻？
        <span :class="p1_4 == 1 ? 'red':''">{{p1_4 == 1 ? "是": "否"}}</span>
      </div>
      <div>
        6.最近覺得睡眠不好嗎？
        <span :class="p1_5 == 1 ? 'red':''">{{p1_5 == 1 ? "是": "否"}}</span>
      </div>
      <div>
        7.最近是不是覺得許多事情對是個負擔？
        <span :class="p1_6 == 1 ? 'red':''">{{p1_6 == 1 ? "是": "否"}}</span>
      </div>
      <div>
        8.最近是不是覺得和家人、親友相處不來？
        <span :class="p1_7 == 1 ? 'red':''">{{p1_7 == 1 ? "是": "否"}}</span>
      </div>
      <div>
        9.最近是不是覺得對自己失去信心？
        <span :class="p1_8 == 1 ? 'red':''">{{p1_8 == 1 ? "是": "否"}}</span>
      </div>
      <div>
        10.最近是不是覺得神經兮兮，緊張不安？
        <span :class="p1_9 == 1 ? 'red':''">{{p1_9 == 1 ? "是": "否"}}</span>
      </div>
      <div>
        11.最近是不是感到未來毫無希望？
        <span :class="p1_10 == 1 ? 'red':''">{{p1_10 == 1 ? "是": "否"}}</span>
      </div>
      <div>
        12.最近是不是覺得家人或親友會令擔憂？
        <span :class="p1_11 == 1 ? 'red':''">{{p1_11 == 1 ? "是": "否"}}</span>
      </div>
      <div>
        13.最近是不是覺得生活毫無希望？
        <span :class="p1_12 == 1 ? 'red':''">{{p1_12 == 1 ? "是": "否"}}</span>
      </div>
    </main>

    <main class="dtx-main mt-4" data-msg="第二部分" style="box-shadow: 0 30px 0 0 white;">
      <div>
        1.認為自己身心不健康嗎（包括過去與現在）？
        <span :class="p2_1 == 4 ? 'red':''">{{p2_1 == 4 ? "是": "否"}}</span>
      </div>
      <div>
        2.認為自己一生中大部份的時間，身體總是覺得有什麼病痛嗎？
        <span :class="p2_2 == 4 ? 'red':''">{{p2_2 == 4 ? "是": "否"}}</span>
      </div>
      <div>
        3.曾有過任何身體疾病嗎？
        <span :class="p2_3 == 4 ? 'red':''">{{p2_3 == 4 ? "是": "否"}}</span>
        <ul style="list-style-type:none">
          <li>假若有什麼身體的疾病?那麼有沒有看醫生?醫生給的診斷是什麼?治療結果如何？</li>
          <li>假若有什麼身體的疾病?那麼有沒有看醫生?醫生給的診斷是什麼?治療結果如何？</li>
        </ul>
      </div>
      <div>
        4.身體是否經常不舒服，需要經常看醫生或服藥，而醫生卻檢查不出有什麼特別的身體疾病嗎？
        <span
          :class="p2_4 == 4 ? 'red':''"
        >{{p2_4 == 4 ? "是": "否"}}</span>
      </div>
      <div>
        5.曾經認為身體有某種特別的疾病，但醫生屢次檢查都說沒有病，而內心仍然以為身體有病嗎？
        <span
          :class="p2_5 == 4 ? 'red':''"
        >{{p2_5 == 4 ? "是": "否"}}</span>
      </div>
      <div>
        6.曾經因為日常生活的不安，生氣而導致嚴重的身體疾病嗎？例如：手腳癱瘓麻木、眼睛失明或耳朵聽不到聲音，或是講不出話來等等?
        <span
          :class="p2_6 == 4 ? 'red':''"
        >{{p2_6 == 4 ? "是": "否"}}</span>
      </div>
      <div>
        7.有沒有因為日常生活的不安、生氣而常常導致身體的種種不舒服？例如：拉肚子、胃痛、頭痛等等問題?
        <span
          :class="p2_7 == 4 ? 'red':''"
        >{{p2_7 == 4 ? "是": "否"}}</span>
      </div>
    </main>

    <main class="dtx-main mt-4" data-msg="第三部分" style="box-shadow: 0 30px 0 0 white;">
      <div>
        1.認為是一個神經質的人嗎？也就是說常常很容易擔心事情？或者是明天要做什麼，今天就擔心得很厲害？或是做起事來性子很急嗎？
        <span
          :class="p3_1 == 4 ? 'red':''"
        >{{p3_1 == 4 ? "是": "否"}}</span>
      </div>
      <div>
        2.曾經沒有理由，或莫名其妙地突然發生恐慌的感覺嗎？那時會覺得心慌、害怕、心跳加快嗎？
        <span
          :class="p3_2 == 4 ? 'red':''"
        >{{p3_2 == 4 ? "是": "否"}}</span>
      </div>
      <div>
        3.曾經對任何一般人不感到害怕、畏懼的事物或情境感到十分害怕嗎？
        <span :class="p3_3 == 4 ? 'red':''">{{p3_3 == 4 ? "是": "否"}}</span>
      </div>
    </main>

    <main class="dtx-main mt-4" data-msg="第四部分" style="box-shadow: 0 30px 0 0 white;">
      <div>
        1.曾經在一生中有任何一段時間情緒很憂鬱，對什麼都缺少興趣，過得很不快樂嗎？
        <span
          :class="p4_1 == 4 ? 'red':''"
        >{{p4_1 == 4 ? "是": "否"}}</span>
      </div>
      <div>
        2.曾經有一段時間什麼都不想做、沒力氣、睡不好、胃口不好，而且心情不愉快嗎？
        <span
          :class="p4_2 == 4 ? 'red':''"
        >{{p4_2 == 4 ? "是": "否"}}</span>
      </div>
      <div>
        3.曾經覺得自己的情緒沒有理由的會有或高或低的變化嗎？
        <span :class="p4_3 == 4 ? 'red':''">{{p4_3 == 4 ? "是": "否"}}</span>
      </div>
      <div>
        4.曾有一段時間，的心情變得異於尋常的高興，話也講個不停，心情高昂（或顯得容易發脾氣），覺得自己充滿自信，而且自以為很偉大嗎？
        <span
          :class="p4_4 == 4 ? 'red':''"
        >{{p4_4 == 4 ? "是": "否"}}</span>
      </div>
    </main>

    <main class="dtx-main mt-4" data-msg="第五部分" style="box-shadow: 0 30px 0 0 white;">
      <div>
        1.有沒有一些不合理的重覆、荒謬又可笑的想法，雖然不願意想它，卻又沒有辦法排除？或是會重覆的做某些事，即使不願做，又似乎不做不行？
        <span
          :class="p5_1 == 4 ? 'red':''"
        >{{p5_1 == 4 ? "是": "否"}}</span>
      </div>
      <div>
        2.曾經有過不尋常的思考內容或者想法，讓覺得不愉快，或者擔心害怕嗎？
        <span
          :class="p5_2 == 4 ? 'red':''"
        >{{p5_2 == 4 ? "是": "否"}}</span>
      </div>
      <div>
        3.曾經有任何不尋常的經驗發生，而讓覺得困擾嗎？
        <span :class="p5_3 == 4 ? 'red':''">{{p5_3 == 4 ? "是": "否"}}</span>
      </div>
      <div>
        4.曾經經驗過任何新奇的事，而那些事對別人來說是絕對不可能的？
        <span :class="p5_4 == 4 ? 'red':''">{{p5_4 == 4 ? "是": "否"}}</span>
      </div>
      <div>
        5.會相信別人可能對不利，或在跟蹤嗎？會對周圍的事特別敏感並懷疑會對不利嗎？
        <span
          :class="p5_5 == 4 ? 'red':''"
        >{{p5_5 == 4 ? "是": "否"}}</span>
      </div>
      <div>
        6.會聽到或看到一些現實不存在的聲音或影像嗎？
        <span :class="p5_6 == 4 ? 'red':''">{{p5_6 == 4 ? "是": "否"}}</span>
      </div>
      <div>
        7.認為自己不是男人嗎?
        <span :class="p5_7 == 4 ? 'red':''">{{p5_7 == 4 ? "是": "否"}}</span>
      </div>
    </main>
    <main class="dtx-main mt-4" data-msg="第六部分" style="box-shadow: 0 100px 0 0 white;">
      <div>
        1.因生活壓力造成情緒上的困擾？
        <span :class="p6_1 == 4 ? 'red':''">{{p6_1 == 4 ? "是": "否"}}</span>
      </div>
      <div>
        2.因生活壓力造成行為上的困擾？
        <span :class="p6_2 == 4 ? 'red':''">{{p6_2 == 4 ? "是": "否"}}</span>
      </div>
      <div>
        3.因生活壓力造成思考上的困擾？
        <span :class="p6_3 == 4 ? 'red':''">{{p6_3 == 4 ? "是": "否"}}</span>
      </div>
      <div>
        4.到目前為止有無使用過下列那一種成癮物質?
        <span :class="p6_4 == 4 ? 'red':''">{{p6_4 == 4 ? "是": "否"}}</span>
        <span v-if="p6_4 == 4">，種類是： {{p6_5}}</span>
      </div>
    </main>
    <div v-if="!popup" style="min-height:60px"></div>
    <footer class="mt-4 mb-4" v-if="popup">
      <b-button variant="primary" @click="$root.$emit('close-dtc-dlg-readonly')">已詳閱過</b-button>
    </footer>
  </div>
</template>
<style lang="scss" scoped>
</style>
<script>
import { store, actions } from "@/store/global.js";
const eduLevls = [
  "",
  "不識字",
  "小學",
  "國中",
  "高中高職",
  "大專大學",
  "研究所"
];
const types = ["", "未附", "已附"];
const grades = ["", "30分以下", "30-50分", "50-60分", "60分以上"];
const hasornot = ["", "有", "沒有"];
const yesno = ["", "是", "否"];
const marrys = [
  "",
  "未婚",
  "同居，以前未結婚 ",
  "已婚且住在一起 ",
  "分居",
  "同居，以前已結婚",
  "再婚",
  "離婚",
  "鰥寡"
];
let p1_1,
  p1_2,
  p1_3,
  p1_4,
  p1_5,
  p1_6,
  p1_7,
  p1_8,
  p1_9,
  p1_10,
  p1_11,
  p1_12,
  p1_13;
let p2_1, p2_2, p2_3, p2_4, p2_5, p2_6, p2_7;
let p3_1, p3_2, p3_3;
let p4_1, p4_2, p4_3, p4_4;
let p5_1, p5_2, p5_3, p5_4, p5_5, p5_6, p5_7;
let p6_1, p6_2, p6_3, p6_4, p6_5, p6_6;
export default {
  data() {
    return {
      edu: "",
      grade: "",
      driveLic: "",
      work: "",
      disable: "",
      selfDestory: "",
      crazyb4: "",
      crazyPaid: "",
      brainBreak: "",
      marry: "",
      goodHealth: "",
      liveWith: [],
      waves: [],
      attched: "",
      attchedText: "",
      skins: [],
      lung: "",
      airLungs: [],
      lungs: [],
      bones: [],
      eyes: [],
      py: "",
      lastone: "",
      innterOthers: [],
      formHistory: {},
      holders: {},
      p1_1,
      p1_2,
      p1_3,
      p1_4,
      p1_5,
      p1_6,
      p1_7,
      p1_8,
      p1_9,
      p1_10,
      p1_11,
      p1_12,
      p1_13,
      p2_1,
      p2_2,
      p2_3,
      p2_4,
      p2_5,
      p2_6,
      p2_7,
      p3_1,
      p3_2,
      p3_3,
      p4_1,
      p4_2,
      p4_3,
      p4_4,
      p5_1,
      p5_2,
      p5_3,
      p5_4,
      p5_5,
      p5_6,
      p5_7,
      p6_1,
      p6_2,
      p6_3,
      p6_4,
      p6_5,
      p6_6
    };
  },
  props: ["popup"],
  methods: {},
  async mounted() {
    const items = await window.axios.get(
      "military/Answers?militaryIdNo=" + store.editItem.IdNo
    );
    let item = items.find(s => s.QuestionNo == "3.1");
    item ? (this.p1_1 = item.Value) : "";
    item = items.find(s => s.QuestionNo == "3.2");
    item ? (this.p1_2 = item.Value) : "";
    item = items.find(s => s.QuestionNo == "3.3");
    item ? (this.p1_3 = item.Value) : "";
    item = items.find(s => s.QuestionNo == "3.4");
    item ? (this.p1_4 = item.Value) : "";
    item = items.find(s => s.QuestionNo == "3.5");
    item ? (this.p1_5 = item.Value) : "";
    item = items.find(s => s.QuestionNo == "3.6");
    item ? (this.p1_6 = item.Value) : "";
    item = items.find(s => s.QuestionNo == "3.7");
    item ? (this.p1_7 = item.Value) : "";
    item = items.find(s => s.QuestionNo == "3.8");
    item ? (this.p1_8 = item.Value) : "";
    item = items.find(s => s.QuestionNo == "3.9");
    item ? (this.p1_9 = item.Value) : "";
    item = items.find(s => s.QuestionNo == "3.10");
    item ? (this.p1_10 = item.Value) : "";
    item = items.find(s => s.QuestionNo == "3.11");
    item ? (this.p1_11 = item.Value) : "";
    item = items.find(s => s.QuestionNo == "3.12");
    item ? (this.p1_12 = item.Value) : "";
    item = items.find(s => s.QuestionNo == "3.13");
    item ? (this.p1_13 = item.Value) : "";
    //part 2
    item = items.find(s => s.QuestionNo == "4.A.1");
    item ? (this.p2_1 = item.Value) : "";
    item = items.find(s => s.QuestionNo == "4.A.2");
    item ? (this.p2_2 = item.Value) : "";
    item = items.find(s => s.QuestionNo == "4.A.3");
    item ? (this.p2_3 = item.Value) : "";
    item = items.find(s => s.QuestionNo == "4.A.4");
    item ? (this.p2_4 = item.Value) : "";
    item = items.find(s => s.QuestionNo == "4.A.5");
    item ? (this.p2_5 = item.Value) : "";
    item = items.find(s => s.QuestionNo == "4.A.6");
    item ? (this.p2_6 = item.Value) : "";
    item = items.find(s => s.QuestionNo == "4.A.7");
    item ? (this.p2_7 = item.Value) : "";

    item = items.find(s => s.QuestionNo == "4.B.1");
    item ? (this.p3_1 = item.Value) : "";
    item = items.find(s => s.QuestionNo == "4.B.2");
    item ? (this.p3_2 = item.Value) : "";
    item = items.find(s => s.QuestionNo == "4.B.3");
    item ? (this.p3_3 = item.Value) : "";

    item = items.find(s => s.QuestionNo == "4.C.1");
    item ? (this.p4_1 = item.Value) : "";
    item = items.find(s => s.QuestionNo == "4.C.2");
    item ? (this.p4_2 = item.Value) : "";
    item = items.find(s => s.QuestionNo == "4.C.3");
    item ? (this.p4_3 = item.Value) : "";
    item = items.find(s => s.QuestionNo == "4.C.4");
    item ? (this.p4_4 = item.Value) : "";

    item = items.find(s => s.QuestionNo == "4.D.1");
    item ? (this.p5_1 = item.Value) : "";
    item = items.find(s => s.QuestionNo == "4.D.2");
    item ? (this.p5_2 = item.Value) : "";
    item = items.find(s => s.QuestionNo == "4.D.3");
    item ? (this.p5_3 = item.Value) : "";
    item = items.find(s => s.QuestionNo == "4.D.4");
    item ? (this.p5_4 = item.Value) : "";
    item = items.find(s => s.QuestionNo == "4.D.5");
    item ? (this.p5_5 = item.Value) : "";
    item = items.find(s => s.QuestionNo == "4.D.6");
    item ? (this.p5_6 = item.Value) : "";
    item = items.find(s => s.QuestionNo == "4.D.7");
    item ? (this.p5_7 = item.Value) : "";

    item = items.find(s => s.QuestionNo == "4.E.1");
    item ? (this.p6_1 = item.Value) : "";
    item = items.find(s => s.QuestionNo == "4.E.2");
    item ? (this.p6_2 = item.Value) : "";
    item = items.find(s => s.QuestionNo == "4.E.3");
    item ? (this.p6_3 = item.Value) : "";
    item = items.find(s => s.QuestionNo == "4.F");
    item ? (this.p6_4 = item.Value) : "";
    const last = items.find(s => s.QuestionNo == "4.F#13");
    last && last.Text ? (this.p6_5 = item.Text + ",和 " + last.Text) : "";
  }
};
</script>
<style lang="scss" scoped>
.survery2 {
  display: flex;
  flex-direction: column;
  padding-top: 12px;
  padding-left: 4px;
  max-height: calc(100px);
  height: 100px;
  background: white;
  .dtx-main {
    //margin-top: 40px !important;
    position: relative;
    display: block;
    background: #fafafa;
    padding-top: 10px;
    &::before {
      content: attr(data-msg);
      position: absolute;
      top: 0px;
      left: 20px;
      height: calc(100% + 0px);
      width: 40px;
      writing-mode: vertical-rl;
      font-weight: bold;
      font-size: 20px;
      background: #ccc;
      text-align: center;
      padding-right: 5px;
    }
  }
  .dtx-main > div {
    margin-bottom: 10px;
    padding-left: 5rem;
  }
}

.title-center {
  align-self: center;
  justify-self: center;
}

.red {
  color: #930000;
}
footer {
  display: grid;
  place-items: center;
}
</style>
