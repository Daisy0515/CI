<template>
    <div class="register">
        <Index-Header></Index-Header>
        <div class="container">
            <el-card class="box-card">
                <div slot="header" class="clearfix" style="text-align:center">
                    <span>公司注册</span>
                </div>
                <el-form
                        :model="companyForm"
                        status-icon
                        :rules="rules"
                        ref="companyForm"
                        class="demo-ruleForm"
                >
                    <el-form-item prop="companyName" :error="errorList.userError">
                        <el-input v-model="companyForm.companyName" placeholder="请输入公司名称">
                            <i slot="prefix" class="icon iconfont icon-gongsi00"></i>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="businessLicense" :error="errorList.businessLicenseError">
                        <el-input v-model="companyForm.businessLicense" placeholder="请输入统一社会信用代码">
                            <i slot="prefix" class="icon iconfont icon-gaikuang1"></i>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="email" :error="errorList.emailError">
                        <el-input v-model="companyForm.email" placeholder="请输入邮箱">
                            <i slot="prefix" class="icon iconfont icon-youjian"></i>
                        </el-input>
                    </el-form-item>
                    <el-form-item class="city" prop="city">
                        <el-cascader
                                size="large"
                                placeholder="请选择省市"
                                :options="options"
                                v-model="selectedOptions"
                        ></el-cascader>
                    </el-form-item>
                    <el-form-item prop="address">
                        <el-input placeholder="请输入详细地址" v-model="companyForm.address" autocomplete="off">
                            <i slot="prefix" class="icon iconfont icon-dizhi"></i>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="phone" :error="errorList.phoneError">
                        <el-input placeholder="请输入手机号" v-model="companyForm.phone" autocomplete="off">
                            <i slot="prefix" class="icon iconfont icon-dianhua"></i>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="code" :error="errorList.codeError">
                        <el-input class="Verification" v-model="companyForm.code" placeholder="请输入验证码">
                            <i slot="prefix" class="icon iconfont icon-yanzhengmatianchong"></i>
                        </el-input>
                        <codeBtn
                                :phone="companyForm.phone"
                                :codeType="1"
                                v-on:setPhoneErr="setPhoneErr($event)"
                        />
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input
                                type="password"
                                placeholder="请输入密码"
                                v-model="companyForm.password"
                                autocomplete="off"
                        >
                            <i slot="prefix" class="icon iconfont icon-ziyuanxhdpi"></i>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="checkPass">
                        <el-input
                                type="password"
                                placeholder="请再次输入密码"
                                v-model="companyForm.checkPass"
                                autocomplete="off"
                        >
                            <i slot="prefix" class="icon iconfont icon-ziyuanxhdpi"></i>
                        </el-input>
                    </el-form-item>
                    <el-form-item class="Remember" prop="type">
                        <el-checkbox-group v-model="companyForm.type">
                            <el-checkbox label="我已阅读并同意用户守则" name="type"></el-checkbox>
                        </el-checkbox-group>
                        <router-link target="_blank" style="margin-left:20px;" to="rules">用户守则</router-link>
                    </el-form-item>
                    <el-form-item class="register_get">
                        <el-button type="primary" @click="submitForm('companyForm')">注册</el-button>
                    </el-form-item>
                    <el-form-item></el-form-item>
                </el-form>
            </el-card>
        </div>
        <Footer></Footer>
    </div>
</template>
<script>
    import {provinceAndCityData, CodeToText} from "element-china-area-data";
    import IndexHeader from "@/common/header/userHeader";
    import Footer from "@/common/footer/footer";
    import {httpPost} from "@/utils/http.js";
    import codeBtn from "@/common/sendCode/sendPhoneCode";
    import regular from "@/mixins/regular/companyRegister.js";
    import {errTips} from "@/utils/tips.js";

    export default {
        name: "companyRegister",
        components: {
            IndexHeader,
            Footer,
            codeBtn
        },
        //表单验证
        mixins: [regular],
        data() {
            return {
                //省市数据
                options: provinceAndCityData,
                newcity: CodeToText,
                selectedOptions: [],
                companyForm: {
                    companyName: "",
                    password: "",
                    checkPass: "",
                    address: "",
                    province: "",
                    city: "",
                    businessLicense: "",
                    email: "",
                    code: "",
                    phone: "",
                    type: []
                }
            };
        },
        created: function () {
            if (sessionStorage.getItem("userToken")) {
                this.$router.push("/");
                return false;
            }
        },
        methods: {
            setPhoneErr(msg) {
                this.errorList.phoneError = msg;
            },
            //表单提交
            submitForm(formName) {
                for (let key in this.errorList) {
                    this.errorList[key] = "";
                }
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.companyForm.province = this.newcity[this.selectedOptions[0]];
                        this.companyForm.city = this.newcity[this.selectedOptions[1]];
                        httpPost(
                            "/v1/public/coreuser/company/register",
                            this.companyForm
                        ).then(results => {
                            const {httpCode, msg} = results.data;
                            if (httpCode === 200) {
                                this.$router.push({
                                    name: "registerSuccess",
                                    params: {isSuccess: 1}
                                });
                            } else if (msg === "公司名已被使用") {
                                this.errorList.userError = "公司名已被使用";
                            } else if (msg === "营业执照已被使用") {
                                this.errorList.businessLicenseError = "统一社会信用代码已被使用";
                            } else if (msg === "邮箱已被使用") {
                                this.errorList.emailError = "邮箱已被使用";
                            } else if (msg === "手机号码已被使用") {
                                this.errorList.phoneError = "手机号码已被使用";
                            } else if (msg === "验证码有误") {
                                this.errorList.codeError = "验证码有误或已超时";
                            } else if (httpCode !== 401) {
                                errTips(msg);
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
    .register {
        .el-upload__tip {
            display: inline-block;
            margin-left: 20px;
        }

        .upload-demo {
            margin: 0;
            padding: 0;
        }

        .container {
            .block:hover canvas {
                display: block;
            }

            .Verification {
                width: 65%;
                float: left;
            }

            .sendYz {
                float: right;
            }

            .Forget {
                float: right;
                color: #3e76b8;
                cursor: pointer;
            }

            .Remember {
                margin: 0;
                padding: 0;
            }

            i {
                margin-left: 5px;
            }

            .el-form-item__content {
                margin-top: 5px;
            }

            .register_get {
                margin: 0 auto;
                width: 45%;

                .el-button--primary {
                    text-align: center;
                    width: 100%;
                    background: #4c83c3;
                    border: 1px solid #d0d0d0;
                }
            }

            .container_new {
                width: 420px;
                margin: 0 auto;
            }

            #msg {
                width: 100%;
                line-height: 40px;
                font-size: 14px;
                text-align: center;
            }

            a:link,
            a:visited,
            a:hover,
            a:active {
                margin-left: 100px;
                color: #0366d6;
            }

            .box-card {
                width: 60%;
                margin: 5% auto;
            }

            .el-card__header {
                padding: 20px 0 0 0;
                font-size: 30px;
                font-weight: 400;
                border-bottom: 0;
            }

            .el-button--primary {
                background: #3e76b8;
            }

            .el-card__body {
                padding: 20px 35px 25px 35px;
            }

            .el-checkbox-group {
                float: left;
            }

            .el-form-item__label {
                font-weight: 600;
            }

            .clearfix {
                & span:nth-child(2) {
                    color: #3e76b8;
                    float: right;
                    font-size: 13px;
                }
            }

            .el-input__inner {
                border: 1px solid #c8c8c8;
                border-radius: 0;
                padding-left: 35px;
            }
        }

        .upload_company {
            margin-top: -20px;
            margin-bottom: 10px;
        }
    }
</style>
