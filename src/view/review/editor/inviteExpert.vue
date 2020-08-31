<template>
	<div class="myTable">
		<div style="padding-left: 10px;">
			<el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 130%;">
				<el-breadcrumb-item><a class="Link" href="javascript:history.back(-1)">返回上一级</a></el-breadcrumb-item>
				<el-breadcrumb-item>邀请评审专家</el-breadcrumb-item>
			</el-breadcrumb>
			<h1 style="text-align: center;margin-top:20px">评审专家选择信息综合</h1>
			<h2 style="text-align: center;font-weight: bolder;margin-top: 20px;">评审标题：
				<span style="font-weight: 400;">{{title}}</span>
			</h2>


			<h2 style="text-align: left;font-weight: bolder;margin-top: 2%;">评审设置</h2>
			<div class="setting">
				<el-form :label-position="'right'" label-width="350px" :model="ruleForm">
					<el-form-item label="评审专家人数要求">
						<el-input v-model="ruleForm.number">
							<template slot="append">人</template>
						</el-input>
					</el-form-item>
					<el-form-item label="自动取消评审专家没有响应邀请的时间限制">
						<el-input v-model="ruleForm.responseInvite">
							<template slot="append">天</template>
						</el-input>
					</el-form-item>
					<el-form-item label="邀请撤回前发送提醒邮件">
						<el-input v-model="ruleForm.inviteRevocationFront ">
							<template slot="append">天</template>
						</el-input>
					</el-form-item>
					<el-form-item label="专家接受任务后限定完成的时间">
						<el-input v-model="ruleForm.restrictReviewTime">
							<template slot="append">天</template>
						</el-input>
					</el-form-item>
					<el-form-item label="截止日期后,在取消未完成任务前每隔固定天数发生提醒邮件">
						<el-input v-model="ruleForm.deadlineRearEvery ">
							<template slot="append">次</template>
						</el-input>
					</el-form-item>
					<el-form-item label="评审截止日前发送提醒邮件">
						<el-input v-model="ruleForm.deadline">
							<template slot="append">天</template>
						</el-input>
					</el-form-item>
					<el-form-item label="是否盲审">
						<el-radio-group v-model="ruleForm.isBlindRial">
							<el-radio :label='true'>是</el-radio>
							<el-radio :label='false'>否</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="评审打分模板">
						<el-select v-model="ruleForm.templateId" clearable placeholder="请选择打分模板">
							<el-option v-for="item in templateNameList" :label="item.templateName" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="是否加入冲突检测">
						<el-radio-group v-model="ruleForm.isConflictDetection">
							<el-radio :label="true">是</el-radio>
							<el-radio :label="false">否</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-form>
				<div style="text-align: center;">
					<el-button type="primary" @click="submitForm()">提交</el-button>
				</div>
			</div>
			<h2 style="text-align: left;font-weight: bolder;margin-top: 2%;">评审专家搜索</h2>
			<div class="header_top">
				<el-button type="primary" @click="searchExpert()">专家搜索</el-button>
				<expert-search :dialogExpertVisible="dialogExpertVisible" :expertloading="loading" :reviewTitle="title" :params="expertSearchParam" @closeDialog="closeExpertSearchDialog"></expert-search>

			</div>
			<h2 style="text-align: left;font-weight: bolder;margin-top: 2%;">已邀请专家列表</h2>
			<div>
				<el-table :data="expertInviteList" style="width:700px;margin:50px auto;" :header-cell-style="rowClass" v-loading="loading">
					<el-table-column prop="userName" label="评审专家" align="center">
						<template slot-scope="scope">
							<el-tooltip class="item" effect="dark" :content="scope.row.userName" placement="top-start">
								<span class="tablehidden">{{ scope.row.userName }}</span>
							</el-tooltip>
						</template>
					</el-table-column>
					<el-table-column prop="replyOperation" label="状态" align="center">
						<template slot-scope="scope">
							<span v-if="scope.row.replyOperation==1">接受</span>
							<span v-if="scope.row.replyOperation==2">拒绝</span>
							<span v-if="scope.row.replyOperation==3">无回应</span>
							<span v-if="scope.row.replyOperation==4">同意邀请前撤回邀请</span>
						</template>
					</el-table-column>
					<el-table-column prop="gmtModified" label="状态更新时间" align="center">
						<template slot-scope="scope">
							<el-tooltip class="item" effect="dark" :content="scope.row.gmtModified" placement="top-start">
								<span class="tablehidden">{{ scope.row.gmtModified }}</span>
							</el-tooltip>
						</template>
					</el-table-column>
					<el-table-column prop="replyContent" label="回复" align="center">
					</el-table-column>
				</el-table>
			</div>

			<h2 style="text-align: left;font-weight: bolder;margin-top: 2%;">备选专家列表</h2>
			<div>
				<el-table :data="expertAlternativeList" style="width:500px;margin:50px auto;" :header-cell-style="rowClass"
						  v-loading="loading">
					<el-table-column prop="userName" label="评审专家" align="center">
						<template slot-scope="scope">
							<el-tooltip class="item" effect="dark" :content="scope.row.userName" placement="top-start">
								<span class="tablehidden">{{ scope.row.userName }}</span>
							</el-tooltip>
						</template>
					</el-table-column>
					<el-table-column prop="resourceName" label="操作" align="center">
						<template slot-scope="scope">
							<el-button @click="alterInvite(scope.row)" type="text" size="medium">
								邀请
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
	</div>
</template>

<script>
	import { httpGet, httpPut, httpPost } from "@/utils/http.js";
	import { successTips, errTips } from "@/utils/tips.js";
	import { specificDate } from '@/utils/getDate.js';
	import expertSearch from '@/view/review/editor/components/expertSearch';
	export default {
		props: ['type'], //type用来区分'新任务'，‘评审专家需要额外评审’，‘评审延期’，‘评审中’等类型
		components: {
			expertSearch
		},
		data() {
			return {
				id:null,
				templateId:null,
				previewArea:null,
				checkList:[],
				reviewId:null,
				emailForm: {
					userId:null,
					userName: null,
					index: null,
					duplicate  : {isAdmin:false , isProjectUser:false},
					config: {
						content: null,
						theme: null,
					}
				},

				totalPage: null,
				radio: '1',
				loading: false,
				ruleForm: {
					deadline: null,
					id: null,
					inviteRevocationFront :null,
					isBlindRial: 'false',
					isConflictDetection: 'false',
					number: null,
					responseInvite: null,
					restrictReviewTime: null,
					templateId: null,
					unfinished: null,
					//unfinishedEmail: null,
				},
				title: "",
				expertInviteList: [],
				expertAlternativeList: [],

				infoList: [],

				emailePrviewVisible:false, //控制邮件预览对话框
				dialogExpertVisible: false, //控制评审专家搜索对话框
				emailSettingVisible: false, //控制邮件编辑对话框

				templateList:[], //邮件模板列表
				templateNameList: [], //打分模板列表
				expertSearchParam:{
					id:null,
					reviewId:null,
					restrictReviewTime:null
				},
			};
		},
		created: function() {
			this.id = this.$route.query.id; //管理员评审任务编号ID
			this.reviewId = this.$route.query.reviewId; //主评审编号ID
			this.getView(); //获取邀请页面数据
			this.getTemplate(); //评审打分模板
		},
		computed: {},
		methods: {
			closeExpertSearchDialog(){
				this.dialogExpertVisible=false;
				this.getView();
			},
			/**邀请备选专家*/
			alterInvite(val) {
				console.log("alterExpert:", val);
				let item = {
					userId: val.userId,
					type: 1,
					isInvite: true
				};
				let arr = new Array();
				arr.push(item);
				let postForm = {id :this.id, expertInviteList:arr}
				httpPost("/v1/authorization/review/expertinvite/insert", postForm).then(results => {
					const {httpCode, msg, data} = results.data;
					if (httpCode === 200) {
						successTips("已发出邀请");
						this.getView();
					} else {
						errTips(msg);
					}
				})
			},

			getTemplate() {

				httpGet("/v1/authorization/review/templatename/list").then(results => {
					const {httpCode, msg, data} = results.data;
					if (httpCode == 200) {
						this.templateNameList = data.templateNameList;
					} else {
						this.templateNameList = [];
						errTips(msg);
					}

				})
			},

			/**专家搜索，调用组件*/
			searchExpert() {
				//console.log(this.dialogExpertVisible);
				this.expertSearchParam.id = this.id;
				this.expertSearchParam.reviewId = this.reviewId;
				this.expertSearchParam.restrictReviewTime = this.ruleForm.restrictReviewTime;
				this.dialogExpertVisible = true;
				//console.log(this.dialogExpertVisible);
			},

			submitForm() {
				console.log("submitForm");
				httpPut("/v1/authorization/review/reviewdeploy/update", this.ruleForm).then(results => {
					const { httpCode, msg} = results.data;
					console.log(httpCode);
					if (httpCode === 200) {
						successTips("评审设置提交成功！");
						this.getView();
					} else {
						errTips(msg);
					}
				})
			},
			getView() {
				httpGet("/v1/authorization/review/total/get", {id: this.id}).then(results => {
					const { httpCode, msg, data } = results.data;
					if (httpCode == 200) {
						this.ruleForm = data.adminDeployBean;
						this.title = data.title;
						this.expertAlternativeList = data.expertAlternativeList;
						let expertInviteList = data.expertInviteList;
						for (let i of expertInviteList) {
							i.gmtModified = specificDate(i.gmtModified);
						}
						this.expertInviteList = expertInviteList;
						console.log("getView:",this.ruleForm);
					} else {
						errTips(msg);
					}
					//this.loading = false;
				});
			},
			rowClass() {
				return "background:#F4F6F9;";
			}

		}
	};
</script>

<style lang="scss">
	.Link{
		color: black;
	}
	.title {
		padding: 20px 0 0 0;
		font-size: 30px;
		font-weight: 400;
		border-bottom: 0;
	}

	.header_top {
		margin-top: 2%;

		.el-input {
			display: inline-block;
			width: 150px;
			margin-right: 15px;
		}
	}

	.setting {
		margin-left: 60px;
	;

		.el-input {
			//display: inline-block;
			width: 150px;
		}
	}

	.dialog_header_top {
		.el-input {
			display: inline-block;
			width: 150px;
			margin-right: 15px;
			margin-top: 20px;
		}
	}

	.bid_footer {
		margin-bottom: 20px;

		.el-input__inner {
			width: 70px;
		}

		.el-pagination {
			text-align: center;
			margin: 50px 0 50px 0;
		}
	}
</style>
