<!--发起评审-->
<template>
    <el-dialog :title="title" :visible.sync="dialogSubmitVisible" :before-close="changeSubmitVisible"
               style="text-align:left; font-weight: bolder;">
        <el-form :model="localForm" :rules="rules" ref="ruleForm" v-loading="loading">
            <el-row :gutter="20">
                <el-col :span="10">
                    <el-form-item label="项目标题" :label-width="formLabelWidth" prop="projectId">
                        <el-select v-model="localForm.projectId" placeholder="请选择项目">
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
                        <el-select v-model="localForm.type" placeholder="请选择评审类型"
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
                        <el-input v-model="localForm.title" auto-complete="off"/>
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
                        <sourceUpload :uploadIndex="uploadIndex" v-on:setIdCard="setIdCard($event)"/>
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
            <el-button @click="storeReview" style="margin-right: 10%" v-if="isCache">暂存</el-button>
            <el-button @click="cancel" style="margin-right: 10%" v-else>取消</el-button>
            <el-button type="primary" @click="submitReview('ruleForm')">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import {httpGet, httpPost} from "@/utils/http.js";
    import {errTips, successTips} from "@/utils/tips.js";
    import sourceUpload from '@/common/upload/resourceUpload';

    export default {
        components: {sourceUpload,},
        props: ['title', 'form', 'formLabelWidth', 'dialogSubmitVisible', 'isShowSubmitHistory', 'projectList', 'loading', 'reviewProcessList'],
        data() {
            var validateType = (rule, value, callback) => {
                if (value == null) {
                    callback(new Error('请选择评审类型！'));
                } else if (value === '-1') {
                    callback(new Error('当前项目无法发起评审！'));
                } else {
                    callback();
                }
            };
            var validateWarn = (rule, value, callback) => {
                if (value == null) {
                    callback(new Error('请输入截止前提醒天数！'));
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
                uploadIndex: false, //用于开启上传文件 true时开启上传，false停止
                rules: {
                    content: [
                        {required: true, message: '请输入评审内容', trigger: 'blur'},
                        {min: 5, message: '长度至少有5个字符', trigger: 'blur'}
                    ],
                    deadline: [
                        {required: true, message: '请选择截止日期', trigger: 'blur'}, //这里不需要加type:'date'
                    ],
                    purpose: [
                        {required: true, message: '请输入评审目的', trigger: 'blur'},
                    ],
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
                }
            }
        },
        computed: {
            localForm: function () {
                return this.form;//localForm与为父组件传递的form内容保持一致
            },
            isCache: function () { //只有当页面是发起评审时才有缓存功能，当页面是重新提交时或者修改提交时，没有缓存，只有取消
                if (this.title === "发起评审") {
                    return true;
                } else {
                    return false;
                }
            },
        },
        watch:{
            reviewProcessList: function(val){ //监听父组件传递过来的reviewProcessList是否发生变化，发生变化就更新本地的属性
                this.localReviewProcess = val;
            }
        },
        methods: {
            setIdCard(data) { //data 表示上传文件的地址
                console.log("data的数据:", data);
                data && (this.localForm.resourceList.unshift({
                    'resourceUrl': data,
                    'resourceName': data.split('/').slice(-1)[0]
                }));// unshift是插入元素到第一个位置，地址中被/分割的最后一部分是文件地址
                console.log("最终提交的数据：", this.localForm);
                httpPost('/v1/authorization/review/review/insert', this.localForm).then(results => {
                    const {msg, httpCode} = results.data;
                    if (httpCode === 200) {
                        successTips('发布评审任务成功');
                        // this.setCache('myReview');
                        this.localForm = {};
                        this.$emit('closeSubmitDialog');//关掉弹框
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    } else {
                        alert(httpCode);
                    }

                });

            },
            submitReview(formName) {//提交评审
                console.log('formName is :', formName);
                // console.log('formName在的组件:',this.$refs[formName]);
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        console.log("有效的！");
                        if (this.localForm.resourceList && this.localForm.resourceList.length > 0) {//当resourceList存在(不为undefind)且resourceList的长度大于0时，调用setIdCard()
                            this.setIdCard()
                        } else {  //resourceList不存在或者文件数目等于0时，开启上传附件
                            this.uploadIndex = !this.uploadIndex;//当resourceList中包含的上传文件数目为0时开启上传附件
                        }
                    } else {
                        console.log("无效的！");
                        return false;
                    }
                });

            },
            getReviewProcessList(projectId) {
                httpGet("/v1/authorization/review/process/list", {id: projectId}).then(results => {
                    const {httpCode, msg, data} = results.data;
                    // console.log(data);
                    if (httpCode == 200) {
                        if (data.processList.length == 0) { //没有评审流程
                            this.localReviewProcess = [{id: '-1', processName: "当前项目没有评审流程"}]
                        } else {
                            this.localReviewProcess = data.processList;
                        }
                    }else if(msg==="请求参数出错"){
                         errTips("请先选择项目！");
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }

                });
            },
            changeSubmitVisible() {//通过点击弹框右上角的 X的方式 关掉页面，需要传递消息给父组件，用过父组件关掉弹框
                this.$emit('closeSubmitDialog');
            },
            storeReview() {//暂存评审
                this.$emit('closeSubmitDialog');
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
