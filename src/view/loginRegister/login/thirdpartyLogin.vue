<template>
    <div class="login height_main">
        <Index-Header></Index-Header>
        <div class="container">
            <el-card class="box-card clearfix">
                <div slot="header" class="clearfix" style="text-align:center">
                    <span>平台账号绑定</span>
                </div>
                <el-form
                        :model="loginForm"
                        status-icon
                        ref="loginForm"
                        class="demo-ruleForm"
                >
                    <el-form-item prop="phone" >
                        <el-input v-model="loginForm.phone" placeholder="请输入手机号码">
                            <i slot="prefix" class="icon iconfont icon-dianhua"></i>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password" >
                        <el-input
                                type="password"
                                placeholder="请输入密码"
                                v-model="loginForm.password"
                                autocomplete="off"
                        >
                            <i slot="prefix" class="icon iconfont icon-ziyuanxhdpi"></i>
                        </el-input>
                    </el-form-item>
                    <el-form-item class="Remember">
                        <!-- <el-checkbox label="记住密码" name="type"></el-checkbox> -->

                        <router-link :to="{name:'personalRegister',query:{microblogId:loginForm.microblogId,type:loginForm.type}}">
                            <span class="Forget">注册</span>
                        </router-link>

                        <span style="float: right;color: #7cabb1;">暂无账号?</span>



                    </el-form-item>

                    <el-form-item class="loginButton">
                        <el-button type="primary" @click="submitForm()">确定</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>

        <div style="clear:both"></div>
        <Footer class="height_footer"></Footer>

    </div>
</template>
<script>
    import IndexHeader from "@/common/header/userHeader";
    import Footer from "@/common/footer/footer";
    import {mapGetters, mapMutations} from "vuex";
    import {httpPost, httpGet} from "@/utils/http.js";
    import "@/assets/js/slider.js";
    import {errTips} from "@/utils/tips.js";
    import regular from "@/mixins/regular/login.js";

    export default {
        components: {
            IndexHeader,
            Footer
        },
        //表单验证
        mixins: [regular],
        data() {
            return {
                loginForm: {
                    microblogId:null,
                    phone: "",
                    password : "",
                    type: null,
                },

            };
        },
        created: function () {
            this.loginForm.microblogId = this.$route.query.microblogId;
            this.loginForm.type = this.$route.query.type;
        },

        methods: {
            submitForm(){
                //与平台账号绑定
                httpPost('/v1/public/thirdparty/binding/update', this.loginForm).then(results => {
                    const {msg, httpCode} = results.data;
                    if (httpCode === 200) {
                        this.$router.push("/login");
                    } else {
                        errTips(msg);
                    }
                });
            }
        }
    };
</script>
<style lang='scss'>

    @import "@/assets/scss/login.scss";

    .ThirdPart {
        /*float: right;*/
        color: #7cabb1;
        /*cursor: pointer;*/
        margin-right: 20px;
        margin-bottom: 20px;
    }

    .logoCSS {
        width: 30px;
        height: 30px;
        margin-right: 30px;
    }

    .ThirdPartyLogin {
        text-align: center;
    }

    .loginButton {
        text-align: center;
    }

</style>
