<template>
	<div class="manager-container">
		<el-row :gutter="40">
			<el-col :span="16">
				<el-card class="left-card-menu">
					<el-row style="margin-bottom: 20px;"><h1 style="text-align: left">评审汇总</h1></el-row>
					<el-row style="margin-bottom: 20px;" :gutter="20">
						<el-col :span="6">
							<el-card>
								<router-link to="/managerNotAccept">
									<h1>{{ acceptCount }}</h1>
									<el-button type="text">未接受</el-button>
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
			</el-col>
			<el-col :span="6">
				<el-card class="right-card-menu">
					<el-row style="margin-bottom: 25px;">
						<el-card>
							<el-button type="text" @click="dialogSubmitVisible = true">发起评审</el-button>
						</el-card>
					</el-row>
					<el-row style="margin-bottom: 15px;">
						<el-card>
							<el-button type="text" class="button">评审模板</el-button>
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
	export default {
		components:{
			submitReview
		},
		name: 'Dashboard',
		data() {
			return {
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
		created() {
		},
		methods: {
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
			font-size: 14px;
		}

		.item {
			padding: 18px 0;
		}

	}
</style>
