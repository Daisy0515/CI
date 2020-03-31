<template>
  <el-form
    :model="ruleForm"
    :rules="rulesReg"
    ref="ruleForm"
    label-width="100px"
    class="demo-ruleForm3"
  >
    <h3>修改密码</h3>
    <el-form-item label="老密码" prop="formerPassword" :error="passwordError">
      <el-input v-model="ruleForm.formerPassword" type="password" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="新密码" prop="password">
      <el-input v-model="ruleForm.password" type="password" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="确认密码" prop="checkPassword">
      <el-input v-model="ruleForm.checkPassword" type="password" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">修改</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { httpPut } from "@/utils/http.js";
import { mapMutations, mapActions } from "vuex";
import { errTips, successTips } from "@/utils/tips.js";
export default {
  components: {},
  data() {
    const passReg = /^[0-9a-zA-Z_]{4,32}$/;
    const validateOldpass = (rule, value, callback) => {
      if (!passReg.test(value)) {
        callback(new Error("数字字母下划线，长度为4-32位"));
      } else {
        callback();
      }
    };
    const validatePass = (rule, value, callback) => {
      if (!passReg.test(value)) {
        callback(new Error("数字字母下划线，长度为4-32位"));
      } else {
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (!passReg.test(value)) {
        callback(new Error("数字字母下划线，长度为4-32位"));
      } else if (value !== this.ruleForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      passwordError: "",
      ruleForm: {
        formerPassword: "",
        checkPassword: "",
        password: ""
      },
      rulesReg: {
        formerPassword: [
          { validator: validateOldpass, trigger: "blur", required: true }
        ],
        password: [
          { validator: validatePass, trigger: "blur", required: true }
        ],
        checkPassword: [
          { validator: validatePass2, trigger: "blur", required: true }
        ]
      }
    };
  },
  mounted: function() {},
  methods: {
    ...mapMutations(["setLogout"]),
    ...mapActions(["SETLOGOUT"]),
    submitForm(formName) {
      this.passwordError = "";
      this.$refs[formName].validate(valid => {
        if (valid) {
          httpPut(
            "/v1/authorization/coreuser/updatepassword",
            this.ruleForm
          ).then(results => {
            const { httpCode, msg } = results.data;
            if (msg == "信息有误,修改失败") {
              this.passwordError = "密码错误";
            } else if (httpCode === 200) {
              this.SETLOGOUT("login");
              successTips("修改成功，请重新登录");
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
</style>