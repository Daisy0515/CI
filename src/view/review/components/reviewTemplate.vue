<!--根据评审项属性的列表生成评审表单-->
<template>
    <div>
    <el-row style="margin: 20px auto 0 0;">
        <el-col :span="5">
            <span style="font-size: large;font-weight: bolder;">评审表单(总分：{{totalScore}}分)</span>
        </el-col>
        <el-col :span="2" :offset="14">
            <span style="font-size: large;font-weight: bolder;">评审得分:</span>
        </el-col>
        <el-col :span="3">
            <el-input v-model="reviewScore" size="medium" style="margin-top: -5px;" :readonly="true"></el-input>
        </el-col>
    </el-row>
    <form-create v-model="fApi" :rule="rules" :option="option"/>
    <el-form style="font-weight: bolder"  ref="editorForm" :rules="editorRules">
        <el-form-item label="给作者的意见:" prop="commentsToAuthor">
            <el-input type="textarea" :rows="5" v-model="commentsToAuthor"
                      placeholder="请输入对作者的意见，若内容较多，您也可以放在附件中，此处留下简单提示即可"></el-input>
        </el-form-item>
        <el-form-item label="给管理员的意见:" prop="commentsToEditor">
            <el-input type="textarea" :rows="5" v-model="commentsToEditor"
                      placeholder="请输入对管理员的意见，若内容较多，您也可以放在附件中，此处留下简单提示即可"></el-input>
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
    import formCreate from "@form-create/element-ui";
    // import {errTips, successTips} from "@/utils/tips.js";
    // import {httpGet,httpDelete} from "@/utils/http.js";
    import deepCopyObject from "@/utils/deepCopyObject.js";//深拷贝对象
    import reviewItemTemplate from '@/view/review/components/reviewItemTemplate';
    import sourceUpload from '@/common/upload/resourceUpload';
    export default {
        name: "reviewTemplate",
        components: {
            formCreate: formCreate.$form(),
            reviewItemTemplate:reviewItemTemplate,
            sourceUpload:sourceUpload,
        },
        props:{
            templateConfigList:{
                type:Array,
                default:[],
            }
        },
        data() {
            return {
                templateName: '',//当前评审模板的名称
                totalScore: 0,//评审模板的总分
                templateId:null,//评审模板的id
                commentsToAuthor:null,
                commentsToEditor:null,
                uploadIndex:null,
                reviewScore:null,//评审专家的打分

                fApi:{},
                rules: [],       //生成评审表单的规则
                option: {
                    onSubmit: function(formData) {
                        alert(JSON.stringify(formData));
                    },
                    submitBtn : false,//隐藏提交按钮
                    resetBtn: false,// //隐藏表单重置按钮
                },

                editorRules:{
                    commentsToAuthor:[{required:true,message:"请输入对作者的意见",trigger: 'blur'}],
                    commentsToEditor:[{required:true,message:"请输入对管理员的意见",trigger: 'blur'}]
                }
            };
        },
        watch:{
            /*templateConfigList发生更新就重新生成评审表单*/
            templateConfigList:function(){
                this.setCreateRule();
            }
        },
        methods:{
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
                for (let i = 0; i < this.templateConfigList.length; i++) { /*生成标题**/
                    let item = this.templateConfigList[i];
                    let title = (i + 1) + '.' + item.scoreTitle;//生成评审项的题号和标题
                    if ( item.hint !== null &&item.hint.trim() !== "") {//判断提示题目的提示是否为空，然后添加提示
                        title += "(" + item.hint + ")";
                    }
                    rules.push({ //生成题目的标题和提示
                        type: "h2",
                        domProps: {
                            innerHTML: '<div style="margin-bottom:-30px;"><span >' + title + '</span></div>'
                        },
                    });
                    /*存在分数相关的设置**/
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
                        rule.on = {/**在题目右侧更新本题得分，然后更新全局得分**/
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
                            rule.props.controlsPosition = "right";//计数器的控制放在右边
                            rule.validate.push({
                                type: 'number',
                                max: item.value.max * item.scoreWeight,
                                min: item.value.min * item.scoreWeight,
                                message: '分数范围' + item.value.min * item.scoreWeight + '到' + item.value.max * item.scoreWeight,
                                trigger: ['change','blur']
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
                    /*添加文本说明**/
                    if (item.textAnnotation === true){
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
                        /*将rule置空**/
                        rule = deepCopyObject(nullRule);
                    }
                }
                this.rules = deepCopyObject(rules);
                console.log("rules:", this.rules);
            },
            /**自定义提交表单**/
            submit(){
                this.fApi.submit((formData, $f)=>{
                    this.$refs["editorForm"].validate(valid => {
                        if (valid) {
                            console.log("有效的！");
                        } else {
                            console.log("无效的！");
                        }
                    });
                    alert(JSON.stringify(formData));
                })
            },
        }
    }
</script>

<style scoped>

</style>
