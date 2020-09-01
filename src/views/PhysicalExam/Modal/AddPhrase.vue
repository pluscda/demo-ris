<template>
  <b-modal
    @shown="updateItem"
    title="新增片語"
    id="dtcAddPhrase"
    :header-bg-variant="variants[0]"
    :header-text-variant="variants[1]"
    :footer-bg-variant="variants[2]"
    :footer-text-variant="variants[2]"
    size="lg"
  >
    <b-container fluid>
      <main class="main-grid-dtc">
        <b-input-group prepend="片語類型" class="mb-2">
          <b-select :options="allowPhraseTypes" v-model="allow" v-if="allowPhraseTypes.length > 1"></b-select>
          <b-input v-if="allowPhraseTypes.length == 1" readonly value="個人片語"></b-input>
        </b-input-group>
        <b-input-group prepend="片語代號" class="mb-2 w-100">
          <b-input v-model="Code" maxlength="300" placeholder="請輸入" v-if="allow != '公用片語'"></b-input>
          <div v-if="allowPhraseTypes.length > 1 && allow == '公用片語'" class="code-dtc">
            <b-input readonly value="g-"></b-input>
            <b-input v-model="Code" maxlength="300" placeholder="請輸入"></b-input>
          </div>
        </b-input-group>
        <b-input-group prepend="檢查項目" class="mb-2">
          <b-select :options="inspectsArr.slice(1,100)" v-model="type"></b-select>
        </b-input-group>
        <b-input-group prepend="片語內文" class="mb-2">
          <b-textarea v-model="Text" placeholder="請輸入" spellcheck="false" style="height:400px;"></b-textarea>
        </b-input-group>
      </main>
    </b-container>
    <template v-slot:modal-footer>
      <div class="w-100">
        <b-button variant="info" class="float-right ml-4" @click="$bvModal.hide('dtcAddPhrase')">取消</b-button>
        <b-button
          variant="success"
          class="float-right"
          @click="addPhrase"
          :disabled="!Code  || !Text "
        >確定</b-button>
      </div>
    </template>
  </b-modal>
</template>

<script>
import { store, actions } from "@/store/global.js";
let types = new Array(15).fill().map((s, i) => "Dummy " + (1 + i));
const allowPhraseTypes = sessionStorage.allowPhraseTypes.split(",");
const inspectsArr = [
  "",
  "身高",
  "體重",
  "體格指標值(BMI)",
  "血壓",
  "脈搏",
  "牙科檢查",
  "頭部顏面頸頭皮",
  "皮膚及淋巴腺",
  "鼻",
  "竇",
  "口腔",
  "咽喉",
  "肺部及胸部",
  "胸部X光",
  "腹部",
  "心臟",
  "內分泌腺",
  "血管(曲張)",
  "肛門及直腸",
  "生殖器",
  "上肢及關節",
  "下肢及關節",
  "耳器",
  "鼓膜",
  "聽力",
  "眼",
  "眼底",
  "辨色力",
  "視力",
  "神經系統",
  "精神",
  "智能",
  "心電圖",
  "梅毒",
  "愛滋",
  "血液常規檢查",
  "肝功能",
  "尿液檢查"
];
export default {
  name: "AddPhroase",
  data() {
    return {
      inspectsArr,
      inputText: "",
      type: "身高",
      item: {},
      ProcedureSerial: "",
      Text: "",
      Code: "",
      allowPhraseTypes,
      allow: "個人片語",
      variants: [
        "warning",
        "dark",
        "light",
        "warning",
        "danger",
        "info",
        "light",
        "dark"
      ]
    };
  },
  computed: {},
  methods: {
    async updateItem() {
      const obj = await this.$vlf.getItem("addPhrase");
      this.Code = "";
      this.Text = "";
      if (obj) {
        this.Code = +obj.Code;
        this.type = inspectsArr[+obj.Code];
        this.Text = obj.Text;
      }
      this.$vlf.setItem("addPhrase", "");
    },
    async addPhrase() {
      const obj = {
        Code: this.allow != "個人片語" ? "g-" + this.Code : this.Code,
        ProcedureSerial: this.inspectsArr.findIndex(s => s == this.type),
        Text: this.Text
      };

      try {
        this.allow != "個人片語"
          ? await actions.addPublicPhrase(obj)
          : await actions.addPrivatePhrase(obj);
        this.$bvToast.toast(`新增片語成功`, {
          title: "系統資訊",
          autoHideDelay: 5000,
          variant: "success"
        });
        store.editItem = { ...store.editItem };
        let arr = await this.$vlf.getItem("phrase");
        arr.push(obj);
        this.$vlf.setItem("phrase", arr);
        this.$bvModal.hide("dtcAddPhrase");
      } catch (e) {
        this.$bvToast.toast(`` + e, {
          title: "系統資訊",
          autoHideDelay: 5000,
          variant: "danger"
        });
      }
    }
  },
  async mounted() {
    //if (store.editItem) this.item = store.editItem;
  }
};
</script>

<style scoped>
p {
  font-size: 2em;
  text-align: center;
}
.input-group-text {
  width: 150px;
  max-width: 150px;
  min-width: 150px;
}
.code-dtc {
  display: grid;
  grid-template-columns: 60px minmax(400px, 525px);
}
</style>