<template>
    <div>
        <el-row>
            <el-button type="text" @click="$router.go(-1);" style="font-size: large;font-weight: bolder;">返回上一级
            </el-button>
        </el-row>
        <el-card>
            <el-row>
                <h2>意见与决定</h2>
            </el-row>
            <el-row>
                <el-col :offset="3">
                    <h2>评审任务名称：{{title}}</h2>
                </el-col>
            </el-row><br>
            <el-row>
                <el-col :offset="2">
                    <h3 v-if="intIdentification === 1">
                        提示：当前评审任务没有评审专家处于评审中或邀请未回复状态，您可以提交您的意见!
                    </h3>
                    <h3 v-if="intIdentification === 2">
                        提示：当前评审任务还有未完成评审的评审专家，您可以中止未完成评审的专家的任务来进行下一步操作
                    </h3>
                </el-col>
            </el-row><br>
            <el-row>
                <el-col>
                    <h3>本次评审需要审核专家人数: <span style="margin-left:20px;">{{number}}</span></h3>
                </el-col>
            </el-row>
            <!--评审专家任务列表-->
            <view-expert-review-list :userList="userList" :userListLoading="userListLoading"></view-expert-review-list>

            <el-row style="margin: 20px 0">
                <el-col :offset="2">
                    <h3 v-if="intIdentification === 2">
                        提示：中止未完成任务，评审任务会从上面表格中的评审专家里的任务列表中转移到已中止页面 ，<br>
                        您可以为在这个任务中相关评审专家发送提醒邮件。 如果有需要，您也可以重新邀请这些评审专家。
                    </h3>
                </el-col>
            </el-row>
            <div>
                <h3>给作者的意见:</h3>
                <el-input type="textarea" :rows="5" v-model="commentsToAuthor" :readonly="true" :autosize="{minRows: 5, maxRows: 12 }"></el-input>
            </div><br>
            <div>
                <h3>给管理员的意见:</h3>
                <el-input type="textarea" :rows="5" v-model="commentsToEditor" :readonly="true" :autosize="{minRows: 5, maxRows: 12 }"></el-input>
            </div><br>
            <!--管理员提交意见-->
            <el-form :model="localForm" ref="editorOpinionForm" :rules="editorOpinionFormRules" v-if="intIdentification===1">
                <el-form-item label="管理员决定" style="margin:20px 0 0 35%" prop="opinion">
                    <el-col :span="6">
                        <el-select v-model="localForm.opinion" placeholder="请选择">
                            <el-option label="通过" :value="1"></el-option>
                            <el-option label="修改后通过" :value="2"></el-option>
                            <el-option label="不通过" :value="3"></el-option>
                            <el-option label="没有意见" :value="4"></el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item prop="details">
                    <h3><span style="color:red;">*</span>管理员的意见:</h3>
                    <el-input v-model="localForm.details" type="textarea" :rows="5" placeholder="请输入管理员意见！"
                              maxlength="1000" show-word-limit>
                    </el-input>
                </el-form-item>
                <el-row>
                    <el-col :span="12">
                        <el-form-item>
                            <el-table :data="localForm.attachmentList" style="margin-top: 20px;" border>
                                <el-table-column property="attachmentName" label="附件名" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column property="userName" label="上传者" align="center"></el-table-column>
                                <el-table-column label="操作" align="center">
                                    <template slot-scope="scope">
                                        <a :href="scope.row.attachment" target="_blank">下载</a>
                                    </template>
                                </el-table-column>
                                <el-table-column label="让作者可见" align="center">
                                    <template slot-scope="scope">
                                        <el-checkbox v-model="scope.row.isVisible"></el-checkbox>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" :offset="2">
                        <el-form-item>
                            <sourceUpload style="margin-top: 30px;" :uploadIndex="uploadIndex"
                                          v-on:setIdCard="setIdCard($event)"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item style="margin-left: 35%">
                    <el-button type="primary" @click="submitEditorOpinion('editorOpinionForm')"
                               :loading="submitLoading">提交意见
                    </el-button>
                    <el-button>取消</el-button>
                </el-form-item>
            </el-form>
            <!--管理员中止任务-->
            <template v-if="intIdentification === 2">
                <el-row >
                    <el-col :span="12">
                        <el-table :data="localForm.attachmentList" style="margin-top: 20px;" border>
                            <el-table-column property="attachmentName" label="附件名" align="center" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column property="userName" label="上传者" align="center"></el-table-column>
                            <el-table-column label="操作" align="center">
                                <template slot-scope="scope">
                                    <a :href="scope.row.attachment">下载</a>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
                <el-row style="margin-left:38%;margin-top: 15px;">
                    <el-button @click="$router.go(-1)">返回</el-button>
                    <el-button @click="suspend" type="primary">中止未完成任务</el-button>
                </el-row>
            </template>
            <!--查看意见与决定-->
            <el-form :model="localForm"  v-if="intIdentification===3">
                <el-form-item label="管理员决定" style="margin:20px 0 0 35%" prop="opinion">
                    <el-col :span="6">
                        <el-select v-model="localForm.opinion" placeholder="未选择" disabled>
                            <el-option label="通过" :value="1"></el-option>
                            <el-option label="修改后通过" :value="2"></el-option>
                            <el-option label="不通过" :value="3"></el-option>
                            <el-option label="没有意见" :value="4"></el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item prop="details">
                    <h3><span style="color:red;">*</span>管理员的意见:</h3>
                    <el-input v-model="localForm.details" type="textarea" :rows="5" :readonly="true" :autosize="{minRows: 5, maxRows: 10 }"></el-input>
                </el-form-item>
                <el-row>
                    <el-col :span="12">
                        <el-form-item>
                            <el-table :data="localForm.attachmentList" style="margin-top: 20px;" border>
                                <el-table-column property="attachmentName" label="附件名" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column property="userName" label="上传者" align="center"></el-table-column>
                                <el-table-column label="操作" align="center">
                                    <template slot-scope="scope">
                                        <a :href="scope.row.attachment" target="_blank">下载</a>
                                    </template>
                                </el-table-column>
                                <el-table-column label="作者是可见" align="center">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.isVisible">是</span>
                                        <span v-else>否</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item style="margin-left: 43%">
                    <el-button  @click="$router.go(-1);" style="font-size: large;font-weight: bolder;">
                        返回上一级
                    </el-button>
                </el-form-item>
            </el-form>
            <!--中止任务对话框-->
            <customize-email-dialog :visible="suspendVisible" :receiver="2" :templateId="templateId" :userList="suspendUserList" usedBy="editorOpinionAndDecision"
                                    :userListLoading="suspendUserListLoading" :templateList="templateList" @closeDialog="closeSuspendDialog">
            </customize-email-dialog>
        </el-card>
    </div>
</template>

<script>
    import sourceUpload from '@/common/upload/resourceUpload';
    import {httpGet, httpPost} from "@/utils/http.js";
    import {successTips, errTips} from "@/utils/tips.js";
    import {specificDate} from "@/utils/getDate";
    import customizeEmailDialog from '@/view/review/editor/components/customizeEmailDialog';
    import deepCopyObject from "@/utils/deepCopyObject";
    import viewExpertReviewList from "@/view/review/editor/components/viewExpertReviewList";
    export default {
        name: "editorOpinionAndDecision",
        props: {
            id: {//管理员任务编号ID
                type: [Number, String],
                default: null,
            },
            identification: {//1表示进入管理员提交意见的页面 2表示管理员进入中止任务的页面 ,3表示进入查看意见与决定页面
                type: [Number, String],
                default: null,
            },
        },
        components: {
            sourceUpload,
            customizeEmailDialog,
            viewExpertReviewList
        },
        data() {
            return {
                /*提交意见前的信息显示*/
                title: null,              // 评审任务名称 ,
                authorList: [],           // 给作者的意见信息集合
                editorList: [],           // 给管理员的意见信息集合
                intIdentification:null,   //整型的identification

                number: null,             // 评审专家完成人数要求 ,
                userList: [],             // 评审者信息集合
                commentsToAuthor: null,   //给作者的意见
                commentsToEditor: null,   //给管理员的意见
                userListLoading: false,  //控制评价详情结果集的加载显示

                submitLoading: false,    //提交时，按钮处于加载状态，防止重复提交
                uploadIndex: false,      //控制上传组件是否上传

                localForm: {
                    opinion: null,       //管理员意见（下拉框选择的）
                    details: null,       //管理员的意见详情
                    accessory: null,     //意见附件
                    attachmentList: [],  //上传的附件
                    id: null,            //所属管理员任务编号ID
                },
                editorOpinionFormRules: {
                    opinion: [
                        {required: true, message: '请选择管理员的决定', trigger: 'blur'},
                    ],
                    details: [
                        {required: true, message: '请输入管理员的意见', trigger: 'blur'},
                    ],
                },

                suspendVisible:false,        //控制中止任务对话框的显示
                templateList:[],             //邮件模板列表
                suspendUserList:[],          //待中止任务的专家列表
                suspendUserListLoading:false,//待中止任务的专家列表加载前的显示提示
                templateId:null,             //中止任务使用到的邮件模板id
                suspendReview:false,         //用于标记用户是否中止了任务
            };
        },
        created: function(){
            this.intIdentification = parseInt(this.identification);//通过浏览器刷新的参数都是字符串类型，需要转换一下
            this.getView();
            this.getEmailTemplate();

        },
        watch:{
            authorList:function(){//authorList初始化后加载数据
                this.setCommentsToAuthor();
            },
            editorList:function(){//editorList初始化后加载数据
                this.setCommentsToEditor();
            }
        },
        methods: {
            /**获取管理员做出决定或者中止任务前展示的信息**/
            getView(){
                this.userListLoading = true;
                let url = "";
                if(this.intIdentification === 1){   //没有未完成任务的评审专家，提交意见
                    url = "/v1/authorization/review/adminopinion/get";
                }else if(this.intIdentification === 2 ){   //存在未完成任务的评审专家，中止任务
                    url = "/v1/authorization/review/adminmissionstaus/get";
                }else if(this.intIdentification === 3 ){   //查看意见与决定
                    url = "/v1/authorization/review/adminmissionopinionrce/get";
                }
                httpGet(url, {id: this.id}).then(results => {
                    const {httpCode, msg, data} = results.data;
                    console.log("data", data);
                    if (httpCode == 200){
                        this.title = data.title;
                        this.authorList = data.authorList;
                        this.editorList = data.editorList;
                        let attachList = data.attachmentList;
                        for(let i=0;i<attachList.length;i++){
                            if(null === attachList[i].attachment){
                                attachList.splice(i,1);
                                i--;
                            }else{
                                attachList[i].attachmentName = attachList[i].attachment.split('/').pop();//附件名在附件地址的末尾处
                            }
                        }
                        this.localForm.attachmentList = data.attachmentList;
                        this.number = data.number;
                        for(let item of data.userList){
                            item.gmtCreate = specificDate(item.gmtCreate);
                        }
                        this.userList = data.userList;
                        this.localForm.id = data.id;                    //管理员任务编号ID ,
                        this.templateId = data.templateId;              //中止任务中需要用到
                        this.localForm.opinion = data.adminOpinion;     //查看意见时用到，管理员意见 1接受2需要修改3拒绝4没有意见 ,
                        this.localForm.details = data.adminDetails;     //管理员的评审详情意见
                    } else if (httpCode !== 401){
                        errTips(msg);
                    }
                    this.userListLoading = false;
                });
            },
            /**设置给作者的意见*/
            setCommentsToAuthor() {
                let commentsToAuthor = "";
                for (let i in this.authorList) {
                    commentsToAuthor += ('#' + this.authorList[i].userName+":" + '\n' + this.authorList[i].commentsToAuthor + '\n');
                }
                this.commentsToAuthor = commentsToAuthor;
            },
            /**设置给管理员的意见*/
            setCommentsToEditor() {
                let commentsToEditor = "";
                for (let i in this.editorList) {
                    commentsToEditor += ('#' + this.editorList[i].userName +  ":" + '\n' + this.editorList[i].commentsToEditor + '\n');
                }
                this.commentsToEditor = commentsToEditor;
            },

            /*--------------提交意见相关--------------------*/
            /**管理员提交意见*/
            submitEditorOpinion(formName) {
                this.submitLoading = true;
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        console.log("有效的！");
                        if (this.localForm.accessory !== null){//上传地址已经获取了
                            this.setIdCard();
                        } else {
                            this.uploadIndex = !this.uploadIndex;
                        }
                    } else {
                        console.log("无效的！");
                    }
                    this.submitLoading = false;
                });
            },
            /**上传文件控制与提交意见*/
            setIdCard(data){ //发起评审时调用的，data 表示上传文件的地址
                data && (this.localForm.accessory = data);
                console.log("this.localForm:", this.localForm);
                this.localForm.opinion = parseInt(this.localForm.opinion);
                httpPost('/v1/authorization/review/adminopinion/insert', this.localForm).then(results => {
                    const {msg, httpCode} = results.data;
                    if (httpCode === 200) {
                        successTips('提交意见成功,评审任务已完成！');
                        this.$router.replace({name:"editorComplete"});
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    } else {
                        alert(httpCode);
                    }
                    this.submitLoading = false;
                });
            },

            /*---------------中止任务相关------------------*/
            /**初始化duplicate*/
            getInitDuplicate(){
                return {
                    isAdmin:false,//管理员
                    isProjectUser:false,//发布者
                };
            },
            /**中止未完成任务*/
            suspend(){
                this.suspendVisible = true;
                this.suspendUserListLoading = true;
                let suspendUserList = [];
                for(let item of this.userList){
                    if(item.status.search("评审中")!==-1||item.status.search("邀请未回复")!==-1){
                        item.adminMissionId = this.localForm.id;    //加上管理员任务编号ID，在后续发邮件的时候，需要
                        item.duplicate = this.getInitDuplicate();   //在后续发邮件的时候，需要
                        item.emailConfig = null;                    //在后续发邮件的时候，需要
                        suspendUserList.push(item);
                    }
                }
                this.suspendUserList = suspendUserList;
                this.suspendUserListLoading = false;
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
            /**已选择对象对话框：关闭对话框*/
            closeSuspendDialog(suspendReview=false){
                this.suspendVisible=false;
                console.log("suspendReview",suspendReview);
                if(suspendReview===true){ //只有当用户中止任务的时候才发生页面的变化，否则不变
                    let params = deepCopyObject(this.$route.params);
                    params.identification = 1;//中止完任务后，希望将当前页面切换成提交意见的界面
                    this.$router.replace({name:this.$route.name,params:params});//采用replace是为了替换掉本身的中止页面，点击返回上一级的时候，可以返回评审任务列表
                    this.$router.go(0);   //加这一句是因为上一句只变换了地址栏，但是没有加载
                }
            },
        },
    }
</script>

<style lang="scss" scoped >

</style>
