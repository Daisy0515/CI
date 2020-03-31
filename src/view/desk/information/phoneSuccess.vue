<template>
  <div class="phoneSuccess">
    <el-steps simple>
      <el-step title="验证手机号码" icon="icon iconfont icon-yanzhengmatianchong"></el-step>
      <el-step title="修改手机号码" icon="el-icon-edit"></el-step>
      <el-step title="修改成功" icon="el-icon-check" status="process"></el-step>
    </el-steps>
    <div class="success_text">
      <p>恭喜你修改手机号码：{{phone}} 成功！</p>
      <router-link to="changePersonal">
      <el-button type="primary">查看个人信息</el-button>
      </router-link>
    </div>
  </div>
</template>
<script>
import { mapMutations } from "vuex";
export default {
  components: {},
  data() {
    return {
      phone: ""
    };
  },
  created:function(){
    this.phone=this.$route.query.newphone
    this.setMobiletoken("");
  },
  methods: {
    ...mapMutations(["setMobiletoken"]),
  }
};
</script>
<style lang='scss'>
.phoneSuccess{
.success_text{
  margin: 50px 0 0 50px;
  button{
    margin-top: 30px;
  }
}
}

</style>