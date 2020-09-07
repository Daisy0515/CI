<!--功能：查看评审专家的评审状态列表，
    调用页面：1.editorReviewList(评审管理员:评审任务列表)，
              2.universalMail(评审管理员：评审管理/通用邮件)，
              3.editorOpinionAndDecision(评审管理员：评审任务中的意见与决定)
              4.viewReview(项目发布者：查看第三方评审)，
-->
<template>
    <div style="margin:10px 0;">
        <el-table :data="userList" :header-cell-style="rowClass" v-loading="userListLoading">
            <el-table-column prop="name" label="评审专家" align="center"></el-table-column>
            <el-table-column prop="gmtCreate" label="邀请时间" align="center"></el-table-column>
            <el-table-column prop="status" label="状态" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="评审结果" align="center">
                <template slot-scope="scope">
                    <el-button @click="viewExpertReview(scope.row)" type="text" size="medium" v-if="scope.row.status==='完成'">详情</el-button>
                    <span v-else>无</span>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="查看评价" :visible.sync="readReviewDialogVisible" width="80%" v-if="usedBy==='viewReview'"
                   style="text-align:left; font-weight: bolder;" append-to-body>
            <read-review-result-for-manager :templateConfigList="templateConfigListForRead" :totalScore="totalScore" :result="result" >
            </read-review-result-for-manager><!--生成评审表单的组件-->
        </el-dialog>
        <el-dialog title="查看评价" :visible.sync="readReviewDialogVisible" width="80%" v-else
                   style="text-align:left; font-weight: bolder;" append-to-body>
            <read-review-result :templateConfigList="templateConfigListForRead" :totalScore="totalScore" :result="result" >
            </read-review-result><!--生成评审表单的组件-->
        </el-dialog>

    </div>
</template>

<script>
    import { httpGet, } from "@/utils/http.js";
    import { message, successTips, errTips } from "@/utils/tips.js";
    import readReviewResult from '@/view/review/components/readReviewResult';
    import readReviewResultForManager from '@/view/review/components/readReviewResultForManger';
    export default {
        name: "viewExpertReviewList",
        props: {
            userList:{      //评审专家信息
                type: Array,
            },
            userListLoading:{
                type:Boolean,
                default:false,
            },
            usedBy:{//当前组件的调用页面
                type:String,
                default:null
            }
        },
        components: {
            readReviewResult,
            readReviewResultForManager
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
                this.readReviewDialogVisible = true;
                httpGet("/v1/authorization/review/experttemplateopinion/get",{id:row.id}).then(results => {
                    const { httpCode, msg, data } = results.data;
                    if (httpCode == 200){
                        this.templateConfigListForRead = data.configList ;
                        data.result.content = JSON.parse(data.result.content);//将用户评价的JSON字符串转换为 JavaScript 对象
                        this.result = data.result;
                        this.totalScore = data.totalScore;
                        this.templateName = data.templateName;
                        console.log("result",this.result);
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
