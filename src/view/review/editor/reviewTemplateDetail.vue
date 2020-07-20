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
            <!--            <el-table-column property="textAnnotation" label="是否有文本说明" align="center"></el-table-column>-->
            <!--            <el-table-column property="textDescription" label="文本说明是否必需完成" align="center"></el-table-column>-->
            <!--            <el-table-column property="textSubmitVisible" label="文本说明提交人是否可见" align="center"></el-table-column>-->
            <!--            <el-table-column property="isScore" label="是否有分数选项/输入" align="center"></el-table-column>-->
            <el-table-column property="scoreWeight" label="分数选项权重" align="center"></el-table-column>
            <!--            <el-table-column property="isScoreRequired" label="分数选项必选/分数必填" align="center"></el-table-column>-->
            <!--            <el-table-column property="isScoreSubmitVisible" label="分数选项提交人是否可见" align="center"></el-table-column>-->
            <!--            <el-table-column property="scoreExplainList" label="分数选项说明" align="center"></el-table-column>-->
            <el-table-column label="得分范围" align="center">
                <template slot-scope="scope">
                            <span v-if="scope.row.min!==null&&scope.row.max!==null">
                                [{{scope.row.min*scope.row.scoreWeight}},{{scope.row.max*scope.row.scoreWeight}}]</span>
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
        <el-row style="margin: 20px auto;">
            <span style="font-size: large;font-weight: bolder;">评审表单</span>
        </el-row>
        <form-create :rule="rules" :option="option"/>
    </div>

</template>

<script>
    import {errTips, successTips} from "@/utils/tips.js";
    import {httpGet} from "@/utils/http.js";
    import formCreate, {maker} from "@form-create/element-ui";//用于动态生成表单

    function mock() {
        return [maker.create('span').domProps({innerHTML: '<p style="color:red;">当鼠标经过这段文字时，会显示一个气泡框<p>'}),
            {
                type: "input",
                title: "商品名称",
                //label名称
                field: "goods_name",
                //字段名称
                value: "",
                //input值,
                props: {
                    "type": "text",
                    //输入框类型，可选值为 text、password、textarea、url、email、date
                    "clearable": false,
                    //是否显示清空按钮
                    "disabled": false,
                    //设置输入框为禁用状态
                    "readonly": false,
                    //设置输入框为只读
                    "rows": 4,
                    //文本域默认行数，仅在 textarea 类型下有效
                    "autosize": false,
                    //自适应内容高度，仅在 textarea 类型下有效，可传入对象，如 { minRows: 2, maxRows: 6 }
                    "number": false,
                    //将用户的输入转换为 Number 类型
                    "autofocus": false,
                    //自动获取焦点
                    "autocomplete": "off",
                    //原生的自动完成功能，可选值为 off 和 on
                    "placeholder": "请输入商品名称",
                    //占位文本
                    "size": "default",
                    //输入框尺寸，可选值为large、small、default或者不设置,
                    "spellcheck": false,
                    //原生的 spellcheck 属性
                    "required": false,
                },
                validate: [{
                    required: true,
                    message: '请输入商品名称',
                    trigger: 'blur'
                },
                ],
            },
            {
                type: 'h2',
                domProps: {
                    innerHTML: '<div style="color:red;margin:0 0 -10px 20px;"><span >当鼠标经过这段文字时，会显示一个气泡框</span></div>'
                },
                col:{
                    span:20
                }
            },
            {
                type:'input',
                title:'col12',
                field:'is_pos',
                col:{
                    span:4
                },

            },
            {
                type: "radio",
                title: "",
                //label名称
                field: "is_postage",
                //字段名称
                value: null,
                //input值,
                options: [{
                    value: 0,
                    label: "不包邮不包邮不包邮不包邮不包邮不包邮",
                    disabled: false
                },
                    {
                        value: 1,
                        label: "包邮不包邮不包邮不包邮不包邮不包邮",
                        disabled: false
                    },
                    {
                        value: 2,
                        label: "未知不包邮不包邮不包邮不包邮不包邮不包邮",
                        disabled: false
                    },
                ],
                props: {
                    "type": undefined,
                    //可选值为 button 或不填，为 button 时使用按钮样式
                    "size": "default",
                    //单选框的尺寸，可选值为 large、small、default 或者不设置
                    "vertical": true,
                    //是否垂直排列，按钮样式下无效
                },
                col: {
                    span: 6,
                    offset: 1
                },
                validate: [{
                    required: true,
                    message: '请选择是否包邮',
                    trigger: 'blur'
                },
                ],
            },

            {
                type: "checkbox",
                title: "标签",
                //label名称
                field: "label",
                //字段名称
                value: ["1", "2", "3"],
                //input值,
                options: [{
                    value: "1",
                    label: "好用",
                    disabled: true
                },
                    {
                        value: "2",
                        label: "方便",
                        disabled: false
                    },
                    {
                        value: "3",
                        label: "实用",
                        disabled: false
                    },
                    {
                        value: "4",
                        label: "有效",
                        disabled: false
                    },
                ],
                props: {
                    "size": "default",
                    "vertical": true
                    //多选框组的尺寸，可选值为 large、small、default 或者不设置
                },
            },
            {
                type: "switch",
                title: "是否上架",
                //label名称
                field: "is_show",
                //字段名称
                value: "1",
                //input值,
                props: {
                    "size": "default",
                    //开关的尺寸，可选值为large、small、default或者不写。建议开关如果使用了2个汉字的文字，使用 large。
                    "disabled": false,
                    //禁用开关
                    "trueValue": "1",
                    //选中时的值，当使用类似 1 和 0 来判断是否选中时会很有用
                    "falseValue": "0",
                    //没有选中时的值，当使用类似 1 和 0 来判断是否选中时会很有用
                },
                slot: {
                    open: "上架",
                    //自定义显示打开时的内容
                    close: "下架",
                    //自定义显示关闭时的内容
                },
                //slot可以不用配置
            },
            {
                type: "select",
                field: "cate_id",
                title: "产品分类",
                value: ["104", "105"],
                props: {
                    "multiple": true,
                    //是否支持多选
                    "clearable": false,
                    //是否可以清空选项，只在单选时有效
                    "filterable": true,
                    //	是否支持搜索
                    "size": "default",
                    //选择框大小，可选值为large、small、default或者不填
                    "placeholder": "请选择",
                    //选择框默认文字
                    "not-found-text": "无匹配数据",
                    //当下拉列表为空时显示的内容
                    "placement": "bottom",
                    //弹窗的展开方向，可选值为 bottom 和 top
                    "disabled": false,
                    //是否禁用
                },
                options: [{
                    "value": "104",
                    "label": "生态蔬菜",
                    "disabled": false
                },
                    {
                        "value": "105",
                        "label": "新鲜水果",
                        "disabled": false
                    },
                ],
            },

        ]

    };
    export default {
        name: "reviewTemplateDetail",
        props: {
            id: String,//评审模板的id
        },
        components: {
            formCreate: formCreate.$form()
        },
        data() {
            return {
                configListLoading: false,
                templateConfigList: [],//存储评审项的列表
                templateName: '',//当前评审模板的名称
                totalScore: 0,//评审模板的总分

                rules: [],
                fApi: {},
                option: {
                    // //显示表单重置按钮
                    // resetBtn: true,
                    // //表单提交事件
                    // onSubmit: function (formData) {
                    //     console.log(formData);
                    //     alert(JSON.stringify(formData));
                    //     //按钮进入提交状态
                    //     // this.fApi.btn.loading();
                    //     //重置按钮禁用
                    //     // this.fApi.resetBtn.disabled();
                    //     //按钮进入可点击状态
                    //     //创建第二个表单
                    // },
                }
            };
        },
        created: function () {
            this.getReviewTemplateDetail();
        },
        methods: {
            getReviewTemplateDetail() {
                this.configListLoading = true;
                httpGet("/v1/authorization/review/templateconfig/list", {id: this.id}).then(results => {
                    const {httpCode, msg, data} = results.data;
                    console.log("data", data);
                    if (httpCode == 200) {
                        this.templateConfigList = data.templateConfigList;
                        this.setCreateRule();
                        this.totalScore = data.totalScore;
                        this.templateName = data.templateName;
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                    this.configListLoading = false;
                });
            },
            setCreateRule() {
                let rules = [];
                let rule = {};
                rule.type = null;
                rule.title = null;
                rule.value = null;
                rule.field = null;
                rule.props = {};
                rule.options = [];
                rule.validate = [];
                let nullRule = {...rule};//备份一个空的rule
                for (let i = 0; i < this.templateConfigList.length; i++) {
                    /**生成标题开始**/
                    let item = this.templateConfigList[i];
                    let title = (i+1) + '.' + item.scoreTitle;//生成评审项的题号和标题
                    console.log("item.hint",typeof(item.hint));
                    if (item.hint.trim() !== "" && item.hint !== null) {
                        title += "(" + item.hint + ")";
                    }
                    rules.push({
                        type:"h2",
                        domProps: {
                            innerHTML: '<div style="margin-bottom:-30px;"><span >'+title+'</span></div>'
                        }
                    });
                    /**生成标题结束**/
                    if (item.type === 1) {//评审项的类型：1.文本/分数选项域 3.文本/分数输入域
                        rule.title = "选项：";
                        if (item.isScore === true) {
                            rule.field = item.fieldOne;
                            if (item.scoreExplainList !== null && item.scoreExplainList.length > 0) {//存在评审选项
                                rule.type = "radio";
                                for (let scoreExplain of item.scoreExplainList) {
                                    rule.options.push({
                                        'value': parseInt(scoreExplain.score),
                                        'label': scoreExplain.explain,
                                        'disabled':false,
                                    });
                                }
                                rules.push({
                                    type:"h3",
                                    domProps: {
                                        innerHTML: '<div style="margin-bottom:-30px;"><span >得分范围:'+item.min*item.scoreWeight+'到'+item.max*item.scoreWeight+'分</span></div>'
                                    }
                                });
                            }

                            if (item.isScoreRequired === true) {//改选项评审者必选
                                rule.validate.push({
                                    required: true,
                                    message: '请进行选择！',
                                    trigger: 'blur',
                                })
                            }
                        }
                        rule.props.vertical = true;//评审选项是否按照垂直排列。
                    } else if (item.type === 2) {//2.是或否选择域
                        rule.field = item.fieldOne;
                        if (item.isScore === true) {
                            rule.type = "switch";
                            rule.title = item.selectAnnotation;
                            rule.props.max = item.max;
                            rule.props.min = item.min;
                            rules.push({
                                type:"h3",
                                domProps: {
                                    innerHTML: '<div style="margin-bottom:-30px;"><span >得分范围:'+item.min*item.scoreWeight +'到'+item.max*item.scoreWeight+'分</span></div>'
                                }
                            });

                            rule.col = {
                                span:6
                            };
                            rule.props.slot = {
                                open: "是是是",
                                //自定义显示打开时的内容
                                close: "否否否",
                                //自定义显示关闭时的内容
                            }
                            if (item.isScoreRequired === true) {//改选项评审者必选
                                rule.validate.push({
                                    required: true,
                                    message: '请进行选择！',
                                    trigger: 'blur',
                                })
                            }
                        }
                    } else if (item.type === 3) {//3.文本/分数输入域
                        rule.field = item.fieldOne;
                        rule.title = "请输入分数"
                        if (item.isScore === true) {
                            rule.type = "input";
                            rule.props.max = item.max;
                            rule.props.min = item.min;
                            rules.push({
                                type:"h3",
                                domProps: {
                                    innerHTML: '<div style="margin-bottom:-30px;"><span >得分范围:'+item.min+'到'+item.max+'分</span></div>'
                                }
                            });
                            // rule.props.placeholder = "请输入分数";
                            rule.col = {
                                span:6
                            }
                            if (item.isScoreRequired === true) {//改选项评审者必选
                                rule.validate.push({
                                    required: true,
                                    message: '请输入分数！',
                                    trigger: 'blur',
                                })
                            }
                        }
                    }
                    rules.push(rule);
                    /**将rule置空**/
                    rule = {...nullRule};
                    rule.props = {};
                    rule.options = [];
                    rule.validate = [];
                }
                this.rules = [...rules];
                console.log("rules:",this.rules);
            },
        }
    }
</script>

<style scoped>

</style>
