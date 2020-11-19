<template>
    <div class="manager-container">
        <el-row :gutter="40">
            <el-col :span="16">
                <el-card class="left-card-menu">
                    <el-row style="margin-bottom: 20px;"><h1 style="text-align: left"><i class="el-icon-edit"></i>&nbsp;待处理任务
                    </h1></el-row>
                    <el-row style="margin-bottom: 20px;" :gutter="20">
                        <el-col :span="6">
                            <el-card shadow="hover" style="height: 120px;">
                                <router-link :to="{name:'editorReviewTodo',query:{status:1}}"> <!--0 表示新的任务-->
                                    <h1>{{ mission }}</h1>
                                    <!-- <el-button type="text">新的任务</el-button> -->
                                </router-link>
                                <span class="subtitle">新的任务</span>
                            </el-card>
                        </el-col>
                        <el-col :span="6">
                            <el-card shadow="hover" style="height: 120px;">
                                <router-link :to="{name:'editorReviewTodo',query:{status:2,statusExplain:1,}}">
                                    <!--1 表示评审专家完成评审-->
                                    <h1>{{ expertAccomplish }}</h1>
                                    <!-- <el-button type="text">评审专家完成评审</el-button> -->
                                </router-link>
                                <!-- <el-button type="text">评审专家完成评审</el-button> -->
                                <span class="subtitle">评审专家完成评审</span>
                            </el-card>
                        </el-col>
                        <el-col :span="6">
                            <el-card shadow="hover" style="height: 120px;">
                                <router-link :to="{name:'editorReviewTodo',query:{status:2,statusExplain:2,}}">
                                    <!--2 表示需要额外评审专家-->
                                    <h1>{{ extraExpert }}</h1>
                                    <!-- <el-button type="text">需要额外评审专家</el-button> -->
                                </router-link>
                                <span class="subtitle">需要额外评审专家</span>
                            </el-card>
                        </el-col>
                        <el-col :span="6">
                            <el-card shadow="hover" style="height: 120px;">
                                <router-link :to="{name:'editorReviewTodo',query:{status:2,statusExplain:3,}}">
                                    <!--3 表示评审延期-->
                                    <h1>{{ postpone }}</h1>
                                    <!-- <el-button type="text">评审延期</el-button> -->
                                </router-link>
                                <span class="subtitle">评审延期</span>
                            </el-card>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>

            <el-col :span="7">
                <el-card class="right-card-menu">
                    <el-row style="margin-bottom: 20px;"><h1 style="text-align: left">评审中</h1></el-row>
                    <el-row style="margin-bottom: 10px;">
                        <el-card shadow="hover" style="height: 60px;">
                            <el-row :gutter="20">
                                <router-link :to="{name:'editorReviewTodo',query:{status:2,statusExplain:4,}}">
                                    <!--4 表示评审邀请未回复-->
                                    <el-col :span="20">
                                        <!-- <el-button type="text" style="font-size: 16px;">评审邀请未回复</el-button> -->
                                        <span class="subtitle">评审邀请未回复</span>
                                    </el-col>
                                    <el-col :span="4"><h2>{{ inviteNoReply }} </h2></el-col>
                                </router-link>
                            </el-row>
                        </el-card>
                    </el-row>
                    <el-row style="margin-bottom: 10px;">
                        <el-card shadow="hover" style="height: 60px;">
                            <el-row :gutter="20">
                                <router-link :to="{name:'editorReviewTodo',query:{status:2}}">   <!--5 表示评审进行中-->
                                    <el-col :span="20">
                                        <!-- <el-button type="text" style="font-size: 16px;" >评审进行中</el-button> -->
                                        <span class="subtitle">评审进行中</span>
                                    </el-col>
                                    <h2>{{underway}}</h2>
                                </router-link>
                            </el-row>
                        </el-card>
                    </el-row>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {httpGet,} from "@/utils/http.js";
    import {message, errTips} from "@/utils/tips.js";

    export default {
        data() {
            return {
                role: 2,
                submitTitle: "发起评审",
                expertAccomplish: 0,//评审专家完成评审 ,
                extraExpert: 0,//需要额外评审专家 ,
                inviteNoReply: 0,//评审邀请未回复 ,
                mission: 0,// 新的任务 ,
                postpone: 0,//评审延期 ,
                underway: 0,//评审进行中
            }
        },
        created: function () {
            this.getView();
        },
        methods: {
            getView() {
                httpGet("/v1/authorization/review/statusexplain/get").then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 200) {
                        this.expertAccomplish = data.expertAccomplish;
                        this.extraExpert = data.extraExpert;
                        this.inviteNoReply = data.inviteNoReply;
                        this.mission = data.mission;
                        this.postpone = data.postpone;
                        this.underway = data.underway;
                    } else if (msg === "该条件暂无数据") {
                        this.tableData = [];
                        message("该条件暂无数据");
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }

                });
            },
        }
    }
</script>

<style lang="scss" scoped>
    .manager {
        &-container {
            text-align: center;
            margin-left: 20px;
        }

        .text {
            font-size: 16px;
        }

        .item {
            padding: 18px 0;
        }

    }

    .subtitle {
        font-size: 14px;
        color: #bcbfc3;
        height: 10px;
    }

    .numtitle {
        color: black;
        margin-bottom: 10px;
    }
</style>
