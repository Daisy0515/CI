<template>
<div id="uploadPage">
<!--  <button @click="testError">testError</button>-->
<!--  <h2 style="text-align: center">代码管理</h2>-->
  <div style="height: 400px">
    <h2>&nbsp; &nbsp; 导入项目</h2>
    <el-form label-width="120px">
      <el-form-item label="项目名称">
        <el-input v-model = "newProjectName" style="width: 50%" clearable></el-input>
      </el-form-item>
      <el-form-item label="group">
        <el-input v-model = "newProjectGroup" style="width: 50%" clearable></el-input>
      </el-form-item>
      <el-form-item label="artifact">
        <el-input v-model = "newProjectArtifact" style="width: 50%" clearable></el-input>
      </el-form-item>
      <el-form-item label="请添加文件">
        <el-upload
          class="upload-demo"
          ref = "uploadRef"
          action="none"
          :auto-upload="false"
          :on-change="handleChange"
          :on-exceed="handleExceed"
          :file-list="fileList"
          accept=".zip,.tgz"
         style="height: 120px">
          <el-button size="small" type="primary" >点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传zip/tgz文件，且不超过100MB</div>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" @click="parse">导入</el-button>
      </el-form-item>
    </el-form>



  </div>



  <el-dialog title = "提示" :visible.sync = "dialogVisible" width="50%" :append-to-body="true">
    <span>是否将以下文件导入数据库？</span>
    <el-table :data = "fileList">
      <el-table-column prop = "name" label="文件名" ></el-table-column>
      <el-table-column prop = "size" label="大小" width = "180"></el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogCancel">取消</el-button>
      <el-button type="primary" @click="dialogConfirm">确定</el-button>
    </span>
  </el-dialog>

  <br/>
  <el-divider>当前已存在项目</el-divider>
  <div style="margin: 10px">
    <el-table :data="projectInfo">
      <el-table-column label="项目名称" prop="projectName" width="150"></el-table-column>
      <el-table-column label="源文件名称" prop="fileName" width="150"></el-table-column>
      <el-table-column label="类/接口 数量" prop="numClass"></el-table-column>
      <el-table-column label="方法 数量" prop="numMethod"></el-table-column>
      <el-table-column label="关系 数量" prop="numRel"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="deleteProject(scope.$index,scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>


</div>
</template>

<script>
import axios from 'axios';
import qs from 'qs';
import ElementUI from 'element-ui';

export default {
name: "uploadPage",
  props:{
    HOST:{
      type:String,
      required:true
    }
  },
  data:function (){
  return {
    newProjectName:"",
    newProjectGroup:"",
    newProjectArtifact:"",
    fileList:[],
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    dialogVisible:false,
    projectInfo:[
      {
        name:"lunece",
        file:"lunece-8.0.1"
      },
      {
        name:"POI",
        file:"POI-1.1.2"
      }
    ],
    formData:new FormData()
  }
  },
  mounted() {
    this.searchProjectList();
  },
  methods:{
    handleChange(file,fileList){
      this.fileList = [];
      this.fileList.push(file);
    },
    // handleRemove(file,fileList){
    //   this.fileList = fileList;
    // },
    handleBeforeUpload:function (file){
      var existFlag = false;
      const isLt100M = file.size / 1024 / 1024 < 100;
      if(!isLt100M){
        this.$message.error('上传文件大小不能超过 100MB!');
      }
      return isLt100M && (!existFlag);
    },
    handleExceed:function (files,fileList){
      this.$message.warning("只能选择一个文件，如需更换文件，请先将原文件删除后再添加")
    },
    // handleSuccess:function (res,file){
    //   console.log(res);
    //   const uid = file.uid;
    //   const resId = res;
    //   const fileUid = {
    //     uid: uid,
    //     resUid : resId
    //   }
    //   this.fileUidList.push(fileUid);
    //   console.log(this.fileUidList);
    //   console.log(resId);
    //   console.log(res);
    //   console.log(file);
    // },
    parse:function () {
      if(this.newProjectName == ""){
        this.$message.warning("项目名称不能为空");
        return;
      }
      this.dialogVisible = true;
    },
    dialogCancel:function (){
      this.dialogVisible = false;
    },
    dialogConfirm:async function (){
      this.dialogVisible = false;
      await this.importFile();
      this.searchProjectList();
    },
    checkFile:function (){
      var projectName = this.newProjectName;
      var projectInfo = this.projectInfo;
      var _this = this;
      for(var i = 0; i < projectInfo.length;i++){
        if(projectName == projectInfo[i].projectName){
          _this.$message.error(projectName+" 项目已存在");
          return false;
        }
      }
      return true;
    },
    importFile:async function (){
      // console.log(this.fileList);
      // console.log(this.fileList[0].raw);
      if(!this.checkFile()){
        return;
      }
      var fullScreenLoading = true;
      this.showUploadLoading(fullScreenLoading);

      var _this = this;
      const HOST = _this.HOST;
      console.log("HOST",HOST);

      this.formData = new FormData();

      this.formData.append("file",this.fileList[0].raw);
      this.formData.append("projectName",this.newProjectName);
      this.formData.append("projectGroup",this.newProjectGroup);
      this.formData.append("projectArtifact",this.newProjectArtifact);
      await axios.post(`${HOST}/importForm`,this.formData,{timeout:10800000})
        .then(function (response){
          console.log("success");
          fullScreenLoading=false;
          _this.showUploadLoading(fullScreenLoading);
        })
      .catch(function (error){
        console.log("import error",error.request);
        var json = JSON.parse(error.request.responseText);
        var message = json["message"];
        var html ="<div style='white-space: pre-line'> " + message + "</div>";
        fullScreenLoading=false;
        _this.showUploadLoading(fullScreenLoading);
        console.log(message);
        _this.$alert(html,"Error",{
          confirmButtonText:"确定",
          dangerouslyUseHTMLString:true,
          type:"error",
        })
      })
      _this.fileList = [];
      _this.newProjectName = "";
    },
    deleteProject:function (index,row){
      console.log(index,row);
      var name = row.projectName;
      this.$confirm('此操作将永久删除 '+name+' 项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteProjectConfirm(index);
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    deleteProjectConfirm:function (index){
      console.log("delete",this.projectInfo[index].id);
      var _this = this;
      const HOST = _this.HOST;
      axios.get(`${HOST}/deleteProject?id=` + this.projectInfo[index].id)
      .then(function (response){
        console.log(response);
        _this.searchProjectList();
      })

    },
    searchProjectList:function (){
      var _this = this;
      const HOST = _this.HOST;
      // console.log(HOST);
      axios.get(`${HOST}/projectList`)
      .then(function(response){
        console.log("ProjectList",response);
        _this.projectInfo = response.data;
      }).catch(function(error){
        var json = JSON.parse(error.request.responseText);
        var message = json["message"];
        _this.$alert(message,"Error",{
          confirmButtonText:"重试",
          dangerouslyUseHTMLString:true,
          type:"error",
          callback:action => {
            location.reload();
          }
        })
      })
    },
    showUploadLoading:function (show){
      this.$emit("showUploadLoading",show);
    }
  }
}
</script>

<style scoped>

</style>
