<!--：功能：评审专家任务列表
      调用页面：评审专家所包含的页面中涉及评审任务列表的均调用此组件-->
<template>
    <div>
        <div style="padding-left: 10px;">
            <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 130%;">
                <el-breadcrumb-item :to="{ path: '/expertIndex' }">评审专家</el-breadcrumb-item>
                <el-breadcrumb-item>{{currentPageName}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="myTable">
            <div class="header_top">
                <el-input v-model="searchData.type" placeholder="请输入评审类型"></el-input>
                <el-input v-model="searchData.title" placeholder="请输入评审标题"></el-input>
                <el-date-picker v-model="searchData.gmtCreateStart" type="date" placeholder="邀请开始时间"
                                :picker-options="startDatePicker" value-format="yyyy-MM-dd">
                </el-date-picker>
                <span style="margin-right:15px">到</span>
                <el-date-picker v-model="searchData.gmtCreateEnd" type="date" placeholder="邀请结束时间"
                                :picker-options="endDatePicker" value-format="yyyy-MM-dd">
                </el-date-picker>
                <el-button type="primary" @click="searchList()">搜索</el-button>
            </div>
        </div>
        <!--评审任务列表-->
        <el-table v-loading="loading" :data="tableData" style="width:1000px;margin:20px auto"
                  :header-cell-style="rowClass">
            <el-table-column fixed prop="title" label="评审标题" align="center">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.title+''" placement="top-start">
                        <span class="tablehidden">{{ scope.row.title }}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="reviewId" label="评审编号" align="center">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.reviewId+''">
                        <span class="tablehidden">{{ scope.row.reviewId}}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="type" label="评审类型" align="center">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.type+''">
                        <span class="tablehidden">{{ scope.row.type}}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="gmtCreate" label="邀请日期" align="center" width="100px;"></el-table-column>
            <el-table-column prop="deadline" label="截止日期" align="center"  width="100px;"></el-table-column>
            <el-table-column prop="gmtModified" label="更新日期" align="center" width="100px;"></el-table-column>
            <el-table-column prop="surplus" label="剩余天数" align="center" v-if="currentPageName==='待处理'||currentPageName==='评审中'">
                <template slot-scope="scope">
                    <span class="tablehidden">{{ scope.row.surplus }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.status===1">待处理</span>
                    <span v-if="scope.row.status===2">评审中</span>
                    <span v-if="scope.row.status===3">已完成</span>
                    <span v-if="scope.row.status===4">已中止</span>
                    <span v-if="scope.row.status===5">已拒绝</span>
                </template>
            </el-table-column>
            <el-table-column prop="accomplishProgress" label="操作" align="center" width="220px">
                <template slot-scope="scope">
                    <el-button @click="handleClickDetail(scope.row.reviewId)" type="text" size="medium"
                    ><i class="el-icon-search"></i>查看详情
                    </el-button>
                    <template v-if="currentPageName==='待处理'">
                        <el-button @click="handleRollBack(scope.row.id)" type="text" size="medium"
                        ><i class="el-icon-close"></i>拒绝
                        </el-button>
                        <el-button @click="handleAccept(scope.row.id)" type="text" size="medium"
                        ><i class="el-icon-check"></i>接受
                        </el-button>
                    </template>
                    <el-button @click="handleEvaluate(scope.row.id)" type="text" size="medium" v-if="currentPageName==='评审中'">
                        <i class="el-icon-edit"></i>评价
                    </el-button>
                    <el-button @click="handleReadReview(scope.row.id)" type="text" size="medium" v-if="currentPageName==='已完成'">
                        <i class="el-icon-edit"></i>查看评价
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="拒绝评审" :visible.sync="dialogRollbackVisible" style="text-align:left; font-weight: bolder;">
            <el-form :model="postForm">
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="拒绝原因" :label-width="formLabelWidth">
                            <el-input v-model="postForm.reply" type="textarea" :rows="3" placeholder="请输入内容" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" style="margin-right: 35%">
                <el-button @click="dialogRollbackVisible=false" style="margin-right: 10%">取 消</el-button>
                <el-button type="primary" @click="submitRollback" v-prevent-click>确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="评价" :visible.sync="dialogEvaluateVisible" width="80%" :before-close="handleEvaluateDialogClose"
                   style="text-align:left; font-weight: bolder;">
            <review-template :templateConfigList="templateConfigList" :totalScore="totalScore" ref="submitReview"
                             :id="id" @closeDialog="closeSubmitReviewDialog">
            </review-template><!--生成评审表单的组件-->
        </el-dialog>

        <el-dialog title="查看评价" :visible.sync="dialogReadReviewVisible" width="80%"
                   style="text-align:left; font-weight: bolder;">
            <read-review-result :templateConfigList="templateConfigListForRead" :totalScore="totalScore" :result="result"
                             @closeDialog="closeReadReviewDialog">
            </read-review-result><!--生成评审表单的组件-->
        </el-dialog>
        <!--评审详情-->
        <expert-review-detail :form="formReviewDetail" :formLabelWidth="formLabelWidth" :dialogFormVisible="dialogFormVisible"
                          :loading="formReviewDetailLoading" @closeDialog="closeReviewDetailDialog">
        </expert-review-detail>

        <div class="bid_footer">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="pageData.pageNo"
                    :total="totalPage" layout="prev, pager, next, jumper" >
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import {httpGet, httpPut} from "@/utils/http.js";
    import {specificDate} from '@/utils/getDate.js';
    import {message, successTips, errTips} from "@/utils/tips.js";
    import expertReviewDetail from '@/view/review/expert/components/expertReviewDetail'
    import {MessageBox} from 'element-ui';
    import reviewTemplate from '@/view/review/components/reviewTemplate';
    import readReviewResult from '@/view/review/components/readReviewResult';
    import timeLimit from "@/mixins/regular/timeLimitForReview.js";

    export default {
        components: {
            expertReviewDetail,
            reviewTemplate,
            readReviewResult
        },
        props:{
            currentPage:{           //1 待处理，2 评审中，3 已完成 4 已中止
                type:[String,Number],
                default:null,
            },
            timeStatus:{            //时间状态 1即将超时 2已经超时
                type:[String,Number],
                default:null,
            }
        },
        mixins: [timeLimit],
        computed:{
            currentPageName:function(){
                if(this.timeStatus===null){
                    switch(parseInt(this.currentPage)){
                        case 1: return "待处理";
                        case 2 :return "评审中";
                        case 3 :return "已完成";
                        case 4 :return "已中止";
                        case 5 :return "已拒绝";
                    }
                }else{
                    if(parseInt(this.timeStatus)===1){
                        return "即将超时";
                    }else{
                        return "已经超时";
                    }
                }
            }
        },
        data(){
            return {
                dialogRollbackVisible: false,//控制打回对话框是否可见
                formReviewDetailLoading: false,//打开详情，加载转圈提示
                dialogFormVisible:false,//控制详情对话框是否可见
                dialogEvaluateVisible:false,//控制评价对话框是否可见
                dialogReadReviewVisible:false,//控制查看评价对话框是否可见
                formLabelWidth: '100px',
                loading: false,
                tableData: [],
                pageData: this.getInitPageOrSearchData(),
                searchData:this.getInitPageOrSearchData(),
                totalPage: 0,
                postForm: {
                    id: null,
                    type: null,
                    reply: null
                },
                formReviewDetail: {},
                /*评审模板信息*/
                templateConfigList:[],//模板配置列表
                totalScore:0,//模板总分
                templateName:null,//模板名称
                id:null,//评审专家邀请信息编号ID
                result:{},//评审模板的评价结果
                templateConfigListForRead:[],//查看评价的评审模板配置列表
            };
        },
        created: function () {
            this.getView();
        },
        methods: {
            getInitPageOrSearchData(){
                let status = null;
                let timeStatus = null;
                if(this.timeStatus===null){
                    status = parseInt(this.currentPage);
                }else{
                    timeStatus = parseInt(this.timeStatus);
                }
                return {
                    pageNo: 1,
                    pageSize: 10,
                    orderBy: "id",
                    orderType: "DESC",
                    type: null,
                    submitTimeStart: null,
                    submitTimeEnd: null,
                    status: status,
                    timeStatus:timeStatus,
                };
            },
            /**待处理页面：提交拒绝理由*/
            submitRollback(){
                httpPut('/v1/authorization/review/expertinvite/update', this.postForm).then(results => {
                    const {msg, httpCode} = results.data;
                    if (httpCode === 200) {
                        successTips("已拒绝评审！");
                        this.postForm.id = null;
                        this.postForm.type = null;
                        this.postForm.reply = null;
                        this.getView();
                        this.dialogRollbackVisible = false;
                    } else {
                        errTips(msg);
                    }
                })
            },
            /**待处理页面：拒绝*/
            handleRollBack(val) {
                this.dialogRollbackVisible = true;
                this.postForm.id = val;
                this.postForm.type = 2;

            },
            /**待处理页面：接受*/
            handleAccept(val) {
                MessageBox.confirm("接受任务将进入评审中状态，是否接受？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    this.postForm.id = val;
                    this.postForm.type = 1;
                    httpPut('/v1/authorization/review/expertinvite/update', this.postForm).then(results => {
                        const { msg, httpCode} = results.data;
                        if (httpCode === 200) {
                            successTips("已接受评审！");
                            this.getView();
                        } else {
                            errTips(msg);
                        }
                    });
                });
            },
            /**评审中页面：评价*/
            handleEvaluate(id){
                this.dialogEvaluateVisible = true;
                /*评审中页面：获取评价模板的详细信息*/
                httpGet("/v1/authorization/review/experttemplateconfig/list", {id: id}).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 200){
                        this.templateConfigList = data.configList;
                        this.totalScore = data.totalScore;
                        this.templateName = data.templateName;
                        this.id = data.id;//评审专家邀请信息编号ID
                    }else if(httpCode !== 401){
                        errTips(msg);
                    }
                });
            },
            /**评审中页面：未提交而关闭评价的对话框*/
            handleEvaluateDialogClose(){
                MessageBox.confirm("关闭后数据将不会保存，确定要关闭窗口么？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    this.dialogEvaluateVisible = false;
                    this.$refs.submitReview.setReviewTemplateNull();//调用reviewTemplate组件的方法清空表单
                    });
            },
            /**评审中页面：提交后评价框的关闭*/
            closeSubmitReviewDialog(){
                this.dialogEvaluateVisible = false;
                this.getView();
            },
            /**评审完成页面：点击查看评价*/
            handleReadReview(id){
                this.dialogReadReviewVisible = true;
                httpGet("/v1/authorization/review/experttemplateopinion/get", {id: id}).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 200){
                        data.result.content = JSON.parse(data.result.content);
                        this.result = data.result;//评审专家评价结果
                        this.templateConfigListForRead = data.configList;
                        this.totalScore = data.totalScore;
                        this.templateName = data.templateName;
                    }else if(httpCode !== 401){
                        errTips(msg);
                    }
                });
            },
            /**评审完成页面：关闭查看评价框*/
            closeReadReviewDialog(){
                this.dialogReadReviewVisible = false;
            },
            /**所有页面：点击查看详情*/
            handleClickDetail(val){
                this.dialogFormVisible = true;
                this.formReviewDetailLoading = true;
                httpGet("/v1/authorization/review/review/get", {id: val}).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 200) {
                        data.deadline = specificDate(data.deadline);
                        data.gmtCreate = specificDate(data.gmtCreate);
                        for(let item of data.resourceList ){
                            item.gmtCreate = specificDate(item.gmtCreate);
                        }
                        this.formReviewDetail = data;
                    } else if (msg === "该条件暂无数据") {
                        this.formReviewDetail = {};
                        message("该条件暂无数据");
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                    this.formReviewDetailLoading = false;
                });
            },
            /**所有页面：查看详情关闭窗口*/
            closeReviewDetailDialog() {
                this.dialogFormVisible = false;
            },

            setPropertyNull(obj){
                if(obj===""){
                    return null;
                }
                return obj;
            },
            /**所有页面：点击搜索*/
            searchList() {
                this.searchData.type = this.setPropertyNull(this.searchData.type);
                this.searchData.submitTimeStart = this.setPropertyNull(this.searchData.submitTimeStart);
                this.searchData.submitTimeEnd = this.setPropertyNull(this.searchData.submitTimeEnd);
                this.getView(this.searchData);
            },
            /**所有页面：获取列表数据*/
            getView(val = this.pageData) {
                console.log(" this.pageData", JSON.stringify(this.pageData));
                this.pageData.type = this.setPropertyNull(this.pageData.type);
                this.pageData.submitTimeStart = this.setPropertyNull(this.pageData.submitTimeStart);
                this.pageData.submitTimeEnd = this.setPropertyNull(this.pageData.submitTimeEnd);
                this.loading = true;
                httpGet("/v1/authorization/review/expertinvite/search", val).then(results => {
                    const { httpCode, msg, data } = results.data;
                    if (httpCode === 200) {
                        this.pageNo = data.pageNo;
                        this.totalPage = parseInt(data.totalPage + '0');

                        let list = data.expertInviteList;
                        for (let i of list) {
                            i.gmtModified = specificDate(i.gmtModified);
                            i.gmtCreate = specificDate(i.gmtCreate);
                            i.deadline = specificDate(i.deadline);
                        }
                        console.log("data:",list);
                        Object.assign(this.pageData, val);
                        this.$set(this, 'tableData', list);
                    } else if (msg === "该条件暂无数据") {
                        this.tableData = [];
                        message("该条件暂无数据");
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                    this.loading = false;
                });
            },
            /**所有页面：点处理页面的变化*/
            handleCurrentChange(val) {
                this.pageData.pageNo = val;
                this.getView();
            },
            rowClass() {
                return "background:#F4F6F9;";
            }
        }
    };

</script>

<style lang='scss' scoped>
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

