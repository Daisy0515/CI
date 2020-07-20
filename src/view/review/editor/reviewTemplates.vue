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
            <el-table-column property="templateName" label="评审项名称" align="center"></el-table-column>
            <el-table-column label="操作"  align="center">
                <template slot-scope="scope">
                    <router-link :to="{name:'editorReviewTemplateDetail',params:{id:scope.row.id}}">
                        <el-button  type="text" size="medium" ><i class="el-icon-search"></i>详情 </el-button>
                    </router-link>
                    <el-button @click="handleDeleteFormItem(scope.$index)" type="text" size="medium" ><i class="el-icon-delete"></i>删除 </el-button>
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
    import {httpGet} from "@/utils/http.js";
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
                        this.templateNameList = data.templateNameList;
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                    this.loading = false;
                });
            },
        },

    }
</script>

<style scoped>

</style>
