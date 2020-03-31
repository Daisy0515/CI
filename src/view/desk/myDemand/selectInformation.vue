<template>
  <div class="personalProfile">
    <div class="Crumbs">
      <div class="container deskHeader">
        <h4>
          您的位置：
          <router-link to="myDemand">我的需求</router-link>>
          <router-link :to="{path:'teamSelect', query:{projectId:projectId}}">选择团队</router-link>>
          <router-link :to="{path:'teamDetails', query:{projectId:projectId,teamId:teamId}}">团队明细</router-link>> 个人资料
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
            <p>邮箱：{{ruleForm.email}}</p>
            <p>手机号：{{ruleForm.phone}}</p>
            <p>性别：{{ruleForm.sex}}</p>
            <p>姓名：{{ruleForm.name}}</p>
          </el-card>
        </div>
      </div>
      <div style="clear:both"></div>
      <div class="editorialTeam_bottom">
        <el-card class="card">
          <h3>个人简介</h3>
          <p v-if="ruleForm.education===1">学历：高中</p>
          <p v-if="ruleForm.education===2">学历：大专</p>
          <p v-if="ruleForm.education===3">学历：本科</p>
          <p v-if="ruleForm.education===4">学历：研究生</p>
          <p v-if="ruleForm.education===5">学历：博士</p>
          <p v-if="ruleForm.education===6">学历：博士后</p>
          <p v-if="ruleForm.education===7">学历：院士</p>
          <p v-if="ruleForm.school">学校：{{ruleForm.school}}</p>
          <div class="expresice" v-for="(item,index) in ruleForm.experienceInfoList" :key="index">
            <h3 class="experience">工作经历</h3>
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
import { mapGetters } from "vuex";
import { errTips } from "@/utils/tips.js";
export default {
  components: {},
  data() {
    return {
      userImg: "",
      projectId: "",
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
    this.projectId = this.$route.query.projectId;
    this.teamId = this.$route.query.teamId;
    this.userId = this.$route.query.userId;
    this.getView();
  },
  methods: {
    //获取页面数据
    getView() {
      httpGet("/v1/authorization/bid/detail/teaminfo", {
        id: this.teamId,
        userId: this.userId
      }).then(results => {
        const { msg, httpCode, data } = results.data;
        if(httpCode===200){
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
        }
        else if (httpCode !== 401) {
          errTips(msg);
        }
      });
    }
  }
};
</script>
<style lang='scss'>
.personalProfile {
  line-height: 30px;
  .editorialTeam_top {
    margin-top: 30px;
  }
  .editorialTeam_left {
    .card {
      width: 520px;
      height: 250px;
    }
    float: left;
    .main_item {
      margin: 30px 0 30px 0;
    }
    .header_ele {
      margin-top: 15px;
    }
    .item {
      border: 1px solid #e8e8e8;
      width: 180px;
      height: 180px;
      float: left;
      margin-right: 30px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .item_title {
      height: 180px;
      width: 180px;
      float: left;
      position: relative;
      & p:nth-child(2) {
        position: absolute;
        bottom: 0;
      }
    }
  }
  .el-input__inner {
    height: 30px;
    width: 300px;
  }
  .el-input {
    width: 300px;
  }
  button {
    line-height: 10px;
    font-size: 13px;
    margin-left: 20px;
  }
  .editorialTeam_right {
    float: right;
    h3 {
      border-bottom: 1px solid #e8e8e8;
      margin: 0 -15px 10px -15px;
      padding: 0 0 10px 10px;
    }
    .card {
      width: 520px;
      height: 250px;
    }
  }
  .editorialTeam_bottom {
    margin: 50px 0 50px 0;
    .card {
      width: 100%;
      h3 {
        border-bottom: 1px solid #e8e8e8;
        margin: 0 -15px 10px -15px;
        padding: 0 0 10px 10px;
      }
      .experience {
        border-top: 1px solid #e8e8e8;
        padding-top: 10px;
        margin-top: 10px;
      }
    }
  }
}
</style>