<template>
	<div class="myTable">
		<div style="padding-left: 10px;">
			<el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 130%;">
				<el-breadcrumb-item :to="{ path: '/publisherIndex' }">首页</el-breadcrumb-item>

				<el-breadcrumb-item>查看第三方评审</el-breadcrumb-item>

			</el-breadcrumb>
		</div>

		<div class="header_top">
			<el-select v-model="searchData.projectId" clearable placeholder="请选择项目名称" @change="changeProject">
				<el-option v-for="item in projectList" :key="item.projectId" :label="item.projectName" :value="item.projectId"></el-option>
			</el-select>
			<el-select v-model="searchData.type" clearable placeholder="请选择评审类型">
				<el-option v-for="item in processList" :key="item.id" :label="item.processName" :value="item.id"></el-option>
			</el-select>
			<!-- <el-input v-model="searchData.projectId" placeholder="项目名称"></el-input> -->
			<!-- 	<el-input v-model="searchData.type" placeholder="评审类型"></el-input> -->
			<el-input v-model="searchData.title" placeholder="评审标题"></el-input>
			<el-input v-model="searchData.userName" placeholder="提交人"></el-input>
			<el-date-picker v-model="searchData.gmtCreateStart" type="date" style="width: 140px;" placeholder="提交时间"
			 value-format="yyyy-MM-dd" :picker-options="endDatePicker"></el-date-picker>
			<span style="margin-right: 10px;margin-left: 10px;">到</span>
			<el-date-picker style="width: 140px;" v-model="searchData.gmtCreateEnd" :picker-options="endDatePicker" type="date"
			 placeholder="提交时间" value-format="yyyy-MM-dd"></el-date-picker>


			<!-- <el-select v-model="selestate" clearable placeholder="请选择状态">
		    <el-option label="中标" value="中标"></el-option>
		    <el-option label="投标中" value="投标中"></el-option>
		    <el-option label="失败" value="失败"></el-option>
		    <el-option label="结束" value="结束"></el-option>
		  </el-select> -->

			<el-button type="primary" @click="searchList()">搜索</el-button>

		</div>


		<el-table :data="tableData" style="width: 100%" :header-cell-style="rowClass" v-loading="loading" @selection-change="handleSelectionChange">
			<!-- <el-table-column type="selection" align="center"></el-table-column> -->
			<el-table-column prop="projectName" label="项目名称" align="center"></el-table-column>
			<el-table-column prop="title" label="评审任务标题" align="center"></el-table-column>
			<el-table-column prop="typeName" label="评审任务类型" align="center">

			</el-table-column>
			<el-table-column prop="gmtCreate" label="提交时间" align="center"></el-table-column>
			<el-table-column prop="deadline" label="截止时间" align="center"></el-table-column>
			<el-table-column prop="submitName" label="提交人" align="center"></el-table-column>
			<el-table-column prop="status" label="状态" align="center">
				<template slot-scope="scope">
					<span v-if="scope.row.status===1">未接受</span>
					<span v-if="scope.row.status===2">评审中</span>
					<span v-if="scope.row.status===3">打回中</span>
					<span v-if="scope.row.status===4">已完成</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" prop="province" align="center" width="300px">
				<template slot-scope="scope">
					<el-button @click="handleClickDetail(scope.row.id)" type="text" size="medium"><i class="el-icon-search"></i>查看详情
					</el-button>

					<el-button @click="handleClickChoose(scope.row.id)" type="text" size="medium">
						<i class="icon iconfont icon-yonghu"></i>
						第三方评审意见
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<review-detail-dialog :form="form1" :formLabelWidth="formLabelWidth" :dialogFormVisible="dialogFormVisible" :loading="form1Loading"
		 @closeDialog="closeDialog"></review-detail-dialog>

		<el-dialog title="第三方评审意见" :visible.sync="dialogChooseVisible" style="width:100%;text-align:left; font-weight: bolder;">

			<div class="header_top" >

				管理员意见：
				<span v-if="opinin==1">接受</span>
				<span v-if="opinin==2">需要修改</span>
				<span v-if="opinin==3">拒绝</span>
				<span v-if="opinin==4">没有意见 </span>
				

			</div>
			<el-table :data="userList" :header-cell-style="rowClass" >
				
				<el-table-column prop="userName" label="评审专家" align="center"></el-table-column>
				<el-table-column prop="gmtCreate" label="邀请时间" align="center"></el-table-column>
				<el-table-column prop="status" label="状态" align="center"></el-table-column>
				<el-table-column label="评审结果" align="center">
					<template slot-scope="scope">
						<el-button @click="submitList(scope.row.id)" type="text" size="medium">
							选择
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="bid_footer">
				<el-pagination @current-change="handleCurrentChangeAdmin" :current-page.sync="pageAdmin.pageNo" :total="totalPageAdmin" layout="prev, pager, next, jumper"></el-pagination>
			</div>

		</el-dialog>


	<!-- 	<el-button type="primary" @click="dialogChooseVisible=true" style="float: right;margin: 10px 0 10px 0;">批量选择评审管理员</el-button> -->



		<div class="bid_footer">
			<el-pagination @current-change="handleCurrentChange" :current-page.sync="pageData.pageNo" :total="totalPage" layout="prev, pager, next, jumper"></el-pagination>
		</div>
	</div>
</template>
<script>
	import {httpGet,httpPost,httpPut} from "@/utils/http.js";
	import {hoursSeconds} from "@/utils/getDate.js";
	import {errTips,successTips} from "@/utils/tips.js";
	import {mapMutations} from "vuex";
	import {specificDate} from "@/utils/getDate.js";
	import reviewDetailDialog from '@/view/review/components/reviewDetailDialog';

	export default {
		components: {
			reviewDetailDialog
		},
		data() {
			return {
				opinin:"",
				userList:[],
				form1Loading: false,
				dialogFormVisible: false,
				dialogChooseVisible: false,
				formLabelWidth: '150px',
				form1: {
					projectName: "",
					projectCode: null,
					title: "",
					purpose: "",
					gmtCreate: "",
					deadline: "",
					warn: null,
					content: "",
					resourceList: [],
				},
				searchData: {
					status:4,
					projectId: "",
					type: null,
					gmtCreateStart: null,
					gmtCreateEnd: null,
					title: null,
					userName: "",
					pageNo: 1,
					pageSize: 10,
					orderBy: "id",
					orderType: "DESC"
				},
				pageData: {
					status:4,
					projectId: "",
					type: null,
					gmtCreateStart: null,
					gmtCreateEnd: null,
					title: null,
					userName: "",
					pageSize: 10,
					pageNo: 1,
					orderBy: "id",
					orderType: "DESC"
				},
				pageAdmin:{
					pageNo:1,
					pageSize:10,
					name:"",
					workUnit:"",
				},
				searchAdmin:{
					pageNo:1,
					pageSize:10,
					name:"",
					workUnit:"",
				},
				centerDialogVisible: false,
				tableData: [],
				//  loading: false,
				projectId: "",
				loading: false,
				tableForm: [{
					leaderName: "111"
				}],
				ReqBidTeamVO: {
					idList: []
				},
				projectList: [],
				processList: [],
				typeList: [],
				adminList:[],
				adminArr: {
				  idList: [],
				  userId:null,
				}
			};
		},
		created: function() {
			this.projectId = this.$route.query.projectId;
			this.getType();
			this.getProjectList();
			this.getAdmin();
			//	this.getView();
		},
		methods: {
			...mapMutations(["setCache"]),
			getType() {
				//get /v1/public/bid/process/list 
				httpGet('/v1/public/bid/process/list').then(results => {
					const {
						msg,
						data,
						httpCode
					} = results.data;
					if (httpCode === 200) {
						this.typeList = data.reviewProcessList;
						//console.log(this.typeList);
						this.getView();
					} else {
						errTips(msg);
					}
				});
			},
			getAdmin(val = this.pageAdmin){
				//get /v1/authorization/review/admin/user 
				httpGet("/v1/authorization/review/admin/user", val).then(results => {
					const {
						httpCode,
						msg,
						data
					} = results.data;
					if (httpCode === 200) {
						this.totalPageAdmin = parseInt(data.totalPage + "0");
						this.adminList = data.adminList;
						Object.assign(this.pageData, val);
					} else {
						this.adminList = [];
						errTips(msg);
					}
					
				});
							
			},
			searchAdminList(){
				this.getAdmin(this.searchAdmin)
			},
			handleClickChoose(val) {
				//get /v1/authorization/review/thirdparty/list 
				httpGet("/v1/authorization/review/thirdparty/list", {
					id: val
				}).then(results => {
					const {
						httpCode,
						msg,
						data
					} = results.data;
					if (httpCode == 200) {
						this.opinin=data.opinin;
						let userList = data.userList;
						for (let i of userList) {
							i.gmtCreate = specificDate(i.gmtCreate);
						}
						
						this.userList=userList;
					} else if (msg == "该条件暂无数据") {
						
						message("该条件暂无数据");
					} else if (httpCode !== 401) {
						errTips(msg);
					}
					this.form1Loading = false;
				});
				
				this.dialogChooseVisible = true;
				
			},
			handleClickDetail(val) {
				this.dialogFormVisible = true;
				this.form1Loading = true;
				httpGet("/v1/authorization/review/thirdparty/get", {
					id: val
				}).then(results => {
					const {
						httpCode,
						msg,
						data
					} = results.data;
					if (httpCode == 200) {
						this.form1 = data;
						this.form1.deadline = specificDate(this.form1.deadline);
						this.form1.gmtCreate = specificDate(this.form1.gmtCreate);
						let reviewInfoList = data.resourceList;
						for (let i of reviewInfoList) {
							i.gmtCreate = specificDate(i.gmtCreate);
						}
						this.form1.resourceList = reviewInfoList;
					} else if (msg == "该条件暂无数据") {
						this.form1 = "";
						message("该条件暂无数据");
					} else if (httpCode !== 401) {
						errTips(msg);
					}
					this.form1Loading = false;
				});
				
				//console.log(this.form1);
			},
			closeDialog() {
				this.dialogFormVisible = false;
			},
			
			getProjectList() {
				httpGet('/v1/authorization/mission/promulgator/get').then(results => {
					const {
						msg,
						data,
						httpCode
					} = results.data;
					if (httpCode === 200) {
						this.projectList = data.projectList;
					} else {
						errTips(msg);
					}
				});
			},
			changeProject: function(value) {
				httpGet('/v1/authorization/review/process/list', {
					id: value
				}).then(results => {
					const {
						msg,
						data,
						httpCode
					} = results.data;
					if (httpCode === 200) {
						this.processList = data.processList;
					} else {
						errTips(msg);
					}
				});
			},
			searchList() {
				this.getView(this.searchData);
			},
			getView(val = this.pageData) {
				this.loading = true;
				httpGet("/v1/authorization/review/thirdparty/search", val).then(results => {
					const {
						httpCode,
						msg,
						data
					} = results.data;
					if (httpCode === 200) {
						this.totalPage = parseInt(data.totalPage + "0");
						let {
							reviewInfoList
						} = data;

						for (let i of reviewInfoList) {
							i.deadline = specificDate(i.deadline);
							i.gmtCreate = specificDate(i.gmtCreate);
							var typeArr = this.typeList.filter(function(item) {
								return item.id == i.type;
							})
							//console.log(typeArr);
							i.typeName = typeArr[0].processName;
							//console.log(i.typeName);
						}

						this.$set(this, "tableData", reviewInfoList);
						Object.assign(this.pageData, val);
					} else {
						this.tableData = [];
						errTips(msg);
					}
					this.loading = false;
				});
			
			},
		
			submitList(val){
				this.adminArr.userId=val;
				if (this.adminArr.idList.length==0){
					errTips("至少选择一个评审");
				}
				else {
					httpPost(
						"/v1/authorization/review/admin/insert",
						this.adminArr
					).then(results => {
						const {httpCode,msg} = results.data;
						if (httpCode === 200) {
							successTips("选择评审管理员成功");
						} else  {
							errTips(msg);
						}
						this.dialogChooseVisible = false;
						this.adminArr.userId=null;
						this.adminArr.idList=[];
						this.getView();
					});
				}
				
			},
			//确定选择团队
			choice() {
				this.centerDialogVisible = true;
				this.loading = true;
				httpPut(
					"/v1/authorization/bid/teamstatus/update",
					this.adminArr
				).then(results => {
					const {
						httpCode,
						msg
					} = results.data;
					if (httpCode === 200) {
						this.centerDialogVisible = false;
						this.loading = false;
						successTips("选择团队成功");
						this.setCache("myDemand");
						// this.setCache("myDemand");
					} else if (msg === "至少选择一个项目组") {
						errTips("至少选择一个项目组");
					} else if (msg === "执行中项目数量超限") {
						errTips("执行中项目数量超限");
					} else if (httpCode !== 401) {
						errTips(msg);
					}
				});
			},
			//单选事件
			handleSelectionChange(val){
				const newVal = val.map(item => {
					return item.id;
				});
				this.adminArr.idList = newVal;
				console.log(this.adminArr);
			},
			// handleAdminChange(val) {
			// 	const newVal = val.map(item => {
			// 		return item.id;
			// 	});
			// 	this.adminArr.idList = newVal;
			// 	console.log(this.adminArr);
			// },
			rowClass() {
				return "background:#F4F6F9;";
			},
			handleCurrentChange(val) {
				this.pageData.pageNo = val;
				this.getView();
			},
			handleCurrentChangeAdmin(val) {
				this.pageAdmin.pageNo = val;
				this.getAdmin();
			},
		}
	};
</script>
<style scoped lang='scss'>
	@import "@/assets/scss/myTable.scss";

	.el-select {
		display: inline-block;
		width: 150px;
		margin-right: 15px;
	}
</style>
