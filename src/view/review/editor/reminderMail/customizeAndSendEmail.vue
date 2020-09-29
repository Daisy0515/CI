<template>
    <div>
        <el-card class="editor-container">
            <el-row style="margin-bottom: 10px;"><h1 style="text-align: left">定制与发送邮件</h1></el-row>
            <el-row>
                <h3>说明：系统已经内置了几种常见的模板，请跟据需要选择合适的模板，然后点击“定制信件”进行下一步信息的填充</h3>
            </el-row>
            <el-row style="margin-top: 10px;">
                <el-select v-model="templateId" placeholder="请选择模板" clearable>
                    <el-option
                            v-for="item in templateList"
                            :key="item.id"
                            :label="item.templateName"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-row>
            <el-row style="margin-top: 30px;">
                <el-button  @click="goBack">返回</el-button>
                <el-button type="primary" style="margin-left:30px;" @click="next">下一步</el-button>
            </el-row>
        </el-card>
        <customize-email-dialog :visible="nextVisible"  :templateId="templateId" :userList="userList" usedBy="customizeAndSendEmail"
                                       :userListLoading="userListLoading" :templateList="templateList" @closeDialog="closeSelectedUserDialog">
        </customize-email-dialog>
    </div>
</template>

<script>
    import {errTips} from "@/utils/tips.js";
    import {httpGet,httpPost} from "@/utils/http";
    import customizeEmailDialog from '@/view/review/editor/components/customizeEmailDialog';
    export default {
        name:"customizeAndSendEmail",
        props:{
            expertIdList:{//已选择的评审专家
                type:String,
            }
        },
        components:{
            customizeEmailDialog,
        },
        data(){
            return {
                templateList:[],//下拉框中的评审模板列表
                templateId:null,//在模板下拉框中选择的模板Id
                idList:[],//评审专家邀请编号ID集合 ,
                customizeEmailVisible:false,//定制邮件对话框是否显示
                customizeSpecificEmailVisible:false,//定制特定用户的信件
                userList:[],//被选中发邮件的专家信息列表
                userListLoading:false,
                nextVisible:false,//点击下一步，控制对话框的显示
            }
        },
        created(){
            this.getEmailTemplate();
            this.idList = JSON.parse(this.expertIdList);
        },
        methods: {
            getEmailTemplate(){
                httpGet('/v1/authorization/review/emailtemplate/get').then(results=>{
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 200){
                        this.templateList = data.templateList;
                    } else {
                        errTips(msg);
                    }
                });
            },
            goBack(){
                this.$router.go(-1);
            },
            /**初始化duplicate*/
            getInitDuplicate() {
                return {
                    isAdmin: false,//管理员
                    isProjectUser: false,//发布者
                };
            },
            /**发送邮件页面：是否允许点击下一步的条件判断*/
            nextIsOk(){
                if(this.templateId===null){
                    errTips("请选择发送的模板！");
                    return false;
                }
                return true;
            },
            /**发送邮件页面：点击下一步的操作,对应原型图的定制信件按钮*/
            next(){
                if(this.nextIsOk()===false){
                    return false;
                }
                this.userList = [];//清空之前的待发送邮件的用户信息
                let data = {
                    idList: this.idList,
                    templateId:this.templateId,
                };
                this.nextVisible = true;
                this.userListLoading = true;
                httpPost("/v1/authorization/review/getadmincurrentinfo/get",data).then(results=>{
                    const {httpCode,msg,data} = results.data;
                    if(httpCode===200){
                        /*预先设定选择的每一个对象都是要发送的*/
                        for(let item of data.infoList){
                            item.isSent = true;         //控制邮件是否发送true表示发送，false表示不发送
                            item.duplicate = this.getInitDuplicate();
                            item.emailConfig = null;
                        }
                        this.userList = data.infoList;//待发送邮件的用户信息，在点击下一步后的对话框里显示，
                                                      // 包含id : 管理员任务编号ID ,userId: 用户编号ID ,userName: 提交人/评审专家/评审发布者 用户名
                    }else{
                        errTips(msg);
                    }
                    this.userListLoading = false;
                });
            },
            /**已选择对象对话框：关闭对话框*/
            closeSelectedUserDialog(){
                this.nextVisible=false
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
