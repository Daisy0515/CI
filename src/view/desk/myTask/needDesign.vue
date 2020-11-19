<!--
功能：第一次提交需求设计文档（不用获取文档内容）
引用：我的任务的提交文档
-->
<template>
    <div class="applicationView">
        <div class="header">
            <div class="container deskHeader">
                <h4>
                    您的位置：
                    <router-link to="myTask">我的任务</router-link>
                    >
                    <span class="active">提交文档</span>
                </h4>
            </div>
        </div>
        <div class="container">
            <el-card class="box-card0" style="text-align: left;">
                <h1 style="color: #303133;">我的任务-需求设计</h1>
                <br/>
                <br/>

                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
                    <el-button type="primary" size="large" style="width:150px;margin-left:85%">下载模板</el-button>
                    <br/>
                    <br/>

                    <el-form-item label="需求背景" prop="introduction">
                        <el-input type="textarea" class="input_textarea " v-model="ruleForm.introduction" :rows="10"
                                  style="width:87%;float:right"></el-input>
                    </el-form-item>

                    <el-form-item label="功能性需求" prop="functionality">
                        <el-input type="textarea" class="input_textarea " v-model="ruleForm.functionality" :rows="10"
                                  style="width:87%;float:right"></el-input>
                    </el-form-item>

                    <el-form-item label="非功能性需求" prop="design">
                        <el-input type="textarea" class="input_textarea " v-model="ruleForm.design" :rows="10"
                                  style="width:87%;float:right"></el-input>
                    </el-form-item>

                    <el-form-item label="设计约束" prop="demand">
                        <el-input type="textarea" class="input_textarea " v-model="ruleForm.demand" :rows="10"
                                  style="width:87%;float:right"></el-input>
                    </el-form-item>

                    <el-form-item label="原文件">
                        <div style="margin-left:8%; float: left;">
                            <sourceUpload :uploadIndex="uploadIndex" v-on:setIdCard="setIdCard($event)"/>
                        </div>
                    </el-form-item>

                    <el-form-item class="cancel">
                        <el-button type="primary" @click="returnMyTask" size="medium"
                                   style="width:150px;margin-left:25%">返回
                        </el-button>
                        <el-button type="primary" @click="submitForm('ruleForm')" size="medium"
                                   style="width:150px;margin-left:25%">保存
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
    </div>
</template>

<script>
    import {httpPut} from '@/utils/http.js';
    import {errTips} from '@/utils/tips.js';
    import sourceUpload from '@/common/upload/resourceUpload';
    import {mapMutations} from "vuex";

    export default {
        components: {
            sourceUpload
        },
        data() {
            return {
                uploadIndex: false,
                ruleForm: {
                    demand: "", //设计约束
                    design: "", //非功能性需求
                    id: "", //任务编号ID（没有用到）
                    functionality: "", //功能性需求
                    introduction: "", //需求背景
                    sourceFile: "",//原文件
                    documentsId: "",
                    remark: ""

                },
                // 表单验证
                rules: {
                    introduction: [{required: true, message: '请输入需求背景', trigger: 'blur'}],
                    functionality: [{required: true, message: '请输入功能性需求', trigger: 'blur'}],
                    design: [{required: true, message: '请输入非功能性需求', trigger: 'blur'}],
                    demand: [{required: true, message: '请输入约束设计', trigger: 'blur'}]
                }
            };
        },

        created: function () {
            this.ruleForm.id = this.$route.query.id;
        },
        methods: {
            ...mapMutations(['setCache']),
            returnMyTask() {
                this.$router.push({path: './myTask'});
            },

            setIdCard(data) {
                data && (this.ruleForm.sourceFile = data);

                httpPut('/v1/authorization/mission/missioncommit/update', this.ruleForm).then(results => {
                    const {msg, httpCode} = results.data;
                    if (httpCode === 200) {
                        this.setCache('myTask');
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    } else {
                        alert(httpCode);
                    }
                });
            },

            submitForm(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.ruleForm.sourceFile ? this.setIdCard() : (this.uploadIndex = !this.uploadIndex);
                    } else {
                        return false;
                    }
                });
            }
        }
    };
</script>
<style lang="scss">
    @import '@/assets/scss/applicationView.scss';
</style>
