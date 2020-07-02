<template>
	<!-- <h1>publishercomplete</h1> -->
	<div>
		<div style="padding-left: 10px;">
			<el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 130%;">
				<el-breadcrumb-item :to="{ path: '/managerIndex' }">项目经理</el-breadcrumb-item>
				<el-breadcrumb-item>未接受</el-breadcrumb-item>

			</el-breadcrumb>
		</div>
		<el-table v-loading="loading" :data="tableData" style="width:1000px;margin:20px auto" :header-cell-style="rowClass">
			<el-table-column fixed prop="projectCode" label="项目编号" align="center">
				<template slot-scope="scope">
					<el-tooltip class="item" effect="dark" :content="scope.row.projectCode" placement="top-start">
						<span class="tablehidden">{{ scope.row.projectCode }}</span>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column prop="projectName" label="项目名称" align="center">
				<template slot-scope="scope">
					<el-tooltip class="item" effect="dark" :content="scope.row.projectName" >
						<span class="tablehidden">{{ scope.row.projectName }}</span>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column prop="title" label="评审标题" align="center">
				<template slot-scope="scope">
					<el-tooltip class="item" effect="dark" :content="scope.row.title" >
						<span class="tablehidden">{{ scope.row.title }}</span>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column prop="gmtCreate" label="开始时间" align="center"></el-table-column>
			<el-table-column prop="deadline" label="截止时间" align="center"></el-table-column>

			<el-table-column prop="accomplishProgress" label="操作" align="center" width="280px">
				<template slot-scope="scope">
					<el-button @click="handleDetail(scope.row)" type="text" size="medium"
					><i class="el-icon-search"></i>查看详情</el-button>
					<!-- <router-link :to="{path:'bidView', query:{id:scope.row.id}}">
                      <i class="el-icon-search"></i>
                      查看详情
                    </router-link> -->

				</template>
			</el-table-column>
		</el-table>

		<el-dialog  title="评审详情" :visible.sync="dialogFormVisible" style="text-align:left; font-weight: bolder;" >
			<el-form :model="form" v-loading="dialogLoading" element-loading-text="正在加载中">
				<el-row :gutter="20">
					<el-col :span="8">
						<el-form-item label="项目名称" :label-width="formLabelWidth">
							<el-input v-model="form.projectName" auto-complete="off" :readonly="isReadOnly"/>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="项目编号" :label-width="formLabelWidth">
							<el-input v-model="form.projectCode" auto-complete="off" :readonly="isReadOnly"/>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="评审标题" :label-width="formLabelWidth">
							<el-input v-model="form.title" auto-complete="off" :readonly="isReadOnly"/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="8">
						<el-form-item label="评审目的" :label-width="formLabelWidth">
							<el-input v-model="form.purpose" auto-complete="off" :readonly="isReadOnly"/>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="开始时间" :label-width="formLabelWidth">
							<el-input v-model="form.gmtCreate" auto-complete="off"  :readonly="isReadOnly"/>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="截止时间" :label-width="formLabelWidth">
							<el-input v-model="form.deadline" auto-complete="off" :readonly="isReadOnly"/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="8">
						<el-form-item label="截止前提醒" :label-width="formLabelWidth">
							<el-input v-model="form.warn" auto-complete="off" placeholder="请输入天数" :readonly="isReadOnly">
								<template slot="append">天</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="16">
						<el-form-item label="评审内容" :label-width="formLabelWidth">
							<el-input v-model="form.content" type="textarea" :rows="2" placeholder="请输入内容" :readonly="isReadOnly"/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col >
						<el-form-item label="附件下载" :label-width="formLabelWidth" style="text-align: center">
							<el-table :data="form.resourceList" border>
								<el-table-column  prop="resourceName" label="附件名称"></el-table-column>
								<el-table-column  prop="gmtCreate" label="上传时间"></el-table-column>
								<el-table-column label="操作">
									<template slot-scope="scope">
										<a :href="scope.row.resourceUrl" target="_Blank" >下载附件</a>
									</template>
								</el-table-column>
							</el-table>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-dialog>

		<div class="bid_footer">
			<el-pagination
					@current-change="handleCurrentChange"
					:current-page.sync="pageData.pageNo"
					:total="totalPage"
					layout="prev, pager, next, jumper"
			></el-pagination>
		</div>
	</div>
</template>

<script>
	import { httpGet, httpDelete } from "@/utils/http.js";
	import { specificDate } from '@/utils/getDate.js';
	import { message, successTips, errTips } from "@/utils/tips.js";
	export default {

		data() {
			return {
				isReadOnly:true,
				loading: false,
				dialogLoading:false,//用于控制详情页面加载时的转圈状态
				tableData: [],
				pageData: {
					pageNo: 1,
					pageSize: 10,
					orderBy: "id",
					orderType: "DESC",
					role:2,
					status:1
				},
				totalPage: 0,
				dialogFormVisible: false,
				form: {},//存储评审详情的信息
				formLabelWidth: '100px'
			};
		},
		created: function() {
			this.getView();
		},
		computed: {

		},
		methods: {
			getView(val = this.pageData) {
				this.loading = true;

				//get /v1/authorization/review/review/search
				httpGet("/v1/authorization/review/review/search", val).then(results => {
					const { httpCode, msg, data } = results.data;
					if (httpCode == 200) {
						this.pageNo = data.pageNo;
						this.totalPage = parseInt(data.totalPage + '0');
						let list = data.reviewInfoList ;
						console.log("返回的数据：",list);
						for (let i of list) {
							i.gmtCreate = specificDate(i.gmtCreate);
							i.deadline = specificDate(i.deadline);
						}
						Object.assign(this.pageData, val);
						this.$set(this, 'tableData', list);
					} else if (msg == "该条件暂无数据") {
						this.tableData = [];
						message("该条件暂无数据");
					} else if (httpCode !== 401) {
						errTips(msg);
					}
					this.loading = false;
				});
			},

			handleCurrentChange(val) {
				this.pageData.pageNo = val;
				this.getView();
			},
			handleDetail(row) {//row里面存储的是当前行的信息，获取详细评审任务的详细信息
				this.dialogFormVisible = true;
				this.dialogLoading = true;
				httpGet("/v1/authorization/review/review/get", {"id":row.id}).then(results => {
					const { httpCode, msg, data } = results.data;
					if (httpCode == 200) {
						console.log("详情的数据：",data);
						data.gmtCreate = specificDate(data.gmtCreate);
						data.deadline = specificDate(data.deadline);
						for(let i of data.resourceList){
							i.gmtCreate = specificDate(i.gmtCreate);
						}
						this.form = data;
					} else if (msg == "该条件暂无数据") {
						this.form = [];
						message("该条件暂无数据");
					} else if (httpCode !== 401) {
						errTips(msg);
					}
					this.dialogLoading = false; // 这一句不能写在.then()之外，否则没有加载转圈的显示，写在.then之外会先于.then（）执行，这是异步请求
				});
			},
			handleClickFile(row){

			},
			rowClass() {
				return "background:#F4F6F9;";
			}
		}
	};
</script>

<style>
	@import "/src/assets/scss/myTable.scss";
	.bid_footer {
		text-align: center;
		margin-top: 20px;
	.el-input__inner {
		width: 70px;
	}
	.el-pagination {

		margin: 50px 0 50px 0;
	}
	}
</style>
