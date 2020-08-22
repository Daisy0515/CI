<!--功能：查看评审专家的评审状态列表，
    调用页面：1.editorReviewList(评审管理员:评审任务列表)，
              2.universalMail(评审管理员：评审管理/通用邮件)，
              3.editorOpinionAndDecision(评审管理员：评审任务中的意见与决定)
              4.viewReview(项目发布者：查看第三方评审)，
-->
<template>
    <div style="margin:10px 0;">
        <el-table :data="userList" :header-cell-style="rowClass" v-loading="userListLoading">
            <el-table-column prop="userName" label="评审专家" align="center"></el-table-column>
            <el-table-column prop="gmtCreate" label="邀请时间" align="center"></el-table-column>
            <el-table-column prop="status" label="状态" align="center"></el-table-column>
            <el-table-column label="评审结果" align="center">
                <template slot-scope="scope">
                    <el-button @click="viewExpertReview(scope.row)" type="text" size="medium">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="查看评价" :visible.sync="readReviewDialogVisible" width="80%"
                   style="text-align:left; font-weight: bolder;" append-to-body>
            <read-review-template :templateConfigList="templateConfigListForRead" :totalScore="totalScore"
                                  :result="result" >
            </read-review-template><!--生成评审表单的组件-->
        </el-dialog>
    </div>
</template>

<script>
    import { httpGet, } from "@/utils/http.js";
    import { message, successTips, errTips } from "@/utils/tips.js";
    import readReviewTemplate from '@/view/review/components/readReviewTemplate';

    export default {
        name: "viewExpertReviewList",
        props: {
            userList:{      //评审专家信息
                type: Array,
            },
            userListLoading:{
                type:Boolean,
                default:false,
            }
        },
        components: {
            readReviewTemplate
        },
        data() {
            return {
                readReviewDialogVisible: false,//控制评审专家的评价框
                templateConfigListForRead:[],  //评审模板配置列表
                totalScore:null,               //模板总分
                result:{},                     //专家评审结果
            }
        },
        methods:{
            /**查看单个专家的评审意见*/
            viewExpertReview(row){
                if(row.status!=="完成"){
                    message("专家未完成评审");
                    return;
                }
                this.readReviewDialogVisible = true;
                httpGet("/v1/authorization/review/experttemplateopinion/get",{id:row.id}).then(results => {
                    const { httpCode, msg, data } = results.data;
                    if (httpCode == 200){
                        this.templateConfigListForRead = data.configList ;
                        this.result = data.result;
                        this.templateName = data.templateName;
                    } else {
                        errTips(msg);
                    }
                });
            },
            closeDialog(){
                this.$emit("closeDialog");
            },
            rowClass() {
                return "background:#F4F6F9;";
            }
        }
    }
</script>

<style scoped>

</style>
