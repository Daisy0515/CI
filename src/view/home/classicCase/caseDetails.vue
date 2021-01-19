<template>
    <div class="applicationAccession">
        <div class="responsive resp">
            <div class="module_secondaryHead guruSearch hasBg">
                <div class="container">
                    <div class="module_headerCrumb">
                        <div class="refinery">
                            <div class="h1 searchTitle">
                                <p class="searchTitle">
                                    <router-link to="classicCase">经典案例</router-link>
                                    > 案例明细
                                </p>
                            </div>
                        </div>
                        <span class="resultCount"></span>
                    </div>
                </div>
            </div>
        </div>
        <div class="container">
            <el-card class="box-card0">
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
                    <el-form-item label="项目描述需求：">
                        <span>{{ruleForm.requirementv.requirement}}</span>
                    </el-form-item>
                    <el-form-item label="项目详细描述：">
                        <span>{{ruleForm.requirementv.detail}}</span>
                    </el-form-item>
                    <el-form-item label="附件：">
                        <a
                                target="_Blank"
                                href="javascript:void(0)"
                                @click="loadFile(ruleForm.requirementv.accessory)"
                                v-if="ruleForm.requirementv.accessory&&getUser"
                        >下载附件</a>
                        <a v-if="!ruleForm.requirementv.accessory&&getUser">暂无附件</a>
                        <a v-if="!getUser" target="_Blank">登录才能下载附件</a>
                    </el-form-item>
                    <el-form-item label="发布时间：">
                        <span>{{ruleForm.requirementv.gmtCreate}}</span>
                    </el-form-item>
                    <el-form-item class="borderTop" label="团队描述需求：">
                        <span>{{ruleForm.teamInfo.projectCognize}}</span>
                    </el-form-item>
                    <el-form-item label="团队详细描述：">
                        <span>{{ruleForm.teamInfo.detailedPlanning}}</span>
                    </el-form-item>
                    <el-form-item label="团队附件：">
                        <a
                                href="javascript:void(0)"
                                @click="loadFile(ruleForm.teamInfo.accessory)"
                                v-if="ruleForm.teamInfo.accessory&&getUser"
                        >下载附件</a>
                        <a v-if="!ruleForm.teamInfo.accessory&&getUser">暂无附件</a>
                        <a v-if="!getUser">登录才能下载附件</a>
                    </el-form-item>
                    <el-form-item label="案例地址：" class="borderTop">
                        <input class="address"
                               placeholder="点击复制地址"
                               autocomplete="off"
                               style="width:300px;"
                               v-if="getUser"
                               v-model="httpUrlToRepo"
                               disabled="disabled"
                        >
                        <el-button class="btn"
                                   type="primary"
                                   size="mini"
                                   style="margin-left:20px"
                                   v-if="getUser"
                                   v-on:click="copyAddress">
                            复制地址
                        </el-button>
                        <router-link to="/git-1"
                                     style="margin-left:20px"
                                     v-if="getUser">
                            如何使用git获取项目
                        </router-link>
                        <a v-if="!getUser" target="_Blank">请先登入</a>
                    </el-form-item>
                    <el-form-item label="案例附件：">
                        <a
                                target="_Blank"
                                href="javascript:void(0)"
                                @click="loadFile(ruleForm.teamInfo.uploadResource)"
                                v-if="getUser&&ruleForm.teamInfo.uploadResource"
                        >下载结果附件</a>
                        <a v-if="!ruleForm.teamInfo.uploadResource&&getUser">暂无附件</a>
                        <a v-if="!getUser" target="_Blank">登录才能下载附件</a>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
    </div>
</template>

<script>
    import Clipboard from 'clipboard'
    import {httpGet} from "@/utils/http.js";
    import {specificDate as getDate} from "@/utils/getDate.js";
    import {mapGetters, mapActions} from "vuex";
    import {errTips} from "@/utils/tips.js";

    export default {
        data() {
            return {
                list: [{value: "是"}, {value: "否"}],
                parentValue: "",
                typeValue: "",
                ruleForm: {
                    company: null,
                    demandResult: null,
                    personage: {},
                    projectTypeList: [],
                    requirementv: {},
                    teamInfo: {}
                },
                httpUrlToRepo: ""
            };
        },
        computed: {
            ...mapGetters(["getUser", "getAllType"])
        },
        created: function () {
            if (!this.$route.query.id) {
                this.$router.push({path: "classicCase"});
                return false;
            }
            //获取项目类型
            this.GETALLTYPE();
        },
        watch: {
            //监听项目类型获取页面数据
            getAllType() {
                let url = "/v1/public/bid/selete/classicinfo";
                if (this.$route.query.type) {
                    url = "/v1/authorization/bid/classic/selectinfo";
                }
                httpGet(url, {
                    id: this.$route.query.id
                }).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 200) {
                        this.$set(this, "httpUrlToRepo", data.httpUrlToRepo);
                        for (let ele of this.getAllType) {
                            if (ele.id === data.requirementv.parentId) {
                                this.$set(this, "parentValue", ele.type);
                            } else if (ele.id === data.requirementv.typeId) {
                                this.$set(this, "typeValue", ele.type);
                            }
                        }
                        data.requirementv.gmtCreate = getDate(data.requirementv.gmtCreate);
                        this.$set(this, "ruleForm", data);
                    } else if (httpCode === 400) {
                        errTips("该案例不存在或已下架");
                        this.$router.push({path: "classicCase"});
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                });
            }
        },
        methods: {
            ...mapActions(["GETALLTYPE"]),
            //复制git地址
            copyAddress: function (event) {
                var gitAddress = this.httpUrlToRepo
                var clipboard = new Clipboard('.btn', {
                    text: function () {
                        return gitAddress;
                    }
                });
                clipboard.on('success', e => {
                    console.log('复制成功')
                    // 释放内存
                    clipboard.destroy()
                });
                clipboard.on('error', e => {
                    // 不支持复制
                    console.log('该浏览器不支持自动复制')
                    // 释放内存
                    clipboard.destroy()
                });
            },

            //点击进入下载页面添加下载次数
            loadFile(href) {
                httpGet("/v1/authorization/classic/uploadresource/classic", {
                    id: this.$route.query.id
                }).then(results => {
                    const {msg, httpCode} = results.data;
                    if (httpCode === 200) {
                        window.open(href);
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                });
            }
        }
    };
</script>
<style lang='scss'>
    @import "@/assets/scss/applicationAccession.scss";
</style>
