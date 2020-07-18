<template>
	<div class="editor-container">
		<el-row :gutter="40">
			<el-col :span="16">
				<el-card class="left-card-menu" v-loading="loading">
					<el-row style="margin-bottom: 20px;"><h1 style="text-align: left"><i class="el-icon-setting"></i>&nbsp;评审管理</h1></el-row>
					<el-row style="margin-bottom: 20px;" :gutter="20">
						<el-col :span="6">
							<el-card shadow="hover">
								<router-link :to="{path:'/registerNewUser'}">
								<span class="subtitle">注册新用户</span>
									<!-- <el-button type="text">0位专家已评审</el-button> -->
								</router-link>
							<!-- 	<span class="subtitle">注册新用户</span> -->
							</el-card>
						</el-col>
						<el-col :span="6">
							<el-card shadow="hover">
								<router-link :to="{path:'/reviewStatistic',query:{id:1}}">
									<span class="subtitle">发送提醒邮件</span>
									<!-- <el-button type="text">1位专家已评审</el-button> -->
								</router-link>
								
							</el-card>
						</el-col>
						<el-col :span="6">
							<el-card shadow="hover">
								<router-link :to="{path:'/reviewStatistic',query:{id:2}}">
									<span class="subtitle">评审模板配置</span>
						
								</router-link>
								<!-- <br /> -->
								<!-- <span class="subtitle">评审模板配置</span> -->
							</el-card>
						</el-col>
						<el-col :span="6">
							<el-card shadow="hover">
								<router-link :to="{path:'/reviewStatistic',query:{id:3}}">
								<span class="subtitle">已有评审模板</span>	
									
								</router-link>
								
							</el-card>
						</el-col>
					</el-row>
				</el-card>
			</el-col>
			
			<!-- <el-col :span="16">
				<el-card class="left-card-menu">
					<el-row style="margin-bottom: 40px;"><h1 style="text-align: left">评审管理</h1></el-row>
					<el-row style="margin-bottom: 30px;" :gutter="20" >
						<el-col :span="6">
							<el-card >
								<router-link to="">
									<el-button type="text" class="editor-button">注册新用户</el-button>
								</router-link>
							</el-card>
						</el-col>
						<el-col :span="6">
							<el-card>
								<router-link to="">
									<el-button type="text" class="editor-button">发送提醒邮件</el-button>
								</router-link>
							</el-card>
						</el-col>
						<el-col :span="6">
							<el-card>
								<el-button type="text" class="editor-button">评审模板配置</el-button>
							</el-card>
						</el-col>
						<el-col :span="6">
							<el-card>
								<el-button type="text" class="editor-button">已有评审模板</el-button>
							</el-card>
						</el-col>
					</el-row>
				</el-card>
			</el-col>
 -->
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
		&-button{
			margin-top: 15px;
			margin-bottom: 10px;
			font-size: 15px;}
		.text {
			font-size: 14px;
		}

		.item {
			padding: 18px 0;
		}

	}
</style>
