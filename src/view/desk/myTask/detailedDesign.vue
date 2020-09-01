<!--
功能：第一次提交详细设计文档（不用获取文档内容）
引用：我的任务的提交文档
-->
<template>
	<div class="applicationView">
		<div class="header">
			<div class="container deskHeader">
				<h4>
					您的位置：
					<router-link to="myTask">我的任务</router-link>
					>
					<span class="active">提交文档</span>
				</h4>
			</div>
		</div>
		<div class="container">
			<el-card class="box-card0">
				<h1 style="color: #303133;">我的任务-详细设计</h1>
				<br />
				<br />

				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
					<el-button type="primary" size="large" style="width:150px;margin-left:85%">下载模板</el-button>
					<br />
					<br />

					<el-form-item label="引言" prop="introduction">
						<el-input type="textarea" class="input_textarea " v-model="ruleForm.introduction" :rows="10" style="width:87%;float:right"></el-input>
					</el-form-item>

					<el-form-item label="系统组织结构" prop="functionality">
						<el-input type="textarea" class="input_textarea " v-model="ruleForm.functionality" :rows="10" style="width:87%;float:right"></el-input>
					</el-form-item>

					<el-form-item label="模块设计说明" prop="design">
						<el-input type="textarea" class="input_textarea " v-model="ruleForm.design" :rows="10" style="width:87%;float:right"></el-input>
					</el-form-item>

					<el-form-item label="原文件" prop="sourceFile">
						<div style="margin-left: 110px;"><sourceUpload :uploadIndex="uploadIndex" v-on:setIdCard="setIdCard($event)" /></div>
					</el-form-item>

					<el-form-item class="cancel">
						<el-button type="primary" @click="returnMyTask" size="medium" style="width:150px;margin-left:25%">返回</el-button>
						<el-button type="primary" @click="submitForm('ruleForm')" size="medium" style="width:150px;margin-left:25%">保存</el-button>
					</el-form-item>
				</el-form>
			</el-card>
		</div>
	</div>
</template>

<script>
import { httpGet,httpPut, httpPost } from '@/utils/http.js';
import { errTips, successTips } from '@/utils/tips.js';
import { mapMutations, mapActions, mapGetters } from 'vuex';
import sourceUpload from '@/common/upload/resourceUpload';
export default {
	components: {
		sourceUpload
	},
	data() {
		return {
			uploadIndex: false,
			ruleForm: {
				demand: '', //设计约束(这个页面没有用到)
				design: '', //模块设计说明
				documentsId: null, //文档编号ID （如果这个页面没有用到这个参数是否需要写在ruleForm里面）
				functionality: '', //系统组织结构
				id: null, //任务编号ID，修改任务信息需要（没有用到）
				introduction: '', //引言
				remark: '', //备注（没有用到）
				sourceFile: '' //原文件
			},
			// 表单验证
			rules: {
				introduction: [{ required: true, message: '请输入引言', trigger: 'blur' }],
				functionality: [{ required: true, message: '请输入系统组织结构', trigger: 'blur' }],
				design: [{ required: true, message: '请输入模块设计说明', trigger: 'blur' }]
			}
		};
	},

	created: function() {
		this.ruleForm.id = this.$route.query.id;
	},

	methods: {
		...mapMutations(['setCache']),
		returnMyTask() {
			this.$router.push({ path: './myTask' });
		},
		// 提交ruleFrom不知道对不对
		setIdCard(data) {
			data && (this.ruleForm.sourceFile = data);
			httpPut('/v1/authorization/mission/missioncommit/update', this.ruleForm).then(results => {
				const { msg, httpCode } = results.data;
				if (httpCode === 200) {
					successTips('提交详细设计成功');
					this.setCache('myTask');
				} else if (httpCode !== 401) {
					errTips(msg);
				}
			});
		},

		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.ruleForm.sourceFile ? this.setIdCard() : (this.uploadIndex = !this.uploadIndex);
				} else {
					return false;
				}
			});
		},

	}
};
</script>
<style lang="scss">
@import '@/assets/scss/applicationView.scss';
</style>
