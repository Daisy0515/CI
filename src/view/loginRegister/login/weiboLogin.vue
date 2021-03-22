<template>
    <div>
        <h3>微博第三方登录...</h3>

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
        <el-dialog
                title="请绑定平台账号"
                :visible.sync="bindDialogVisible"
                width="40%"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                :show-close="false">
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
                        <span style="float: right;color: #7cabb1;margin-left: 10px">注册</span>
                    </router-link>

                    <span style="float: right; margin-left: 10px">暂无账号?</span>



                </el-form-item>

                <el-form-item style="text-align: center">
                    <el-button type="primary" @click="submitForm()">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import {httpPost, httpGet} from "@/utils/http.js";
    import {mapGetters, mapMutations} from "vuex";
    import {errTips} from "@/utils/tips.js";
    export default {
        name: "weiboLogin",
        data(){
            return {
                loginForm: {
                    microblogId:null,
                    phone: null,
                    password : null,
                    type: null,
                },
                bindDialogVisible:false,
                weiboAccessToken:null,
                weibomicroblogId:null,
                dialogVisible:false,
                projectRole: null,    // 用户在登陆成功后需要选择的项目角色，项目发布者（需求方） 1，项目经理 2，项目开发者 3
                userRole: null,       //用户的身份角色，个人：1，公司：2
            }
        },
        created: function () {
            this.getCode();
        },
        methods:{
            ...mapMutations(["setLogin"]),//????
            ...mapGetters(["getUrl", "getUser"]),
            submitForm(){
                //与平台账号绑定
                httpPost('/v1/public/thirdparty/binding/update', this.loginForm).then(results => {
                    const {msg, httpCode, data} = results.data;
                    if (httpCode === 200) {
                        let userToken = data.accessToken;
                        this.userRole = data.roleType;
                        sessionStorage.setItem("userToken", JSON.stringify(userToken));
                        this.bindDialogVisible = false;
                        this.dialogVisible = true;//开启用户选择项目角色的弹窗
                    } else {
                        errTips(msg);
                    }
                });
            },
            getCode() {
                let code = this.$route.query.code;
                if(code !== null){
                    console.log(code);
                    httpGet(`/v1/public/thirdparty/weiboBindInfo/get?code=${code}`).then(results => {
                        const {data, httpCode} = results.data;
                        if (httpCode === 200) {
                            if (data.is === true) { //已经绑定
                                let userToken = data.accessToken;
                                this.userRole = data.roleType;
                                sessionStorage.setItem("userToken", JSON.stringify(userToken));
                                this.dialogVisible = true;//开启用户选择项目角色的弹窗
                            } else { //还未绑定平台账号
                                this.loginForm.microblogId = data.microblogId;
                                this.loginForm.type = 1;
                                this.bindDialogVisible = true;

                            }



                        }
                    });
                }
            },
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
            //登录成功获取用户信息???
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
            },
            /**获取用户的评审系统角色??????*/
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
        }
    }
</script>

<style scoped>

</style>
