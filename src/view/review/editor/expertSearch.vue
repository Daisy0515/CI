<!--评审专家搜索-->
<template>
	<div class="myTable">
		<div style="padding-left: 10px;">
			<el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 130%;">
				<el-breadcrumb-item :to="{ path: '/editorIndex' }">首页</el-breadcrumb-item>
				<el-breadcrumb-item>评审专家搜索</el-breadcrumb-item>

			</el-breadcrumb>
		</div>
		<div class="search_header_top">
			<el-input v-model="searchData.name" placeholder="评审专家姓名"></el-input>
			<el-input v-model="searchData.jobTitle" placeholder="职称"></el-input>
			<el-select v-model="searchData.researchId" clearable placeholder="研究方向" >
				<el-option v-for="item in researchDirectionList" :label="item.researchDirection" :value="item.id"></el-option>
			</el-select>
			<el-input v-model="searchData.workUnit" placeholder="单位"></el-input>
			<el-input v-model="searchData.department" placeholder="部门"></el-input>
			<el-select v-model="searchData.cruxId" clearable placeholder="关键词" >
				<el-option v-for="item in cruxList" :label="item.crux" :value="item.id"></el-option>
			</el-select>
			<el-input v-model="searchData.email" placeholder="邮箱"></el-input>
			<el-select v-model="searchData.education" placeholder="学历">
				<el-option label="高中" :value="1"></el-option>
				<el-option label="大专" :value="2"></el-option>
				<el-option label="本科" :value="3"></el-option>
				<el-option label="研究生" :value="4"></el-option>
				<el-option label="博士" :value="5"></el-option>
				<el-option label="博士后" :value="6"></el-option>
				<el-option label="院士" :value="7"></el-option>
			</el-select>
			<el-input v-model="searchData.nation" placeholder="国家"></el-input>
			
			
			<el-button type="primary" @click="searchList">搜索</el-button>
		</div>

		<el-table :data="expertUserList" :header-cell-style="rowClass" style="margin-top: 20px;" v-loading="loading">
			<el-table-column prop="uName" label="姓名" align="center"></el-table-column>
			<el-table-column label="性别" align="center">
				<template slot-scope="scope">
					<span v-if = "scope.row.uSex === 1">男</span>
					<span v-if = "scope.row.uSex === 2">女</span>
					<span v-if = "scope.row.uSex === 3">其他</span>
				</template>
			</el-table-column>
			
			<el-table-column prop="uWorkUnit" label="单位" align="center"></el-table-column>
			<el-table-column prop="uNation" label="国家" align="center"></el-table-column>
			<el-table-column prop="uPhone" label="手机" align="center"></el-table-column>
			<el-table-column prop="uEmail" label="邮箱" align="center"></el-table-column>
			
		
			<el-table-column label="操作" align="center" width="180px">
				<template slot-scope="scope">
					<el-button @click="reviewInformaition(scope.row.uId)" type="text" size="medium"><i class="icon iconfont icon-yonghu"></i>专家信息
					</el-button>
					<el-button @click="reviewStatistics(scope.row.uId)" type="text" size="medium"><i class="el-icon-document"></i>评审统计
					</el-button>
				</template>
			</el-table-column>
			
		</el-table>
		<review-statistics :tableData="tableData" :dialogFormVisible="statisticView" @closeDialog="closeDialog"></review-statistics>
		<expert-information :ruleForm="personalForm" :dialogFormVisible="informationView" @closeDialog="closeInformationDialog"></expert-information>
		
		<div class="bid_footer">
		  <el-pagination
		    @current-change="handleCurrentChange"
		    :current-page.sync="pageData.pageNo"
		    :total="totalPage"
		    layout="prev, pager, next, jumper"
		  ></el-pagination>
		</div>
	</div>

</template>

<script>
	import {httpGet} from "@/utils/http.js";
	import {message,errTips} from "@/utils/tips.js";
	import reviewStatistics from '@/view/review/editor/components/reviewStatistics'
	import expertInformation from '@/view/review/editor/components/expertInformation'
	import { specificDate } from '@/utils/getDate.js';

	export default {
		components: {
			reviewStatistics,
			expertInformation
		},
		data() {
			return {
				researchDirectionList:[],
				personalForm:{},
				informationView : false,//控制专家信息对话框
				statisticView : false,//控制评审统计对话框
				tableData:[],
				expertUserList:[],
				searchData: {
					pageNo: 1,
					pageSize: 10,
					name: '',
					jobTitle: '',
					cruxId: null,
					researchId: null,
					workUnit: '',
					department: '',
					email: '',
					education: null,
					nation: '',
				},
				loading: false,
				pageData: {
					pageNo: 1,
					pageSize: 10,
					name: '',
					jobTitle: '',
					cruxId: null,
					researchId: null,
					workUnit: '',
					department: '',
					email: '',
					education: null,
					nation: '',
				},
				totalPage: 0,
				reviewStatisticsVisible:false,
				ruleForm:{
					accomplishReviewSum : null,
					averageAccomplishReviewTime : null,
					averagePostponeDay : null,
					averageRespondInviteTime : null,
					averageScore : null,
					finallyAcceptReviewTime : null,
					finallyAccomplishReviewTime : null,
					inviteAccept : null,
					inviteAcceptFront : null,
					inviteAcceptRear : null,
					inviteRefuse : null,
					inviteSum : null,
					inviteWithdraw : null,
					modification : null,
					onTimeAccomplishReview : null,
					pass : null,
					postponeAccomplishReview : null,
					refuse : null,
					underwayReview : null,
					unfinishedReview : null,
					warn : null,
					withdrawAllocatedMission : null,
					
				},
				cruxList:[],
			};
		},
		created: function() {
			
			this.getExpert();
			this.getKeyWords();
			this.getResearchList();
		},
		computed: {},
		methods: {
			searchList(){},
			/*获取关键词*/
			getKeyWords() {
				// /v1/public/coreuser/crux/list
				httpGet("/v1/public/coreuser/crux/list").then(results => {
					const {
						httpCode,
						msg,
						data
					} = results.data;
					if (httpCode == 200) {
						this.cruxList = data.cruxList;
					} else {
						this.cruxList = [];
						errTips(msg);
					}
					console.log(this.cruxList);
				})
			},
			/*获取研究方向*/
			getResearchList() {
				//
				httpGet("/v1/public/coreuser/list/research").then(results => {
					const {
						httpCode,
						msg,
						data
					} = results.data;
					if (httpCode == 200) {
						this.researchDirectionList = data.researchDirectionList;
					} else {
						this.researchDirectionList = [];
						errTips(msg);
					}
					console.log(this.researchDirectionList);
				})
			},
			/*获取评审统计*/
			reviewStatistics(val){
				console.log(val);
				this.statisticView = true;
				//get /v1/authorization/review/expertuser/get 
				httpGet("/v1/authorization/review/expertuser/get", {id:val}).then(results => {
					const {
						httpCode,
						msg,
						data
					} = results.data;
					if (httpCode == 200) {
						data.finallyAcceptReviewTime = specificDate(data.finallyAcceptReviewTime);
						data.finallyAccomplishReviewTime = specificDate(data.finallyAccomplishReviewTime);
						this.ruleForm=data;
						// this.ruleForm.finallyAcceptReviewTime = specificDate(this.ruleForm.finallyAcceptReviewTime);
						// this.ruleForm.finallyAccomplishReviewTime = specificDate(this.ruleForm.finallyAccomplishReviewTime);
						this.tableData.push(this.ruleForm);
					} else {
						errTips(msg);
					}
				});
				
			},
			/*获取评审人员资料*/
			reviewInformaition(val){
				this.informationView = true;
				//get /v1/authorization/coreuser/reviewexpertuserinfo/get 
				httpGet("/v1/authorization/coreuser/reviewexpertuserinfo/get", {id:val}).then(results => {
					const {
						httpCode,
						msg,
						data
					} = results.data;
					if (httpCode == 200) {

						if (data.sex === 1) data.sex = '男';
						if (data.sex === 2) data.sex = '女';
						if (data.sex === 3) data.sex = '其他';
						
						if (data.education === 1) data.education = '高中';
						if (data.education === 2) data.education = '大专';
						if (data.education === 3) data.education = '本科';
						if (data.education === 4) data.education = '研究生';
						if (data.education === 5) data.education = '博士';
						if (data.education === 6) data.education = '博士后';
						if (data.education === 7) data.education = '院士';
						let researchList = data.researchDirectionList.join(',');
						data.researchDirectionList = researchList;
						data.cruxList = data.cruxList.join(',');
						data.province = data.province + '/' + data.city;
						this.personalForm=data;
						console.log("personalForm:",this.personalForm);
					} else {
						errTips(msg);
					}
				});
			},
			getExpert(val = this.pageData) {
				this.loading = true;
				//get /v1/authorization/review/expert/user
				httpGet("/v1/authorization/review/expert/user", val).then(results => {
					const {
						httpCode,
						msg,
						data
					} = results.data;
					if (httpCode == 200) {
						this.pageNo = data.pageNo;
						this.totalPage = parseInt(data.totalPage + "0");
						this.expertUserList = data.expertUserList;
						console.log('expertUserList',this.expertUserList);
						Object.assign(this.pageData, val);
			
					} else if (msg == "该条件暂无数据") {
						this.expertUserList = [];
						message("该条件暂无数据");
					} else if (httpCode !== 401) {
						errTips(msg);
					}
					this.loading = false;
				});
			
			},
			//关闭专家信息对话框
			closeInformationDialog(){
				this.informationView = false;
			},
			//关闭评审统计对话框
			closeDialog() {
				this.tableData = [];
			    this.statisticView = false;
			},
			rowClass() {
				return "background:#F4F6F9;";
			},
			handleCurrentChange(val){
			    this.pageData.pageNo = val;
			    this.getView();
			},
		}
	};
</script>

<style lang="scss">
@import "@/assets/scss/myTable.scss";
.search_header_top{
	.el-input {
		display: inline-block;
		width: 150px;
		margin-right: 15px;
		margin-top: 20px;
	}
}
</style>
