<template>
	<div class="applicationView">
		<div class="header">
			<div class="container deskHeader">
				<h4>
					您的位置：
					<router-link to="myTask">我的任务</router-link>
					>
					<span class="active">查看任务</span>
				</h4>
			</div>
		</div>
		<div class="container">
			<el-card class="box-card0" style="text-align: left">
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
					<el-form-item label="项目名称:">
						<span>{{ ruleForm.projectName }}</span>
					</el-form-item>
					
					<el-form-item label="任务名称:">
						<span>{{ ruleForm.content}} / {{ruleForm.subtitle}}</span>
					</el-form-item>
					<el-form-item label="任务类型:">
						<span>{{ missionType }}</span>
					</el-form-item>
					
					<el-form-item label="任务开始时间:">
						<span>{{ ruleForm.startTime }}</span>
					</el-form-item>
					
					<el-form-item label="任务截止时间:">
						<span>{{ ruleForm.endTime }}</span>
					</el-form-item>
					
					<el-form-item label="任务更新时间:">
						<span>{{ ruleForm.gmtModified }}</span>
					</el-form-item>
					
					<el-form-item label="附件:">
					  <a :href="ruleForm.sourceFile" target="_Blank" v-if="ruleForm.sourceFile">下载附件</a>
					  <a target="_Blank" v-if="!ruleForm.sourceFile">暂无附件</a>
					</el-form-item>
					
					<el-form-item label="描述: ">
						<span>{{ ruleForm.description}}</span>
					</el-form-item>

					<el-form-item class="cancel"><el-button type="primary" @click="returnTask" size="medium" style="width:150px;margin-left:45%">返回</el-button></el-form-item>
				</el-form>
			</el-card>
		</div>
	</div>
</template>

<script>
import { httpGet, httpPost } from '@/utils/http.js';
import { specificDate } from "@/utils/getDate.js";
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
			missionTypeName :[],
			missionType:'',
			endTime:"",
			startTime:"",
			gmtModified:"",
			ruleForm: {
			}
		};
	},

	created: function() {
		this.id = this.$route.query.id;
		this.getMissionType();
		this.getView();
	},

	methods: {
		getMissionType(){
			//get /v1/public/bid/missiontypeall/all 
			httpGet(`/v1/public/bid/missiontypeall/all`).then(results => {
				const { data, msg,httpCode } = results.data;
				if (httpCode === 200) {
					this.missionTypeName = data.missionTypeList;
				} else {
					errTips(msg);
					//this.setCache('documentOpinion');
				}
			});
			
		},
		getView() {
			//alert(this.id);
			
//get /v1/authorization/mission/getInfo/get 
			httpGet(`/v1/authorization/mission/getInfo/get?id=${this.id}`).then(results => {
				const { data, httpCode } = results.data;
				if (httpCode === 200) {
					let newData = data;
					newData.endTime = specificDate(newData.endTime);
					newData.startTime = specificDate(newData.startTime);
					newData.gmtModified = specificDate(newData.gmtModified);
					this.ruleForm = newData;
					for (var i = 0; i < this.missionTypeName.length; i++) {
						//console.log(this.missionTypeName[i]);
						if (this.missionTypeName[i].id == this.ruleForm.missionTypeId) {
							this.missionType=this.missionTypeName[i].missionName;
						}
					}
				} else if (httpCode === 400) {
					errTips('页面丟失');
					this.setCache('documentOpinion');
				}
			});
		},
		

		returnTask() {
			this.$router.push({ path: './myTask' });
		}
	}
};
</script>
<style lang="scss">
@import '@/assets/scss/applicationView.scss';
</style>
