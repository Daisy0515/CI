<template>
	<div class="applicationView">
		<div class="header">
			<div class="container deskHeader">
				<h4>
					您的位置：
					<router-link to="./myTest">我的测试</router-link>>
					<span class="active">发布任务</span>
				</h4>
			</div>
		</div>
		<div class="container">
			<el-card class="box-card0" style="text-align: left;">
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">

					<el-form-item label="任务名称" prop="missionName">
						<el-input class="input_title title" v-model="ruleForm.missionName"></el-input>
					</el-form-item>

					<el-form-item label="开始时间" prop="startTime">
						<el-date-picker
								style="margin-left:0%"
								v-model="ruleForm.startTime"
								:picker-options="endDatePicker"
								type="date"
								placeholder="开始时间"
								value-format="yyyy-MM-dd"
						></el-date-picker>
					</el-form-item>

					<el-form-item label="截止时间" prop="endTime">
						<el-date-picker
								style="margin-left:0%"
								v-model="ruleForm.endTime"
								:picker-options="endDatePicker"
								type="date"
								placeholder="截止时间"
								value-format="yyyy-MM-dd"
						></el-date-picker>
					</el-form-item>


					<el-form-item label="任务描述" prop="description">
						<el-input type="textarea" class="input_textarea " v-model="ruleForm.description" :rows="10" style="width:100%;float:right"></el-input>
					</el-form-item>

					<el-form-item label="上传附件"><sourceUpload :uploadIndex="uploadIndex" v-on:setIdCard="setIdCard($event)" /></el-form-item>

					<el-form-item class="cancel">
						<el-button type="primary" @click="returnMyTest" size="medium" style="width:150px;margin-left:25%">返回</el-button>
						<el-button type="primary" @click="submitForm('ruleForm')" size="medium" style="width:150px;margin-left:25%">保存</el-button>
					</el-form-item>
				</el-form>
			</el-card>
		</div>
	</div>
</template>

<script>
	import { httpGet,httpPost } from "@/utils/http.js";
	import { errTips,successTips } from "@/utils/tips.js";
	import { mapMutations, mapActions, mapGetters } from "vuex";
	import sourceUpload from '@/common/upload/resourceUpload';
	export default {
		components: {
			sourceUpload
		},
		data() {
			return {
				endDatePicker: {
					disabledDate(time) {
						return time.getTime() < new Date().getTime()- 86400000 ;
					},
				},
				uploadIndex: false,
				types:[],
				ruleForm: {
					missionName:"",//项目名称
					description:"",//测试需求
					endTime:"",//截止时间
					startTime:"",
					sourceFile:"",//测试链接
					id:""//所需人数
				},
				// 表单验证
				rules: {
					missionName: [
						{required: true,message: "请输入任务名称",trigger: "blur"}
					],
					description: [
						{required: true,message: "请输入任务描述",trigger: "blur"}
					],
					endTime: [
						{required: true,message: "请输入测试截止时间",trigger: "blur"}
					],
					startTime: [
						{required: true,message: "请输入测试开始时间",trigger: "blur"}
					]
				}
			};
		},

		created: function() {
			this.ruleForm.id = this.$route.query.id;
		},

		methods: {
			...mapMutations(["setCache"]),

			setIdCard(data) {
				data && (this.ruleForm.sourceFile = data);
				// post /v1/authorization/test/testmission/insert
				//alert(this.ruleForm);
				httpPost("/v1/authorization/test/testmission/insert", this.ruleForm).then(results => {

					const { msg, httpCode } = results.data;
					if (httpCode === 200) {
						successTips("发布测试任务成功！");
						this.setCache("myTest");
					} else if (httpCode !== 401) {
						errTips(msg);
					}
				});
			},
			returnMyTest() {
				this.$router.push({ path: "./myTest" });
			},
			submitForm(formName) {
				this.$refs[formName].validate(valid => {
					if (valid) {
						this.ruleForm.sourceFile ? this.setIdCard() : (this.uploadIndex = !this.uploadIndex);
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
