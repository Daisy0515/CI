<template>
    <div class="newPhone">
        <el-steps simple>
            <el-step title="验证手机号码" icon="icon iconfont icon-yanzhengmatianchong"></el-step>
            <el-step title="修改手机号码" icon="el-icon-edit" status="process "></el-step>
            <el-step title="修改成功" icon="el-icon-check"></el-step>
        </el-steps>
        <el-form label-width="100px" :model="ruleForm" ref="ruleForm" :rules="rules">
            <el-form-item label="新的手机号" prop="phone" :error="phoneError">
                <el-input v-model="ruleForm.phone"></el-input>
            </el-form-item>
            <el-form-item label="验证码" class="emailyz" prop="code" :error="codeError">
                <el-input v-model="ruleForm.code"></el-input>
                <codeBtn :phone="ruleForm.phone" :codeType="4" v-on:setPhoneErr="setPhoneErr($event)"/>
            </el-form-item>
            <el-form-item class="btnItem">
                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import {httpPut} from "@/utils/http.js";
    import {mapMutations, mapGetters} from "vuex";
    import codeBtn from "@/common/sendCode/sendPhoneCode";
    import {errTips} from "@/utils/tips.js";
    import regular from "@/mixins/regular/newPhone.js";

    export default {
        mixins: [regular],
        components: {
            codeBtn
        },
        data() {
            return {
                ruleForm: {
                    phone: "",
                    code: "",
                    mobileToken: "",
                    codeType: 4
                }
            };
        },
        created: function () {
            this.ruleForm.mobileToken = sessionStorage.getItem("mobileToken");
        },
        computed: {
            ...mapGetters(["getuserData"])
        },
        methods: {
            ...mapMutations(["setMobiletoken"]),
            setPhoneErr(msg) {
                this.phoneError = msg;
            },
            submitForm(formName) {
                this.phoneError = "";
                this.codeError = "";
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        httpPut("/v1/authorization/coreuser/phone/after", this.ruleForm).then(
                            results => {
                                const {httpCode, msg} = results.data;
                                if (msg === "该号码已存在") {
                                    this.phoneError = "手机号已被注册";
                                } else if (msg === "到期时间不合法") {
                                    this.setMobiletoken("");
                                    alert("旧手机号验证超时请重新验证");
                                    this.$router.push({path: "yzPhone"});
                                } else if (httpCode === 602) {
                                    this.codeError = "验证码错误或者超时";
                                } else if (httpCode === 200) {
                                    this.getuserData.phone = this.ruleForm.phone;
                                    sessionStorage.setItem(
                                        "userData",
                                        JSON.stringify(this.getuserData)
                                    );
                                    this.$router.push({
                                        path: "phoneSuccess",
                                        query: {newphone: this.ruleForm.phone}
                                    });
                                } else if (httpCode !== 401) {
                                    errTips(msg);
                                }
                            }
                        );
                    } else {
                        return false;
                    }
                });
            }
        }
    };
</script>
<style lang='scss'>
    .newPhone {
        .el-input {
            width: 70%;
            float: left;
        }

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
            .emailstate {
                margin-left: 5px;
            }
        }
    }
</style>
