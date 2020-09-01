<template>
  <div class="pageContent" style="min-height:829px;">
    <b-card id="blockBaseInfo" no-body class="mx-1">
      <b-card-header class="bg-primary text-white cardHeader">
        <b-row no-gutters>
          <b-col cols="6" class="float-left text-left">藥品耗材登打頁面</b-col>
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
          </b-row>
          <b-row no-gutters class="mt-1">
            <b-col sm="2" class="px-1">
              <b-input-group prepend="檢查代碼">
                <b-input v-model="masterData.ProcedureCode" readonly />
              </b-input-group>
            </b-col>
            <b-col sm="6" class="px-1">
              <b-input-group prepend="檢查項目">
                <b-input v-model="masterData.ProcedureName" readonly />
              </b-input-group>
            </b-col>
          </b-row>
        </b-container>
      </b-card-text>
    </b-card>
    <b-card no-body class="mx-1">
      <b-card-text>
        <b-row no-gutters>
          <b-col>
            <div class="float-left ml-1 py-1">
              <b-btn ref="btnAppend" variant="danger" size="sm" @click="addMedication">
                <i class="fas fa-plus"></i> 新增藥品
              </b-btn>
              <!-- v-if="showbtn==1" -->
              <b-btn
                ref="btnAppend"
                v-if="showSave"
                variant="danger"
                class="ml-1"
                size="sm"
                @click="SaveAll"
              >
                <font-awesome-icon icon="save" class="mr-1" />儲存
              </b-btn>
              <!-- v-if="showbtn==0 || this.masterData.IsMedicationActionName=='已完成'" -->
              <!--  :disabled="this.masterData.IsMedicationActionName=='已完成'" -->
              <b-btn
                ref="btnAppend"
                v-if="showNoData"
                :disabled="disabledNoData"
                variant="danger"
                class="ml-1"
                size="sm"
                @click="SaveAll"
              >
                <font-awesome-icon icon="save" class="mr-1" />無藥品登打
              </b-btn>
              <b-button variant="info" size="sm" class="ml-1" @click="reply">
                <i class="fas fa-reply"></i> 返回
              </b-button>
            </div>
          </b-col>
        </b-row>
        <!-- :CheckBox1Func="EditMedication" -->
        <twp
          ref="medicationList"
          v-bind:FieldConfig="MedicationConfig"
          :RowData="MedicationContent"
          :OpButton1Func="addCount"
          OpButton1Text="+"
          :OpButton2Func="cutCount"
          OpButton2Text="-"
          :OpButton3Func="delData"
          OpButton3Text="刪除"
        ></twp>
      </b-card-text>
    </b-card>
    <b-modal
      ref="medicineMaintain"
      centered
      hide-footer
      title-class="lang-zh-Hant-TW"
      body-class="lang-zh-Hant-TW"
    >
      <template slot="modal-title">檢查項目:{{ masterData.ProcedureName }}</template>
      <b-container fluid>
        <!-- 20191231移除 直接帶入所有的藥品耗材 -->
        <!-- <b-row class="mt-1">
          <b-col>
            <b-input-group>
              <b-input-group-text slot="prepend" class="field-Must">類別名稱</b-input-group-text>
              <b-select
                :disabled="inputDisable"
                @change="changeList"
                v-model="medicineList.classSelectedItem"
                :options="medicineList.classOptionsItem"
                class="font-weight-bold"
              ></b-select>
            </b-input-group>
          </b-col>
        </b-row>-->
        <b-row>
          <b-col cols="12" class="mt-1">
            <b-input-group>
              <b-input-group-text slot="prepend" list="my-list-id" class="field-Must">藥品耗材</b-input-group-text>
              <!-- v-on:submit.prevent="Filter" -->
              <!-- v-on:blur="Filter" -->
              <!-- v-on:keyup="keyupDelay(Filter, 250)" -->
              <b-form-input
                v-model.lazy="medicineList.selectedItem"
                list="my-list-id"
                debounce="500"
              ></b-form-input>
              <!--  :disabled="medicineDisable" -->
              <datalist id="my-list-id">
                <option
                  v-for="optionsItem in filterSelectedItem"
                  v-bind:key="optionsItem.idx"
                >{{ optionsItem.No }}--{{ optionsItem.Name }}--{{ optionsItem.SubName }}</option>
              </datalist>
            </b-input-group>
          </b-col>
          <!-- <b-col cols="12" class="mt-1">
             <b-input-group>
              <b-input-group-text slot="prepend" list="my-list-id" class="field-Must">部門藥品</b-input-group-text>
              <b-form-input v-model="medicineList.selectedItem" list="my-list-id"></b-form-input>
            
              <datalist id="my-list-id">
                <option v-for="(optionsItem, idx) in medicineList.optionsItems" v-bind:key="optionsItem.idx"
                  >{{ optionsItem.id }}--{{ optionsItem.value }}--{{ optionsItem.text }}</option
                >
              </datalist>
            </b-input-group>
          </b-col>-->
          <b-col cols="12" class="mt-1">
            <b-input-group prepend="計價方式">
              <b-select v-model="medicineList.selectType" :options="medicineList.optionsType" />
            </b-input-group>
          </b-col>
          <b-col cols="12" class="mt-1">
            <b-input-group>
              <b-input-group-text slot="prepend" class="field-Must">使用數量</b-input-group-text>
              <b-input
                type="number"
                min="1"
                v-model="medicineList.qty"
                class="text-left font-weight-bold"
              />
            </b-input-group>
          </b-col>
        </b-row>
        <b-row class="mt-1"></b-row>
        <b-row class="mt-1">
          <b-col class="text-right">
            <b-btn variant="info" class="mr-1" @click="cancel">
              <b>
                <i class="fas fa-trash"></i> 取消
              </b>
            </b-btn>
            <b-btn variant="danger" @click="SaveMedication">
              <b>
                <i class="fas fa-save"></i> 確認
              </b>
            </b-btn>
          </b-col>
        </b-row>
      </b-container>
    </b-modal>
    <b-modal
      ref="confirm"
      centered
      hide-footer
      title-class="lang-zh-Hant-TW"
      body-class="lang-zh-Hant-TW"
      title="資料有異動 是否儲存"
    >
      <b-row class="mt-1">
        <b-col class="text-right">
          <b-btn variant="info" class="mr-1" @click="CancelSave">
            <b>
              <i class="fas fa-trash"></i> 取消
            </b>
          </b-btn>
          <b-btn variant="danger" @click="confirmSave">
            <b>
              <i class="fas fa-save"></i> 確認
            </b>
          </b-btn>
        </b-col>
      </b-row>
    </b-modal>
    <b-modal
      ref="showMessage"
      header-bg-variant="danger"
      header-text-variant="light"
      hide-footer
      title="貼心提醒"
    >
      <p>此筆檢查目前為無藥品狀態，是否繼續輸入藥品資料?</p>
      <b-btn variant="danger" @click="showmedicineMaintain">
        <b>
          <i class="fas fa-save"></i> 確認
        </b>
      </b-btn>
      <b-btn variant="info" class="mr-1" @click="hideessage">
        <b>
          <i class="fas fa-trash"></i> 取消
        </b>
      </b-btn>
    </b-modal>
  </div>
</template>
<script>
import { DataManager, WebApiAdaptor, Query } from "@syncfusion/ej2-data";
import * as configs from "@/config";
import Swal from "sweetalert2";
import twp from "@/components/TWPv5_1";
export default {
  name: "FI0203-1",
  components: { twp },
  data() {
    return {
      //按鈕顯示控制
      //儲存按鈕是否顯示
      showSave: true,
      //無藥品登打按鈕是否顯示
      showNoData: true,
      //無藥品登打按鈕是否啟用
      disabledNoData: true,

      isEditing: false,
      masterData: null,
      MedicationConfig: [
        {
          key: "No",
          label: "項次",
          sortable: false,
          thClass: "text-nowrap",
          tdClass: "text-nowrap text-right"
        },
        {
          key: "PriceType",
          label: "計價方式",
          sortable: false,
          thClass: "text-nowrap",
          tdClass: "text-nowrap"
        },
        {
          key: "MedicationNo",
          label: "院內編號",
          sortable: false,
          thClass: "text-nowrap",
          tdClass: "text-nowrap font-weight-bold"
        },
        {
          key: "MedicationName",
          label: "藥品耗材名稱",
          sortable: false,
          thClass: "text-nowrap",
          tdClass: "text-nowrap text-left"
        },
        {
          key: "Quantity",
          label: "數量",
          sortable: false,
          thClass: "text-nowrap",
          tdClass: "text-nowrap font-weight-bold text-right"
        }
      ],
      MedicationContent: [],
      //第一次帶入的資料(用以比對前後的資料是否有異動)
      TempMedicationContent: [],
      //用來記錄原始藥品資料
      TempoptionsItems: [],
      medicineList: {
        //Note:有註解的資料要寫回DB內
        //所選的類別
        // classSelectedItem: "",
        // classOptionsItem: [],
        //所選的藥品耗材 用 -- 分開 前代碼 中名稱 後子代碼(說明)
        selectedItem: "",
        optionsItems: [],
        //計價方式(選)
        selectType: "",
        //計價方式(Source)
        optionsType: [],
        //數量
        qty: 1
      },
      //是否可以輸入資料
      inputDisable: false,
      medicineDisable: true,
      ObjApp: null,
      keyUpTimer: null
    };
  },
  computed: {
    filterSelectedItem() {
      return this.medicineList.selectedItem
        ? this.TempoptionsItems.filter( ({No, Name, SubName}) => `${No}--${Name}--${SubName}`.indexOf(this.medicineList.selectedItem) === 0)
        : this.TempoptionsItems;
    }
  },
  methods: {
    cancel() {
      this.$refs["medicineMaintain"].hide();
    },
    //新增藥品數量
    addCount(x) {
      x.Quantity = x.Quantity + 1;
    },
    //減少藥品數量
    cutCount(x) {
      if (x.Quantity <= 1) {
        return;
      }
      x.Quantity = x.Quantity - 1;
    },
    keyupDelay(cb, ms) {
      let timer = 0;
      const context = this, args = arguments;
      if(this.keyUpTimer) clearTimeout(this.keyUpTimer);
      this.keyUpTimer = setTimeout(function(){
        cb.apply(context, args);
      }, ms||0)
    },
    Filter() {
      this.$nextTick(() => {
        this.medicineList.optionsItems = this.medicineList.selectedItem
          ? this.TempoptionsItems.filter( ({No, Name, SubName}) => `${No}--${Name}--${SubName}`.indexOf(this.medicineList.selectedItem) === 0)
          : this.TempoptionsItems;
      });

      // this.TempoptionsItems.forEach(x => {
      //   let str = "";
      //   str = str + x.No + "--" + x.Name + "--" + x.SubName;
      //   if (str.substring(0, strlength) == queryStr) {
      //     tempList.push(x);
      //   }
      // });

      // setTimeout(x => {
        
      // }, 500);

      //需特別判斷 無輸入資料時

      // console.log(this.medicineList.optionsItems[0]);
      // this.medicineList.optionsItems.forEach(x => {
      //   // if (x.value) {
      //   console.log(x.No);
      //   // }

      //   // if (res.substring(0, strlength) == queryStr) {
      //   //   tempList.push(x);
      //   // }
      //   // console.log(res.substring(0, 4));
      // });
      // console.log(tempList);
      // this.medicineList.optionsItems = tempList;
    },
    delData(x) {
      this.MedicationContent.forEach(s => {
        if (s.MedicationNo == x.MedicationNo) {
          this.MedicationContent.splice(s.MedicationNo, 1);
        }
      });
      setTimeout(x => {
        this.$nextTick(() => {
          console.log(this.masterData.IsMedicationActionName);
          console.log(this.MedicationContent);
        });
      }, 500);

      if (this.masterData.IsMedicationActionName != "已完成") {
        //有資料
        if (this.MedicationContent.length > 0) {
          this.showSave = true;
          this.showNoData = false;
          this.disabledNoData = true;
        } else {
          this.showSave = false;
          this.showNoData = true;
          this.disabledNoData = false;
        }
      }
      //已登打過
      else {
        if (this.MedicationContent.length > 0) {
          this.showSave = true;
          this.showNoData = false;
          this.disabledNoData = true;
        } else {
          this.showSave = false;
          this.showNoData = true;
          this.disabledNoData = true;
        }
      }
    },
    //取得藥品資料 savetemp判斷是否更改比對欄位
    async GetMedicationData(savetemp) {
      console.log(this.masterData.AccessionNo);
      //呼叫modal 將相關資料打入...
      //打API取得藥品相關資料 SHOW在MedicationContent裡面
      let subPath =
        "../exam/GetExamMedicationList" +
        "?accessionNo=" +
        this.masterData.AccessionNo;

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
          let i = 1;
          data.forEach(x => {
            x.No = i;
            i++;
          });
          //先判斷有無登打過
          //未登打
          console.log(this.masterData.IsMedicationActionName);
          console.log(data);
          //判斷畫面按鈕之邏輯
          if (this.masterData.IsMedicationActionName != "已完成") {
            //有資料
            if (data.length > 0) {
              this.showSave = true;
              this.showNoData = false;
              this.disabledNoData = true;
            } else {
              this.showSave = false;
              this.showNoData = true;
              this.disabledNoData = false;
            }
          }
          //已登打過
          else {
            if (data.length > 0) {
              this.showSave = true;
              this.showNoData = false;
              this.disabledNoData = true;
            } else {
              this.showSave = false;
              this.showNoData = true;
              this.disabledNoData = true;
            }
          }

          if (savetemp) {
            this.TempMedicationContent = this.$DeepCopy(data);
          }
          this.$refs["medicineMaintain"].hide();
        });
    },
    //代入所選類別的No 2019/12/31取消 改為帶入所有藥品與耗材
    // async changeList(ClassNo) {
    //   let itemPack = null;
    //   let convertedCollections = [{ value: null, text: "請選擇" }];
    //   let query = new Query();
    //   query = query.where("Type", "contains", ClassNo);
    //   //打API並塞入相關該類別的藥品資料
    //   let subPath = "../api/Medication";
    //   await new DataManager({
    //     url: configs.publicPath + subPath,
    //     adaptor: new WebApiAdaptor(),
    //     crossDomain: true
    //   })
    //     .executeQuery(query)
    //     .then(r => {
    //       console.log(r);
    //       r.actual.Items.forEach(i => {
    //         let collection = { value: i.No, text: i.Name };
    //         convertedCollections.push(collection);
    //       });
    //       this.medicineList.optionsItems = convertedCollections; //資料;
    //     });
    // },
    //返回上一頁
    reply() {
      this.$router.replace({
        name: "FI0203"
      });
    },
    //新增藥品耗材 (show畫面)
    addMedication() {
      console.log(this.MedicationContent);
      if (
        (this.masterData.IsMedicationActionName == "已完成" &&
          this.MedicationContent.length) == 0
      ) {
        this.$refs["showMessage"].show();
      } else {
        this.showmedicineMaintain();
      }
    },
    showmedicineMaintain() {
      (this.medicineList.selectedItem = ""),
        (this.medicineList.selectType = ""),
        (this.medicineList.qty = 1);
      this.$refs["showMessage"].hide();
      this.$refs["medicineMaintain"].show();
    },
    hideessage() {
      this.$refs["showMessage"].hide();
    },
    async SaveAll() {
      let data = this.MedicationContent;
      let dataArray = [];
      //to-do
      data.forEach(x => {
        let inputdata = {
          MedicationNo: x.MedicationNo,
          SubName: x.SubName,
          Quantity: x.Quantity,
          PriceType: x.PriceType
        };
        dataArray.push(inputdata);
      });
      if (dataArray.length > 0) {
        this.showbtn = 1;
      } else {
        this.showbtn = 0;
      }
      console.log(dataArray);
      await window.axios
        .put(
          "/exam/SaveMedicationList?accessionNo=" + this.masterData.AccessionNo,
          dataArray
        )
        .then(e => {
          //更新temp資料
          this.TempMedicationContent = this.$DeepCopy(data);
          Swal.fire({
            type: "success",
            title: "儲存完成",
            timer: 1500
          });
        })
        .catch(function(error) {
          Swal.fire("儲存失敗！", error, "error");
        });
    },
    //不作任何儲存 回復TEMP資料
    async CancelSave() {
      let data = this.TempMedicationContent;
      let dataArray = [];
      //to-do
      data.forEach(x => {
        let inputdata = {
          MedicationNo: x.MedicationNo,
          SubName: x.SubName,
          Quantity: x.Quantity,
          PriceType: x.PriceType
        };
        dataArray.push(inputdata);
      });
      console.log(dataArray);
      await window.axios
        .put(
          "/exam/SaveMedicationList?accessionNo=" + this.masterData.AccessionNo,
          dataArray
        )
        .then(e => {
          this.MedicationContent = this.$DeepCopy(this.TempMedicationContent);
          this.$refs["confirm"].hide();
          this.$router.replace({
            name: "FI0203"
          });
        })
        .catch(function(error) {
          Swal.fire("儲存失敗！", error, "error");
        });
    },
    //取得藥品下拉選單
    async GetMedicationList() {
      let convertedCollections = [{ value: null, text: "請選擇" }];
      //打API並塞入所有藥品
      let subPath = "../medication/ExamMedicationList";
      await new DataManager({
        url: configs.publicPath + subPath,
        adaptor: new WebApiAdaptor(),
        crossDomain: true
      })
        .executeQuery(new Query().sortBy("Id"))
        .then(r => {
          let data = r.result; //資料;

          data.forEach(i => {
            let collection = {
              No: i.No,
              Name: i.Name,
              SubName: i.SubName
            };
            convertedCollections.push(collection);
          });
          this.TempoptionsItems = convertedCollections;
          this.medicineList.optionsItems = convertedCollections;
        });
    },
    //取得計價方式
    async GetPriceTypeList() {
      let convertedCollections = [{ value: null, text: "請選擇" }];
      //打API並塞入所有藥品
      let subPath = "../generalData/SelectNoList?groupNo=PriceType";
      await new DataManager({
        url: configs.publicPath + subPath,
        adaptor: new WebApiAdaptor(),
        crossDomain: true
      })
        .executeQuery(new Query())
        .then(r => {
          let data = r.result; //資料;

          data.forEach(i => {
            let collection = {
              value: i.No,
              text: i.Name
            };
            convertedCollections.push(collection);
          });

          this.medicineList.optionsType = convertedCollections;
        });
    },
    //儲存 全面儲存
    async confirmSave() {
      let data = this.MedicationContent;
      let dataArray = [];
      //to-do
      data.forEach(x => {
        let inputdata = {
          MedicationNo: x.MedicationNo,
          SubName: x.SubName,
          Quantity: x.Quantity,
          PriceType: x.PriceType
        };
        dataArray.push(inputdata);
      });
      if (dataArray.length > 0) {
        this.showbtn = 1;
      } else {
        this.showbtn = 0;
      }
      console.log(dataArray);
      await window.axios
        .put(
          "/exam/SaveMedicationList?accessionNo=" + this.masterData.AccessionNo,
          dataArray
        )
        .then(e => {
          Swal.fire({
            type: "success",
            title: "儲存完成",
            timer: 1500
          });
          this.TempMedicationContent = this.$DeepCopy(this.MedicationContent);
          this.$router.replace({
            name: "FI0203"
          });
        })
        .catch(function(error) {
          Swal.fire("儲存失敗！", error, "error");
        });
    },
    //新增藥品 確定儲存(單筆寫入) (SaveM)
    async SaveMedication() {
      let success = true;
      if (
        this.medicineList.qty <= 0 ||
        this.medicineList.selectedItem == "" ||
        this.medicineList.selectType == ""
      ) {
        success = false;
      }
      console.log(this.medicineList);
      if (!success) {
        this.ObjApp.TimingMessage("資料登打有誤，請重新輸入.", 2);
      } else {
        //table裡面舊藥品data []
        let data = this.MedicationContent;
        let dataArray = [];
        //新增藥品時 舊有資料備份
        // Array[ExamMedicationModel {
        //   MedicationNo (string, optional): 藥品耗材院內碼 ,
        //   SubName (string, optional): 部門藥品子代碼 ,
        //   Quantity (integer): 數量 ,
        //   PriceType (string): 計價方式
        // }]
        //to-do
        console.log(data);
        data.forEach(x => {
          let inputdata = {
            MedicationNo: x.MedicationNo,
            SubName: x.SubName,
            Quantity: x.Quantity,
            PriceType: x.PriceType
          };
          dataArray.push(inputdata);
        });

        // 本次新增的資料;
        let inputdata = {
          MedicationNo: this.medicineList.selectedItem.split("--")[0],
          SubName: this.medicineList.selectedItem.split("--")[2],
          Quantity: this.medicineList.qty,
          PriceType: this.medicineList.selectType
        };
        dataArray.forEach(x => {
          if (x.MedicationNo == inputdata.MedicationNo) {
            //若抓到一樣的藥品耗材 直接擋住 不讓他新增
            success = false;
          }
        });
        if (success) {
          dataArray.push(inputdata);
          console.log(dataArray);
          await window.axios
            .put(
              "/exam/SaveMedicationList?accessionNo=" +
                this.masterData.AccessionNo,
              dataArray
            )
            .then(e => {
              Swal.fire({
                type: "success",
                title: "登打完成",
                timer: 1500
              });
              //重刷畫面資料
              this.GetMedicationData(false);
            })
            .catch(function(error) {
              this.ObjApp.TimingMessage("儲存失敗!!", 2);
            });
        } else {
          this.ObjApp.TimingMessage("輸入之藥品已存在!!", 2);
        }
      }
    }
  },

  created() {
    this.masterData = this.$route.params.patientData;
    console.log(this.masterData);
    //取得打API時 需 Hold住畫面的Mehtod
    let methodName = "created";
    console.log(this.$logs(null, methodName));
    // 取得 App.vue 參照
    let obj = this.$GetApp(this);
    if (obj) {
      this.ObjApp = obj[0];
      this.VueNestLevel = obj[1];
    } else {
      console.log(this.$logs("Fail to get App.vue ref.", methodName));
    }

    //放入藥品資料
    this.$nextTick(() => {
      this.GetMedicationData(true);
    });
    //取藥品下拉選單(新增用)
    this.GetMedicationList();
    //取計價方式(新增用)
    this.GetPriceTypeList();
  },
  beforeRouteLeave(to, from, next) {
    console.log(this.TempMedicationContent);
    console.log(this.MedicationContent);
    let same = true;
    let lengthdata =
      this.TempMedicationContent.length > this.MedicationContent.length
        ? this.TempMedicationContent
        : this.MedicationContent;
    let shortdata =
      this.TempMedicationContent.length > this.MedicationContent.length
        ? this.MedicationContent
        : this.TempMedicationContent;
    lengthdata.forEach(tempx => {
      let havedata = false;
      shortdata.forEach(x => {
        //用第一筆資料去撈Temp內是否有相同的No 有 再比對數字是否依樣 若都沒有 表示不存在該資料 直接吐False
        if (tempx.MedicationNo === x.MedicationNo) {
          havedata = true;
          if (tempx.Quantity != x.Quantity) {
            same = false;
            return;
          }
        }
      });
      if (!havedata) {
        same = false;
      }
    });
    if (same) {
      next();
    } else {
      this.$refs["confirm"].show();
    }
  }
};
</script>
