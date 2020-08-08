<template>
	<div class="editor-container">
		<el-row :gutter="40" >
			<el-col :span="16">
				<el-card class="left-card-menu" v-loading="loading">
					<el-row style="margin-bottom: 20px;"><h1 style="text-align: left"><i class="el-icon-date"></i>&nbsp;评审统计</h1></el-row>
					<el-row style="margin-bottom: 20px;" :gutter="20">
						<el-col :span="6">
							<el-card shadow="hover">
								<router-link :to="{path:'/reviewStatistic',query:{id:0}}">
									<h1 class="numtitle">{{ zeroSum  }}</h1>
									<!-- <el-button type="text">0位专家已评审</el-button> -->
								</router-link>
								<span class="subtitle">0位专家已评审</span>
							</el-card>
						</el-col>
						<el-col :span="6">
							<el-card shadow="hover">
								<router-link :to="{path:'/reviewStatistic',query:{id:1}}">
									<h1 class="numtitle">{{ oneSum  }}</h1>
									<!-- <el-button type="text">1位专家已评审</el-button> -->
								</router-link>
								<span class="subtitle">1位专家已评审</span>
							</el-card>
						</el-col>
						<el-col :span="6">
							<el-card shadow="hover">
								<router-link :to="{path:'/reviewStatistic',query:{id:2}}">
									<h1 class="numtitle">{{ twoSum  }}</h1>
						
								</router-link>
								<!-- <br /> -->
								<span class="subtitle">2位专家已评审</span>
							</el-card>
						</el-col>
						<el-col :span="6">
							<el-card shadow="hover">
								<router-link :to="{path:'/reviewStatistic',query:{id:3}}">
									<h1 class="numtitle">{{ threeSum  }}</h1>
									
								</router-link>
								<span class="subtitle">3位专家已评审</span>
							</el-card>
						</el-col>
					</el-row>
				</el-card>
			</el-col>

			<el-col :span="7">
				<el-card class="right-card-menu">
					<el-row style="margin-bottom: 20px;"><h1 style="text-align: left">评审搜索</h1></el-row>
					<el-row style="margin-bottom: 10px;">
						<el-card shadow="hover" style="height: 60px">
							<el-row :gutter="20" >
								<router-link :to="{path:'',query:{id:4}}">   <!--4 表示评审邀请未回复-->
									<el-col :span="20"><!-- <el-button type="text" style="font-size: 16px;">评审邀请未回复</el-button> -->
									<span class="subtitle">评审任务搜索</span>
									</el-col>
									
								</router-link>
							</el-row>
						</el-card>
					</el-row>
					<el-row style="margin-bottom: 10px;">
						<el-card shadow="hover" style="height: 60px;">
							<el-row :gutter="20">
								<router-link :to="{path:'',query:{id:5}}">   <!--5 表示评审进行中-->
									<el-col :span="20"><!-- <el-button type="text" style="font-size: 16px;" >评审进行中</el-button> -->
									<span class="subtitle">评审人员搜索</span>
									</el-col>
									
								</router-link>
							</el-row>
						</el-card>
					</el-row>
				</el-card>
			</el-col>
		
		</el-row>
	</div>
</template>

<script>
	import { httpGet, httpDelete } from "@/utils/http.js";
	import { specificDate } from '@/utils/getDate.js';
	import { message, successTips, errTips } from "@/utils/tips.js";

	export default {
		components:{

		},
		name: 'Dashboard',
		data() {
			return {
				loading:false,
				role:2,
				
				dialogSubmitVisible: false, // 开启发起评审视窗
				oneSum: 0, // 即将超时
				threeSum : 0, // 未接受
				twoSum  : 0, // 已经超时
				zeroSum : 0, // 评审中
				
			}
		},
		computed: {
		},
		created: function() {
			this.getView();
		},
		methods: {
			getView(){
				this.loading=true;
				//get /v1/authorization/review/statistics/get 
				httpGet("/v1/authorization/review/statistics/get").then(results => {
					const { httpCode, msg, data } = results.data;
					if (httpCode == 200) {
						if (data != null){
							this.oneSum = (data.oneSum == null)? 0: data.oneSum;
							this.threeSum = (data.threeSum == null)? 0:data.threeSum;
							this.twoSum = (data.twoSum == null)? 0: data.twoSum;
							this.zeroSum = (data.zeroSum == null) ? 0: data.zeroSum ;
						}
						
					} else  {
						errTips(msg);
					}

				});
				this.loading=false;
			},
			handleChange(file, fileList) {
				this.fileList = fileList.slice(-3)
			},
			closeSubmitDialog(){
				this.dialogSubmitVisible = false;
			},
		}
	}
</script>

<style lang="scss" scoped>
	.editor {
		&-container {
			text-align:center;
			margin-left:20px;
		}
		.text {
			font-size: 16px;
			color: #bcbfc3;
		}

		.item {
			padding: 18px 0;
		}
		
	}
	.subtitle {
		font-size: 14px;
		color: #bcbfc3;
	}
	.numtitle{
		color: #4c83c3;
		margin-bottom: 10px;
	}
</style>
