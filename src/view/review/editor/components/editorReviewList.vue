<!--功能：评审任务列表
    调用页面：首页中的评审统计对应的所有页面，
              reviewTodo (评审管理员：导航栏中待处理任务里对应的所有页面），
              reviewStatistic(评审管理员：导航栏中评审完成对应的页面）
-->
<template>
    <div style="width:110%;">
        <div style="padding-left: 10px;">
            <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 130%;">
                <el-breadcrumb-item v-if="expertAccomplishCount!==null">评审统计</el-breadcrumb-item>
                <el-breadcrumb-item v-else :to="{ path: '/editorTodo' }">待处理任务</el-breadcrumb-item>
                <el-breadcrumb-item>{{reviewTypes}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="myTable">
            <div class="header_top">
                <el-input v-model="searchData.title" placeholder="评审标题"></el-input>
                <el-select v-model="searchData.type" clearable placeholder="请选择评审类型" style="width: 150px;margin-right: 15px;">
                    <el-option v-for="index in typeList" :label="typeList[index]" :value="index"></el-option>
                </el-select>
                <el-input v-model="searchData.projectUserName" placeholder="发布者"></el-input>
                <el-input v-model="searchData.submitterName" placeholder="提交人"></el-input>
                <el-date-picker v-model="searchData.submitTimeStart" type="date" style="width: 150px;" placeholder="提交开始时间"
                                value-format="yyyy-MM-dd" :picker-options="startDatePicker"></el-date-picker>
                <span style="margin-right: 15px;">到</span>
                <el-date-picker v-model="searchData.submitTimeEnd" type="date" style="width: 150px;" placeholder="提交结束时间"
                                value-format="yyyy-MM-dd" :picker-options="endDatePicker"></el-date-picker>
                <el-button type="primary" @click="searchList">搜索</el-button>
            </div>
        </div>
        <el-table v-loading="loading" :data="tableData" style="margin:20px auto;width:2000px;" :header-cell-style="rowClass" >
            <el-table-column label="操作" align="center" width="230px">
                <template slot-scope="scope">
                    <el-button @click="handleClickDetail(scope.row.reviewId )" type="text" size="medium">
                        <i class="el-icon-search"></i>查看详情
                    </el-button>
                    <el-button @click="inviteExpert(scope.row.id,scope.row.reviewId)" type="text" size="medium">
                        <i class="el-icon-document"></i>邀请评审专家
                    </el-button>
                    <el-button @click="handleClickDecisionAndOpinion(scope.row)" type="text" size="medium" v-if="intStatus===3">
                        <i class="el-icon-refresh"></i>查看意见与决定
                    </el-button>
                    <el-button @click="handleClickDecisionAndOpinion(scope.row)" type="text" size="medium" v-else>
                        <i class="el-icon-refresh"></i>意见与决定
                    </el-button>
                    <el-button @click="handleClickSendEmail(scope.row.id)" type="text" size="medium">
                        <i class="el-icon-message"></i>发送邮件
                    </el-button>
                    <el-button @click="" type="text" size="medium">
                        <i class="el-icon-search"></i>引擎标题学术搜索
                    </el-button>
                    <el-button @click="" type="text" size="medium">
                        <i class="el-icon-search"></i>引擎作者学术搜索
                    </el-button>
                    <el-button @click="" type="text" size="medium">
                        <i class="el-icon-circle-check"></i>相似度检查
                    </el-button>

                </template>
            </el-table-column>
            <el-table-column prop="title" label="评审标题" align="center">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.title">
                        <span class="tablehidden">{{ scope.row.title  }}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="type" label="评审类型" align="center" width="100px">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.type+''"><!--content的类型必须是String-->
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
            <el-table-column prop="projectUserName" label="发布者" align="center">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.projectUserName" placement="top-start">
                        <span class="tablehidden">{{ scope.row.projectUserName }}</span>
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
            <el-table-column prop="statusExplain" label="专家评审状态" align="center" width="130px;">
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
                    <el-button v-if="scope.row.status===2||scope.row.status===3"
                               @click="viewExpertReview(scope.row.id)"
                               type="text" size="medium">查看详情
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column prop="opinion" label="管理员意见" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.opinion===null">未提出意见</span>
                    <span v-if="scope.row.opinion===1">接受</span>
                    <span v-if="scope.row.opinion===2">需要修改</span>
                    <span v-if="scope.row.opinion===3">拒绝</span>
                    <span v-if="scope.row.opinion===4">没有意见 </span>
                </template>
            </el-table-column>
        </el-table>

        <!--查看第三方评审意见-->
        <el-dialog title="第三方评审意见" :visible.sync="expertReviewDialogVisible" width="80%" :before-close="closeExpertReviewDialog">
            <view-expert-review-list :userList="userList" :userListLoading="userListLoading"></view-expert-review-list>
        </el-dialog>
        <!--查看详情-->
        <editor-view-detail :form="reviewDetail" :dialogFormVisible="reviewDetailDialogVisible"
                            @closeDialog="closeReviewDetailDialog">
        </editor-view-detail>
        <div class="bid_footer">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="pageData.pageNo" :total="totalPage"
                           layout="prev, pager, next, jumper">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import {httpGet,} from "@/utils/http.js";
    import {message, errTips} from "@/utils/tips.js";
    import editorViewDetail from '@/view/review/editor/components/editorViewDetail'
    import {specificDate} from '@/utils/getDate.js';
    import timeLimit from "@/mixins/regular/timeLimitForReview.js";
    import viewExpertReviewList from "@/view/review/editor/components/viewExpertReviewList";

    export default {
        name:"editorReviewList",
        mixins: [timeLimit],
        props: {
            status: {//状态1待处理2评审中3完成4中止
                type: [Number, String],
                default: null,
            },
            expertAccomplishCount: {//评审专家完成人数(0/1/2/3)
                type: [Number, String],
                default: null,
            },
            statusExplain: {//评审状态（评审中）1评审专家完成评审2需要额外评审专家3评审延期4评审邀请未回复
                type: [Number, String],
                default: null,
            }
        },
        components: {
            editorViewDetail,
            viewExpertReviewList
        },
        data() {
            return {
                /*查看第三方评审对话框*/
                opinion: null,                      //管理员决定
                userList: [],                       //评审专家的信息
                userListLoading:false,              //列表的加载提示
                expertReviewDialogVisible: false,   //控制查看详情的对话框

                searchData: this.getInitialPageOrSearchData(),  //搜索栏的初始化数据
                pageData: this.getInitialPageOrSearchData(),    //当前页的初始化数据
                typeList: [],                                   //搜索栏中的评审类型下拉框的数据来源
                loading: false,                                 //控制评审任务列表加载前的转圈提示
                tableData: [],                                  //存储评审任务列表
                totalPage: 0,

                intStatus:null,                 //整型的status,原生的status可能因为使用浏览器刷新的原因变成字符串类型
                intStatusExplain:null,          //整型的statusExplain,原生的statusExplain可能因为使用浏览器刷新的原因变成字符串类型
                /*查看详情*/
                reviewDetailDialogVisible: false,   //控制查看详情对话框是否显示
                reviewDetail: {},                   //查看评审详情时存储数据的框
                allReviewProcessList: {},           //以评审的id为键，评审的processName为值存储所有评审流程的,查看详情会用到此属性
            };
        },
        created: function () {
            this.getTypeList();
            this.getView();
            this.getAllReviewProcessList();

            this.intStatus = parseInt(this.status);
            this.intStatusExplain = parseInt(this.statusExplain);
        },
        computed: {
            reviewTypes: function () {
                if (this.intStatus === 1) {                 //对应等待管理员分配专家的新任务
                    return "新任务";
                } else if (this.intStatus=== 2) {           //评审中的新任务
                    switch ( this.intStatusExplain) {
                        case 1: return "评审专家完成评审";
                        case 2: return "需要额外评审专家";
                        case 3: return "评审延期";
                        case 4: return "评审邀请未回复";
                        default: return "评审中";
                    }
                } else if ( this.intStatus === 3 ) {
                    return "评审完成";
                }
                if (this.expertAccomplishCount !== null) {   //评审统计中的新任务
                    return this.expertAccomplishCount + "位专家已完成评审";
                }
            }
        },
        methods: {
            /**获取评审任务列表*/
            getView(val = this.pageData) {
                this.loading = true;
                console.log("val",val);
                httpGet("/v1/authorization/review/admin/search", val).then(results => {
                    const {httpCode, msg, data} = results.data;
                    console.log(" results.data", results.data);
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
                        console.log("tableData:", this.tableData);
                    } else if (msg == "该条件暂无数据") {
                        this.tableData = [];
                        message("该条件暂无数据");
                    } else {
                        this.tableData = [];
                        errTips(msg);
                    }
                    this.loading = false;
                });
            },

            /**搜索栏和当前页数据的初始化*/
            getInitialPageOrSearchData() {
                return {
                    pageNo: 1,
                    pageSize: 10,
                    orderBy: "gmtModified",
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

            /**查看第三方专家的评审列表*/
            viewExpertReview(val) {
                this.expertReviewDialogVisible = true;
                this.userListLoading = true;
                httpGet("/v1/authorization/review/expertinviterecord/list", {id: val}).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode == 200){
                        this.opinion = data.opinion;
                        let userList = data.userList;
                        for (let i of userList){
                            i.gmtCreate = specificDate(i.gmtCreate);
                        }
                        this.userList = userList;
                    } else {
                        this.userList = [];
                        errTips(msg);
                    }
                    this.userListLoading = false;
                });

            },

            /**关闭第三方专家的评审列表*/
            closeExpertReviewDialog() {
                this.expertReviewDialogVisible = false;
            },

            /**邀请专家*/
            inviteExpert(val, reviewId) {
                this.$router.push({path: '/inviteExpert', query: {id: val, reviewId: reviewId}});

            },

            /**搜索列表*/
            searchList() {
                if(this.searchData.type===""){//搜索条件中的评审类型删除后为"",后台搜索采取的是精确搜索,搜索结果返回为空
                    this.searchData.type = null;
                }
                console.log("this.searchData", this.searchData);
                this.getView(this.searchData);
            },

            /**当前管理员所处理的项目的评审流程*/
            getTypeList() {
                httpGet("/v1/authorization/review/type/get").then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode == 200) {
                        this.typeList = data.typeList;
                    } else {
                        this.typeList = [];
                        errTips(msg);
                    }
                });
            },

            /**获取所有评审流程的信息，查看详情时，需要这用到这里的评审流程信息*/
            getAllReviewProcessList() {
                httpGet("/v1/public/bid/process/list").then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode == 200) {
                        for (let i of data.reviewProcessList) {
                            this.allReviewProcessList[i.id] = i.processName;
                        }
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                });
            },

            /**跳转到(查看)意见与决定的页面*/
            handleClickDecisionAndOpinion(row) {
                let identification = row.identification;
                if(this.intStatus===3){//当前任务已完成
                    identification = 3
                }
                this.$router.push({
                    name: 'editorOpinionAndDecision',
                    params: {id: row.id, identification: identification}
                });
            },
            /**发送邮件：跳转到对应页面*/
            handleClickSendEmail(val) {
                //alert("id:",val);
                console.log(val);
                this.$router.push({path: '/sendEmail', query: {id: val}});
                //this.$router.push({name:'sendEmail',params:{id:val}});
            },

            handleCurrentChange(val) {
                this.pageData.pageNo = val;
                this.getView();
            },

            /**查看评审任务详情*/
            handleClickDetail(id) {
                console.log(id);
                this.reviewDetailDialogVisible = true;
                httpGet("/v1/authorization/review/review/get", {id: id}).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode == 200) {
                        data.gmtCreate = specificDate(data.gmtCreate);
                        data.gmtModified = specificDate(data.gmtModified);
                        data.type = this.allReviewProcessList[data.type];
                        for (let item of data.resourceList) {
                            item.gmtCreate = specificDate(item.gmtCreate);
                        }
                        this.reviewDetail = data;

                    } else {

                        errTips(msg);
                    }
                });
            },

            /**关闭查看详情对话框*/
            closeReviewDetailDialog() {
                this.reviewDetailDialogVisible = false;
            },

            rowClass() {
                return "background:#F4F6F9;";
            }

        }
    };
</script>

<style lang="scss" scoped>
    @import "@/assets/scss/myTable.scss";
    .bid_footer{
        text-align: center;
    }
</style>
