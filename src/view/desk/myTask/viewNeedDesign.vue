<template>
    <div class="applicationView">
        <div class="header">
            <div class="container deskHeader">
                <h4>
                    您的位置：
                    <router-link to="myTask">我的任务</router-link>
                    >
                    <span class="active">查看文档</span>
                </h4>
            </div>
        </div>
        <div class="container">
            <el-card class="box-card0" style="text-align: left;">
                <h1 style="color: #303133;">我的任务-需求设计</h1><br><br>

                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
                    <el-form-item class="cancel">
                        <a target="_Blank" :href="ruleForm.sourceFile"
                           style="display:inline;margin-left: 80%;font-size: 20px;">
                            <i class="el-icon-search"></i>
                            文档预览
                        </a>
                    </el-form-item>
                    <el-form-item label="需求背景">
                        <span>{{ruleForm.introduction}}</span>
                    </el-form-item>

                    <el-form-item label="功能性需求">
                        <span>{{ruleForm.functionality}}</span>
                    </el-form-item>

                    <el-form-item label="非功能性需求">
                        <span>{{ruleForm.design}}</span>
                    </el-form-item>

                    <el-form-item label="设计约束">
                        <span>{{ruleForm.demand}}</span>
                    </el-form-item>

                    <!-- <el-form-item label="需求设计文档">
                      <a :href="ruleForm.sourceFile" target="_Blank" v-if="ruleForm.sourceFile">下载附件</a>
                      <a target="_Blank" v-if="!ruleForm.sourceFile">暂无附件</a>
                    </el-form-item>

                    <el-form-item label="备注" prop="remark">
                      <span>{{ruleForm.remark}}</span>
                    </el-form-item> -->


                    <el-form-item class="cancel">
                        <el-button type="primary" @click="returnKB" size="medium" style="width:150px;margin-left:45%">
                            返回
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
    </div>
</template>

<script>
    import {httpGet, httpPost} from "@/utils/http.js";
    import {errTips, successTips} from "@/utils/tips.js";
    import {mapMutations, mapActions, mapGetters} from "vuex";
    import sourceUpload from "@/common/upload/resourceUpload";

    export default {
        components: {
            sourceUpload
        },
        data() {
            return {
                id: "",
                ruleForm: {
                    demand: "",//设计约束
                    design: "",//非功能性需求
                    documentsId: null,//文档编号ID （如果这个页面没有用到这个参数是否需要写在ruleForm里面）
                    functionality: "",//功能性需求
                    introduction: "",//需求背景
                    missionId: null,//get??
                    remark: "",//备注
                    sourceFile: "", //原文件
                }
            };
        },

        computed: {
            ...mapGetters(["getnoImg", "getAllType"])
        },

        created: function () {
            this.id = this.$route.query.id;  //???不确定是不是这么获取
            this.getView(); //这个是什么意思？
        },
        //get /v1/authorization/mission/missioninfo/get
        methods: {
            getView() {
                httpGet(`/v1/authorization/mission/mission/get?id=${this.id}`).then(results => {
                    const {data, httpCode} = results.data;
                    if (httpCode === 200) {
                        this.ruleForm = data;
                    } else if (httpCode === 400) {
                        errTips('页面丟失');
                        this.setCache('documentOpinion');
                    }
                });

            },

            returnKB() {
                this.$router.push({path: "./kanBan"});
            },

        }
    };
</script>
<style lang='scss'>
    @import '@/assets/scss/applicationView.scss';

</style>






