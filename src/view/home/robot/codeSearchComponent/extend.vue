<template>
  <el-card>
    <div slot="header">
      <span>扩展</span>
    </div>
    <div id="noExtend">
      <span class="noInfo">暂无数据</span>
    </div>
    <div id="extend" style="display: none">
      <el-select v-model = "extendType" placeholder="请选择">
        <el-option v-for="item in RelTypes" :key="item" :label="item" :value="item"></el-option>
      </el-select>
      <el-button @click="extendRel">extend</el-button>
      <el-button @click="hideNode">hide</el-button>
    </div>
  </el-card>
</template>

<script>
import axios from "axios";

export default {
name: "extend",
  props:{
    HOST:{
      type:String,
      required:true
    }
  },
  data:function (){
    return {
      extendType:"",
      RelTypes:[],
      classId:0,
    }
  },
  methods:{
    show:function (id){
      console.log("extend",id);
      if(id == -1){
        document.getElementById("noExtend").style.display = "";
        document.getElementById("extend").style.display ="none";
        return;
      }else{
          document.getElementById("noExtend").style.display = "none";
          document.getElementById("extend").style.display ="";
      }
      this.classId = id;
      this.getRelList(id);
    },
    getRelList:function (id){
      //查找该结点所有的关系类型
      var _this = this;
      const HOST = _this.HOST;
      axios.get(`${HOST}/RelList?id=` +id)
      .then(function (response){
        console.log(response);
        _this.RelTypes = response.data;
      })
    },
    extendRel:function (){
      console.log("extendRel:",this.classId,this.extendType);
      this.$emit("extendRel",this.classId,this.extendType);
    },
    hideNode:function (){
      this.$emit("hideNode",this.classId);
    }
  }
}
</script>

<style scoped>
.noInfo{
  color: #909399;
}
</style>
