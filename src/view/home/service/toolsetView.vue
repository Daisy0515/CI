<template>
    <div class="applicationView">
        <div class="hasBg">
            <div class="container">
                <div class="module_headerCrumb">
                    <div class="searchTitle">
                        <p class="searchTitle">
                            <router-link to="service">工具集</router-link>
                            <span v-if="viewType">></span>
                            <router-link to="moreToolset" v-if="viewType">更多</router-link>
                            >
                            查看
                        </p>
                    </div>
                    <span class="resultCount"></span>
                </div>
            </div>
        </div>
        <div class="container">
            <el-card class="box-card0">
                <h1 style="margin-bottom:20px">{{viewData.title}}</h1>
                <el-form ref="ruleForm" class="demo-ruleForm">
                    <el-form-item label="来源：">
                        <span>{{viewData.source||'暂无数据'}}</span>
                    </el-form-item>
                    <el-form-item label="配置环境:">
                        <span>{{viewData.configEnvironment||'暂无数据'}}</span>
                    </el-form-item>
                    <el-form-item label="实现语言：">
                        <span>{{viewData.language||'暂无数据'}}</span>
                    </el-form-item>
                    <el-form-item label="描述：">
                        <p class="detail">{{viewData.description||'暂无数据'}}</p>
                    </el-form-item>
                    <el-form-item label="工具下载：" v-if="viewData.type===1">
                        <a
                                :href="getUser?viewData.resource:'javascript:void(0)'"
                                target="_Blank"
                        >{{getUser?'下载工具':'登录才能下载工具'}}</a>
                    </el-form-item>
                    <el-form-item label="工具查看：" v-if="viewData.type===2">
                        <a :href="viewData.link" target="_Blank">查看</a>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import {httpGet} from "@/utils/http.js";
    import {errTips} from "@/utils/tips.js";

    export default {
        data() {
            return {
                viewData: {
                    source: "",
                    configEnvironment: "",
                    language: "",
                    description: ""
                },
                viewType: ""
            };
        },
        created: function () {
            if (!this.$route.query.id) {
                this.$router.push({name: "toolset"});
                return false;
            }
            httpGet("/v1/public/share/get/select", {id: this.$route.query.id}).then(
                results => {
                    const {httpCode, msg} = results.data;
                    if (httpCode === 200) {
                        this.$set(this, "viewData", results.data.data);
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                }
            );
        },
        computed: {
            ...mapGetters(["getUser"])
        }
    };
</script>
<style lang='scss'>
    @import "@/assets/scss/applicationView.scss";
</style>
