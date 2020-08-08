<template>
    <div class="myTable">
        <!-- <h1>publishercomplete</h1> -->
        <div style="padding-left: 10px;">
            <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 130%;">
                <el-breadcrumb-item :to="{ path: '/editorTodo' }">待处理任务</el-breadcrumb-item>
                <el-breadcrumb-item>{{reviewTypes[this.id]}}</el-breadcrumb-item>

            </el-breadcrumb>
        </div>
        <div class="header_top">
            <el-input v-model="searchData.title" placeholder="评审标题"></el-input>
            <el-select v-model="searchData.type" clearable placeholder="请选择项目类型">
                <el-option v-for="index in typeList" :label="typeList[index]" :value="index"></el-option>
            </el-select>
            <el-input v-model="searchData.projectUserName" placeholder="发布者"></el-input>
            <el-input v-model="searchData.submitterName" placeholder="提交人"></el-input>
            <el-date-picker v-model="searchData.submitTimeStart" type="date" style="width: 150px;" placeholder="提交时间"
                            value-format="yyyy-MM-dd"
                            ></el-date-picker>
            <span style="margin-right: 15px;">到</span>
            <el-date-picker style="width: 150px;" v-model="searchData.submitTimeEnd" 
                            type="date"
                            placeholder="提交时间" value-format="yyyy-MM-dd"></el-date-picker>


            <!-- <el-select v-model="selestate" clearable placeholder="请选择状态">
            <el-option label="中标" value="中标"></el-option>
            <el-option label="投标中" value="投标中"></el-option>
            <el-option label="失败" value="失败"></el-option>
            <el-option label="结束" value="结束"></el-option>
          </el-select> -->

            <el-button type="primary" @click="searchList()">搜索</el-button>

        </div>
        <el-table v-loading="loading" :data="tableData" style="width:100%;margin:20px auto"
                  :header-cell-style="rowClass">
            <el-table-column label="操作" align="center" width="280px">
                <template slot-scope="scope">
                    <el-button @click="handleClickDetail(scope.row.reviewId)" type="text" size="medium"><i
                            class="el-icon-search"></i>查看详情
                    </el-button>
                    <el-button @click="inviteExpert(scope.row.id,scope.row.reviewId)" type="text" size="medium"><i
                            class="el-icon-document"></i>邀请评审专家
                    </el-button>
                    <el-button @click="handleClickDecisionAndOpinion(scope.row)" type="text" size="medium"><i
                            class="el-icon-refresh"></i>意见与决定
                    </el-button>
                    <el-button @click="handleClickSubmit(scope.row)" type="text" size="medium"><i
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
            <el-table-column prop="id" label="评审编号" align="center">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.id">
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
                    <el-tooltip class="item" effect="dark" :content="scope.row.statusExplain">
                        <span class="tablehidden" v-show="id==0">{{ scope.row.statusExplain }}</span>
                    </el-tooltip>
                    <el-button v-show="id!=0" @click="viewReviewDetail(scope.row.id)" type="text" size="medium">查看详情
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column prop="opinion" label="管理员意见" align="center">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.opinion">
                        <span class="tablehidden">{{ scope.row.opinion }}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="第三方评审意见" :visible.sync="dialogChooseVisible" width="80%">
            <div class="header_top">
                管理员意见：
                <span v-if="opinin==1">接受</span>
                <span v-if="opinin==2">需要修改</span>
                <span v-if="opinin==3">拒绝</span>
                <span v-if="opinin==4">没有意见 </span>

            </div>
            <el-table :data="userList" :header-cell-style="rowClass">

                <el-table-column prop="userName" label="评审专家" align="center"></el-table-column>
                <el-table-column prop="gmtCreate" label="邀请时间" align="center"></el-table-column>
                <el-table-column prop="status" label="状态" align="center"></el-table-column>
                <el-table-column label="评审结果" align="center">
                    <template slot-scope="scope">
                        <el-button @click="viewResualtDetail(scope.row.id)" type="text" size="medium">
                            详情
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
        <editor-view-detail :form="formReviewDetail" :formLabelWidth="formLabelWidth" :dialogFormVisible="dialogFormVisible"
							:loading="formReviewDetailLoading"
                            @closeDialog="closeDialog"></editor-view-detail>
        <div class="bid_footer">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="pageData.pageNo" :total="totalPage"
                           layout="prev, pager, next, jumper"></el-pagination>
        </div>
    </div>

</template>

<script>
    import {
        httpGet,
        httpDelete
    } from "@/utils/http.js";

    import {
        message,
        successTips,
        errTips
    } from "@/utils/tips.js";
    import reviewDetailDialog from '@/view/review/components/reviewDetailDialog';
    import submitReview from '@/view/review/components/submitReview';
    import reviewOpinion from '@/view/review/components/reviewOpinion'
    import editorViewDetail from '@/view/review/components/editorViewDetail'
    import {
        specificDate
    } from '@/utils/getDate.js';

    export default {
        props: ['type'], //type用来区分'新任务'，‘评审专家需要额外评审’，‘评审延期’，‘评审中’等类型
        components: {
            reviewDetailDialog,
            submitReview,
            reviewOpinion,
            editorViewDetail
        },
        data() {
            return {
                opinion: "",
                userList: [],
                dialogChooseVisible: false,
                searchData: {
                    pageNo: 1,
                    pageSize: 10,
                    orderBy: "id",
                    orderType: "DESC",
                    title: null, //待增加
                    type: null,
                    submitterName: null,
                    projectUserName: null,
                    submitTimeStart: null,
                    submitTimeEnd: null,
                    expertAccomplishCount: null,
                    status: null,
                    statusExplain: null
                },
                id: "",
                reviewTypes: ['新任务', '评审专家完成评审', '需要额外评审专家', '评审延期', '评审邀请未回复', '评审进行中'],
                submitTitle: '修改提交',
                isShowSubmitHistory: true, //在修改提交评审的表单里是否显示提交历史
                dialogFormVisible: false, //控制表单对话框是否显示
                dialogSubmitVisible: false, //控制重新提交框是否显示
                dialogOpinionVisible: false, //控制意见详情框是否显示
                loading: false,
                tableData: [],
                pageData: {
                    pageNo: 1,
                    pageSize: 10,
                    orderBy: "id",
                    orderType: "DESC",
                    type: null,
                    submitterName: null,
                    projectUserName: null,
                    submitTimeStart: null,
                    submitTimeEnd: null,
                    expertAccomplishCount: null,
                    status: null,
                    statusExplain: null
                },
                totalPage: 0,
                formReviewDetailLoading: false,//打开详情，加载转圈提示
				formReviewDetail:{},

                formLabelWidth: '100px' //控制表单中输入框的尺寸
            };
        },
        created: function () {
            this.id = this.$route.query.id;
            if (this.id == 0) {
                this.pageData.status = 1;
                this.searchData.status = 1;
            }
            if (this.id >= 1 && this.id <= 4) {
                this.pageData.statusExplain = this.id;
                this.searchData.statusExplain = this.id;
            }
            if (this.id == 5) {
                this.pageData.status = 2;
                this.searchData.status = 2;
            }
            this.getTpyeList();
            this.getView();
        },
        computed: {},
        methods: {
			handleClickDetail(val) {//点击查看详情
				console.log('reviewId:',val);
			    this.dialogFormVisible = true;
			    this.formReviewDetailLoading = true;
			    //get /v1/authorization/review/review/get
			    httpGet("/v1/authorization/review/review/get", {id: val}).then(results => {
			        const {httpCode, msg, data} = results.data;
			        if (httpCode == 200) {
			            data.gmtModified  = specificDate(data.gmtModified );
			            data.gmtCreate = specificDate(data.gmtCreate);
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
            //获取评审结果
            viewResualtDetail(val) {

            },
            viewReviewDetail(val) {
                console.log(this.dialogChooseVisible);
                //get /v1/authorization/review/expertinviterecord/list
                httpGet("/v1/authorization/review/expertinviterecord/list", {id: val}).then(results => {
                    const {
                        httpCode,
                        msg,
                        data
                    } = results.data;
                    if (httpCode == 200) {
                        this.opinion = data.opinion;
                        let userList = data.userList;
                        for (let i of userList) {
                            i.gmtCreate = specificDate(i.gmtCreate);
                        }
                        this.userList = userList;
                    } else {
                        this.typeList = [];
                        errTips(msg);
                    }

                });
                this.dialogChooseVisible = true;
            },
            inviteExpert(val,reviewId) {
                this.$router.push({path: './inviteExpert', query: {id: val,reviewId:reviewId}});
            },
            searchList() {
                //alert('searchList');
                this.getView(this.searchData);
            },
            getTpyeList() {
                //get /v1/authorization/review/type/get
                httpGet("/v1/authorization/review/type/get").then(results => {
                    const {
                        httpCode,
                        msg,
                        data
                    } = results.data;
                    if (httpCode == 200) {
                        this.typeList = data.typeList;
                        console.log(this.typeList);
                    } else {
                        this.typeList = [];
                        errTips(msg);
                    }

                });

            },
            getView(val = this.pageData) {
                this.loading = true;
                httpGet("/v1/authorization/review/admin/search", val).then(results => {
                    const {
                        httpCode,
                        msg,
                        data
                    } = results.data;
                    if (httpCode == 200) {
                        this.pageNo = data.pageNo;
                        this.totalPage = parseInt(data.totalPage + '0');

                        let list = data.adminMissionList;
                        for (let i of list) {

                            i.gmtCreate = specificDate(i.gmtCreate);
                            i.submitTime = specificDate(i.submitTime);
                        }
                        Object.assign(this.pageData, val);
                        this.$set(this, 'tableData', list);
                    } else {
                        this.tableData = [];
                        errTips(msg);
                    }
                    this.loading = false;
                });

            },
            handleClickDecisionAndOpinion(row){
                console.log("row",row);
            },
            handleCurrentChange(val) {
                this.pageData.pageNo = val;
                this.getView();
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

<style lang="scss">
    @import "@/assets/scss/myTable.scss";
</style>
