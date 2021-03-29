<template>
    <div class="participationBidding">
        <form method="post" id="aspnetForm" class="responsive resp">
            <div class="module_secondaryHead guruSearch hasBg">
                <div class="container">
                    <div class="module_headerCrumb">
                        <div class="refinery">
                            <div class="h1 searchTitle">
                                <p class="searchTitle">
                                    <router-link to="managerProcess">招标投标</router-link>
                                    >
                                    <router-link to="path:'biddingSquare">招标广场</router-link>
                                    >
                                    <router-link :to="{path:'applicationView',query:{id:id}}">申请查看</router-link>
                                    >
                                    参与竞标
                                </p>
                            </div>
                        </div>
                        <span class="resultCount"></span>
                    </div>
                </div>
            </div>
        </form>
        <div class="container">
            <el-card class="box-card0">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="ruleForm">
                    <el-form-item label="团队名称" prop="teamName">
                        <el-input v-model="ruleForm.teamName"></el-input>
                    </el-form-item>
                    <el-form-item label="团队介绍" prop="teamIntroduction">
                        <el-input type="textarea" v-model="ruleForm.teamIntroduction " :rows="10"></el-input>
                    </el-form-item>
                    <el-form-item label="一句话对项目的认知" prop="projectCognize">
                        <el-input v-model="ruleForm.projectCognize "></el-input>
                    </el-form-item>
                    <el-form-item label="详细规划" prop="detailedPlanning">
                        <el-input type="textarea" v-model="ruleForm.detailedPlanning " :rows="10"></el-input>
                    </el-form-item>
                    <el-form-item label="投标方查看联系方式">
                        <label v-for="(item,index) in list" :key="index">
                            <input name="Fruit" type="radio" :value="item.value" v-model="ruleForm.checkedValue"/>
                            {{item.value}}
                        </label>
                    </el-form-item>
                    <el-form-item>
                        <source-Upload
                                :uploadIndex="uploadIndex"
                                :fileName="fileName"
                                v-on:setIdCard="setIdCard($event)"
                        />
                    </el-form-item>
                    <el-form-item class="publish">
                        <el-button type="primary" @click="open" size="medium">提交</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
    </div>
</template>

<script>
    import {httpGet, httpPost} from "@/utils/http.js";
    import {errTips} from "@/utils/tips.js";
    import sourceUpload from "@/common/upload/resourceUpload";
    import { MessageBox,message } from 'element-ui';

    export default {
        components: {
            sourceUpload
        },
        data() {
            const RequirementReg = /^.{0,50}$/;
            const detailReg = /^.{0,500}$/;
            const projectCognize = (rule, value, callback) => {
                if (value === "") {
                    callback(new Error("请输入一句对项目的认知"));
                } else if (!RequirementReg.test(value)) {
                    callback(new Error("不可输入符号，不超过50个字"));
                } else {
                    callback();
                }
            };
            const teamName = (rule, value, callback) => {
                if (value === "") {
                    callback(new Error("请输入团队名称"));
                } else if (!RequirementReg.test(value)) {
                    callback(new Error("不可输入符号，不超过50个字"));
                } else {
                    callback();
                }
            };
            const detailedPlanning = (rule, value, callback) => {
                if (!value) {
                    callback(new Error("请输入详细描述"));
                } else if (value.length >= 500) {
                    callback(new Error("不可输入符号，不超过500个字"));
                } else {
                    callback();
                }
            };
            return {
                fileName: "bidding",
                uploadIndex: false,
                list: [{value: "是"}, {value: "否"}],
                qiniuData: {
                    key: "",
                    token: ""
                },
                projectName:'',
                ruleForm: {
                    projectCognize: "",
                    projectId: "",
                    checkedValue: "是",
                    teamName: "",
                    teamIntroduction: "",
                },
                rules: {
                    projectCognize: [
                        {validator: projectCognize, trigger: "blur", required: true}
                    ],
                    detailedPlanning: [
                        {validator: detailedPlanning, trigger: "blur", required: true}
                    ],
                    teamName: [
                        {validator: teamName, trigger: "blur", required: true}
                    ],
                }
            };
        },
        created: function () {
            if (!this.$route.query.id) {
                this.$router.push({path: "/biddingSquare"});
                return false;
            }
            this.id = this.$route.query.id;
            this.ruleForm.projectId = this.$route.query.id;
            this.isView();
            this.getAllType();
        },
        methods: {
            //判断是否是自己发布的项目
            isView() {
                httpGet("/v1/authorization/bid/takepartin/get", {
                    id: this.ruleForm.projectId
                }).then(results => {
                    if (results.data.httpCode === 400) {
                        errTips("不能参与自己的项目");
                        this.$router.push({path: "applicationView"});
                        return false;
                    }
                });
            },
            //提交表单
            setIdCard(data) {
                data && (this.ruleForm.accessory = data);
                httpPost("/v1/authorization/bids/takepartin/insert", this.ruleForm).then(
                    results => {
                        const getData = results.data;
                        if (getData.httpCode === 200) {
                            this.$router.push({path: "/desk/myBid"});
                        } else {
                            errTips(getData.msg);
                        }
                    }
                );
            },

            getAllType() {
                httpGet(`/v1/public/bid/selete/applyfor?id=${this.id}`).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 200) {
                        this.projectName = data.name;
                    } else if (httpCode === 400) {
                        this.$router.push({path: "biddingSquare"});
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                });
            },

            open() {
                MessageBox.confirm('确定要参与项目“'+this.projectName+'"的竞标吗？', '确认信息', {
                distinguishCancelAndClose: true,
                confirmButtonText: '保存',
                cancelButtonText: '取消'
                })
                .then((action) => {
                    if(action === "confirm"){
                        //console.log(this.ruleForm);
                        this.submitForm('ruleForm');
                        message({
                        message: '参与竞标成功',
                        type: 'success',
                        });
                    }
                })
            },

            //表单验证，上传
            submitForm(formName) {
                //console.log(this.$refs);
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        let {ruleForm} = this;
                        ruleForm.checkedValue === "是"
                            ? (ruleForm.isSelect = 1)
                            : (ruleForm.isSelect = 0);
                        if (ruleForm.accessory) {
                            this.setIdCard();
                        } else {
                            this.uploadIndex = !this.uploadIndex;
                        }
                    } else {
                        return false;
                    }
                });
            }
        }
    };
</script>
<style lang='scss'>
    @import "@/assets/scss/participationBidding.scss";
</style>
