<template>
    <div class="register">
        <Index-Header></Index-Header>
        <div class="container">
            <el-card class="box-card">
                <div slot="header" class="clearfix" style="text-align:center">
                    <span>个人注册</span>
                </div>
                <el-form
                        :model="personalForm"
                        status-icon
                        :rules="rules"
                        ref="personalForm"
                        class="demo-ruleForm"
                >
                    <el-form-item prop="userName" :error="errorList.userError">
                        <el-input v-model="personalForm.userName" placeholder="请输入用户名">
                            <i slot="prefix" class="icon iconfont icon-yonghu"></i>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="phone" :error="errorList.phoneError">
                        <el-input v-model="personalForm.phone" placeholder="请输入手机号码">
                            <i slot="prefix" class="icon iconfont icon-dianhua"></i>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="code" :error="errorList.codeError">
                        <el-input class="Verification" v-model="personalForm.code" placeholder="请输入验证码">
                            <i slot="prefix" class="icon iconfont icon-yanzhengmatianchong"></i>
                        </el-input>
                        <codeBtn
                                :phone="personalForm.phone"
                                :codeType="1"
                                v-on:setPhoneErr="setPhoneErr($event)"
                        />
                    </el-form-item>
                    <el-form-item :error="errorList.emailError" prop="email">
                        <el-input v-model="personalForm.email" placeholder="请输入邮箱">
                            <i slot="prefix" class="icon iconfont icon-youjian"></i>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="work">
                        <el-input placeholder="请输入工作单位" v-model="personalForm.work" autocomplete="off">
                            <i slot="prefix" class="icon iconfont icon-gongsi00"></i>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password" :error="errorList.passError">
                        <el-input
                                type="password"
                                placeholder="请输入密码"
                                v-model="personalForm.password"
                                autocomplete="off"
                        >
                            <i slot="prefix" class="icon iconfont icon-ziyuanxhdpi"></i>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="checkPass" :error="errorList.passError">
                        <el-input
                                type="password"
                                placeholder="请再次输入密码"
                                v-model="personalForm.checkPass"
                                autocomplete="off"
                        >
                            <i slot="prefix" class="icon iconfont icon-ziyuanxhdpi"></i>
                        </el-input>
                    </el-form-item>
                    <el-form-item class="Remember" prop="type">
                        <el-checkbox-group v-model="personalForm.type">
                            <el-checkbox label="我已阅读并同意用户守则" name="type"></el-checkbox>
                        </el-checkbox-group>
                        <router-link target="_blank" style="margin-left:20px;" to="rules">用户守则</router-link>
                    </el-form-item>
                    <el-form-item class="register_get">
                        <el-button type="primary" @click="submitForm('personalForm')">注册</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
        <Footer></Footer>
    </div>
</template>
<script>
    import IndexHeader from "@/common/header/userHeader";
    import Footer from "@/common/footer/footer";
    import {httpPost} from "@/utils/http.js";
    import codeBtn from "@/common/sendCode/sendPhoneCode";
    import regular from "@/mixins/regular/personRegister.js";
    import {errTips} from "@/utils/tips.js";

    export default {
        name: "personRegister",
        components: {
            IndexHeader,
            Footer,
            codeBtn
        },
        mixins: [regular],
        data() {
            return {
                loginForm:{
                    microblogId:null,
                    type:null
                },
                personalForm: {
                    password: "",
                    checkPass: "",
                    userName: "",
                    code: "",
                    phone: "",
                    email: "",
                    workUnit: "",
                    type: []
                }
            };
        },
        created: function () {
            this.loginForm.microblogId = this.$route.query.microblogId;
            this.loginForm.type = this.$route.query.type;

            // console.log(this.loginForm.microblogId!=null);
            if (sessionStorage.getItem("userToken")) {
                this.$router.push("/");
                return false;
            }
        },
        methods: {
            setPhoneErr(msg) {
                this.errorList.phoneError = msg;
            },
            submitForm(formName) {
                for (let key in this.errorList) {
                    this.errorList[key] = "";
                }
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        httpPost(
                            "/v1/public/coreuser/customer/register",
                            this.personalForm
                        ).then(results => {
                            const {httpCode, msg} = results.data;
                            if (httpCode === 200) {
                                this.$router.push({name: 'registerSuccess', params: {isSuccess: 1}});
                            } else if (msg === "用户名已被使用") {
                                this.errorList.userError = "用户名已被使用";
                            } else if (msg === "手机号码已被使用") {
                                this.errorList.phoneError = "手机号码已被使用";
                            } else if (msg === "邮箱已被使用") {
                                this.errorList.emailError = "邮箱已被使用";
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
                margin-top: 10px;
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
    }
</style>
