<template>
	<div class="publisher-container">
		<el-row :gutter="40">
			<el-col :span="16">
				<el-card class="left-card-menu">
					<el-row style="margin-bottom: 20px;"><h1 style="text-align: left">评审汇总</h1></el-row>
					<el-row style="margin-bottom: 20px;" :gutter="20">
						<el-col :span="6">
							<el-card>
								<router-link to="/publisherNotAccept">
									<h1>{{ acceptCount }}</h1>
									<el-button type="text">未接受</el-button>
								</router-link>
							</el-card>
						</el-col>
						<el-col :span="6">
							<el-card>
								<router-link to="/publisherReview">
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
							<el-button type="text" @click="submit">发起第三方评审</el-button>
						</el-card>
					</el-row>
					<el-row style="margin-bottom: 15px;">
						<el-card>
							<el-button type="text" @click="view">查看第三方评审</el-button>
						</el-card>
					</el-row>
				</el-card>
			</el-col>
		</el-row>
<!-- 	<el-dialog title="发起评审" :visible.sync="dialogFormVisible" style="text-align:left; font-weight: bolder;">
			<el-form :model="form">
				<el-row :gutter="20">
					<el-col :span="10">
						<el-form-item label="项目标题" :label-width="formLabelWidth">
							<el-input v-model="form.name" auto-complete="off" />
						</el-form-item>
					</el-col>
					<el-col :span="10">
						<el-form-item label="评审类型" :label-width="formLabelWidth">
							<el-select v-model="form.region" placeholder="请选择评审类型">
								<el-option label="区域一" value="shanghai" />
								<el-option label="区域二" value="beijing" />
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="10">
						<el-form-item label="评审标题" :label-width="formLabelWidth">
							<el-input v-model="form.name" auto-complete="off" />
						</el-form-item>
					</el-col>
					<el-col :span="10">
						<el-form-item label="评审目的" :label-width="formLabelWidth">
							<el-input v-model="form.name" auto-complete="off" />
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="10">
						<el-form-item label="截止时间" :label-width="formLabelWidth">
							<el-date-picker
									v-model="form.date1"
									size="small"
									type="date"
									placeholder="选择日期"
									style="width:100%"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="10">
						<el-form-item label="截止前提醒" :label-width="formLabelWidth">
							<el-input v-model="form.date2" auto-complete="off" placeholder="请输入天数" />
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="10">
						<el-form-item label="评审内容" :label-width="formLabelWidth">
							<el-input
									v-model="form.content"
									type="textarea"
									:rows="3"
									placeholder="请输入内容"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="10">
						<el-form-item label="上传附件" :label-width="formLabelWidth">
							<el-upload
									class="upload-demo"
									action="https://jsonplaceholder.typicode.com/posts/"
									:on-change="handleChange"
									:file-list="form.fileList"
							>
								<el-button size="small" type="primary">点击上传</el-button>
								<div slot="tip" class="el-upload__tip">只能上传pdf文件，且不超过500kb</div>
							</el-upload>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" style="margin-right: 35%">
				<el-button @click="dialogFormVisible = false" style="margin-right: 10%">取 消</el-button>
				<el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
			</div>
		</el-dialog> -->
	

	</div>
</template>

<script>
import { httpGet, httpDelete } from "@/utils/http.js";
import { specificDate } from '@/utils/getDate.js';
import { message, successTips, errTips } from "@/utils/tips.js";
	
	export default {
		name: 'Dashboard',
		data() {
			return {
				aboutTimeoutCount: 0, // 即将超时
				acceptCount: 0, // 未接受
				alreadyTimeoutCount: 0, // 已经超时
				reviewCount: 0, // 评审中
				dialogFormVisible: false, // 开启发起评审视窗
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
				httpGet("/v1/authorization/review/summarizing/get", {role:1}).then(results => {
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
			submit(){
				this.$router.push('./submitReview');
			},
			view(){
				this.$router.push('./viewReview');
			},
			handleChange(file, fileList) {
				this.fileList = fileList.slice(-3)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.publisher {
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
