<template>
    <div class="applicationView">
        <div class="responsive resp">
            <div class="module_secondaryHead guruSearch hasBg">
                <div class="container">
                    <div class="module_headerCrumb">
                        <div class="refinery">
                            <div class="searchTitle">
                                <p class="searchTitle">
                                    <router-link to="testEmploy">内测招募</router-link>
                                    > 发布测试
                                </p>
                            </div>
                        </div>
                        <span class="resultCount"></span>
                    </div>
                </div>
            </div>
        </div>
        <div class="container">
            <el-card class="box-card0" style="text-align: left;">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">

                    <el-form-item label="测试名称" prop="projectName">
                        <el-input class="input_title title" v-model="ruleForm.projectName"></el-input>
                    </el-form-item>

                    <el-form-item label="项目类型:">
                        <el-radio-group v-model="ruleForm.type" size="medium">
                            <el-radio-button :label="item.id" v-for="(item,index) in types" :key="index">{{item.type}}
                            </el-radio-button>
                        </el-radio-group>
                        <!-- <el-checkbox-group v-model="ruleForm.goTypeList">
                          <el-checkbox v-for="(item,index) in types" :key="index" :label="item.id">{{item.type}}</el-checkbox>
                        </el-checkbox-group> -->
                    </el-form-item>

                    <!-- <el-form-item label="测试链接" prop="testLink">
                      <el-input class="input_title title" v-model="ruleForm.testLink"></el-input>
                    </el-form-item> -->

                    <el-form-item label="截止时间" prop="deadline">
                        <el-date-picker
                                style="margin-left:0%"
                                v-model="ruleForm.deadline"
                                :picker-options="endDatePicker"
                                type="date"
                                placeholder="截止时间"
                                value-format="yyyy-MM-dd"
                        ></el-date-picker>
                    </el-form-item>

                    <el-form-item label="所需人数" prop="needCount">
                        <el-input class="input_title title" v-model="ruleForm.needCount"></el-input>
                    </el-form-item>

                    <el-form-item label="测试需求" prop="testRequirement">
                        <el-input type="textarea" class="input_textarea " v-model="ruleForm.testRequirement " :rows="10"
                                  style="width:100%;float:right"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <sourceUpload :uploadIndex="uploadIndex" v-on:setIdCard="setIdCard($event)"/>
                    </el-form-item>

                    <el-form-item class="cancel">
                        <el-button type="primary" @click="returnSquare" size="medium"
                                   style="width:150px;margin-left:25%">返回
                        </el-button>
                        <el-button type="primary" @click="submitForm('ruleForm')" size="medium"
                                   style="width:150px;margin-left:25%">保存
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
                endDatePicker: {
                    disabledDate(time) {
                        return time.getTime() < new Date().getTime() - 86400000;
                    },
                },
                uploadIndex: false,
                types: [],
                ruleForm: {
                    projectName: "",//项目名称
                    type: "",//项目类型
                    testRequirement: "",//测试需求
                    deadline: "",//截止时间
                    testLink: "",//测试链接
                    needCount: "",//所需人数
                    sourceFile: ""
                },
                // 表单验证
                rules: {
                    projectName: [
                        {required: true, message: "请输入测试项目名称", trigger: "blur"}
                    ],
                    testRequirement: [
                        {required: true, message: "请输入测试需求", trigger: "blur"}
                    ],
                    needCount: [
                        {required: true, message: "请输入所需测试人数", trigger: "blur"}
                    ],
                    testLink: [
                        {required: true, message: "请输入测试链接", trigger: "blur"}
                    ],
                    deadline: [
                        {required: true, message: "请输入测试截止时间", trigger: "blur"}
                    ]
                }
            };
        },

        created: function () {
            this.getTypeList();
        },


        methods: {
            ...mapMutations(["setCache"]),

            getTypeList() {
                httpGet("/v1/public/bid/typeall/get").then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 200) {
                        // 筛选得到父类别
                        this.types = data.list.filter(function (item) {
                            if (item.parentId === 0)
                                return item;
                        })
                    }
                })
            },

            returnSquare() {
                this.$router.push({path: "./testEmploy"});
            },
            setIdCard(data) {
                data && (this.ruleForm.sourceFile = data);
                //alert(111);
                httpPost('/v1/authorization/test/itemtest/insert', this.ruleForm).then(results => {
                    const {msg, httpCode} = results.data;
                    if (httpCode === 200) {
                        //alert(this.ruleForm.sourceFile);
                        successTips('发布测试成功');
                        this.setCache('testEmploy');
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    } else {
                        alert(httpCode);
                    }
                });
            },

            submitForm(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.ruleForm.sourceFile ? this.setIdCard() : (this.uploadIndex = !this.uploadIndex);
                    } else {
                        return false;
                    }
                });
            }

            // setIdCard(data) {
            //   data && (this.ruleForm.sourceFile = data);
            //   //post /v1/authorization/test/itemtest/insert
            //   alert(123);
            //   httpPost("/v1/authorization/test/itemtest/insert", this.ruleForm).then(results => {
            //     const { data, msg, httpCode } = results.data;
            //     if (httpCode === 200) {
            //       successTips("发布测试成功");
            //     } else  {
            //       errTips(msg);
            //     }
            //   });
            // },
            // submitForm(formName) {
            //   this.$refs[formName].validate(valid => {
            //     if (valid) {
            //       ruleForm.sourceFile?this.setIdCard():(this.uploadIndex = !this.uploadIndex);
            //     } else {
            //       return false;
            //     }
            //   });
            // }
        }
    };
</script>
<style lang='scss' scoped>
    @import "@/assets/scss/applicationView.scss";

    .teamApplication {
        .box-card0 {
            padding: 20px 20px 20px 20px;
            margin: 50px 350px 50px 350px;
        }

        .title.el-input {
            width: 93%;
            float: right;
        }

        .title .el-input__inner {
            width: 100%;
            float: right;
        }

        .square1 {
            margin: 0 auto;
            width: 10px;
            height: 10px;
            background: red;
        }
    }
</style>






