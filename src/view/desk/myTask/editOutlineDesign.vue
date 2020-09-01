<!--
功能：编辑概要设计文档
引用：文档意见的编辑文档
-->
<template>
	<div class="applicationView">
		<div class="header">
			<div class="container deskHeader">
				<h4>
					您的位置：
					<router-link to="documentOpinion">文档意见</router-link>
					>
					<span class="active">编辑文档</span>
				</h4>
			</div>
		</div>
		<div class="container">
			<el-card class="box-card0">
				<h1 style="color: #303133;">我的任务-概要设计-编辑</h1>
				<br />
				<br />

				<el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm">
					<el-form-item class="cancel">
						<div style="float: right;">
						<a target="_Blank" :href="ruleForm.sourceFile" style="display:inline;font-size: 20px;">
						  <i class="el-icon-search"></i>
						  文档预览&nbsp;&nbsp;
						</a>
						<el-button type="primary" @click="" size="large" style="width:150px;display: inline;">下载模板</el-button>
						</div>
					</el-form-item>

					<el-form-item label="总体设计" prop="introduction">
						<el-input type="textarea" class="input_textarea " v-model="ruleForm.introduction" :rows="10" style="width:90%;float:right"></el-input>
					</el-form-item>

					<el-form-item label="接口设计" prop="functionality">
						<el-input type="textarea" class="input_textarea " v-model="ruleForm.functionality" :rows="10" style="width:90%;float:right"></el-input>
					</el-form-item>

					<el-form-item label="数据结构设计" prop="design">
						<el-input type="textarea" class="input_textarea " v-model="ruleForm.design" :rows="10" style="width:90%;float:right"></el-input>
					</el-form-item>

					<el-form-item label="备注" prop="remark">
						<el-input type="textarea" class="input_textarea " v-model="ruleForm.remark" :rows="10" style="width:90%;float:right"></el-input>
					</el-form-item>

					<el-form-item label="原文件" prop="sourceFile">
						<!-- <p>{{saveData.fileName}}</p> -->
						<div style="margin-left: 110px;"><source-Upload :uploadIndex="uploadIndex" v-on:setIdCard="setIdCard($event)" /></div>
					</el-form-item>

					<el-form-item class="cancel">
						<el-button type="primary" @click="returnDO" size="medium" style="width:150px;margin-left:25%">返回</el-button>
						<el-button type="primary" @click="submitForm('ruleForm')" size="medium" style="width:150px;margin-left:25%">提交</el-button>
					</el-form-item>
				</el-form>
			</el-card>
		</div>
	</div>
</template>

<script>
import { httpGet, httpPut,httpPost } from '@/utils/http.js';
import { errTips, successTips } from '@/utils/tips.js';
import { mapMutations, mapActions, mapGetters } from 'vuex';
import sourceUpload from '@/common/upload/resourceUpload';
export default {
	components: {
		sourceUpload
	},
	data() {
		return {
			//？？？获取数据和提交数据的数据有区别，是否都需要写在一个ruleForm里面
			uploadIndex: false,
			id: '',
			ruleForm: {
				demand: '', //设计约束(没用到)
				design: '', //模块设计说明
				documentsId: null, //文档编号ID （如果这个页面没有用到这个参数是否需要写在ruleForm里面）
				functionality: '', //系统组织结构
				introduction: '', //引言
				missionId: null, //get??
				remark: '', //备注
				sourceFile: '' //原文件
			},
			// 表单验证
			rules: {
				remark: [{ required: true, message: '请输入此次编辑备注', trigger: 'blur' }]
			}
		};
	},
	

	created: function() {
		this.id = this.$route.query.id; //???不确定是不是这么获取
		this.getView();
	},
	

	methods: {
		...mapMutations(['setCache']),
		returnDO() {
		  this.$router.push({ path: "./documentOpinion" });
		},
		
		getView() {
			this.loading = true;
			httpGet(`/v1/authorization/documents/missioninfo/get?id=${this.id}`).then(results => {
				const { data, httpCode } = results.data;
				if (httpCode === 200) {
					this.ruleForm = data;
				} else if (httpCode === 400) {
					errTips('页面丟失');
					this.$router.push({ path: "./documentOpinion" });
				}
			});
		},
		

		//提交表单
		setIdCard(data) {
			data && (this.ruleForm.sourceFile = data);
			httpPut('/v1/authorization/documents/missioninfo/update', this.ruleForm).then(results => {
				const { msg, httpCode } = results.data;
				if (httpCode === 200) {
					successTips('编辑概要设计成功！');
					this.$router.push({ path: 'documentOpinion' });
				} else if (httpCode !== 401) {
					errTips(msg);
				}
			});
		},
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					//this.setIdCard();
					// this.ruleForm.sourceFile ? this.setIdCard() : (this.uploadIndex = !this.uploadIndex);
					this.uploadIndex = !this.uploadIndex;
				} else {
					return false;
				}
			});
		}
	}
};
</script>
<style lang="scss">
@import '@/assets/scss/applicationView.scss';
</style>
