<!--
管理员页面左侧工具栏
-->
<template>
  <div class="service">
	<reviewHead/>
    <div class="container deskHeader" style="height:100%">
      <div class="left-scroll" >
        <div class="left_top" >
			<el-menu
			      class="el-menu-vertical-demo"
			      @open="handleOpen"
			      @close="handleClose"
				  :default-active="this.$route.path"
				  router>

			      <el-menu-item index="/editorIndex">
			        <i class="el-icon-menu"></i>
			        <span slot="title">首页</span>
			      </el-menu-item>

				  <el-menu-item index="/editorTodo">
				    <i class="el-icon-edit"></i>
				    <span slot="title">待处理</span>
				  </el-menu-item>

			      <el-menu-item index="/editorComplete">
			        <i class="el-icon-circle-check-outline"></i>
			        <span slot="title">评审完成</span>
			      </el-menu-item>

				  <el-menu-item index="/editorManager">
				    <i class="el-icon-setting"></i>
				    <span slot="title">评审管理</span>
				  </el-menu-item>
			</el-menu>
        </div>
      </div>
      <div class="service_main clearfix" >
        <router-view></router-view>
      </div>
    </div>
    <div style="clear:both"></div>
    <Footer-Index/>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import FooterIndex from "@/common/footer/footer";
import reviewHead from "@/common/header/reviewLayout";
export default {
	components: {
	  FooterIndex,
	 reviewHead
	},
  data() {
    return {
   
    };
  },
  created: function() {
    	this.setLeft(this.$router.currentRoute.name);
  },
  computed: {
    ...mapGetters(["getleftIndex"])
  },
  methods: {

    	...mapMutations(["setLogin", "setLeft"]),

		changeleft(item) {
		  this.setLeft(item.url);
		  this.$router.push(item.url);
		},
		handleOpen(key, keyPath) {
				console.log(key, keyPath);
		},
		  handleClose(key, keyPath) {
			console.log(key, keyPath);
		  }
  }
};
</script>
<style lang='scss'>
html,
body,
#app,
.desk,
.service {
  height: 100%;
}
.service {
  .left-scroll {
    width: 11%;
    float: left;
    height: 100%;

  }
	.left_top{

	}
  .service_main {
    box-sizing: border-box;
    float: right;
    width: 85%;
    margin: 40px auto;
  }
}
</style>
