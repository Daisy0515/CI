<template>
	<div class="manager-container">
		<div style="padding-left: 10px;">
		<el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 130%;margin-bottom: 20px;">
		  <el-breadcrumb-item :to="{ path: '/expertInformation' }">信息维护</el-breadcrumb-item>
		  <el-breadcrumb-item>专家信息</el-breadcrumb-item>
		
		</el-breadcrumb>
		</div>
		<el-row :gutter="40">
			<el-col :span="16">
				<el-card class="left-card-menu">
					<h1 style="text-align: center">专家信息</h1>
					<hr style="width: 100%; color: #303133;">
					<h2 style="text-align: left;font-weight: bolder;margin-top: 2%;">基本资料</h2>
					<div class="detail">
					<el-form :rules="rules" :model="ruleForm" style="margin-top: 2%;" ref="ruleForm" class="demo-ruleForm">
						<el-row :gutter="20">
							<el-col :span="9">
								<el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
									<el-input v-model="ruleForm.name" ></el-input>
								</el-form-item>
								<el-form-item label="性别" :label-width="formLabelWidth">
									<el-select v-model="ruleForm.sex" placeholder="请选择性别" style="width: 100%;">
										<el-option label="男" value="1"></el-option>
										<el-option label="女" value="2"></el-option>
										<el-option label="未知" value="3"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="9">
								<div style="text-align: center;">
								<Avatar></Avatar>
								</div>
								
								<!-- <el-form-item label="性别" :label-width="formLabelWidth">
									<el-select v-model="ruleForm.sex" placeholder="请选择性别" style="width: 100%;">
										<el-option label="男" value="1"></el-option>
										<el-option label="女" value="2"></el-option>
										<el-option label="未知" value="3"></el-option>
									</el-select>
								</el-form-item> -->
							</el-col>
						</el-row>
						<el-row :gutter="20">
							<el-col :span="9">
								<el-form-item label="邮箱" :label-width="formLabelWidth">
									<el-input v-model="ruleForm.email" :disabled="true"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="9">
								<el-form-item label="手机" :label-width="formLabelWidth">
									<el-input v-model="ruleForm.phone" :disabled="true"></el-input>
								</el-form-item>
							</el-col>
					
						</el-row>
						<el-row :gutter="20">
							<el-col :span="9">
								<el-form-item label="学历" :label-width="formLabelWidth">
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
							<el-col :span="9">
								<el-form-item label="职位" :label-width="formLabelWidth">
									<el-input v-model="ruleForm.position" ></el-input>
								</el-form-item>
							</el-col>
					
						</el-row>
						<el-row :gutter="20">
							<el-col :span="9">
								<el-form-item label="职称" :label-width="formLabelWidth">
									<el-input v-model="ruleForm.jobTitle" ></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="9">
								<el-form-item label="个人主页" :label-width="formLabelWidth">
									<el-input v-model="ruleForm.homepage" ></el-input>
								</el-form-item>
							</el-col>
					
						</el-row>
						<el-row :gutter="20">
					
							<el-col :span="9">
								<el-form-item label="工作单位" :label-width="formLabelWidth">
									<el-input v-model="ruleForm.workUnit" ></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="9">
								<el-form-item label="部门" :label-width="formLabelWidth">
									<el-input v-model="ruleForm.department" ></el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row :gutter="20">
							<el-col :span="9">
								<el-form-item label="国家" :label-width="formLabelWidth">
									<!-- <el-input v-model="ruleForm.nation" ></el-input> -->
									<foreign-area popularCity="" selectBg="selectGray" groupBg="groupGray" @selectCountry="selectCountry"></foreign-area>
								</el-form-item>
							</el-col>
							<el-col :span="9">
								<el-form-item label="省市/自治区":label-width="formLabelWidth">
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
							<el-col :span="9">
								<el-form-item label="通讯地址" :label-width="formLabelWidth">
									<el-input v-model="ruleForm.contactAddress" ></el-input>
								</el-form-item>
							</el-col>
					
					
							<hr style="width: 100%; color: #303133;">
						</el-row>
						<h2 style="text-align: left;font-weight: bolder;margin-top: 2%;margin-bottom: 2%;">研究兴趣</h2>
						<el-row :gutter="20">
							<el-col :span="19">
							<el-form-item label="研究方向":label-width="formLabelWidth" prop="researchDirection">
								<el-input v-model="researchName" ></el-input>
							</el-form-item>
							</el-col>
							<el-col :span="5">
								<div style="text-align: left;margin-top: 5px;">
								<el-button  type="text" @click="keywordsVisible = true" class="add" ><i class="el-icon-plus"></i>添加</el-button>
								</div>
								
								<el-dialog title="请选择个人研究方向" :visible.sync="keywordsVisible" style="text-align: left;" width="30%">
									<div style="margin-left: 60px;">
									<el-transfer
								    
								     v-model="value"
								     :data="data">
								   </el-transfer>
								   </div>
								  <div slot="footer" class="dialog-footer">
								    <el-button @click="keywordsVisible = false">取 消</el-button>
								    <el-button type="primary" @click="printValue">确 定</el-button>
								  </div>
								</el-dialog>
							</el-col>
					
						</el-row>
						<!-- <el-row :gutter="20">
						<div style="text-align: left;margin-bottom: 15px;margin-left: 100px;">
							<el-checkbox-group v-model="researchObject" @change="handleCheckedCitiesChange(value)">
							    <el-checkbox v-for="item in researchList" :label="item.researchDirection" :key="item.id" :value="item.id">{{item.researchDirection}}</el-checkbox>
							  </el-checkbox-group>
					
							
						</div>
						</el-row> -->
						<el-row :gutter="20">
							<el-col :span="12">
								<el-form-item label="个人关键词" :label-width="formLabelWidth">
									<el-input v-model="ruleForm.cruxList" ></el-input>
								</el-form-item>
								
							</el-col>
							<el-col :span="12">
								<div style="text-align: left;margin-top: 10px;">
								<el-popover placement="right" v-model="visible" width="200">
									<el-input placeholder="关键词" v-model="interest"></el-input>
									<div style="text-align: right; margin-top: 10px">
										<el-button size="mini" type="text" @click="visible = false">取消</el-button>
										<el-button type="primary" size="mini" @click="addMission">确定</el-button>
									</div>
								
									<span class="add" slot="reference">
										<i class="el-icon-plus"></i>
										新建关键词
									</span>
								</el-popover>
								</div>
							</el-col>
						
						</el-row>
							
						<el-form-item class="cancel" style="text-align: center;">
							<el-button type="primary"  @click="submitForm('ruleForm')" size="medium" style="width:150px;">注册</el-button>
						</el-form-item>
					</el-form>
					</div>
					<!-- <h2 style="text-align: left;font-weight: bolder;margin-top: 2%;">基本资料</h2>
					<el-form
					:rules="rules"
					:model="ruleForm"
					style="margin-top: 2%;"
					ref="ruleForm" class="demo-ruleForm">
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item label="姓名">
								<el-input v-model="ruleForm.name" style="width: 70%;"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="性别">
								<el-select v-model="ruleForm.userName" placeholder="请选择活动区域">
									<el-option label="区域一" value="shanghai"></el-option>
									<el-option label="区域二" value="beijing"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item label="邮箱">
								<el-input v-model="ruleForm.email" style="width: 70%;"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="手机">
								<el-input v-model="ruleForm.phone" style="width: 70%;"></el-input>
							</el-form-item>
						</el-col>
						
					</el-row>
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item label="学历">
								<el-input v-model="ruleForm.education" style="width: 70%;"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="职位">
								<el-input v-model="ruleForm.position" style="width: 70%;"></el-input>
							</el-form-item>
						</el-col>
						<hr style="width: 100%; color: #303133;">
					</el-row>
					<h2 style="text-align: left;font-weight: bolder;margin-top: 2%;margin-bottom: 2%;">机构相关信息</h2>
					<el-row :gutter="20">
						
						<el-col :span="12">
							<el-form-item label="单位">
								<el-input v-model="ruleForm.workUnit" style="width: 70%;"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="地址">
								<el-input v-model="ruleForm.address " style="width: 70%;"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item label="省市/自治区">
								<el-input v-model="ruleForm.userName" style="width: 70%;"></el-input>
							</el-form-item>
						</el-col>
						
						
					</el-row>
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item label="国家">
								<el-input v-model="ruleForm.nation" style="width: 70%;"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="院所/机构">
								<el-input v-model="ruleForm.userName" style="width: 60%;"></el-input>
							</el-form-item>
						</el-col>
				
						<hr style="width: 100%; color: #303133;">
					</el-row>
					<h2 style="text-align: left;font-weight: bolder;margin-top: 2%;margin-bottom: 2%;">研究兴趣</h2>
					<el-row :gutter="20">
						
						<el-col :span="12">
							<el-form-item label="研究方向">
								<el-input v-model="ruleForm.researchDirectionList" style="width: 70%;"></el-input>
							</el-form-item>
						</el-col>
				
					</el-row>
					<el-row :gutter="20">
						<el-col >
							<el-form-item label="个人关键词">
								<el-input v-model="ruleForm.cruxList " style="width: 70%;"></el-input>
							</el-form-item>
						</el-col>
						
						
					</el-row>
					<el-form-item class="cancel" style="text-align: center;">
						<el-button type="primary" @click="submitForm('ruleForm')" size="medium" style="width:150px;">保存</el-button>
					</el-form-item>
					</el-form> -->
					
				</el-card>
			</el-col>
			<el-col :span="6">
				<el-card class="right-card-menu">
					<el-row style="margin-bottom: 20px;">
						<h1 style="text-align: center">密码管理</h1>
						
					</el-row>
					<el-row style="margin-bottom: 25px;text-align: center">
						<el-card>
						<router-link to>
							<span>修改密码</span>
							
						</router-link>
						</el-card>
					</el-row>
					<el-row style="margin-bottom: 15px;text-align: center">
						<el-card>
							<router-link to>
							<span>忘记密码</span>
							</router-link>
						</el-card>
					</el-row>
				</el-card>
			</el-col>
		</el-row>
	

	</div>
</template>

<script>
	import { httpGet, httpDelete } from "@/utils/http.js";
	import { specificDate } from '@/utils/getDate.js';
	import { message, successTips, errTips } from "@/utils/tips.js";
	import {provinceAndCityData,CodeToText} from "element-china-area-data";
	import foreignArea from "@/view/loginRegister/register/components/foreignArea";
	import Avatar from "@/common/upload/Avatar";
	export default {
		components: {
			foreignArea,
			Avatar
		},
		data() {
			return {
				formLabelWidth:'100px',
				ruleForm:{
					address: "",
					city: "",
					contactAddress: "",
					cruxList:[],
					department: "",
					education:null,
					email: "",
					headurl:"",
					homepage:"",
					id:null,
					jobTitle:"",
					name:"",
					nation:"",
					phone:"",
					position:"",
					province:"",
					researchDirectionList:[],
					role:3,
					school:"",
					sex :null,
					workUnit :"",
				},
				
			}
		},
		computed: {
		},
		created: function() {
		  this.getView();
		},
		methods: {
			getView(){
				//get /v1/authorization/coreuser/reviewexpert/get 
				alert(1);
				httpGet("/v1/authorization/coreuser/reviewexpert/get").then(results => {
				  const { httpCode, msg, data } = results.data;
				  if (httpCode == 200) {
				    this.ruleForm=data;
					// this.ruleForm.researchDirectionList=data.typeList;//?
					// this.ruleForm.department=data.uDepartment ;
					// this.ruleForm.education=data.uEducation  ;
					// this.ruleForm.email =data.uEmail  ;
					// this.ruleForm.id=data.uId  ;
					// this.ruleForm.jobTitle=data.uJobTitle  ;
					// this.ruleForm.name=data.uName  ;
					// this.ruleForm.nation=data.uNation  ;
					// this.ruleForm.workUnit=data.uWorkUnit  ;
					
				  } else {
				    errTips(msg);
				  }
				  
				});
			},
			handleChange(file, fileList) {
				this.fileList = fileList.slice(-3)
			},
			closeSubmitDialog(){
				this.dialogSubmitVisible = false;
			},
		}
	}
</script>

<style lang="scss" scoped>
.detail{
	.el-input {
		//display: inline-block;
		width: 200px;
		
	}
	// .el-select {
	// 	width: 150px;
	// }
}
</style>
