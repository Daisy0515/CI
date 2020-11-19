<!--评审任务搜索-->
<template>
    <div class="myTable">

        <div style="padding-left: 10px;">
            <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 130%;">
                <el-breadcrumb-item :to="{ path: '/editorIndex' }">首页</el-breadcrumb-item>

                <el-breadcrumb-item>评审任务搜索</el-breadcrumb-item>

            </el-breadcrumb>
        </div>
        <div class="header_top">
            <el-input v-model="searchData.title" placeholder="评审标题"></el-input>
            <el-select v-model="searchData.type" clearable placeholder="请选择评审类型">
                <el-option v-for="index in typeList" :label="typeList[index]" :value="index"></el-option>
            </el-select>
            <el-input v-model="searchData.projectUserName" placeholder="发布者"></el-input>
            <el-input v-model="searchData.submitterName" placeholder="提交人"></el-input>
            <el-date-picker v-model="searchData.submitTimeStart" type="date" style="width: 150px;" placeholder="提交时间"
                            value-format="yyyy-MM-dd"
            ></el-date-picker>
            <span style="margin-right: 15px;">到</span>
            <el-date-picker style="width: 150px;" v-model="searchData.submitTimeEnd" type="date"
                            placeholder="提交时间" value-format="yyyy-MM-dd"></el-date-picker>
            <el-button type="primary" @click="searchList()">搜索</el-button>

        </div>

        <el-table v-loading="loading" :data="tableData" style="margin:20px auto; " :header-cell-style="rowClass">
            <el-table-column label="操作" align="center" width="280px">
                <template slot-scope="scope">
                    <el-button @click="handleClickDetail(scope.row.reviewId )" type="text" size="medium"><i
                            class="el-icon-search"></i>查看详情
                    </el-button>
                    <el-button @click="inviteExpert(scope.row.id,scope.row.reviewId)" type="text" size="medium"><i
                            class="el-icon-document"></i>邀请评审专家
                    </el-button>
                    <el-button @click="handleClickDecisionAndOpinion(scope.row)" type="text" size="medium"><i
                            class="el-icon-refresh"></i>意见与决定
                    </el-button>
                    <el-button @click="handleClickSendEmail(scope.row.id)" type="text" size="medium"><i
                            class="el-icon-message"></i>发送邮件
                    </el-button>
                    <el-button @click="handleClickSubmit(scope.row)" type="text" size="medium"><i
                            class="el-icon-search"></i>引擎标题学术搜索
                    </el-button>
                    <el-button @click="handleClickSubmit(scope.row)" type="text" size="medium"><i
                            class="el-icon-search"></i>引擎作者学术搜索
                    </el-button>
                    <el-button @click="handleClickSubmit(scope.row)" type="text" size="medium"><i
                            class="el-icon-circle-check"></i>相似度检查
                    </el-button>

                </template>
            </el-table-column>
            <el-table-column prop="title" label="评审标题" align="center">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="scope.row.title">
                        <span class="tablehidden">{{ scope.row.title  }}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="type" label="评审类型" align="center">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="scope.row.type">
                        <span class="tablehidden">{{ scope.row.type  }}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="id" label="评审编号" align="center">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="scope.row.id">
                        <span class="tablehidden">{{ scope.row.id  }}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="submitterName" label="提交人" align="center">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="scope.row.submitterName" placement="top-start">
                        <span class="tablehidden">{{ scope.row.submitterName }}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="projectUserName" label="发布者" align="center">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="scope.row.projectUserName " placement="top-start">
                        <span class="tablehidden">{{ scope.row.projectUserName  }}</span>
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
            <el-table-column prop="statusExplain" label="评审状态" align="center">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="scope.row.statusExplain">
                        <span class="tablehidden" v-show="id==0">{{ scope.row.statusExplain }}</span>
                    </el-tooltip>
                    <el-button v-show="id!=0" @click="viewReviewDetail(scope.row.id)" type="text" size="medium">查看详情
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
        <!--查看第三方评审意见-->
        <el-dialog title="第三方评审意见" :visible.sync="dialogChooseVisible" width="80%"
                   :before-close="closeExpertReviewDialog">
            <view-expert-review-list :userList="userList"></view-expert-review-list>
        </el-dialog>

        <editor-view-detail :form="reviewDetail" :dialogFormVisible="dialogFormVisible"
                            @closeDialog="closeDialog"></editor-view-detail>
        <div class="bid_footer">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="pageData.pageNo" :total="totalPage"
                           layout="prev, pager, next, jumper"></el-pagination>
        </div>
    </div>

</template>

<script>
    import {httpGet, httpDelete} from "@/utils/http.js";
    import {message, successTips, errTips} from "@/utils/tips.js";
    import editorViewDetail from '@/view/review/editor/components/editorViewDetail';
    import {specificDate} from '@/utils/getDate.js';
    import viewExpertReviewList from "@/view/review/editor/components/viewExpertReviewList";

    export default {
        name: "submissionSearch",
        components: {
            editorViewDetail,
            viewExpertReviewList
        },
        data() {
            return {
                opinion: "",
                userList: [],
                dialogChooseVisible: false,
                searchData: this.getInitialPageOrSearchData(),
                id: "",
                submitTitle: '修改提交',
                isShowSubmitHistory: true, //在修改提交评审的表单里是否显示提交历史
                dialogFormVisible: false, //控制表单对话框是否显示
                loading: false,
                tableData: [],
                pageData: this.getInitialPageOrSearchData(),
                typeList: [],//搜索栏中的评审类型下拉框的数据来源
                totalPage: 0,
                reviewDetail: {},//查看评审详情时存储数据的框
                allReviewProcessList: {},//以评审的id为键，评审的processName为值存储所有评审流程的
            };
        },
        created: function () {
            this.id = this.$route.query.id;
            this.pageData.expertAccomplishCount = this.id;
            this.getView();
            this.getTypeList();
        },
        computed: {},
        methods: {
            /**获取评审任务*/
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
            viewReviewDetail(val) {
                httpGet("/v1/authorization/review/expertinviterecord/list", {id: val}).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode == 200) {
                        this.opinion = data.opinion;
                        let userList = data.userList;
                        for (let i of userList) {
                            i.gmtCreate = specificDate(i.gmtCreate);
                        }
                        this.userList = userList;
                    } else {
                        this.userList = [];
                        errTips(msg);
                    }
                });
                this.dialogChooseVisible = true;
            },

            inviteExpert(val, reviewId) {
                this.$router.push({path: '/inviteExpert', query: {id: val, reviewId: reviewId}});

            },
            /**搜索列表*/
            searchList() {
                console.log("this.searchData", this.searchData);
                if (this.searchData.type === "") {
                    this.searchData.type = null;
                }
                this.getView(this.searchData);
            },
            /**当前评审类型*/
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
            /**获取所有评审流程的信息*/
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
            /**跳转到意见与决定的页面*/
            handleClickDecisionAndOpinion(row) {
                this.$router.push({
                    name: 'editorOpinionAndDecision',
                    params: {id: row.id, identification: row.identification}
                })
            },
            handleClickSendEmail(val) {
                //alert("id:",val);
                console.log(val);
                this.$router.push({path: '/sendEmail', query: {id: val}});
                //this.$router.push({name:'sendEmail',params:{id:val}});
            },
            /**关闭第三方专家的评审列表*/
            closeExpertReviewDialog() {
                this.dialogChooseVisible = false;
            },
            handleCurrentChange(val) {
                this.pageData.pageNo = val;
                this.getView();
            },
            handleClickDetail(id) {
                console.log(id);
                this.dialogFormVisible = true;
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

            closeDialog() {
                this.dialogFormVisible = false;
            },

            rowClass() {
                return "background:#F4F6F9;";
            }
        }
    };
</script>

<style lang="scss">
    @import "@/assets/scss/myTable.scss";
</style>
