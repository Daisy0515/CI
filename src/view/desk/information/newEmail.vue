<template>
  <div class="newEmail">
    <el-steps simple>
      <el-step title="验证身份" icon="icon iconfont icon-yanzhengmatianchong"></el-step>
      <el-step title="绑定邮箱" icon="el-icon-edit" status="process "></el-step>
      <el-step title="绑定成功" icon="el-icon-check"></el-step>
    </el-steps>
    <el-form label-width="100px" :model="ruleForm" ref="ruleForm" :rules="rules">
      <el-form-item label="验证邮箱号" prop="email" :error="emailError">
        <el-input v-model="ruleForm.email"></el-input>
      </el-form-item>
      <el-form-item label="验证码" class="emailyz" prop="code" :error="yzmError">
        <el-input v-model="ruleForm.secretKey"></el-input>
        <codeBtn :email="ruleForm.email" v-on:setEmailErr="setEmailErr($event)"/>
      </el-form-item>
      <el-form-item class="btnItem">
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { httpPut } from "@/utils/http.js";
import { errTips } from "@/utils/tips.js";
import codeBtn from "@/common/sendCode/sendEmailCode";
export default {
  components: {
    codeBtn
  },
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
      yzmError: "",
      emailError: "",
      phoneError: "",
      ruleForm: {
        email: "",
        secretKey: "",
        mobileToken: "",
        codeType: 4
      },
      rules: {
        email: [{ validator: validateEmail, trigger: "blur", required: true }]
      }
    };
  },
  created: function() {
    this.$set(this.ruleForm, "email", this.$route.params.email);
    if (!this.$route.params.yzSuccess) {
      this.$router.push({ path: "yzEmail" });
    }
  },
  methods: {
    setEmailErr(msg) {
      this.emailError = msg;
    },
    submitForm(formName) {
      this.phoneError = "";
      this.yzmError = "";
      this.$refs[formName].validate(valid => {
        if (valid) {
          httpPut("/v1/authorization/coreuser/email/update", this.ruleForm).then(
            results => {
              const { httpCode, msg } = results.data;
              if (msg == "该号码已存在") {
                this.phoneError = "手机号已被注册";
              } else if (httpCode === 602) {
                this.yzmError = "验证码有误";
              } else if (httpCode === 200) {
                this.$router.push({
                  name: "yzEmailSuccess",
                  params: { newEmail: this.ruleForm.email, emailIndex: true }
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
.newEmail {
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
    color: #4c83c3;
  }
  .emailyz {
    .emailstate {
      margin-left: 5px;
    }
    .Verification_btn {
      border: 1px solid #c8c8c8;
      padding: 0px 30px 0px 30px;
      float: right;
      cursor: pointer;
      &:hover {
        background: #f8f8f8;
      }
    }
    .banBtn {
      pointer-events: none;
      background: #fbfbfb;
    }
    .sendYz {
      float: right;
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