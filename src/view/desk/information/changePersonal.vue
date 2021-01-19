<template>
    <div class="personal">
        <el-form
                :model="customerForm"
                :rules="rules"
                ref="customerForm"
                label-width="100px"
                class="demo-ruleForm clearfix"
        >
            <h3>个人信息</h3>
            <el-form-item label="用户名" prop="userName">
                <el-input :disabled="true" v-model="customerForm.userName"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="name">
                <el-input v-model="customerForm.name"></el-input>
            </el-form-item>
            <el-form-item label="性别">
                <label v-for="(item,index) in list" :key="index">
                    <input name="Fruit" type="radio" :value="item.index" v-model="customerForm.sex">
                    {{item.value}}
                </label>
            </el-form-item>
            <el-form-item label="手机号" class="gaiphone" prop="phone">
                <el-input :disabled="true" v-model="customerForm.phone"></el-input>
                <router-link to="yzPhone">修改手机号码</router-link>
            </el-form-item>
            <el-form-item label="邮箱" class="emailyz" prop="email" :error="emailError">
                <el-input :disabled="true" v-model="customerForm.email"></el-input>
                <span class="emailstate">{{customerForm.isEmail==1?emailyz="已验证":emailyz="未验证"}}</span>
                <router-link :to="{name:'yzEmail',query:{email:customerForm.email}}">修改验证邮箱号</router-link>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('customerForm')">修改</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import {mapGetters} from "vuex";
    import {httpGet, httpPut} from "@/utils/http.js";
    import {errTips} from "@/utils/tips.js";
    import {Notification} from 'element-ui';

    export default {
        components: {},
        data() {
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
            return {
                emailError: "",
                emailYz: "",
                time: "59",
                list: [
                    {value: "男", index: 1},
                    {value: "女", index: 2},
                    {value: "未知", index: 3}
                ],
                yzIndex: true,
                customerForm: {
                    sex: 1,
                    phone: "",
                    yzState: "",
                    userName: "",
                    name: "",
                    email: "",
                    isEmail: "1"
                },
                rules: {
                    email: [{validator: validateEmail, trigger: "blur", required: true}]
                }
            };
        },
        created: function () {
            this.getController();
        },
        computed: {
            ...mapGetters(["getUser", "getuserData"])
        },
        methods: {
            changeSuccess() {
                Notification({
                    title: "成功",
                    message: "已修改成功！",
                    type: "success",
                    position: "bottom-right",
                    duration: 1300
                });
            },
            //获取个人信息
            getController() {
                httpGet("v1/authorization/coreuser/userinfo/personage").then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 200) {
                        let perData = this.customerForm;
                        Object.assign(perData, data);
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                });
            },
            //修改个人信息
            submitForm(formName) {
                this.emailError = "";
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        httpPut(
                            "/v1/authorization/coreuser/updateinfo/personage",
                            this.customerForm
                        ).then(results => {
                            const getData = results.data;
                            if (getData.msg === "邮箱已被使用") {
                                this.emailError = "邮箱已被使用";
                            } else if (getData.httpCode === 200) {
                                Object.assign(this.getuserData, this.customerForm);
                                sessionStorage.setItem(
                                    "userData",
                                    JSON.stringify(this.getuserData)
                                );
                                this.changeSuccess();
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
    .personal {
        .emailyz {
            .el-input {
                width: 68%;
            }

            .emailstate {
                margin-left: 5px;
                margin-right: 15px;
            }

            .Verification_btn {
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
    }
</style>
