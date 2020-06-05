<template>
  <div class="service">
    <!-- <div class="responsive resp">
      <div class="module_secondaryHead guruSearch hasBg">
        <div class="container">
          <div class="module_headerCrumb">
            <div class="refinery">
              <div class="h1 searchTitle">
                <p class="searchTitle">服务共享</p>
              </div>
            </div>
            <span class="resultCount"></span>
          </div>
        </div>
      </div>
    </div> -->
	<reviewHead/>
    <div class="container deskHeader" style="height:100%">
      <div class="left-scroll">
        <div class="left_top">
			<el-menu
			      
			      class="el-menu-vertical-demo"
			      @open="handleOpen"
			      @close="handleClose"
				  :default-active="this.$router.path"
				  router>
			      
			      <el-menu-item index="/publisherIndex">
			        <i class="el-icon-menu"></i>
			        <span slot="title">首页</span>
			      </el-menu-item>
				  
			      <el-menu-item index="/publisherNotAccept">
			        <i class="el-icon-setting"></i>
			        <span slot="title">未接受</span>
			      </el-menu-item>
				  
				  <el-menu-item index="/publisherRollback">
				    <i class="el-icon-setting"></i>
				    <span slot="title">打回中</span>
				  </el-menu-item>
				  
			      <el-menu-item index="/publisherReview">
			        <i class="el-icon-setting"></i>
			        <span slot="title">评审中</span>
			      </el-menu-item>
				  <el-menu-item index="/publisherComplete">
				    <i class="el-icon-setting"></i>
				    <span slot="title">已完成</span>
				  </el-menu-item>
				  <el-menu-item index="/publisherDraft" >
				    <i class="el-icon-document"></i>
				    <span slot="title">草稿箱</span>
				  </el-menu-item>
			</el-menu>
          <!-- <ul>
            <li
              @click="changeleft(item)"
              :class="getleftIndex===item.url ? 'leftbq':''"
              v-for="item in leftdataOne"
              :key="item.index"
            >{{item.name}}</li>
          </ul> -->
        </div>
      </div>
      <div class="service_main clearfix">
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
// import { Menu, Submenu, MenuItem, MenuItemGroup,} from "element-ui";
export default {
	components: {
	  FooterIndex,
	 reviewHead
	},
  data() {
    return {
      select: "个人信息",
      leftdataOne: [
        {
          name: "工具集",
          url: "toolset",
          open: true,
          formindex: true
        },
        {
          name: "知识广场",
          url: "knowledgePlaza",
          open: false,
          formindex: false
        }
      ]
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
   /* text-align: center; */
    width: 11%;
    float: left;
    height: 100%;
       
  }

  .service_main {
    box-sizing: border-box;
    float: right;
    width: 85%;
    /* margin: 40px auto; */
    
  }
}
</style>