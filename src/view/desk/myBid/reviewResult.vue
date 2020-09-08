<!-- 功能：查看当前任务的评审结果：包括发布方、管理员、评审专家
     调用页面：projectDeliver
-->
<template>
    <el-dialog title="评审意见" :visible.sync="dialogVisible" width="60%" :close-on-click-modal="false" :before-close="closeDialog">
        <el-form :model="form">
            <h2 class="header">发布者意见：<span style="text-align: center" v-if="!showPublisherOpinion">未发表意见</span></h2>
            <template v-if="showPublisherOpinion">
                <el-row :gutter="20" style="margin-top: 10px;">
                    <el-col :span="6">
                        <el-form-item label="发布者决定" :label-width="formLabelWidth">
                            <el-input v-model="form.projectOpinion.result" size="medium" :readonly="isReadOnly"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="评审得分" :label-width="formLabelWidth">
                            <el-input v-model="form.projectOpinion.score" size="medium" :readonly="isReadOnly"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-form-item label="评价内容" :label-width="formLabelWidth">
                        <el-input type="textarea" v-model="form.projectOpinion.content" size="medium" :readonly="isReadOnly" autosize/>
                    </el-form-item>
                </el-row>
            </template>
            <h2 class="header">管理员意见：<span style="text-align: center" v-if="!showAdminOpinion">未发表意见</span></h2>
            <template v-if="showAdminOpinion">
                <el-row :gutter="20" style="margin-top: 10px;">
                    <el-col :span="6">
                        <el-form-item label="管理员决定" :label-width="formLabelWidth">
                            <span v-if="form.adminOpinion.opinion === 1" class="score">通过</span>
                            <span v-if="form.adminOpinion.opinion === 2" class="score">未通过</span>
                            <span v-if="form.adminOpinion.opinion === 3" class="score">拒绝</span>
                            <span v-if="form.adminOpinion.opinion === 4" class="score">没有意见</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" :offset="5">
                        <a :href="form.adminOpinion.accessory" target="_blank">管理员意见附件</a>
                    </el-col>
                </el-row>
                <el-row>
                    <el-form-item label="管理员意见详情" :label-width="formLabelWidth">
                        <el-input type="textarea" v-model="form.adminOpinion.details"  :readonly="isReadOnly" :rows="5" autosize/>
                    </el-form-item>
                </el-row>
            </template>
            <h2 class="header">评审专家意见：<span style="text-align: center" v-if="!showExpertOpinionList">未发表意见</span></h2>
            <template v-if="showExpertOpinionList">
                <el-table :data="form.expertOpinionList" :header-cell-style="rowClass">
                    <el-table-column prop="userName" label="评审专家" align="center"></el-table-column>
                    <el-table-column prop="totalScore" label="总分" align="center"></el-table-column>
                    <el-table-column prop="reviewScore" label="得分" align="center"></el-table-column>
                    <el-table-column label="评审结果" align="center">
                        <template slot-scope="scope">
                            <el-button @click="viewExpertReview(scope.row)" type="text" size="medium">
                                <i class="el-icon-search"></i>详情
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </el-form>
        <el-dialog title="查看评价" :visible.sync="readReviewDialogVisible" width="80%"
                   style="text-align:left; font-weight: bolder;" append-to-body>
            <read-review-result-for-manger :templateConfigList="templateConfigList" :totalScore="totalScore"
                                           :result="result">
            </read-review-result-for-manger><!--生成评审表单的组件-->
        </el-dialog>
    </el-dialog>
</template>

<script>
    import readReviewResultForManger from '@/view/review/components/readReviewResultForManger';
    import {httpGet} from '@/utils/http.js';
    import { errTips} from '@/utils/tips.js';

    export default {
        name: "reviewResult",
        props:{
            form:{ //各个角色的评审意见
                type:Object,
                default:()=>{},
            },
            dialogVisible:{ //当前组件的显示
                type:Boolean,
                default:false,
            },
        },
        components:{
            readReviewResultForManger
        },
        computed:{
            showPublisherOpinion:function(){
                return this.judgeObjectPropertyNull(this.form.projectOpinion);
            },
            showAdminOpinion:function(){
                return this.judgeObjectPropertyNull(this.form.adminOpinion);
            },
            showExpertOpinionList:function (){
                return this.judgeObjectPropertyNull(this.form.expertOpinionList);
            },
        },
        data(){
            return{
                totalScore: null,
                formLabelWidth: '150px',
                isReadOnly: true,
                /*第三方专家评价*/
                readReviewDialogVisible: false,//控制专家评价框的显示
                templateConfigList: [],//评审模板配置列表
                result: {},//评审结果
            };
        },
        methods:{

            judgeObjectPropertyNull(obj){
                let valueArray = Object.values(obj);
                for(let item of valueArray){//存在1个属性不为null，则这个对象就不是空
                    if(item!==null){
                        return true;
                    }
                }
                return false;
            },
            /**查看单个专家的评审意见*/
            viewExpertReview(row) {
                this.readReviewDialogVisible = true;
                httpGet("/v1/authorization/review/experttemplateopinion/get", {id: row.expertiInviteId}).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode == 200) {
                        this.templateConfigList = data.configList;
                        data.result.content = JSON.parse(data.result.content);
                        this.result = data.result;
                        this.templateName = data.templateName;
                        this.totalScore = data.totalScore;
                    } else {
                        errTips(msg);
                    }
                });
            },
            closeDialog(){
                this.$emit("closeDialog");
            },
            rowClass() {
                return 'background:#F4F6F9;';
            },

        }
    }
</script>

<style lang="scss" scoped>
    .header {
        font-weight: bolder;

    }
</style>
