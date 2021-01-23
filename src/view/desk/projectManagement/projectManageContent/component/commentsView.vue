<template>
    <el-dialog :visible.sync="dialogFormVisible" :before-close="changeVisible"
               width="70%">
        <div class="container deskHeader">
            <el-card class="box-card0" style="text-align: left;">
                <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm">
                    <el-form-item label="标题：">
                        <span>{{ruleForm.opinionTitle}}</span>
                    </el-form-item>

                    <el-form-item label="提交人:">
                        <span>{{ruleForm.submitterName}}</span>
                    </el-form-item>

                    <el-form-item label="描述：">
                        <p class="detail">{{ruleForm.opinionDescription}}</p>
                    </el-form-item>

                    <el-form-item label="项目名称:">
                        <span>{{ruleForm.projectName}}</span>
                    </el-form-item>
                    <el-form-item label="需求名称:">
                        <span>{{ruleForm.missionName}}</span>
                    </el-form-item>
                    <el-form-item label="文档类型:">
                        <span class="tablehidden" v-if="ruleForm.documentsType===1">需求设计</span>
                        <span class="tablehidden" v-if="ruleForm.documentsType===2">概要设计</span>
                        <span class="tablehidden" v-if="ruleForm.documentsType===3">详细设计</span>
                    </el-form-item>
                    <el-form-item label="等级状态：">
                        <span class="tablehidden" v-if="ruleForm.level===1" style="color:red;">█马上解决</span>
                        <span class="tablehidden" v-if="ruleForm.level===2" style="color:orange;">█急需解决</span>
                        <span class="tablehidden" v-if="ruleForm.level===3" style="color:#FFE153;">█高度重视</span>
                        <span class="tablehidden" v-if="ruleForm.level===4" style="color:green;">█正常处理</span>
                        <span class="tablehidden" v-if="ruleForm.level===5" style="color:blue;">█低优先级</span>
                    </el-form-item>
                </el-form>

            </el-card>
        </div>
    </el-dialog>
</template>
<script>
    import {httpGet} from "@/utils/http.js";
    // import {specificDate} from "@/utils/getDate.js";
    import {errTips} from "@/utils/tips.js";
    // import {mapMutations, mapActions, mapGetters} from "vuex";

    export default {
        name: "commentsView",
        props: {
            dialogFormVisible: {
                type: Boolean,
                default: false,
            },
            id: {
                type: Number,
                default: null,
            }
        },
        data() {
            return {
                list: [{value: "是"}, {value: "否"}],
                typeValue: "",
                ruleForm: {}
            };
        },

        methods: {
            changeVisible() {
                this.$emit('closeDialog');
            },
            
            getView() {
                this.loading = true;
                httpGet(`/v1/authorization/documents/documentsinfo/get?id=${this.id}`).then(
                    results => {
                        const {data, httpCode} = results.data;
                        if (httpCode === 200) {
                            this.ruleForm = data;
                        } else if (httpCode === 400) {
                            errTips("页面丟失");
                            this.setCache("documentOpinion");
                        }
                    }
                );
            },

        }
    };
</script>
<style lang='scss'>
    @import "@/assets/scss/applicationView.scss";
</style>
