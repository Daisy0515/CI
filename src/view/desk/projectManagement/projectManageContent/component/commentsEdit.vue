<template>
    <el-dialog :visible.sync="dialogFormVisible" :before-close="changeVisible"
               width="70%">
        <div class="container deskHeader">
            <el-card class="box-card0" style="text-align: left;">
                <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm">
                    <el-form-item label="标题：">
                        <span>{{ruleForm.opinionTitle}}</span>
                    </el-form-item>

                    <el-form-item label="提交人:">
                        <span>{{ruleForm.submitterName}}</span>
                    </el-form-item>

                    <el-form-item label="描述：">
                        <p class="detail">{{ruleForm.opinionDescription}}</p>
                    </el-form-item>

                    <el-form-item label="项目名称:">
                        <span>{{ruleForm.projectName}}</span>
                    </el-form-item>
                    <el-form-item label="需求名称:">
                        <span>{{ruleForm.missionName}}</span>
                    </el-form-item>
                    <el-form-item label="文档类型:">
                        <span class="tablehidden" v-if="ruleForm.documentsType===1">需求设计</span>
                        <span class="tablehidden" v-if="ruleForm.documentsType===2">概要设计</span>
                        <span class="tablehidden" v-if="ruleForm.documentsType===3">详细设计</span>
                    </el-form-item>
                    <el-form-item label="等级：">
                        <span class="tablehidden" v-if="ruleForm.level===1" style="color:red;">█马上解决</span>
                        <span class="tablehidden" v-if="ruleForm.level===2" style="color:orange;">█急需解决</span>
                        <span class="tablehidden" v-if="ruleForm.level===3" style="color:#FFE153;">█高度重视</span>
                        <span class="tablehidden" v-if="ruleForm.level===4" style="color:green;">█正常处理</span>
                        <span class="tablehidden" v-if="ruleForm.level===5" style="color:blue;">█低优先级</span>
                    </el-form-item>
                    <el-form-item label="状态:">
                        <span class="tablehidden" v-if="ruleForm.status===1">待解决</span>
                        <span class="tablehidden" v-if="ruleForm.status===2">已解决</span>
                    </el-form-item>
                </el-form>
                <el-form :model="editForm" ref="editForm" class="demo-ruleForm">
                    <el-form-item label="修改状态" class="borderTop">
                        <el-select
                                style="width:200px"
                                v-model="editForm.status"
                                placeholder="请选择"
                                size="small"
                        >
                            <el-option
                                    value="2"
                                    label="已解决"
                            ></el-option>
                            <el-option
                                    value="1"
                                    label="待解决"
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
    import {httpGet, httpPut} from "@/utils/http.js";
    // import {specificDate} from "@/utils/getDate.js";
    import {errTips, successTips} from "@/utils/tips.js";
    // import {mapMutations, mapActions, mapGetters} from "vuex";

    export default {
        name: "commentsView",
        props: {
            dialogFormVisible: {
                type: Boolean,
                default: false,
            },
            id: {
                type: Number,
                default: null,
            },
            userId: {
                type: Number,
                default: null,
            }
        },
        data() {
            return {
                list: [{value: "是"}, {value: "否"}],
                typeValue: "",
                ruleForm: {},
                editForm:{}
            };
        },

        methods: {
            changeVisible() {
                this.$emit('closeDialog');
            },
            
            getView() {
                this.loading = true;
                httpGet(`/v1/authorization/documents/edit/principal?id=${this.id}`).then(
                    results => {
                        const {data, msg, httpCode} = results.data;
                        if (httpCode === 200) {
                            this.ruleForm = data;
                        } else if (httpCode === 400) {
                            errTips(msg);
                        }
                    }
                );
            },

            submitForm() {
                if (this.editForm.status === "" ) {
                    errTips("修改状态不能为空！");
                } else {
                    this.editForm.id = this.id;
                    this.editForm.userId = this.userId;
                    console.log(this.editForm);
                    httpPut("/v1/authorization/documents/principal/save", this.editForm).then(results => {
                        const {msg, httpCode} = results.data;
                        if (httpCode === 200) {
                            successTips("成功处理缺陷！");
                            this.$emit('closeDialog',true);
                        } else if (httpCode !== 401) {
                            errTips(msg);
                        }
                    });

                }
            }

        }
    };
</script>
<style lang='scss'>
    @import "@/assets/scss/applicationView.scss";
</style>
