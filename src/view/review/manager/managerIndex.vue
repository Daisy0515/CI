<template>
    <div class="manager-container">
        <el-row :gutter="40">
            <el-col :span="16">
                <el-card class="left-card-menu">
                    <el-row style="margin-bottom: 20px;"><h1 style="text-align: left">评审汇总</h1></el-row>
                    <el-row style="margin-bottom: 20px;" :gutter="20">
                        <el-col :span="6">
                            <el-card>
                                <router-link to="/managerNotAccept">
                                    <h1>{{ acceptCount }}</h1>
                                    <el-button type="text">未接受</el-button>
                                </router-link>
                            </el-card>
                        </el-col>
                        <el-col :span="6">
                            <el-card>
                                <router-link to="/managerReview">
                                    <h1>{{ reviewCount }}</h1>
                                    <el-button type="text">评审中</el-button>
                                </router-link>
                            </el-card>
                        </el-col>
                        <el-col :span="6">
                            <el-card>
                                <router-link to="/managerAboutTimeout">
                                    <h1>{{ aboutTimeoutCount }}</h1>
                                    <el-button type="text">即将超时</el-button>
                                </router-link>
                            </el-card>
                        </el-col>
                        <el-col :span="6">
                            <el-card>
                                <router-link to="/managerAlreadyTimeout">
                                    <h1>{{ alreadyTimeoutCount }}</h1>
                                    <el-button type="text">已经超时</el-button>
                                </router-link>
                            </el-card>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card class="right-card-menu">
                    <el-row style="margin-bottom: 25px;">
                        <el-card>
                            <el-button type="text" @click="dialogSubmitVisible = true">发起评审</el-button>
                        </el-card>
                    </el-row>
                    <el-row style="margin-bottom: 15px;">
                        <el-card>
                            <el-button type="text" class="button" @click="getTips">评审模板</el-button>
                        </el-card>
                    </el-row>
                </el-card>
            </el-col>
        </el-row>
        <submit-review :form="form" :title="submitTitle" :dialogSubmitVisible="dialogSubmitVisible"
                       :projectList="projectList" :isShowSubmitHistory="isShowSubmitHistory"
                       @closeSubmitDialog="closeSubmitDialog">
        </submit-review>

    </div>
</template>

<script>
    import submitReview from '@/view/review/manager/components/submitReview';
    import {httpGet,} from "@/utils/http.js";
    import {message, errTips} from "@/utils/tips.js";

    export default {
        components: {
            submitReview
        },
        name: 'managerIndex',
        data() {
            return {
                role: 2,
                submitTitle: "发起评审",
                dialogSubmitVisible: false, // 开启发起评审视窗
                isShowSubmitHistory: false, // 是否显示附件的提交历史，在发起评审里面不用显示，设置为false
                aboutTimeoutCount: 0,       // 即将超时
                acceptCount: 0,             // 未接受
                alreadyTimeoutCount: 0,     // 已经超时
                reviewCount: 0,             // 评审中
                form: this.getInitForm(),   //发起评审用到的表单
                projectList: [],            //当前用户所竞标的项目列表，发起评审时，用于项目选择
            }
        },
        computed: {},
        created: function () {
            this.getView();
            this.getUserProjectList();
        },
        methods: {

            getView() {
                httpGet("/v1/authorization/review/summarizing/get", {role: this.role}).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 200) {
                        this.acceptCount = data.acceptCount;
                        this.reviewCount = data.reviewCount;
                        this.aboutTimeoutCount = data.aboutTimeoutCount;
                        this.alreadyTimeoutCount = data.alreadyTimeoutCount;
                    } else if (msg === "该条件暂无数据") {
                        message("该条件暂无数据");
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                });
            },
            getUserProjectList() { //获取当前用户中标处于执行中的项目
                httpGet("/v1/authorization/review/projectid/get").then(results => {
                    const {httpCode, data} = results.data;
                    if (httpCode === 200) {
                        this.projectList = data.projectList;
                    }
                });
            },
            getTips() {
                message("暂未开放，敬请期待！");
            },
            getInitForm() {
                return {
                    content: "",
                    deadline: "",
                    projectId: null,
                    purpose: "",
                    resourceList: [],
                    title: "",
                    type: null,
                };
            },
            closeSubmitDialog() {
                this.dialogSubmitVisible = false;
                this.form = this.getInitForm();//初始化form

            },
        }
    }
</script>

<style lang="scss" scoped>
    .manager {
        &-container {
            text-align: center;
            // margin-left:-10%;
        }

        .text {
            font-size: 14px;
        }

        .item {
            padding: 18px 0;
        }

    }
</style>
