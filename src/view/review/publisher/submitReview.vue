<template>
    <div class="myTable">
        <div style="padding-left: 10px;">
            <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 130%;">
                <el-breadcrumb-item :to="{ path: '/publisherIndex' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>发起第三方评审</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="header_top">
            <el-select v-model="searchData.projectId" clearable placeholder="请选择项目名称" @change="changeProject">
                <el-option v-for="item in projectList" :key="item.projectId" :label="item.projectName"
                           :value="item.projectId"></el-option>
            </el-select>
            <el-select v-model="searchData.type" clearable placeholder="请选择评审类型">
                <el-option v-for="item in processList" :key="item.id" :label="item.processName"
                           :value="item.id"></el-option>
            </el-select>
            <el-input v-model="searchData.title" placeholder="评审标题"></el-input>
            <el-input v-model="searchData.userName" placeholder="提交人"></el-input>
            <el-date-picker v-model="searchData.gmtCreateStart" type="date" style="width: 140px;" placeholder="提交时间"
                            value-format="yyyy-MM-dd" :picker-options="endDatePicker"></el-date-picker>
            <span style="margin-right: 10px;margin-left: 10px;">到</span>
            <el-date-picker style="width: 140px;" v-model="searchData.gmtCreateEnd" :picker-options="endDatePicker"
                            type="date"
                            placeholder="提交时间" value-format="yyyy-MM-dd"></el-date-picker>
            <el-button type="primary" @click="searchList()">搜索</el-button>
        </div>
        <el-table :data="tableData" style="width: 100%" :header-cell-style="rowClass" v-loading="loading"
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection" align="center"></el-table-column>
            <el-table-column prop="projectName" label="项目名称" align="center"></el-table-column>
            <el-table-column prop="title" label="评审任务标题" align="center"></el-table-column>
            <el-table-column prop="typeName" label="评审任务类型" align="center"></el-table-column>
            <el-table-column prop="gmtCreate" label="提交时间" align="center"></el-table-column>
            <el-table-column prop="deadline" label="截止时间" align="center"></el-table-column>
            <el-table-column prop="submitName" label="提交人" align="center"></el-table-column>
            <el-table-column label="操作" prop="province" align="center" width="300px">
                <template slot-scope="scope">
                    <el-button @click="handleClickDetail(scope.row.id)" type="text" size="medium">
                        <i class="el-icon-search"></i>查看详情
                    </el-button>
                    <el-button @click="handleClickChoose(scope.row.id)" type="text" size="medium">
                        <i class="icon iconfont icon-yonghu"></i>选择评审管理员
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <review-detail-dialog :form="form1" :formLabelWidth="formLabelWidth" :dialogFormVisible="dialogFormVisible"
                              :loading="form1Loading" @closeDialog="closeDialog"></review-detail-dialog>
        <el-dialog title="选择管理员" :visible.sync="dialogChooseVisible"
                   style="width:100%;text-align:left; font-weight: bolder;">
            <div class="header_top">
                <el-input v-model="searchAdmin.name" placeholder="姓名"></el-input>
                <el-input v-model="searchAdmin.workUnit" placeholder="单位"></el-input>
                <el-button type="primary" @click="searchAdminList()">搜索</el-button>
            </div>
            <el-table :data="adminList" :header-cell-style="rowClass">
                <el-table-column prop="name" label="评审管理员" align="center"></el-table-column>
                <el-table-column prop="workUnit" label="单位" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button @click="submitList(scope.row.id)" type="text" size="medium">
                            选择
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="bid_footer">
                <el-pagination @current-change="handleCurrentChangeAdmin" :current-page.sync="pageAdmin.pageNo"
                               :total="totalPageAdmin" layout="prev, pager, next, jumper"></el-pagination>
            </div>
        </el-dialog>
        <el-button type="primary" @click="dialogChooseVisible=true" style="float: right;margin: 10px 0 10px 0;">
            批量选择评审管理员
        </el-button>
        <div class="bid_footer">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="pageData.pageNo" :total="totalPage"
                           layout="prev, pager, next, jumper"></el-pagination>
        </div>
    </div>
</template>
<script>
    import {httpGet, httpPost, httpPut} from "@/utils/http.js";
    import {errTips, successTips} from "@/utils/tips.js";
    import {mapMutations} from "vuex";
    import {specificDate} from "@/utils/getDate.js";
    import reviewDetailDialog from '@/view/review/components/reviewDetailDialog';
    import timeLimit from "@/mixins/regular/timeLimit.js";

    export default {
        components: {
            reviewDetailDialog
        },
        mixins: [timeLimit],
        data() {
            return {
                form1Loading: false,
                dialogFormVisible: false,
                dialogChooseVisible: false,
                formLabelWidth: '150px',
                form1: {
                    projectName: "",
                    projectCode: null,
                    title: "",
                    purpose: "",
                    gmtCreate: "",
                    deadline: "",
                    warn: null,
                    content: "",
                    resourceList: [],
                },
                searchData: {
                    status: 1,
                    projectId: "",
                    type: null,
                    gmtCreateStart: null,
                    gmtCreateEnd: null,
                    title: null,
                    userName: "",
                    pageNo: 1,
                    pageSize: 10,
                    orderBy: "id",
                    orderType: "DESC"
                },
                pageData: {
                    status: 1,
                    projectId: "",
                    type: null,
                    gmtCreateStart: null,
                    gmtCreateEnd: null,
                    title: null,
                    userName: "",
                    pageSize: 10,
                    pageNo: 1,
                    orderBy: "id",
                    orderType: "DESC"
                },
                pageAdmin: {
                    pageNo: 1,
                    pageSize: 10,
                    name: "",
                    workUnit: "",
                },
                searchAdmin: {
                    pageNo: 1,
                    pageSize: 10,
                    name: "",
                    workUnit: "",
                },
                centerDialogVisible: false,
                tableData: [],
                //  loading: false,
                projectId: "",
                loading: false,
                tableForm: [{
                    leaderName: "111"
                }],
                ReqBidTeamVO: {
                    idList: []
                },
                projectList: [],
                processList: [],
                // typeList: [],//changed by xwj,没有其他地方使用到这个变量
                adminList: [],
                adminArr: {
                    idList: [],
                    userId: null
                },
                totalPage: null,
                totalPageAdmin: null,
            };
        },
        created: function () {
            this.projectId = this.$route.query.projectId;
            // this.getType(); //
            this.getProjectList();
            this.getAdmin();
            this.getView();
        },
        methods: {
            ...mapMutations(["setCache"]),
            // getType() { //changed by xwj
            //     httpGet('/v1/public/bid/process/list').then(results => {
            //         const {msg, data, httpCode} = results.data;
            //         if (httpCode === 200) {
            //             this.typeList = data.reviewProcessList;
            //             this.getView();
            //         } else {
            //             errTips(msg);
            //         }
            //     });
            // },
            /**获取评审管理员的列表*/
            getAdmin(val = this.pageAdmin) {
                httpGet("/v1/authorization/review/admin/user", val).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 200) {
                        this.totalPageAdmin = parseInt(data.totalPage + "0");
                        this.adminList = data.adminList;
                        Object.assign(this.pageData, val);
                    } else {
                        this.adminList = [];
                        errTips(msg);
                    }

                });

            },
            searchAdminList() {
                this.getAdmin(this.searchAdmin)
            },
            handleClickChoose(val) {
                this.dialogChooseVisible = true;
                this.adminArr.idList.push(val);
            },
            handleClickDetail(val) {
                this.dialogFormVisible = true;
                this.form1Loading = true;
                httpGet("/v1/authorization/review/thirdparty/get", {id: val}).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 200) {
                        this.form1 = data;
                        this.form1.deadline = specificDate(this.form1.deadline);
                        this.form1.gmtCreate = specificDate(this.form1.gmtCreate);
                        let reviewInfoList = data.resourceList;
                        for (let i of reviewInfoList) {
                            i.gmtCreate = specificDate(i.gmtCreate);
                        }
                        this.form1.resourceList = reviewInfoList;
                    } else if (msg === "该条件暂无数据") {
                        this.form1 = "";
                        errTips(msg);
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                    this.form1Loading = false;
                });
            },
            closeDialog() {
                this.dialogFormVisible = false;
            },
            /**地址最后由get改成了getall，表示返回用户所发布的所有执行中与完成的项目(过滤没有设置参与评审) changed by xwj*/
            getProjectList() {
                httpGet('/v1/authorization/mission/promulgator/getall').then(results => {
                    const {data, httpCode} = results.data;
                    if (httpCode === 200) {
                        this.projectList = data.projectList;
                    }//用户没有项目时，弹出提示消息
                });
            },
            changeProject: function (value) {
                if(value === ""){ //用户在清除项目名称时，不用获取评审类型数据
                    return ;
                }
                httpGet('/v1/authorization/review/process/list', {id: value}).then(results => {
                    const {msg, data, httpCode} = results.data;
                    if (httpCode === 200) {
                        this.processList = data.processList;
                    } else {
                        errTips(msg);
                    }
                });
            },
            searchList() {
                this.getView(this.searchData);
            },
            getView(val = this.pageData) {
                this.loading = true;
                httpGet("/v1/authorization/review/thirdparty/search", val).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 200) {
                        this.totalPage = parseInt(data.totalPage + "0");
                        let {reviewInfoList} = data;

                        for (let i of reviewInfoList) {
                            i.deadline = specificDate(i.deadline);
                            i.gmtCreate = specificDate(i.gmtCreate);
                        }

                        this.$set(this, "tableData", reviewInfoList);
                        Object.assign(this.pageData, val);
                    } else {
                        this.tableData = [];
                        errTips(msg);
                    }
                    this.loading = false;
                });

            },

            submitList(val) {
                this.adminArr.userId = val;
                if (this.adminArr.idList.length === 0) {
                    errTips("至少选择一个评审");
                } else {
                    httpPost("/v1/authorization/review/admin/insert", this.adminArr).then(results => {
                        const {httpCode, msg} = results.data;
                        if (httpCode === 200) {
                            successTips("选择评审管理员成功");
                        } else {
                            errTips(msg);
                        }
                        this.dialogChooseVisible = false;
                        this.adminArr.userId = null;
                        this.adminArr.idList = [];
                        this.getView();
                    });
                }

            },
            //确定选择团队
            choice() {
                this.centerDialogVisible = true;
                this.loading = true;
                httpPut("/v1/authorization/bid/teamstatus/update", this.adminArr).then(results => {
                    const {httpCode, msg} = results.data;
                    if (httpCode === 200) {
                        this.centerDialogVisible = false;
                        this.loading = false;
                        successTips("选择团队成功");
                    } else if (msg === "至少选择一个项目组") {
                        errTips("至少选择一个项目组");
                    } else if (msg === "执行中项目数量超限") {
                        errTips("执行中项目数量超限");
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                });
            },
            //单选事件
            handleSelectionChange(val) {
                const newVal = val.map(item => {
                    return item.id;
                });
                this.adminArr.idList = newVal;
            },

            rowClass() {
                return "background:#F4F6F9;";
            },
            handleCurrentChange(val) {
                this.pageData.pageNo = val;
                this.getView();
            },
            handleCurrentChangeAdmin(val) {
                this.pageAdmin.pageNo = val;
                this.getAdmin();
            },
        }
    };
</script>
<style scoped lang='scss'>
    @import "@/assets/scss/myTable.scss";

    .el-select {
        display: inline-block;
        width: 150px;
        margin-right: 15px;
    }
</style>
