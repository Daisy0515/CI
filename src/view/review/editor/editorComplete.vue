<template>
    <div style="margin-right: -10%">
        <!-- <h1>publishercomplete</h1> -->
        <div style="padding-left: 10px;">
            <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 130%;">
                <el-breadcrumb-item :to="{ path: '/editorIndex' }">评审管理员</el-breadcrumb-item>
                <el-breadcrumb-item>评审完成</el-breadcrumb-item>

            </el-breadcrumb>
        </div>
        <el-table v-loading="loading" :data="tableData" style="width:100%;margin:20px auto"
                  :header-cell-style="rowClass">
            <el-table-column label="操作" align="center" width="280px">
                <template slot-scope="scope">
                    <el-button @click="handleClickDetail(scope.row)" type="text" size="medium"
                    ><i class="el-icon-search"></i>查看详情
                    </el-button>
                    <el-button @click="handleClickOpinion(scope.row)" type="text" size="medium"
                    ><i class="el-icon-document"></i>邀请评审专家
                    </el-button>
                    <el-button @click="handleClickSubmit(scope.row)" type="text" size="medium"
                    ><i class="el-icon-refresh"></i>意见与决定
                    </el-button>
                    <el-button @click="handleClickSubmit(scope.row)" type="text" size="medium"
                    ><i class="el-icon-message"></i>发送邮件
                    </el-button>
                    <el-button @click="handleClickSubmit(scope.row)" type="text" size="medium"
                    ><i class="el-icon-search"></i>引擎标题学术搜索
                    </el-button>
                    <el-button @click="handleClickSubmit(scope.row)" type="text" size="medium"
                    ><i class="el-icon-search"></i>引擎作者学术搜索
                    </el-button>
                    <el-button @click="handleClickSubmit(scope.row)" type="text" size="medium"
                    ><i class="el-icon-circle-check"></i>相似度检查
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
            <el-table-column prop="type" label="评审类型" align="center">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.type">
                        <span class="tablehidden">{{ scope.row.type  }}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="reviewCode" label="评审编号" align="center">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.reviewCode">
                        <span class="tablehidden">{{ scope.row.reviewCode  }}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="submitPeople" label="提交人" align="center">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.submitPeople" placement="top-start">
                        <span class="tablehidden">{{ scope.row.submitPeople }}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="submitDate" label="提交时间" align="center"></el-table-column>
            <el-table-column prop="updateDate" label="更新时间" align="center"></el-table-column>

            <el-table-column prop="status" label="状态" align="center">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.status">
                        <span class="tablehidden">{{ scope.row.status }}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="reviewStatus" label="评审状态" align="center">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.reviewStatus">
                        <span class="tablehidden">{{ scope.row.reviewStatus }}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="editorOpinion" label="管理员意见" align="center" >
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.editorOpinion">
                        <span class="tablehidden">{{ scope.row.editorOpinion }}</span>
                    </el-tooltip>
                </template>
            </el-table-column>


        </el-table>
        <review-detail-dialog :form="form" :formLabelWidth="formLabelWidth"
                              :dialogFormVisible="dialogFormVisible"
                              @closeDialog="closeDialog"></review-detail-dialog>
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
    import {httpGet, httpDelete} from "@/utils/http.js";

    import {message, successTips, errTips} from "@/utils/tips.js";
    import reviewDetailDialog from '@/view/review/components/reviewDetailDialog';
    import submitReview from '@/view/review/components/submitReview';
    import reviewOpinion from '@/view/review/components/reviewOpinion'
    import {specificDate} from '@/utils/getDate.js';

    export default {
        components: {reviewDetailDialog, submitReview, reviewOpinion},
        data() {
            return {

                submitTitle: '修改提交',
                isShowSubmitHistory: true,//在修改提交评审的表单里是否显示提交历史
                dialogFormVisible: false,//控制表单对话框是否显示
                dialogSubmitVisible: false,//控制重新提交框是否显示
                dialogOpinionVisible: false,//控制意见详情框是否显示
                loading: false,
                tableData: [
                    {
                        title: "基于深度学习的机器翻译",
                        type: '开题检查',
                        reviewCode: 'ps000001',
                        submitPeople:'Yun Li',
                        submitDate:'2020-04-02',
                        updateDate:'2020-04-03',
                        reviewStatus:"3人已完成",
                        status:'已完成',
                        editorOpinion:'通过'
                    }
                ],
                pageData: {
                    pageNo: 1,
                    pageSize: 10,
                    orderBy: "id",
                    orderType: "DESC",
                    role: 2,
                    status: 2
                },
                totalPage: 0,
                form: {//表单中的信息
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

                formLabelWidth: '100px'//控制表单中输入框的尺寸
            };
        },
        created: function () {
            // this.getView();
        },
        computed: {},
        methods: {
            getView(val = this.pageData) {
                this.loading = true;

                //get /v1/authorization/review/review/search
                httpGet("/v1/authorization/review/review/search", val).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode == 200) {
                        this.pageNo = data.pageNo;
                        this.totalPage = parseInt(data.totalPage + '0');

                        let list = data.reviewInfoList;
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

<style>
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

