<template>
  <el-card>
    <div slot="header">
      <span>详细信息</span>
    </div>
    <div id="noInfo">
      <span class="noInfo">暂无数据</span>
    </div>
    <div id="info" style="display: none">
      <el-table :data="tableData" :show-header="false">
        <el-table-column prop="key" label="key" width="150"></el-table-column>
        <el-table-column prop="val" label="val"></el-table-column>
      </el-table>
      <br>
      <el-button @click="showCode">显示代码</el-button>
    </div>
  </el-card>
</template>

<script>
import axios from "axios";

export default {
name: "information",
  props:{
    HOST:{
      type:String,
      required:true
    }
  },
  data:function (){
  return {
    id:0,
    tableData:[    ]
  }
  },
  methods:{
    showInformation:function (id){
      if(id == -1){
        document.getElementById("noInfo").style.display = "";
        document.getElementById("info").style.display ="none";
        return;
      }else{
        document.getElementById("noInfo").style.display = "none";
        document.getElementById("info").style.display ="";
      }
      var _this = this;
      this.id = id;
      const HOST = _this.HOST;
      axios.get(`${HOST}/information?id=`+id)
      .then(function (response){
        console.log("showInformation:",response.data);
        _this.tableData = response.data;
      })
    },
    showCode:function (){
      var id = this.id;
      console.log("showCode:" , id);
      this.$emit("showCode",id);
    }
  }
}
</script>

<style scoped>
  .noInfo{
    color: #909399;
  }
</style>
