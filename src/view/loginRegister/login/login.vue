<template>
  <div class="login height_main">
    <Index-Header></Index-Header>
    <div class="container">
      <el-card class="box-card clearfix">
        <div slot="header" class="clearfix" style="text-align:center">
          <span>登录</span>
        </div>
        <el-form
          :model="loginForm"
          status-icon
          :rules="rules"
          ref="loginForm"
          class="demo-ruleForm"
        >
          <el-form-item prop="phone" :error="phoneError">
            <el-input v-model="loginForm.phone" placeholder="请输入手机号码">
              <i slot="prefix" class="icon iconfont icon-dianhua"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="password" :error="passError">
            <el-input
              type="password"
              placeholder="请输入密码"
              v-model="loginForm.password"
              autocomplete="off"
            >
              <i slot="prefix" class="icon iconfont icon-ziyuanxhdpi"></i>
            </el-input>
          </el-form-item>
          <div class="container_new">
            <div id="slideBar"></div>
            <div id="captcha"></div>
            <div id="msg">
              <p :class="yzText=='验证成功'?'yzTextSuccess':'yzText'">{{yzText}}</p>
            </div>
          </div>
          <el-form-item class="Remember">
            <!-- <el-checkbox label="记住密码" name="type"></el-checkbox> -->

            <router-link to="selectRole">
              <span class="Forget">注册</span>
            </router-link>
            <router-link to="forget">
              <span class="Forget">忘记密码?</span>
            </router-link>



          </el-form-item>

          <el-form-item class="ThirdPartyLogin">
<!--            <span class="ThirdPart">其他登录方式</span>-->
            <a :href="'https://api.weibo.com/oauth2/authorize?client_id=' + clientId + '&response_type=code&redirect_uri=' + redirect_uri">
              <img :src="weibologo" class="logoCSS">
            </a>
            <img :src="weixinlogo" class="logoCSS">
            <img :src="QQlogo" class="logoCSS">
          </el-form-item>
          <el-form-item class="loginButton">
            <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
          </el-form-item>
<!--          <el-form-item class="register_get">-->
<!--            <el-button type="primary" @click="goRegister">注册</el-button>-->
<!--          </el-form-item>-->
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
import { mapGetters, mapMutations } from "vuex";
import { httpPost, httpGet } from "@/utils/http.js";
import "@/assets/js/slider.js";
import { errTips } from "@/utils/tips.js";
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
      weibologo: require("@/assets/img/weibo.png"),
      weixinlogo: require("@/assets/img/weixin.png"),
      QQlogo: require("@/assets/img/QQ.png"),
      yzText: "",
      slideIndex: false,
      phoneError: "",
      passError: "",
      loginForm: {
        phone: "",
        pass: "",
        expiresIn: 144000
      },
      clientId:null,
      redirect_uri:"http://127.0.0.1:8080/oauth/redirect"
    };
  },
  created: function() {

    //get
    if (sessionStorage.getItem("userToken")) {
      this.$router.push("/");
      return false;
    }
    this.getClientIdAndUrl();
  },
  mounted: function() {
    const dataList = ["0", "1"];
    let _this = this;
    const options = {
      dataList: dataList,
      //滑块验证成功回调
      success: function() {
        _this.slideIndex = true;
        _this.yzText = "";
        _this.submitForm("loginForm");
      },
      //滑块验证失败回调
      fail: function() {
        _this.slideIndex = false;
      }
    };
    SliderBar("slideBar", options);
  },
  methods: {
    goRegister() {
      this.$router.push("/selectRole");
    },
    ...mapMutations(["setLogin"]),
    ...mapGetters(["getUrl", "getUser"]),

    getClientIdAndUrl(){
      httpGet(`/v1/public/thirdparty/clientid/get`).then(results => {
        const { data, httpCode } = results.data;
        if (httpCode === 200) {
          this.clientId = data.clientId;
          console.log(this.clientId);
        }
      });

    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        this.phoneError = "";
        this.passError = "";
        if (valid) {
          if (!this.slideIndex) {
            this.yzText = "请先完成验证";
            return false;
          }
          httpPost("/v1/public/coreuser/login", this.loginForm).then(
            results => {
              const { httpCode, data, msg } = results.data;
              if (msg === "手机号尚未注册") {
                this.phoneError = "手机号尚未注册";
                this.slideIndex = false;
              } else if (msg === "信息有误,登录失败") {
                this.passError = "密码错误";
                this.slideIndex = false;
              } else if (httpCode === 200) {
                let userToken = data.accessToken;
                let userRole = data.roleType;
                sessionStorage.setItem("userToken", JSON.stringify(userToken));
                this.setLogin();
                this.getuserData(userRole);
                this.getReviewPermissionList();
              } else if (httpCode !== 401) {
                errTips(msg);
              }
            }
          );
        } else {
          return false;
        }
      });
    },

    getReviewPermissionList(){
      httpGet('/v1/authorization/review/permission/list').then(results=>{
        const {httpCode, msg, data} = results.data;
        if (httpCode == 200){
           sessionStorage.setItem("reviewPermissionList",JSON.stringify(data.permissionList)) ;
        } else {
          errTips(msg);
        }
      });
    },
    //登录成功获取用户信息
    getuserData(role) {
      let userUrl = () => {
        return role == 1 ? "personage" : "company";
      };
      httpGet(`v1/authorization/coreuser/userinfo/${userUrl()}`).then(
        results => {
          const { httpCode, data, msg } = results.data;
          if (httpCode === 200) {
            let information = data;
            information.role = role;
            sessionStorage.setItem("userData", JSON.stringify(information));
            this.setLogin();
            this.$router.push({ path: this.getUrl() });
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
  .ThirdPart{
    /*float: right;*/
    color: #3e76b8;
    /*cursor: pointer;*/
    margin-right: 20px;
    margin-bottom: 20px;
  }
  .logoCSS{
    width: 30px;
    height: 30px;
    margin-right: 30px;
  }
  .ThirdPartyLogin{
    text-align: center;
  }
  .loginButton{
    text-align: center;
  }
</style>
