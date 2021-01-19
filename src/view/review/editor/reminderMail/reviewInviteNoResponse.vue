<template>
    <div class="editor-container">
        <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 130%;margin-bottom: 20px;">
            <el-breadcrumb-item :to="{ path: '/editorManager' }">评审管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/editorReminderEmail' }">发送提醒邮件</el-breadcrumb-item>
            <el-breadcrumb-item>评审专家邀请未回复</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row style="margin-bottom: 10px;"><h1 style="text-align: left">评审专家邀请未回复</h1></el-row>
            <el-row>
                <el-col :span="2">
                    <el-checkbox-group v-model="checkList">
                        <el-checkbox :label="1" style="margin-top: 10px;"><span style="font-size: large;">选中:</span>
                        </el-checkbox>
                        <el-checkbox :label="2" style="margin-left:-15px;margin-top:25px;"><span
                                style="font-size:large;">选中:</span></el-checkbox>
                    </el-checkbox-group>
                </el-col>
                <el-col :span="20">
                    <el-row style="font-size: large;margin-top: 8px;margin-left: -13px;">
                        <el-col :span="8">展示所有评审邀请发送超过</el-col>
                        <el-col :span="4">
                            <el-input size="small" style="margin-top: -5px" v-model="gmtCreateExceed"/>
                        </el-col>
                        <el-col :span="5">天的评审专家</el-col>
                    </el-row>
                    <el-row style="font-size: large;margin-top: 12px;margin-left: -3px;">
                        <el-col :span="9">展示所有评审邀请发送时间在最近</el-col>
                        <el-col :span="4">
                            <el-input size="small" style="margin-top: -5px" v-model="gmtCreateWithin"/>
                        </el-col>
                        <el-col :span="5">天内的评审专家</el-col>
                    </el-row>
                </el-col>
            </el-row>
            <el-row style="margin-top: 30px;">
                <el-button style="margin-left:-10%;" @click="goBack">返回</el-button>
                <el-button type="primary" style="margin-left:20px;" @click="search">搜索</el-button>
            </el-row>
        </el-card>
    </div>
</template>

<script>
    import {errTips} from "@/utils/tips.js";

    export default {
        data() {
            return {
                checkList: [],
                gmtCreateExceed: 5,//邀请时间超过#天的评审人员
                gmtCreateWithin: 5,//邀请时间在最近#天内的评审人员
            }
        },
        methods: {
            goBack() {//返回上一级
                this.$router.go(-1);
            },
            search() {
                if (this.checkList.length == 0) {
                    errTips("请先选择查询条件");
                    return;
                }
                let searchData = {};
                console.log(this.checkList);
                if (this.checkList.includes(1)) {
                    searchData.gmtCreateExceed = this.gmtCreateExceed;
                }
                if (this.checkList.includes(2)) {
                    searchData.gmtCreateWithin = this.gmtCreateWithin;
                }
                this.$router.push({
                    name: 'editorReviewerReminderSearchResult',
                    params: {searchData: JSON.stringify(searchData)}
                })

            },
        }
    }
</script>

<style lang="scss" scoped>
    .editor {
        &-container {
            text-align: center;
        }

        &-button {
            margin-top: 0px;
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
