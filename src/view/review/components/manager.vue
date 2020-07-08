<template>
    <div>
        <div style="padding-left: 10px;">
            <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 130%;">
                <el-breadcrumb-item :to="{ path: '/managerIndex' }">项目经理</el-breadcrumb-item>
                <el-breadcrumb-item>{{pageName}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="myTable">
            <div class="header_top">
                <el-select v-model="searchData.projectId" placeholder="请选择项目" @change="projectChange">
                    <el-option
                            v-for="project in projectList"
                            :key="project.projectId"
                            :label="project.projectName"
                            :value="project.projectId"
                    />
                </el-select>
                <el-select v-model="searchData.type" placeholder="请选择评审类型" :loading="processLoading"
                           @focus="getReviewProcessList(searchData.projectId)">
                    <el-option
                            v-for="process in reviewProcessList"
                            :key="process.id"
                            :label="process.processName"
                            :value="process.id"
                    />
                </el-select>
                <el-input v-model="searchData.title" placeholder="请输入评审标题"></el-input>
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
                <el-table-column prop="gmtCreate" label="开始时间" align="center"></el-table-column>
                <el-table-column prop="deadline" label="截止时间" align="center"></el-table-column>
                <el-table-column prop="gmtModified" label="更新时间" align="center"></el-table-column>
                <el-table-column prop="result" label="结果" align="center" v-if="status===4">
                    <template slot-scope="scope">
                        <span v-if="scope.row.result==1">通过</span>
                        <span v-if="scope.row.result==0">未通过</span>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="评审状态" align="center" v-if="status===5||status===6">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status==1">未接受</span>
                        <span v-if="scope.row.status==2">评审中</span>
                        <span v-if="scope.row.status==3">打回中</span>
                    </template>
                </el-table-column>
                <el-table-column prop="accomplishProgress" label="操作" align="center" width="280px">
                    <template slot-scope="scope">
                        <el-button @click="handleDetail(scope.row)" type="text" size="medium"
                        ><i class="el-icon-search"></i>查看详情
                        </el-button>
                        <el-button @click="handleClickOpinion(scope.row)" type="text" size="medium" v-if="status===3||scope.row.status===3"
                        ><i class="el-icon-document"></i>查看意见
                        </el-button>
                        <el-button @click="handleClickSubmit(scope.row)" type="text" size="medium" v-if="status===3||scope.row.status===3"
                        ><i class="el-icon-refresh"></i>重新提交
                        </el-button>
                        <el-button @click="handleClickOpinion(scope.row)" type="text" size="medium" v-if="status===2||scope.row.status===2"
                        ><i class="el-icon-document"></i>意见回复
                        </el-button>
                        <el-button @click="handleClickSubmit(scope.row)" type="text" size="medium" v-if="status===2||scope.row.status===2"
                        ><i class="el-icon-refresh"></i>修改提交
                        </el-button>
                        <el-button @click="handleEvaluateDetail(scope.row)" type="text" size="medium" v-if="status===4"
                        ><i class="el-icon-search"></i>查看评价
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <review-detail-dialog :form="form" :formLabelWidth="formLabelWidth"
                              :dialogFormVisible="dialogFormVisible"
                              :loading="dialogLoading"
                              @closeDialog="closeDialog"
        ></review-detail-dialog>
        <review-opinion :form="formOpinion" :formLabelWidth="formLabelWidth"
                        :dialogOpinionVisible="dialogOpinionVisible"
                        :loading="dialogLoading"
                        @closeOpinionDialog="closeOpinionDialog"
                        @updateOpinion="updateOpinion"></review-opinion>
        <submit-review :form="formSubmit" :formLabelWidth="formLabelWidth" :title="submitTitle"
                       :isShowSubmitHistory="isShowSubmitHistory"
                       :dialogSubmitVisible="dialogSubmitVisible"
                       :loading="dialogLoading"
                       :projectList="projectList"
                       :reviewProcessList="reviewProcessList"
                       @closeSubmitDialog="closeSubmitDialog"
        ></submit-review>
        <review-evaluation :form="formEvaluation" :formLabelWidth="formLabelWidth"
                           :dialogEvaluationVisible="dialogEvaluationVisible"
                           :loading="dialogLoading"
                           @closeEvaluationDialog="closeEvaluationDialog"></review-evaluation>

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
    import {specificDate} from '@/utils/getDate.js';
    import {message, successTips, errTips} from "@/utils/tips.js";
    import reviewDetailDialog from '@/view/review/components/reviewDetailDialog';
    import submitReview from '@/view/review/components/submitReview';
    import reviewOpinion from '@/view/review/components/reviewOpinion';
    import reviewEvaluation from '@/view/review/components/reviewEvaluation'
    import timeLimit from "@/mixins/regular/timeLimit.js";
    export default {
        props:{
            pageName:String,//pageName当前页面名称
            status:Number,//staus当前用户的角色,
        },
        components: {reviewDetailDialog, submitReview, reviewOpinion,reviewEvaluation},
        mixins: [timeLimit],
        data() {
            return {
                dialogFormVisible: false,//控制查看详情框是否显示
                dialogSubmitVisible: false,//控制重新提交框是否显示
                dialogOpinionVisible: false,//控制意见详情框是否显示
                dialogEvaluationVisible: false,//控制评价详情框是否显示

                loading: false, //控制整体页面表格的加载提示
                processLoading:false,//搜索框中点击类型下拉框时，加载的
                dialogLoading: false,//控制弹窗的加载提示

                tableData: [],//存储当前页面的评审任务列表
                projectList: [],//当前用户所竞标的项目列表，发起评审时，用于项目选择
                reviewProcessList: [],//当前用户选定评审项目后，该项目所拥有的评审流程
                searchData: {
                    pageNo: 1,
                    pageSize: 10,
                    orderBy: "gmtModified",
                    orderType: "DESC",
                    role: 2,  //用户的角色 1项目发布者 2项目经理 3评审专家 4评审管理员
                    status: this.status,//任务的评审状态 评审状态 1未接受 2评审中 3打回中 4已完成 5即将超时 6已经超时
                    projectId: null,//项目名称编号ID
                    type: null,//评审类型,
                    title: null,//评审标题
                    gmtCreateStart: null,//提交开始时间
                    gmtCreateEnd: null,//提交结束时间
                },
                pageData: {
                    pageNo: 1,
                    pageSize: 10,
                    orderBy: "gmtModified",
                    orderType: "DESC",
                    role:2,
                    status: this.status,
                    projectId: null,
                    type: null,//评审类型,
                    title: null,//评审标题
                    gmtCreateStart: null,//提交开始时间
                    gmtCreateEnd: null,//提交结束时间
                },
                allReviewProcessList:{},//以评审的id为键，评审的processName为值存储所有评审流程的
                totalPage: 0,

                form: {},//存储评审详情的信息
                formSubmit:{},//存储提交弹框里的信息
                formOpinion:{},//存储意见弹框里的信息
                formEvaluation:{},//存储评价弹框里的信息
                isReadOnly: true,//用于控制提交表格里部分属性是否
                formLabelWidth: '100px' //弹框中各个form-item的长度
            };
        },
        created: function () {
            this.getAllReviewProcessList();
            this.getView();
            this.getUserProjectList();
        },
        computed: {
            submitTitle: function(){  //确定submit-review组件中的标题
                if (this.status === 2) {
                    return "修改提交";
                }
                if (this.status === 3) {
                    return "重新提交";
                }
            },
            isShowSubmitHistory:function(){ //确定submit-review组件中是否显示提交历史
                if (this.status === 1) { //除了未接受，其他的页面都需要显示提交历史
                    return false;
                }
                return true;
            }
        },
        methods: {
            projectChange() {//当项目发生变化时，旁边的评审流程也要及时变化
                this.reviewProcessList = [];
                this.searchData.type = null;
            },
            searchList() { //对应搜索栏的搜索按钮
                this.getView(this.searchData);
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
            getReviewProcessList(projectId) { /***获取用户当前项目的所有评审流程***/
                this.processLoading = true;
                httpGet("/v1/authorization/review/process/list", {id: projectId}).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode == 200) {
                        if (data.processList.length === 0) { //没有评审流程
                            this.reviewProcessList = [{id: null, processName: "当前项目没有评审流程"}]
                        } else {
                            this.reviewProcessList = data.processList;
                        }
                    } else if (msg === "请求参数出错") {
                        errTips("请先选择项目！");
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                    this.processLoading = false;
                });
            },
            getAllReviewProcessList(){ //获取整个系统中的所有评审与评审名字
                httpGet("/v1/public/bid/process/list").then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode == 200) {
                        for(let i of data.reviewProcessList){
                            this.allReviewProcessList[i.id] = i.processName;
                        }
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                });
            },
            getView(val = this.pageData) {  //获取当前页面的评审信息
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
                            i.gmtModified= specificDate(i.gmtModified);
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

            handleCurrentChange(val) { //对应分页栏的换页操作
                this.pageData.pageNo = val;
                this.getView();
            },
            handleDetail(row) {//row里面存储的是当前行的信息，获取详细评审任务的详细信息
                this.dialogFormVisible = true;
                this.dialogLoading = true;
                httpGet("/v1/authorization/review/review/get", {"id": row.id}).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode == 200) {
                        data.gmtCreate = specificDate(data.gmtCreate);
                        data.deadline = specificDate(data.deadline);
                        for (let i of data.resourceList) {
                            i.gmtCreate = specificDate(i.gmtCreate);
                        }
                        this.form = data;
                    } else if (msg == "该条件暂无数据") {
                        this.form ={};
                        message("该条件暂无数据");
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                    this.dialogLoading = false; // 这一句不能写在.then()之外，否则没有加载转圈的显示，写在.then之外会先于.then（）执行，这是异步请求
                });
            },
            handleClickOpinion(row) { //点击查看意见触发，加载意见详情数据
                this.dialogOpinionVisible = true;
                this.dialogLoading = true;
                httpGet("/v1/authorization/review/opinion/list", {"id": row.id}).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode == 200) {
                        data.gmtCreate = specificDate(data.gmtCreate);
                        for (let i of data.reviewOpinionList) {
                            i.submitTime = specificDate(i.submitTime);
                            i.deadline = specificDate(i.deadline);
                        }
                        this.formOpinion = data;
                    } else if (msg == "该条件暂无数据") {
                        this.formOpinion = {};
                        message("该条件暂无数据");
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                    this.dialogLoading = false;
                });
            },
            handleClickSubmit(row) { //点击查看“（重新，修改）提交”触发，加载评审详情数据
                this.dialogSubmitVisible = true;
                this.dialogLoading = true;
                this.getReviewProcessList(row.projectId);
                httpGet("/v1/authorization/review/review/get", {"id": row.id}).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode == 200) {
                        data.gmtCreate = specificDate(data.gmtCreate);
                        data.deadline = specificDate(data.deadline);
                        for (let i of data.resourceList) {
                            i.gmtCreate = specificDate(i.gmtCreate);
                        }
                        this.formSubmit = data;
                    } else if (msg == "该条件暂无数据") {
                        this.formSubmit = {};
                        message("该条件暂无数据");
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                    this.dialogLoading = false;
                });
            },
            handleEvaluateDetail(row) {
                this.dialogEvaluationVisible = true;
                this.dialogLoading = true;
                httpGet("/v1/authorization/review/evaluate/get", {"id": row.id}).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode == 200) {
                        data.gmtCreate = specificDate(data.gmtCreate);
                        let reviewRecord = {"userName": data.userName, "result": data.result, "score": data.score};
                        data.reviewRecord = [reviewRecord];
                        this.formEvaluation = data;

                    } else if (msg == "该条件暂无数据") {
                        this.formEvaluation = {};
                        message("该条件暂无数据");
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                    this.dialogLoading = false; // 这一句不能写在.then()之外，否则没有加载转圈的显示，写在.then之外会先于.then（）执行，这是异步请求
                });
            },

            closeDialog() {//关闭查看详情弹框，
                this.dialogFormVisible = false;
            },
            closeSubmitDialog(updateReviewList = false) {//关闭xx提交弹框，如果是重新提交，评审任务的状态就会变成未接受，所以要跳转到未接受页面
                this.dialogSubmitVisible = false;
                if (updateReviewList === true) {
                    this.$router.push('/managerNotAccept');
                }
            },
            closeOpinionDialog() { //关闭评审意见弹框，
                this.dialogOpinionVisible = false;
            },
            closeEvaluationDialog() {//关闭评审评价弹框，
                this.dialogEvaluationVisible = false;
            },
            updateOpinion(row) { //添加完意见回复后，重新加载查看意见页面
                this.handleClickOpinion(row);
            },

            rowClass() {
                return "background:#F4F6F9;";
            }
        }
    };
</script>

<style lang='scss'>
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
