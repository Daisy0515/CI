<template>
    <div class="login height_main">
        <Index-Header></Index-Header>
        <div class="container" v-loading="loading">
            <el-card class="box-card clearfix">
                <div slot="header" class="clearfix" style="text-align:center">
                    <span>正在登录</span>
                </div>

            </el-card>
            <el-dialog
                    title="请选择项目角色"
                    :visible.sync="dialogVisible"
                    width="30%"
                    :close-on-click-modal="false"
                    :close-on-press-escape="false"
                    :show-close="false">
                <el-radio v-model="projectRole" :label="1">项目发布方</el-radio>
                <el-radio v-model="projectRole" :label="2">项目经理</el-radio>
                <el-radio v-model="projectRole" :label="3">项目开发者</el-radio>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="submitProjectRole">确 定</el-button>
                </span>
            </el-dialog>
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
                params:{
                    microblogId:null,
                    accessToken:null,
                },
                loading:true,
                yzText: "",
                slideIndex: false,
                phoneError: "",
                passError: "",
                loginForm: {
                    phone: "",
                    password : "",
                    expiresIn: 144000
                },
                clientId: null,
                redirect_uri: "http://127.0.0.1:8080/oauth/redirect",
                userRole: null,       //用户的身份角色，个人：1，公司：2
                projectRole: null,    // 用户在登陆成功后需要选择的项目角色，项目发布者（需求方） 1，项目经理 2，项目开发者 3
                dialogVisible: false, //用户选择项目角色的对话框
            };
        },
        created: function () {
            this.params.microblogId = this.$route.query.microblogId;
            this.params.accessToken = this.$route.query.accessToken;
            httpGet(`/v1/public/thirdparty/userinfo/get`,this.params).then(results => {
                console.log(111);
                const {data, httpCode} = results.data;
                if (httpCode === 200) {
                    this.loginForm.password = data.user.password;
                    this.loginForm.phone = data.user.phone;
                    httpPost("/v1/public/thirdparty/login/post", this.loginForm).then(
                        results => {
                            const {httpCode, data, msg} = results.data;
                            console.log(222);
                            if (httpCode === 200) {
                                let userToken = data.accessToken;
                                this.userRole = data.roleType;
                                sessionStorage.setItem("userToken", JSON.stringify(userToken));
                                this.loading = false;
                                this.dialogVisible = true;//开启用户选择项目角色的弹窗

                            } else {
                                errTips(msg);
                            }
                        }
                    );
                }

            });
        },

        methods: {
            ...mapMutations(["setLogin"]),
            ...mapGetters(["getUrl", "getUser"]),
            submitProjectRole() {
                if (this.projectRole === null) {
                    errTips("请选择用户的项目角色！");
                } else {
                    sessionStorage.setItem("projectRole", this.projectRole);
                    this.setLogin();
                    this.getuserData(this.userRole);
                    this.getReviewPermissionList();
                }
            },

            /**获取用户的评审系统角色*/
            getReviewPermissionList() {
                httpGet('/v1/authorization/review/permission/list').then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode == 200) {
                        sessionStorage.setItem("reviewPermissionList", JSON.stringify(data.permissionList));
                    } else {
                        errTips(msg);
                    }
                });
            },
            //登录成功获取用户信息
            getuserData(role) {
                let userUrl = () => {
                    return role === 1 ? "personage" : "company";
                };
                httpGet(`v1/authorization/coreuser/userinfo/${userUrl()}`).then(
                    results => {
                        const {httpCode, data, msg} = results.data;
                        if (httpCode === 200) {
                            let information = data;
                            information.role = role;
                            sessionStorage.setItem("userData", JSON.stringify(information));
                            this.setLogin();
                            this.$router.push({path: this.getUrl()});
                        } else if (httpCode !== 401) {
                            errTips(msg);
                        }
                    }
                );
            }
        }
    };
</script>
<style lang='scss'>

    @import "@/assets/scss/login.scss";

    .ThirdPart {
        /*float: right;*/
        color: #3e76b8;
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
