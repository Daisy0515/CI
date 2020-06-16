<template>
	<div class="manager-container">
		<el-row :gutter="40">
			<el-col :span="16">
				<el-card class="left-card-menu">
					<el-row style="margin-bottom: 50px;"><h1 style="text-align: left">待处理任务</h1></el-row>
					<el-row style="margin-bottom: 55px;" :gutter="20">
						<el-col :span="6">
							<el-card>
								<router-link to="">
									<h1>{{ acceptCount }}</h1>
									<el-button type="text">新的任务</el-button>
								</router-link>
							</el-card>
						</el-col>
						<el-col :span="6">
							<el-card>
								<router-link to="">
									<h1>{{ reviewCount }}</h1>
									<el-button type="text">评审专家完成评审</el-button>
								</router-link>
							</el-card>
						</el-col>
						<el-col :span="6">
							<el-card>
								<h1>{{ aboutTimeoutCount }}</h1>
								<el-button type="text">需要额外评审专家</el-button>
							</el-card>
						</el-col>
						<el-col :span="6">
							<el-card>
								<h1>{{ alreadyTimeoutCount }}</h1>
								<el-button type="text">评审延期</el-button>
							</el-card>
						</el-col>
					</el-row>
				</el-card>
			</el-col>
			<el-col :span="7">
				<el-card class="right-card-menu">
					<el-row style="margin-bottom: 20px;"><h1 style="text-align: left">评审中</h1></el-row>
					<el-row style="margin-bottom: 25px;">
						<el-card >
							<el-row :gutter="20">
								<el-col :span="20"><el-button type="text" style="font-size: 16px;">评审邀请未回复</el-button></el-col>
								<el-col :span="4"><h2>0</h2></el-col>
							</el-row>
						</el-card>
					</el-row>
					<el-row style="margin-bottom: 15px;">
						<el-card>
							<el-row :gutter="20">
								<el-col :span="20"><el-button type="text" style="font-size: 16px;" >评审进行中</el-button></el-col>
								<el-col :span="4"><h2>0</h2></el-col>
							</el-row>
						</el-card>
					</el-row>
				</el-card>
			</el-col>
		</el-row>
		<submit-review :form="form" :formLabelWidth="formLabelWidth" :title="submitTitle"
					   :dialogSubmitVisible="dialogSubmitVisible"
					   @closeSubmitDialog="closeSubmitDialog"></submit-review>

	</div>
</template>

<script>
	import submitReview from '@/view/review/components/submitReview';
	import { httpGet, httpDelete } from "@/utils/http.js";
	import { specificDate } from '@/utils/getDate.js';
	import { message, successTips, errTips } from "@/utils/tips.js";

	export default {
		components:{
			submitReview
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
	.manager {
		&-container {
			text-align:center;
			// margin-left:-10%;
		}
		.text {
			font-size: 16px;
		}

		.item {
			padding: 18px 0;
		}

	}
</style>
