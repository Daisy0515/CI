<template>
  <div class="sendCode">
    <el-button class="sendYz" @click="sendYz" :disabled="yzIndex?false:true">
      发送验证码
      <span v-show="!yzIndex">({{time}})</span>
    </el-button>
  </div>
</template>
<script>
import { httpPost } from "@/utils/http.js";
import { errTips } from "@/utils/tips.js";
export default {
  props: ["email"],
  data() {
    return {
      time: "59",
      yzIndex: true
    };
  },
  methods: {
    sendYz() {
      this.$emit("setEmailErr", "");
      const emallReg = /^[a-zA-Z0-9_\.-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (!emallReg.test(this.email)) {
        this.$emit("setEmailErr", "邮箱格式不正确");
        return false;
      } else if (this.email === "") {
        this.$emit("setEmailErr", "请输入邮箱");
      } else {
        this.$emit("setEmailErr", "");
        httpPost("/v1/authorization/coreuser/email/send", {
          email: this.email
        }).then(results => {
          const { msg, httpCode } = results.data;
          if (msg === "邮箱已存在") {
            this.$emit("setEmailErr", "邮箱已存在");
          } else if (httpCode === 200) {
            this.yzIndex = false;
            let setTime = setInterval(() => {
              this.time -= 1;
              if (this.time === 0) {
                clearInterval(setTime);
                this.yzIndex = true;
                this.time = 59;
              }
            }, 1000);
          } else if (httpCode !== 401) {
            errTips(msg);
          }
        });
      }
    }
  }
};
</script>
<style lang='scss'>
.sendCode {
  .sendYz {
    float: right;
  }
}
</style>