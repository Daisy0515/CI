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
					<el-form
					:rules="rules"
					:model="ruleForm"
					style="margin-top: 2%;"
					ref="ruleForm" class="demo-ruleForm">
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item label="姓名">
								<el-input v-model="ruleForm.userName" style="width: 70%;"></el-input>
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
								<el-input v-model="ruleForm.userName" style="width: 70%;"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="手机">
								<el-input v-model="ruleForm.userName" style="width: 70%;"></el-input>
							</el-form-item>
						</el-col>
						
					</el-row>
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item label="学历">
								<el-input v-model="ruleForm.userName" style="width: 70%;"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="职位">
								<el-input v-model="ruleForm.userName" style="width: 70%;"></el-input>
							</el-form-item>
						</el-col>
						<hr style="width: 100%; color: #303133;">
					</el-row>
					<h2 style="text-align: left;font-weight: bolder;margin-top: 2%;margin-bottom: 2%;">机构相关信息</h2>
					<el-row :gutter="20">
						
						<el-col :span="12">
							<el-form-item label="单位">
								<el-input v-model="ruleForm.userName" style="width: 70%;"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="地址">
								<el-input v-model="ruleForm.userName" style="width: 70%;"></el-input>
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
								<el-input v-model="ruleForm.userName" style="width: 70%;"></el-input>
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
								<el-input v-model="ruleForm.userName" style="width: 70%;"></el-input>
							</el-form-item>
						</el-col>
				
					</el-row>
					<el-row :gutter="20">
						<el-col >
							<el-form-item label="个人关键词">
								<el-input v-model="ruleForm.userName" style="width: 70%;"></el-input>
							</el-form-item>
						</el-col>
						
						
					</el-row>
					<el-form-item class="cancel" style="text-align: center;">
						<el-button type="primary" @click="submitForm('ruleForm')" size="medium" style="width:150px;">保存</el-button>
					</el-form-item>
					</el-form>
					
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
	import submitReview from '@/view/review/components/submitReview';
	import { httpGet, httpDelete } from "@/utils/http.js";
	import { specificDate } from '@/utils/getDate.js';
	import { message, successTips, errTips } from "@/utils/tips.js";
	
	export default {
		components:{
			submitReview
		},
		name: 'Dashboard',
		data() {
			return {
				role:2,
				submitTitle:"发起评审",
				dialogSubmitVisible: false, // 开启发起评审视窗
				aboutTimeoutCount: 0, // 即将超时
				acceptCount: 0, // 未接受
				alreadyTimeoutCount: 0, // 已经超时
				reviewCount: 0, // 评审中
				ruleForm:{
					password: "",
					checkPass: "",
					userName: "",
					code: "",
					phone: "",
					email: "",
					workUnit: "",
					type: []
				},
				form: {
					name: '',
					region: '',
					date1: '',
					date2: '',
					content: '',
					fileList: [{
						name: 'food.jpeg',
						url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
						status: 'finished'
					}, {
						name: 'food2.jpeg',
						url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
						status: 'finished'
					}],
					delivery: false,
					type: [],
					resource: '',
					desc: ''
				},
				formLabelWidth: '100px'
			}
		},
		computed: {
		},
		created: function() {
		 // this.getView();
		},
		methods: {
			getView(){
				//get /v1/authorization/review/summarizing/get 
				httpGet("/v1/authorization/review/summarizing/get", {role:this.role}).then(results => {
				  const { httpCode, msg, data } = results.data;
				  if (httpCode == 200) {
				    this.acceptCount=data.acceptCount;
					this.reviewCount=data.reviewCount;
					this.aboutTimeoutCount=data.aboutTimeoutCount ;
					this.alreadyTimeoutCount=data.alreadyTimeoutCount ;
				  } else if (msg == "该条件暂无数据") {
				    this.tableData = [];
				    message("该条件暂无数据");
				  } else if (httpCode !== 401) {
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
</style>
