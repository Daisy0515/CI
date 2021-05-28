<template>
  <div class="chatright">
    <el-container style="height:100%;width:600px;background-color: #545c64">

      <el-main style=" background-color: #ffffff;padding:0px">
        <el-button  type="primary" @click="robotClose"  size="small" style="position:absolute;background-color: #f02e2e;margin: 0px 0px 0px 535px;z-index : 30">关闭</el-button>
        <JwChat-index
            :taleList="list"
            :config="config"
            @enter="bindEnter"
            v-model="inputMsg"
            :showRightBox="false"
            scrollType="noscroll"
            :toolConfig="tool"
            width="100%"
            height="60%"

        />
      </el-main>

      <el-dialog title="上传代码" :visible.sync="uploadVisible" width="50%"
        :modal-append-to-body="false" :append-to-body="true">
        <div style="position: absolute;top:10%;bottom:0;left: 0;right: 0;width: 100%;height: 90%"
             v-loading = "uploadLoading" element-loading-text="正在上传代码，请耐心等待..." v-if="uploadLoading"
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(255, 255, 255, 0.7)">

        </div>
        <upload-page style="height: 70%" :HOST="HOST" @showUploadLoading = "showUploadLoading"></upload-page>
      </el-dialog>

      <el-dialog title="代码搜索" :visible.sync="codeSearchVisible" width="50%" :modal-append-to-body="false" :append-to-body="true">
        <div style="position: absolute;top:10%;bottom:0;left: 0;right: 0;width: 100%;height: 90%"
             v-loading = "initLoading" element-loading-text="正在初始化，请耐心等待..." v-if="initLoading"
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(255, 255, 255, 0.7)">

        </div>
        <main-page :HOST="HOST" @showInitLoading="showInitLoading"></main-page>
      </el-dialog>

    </el-container>
  </div>


</template>

<script>
import uploadPage from "./codeSearchComponent/uploadPage";
import MainPage from "./codeSearchComponent/mainPage";
export default {
  name: "codeSearch",
  components:{
    MainPage,
    uploadPage
  },
  data() {
    return {
      config: {
        img: require("@/assets/img/contributor/yuanqi.jpg"),
        name: '代码搜索',
        dept: '代码搜索',
        callback: this.bindCover,
        historyConfig:{
          show: true,
          tip: '加载更多',
          callback: this.bindLoadHistory,
        },
      },
      inputMsg:'',
      list:[{
        "text": { "text": '代码搜索' },
        "mine": false,
        "img": require("@/assets/img/contributor/yuanqi.jpg")
      }],
      tool: {
        show: ['history','more'],
        callback: this.toolEvent
      },

      HOST:"http://localhost:8088",

      //upload
      uploadVisible:false,
      uploadLoading:false,
      codeSearchVisible:false,
      initLoading:false,
    };
  },

  methods: {
    bindEnter() {
      const msg = this.inputMsg
      if (!msg) return;
      var date = new Date();
      const msgObj = {
        "date": date.toLocaleString(),
        "text": {"text": msg},
        "mine": true,
        "img": require("@/assets/img/contributor/xwj.jpg")
      }
      this.list.push(msgObj)
      const msgObj1 = {
        "date": date.toLocaleString(),
        "text": {"text": "你可以试试说代码搜索"},
        "mine": false,
        "img": require("@/assets/img/contributor/rqj.jpg")
      }
      this.list.push(msgObj1)
    },
    toolEvent(type, plyload) {
      console.log('tools', type, plyload)
      if(type == "history"){
        this.upload();
      }
      if(type == "more"){
        // console.log("get More");

        this.search();
      }
    },

    robotClose() {
      this.$emit("childFn", false);
    },

    //codeSearch 实现部分
    upload(){
      this.uploadVisible = true;
    },
    search(){
      this.codeSearchVisible = true;
    },
    showInitLoading(show){
      this.initLoading = show;
    },
    showUploadLoading(show){
      this.uploadLoading = show;
    }

  }
}
</script>

<style scoped>
.chatright {
  background-color: #ffffff;

  height: 100%;
}
.chatright .top {
  width: 100%;
  display: flex;
  float:left;
}

ul {
  padding: 10px;
}
li {
  padding: 10px;
  margin: 20px;
  width: 80%;
}
p{
  display: inline-block;
}
.msgcard {
  margin: 0 10px 0 10px;
  background-color: rgb(51, 233, 75);
  border-radius: 10px;
  max-width: 80%;
}
.msgleft {
  float: left;
  height: 20px;
}
.imgstyle{
  border-radius: 20px; vertical-align: top; height:20px;width:20px
}
.msgright {
  float: right;
  height: 20px;
}
.chatright .footer {
  background-color: #FBFCFC;
  text-align: right;
}
.sendbtn {
  height: 40px;
  width: 50px;
  border-radius: 10px;
  background-color: #58D68D;
  color: white;
  font-weight: bold;
  margin:10px 20px 0 0;

}

>>>.el-dialog {
  position: relative;
  margin: 0 auto 50px;
  background: #FFFFFF;
  border-radius: 2px;
  box-shadow: 0 1px 3px rgb(0 0 0);
  box-sizing: border-box;
  height: 70%;
}

>>>.el-dialog__body{
  padding: 30px 20px;
  color: #606266;
  font-size: 14px;
  word-break: break-all;
  height: 76%;
  overflow: auto;
}

</style>