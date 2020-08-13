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
				
				<el-button type="primary" @click="searchExpert()">专家搜索</el-button>
				<el-dialog title="评审专家搜索" :visible.sync="dialogExpertVisible" :close-on-click-modal="false" width="80%" :before-close="clearList">

					<h2 style="font-weight: bolder;text-align: center;">评审标题：<span>{{title}}</span></h2>
					<div class="dialog_header_top">

						<el-input v-model="searchData.name" placeholder="评审专家姓名"></el-input>
						<el-input v-model="searchData.jobTitle" placeholder="职称"></el-input>
						<el-select v-model="searchData.researchId" clearable placeholder="研究方向">
							<el-option v-for="item in researchDirectionList" :label="item.researchDirection" :value="item.id"></el-option>
						</el-select>
						<el-input v-model="searchData.workUnit" placeholder="单位"></el-input>
						<el-input v-model="searchData.department" placeholder="部门"></el-input>
						<el-select v-model="searchData.cruxId" clearable placeholder="关键词">
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
						<el-table-column label="操作" align="center" width="160px">
							<template slot-scope="scope">
								<el-radio-group v-model="scope.row.radio" @change="invite(scope.row.uId,scope.row.radio)" >
									<el-radio label="1">邀请</el-radio>
									<el-radio label="2">备选</el-radio>
								</el-radio-group>
							</template>
						</el-table-column>
						<el-table-column prop="uName" label="评审专家姓名" align="center"></el-table-column>
						<el-table-column label="个人信息" align="center" >
							<template slot-scope="scope">
								<span>职称：{{scope.row.uJobTitle}}</span></br>
								<span>学历：</span>
								<span v-if="scope.row.uEducation==1">高中</span>
								<span v-if="scope.row.uEducation==2">大专</span>
								<span v-if="scope.row.uEducation==3">本科</span>
								<span v-if="scope.row.uEducation==4">研究生</span>
								<span v-if="scope.row.uEducation==5">博士</span>
								<span v-if="scope.row.uEducation==6">博士后</span>
								<span v-if="scope.row.uEducation==7">院士</span>
								</br>
								<span>单位：{{scope.row.uWorkUnit}}</span></br>
							</template>
						</el-table-column>
						
						<el-table-column prop="uEmail" label="邮箱" align="center"></el-table-column>
						<el-table-column prop="uNation" label="国家" align="center"></el-table-column>
						<el-table-column prop="typeList" label="研究方向" align="center">
							<template slot-scope="scope">
								<span v-for="(item,index) in scope.row.typeList">
									{{item}}&nbsp;
								</span>
							</template>
						</el-table-column>
						<el-table-column prop="review" label="评审统计(同意邀请)" align="center" width="280px">
							<template slot-scope = "scope">
								<span>评审中的任务：{{scope.row.review.underwayMission}}</span><br />
								<span>已完成的评审任务：{{scope.row.review.finishedMission}}</span><br />
								<span>撤回已分配任务：{{scope.row.review.revocationMisson}}</span><br />
								<span>接受任务后中止：{{scope.row.review.discontinueMission}}</span><br />
								<span>最近一次接受评审任务：{{scope.row.review.finallyAcceptMissionTime}}</span><br />
								<span>最近一次评完成评审任务：{{scope.row.review.finallyFinishedMissionTime}}</span><br />
								<span>平均评审时间（天）：{{scope.row.review.ageReviewTime }}</span><br />
								<span>评审平均得分：{{scope.row.review.ageReviewScore }}</span><br />
							</template>
						</el-table-column>
						<el-table-column prop="invite" label="邀请统计" align="center" width="280px">
							<template slot-scope = "scope">
								<span>最近一次邀请：{{scope.row.invite.finallyInvite }}</span><br />
								<span>未回复的邀请：{{scope.row.invite.noReplyInvite }}</span><br />
								<span>接受任务：{{scope.row.invite.acceptMission }}</span><br />
								<span>拒绝任务：{{scope.row.invite.refuseMission }}</span><br />
								<span>撤回邀请：{{scope.row.invite.revocationInvite }}</span><br />
								<span>中止任务：{{scope.row.invite.withdrawMission }}</span><br />
								<span>邀请总数：{{scope.row.invite.inviteSum }}</span><br />

							</template>
						</el-table-column>
					</el-table>
					<el-button type="primary" style="float: right;margin-top: 20px;" @click="postInvite()">提交邀请</el-button>
					<div class="bid_footer">
						<el-pagination @current-change="handleCurrentChange" :current-page.sync="pageData.pageNo" :total="totalPage"
									   layout="prev, pager, next, jumper"></el-pagination>
					</div>

				</el-dialog>

				<el-dialog title="邀请评审专家" :visible.sync="settingVisible" :close-on-click-modal="false" width="50%" :before-close="clearList1">
					<el-dialog width="40%" title="邮件编辑" :visible.sync="emailSettingVisible" append-to-body>
						<el-dialog width="40%" title="邮件预览" :visible.sync="emailePrviewVisible" append-to-body :before-close="showEmailSetting">
							<!-- <el-input
							  type="textarea"
							  :rows="15"
							  placeholder="请输入内容"
							  v-model="previewArea">
							</el-input> -->
							<p v-html="previewArea"></p>
							<!-- <div style="text-align: right;">
								<el-button type="primary" style="margin-top: 20px;" @click="confirmEmail()">确定</el-button>
							</div> -->
						</el-dialog>

						<el-form :label-position="'right'" label-width="100px" :model="emailForm">
							
							<el-form-item label="收件人">
								<span>{{emailForm.userName}}</span>
							</el-form-item>
							<el-form-item label="抄送">
								<el-checkbox-group v-model="checkList" @change="selectCC">
								    <el-checkbox label="管理员"></el-checkbox>
								    <el-checkbox label="发布者"></el-checkbox>
								    
								  </el-checkbox-group>
							</el-form-item>
							<el-form-item label="信件主题">
								<el-input v-model="emailForm.config.theme" style="width: 90%;"></el-input>
							</el-form-item>
							<el-form-item label="信件内容">
								<el-input type="textarea" v-model="emailForm.config.content" style="width: 90%;" rows="10">
									
								</el-input>
							</el-form-item>
						</el-form>
						<div style="text-align: right;">
							<el-button type="primary" style="margin-top: 20px;margin-right: 20px;" @click="preview()">预览</el-button>
							<el-button type="primary" style="margin-top: 20px;" @click="emailConfirm()">确定</el-button>
						</div>
					</el-dialog>

					<el-table :data="infoList" :header-cell-style="rowClass" style="margin-top: 20px;">

						<el-table-column prop="userName" label="评审专家姓名" align="center"></el-table-column>
						<el-table-column label="信件" align="center">
							<template slot-scope="scope">
								<el-button type="text" @click="emailSetting(scope.row,scope.$index)">编辑</el-button>
							</template>
						</el-table-column>
						<el-table-column prop="restrictReviewTime" label="限定评审的时间" align="center">
							<template slot-scope="scope">
								<el-input v-model.number="scope.row.restrictReviewTime" style="width: 50px;" size="mini">

								</el-input>
							</template>
						</el-table-column>
						<el-table-column label="邀请" align="center">
							<template slot-scope="scope">
								<el-checkbox v-model="scope.row.isInvite"></el-checkbox>
								<!-- <el-button @click="scope.row.isInvite=false" type="text" v-if="scope.row.isInvite==true">取消</el-button>
								<el-button type="text" v-if="scope.row.isInvite==false">已取消</el-button> -->
							</template>
						</el-table-column>
					</el-table>
					<div style="text-align: right;">
						<el-button type="primary" style="margin-top: 20px;" @click="finalInvite()">确定邀请</el-button>
					</div>
				</el-dialog>


			</div>
			<h2 style="text-align: left;font-weight: bolder;margin-top: 2%;">评审设置</h2>
			<div class="setting">
				<el-form :label-position="'right'" label-width="350px" :model="ruleForm">
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
					<el-form-item label="邀请撤回前发送提醒邮件">
						<el-input v-model="ruleForm.inviteRevocationFront ">
							<template slot="append">天</template>
						</el-input>
					
					</el-form-item>
					<el-form-item label="专家接受任务后限定完成的时间">
						<el-input v-model="ruleForm.restrictReviewTime">
							<template slot="append">天</template>
						</el-input>

					</el-form-item>
					<!-- <el-form-item label="自动取消评审专家未完成(接受后)任务的时间限制">
						<el-input v-model="ruleForm.responseInvite">
							<template slot="append">天</template>
						</el-input>

					</el-form-item> -->
					<el-form-item label="截止日期后,在取消未完成任务前每隔固定天数发生提醒邮件">
						<el-input v-model="ruleForm.deadlineRearEvery ">
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
						<el-select v-model="ruleForm.templateId" clearable placeholder="请选择打分模板">
							<el-option v-for="item in templateNameList" :label="item.templateName" :value="item.id"></el-option>
						</el-select>
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
				<el-table :data="expertAlternativeList" style="width:500px;margin:50px auto;" :header-cell-style="rowClass"
						  v-loading="loading">
					<el-table-column prop="userName" label="评审专家" align="center">
						<template slot-scope="scope">
							<el-tooltip class="item" effect="dark" :content="scope.row.userName" placement="top-start">
								<span class="tablehidden">{{ scope.row.userName }}</span>
							</el-tooltip>
						</template>
					</el-table-column>
					<el-table-column prop="resourceName" label="操作" align="center">
						<template slot-scope="scope">
							<el-button @click="alterInvite(scope.row)" type="text" size="medium">
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
	import {
		httpGet,
		httpPut,
		httpPost,
		httpDelete
	} from "@/utils/http.js";
	import {
		message,
		successTips,
		errTips
	} from "@/utils/tips.js";
	import {
		specificDate
	} from '@/utils/getDate.js';

	export default {
		props: ['type'], //type用来区分'新任务'，‘评审专家需要额外评审’，‘评审延期’，‘评审中’等类型
		components: {

		},
		data() {
			return {
				previewArea:null,
				checkList:[],
				reviewId:null,
				emailForm: {
					userId:null,
					userName: null,
					index: null,
					config: {
						content: null,
						theme: null,
					}
				},
				emailSettingVisible: false,
				totalPage: null,
				radio: '1',
				loading: false,
				expertUserList: [],
				dialogExpertVisible: false,
				pageData: {
					pageNo: 1,
					pageSize: 10,
					name: '',
					jobTitle: '',
					cruxId: null,
					researchId: null,
					workUnit: '',
					department: '',
					email: '',
					education: null,
					nation: '',
				},
				searchData: {
					pageNo: 1,
					pageSize: 10,
					name: '',
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
					deadline: null,
					id: null,
					inviteRevocationFront :null,
					isBlindRial: 'false',
					isConflictDetection: 'false',
					number: null,
					responseInvite: null,
					restrictReviewTime: null,
					templateId: null,
					unfinished: null,
					//unfinishedEmail: null,
				},
				title: "",
				expertInviteList: [],
				expertAlternativeList: [],
				cruxList: [],
				researchDirectionList: [],
				postForm: {
					alternativeList: [], //专家对象信息集合
					expertInviteList: [], //邀请对象信息集合
					id: null
				},
				infoList: [],
				settingVisible: false,
				templateNameList: [],
				dataList: [],
				emailePrviewVisible:false,
			};
		},
		created: function() {
			this.id = this.$route.query.id;
			this.reviewId = this.$route.query.reviewId;
			this.postForm.id = this.id;
			this.getView();
			this.getKeyWords();
			this.getResearchList();
			this.getTemplate();
		},
		computed: {},
		methods: {
			selectCC(){
				console.log(this.checkList);
			},
			emailConfirm(){
				let i = this.emailForm.index;
				console.log("emailConfirm-emailForm:",this.emailForm);
				console.log("infoList:",this.infoList)
				this.infoList[i].emailConfig = this.emailForm.config;
				//this.emailForm={};
				this.emailSettingVisible = false;
			},
			showEmailSetting(){
				this.emailSettingVisible=true;
				this.emailePrviewVisible = false;
			},
			clearList1(){
				//alert(11);
				this.postForm.expertInviteList=[];
				this.postForm.alternativeList=[];
				this.settingVisible=false;
				//settingVisible
			}, 
			clearList(){
				//alert(11);
				this.postForm.expertInviteList=[];
				this.postForm.alternativeList=[];
				this.dialogExpertVisible=false;
				//settingVisible
			},  
			alterInvite(val) {
				console.log("alterExpert:", val);
				var item = {
					userId: val.userId,
					type: 1,
					isInvite: true
				};
				this.postForm.expertInviteList.push(item);
				httpPost("/v1/authorization/review/expertinvite/insert", this.postForm).then(results => {
					const {
						httpCode,
						msg,
						data
					} = results.data;
					//console.log(httpCode);
					if (httpCode === 200) {

						this.settingVisible = false;
						successTips("已发出邀请");
						this.postForm.expertInviteList=[];
						this.getView();
					} else {
						this.postForm.expertInviteList=[];
						errTips(msg);
					}
				})
			},
			preview(val) {

				this.emailePrviewVisible=true;
				let previewForm={adminMissionId:this.id,userId:this.emailForm.userId,emailContent:this.emailForm.config.content};
				//post /v1/authorization/review/expertinviteemailconfig/get 
				httpPost("/v1/authorization/review/expertinviteemailconfig/get",previewForm).then(results => {
					const {
						httpCode,
						msg,
						data
					} = results.data;
					if (httpCode == 200) {
						this.previewArea = data.content;

					} else {

						errTips(msg);
					}

				})
				// let i = this.emailForm.index;
				// this.infoList[i].emailConfig = this.emailForm.config;
				// this.emailForm.config = 
				//console.log("2:",this.infoList);
				this.emailSettingVisible = false;
				//this.emailForm.config = {};
			},
			emailSetting(val, index) {  //编辑邮件
				this.emailSettingVisible = true;
				console.log("scope.row", val);
				console.log("index", index);
				//emailForm是显示邮件信息的列表
				this.emailForm.userId = val.userId;
				this.emailForm.userName = val.userName;
				this.emailForm.index = index;
				if (val.emailConfig != null)
					this.emailForm.config = val.emailConfig;
				//post /v1/authorization/review/expertinviteemailconfig/update
				let postEmailForm={adminMissionId:this.reviewId,receiver:2,userId:val.userId};
				console.log('postEmailForm:',postEmailForm);
				httpPost("/v1/authorization/review/expertinviteemailconfig/update", postEmailForm).then(results => {
					const {
						httpCode,
						msg,
						data
					} = results.data;
					//console.log(httpCode);
					if (httpCode === 200) {
						this.emailForm.config.content = data.content;
					} else {
						errTips(msg);
					}
				})

				// this.emailForm.config = {content:null, theme:null};
				//console.log(this.emailForm);
			},
			finalInvite() {
				//console.log(this.infoList);
				let list = this.infoList;
				for (let i of list) {
					delete i.userName;
				}
				console.log("finalInvite-list:",list);
				this.postForm.expertInviteList = list;

				console.log("finalInvite-postForm:",this.postForm);

				httpPost("/v1/authorization/review/expertinvite/insert", this.postForm).then(results => {
					const {
						httpCode,
						msg,
						data
					} = results.data;
					//console.log(httpCode);
					if (httpCode === 200) {

						this.settingVisible = false;
						successTips("已发出邀请");
						this.postForm.expertInviteList=[];
						this.postForm.alternativeList=[];
						this.getView();
					} else {
						errTips(msg);
					}
				})

			},
			getTemplate() {
				//get /v1/authorization/review/templatename/list
				httpGet("/v1/authorization/review/templatename/list").then(results => {
					const {
						httpCode,
						msg,
						data
					} = results.data;
					if (httpCode == 200) {
						this.templateNameList = data.templateNameList;
					} else {
						this.templateNameList = [];
						errTips(msg);
					}

				})
			},

			postInvite() {
				//alert(111);
				console.log("postForm:", this.postForm);
				if (this.postForm.alternativeList.length == 0 && this.postForm.expertInviteList.length == 0)
					errTips("请选择评审专家！");
				else {
					httpPost("/v1/authorization/review/expertinvite/get", this.postForm).then(results => {
							const {
								httpCode,
								msg,
								data
							} = results.data;
					
							if (httpCode === 200) {
								//this.infoList = data.infoList;
								let list = data.infoList;//邀请专家信息集合（含有专家的名字）
								for (let i of list) {
									i.isInvite = true;
									i.emailConfig = {theme:null,content:null};
									i.restrictReviewTime = this.ruleForm.restrictReviewTime;
								}
								this.infoList = list;
								//console.log(this.infoList);
								this.dialogExpertVisible = false;
								this.settingVisible = true;
							} else {
								errTips(msg);
							}
					})
					
				}
			},
			invite(id, val) {
				//console.log(id,val);
				val = parseInt(val);
				var temp = {
					emailConfig: null,
					isInvite: true,
					restrictReviewTime: this.ruleForm.restrictReviewTime,
					type: val,
					userId: id
				}
				if (val == 1) this.postForm.expertInviteList.push(temp);
				if (val == 2) this.postForm.alternativeList.push(temp);

				//console.log("post",this.postForm);
			},

			getKeyWords() {
				// /v1/public/coreuser/crux/list
				httpGet("/v1/public/coreuser/crux/list").then(results => {
					const {
						httpCode,
						msg,
						data
					} = results.data;
					if (httpCode == 200) {
						this.cruxList = data.cruxList;
					} else {
						this.cruxList = [];
						errTips(msg);
					}
					console.log(this.cruxList);
				})
			},
			getResearchList() {
				//
				httpGet("/v1/public/coreuser/list/research").then(results => {
					const {
						httpCode,
						msg,
						data
					} = results.data;
					if (httpCode == 200) {
						this.researchDirectionList = data.researchDirectionList;
					} else {
						this.researchDirectionList = [];
						errTips(msg);
					}
					console.log(this.researchDirectionList);
				})
			},
			searchList() {
				this.getExpert(this.searchData);
			},
			searchExpert() {
				//alert(1);
				this.dialogExpertVisible = true;
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
					const {
						httpCode,
						msg,
						data
					} = results.data;
					if (httpCode == 200) {
						this.pageNo = data.pageNo;
						this.totalPage = parseInt(data.totalPage + "0");
						this.expertUserList = data.expertUserList;
						console.log('expertUserList',this.expertUserList);
						let list = this.expertUserList;

						for (let i of list) {
							i.invite.finallyInvite = specificDate(i.invite.finallyInvite);
							i.review.finallyAcceptMissionTime = specificDate(i.review.finallyAcceptMissionTime);
							i.review.finallyFinishedMissionTime = specificDate(i.review.finallyFinishedMissionTime);
						}
						this.expertUserList = list;
						// let list2 = this.expertUserList.review;
						// for (let i of list2) {
						// 	i.finallyAcceptMissionTime = specificDate(i.finallyAcceptMissionTime);
						// 	i.finallyFinishedMissionTime = specificDate(i.finallyFinishedMissionTime);
						// }
						// this.expertUserList.review = list2;
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

			submitForm() {
				//put /v1/authorization/review/reviewdeploy/update
				console.log("submitForm");
				httpPut("/v1/authorization/review/reviewdeploy/update", this.ruleForm).then(results => {
					const {
						httpCode,
						msg,
						data
					} = results.data;
					console.log(httpCode);
					if (httpCode === 200) {
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
				httpGet("/v1/authorization/review/total/get", {
					id: this.id
				}).then(results => {
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
							i.gmtModified = specificDate(i.gmtModified);
						}
						this.expertInviteList = expertInviteList;

					} else {
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
	.title {
		padding: 20px 0 0 0;
		font-size: 30px;
		font-weight: 400;
		border-bottom: 0;
	}

	.header_top {
		margin-top: 2%;

		.el-input {
			display: inline-block;
			width: 150px;
			margin-right: 15px;
		}
	}

	.setting {
		margin-left: 60px;
	;

		.el-input {
			//display: inline-block;
			width: 150px;
		}
	}

	.dialog_header_top {
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
