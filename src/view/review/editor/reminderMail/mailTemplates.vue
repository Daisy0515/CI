<template>
    <div>
        <div style="padding-left: 10px;margin-buttom:30px;">
            <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 130%;">
                <el-breadcrumb-item :to="{ path: '/editorIndex' }">评审管理员</el-breadcrumb-item>
                <el-breadcrumb-item :to="{path:'/editorManager'}">评审管理</el-breadcrumb-item>
                <el-breadcrumb-item :to="{path:'/editorReminderEmail'}">发送提醒邮件</el-breadcrumb-item>
                <el-breadcrumb-item>邮件模板</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <h3 style="margin: 20px auto;font-weight: bolder;">已有邮件模板:</h3>
        <el-row >
            <el-button type="primary" size="medium" style="margin-top: 20px;"> 添加个人模板 </el-button>
        </el-row>
        <el-table :data="emailTemplateList" v-loading="loading" style="margin-top: 20px;width: 70%;"border >
            <el-table-column property="templateName" label="模板名称" align="center"></el-table-column>
            <el-table-column property="type" label="类型" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.type===1">内置</span>
                    <span v-else>个人</span>
                </template>
            </el-table-column>
            <el-table-column label="操作"  align="center">
                <template slot-scope="scope">
                    <el-button  type="text" size="medium" ><i class="el-icon-search"></i>修改 </el-button>
                    <el-button @click="handleDeleteFormItem(scope.row.id)" type="text" size="medium" v-if="scope.row.type===2">
                        <i class="el-icon-delete"></i>删除 </el-button>
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
    import {errTips, successTips} from "@/utils/tips.js";
    import {httpGet,httpDelete} from "@/utils/http.js";
    import { MessageBox } from "element-ui";
    import {specificDate} from "@/utils/getDate";
    import deepCopyObject from "@/utils/deepCopyObject";
    export default {
        name: "reviewTemplates",
        data(){
            return {
                loading:false,
                emailTemplateList :[],//已有评审模板的列表
                pageData: {
                    pageNo: 1,
                    pageSize: 10,
                    orderBy: "id",
                    orderType: "DESC",
                },
                emailTemplateList:[],
                totalPage: 0,
            };
        },
        created:function(){
            this.getEmailTemplate();
        },
        methods:{
            getEmailTemplate(val = this.pageData){ //获取当前页面的评审信息
                this.loading = true;
                httpGet("/v1/authorization/review/adminemailtemplate/list", val).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode == 200) {
                        this.pageData.pageNo = data.pageNo;
                        this.totalPage = parseInt(data.totalPage + '0');
                        this.emailTemplateList = data.emailTemplateList;
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                    this.loading = false;
                });
            },

            handleDeleteFormItem(id){
                MessageBox.confirm("此操作将删除此评审模板, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    httpDelete(
                        `/v1/authorization/review/template/delete/${id}`
                    ).then(results => {
                        const { msg, httpCode } = results.data;
                        if (httpCode === 200) {
                            this.getEmailTemplate();
                            successTips('删除成功')
                        } else if (httpCode === 400) {
                            errTips("页面丟失");
                        } else {
                            errTips(msg);
                        }
                    });
                })
            },
            handleCurrentChange(val) { //对应分页栏的换页操作
                this.pageData.pageNo = val;
                this.getEmailTemplate();
            },
        },

    }
</script>

<style scoped>

</style>
