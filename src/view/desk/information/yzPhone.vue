<template>
    <div class="yzPhone">
        <el-steps simple>
            <el-step title="验证手机号码" icon="icon iconfont icon-codegmatianchong" status="process"></el-step>
            <el-step title="修改手机号码" icon="el-icon-edit"></el-step>
            <el-step title="修改成功" icon="el-icon-check"></el-step>
        </el-steps>
        <el-form label-width="100px">
            <el-form-item label="手机号" prop="name" class="gaiphone">
                <span>{{phone}}</span>
            </el-form-item>
            <el-form-item label="验证码" class="emailyz" prop="email" :error="yzmError">
                <el-input v-model="code"></el-input>
                <codeBtn :phone="phone" :codeType="3" v-on:setPhoneErr="setPhoneErr($event)"/>
            </el-form-item>
            <el-form-item class="btnItem">
                <el-button type="primary" @click="getyzm">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import {httpGet, httpPost} from "@/utils/http.js";
    import {mapMutations} from "vuex";
    import {errTips} from "@/utils/tips.js";
    import codeBtn from "@/common/sendCode/sendPhoneCode";

    export default {
        components: {
            codeBtn
        },
        data() {
            return {
                yzmError: "",
                phone: "",
                code: ""
            };
        },
        created: function () {
            this.getPhone()
        },
        methods: {
            ...mapMutations(["setMobiletoken"]),
            //获取手机号
            getPhone() {
                httpGet("/v1/authorization/coreuser/phone/get").then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 200) {
                        this.phone = data.phone;
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                });
            },
            setPhoneErr(msg) {
                this.yzmError = msg;
            },
            //提交验证码
            getyzm() {
                this.yzmError = "";
                if (!this.code) {
                    this.yzmError = "请输入验证码";
                    return false;
                }
                httpPost("/v1/authorization/coreuser/phone/before", {
                    code: this.code
                }).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 602) {
                        this.yzmError = "验证码错误或者超时";
                    } else if (httpCode == 200) {
                        this.setMobiletoken(data.mobileToken);
                        this.$router.push({path: "newphone"});
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                });
            }
        }
    };
</script>
<style lang='scss'>
    .yzPhone {
        padding-top: 20px;

        .el-form {
            margin-top: 30px;
        }

        .el-form-item {
            margin-bottom: 15px;
        }

        .btnItem {
            button {
                margin: 20px 0 0 50px;
            }
        }

        .el-step__title.is-finish {
            color: #7cabb1;
        }

        .emailyz {
            .el-input {
                width: 70%;
                float: left;
            }

            .emailstate {
                margin-left: 5px;
            }
        }

        .gaiphone {
            .el-input {
                width: 72%;
                margin-right: 20px;
            }
        }
    }
</style>
