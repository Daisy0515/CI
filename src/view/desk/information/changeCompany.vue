<template>
    <div>
        <el-form
                :model="ruleForm"
                :rules="rules"
                ref="ruleForm"
                label-width="100px"
                class="demo-ruleForm clearfix"
        >
            <h3>公司信息</h3>
            <el-form-item label="公司名称" prop="companyName" :error="userError">
                <el-input v-model="ruleForm.companyName"></el-input>
            </el-form-item>
            <el-form-item
                    class="tongyi"
                    label="统一社会信用代码"
                    prop="businessLicense"
                    :error="businessLicenseError"
            >
                <el-input v-model="ruleForm.businessLicense"></el-input>
            </el-form-item>
            <el-form-item class="city" label="公司地址" prop="city">
                <el-cascader size="large" :options="options" placeholder="请选择省市"
                             v-model="selectedOptions"></el-cascader>
            </el-form-item>
            <el-form-item label="详细地址" prop="address">
                <el-input v-model="ruleForm.address " autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="手机号" class="gaiphone">
                <el-input :disabled="true" v-model="ruleForm.phone"></el-input>
                <router-link to="yzPhone">修改手机号码</router-link>
            </el-form-item>
            <el-form-item label="邮箱" class="emailyz" prop="email" :error="emailError">
                <el-input :disabled="true" v-model="ruleForm.email"></el-input>
                <span class="emailstate">{{ruleForm.isEmail==1?emailyz="已验证":emailyz="未验证"}}</span>
                <router-link :to="{name:'yzEmail',query:{email:ruleForm.email}}">修改验证邮箱号</router-link>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">修改</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import {
        provinceAndCityData,
        CodeToText,
        regionDataPlus
    } from "element-china-area-data";
    import {httpGet, httpPut} from "@/utils/http.js";
    import {mapGetters} from "vuex";
    import {errTips} from "@/utils/tips.js";
    import {Notification} from 'element-ui';

    export default {
        components: {},
        data() {
            const userReg = /^[A-Za-z0-9\u4e00-\u9fa5]{6,16}$/;
            const emallReg = /^[a-zA-Z0-9_\.-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
            const validateEmail = (rule, value, callback) => {
                if (value === "") {
                    callback(new Error("请输入邮箱地址"));
                } else if (!emallReg.test(value)) {
                    callback(new Error("邮箱格式不正确"));
                } else {
                    callback();
                }
            };
            const validateUser = (rule, value, callback) => {
                if (value === "") {
                    callback(new Error("请输入公司名称"));
                } else if (!userReg.test(value)) {
                    callback(new Error("不能输入符号，长度为6到16"));
                } else {
                    callback();
                }
            };
            const validateCity = (rule, value, callback) => {
                if (this.selectedOptions.length == 0) {
                    callback(new Error("请选择省市"));
                } else {
                    callback();
                }
            };
            return {
                businessLicenseError: "",
                userError: "",
                emailError: "",
                options: provinceAndCityData,
                selectedOptions: null,
                newcity: regionDataPlus,
                CodeToTextData: CodeToText,
                ruleForm: {
                    isEmail: "",
                    companyName: "",
                    province: "",
                    mainBusiness: "",
                    businessLicense: "",
                    type: [],
                    email: "",
                    address: "",
                    city: ""
                },
                rules: {
                    companyName: [
                        {validator: validateUser, trigger: "blur", required: true}
                    ],
                    // password: [{ validator: validatePass, trigger: "blur" }],
                    // checkPass: [{ validator: validatePass2, trigger: "blur" }],
                    businessLicense: [
                        {trigger: "blur", required: true, message: "请填写统一社会信用代码"}
                    ],
                    email: [{validator: validateEmail, trigger: "blur", required: true}],
                    address: [
                        {trigger: "blur", required: true, message: "请填写详细地址"}
                    ],
                    city: [
                        {
                            type: "array",
                            validator: validateCity,
                            trigger: "change",
                            required: true
                        }
                    ]
                }
            };
        },
        created: function () {
            this.getCompany();
        },
        computed: {
            ...mapGetters(["getuserData"])
        },
        methods: {
            changSuccess() {
                Notification({
                    title: "成功",
                    message: "已修改成功！",
                    type: "success",
                    position: "bottom-right",
                    duration: 1300
                });
            },
            //获取公司信息
            getCompany() {
                httpGet("/v1/authorization/coreuser/userinfo/company").then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode == 200) {
                        this.ruleForm = data;
                        let cityList = [];
                        this.newcity.filter(ele => {
                            if (ele.label == data.province) {
                                cityList.push(ele.value);
                                ele.children.filter(ele => {
                                    if (ele.label == data.city) {
                                        cityList.push(ele.value);
                                        return false;
                                    }
                                });
                            }
                        });
                        this.selectedOptions = cityList;
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                });
            },
            //提交修改
            submitForm(formName) {
                this.emailError = "";
                this.businessLicenseError = "";
                this.userError = "";
                this.ruleForm.province = this.CodeToTextData[this.selectedOptions[0]];
                this.ruleForm.city = this.CodeToTextData[this.selectedOptions[1]];
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        httpPut(
                            "/v1/authorization/coreuser/updateinfo/company",
                            this.ruleForm
                        ).then(results => {
                            const {httpCode, msg} = results.data;
                            if (msg == "邮箱已被使用") {
                                this.emailError = "邮箱已被使用";
                            } else if (msg == "公司名已被使用") {
                                this.userError = "公司名已被使用";
                            } else if (msg == "营业执照已被使用") {
                                this.businessLicenseError = "统一社会信用代码已被使用";
                            } else if (httpCode == 200) {
                                Object.assign(this.getuserData, this.ruleForm);
                                sessionStorage.setItem(
                                    "userData",
                                    JSON.stringify(this.getuserData)
                                );
                                this.changSuccess();
                            }
                        });
                    } else {
                        return false;
                    }
                });
            }
        }
    };
</script>
<style lang='scss'>
    .tongyi {
        .el-form-item__error {
            margin-top: -29px;
        }
    }

    .emailyz {
        .el-input {
            width: 55%;
        }

        .emailstate {
            margin-left: 5px;
            margin-right: 15px;
        }

        .Verification_btn {
            float: right;
            line-height: 40px;
            font-size: 13px;
            border: 1px solid #c8c8c8;
            padding: 0px 25px 0px 25px;
            border-radius: 5px;
            cursor: pointer;

            &:hover {
                background: #f8f8f8;
            }
        }

        .banBtn {
            pointer-events: none;
            background: #fbfbfb;
        }
    }

    .gaiphone {
        .el-input {
            width: 72%;
            margin-right: 20px;
        }
    }
</style>
