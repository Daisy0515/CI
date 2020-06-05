<template>
	<div class="applicationView">
		<div class="header">
			<div class="container deskHeader">
				<h4>
					您的位置：
					<router-link to="myTask">我的任务</router-link>
					>
					<span class="active">查看文档</span>
				</h4>
			</div>
		</div>
		<div class="container">
			<el-card class="box-card0" style="text-align: left">
				<h1 style="color: #303133;">我的任务-详细设计</h1>
				<br />
				<br />

				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
					<el-form-item class="cancel">
						<a target="_Blank" :href="ruleForm.sourceFile" style="display:inline;margin-left: 80%;font-size: 20px;">
						  <i class="el-icon-search"></i>
						  文档预览
						</a>
					</el-form-item>

					<el-form-item label="引言">
						<span>{{ ruleForm.introduction }}</span>
					</el-form-item>

					<el-form-item label="系统组织结构">
						<span>{{ ruleForm.functionality }}</span>
					</el-form-item>

					<el-form-item label="模块设计说明">
						<span>{{ ruleForm.design }}</span>
					</el-form-item>

					<el-form-item class="cancel"><el-button type="primary" @click="returnKB" size="medium" style="width:150px;margin-left:45%">返回</el-button></el-form-item>
				</el-form>
			</el-card>
		</div>
	</div>
</template>

<script>
import { httpGet, httpPost } from '@/utils/http.js';
import { errTips, successTips } from '@/utils/tips.js';
import { mapMutations, mapActions, mapGetters } from 'vuex';
import sourceUpload from '@/common/upload/resourceUpload';
export default {
	components: {
		sourceUpload
	},
	data() {
		return {
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
			}
		};
	},

	created: function() {
		this.id = this.$route.query.id;
		this.getView();
	},

	methods: {
		getView() {
			//alert(this.id);
			httpGet(`/v1/authorization/mission/mission/get?id=${this.id}`).then(results => {
				const { data, httpCode } = results.data;
				if (httpCode === 200) {
					this.ruleForm = data;
				} else if (httpCode === 400) {
					errTips('页面丟失');
					this.setCache('documentOpinion');
				}
			});
		},

		returnKB() {
			this.$router.push({ path: './kanBan' });
		}
	}
};
</script>
<style lang="scss">
@import '@/assets/scss/applicationView.scss';
</style>
