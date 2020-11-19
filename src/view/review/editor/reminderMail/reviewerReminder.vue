<template>
    <div class="editor-container">
        <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 130%;margin-bottom: 20px;">
            <el-breadcrumb-item :to="{ path: '/editorManager' }">评审管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/editorReminderEmail' }">发送提醒邮件</el-breadcrumb-item>
            <el-breadcrumb-item>评审专家提醒选项</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row style="margin-bottom: 10px;"><h1 style="text-align: left">评审专家提醒选项</h1></el-row>
            <el-row>
                <el-col :span="2">
                    <el-radio-group v-model="radio">
                        <el-radio :label="1" style="margin-top: 10px;"><span style="font-size: large;">选中:</span>
                        </el-radio>
                        <el-radio :label="2" style="margin-top: 25px;"><span style="font-size: large;">选中:</span>
                        </el-radio>
                        <el-radio :label="3" style="margin-left:-30px;margin-top:25px;"><span
                                style="font-size:large;">选中:</span></el-radio>
                    </el-radio-group>
                </el-col>
                <el-col :span="20">
                    <el-row style="font-size: large;margin-top: 8px;margin-left: 2px;">
                        <el-col :span="3">显示需要在</el-col>
                        <el-col :span="4">
                            <el-input size="small" style="margin-top: -5px" v-model="aboutTimeout"/>
                        </el-col>
                        <el-col :span="6">天内提交评审结果的专家</el-col>
                    </el-row>
                    <el-row style="font-size: large;margin-top: 12px;margin-left: -3px;">
                        <el-col :span="6">显示已过评审截止日期</el-col>
                        <el-col :span="4">
                            <el-input size="small" style="margin-top: -5px" v-model="postpone"/>
                        </el-col>
                        <el-col :span="6">天还未完成任务的专家</el-col>
                    </el-row>
                    <el-row style="font-size: large;margin-top: 12px;">
                        <span style="margin-left:-105px;">显示需在
                        <el-date-picker
                                v-model="submitTimeStart"
                                :picker-options="startDatePicker"
                                type="date"
                                placeholder="选择开始时间"
                                value-format="yyyy-MM-dd"
                        ></el-date-picker>至
                        <el-date-picker
                                v-model="submitTimeEnd"
                                :picker-options="endDatePicker"
                                type="date"
                                placeholder="选择结束时间"
                                value-format="yyyy-MM-dd"
                        ></el-date-picker>
                       内完成评审的专家
                        </span>
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
                radio: null,
                aboutTimeout: 5,//截止日期XX天内的评审人员
                postpone: 5,//截止日期晚XX天内的评审人员
                submitTimeStart: null,//截止开始日期
                submitTimeEnd: null,//截止结束日期
                startDatePicker: this.startDate(),
                endDatePicker: this.endDate(),
            }
        },
        methods: {
            startDate() {
                const self = this;
                return {
                    disabledDate(time) {
                        if (self.submitTimeEnd) {//如果结束时间不为空，则小于结束时间
                            return time.getTime() > new Date(self.submitTimeEnd).getTime();
                        }
                    }
                };
            },
            endDate() {
                const self = this;
                return {
                    disabledDate(time) {
                        if (self.submitTimeStart) {//如果开始时间不为空，则结束时间大于开始时间
                            let newTime = new Date(self.submitTimeStart).getTime() - 86400000;
                            return time.getTime() < newTime;
                        }
                    }
                };
            },
            goBack() {
                this.$router.push('/editorReminderEmail');
            },
            search() {
                if (this.radio === null) {
                    errTips("请先选择查询条件");
                    return;
                }
                let searchData = {};
                if (this.radio === 1) {
                    searchData.aboutTimeout = this.aboutTimeout;
                } else if (this.radio === 2) {
                    searchData.postpone = this.postpone;
                } else {
                    searchData.submitTimeStart = this.submitTimeStart;
                    searchData.submitTimeEnd = this.submitTimeEnd;
                }
                this.$router.push({
                    name: 'editorReviewerReminderSearchResult',
                    params: {searchData: JSON.stringify(searchData)}
                })

            },
            submitExpertList() {

            },
            rowClass() {
                return "background:#F4F6F9;";
            }
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
