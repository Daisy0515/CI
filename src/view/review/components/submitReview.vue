<!--发起评审-->
<template>
    <el-dialog :title="title" :visible.sync="dialogSubmitVisible" :before-close="changeSubmitVisible"
               style="text-align:left; font-weight: bolder;">
        <el-form :model="localForm" :rules="rules" ref="ruleForm" v-loading="loading">
            <el-row :gutter="20">
                <el-col :span="10">
                    <el-form-item label="项目标题" :label-width="formLabelWidth" prop="projectId">
                        <el-select v-model="localForm.projectId" placeholder="请选择项目" :disabled="isUpdateReview" @change="selectChange">
                            <el-option
                                    v-for="project in projectList"
                                    :key="project.projectId"
                                    :label="project.projectName"
                                    :value="project.projectId"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="评审类型" :label-width="formLabelWidth" prop="type">
                        <el-select v-model="localForm.type" placeholder="请选择评审类型" :disabled="isUpdateReview" :loading="processLoading"
                                   @focus="getReviewProcessList(localForm.projectId)">
                            <el-option
                                    v-for="process in localReviewProcess"
                                    :key="process.id"
                                    :label="process.processName"
                                    :value="process.id"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="10">
                    <el-form-item label="评审标题" :label-width="formLabelWidth" prop="title">
                        <el-input v-model="localForm.title" auto-complete="off" :disabled="isUpdateReview"/>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="评审目的" :label-width="formLabelWidth" prop="purpose">
                        <el-input v-model="localForm.purpose" auto-complete="off"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="10">
                    <el-form-item label="截止时间" :label-width="formLabelWidth" prop="deadline">
                        <el-date-picker
                                v-model="localForm.deadline"
                                size="small"
                                type="date"
                                placeholder="选择日期"
                                value-format="yyyy-MM-dd"
                                :picker-options="endDatePicker"
                                style="width:100%"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="截止前提醒" :label-width="formLabelWidth" prop="warn">
                        <el-input v-model.number="localForm.warn" auto-complete="off" placeholder="请输入天数">
                            <template slot="append">天</template>
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10">
                    <el-form-item label="评审内容" :label-width="formLabelWidth" prop="content">
                        <el-input
                                v-model="localForm.content"
                                type="textarea"
                                :rows="3"
                                placeholder="请输入内容"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="上传附件" :label-width="formLabelWidth">
                        <sourceUpload :uploadIndex="uploadIndex" v-on:setIdCard="setIdCard($event)"
                                      v-if="uploadToWhichSource===1"/>
                        <sourceUpload :uploadIndex="uploadIndex" v-on:setIdCard="setIdCardCache($event)"
                                      v-else-if="uploadToWhichSource===2"/>
                        <sourceUpload v-else :uploadIndex="uploadIndex" v-on:setIdCard="setIdCard2($event)"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="isShowSubmitHistory"><!---是否显示提交历史--->
                <el-col :span="20">
                    <span>提交历史：</span>
                    <el-table :data="localForm.resourceList" border>
                        <el-table-column prop="gmtCreate" label="上传时间"></el-table-column>
                        <el-table-column prop="resourceName" label="附件名称"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button @click="handleClickFile(scope.row)" type="text" size="medium"
                                           style="margin-left: 30%"
                                >下载
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" style="margin-right: 35%">
            <el-button @click="cancel" style="margin-right: 10%" v-if="isUpdateReview">取消</el-button>
            <el-button @click="storeReviewDraft" style="margin-right: 10%" v-else  v-prevent-click :loading="buttonLoading">暂存</el-button>
            <el-button type="primary" @click="submitReview('ruleForm')" v-prevent-click :loading="buttonLoading">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import {httpGet, httpPost, httpPut} from "@/utils/http.js";
    import {errTips, successTips} from "@/utils/tips.js";
    import sourceUpload from '@/common/upload/resourceUpload';

    export default {
        components: {sourceUpload,},
        props:{
            title:{
                type:String,
                default:"编辑评审任务",
            },
            form:Object,
            formLabelWidth:String,
            dialogSubmitVisible:Boolean,
            isShowSubmitHistory:{
                type:Boolean,
                default:false,
            },
            projectList:Array,
            loading:Boolean,
            reviewProcessList:Array,
        },
        data() {
            var validateType = (rule, value, callback) => {
                if (value === null) {
                    callback(new Error('请选择评审类型！'));
                } else if (value === '-1') {
                    callback(new Error('当前项目无法发起评审！'));
                } else {
                    callback();
                }
            };
            var validateDeadline = (rule, value, callback) => {
                if (value == null) {
                    callback(new Error('请选择截止日期！'));
                } else if (Date.parse(value) <= new Date().getTime() - 8.64e6) {
                    callback(new Error('截止时间需大于当前日期'));
                } else {
                    callback();
                }
            };
            var validateWarn = (rule, value, callback) => {
                if (value == null) {
                    callback(new Error('请输入截止前提醒天数！'));
                }else if(typeof(value)!=="number"||Math.floor(value)!==value){
                    callback(new Error('请输入正整数！'));
                } else if (value <= 0) {
                    callback(new Error('天数必需大于0！'));
                }
                // else if(){//截止前的提醒日期早于当下的时间判断
                //
                // }
                else {
                    callback();
                }
            }
            return {
                endDatePicker: {
                    disabledDate(time) {
                        return time.getTime() <= new Date().getTime() - 8.64e6;
                    }
                },
                localReviewProcess: this.reviewProcessList,//当前用户所竞标的项目列表，发起评审时，用于项目选择
                processLoading:false,//搜索框中点击类型下拉框时，加载的
                buttonLoading:false,//提交按钮对应的加载框
                uploadIndex: false, //用于开启上传文件 true时开启上传，false停止
                isDraft: false,// 是否按照缓存提交
                localForm:this.form,//localForm与为父组件传递的form内容保持一致
                rules: {
                    content: [
                        {required: true, message: '请输入评审内容', trigger: 'blur'},
                        {min: 5, message: '长度至少有5个字符', trigger: 'blur'}
                    ],
                    deadline: [
                        {required: true, message: '请选择截止日期', trigger: 'blur'}, //这里不需要加type:'date'
                        {validator: validateDeadline,}
                    ],
                    // purpose: [
                    //     {required: false, message: '请输入评审目的', trigger: 'blur'},
                    // ],
                    type: [
                        {validator: validateType, required: true, trigger: 'change'},
                    ],
                    warn: [
                        {validator: validateWarn, required: true, trigger: 'blur'},
                    ],
                    title: [
                        {required: true, message: '请输入评审标题', trigger: 'blur'},
                    ],
                    projectId: [
                        {required: true, message: '请选择评审项目', trigger: 'blur'},
                    ]
                },
            }
        },
        computed: {
            isUpdateReview: function () { //只有当页面是发起评审时才有缓存按钮，当页面是重新提交时或者修改(更新update)提交时，没有缓存按钮，只有取消按钮
                if (this.title != "发起评审") {
                    return true;
                } else {
                    return false;
                }
            },
            uploadToWhichSource: function () {//这里是用于选择不同的setIdCardXX（）函数，不同的setIdCardXX（）函数对应不同的上传地址
                if (this.title === "发起评审"||this.title === "编辑评审") {
                    if (false === this.isDraft) { //提交到发起评审地址
                        return 1;
                    } else {              //提交到缓存地址
                        return 2;
                    }
                } else {                  //提交到重新或修改提交对应的地址
                    return 3;
                }
            }
        },
        watch: {
            reviewProcessList: function (val) { //父组件一开始的reviewProcessList是空的，向服务器请求数据后填充reviewProcessList，监听父组件传递过来的reviewProcessList是否发生变化，发生变化就更新本地的属性
                this.localReviewProcess = val;
            },
            form:function(val){
                this.localForm = val;
            }
        },
        methods: {
            selectChange(){
                this.localReviewProcess = [];
            },
            setIdCard(data) { //发起评审时调用的，data 表示上传文件的地址
                data && (this.localForm.resourceList = [{
                    'resourceUrl': data,
                    'resourceName': data.split('/').slice(-1)[0]
                }]);
                console.log("draft data:",this.localForm);
                httpPost('/v1/authorization/review/review/insert', this.localForm).then(results => {
                    const {msg, httpCode} = results.data;
                    if (httpCode === 200) {
                        successTips('发布评审任务成功');
                        // this.setCache('myReview');
                        let draftId = this.localForm.id;
                        this.localForm = {};
                        this.$emit('closeSubmitDialog',{"isSubmit":true,"id":draftId});////在评审草稿中发起评审,发起成功之后要删除原先的评审草稿
                        if(this.title === "发起评审"||this.title === "编辑评审"){//
                            this.$router.push('/managerNotAccept');
                        }
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    } else {
                        alert(httpCode);
                    }
                    this.buttonLoading = false;
                });

            },
            setIdCard2(data) { //重新提交或者修改提交时调用的，data 表示上传文件的地址
                data && (this.localForm.resourceList.unshift({
                    'resourceUrl': data,
                    'resourceName': data.split('/').slice(-1)[0]
                }));// unshift是插入元素到第一个位置，地址中被/分割的最后一部分
                if(this.title==="重新提交"){
                    this.localForm.type = 1;//type=1对应是评审被重新提交
                }else{
                    this.localForm.type = 2;//type=1对应是评审被修改提交
                }
                // console.log("重新或者修改提交最后提交的数据：", this.localForm);
                httpPut('/v1/authorization/review/review/update', this.localForm).then(results => {
                    const {msg, httpCode} = results.data;
                    if (httpCode === 200) {
                        successTips('更改评审任务成功');
                        let reviewId = this.localForm.id;
                        this.localForm = {};
                        let updateReviewList = false;
                        if(this.title==="重新提交"){  //如果是重新提交（评审任务的状态会发生变化），就需要重新加载页面,修改提交不需要重新加载页面
                            updateReviewList = true;
                        }
                        this.$emit('closeSubmitDialog',updateReviewList);//关掉弹框,再重新加载
                        if(updateReviewList===false){ //修改提交结束后打开查看详情，来查看最新的评审内容
                            this.$emit('openReviewDetail',{'id':reviewId});
                        }
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    } else {
                        alert(httpCode);
                    }
                    this.buttonLoading = false;
                });

            },
            setIdCardCache(data) { //点击缓存时调用的，data 表示上传文件的地址

                data && (this.localForm.resourceList = [{
                    'resourceUrl': data,
                    'resourceName': data.split('/').slice(-1)[0]
                }]);
                httpPost('/v1/authorization/review/draft/insert', this.localForm).then(results => {
                    const {msg, httpCode} = results.data;
                    if (httpCode === 200) {
                        successTips('缓存评审任务成功');
                        this.localForm = {};
                        this.$emit('closeSubmitDialog');//关掉弹框
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    } else {
                        alert(httpCode);
                    }
                    this.buttonLoading = false;
                    this.isDraft = false;
                });

            },
            submitReview(formName) {//提交评审
                this.buttonLoading = true;
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        console.log("有效的！");
                        if (this.localForm.resourceList && this.localForm.resourceList.length > 0) {//当resourceList存在(不为undefind)且resourceList的长度大于0时，调用setIdCard()
                            if (this.title === "发起评审") {
                                this.setIdCard();
                            } else {        //重新提交或者修改提交通过这个方式来提交
                                this.uploadIndex = !this.uploadIndex;//在重新或修改提交方式中，本身resourceList长度大于0时，仍要开启上传附件，检查用户有没有上传新的文件
                            }
                        } else {  //resourceList不存在或者文件数目等于0时，开启上传附件
                            this.uploadIndex = !this.uploadIndex;//当resourceList中包含的上传文件数目为0时开启上传附件
                        }
                    } else {
                        console.log("无效的！");
                        this.buttonLoading = false;
                        return false;
                    }
                });

            },
            getReviewProcessList(projectId) {
                this.processLoading = true;
                httpGet("/v1/authorization/review/process/list", {id: projectId}).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode == 200) {
                        if (data.processList.length == 0) { //没有评审流程
                            this.localReviewProcess = [{id: null, processName: "当前项目没有评审流程"}]
                        } else {
                            this.localReviewProcess = data.processList;
                        }
                    } else if (msg === "请求参数出错") {
                        errTips("请先选择项目！");
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                    this.processLoading = false;
                });
            },
            changeSubmitVisible() {//通过点击弹框右上角的 X的方式 关掉页面，需要传递消息给父组件，用过父组件关掉弹框
                this.$emit('closeSubmitDialog');
            },
            storeReviewDraft() {//暂存评审
                this.isDraft = true;
                this.uploadIndex = !this.uploadIndex;
            },
            cancel() { //点击取消关掉页面
                this.$emit('closeSubmitDialog');
            },

        },
        name: "submitReview"
    }
</script>

<style scoped>

</style>
