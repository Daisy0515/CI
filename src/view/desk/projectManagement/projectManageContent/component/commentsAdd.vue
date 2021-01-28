<template>
    <el-dialog :visible.sync="dialogFormVisible" :before-close="changeVisible" :close-on-click-modal="false"
               width="70%">
        <div class="container deskHeader">
            <el-card class="box-card0">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
                    <el-form-item label="标题" prop="opinionTitle">
                        <el-input class="input_title title" v-model="ruleForm.opinionTitle"></el-input>
                    </el-form-item>

                    <el-form-item label="描述" prop="opinionDescription">
                        <el-input type="textarea" class="input_textarea " v-model="ruleForm.opinionDescription"
                                  :rows="10" style="width:100%"></el-input>
                    </el-form-item>

                    <!-- <el-form-item label="指派项目" prop="projectId">
                        <el-select v-model="ruleForm.projectId" clearable placeholder="请选择项目名称" @change="getTitleList">
                            <el-option v-for="item in projectList" :key="item.projectId" :label="item.projectName"
                                       :value="item.projectId"></el-option>
                        </el-select>
                    </el-form-item> -->

                    <el-form-item label="指派任务" prop="titleId">
                        <el-select v-model="ruleForm.titleId" clearable placeholder="请选择任务名称">
                            <el-option v-for="item in missionTitle" :key="item.id" :label="item.title"
                                       :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <!--
                    <el-form-item label="指派需求" prop="missionId">
                        <el-select v-model="ruleForm.missionId" clearable placeholder="请选择需求名称">
                            <el-option v-for="item in demandList" :key="item.id" :label="item.content" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item label="文档类型" prop="documentsType">
                        <el-select v-model="ruleForm.documentsType" clearable placeholder="请选择文档类型">
                            <el-option label="需求设计文档" :value="1"></el-option>
                            <el-option label="概要设计文档" :value="2"></el-option>
                            <el-option label="详细设计文档" :value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="等级状态" prop="level">
                        <el-select v-model="ruleForm.level" clearable placeholder="请选择缺陷等级">
                            <el-option label="█马上解决" :value="1" style="color:red"></el-option>
                            <el-option label="█急需解决" :value="2" style="color:orange"></el-option>
                            <el-option label="█高度重视" :value="3" style="color:#FFE153"></el-option>
                            <el-option label="█正常处理" :value="4" style="color:green"></el-option>
                            <el-option label="█低优先级" :value="5" style="color:blue"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item class="publish">
                        <el-button type="primary" @click="submitForm('ruleForm')" size="medium"
                                   style="width:150px;margin-left:25%">保存
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
    </el-dialog>
</template>

<script>
    // import Qiniu from 'qiniu-js'
    // import * as Qiniu from 'qiniu-js'
    // import FileUpload from "vue-upload-component";
    // import E from 'wangeditor';
    // import {quillEditor} from 'vue-quill-editor'; //调用编辑器
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import {httpPost} from '@/utils/http.js';
    import {errTips, successTips} from '@/utils/tips.js';
    // import sourceUpload from '@/common/upload/resourceUpload';
    // import {mapMutations, mapActions, mapGetters} from 'vuex';
    import regular from '@/mixins/regular/publish.js';

    export default {
        name: "commentsAdd",
        props: {
            dialogFormVisible: {
                type: Boolean,
                default: false,
            },

            projectId: {
                type: Number,
                default: null,
            },

            missionTitle: {
                type: Array,
                default: null,
            }

        },
        mixins: [regular],
        data() {
            return {
                teamId: '',
                projectList: [],
                demandList: [],
                ruleForm: {
                    documentsType: null,
                    level: null,
                    opinionDescription: '',
                    opinionTitle: '',
                    projectId: '',
                    titleId: ''
                },
                // 表单验证
                rules: {
                    title: [{required: true, message: '请输入标题', trigger: 'blur'}]
                }
            };
        },

        methods: {
            changeVisible() {
                this.$emit('closeDialog');
            },

            // getProjectList() {
            //     //get /v1/authorization/documents/title/get
            //     httpGet('/v1/authorization/documents/projectid/get').then(results => {
            //         const {msg, data, httpCode} = results.data;
            //         if (httpCode === 200) {
            //             this.teamId = data.teamId;
            //             this.projectList = data.projectList;
            //         } else if (httpCode === 400) {
            //             errTips(msg);
            //         } else if (httpCode !== 401) {
            //             errTips(msg);
            //         }
            //     });
            // },

            // getTitleList: function (value) {
            //     //get /v1/authorization/documents/title/get
            //     httpGet('/v1/authorization/documents/title/get', {id: value}).then(results => {
            //         const {msg, data, httpCode} = results.data;
            //         if (httpCode === 200) {
            //             this.teamId = data.teamId;
            //             this.missionTitle = data.missionTitle;
            //         } else if (httpCode === 400) {
            //             errTips(msg);
            //         } else if (httpCode !== 401) {
            //             errTips(msg);
            //         }
            //     });
            // },
            // changeProject: function (value) {
            //     httpGet('/v1/authorization/documents/demanddesign/get', {id: value}).then(results => {
            //         const {msg, data, httpCode} = results.data;
            //         if (httpCode === 200) {
            //             this.demandList = data.demandDesignList;
            //         } else if (httpCode === 400) {
            //             errTips(msg);
            //         } else if (httpCode !== 401) {
            //             errTips(msg);
            //         }
            //     });
            // },

            setIdCard() {
                //data && (this.ruleForm.resourceFile = data);
                this.ruleForm.projectId = this.projectId;
                httpPost('/v1/authorization/documents/add/documents', this.ruleForm).then(results => {
                    const {msg, httpCode} = results.data;
                    if (httpCode === 200) {
                        // alert(this.ruleForm.resourceFile);
                        successTips('新增文档意见成功！');
                        //alert(1);
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                });
            },
            submitForm(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.setIdCard();
                    } else {
                        return false;
                    }
                });
            }
        }
    };
</script>
<style lang="scss">
    @import "@/assets/scss/publishtask.scss";
    // @import '@/assets/scss/applicationView.scss';
</style>
