<template>
    <div class="teamSelect">
        <el-dialog
                title="请稍等！"
                :visible.sync="centerDialogVisible"
                :show-close="false"
                :close-on-press-escape="false"
                :close-on-click-modal="false"
                width="30%"
                center
        >
            <div v-loading="loading" style="margin:26px 30px 80px 30px"></div>
        </el-dialog>
        <div class="Crumbs">
            <div class="container deskHeader">
                <h4>
                    您的位置：
                    <router-link to="myDemand">我的需求</router-link>
                    >
                    <span class="active">选择团队</span>
                </h4>
            </div>
        </div>
        <div class="container deskHeader">
            <el-table
                    :data="tableForm"
                    style="width: 100%"
                    :header-cell-style="rowClass"
                    v-loading="loading"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" align="center"></el-table-column>
                <el-table-column prop="teamName" label="团队名称" align="center"></el-table-column>
                <el-table-column prop="projectCognize" label="项目认知" align="center"></el-table-column>
                <el-table-column prop="leaderName" label="团队组长" align="center"></el-table-column>
                <el-table-column prop="gmtCreate" label="最后更新时间" align="center"></el-table-column>
                <el-table-column prop="count" label="人员个数" align="center"></el-table-column>
                <el-table-column label="操作" prop="province" align="center">
                    <template slot-scope="scope">
                        <router-link
                                :to="{path:'teamDetails', query:{teamId:scope.row.id,projectId:projectId}}"
                        >
                            <i class="el-icon-search"></i>
                            团队明细
                        </router-link>
                    </template>
                </el-table-column>
            </el-table>
            <el-button type="primary" @click="open">确定选择</el-button>
        </div>
    </div>
</template>
<script>
    import {httpGet, httpPut} from "@/utils/http.js";
    import {hoursSeconds} from "@/utils/getDate.js";
    import {errTips, successTips} from "@/utils/tips.js";
    import {mapMutations} from "vuex";
    import { MessageBox,message } from 'element-ui';

    export default {
        components: {},
        data() {
            return {
                centerDialogVisible: false,
                //  loading: false,
                projectId: "",
                loading: false,
                tableForm: [],
                ReqBidTeamVO: {
                    idList: []
                }
            };
        },
        created: function () {
            this.projectId = this.$route.query.projectId;
            this.getView();
        },
        methods: {
            ...mapMutations(["setCache"]),
            //获取页面数据
            getView() {
                this.loading = true;
                httpGet("/v1/authorization/bid/select/teaminfo", {
                    id: this.projectId
                }).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 200) {
                        let {teamInfoList} = data;
                        for (let i of teamInfoList) {
                            i.gmtCreate = hoursSeconds(i.gmtCreate, true);
                        }
                        this.loading = false;
                        this.tableForm = teamInfoList;
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                });
            },

            open() {
                MessageBox.confirm('选择团队后不可更改，请确认选择的团队无误', '确认信息', {
                distinguishCancelAndClose: true,
                confirmButtonText: '保存',
                cancelButtonText: '取消'
                })
                .then((action) => {
                    if(action === "confirm"){
                        //console.log(this.ruleForm);
                        this.choice();
                       
                    }
                })
            },
            //确定选择团队
            choice() {
                this.centerDialogVisible = true;
                this.loading = true;
                httpPut(
                    "/v1/authorization/bid/teamstatus/update",
                    this.ReqBidTeamVO
                ).then(results => {
                    const {httpCode, msg} = results.data;
                    if (httpCode === 200) {
                        this.centerDialogVisible = false;
                        this.loading = false;
                        successTips("选择团队成功");
                        this.setCache("myDemand");
                        // this.setCache("myDemand");
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
                this.ReqBidTeamVO.idList = newVal;
            },
            rowClass() {
                return "background:#F4F6F9;";
            }
        }
    };
</script>
<style lang='scss'>
    .teamSelect {
        .el-table {
            border: 1px solid #d8d8d8;
            margin-top: 40px;
        }

        button {
            float: right;
            margin-top: 30px;
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

        .el-table td,
        .el-table th.is-leaf {
            color: black;
            border-bottom: 1px solid #d8d8d8;
        }

        .footer {
            margin-bottom: 20px;

            .el-input__inner {
                width: 70px;
            }

            .el-pagination {
                text-align: center;
                margin: 50px 0 50px 0;
            }
        }
    }
</style>
