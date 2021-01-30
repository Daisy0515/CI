<template>
    <div class="projectd">
        <div class="header">
            <div class="container deskHeader">
                <h4>工作台</h4>
            </div>
        </div>
        <div class="container deskHeader">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>用户信息</span>
                </div>
                <div class="content">
                    <div class="content_top">
                        <img :src="getuserData.headurl?getuserData.headurl:getnoImg"/>
                        <div class="content_name">
                            <h6>{{getuserData.userName?getuserData.userName:getuserData.companyName}}</h6>
                            <h6 class="type">{{getuserData.role===1?"个人用户":"企业用户"}}</h6>
                        </div>
                    </div>
                </div>
                <ul class="content_main">
                    <li>
                        <h6>用户资料</h6>
                    </li>
                    <li>
                        <h6>
                            <i class="el-icon-message" aria-hidden="true"></i>
                            {{getuserData.email}}
                        </h6>
                    </li>
                    <li>
                        <h6>
                            <i class="el-icon-mobile-phone" aria-hidden="true"></i>
                            {{getuserData.phone}}
                        </h6>
                    </li>
                    <li v-if="sex">
                        <h6>
                            <i class="icon iconfont icon-xingbienv" aria-hidden="true"></i>
                            性别：{{sex}}
                        </h6>
                    </li>
                    <li v-if="getuserData.role === 2">
                        <h6>
                            <i class="icon iconfont icon-xingbienv" aria-hidden="true"></i>
                            地址：{{getuserData.province}}{{getuserData.city}}{{getuserData.address}}
                        </h6>
                    </li>
                </ul>
                <div class="bottom_clearfix">
                    <div class="time">
                        <router-link to="/desk/changePersonal">
                            <i class="el-icon-edit"></i>编辑
                        </router-link>
                    </div>
                </div>
            </el-card>
            <el-card class="box-card2" v-loading="loading">
                <div slot="header" class="clearfix">
                    <span>最近项目</span>
                </div>
                <div class="tem_main">
                    <el-table :data="projectData">
                        <el-table-column fixed prop="projectName" label="项目名称" align="center"></el-table-column>
                        <el-table-column prop="accomplishProgress" label="项目进度" align="center"></el-table-column>
                        <el-table-column prop="roleName" label="角色" align="center"></el-table-column>
                        <el-table-column prop="type" label="项目类型" align="center"></el-table-column>
                        <el-table-column prop="userName" label="负责人" align="center"></el-table-column>
                        <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                                <router-link to>
                                    <i class="el-icon-search"></i>
                                    <el-button type="text" @click="openGantt(scope.row.teamId)">查看</el-button>
                                </router-link>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <el-dialog
                        width="1200px"
                        title="任务进度"
                        :visible.sync="dialogTableVisible"
                        :append-to-body="true"
                >
                    <div id="gant" style="height:500px;width:100%">
                        <Gantt class="left-container" :tasks="tasks"/>
                    </div>
                </el-dialog>
                <div class="project_footer">
                    <el-pagination
                            @current-change="handleCurrentChange"
                            :current-page.sync="pageData.pageNo"
                            :page-size="pageData.pageSize"
                            :total="totalPage"
                            layout="prev, pager, next"
                    ></el-pagination>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapMutations} from "vuex";
    import {httpGet} from "@/utils/http.js";
    import {errTips} from "@/utils/tips.js";
    import {timeReversal, timestamp} from "@/utils/getDate.js";
    import Gantt from "@/common/gantt/gantt";

    export default {
        components: {
            Gantt
        },
        data() {
            return {
                dialogTableVisible: false,
                dialogFormVisible: false,
                sex: "",
                userData: {},
                projectData: [],
                pageNo: 1,
                totalPage: 0,
                loading: false,
                pageData: {
                    pageSize: 4,
                    pageNo: 1,
                    orderBy: "id",
                    orderType: "DESC"
                },
                tasks: {
                    data: []
                }
            };
        },
        computed: {
            ...mapGetters(["getuserData", "getnoImg", "getdiaLog"])
        },
        created: function () {
            //甘特图配置
            gantt.config.readonly = true;
            gantt.config.columns = [
                {name: "text", align: "center", resize: true},
                {name: "start_date", align: "center", resize: true},
                {
                    name: "duration",
                    align: "center",
                    template: task => {
                        let duration = task.durationTime;
                        return duration;
                    }
                }
            ];
            if (this.getuserData.sex === 3) {
                this.sex = "未知";
            } else if (this.getuserData.sex === 1) {
                this.sex = "男";
            } else if (this.getuserData.sex === 2) {
                this.sex = "女";
            }
            this.getView();
        },
        methods: {
            ...mapMutations(["setdiaLog"]),
            //打开甘特图
            openGantt(id) {
                httpGet("/v1/authorization/bids/ganttchart/get", {
                    id: id
                }).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 200) {
                        this.dialogTableVisible = true;
                        let {ganttChartList} = data;
                        let newList = ganttChartList.map(item => {

                            return {
                                id: item.id,
                                start_date: timeReversal(item.startTime),
                                end_date: timestamp(item.endTime),
                                text: item.content,
                                name: item.participantList,
                                durationTime: item.sustainTime,
                                progress: item.accomplishProgress * 0.01
                            };
                        });
                        this.$set(this.tasks, "data", newList);
                        this.setdiaLog(!this.getdiaLog);
                    } else if (msg === "不存在任务信息") {
                        errTips("暂未创建任务");
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                });
            },
            //页码变化
            handleCurrentChange(val) {
                this.pageData.pageNo = val;
                this.getView(this.pageData);
            },
            //获取页面数据
            getView() {
                this.loading = true;
                httpGet("/v1/authorization/bid/projectprogress/list", this.pageData).then(
                    results => {
                        const {httpCode, msg, data} = results.data;
                        if (httpCode === 200) {
                            this.totalPage = parseInt(data.totalCount);
                            let {list, typeList} = data;
                            if (list === null) {
                                this.loading = false;
                                return false;
                            }
                            for (let i of list) {
                                for (let p of typeList) {
                                    if (i.parentId === p.id) {
                                        i.parentName = p.type;
                                    }
                                    if (i.typeId === p.id) {
                                        i.typetName = p.type;
                                        i.type = i.parentName + "/" + p.type;
                                    }
                                }
                                i.accomplishProgress = i.accomplishProgress + "%";
                            }
                            this.projectData = list;
                        } else if (httpCode !== 401) {
                            errTips(msg);
                        }
                        this.loading = false;
                    }
                );
            }
        }
    };
</script>
<style lang='scss'>
    .el-dialog__body {
        padding-top: 10px;
    }

    .projectd {
        .time {
            line-height: 26px;

            i {
                margin-right: 5px;
            }
        }

        .tem_main {
            height: 360px;
        }

        .project_footer {
            text-align: center;
        }

        i {
            display: inline-block;
        }

        .itone {
            border-bottom: 1px solid #e8e8e8;
            padding-bottom: 3px;

            & div {
                float: left;
                font-size: 14px;
            }
        }

        .itone div a {
            float: left;
            margin-right: 5px;
        }

        .itone div:nth-child(1) {
            width: 60%;
        }

        .itone div:nth-child(2) {
            width: 20%;
        }

        .content {
            .content_top {
                padding: 25px 20px 0 20px;
            }

            img {
                float: left;
                width: 38px;
                height: 38px;
            }

            .content_name {
                margin-left: 15px;
                float: left;

                & h6:nth-child(1) {
                    font-size: 15px;
                    color: #4c83c3;
                    font-weight: 600;
                }

                & h6:nth-child(2) {
                    font-size: 14px;
                    color: #666;
                }
            }
        }

        .content_main {
            margin-top: 0px;
            padding: 15px 20px 0 20px;
            height: 310px;

            &::after {
                content: "";
                display: table;
                clear: both;
            }
        }

        .content_main li h6 {
            padding-top: 10px;
            letter-spacing: 1px;
            font-size: 15px;
            color: #666;
        }

        .projectd {
            & ::after {
                content: "";
                clear: both;
                display: table;
            }
        }

        .header {
            border-bottom: 1px solid #f0f0f0;
            padding: 18px;
        }

        .project {
            margin-top: 50px;
        }

        .el-card__header {
            background: #f8f8f8;
            padding: 10px;
            border-bottom: 1px solid #d8d8d8;
        }

        .box-card {
            margin-top: 20px;
            width: 33%;
            height: 473px;
            float: left;

            & ::after {
                content: "";
                clear: both;
                display: table;
            }

            .el-card__body {
                padding: 0;
            }

            span {
                font-size: 16px;
            }
        }

        .bottom_clearfix {
            background: #f8f8f8;
            font-size: 14px;
            padding: 10px;
            height: 30px;
            color: #4c83c3;
        }

        .box-card2 {
            margin-top: 20px;
            width: 64%;
            float: right;

            & ::after {
                content: "";
                clear: both;
                display: table;
            }
        }

        .text {
            font-size: 15px;
        }

        &::after {
            content: "";
            display: table;
            clear: both;
        }
    }
</style>
