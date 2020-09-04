<!--功能：项目发布者的评审任务列表组件
    调用页面：项目发布者所包含的页面中涉及评审任务列表的均调用此组件
-->
<template>
    <div>
        <div style="padding-left: 10px;">
            <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 130%;">
                <el-breadcrumb-item :to="{ path: '/publisherIndex' }">项目发布者</el-breadcrumb-item>
                <el-breadcrumb-item>{{pageName}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="myTable">
            <div class="header_top">
                <el-select v-model="searchData.projectId" clearable placeholder="请选择项目" @change="projectChange">
                    <el-option
                            v-for="project in projectList"
                            :key="project.projectId"
                            :label="project.projectName"
                            :value="project.projectId"
                    />
                </el-select>
                <el-select v-model="searchData.type" clearable placeholder="请选择评审类型" :loading="processLoading"
                           @focus="getReviewProcessList(searchData.projectId)">
                    <el-option
                            v-for="process in reviewProcessList"
                            :key="process.id"
                            :label="process.processName"
                            :value="process.id"
                    />
                </el-select>
                <el-input v-model="searchData.title" placeholder="请输入评审标题"></el-input>
                <el-input v-model="searchData.submitName" placeholder="请输入提交人"></el-input>
                <el-date-picker
                        v-model="searchData.gmtCreateStart"
                        :picker-options="startDatePicker"
                        type="date"
                        placeholder="创建开始时间"
                        value-format="yyyy-MM-dd"
                ></el-date-picker>
                <span style="margin-right:15px">到</span>
                <el-date-picker
                        v-model="searchData.gmtCreateEnd"
                        :picker-options="endDatePicker"
                        type="date"
                        placeholder="创建结束时间"
                        value-format="yyyy-MM-dd"
                ></el-date-picker>
                <el-button type="primary" @click="searchList()">搜索</el-button>
            </div>
            <el-table v-loading="loading" :data="tableData" style="width:1000px;margin:20px auto"
                      :header-cell-style="rowClass">
                <el-table-column fixed prop="projectCode" label="项目编号" align="center">
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
                <el-table-column prop="type" label="评审类型" align="center">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" :content="scope.row.type">
                            <span class="tablehidden">{{ scope.row.type }}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="评审标题" align="center">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" :content="scope.row.title">
                            <span class="tablehidden">{{ scope.row.title }}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="submitName" label="提交人" align="center">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" :content="scope.row.submitName">
                            <span class="tablehidden">{{ scope.row.submitName }}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="gmtCreate" label="开始时间" align="center"></el-table-column>
                <el-table-column prop="deadline" label="截止时间" align="center"></el-table-column>
                <el-table-column prop="gmtModified" label="更新时间" align="center"></el-table-column>
                <el-table-column prop="status" label="评审状态" align="center" v-if="timeStatus===1||timeStatus===2">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status===1">未接受</span>
                        <span v-if="scope.row.status===2">评审中</span>
                        <span v-if="scope.row.status===3">打回中</span>
                    </template>
                </el-table-column>
                <el-table-column prop="accomplishProgress" label="操作" align="center" width="280px">
                    <template slot-scope="scope">
                        <el-button @click="handleClickDetail(scope.row.id)" type="text" size="medium"
                        ><i class="el-icon-search"></i>查看详情
                        </el-button>
                        <el-button @click="handleRollBack(scope.row.id)" type="text" size="medium" v-if="status===1||scope.row.status===1"
                        ><i class="el-icon-close"></i>打回
                        </el-button>
                        <el-button @click="handleClickOpinion(scope.row.id)" type="text" size="medium" v-if="status===3||scope.row.status===3"
                        ><i class="el-icon-document"></i>意见回复
                        </el-button>
                        <el-button @click="handleClickOpinion(scope.row.id)" type="text" size="medium" v-if="status===2||scope.row.status===2"
                                   style="margin-right: 10px"
                        ><i class="el-icon-document"></i>意见
                        </el-button>
                        <el-button @click="handleAccept(scope.row.id)" type="text" size="medium"
                                   v-if="status===1||status===3||scope.row.status===1||scope.row.status===3"
                        ><i class="el-icon-check"></i>接受
                        </el-button>
                        <el-button @click="handleClickEvaluate(scope.row.id,scope.row.title)" type="text" size="medium" v-if="status===2||scope.row.status===2"
                                   style="margin-right: 10px"><i class="el-icon-edit"></i>评价
                        </el-button>
                        <el-button @click="handleEvaluateDetail(scope.row.id)" type="text" size="medium"
                                   v-if="status===4||scope.row.status===4"
                        ><i class="el-icon-search"></i>查看评价
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <review-detail-dialog :form="formReviewDetail" :formLabelWidth="formLabelWidth"
                              :dialogFormVisible="dialogFormVisible"
                              :loading="formReviewDetailLoading"
                              @closeDialog="closeDialog"></review-detail-dialog>
        <publisher-review-opinion :form="formOpinion" :dialogOpinionVisible="dialogOpinionVisible"
                                  @closeOpinionDialog="closeOpinionDialog">
        </publisher-review-opinion>

        <review-evaluation :form="formEvaluationDetail" :formLabelWidth="formLabelWidth"
                           :dialogEvaluationVisible="dialogEvaluationDetailVisible"
                           :loading="evaluateDetailLoading"
                           @closeEvaluationDialog="closeEvaluationDetailDialog"></review-evaluation>
        <el-dialog title="打回评审" :visible.sync="dialogRollbackVisible"  style="text-align:left; font-weight: bolder;">
            <el-form :model="form">
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="添加意见" :label-width="formLabelWidth">
                            <el-input
                                    v-model="form.details"
                                    type="textarea"
                                    :rows="3"
                                    placeholder="请输入内容"
                            />
                        </el-form-item>
                        <el-form-item label="截止时间" prop="deadline" :label-width="formLabelWidth">
                            <el-date-picker
                                    v-model="form.deadline"
                                    :picker-options="endDatePicker"
                                    type="date"
                                    placeholder="截止时间"
                                    value-format="yyyy-MM-dd"
                            ></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" style="margin-right: 35%">
                <el-button @click="dialogRollbackVisible=false" style="margin-right: 10%">取 消</el-button>
                <el-button type="primary" @click="submitRollback" v-prevent-click>确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="tips:提交评价，代表本次评审结束，感谢您的评审" :visible.sync="dialogEvaluateVisible"
                   style="width:100%;text-align:left; font-weight: bolder;" center :before-close="closeEvaluateDialog">
            <el-form :model="evaluateForm" :rules="rulesEvaluateForm" ref="evaluateForm">
                <el-row :gutter="20">
                    <el-col :span="10">
                        <el-form-item label="评审标题" :label-width="formLabelWidth">
                            <el-input v-model="evaluateTitle" :disabled="true" auto-complete="off"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="是否通过" :label-width="formLabelWidth" prop="result">
                            <el-radio-group v-model="evaluateForm.result">
                                <el-radio  :label="true">通过</el-radio>
                                <el-radio  :label="false">未通过</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="10">
                        <el-form-item label="评审得分" :label-width="formLabelWidth" prop="score">
                            <el-input v-model.number="evaluateForm.score" auto-complete="off"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="评价内容" :label-width="formLabelWidth" prop="content">
                            <el-input
                                    v-model="evaluateForm.content"
                                    type="textarea"
                                    :rows="3"
                                    placeholder="请输入内容"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="" style="margin-right: 30px;">取 消</el-button>
                <el-button type="primary" @click="submitEvaluate('evaluateForm')" v-prevent-click>提交</el-button>
            </div>
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
    import {httpGet, httpDelete, httpPut, httpPost} from "@/utils/http.js";
    import {specificDate} from '@/utils/getDate.js';
    import {message, successTips, errTips,} from "@/utils/tips.js";
    import {MessageBox} from 'element-ui';
    import reviewDetailDialog from '@/view/review/components/reviewDetailDialog';
    import publisherReviewOpinion from '@/view/review/publisher/components/publisherReviewOpinion';
    import reviewEvaluation from '@/view/review/components/reviewEvaluation';
    import timeLimit from "@/mixins/regular/timeLimit.js";

    export default {
        props: {
            pageName: String,
            status: {//评审状态1未接受2评审中3打回中4已完成
                type:Number,
                default:null,
            },
            timeStatus:{//时间状态1即将超时2已经超时
                type:Number,
                default:null,
            },
        },
        mixins: [timeLimit],
        components: {
            reviewDetailDialog, publisherReviewOpinion,reviewEvaluation
        },
        data() {
            return {
                loading: false,//评审任务列表加载提示
                processLoading: false,//搜索框中点击类型下拉框时，加载的
                formReviewDetailLoading: false,//打开详情，加载转圈提示
                formOpinionLoading: false,//打开意见或者意见回复，加载转圈提示
                evaluateDetailLoading: false,//查看评审详情时的加载提示

                dialogFormVisible: false,//控制详情对话框是否可见
                dialogRollbackVisible: false,//控制打回对话框是否可见
                dialogOpinionVisible: false,//控制意见对话框是否可见
                dialogEvaluateVisible: false,//控制点击评价对话框是否可见
                dialogEvaluationDetailVisible: false,//控制评价详情对话框是否可见
                evaluateTitle: "",
                formLabelWidth: '100px',
                formReviewDetail: {},//用于存储评审打详情内容
                evaluateForm:this.getInitEvaluateForm() ,
                rulesEvaluateForm:{ //填写评价的表单验证
                    result:[{required: true, message: '请选择是否通过', trigger: 'change' }],
                    score: [{type: 'number',required: true,  message: '请输入分数', trigger: 'blur' }],
                    content:[{required: true, message: '请输入评价内容', trigger: 'blur' }],
                },
                form: {//表单中的信息，保存打回评审时填写的信息
                    details: "",
                    reviewInfoId: null,
                    deadline: "",
                },
                formEvaluationDetail: {},//产看评价详情显示的内容
                formOpinion: {},//打开评审意见窗口显示的内容
                tableData: [],
                projectList: [],//当前用户所竞标的项目列表，发起评审时，用于项目选择
                reviewProcessList: [],//当前用户选定评审项目后，该项目所拥有的评审流程
                searchData: {
                    pageNo: 1,
                    pageSize: 10,
                    orderBy: "gmtModified",
                    orderType: "DESC",
                    role: 1,  //用户的角色 1项目发布者 2项目经理 3评审专家 4评审管理员
                    status: this.status,//任务的评审状态 评审状态 1未接受 2评审中 3打回中 4已完成
                    timeStatus:null,//时间状态1即将超时2已经超时
                    projectId: null,//项目名称编号ID
                    type: null,//评审类型,
                    title: null,//评审标题
                    submitName: null,//提交人姓名
                    gmtCreateStart: null,//提交开始时间
                    gmtCreateEnd: null,//提交结束事件
                },
                pageData: {
                    pageNo: 1,
                    pageSize: 10,
                    orderBy: "gmtModified",
                    orderType: "DESC",
                    role: 1,//用户的角色 1项目发布者 2项目经理 3评审专家 4评审管理员
                    status: this.status,//任务的评审状态 评审状态 1未接受 2评审中 3打回中 4已完成
                    timeStatus:this.timeStatus,//时间状态1即将超时2已经超时
                    projectId: null,
                    type: null,//评审类型,
                    title: null,//评审标题
                    submitName: null,//提交人姓名
                    gmtCreateStart: null,//提交开始时间
                    gmtCreateEnd: null,//提交结束事件
                },
                allReviewProcessList: {},//以评审的id为键，评审的processName为值存储所有评审流程的
                totalPage: 0,

            };
        },
        created: function () {
            this.getAllReviewProcessList();
            this.getView();
            this.getUserProjectList();
        },
        computed: {},
        methods: {

            /**搜索栏：当项目发生变化时，旁边的评审流程也要及时变化*/
            projectChange() {
                this.reviewProcessList = [];
                this.searchData.type = null;
            },
            /**搜索栏：搜索*/
            searchList() {//点击搜索按钮触发的事件
                this.getView(this.searchData);
            },
            /**搜索栏：获取当前用户参与的项目*/
            getUserProjectList() {
                httpGet("/v1/authorization/mission/promulgator/get").then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode == 200) {
                        this.projectList = data.projectList;
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                });
            },
            /**搜索栏：获取用户当前项目的所有评审流程*/
            getReviewProcessList(projectId) {
                this.processLoading = true;
                console.log("projectId:", projectId);
                httpGet("/v1/authorization/review/process/list", {id: projectId}).then(results => {
                    const {httpCode, msg, data} = results.data;
                    console.log("data:", data);
                    if (httpCode == 200) {
                        if (data.processList.length === 0) { //没有评审流程
                            this.reviewProcessList = [{id: null, processName: "当前项目没有评审流程"}]
                        } else {
                            this.reviewProcessList = data.processList;
                        }
                    } else if (msg === "请求参数出错") {
                        message("请先选择项目！");
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                    this.processLoading = false;
                });
            },

            /**所有页面：获取所有整个系统所有的评审流程*/
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
            /**所有页面：获取评审列表*/
            getView(val = this.pageData) {
                this.loading = true;
                httpGet("/v1/authorization/review/review/search", val).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode == 200) {
                        this.pageNo = data.pageNo;
                        this.totalPage = parseInt(data.totalPage + '0');

                        let list = data.reviewInfoList;
                        for (let i of list) {
                            i.gmtCreate = specificDate(i.gmtCreate);
                            i.deadline = specificDate(i.deadline);
                            i.gmtModified = specificDate(i.gmtModified);
                            i.type = this.allReviewProcessList[i.type];//将评审类型由id转换为name
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
            /**所有页面：处理页面变化*/
            handleCurrentChange(val) {
                this.pageData.pageNo = val;
                this.getView();
            },
            /**所有页面：查看详情*/
            handleClickDetail(val) {//点击查看详情
                this.dialogFormVisible = true;
                this.formReviewDetailLoading = true;
                httpGet("/v1/authorization/review/review/get", {id: val}).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode == 200) {
                        data.deadline = specificDate(data.deadline);
                        data.gmtCreate = specificDate(data.gmtCreate);
                        for(let item of data.resourceList){
                            item.gmtCreate = specificDate(item.gmtCreate);
                        }
                        this.formReviewDetail = data;
                    } else if (msg == "该条件暂无数据") {
                        this.formReviewDetail = {};
                        message("该条件暂无数据");
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                    this.formReviewDetailLoading = false;
                });
            },

            /**未接受：打回*/
            handleRollBack(val) {//点击查看打回中
                this.dialogRollbackVisible = true;
                this.form.reviewInfoId = val;
            },
            /**未接受：提交打回内容*/
            submitRollback() {//提交打回信息
                httpPost('/v1/authorization/review/opinion/insert', this.form).then(results => {
                    const {msg, httpCode} = results.data;
                    if (httpCode === 200) {
                        successTips("已打回评审！");
                        this.form.details = "";
                        this.form.reviewInfoId = "";
                        this.form.deadline = "";
                        this.getView();
                        this.dialogRollbackVisible = false;
                    } else {
                        errTips(msg);
                    }
                })
            },
            /**未接受/打回中：接受*/
            handleAccept(val) {
                MessageBox.confirm("接受任务将进入评审中状态，是否接受？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    httpPut('/v1/authorization/review/status/update', {id: val}).then(results => {
                        const { msg, httpCode} = results.data;
                        if (httpCode === 200) {
                            successTips("已接受评审！");
                            this.getView();
                        } else {
                            errTips(msg);
                        }
                    });
                }) .catch(() => {});

            },
            /**未接受：意见回复 --- 评审中：意见*/
            handleClickOpinion(val) { //点击查看意见详情
                this.dialogOpinionVisible = true;
                this.formOpinionLoading = true;

                httpGet("/v1/authorization/review/opinion/list", {id: val}).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode == 200) {
                        this.formOpinion = data;
                        this.formOpinion.gmtCreate = specificDate(this.formOpinion.gmtCreate);
                        let list = data.reviewOpinionList;
                        console.log(list);
                        for (let i of list) {
                            i.submitTime = specificDate(i.submitTime);
                            i.deadline = specificDate(i.deadline);
                        }
                        this.formOpinion.reviewOpinionList = list;
                        console.log(123);
                    } else if (msg == "该条件暂无数据") {
                        this.formOpinion = {};
                        message("该条件暂无数据");
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                    this.formOpinionLoading = false;
                });
            },

            /**评审中：用于保存评价时填写的内容*/
            getInitEvaluateForm(){
                return {
                    content: null,
                    result: null,
                    reviewInfoId: null,
                    score: null,

                };
            },
            /**评审中：评价*/
            handleClickEvaluate(id, title) {
                this.dialogEvaluateVisible = true;
                this.evaluateForm = this.getInitEvaluateForm(); //清空之前填过的评价内容
                this.evaluateTitle = title;
                this.evaluateForm.reviewInfoId = id;
            },
            /**评审中：关闭评价框*/
            closeEvaluateDialog(){
                this.dialogEvaluateVisible = false
            },
            /**评审中页面：提交评价*/
            submitEvaluate(formName) {//提交评价
                this.$refs[formName].validate((valid)=>{
                    if (valid) {
                        httpPost('/v1/authorization/review/evaluate/insert', this.evaluateForm).then(results => {
                            const {msg, httpCode} = results.data;
                            if (httpCode === 200) {
                                successTips("评价结束");
                                this.getView();
                                this.evaluateTitle = null;
                                this.evaluateForm = this.getInitEvaluateForm();
                                this.$router.push('/publisherComplete');
                            } else {
                                errTips(msg);
                            }
                            this.dialogEvaluateVisible = false;
                        })
                    } else {  //表格验证不通过
                        return false;
                    }
                });
            },

            /**已完成：查看评价*/
            handleEvaluateDetail(val) {//查看评价内容
                this.dialogEvaluationDetailVisible = true;
                this.evaluateDetailLoading = true;
                httpGet("/v1/authorization/review/evaluate/get", {id: val}).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode == 200) {
                        data.gmtCreate = specificDate(data.gmtCreate);
                        this.formEvaluationDetail = data;
                        this.formEvaluationDetail.fileTable = [{
                            auditor: data.userName,
                            isPass: data.result,
                            score: data.score
                        }];

                    } else {
                        errTips(msg);
                    }
                    this.evaluateDetailLoading = false;
                });
            },

            closeDialog() {
                this.dialogFormVisible = false;
            },
            closeOpinionDialog() {
                this.dialogOpinionVisible = false;
            },
            closeEvaluationDetailDialog() {
                this.dialogEvaluationDetailVisible = false;
            },

            rowClass() {
                return "background:#F4F6F9;";
            }
        }
    };

</script>

<style lang="scss">
    @import "@/assets/scss/myTable.scss";

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

