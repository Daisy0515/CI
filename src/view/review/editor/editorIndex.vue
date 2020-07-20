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
									<h1 class="numtitle">{{ acceptCount }}</h1>
									<!-- <el-button type="text">0位专家已评审</el-button> -->
								</router-link>
								<span class="subtitle">0位专家已评审</span>
							</el-card>
						</el-col>
						<el-col :span="6">
							<el-card shadow="hover">
								<router-link :to="{path:'/reviewStatistic',query:{id:1}}">
									<h1 class="numtitle">{{ reviewCount }}</h1>
									<!-- <el-button type="text">1位专家已评审</el-button> -->
								</router-link>
								<span class="subtitle">1位专家已评审</span>
							</el-card>
						</el-col>
						<el-col :span="6">
							<el-card shadow="hover">
								<router-link :to="{path:'/reviewStatistic',query:{id:2}}">
									<h1 class="numtitle">{{ reviewCount }}</h1>
						
								</router-link>
								<!-- <br /> -->
								<span class="subtitle">2位专家已评审</span>
							</el-card>
						</el-col>
						<el-col :span="6">
							<el-card shadow="hover">
								<router-link :to="{path:'/reviewStatistic',query:{id:3}}">
									<h1 class="numtitle">{{ reviewCount }}</h1>
									
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
				submitTitle:"发起评审",
				dialogSubmitVisible: false, // 开启发起评审视窗
				aboutTimeoutCount: 0, // 即将超时
				acceptCount: 0, // 未接受
				alreadyTimeoutCount: 0, // 已经超时
				reviewCount: 0, // 评审中
				form: {
					name: '',
					region: '',
					date1: '',
					date2: '',
					content: '',
					fileList: [{
						name: 'food.jpeg',
						url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
						status: 'finished'
					}, {
						name: 'food2.jpeg',
						url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
						status: 'finished'
					}],
					delivery: false,
					type: [],
					resource: '',
					desc: ''
				},
				formLabelWidth: '100px'
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
				//get /v1/authorization/review/summarizing/get
				httpGet("/v1/authorization/review/summarizing/get", {role:this.role}).then(results => {
					const { httpCode, msg, data } = results.data;
					if (httpCode == 200) {
						this.acceptCount=data.acceptCount;
						this.reviewCount=data.reviewCount;
						this.aboutTimeoutCount=data.aboutTimeoutCount ;
						this.alreadyTimeoutCount=data.alreadyTimeoutCount ;
					} else if (msg == "该条件暂无数据") {
						this.tableData = [];
						message("该条件暂无数据");
					} else if (httpCode !== 401) {
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
