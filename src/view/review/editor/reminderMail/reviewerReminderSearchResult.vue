<template>
    <div class="editor-container">
        <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 130%;margin-bottom: 20px;">
            <el-breadcrumb-item :to="{ path: '/editorManager' }">评审管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/editorReminderEmail' }">发送提醒邮件</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/editorReviewerReminder' }" v-if="isReminderEmail">评审专家提醒选项
            </el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/editorReviewInviteNoResponse'}" v-else>评审专家邀请未回复</el-breadcrumb-item>
            <el-breadcrumb-item>评审专家搜索结果</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="bid_footer">
            <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page.sync="pageData.pageNo"
                    :total="totalPage"
                    layout="prev, pager, next, jumper"
            ></el-pagination>
        </div>
        <el-table v-loading="loading" :data="expertList" style="margin:20px auto" border :header-cell-style="rowClass"
                  width="1500px">
            <el-table-column fixed label="操作" align="center">
                <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.isChoose" @change="idListChange(scope.row)"></el-checkbox>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="评审专家" align="center"></el-table-column>
            <el-table-column prop="loginTime" label="上次登录" align="center" width="100px;"></el-table-column>
            <el-table-column prop="title" label="相关评审任务" align="center"></el-table-column>
            <el-table-column prop="gmtCreate" label="评审邀请时间" align="center" width="100px;"></el-table-column>
            <el-table-column prop="receiveTime" label="评审接受时间" align="center" width="100px;"></el-table-column>
            <el-table-column prop="deadline" label="截止时间" align="center" width="100px;"></el-table-column>
            <el-table-column prop="surplus" label="距离截止日期(天)" align="center"></el-table-column>
            <el-table-column prop="emailSum" label="发送提醒邮件总数" align="center"></el-table-column>
            <el-table-column prop="emailInvite" label="邀请提醒已发送次数" align="center"></el-table-column>
            <el-table-column prop="emailDeadlineFront" label="截止日期前提醒次数" align="center"></el-table-column>
            <el-table-column prop="emailDeadlineRear" label="截止日期后提醒次数" align="center"></el-table-column>
        </el-table>
        <el-row style="margin-top: 30px;">
            <el-button style="margin-left:42%;" @click="goBack">返回</el-button>
            <el-button type="primary" style="margin-left:20px;" @click="submitExpertList">下一步</el-button>
        </el-row>
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
    import {httpGet, httpPost} from "@/utils/http.js";
    import {message, successTips, errTips} from "@/utils/tips.js";
    import {specificDate} from "@/utils/getDate";

    export default {
        name: "reviewReminderSearchResult",
        props: {
            searchData: {
                type: String,
                default: null,
            }
        },
        created() {
            this.getSearchResult();
        },
        data() {
            return {
                loading: false,
                expertList: [],
                idList: [],//评审专家邀请信息编号列表
                expertIdList: [],//评审专家id编号
                pageData: {
                    pageNo: 1,
                    pageSize: 10,
                    orderBy: "loginTime",
                    orderType: "DESC",
                },
                totalPage: 0,
            };
        },
        computed: {
            isReminderEmail: function () {//是否是从提醒者页面进来的
                let searchData = JSON.parse(this.searchData);
                if ("gmtCreateExceed" in searchData || "gmtCreateWithin" in searchData) {
                    return false;
                } else {
                    return true;
                }
            }
        },
        methods: {
            getSearchResult() {

                let searchData = JSON.parse(this.searchData);
                searchData = Object.assign(this.pageData, searchData);//searchData和pageData会合并在一起，两者都发生改变
                httpGet("v1/authorization/review/byadminmission/search", searchData).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 200) {
                        for (let item of data.expertList) {
                            item.deadline = specificDate(item.deadline);
                            item.gmtCreate = specificDate(item.gmtCreate);
                            item.loginTime = specificDate(item.loginTime);
                            item.receiveTime = specificDate(item.receiveTime);
                        }
                        this.expertList = data.expertList;
                    }else if(msg === "该条件暂无数据"){
                        message(msg);
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                });
            },
            idListChange(row) {
                let id = row.id;
                let index = this.idList.indexOf(id);
                if (row.isChoose === true) {//选中了标签
                    if (index === -1) {//列表中没有当前id
                        this.idList.push(row.id);
                    }
                } else {//取消了标签
                    if (index > 0) {//列表中有当前id
                        this.idList.splice(index, 1);
                    }
                }
            },
            submitExpertList() {
                if (this.idList.length === 0) {
                    errTips("请先选择专家！");
                    return;
                }
                httpPost("/v1/authorization/review/experteid/list", {idList: this.idList}).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 200) {
                        this.expertIdList = data.expertList;//专家编号ID集合,这一块后端的命名不是很好，容易产生误解
                        this.$router.push({
                            name: 'editorCustomizeAndSendEmail',
                            params: {expertIdList: JSON.stringify(this.expertIdList)}
                        });
                    } else {
                        errTips(msg);
                    }
                });

            },
            handleCurrentChange(val) { //对应分页栏的换页操作
                this.pageData.pageNo = val;
                this.getSearchResult();
            },
            rowClass() {
                return "background:#F4F6F9;";
            },
            goBack() {
                this.$router.go(-1);
            }
        }
    }
</script>

<style scoped>
    .editor-container {
        width: 100%;
    }

    .bid_footer {
        margin-left: 38%;
        margin-top: 10px;
    }
</style>
