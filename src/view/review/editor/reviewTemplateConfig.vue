<template>
    <div>
        <div style="padding-left: 10px;margin-buttom:30px;">
            <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 130%;">
                <el-breadcrumb-item :to="{ path: '/editorIndex' }">评审管理员</el-breadcrumb-item>
                <el-breadcrumb-item :to="{path:'/editorManager'}">评审管理</el-breadcrumb-item>
                <el-breadcrumb-item>评审模板配置</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <h3 style="margin: 20px auto">评审模板配置</h3>
        <el-form :model="templateForm" :rules="rules" ref="templateForm" label-width="100px">
            <el-form-item label="模板名称" prop="templateName">
                <el-col :span="8">
                    <el-input v-model="templateForm.templateName " placeholder="请输入模板名称"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item style="margin-left: -8%;">
                <el-col :span="4">
                    <el-checkbox v-model="isSetTotalScore ">是否需要设定总分</el-checkbox>
                </el-col>
                <el-col :span="5" v-if="isSetTotalScore">
                    <el-input v-model.number="expectedTotalScore " placeholder="请输入模板的总分"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="请选择">
                <el-select v-model="selectedType" placeholder="请选择单个评审项">
                    <el-option label="文本/分数选项域" value="scoreOption"></el-option>
                    <el-option label="文本/分数输入域" value="scoreInput"></el-option>
                    <el-option label="是或否选择域" value="yesOrNo"></el-option>
                </el-select>
                <el-button type="primary" style="margin-left: 20px;" @click="addFormItem">添加</el-button>
            </el-form-item>

            <el-form-item>
                <el-row style="margin-left: -60px;" :gutter="20">
                    <el-col :span="4">
                        <h3 style="">已添加评审项:</h3>
                    </el-col>
                    <el-col :span="3">
                        <h3 style="">当前总分:</h3>
                    </el-col>
                    <el-col :span="5">
                        <el-input v-model.number="templateForm.totalScore"></el-input>
                    </el-col>
                    <el-col :span="5" v-if="false">
                        <h3 style="color:#15d623;" v-if="scoreCompare===-1">当前总分低于设定总分！</h3>
                        <h3 style="color:#1d8dff;" v-if="scoreCompare===0">当前总分等于设定总分！</h3>
                        <h3 style="color:red" v-if="scoreCompare===1">当前总分超过设定总分</h3>
                    </el-col>
                </el-row>
                <el-table :data="configList" style="margin-top: 20px;" border>
                    <el-table-column property="scoreTitle" label="评审项名称" align="center"></el-table-column>
                    <el-table-column property="type" label="评审项类型" align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.type==1">文本/分数选项域</span>
                            <span v-if="scope.row.type==2">是或否选择域</span>
                            <span v-if="scope.row.type==3">文本/分数输入域</span>
                        </template>
                    </el-table-column>
                    <el-table-column property="value" label="得分范围" align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.value.min!==null&&scope.row.value.max!==null">
                                [{{scope.row.value.min*scope.row.scoreWeight}},{{scope.row.value.max*scope.row.scoreWeight}}]</span>
                            <span v-else>无分数</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button @click="handleEditItem(scope.$index)" type="text" size="medium"
                            ><i class="el-icon-search"></i>编辑
                            </el-button>
                            <el-button @click="handleDeleteFormItem(scope.$index)" type="text" size="medium"
                            ><i class="el-icon-delete"></i>删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item style="margin-top: 20px;">
                <el-button type="primary" @click="submitForm('templateForm')">立即创建</el-button>
                <el-button @click="resetForm('templateForm')">重置</el-button>
            </el-form-item>
        </el-form>
        <review-item-template
                :form="reviewItemForm" :itemIndex="itemIndex" :reviewItemType="selectedType"
                :formItemVisible="formItemVisible" @closeReviewItemForm="closeReviewItemForm"
                @getNewReviewItemForm="getNewReviewItemForm"
                @getUpdatedReviewItemForm="getUpdatedReviewItemForm"></review-item-template>
    </div>
</template>

<script>
    import {errTips, successTips} from "@/utils/tips.js";
    import reviewItemTemplate from '@/view/review/components/reviewItemTemplate';
    import {httpPost} from "@/utils/http.js";

    export default {
        components: {
            reviewItemTemplate
        },
        data() {
            return {
                itemIndex: null,//编辑评审单项的时候，传递单项在表单中的位置
                formItemVisible: false,//用于控制添加评审项的对话框显示
                isSetTotalScore: false,//是否设定总分
                expectedTotalScore: null,//期望的目标总分
                selectedType: null,//用户已选中的评审项类型
                configList: [],//模板配置信息列表 ,
                reviewItemForm: {},//存储单个评审项的信息
                templateForm: {
                    templateName: '',
                    totalScore: 0,//评审模板的总分
                    configList: [],
                },
                rules: {
                    templateName: [
                        {required: true, message: '请输入模板名称', trigger: 'blur'},
                    ],
                },
            };
        },
        computed: {
            scoreCompare: function () {//设定的总分与当前总分的比较
                if (this.expectedTotalScore > this.templateForm.totalScore) {//设定的总分大于当前总分
                    return -1;
                } else if (this.expectedTotalScore === this.templateForm.totalScore) {//设定的总分等于当前总分
                    return 0;
                } else {//设定的总分小于当前总分
                    return 1;
                }
            }
        },
        watch: {
            configList: function () {
                // console.log("configList has changed");
                this.templateForm.totalScore = 0;
                for (let item of this.configList) {
                    this.templateForm.totalScore += item.value.max * item.scoreWeight;
                }
            }
        },
        methods: {
            handleEditItem(index) { //编辑评审单项
                this.reviewItemForm = this.configList[index];
                this.itemIndex = index;
                this.formItemVisible = true;
            },
            handleDeleteFormItem(index) {//删除评审单项
                this.configList.splice(index, 1);
            },
            submitForm(formName) { //提交表单
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.isSetTotalScore === true) {
                            if (this.templateForm.totalScore !== this.expectedTotalScore) {
                                errTips("当前总分与设定总分不一致！");
                                return false;
                            }
                        }
                        if (this.configList.length === 0) {
                            errTips("评审项不能为空！");
                            return false;
                        } else {
                            for (let i = 0; i < this.configList.length; i++) {
                                if (this.configList[i].isScore === true) {
                                    this.configList[i].fieldOne = i + "-1";

                                }
                                if (this.configList[i].textAnnotation === true) {
                                    this.configList[i].fieldTwo = i + "-2";
                                }
                            }
                            this.templateForm.configList = this.configList;
                        }

                        httpPost('/v1/authorization/review/template/insert', this.templateForm).then(results => {
                            console.log("this.templateForm", this.templateForm);
                            const {data, msg, httpCode} = results.data;
                            if (httpCode === 200) {
                                successTips("添加成功！");
                                this.$router.push('/editorReviewTemplates');
                            } else {
                                errTips(msg);
                            }
                        })

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            addFormItem() {//增加一个评审单项
                if (this.selectedType === null) {
                    errTips("请选择评审项");
                } else {
                    this.itemIndex = null;//新增评审单项，itemIndex要置为null
                    this.formItemVisible = true;
                }
            },
            getNewReviewItemForm(newReviewItemForm) {//存储评审单项组件提交的新的评审单项记录
                this.configList.push(newReviewItemForm);
            },
            getUpdatedReviewItemForm(index, updatedReviewItemForm) {//存储评审单项组件提交的更新的评审单项记录
                this.configList[index] = updatedReviewItemForm;
                this.configList = [...this.configList];//多了这一步的原因是，this.configList本身的引用没有发生变化，所以已添加评审项对应的表格显示的内容不会变化
            },
            closeReviewItemForm() {//关闭评审单项对话框
                this.formItemVisible = false;
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        }
    }
</script>
