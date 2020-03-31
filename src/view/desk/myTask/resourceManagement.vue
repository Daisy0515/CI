<template>
  <div class="resourceManagement">
    <div class="Crumbs">
      <div class="container deskHeader">
        <h4>
          您的位置：
          <router-link to="myTask">我的任务</router-link>>
          <span class="active">资源管理</span>
        </h4>
      </div>
    </div>
    <div class="container deskHeader">
      <p class="Tips">
        <i class="el-icon-info"></i>请尽量使用使用github等托管资源地址
      </p>
      <div class="main">
        <!-- <div class="one">
          <span>资源托管地址：</span>
          <el-input v-model="saveData.trusteeship"></el-input>
        </div> -->
        <div class="two">
          <p>资源文件路径：{{saveData.fileName}}</p>
          <!-- <el-upload
            class="upload-demo"
            multiple
            :limit="1"
            :file-list="fileList"
            :data="qiniuData"
            action="http://upload-z2.qiniup.com"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :on-remove="removeUpload"
            :on-error="uploadError"
          >
            <el-button size="small" type="primary">
              <i class="el-icon-upload2"></i>上传资源
            </el-button>
          </el-upload>-->
          <source-Upload
            :fileName="fileName"
            :uploadIndex="uploadIndex"
            v-on:setIdCard="setIdCard($event)"
          />
        </div>
        <div class="bottom">
          <el-button size="primary" type="primary" @click="saveResource">保存</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { httpGet, httpPut } from "@/utils/http.js";
import { successTips, errTips } from "@/utils/tips.js";
import sourceUpload from "@/common/upload/resourceUpload";
export default {
  components: {
    sourceUpload
  },
  data() {
    return {
      fileName: "endResource",
      uploadIndex: false,
      userList: [{ role: "管理" }, {}, {}],
      fileList: [],
      noSave: {},
      saveData: { fileName: "", trusteeship: "", id: "" }
    };
  },
  created: function() {
    if (!this.$route.query.id) {
      this.$router.push({ path: "myTask" });
      return false;
    }
    this.saveData.id = this.$route.query.id;
    this.getView();
  },
  methods: {
    //获取页面数据
    getView() {
      httpGet("/v1/authorization/mission/resourcemanagement/get", {
        id: this.saveData.id
      }).then(results => {
        const { msg, httpCode, data } = results.data;
        if (httpCode === 200) {
          this.saveData = data;
          this.noSave = data;
        } else if (httpCode !== 401) {
          errTips(msg);
        }
      });
    },
    //上传
    setIdCard(data) {
      data && (this.saveData.fileName = data);
      httpPut(
        "/v1/authorization/mission/resourcemanagement/update",
        this.saveData
      ).then(results => {
        const { msg, httpCode } = results.data;
        if (httpCode === 200) {
          successTips("保存成功");
        } else if (msg === "项目已结束，无法保存资源") {
          this.saveData = this.noSave;
          errTips("项目已结束，无法保存资源");
        }
      });
    },
    //保存修改
    saveResource() {
      this.uploadIndex = !this.uploadIndex;
      // if (this.saveData.fileName) {
      //   this.setIdCard();
      // } else {
      //   alert(555) 
      //   this.uploadIndex = !this.uploadIndex;
      // }
      // httpPut(
      //   "/v1/authorization/mission/resourcemanagement/update",
      //   this.saveData
      // ).then(results => {
      //   if (httpCode === 200) {
      //     successTips("保存成功");
      //   } else if (msg === "项目已结束，无法保存资源") {
      //     this.saveData = this.noSave;
      //     errTips("项目已结束，无法保存资源");
      //   }
      // });
    }
  }
};
</script>
<style lang='scss'>
.resourceManagement {
  .el-icon-info {
    margin-right: 5px;
  }
  .Tips {
    text-align: center;
    margin-top: 15px;
    color: #909399a8;
  }

  .one {
    margin-top: 40px;
    span {
      margin-right: 10px;
    }
    .el-input {
      width: 350px;
    }
    .el-input__inner {
      height: 30px;
    }
  }
  .two {
    margin-top: 25px;
    p {
      margin-bottom: 20px;
    }
  }
  .bottom {
    text-align: center;
    margin-top: 60px;
  }
}
</style>