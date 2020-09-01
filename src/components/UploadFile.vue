<template>
  <div class="dtc-upload">
    <main class="del-files" v-if="askdel">
      <div class="del-file">
        <header>
          <img src="warning.svg" />
        </header>
        <footer>
          <h6>清除全部檔案？</h6>
          <nav>
            <button>確定</button>
            <button @click="askdel = false">取消</button>
          </nav>
        </footer>
      </div>
    </main>
    <input type="file" id="uploadMyFile" @change="fileChange($event)" hidden accept=".csv" />
    <header class="ask-header">體檢報告上傳</header>

    <main class="main-upload">
      <div>
        <b-input-group prepend="醫檢師" class="name-list">
          <b-select :options="names" v-model="name"></b-select>
        </b-input-group>
        <nav>
          <template v-if="!uploading">
            <img src="upload.svg" width="130" height="165" @click="clickFileBtn" />
            <h6 style="text-align:center;">檔案格式:CSV</h6>
            <h6 v-if="!selectedFileName" style="text-align:center;">未選擇任何檔案</h6>
            <h6 v-if="selectedFileName" style="text-align:center;">{{ selectedFileName }}</h6>
          </template>
          <template v-if="uploading && !uploadOk && !uploadFail">
            <span class="ani-spin">
              <img src="refresh.svg" width="130" height="165" />
            </span>
            <h6 style="text-align:center;color:#10579B;">檔案上傳中</h6>
            <h6 style="text-align:center;color:#10579B;">請稍候...</h6>
          </template>
          <template v-if="uploadFail">
            <img src="error.svg" width="130" height="165" />
            <h6 style="text-align:center;color:#D87676;">上傳失敗</h6>
            <h6 style="text-align:center;color:#D87676">失敗原因:API錯誤</h6>
            <b-button
              size="sm"
              variant="danger"
              @click="uploading = false;uploadFail='';selectedFileName=''"
            >上傳其他檔案</b-button>
          </template>
          <template v-if="uploadOk">
            <img src="success.svg" width="130" height="165" />
            <h6 style="text-align:center;color:#2E8301;">上傳成功</h6>
            <b-button
              size="sm"
              variant="warning"
              @click="uploading = false;uploadOk='';selectedFileName=''"
            >上傳其他檔案</b-button>
          </template>
          <footer v-if="!uploading">
            <b-button size="sm" variant="info" @click="clickFileBtn">選擇上傳檔案</b-button>
            <b-button
              size="sm"
              variant="primary"
              @click="uploadFile"
              :disabled="!selectedFileName"
            >確認上傳</b-button>
            <b-button
              size="sm"
              variant="danger"
              @click="clickFileDel"
              :disabled="!selectedFileName"
            >刪除檔案</b-button>
          </footer>
        </nav>
      </div>
      <div>
        <h5>
          上傳檔案成功
          <span class="clear-all-file" @click="delOkFiles" hidden>全部清除</span>
        </h5>
        <header class="dtc-grid-header-ok my-dark">
          <div>項次</div>
          <div>姓名</div>
          <div>身分證號</div>
        </header>
        <main
          class="dtc-grid-header-ok main-dtc-body"
          v-for="(item, i) in oks"
          :key="i"
          style="color:black;"
          :style="i % 2 == 0 ? 'background-color: #F5F5F5;' : 'background-color: #E0E0E0;'"
        >
          <div>{{i + 1}}</div>
          <div>{{item.MilitaryName}}</div>
          <div>{{item.MilitaryIdNo}}</div>
        </main>
      </div>
      <div>
        <h5>
          上傳檔案失敗
          <span class="clear-all-file mr-2" @click="delFailFiles" hidden>全部清除</span>
        </h5>
        <header class="dtc-grid-header-fail my-dark">
          <div>項次</div>
          <div>姓名</div>
          <div>身分證號</div>
          <div>失敗原因</div>
        </header>
        <main
          class="dtc-grid-header-fail main-dtc-body"
          v-for="(item, i) in errors"
          :key="i"
          style="color:black;"
          :style="i % 2 == 0 ? 'background-color: #F5F5F5;' : 'background-color: #E0E0E0;'"
        >
          <div>{{i + 1}}</div>
          <div>{{item.MilitaryName}}</div>
          <div>{{item.MilitaryIdNo}}</div>
          <div>{{item.ImportMessage}}</div>
        </main>
      </div>
    </main>
  </div>
</template>
<style lang="scss" scoped></style>
<script>
import { store, actions } from "@/store/global.js";

export default {
  data() {
    return {
      tab: 1,
      errors: "",
      curFile: "",
      selectedFileName: "",
      askdel:false,
      uploading: false,
      uploadOk:"",
      uploadFail:"",
      oks:[],
      errors:[],
      names:[],
      name:''
    };
  },
  components: {},
  methods: {
    delOkFiles(){
      this.askdel = true;
    },
    delFailFiles(){
      this.askdel = true;
      
    },
    clickFileDel() {
      this.selectedFileName = "";
    },
    clickFileBtn() {
      document.querySelector("#uploadMyFile").click();
    },
    fileChange(evt) {
      const curFile = evt.target.files[0];
      this.curFile = curFile;
      //file name
      this.selectedFileName = this.curFile.name;
      //alert(this.selectedFileName);
    },
    async uploadFile() {
      this.uploading = true;
      let form = new FormData();
      form.append("i", this.curFile);
      //const name = this.names.find(s => s.value == this.name).text;
      //form.append("docimaster", this.name);
      try {
        const ret = await window.axios.post("examineImport/Upload?docimaster=" + this.name, form, this.selectedFileName);
        // step1 : get ok list
        this.oks = ret.filter(s => !s.ImportMessage);
        // step2 : get error list
        this.errors = ret.filter( s => s.ImportMessage);
        this.uploadOk = "上傳成功";
        this.curFile = "";
      } catch (e) {
        this.uploadFail = "上傳fail";
      }
    },
  },
  async mounted() {
      const list = await axios.get('account/GetAccountListByRole?role=HospitalDocimaster');
      this.names = list.map( s => ({
        value: s.No,
        text:s.Name
      }))
      this.name = this.names[0].value;
  },
};
</script>
<style lang="scss" scoped>
.dtc-upload {
  color: white;
  background: white;
  min-height: 100vh;
}
.ask-header {
  background: #646b74;
  height: 42px;
  color: white;
  font-size: 20px;
  padding-left: 10px;
  line-height: 42px;
  margin-bottom: 12px;
}
.main-upload {
  margin: 20px;
  display: grid;
  grid-template-columns: 420px 560px 1fr;
  grid-gap: 2rem;
  > div {
    display: flex;
    flex-direction: column;
    h5 {
      font-weight: bold;
      color: #404040;
      font-size: 20px;
      margin-bottom: 10px;
    }
  }
  > div:first-child {
    min-height: calc(100vh - 200px);
    background: #f4f4f4 0% 0% no-repeat padding-box;
    border-radius: 10px;
    display: grid;
    place-items: center;
    margin-top: 40px;
    position: relative;
    nav {
      display: flex;
      flex-direction: column;
      position: relative;
      transform: translateY(-50px);
      footer {
        position: absolute;
        bottom: -44px;
        left: -50%;
        display: grid;
        grid-template-columns: repeat(3, max-content);
        grid-gap: 10px;
      }
    }
    h6 {
      color: #7e7e7e;
      font-size: 16px;
      margin-top: 10px;
    }
    button {
      margin-top: 10px;
    }
  }
}
/deep/ .btn-primary {
  background: #1f7cd3 0% 0% no-repeat padding-box;
  border-radius: 4px;
}

/deep/ .btn-info {
  background: #10579b;
  border-color: #10579b;
  border-radius: 4px;
}
/deep/ .btn-danger {
  background: #d87676;
  border-color: #d87676;
  border-radius: 4px;
}

/deep/ .btn-warning {
  background: #2e8301;
  border-color: #2e8301;
  border-radius: 4px;
  color: white;
}

.dtc-grid-header-ok,
.dtc-grid-header-fail {
  display: grid;
  grid-template-columns: 120px 220px 1fr;
  grid-auto-flow: column;
  text-align: center;
  padding-right: 0px;
  border: 1px solid white;
  > div {
    border-right: 1px solid white;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    font-size: 14px;
    padding: 4px 0;
  }
  > div:last-child {
    border-right: none;
  }
}
.dtc-grid-header-fail {
  grid-template-columns: 120px 120px 120px 1fr;
}
.my-dark {
  > div {
    background: var(--gray);
    color: white;
  }
}
.main-dtc-body {
  &:hover {
    background-color: rgba(0, 0, 0, 0.075);
  }
  > div {
    line-height: 24px;
  }
}
.clear-all-file {
  display: inline-block;
  width: 80px;
  height: 24px;
  background: #efefef !important;
  border-radius: 12px;
  font-size: 12px;
  line-height: 24px;
  text-align: center;
  transform: translate(5px, -3px);
  cursor: pointer;
}
.del-files {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: rgba(#000, 0.8);
  display: grid;
  place-items: center;
  z-index: 8;
  .del-file {
    display: flex;
    flex-direction: column;
    width: 410px;
    height: 234px;
    background: white;
    border-radius: 10px;
    header {
      height: 93px;
      background: #dd6060;
      text-align: center;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      img {
        width: 68px;
        height: 61px;
        display: inline-block;
        margin-top: 14px;
        //padding-top: 20px;
      }
    }
    footer {
      padding-top: 10px;
      text-align: center;
      h6 {
        font-size: 22px;
        color: #363636;
        margin-bottom: 1.4rem;
        margin-top: 1rem;
      }
      nav {
        display: inline-block;
        button {
          all: unset;
          cursor: pointer;
          width: 128px;
          height: 43px;
          border-radius: 23px;
          color: #ffffff;
          text-align: center;
          line-height: 43px;
          background: #a0a0a0;
          display: inline-block;
        }
        button:first-child {
          background: #dd6060;
          margin-right: 1rem;
        }
      }
    }
  }
}
.ani-spin {
  animation: spinIcon 1s infinite ease-out;
}

@keyframes spinIcon {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
}
.name-list {
  position: absolute;
  top: -50px;
  left: 0;
  width: 400px;
  height: 40px;
}
</style>
