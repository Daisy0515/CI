<template>
  <div class="personalProfile">
    <div class="Crumbs" v-if="type==='progress'">
      <div class="container deskHeader">
        <h4>
          您的位置：
          <router-link to="myDemand">我的需求</router-link>>
          <router-link :to="{path:'teamProgress', query:{projectId:projectId}}">团队进度</router-link>>
          <router-link
            :to="{path:'demandendView', query:{type:'progress',teamId:teamId,userId:userId,projectId:projectId}}"
          >团队明细</router-link>> 个人资料
        </h4>
      </div>
    </div>
    <div class="Crumbs" v-if="type==='endDemand'">
      <div class="container deskHeader">
        <h4>
          您的位置：
          <router-link to="myDemand">我的需求</router-link>>
          <router-link :to="{path:'demandEnd', query:{projectId:projectId}}">结束需求</router-link>>
          <router-link
            :to="{path:'demandendView', query:{type:'end',teamId:teamId,userId:userId,projectId:projectId}}"
          >团队明细</router-link>> 个人资料
        </h4>
      </div>
    </div>
    <div class="Crumbs" v-if="type==='classic'">
      <div class="container deskHeader">
        <h4>
          您的位置：
          <router-link to="myDemand">我的需求</router-link>>
          <router-link :to="{path:'caseSelect', query:{projectId:projectId}}">案例选择</router-link>>
          <router-link
            :to="{path:'demandendView', query:{type:'sele',projectId:projectId,teamId:teamId}}"
          >团队明细</router-link>> 个人资料
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
              <p>邮箱：{{ruleForm.email?ruleForm.email:"暂无数据"}}</p>
              <p>手机号：{{ruleForm.phone?ruleForm.phone:"暂无数据"}}</p>
              <p>性别：{{ruleForm.sex?ruleForm.sex:"暂无数据"}}</p>
              <p>姓名：{{ruleForm.name?ruleForm.name:'暂无数据'}}</p>
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
          <div
            class="expresice"
            v-if="ruleForm.experienceInfoList !== undefined && ruleForm.experienceInfoList.length ===0"
          >
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
  data() {
    return {
      userImg: "",
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
    this.type = this.$route.query.type;
    this.projectId = this.$route.query.projectId;
    this.teamId = this.$route.query.teamId;
    this.userId = this.$route.query.userId;
    if (!this.type || !this.projectId || !this.teamId || !this.userId) {
      this.$router.push({ path: "myDemand" });
      return false;
    }
    this.getView();
  },
  methods: {
    ...mapMutations(["setCache"]),
    //获取页面数据
    getView() {
      httpGet("/v1/authorization/bid/detail/teaminfo", {
        id: this.teamId,
        userId: this.$route.query.userId
      }).then(results => {
        const { msg, httpCode, data } = results.data;
        if (httpCode === 200) {
          for (let i of data.experienceInfoList) {
            i.workingTime = specificDate(i.workingTime);
            i.resignationTime = specificDate(i.resignationTime);
          }
          if (data.sex === 1) {
            data.sex = "男";
          } else if (data.sex === 2) {
            data.sex = "女";
          } else {
            data.sex = "未知";
          }
          this.ruleForm = data;
        } else if (httpCode === 400) {
          this.setCache("myDemand");
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