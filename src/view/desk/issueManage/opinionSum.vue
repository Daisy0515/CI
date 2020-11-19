<template>
    <div class="applicationView">
        <div class="Crumbs">
            <div class="container deskHeader">
                <h4>
                    您的位置：
                    <router-link to="./documentOpinion">文档意见</router-link>&nbsp;>
                    <span class="active">意见汇总</span>
                </h4>
            </div>
        </div>
        <div class="container deskHeader">
            <div class="header_top">
                <el-select v-model="searchData.projectId" clearable placeholder="请选择项目名称" @change="changeProject">
                    <el-option v-for="item in projectList" :key="item.projectId" :label="item.projectName"
                               :value="item.projectId"></el-option>
                </el-select>
                <el-select v-model="searchData.missionId" clearable placeholder="请选择需求名称">
                    <el-option v-for="item in demandList" :key="item.id" :label="item.content"
                               :value="item.id"></el-option>
                </el-select>
                <el-select v-model="searchData.documentsType" clearable placeholder="请选择文档类型">
                    <el-option label="需求设计文档" value="1"></el-option>
                    <el-option label="概要设计文档" value="2"></el-option>
                    <el-option label="详细设计文档" value="3"></el-option>

                </el-select>
                <div class="buttons">
                    <el-button size="primary" @click="searchList()">搜索</el-button>
                </div>
            </div>
            <el-card class="box-card0">
                <ul class="services">
                    <li class="serviceItem clearfix" v-for="(item, index) in opinionSummaryList " :key="index">
                        <div style="border: #d8d8d8 1px solid; padding: 10px 20px 20px 10px; box-shadow: 0 2px 2px 0 rgba(0,0,0,.1);">
                    <li>
                        意见标题：{{item.opinionTitle}}
                    </li>
                    <li>
                        提交人：{{item.submitterName}}

                    </li>
                    <li>

                        描述：{{item.opinionDescription}}

                    </li>
                    <!-- <span>{{item.opinionTitle}}</span> -->

                    <!-- <div class="clearfix rhythmMargin">
                        <div class="serviceHeader clearfix">
                            <span class="servTitle">
                                <h2>
                                    <a href="javascript:;">{{ item.opinionTitle  }}</a>
                                </h2>
                            </span>
                        </div>
                    </div> -->


        </div>
        </li>
        </ul>
        <el-button type="primary" @click="returnDO" size="medium" style="width:150px;margin-left:45%;margin-top: 5%;">
            返回
        </el-button>
        </el-card>
    </div>
    </div>
</template>
<script>
    import {httpGet, httpPost} from "@/utils/http.js";
    import {specificDate} from "@/utils/getDate.js";
    import {errTips} from "@/utils/tips.js";
    import {mapMutations, mapActions, mapGetters} from "vuex";

    export default {
        data() {
            return {
                opinionSummaryList: [],
                projectList: [],
                demandList: [],
                id: "",
                list: [{value: "是"}, {value: "否"}],
                //parentValue: "",
                typeValue: "",
                ruleForm: {},
                searchData: {
                    projectId: "",
                    missionId: "",
                    documentsType: "",
                },
            };
        },
        created: function () {
            this.getProjectList();
        },

        methods: {
            ...mapMutations(["setCache"]),
            returnSquare() {
                this.$router.push({path: "./testEmploy"});
            },
            returnDO() {
                this.$router.push({path: 'documentOpinion'});
            },
            getProjectList() {
                httpGet('/v1/authorization/documents/projectid/get').then(results => {
                    const {msg, data, httpCode} = results.data;
                    if (httpCode === 200) {
                        this.projectList = data.projectList;
                    } else if (httpCode === 400) {
                        this.setCache('issueManage'); //???????
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                });
            },
            changeProject: function (value) {
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
            searchList() {
                let {searchData} = this;
                this.getView(searchData);
            },
            getView(val) {
                this.loading = true;
                httpGet("/v1/authorization/documents/Opinionsummary/get", val).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 200) {
                        //alert(1000);
                        //alert(data[0].opinionTitle)
                        this.opinionSummaryList = data.opinionSummaryList;

                        // alert(this.opinionSummaryList[0].opinionTitle);
                    } else if (msg === "该条件暂无数据") {
                        this.opinionSummaryList = [];
                        message("该条件暂无数据");
                    }
                    this.loading = false;
                });
            },

        }
    };
</script>
<style lang='scss'>
    @import "@/assets/scss/applicationView.scss";

    .applicationView {
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
            margin-top: 15px;
            padding-bottom: 20px;

            button {
                margin-left: 20px;
            }
        }

        .el-input {
            display: inline-block;
            width: 200px;
            margin-right: 25px;
        }

        .el-input__inner {
            border: 1px solid #c0c0c0;
            width: 200px;
            height: 35px;
            line-height: 35px;
        }

        .el-table td,
        .el-table th.is-leaf {
            color: black;
            border-bottom: 1px solid #d8d8d8;
        }
    }

    .box-card0 {
        li {
            margin-top: 15px;
            padding-top: 5px;
            color: #666;
            position: relative;
            cursor: pointer;

        }
    }
</style>
