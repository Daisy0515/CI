<template>
    <div>
        <div style="padding-left: 10px;margin-buttom:30px;">
            <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 130%;">
                <el-breadcrumb-item :to="{ path: '/editorIndex' }">评审管理员</el-breadcrumb-item>
                <el-breadcrumb-item :to="{path:'/editorManager'}">评审管理</el-breadcrumb-item>
                <el-breadcrumb-item>评审模板详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-row style="margin: 20px auto;">
            <span style="font-size: large;">评审模板名称:<span style="font-weight: bolder;">{{templateName}}</span></span>
            <span style="font-size: large; margin-left: 20px;"> 总分：{{totalScore}}分</span>
        </el-row>
        <el-table :data="templateConfigList" style="margin-top: 20px;" border v-loading="configListLoading">
            <el-table-column property="scoreTitle" label="评审项标题" align="center"></el-table-column>
            <el-table-column property="hint" label="提示" align="center"></el-table-column>
            <el-table-column property="type" label="类型" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.type==1">文本/分数选项域</span>
                    <span v-if="scope.row.type==2">是或否选择域</span>
                    <span v-if="scope.row.type==3">文本/分数输入域</span>
                </template>
            </el-table-column>
            <el-table-column label="得分范围" align="center">
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
                    <el-button @click="handleDeleteFormItem(scope.row.id)" type="text" size="medium"
                    ><i class="el-icon-delete"></i>删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <review-item-template
                :form="reviewItemForm" :itemIndex="itemIndex" :reviewItemType="selectedType"
                :formItemVisible="formItemVisible" @closeReviewItemForm="closeReviewItemForm">
        </review-item-template>
        <el-row style="margin: 20px auto 0 0;">
            <el-col :span="3">
                <span style="font-size: large;font-weight: bolder;">评审表单</span>
            </el-col>
            <el-col :span="2" :offset="16">
                <span style="font-size: large;font-weight: bolder;">评审得分:</span>
            </el-col>
            <el-col :span="3">
                <el-input v-model="reviewScore" size="medium" style="margin-top: -5px;" :readonly="true"></el-input>
            </el-col>
        </el-row>
        <form-create v-model="fApi" :rule="rules" :option="option"/>
        <el-form style="font-weight: bolder">
            <el-form-item label="给作者的意见:">
                <el-input type="textarea" :rows="5" v-model="commentsToAuthor"></el-input>
            </el-form-item>
            <el-form-item label="给管理员的意见:">
                <el-input type="textarea" :rows="5" v-model="commentsToAuthor"></el-input>
            </el-form-item>
            <el-form-item>
                <sourceUpload style="margin-top: 30px;" :uploadIndex="uploadIndex" v-on:setIdCard="setIdCard($event)"/>
            </el-form-item>
        </el-form>
        <el-row style="margin-top: 20px;">
            <el-col :span="3" :offset="9">
                <el-button type="primary" @click="submit">提交</el-button>
            </el-col>
            <el-col :span="2" :offset="7">
                <span style="font-size: large;font-weight: bolder;">评审得分:</span>
            </el-col>
            <el-col :span="3">
                <el-input v-model="reviewScore" size="medium" style="margin-top: -5px;" :readonly="true"></el-input>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    /**本组件采用formCreate组件来动态生成表单**/
    import formCreate from "@form-create/element-ui";
    import {errTips, successTips} from "@/utils/tips.js";
    import {httpGet,httpDelete} from "@/utils/http.js";
    import deepCopyObject from "@/utils/deepCopyObject.js";//深拷贝对象
    import { MessageBox } from "element-ui";
    import reviewItemTemplate from '@/view/review/components/reviewItemTemplate';
    import sourceUpload from '@/common/upload/resourceUpload';

    //他们的位置就对应着type的数字表示（传递给后端的，前端为了更好的阅读体验用的字符串表示）
    const reviewItemTypeStringToId =["","scoreOption","yesOrNo","scoreInput"];
    export default {
        name: "reviewTemplateDetail",
        props: {
            id: String,//评审模板的id
        },
        components: {
            formCreate: formCreate.$form(),
            reviewItemTemplate:reviewItemTemplate,
            sourceUpload:sourceUpload,
        },
        data() {
            return {
                itemIndex: null,//编辑评审单项的时候，传递单项在表单中的位置
                reviewItemForm: null,//存储单个评审项的信息
                formItemVisible: false,//用于控制添加评审项的对话框显示
                selectedType: null,//用户已选中的评审项类型


                fApi:{},
                configListLoading: false,
                templateConfigList: [],//存储评审项的列表
                templateName: '',//当前评审模板的名称
                totalScore: 0,//评审模板的总分
                commentsToAuthor:null,
                commentsToEditor:null,
                uploadIndex:null,
                reviewScore:null,//评审专家的打分
                rules: [],       //生成评审表单的规则
                option: {
                    onSubmit: function(formData) {
                        alert(JSON.stringify(formData));
                    },
                    submitBtn : false,//隐藏提交按钮
                    resetBtn: false,// //隐藏表单重置按钮
                }
            };
        },
        created: function () {
            this.getReviewTemplateDetail();
        },
        methods: {
            getReviewTemplateDetail(){
                this.configListLoading = true;
                httpGet("/v1/authorization/review/templateconfig/list", {id: this.id}).then(results => {
                    const {httpCode, msg, data} = results.data;
                    console.log("data", data);
                    if (httpCode == 200) {
                        this.templateConfigList = data.templateConfigList;
                        this.setCreateRule();
                        this.totalScore = data.totalScore;
                        this.templateName = data.templateName;
                    }else if(httpCode !== 401) {
                        errTips(msg);
                    }
                    this.configListLoading = false;
                });
            },
            /**编辑评审单项**/
            handleEditItem(index) {
                console.log("index",index);
                this.selectedType = reviewItemTypeStringToId[this.templateConfigList[index].type];
                this.reviewItemForm = deepCopyObject(this.templateConfigList[index]);
                this.itemIndex = index;
                this.formItemVisible = true;
            },
            /**存储评审单项组件提交的更新的评审单项记录**/
            // getUpdatedReviewItemForm(index, updatedReviewItemForm) {
            //     this.configList[index] = updatedReviewItemForm;
            //     this.configList = deepCopyObject(this.configList);//多了这一步的原因是，this.configList本身的引用没有发生变化，所以已添加评审项对应的表格显示的内容不会变化
            // },
            closeReviewItemForm() {//关闭评审单项对话框
                this.formItemVisible = false;
                this.getReviewTemplateDetail();
            },
            /**删除单独的评审项**/
            handleDeleteFormItem(id){
                MessageBox.confirm("此操作将删除此评审单项, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    httpDelete(
                        `/v1/authorization/review/templateconfig/delete/${id}`
                    ).then(results => {
                        const { msg, httpCode } = results.data;
                        if (httpCode === 200) {
                            this.getReviewTemplateDetail();
                            successTips('删除成功')
                        } else if (httpCode === 400) {
                            errTips("页面丟失");
                        } else if (httpCode != 500 && httpCode != 401) {
                            errTips(msg);
                        }
                    });
                })
            },
            /**更新全局的 评审得分**/
            changeReviewScore(){//评审专家选择选项、输入分数时发生改变触发的事件，同步更新所有的分数和单项的分数
                const vm = this;
                let score = 0;
                for(let i=0;i<vm.templateConfigList.length;i++){
                    if(vm.fApi.getValue(i+'-1')!=='undefined'){
                        score += vm.fApi.getValue(i+'-1-1');
                    }
                }
                this.reviewScore = score;
            },
            /**生成符合formCreate的生成表单的输入**/
            setCreateRule() {
                const vm = this;
                let rules = [];
                let rule = {};
                rule.props = {};
                rule.options = [];
                rule.validate = [];
                let nullRule = deepCopyObject(rule);//备份一个空的rule
                for (let i = 0; i < this.templateConfigList.length; i++) {
                    /**生成标题**/
                    let item = this.templateConfigList[i];
                    let title = (i + 1) + '.' + item.scoreTitle;//生成评审项的题号和标题
                    if (item.hint.trim() !== "" && item.hint !== null) {//判断提示题目的提示是否为空，然后添加提示
                        title += "(" + item.hint + ")";
                    }
                    rules.push({ //生成题目的标题和提示
                        type: "h2",
                        domProps: {
                            innerHTML: '<div style="margin-bottom:-30px;"><span >' + title + '</span></div>'
                        },
                    });
                    /**存在分数相关的设置**/
                    if (item.isScore === true) {
                        /**生成得分范围**/
                        rules.push({
                            type: "h3",
                            domProps: {
                                innerHTML: '<div style="margin:0 0 -10px 20px;"><span >得分范围:' + item.value.min * item.scoreWeight + '到' + item.value.max * item.scoreWeight + '分</span></div>'
                            },
                            col: {
                                span: 19 //与下方的本题得分一起占据一行 19 + 5 = 24
                            }
                        });
                        /**生成本题得分框**/
                        rules.push({
                            type: "input",
                            title: "本题得分:",
                            field: item.fieldOne + "-1",//一般为 i-1-1
                            value: null,
                            props: {
                                size: "small",
                                readonly: true,
                            },
                            col: {
                                span: 5
                            },
                        });
                        rule.on = {
                            /**在题目右侧更新本题得分，然后更新全局得分**/
                            change: function () {
                                vm.fApi.setValue(i + '-1-1', vm.fApi.getValue(i + '-1') * item.scoreWeight);
                                vm.changeReviewScore();
                            }
                        };
                        rule.field = item.fieldOne;//为 i-1，i为第i道题,i从0开始
                        if (item.type === 1) {//1.生成文本/分数选项
                            rule.title = "选项:";
                            if (item.scoreExplainList !== null && item.scoreExplainList.length > 0) {//存在评审选项
                                rule.type = "radio";
                                for (let scoreExplain of item.scoreExplainList) {
                                    rule.options.push({
                                        'value': parseInt(scoreExplain.score),
                                        'label': scoreExplain.explain,
                                        'disabled': false,
                                    });
                                }
                            }
                        }else if(item.type===2){//2.生成是或否选择
                            rule.type = "switch";
                            rule.title = item.selectAnnotation
                        }else if(item.type === 3){//3.生成文本/分数输入域
                            rule.type = "InputNumber";
                            rule.title = "得分:";
                            rule.props.controlsPosition = "right";
                            rule.col = {
                                span: 6
                            }
                            rule.validate.push({
                                type: 'number',
                                max: item.value.max * item.scoreWeight,
                                min: item.value.min * item.scoreWeight,
                                message: '分数范围' + item.value.min * item.scoreWeight + '到' + item.value.max * item.value.scoreWeight,
                                trigger: 'change',
                            });
                        }
                        if (item.isScoreRequired === true) {//改选项评审者必选
                            rule.validate.push({
                                required: true,
                                message: "请完成本部分",
                                trigger: 'blur',
                            })
                        }
                        rules.push(rule);
                        /**将rule置空**/
                        rule = deepCopyObject(nullRule);
                    }
                    /**添加文本说明**/
                    if (item.textAnnotation === true) {
                        rule.field = item.fieldTwo;
                        rule.type = "input";
                        rule.title = "说明:";
                        rule.props = {
                            type: "textarea",
                            rows: 5,
                        };
                        rule.col = {
                            span: 16
                        }
                        if (item.textDescription === true) {//改选项评审者必选
                            rule.validate.push({
                                required: true,
                                message: '请输入补充说明！',
                                trigger: 'blur',
                            })
                        }
                        rules.push(rule);
                        /**将rule置空**/
                        rule = deepCopyObject(nullRule);
                    }
                }
                this.rules = deepCopyObject(rules);
                console.log("rules:", this.rules);
            },
            /**自定义提交表单**/
            submit(){
                this.fApi.submit((formData, $f)=>{
                    alert(JSON.stringify(formData));
                })
            },

        }
    }

</script>

// setCreateRule() {
//     const vm = this;
//     let rules = [];
//     let rule = {};
//     rule.props = {};
//     rule.options = [];
//     rule.validate = [];
//     let nullRule = deepCopyObject(rule);//备份一个空的rule
//     for (let i = 0; i < this.templateConfigList.length; i++) {
//         /**生成标题开始**/
//         let item = this.templateConfigList[i];
//         let title = (i+1) + '.' + item.scoreTitle;//生成评审项的题号和标题
//         if (item.hint.trim() !== "" && item.hint !== null) {
//             title += "(" + item.hint + ")";
//         }
//         rules.push({ //生成题目的标题
//             type:"h2",
//             domProps: {
//                 innerHTML: '<div style="margin-bottom:-30px;"><span >'+title+'</span></div>'
//             },
//             col:{
//                 span:24
//             }
//         });
//
//         /**生成标题结束**/
//         if (item.type === 1) {//评审项的类型：1.文本/分数选项域 3.文本/分数输入域
//             rule.title = "选项:";
//             if (item.isScore === true) {
//                 rule.field = item.fieldOne;
//                 if (item.scoreExplainList !== null && item.scoreExplainList.length > 0) {//存在评审选项
//                     rules.push({
//                         type:"h3",
//                         domProps: {
//                             innerHTML: '<div style="margin:0 0 -10px 20px;"><span >得分范围:'+item.value.min*item.scoreWeight+'到'+item.value.max*item.scoreWeight+'分</span></div>'
//                         },
//                         col:{
//                             span:19
//                         }
//                     });
//                     rules.push({
//                         type:"input",
//                         title:"本题得分:",
//                         field:item.fieldOne + "-1",
//                         value:null,
//                         props:{
//                             "size":"small",
//                             "readonly": true,
//                         },
//                         col:{
//                             span:5
//                         },
//                     });
//                     rule.type = "radio";
//                     for (let scoreExplain of item.scoreExplainList) {
//                         rule.options.push({
//                             'value': parseInt(scoreExplain.score),
//                             'label': scoreExplain.explain,
//                             'disabled':false,
//                         });
//                     }
//                     rule.on = {
//                         /**在题目右侧更新本题得分，然后更新全局得分**/
//                         change:function(){
//                             vm.fApi.setValue(i+'-1-1', vm.fApi.getValue(i+'-1')*item.scoreWeight );
//                             return vm.changeReviewScore();
//                         }
//                     };
//                 }
//                 if (item.isScoreRequired === true) {//改选项评审者必选
//                     rule.validate.push({
//                         required: true,
//                         message: '请进行选择！',
//                         trigger: 'blur',
//                     })
//                 }
//             }
//         } else if (item.type === 2) {//2.是或否选择域
//             rule.field = item.fieldOne;
//             if (item.isScore === true) {
//                 rule.type = "switch";
//                 rule.title = item.selectAnnotation;
//                 rules.push({
//                     type:"h3",
//                     domProps: {
//                         innerHTML: '<div style="margin:0 0 -10px 20px;"><span >得分范围:'+item.value.min*item.scoreWeight +'到'+item.value.max*item.scoreWeight+'分</span></div>'
//                     },
//                     col:{
//                         span:19
//                     }
//                 });
//                 rules.push({
//                     type:"input",
//                     title:"本题得分:",
//                     field:item.fieldOne + "-1",
//                     value:null,
//                     props:{
//                         "size":"small",
//                         "readonly": true,
//                     },
//                     col:{
//                         span:5
//                     },
//                 });
//                 rule.on = {
//                     /**在题目右侧更新本题得分，然后更新全局得分**/
//                     change:function(){
//                         vm.fApi.setValue(i+'-1-1', vm.fApi.getValue(i+'-1')*item.scoreWeight );
//                         return vm.changeReviewScore();
//                     }
//                 };
//                 if (item.isScoreRequired === true) {//改选项评审者必选
//                     rule.validate.push({
//                         required: true,
//                         message: '请进行选择！',
//                         trigger: 'blur',
//                     })
//                 }
//             }
//         } else if (item.type === 3) {//3.文本/分数输入域
//             rule.field = item.fieldOne;
//             rule.title = "得分:";
//             rule.props.controlsPosition = "right";
//             rule.on = {
//                 /**在题目右侧更新本题得分，然后更新全局得分**/
//                 change:function(){
//                     vm.fApi.setValue(i+'-1-1', vm.fApi.getValue(i+'-1')*item.scoreWeight );
//                     return vm.changeReviewScore();
//                 }
//             };
//             if (item.isScore === true) {
//                 rule.type = "InputNumber";
//                 rules.push({
//                     type:"h3",
//                     domProps: {
//                         innerHTML: '<div style="margin:0 0 -10px 20px;"><span >得分范围:'+item.value.min*item.scoreWeight+'到'+item.value.max*item.scoreWeight+'分</span></div>'
//                     },
//                     col:{
//                         span:19
//                     }
//                 });
//                 rules.push({
//                     type:"input",
//                     title:"本题得分:",
//                     field:item.fieldOne + "-1",
//                     value:null,
//                     props:{
//                         "size":"small",
//                         "readonly": true,
//                     },
//                     col:{
//                         span:5
//                     },
//                 });
//                 rule.col = {
//                     span:6
//                 }
//                 rule.validate.push({
//                     type: 'number',
//                     max : item.value.max*item.scoreWeight,
//                     min : item.value.min*item.scoreWeight,
//                     message: '分数范围'+item.value.min*item.scoreWeight+'到'+item.value.max*item.scoreWeight,
//                     trigger: 'change',
//                 });
//                 if (item.isScoreRequired === true) {//改选项评审者必选
//                     rule.validate.push({
//                         required: true,
//                         message: '请输入分数！',
//                         trigger: 'blur',
//                     })
//                 }
//             }
//         }
//         rules.push(rule);
//         /**将rule置空**/
//         rule = deepCopyObject(nullRule);
//         if(item.textAnnotation===true){
//             rule.field = item.fieldTwo;
//             rule.type = "input";
//             rule.title="说明:";
//             rule.props={
//                 "type": "textarea",
//                 "rows": 5,
//             };
//             rule.col={
//                 span:16
//             }
//             if (item.textDescription === true) {//改选项评审者必选
//                 rule.validate.push({
//                     required: true,
//                     message: '请输入补充说明！',
//                     trigger: 'blur',
//                 })
//             }
//             rules.push(rule);
//             /**将rule置空**/
//             rule = deepCopyObject(nullRule);
//         }
//     }
//
//     this.rules = deepCopyObject(rules);
//     console.log("rules:",this.rules);
// },
