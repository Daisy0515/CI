<template>
    <!-- <h1>publishercomplete</h1> -->
    <div>
        <div style="padding-left: 10px;">
            <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 130%;">
                <el-breadcrumb-item :to="{ path: '/managerIndex' }">项目经理</el-breadcrumb-item>
                <el-breadcrumb-item>未接受</el-breadcrumb-item>
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
                <el-table-column prop="accomplishProgress" label="操作" align="center" width="280px">
                    <template slot-scope="scope">
                        <el-button @click="handleDetail(scope.row)" type="text" size="medium"
                        ><i class="el-icon-search"></i>查看详情
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog title="评审详情" :visible.sync="dialogFormVisible" style="text-align:left; font-weight: bolder;">
            <el-form :model="form" v-loading="dialogLoading" element-loading-text="正在加载中">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="项目名称" :label-width="formLabelWidth">
                            <el-input v-model="form.projectName" auto-complete="off" :readonly="isReadOnly"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="项目编号" :label-width="formLabelWidth">
                            <el-input v-model="form.projectCode" auto-complete="off" :readonly="isReadOnly"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="评审标题" :label-width="formLabelWidth">
                            <el-input v-model="form.title" auto-complete="off" :readonly="isReadOnly"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="评审目的" :label-width="formLabelWidth">
                            <el-input v-model="form.purpose" auto-complete="off" :readonly="isReadOnly"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="开始时间" :label-width="formLabelWidth">
                            <el-input v-model="form.gmtCreate" auto-complete="off" :readonly="isReadOnly"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="截止时间" :label-width="formLabelWidth">
                            <el-input v-model="form.deadline" auto-complete="off" :readonly="isReadOnly"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="截止前提醒" :label-width="formLabelWidth">
                            <el-input v-model="form.warn" auto-complete="off" placeholder="请输入天数"
                                      :readonly="isReadOnly">
                                <template slot="append">天</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-form-item label="评审内容" :label-width="formLabelWidth">
                            <el-input v-model="form.content" type="textarea" :rows="2" placeholder="请输入内容"
                                      :readonly="isReadOnly"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>
                        <el-form-item label="附件下载" :label-width="formLabelWidth" style="text-align: center">
                            <el-table :data="form.resourceList" border>
                                <el-table-column prop="resourceName" label="附件名称"></el-table-column>
                                <el-table-column prop="gmtCreate" label="上传时间"></el-table-column>
                                <el-table-column label="操作">
                                    <template slot-scope="scope">
                                        <a :href="scope.row.resourceUrl" target="_Blank">下载附件</a>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
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
    import {httpGet, httpDelete} from "@/utils/http.js";
    import {specificDate} from '@/utils/getDate.js';
    import {message, successTips, errTips} from "@/utils/tips.js";
    import timeLimit from "@/mixins/regular/timeLimit.js";
    export default {
        mixins: [timeLimit],
        data() {
            return {
                isReadOnly: true,
                loading: false,
                processLoading:false,//搜索框中点击类型下拉框时，加载的
                dialogLoading: false,//用于控制详情页面加载时的转圈状态
                tableData: [],
                projectList: [],//当前用户所竞标的项目列表，发起评审时，用于项目选择
                reviewProcessList: [],//当前用户选定评审项目后，该项目所拥有的评审流程
                searchData: {
                    pageNo: 1,
                    pageSize: 10,
                    orderBy: "id",
                    orderType: "DESC",
                    role: 2,  //用户的角色 1项目发布者 2项目经理 3评审专家 4评审管理员
                    status: 1,//任务的评审状态 评审状态 1未接受 2评审中 3打回中 4已完成 5即将超时 6已经超时
                    projectId: null,//项目名称编号ID
                    type: null,//评审类型,
                    title: null,//评审标题
                    gmtCreateStart: null,//提交开始时间
                    gmtCreateEnd: null,//提交结束事件
                },
                pageData: {
                    pageNo: 1,
                    pageSize: 10,
                    orderBy: "id",
                    orderType: "DESC",
                    role: 2,
                    status: 1,
                    projectId: null,
                    type: null,//评审类型,
                    title: null,//评审标题
                    gmtCreateStart: null,//提交开始时间
                    gmtCreateEnd: null,//提交结束事件
                },
                allReviewProcessList:{},//以评审的id为键，评审的processName为值存储所有评审流程的
                totalPage: 0,
                dialogFormVisible: false,
                form: {},//存储评审详情的信息
                formLabelWidth: '100px'
            };
        },
        created: function () {
            this.getAllReviewProcessList();
            this.getView();
            this.getUserProjectList();
        },
        computed: {},
        methods: {
            projectChange() {//当项目发生变化时，旁边的评审流程也要及时变化
                this.reviewProcessList = [];
                this.searchData.type = null;
            },
            searchList() {
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
            getReviewProcessList(projectId) {
                this.processLoading = true;
                /***获取用户当前项目的所有评审流程***/
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
                        errTips("请先选择项目！");
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                    this.processLoading = false;
                });
            },
            getAllReviewProcessList(){
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


            handleCurrentChange(val) {
                this.pageData.pageNo = val;
                this.getView();
            },
            handleDetail(row) {//row里面存储的是当前行的信息，获取详细评审任务的详细信息
                this.dialogFormVisible = true;
                this.dialogLoading = true;
                httpGet("/v1/authorization/review/review/get", {"id": row.id}).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode == 200) {
                        console.log("详情的数据：", data);
                        data.gmtCreate = specificDate(data.gmtCreate);
                        data.deadline = specificDate(data.deadline);
                        for (let i of data.resourceList) {
                            i.gmtCreate = specificDate(i.gmtCreate);
                        }
                        this.form = data;
                    } else if (msg == "该条件暂无数据") {
                        this.form = [];
                        message("该条件暂无数据");
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                    this.dialogLoading = false; // 这一句不能写在.then()之外，否则没有加载转圈的显示，写在.then之外会先于.then（）执行，这是异步请求
                });
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
