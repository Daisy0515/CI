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
                    <h3 v-if="isComplete===true">提示：当前评审任务没有评审专家处于评审中或邀请未回复状态，您可以提交您的意见!</h3>
                    <h3 v-else>提示：当前评审任务还有未完成评审的评审专家，您可以中止未完成评审的专家的任务来进行下一步操作</h3>
                </el-col>
            </el-row><br>
            <el-row>
                <el-col>
                    <h3>本次评审需要审核专家人数: <span style="margin-left:20px;">{{number}}</span></h3>
                </el-col>
            </el-row>
            <el-table :data="userList" style="margin-top: 20px;" border v-loading="userListLoading">
                <el-table-column property="userName" label="评审专家" align="center"></el-table-column>
                <el-table-column property="gmtCreate" label="邀请时间" align="center"></el-table-column>
                <el-table-column property="status" label="状态" align="center"></el-table-column>
                <el-table-column label="评审结果" align="center">
                    <template slot-scope="scope">
                        <el-button @click="handleEditItem(scope.$index)" type="text" size="medium"><i
                                class="el-icon-search"></i>详情
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row style="margin: 20px 0">
                <el-col :offset="2">
                    <h3 v-if="isComplete===false">提示：中止未完成任务，评审任务会从上面表格中的评审专家里的任务列表中转移到已中止页面 ，
                        您可以为在这个任务中相关评审专家发送提醒邮件。 如果有需要，您也可以重新邀请这些评审专家。</h3>
                </el-col>
            </el-row>
            <div>
                <h3>给作者的意见:</h3>
                <el-input type="textarea" :rows="5" v-model="commentsToAuthor"></el-input>
            </div><br>
            <div>
                <h3>给管理员的意见:</h3>
                <el-input type="textarea" :rows="5" v-model="commentsToEditor"></el-input>
            </div><br>
            <el-form :model="localForm" ref="editorOpinionForm" :rules="editorOpinionFormRules" v-if="isComplete===true">
                <el-form-item label="管理员决定" style="margin:20px 0 0 35%" prop="opinion">
                    <el-col :span="6">
                        <el-select v-model="localForm.opinion" placeholder="请选择">
                            <el-option label="通过" value="1"></el-option>
                            <el-option label="修改后通过" value="2"></el-option>
                            <el-option label="不通过" value="3"></el-option>
                            <el-option label="没有意见" value="4"></el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item prop="details">
                    <h3><span style="color:red;">*</span>管理员的意见:</h3>
                    <el-input v-model="localForm.details" type="textarea" :rows="5" placeholder="请输入管理员意见！"></el-input>
                </el-form-item>
                <el-row>
                    <el-col :span="12">
                        <el-form-item>
                            <el-table :data="localForm.attachmentList" style="margin-top: 20px;" border>
                                <el-table-column property="attachmentName" label="附件名" align="center"></el-table-column>
                                <el-table-column property="userName" label="上传者" align="center"></el-table-column>
                                <el-table-column label="操作" align="center">
                                    <template slot-scope="scope">
                                        <a :href="scope.row.attachment">下载</a>
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
            <template v-if="isComplete===false">
                <el-row >
                    <el-col :span="12">
                        <el-table :data="localForm.attachmentList" style="margin-top: 20px;" border>
                            <el-table-column property="attachmentName" label="附件名" align="center"></el-table-column>
                            <el-table-column property="userName" label="上传者" align="center"></el-table-column>
                            <el-table-column label="操作" align="center">
                                <template slot-scope="scope">
                                    <a :href="scope.row.attachment">下载</a>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
                <el-row style="margin-left: 35%;margin-top: 15px;">
                    <el-button @click="$router.go(-1)">返回</el-button>
                    <el-button @click="suspend()" type="primary">中止未完成任务</el-button>
                </el-row>
            </template>
        </el-card>
    </div>
</template>

<script>
    import sourceUpload from '@/common/upload/resourceUpload';
    import {httpGet, httpPost,httpPut} from "@/utils/http.js";
    import {successTips, errTips} from "@/utils/tips.js";
    import {specificDate} from "@/utils/getDate";

    export default {
        name: "editorOpinionAndDecision",
        props: {
            id: {//管理员任务编号ID
                type: [Number, String],
                default: null,
            },
            identification: {//1表示进入管理员提交意见的页面 2表示管理员进入中止任务的页面 ,
                type: [Number, String],
                default: null,
            },
        },
        computed: {
            isComplete: function () {//true表示完成，可以提意见，反之，中止任务
                if (this.identification === 1 || this.identification === '1') {
                    return true;
                } else {
                    return false;
                }
            }
        },
        components: {
            sourceUpload
        },
        data() {
            return {
                /*提交意见前的信息显示*/
                title: null,// 评审任务名称 ,
                authorList: [],// 给作者的意见信息集合
                editorList: [],// 给管理员的意见信息集合

                number: null,// 评审专家完成人数要求 ,
                userList: [],// 评审者信息集合
                commentsToAuthor: null,//给作者的意见
                commentsToEditor: null,//给管理员的意见
                userListLoading: false,//控制评价详情结果集的加载显示

                submitLoading: false,//提交时，按钮处于加载状态，防止重复提交
                uploadIndex: false,//控制上传组件是否上传

                localForm: {
                    opinion: null,//管理员意见（下拉框选择的）
                    details: null,//管理员的意见详情
                    accessory: null,//意见附件
                    attachmentList: [],//上传的附件
                    id: null,//所属管理员任务编号ID
                },
                editorOpinionFormRules: {
                    opinion: [
                        {required: true, message: '请选择管理员的决定', trigger: 'blur'},
                    ],
                    details: [
                        {required: true, message: '请输入管理员的意见', trigger: 'blur'},
                    ],
                }
            };
        },
        created: function(){
            this.getView();
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
                if(this.isComplete){   //没有未完成任务的评审专家
                    url = "/v1/authorization/review/adminopinion/get";
                }else{                 //存在未完成任务的评审专家
                    url = "/v1/authorization/review/adminmissionstaus/get";
                }
                httpGet(url, {id: this.id}).then(results => {
                    const {httpCode, msg, data} = results.data;
                    console.log("data", data);
                    if (httpCode == 200){
                        this.title = data.title;
                        this.authorList = data.authorList;
                        this.editorList = data.editorList;
                        for(let item of data.attachmentList){
                            item.attachmentName = item.attachment.split('/').pop();
                        }
                        this.localForm.attachmentList = data.attachmentList;
                        this.number = data.number;
                        for(let item of data.userList){
                            item.gmtCreate = specificDate(item.gmtCreate);
                        }
                        this.userList = data.userList;
                        this.localForm.id = data.id;
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
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    } else {
                        alert(httpCode);
                    }
                    this.submitLoading = false;
                });

            },
            /**中止任务*/
            suspend(){
                console.log(type);
                httpPut("/v1/authorization/review/adminmissioninfo/get",{id:this.id,type:type}).then(results=>{
                    const {httpCode,msg,data} = results.data;
                    if(httpCode===200){
                        successTips("中止任务成功");
                        this.$router.go(-1);
                    }else{
                        errTips(msg);
                    }
                })
            },

        },
    }
</script>

<style scoped>

</style>
