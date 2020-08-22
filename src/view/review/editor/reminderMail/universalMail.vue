<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 130%;margin-bottom: 20px;">
            <el-breadcrumb-item :to="{ path: '/editorManager' }">评审管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/editorReminderEmail' }">发送提醒邮件</el-breadcrumb-item>
            <el-breadcrumb-item>通用邮件模块</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <h2 style="font-weight: bolder;">邮件发送设置</h2>
            </el-row>
            <el-row>
                <el-col style="margin-top: 5px;" :span="2" :offset="3">
                    <span style="font-weight: bolder;font-size: large;">收件方：</span>
                </el-col>
                <el-col :span="6">
                    <el-select v-model="receiver" placeholder="请选择发送对象" size="medium">
                        <el-option label="提交人" value="1"></el-option>
                        <el-option label="评审专家" value="2"></el-option>
                        <el-option label="发布者" value="3"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="6">
                    <el-select v-model="status" placeholder="请选择评审状态" size="medium" v-if="this.receiver==='2'">
                        <el-option label="全部状态" value="1"></el-option>
                        <el-option label="已完成" value="2"></el-option>
                        <el-option label="已撤回评审" value="3"></el-option>
                        <el-option label="评审中(已延期)" value="4"></el-option>
                        <el-option label="评审中" value="5"></el-option>
                        <el-option label="已撤回邀请" value="6"></el-option>
                        <el-option label="已邀请未回复" value="7"></el-option>
                        <el-option label="已拒绝" value="8"></el-option>
                        <el-option label="已中止" value="9"></el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row style="margin-top: 15px;">
                <el-col :offset="3" :span="13" style="margin-top: 5px;">
                    <span style="font-size:large;">您可以根据需要选择平台内置的模板或者用户自己内置的模板: </span>
                </el-col>
                <el-col :span="5">
                    <el-select v-model="templateId" placeholder="请选择模板" clearable>
                        <el-option
                                v-for="item in templateList"
                                :key="item.id"
                                :label="item.templateName"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
        </el-card>
        <div class="myTable">
            <div class="header_top">
                <el-input v-model="searchData.title" placeholder="评审标题"></el-input>
                <el-select v-model="searchData.type" placeholder="请选择评审类型">
                    <el-option v-for="index in typeList" :label="typeList[index]" :value="index"></el-option>
                </el-select>
                <el-input v-model="searchData.projectUserName" placeholder="发布者"></el-input>
                <el-input v-model="searchData.submitterName" placeholder="提交人"></el-input>
                <el-date-picker v-model="searchData.submitTimeStart" type="date" style="width: 150px;"placeholder="提交开始时间"
                                value-format="yyyy-MM-dd" :picker-options="startDatePicker"></el-date-picker>
                <span style="margin-right: 15px;">到</span>
                <el-date-picker v-model="searchData.submitTimeEnd" type="date" style="width: 150px;" placeholder="提交结束时间"
                                value-format="yyyy-MM-dd" :picker-options="endDatePicker"></el-date-picker>
                <el-button type="primary" @click="searchList">搜索</el-button>
            </div>
            <el-table v-loading="loading" :data="tableData" style="width:100%;margin:20px auto" :header-cell-style="rowClass">
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-checkbox v-model="scope.row.isChoose" @change="changeAdminMissionList(scope.row)"></el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="评审标题" align="center">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" :content="scope.row.title">
                            <span class="tablehidden">{{ scope.row.title  }}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="评审类型" align="center">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" :content="scope.row.type+''">
                            <span class="tablehidden">{{ scope.row.type  }}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="id" label="评审编号" align="center">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" :content="scope.row.id+''">
                            <span class="tablehidden">{{ scope.row.id  }}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="submitterName" label="提交人" align="center">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" :content="scope.row.submitterName" placement="top-start">
                            <span class="tablehidden">{{ scope.row.submitterName }}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="projectUserName " label="发布者" align="center">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" :content="scope.row.projectUserName " placement="top-start">
                            <span class="tablehidden">{{ scope.row.projectUserName }}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="submitTime" label="提交时间" align="center"></el-table-column>
                <el-table-column prop="gmtModified" label="更新时间" align="center"></el-table-column>
                <el-table-column prop="status" label="状态" align="center">
                    <template slot-scope="scope">
                        <span v-show="scope.row.status==1">待处理</span>
                        <span v-show="scope.row.status==2">评审中</span>
                        <span v-show="scope.row.status==3">完成</span>
                        <span v-show="scope.row.status==4">中止</span>
                    </template>
                </el-table-column>
                <el-table-column prop="statusExplain" label="专家评审状态" align="center" width="120px;">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status === 1">等待管理员分配</span>
                        <template v-if="scope.row.status!==1">
                            <span>共需要专家{{scope.row.statistics.needExpertInvite}}人<br></span>
                            <span v-if="scope.row.statistics.finish!==0">已完成：{{scope.row.statistics.finish}}人<br></span>
                            <span v-if="scope.row.statistics.inviteNoReply!==0">邀请未回复：{{scope.row.statistics.inviteNoReply}}人<br></span>
                            <span v-if="scope.row.statistics.inviteRefuse!==0">已拒绝：{{scope.row.statistics.inviteRefuse}}人<br></span>
                            <span v-if="scope.row.statistics.reviewUnderway!==0">评审中：{{scope.row.statistics.reviewUnderway}}人<br></span>
                            <span v-if="scope.row.statistics.postpone!==0">评审延期：{{scope.row.statistics.postpone}}人<br></span>
                        </template>
                        <el-button v-if="scope.row.status===2||scope.row.status===3" @click="viewExpertReviewList(scope.row.id)"
                                   type="text" size="medium">查看详情
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="opinion" label="管理员意见" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.opinion===1">接受</span>
                        <span v-if="scope.row.opinion===2">需要修改</span>
                        <span v-if="scope.row.opinion===3">拒绝</span>
                        <span v-if="scope.row.opinion===4">没有意见 </span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="bid_footer">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="pageData.pageNo" :total="totalPage"
                           layout="prev, pager, next, jumper">
            </el-pagination>
        </div>
        <el-row style="margin-top: 10px;">
            <el-col :offset="10">
                <el-button type="primary" @click="next">下一步</el-button>
            </el-col>
        </el-row>
        <!--查看第三方评审意见-->
        <el-dialog title="第三方评审意见" :visible.sync="expertReviewDialogVisible" width="80%" :before-close="closeExpertReviewDialog">
            <view-expert-review-list :userList="expertReviewList" ></view-expert-review-list>
        </el-dialog>
        <!--定制信件对话框-->
        <customize-email-dialog :visible="nextVisible" :receiver="receiver" :templateId="templateId" :userList="userList" usedBy="universalMail"
                                :userListLoading="userListLoading" :templateList="templateList" @closeDialog="closeSelectedUserDialog">
        </customize-email-dialog>
    </div>
</template>

<script>
    import timeLimit from "@/mixins/regular/timeLimitForReview.js";
    import {httpGet, httpPost} from "@/utils/http.js";
    import {message, successTips, errTips} from "@/utils/tips.js";
    import {specificDate} from '@/utils/getDate.js';
    import customizeEmailDialog from '@/view/review/editor/components/customizeEmailDialog';
    import viewExpertReviewList from "@/view/review/editor/components/viewExpertReviewList";
    export default {
        name: "universalMail",
        mixins: [timeLimit],
        components:{
            customizeEmailDialog,
            viewExpertReviewList
        },
        data() {
            return {
                /*邮件设置与搜索*/
                templateList:[],//邮箱模板
                searchData: this.getInitialPageOrSearchData(),
                pageData: this.getInitialPageOrSearchData(),
                tableData: [],//搜索的结果
                loading: false,//搜索时加载
                typeList: [],//评审类型的集合
                totalPage: 0,

                /*下一步按钮要提交给后台的数据*/
                templateId:null,//选择的邮件模板的
                status:null,// 评审专家状态 1全部状态2已完成3已撤回评审4评审中（已延期）5评审中6已撤回邀请7已邀请未回复8已拒绝9已中止
                receiver:null,//收件方1提交人2评审专家3评审发布者 ,
                adminMissionList:[],//管理员任务编号ID集合 ,

                /*点击下一步，得到的已选择对象对话框显示的属性*/
                userList: [],//已选择的待发送邮件的用户信息
                userListLoading:false,//获取userList时的加载提示
                nextVisible:false,//下一步对应的谈话框是否显示
                /*查看专家评审状态*/
                expertReviewDialogVisible: false,
                opinion:null,//管理员决定
                expertReviewList:[],//评审专家的评审结果

                reviewDetail: {},//查看详情的对话框

            };
        },
        created() {
            this.getView();
            this.getTypeList();
            this.getEmailTemplate();
        },
        methods: {
            /**初始化PageData和SearchData*/
            getInitialPageOrSearchData() {
                return {
                    pageNo: 1,
                    pageSize: 10,
                    orderBy: "id",
                    orderType: "DESC",
                    type: null,
                    submitterName: null,
                    projectUserName: null,
                    submitTimeStart: null,
                    submitTimeEnd: null,
                    expertAccomplishCount: this.expertAccomplishCount,
                    status: this.status,
                    statusExplain: this.statusExplain,
                };
            },
            /**初始化emailConfig*/
            getInitEmailConfig(){//用户设置的信件模板与信件主题,初始化为null
                return {
                    content:null,
                    theme:null,
                }
            },
            /**通用邮件页面：获取邮箱模板*/
            getEmailTemplate(){
                httpGet('/v1/authorization/review/emailtemplate/get').then(results=>{
                    const {httpCode, msg, data} = results.data;
                    if (httpCode == 200) {
                        this.templateList = data.templateList;
                    } else {
                        errTips(msg);
                    }
                });
            },
            /**通用邮件页面：获取评审任务列表*/
            getView(val = this.pageData) {
                this.loading = true;
                httpGet("/v1/authorization/review/admin/search", val).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode == 200) {
                        this.pageNo = data.pageNo;
                        this.totalPage = parseInt(data.totalPage + '0');
                        let list = data.adminMissionList;
                        for (let i of list) {
                            i.gmtModified = specificDate(i.gmtModified);
                            i.submitTime = specificDate(i.submitTime);
                        }
                        Object.assign(this.pageData, val);
                        this.tableData = list // this.$set(this, 'tableData', list);
                    } else {
                        this.tableData = [];
                        errTips(msg);
                    }
                    this.loading = false;
                });
            },
            /**通用邮件页面：获取当前评审类型列表*/
            getTypeList() {
                httpGet("/v1/authorization/review/type/get").then(results => {
                    const { httpCode, msg, data } = results.data;
                    if (httpCode == 200) {
                        this.typeList = data.typeList;
                    } else {
                        this.typeList = [];
                        errTips(msg);
                    }
                });
            },
            /**通用邮件页面：查看第三方专家的评审列表*/
            viewExpertReviewList(val) {
                httpGet("/v1/authorization/review/expertinviterecord/list", {id: val}).then(results => {
                    const { httpCode, msg, data } = results.data;
                    if (httpCode == 200) {
                        this.opinion = data.opinion;
                        let userList = data.userList;
                        for (let i of userList) {
                            i.gmtCreate = specificDate(i.gmtCreate);
                        }
                        this.expertReviewList = userList;
                    } else {
                        this.expertReviewList = [];
                        errTips(msg);
                    }
                });
                this.expertReviewDialogVisible = true;
            },
            /**通用邮件页面：关闭第三方专家的评审列表*/
            closeExpertReviewDialog(){
                this.expertReviewDialogVisible = false;
            },
            /**通用邮件页面：搜索列表*/
            searchList(){
                this.getView(this.searchData);
            },
            /**通用邮件页面：改变管理员任务编号集合*/
            changeAdminMissionList(row){
                if(row.isChoose===true){
                    this.adminMissionList.push(row.id);
                }else{
                    let index = this.adminMissionList.indexOf(row.id);
                    this.adminMissionList.splice(index,1);
                }
            },
            /**通用邮件页面：是否允许点击下一步的条件判断*/
            nextIsOk(){
                if(this.receiver===null){
                    errTips("请选择发送对象！");
                    return false;
                }
                if(this.receiver===2&&this.status===null){
                    errTips("请选择评审专家的评审状态！");
                    return false;
                }
                if(this.templateId===null){
                    errTips("请选择发送的模板！");
                    return false;
                }
                if(this.adminMissionList.length===0){
                    errTips("请选择相关的评审任务!");
                    return false;
                }
                return true;
            },
            /**通用邮件页面：点击下一步的操作*/
            next(){
                if(this.nextIsOk()===false){
                    return false;
                }
                this.userList = [];//清空之前的待发送邮件的用户信息
                let data = {
                    adminMissionList: this.adminMissionList,
                    receiver:parseInt(this.receiver),
                    status:parseInt(this.status),
                    templateId:this.templateId,
                };
                this.nextVisible = true;
                this.userListLoading = true;
                httpPost("/v1/authorization/review/admincurrentemail/get",data).then(results=>{
                    const {httpCode,msg,data} = results.data;
                    if(httpCode===200){
                        /*预先设定选择的每一个对象都是要发送的*/
                        for(let item of data.userList){
                            item.isSent = true;             //控制邮件是否发送true表示发送，false表示不发送
                            item.duplicate = this.getInitDuplicate();
                            item.emailConfig = null;
                            item.adminMissionId = item.id;  //后续任务的接口里用了adminMissionId来表示，故进行简单的转换，以便后续使用
                        }
                        this.userList = data.userList;//待发送邮件的用户信息，在点击下一步后的对话框里显示，
                                                      // 包含id : 管理员任务编号ID ,userId: 用户编号ID ,userName: 提交人/评审专家/评审发布者 用户名
                    }else{
                        errTips(msg);
                    }
                    this.userListLoading = false;
                });
            },
            /**初始化duplicate*/
            getInitDuplicate(){
                return {
                    isAdmin:false,//管理员
                    isProjectUser:false,//发布者
                };
            },
            /**已选择对象对话框：关闭对话框*/
            closeSelectedUserDialog(){
                this.nextVisible=false
            },
            handleCurrentChange(val){
                this.pageData.pageNo = val;
                this.getView();
            },
            rowClass(){
                return "background:#F4F6F9;";
            }
        }
    }
</script>

<style lang="scss">
    @import "@/assets/scss/myTable.scss";
    .bid_footer{
        margin-left: 35%;
    }
</style>
