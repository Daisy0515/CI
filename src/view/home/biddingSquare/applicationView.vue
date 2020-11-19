<template>
    <div class="applicationView">
        <div class="hasBg">
            <div class="container">
                <div class="module_headerCrumb">
                    <div class="searchTitle">
                        <p class="searchTitle">
                            <router-link to="managerProcess">招标投标</router-link>
                            >
                            <router-link to="biddingSquare">招标广场</router-link>
                            >
                            申请查看
                        </p>
                    </div>
                    <span class="resultCount"></span>
                </div>
            </div>
        </div>
        <div class="container">
            <el-card class="box-card0">
                <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm">
                    <el-form-item label="项目名称：">
                        <span>{{ruleForm.name}}</span>
                    </el-form-item>
                    <el-form-item label="项目类型：">
                        <span>{{parentValue}}</span>
                    </el-form-item>
                    <el-form-item label="项目子类型：">
                        <span>{{typeValue}}</span>
                    </el-form-item>
                    <el-form-item label="一句话描述需求：">
                        <span>{{ruleForm.requirement}}</span>
                    </el-form-item>
                    <el-form-item label="详细描述：">
                        <p class="detail">{{ruleForm.detail }}</p>
                    </el-form-item>
                    <el-form-item label="附件：">
                        <a target="_Blank" :href="ruleForm.accessory" v-if="ruleForm.accessory&&getUser">下载附件</a>
                        <a v-if="!ruleForm.accessory&&getUser" target="_Blank">暂无附件</a>
                        <a v-if="!getUser" href="javascript:void(0)">登录才能下载附件</a>
                    </el-form-item>
                    <el-form-item label="发布时间：">
                        <span>{{ruleForm.gmtCreate}}</span>
                    </el-form-item>
                    <el-form-item label="竞标团队：" class="team">
                        <p v-if="ruleForm.headurlList.length===0">暂无竞标团队</p>
                        <router-link
                                :to="{path:'personalBid', query:{id:item.teamId,returnId:id}}"
                                v-for="(item,index) in ruleForm.headurlList"
                                :key="index"
                        >
                            <img :src="item.headur?item.headur:getnoImg"/>
                        </router-link>
                    </el-form-item>
                    <el-form-item class="publish">
                        <el-button type="primary" @click="submitForm('ruleForm')" size="medium">参与竞标</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
    </div>
</template>
<script>
    import {mapActions, mapGetters} from "vuex";
    import {httpGet} from "@/utils/http.js";
    import {specificDate} from "@/utils/getDate.js";
    import {errTips} from "@/utils/tips.js";

    export default {
        data() {
            return {
                id: "",
                parentValue: "",
                typeValue: "",
                ruleForm: {
                    headurlList: []
                }
            };
        },
        created: function () {
            if (!this.$route.query.id) {
                this.$router.push({path: "/biddingSquare"});
                return false;
            }
            this.id = this.$route.query.id;
            //获取项目类型
            this.GETALLTYPE();
        },
        watch: {
            //监听获取项目类型数据完成后渲染页面
            getAllType() {
                httpGet(`/v1/public/bid/selete/applyfor?id=${this.id}`).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 200) {
                        for (let ele of this.getAllType) {
                            if (ele.id == data.parentId) {
                                this.$set(this, "parentValue", ele.type);
                            } else if (ele.id == data.typeId) {
                                this.$set(this, "typeValue", ele.type);
                            }
                        }
                        data.gmtCreate = specificDate(data.gmtCreate);
                        this.ruleForm = data;
                    } else if (httpCode === 400) {
                        this.$router.push({path: "biddingSquare"});
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                });
            }
        },
        computed: {
            ...mapGetters(["getUser", "getnoImg", "getAllType"])
        },
        methods: {
            ...mapActions(["GETALLTYPE"]),
            //提交表单
            submitForm() {
                httpGet("/v1/authorization/bid/takepartin/get", {
                    id: this.id
                }).then(results => {
                    const getData = results.data;
                    if (getData.httpCode === 200) {
                        this.$router.push({
                            path: "participationBidding",
                            query: {id: this.id}
                        });
                    } else if (getData.msg === "accessToken is required") {
                        errTips("未登录不能参竞标");
                    } else if (getData.httpCode !== 500 && getData.httpCode !== 401) {
                        errTips(getData.msg);
                    }
                });
            }
        }
    };
</script>
<style lang='scss'>
    @import "@/assets/scss/applicationView.scss";
</style>
