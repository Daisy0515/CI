<template>
	<div class="myTable">
		<!-- <h1>publishercomplete</h1> -->
		<div style="padding-left: 10px;">
			<el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 130%;">
				<el-breadcrumb-item :to="{ path: '/editorTodo' }">待处理任务</el-breadcrumb-item>
				<el-breadcrumb-item :to="{ path: '/reviewTodo',query:{id:0} }">新任务</el-breadcrumb-item>
				<el-breadcrumb-item>邀请评审专家</el-breadcrumb-item>

			</el-breadcrumb>
			<h1 style="text-align: center;margin-top:20px">评审专家选择信息综合</h1>
			<h2 style="text-align: center;font-weight: bolder;margin-top: 20px;">评审标题：
			<span style="font-weight: 400;">{{title}}</span>
			</h2>

			<h2 style="text-align: left;font-weight: bolder;margin-top: 2%;">评审专家搜索</h2>
			<div class="header_top">
				<!-- <el-input v-model="searchData.projectName" placeholder="项目名称搜索"></el-input>
				<el-input v-model="searchData.content" placeholder="任务名称"></el-input>
				 -->
				<el-button type="primary" @click="searchExpert()">专家搜索</el-button>
				<el-dialog title="评审专家搜索" :visible.sync="dialogExpertVisible" :close-on-click-modal="false" width="100%" >

					<h2 style="font-weight: bolder;text-align: center;">评审标题：<span>{{title}}</span></h2>
					<div class="dialog_header_top" >

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
						<el-table-column label="操作" align="center">
							<template slot-scope="scope">
								<el-radio-group v-model="scope.row.radio" @change="invite(scope.row.uId,scope.row.radio)">
								<el-radio  label="1" >邀请</el-radio>
								<el-radio  label="2" >备选</el-radio>
								</el-radio-group>
							</template>
						</el-table-column>
						<el-table-column prop="uName" label="评审专家姓名" align="center"></el-table-column>
						<el-table-column prop="uJobTitle" label="职称" align="center"></el-table-column>
						<el-table-column prop="uEducation" label="学历" align="center">
							<template slot-scope="scope">
								<span v-if="scope.row.uEducation==1">高中</span>
								<span v-if="scope.row.uEducation==2">大专</span>
								<span v-if="scope.row.uEducation==3">本科</span>
								<span v-if="scope.row.uEducation==4">研究生</span>
								<span v-if="scope.row.uEducation==5">博士</span>
								<span v-if="scope.row.uEducation==6">博士后</span>
								<span v-if="scope.row.uEducation==7">院士</span>
							</template>
						</el-table-column>
						<el-table-column prop="uWorkUnit" label="单位" align="center"></el-table-column>
						<el-table-column prop="uEmail" label="邮箱" align="center"></el-table-column>
						<el-table-column prop="uNation" label="国家" align="center"></el-table-column>
						<el-table-column prop="typeList" label="研究方向" align="center"></el-table-column>
						<el-table-column prop="status" label="评审统计(同意邀请)" align="center"></el-table-column>
						<el-table-column prop="status" label="邀请统计" align="center"></el-table-column>
					</el-table>
					<el-button type="primary" style="float: right;margin-top: 20px;" @click=postInvite()>提交邀请</el-button>
					<div class="bid_footer">
					  <el-pagination
					    @current-change="handleCurrentChange"
					    :current-page.sync="pageData.pageNo"
					    :total="totalPage"
					    layout="prev, pager, next, jumper"
					  ></el-pagination>
					</div>

				</el-dialog>
				<el-dialog title="邀请评审专家" :visible.sync="settingVisible" :close-on-click-modal="false" width="50%" >

					<el-table :data="infoList" :header-cell-style="rowClass" style="margin-top: 20px;">

						<el-table-column prop="userName" label="评审专家姓名" align="center"></el-table-column>
						<el-table-column prop="uJobTitle" label="信件" align="center"></el-table-column>
						<el-table-column prop="uEducation" label="限定评审的时间" align="center">

						</el-table-column>
						<el-table-column prop="uWorkUnit" label="不邀请" align="center"></el-table-column>
						</el-table>


				</el-dialog>


			</div>
		<h2 style="text-align: left;font-weight: bolder;margin-top: 2%;">评审设置</h2>
			<div class="setting" >
				<el-form :label-position="right" label-width="350px" :model="ruleForm">
				  <el-form-item label="评审专家人数要求">
				    <el-input v-model="ruleForm.number">
						<template slot="append">人</template>
					</el-input>

				  </el-form-item>
				  <el-form-item label="自动取消评审专家没有响应邀请的时间限制">
				    <el-input v-model="ruleForm.responseInvite">
						<template slot="append">天</template>
					</el-input>

				  </el-form-item>
				  <el-form-item label="专家接受任务后限定完成的时间">
				    <el-input v-model="ruleForm.restrictReviewTime">
						<template slot="append">天</template>
					</el-input>

				  </el-form-item>
				  <el-form-item label="自动取消评审专家未完成(接受后)任务的时间限制">
				    <el-input v-model="ruleForm.unfinished">
						<template slot="append">天</template>
					</el-input>

				  </el-form-item>
				  <el-form-item label="在取消未完成任务前发送提醒邮件次数">
				    <el-input v-model="ruleForm.unfinishedEmail">
						<template slot="append">次</template>
					</el-input>

				  </el-form-item>
				  <el-form-item label="评审截止日前发送提醒邮件">
				    <el-input v-model="ruleForm.deadline">
						<template slot="append">天</template>
					</el-input>

				  </el-form-item>
				  <el-form-item label="是否盲审">
					<el-radio-group v-model="ruleForm.isBlindRial">
				    <el-radio :label='true'>是</el-radio>
				    <el-radio :label='false'>否</el-radio>
					</el-radio-group>
				  </el-form-item>
				  <el-form-item label="评审打分模板">
				    <el-input v-model="ruleForm.templateId"></el-input>
					<el-button type="primary" @click="searchList" style="margin-left: 20px;">修改</el-button>
				  </el-form-item>
				  <el-form-item label="是否加入冲突检测">
					<el-radio-group v-model="ruleForm.isConflictDetection">
				    <el-radio :label="true">是</el-radio>
				    <el-radio :label="false">否</el-radio>
					</el-radio-group>
				  </el-form-item>
				</el-form>
				<div style="text-align: center;">
				<el-button type="primary" @click="submitForm()">提交</el-button>
				</div>
			</div>
			<h2 style="text-align: left;font-weight: bolder;margin-top: 2%;">已邀请专家列表</h2>
			<div>
				<el-table :data="expertInviteList" style="width:700px;margin:50px auto;" :header-cell-style="rowClass" v-loading="loading">
						<el-table-column prop="userName" label="评审专家" align="center">
							<template slot-scope="scope">
								<el-tooltip class="item" effect="dark" :content="scope.row.userName" placement="top-start">
									<span class="tablehidden">{{ scope.row.userName }}</span>
								</el-tooltip>
							</template>
						</el-table-column>
						<el-table-column prop="replyOperation" label="状态" align="center">
							<template slot-scope="scope">
								<span v-if="scope.row.replyOperation==1">接受</span>
								<span v-if="scope.row.replyOperation==2">拒绝</span>
								<span v-if="scope.row.replyOperation==3">无回应</span>
								<span v-if="scope.row.replyOperation==4">同意邀请前撤回邀请</span>
							</template>
						</el-table-column>
						<el-table-column prop="gmtModified" label="状态更新时间" align="center">
							<template slot-scope="scope">
								<el-tooltip class="item" effect="dark" :content="scope.row.gmtModified" placement="top-start">
									<span class="tablehidden">{{ scope.row.gmtModified }}</span>
								</el-tooltip>
							</template>
						</el-table-column>

						<el-table-column prop="replyContent" label="回复" align="center">

						</el-table-column>



				</el-table>

			</div>

			<h2 style="text-align: left;font-weight: bolder;margin-top: 2%;">备选专家列表</h2>
			<div>
				<el-table :data="expertAlternativeList" style="width:500px;margin:50px auto;" :header-cell-style="rowClass" v-loading="loading">
						<el-table-column prop="userName" label="评审专家" align="center">
							<template slot-scope="scope">
								<el-tooltip class="item" effect="dark" :content="scope.row.userName" placement="top-start">
									<span class="tablehidden">{{ scope.row.userName }}</span>
								</el-tooltip>
							</template>
						</el-table-column>
						<el-table-column prop="resourceName" label="操作" align="center">
							<template slot-scope="scope">
								<el-button @click="viewResualtDetail(scope.row.id)" type="text" size="medium">
									邀请
								</el-button>
							</template>
						</el-table-column>




				</el-table>

			</div>

		</div>

	</div>

</template>

<script>
	import { httpGet, httpPut, httpPost, httpDelete} from "@/utils/http.js";
	import {message,successTips,errTips} from "@/utils/tips.js";
	import {specificDate} from '@/utils/getDate.js';

	export default {
		props: ['type'], //type用来区分'新任务'，‘评审专家需要额外评审’，‘评审延期’，‘评审中’等类型
		components: {

		},
		data() {
			return {
				totalPage:null,
				radio:'1',
				loading:false,
				expertUserList:[],
				dialogExpertVisible:false,
				pageData:{
					pageNo: 1,
					pageSize: 10,
					name:'',
					jobTitle: '',
					cruxId: null,
					researchId: null,
					workUnit: '',
					department: '',
					email: '',
					education: null,
					nation: '',
				},
				searchData:{
					pageNo: 1,
					pageSize: 10,
					name:'',
					jobTitle: '',
					cruxId: null,
					researchId: null,
					workUnit: '',
					department: '',
					email: '',
					education: null,
					nation: '',
				},
				ruleForm: {
				  deadline : null,
				  id : null,
				  isBlindRial : 'false',
				  isConflictDetection : 'false',
				  number : null,
				  responseInvite : null,
				  restrictReviewTime : null,
				  templateId : null,
				  unfinished : null,
				  unfinishedEmail : null,
				},
				title:"",
				expertInviteList:[],
				expertAlternativeList :[],
				cruxList:[],
				researchDirectionList:[],
				postForm:{
					expertInviteList:[],
					id:null
				},
				infoList:[],
				settingVisible : false
			};
		},
		created: function() {
			this.id = this.$route.query.id;
			this.postForm.id = this.id;
			this.getView();
			this.getKeyWords();
			this.getResearchList();
		},
		computed: {},
		methods: {
			postInvite(){
				//alert(111);
				httpPost("/v1/authorization/review/expertinvite/get",this.postForm).then(results => {
					const {httpCode,msg,data} = results.data;
					console.log(httpCode);
					if (httpCode === 200){
						this.infoList = data.infoList;
						this.dialogExpertVisible=false;
						this.settingVisible = true;
					} else {
						errTips(msg);
					}
				})
			},
			invite(id,val){
				console.log(id,val);
				var temp = {emailConfig:null,isInvite:true,restrictReviewTime:this.ruleForm.restrictReviewTime,
				type:val,userId:id}
				this.postForm.expertInviteList.push(temp);
				console.log(this.postForm);
			},
			beixuan(val){
				alert(val)
			},
			getKeyWords(){
				// /v1/public/coreuser/crux/list
				httpGet("/v1/public/coreuser/crux/list").then(results => {
					const {httpCode, msg, data} = results.data;
					if (httpCode == 200){
						this.cruxList = data.cruxList ;
					} else {
						this.cruxList = [];
						errTips(msg);
					}
					console.log(this.cruxList);
				})
			},
			getResearchList(){
				//
				httpGet("/v1/public/coreuser/list/research").then(results => {
					const {httpCode, msg, data} = results.data;
					if (httpCode == 200){
						this.researchDirectionList = data.researchDirectionList ;
					} else {
						this.researchDirectionList = [];
						errTips(msg);
					}
					console.log(this.researchDirectionList);
				})
			},
			searchList(){
				this.getExpert(this.searchData);
			},
			searchExpert(){
				//alert(1);
				this.dialogExpertVisible=true;
				this.getExpert();
			},
			handleCurrentChange(val) {
			  this.pageData.pageNo = val;
			  this.getView();
			},
			getExpert(val = this.pageData) {
			  this.loading = true;
			  //get /v1/authorization/review/expert/user
			  httpGet("/v1/authorization/review/expert/user", val).then(results => {
			    const { httpCode, msg, data } = results.data;
			    if (httpCode == 200) {
			      this.pageNo = data.pageNo;
			      this.totalPage = parseInt(data.totalPage + "0");
			      this.expertUserList = data.expertUserList;
			      Object.assign(this.pageData, val);

			    } else if (msg == "该条件暂无数据") {
			      this.expertUserList = [];
			      message("该条件暂无数据");
			    } else if (httpCode !== 401) {
			      errTips(msg);
			    }
			    this.loading = false;
			  });
			},

			submitForm(){
				//put /v1/authorization/review/reviewdeploy/update
				console.log("submitForm");
				httpPut("/v1/authorization/review/reviewdeploy/update",this.ruleForm).then(results => {
					const {httpCode,msg,data} = results.data;
					console.log(httpCode);
					if (httpCode === 200){
						//alert(111);
						successTips("评审设置提交成功！");
						this.getView();
					} else {
						errTips(msg);
					}
				})
			},
			getView() {
				this.loading = true;
				httpGet("/v1/authorization/review/total/get", {id:this.id}).then(results => {
					const {
						httpCode,
						msg,
						data
					} = results.data;
					if (httpCode == 200) {
						this.ruleForm = data.adminDeployBean;
						this.title = data.title;
						this.expertAlternativeList = data.expertAlternativeList;
						let expertInviteList = data.expertInviteList;
						for (let i of expertInviteList) {
							i.gmtModified  = specificDate(i.gmtModified );
						}
						this.expertInviteList=expertInviteList;

					} else{
						errTips(msg);
					}
					this.loading = false;
				});
			},
			rowClass() {
				return "background:#F4F6F9;";
			}
		}
	};
</script>

<style lang="scss">

.title{
	padding: 20px 0 0 0;
	font-size: 30px;
	font-weight: 400;
	border-bottom: 0;
}
.header_top{
	margin-top:2%;
	.el-input {
	  display: inline-block;
	  width: 150px;
	  margin-right: 15px;
	}
}
.setting{
	margin-left: 60px;;
	.el-input {
	  //display: inline-block;
	  width: 150px;
	}
}
.dialog_header_top{
	.el-input {
		display: inline-block;
		width: 150px;
		margin-right: 15px;
		margin-top: 20px;
	}
}
.bid_footer {
margin-bottom: 20px;
.el-input__inner {
  width: 70px;
}
.el-pagination {
  text-align: center;
  margin: 50px 0 50px 0;
}
}
</style>
