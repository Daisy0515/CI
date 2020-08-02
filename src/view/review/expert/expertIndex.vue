<template>
	<div class="manager-container" style="text-align: center;">
	
				<el-card class="left-card-menu" style="width: 70%;margin-left: 8%;">
					<el-row style="margin-bottom: 20px;">
						<h1 style="text-align: left">评审汇总</h1>
					</el-row>
					<el-row style="margin-bottom: 20px;" :gutter="20">
						<el-col :span="6">
							<el-card>
								<router-link to="/managerNotAccept">
									<h1>{{ acceptCount }}</h1>
									<el-button type="text">待处理</el-button>
								</router-link>
							</el-card>
						</el-col>
						<el-col :span="6">
							<el-card>
								<router-link to="/managerReview">
									<h1>{{ reviewCount }}</h1>
									<el-button type="text">评审中</el-button>
								</router-link>
							</el-card>
						</el-col>
						<el-col :span="6">
							<el-card>
								<h1>{{ aboutTimeoutCount }}</h1>
								<el-button type="text">即将超时</el-button>
							</el-card>
						</el-col>
						<el-col :span="6">
							<el-card>
								<h1>{{ alreadyTimeoutCount }}</h1>
								<el-button type="text">已经超时</el-button>
							</el-card>
						</el-col>
					</el-row>
				</el-card>
	

	</div>
</template>

<script>
	import submitReview from '@/view/review/components/submitReview';
	import { httpGet, httpDelete } from "@/utils/http.js";
	import { specificDate } from '@/utils/getDate.js';
	import { message, successTips, errTips } from "@/utils/tips.js";
	
	export default {
		
		data() {
			return {
				
				dialogSubmitVisible: false, // 开启发起评审视窗
				aboutTimeoutCount: 0, // 即将超时
				acceptCount: 0, // 未接受
				alreadyTimeoutCount: 0, // 已经超时
				reviewCount: 0, // 评审中
				
			}
		},
		computed: {
		},
		created: function() {
		   this.getView();
		},
		methods: {
			getView(){
				//get /v1/authorization/review/summarizing/get 
				httpGet("/v1/authorization/review/expertsummarizing/get").then(results => {
				  const { httpCode, msg, data } = results.data;
				  if (httpCode == 200) {
				    this.aboutTimeoutCount=data.aboutTimeoutCount;
					this.acceptCount=data.acceptCount;
					this.alreadyTimeoutCount=data.alreadyTimeoutCount ;
					this.reviewCount=data.reviewCount ;
				  } else if (msg == "该条件暂无数据") {
				    this.tableData = [];
				    message("该条件暂无数据");
				  } else if (httpCode !== 401) {
				    errTips(msg);
				  }
				  
				});
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	.manager {
		&-container {
			text-align:center;
			// margin-left:-10%;
		}
		.text {
			font-size: 14px;
		}

		.item {
			padding: 18px 0;
		}

	}
</style>
