<template>
  <div>
    <header class="header-row">
      <div>牙科檢查</div>
      <b-check switch size="lg" v-model="pass" value="1" class="mt-1">正常</b-check>
      <b-check switch size="lg" v-model="pass" value="2" class="mt-1">異常</b-check>
      <b-button variant="primary" size="sm" @click="save">儲存 (F2)</b-button>
    </header>
    <section class="my-item">
      <div class="types-tee">
        <b-button
          size="sm"
          variant="success"
          @click="f1 = true; f2 = false;f3=false;f4=false;f5=false;"
        >
          <span v-if="f1">
            <i class="fas fa-check"></i>
          </span>
          可矯治(O)
        </b-button>
        <b-button
          size="sm"
          variant="primary"
          @click="f1 = false; f2 = true;f3=false;f4=false;f5=false;"
        >
          <span v-if="f2">
            <i class="fas fa-check"></i>
          </span>不可治(/)
        </b-button>
        <b-button
          size="sm"
          variant="danger"
          @click="f1 = false; f2 = false;f3=true;f4=false;f5=false;"
        >
          <span v-if="f3">
            <i class="fas fa-check"></i>
          </span>缺齒齟生齒(X)
        </b-button>
        <b-button
          size="sm"
          variant="info"
          @click="f1 =false; f2 = false;f3=false;f4=true;f5=false;"
        >
          <span v-if="f4">
            <i class="fas fa-check"></i>
          </span>假牙固定牙橋(XX)
        </b-button>
        <b-button
          size="sm"
          variant="warning"
          @click="f1 = false; f2 = false;f3=false;f4=false;f5=true;"
        >
          <span v-if="f5">
            <i class="fas fa-check"></i>
          </span>重置狀態
        </b-button>
      </div>
      <main class="input-area">
        <div id="R8U">8</div>
        <div id="R7U">7</div>
        <div id="R6U">6</div>
        <div id="R5U">5</div>
        <div id="R4U">4</div>
        <div id="R3U">3</div>
        <div id="R2U">2</div>
        <div id="R1U">1</div>
        <div></div>
        <div id="L1U">1</div>
        <div id="L2U">2</div>
        <div id="L3U">3</div>
        <div id="L4U">4</div>
        <div id="L5U">5</div>
        <div id="L6U">6</div>
        <div id="L7U">7</div>
        <div id="L8U">8</div>
        <div class="no-bottom" id="R8D">8</div>
        <div class="no-bottom" id="R7D">7</div>
        <div class="no-bottom" id="R6D">6</div>
        <div class="no-bottom" id="R5D">5</div>
        <div class="no-bottom" id="R4D">4</div>
        <div class="no-bottom" id="R3D">3</div>
        <div class="no-bottom" id="R2D">2</div>
        <div class="no-bottom" id="R1D">1</div>
        <div class="no-bottom"></div>
        <div class="no-bottom" id="L1D">1</div>
        <div class="no-bottom" id="L2D">2</div>
        <div class="no-bottom" id="L3D">3</div>
        <div class="no-bottom" id="L4D">4</div>
        <div class="no-bottom" id="L5D">5</div>
        <div class="no-bottom" id="L6D">6</div>
        <div class="no-bottom" id="L7D">7</div>
        <div class="no-bottom" id="L8D">8</div>
      </main>
      <b-popover
        :target="'R' + item + 'Ux' "
        v-for="item in eight"
        :key="item"
        triggers="hover"
        placement="bottom"
      >
        <template v-slot:title>牙科檢查</template>
        <b-button
          variant="success"
          size="sm"
          @click="clickF1('R' + item + 'U','R' + item + 'U')"
        >可矯治</b-button>
        <b-button
          variant="primary"
          size="sm"
          @click="clickF2('R' + item + 'U','R' + item + 'U')"
          class="ml-1"
        >不可治</b-button>
        <b-button
          variant="danger"
          size="sm"
          @click="clickF3('R' + item + 'U','R' + item + 'U')"
          class="ml-1"
        >缺齒齟生齒</b-button>
        <b-button
          variant="info"
          size="sm"
          @click="clickF4('R' + item + 'U','R' + item + 'U')"
          class="ml-1"
        >假牙固定牙橋</b-button>
        <b-button
          variant="secondary"
          size="sm"
          @click="clickReset('R' + item + 'U','R' + item + 'U')"
          class="ml-1"
        >重置</b-button>
      </b-popover>

      <b-popover
        :target="'L' + item +'Ux' "
        v-for="item in eight"
        :key="item"
        triggers="hover"
        placement="bottom"
      >
        <template v-slot:title>牙科檢查</template>
        <b-button variant="success" size="sm" @click="clickF1('L' + item + 'U','L' + item +'U')">可矯治</b-button>
        <b-button
          variant="primary"
          size="sm"
          class="ml-1"
          @click="clickF2('L' + item + 'U','L' + item +'U')"
        >不可治</b-button>
        <b-button
          variant="danger"
          size="sm"
          class="ml-1"
          @click="clickF3('L' + item + 'U','L' + item +'U')"
        >缺齒齟生齒</b-button>
        <b-button
          variant="info"
          size="sm"
          class="ml-1"
          @click="clickF4('L' + item + 'U','L' + item +'U')"
        >假牙固定牙橋</b-button>
        <b-button
          variant="secondary"
          size="sm"
          @click="clickReset('L' + item + 'U','L' + item +'U')"
          class="ml-1"
        >重置</b-button>
      </b-popover>

      <b-popover
        :target="'R' + item + 'Dx' "
        v-for="item in eight"
        :key="item"
        triggers="hover"
        placement="top"
      >
        <template v-slot:title>牙科檢查</template>
        <b-button
          variant="success"
          size="sm"
          @click="clickF1('R' + item + 'D','R' + item + 'D')"
        >可矯治</b-button>
        <b-button
          variant="primary"
          size="sm"
          class="ml-1"
          @click="clickF2('R' + item + 'D','R' + item + 'D')"
        >不可治</b-button>
        <b-button
          variant="danger"
          size="sm"
          class="ml-1"
          @click="clickF3('R' + item + 'D','R' + item + 'D')"
        >缺齒齟生齒</b-button>
        <b-button
          variant="info"
          size="sm"
          class="ml-1"
          @click="clickF4('R' + item + 'D','R' + item + 'D')"
        >假牙固定牙橋</b-button>
        <b-button
          variant="secondary"
          size="sm"
          @click="clickReset('R' + item + 'D','R' + item + 'D')"
          class="ml-1"
        >重置</b-button>
      </b-popover>

      <b-popover
        :target="'L' + item +'Dx' "
        v-for="item in eight"
        :key="item"
        triggers="hover"
        placement="top"
      >
        <template v-slot:title>牙科檢查</template>
        <b-button variant="success" size="sm" @click="clickF1('L' + item + 'D','L' + item +'D')">可矯治</b-button>
        <b-button
          variant="primary"
          size="sm"
          class="ml-1"
          @click="clickF2('L' + item + 'D','L' + item +'D')"
        >不可治</b-button>
        <b-button
          variant="danger"
          size="sm"
          class="ml-1"
          @click="clickF3('L' + item + 'D','L' + item +'D')"
        >缺齒齟生齒</b-button>
        <b-button
          variant="info"
          size="sm"
          class="ml-1"
          @click="clickF4('L' + item + 'D','L' + item +'D')"
        >假牙固定牙橋</b-button>
        <b-button
          variant="secondary"
          size="sm"
          @click="clickReset('L' + item + 'D','L' + item +'D')"
          class="ml-1"
        >重置</b-button>
      </b-popover>

      <div class="main-area">
        <div>
          <header class="my-note1">臨時記載</header>
          <b-textarea placeholder="請輸入" spellcheck="false" v-model="item.GeneralComments"></b-textarea>
        </div>
        <div>
          <header class="my-note2">各項缺點之總評(包括儀表缺失)</header>
          <b-textarea placeholder="請輸入" spellcheck="false" v-model="item.JudgementAdvice"></b-textarea>
        </div>
        <div>
          <header class="my-note3">註記</header>
          <b-textarea placeholder="請輸入" spellcheck="false" v-model="item.Note"></b-textarea>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import { store, actions } from "@/store/global.js";
const eight = [1, 2, 3, 4, 5, 6, 7, 8];
let f1,
  f2,
  f3,
  f4,
  f5 = true;
export default {
  data() {
    return {
      pass: 1,
      eight,
      item: {},
      maps: new Map(),
      f1,
      f2,
      f3,
      f4,
      f5
    };
  },
  methods: {
    async saveItem() {
      const obj = {
        MilitaryId: store.editItem.Id,
        Serial: 6,
        SubSerial: "",
        Action: 1,
        Value: 0,
        Note: this.item.Note,
        JudgementAdvice: this.item.JudgementAdvice,
        GeneralComments: this.item.GeneralComments,
        Signature: "",
        Judge: +this.pass
      };
      try {
        const ret = await actions.updateExamInfo(obj);
        if(ret == "errors") return;
        this.$bvToast.toast(`儲存成功`, {
          title: "檢查狀態",
          autoHideDelay: 5000,
          variant: "success"
        });
        store.editItem = { ...store.editItem };
      } catch (e) {
        alert(e);
      }
    },
    normorlize() {
      const arr = [];
      const obj = {
        Serial: 6,
        Action: 1,
        Note: this.item.Note,
        JudgementAdvice: this.item.JudgementAdvice,
        GeneralComments: this.item.GeneralComments,
        Signature: "",
        Judge: +this.pass
      };
      for (let [key, value] of this.maps) {
        obj.SubSerial = key;
        obj.Value = "" + value;
        arr.push({ ...obj });
      }
      return arr;
    },
    async save() {
      if (!this.maps.size) {
        this.saveItem();
      } else {
        const arr = this.normorlize();
        const obj = {
          MilitaryId: store.editItem.Id,
          Examines: [...arr]
        };
        try {
          const ret = await actions.updateExamInfos(obj);
          if(ret == "errors") return;
          this.$bvToast.toast(`儲存成功`, {
            title: "檢查狀態",
            autoHideDelay: 5000,
            variant: "success"
          });
          store.editItem = { ...store.editItem };
        } catch (e) {
          alert(e);
        }
      }
    },
    removeClass(el) {
      el.classList.remove("canFix");
      el.classList.remove("canNotFix");
      el.classList.remove("canX");
      el.classList.remove("canXX");
    },
    clickReset(str) {
      const el = document.querySelector("#" + str);
      this.removeClass(el);
      this.maps.delete(str);
    },
    clickF1(str) {
      this.maps.set(str, 1);
      const el = document.querySelector("#" + str);
      this.removeClass(el);
      el.classList.add("canFix");
    },
    clickF2(str) {
      this.maps.set(str, 2);
      const el = document.querySelector("#" + str);
      this.removeClass(el);
      el.classList.add("canNotFix");
    },
    clickF3(str) {
      this.maps.set(str, 3);
      const el = document.querySelector("#" + str);
      this.removeClass(el);
      el.classList.add("canX");
    },
    clickF4(str) {
      this.maps.set(str, 4);
      const el = document.querySelector("#" + str);
      this.removeClass(el);
      el.classList.add("canXX");
    },
    initUi() {
      const items = store.savedExam.filter(s => s.Serial == 6 && s.SubSerial);
      const item = store.savedExam.find(s => s.Serial == 6);
      if (items && items.length) {
        items.forEach((s, i) => {
          s.Value = Number(s.Value);
          switch (s.Value) {
            case 1:
              this.clickF1(s.SubSerial);
              break;
            case 2:
              this.clickF2(s.SubSerial);
              break;
            case 3:
              this.clickF3(s.SubSerial);
              break;
            case 4:
              this.clickF4(s.SubSerial);
              break;
          }
        });
        this.item = items[0];
        this.pass = items[0].Judge;
      } else if (item) {
        this.item = item;
        this.pass = this.item.Judge;
      }
    }
  },
  mounted() {
    requestAnimationFrame(() => this.initUi());
    const els = [...document.querySelectorAll(".input-area > div[id]")];
    els.forEach(el => {
      el.addEventListener("click", e => {
        //alert(e.target.id);
        if (this.f1) {
          this.clickF1(e.target.id);
        } else if (this.f2) {
          this.clickF2(e.target.id);
        } else if (this.f3) {
          this.clickF3(e.target.id);
        } else if (this.f4) {
          this.clickF4(e.target.id);
        } else {
          this.clickReset(e.target.id);
        }
      });
    });
  }
};
</script>
<style lang="scss" scoped>
.my-item {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 540px);
  position: relative;
}
.input-area {
  //border: 1px solid white;
  width: max-content;
  position: relative;
  display: grid;
  padding: 8px;
  padding-left: 2.5rem;
  grid-template-columns: repeat(17, 50px);
  > div {
    border-right: 1px solid white;
    border-bottom: 1px solid white;
    text-align: center;
    cursor: pointer;
    position: relative;
  }
  &::before,
  &::after {
    content: "右";
    position: absolute;
    left: 12px;
    top: 50%;
    font-size: 20px;
    color: white;
    transform: translateY(-50%);
  }
  &::after {
    content: "左";
    left: auto;
    right: -20px;
    top: 50%;
  }
}
.main-area {
  min-height: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  textarea {
    min-height: 100%;
  }
}
.my-note1,
.my-note2,
.my-note3 {
  height: 30px;
  font-size: 20px;
  background: var(--info);
  color: white;
  border-radius: 5px;
  padding-left: 10px;
}
.my-note2 {
  background: var(--success);
}
.my-note3 {
  background: var(--primary);
}

.header-row {
  height: 40px;
  font-size: 20px;
  background: #cbcbcb;
  color: black;
  border-radius: 5px;
  padding-left: 10px;
  display: grid;
  grid-template-columns: repeat(34, max-content);
  grid-gap: 1rem;
  > div {
    line-height: 40px;
  }
  button {
    max-height: 35px;
    margin-top: 3px;
    line-height: 12px;
  }
}
.no-bottom {
  border-bottom: none !important;
}
.types-tee {
  display: grid;
  margin-left: 20px;
  padding-top: 10px;
  padding-bottom: 10px;
  grid-template-columns: repeat(24, max-content);
  grid-gap: 1rem;
}

.input-area > div.canFix::after,
.input-area > div.canNotFix::after,
.input-area > div.canXX::after,
.input-area > div.canX::after {
  position: absolute;
  content: "O";
  color: var(--success);
  font-size: 30px;
  top: -9px;
  left: 50%;
  transform: translateX(-50%);
}
.input-area > div.canNotFix::after {
  content: "/";
  color: var(--primary);
  font-size: 27px;
  font-weight: bold;
}
.input-area > div.canX::after {
  content: "X";
  color: var(--danger);
  font-size: 27px;
}

.input-area > div.canXX::after {
  content: "XX";
  color: var(--info);
  font-size: 27px;
  left: 25%;
  transform: translateX(-25%);
}
</style>

<style>
.popover {
  max-width: 600px !important;
}
</style>
