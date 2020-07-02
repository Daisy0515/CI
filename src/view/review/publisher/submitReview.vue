<template>
	<div class="teamSelect">
		<div style="padding-left: 10px;">
		    <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 130%;">
		        <el-breadcrumb-item :to="{ path: '/editorIndex' }">首页</el-breadcrumb-item>
		        
		        <el-breadcrumb-item>发起第三方评审</el-breadcrumb-item>
		
		    </el-breadcrumb>
		</div>

		<div class="header_top">
			<el-input v-model="searchData.projectName" placeholder="评审标题"></el-input>
			<el-input v-model="searchData.projectName" placeholder="评审类型"></el-input>
			<el-input v-model="searchData.projectName" placeholder="发布者"></el-input>
			<el-input v-model="searchData.projectName" placeholder="提交人"></el-input>
			<el-date-picker v-model="searchData.startTime" type="date" style="width: 140px;" placeholder="提交时间" value-format="yyyy-MM-dd"
			 :picker-options="endDatePicker"></el-date-picker>
			<span style="margin-right: 10px;margin-left: 10px;">到</span>
			<el-date-picker style="width: 140px;" v-model="searchData.endTime" :picker-options="endDatePicker" type="date"
			 placeholder="提交时间" value-format="yyyy-MM-dd"></el-date-picker>


			<!-- <el-select v-model="selestate" clearable placeholder="请选择状态">
		    <el-option label="中标" value="中标"></el-option>
		    <el-option label="投标中" value="投标中"></el-option>
		    <el-option label="失败" value="失败"></el-option>
		    <el-option label="结束" value="结束"></el-option>
		  </el-select> -->

			<el-button type="primary" @click="searchList()">搜索</el-button>

		</div>

		<div class="container deskHeader">
			<el-table :data="tableForm" style="width: 100%" :header-cell-style="rowClass" v-loading="loading" @selection-change="handleSelectionChange">
				<el-table-column type="selection" align="center"></el-table-column>
				<el-table-column prop="projectCognize" label="项目认知" align="center"></el-table-column>
				<el-table-column prop="leaderName" label="团队组长" align="center"></el-table-column>
				<el-table-column prop="gmtCreate" label="最后更新时间" align="center"></el-table-column>
				<el-table-column prop="count" label="人员个数" align="center"></el-table-column>
				<el-table-column label="操作" prop="province" align="center">
					<template slot-scope="scope">
						<router-link :to="{path:'teamDetails', query:{teamId:scope.row.id,projectId:projectId}}">
							<i class="el-icon-search"></i>
							团队明细
						</router-link>
					</template>
				</el-table-column>
			</el-table>
			<el-button type="primary" @click="choice">确定选择</el-button>
		</div>
	</div>
</template>
<script>
	import {
		httpGet,
		httpPut
	} from "@/utils/http.js";
	import {
		hoursSeconds
	} from "@/utils/getDate.js";
	import {
		errTips,
		successTips
	} from "@/utils/tips.js";
	import {
		mapMutations
	} from "vuex";
	export default {
		components: {},
		data() {
			return {
				searchData: {
					projectName: "",
					startTime: null,
					endTime: null,
					parentId: null,
					pageNo: 1,
					typeId: null,
					pageSize: 10,
					orderType: "DESC",
					orderBy: "id"
				},
				centerDialogVisible: false,
				//  loading: false,
				projectId: "",
				loading: false,
				tableForm: [],
				ReqBidTeamVO: {
					idList: []
				}
			};
		},
		created: function() {
			this.projectId = this.$route.query.projectId;
			// this.getView();
		},
		methods: {
			...mapMutations(["setCache"]),
			//获取页面数据
			getView() {
				this.loading = true;
				httpGet("/v1/authorization/bid/select/teaminfo", {
					id: this.projectId
				}).then(results => {
					const {
						httpCode,
						msg,
						data
					} = results.data;
					if (httpCode === 200) {
						let {
							teamInfoList
						} = data;
						for (let i of teamInfoList) {
							i.gmtCreate = hoursSeconds(i.gmtCreate, true);
						}
						this.loading = false;
						this.tableForm = teamInfoList;
					} else if (httpCode !== 401) {
						errTips(msg);
					}
				});
			},
			//确定选择团队
			choice() {
				this.centerDialogVisible = true;
				this.loading = true;
				httpPut(
					"/v1/authorization/bid/teamstatus/update",
					this.ReqBidTeamVO
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
			handleSelectionChange(val) {
				const newVal = val.map(item => {
					return item.id;
				});
				this.ReqBidTeamVO.idList = newVal;
			},
			rowClass() {
				return "background:#F4F6F9;";
			}
		}
	};
</script>
<style lang='scss'>
	.teamSelect {
		.el-table {
			border: 1px solid #d8d8d8;
			margin-top: 40px;
		}

		button {
			float: right;
			margin-top: 30px;
			margin-bottom: 30px;
		}

		.el-input {
			display: inline-block;
			width: 150px;
			margin-right: 15px;
		}

		.el-input__inner {
			border: 1px solid #c0c0c0;
			width: 150px;
			height: 35px;
			line-height: 35px;
		}

		.el-table td,
		.el-table th.is-leaf {
			color: black;
			border-bottom: 1px solid #d8d8d8;
		}
		.header_top {
			margin: 30px auto;
			padding-bottom: 20px;
			button {
			  margin-left: 20px;
			}
			.el-input {
			  display: inline-block;
			  width: 150px;
			  margin-right: 15px;
			}
		}

		.footer {
			margin-bottom: 20px;

			.el-input__inner {
				width: 70px;
			}

			.el-pagination {
				text-align: center;
				margin: 50px 0 50px 0;
			}
		}
	}
</style>
