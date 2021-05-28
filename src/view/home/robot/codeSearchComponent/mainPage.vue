<template>
  <div id="mainPage" >
<!--       v-loading = "initLoading" element-loading-text="initiating..."-->
<!--       element-loading-spinner="el-icon-loading"-->
<!--       element-loading-background="rgba(0, 0, 0, 0.7)"-->
<!--  >-->
<!--    <h2 style="text-align: center">代码搜索</h2>-->
    <!-- search-->
    <div >
      <el-row type="flex" justify="center">
        <el-col :span="4">
          <el-select v-model = "projectName" placeholder="请选择" @change="selectChange">
            <el-option v-for="item in projectInfo" :key="item.projectName" :label="item.projectName" :value="item.id"></el-option>
          </el-select>
        </el-col>
        <el-col :span="12" style="height: 100%;">
          <el-input placeholder="请输入内容" v-model="code" class="input-search" clearable></el-input>
        </el-col>

        <el-col :span="4" >
          <el-button @click="search" style="height: 100%;width: 100%" type="primary">search</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- result-graph-->

    <br>

    <div id="result-graph" style="padding: 5px;">
      <!--      <el-divider> <span>code Graph</span> </el-divider>-->
      <el-card>
        <div slot="header">
          <el-row type="flex" justify="space-between">
            <el-col :span="10">
              <span>code Graph</span>
            </el-col>
            <el-col :span="1">
<!--              <i class="el-icon-refresh" @click="refreshGraph"></i>-->
              &nbsp;
              <i class="el-icon-full-screen" @click="showFullScreen"></i>
            </el-col>
          </el-row>

        </div>
        <graph ref="graph" @Information = "getInformation" :HOST="HOST" style="height: 400px"></graph>
      </el-card>

    </div>

    <div>
      <extend class="expandClass" ref="extend" @extendRel = "extendType" @hideNode="hideNode" :HOST="HOST"></extend>
    </div>

    <div>
      <information class="informationClass" ref="information" @showCode = "showCode" :HOST="HOST"></information>
    </div>

    <div>
      <codeCard style="height: 800px;" ref="codeCard" :HOST="HOST"></codeCard>
    </div>

  </div>
</template>

<script>
import axios from 'axios';
import extend from './extend';
import information from "./information";
import codeCard from "./codeCard";
import graph from "./graph";
export default {
  name: "mainPage",
  props:{
    HOST:{
      type:String,
      required:true
    }
  },
  components:{
    extend,
    information,
    codeCard,
    graph
  },
  data:function (){
    return{
      code:"",
      graphLoading:false,
      initLoading:false,
      projectInfo:[
      ],
      projectName:"",
      selectChangeFlag:false,
      cyContainer: null,
      }
  },
  mounted() {
    this.searchProjectList();
    // var graph = document.getElementById("graph");
    // var width = graph.offsetWidth;
    // graph.setAttribute("height",width);
    // this.init();
  },
  methods:{
    showInitLoading() {
      this.$emit("showInitLoading",this.initLoading);
    },
    init:async function (){
      this.initLoading = true;
      this.showInitLoading();
      const HOST = this.HOST;
      // event.preventDefault();
      await axios.get(`${HOST}/init`,{timeout:180000})
        .then(function (response){
          console.log("init Finished");
        });
      this.initLoading = false;
      this.showInitLoading();
    },
    getInitFlag:async function (){
      var flag = false;
      const HOST = this.HOST;
      await axios.get(`${HOST}/initFlag`)
        .then(function (response){
          flag = response.data;
        })
      return flag;
    },
    getGraph:async function (){
      console.log("getGraph");
      this.$refs.graph.getGraph(this.code,this.projectName);
    },
    selectChange(){
      this.selectChangeFlag = true;
    },
    search:async function (){
      if(this.code == ""){
        this.$message.warning("请输入需要搜索的内容");
        return;
      }
      if(!this.selectChangeFlag){
        this.$message.warning("请选择需要搜索的项目");
        return ;
      }

      document.getElementById("result-graph").style.display = "";
      var flag = await this.getInitFlag();
      if(!flag){
        await this.init();
      }
      this.graphLoading = true;
      await this.getGraph();
    },

    searchProjectList:function (){
      var _this = this;
      const HOST = this.HOST;
      axios.get(`${HOST}/projectList`)
        .then(function(response){
          _this.projectInfo = response.data;
        }).catch(function(err){})
    },
    extend:function (id){
      this.$refs.extend.show(id);
    },
    extendType:function (id,relType){
      this.$refs.graph.extendType(id,relType);
    },
    showCode:function (id){
      this.$refs.codeCard.showCode(id);
    },
    showInformation:function(id){
      this.$refs.information.showInformation(id);
    },
    getInformation:function (id){
      this.showInformation(id);
      this.extend(id);
    },
    hideNode:function (id){
      this.$refs.graph.hideNode(id);
    },
    showFullScreen:function (){
      this.$refs.graph.showFullScreen();
    },
    refreshGraph:function (){
      // this.init();
      // this.simulation.restart();
    }

  }
}
</script>

<style scoped>
.input-search{
  width: 100%;
}
.resultGraph{
  width: 100%;
  height: 500px;
}

.expandClass{
  padding: 5px;
}
.informationClass{
  height: 430px;
}
</style>
