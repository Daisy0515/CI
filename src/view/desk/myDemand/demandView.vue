<template>
    <div class="applicationView">
        <div class="Crumbs">
            <div class="container deskHeader">
                <h4>
                    您的位置：
                    <router-link to="myDemand">我的需求</router-link>
                    >
                    <span class="active">查看</span>
                </h4>
            </div>
        </div>
        <div class="container deskHeader">
            <el-card class="box-card0">
                <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm">
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="项目名称：">
                                <span>{{ruleForm.name}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="项目类型:">
                                <span>{{parentValue}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="项目子类型:">
                                <span>{{typeValue}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-button type="primary" v-if="!beModified" @click="modifyDemand">修改</el-button>
                        </el-col>
                    </el-row>
                    <template v-if="!beModified"> <!--被修改时-->
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="竞标方查看联系方式：">
                                    <span v-if="ruleForm.isSelect===1">是</span><!--后端接口处的类型说明为string，实际返回值为数字-->
                                    <span v-if="ruleForm.isSelect===0">否</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="附件：">
                                    <a :href="ruleForm.accessory" target="_Blank" v-if="ruleForm.accessory">下载附件</a>
                                    <a target="_Blank" v-if="!ruleForm.accessory">暂无附件</a>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="发布时间：">
                                    <span>{{ruleForm.gmtCreate}}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-form-item label="一句话描述需求：">
                            <span>{{ruleForm.requirement}}</span>
                        </el-form-item>
                        <el-form-item label="详细描述：">
                            <p class="detail">{{ruleForm.detail}}</p>
                        </el-form-item>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="是否是比赛：">
                                    <span v-if="ruleForm.isCompetition">是</span>
                                    <span v-if="!ruleForm.isCompetition">否</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="包含评审流程：">
                                    <span v-if="ruleForm.isReview">是</span>
                                    <span v-if="!ruleForm.isReview">否</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <template v-if="ruleForm.isReview">
                            <p>评审流程：</p>
                            <el-table :data="processList" style="width: 100%" >
                                <el-table-column prop="id" label="评审流程编号" width="180"> </el-table-column>
                                <el-table-column prop="processName" label="评审流程" width="180"> </el-table-column>
                                <el-table-column prop="demand" label="评审要求"> </el-table-column>
                            </el-table>
                        </template>
                        <p style="margin: 16px auto;">交付资源列表：</p>
                        <el-table :data="resourceList" style="width: 100%">
                            <el-table-column prop="id" label="编号" width="180"> </el-table-column>
                            <el-table-column prop="resourceName" label="交付资源名称" width="180"> </el-table-column>
                            <el-table-column prop="isUpload" label="备注">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.isUpload">必须上传</span>
                                    <span v-if="!scope.row.isUpload">可选上传</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="content" label="内容描述"> </el-table-column>
                        </el-table>
                    </template>
                </el-form>
                <modify-demand :ruleForm="ruleForm" :beModified="beModified" :processList="processList" :resourceList="resourceList" :id="parseInt(id)"
                                @undoModify="undoModify">
                </modify-demand>
            </el-card>
        </div>
    </div>
</template>
<script>
    import {httpGet} from "@/utils/http.js";
    import {specificDate} from "@/utils/getDate.js";
    import {errTips} from "@/utils/tips.js";
    import {mapMutations, mapActions, mapGetters} from "vuex";
    import modifyDemand from "@/view/desk/myDemand/modifyDemand";
    export default {
        name:"demandView",
        components:{
            modifyDemand,
        },
        data() {
            return {
                projectId: null, //项目编号 eg:20201122214304833519
                id:null,         //项目id   eg:685
                list: [{value: "是"}, {value: "否"}],
                parentValue: "",
                typeValue: "",
                ruleForm: {},
                processList:[],
                resourceList:[],//交付资源列表
                beModified:false,//被修改
            };
        },
        created: function () {
            if (!this.$route.query.projectId) {
                this.$router.push({path: "myDemand"});
                return false;
            }
            this.projectId = this.$route.query.projectId;
            this.id = this.$route.query.id;
            this.GETALLTYPE(); //获取项目类型
            this.getReviewProcess();//获取评审流程列表
            this.getResourceList();//获取交付资源列表
        },
        watch: {
            //监听获取项目类型完成后渲染数据
            getAllType() {
                httpGet(`/v1/authorization/bid/single/get?projectId=${this.projectId}`).then(
                    results => {
                        const {httpCode} = results.data;
                        if (httpCode === 200) {
                            let newData = results.data.data;
                            for (let ele of this.getAllType) {
                                if (ele.id == newData.parentId) {
                                    this.$set(this, "parentValue", ele.type);
                                } else if (ele.id == newData.typeId) {
                                    this.$set(this, "typeValue", ele.type);
                                }
                            }
                            newData.gmtCreate = specificDate(newData.gmtCreate);
                            this.ruleForm = newData;
                        } else if (httpCode === 400) {
                            errTips("页面丟失");
                            this.setCache("myDemand");
                        }
                    }
                );
            }
        },
        computed: {
            ...mapGetters(["getAllType"])
        },
        methods: {
            ...mapMutations(["setCache"]),
            ...mapActions(["GETALLTYPE"]),

            /**获取评审流程需要在getAllType调用之后调用*/
            getReviewProcess(){
                httpGet("/v1/authorization/review/process/list",{id:this.id}).then( results => {
                    const {httpCode,data, msg} = results.data;
                    if (httpCode === 200){
                        for(let item of data.processList){
                            item.isOrigin = true;       //在modifyDemand.vue中用来区分是否是新增的
                        }
                        this.processList = data.processList;
                    }else if (msg === "该条件暂无数据") {
                        this.processList = [];
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                });
            },
            /**获取交付资源需要在getAllType调用之后调用*/
            getResourceList(){
                httpGet("/v1/authorization/review/resource/list",{id:this.id}).then( results => {
                    const {httpCode,data, msg} = results.data;
                    if (httpCode === 200){
                        for(let item of data.resourceList){
                            item.isOrigin = true;       //在modifyDemand.vue中用来区分是否是新增的
                        }
                        this.resourceList = data.resourceList;
                    }else if (msg === "该条件暂无数据") {
                        this.resourceList = [];
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                });
            },
            modifyDemand(){
                this.beModified = true;
            },
            undoModify(){
                this.beModified = false;
            },
       }
    };
</script>
<style lang='scss'>
    @import "@/assets/scss/applicationView.scss";
</style>
