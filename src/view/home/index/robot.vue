<template>
<div id="robot" style="position:relative">
<div style="position:fixed;top:30%;width: 300px;height: 200px;border: 1px solid #dfdfdf;
            right: 0%;margin-left: -450px;box-shadow: 0 0 15px #555;z-index: 9999;background-color: white;overflow: auto;">
    
        
                      
                        
                        <p style="text-algin:center;font-size: 20px;
                          text-align: center;
                          font-weight: bold;">已添加机器人</p>
                        <hr>
                        <el-row>
                          <el-checkbox-group v-model="removeRobotGroup" @change="handleCheckAllChange" size="medium">
      
                            <el-col style="text-algin:center" :span="6" v-for="i in pics.length" :key="i">
                                <el-avatar :size="30" :src="pics[i-1]">
                                </el-avatar>
                                <br>
                                <el-checkbox :key="i" :label="i"></el-checkbox>
                                <br>
                            </el-col>
                            </el-checkbox-group>
                        </el-row>
                        <br>
                        <br>
                        <span style="float:left">点击删除机器人</span>
                        <el-button  type="primary" @click="removeRobot"  size="small">提交删除</el-button>
                        <el-button  type="primary" @click="robotClose"  size="small">关闭</el-button>
                        <p style="text-algin:center;font-size: 20px;
                          text-align: center;
                          font-weight: bold;">未添加机器人</p>
                        <hr>
                        <el-row>
                          <el-checkbox-group v-model="addRobotGroup" size="medium">
                            <el-col style="text-algin:center" :span="6" v-for="i in resrpics.length" :key="i">
                                <el-avatar :size="30" :src="resrpics[i-1]">
                                </el-avatar>
                                <br>
                                <el-checkbox :key="i" :label="i"></el-checkbox>
                                <br>
                            </el-col>
                            </el-checkbox-group>
                        </el-row>
                        <br>
                        <br>
                        <span style="float:left">点击添加机器人</span>
                        <el-button  type="primary" @click="addRobot"  size="small">提交添加</el-button>
                       <el-button  type="primary" @click="robotClose"  size="small">关闭</el-button>
                        
        
        
        

    </div>
    </div>
</template>

<script>

import {errTips, message} from "@/utils/tips.js";

export default {
    name: "robot",
    data() {
      return {
        removeRobotGroup:[],
        addRobotGroup:[],
        resrpics:[require("@/assets/img/contributor/xwj.jpg"), require("@/assets/img/contributor/yuanqi.jpg"),
                require("@/assets/img/contributor/slj.jpg"), require("@/assets/img/contributor/zjj.jpg"), require("@/assets/img/contributor/rqj.jpg")],
        pics: [require("@/assets/img/contributor/zhj.jpg"), require("@/assets/img/contributor/wyj.jpg"), require("@/assets/img/contributor/yq.jpg"), require("@/assets/img/contributor/dl.jpg"),
                require("@/assets/img/contributor/sjy.jpg"), ],
      };
    },
    methods: {
      removeRobot(){
        var obj = ''; 
        if(this.removeRobotGroup.length<=0){
          errTips("请选择要删除的机器人！");
        }
        for(var i=0;i<this.removeRobotGroup.length;i++){
          obj = this.pics[this.removeRobotGroup[i]-1];
          this.resrpics.push(obj);
          this.pics.splice(this.removeRobotGroup[i]-1,1);
        }
        this.removeRobotGroup = [];
        //console.log(this.pics,this.resrpics);
      },
      addRobot(){
        var obj ='';
        if(this.addRobotGroup.length<=0){
          errTips("请选择要添加的机器人！");
        }
        for(var i=0;i<this.addRobotGroup.length;i++){
          obj = this.resrpics[this.addRobotGroup[i]-1];
          console.log(obj);
          this.pics.push(obj);
          this.resrpics.splice(this.addRobotGroup[i]-1,1);
        }
        this.addRobotGroup = [];
        console.log(this.pics,this.resrpics);

      },
      robotClose(){
        this.$emit("childFn",false);
      },
      
      handleCheckAllChange(){
        //console.log(this.removeRobotGroup);
      },
      
    }
}
</script>

<style scoped>
     .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>