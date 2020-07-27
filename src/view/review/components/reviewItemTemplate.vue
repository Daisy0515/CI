<template>
    <el-dialog :title="formItemTitle" :visible.sync="formItemVisible" :before-close="closeItemForm"
               style="text-align:left; font-weight: bolder;">
        <p style="margin: -20px auto 20px auto; font-weight: bolder;" v-if="reviewItemType==='scoreOption'">
            说明：在文本/分数选项域，您可以设置一个单项选择题，为每一个选项设置不同的分数；
            除此之外，还可以设置一个文本输入域，评审者可以用文字描述一些他/她的想法</p>
        <p style="margin: -20px auto 20px auto; font-weight: bolder;" v-if="reviewItemType==='scoreInput'">
            说明：在文本/分数输入域，您可以设置一个输入框，评审者可以直接输入分数，
            您需要限定好用户输入分数的范围，例如：0-100,除此之外，还可以设置一个文本输入域，评审者可以用文字描述一些他/她的想法</p>
        <p style="margin: -20px auto 20px auto; font-weight: bolder;" v-if="reviewItemType==='yesOrNo'">
            说明：在是或否选项域，您可以设置一个是或否的选择，例如：评审是否通过这种;
            除此之外，还可以设置一个文本输入域，评审者可以用文字描述一些他/她的想法</p>
        <el-form :model="localForm" :rules="formItemRules" ref="reviewItemForm">
            <el-form-item label="标题" :label-width="formLabelWidth" prop="scoreTitle">
                <el-col :span="12">
                    <el-input v-model="localForm.scoreTitle " auto-complete="off"/>
                </el-col>
            </el-form-item>
            <el-form-item label="提示信息" :label-width="formLabelWidth" prop="purpose">
                <el-input v-model="localForm.hint" type="textarea" :rows="2" auto-complete="off"/>
            </el-form-item>
            <template v-if="reviewItemType==='scoreOption'||reviewItemType==='scoreInput'">
                <div style="border:0.5px solid #CCC;margin: 30px auto;"></div>
                <el-checkbox v-model="localForm.isScore"><span
                        style=" font-weight: bolder;">如果此评审项包含数值分数，请选中此框</span></el-checkbox>
                <br>
                说明:
                <p v-if="reviewItemType==='scoreOption'">填写关于分数的信息。得分为有限个分数的集合的字段。分数必须是整数。
                    最小的数字应该表示质量最低:例如，“差”的数字应该比“好”的数字小。</p>
                <p v-if="reviewItemType==='scoreInput'">填写关于分数的信息。分数域是一个让评审者直接输入分数的域，您可以选择是否对作者可见。</p>
                <el-form-item label="分数相关设置：" v-if="localForm.isScore">
                    <br>
                    <div style="margin-left: 70px;">
                        <el-checkbox v-model="localForm.isScoreSubmitVisible  "><span
                                style=" font-weight: bolder;">对作者可见</span></el-checkbox>
                        <br>
                        <el-checkbox v-model="localForm.isScoreRequired  "><span
                                style=" font-weight: bolder;">评审者必须要完成</span></el-checkbox>
                        <br>
                        <template v-if="reviewItemType==='scoreOption'">
                            <p style="line-height:20px;">一个分数的<span>权重</span>定义了这个分数如何贡献于评论的总体分数。例如，如果分数是5，
                                权重是2，那么该字段将为总分增加10(即2 * 5)。权重通常为0(此字段不影响总体得分)
                                或1(此字段的得分将被添加到总体得分中)。</p>
                            <el-form-item label="权重：">
                                <el-col :span="6">
                                    <el-input v-model.number="localForm.scoreWeight " size="medium" auto-complete="off"
                                              style="margin-left: 18px;"/>
                                </el-col>
                            </el-form-item>
                        </template>
                        <el-form-item v-if="reviewItemType==='scoreOption'">
                            <p style=" ">输入评审项所有的值和解释。它们还将出现在表单中，作为审核人员的指导方针。</p>
                            <el-row :gutter="20">
                                <el-col :span="6">
                                    <el-input v-model.number="tempScore" placeholder="请输入选项分值" size="medium"></el-input>
                                </el-col>
                                <el-col :span="14">
                                    <el-input v-model="tempExplain " placeholder="请输入选项说明" size="medium"></el-input>
                                </el-col>
                                <el-col :span="4">
                                    <el-button type="primary" @click="addOption">添加</el-button>
                                </el-col>
                            </el-row>
                            <el-table :data="localForm.scoreExplainList">
                                <el-table-column property="score" label="选项分值" width="100"
                                                 align="center"></el-table-column>
                                <el-table-column property="explain" label="选项说明" align="center"></el-table-column>
                                <el-table-column label="操作" width="80" align="center">
                                    <template slot-scope="scope">
                                        <router-link @click.native="deleteOption(scope.$index)" to><i
                                                class="el-icon-delete"></i><!--传入当前元素的位置--->
                                        </router-link>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-form-item>

                        <el-form-item style="margin-top: 10px;" v-if="reviewItemType==='scoreInput'">
                            <el-col :span="4"><!--这里伪造一下必须输入的标志-->
                                <span style="color: red;">*</span>用户输入范围
                            </el-col>
                            <el-col :span="6">
                                <el-input v-model.number="localForm.value.min" size="medium"
                                          placeholder="请输入最小值"></el-input>
                            </el-col>
                            <el-col :span="0.5" :offset="1">
                                <span>到</span>
                            </el-col>
                            <el-col :span="6" :offset="1">
                                <el-input v-model.number="localForm.value.max" size="medium"
                                          placeholder="请输入最大值"></el-input>
                            </el-col>
                        </el-form-item>
                    </div>
                </el-form-item>
            </template>
            <template v-if="reviewItemType==='yesOrNo'">
                <el-form-item style="margin-left: 50px;">
                    <el-form-item label="选择框后的文本说明：">
                        <el-col :span="12">
                            <el-input v-model="localForm.selectAnnotation" placeholder="例如：评审通过"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-checkbox v-model="localForm.isScoreSubmitVisible  "><span
                            style=" font-weight: bolder;">对作者可见</span></el-checkbox>
                    <br>
                    <el-checkbox v-model="localForm.isScoreRequired  "><span
                            style=" font-weight: bolder;">评审者必须要完成</span></el-checkbox>
                    <br>
                    <p style="line-height:20px;">一个分数的<span>权重</span>定义了这个分数如何贡献于评论的总体分数。如果选中此框，权重将直接添加到评审的总分数中。复选框的权重通常为0
                    </p>
                    <el-form-item label="权重：">
                        <el-col :span="6">
                            <el-input v-model="localForm.scoreWeight " size="medium" auto-complete="off"
                                      style="margin-left: 18px;"/>
                        </el-col>
                    </el-form-item>
                </el-form-item>
            </template>
            <template><!--文本输入区域-->
                <div style="border:0.5px solid #CCC;margin: 30px auto;"></div><!--分割线--->
                <el-checkbox v-model="localForm.textAnnotation"><span style=" font-weight: bolder;">如果此评审项包含用于审阅人员的文本输入，请选中此框</span>
                </el-checkbox>
                <el-form-item label="文本输入设置：" v-if="localForm.textAnnotation">
                    <p>说明: 填写关于文本输入相关的信息。</p>
                    <div style="margin-left: 70px;">
                        <el-checkbox v-model="localForm.textSubmitVisible"><span
                                style=" font-weight: bolder;">对作者可见</span></el-checkbox>
                        <br>
                        <el-checkbox v-model="localForm.textDescription "><span
                                style=" font-weight: bolder;">评审者必须要完成</span></el-checkbox>
                    </div>
                </el-form-item>
            </template>
        </el-form>
        <div slot="footer" style="margin-right: 35%">
            <el-button @click="closeItemForm" style="margin-right: 10%">取消</el-button>
            <el-button type="primary" v-prevent-click @click="saveFormItem('reviewItemForm')">保存</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import {errTips} from "@/utils/tips.js";
    import deepCopyObject from "@/utils/deepCopyObject.js";
    import {httpPut} from "@/utils/http.js";
    import {successTips} from "../../../utils/tips";
    export default {
        name: "reviewItemTemplate",

        props: {
            form: Object,//编辑评审单项时，传进组件的内容
            itemIndex: {//编辑评审单项时，改评审单项在父组件评审表单中的位置
                type: Number,
                default: null,
            },
            reviewItemType: {//评审单项的类型有3种scoreOption(分数选项), scoreInput（分数输入）, yesOrNo（是或否）
                type: String,
                default: null,
            },
            formItemVisible: {
                type: Boolean,
                default: false,
            },
            updateToBackEnd:{//更新操作是否发送给后端
                type: Boolean,
                default: false,
            }
        },
        data(){
            return {
                localForm: {//存储为空的评审项的信息
                    type: null,//当前评审单项的类型
                    scoreTitle: "",
                    hint: "",
                    textAnnotation: null,//是否有文本输入
                    textSubmitVisible: null,//文本输入对作者是否可见
                    textDescription: null,//文本输入评审者是否必须要完成 1是0否

                    isScore: null,//是否有分值选项 1是0否
                    isScoreSubmitVisible: null,//对作者是否可见 1是0否
                    isScoreRequired: null,//分值选项专家必选 1是0否
                    scoreWeight: 1,//分值选项权重
                    scoreExplainList: [],//分值选项说明(文本分数选项域)
                    value: {
                        min: null,//评审选项的得分最小值
                        max: null,//评审选项的得分最大值
                    },
                    selectAnnotation: null,//选择框之后的文本说明(是或否选择域) ,
                },
                minScore: null,//评审选项的得分最小值
                maxScore: null,//评审选项的得分最大值
                formItemRules: {//评审单项里的表单规则
                    scoreTitle: [
                        {required: true, message: '请输入模板名称', trigger: 'blur'},
                    ]
                },

                tempScore: null,//暂存选项分数
                tempExplain: null,//暂存选项说明
                formLabelWidth: "100px",
            };
        },
        computed: {
            formItemTitle: function () {//评审项的对话框的标题
                if (this.reviewItemType === 'scoreOption') {
                    return "文本/分数选项域";
                } else if (this.reviewItemType === 'scoreInput') {
                    return "文本/分数输入域";
                } else {
                    return "是或否选择域";
                }
            },
        },
        watch: {
            formItemVisible: function () {
                if (this.formItemVisible === true) {
                    if (this.itemIndex == null) {//新增一个评审项
                        this.localForm = this.getNullLocalForm();
                    } else {
                        this.localForm = deepCopyObject(this.form);//编辑时，需要把要编辑的表单内容复制给localForm
                    }
                }
            },

        },
        methods: {
            getNullLocalForm() {
                return {//存储为空的评审项的信息
                    type: null,//当前评审单项的类型
                    scoreTitle: "",
                    hint: "",

                    isScore: null,//是否有分值选项 1是0否
                    isScoreRequired: null,//分值选项专家必选 1是0否
                    isScoreSubmitVisible: null,//对作者是否可见 1是0否
                    scoreWeight: 1,//分值选项权重
                    scoreExplainList: [],//分值选项说明(文本分数选项域)
                    value: {
                        min: null,//评审选项的得分最小值
                        max: null,//评审选项的得分最大值
                    },
                    selectAnnotation: null,//选择框之后的文本说明(是或否选择域) ,

                    textAnnotation: null,//是否有文本输入,1是0否 true/false
                    textSubmitVisible: null,//文本输入对作者是否可见
                    textDescription: null,//文本输入评审者是否必须要完成 1是0否
                    fieldOne: null,//标记参数1
                    fieldTwo: null,//标记参数2
                };
            },
            getType() {//生成数值的type类型
                if (this.reviewItemType === 'scoreOption') {
                    return 1;
                } else if (this.reviewItemType === 'scoreInput') {
                    return 3;
                } else {
                    return 2;
                }
            },
            addOption() {//添加用户指定位置的选项解释
                if (this.tempScore === null || this.tempExplain === null) {
                    errTips("选项和分值都不能为空");
                } else if (typeof (this.tempScore) != 'number') {
                    errTips("分值必须为数值");
                } else if (this.tempExplain.trim() === "") {
                    errTips("选项不能为空");
                } else {
                    this.localForm.scoreExplainList.push({'score': this.tempScore, 'explain': this.tempExplain});
                    this.tempScore = null;
                    this.tempExplain = null;
                }
            },
            deleteOption(index) {//删除用户指定位置的选项解释
                this.localForm.scoreExplainList.splice(index, 1);
            },
            setValueOfScoreOption() {//如果评审项存在分数的选择，返回得分的范围
                let minScore = Number.MAX_VALUE;//找出分数选项的最大值，最小值
                let maxScore = Number.MIN_VALUE;
                if (this.localForm.scoreExplainList.length > 0) {
                    for (let scoreExplain of this.localForm.scoreExplainList) {
                        if (minScore > scoreExplain.score) {
                            minScore = scoreExplain.score;
                        }
                        if (maxScore < scoreExplain.score) {
                            maxScore = scoreExplain.score;
                        }
                    }
                }
                if (minScore === Number.MAX_VALUE) {
                    this.localForm.value.min = null;
                } else {
                    this.localForm.value.min = minScore;
                }
                if (maxScore === Number.MIN_VALUE) {
                    this.localForm.value.max = null;
                } else {
                    this.localForm.value.max = maxScore;
                }
            },
            /**如果评审项存在分数的输入，返回输入的限制范围**/
            setValueOfScoreInput() {
                this.localForm.scoreWeight = 1;//分数输入的权重默认为1，且不可以修改
                let minScore = this.localForm.value.min;//用个简短的中间变量来代替一下
                let maxScore = this.localForm.value.max;
                if (minScore === null || maxScore == null) {
                    errTips("用户输入范围不能为空");
                    return false;
                } else if (typeof (minScore) !== 'number' || typeof (maxScore) !== 'number') {
                    errTips("用户输入范围只能是数字");
                    return false;
                } else if (maxScore < minScore) {
                    errTips("输入范围的最大值要大于等于最小值");
                    return false;
                } else {
                    return true;
                }
            },
            /**在是或否选择域，选择了是，权重多少分就加多少分到总分上，选择了否就加0分**/
            setValueOfScoreYesOrNo() {
                this.localForm.value.min = 0;
                this.localForm.value.max = 1;
            },
            /**保存当前的评审单项并关掉对话框**/
            saveFormItem(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.reviewItemType === 'scoreOption' && this.localForm.isScore === true) {//分数选项域，且包含数值分数以及选项
                            this.setValueOfScoreOption();
                        }
                        if (this.reviewItemType === 'scoreInput' && this.localForm.isScore === true) {//分数输入域，且包含数值输入
                            if (false === this.setValueOfScoreInput()) {
                                return false;
                            }
                        }
                        if (this.reviewItemType === 'yesOrNo') {
                            this.setValueOfScoreYesOrNo();
                            this.localForm.isScore = true;//yesOrNo选择域默认是含有数值域的
                        }
                        this.localForm.type = this.getType();
                        if (this.itemIndex === null) {//提交新的评审单项
                            this.$emit("getNewReviewItemForm", deepCopyObject(this.localForm));
                        } else {//更新已有的评审单项
                            if(this.updateToBackEnd==false){//不向后端发送更新
                                this.$emit("getUpdatedReviewItemForm", this.itemIndex, deepCopyObject(this.localForm));
                            }else{//向后端发送更新
                                httpPut('/v1/authorization/review/templateconfig/update',this.localForm).then(results => {
                                    const {httpCode, msg, data} = results.data;
                                    console.log("data", data);
                                    if (httpCode == 200) {
                                        successTips("更新成功！");
                                    }else if(httpCode !== 401) {
                                        errTips(msg);
                                    }
                                    this.configListLoading = false;
                                });
                            }

                        }
                        this.localForm = this.getNullLocalForm();
                        this.closeItemForm();//关闭评审单项对话框
                    } else {
                        errTips("数据不完整！");
                    }
                });
            },
            closeItemForm() {//调用父组件的方法关闭当前的评审单项对话框
                this.$emit('closeReviewItemForm');
            }
        },
    }
</script>

<style scoped>

</style>
