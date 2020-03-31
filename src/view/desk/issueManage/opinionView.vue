<template>
  <div class="applicationView">
    <div class="Crumbs">
      <div class="container deskHeader">
        <h4>
          您的位置：
          <router-link to="./documentOpinion">文档意见</router-link>&nbsp;>
          <span class="active">查看意见</span>
        </h4>
      </div>
    </div>
    <div class="container deskHeader">
      <el-card class="box-card0" style="text-align: left;">
        <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm">
          <el-form-item label="标题：">
            <span>{{ruleForm.opinionTitle}}</span>
          </el-form-item>
		  
          <el-form-item label="提交人:"> 
            <span>{{ruleForm.submitterName}}</span>
          </el-form-item>
		  
		  <el-form-item label="描述：">
		    <p class="detail">{{ruleForm.opinionDescription}}</p>
		  </el-form-item>
		  
          <el-form-item label="项目名称:">
            <span>{{ruleForm.projectName}}</span>
          </el-form-item>
		  <el-form-item label="需求名称:">
		    <span>{{ruleForm.missionName}}</span>
		  </el-form-item>
		  <el-form-item label="文档类型:">
			  <span class="tablehidden" v-if="ruleForm.documentsType===1">需求设计</span>
			  <span class="tablehidden" v-if="ruleForm.documentsType===2">概要设计</span>
			  <span class="tablehidden" v-if="ruleForm.documentsType===3">详细设计</span>
		  </el-form-item>
          <el-form-item label="等级状态：">
            <span class="tablehidden" v-if="ruleForm.level===1" style="color:red;">█马上解决</span>
            <span class="tablehidden" v-if="ruleForm.level===2" style="color:orange;">█急需解决</span>
            <span class="tablehidden" v-if="ruleForm.level===3" style="color:#FFE153;">█高度重视</span>
            <span class="tablehidden" v-if="ruleForm.level===4" style="color:green;">█正常处理</span>
            <span class="tablehidden" v-if="ruleForm.level===5" style="color:blue;">█低优先级</span>
          </el-form-item>
		  
		  <el-form-item class="cancel">
		    <el-button type="primary" @click="returnDO" size="medium" style="width:150px;margin-left:45%">返回</el-button>
		  </el-form-item>
        </el-form>
		
      </el-card>
    </div>
  </div>
</template>
<script>
import { httpGet,httpPost } from "@/utils/http.js";
import { specificDate } from "@/utils/getDate.js";
import { errTips } from "@/utils/tips.js";
import { mapMutations, mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      id: "",
      list: [{ value: "是" }, { value: "否" }],
      //parentValue: "",
      typeValue: "",
      ruleForm: {}
    };
  },
  created: function() {
     if (!this.$route.query.id) {
       this.$router.push({ path: "documentOpinion" });
       return false;
     }
     this.id = this.$route.query.id;
     this.getView();
  },
  
  methods: {
    ...mapMutations(["setCache"]),
	returnSquare() {
	  this.$router.push({ path: "./testEmploy" });
	},
	returnDO() {
		this.$router.push({ path: 'documentOpinion' });
	},
	getView() {
	  this.loading = true;
	  httpGet(`/v1/authorization/documents/documentsinfo/get?id=${this.id}`).then(
	    results => {
	      const { data,httpCode } = results.data;
	      if (httpCode === 200) {
	      this.ruleForm = data;
	      } else if (httpCode === 400) {
	        errTips("页面丟失");
	        this.setCache("documentOpinion");
	      }
	    }
	  );
	},
	
  }
};
</script>
<style lang='scss'>
@import "@/assets/scss/applicationView.scss";
</style>