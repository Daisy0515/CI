<template>
    <div class="editor-container">
        <el-row :gutter="40">
            <el-col :span="16">
                <el-card class="left-card-menu">
                    <el-row style="margin-bottom: 40px;"><h1 style="text-align: left">评审管理</h1></el-row>
                    <el-row style="margin-bottom: 30px;" :gutter="20">
                        <el-col :span="6">
                            <el-card shadow="hover">
                                <router-link to="/registerNewUser">
                                    <el-button type="text" class="editor-button">注册新用户</el-button>
                                </router-link>
                            </el-card>
                        </el-col>
                        <el-col :span="6">
                            <el-card>
                                <router-link to="/editorReminderEmail">
                                    <el-button type="text" class="editor-button">发送提醒邮件</el-button>
                                </router-link>
                            </el-card>
                        </el-col>
                        <el-col :span="6">
                            <router-link to="/editorReviewTemplateConfig">
                                <el-card>
                                    <el-button type="text" class="editor-button">评审模板配置</el-button>
                                </el-card>
                            </router-link>
                        </el-col>
                        <el-col :span="6">
                            <router-link to="/editorReviewTemplates">
                                <el-card>
                                    <el-button type="text" class="editor-button">已有评审模板</el-button>
                                </el-card>
                            </router-link>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>

    export default {
        data() {
            return {

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

        &-button {
            margin-top: 15px;
            margin-bottom: 10px;
            font-size: 15px;
        }

        .text {
            font-size: 14px;
        }

        .item {
            padding: 18px 0;
        }

    }
</style>
