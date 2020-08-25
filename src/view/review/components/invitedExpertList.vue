<template>
    <el-dialog title="邀请评审专家" :visible.sync="invitedExpertVisible" :close-on-click-modal="false" width="50%" append-to-body :before-close="changeVisible">
        <el-dialog width="40%" title="邮件编辑" :visible.sync="emailEditVisible" append-to-body :before-close="closeEmailEdit">
            <el-dialog width="40%" title="邮件预览" :visible.sync="emailePrviewVisible" append-to-body :before-close="closeEmailPreview">
                <p v-html="previewArea"></p>
            </el-dialog>

            <el-form :label-position="'right'" label-width="100px" :model="emailForm">

                <el-form-item label="收件人">
                    <span>{{emailForm.userName}}</span>
                </el-form-item>
                <el-form-item label="抄送">
                    <el-checkbox-group v-model="cccheckList" @change="selectCC">
                        <el-checkbox label="管理员"></el-checkbox>
                        <el-checkbox label="发布者"></el-checkbox>

                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="信件主题">
                    <el-input v-model="emailForm.config.theme" style="width: 90%;"></el-input>
                </el-form-item>
                <el-form-item label="信件内容">
                    <el-input type="textarea" v-model="emailForm.config.content" style="width: 90%;" rows="10">

                    </el-input>
                </el-form-item>
            </el-form>
            <div style="text-align: right;">
                <el-button type="primary" style="margin-top: 20px;margin-right: 20px;" @click="preview()">预览</el-button>
                <el-button type="primary" style="margin-top: 20px;" @click="emailConfirm()">确定</el-button>
            </div>
        </el-dialog>

        <el-table :data="infoList" :header-cell-style="rowClass" style="margin-top: 20px;">

            <el-table-column prop="userName" label="评审专家姓名" align="center"></el-table-column>
            <el-table-column label="信件" align="center" width="350px">
                <template slot-scope="scope">
                    <el-select v-model="templateId" placeholder="未选择模板" disabled>
                        <el-option
                                v-for="item in templateList"
                                :key="item.id"
                                :label="item.templateName"
                                :value="item.id">
                        </el-option>
                    </el-select>
                    <el-button type="text" @click="emailEdit(scope.row,scope.$index)" style="margin-left: 10px">编辑</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="restrictReviewTime" label="限定评审的时间" align="center">
                <template slot-scope="scope">
                    <el-input v-model.number="scope.row.restrictReviewTime" style="width: 50px;" size="mini">

                    </el-input>
                </template>
            </el-table-column>
            <el-table-column label="邀请" align="center">
                <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.isInvite"></el-checkbox>
                    <!-- <el-button @click="scope.row.isInvite=false" type="text" v-if="scope.row.isInvite==true">取消</el-button>
                    <el-button type="text" v-if="scope.row.isInvite==false">已取消</el-button> -->
                </template>
            </el-table-column>
        </el-table>
        <div style="text-align: right;">
            <el-button type="primary" style="margin-top: 20px;" @click="finalInvite()">确定邀请</el-button>
        </div>
    </el-dialog>

</template>

<script>
    import { httpGet, httpPost} from "@/utils/http.js";
    import { errTips, successTips } from "@/utils/tips.js";
    export default {
        name: "invitedExpertList",
        props:{
            infoList:{
                type:Array,
            },
            invitedExpertVisible:{
                type:Boolean,
                default:false
            },
            params:{
                type:Object,
            }

        },
        data() {
            return{
                id:null,//管理员任务编号ID
                templateList:[],
                templateId:null,
                emailEditVisible:false, //控制邮件编辑对话框
                emailePrviewVisible:false, //控制邮件预览对话框
                cccheckList:[], //存储抄送对象
                emailForm: { //显示邮件信息的对象（表单）
                    userId:null,
                    userName: null,
                    index: null,
                    duplicate  : {isAdmin:false , isProjectUser:false},
                    config: {
                        content: null,
                        theme: null,
                    }
                },
                previewArea: null, //储存返回的邮件内容

            }
        },
        watch:{
            invitedExpertVisible : function (val) {

                if (val === true) {
                    this.getEmailTemplate(); //获取邮件模板();
                    this.templateId = this.params.templateId;
                    this.id = this.params.id;
                    console.log(this.templateId);
                }
            }
        },
        methods:{
            /**完成邮件编辑*/
            emailConfirm(){
                let i = this.emailForm.index;
                console.log("emailConfirm-emailForm:",this.emailForm);
                console.log("infoList:",this.infoList)
                this.infoList[i].emailConfig = this.emailForm.config;
                this.infoList[i].duplicate = this.emailForm.duplicate;
                //this.emailForm={};
                this.emailEditVisible = false;
            },
            /**发出邀请*/
            finalInvite(){
                let list = this.infoList;
                for (let i of list) {
                    delete i.userName;
                    delete i.index;
                    //i.type = 1;
                }
                console.log("finalInvite-list:",list);
                //this.postForm.expertInviteList = list;

                var postForm = {expertInviteList:list,id:parseInt(this.id),alternativeList:this.params.alternativeList}
                console.log("finalInvite-postForm:",postForm);

                httpPost("/v1/authorization/review/expertinvite/insert", postForm).then(results => {
                    const {
                        httpCode,
                        msg,
                        data
                    } = results.data;
                    //console.log(httpCode);
                    if (httpCode === 200) {
                        successTips("已发出邀请");
                        this.changeVisible();

                        //this.getView();
                    } else {
                        errTips(msg);
                    }
                })

            },
            /**关闭邮件预览对话框*/
            closeEmailPreview(){
                this.emailePrviewVisible=false;
            },
            /**邮件预览*/
            preview(){
                this.emailePrviewVisible=true;
                let previewForm={adminMissionId:this.id,userId:this.emailForm.userId,emailContent:this.emailForm.config.content};
                //post /v1/authorization/review/expertinviteemailconfig/get
                httpPost("/v1/authorization/review/expertinviteemailconfig/get",previewForm).then(results => {
                    const { httpCode, msg, data } = results.data;
                    if (httpCode == 200) {
                        this.previewArea = data.content;

                    } else {
                        errTips(msg);
                    }
                })


            },
            /**关闭邮件编辑对话框*/
            closeEmailEdit(){
                this.emailEditVisible = false;
            },
            /**选择抄送对象*/
            selectCC(){
                // console.log(this.checkList);
                var item = {isAdmin:false , isProjectUser:false};
                for (let i of this.cccheckList) {
                    if (i === "管理员") item.isAdmin = true;
                    if (i === "发布者") item.isProjectUser = true;
                }
                this.emailForm.duplicate = item;
                console.log(this.emailForm.duplicate);
            },

            /**编辑邮件*/
            emailEdit(val, index) {  //编辑邮件
                console.log("val",val);
                this.emailEditVisible = true;
                //console.log("scope.row", val);
                this.cccheckList = [];

                this.emailForm = val;

                this.emailForm.index = index;

                if (val.emailConfig != null)
                    this.emailForm.config = val.emailConfig;
                console.log('emailForm:', this.emailForm);
                //post /v1/authorization/review/expertinviteemailconfig/update
                let postEmailForm={adminMissionId:this.id,receiver:2,userId:val.userId,templateId:this.templateId};
                console.log('postEmailForm:',postEmailForm);
                httpPost("/v1/authorization/review/expertinviteemailconfig/update", postEmailForm).then(results => {
                    const {
                        httpCode,
                        msg,
                        data
                    } = results.data;
                    //console.log(httpCode);
                    if (httpCode === 200) {
                        this.emailForm.config.content = data.content;
                    } else {
                        errTips(msg);
                    }
                })

                // this.emailForm.config = {content:null, theme:null};
                //console.log(this.emailForm);
            },

            /**获取邮件模板，在中止未完成任务的对话框中展示用到的邮件*/
            getEmailTemplate(){
                httpGet('/v1/authorization/review/emailtemplate/get').then(results=>{
                    const {httpCode, msg, data} = results.data;
                    if (httpCode == 200){
                        this.templateList = data.templateList;
                    } else {
                        errTips(msg);
                    }
                });
            },
            changeVisible(){
                this.$emit("closeDialog"); ////changeVisible事件触发后，自动触发closeDialog
            },
            // closeInvitedExpertDialog(){
            //     //this.postForm.expertInviteList=[];
            //     //this.postForm.alternativeList=[];
            //     this.invitedExpertVisible=false;
            // },
            rowClass() {
                return "background:#F4F6F9;";
            }

        }
    }

</script>

<style scoped>

</style>