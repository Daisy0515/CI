<template>
	<div>
		<div style="padding-left: 10px;">
		<el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 130%;margin-bottom: 20px;">
		  <el-breadcrumb-item :to="{ path: '/expertInformation' }">信息维护</el-breadcrumb-item>
		  <el-breadcrumb-item>评审统计信息</el-breadcrumb-item>
		
		</el-breadcrumb>
		</div>
		<el-card class="left-card-menu">
			<h1 style="text-align: center">评审统计信息</h1>
			<hr style="width: 100%; color: #303133;">
			<h2 style="text-align: left;font-weight: bolder;margin-top: 2%;">当前评审统计</h2>
			<el-form
			:rules="rules"
			:model="ruleForm"
			style="margin-top: 2%;"
			ref="ruleForm" class="demo-ruleForm">
			<el-row :gutter="20">
				<el-table v-loading="loading" :data="tableData" style="width:900px;margin:20px auto" :header-cell-style="rowClass">
					<el-table-column fixed prop="finallyAcceptReviewTime" label="最近一次接受评审" align="center">
						<template slot-scope="scope">
							<el-tooltip class="item" effect="dark" :content="scope.row.finallyAcceptReviewTime" placement="top-start">
								<span class="tablehidden">{{ scope.row.finallyAcceptReviewTime }}</span>
							</el-tooltip>
						</template>
					</el-table-column>
					<el-table-column prop="underwayReview" label="进行中的评审" align="center">
						<template slot-scope="scope">
							<el-tooltip class="item" effect="dark" :content="scope.row.underwayReview" >
								<span class="tablehidden">{{ scope.row.underwayReview }}</span>
							</el-tooltip>
						</template>
					</el-table-column>
					<el-table-column prop="unfinishedReview" label="未完成的评审" align="center">
						<template slot-scope="scope">
							<el-tooltip class="item" effect="dark" :content="scope.row.unfinishedReview" >
								<span class="tablehidden">{{ scope.row.unfinishedReview }}</span>
							</el-tooltip>
						</template>
					</el-table-column>
				</el-table>
				<!-- <hr style="width: 100%; color: #303133;"> -->
			</el-row>

			<h2 style="text-align: left;font-weight: bolder;margin-top: 2%;margin-bottom: 2%;">历史评审邀请统计</h2>
			
			<el-row :gutter="20">
				<el-table v-loading="loading" :data="tableData" style="width:900px;margin:20px auto" :header-cell-style="rowClass">
					<el-table-column fixed prop="inviteSum" label="总共邀请次数" align="center">
						<template slot-scope="scope">
							<el-tooltip class="item" effect="dark" :content="scope.row.inviteSum" placement="top-start">
								<span class="tablehidden">{{ scope.row.inviteSum }}</span>
							</el-tooltip>
						</template>
					</el-table-column>
					<el-table-column prop="inviteAccept" label="接受评审" align="center">
						<template slot-scope="scope">
							<el-tooltip class="item" effect="dark" :content="scope.row.inviteAccept" >
								<span class="tablehidden">{{ scope.row.inviteAccept }}</span>
							</el-tooltip>
						</template>
					</el-table-column>
					<el-table-column prop="inviteRefuse" label="拒绝评审" align="center">
						<template slot-scope="scope">
							<el-tooltip class="item" effect="dark" :content="scope.row.inviteRefuse" >
								<span class="tablehidden">{{ scope.row.inviteRefuse }}</span>
							</el-tooltip>
						</template>
					</el-table-column>
					<el-table-column prop="inviteWithdraw" label="撤回邀请" align="center">
						<template slot-scope="scope">
							<el-tooltip class="item" effect="dark" :content="scope.row.inviteWithdraw" >
								<span class="tablehidden">{{ scope.row.inviteWithdraw }}</span>
							</el-tooltip>
						</template>
					</el-table-column>
					<el-table-column prop="inviteAcceptFront" label="接受评审前被中止" align="center">
						<template slot-scope="scope">
							<el-tooltip class="item" effect="dark" :content="scope.row.inviteAcceptFront" >
								<span class="tablehidden">{{ scope.row.inviteAcceptFront }}</span>
							</el-tooltip>
						</template>
					</el-table-column>
				</el-table>
			<!-- 	<hr style="width: 100%; color: #303133;"> -->
			</el-row>
			
			<h2 style="text-align: left;font-weight: bolder;margin-top: 2%;margin-bottom: 2%;">历史评审表现汇总</h2>
			<el-row :gutter="20">
				
				<el-table v-loading="loading" :data="tableData" style="width:900px;margin:20px auto" :header-cell-style="rowClass">
						<el-table-column fixed prop="accomplishReviewSum" label="总共完成的评审" align="center">
							<template slot-scope="scope">
								<el-tooltip class="item" effect="dark" :content="scope.row.accomplishReviewSum" placement="top-start">
									<span class="tablehidden">{{ scope.row.accomplishReviewSum }}</span>
								</el-tooltip>
							</template>
						</el-table-column>
						<el-table-column prop="onTimeAccomplishReview" label="按时完成评审次数" align="center">
							<template slot-scope="scope">
								<el-tooltip class="item" effect="dark" :content="scope.row.onTimeAccomplishReview" >
									<span class="tablehidden">{{ scope.row.onTimeAccomplishReview }}</span>
								</el-tooltip>
							</template>
						</el-table-column>
						<el-table-column prop="postponeAccomplishReview" label="延期完成评审次数" align="center">
							<template slot-scope="scope">
								<el-tooltip class="item" effect="dark" :content="scope.row.postponeAccomplishReview" >
									<span class="tablehidden">{{ scope.row.postponeAccomplishReview }}</span>
								</el-tooltip>
							</template>
						</el-table-column>
						<el-table-column prop="withdrawAllocatedMission" label="撤回已分配任务" align="center">
							<template slot-scope="scope">
								<el-tooltip class="item" effect="dark" :content="scope.row.withdrawAllocatedMission" >
									<span class="tablehidden">{{ scope.row.withdrawAllocatedMission }}</span>
								</el-tooltip>
							</template>
						</el-table-column>
						<el-table-column prop="inviteAcceptRear" label="接受评审后被中止" align="center">
							<template slot-scope="scope">
								<el-tooltip class="item" effect="dark" :content="scope.row.inviteAcceptRear" >
									<span class="tablehidden">{{ scope.row.inviteAcceptRear }}</span>
								</el-tooltip>
							</template>
						</el-table-column>
						<el-table-column prop="finallyAccomplishReviewTime" label="最近一次完成评审的日期" align="center">
							<template slot-scope="scope">
								<el-tooltip class="item" effect="dark" :content="scope.row.finallyAccomplishReviewTime" >
									<span class="tablehidden">{{ scope.row.finallyAccomplishReviewTime }}</span>
								</el-tooltip>
							</template>
						</el-table-column>
				</el-table>
				
		
			</el-row>
			<h2 style="text-align: left;font-weight: bolder;margin-top: 2%;margin-bottom: 2%;">历史评审平均表现</h2>
			<el-row :gutter="20">
				
				<el-table v-loading="loading" :data="tableData" style="width:900px;margin:20px auto" :header-cell-style="rowClass">
						<el-table-column fixed prop="averageRespondInviteTime" label="平均回应邀请的时间" align="center">
							<template slot-scope="scope">
								<el-tooltip class="item" effect="dark" :content="scope.row.averageRespondInviteTime" placement="top-start">
									<span class="tablehidden">{{ scope.row.averageRespondInviteTime }}</span>
								</el-tooltip>
							</template>
						</el-table-column>
						<el-table-column prop="averageAccomplishReviewTime" label="平均完成评审的时间" align="center">
							<template slot-scope="scope">
								<el-tooltip class="item" effect="dark" :content="scope.row.averageAccomplishReviewTime" >
									<span class="tablehidden">{{ scope.row.averageAccomplishReviewTime }}</span>
								</el-tooltip>
							</template>
						</el-table-column>
						<el-table-column prop="averagePostponeDay" label="平均延期天数" align="center">
							<template slot-scope="scope">
								<el-tooltip class="item" effect="dark" :content="scope.row.averagePostponeDay" >
									<span class="tablehidden">{{ scope.row.averagePostponeDay }}</span>
								</el-tooltip>
							</template>
						</el-table-column>
						<el-table-column prop="warn" label="提醒次数" align="center">
							<template slot-scope="scope">
								<el-tooltip class="item" effect="dark" :content="scope.row.warn" >
									<span class="tablehidden">{{ scope.row.warn }}</span>
								</el-tooltip>
							</template>
						</el-table-column>
						<el-table-column prop="averageScore" label="评审平均分数" align="center">
							<template slot-scope="scope">
								<el-tooltip class="item" effect="dark" :content="scope.row.averageScore" >
									<span class="tablehidden">{{ scope.row.averageScore }}</span>
								</el-tooltip>
							</template>
						</el-table-column>
						
				</el-table>
				
					
			</el-row>
			<h2 style="text-align: left;font-weight: bolder;margin-top: 2%;margin-bottom: 2%;">评审专家建议汇总</h2>
			<el-row :gutter="20">
				
				<el-table v-loading="loading" :data="tableData" style="width:900px;margin:20px auto" :header-cell-style="rowClass">
						<el-table-column fixed prop="pass" label="通过" align="center">
							<template slot-scope="scope">
								<el-tooltip class="item" effect="dark" :content="scope.row.pass" placement="top-start">
									<span class="tablehidden">{{ scope.row.pass }}</span>
								</el-tooltip>
							</template>
						</el-table-column>
						<el-table-column prop="modification" label="通过需修改" align="center">
							<template slot-scope="scope">
								<el-tooltip class="item" effect="dark" :content="scope.row.modification" >
									<span class="tablehidden">{{ scope.row.modification }}</span>
								</el-tooltip>
							</template>
						</el-table-column>
						<el-table-column prop="refuse" label="拒绝" align="center">
							<template slot-scope="scope">
								<el-tooltip class="item" effect="dark" :content="scope.row.refuse" >
									<span class="tablehidden">{{ scope.row.refuse }}</span>
								</el-tooltip>
							</template>
						</el-table-column>
			
				</el-table>
				
					
			</el-row>
			
			<el-form-item class="cancel" style="text-align: center;">
				<el-button type="primary" @click="Return" size="medium" style="width:150px;">返回</el-button>
			</el-form-item>
			</el-form>
			
		</el-card>
	</div>
</template>

<script>
	import { httpGet, httpDelete } from "@/utils/http.js";
	import { specificDate } from '@/utils/getDate.js';
	import { message, successTips, errTips } from "@/utils/tips.js";
	export default{
		data(){
			return {
				loading: false,
				tableData: [
				],  
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
			}
		},
		created: function() {
		 this.getView();
		},
		methods:{
			Return(){
				this.$router.push({ path: './expertInformation' });
			},
			getView(){
				// /v1/authorization/review/expertstatistics/get
			  httpGet("/v1/authorization/review/expertstatistics/get").then(results => {
				const { httpCode, msg, data } = results.data;
				if (httpCode == 200) {
					this.ruleForm=data;
					this.tableData.push(this.ruleForm);
					console.log(this.ruleForm);
				} else  {
				  errTips(msg);
				}
			  });
			},
			rowClass() {
			  return "background:#F4F6F9;";
			}
		}
	}
</script>

<style>
</style>
