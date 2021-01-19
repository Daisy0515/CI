<!--功能：创建人编辑缺陷
    调用页面：codeDefct
             -->
<template>
    <el-dialog :visible.sync="dialogFormVisible" :before-close="changeVisible"
               width="70%">
        <div class="container deskHeader">
            <el-card class="box-card0">
                <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm">
                    <el-form-item label="标题：">
                        <span>{{ruleForm.title}}</span>
                    </el-form-item>
                    <el-form-item label="描述:" prop="description">
                        <quill-editor v-model="ruleForm.description"
                                      ref="myQuillEditor"
                                      class="quill-editor1"
                                      :options="editorOption"
                                      @blur="onEditorBlur($event)"
                                      @focus="onEditorFocus($event)"
                                      @ready="onEditorReady($event)">
                        </quill-editor>
                    </el-form-item>

                    <!-- resourceFile为空！ -->
                    <el-form-item label="附件：">
                        <a target="_Blank" :href="ruleForm.resourceFile" v-if="ruleForm.resourceFile">下载附件</a>
                        <a v-if="!ruleForm.resourceFile" target="_Blank">暂无附件</a>
                    </el-form-item>
                    <el-form-item label="历史描述:" prop="historyList">
                        <a v-if="!history" @click="history=true" style="cursor:pointer;">点击展开</a>
                        <a v-if="history" @click="history=false" style="cursor:pointer;">点击收回</a>
                        <el-table
                                v-if="history"
                                :data="ruleForm.historyList"
                                style="width: 100%;float:right"
                                :header-cell-style="rowClass"
                                v-loading="loading"
                        >
                            <el-table-column fixed prop="projectCode" label="指派人" align="center">
                                <template slot-scope="scope">
                                    <el-tooltip
                                            class="item"
                                            effect="dark"
                                            :content="scope.row.appointName"
                                            placement="top-start"
                                    >
                                        <span class="tablehidden">{{scope.row.appointName}}</span>
                                    </el-tooltip>
                                </template>
                            </el-table-column>
                            <el-table-column fixed prop="projectCode" label="描述" align="center">
                                <template slot-scope="scope">
                                    <el-tooltip
                                            class="item"
                                            effect="dark"
                                            :content="scope.row.description"
                                            placement="top-start"
                                    >
                                        <span class="tablehidden" v-html="scope.row.description">{{scope.row.description}}</span>
                                    </el-tooltip>
                                </template>
                            </el-table-column>
                            <el-table-column fixed prop="resourceFile" label="附件" align="center">
                                <template slot-scope="scope">
                                    <el-tooltip
                                            class="item"
                                            effect="dark"
                                            :content="scope.row.resourceFile"
                                            placement="top-start"
                                    >
                                        <span class="tablehidden">{{scope.row.resourceFile}}</span>
                                        <a target="_Blank" :href="scope.row.resourceFile" v-if="scope.row.resourceFile">下载附件</a>
                                        <a v-if="!scope.row.resourceFile" target="_Blank">暂无附件</a>
                                    </el-tooltip>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-form-item>
                    <el-form-item label="所属项目:">
                        <span>{{ruleForm.projectName}}</span>
                    </el-form-item>
                    <el-form-item label="级别：">
                        <span v-if="ruleForm.level===1" style="color:red">█马上解决</span>
                        <span v-if="ruleForm.level===2" style="color:orange">█急需解决</span>
                        <span v-if="ruleForm.level===3" style="color:#FFE153">█高度重视</span>
                        <span v-if="ruleForm.level===4" style="color:green">█正常处理</span>
                        <span v-if="ruleForm.level===5" style="color:blue">█低优先级</span>
                    </el-form-item>
                    <el-form-item label="当前状态:">
                        <span class="tablehidden" v-if="ruleForm.status===1">待解决</span>
                        <span class="tablehidden" v-if="ruleForm.status===2">解决中</span>
                        <span class="tablehidden" v-if="ruleForm.status===3">已解决</span>
                        <span class="tablehidden" v-if="ruleForm.status===4">结束</span>
                    </el-form-item>
                </el-form>
                <el-form :model="ruleForm2" ref="ruleForm2" class="demo-ruleForm">
                    <el-form-item label="修改状态:" class="borderTop">
                        <el-select
                                style="width:200px;margin-left:10px;"
                                v-model="ruleForm2.status"
                                placeholder="请选择"
                                size="small"
                        >
                            <el-option
                                    v-if="ruleForm.status===1"
                                    value="1"
                                    label="结束"
                                    @click.native="reason=false,appoint=false"
                            ></el-option>
                            <el-option
                                    v-if="ruleForm.status===2"
                                    value="1"
                                    label="结束"
                                    @click.native="reason=false,appoint=false"
                            ></el-option>
                            <el-option
                                    v-if="ruleForm.status===3"
                                    value="1"
                                    label="结束"
                                    @click.native="reason=false,appoint=false"
                            ></el-option>
                            <el-option
                                    v-if="ruleForm.status===3"
                                    value="2"
                                    label="重新打回"
                                    @click.native="reason=true,appoint=false"
                            ></el-option>
                            <el-option
                                    v-if="ruleForm.status===4"
                                    value="3"
                                    label="重新开启"
                                    @click.native="appoint=true,reason=false"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <!--使用编辑器-->
                    <el-form-item label="打回理由:" prop="description" v-if="reason">
                        <quill-editor v-model="ruleForm2.description"
                                      ref="myQuillEditor"
                                      class="quill-editor2"
                                      :options="editorOption"
                                      @blur="onEditorBlur2"
                                      @focus="onEditorFocus2"
                                      @ready="onEditorReady2">
                        </quill-editor>
                    </el-form-item>
                    <el-form-item style="margin-left:80px;" v-if="reason">
                        <sourceUpload :uploadIndex="uploadIndex" v-on:setIdCard="setIdCard($event)"/>
                    </el-form-item>
                    <el-form-item label="指派给:" v-if="appoint">
                        <el-select
                                style="width:200px;margin:0 0 0 15px"
                                v-model="ruleForm2.userId"
                                placeholder="请选择"
                                size="small"
                        >
                            <el-option
                                    v-for="(items,index) in userList"
                                    :key="index"
                                    :value="items.userId"
                                    :label="items.userName"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="publish">
                        <el-button type="primary" @click="submitForm()" size="medium"
                                   style="width:150px;display:block;margin:0 auto">保存
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
    </el-dialog>
</template>

<script>
    import {quillEditor} from 'vue-quill-editor'; //调用编辑器
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    // import sourceUpload from "@/common/upload/resourceUpload";
    import {httpGet, httpPut} from "@/utils/http.js";
    // import {specificDate} from "@/utils/getDate.js";
    import {errTips, successTips} from "@/utils/tips.js";
    // import {mapMutations, mapActions, mapGetters} from "vuex";

    export default {
        components: {
            quillEditor,
        },
        name: "issueEditCreator",
        props: {
            dialogFormVisible: {
                type: Boolean,
                default: false,
            },
            issueId: {
                type: Number,
                default: null,
            }
        },
        data(){
            return {
                history: false,
                editorOption: {},
                uploadIndex: false,
                statusList: [],
                ruleForm:{
                    title: "",
                    description: "",
                    resourceFile: "",
                    historyList: [],
                    projectName: "",
                    level: null,
                    status: null,
                },
                ruleForm2: {
                    id: null,
                    status: "",
                    userId: "",
                    description: "",
                    resourceFile: ""
                },
                userId: "",
                userList: [],
                appoint: false,
                reason: false
            }
        },

        methods:{
            changeVisible() {
                this.$emit('closeDialog');
            },
            onEditorBlur(event) {
                event.enable(false);
                // console.log('blur', this.messages)
            },

            onEditorFocus(event) {
                event.enable(false);
                // console.log('focus', this.messages)
            },

            onEditorReady(event) {
                event.enable(false);
                // console.log('ready', this.messages)
            },
            onEditorBlur2() {
                // console.log('blur', this.messages)
            },

            onEditorFocus2() {
                // console.log('focus', this.messages)
            },

            onEditorReady2() {
                // console.log('ready', this.messages)
            },
            getIssue() {
                httpGet("/v1/authorization/bug/edit/creator", {id: this.issueId}).then(
                    results => {
                        const {httpCode} = results.data;
                        if (httpCode === 200) {
                            let newData = results.data.data;
                            this.ruleForm = newData;
                        } else if (httpCode === 400) {
                            errTips("页面丟失");
                        }
                    }
                );
            },
            //获取某个项目的可指派人
            getUsers() {
                httpGet("/v1/authorization/bug/edit/creatoruser", {id: this.issueId}).then(
                    results => {
                        const {msg, data, httpCode} = results.data;
                        if (httpCode === 200) {
                            this.userList = data.userList;
                        } else if (httpCode !== 401) {
                            errTips(msg);
                        }
                    }
                );
            },
            //提交表单
            setIdCard(data) {
                data && (this.ruleForm2.resourceFile = data);
                this.ruleForm2.id = this.issueId;
                httpPut("/v1/authorization/bug/creator/save", this.ruleForm2).then(results => {
                    const {msg, httpCode} = results.data;
                    if (httpCode === 200) {
                        successTips("编辑缺陷成功！");
                        
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                });
            },
            submitForm() {
                if (this.ruleForm2.status == 2) {
                    this.ruleForm2.resourceFile ? this.setIdCard() : (this.uploadIndex = !this.uploadIndex);
                } else {
                    this.setIdCard();
                }
            }
        }
    }
</script>

<style scoped>

</style>
