<template>
    <div class="teamApplication">
        <div class="header_top_codeDefect">
            <el-select  v-model="searchData.level" clearable placeholder="请选择缺陷等级">
                <el-option label="█马上解决" value="1" style="color:red"></el-option>
                <el-option label="█急需解决" value="2" style="color:orange"></el-option>
                <el-option label="█高度重视" value="3" style="color:#FFE153"></el-option>
                <el-option label="█正常处理" value="4" style="color:green"></el-option>
                <el-option label="█低优先级" value="5" style="color:blue"></el-option>
            </el-select>
            <el-select style="margin-left:50px;"  v-model="searchData.status" clearable placeholder="请选择状态">
                <el-option label="待解决" value="1"></el-option>
                <el-option label="解决中" value="2"></el-option>
                <el-option label="已解决" value="3"></el-option>
                <el-option label="已结束" value="4"></el-option>
            </el-select>
             <div class="buttons">
                 <input type="radio" v-on:click="changeRadio" :checked="checked"/>是否指派给我
                 <el-button type="primary" size="middle" @click="defectAddDialog=true">新增</el-button>
                 <el-button size="primary" @click="searchList()">搜索</el-button>
                 <el-button size="primary" @click="getIssueVisualization()">可视化</el-button>
            <!-- <el-button size="primary" @click="gotoTest()">招聘测试人员</el-button> -->
             </div>
            </div>
        <defect-add :dialogFormVisible="defectAddDialog" :userList="userList" 
                    :projectId="projectId" @closeDialog="closeDefectAddDialog"></defect-add>
        <issue-visualization :dialogFormVisible="visualizationDialog" :projectId="projectId" 
                             @closeDialog="closeVisualizationDialog" ref="issueVisualization"></issue-visualization>
        <el-table
                    :data="tableData"
                    style="width: 100%"
                    :header-cell-style="rowClass"
                    v-loading="loading"
            >
                <el-table-column fixed prop="projectCode" label="项目编号" align="center">
                    <template slot-scope="scope">
                        <el-tooltip
                                class="item"
                                effect="dark"
                                :content="String(scope.row.projectCode)"
                                placement="top-start"
                        >
                            <span class="tablehidden">{{scope.row.projectCode}}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="creatorName" label="创建人" align="center">
                    <template slot-scope="scope">
                        <span class="tablehidden">{{scope.row.creatorName}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="appointName" label="当前指派人" align="center">
                    <template slot-scope="scope">
                        <span class="tablehidden">{{scope.row.appointName}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="标题" align="center">
                    <template slot-scope="scope">
                        <el-tooltip
                                class="item"
                                effect="dark"
                                :content="scope.row.title"
                                placement="top-start"
                        >
                            <span class="tablehidden">{{scope.row.title}}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="operateTime" label="最后操作时间" align="center" width="200">
                    <template slot-scope="scope">
                        <span v-if="scope.row.gmtModified===''">暂未更新</span>
                        <span v-else>{{scope.row.gmtModified}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="level" label="等级" align="center">
                    <template slot-scope="scope">
                        <span class="tablehidden" v-if="scope.row.level===1" style="color:red;">█马上解决</span>
                        <span class="tablehidden" v-if="scope.row.level===2" style="color:orange;">█急需解决</span>
                        <span class="tablehidden" v-if="scope.row.level===3" style="color:#FFE153;">█高度重视</span>
                        <span class="tablehidden" v-if="scope.row.level===4" style="color:green;">█正常处理</span>
                        <span class="tablehidden" v-if="scope.row.level===5" style="color:blue;">█低优先级</span>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" align="center">
                    <template slot-scope="scope">
                        <span class="tablehidden" v-if="scope.row.status===1">待解决</span>
                        <span class="tablehidden" v-if="scope.row.status===2">解决中</span>
                        <span class="tablehidden" v-if="scope.row.status===3">已解决</span>
                        <span class="tablehidden" v-if="scope.row.status===4">结束</span>
                    </template>
                </el-table-column>
                <el-table-column prop="operation" label="操作" align="center" width="200">
                    <template slot-scope="scope">
                        <!-- 不理解 -->
                        <!-- <router-link @click.native="edit(scope.row.creatorId,scope.row.appointId,scope.row.id)" to> -->
                        <el-button plain type="primary" size="small" @click.native="edit(scope.row.creatorId,scope.row.appointId,scope.row.id)">
                            <i class="el-icon-edit" v-if="scope.row.creatorId===userId">编辑</i><!-- 缺陷创造者显示编辑按钮，缺陷被指派的人显示处理按钮 -->
                            <i class="el-icon-edit" v-else>处理</i>
                        </el-button>
                        <!-- </router-link> -->
                        <el-button plain type="primary" size="small" @click.native="viewDefectHistory(scope.row.id)">
                            <i class="el-icon-search"></i>
                            查看历史
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        
        <view-defect-history :dialogFormVisible="historyDialog" :rule-form="historyForm" 
                             :title="defectTitle" @closeDialog="closeHistoryDialog"></view-defect-history>
        <issue-edit-creator :dialogFormVisible="editCreatorDialog" :issueId="issueId" 
                            v-if="this.issueId" @closeDialog="closeEditCreatorDialog" ref="editCreator"></issue-edit-creator>
        <issue-edit-appoint :dialogFormVisible="editAppointDialog" :issueId="issueId" 
                            v-if="this.issueId" @closeDialog="closeEditAppointDialog" ref="editAppoint"></issue-edit-appoint>
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
    import {httpGet} from "@/utils/http.js";
    import {message, errTips} from "@/utils/tips.js";
    import {mapMutations} from "vuex";
    import {hoursSeconds} from "@/utils/getDate.js";
    import defectAdd from "@/view/desk/projectManagement/projectManageContent/component/defectAdd"
    import viewDefectHistory from "../component/viewDefectHistory";
    import issueEditCreator from "../component/issueEditCreator";
    import issueEditAppoint from "../component/issueEditAppoint"
    import issueVisualization from "../component/issueVisualization"
    import {MessageBox} from 'element-ui';

    export default {
        name: "codeDefect",
        components: {
            defectAdd,
            viewDefectHistory,
            issueEditCreator,
            issueEditAppoint,
            issueVisualization,
        },
        data() {
            return {
                defectAddDialog:false,//控制新增对话框
                historyDialog:false,//控制查看历史对话框
                editCreatorDialog:false,//控制编辑-创建者对话框
                editAppointDialog:false,//控制编辑-指派人对话框
                visualizationDialog:false,//控制可视化对话框
                projectList: [],
                issueId: null,
                defectTitle:null,
                historyForm:[],
                projectName:null,
                projectId: null,
                userId: null,
                checked: false,
                loading: false,
                totalPage: 0,
                searchData: {
                    projectName: "",
                    level: null,
                    status: null,
                    is: 0,
                    pageSize: 10,
                    pageNo: 1,
                    orderType: "DESC",
                    orderBy: "id"
                },
                pageData: {
                    projectName: "",
                    level: null,
                    status: null,
                    is: 0,
                    orderType: "DESC",
                    pageNo: 1,
                    pageSize: 10,
                    orderBy: "id"
                },
                tableData: [],
                userList:[]
            };
        },
        created: function () {
            this.projectName = sessionStorage.getItem('projectName');
            this.projectId = parseInt(sessionStorage.getItem('projectId'));
            this.getAppointList(this.projectId);
            this.getView();
        },
        methods: {
            ...mapMutations(["setCache"]),
            viewDefectHistory(id) {

                httpGet(`/v1/authorization/bug/get/history`,{id:id}).then(
                    results => {
                        const {httpCode,msg} = results.data;
                        if (httpCode === 200) {
                            let newData = results.data.data;
                            let {historyList, title} = newData;
                            for (let i of historyList) {
                                i.gmtCreate = hoursSeconds(i.gmtCreate);
                            }
                            this.historyForm = historyList;
                            this.defectTitle = title;
                            this.historyDialog=true;
                        } else  {
                            errTips(msg);
                        }
                    }
                );
            },
            closeHistoryDialog() {
                this.historyDialog=false;
            },
            //获取项目成员
            getAppointList(val) {
                httpGet('/v1/authorization/bug/add/appoint', {
                    projectId: val
                }).then(results => {
                    const {msg, data, httpCode} = results.data;
                    if (httpCode === 200) {
                        this.userList = data.userList;
                    } else {
                        errTips(msg);
                    }
                });

            },
            closeDefectAddDialog() {
                this.defectAddDialog=false;
                this.getView();
            },

            changeRadio: function () {
                if (this.checked === true) {
                    this.checked = false;
                    this.searchData.is = 0;
                    this.pageData.is = 0;
                } else {
                    this.checked = true;
                    this.searchData.is = 1;
                    this.pageData.is = 1;
                }
            },


            rowClass() {
                return "background:#F4F6F9;";
            },

            //搜索查询
            searchList() {
                let {searchData} = this;
                this.getView(searchData);
            },
            //页码变化
            handleCurrentChange(val) {
                this.pageData.pageNo = val;
                this.getView();
            },
            //获取页面数据
            getView(val = this.pageData) {
                val.projectId = this.projectId;
                this.loading = true;
                httpGet("/v1/authorization/bug/search/get", val).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 200) {
                        let getData = data;
                        this.pageNo = getData.pageNo;
                        this.userId = getData.userId;
                        this.totalPage = parseInt(getData.totalPage + "0");
                        let {list} = getData;
                        for (let i of list) {
                            i.gmtModified = hoursSeconds(i.gmtModified);
                        }
                        this.tableData = list;
                        Object.assign(this.pageData, val);
                    } else if (msg === "该条件暂无数据") {
                        this.tableData = [];
                        message("该条件暂无数据");
                    }
                    this.loading = false;
                });
            },
            edit(creatorId, appointId, id) {
                this.issueId = id;
                this.$nextTick(()=>{
                    if (creatorId === this.userId) {
                        this.$refs.editCreator.getIssue();
                        this.$refs.editCreator.getUsers();
                        this.editCreatorDialog = true;
                    } else {
                        if (appointId === this.userId) {
                            this.$refs.editAppoint.getIssue();
                            this.$refs.editAppoint.getUsers();
                            this.editAppointDialog = true;
                        } else {
                            message("没有权限编辑！");
                        }
                    }
                })
               
            },
            closeEditCreatorDialog(refresh=false) {
                this.editCreatorDialog = false;
                if(refresh){
                    this.getView();
                }
            },
            closeEditAppointDialog(refresh=false) {
                this.editAppointDialog = false;
                if(refresh) {
                    this.getView();
                }
            },

            getIssueVisualization() {
                this.visualizationDialog = true;
                this.$nextTick(()=>{
                    this.$refs.issueVisualization.drawInit();
                })
                
            },

            closeVisualizationDialog() {
                this.visualizationDialog = false;
            },

            gotoTest() {
                MessageBox.confirm("是否进入“内测管理”，招募外来人员测试产品？", "提示", {
                    confirmButtonText: "进入",
                    cancelButtonText: "取消",
                    type: "info"
                }).then(() => {
                    this.$router.push({path:"/desk/myTest"});
                });

            }
        }
    };
</script>

<style lang='scss' scoped>
    .teamApplication {
        .seeClass {
            color: #3e76b8;
            cursor: pointer;
        }

        .bid_footer {
            .el-input__inner {
                width: 70px;
            }

            .el-pagination {
                text-align: center;
                margin: 50px 0 50px 0;
            }

            .el-pagination.is-background .el-pager li:not(.disabled).active {
                background: #3e76b8;
            }
        }

        .el-table {
            border: 1px solid #d8d8d8;
        }

        .buttons {
            float: right;
        }

        .header_top_codeDefect {

            margin: 15px auto;
            padding-bottom: 20px;

            .dao {
                margin: 0 0 0 -25px;
            }

            button {
                margin-left: 20px;
            }

            & button:nth-child(3) {
                color: white;
            }
            .el-select {
                display: inline-block;
                width: 150px;
                margin-right: 25px;
            }
            .el-input {
                display: inline-block;
                width: 150px;
                margin-right: 25px;
            }

            .el-input__inner {
                border: 1px solid #c0c0c0;
                width: 150px;
                height: 35px;
                line-height: 35px;
            }
        }


        .el-table td,
        .el-table th.is-leaf {
            color: black;
            border-bottom: 1px solid #d8d8d8;
        }
    }
</style>
