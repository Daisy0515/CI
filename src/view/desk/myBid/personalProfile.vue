<template>
  <div class="personalProfile">
    <div class="Crumbs">
      <div class="container deskHeader">
        <h4>
          您的位置：
          <router-link to="myBid">我的投标</router-link>>
          <router-link :to="{path:'editorialTeam', query:{userId:userId,projectId:projectId}}">编辑团队</router-link>> 个人资料
        </h4>
      </div>
    </div>
    <div class="container deskHeader">
      <div class="editorialTeam_top clearFix">
        <div class="editorialTeam_left clearFix">
          <el-card class="card">
            <div class="item clearfix">
              <img :src="ruleForm.headurl?ruleForm.headurl:getnoImg" />
            </div>
            <div class="item_title">
              <p>用户名：{{ruleForm.userName}}</p>
            </div>
          </el-card>
        </div>
        <div class="editorialTeam_right clearFix">
          <el-card class="card">
            <h3>个人资料</h3>
            <div class="card_main">
              <p>邮箱：{{ruleForm.email}}</p>
              <p>手机号：{{ruleForm.phone}}</p>
              <p>性别：{{ruleForm.sex}}</p>
              <p>姓名：{{ruleForm.name?ruleForm.name:"暂无信息"}}</p>
            </div>
          </el-card>
        </div>
      </div>
      <div style="clear:both"></div>
      <div class="editorialTeam_bottom">
        <el-card class="card">
          <div class="personal">
            <h3>个人简介</h3>
            <div class="personal_txt">
              <p v-if="!ruleForm.education">学历：暂无数据</p>
              <p v-if="ruleForm.education===1">学历：高中</p>
              <p v-if="ruleForm.education===2">学历：大专</p>
              <p v-if="ruleForm.education===3">学历：本科</p>
              <p v-if="ruleForm.education===4">学历：研究生</p>
              <p v-if="ruleForm.education===5">学历：博士</p>
              <p v-if="ruleForm.education===6">学历：博士后</p>
              <p v-if="ruleForm.education===7">学历：院士</p>
              <p v-if="ruleForm.school">学校：{{ruleForm.school}}</p>
            </div>
          </div>
          <h3 class="experience">工作经历</h3>
          <div class="expresice" v-if="ruleForm.experienceInfoList !== undefined && ruleForm.experienceInfoList.length ===0">
          <p>暂无数据</p>
          </div>
          <div class="expresice" v-for="(item,index) in ruleForm.experienceInfoList" :key="index">
            <p>公司名称：{{item.companyName}}</p>
            <p>在职时间：{{item.workingTime?item.workingTime:'暂无数据'}}</p>
            <p>离职时间：{{item.resignationTime?item.resignationTime:'暂无数据'}}</p>
            <p>职位：{{item.position?item.position:'暂无数据'}}</p>
            <p>描述：{{item.jobDescription?item.jobDescription:'暂无数据'}}</p>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>
<script>
import { httpGet } from "@/utils/http.js";
import { specificDate } from "@/utils/getDate.js";
import { mapGetters, mapMutations } from "vuex";
import { errTips } from "@/utils/tips.js";
export default {
  components: {},
  data() {
    return {
      id: "",
      teamId: "",
      userId: "",
      selestate: [],
      ruleForm: []
    };
  },
  computed: {
    ...mapGetters(["getnoImg"])
  },
  created: function() {
    this.id = this.$route.query.id;
    this.projectId = this.$route.query.projectId;
    this.userId = this.$route.query.userId;
    this.getView();
  },
  methods: {
    ...mapMutations(["setCache"]),
    //获取团队数据
    getView() {
      httpGet("/v1/authorization/bids/getuserinfo/user", {
        id: this.id,
        userId: this.userId
      }).then(results => {
        const { httpCode, msg, data } = results.data;
        if (httpCode === 200) {
          for (let i of data.experienceInfoList) {
            i.workingTime = specificDate(i.workingTime);
            i.resignationTime = specificDate(i.resignationTime);
          }
          this.ruleForm = data;
          if (this.ruleForm.sex === 1) {
            this.ruleForm.sex = "男";
          } else if (this.ruleForm.sex === 2) {
            this.ruleForm.sex = "女";
          } else {
            this.ruleForm.sex = "未知";
          }
        } else if (httpCode !== 401) {
          errTips(msg);
        }
      });
    }
  }
};
</script>
<style lang='scss'>
@import "@/assets/scss/personalProfile.scss";
</style>