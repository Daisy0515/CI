<template>
	<div class="myTable">
		<!-- <h1>publishercomplete</h1> -->
		<div style="padding-left: 10px;">
			<el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 130%;">
				<el-breadcrumb-item :to="{ path: '/editorIndex' }">首页</el-breadcrumb-item>
				
				<el-breadcrumb-item>评审专家搜索</el-breadcrumb-item>

			</el-breadcrumb>
		</div>
		<div class="search_header_top">
			<el-input v-model="searchData.name" placeholder="评审专家姓名"></el-input>
			<el-input v-model="searchData.jobTitle" placeholder="职称"></el-input>
			<el-select v-model="searchData.researchId" clearable placeholder="研究方向" >
				<el-option v-for="item in researchDirectionList" :label="item.researchDirection" :value="item.id"></el-option>
			</el-select>
			<el-input v-model="searchData.workUnit" placeholder="单位"></el-input>
			<el-input v-model="searchData.department" placeholder="部门"></el-input>
			<el-select v-model="searchData.cruxId" clearable placeholder="关键词" >
				<el-option v-for="item in cruxList" :label="item.crux" :value="item.id"></el-option>
			</el-select>
			<el-input v-model="searchData.email" placeholder="邮箱"></el-input>
			<el-select v-model="searchData.education" placeholder="学历">
				<el-option label="高中" value="1"></el-option>
				<el-option label="大专" value="2"></el-option>
				<el-option label="本科" value="3"></el-option>
				<el-option label="研究生" value="4"></el-option>
				<el-option label="博士" value="5"></el-option>
				<el-option label="博士后" value="6"></el-option>
				<el-option label="院士" value="7"></el-option>
			</el-select>
			<el-input v-model="searchData.nation" placeholder="国家"></el-input>
			
			
			<el-button type="primary" @click="searchList">搜索</el-button>
		</div>

		<el-table :data="expertUserList" :header-cell-style="rowClass" style="margin-top: 20px;" v-loading="loading">
			<el-table-column prop="uName" label="姓名" align="center"></el-table-column>
			<el-table-column prop="uJobTitle" label="性别" align="center"></el-table-column>
			
			<el-table-column prop="uWorkUnit" label="单位" align="center"></el-table-column>
			<el-table-column prop="uNation" label="国家" align="center"></el-table-column>
			<el-table-column prop="uEmail" label="手机" align="center"></el-table-column>
			<el-table-column prop="uEmail" label="邮箱" align="center"></el-table-column>
			
			<el-table-column prop="typeList" label="角色" align="center"></el-table-column>
			<el-table-column label="操作" align="center" width="180px">
				<template slot-scope="scope">
					<el-button @click="reviewStatistics(scope.row)" type="text" size="medium"><i class="icon iconfont icon-yonghu"></i>专家信息
					</el-button>
					<el-button @click="reviewStatistics(scope.row.id)" type="text" size="medium"><i class="el-icon-document"></i>评审统计
					</el-button>
				</template>
			</el-table-column>
			
		</el-table>
		<el-dialog title="专家信息" :visible.sync="reviewStatisticsVisible" :close-on-click-modal="false" width="80%" >
		
			
		
		
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
	import {
		httpGet,
		httpDelete
	} from "@/utils/http.js";

	import {
		message,
		successTips,
		errTips
	} from "@/utils/tips.js";
	import reviewDetailDialog from '@/view/review/components/reviewDetailDialog';
	import submitReview from '@/view/review/components/submitReview';
	import reviewOpinion from '@/view/review/components/reviewOpinion'
	import {
		specificDate
	} from '@/utils/getDate.js';

	export default {
		
		data() {
			return {
				expertUserList:[{uName:111}],
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
				id: "",
				submitTitle: '修改提交',
				isShowSubmitHistory: true, //在修改提交评审的表单里是否显示提交历史
				dialogFormVisible: false, //控制表单对话框是否显示
				dialogSubmitVisible: false, //控制重新提交框是否显示
				dialogOpinionVisible: false, //控制意见详情框是否显示
				loading: false,
				tableData: [],
				pageData: {
					pageNo: 1,
					pageSize: 10,
					orderBy: "id",
					orderType: "DESC",
					type:null,
					submitterName:null,
					projectUserName:null,
					submitTimeStart:null,
					submitTimeEnd:null,
					expertAccomplishCount:null,
					status:null,
					statusExplain:null
				},
				totalPage: 0,
				form: { //表单中的信息
					name: '',
					purpose: '',
					date1: '',
					date2: '',
					content: '',
					daysBeforeDeadline: '',
					fileTable: [{
						filename: '项目申请书',
						url: ''
					}],
					delivery: false,
					type: [],
					resource: '',
					desc: ''
				},
				reviewStatisticsVisible:false,
				formLabelWidth: '100px' //控制表单中输入框的尺寸
			};
		},
		created: function() {
			this.id = this.$route.query.id;
			this.pageData.expertAccomplishCount = this.id;
			this.getView();
		},
		computed: {},
		methods: {
			reviewStatistics(val){
				this.reviewStatisticsVisible=true;
				
			},
			
			searchList(){
				//alert('searchList');
				this.getView(this.searchData);
			},
			getView(val = this.pageData) {
				
				this.loading = true;
				//get /v1/authorization/review/admin/search 
				httpGet("/v1/authorization/review/admin/search", val).then(results => {
					const { httpCode,msg,data} = results.data;
					if (httpCode == 200) {
						this.pageNo = data.pageNo;
						this.totalPage = parseInt(data.totalPage + '0');

						let list = data.adminMissionList ;
						for (let i of list) {

							i.gmtCreate = specificDate(i.gmtCreate);
							i.submitTime = specificDate(i.submitTime);
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
			handleClickDetail(row) {
				this.dialogFormVisible = true;
			},
			handleClickSubmit(row) {
				this.dialogSubmitVisible = true;
			},
			handleClickOpinion(row) {
				this.dialogOpinionVisible = true;
			},
			closeDialog() {
				this.dialogFormVisible = false;
			},
			closeSubmitDialog() {
				this.dialogSubmitVisible = false;
			},
			closeOpinionDialog() {
				this.dialogOpinionVisible = false;
			},
			rowClass() {
				return "background:#F4F6F9;";
			}
		}
	};
</script>

<style lang="scss">
@import "@/assets/scss/myTable.scss";
.search_header_top{
	.el-input {
		display: inline-block;
		width: 150px;
		margin-right: 15px;
		margin-top: 20px;
	}
}
</style>
