<template>
  <div class="forget">
    <Index-Header></Index-Header>
    <div class="container">
      <el-card class="box-card">
        <div slot="header" class="clearfix" style="text-align:center">
          <span>找回密码</span>
        </div>
        <el-form
          :model="forgetForm"
          status-icon
          :rules="rules"
          ref="forgetForm"
          class="demo-ruleForm"
        >
          <el-form-item prop="phone" :error="phoneError">
            <el-input v-model="forgetForm.phone" placeholder="请输入手机号码">
              <i slot="prefix" class="icon iconfont icon-dianhua"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="code" :error="codeError">
            <el-input class="Verification" v-model="forgetForm.code" placeholder="请输入验证码">
              <i slot="prefix" class="icon iconfont icon-yanzhengmatianchong"></i>
            </el-input>
            <codeBtn
              :phone="forgetForm.phone"
              :codeType="2"
              v-on:setPhoneErr="setPhoneErr($event)"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              placeholder="请输入新密码"
              v-model="forgetForm.password"
              autocomplete="off"
            >
              <i slot="prefix" class="icon iconfont icon-ziyuanxhdpi"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="checkPass">
            <el-input
              type="password"
              placeholder="请再次输入密码"
              v-model="forgetForm.checkPass"
              autocomplete="off"
            >
              <i slot="prefix" class="icon iconfont icon-ziyuanxhdpi"></i>
            </el-input>
          </el-form-item>
          <el-form-item class="login_get">
            <el-button type="primary" @click="submitForm('forgetForm')">提交</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    <Footer />
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import IndexHeader from "@/common/header/userHeader";
import Footer from "@/common/footer/footer";
import { httpPost } from "@/utils/http.js";
import codeBtn from "@/common/sendCode/sendPhoneCode";
import regular from "@/mixins/regular/forget.js";
import { errTips } from "@/utils/tips.js";
export default {
  components: {
    IndexHeader,
    Footer,
    codeBtn
  },
  //表单验证
  mixins: [regular],
  data() {
    return {
      forgetForm: {
        phone: "",
        password: "",
        checkPass: "",
        code: ""
      }
    };
  },
  methods: {
    ...mapMutations(["login"]),
    ...mapGetters(["getUrl"]),
    setPhoneErr(msg) {
      this.phoneError = msg;
    },
    submitForm(formName) {
      this.phoneError = "";
      this.codeError = "";
      this.$refs[formName].validate(valid => {
        if (valid) {
          httpPost("/v1/public/coreuser/forget/password", this.forgetForm).then(
            results => {
              const { httpCode, msg } = results.data;
              if (httpCode === 200) {
                this.$router.push({name:'passSuccess',params:{isSuccess:1}});
              } else if (msg === "手机号尚未注册") {
                this.phoneError = "手机号尚未注册";
              } else if (msg === "验证码有误") {
                this.codeError = "验证码有误或已超时";
              } else if (httpCode !== 401 && httpCode !== 500) {
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
.forget {
  .container {
    .Verification {
      width: 62%;
      float: left;
    }
    .Verification {
      width: 60%;
      float: left;
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
      margin-top: 15px;
    }
    .login_get {
      width: 45%;
      margin: 0 auto;
      .el-button--primary {
        width: 100%;
        background: #4c83c3;
      }
    }
    .box-card {
      width: 50%;
      margin: 7% auto;
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