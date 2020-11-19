<template>
    <div class="editor-container">
        <el-row :gutter="40">
            <el-col :span="16">
                <el-card class="left-card-menu" v-loading="loading">
                    <el-row style="margin-bottom: 20px;"><h1 style="text-align: left"><i class="el-icon-menu"></i>&nbsp发送提醒邮件
                    </h1></el-row>
                    <el-row style="margin-bottom: 20px;" :gutter="20">
                        <el-col :span="8" :offset="2">
                            <el-card>
                                <router-link to="/editorReviewerReminder">
                                    <span>评审专家提醒</span>
                                </router-link>
                            </el-card>
                        </el-col>
                        <el-col :span="8" :offset="4">
                            <el-card>
                                <router-link to="/editorReviewInviteNoResponse">
                                    <span>评审专家邀请未回复</span>
                                </router-link>
                            </el-card>
                        </el-col>
                    </el-row>
                    <el-row style="margin-bottom: 20px;" :gutter="20">
                        <el-col :span="8" :offset="2">
                            <el-card>
                                <router-link to="/editorMailTemplates">
                                    <span>邮件模板</span>
                                </router-link>
                            </el-card>
                        </el-col>
                        <el-col :span="8" :offset="4">
                            <el-card>
                                <router-link to="/editorUniversalMail">
                                    <span>通用邮件</span>
                                </router-link>
                            </el-card>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {httpGet, httpDelete} from "@/utils/http.js";
    import {specificDate} from '@/utils/getDate.js';
    import {message, successTips, errTips} from "@/utils/tips.js";

    export default {
        data() {
            return {
                loading: false,
                role: 2,
                dialogSubmitVisible: false, // 开启发起评审视窗

            }
        },
    }
</script>

<style lang="scss" scoped>
    .editor {
        &-container {
            text-align: center;
            margin-left: 20px;
        }

        .text {
            font-size: 16px;
            color: #bcbfc3;
        }

        .item {
            padding: 18px 0;
        }

    }

    .subtitle {
        font-size: 14px;
        color: #bcbfc3;
    }
</style>
