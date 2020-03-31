<template>
  <div class="phoneSuccess">
    <el-steps simple>
      <el-step title="验证手机号码" icon="icon iconfont icon-yanzhengmatianchong"></el-step>
      <el-step title="修改手机号码" icon="el-icon-edit"></el-step>
      <el-step title="修改成功" icon="el-icon-check" status="process"></el-step>
    </el-steps>
    <div class="success_text">
      <p>
        <i class="el-icon-check"></i>
        恭喜你验证邮箱号码：{{email}} 成功！
      </p>
      <router-link to="changePersonal">
        <el-button type="primary">查看个人信息</el-button>
      </router-link>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      email: ""
    };
  },
  created: function() {
    if (!this.$route.params.emailIndex) {
      this.$router.push({
        path: "yzEmail"
      });
    } else {
      this.$set(this, "email", this.$route.params.newEmail);
    }
  },
  methods: {}
};
</script>
<style lang='scss'>
.phoneSuccess {
  .el-icon-check {
    font-size: 22px;
    color: #3e76b8;
    margin-right: 10px;
  }
  .success_text {
    margin: 50px 0 0 50px;
    button {
      margin-top: 30px;
    }
  }
}
</style>