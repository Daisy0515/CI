<template>
  <div class="applicationView">
    <div class="Crumbs">
      <div class="container deskHeader">
        <h4>
          您的位置：
          <router-link to="./myTest">我的测试</router-link>>
          <span class="active">查看/编辑</span>
        </h4>
      </div>
    </div>
    <div class="container deskHeader">
      <el-card class="box-card0" style="text-align: left;">
        <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm">
          <el-form-item label="测试名称：">
            <span>{{ruleForm.projectName}}</span>
          </el-form-item>
		  
          <el-form-item label="项目类型:"> 
            <span v-if="ruleForm.type === 1">设计</span>
            <span v-if="ruleForm.type === 2">软件开发</span>
            <span v-if="ruleForm.type === 3">数据科学</span>
            <span v-if="ruleForm.type === 4">其他类别 </span>
          </el-form-item>
          
		  <el-form-item label="已有人数：">
		    <span>{{ruleForm.ownCount}}</span>
		  </el-form-item>
          <el-form-item label="测试需求：">
            <p class="detail">{{ruleForm.testRequirement}}</p>
          </el-form-item>
		  
		  <el-form-item label="附件：">
		    <a target="_Blank" :href="ruleForm.sourceFile" v-if="ruleForm.sourceFile&&getUser">下载附件</a>
		    <a v-if="!ruleForm.sourceFile&&getUser" target="_Blank">暂无附件</a>
		    <a v-if="!getUser" href="javascript:void(0)">登录才能下载附件</a>
		  </el-form-item>
		  
		  
		  <el-form-item label="截止时间" prop="deadline">
		    <el-date-picker
		    style="margin-left:0%"
		      v-model="ruleForm.deadline"
		      :picker-options="endDatePicker"
		      type="date"
		      placeholder="截止时间"
		      value-format="yyyy-MM-dd"
		    ></el-date-picker>
		  </el-form-item>
		  
		  
		  
		  <el-form-item label="所需人数" prop="needCount">
		    <el-input style="width: 15%;" v-model="ruleForm.needCount"></el-input>
		  </el-form-item>
		  
		  <el-form-item class="cancel">
		    <el-button type="primary" @click="returnMyTest" size="medium" style="width:150px;margin-left: 25%;">返回</el-button>
			<el-button type="primary" @click="submitForm('ruleForm')" size="medium" style="width:150px;margin-left:25%">修改</el-button>
		    
		  </el-form-item>
        </el-form>
		
      </el-card>
    </div>
  </div>
</template>
<script>
import { httpGet,httpPut } from "@/utils/http.js";
import { specificDate } from "@/utils/getDate.js";
import { errTips, successTips } from "@/utils/tips.js";
import { mapMutations, mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
	endDatePicker: {
		disabledDate(time) {
				return time.getTime() <= new Date().getTime() - 8.64e6;
		},
	},
      id: "",
      list: [{ value: "是" }, { value: "否" }],
      //parentValue: "",
      typeValue: "",
      ruleForm: {
		  deadline:"",
		  testRequirement:'',
		  examineCount:"",
		  needCount:"",
		  ownCount:"",
		  projectName:"",
		  type:"",
		  id:""
	  }
    };
  },
  created: function() {
     if (!this.$route.query.id) {
       this.$router.push({ path: "testEmploy" });
       return false;
     }
     this.id = this.$route.query.id;
	 //alert(this.id);
     this.GETALLTYPE();
  },
  watch: {
    //监听获取项目类型完成后渲染数据
    getAllType() {
      httpGet(`/v1/public/bid/get/itemtest?id=${this.id}`).then(
        results => {
          const { httpCode } = results.data;
          if (httpCode === 200) {
            let newData = results.data.data;
            
            newData.deadline = specificDate(newData.deadline);
            this.ruleForm = newData;
          } else if (httpCode === 400) {
            errTips("页面丟失");
            this.setCache("testEmploy");
          }
        }
      );
    }
  },
  computed: {
    ...mapGetters(["getAllType","getUser"])
  },
  methods: {
    ...mapMutations(["setCache"]),
    ...mapActions(["GETALLTYPE"]),
	returnMyTest() {
	  this.$router.push({ path: "./myTest" });
	},
	setIdCard() {
		if(this.ruleForm.needCount < this.ruleForm.ownCount) {
			errTips('所需人数不能小于现有人数');
			return false;
		}
		httpPut('/v1/authorization/test/testinfo/update', this.ruleForm).then(results => {
			const { msg, httpCode } = results.data;
			if (httpCode === 200) {
				successTips('修改测试成功！');
				this.setCache("myTest");
			} else if (httpCode !== 401) {
				errTips(msg);
			}
		});
	},
	submitForm(formName) {
		this.$refs[formName].validate(valid => {
			if (valid) {
				this.setIdCard();
			} else {
				return false;
			}
		});
	}
  }
};
</script>
<style lang='scss'>
@import "@/assets/scss/applicationView.scss";
</style>