<template>
    <div class="teamApplication">
        <div class="header_top">
                <el-select v-model="searchData.missionId" clearable placeholder="请选择需求名称">
                    <el-option v-for="item in demandList" :key="item.id" :label="item.content"
                               :value="item.id"></el-option>
                </el-select>
                <el-select v-model="searchData.documentsType" clearable placeholder="请选择文档类型">
                    <el-option label="需求设计文档" value="1"></el-option>
                    <el-option label="概要设计文档" value="2"></el-option>
                    <el-option label="详细设计文档" value="3"></el-option>

                </el-select>
                <el-select v-model="searchData.status" clearable placeholder="请选择状态">
                    <el-option label="待解决" value="1"></el-option>
                    <el-option label="已解决" value="2"></el-option>

                </el-select>
<!--                <input type="radio" v-on:click="changeRadio" :checked="checked"/>是否指派给我-->
                <!-- <div class="buttons"> -->
                <router-link :to="{path:'opinionAdd'}">
                    <el-button type="primary" size="middle"
                               @click="routerIndex='opinionAdd'"
                    >新增
                    </el-button>
                </router-link>
                <el-button size="primary" @click="searchList()">搜索</el-button>
                <!-- </div> -->
                <el-button type="primary" @click="toOpinionSum" size="large" style="width:150px">意见汇总</el-button>
                <br>
            </div>
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

                <el-table-column prop="missionName" label="需求名称" align="center">
                    <template slot-scope="scope">
                        <el-tooltip
                                class="item"
                                effect="dark"
                                :content="scope.row.missionName"
                                placement="top-start"
                        >
                            <span class="tablehidden">{{scope.row.missionName}}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="documentsType" label="文档类型" align="center">
                    <template slot-scope="scope">
                        <el-tooltip
                                class="item"
                                effect="dark"
                                :content="String(scope.row.documentsType)"
                                placement="top-start"
                        >
                            <span class="tablehidden" v-if="scope.row.documentsType===1">需求设计</span>
                            <span class="tablehidden" v-if="scope.row.documentsType===2">概要设计</span>
                            <span class="tablehidden" v-if="scope.row.documentsType===3">详细设计</span>
                            <!-- <span class="tablehidden">{{scope.row.documentsType}}</span> -->
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="submitterName" label="提交人" align="center">
                    <template slot-scope="scope">
                        <span class="tablehidden">{{scope.row.submitterName}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="principalList" label="负责人" align="center">
                    <template slot-scope="scope">

                        <span class="tablehidden" v-for="item in scope.row.principalList">{{item}}&nbsp;</span>
                    </template>
                </el-table-column>
                <el-table-column prop="opinionTitle" label="标题" align="center">
                    <template slot-scope="scope">
                        <el-tooltip
                                class="item"
                                effect="dark"
                                :content="scope.row.opinionTitle"
                                placement="top-start"
                        >
                            <span class="tablehidden">{{scope.row.opinionTitle}}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="gmtModified" label="最后操作时间" align="center" width="200">
                    <template slot-scope="scope">
                        <span class="tablehidden">{{scope.row.gmtModified}}</span>
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
                        <span class="tablehidden" v-if="scope.row.status===2">已解决</span>
                    </template>
                </el-table-column>
                <el-table-column prop="operation" label="操作" align="center" width="200">
                    <template slot-scope="scope">
                        <router-link @click.native="edit(scope.row.documentsType,scope.row.id)" to>
                            <i class="el-icon-edit"></i>
                            编辑
                        </router-link>


                        <router-link
                                :to="{ path: 'opinionView', query: { id: scope.row.id } }"
                        >
                            <i class="el-icon-search"></i>
                            查看意见
                        </router-link>
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
    </div>
</template>

<script>
    import {httpGet} from "@/utils/http.js";
    import {message, errTips} from "@/utils/tips.js";
    import {mapMutations} from "vuex";
    import {hoursSeconds} from "@/utils/getDate.js";

    export default {
        name: "documentOpinion",
        data() {
            return {
                projectId:null,
                projectList: [],
                demandList: [],
                userId: null,
                checked: false,
                loading: false,
                totalPage: 0,
                searchData: {
                    status: null,
                    is: 0,
                    pageSize: 10,
                    pageNo: 1,
                    orderType: "DESC",
                    orderBy: "id",
                    projectId: "",
                    missionId: "",
                    documentsType: ""
                },
                pageData: {
                    projectName: "",
                    status: null,
                    is: 0,
                    orderType: "DESC",
                    pageNo: 1,
                    pageSize: 10,
                    orderBy: "id"
                },
                tableData: []
            };
        },
        created: function () {
            this.projectId = this.$route.query.projectId;

            this.getDemandList(this.projectId);
            this.getView();
        },
        methods: {
            ...mapMutations(["setCache"]),

            getDemandList (value) {
                httpGet('/v1/authorization/documents/demanddesign/get', {id: value}).then(results => {
                    const {msg, data, httpCode} = results.data;
                    if (httpCode === 200) {
                        this.demandList = data.demandDesignList;
                    } else if (httpCode === 400) {
                        this.setCache('issueManage');
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                });
            },

            changeRadio: function (event) {
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
            toOpinionSum() {
                this.$router.push({path: "./opinionSum"});
            },
            toIssueManage() {
                this.$router.push({path: "./issueManage"});
            },
            toDocumentOpinion() {
                this.$router.push({path: "./documentOpinion"});
            },

            rowClass() {
                return "background:#F4F6F9;";
            },
            // openDia(content,title) {
            //   this.diaIndex = !this.diaIndex;
            //   this.content = content;
            //   this.title = title
            // },
            //新增缺陷
            newAdd() {

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
                httpGet("/v1/authorization/documents/search/get", val).then(results => {
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

            //id:文档意见编号
            edit(documentsType, id) {
                if (documentsType === 1) {
                    this.$router.push({path: 'editNeedDesign', query: {id: id}});
                } else {
                    if (documentsType === 2) {
                        this.$router.push({path: 'editOutlineDesign', query: {id: id}});
                    } else if (documentsType === 3) {
                        this.$router.push({path: 'editDetailedDesign', query: {id: id}});
                    }
                }
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

        .header_top {
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

        /* .header_top {
          margin-top: 15px;
          padding-bottom: 20px;
          button {
            margin-left: 20px;
          }
        } */
        /* .el-input {
          display: inline-block;
          width: 200px;
          margin-right: 25px;
        }
        .el-input__inner {
          border: 1px solid #c0c0c0;
          width: 200px;
          height: 35px;
          line-height: 35px;
        } */
        .el-table td,
        .el-table th.is-leaf {
            color: black;
            border-bottom: 1px solid #d8d8d8;
        }
    }

</style>

