<template>
        <el-form :model="ruleFormLocal" :rules="rules" ref="ruleForm" class="demo-ruleForm" v-if="beModified">
            <el-form-item label="一句话描述需求" prop="requirement">
                <el-input v-model="ruleFormLocal.requirement"></el-input>
            </el-form-item>
            <el-form-item label="详细描述" prop="detail">
                <el-input type="textarea" v-model="ruleFormLocal.detail" :rows="10"></el-input>
            </el-form-item>
            <el-form-item label="是否开放为竞赛">
                <el-radio disabled v-model="ruleFormLocal.isCompetition" :label="true">是</el-radio>
                <el-radio disabled v-model="ruleFormLocal.isCompetition" :label="false">否</el-radio>
            </el-form-item>
            <el-form-item label="竞标方查看联系方式">
                <el-radio  v-model="ruleFormLocal.isSelect" :label="1">是</el-radio>
                <el-radio  v-model="ruleFormLocal.isSelect" :label="0">否</el-radio>
            </el-form-item>
            <el-form-item>
                <sourceUpload :uploadIndex="uploadIndex" v-on:setIdCard="setIdCard($event)"/>
            </el-form-item>
            <el-form-item label="项目交付资源">
                <el-button type="primary" size="small" @click="resourceListVisible = true">添加交付资源</el-button>
                <el-dialog title="添加" width="40%" :visible.sync="resourceListVisible">
                    <div>
                        <el-input placeholder="请输入名称" v-model="resourceName">
                            <template slot="prepend">名称：</template>
                        </el-input>
                    </div>
                    <div style="margin-top: 15px;">
                        <el-input placeholder="请输入描述" v-model="resourceContent">
                            <template slot="prepend">描述：</template>
                        </el-input>
                    </div>
                    <div style="margin-top: 15px;">
                        <span>必须上传：</span>
                        <el-radio  v-model="isResourceOptional" :label="true">是</el-radio>
                        <el-radio  v-model="isResourceOptional" :label="false">否</el-radio>
                    </div>
                    <el-button type="primary" @click="addResourceItem" size="small"
                               style="float: right;margin-top: 15px;"> 添加
                    </el-button>
                    <el-table :data="deliverData">
                        <el-table-column property="resourceName" label="资源名称" width="100"align="center"></el-table-column>
                        <el-table-column property="content" label="资源描述" align="center"></el-table-column>
                        <el-table-column property="isUpload" label="备注" align="center">
                            <template slot-scope="scope">
                                <span v-if="scope.row.isUpload">必须上传</span>
                                <span v-if="!scope.row.isUpload">可选上传</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="80" align="center">
                            <template slot-scope="scope" >
                                <span @click="deleteResourceItem(scope.row.resourceName)"  v-if="!scope.row.isOrigin">
                                    <i class="el-icon-delete"></i>
                                </span>
                                <span v-else>原有配置</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-dialog>
            </el-form-item>
            <el-form-item label="评审需求">
                <el-radio  v-model="ruleFormLocal.isReview" :label="true">是</el-radio>
                <el-radio  disabled v-model="ruleFormLocal.isReview" :label="false">否</el-radio>
            </el-form-item>
            <div v-show="ruleFormLocal.isReview">
                <el-form-item label="评审流程">
                    <el-button type="primary" size="small" @click="processListVisible = true">评审配置</el-button>
                    <el-dialog title="评审流程" width="40%" :visible.sync="processListVisible">
                        <div>
                            <el-input placeholder="请输入内容" v-model="reviewProcessName">
                                <template slot="prepend">评审名称：</template>
                            </el-input>
                        </div>
                        <div style="margin-top: 15px;">
                            <el-input placeholder="请输入内容" v-model="reviewProcessRequire">
                                <template slot="prepend">评审要求：</template>
                            </el-input>
                        </div>
                        <el-button type="primary" @click="addProcessItem" size="small"
                                   style="float: right;margin-top: 15px;"> 添加
                        </el-button>

                        <el-table :data="reviewData">
                            <el-table-column property="processName" label="评审流程" width="100" align="center"></el-table-column>
                            <el-table-column property="demand" label="评审要求" align="center"></el-table-column>
                            <el-table-column label="操作" width="80" align="center">
                                <template slot-scope="scope">
                                    <span @click="deleteProcessItem(scope.row.processName)" v-if="!scope.row.isOrigin">
                                        <i class="el-icon-delete"></i>
                                    </span>
                                    <span v-else>原有配置</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-dialog>
                </el-form-item>
            </div>
            <el-form-item class="publish">
                <el-button  @click="undoModify('ruleForm')" size="medium">取消</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')" size="medium">提交修改</el-button>
            </el-form-item>
        </el-form>
</template>
<script>
    import {httpGet, httpPost, httpPut} from '@/utils/http.js';
    import {errTips} from '@/utils/tips.js';
    import sourceUpload from '@/common/upload/resourceUpload';
    import {mapMutations, mapActions, mapGetters} from 'vuex';
    import regular from '@/mixins/regular/publish.js';
    import {successTips} from "../../../utils/tips";

    export default {
        name:"modifyDemand",
        components: {
            sourceUpload
        },
        props:{
            beModified:{//是否处于修改状态
                type:Boolean,
                default:true,
            },
            ruleForm:{//已有的项目需求信息
                type:Object,
                default:()=>{},
            },
            resourceList:{//已有的交付资源列表
                type:Array,
                default:()=>[],
            },
            processList:{//已有的评审流程列表
                type:Array,
                default:()=>[],
            },
            id:{//项目的id，不是编号
                type:Number,
                default:null,
            }

        },
        mixins: [regular],
        data() {
            return {
                reg:null,
                regDescription:null,
                uploadIndex: false,
                ruleFormLocal:this.ruleForm,  //保存ruleForm的副本

                resourceName: '',              //添加交付资源时，交付资源名称
                resourceContent: '',           //添加交付资源时，交付资源内容
                isResourceOptional: true,         //添加交付资源时，该资源是用户必须上传还是可选上传，true必需, false 可选
                deliverData: this.resourceList, //存储已有的交付资源列表
                newDeliverData:[],              //新增加的交付资源列表
                resourceListVisible: false,     //交付列表的显示

                reviewProcessName:null,         //评审流程名称
                reviewProcessRequire:null,      //评审流程要求
                reviewData: this.processList,   //保存原有的评审流程副本
                newReviewData:[],               //新增加的评审流程列表
                processListVisible: false,

                rules:{
                    requirement:[
                        {required:true, message: '请输入描述', trigger: 'blur'}
                    ],
                    detail:[
                        {required:true, message: '请输入详细描述', trigger: 'blur'}
                    ],
                },
                ruleForm1: {
                    id: null,
                    isReview: '',
                    reviewProcessList: [],
                    reviewResourceList: [],

                }
            };
        },
        watch:{
            ruleForm(newVal){
                this.ruleFormLocal = newVal;
            },
            resourceList(newVal){
                this.deliverData = newVal;
            },
            processList(newVal){
                this.reviewData = newVal;
            }
        },
        methods: {
            ...mapMutations(['setCache']),
            /**新增交付任务*/
            addResourceItem() {
                if(this.resourceName===null||this.resourceName.trim()===""){
                    errTips('交付资源名称不能为空');
                    return;
                }
                let len = this.deliverData.length;
                let index = -1;
                for (let i = 0; i < len; i++) {
                    if (this.resourceName === this.deliverData[i].resourceName) {
                        index = i;
                        break;
                    }
                }
                if (index > -1) {
                    errTips('资源名称已存在');
                    return;
                } else {
                    let item = {projectId: this.id, resourceName: this.resourceName, content: this.resourceContent, isUpload: this.isResourceOptional, reg:this.reg, regDescription:this.regDescription};
                    this.deliverData.push(item);
                    this.newDeliverData.push(item);
                }
                this.resourceName = "";
                this.resourceContent = "";
                this.isResourceOptional = true;
            },
            /**删除交付任务列表中新添加的任务*/
            deleteResourceItem(itemName) {
                let len = this.deliverData.length;
                let index = -1;
                for (let i = 0; i < len; i++) {
                    if (itemName === this.deliverData[i].resourceName) {
                        index = i;
                        break;
                    }
                }
                if (index > -1) {
                    this.deliverData.splice(index, 1);
                    let originDeliverLen = this.deliverData.length - this.newDeliverData.length;
                    this.newDeliverData.splice(index-originDeliverLen,1);
                }
            },
            /**新增评审流程*/
            addProcessItem() {
                if(this.reviewProcessName===null||this.reviewProcessName.trim()===""){
                    errTips('评审流程名称不能为空');
                    return;
                }
                let len = this.reviewData.length;
                let index = -1;
                for (let i = 0; i < len; i++) {
                    if (this.reviewProcessName === this.reviewData[i].processName) {
                        index = i;
                        break;
                    }
                }
                if (index > -1) {
                    errTips('评审流程已存在');
                    return;
                } else {
                    let item = {projectId: this.id, processName: this.reviewProcessName, demand: this.reviewProcessRequire, };
                    this.reviewData.push(item);
                    this.newReviewData.push(item);
                }

                this.reviewProcessName = "";
                this.reviewProcessRequire = "";
            },
            /**删除评审流程列表中新增的流程*/
            deleteProcessItem(itemName) {
                let len = this.reviewData.length;
                let index = -1;
                for (let i = 0; i < len; i++) {
                    if (itemName === this.reviewData[i].processName) {
                        index = i;
                        break;
                    }
                }
                if (index > -1){
                    this.reviewData.splice(index, 1);
                    let originReviewLen = this.reviewData.length - this.newReviewData.length;
                    this.newReviewData.splice(index - originReviewLen, 1);
                }
            },
            uploadFile() {
                this.uploadIndex = !this.uploadIndex;
            },
            /**添加新的交付资源*/
            insertResourceFile(){
                if(this.newDeliverData.length > 0) {
                    console.log(293, this.newDeliverData);
                    httpPost("/v1/authorization/review/resource/insert", {resourceList: this.newDeliverData}).then(results => {
                        const {msg, httpCode} = results.data;
                        if (httpCode !== 200) {
                            errTips("添加新的交付资源失败:" + msg);
                        }
                    })
                }
            },
            /**添加新的评审流程*/
            insertReviewProcess(){
                if(this.newReviewData.length > 0){
                    httpPost("/v1/authorization/review/process/insert",{processList:this.newReviewData}).then(results=>{
                        const {msg, httpCode} = results.data;
                        if(httpCode!==200){
                            errTips("添加新的评审流程失败:"+msg);
                        }
                    })
                }
            },
            /**修改需求的信息*/
            updateRequire(){
                httpPut("/v1/authorization/bid/requirementv/update",this.ruleFormLocal).then(results=>{
                    const {msg, httpCode} = results.data;
                    if(httpCode!==200){
                        errTips("修改需求信息失败:"+msg);
                    }else{
                        successTips("需求修改成功！"); // updateRequire()方法是最后调用的，调用成功了就表明需求修改成功了！
                        this.$router.go(0);
                    }
                })
            },

            setIdCard(data) {
                if(data!==null&&data!==undefined&&data.trim()!==""){
                    this.ruleFormLocal.accessory = data;
                }
                this.insertReviewProcess();
                this.insertResourceFile();
                this.updateRequire();     // updateRequire()方法是最后调用的，调用成功了就表明需求修改成功了！
            },

            submitForm(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.ruleFormLocal.accessory ? this.setIdCard() : this.uploadFile();
                    } else {
                        return false;
                    }
                });
            },
            undoModify(){       //退出修改界面
                this.$emit("undoModify");
            }
        }
    };
</script>
<style lang="scss">
    @import '@/assets/scss/publishtask.scss';
</style>
