<template>
  <div class="pageContent" style="min-height:829px;">
    <b-card id="blockBaseInfo" no-body class="mx-1">
      <b-card-header class="bg-primary text-white cardHeader">
        <b-row no-gutters>
          <b-col cols="6" class="float-left text-left">交班紀錄登打頁面</b-col>
        </b-row>
      </b-card-header>
      <b-card-text class="text-left py-1 m-0">
        <b-container id="baseInfo" fluid class="px-1">
          <b-row no-gutters>
            <b-col sm="2" class="px-1">
              <b-input-group prepend="檢查單號">
                <b-input v-model="masterData.AccessionNo" readonly />
              </b-input-group>
            </b-col>
            <b-col sm="2" class="px-1">
              <b-input-group prepend="開單日期">
                <b-input v-model="masterData.OrderDate" readonly />
              </b-input-group>
            </b-col>
            <b-col sm="2" class="px-1">
              <b-input-group prepend="作業進度">
                <b-input v-model="masterData.StatusName" readonly />
              </b-input-group>
            </b-col>

            <b-col sm="2" class="px-1">
              <b-input-group prepend="病患來源">
                <b-input v-model="masterData.PatientSourceTypeName" readonly />
              </b-input-group>
            </b-col>
            <b-col sm="2" class="px-1">
              <b-input-group prepend="檢查項目">
                <b-input v-model="masterData.ProcedureName" readonly />
              </b-input-group>
            </b-col>
            <b-col sm="2" class="px-1">
              <b-input-group prepend="儀器類型">
                <b-input v-model="masterData.DeviceName" readonly />
              </b-input-group>
            </b-col>
          </b-row>
          <b-row no-gutters class="mt-1">
            <b-col sm="4" class="px-1">
              <b-input-group prepend="病患姓名">
                <b-input v-model="masterData.PatientName" readonly />
              </b-input-group>
            </b-col>
            <b-col sm="2" class="px-1">
              <b-input-group prepend="病歷編號">
                <b-input v-model="masterData.PatientId" readonly />
              </b-input-group>
            </b-col>
            <b-col sm="2" class="px-1">
              <b-input-group prepend="性別">
                <b-input v-model="masterData.PatientSex" readonly />
              </b-input-group>
            </b-col>
            <b-col sm="2" class="px-1">
              <b-input-group prepend="身分證號">
                <b-input v-model="masterData.OtherPatientId" readonly />
              </b-input-group>
            </b-col>
            <b-col sm="2" class="px-1">
              <b-input-group prepend="病患年齡">
                <b-input v-model="masterData.PatientAge" readonly />
              </b-input-group>
            </b-col>
          </b-row>
        </b-container>
      </b-card-text>
    </b-card>
    <b-card no-body header-class="p-1" class="mx-1 mt-0">
      <b-card-header class="bg-dark p-0 text-white cardHeader">
        <b-row no-gutters class="ml-0">
          <b-col class="text-center">
            交班紀錄
            <div class="float-left pl-1 py-1">
              <b-btn ref="btnAppend" variant="danger" size="sm" @click="putContent"> <i class="far fa-save"></i> 存檔 </b-btn>
              <b-button variant="info" size="sm" class="ml-1" to="FI0305" replace> <i class="fas fa-reply"></i> 返回 </b-button>
            </div>
          </b-col>
        </b-row>
      </b-card-header>
      <b-card-text class="height">
        <b-row class="m-2">
          <b-col cols="6">
            <b-textarea :autofocus="focus" rows="23" placeholder="請填寫紀錄…" no-resize v-model.trim="record.ShiftNote" />
          </b-col>
          <b-col cols="6">
            <b-card border-variant="dark" header="報告紀錄" header-bg-variant="light" header-text-variant="dark" align="center" class="record-header">
              <h6 class="text-left ml-1">醫師：{{ this.masterData.ShiftPhysicianName }}</h6>
              <b-card-text>
                <b-textarea readonly rows="20" no-resize v-model="masterData.ShiftNote" />
              </b-card-text>
            </b-card>
          </b-col>
        </b-row>
        <!-- </b-row> -->
        <!-- </b-input-group> -->
      </b-card-text>
    </b-card>
  </div>
</template>
<script>
import { DataManager, WebApiAdaptor, Query } from "@syncfusion/ej2-data";
import * as configs from "@/config";

export default {
  name: "FI0203-1",
  components: {},
  data() {
    return {
      ObjApp: null,
      pastShiftNote: "asdfasdf",
      record: {
        AccessionNo: "",
        ShiftNote: ""
      },
      focus: true,
      masterData: null,
      MedicationContent: [],
      medicineList: {
        classSelectedItem: "",
        classOptionsItem: ["A", "B"],
        selectedItem: "",
        optionsItem: ["A", "B"],
        qty: 0
      },
      //是否可以輸入資料
      inputDisable: false,
      medicineDisable: true
    };
  },
  methods: {
    //取得藥品資料
    async GetMedicationData() {
      //呼叫modal 將相關資料打入...
      //打API取得藥品相關資料 SHOW在MedicationContent裡面
      let subPath = "../exam/GetExamMedicationList" + "?accessionNo=" + this.masterData.AccessionNo;

      //
      let data = null;
      await new DataManager({
        url: configs.publicPath + subPath,
        adaptor: new WebApiAdaptor(),
        crossDomain: true
      })
        .executeQuery(new Query())
        .then(r => {
          let data = r.actual.Items; //資料;
          this.MedicationContent = data;
        });
    },
    async getContent() {},
    async putContent() {
      let note = this.record;
      let status = false;
      this.record.AccessionNo = this.masterData.AccessionNo;
      console.log(this.record);
      if (this.record.ShiftNote.length == 0) {
        this.ObjApp.TimingMessage("編輯處不可為空白", 2);
      } else {
        await window.axios
          .put("/exam/SaveShiftNote", note)
          .then(r => {
            console.log(r);
            status = true;
          })
          .catch(e => {
            console.error(e);
            status = false;
            alert("ng");
          });
        if (status) {
          this.$router.replace({ path: "/MI03/FI0305" });
          this.ObjApp.TimingMessage("資料已更新完成");
        } else {
          this.ObjApp.TimingMessage("資料已更新失敗", 2);
        }
      }
    }
    //返回上一頁
  },

  created() {
    this.masterData = this.$route.params.patientData;
    console.log(this.masterData);

    this.GetMedicationData();
    //訊息小工具
    let obj = this.$GetApp(this);
    if (obj) {
      this.ObjApp = obj[0];
      this.VueNestLevel = obj[1];
      console.log(this.$logs(`Vue Nesting Level ${this.VueNestLevel}`));
    } else {
      console.log(this.$logs("Fail to get App.vue ref."));
    }
  }
};
</script>
<style lang="scss" scope>
* {
  // border: 1px solid;
}
.record-header {
  margin: 0px;
}
.card-header {
  padding: 5px;
}
.card-body {
  // background-color: red;
  padding: 5px;
}
</style>
