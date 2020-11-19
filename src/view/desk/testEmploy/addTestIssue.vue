<template>
    <div class="publishtask">
        <div class="Crumbs">
            <div class="container deskHeader">
                <h4>
                    您的位置：
                    <router-link to="./myTestTask">我的任务</router-link>
                    >
                    <span class="active">上报缺陷</span>
                </h4>
            </div>
        </div>
        <div class="container deskHeader">
            <el-card class="box-card0">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
                    <el-form-item label="标题" prop="title">
                        <el-input class="input_title title" v-model="ruleForm.title"></el-input>
                    </el-form-item>

                    <el-form-item label="描述" prop="description">
                        <el-input type="textarea" class="input_textarea" v-model="ruleForm.description"
                                  :rows="10"></el-input>
                        <!-- <quill-editor
                            v-model="ruleForm.description"
                            ref="myQuillEditor"
                            class="editer"
                            :options="editorOption"
                            @blur="onEditorBlur"
                            @focus="onEditorFocus"
                            @ready="onEditorReady"
                        ></quill-editor> -->

                        <!-- 富文本编辑框 -->
                        <!-- <div id="editor"
              style="float:right;width:95%;height:350px;background: #ffffff;">
              </div> -->
                    </el-form-item>


                    <el-form-item label="缺陷级别" prop="level">
                        <el-select v-model="ruleForm.level" clearable placeholder="请选择缺陷等级">
                            <el-option label="█马上解决" value="1" style="color:red"></el-option>
                            <el-option label="█急需解决" value="2" style="color:orange"></el-option>
                            <el-option label="█高度重视" value="3" style="color:#FFE153"></el-option>
                            <el-option label="█正常处理" value="4" style="color:green"></el-option>
                            <el-option label="█低优先级" value="5" style="color:blue"></el-option>
                        </el-select>
                    </el-form-item>

                    <!-- <el-form-item class="publish">
                        <el-button type="primary" @click="submitForm('ruleForm')" size="medium" style="width:150px;display:block;margin:0 auto">保存</el-button>
                    </el-form-item> -->
                    <el-form-item class="publish">
                        <el-button type="primary" @click="returnMyTest" size="medium" style="width:150px;">返回
                        </el-button>
                        <el-button type="primary" @click="submitForm('ruleForm')" size="medium"
                                   style="width:150px;margin-left:25%">提交
                        </el-button>

                    </el-form-item>
                </el-form>
            </el-card>
        </div>
    </div>
</template>

<script>
    import {quillEditor} from 'vue-quill-editor'; //调用编辑器
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import {httpGet, httpPost} from '@/utils/http.js';
    import {errTips, successTips} from '@/utils/tips.js';
    import sourceUpload from '@/common/upload/resourceUpload';
    import {mapMutations, mapActions, mapGetters} from 'vuex';
    import regular from '@/mixins/regular/publish.js';

    export default {
        components: {
            quillEditor,
            sourceUpload
        },
        mixins: [regular],
        data() {
            return {
                projectSele: [],
                missionSele: [],
                userSele: [],
                editorOption: {},
                uploadIndex: false,
                ruleForm: {
                    title: '',
                    description: '',
                    level: '',
                    testId: '',
                    missionId: '',
                },
                // 表单验证
                rules: {
                    title: [{required: true, message: '请输入标题', trigger: 'blur'}],
                    description: [{required: true, message: '请输入描述', trigger: 'blur'}],
                }
            };
        },

        created: function () {
            //this.getProjectList();
            this.ruleForm.testId = this.$route.query.testId;
            this.ruleForm.missionId = this.$route.query.missionId;
        },

        methods: {
            ...mapMutations(['setCache']),

            onEditorBlur() {
                console.log('blur', this.messages);
            },

            onEditorFocus() {
                console.log('focus', this.messages);
            },

            onEditorReady() {
                console.log('ready', this.messages);
            },

            returnMyTest() {
                this.$router.push({path: "./myTestTask"});
            },
            submitForm() {
                httpPost('/v1/authorization/test/testbug/insert', this.ruleForm).then(results => {
                    const {msg, httpCode} = results.data;
                    if (httpCode === 200) {
                        // alert(this.ruleForm.resourceFile);
                        successTips('新增缺陷成功！');
                        this.setCache('myTestTask');
                    } else {
                        errTips(msg);
                    }
                });
            }
        }
    };
</script>
<style lang="scss">
    @import '@/assets/scss/publishtask.scss';

    .quill-editor {
        width: 100%;
        float: right;
        height: 200px;
        margin: 0px 0px 50px 0px;
    }
</style>
