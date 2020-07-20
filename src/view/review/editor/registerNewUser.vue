<template>
	<div class="manager-container">
		<div style="padding-left: 10px;">
		<el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 130%;margin-bottom: 20px;">
		  <el-breadcrumb-item :to="{ path: '/editorManager' }">评审管理</el-breadcrumb-item>
		  <el-breadcrumb-item>注册新用户</el-breadcrumb-item>
		
		</el-breadcrumb>
		</div>
		<el-row :gutter="40">
			<el-col :span="20">
				
				<el-card class="left-card-menu">
					<!-- <h1 style="text-align: center">注册新用户</h1> -->
					<el-form
					:rules="rules"
					:model="ruleForm"
					:label-position="left"
					label-width="120px"
					style="margin-top: 2%;"
					ref="ruleForm" class="demo-ruleForm">
					<el-form-item label="由本平台进行专家资格校验" label-width="200px">
						<label v-for="(item, index) in isSee" :key="index">
							<input name="Fruit" type="radio" :value="item.value" v-model="ruleForm.checkedValue" />
							{{ item.value }}
						</label>
					</el-form-item>
					<hr style="width: 100%; color: #303133;">
					<h2 style="text-align: left;font-weight: bolder;margin-top: 2%;">检索新用户是否已在平台注册：</h2>
					<el-input v-model="keywords" placeholder="用户名/手机号/邮箱" style="width:50%;margin-top: 2%;margin-right: 20px;" auto-complete="off"></el-input>
					<el-button type="primary" @click="searchUser()">搜索</el-button>
					<div v-show="searchForm == true">
						<el-table :data="searchData " :header-cell-style="rowClass" style="margin-top:10px;">
						    <el-table-column prop="userName" label="用户名" > </el-table-column>
						    <el-table-column prop="phone" label="手机"></el-table-column>
						    <el-table-column prop="email" label="邮箱"></el-table-column>
						    <el-table-column label="操作">
						        <template slot-scope="scope" >
						            <el-button @click="chooseUser(scope.row.id)" type="text" size="medium" style="margin-left: 30%"
						                        >绑定</el-button>
						          
						        </template>
						    </el-table-column>
						</el-table>
					</div>
					<div v-show="haveUser == false">
					<h2 style="text-align: left;font-weight: bolder;margin-top: 2%;margin-bottom: 2%;">登录账号</h2>
					<el-form-item label="请输入用户名" :prop="userName" :error="errorList.userError">
						<el-input v-model="ruleForm.userName" style="width:40%"></el-input>
					</el-form-item>
					<el-form-item label="请输入密码">
						<el-input type="password" v-model="ruleForm.password" style="width:40%"></el-input>
					</el-form-item>
					<el-form-item label="请再次输入密码">
						<el-input type="password" v-model="ruleForm.checkPass" style="width:40%"></el-input>
					</el-form-item>
					</div>
					<h2 style="text-align: left;font-weight: bolder;margin-top: 2%;margin-bottom: 2%;">基本资料</h2>
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item label="姓名" prop="userName">
								<el-input v-model="ruleForm.userName" ></el-input>
							</el-form-item>
							
						</el-col>
						<el-col :span="12">
							<el-form-item label="性别" >
								<el-select v-model="ruleForm.sex" placeholder="请选择性别" style="width: 100%;">
									<el-option label="男" value="1"></el-option>
									<el-option label="女" value="2"></el-option>
									<el-option label="未知" value="3"></el-option>
								</el-select>
							</el-form-item>
							<!-- <div style="text-align: center;">
							<el-upload
							  class="avatar-uploader"
							  action="https://jsonplaceholder.typicode.com/posts/"
							  :show-file-list="false"
							  :on-success="handleAvatarSuccess"
							  :before-upload="beforeAvatarUpload">
							  <img v-if="imageUrl" :src="imageUrl" class="avatar">
							  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
							</el-upload>
							</div> -->
						
						</el-col>
					</el-row>
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item label="邮箱" >
								<el-input v-model="ruleForm.email" ></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="手机" >
								<el-input v-model="ruleForm.phone" ></el-input>
							</el-form-item>
						</el-col>
					
					</el-row>
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item label="学历" >
								<el-select v-model="ruleForm.education" placeholder="请选择学历" style="width: 100%;">
									<el-option label="高中" value="1"></el-option>
									<el-option label="大专" value="2"></el-option>
									<el-option label="本科" value="3"></el-option>
									<el-option label="研究生" value="4"></el-option>
									<el-option label="博士" value="5"></el-option>
									<el-option label="博士后" value="6"></el-option>
									<el-option label="院士" value="7"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="职位" >
								<el-input v-model="ruleForm.position" ></el-input>
							</el-form-item>
						</el-col>
					
					</el-row>
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item label="职称" >
								<el-input v-model="ruleForm.jobTitle" ></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="个人主页" >
								<el-input v-model="ruleForm.homepage" ></el-input>
							</el-form-item>
						</el-col>
					
					</el-row>
					<el-row :gutter="20">
					
						<el-col :span="12">
							<el-form-item label="工作单位" >
								<el-input v-model="ruleForm.workUnit" ></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="部门" >
								<el-input v-model="ruleForm.department" ></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item label="国家" >
								<!-- <el-input v-model="ruleForm.nation" ></el-input> -->
								<foreign-area popularCity="" selectBg="selectGray" groupBg="groupGray" @selectCountry="selectCountry"></foreign-area>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="省市/自治区">
								<el-cascader
								  size="large"
								  placeholder="请选择省市"
								  :options="options"
								  v-model="selectedOptions"
								  style="width: 100%;"
								></el-cascader>
							</el-form-item>
						</el-col>
					
					
					</el-row>
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item label="地址" >
								<el-input v-model="ruleForm.address" ></el-input>
							</el-form-item>
						</el-col>
					
					
					
					</el-row>
			
					
						<!-- <el-button type="primary"  @click="submitForm('ruleForm')" size="medium" style="width:150px;">注册</el-button> -->
					
			
					</el-form>
					<div style="text-align: center;">
						<el-button type="primary"  @click="submitForm('ruleForm')" size="medium" style="width:150px;">注册</el-button>
					</div>
					
				</el-card>
			</el-col>
		</el-row>
	

	</div>
</template>

<script>
	import submitReview from '@/view/review/components/submitReview';
	import { httpGet,httpPost,httpPut, httpDelete } from "@/utils/http.js";
	import { specificDate } from '@/utils/getDate.js';
	import { message, successTips, errTips } from "@/utils/tips.js";
	import foreignArea from "@/view/loginRegister/register/components/foreignArea";
	import regular from "@/mixins/regular/personRegister.js";
	import {provinceAndCityData,CodeToText} from "element-china-area-data";
	export default {
		components:{
			submitReview,
			foreignArea,
		},
		name: 'registerNewUser',
		mixins: [regular],
		data() {
			return {
				options: provinceAndCityData,
				newcity: CodeToText,
				isSee: [{ value: '是' }, { value: '否' }],
				keywords:"",
				searchForm:false,
				searchData:[],
				keywordsVisible:false,
				haveUser:true,
				imageUrl: '',
				ruleForm: {
					checkPass:"",
					checkedValue:"否",
					address: "",
					city: "",
					//contactAddress: "",
					cruxList:[],
					department: "",
					education:null,
					email: "",
					headurl:"",
					homepage:"",
					//id:null,
					jobTitle:"",
					//name:"",
					nation:"",
					password:"",
					phone:"",
					position:"",
					province:"",
					researchDirectionList:[],
					role:4,
					school:"",
					sex :null,
					userName:"",
					workUnit :"",
				},
			}
		},
		computed: {
		},
		created: function() {
		 // this.getView();
		},
		methods: {
			selectCountry(val){
				//console.log(val);
				this.ruleForm.nation=val;
			},
			submitForm(formName){
				this.ruleForm.province = this.newcity[this.selectedOptions[0]];
				this.ruleForm.city = this.newcity[this.selectedOptions[1]];
				this.ruleForm.researchDirectionList=this.value;
				//console.log(this.researchObject);
				console.log(this.ruleForm);
				//post /v1/authorization/coreuser/review/costmer 
				if(this.haveUser === false) {
					httpPost("/v1/authorization/coreuser/review/costmer",this.ruleForm).then(results => {
						const{httpCode,msg} = results.data;
						if (httpCode === 200) {
							successTips('注册新用户成功');
						} else {
							errTips(msg);
						}
						this.keywords="",
						Object.assign(this.$ruleForm, this.$options.ruleForm())
					})
				} else{
					
					//put /v1/authorization/coreuser/review/user 
					httpPut("/v1/authorization/coreuser/review/user",this.ruleForm).then(results => {
						const{httpCode,msg} = results.data;
						if (httpCode === 200) {
							successTips('用户已变为专家');
						} else {
							errTips(msg);
						}
						this.keywords="",
						Object.assign(this.$ruleForm, this.$options.ruleForm())
					})
				}
				
			},
			chooseUser(val){
				
//get /v1/authorization/coreuser/review/byidregister 
				httpGet("/v1/authorization/coreuser/review/byidregister",{ id:val}).then(results => {
				  const { httpCode, msg, data } = results.data;
				  
				  if (httpCode === 200) {
				    this.ruleForm=data;
					console.log(this.ruleForm);
				  } else  {
					this.searchData=[];
					this.haveUser=false;
				    errTips(msg);
				  }
				  this.searchForm=true;
				});
			},
			searchUser(){
				this.searchData=[];
				httpGet("/v1/authorization/coreuser/review/user",{userNamePhoneEmail:this.keywords}).then(results => {
				  const { httpCode, msg, data } = results.data;
				  
				  if (httpCode === 200) {
				    this.searchData.push({email:data.email,id:data.id,phone:data.phone,userName:data.userName});
				  } else  {
					this.searchData=[];
					this.haveUser=false;
				    errTips(msg);
				  }
				  this.searchForm=true;
				});
			},
	
			rowClass() {
			  return "background:#F4F6F9;";
			}
		}
	}
</script>

<style lang="scss" scoped>
	.add {
		cursor: pointer;
		color: #8c8c8c;
		
		&:hover {
			color: #3e76b8;
		}
	}
	 .avatar-uploader .el-upload {
	    border: 1px solid #d9d9d9;
	    border-radius: 6px;
	    cursor: pointer;
	    position: relative;
	    overflow: hidden;
	  }
	  .avatar-uploader .el-upload:hover {
	    border-color: #409EFF;
	  }
	  .avatar-uploader-icon {
	    font-size: 28px;
	    color: #8c939d;
	    width: 100px;
	    height: 100px;
	    line-height: 100px;
	    text-align: center;
	  }
	  .avatar {
	    width: 100px;
	    height: 100px;
	    display: block;
	  }
</style>
