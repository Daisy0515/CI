<template>
    <!-- <h1>publisherdraft</h1> -->
    <div>
        <div style="padding-left: 10px;">
            <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 130%;">
                <el-breadcrumb-item :to="{ path: '/managerIndex' }">项目经理</el-breadcrumb-item>
                <el-breadcrumb-item>草稿箱</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-table v-loading="loading" :data="tableData" style="width:1000px;margin:20px auto"
                  :header-cell-style="rowClass">
            <el-table-column prop="projectCode" label="项目编号" align="center">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.projectCode" placement="top-start">
                        <span class="tablehidden">{{ scope.row.projectCode }}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="projectName" label="项目名称" align="center">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.projectName">
                        <span class="tablehidden">{{ scope.row.projectName }}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="title" label="评审标题" align="center">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.title ">
                        <span class="tablehidden">{{ scope.row.title  }}</span>
                    </el-tooltip>
                </template>
            </el-table-column>

            <el-table-column prop="gmtCreate" label="创建时间" align="center">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.phases ">
                        <span class="tablehidden">{{ scope.row.gmtCreate  }}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" type="text" size="medium">
                        <i class="el-icon-edit"></i>
                        编辑
                    </el-button>
                    <el-button @click="deleteDraft(scope.row.id)" type="text" size="medium">
                        <i class="el-icon-delete"></i>
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="bid_footer">
            <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page.sync="pageData.pageNo"
                    :total="totalPage"
                    layout="prev, pager, next, jumper"
            ></el-pagination>
        </div>
        <submit-review :form="ruleForm" :formLabelWidth="formLabelWidth" :title="submitTitle"
                       :dialogSubmitVisible="dialogSubmitVisible"
                       :isShowSubmitHistory="isShowSubmitHistory"
                       :loading="dialogLoading"
                       :projectList="projectList"
                       :reviewProcessList="reviewProcessList"
                       @closeSubmitDialog="closeSubmitDialog"></submit-review>
    </div>
</template>

<script>
    import {httpGet, httpDelete} from '@/utils/http.js';
    import {specificDate} from '@/utils/getDate.js';
    import {message, successTips, errTips} from '@/utils/tips.js';
    import sourceUpload from '@/common/upload/resourceUpload';
    import submitReview from '@/view/review/components/submitReview';
    import { MessageBox } from "element-ui";
    export default {
        components: {
            sourceUpload,
            submitReview
        },

        data() {
            return {
                submitTitle: "编辑评审",
                loading: false,
                dialogSubmitVisible: false,
                dialogLoading: false,
                isShowSubmitHistory: true,
                tableData: [],
                projectList: [],//当前用户所竞标的项目列表，发起评审时，用于项目选择
                reviewProcessList: [],//当前用户所评审项目的流程
                ruleForm: {
                    content: "",
                    deadline: "",
                    gmtCreate: "",
                    id: null,
                    projectCode: "",
                    projectId: null,
                    projectName: "",
                    purpose: "",
                    resourceList: [],
                    result: null,
                    title: "",
                    type: null,
                    warn: null
                },
                formLabelWidth: '100px',//控制表单中输入框的尺寸
                pageData: {
                    pageNo: 1,
                    pageSize: 10,
                    orderBy: "id",
                    orderType: "DESC"
                },
                totalPage: 0,
            };
        },
        created: function () {
            this.getView();
            this.getUserProjectList();
        },
        computed: {},
        methods: {
            //获取页面数据
            getView(val = this.pageData) {
                this.loading = true;
                httpGet("/v1/authorization/review/draft/search", val).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode == 200) {
                        this.pageNo = data.pageNo;
                        this.totalPage = parseInt(data.totalPage + "0");
                        for(let i of data.reviewDraftList){
                            i.gmtCreate = specificDate(i.gmtCreate);
                            i.deadline = specificDate(i.deadline);
                        }
                        this.tableData = data.reviewDraftList;
                        console.log("tableData:",this.tableData);
                        Object.assign(this.pageData, val);
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
            getUserProjectList() { //获取当前用户参与的项目
                httpGet("/v1/authorization/mission/projectid/get").then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode == 200) {
                        this.projectList = data.projectList;
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }

                });
            },
            getReviewProcessList(projectId) {
                /***获取用户当前项目的所有评审流程***/
                httpGet("/v1/authorization/review/process/list", {id: projectId}).then(results => {
                    const {httpCode, msg, data} = results.data;
                    // console.log(data);
                    if (httpCode == 200) {
                        if (data.processList.length == 0) { //没有评审流程
                            this.reviewProcessList = [{id: '-1', processName: "当前项目没有评审流程"}]
                        } else {
                            this.reviewProcessList = data.processList;
                        }
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }

                });
            },
            handleClick(row) {
                // get /v1/authorization/review/draft/get
                this.dialogSubmitVisible = true;
                this.dialogLoading = true;
                console.log("handleClick输出的row:", row);
                this.getReviewProcessList(row.projectId);
                httpGet("/v1/authorization/review/draft/get", {id: row.id}).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode == 200) {
                        console.log("data:", data);
                        data.deadline = specificDate(data.deadline);
                        data.gmtCreate = specificDate(data.gmtCreate);
                        for (let i of data.resourceList) {
                            i.gmtCreate = specificDate(i.gmtCreate);
                        }
                        this.ruleForm = data;
                    } else {
                        errTips(msg);
                        this.ruleForm = {};
                    }
                    this.dialogLoading = false;
                });
            },
            deleteDraft(val) {
                MessageBox.confirm("此操作将删除评审草稿, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    httpDelete(
                        `/v1/authorization/review/draft/delete/${val}`
                    ).then(results => {
                        const {msg, httpCode} = results.data;
                        if (httpCode === 200) {
                            this.getView();
                            successTips('删除成功');
                        } else if (httpCode === 400) {
                            errTips("页面丟失");
                            this.setCache("draft");
                        } else if (httpCode != 500 && httpCode != 401) {
                            errTips(msg);
                        }
                        this.dialogLoading = false;
                    });
                })

            },
            closeSubmitDialog(params={}) {
                this.dialogSubmitVisible = false;
                if(params.isSubmit!==null && params.isSubmit===true){ //在评审草稿中发起评审,发起成功之后要删除原先的评审草稿
                    this.dialogLoading = true;
                    httpDelete(
                        `/v1/authorization/review/draft/delete/${params.id}`
                    ).then(results => {
                        const {msg, httpCode} = results.data;
                        if (httpCode === 200) {
                            this.getView();
                        } else if (httpCode === 400) {
                            errTips("页面丟失");
                        } else if (httpCode != 500 && httpCode != 401) {
                            errTips(msg);
                        }
                    });
                }
            },
            rowClass() {
                return 'background:#F4F6F9;';
            }
        }
    };
</script>

<style>
    /* @import '/src/assets/scss/myTable.scss'; */
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
