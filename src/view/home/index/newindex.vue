<template>
    <div>
        <div id="ROBOT">
            <div style="position: fixed;z-index: 9999;right: 0;top: 800px;">
                <img src="./ROBOT.gif" v-on:click="robotDialog=!robotDialog;">
            </div>
        </div>
      <div></div>
      <el-container style=" width: 800px;height: 600px;z-index: 100;position: fixed;top : 20%; right: 30%;">
        <el-aside width="200px" style=" background-color: aqua;">
          <el-row style="height: 100%">
            <el-col style="height: 100%" :span="24">
              <el-menu style="height: 100%"
                  default-active="2"
                  class="el-menu-vertical-demo"
                  @open="handleOpen"
                  @close="handleClose"
                  background-color="#545c64"
                  text-color="#fff"
                  active-text-color="#ffd04b">
                <el-submenu index="1">
                  <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>导航一</span>
                  </template>
                  <el-menu-item-group>
                    <template slot="title">分组一</template>
                    <el-menu-item index="1-1">选项1</el-menu-item>
                    <el-menu-item index="1-2">选项2</el-menu-item>
                  </el-menu-item-group>
                  <el-menu-item-group title="分组2">
                    <el-menu-item index="1-3">选项3</el-menu-item>
                  </el-menu-item-group>
                  <el-submenu index="1-4">
                    <template slot="title">选项4</template>
                    <el-menu-item index="1-4-1">选项1</el-menu-item>
                  </el-submenu>
                </el-submenu>
                <el-menu-item index="2">
                  <i class="el-icon-menu"></i>
                  <span slot="title">导航二</span>
                </el-menu-item>
                <el-menu-item index="3" disabled>
                  <i class="el-icon-document"></i>
                  <span slot="title">导航三</span>
                </el-menu-item>
                <el-menu-item index="4">
                  <i class="el-icon-setting"></i>
                  <span slot="title">导航四</span>
                </el-menu-item>
              </el-menu>
            </el-col>
          </el-row>
        </el-aside>
        <el-container>
          <el-header style=" background-color: bisque;">Header</el-header>
          <el-main style=" background-color: coral;">Main</el-main>
          <el-footer style=" background-color: cornflowerblue;height: 150px;">Footer</el-footer>
        </el-container>
      </el-container>
        <div id="robot_dialog" v-show="robotDialog">
        
            <div style="position:fixed;top:600px;width: 300px;height: 200px;border: 1px solid #dfdfdf;overflow: hidden;
            right: 0%;margin-left: -450px;box-shadow: 0 0 15px #555;z-index: 9999;background-color: white;overflow: auto;">
                
                   
                        
                   
                    
                        <Robot></Robot>
                    
                    
            </div>
           
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

export default {
    components: {
        Developer,
        Manager,
        Index,
        IndexForDemand,
        ToolSet,
        Robot,
    },
    data() {
        return {
            projectRole: 0,
            userToken: "",
            robotDialog: false,
        }
    },
    created() {
        this.userToken = sessionStorage.getItem("userToken");
        this.projectRole = sessionStorage.getItem("projectRole");
    }
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