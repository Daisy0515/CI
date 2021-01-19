<template>
    <div class="bidView">
        <div class="Crumbs">
            <div class="container deskHeader">
                <h4>
                    您的位置：
                    <router-link to="myBid">我的投标</router-link>
                    >
                    <span class="active">查看</span>
                </h4>
            </div>
        </div>
        <div class="container deskHeader">
            <el-card class="box-card0" v-if="ruleForm.company">
                <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm">
                    <el-form-item label="项目名称：">
                        <span>{{ruleForm.requirementv.name}}</span>
                    </el-form-item>
                    <el-form-item label="项目类型:">
                        <span>{{parentValue}}</span>
                    </el-form-item>
                    <el-form-item label="项目子类型:">
                        <span>{{typeValue}}</span>
                    </el-form-item>
                    <el-form-item label="一句话描述需求：">
                        <span>{{ruleForm.requirementv.requirement}}</span>
                    </el-form-item>
                    <el-form-item label="详细描述：">
                        <p class="detail">{{ruleForm.requirementv.detail}}</p>
                    </el-form-item>
                    <el-form-item label="附件：">
                        <a
                                :href="ruleForm.requirementv.accessory"
                                target="_Blank"
                                v-if="ruleForm.requirementv.accessory"
                        >下载附件</a>
                        <a href="javascript:void(0)" v-if="!ruleForm.requirementv.accessory">暂无附件</a>
                    </el-form-item>
                    <el-form-item label="发布时间：">
                        <span>{{ruleForm.requirementv.gmtCreate}}</span>
                    </el-form-item>
                    <el-form-item label="个人信息：">
                        <el-card class="parentCard">
                            <img
                                    class="userImg"
                                    :src="ruleForm.company.headurl?ruleForm.company.headurl:getnoImg"
                            />
                            <p>
                                <label>公司名：</label>
                                {{ruleForm.company.companyName?ruleForm.company.companyName:'暂无数据'}}
                            </p>
                            <p>
                                <label>公司地址：</label>
                                {{ruleForm.company.province}}{{ruleForm.company.city}}{{ruleForm.company.address}}
                            </p>
                            <p>
                                <label>统一社会信用代码：</label>
                                {{ruleForm.company.businessLicense?ruleForm.company.businessLicense:"暂无数据"}}
                            </p>
                            <p>
                                <label>手机号：</label>
                                {{ruleForm.company.phone}}
                            </p>
                            <p>
                                <label>邮箱：</label>
                                {{ruleForm.company.email}}
                            </p>
                        </el-card>
                    </el-form-item>
                    <el-form-item label="竞标认知：">
                        <span>{{ruleForm.teamInfo.projectCognize}}</span>
                    </el-form-item>
                    <el-form-item label="竞标详细规划：">
                        <p class="detail">{{ruleForm.teamInfo.detailedPlanning}}</p>
                    </el-form-item>
                    <el-form-item label="竞标附件：">
                        <a
                                :href="ruleForm.teamInfo.accessory"
                                target="_Blank"
                                v-if="ruleForm.teamInfo.accessory"
                        >下载附件</a>
                        <a href="javascript:void(0)" v-if="!ruleForm.teamInfo.accessory">暂无附件</a>
                    </el-form-item>
                    <el-form-item label="需求结果：">
                        <a :href="ruleForm.demandResult" target="_Blank" v-if="ruleForm.demandResult">下载附件</a>
                        <a href="javascript:void(0)" v-if="!ruleForm.demandResult">暂无附件</a>
                    </el-form-item>
                </el-form>
            </el-card>
            <el-card class="box-card0" v-if="ruleForm.personage">
                <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm">
                    <el-form-item label="项目名称：">
                        <span>{{ruleForm.requirementv.name}}</span>
                    </el-form-item>
                    <el-form-item label="项目类型:">
                        <span>{{parentValue}}</span>
                    </el-form-item>
                    <el-form-item label="项目子类型:">
                        <span>{{typeValue}}</span>
                    </el-form-item>
                    <el-form-item label="一句话描述需求：">
                        <span>{{ruleForm.requirementv.requirement}}</span>
                    </el-form-item>
                    <el-form-item label="详细描述：">
                        <p class="detail">{{ruleForm.requirementv.detail}}</p>
                    </el-form-item>
                    <el-form-item label="附件：">
                        <a
                                :href="ruleForm.requirementv.accessory"
                                target="_Blank"
                                v-if="ruleForm.requirementv.accessory"
                        >下载附件</a>
                        <a target="_Blank" v-if="!ruleForm.requirementv.accessory">暂无附件</a>
                    </el-form-item>
                    <el-form-item label="发布时间：">
                        <span>{{ruleForm.requirementv.gmtCreate}}</span>
                    </el-form-item>
                    <el-form-item label="个人信息：">
                        <el-card class="parentCard">
                            <img
                                    class="userImg"
                                    :src="ruleForm.personage.headurl?ruleForm.personage.headurl:getnoImg"
                            />
                            <p>
                                <label>用户名：</label>
                                {{ruleForm.personage.userName}}
                            </p>
                            <p>
                                <label>姓名：</label>
                                {{ruleForm.personage.name?ruleForm.personage.name:'暂无数据'}}
                            </p>
                            <p>
                                <label>
                                    性别：
                                    <span v-if="ruleForm.personage.sex===1">男</span>
                                    <span v-if="ruleForm.personage.sex===2">男</span>
                                    <span v-if="ruleForm.personage.sex===3">未知</span>
                                </label>
                            </p>
                            <p>
                                <label>手机号：</label>
                                {{ruleForm.personage.phone}}
                            </p>
                            <p>
                                <label>邮箱：</label>
                                {{ruleForm.personage.email}}
                            </p>
                        </el-card>
                    </el-form-item>
                    <el-form-item label="竞标认知：">
                        <span>{{ruleForm.teamInfo.projectCognize}}</span>
                    </el-form-item>
                    <el-form-item label="竞标详细规划：">
                        <p class="detail">{{ruleForm.teamInfo.detailedPlanning}}</p>
                    </el-form-item>
                    <el-form-item label="竞标附件：">
                        <a
                                :href="ruleForm.teamInfo.accessory"
                                target="_Blank"
                                v-if="ruleForm.teamInfo.accessory"
                        >下载附件</a>
                        <a target="_Blank" v-if="!ruleForm.teamInfo.accessory">暂无附件</a>
                    </el-form-item>
                    <el-form-item label="需求结果：">
                        <a :href="ruleForm.demandResult" target="_Blank" v-if="ruleForm.demandResult">下载附件</a>
                        <a target="_Blank" v-if="!ruleForm.demandResult">暂无附件</a>
                    </el-form-item>
                </el-form>
                <p>评审流程：<span v-if="processList.length===0">无</span></p>
                <el-table :data="processList" style="width: 100%" v-if="processList.length>0">
                    <el-table-column prop="id" label="评审流程编号" width="180"> </el-table-column>
                    <el-table-column prop="processName" label="评审流程" width="180"> </el-table-column>
                    <el-table-column prop="demand" label="评审要求"> </el-table-column>
                </el-table>
                <p style="margin: 16px auto;">交付资源列表：</p>
                <el-table :data="resourceList" style="width: 100%">
                    <el-table-column prop="id" label="编号" width="180"> </el-table-column>
                    <el-table-column prop="resourceName" label="交付资源名称" width="180"> </el-table-column>
                    <el-table-column prop="remark" label="备注"> </el-table-column>
                </el-table>
            </el-card>
        </div>
    </div>
</template>
<script>
    import {httpGet} from "@/utils/http.js";
    import {specificDate} from "@/utils/getDate.js";
    import {mapMutations, mapActions, mapGetters} from "vuex";
    import {errTips} from "@/utils/tips.js";

    export default {
        data() {
            return {
                id: "",
                list: [{value: "是"}, {value: "否"}],
                parentValue: "",
                typeValue: "",
                ruleForm: {
                    demandResult: null,
                    company: {},
                    projectTypeList: [],
                    requirementv: {},
                    teamInfo: {}
                },
                processList:[],//评审流程列表
                resourceList:[],//交付资源列表
                projectId:null,
            };
        },
        computed: {
            ...mapGetters(["getnoImg", "getAllType"])
        },
        created: function () {
            this.id = this.$route.query.id;
            this.GETALLTYPE();
        },
        watch: {
            //监听获取类型完成后渲染数据
            getAllType() {
                httpGet("/v1/authorization/bids/castinfo/get", {
                    id: this.$route.query.id
                }).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 200) {
                        for (let ele of this.getAllType) {
                            if (ele.id == data.requirementv.parentId) {
                                this.$set(this, "parentValue", ele.type);
                            } else if (ele.id == data.requirementv.typeId) {
                                this.$set(this, "typeValue", ele.type);
                            }
                        }
                        data.requirementv.gmtCreate = specificDate(
                            data.requirementv.gmtCreate
                        );
                        this.ruleForm = data;
                        this.projectId = this.ruleForm.requirementv.id;//获取需求的id
                        this.getResourceList();
                        this.getReviewProcess();
                    } else if (httpCode === 400) {
                        this.setCache("myBid");
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                });
            },

        },
        methods: {
            ...mapMutations(["setCache"]),
            ...mapActions(["GETALLTYPE"]),
            /**获取交付资源*/
            getResourceList(){
                httpGet('/v1/authorization/review/team/list', { id: this.id }).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 200) {
                        this.resourceList = data.reviewTeamList;
                    }else if (httpCode !== 401) {
                        errTips(msg);
                    }
                });
            },
            /**获取评审流程*/
            getReviewProcess(){
                httpGet("/v1/authorization/review/process/list",{id:this.projectId}).then( results => {
                    const {httpCode,data, msg} = results.data;
                    if (httpCode === 200){
                        this.processList = data.processList;
                    }else if (msg === "该条件暂无数据") {
                        this.processList = [];
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                });
            },
        }
    };
</script>
<style lang='scss'>
    @import "@/assets/scss/bidView.scss";
</style>
