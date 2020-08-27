<!--评审模板详情-->
<template>
    <div>
        <div style="padding-left: 10px;margin-buttom:30px;">
            <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 130%;">
                <el-breadcrumb-item :to="{ path: '/editorIndex' }">评审管理员</el-breadcrumb-item>
                <el-breadcrumb-item :to="{path:'/editorManager'}">评审管理</el-breadcrumb-item>
                <el-breadcrumb-item>评审模板详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-row style="margin: 20px 0">
            <span>说明：已经被使用过的评审模板不支持任何的修改，只能查看，如果想要在现有的模板进行一些较大的更改，
                建议点击创建副本，可以在现有的基础上创建新的模板！</span>
        </el-row>
        <el-row style="margin: 20px auto;">
            <el-col :span="9">
                <span style="font-size: large;">评审模板名称:<span style="font-weight: bolder;">{{templateName}}</span></span>
                <span style="font-size: large; margin-left: 20px;"> 总分：{{totalScore}}分</span>
            </el-col>
            <template v-if="isEmploy===false">
               <el-col :span="3">
                   <span style="font-size: large;">新的评分项</span>
               </el-col>
                <el-col :span="5" style="margin-top:-10px;">
                    <el-select v-model="selectedType" placeholder="请选择单个评审项">
                        <el-option label="文本/分数选项域" value="scoreOption"></el-option>
                        <el-option label="文本/分数输入域" value="scoreInput"></el-option>
                        <el-option label="是或否选择域" value="yesOrNo"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="2" :offset="1" style="margin-top:-10px;">
                    <el-button type="primary" size="medium" @click="handleCreateNewReviewItem">添加</el-button>
                </el-col>
            </template>
            <el-col :span="3" style="margin-top:-10px;">
                <el-button  type="primary" size="medium" @click="createNewTemplateCopy">创建副本 </el-button>
            </el-col>
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
                    <el-button @click="handleReadItem(scope.$index)" type="text" size="medium" v-if="isEmploy===true||isEmploy==='true'"
                    ><i class="el-icon-search"></i>详情
                    </el-button>
                    <template v-if="isEmploy===false||isEmploy==='false'">
                        <el-button @click="handleEditItem(scope.$index)" type="text" size="medium"
                        ><i class="el-icon-search"></i>编辑
                        </el-button>
                        <el-button @click="handleDeleteFormItem(scope.row.id)" type="text" size="medium"
                        ><i class="el-icon-delete"></i>删除
                        </el-button>
                    </template>
                </template>
            </el-table-column>
        </el-table>
        <review-item-template
                :form="reviewItemForm" :itemIndex="itemIndex" :reviewItemType="selectedType" :updateToBackEnd="updateToBackEnd"
                :formItemVisible="formItemVisible" :readOnly="readOnly" :newTemplate="newTemplate"
                @closeReviewItemForm="closeReviewItemForm" @getReviewTemplateDetail="getReviewTemplateDetail">
        </review-item-template>
        <review-template :templateConfigList="templateConfigList" :totalScore="totalScore"></review-template><!--生成评审表单的组件-->
    </div>
</template>

<script>

    import {errTips, successTips} from "@/utils/tips.js";
    import {httpGet,httpDelete} from "@/utils/http.js";
    import deepCopyObject from "@/utils/deepCopyObject.js";//深拷贝对象
    import { MessageBox } from "element-ui";
    import reviewItemTemplate from '@/view/review/editor/reviewTemplate/reviewItemTemplate';
    import reviewTemplate from '@/view/review/components/reviewTemplate';


    //他们的位置就对应着type的数字表示（传递给后端的，前端为了更好的阅读体验使用的字符串表示）
    const reviewItemTypeStringToId =["","scoreOption","yesOrNo","scoreInput"];
    export default {
        name: "reviewTemplateDetail",
        props: {
            templateId: {//评审模板的id
                type:[Number,String],//解决用户浏览器刷新时，传递的参数变成String类型时，浏览器报错
                default:null,
            },
            isEmploy:{//模板是否被使用
                type:[Boolean,String],//解决用户浏览器刷新时，传递的参数变成String类型时，浏览器报错
                default:false,
            }
        },
        components: {
            reviewItemTemplate:reviewItemTemplate,
            reviewTemplate:reviewTemplate,
        },
        data() {
            return {
                /*增加、编辑、更新表单项**/
                itemIndex: null, //编辑评审单项的时候，传递单项在表单中的位置
                reviewItemForm: null, //存储单个评审项的信息
                formItemVisible: false, //用于控制添加评审项的对话框显示
                selectedType: null, //用户已选中的评审项类型
                updateToBackEnd:false, //用于编辑评审单项是否向后端发送请求
                readOnly:false, //评审表单详情里的表单项的详情，只读无法提交修改
                newTemplate:{  //添加一个新的评审单项需要的数据
                    isCreateNewTemplate:false,
                    newIndex :null,
                    templateId:null,
                },
                configListLoading: false,
                templateConfigList: [],//存储评审项的列表
                templateName: '',//当前评审模板的名称
                totalScore: 0,//评审模板的总分

            };
        },
        created: function (){
            this.getReviewTemplateDetail();
        },

        beforeRouteEnter (to, from, next) {
            /*设置模板的信息，包括模板模板id，模板是否被使用过isEmploy(true or false),其中isEmploy的取值比较敏感，影响了页面的显示，不能被用户修改*/
            // 在渲染该组件的对应路由被 confirm 前调用 不！能！获取组件实例 `this`因为当守卫执行前，组件实例还没被创建
            //to表示当前的路由，from表示上一个路由
            console.log("to:",to);
            console.log("from",from);
            if(from.path==='/editorReviewTemplates'){       //从已有评审模板页面进入的当前页面
                sessionStorage.setItem("reviewTemplateId",to.params.templateId);
                sessionStorage.setItem("reviewTemplateIsEmploy",to.params.isEmploy);
            }else{                   //刷新浏览器或者是从其他页面进入的当前页面
                to.params.templateId = sessionStorage.getItem("reviewTemplateId");
                to.params.isEmploy = sessionStorage.getItem("reviewTemplateIsEmploy");
            }
            next();
        },
        methods: {

            /**获取评审模板的单项配置列表*/
            getReviewTemplateDetail(){
                this.configListLoading = true;
                // console.log("this.id",this.id);
                httpGet("/v1/authorization/review/templateconfig/list", {id: this.templateId}).then(results => {
                    const {httpCode, msg, data} = results.data;
                    console.log("data", data);
                    if (httpCode === 200){
                        this.templateConfigList = data.templateConfigList;
                        this.totalScore = data.totalScore;
                        this.templateName = data.templateName;
                    }else if(httpCode !== 401){
                        errTips(msg);
                    }
                    this.configListLoading = false;
                });
            },
            /**创建一个新的评审单项**/
            handleCreateNewReviewItem(){
                if(this.selectedType===null){
                    errTips("请选择评审单项类型！");
                    return ;
                }
                this.formItemVisible = true;
                this.itemIndex = null; //新增评审单项，itemIndex要置为null
                this.reviewItemForm = null;
                this.readOnly = false;
                this.newTemplate.isCreateNewTemplate = true;//作为创建一个新的评审单项的标志
                this.newTemplate.newIndex = this.templateConfigList.length;//新评审单项的下标，设置fieldOne和fieldTwo需要用到
                this.newTemplate.templateId = this.templateId;//当前评审模板的id
            },
            /**创建当前评审模板的一个副本**/
            createNewTemplateCopy(){
                this.$router.push({name:'editorReviewTemplateConfig',query:{templateId:this.templateId}});
            },
            /**查看评审单项**/
            handleReadItem(index){
                // console.log("index",index);
                // console.log("当前表单：",this.templateConfigList[index]);
                this.selectedType = reviewItemTypeStringToId[this.templateConfigList[index].type];
                this.reviewItemForm = deepCopyObject(this.templateConfigList[index]);
                this.itemIndex = index;
                this.formItemVisible = true;
                this.updateToBackEnd = false;
                this.readOnly = true;
            },
            /**编辑评审单项**/
            handleEditItem(index) {
                this.handleReadItem(index);
                this.updateToBackEnd = true;
                this.readOnly = false;
            },
            /**关闭评审单项对话框**/
            closeReviewItemForm() {
                this.formItemVisible = false;
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
                        } else {
                            errTips(msg);
                        }
                    });
                })
            },
        }
    }
</script>

