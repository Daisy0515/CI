<template>
    <div>
        <div id="ROBOT">
            <div style="position: fixed;z-index: 9999;right: 5%;top: 75%;">
                <img src="./ROBOT.gif" v-on:click="robotDialog=!robotDialog;">
            </div>
        </div>
      <el-container v-show="robotDialog" style=" width: 50%;height: 582px;z-index: 100;position: fixed;top : 10%; right: 30%;">
        <el-aside width="200px" style=" background-color: aqua;">
          <el-row style="height: 100%">
            <el-col style="height: 100%" :span="24">
              <el-menu style="height: 100%"
                  default-active="2"
                  class="el-menu-vertical-demo"
                  @open="handleOpen"
                  @close="handleClose"
                  @select="handleSelect"
                  background-color="#545c64"
                  text-color="#fff"
                  :unique-opened = 'uniqueOpen'
                  active-text-color="#ffd04b">
                <el-submenu index="1">
                  <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>最近使用</span>
                  </template>
                  <el-menu-item-group>
                    <template slot="title">分组一</template>
                    <el-menu-item index="1-1">代码审查</el-menu-item>
                    <el-menu-item index="1-2">代码注释</el-menu-item>
                    <el-menu-item index="1-3">余弦儿</el-menu-item>
                  </el-menu-item-group>
                </el-submenu>
                <el-submenu index="2">
                  <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span slot="title">内部服务</span>
                  </template>
                    <el-menu-item index="2-1">代码审查</el-menu-item>
                    <el-menu-item index="2-2">代码注释</el-menu-item>
                    <el-menu-item index="2-3">开发者推荐</el-menu-item>
                </el-submenu>
                <el-submenu index="3">
                  <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span slot="title">外部服务</span>
                  </template>
                    <el-menu-item index="3-1">知识查询</el-menu-item>
                    <el-menu-item index="3-2">代码补全</el-menu-item>
                </el-submenu>
                <el-menu-item index="4">
                  <i class="el-icon-setting"></i>
                  <span slot="title">robot管理</span>
                </el-menu-item>
              </el-menu>
            </el-col>
          </el-row>
        </el-aside>
        
          <codeReview v-if="iscodeReview" @childFn="robotClose"></codeReview>    
          <cosineRobot v-if="iscosineRobot" @childFn="robotClose"></cosineRobot>
      
      </el-container>
        <div id="robot_dialog" v-show="robotManage" >
        
            
                
                    
                        <Robot @childFn="parentFn"></Robot>
                    
                    
            
           
        </div>
   
        <Index v-if="userToken === null || userToken === ''"/>
        <Developer v-if="userToken !== null && userToken !== '' && projectRole == 3"/>
        <Manager v-if="userToken !== null && userToken !== '' && projectRole == 2"/>
        <IndexForDemand v-if="userToken !== null && userToken !== '' && projectRole == 1"/>
    </div>
</template>

<script>
    import Developer from '@/view/home/index/developer.vue';
    import Manager from '@/view/home/index/manager.vue';
    import Index from '@/view/home/index/index.vue';
    import IndexForDemand from '@/view/home/index/indexfordemand.vue';
    import ToolSet from '@/view/home/index/newtoolset2.vue';
    import Robot from '@/view/home/index/robot.vue';
    import cosineRobot from '@/view/home/robot/cosineRobot.vue';
    import codeReview from '@/view/home/robot/codeReview.vue';

export default {
    components: {
        Developer,
        Manager,
        Index,
        IndexForDemand,
        ToolSet,
        Robot,
        cosineRobot,
        codeReview,
    },
    data() {
        return {
            projectRole: 0,
            userToken: "",
            robotDialog: false,
            textarea:'',
            uniqueOpen : true,
            iscosineRobot:true,
            iscodeReview:false,
            robotManage:false,
        }
    },
    created() {
        this.userToken = sessionStorage.getItem("userToken");
        this.projectRole = sessionStorage.getItem("projectRole");
    },
    methods:{
      handleOpen(key, keyPath) {
        console.log("open",key, keyPath);

      },
      handleSelect(key, keyPath) {
        if(key=="2-1"||key=="1-1"){
          this.iscosineRobot =false;
          this.iscodeReview = true;
        }
        if(key=="1-3"){
          this.iscodeReview = false;
          this.iscosineRobot =true;
          
        }
        if(key=="4"){
          this.robotManage = !this.robotManage;
          
        }
      },
      handleClose(key, keyPath) {
        console.log("close",key, keyPath);
      },
      parentFn(payload){
        this.robotManage = payload;
      },
      robotClose(payload){
        this.robotDialog=payload;
      }
    },
}
</script>
<style scoped>

.close {
    position: relative;
    margin: 3px;
    width: 24px;
    height: 24px;
    background: white;
    cursor: pointer;
    box-sizing: border-box;
}
.close:hover::before, .close:hover::after {
    background: red;
}
.close:before {
    position: absolute;
    content: '';
    width: 1px;
    height: 25px;
    background: #666666;
    transform: rotate(45deg);
    top: -3px;
    left: 11px;
}
.close:after{
    content: '';
    position: absolute;
    width: 1px;
    height: 25px;
    background: #666666;
    transform: rotate(-45deg);
    top: -3px;
    left: 11px;
}
</style>