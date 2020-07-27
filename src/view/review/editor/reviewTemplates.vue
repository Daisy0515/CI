<template>
    <div>
        <div style="padding-left: 10px;margin-buttom:30px;">
            <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 130%;">
                <el-breadcrumb-item :to="{ path: '/editorIndex' }">评审管理员</el-breadcrumb-item>
                <el-breadcrumb-item :to="{path:'/editorManager'}">评审管理</el-breadcrumb-item>
                <el-breadcrumb-item>已有评审模板</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <h3 style="margin: 20px auto;font-weight: bolder;">已有评审模板:</h3>
        <el-table :data="templateNameList" v-loading="loading" style="margin-top: 20px;width: 70%;"border >
            <el-table-column property="templateName" label="评审模板名称" align="center"></el-table-column>
            <el-table-column property="gmtCreate" label="创建时间" align="center"></el-table-column>
            <el-table-column property="gmtModified" label="修改时间" align="center"></el-table-column>
            <el-table-column label="操作"  align="center">
                <template slot-scope="scope">
                    <router-link :to="{name:'editorReviewTemplateDetail',params:{id:scope.row.id}}">
                        <el-button  type="text" size="medium" ><i class="el-icon-search"></i>详情 </el-button>
                    </router-link>
                    <el-button @click="handleDeleteFormItem(scope.row.id)" type="text" size="medium" ><i class="el-icon-delete"></i>删除 </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-row >
            <router-link to="/editorReviewTemplateConfig">
                <el-button type="primary" size="medium" style="margin-top: 20px;margin-left: 31.5%;"> 添加 </el-button>
            </router-link>
        </el-row>
    </div>
</template>

<script>
    import {errTips, successTips} from "@/utils/tips.js";
    import {httpGet,httpDelete} from "@/utils/http.js";
    import { MessageBox } from "element-ui";
    import {specificDate} from "@/utils/getDate";
    export default {
        name: "reviewTemplates",
        data(){
            return {
                loading:false,
                templateNameList:[],//已有评审模板的列表
            };
        },
        created:function(){
            this.getReviewTemplates();
        },
        methods:{
            getReviewTemplates(){
                this.loading = true;
                httpGet("/v1/authorization/review/templatename/list").then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode == 200) {
                        for(let item of data.templateNameList){
                            item.gmtCreate = specificDate(item.gmtCreate);
                            item.gmtModified = specificDate(item.gmtModified);
                        }
                        this.templateNameList = data.templateNameList;
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
                                this.getReviewTemplates()
                                successTips('删除成功')
                            } else if (httpCode === 400) {
                                errTips("页面丟失");
                            } else if (httpCode != 500 && httpCode != 401) {
                                errTips(msg);
                            }
                        });
                    })
            }
        },

    }
</script>

<style scoped>

</style>
