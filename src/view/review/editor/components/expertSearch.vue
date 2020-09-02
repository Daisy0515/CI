<!--功能：搜索评审专家并邀请
    调用页面：1.inviteExpert(评审管理员:邀请评审专家)，

-->
<template>
	<el-dialog title="评审专家搜索" :visible.sync="dialogExpertVisible" :close-on-click-modal="false" width="80%" :before-close="changeVisible">
	
		<h2 style="font-weight: bolder;text-align: center;">评审标题：<span>{{reviewTitle}}</span></h2>
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
		<el-table :data="dataTable" :header-cell-style="rowClass" style="margin-top: 20px;" v-loading="expertloading">
			<el-table-column label="操作" align="center" width="160px">
				<template slot-scope="scope">
					<el-checkbox-group
							v-model="scope.row.checkList"
							:min="0"
							:max="1"
							@change="inviteRadio(scope.row.uId,scope.row.checkList,scope.row)">
						<el-checkbox label="邀请" value="邀请"></el-checkbox>
						<el-checkbox label="备选" value="备选"></el-checkbox>
					</el-checkbox-group>
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
		<invited-expert-list :infoList="invitedExpertList" :alter-list="alterList" :invitedExpertVisible="invitedExpertVisible" :params="inviteExpertParams" @closeDialog="closeInvitedExpertDialog"
		@clearInvitedExpert="clearInvitedExpert"></invited-expert-list>
		<div class="bid_footer">
			<el-pagination @current-change="handleCurrentChange" :current-page.sync="pageData.pageNo" :total="totalPage"
						   layout="prev, pager, next, jumper"></el-pagination>
		</div>
	
	</el-dialog>
	
</template>

<script>
	import { httpGet, httpPost} from "@/utils/http.js";
	import { message, successTips, errTips } from "@/utils/tips.js";
	import { specificDate } from '@/utils/getDate.js';
	import InvitedExpertList from "./invitedExpertList";
	export default {
	    name: "expertSearch",
		components: {InvitedExpertList},
		props: {
	        dialogExpertVisible:{  //控制对话框
	            type:Boolean,
	            default:false,
	        },
			expertloading:{ 
				type:Boolean,
				default:false,
			},
			reviewTitle:{
	        	type:String,
				default:null
			},
			params:{ //保存邀请专家传给组件的参数
	        	type:Object,
				default:null
			}
	    },

	    data() {
	        return {
				expertUserList : [],
				cruxList : [],
				researchDirectionList : [],
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
				totalPage:null,
				//保存提交 已选择专家的接口信息
				postForm: {
					alternativeList: [], //专家对象信息集合
					expertInviteList: [], //邀请对象信息集合
					id: null,
					//type : 1
				},
				invitedExpertList:[], //已邀请专家列表
				alterList:[], //备选专家列表
				templateId:null,
				invitedExpertVisible:false, //控制已邀请专家对话框
				inviteExpertParams:{
					templateId:null,
					id:null,
					alternativeList:[]
				},
				dataTable:[],
	        }
	    },
	    watch:{
			dialogExpertVisible : function (val) {
				//console.log("watch-dialogExpertVisible", val)
				if (val === true) {
					this.getExpert(); //获取专家列表
					this.getKeyWords(); //获取关键词
					this.getResearchList(); //获取研究方向
				}
				if (val === false) {
					Object.assign(this.$data, this.$options.data())
				}
			}
		},
		methods:{
	    	/**评审专家搜索的 提交邀请*/
			postInvite() {
				//alert(111);
				this.postForm.id = this.params.id;
				//this.inviteExpertParams.id = this.params.id;
				this.inviteExpertParams = this.postForm;
				console.log("postForm:", this.postForm);
				if (this.postForm.alternativeList.length == 0 && this.postForm.expertInviteList.length == 0)
					errTips("请选择评审专家！");
				else {
					httpPost("/v1/authorization/review/expertinvite/get", this.postForm).then(results => {
						const {httpCode, msg, data} = results.data;
						if (httpCode === 200) {
							//this.infoList = data.infoList;
							let list = data.infoList;//邀请专家信息集合（含有专家的名字）
							for (let i of list) {
								i.isInvite = true;
								//i.emailConfig = {theme:null,content:null};
								i.duplicate = {isAdmin:false , isProjectUser:false};
								i.restrictReviewTime = this.params.restrictReviewTime;
							}
							this.invitedExpertList = list;
							this.templateId = data.templateId;
							this.invitedExpertVisible = true;
							this.inviteExpertParams.templateId = data.templateId;
							console.log("inviteExpertParams:",this.inviteExpertParams);
						} else {
							errTips(msg);
						}
					})

				}
			},
			clearInvitedExpert(){
				this.postForm.expertInviteList = [];
				this.postForm.alternativeList = [];
				this.getExpert();
			},
			/**邀请与备选触发的函数*/
			inviteRadio(id, arr, personalInfo) {
				let val;
				console.log("id",id);
				console.log(this.postForm.expertInviteList);
				console.log(this.postForm.alternativeList);
				if (arr.length === 0) {
					let index = this.postForm.expertInviteList.findIndex(item => item.userId === id);
					if (index != -1)
						this.postForm.expertInviteList.splice(index, 1);
					index = this.postForm.alternativeList.findIndex(item => item.userId === id);
					if (index != -1) {
						this.postForm.alternativeList.splice(index, 1);
						this.alterList.splice(index, 1);
					}

				} else {
					if (arr[0] === "邀请")
						val = 1;
					if (arr[0] === "备选")
						val = 2;
					let temp = {
						emailConfig: null,
						isInvite: true,
						restrictReviewTime: this.params.restrictReviewTime,
						type: val,
						userId: id
					}
					if (val == 1) this.postForm.expertInviteList.push(temp);
					if (val == 2) {
						this.postForm.alternativeList.push(temp);
						this.alterList.push(personalInfo);
					}
				}
			},
	    	/**获取关键词*/
			getKeyWords() {
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
					//console.log(this.cruxList);
				})
			},
			/**获取研究方向*/
			getResearchList() {
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
					//console.log(this.researchDirectionList);
				})
			},
	    	/**获取专家列表*/
			getExpert(val = this.pageData) {
				this.invitedExpertList = [];
				this.alterList = [];
				//console.log(222);
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
						//this.expertUserList = data.expertUserList;
						//console.log('expertUserList',this.expertUserList);
						let list = data.expertUserList;

						for (let i of list) {
							i.invite.finallyInvite = specificDate(i.invite.finallyInvite);
							i.review.finallyAcceptMissionTime = specificDate(i.review.finallyAcceptMissionTime);
							i.review.finallyFinishedMissionTime = specificDate(i.review.finallyFinishedMissionTime);
							i.checkList = [];
						}
						this.expertUserList = list;
						this.dataTable = list;
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
			/**搜索专家*/
			searchList() {
				//console.log(11);
				this.getExpert(this.searchData);
			},
			/**下一页*/
			handleCurrentChange(val) {
				this.pageData.pageNo = val;
				this.getView();
			},
			closeInvitedExpertDialog(){
			    this.invitedExpertVisible=false;

			},
			changeVisible(){
	            this.$emit("closeDialog"); ////changeVisible事件触发后，自动触发closeDialog
	        },
	        rowClass() {
	            return "background:#F4F6F9;";
	        }
	    }
	}
</script>

<style>
</style>
