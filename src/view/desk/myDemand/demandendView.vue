<template>
  <div class="demandendView">
    <div class="Crumbs" v-if="routeType==='progress'">
      <div class="container deskHeader">
        <h4>
          您的需求：
          <router-link to="myDemand">我的需求</router-link>>
          <router-link :to="{path:'teamProgress',query:{projectId:projectId}}">{{navText}}</router-link>>
          <span class="active">团队明细</span>
        </h4>
      </div>
    </div>
    <div class="Crumbs" v-if="routeType!='progress'">
      <div class="container deskHeader">
        <h4>
          您的需求：
          <router-link to="myDemand">我的需求</router-link>>
          <router-link
            :to="{path:(routeType==='sele'?'caseSelect':'demandEnd'),query:{projectId:projectId}}"
          >{{navText}}</router-link>>
          <span class="active">团队明细</span>
        </h4>
      </div>
    </div>
    <div class="container deskHeader">
      <el-card class="box-card0">
        <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm">
          <el-form-item label="团队描述需求：">
            <span>{{ruleForm.projectCognize}}</span>
          </el-form-item>
          <el-form-item label="详细描述：">
            <p class="detail">{{ruleForm.detailedPlanning}}</p>
          </el-form-item>
          <el-form-item label="团队附件：">
            <a :href="ruleForm.accessory" target="_Blank" v-if="ruleForm.accessory">下载附件</a>
            <a target="_Blank" v-if="!ruleForm.accessory">暂无附件</a>
          </el-form-item>
          <el-form-item label="结果附件：">
            <a :href="ruleForm.demandResult" target="_Blank" v-if="ruleForm.demandResult">下载附件</a>
            <a target="_Blank" v-if="!ruleForm.demandResult">暂无附件</a>
          </el-form-item>
          <div
            class="leader_position"
            v-for="(item,index) in ruleForm.competeTeamList"
            :key="index"
          >
            <span v-if="index===0" class="user_logo"></span>
            <div class="userImg" v-if="navText==='团队进度'">
              <router-link
                :to="{path:'endInformation', query:{type:'progress',projectId:projectId,userId:item.userId,teamId:teamId}}"
              >
                <img :src="item.headurl?item.headurl:getnoImg" />
              </router-link>
              <p>
                {{item.name}}
                <!-- <span class="leader" v-if="index===0">（leader）</span> -->
              </p>
            </div>
            <div class="userImg" v-if="navText!='团队进度'">
              <router-link
                :to="{path:'endInformation', query:{type:(navText==='案例选择'?'classic':'endDemand'),projectId:projectId,userId:item.userId,teamId:(ruleForm.teamId?ruleForm.teamId:teamId)}}"
              >
                <img :src="item.headurl?item.headurl:getnoImg" />
              </router-link>
              <p>
                {{item.name}}
                <!-- <span class="leader" v-if="index===0">（leader）</span> -->
              </p>
            </div>
          </div>
        </el-form>
      </el-card>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { httpGet } from "@/utils/http.js";
import { errTips } from "@/utils/tips.js";
export default {
  data() {
    return {
      projectId: "",
      team: "",
      routeType: "",
      navText: "结束需求",
      ruleForm: {
        checkedValue: "是",
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      }
    };
  },
  created: function() {
    if (this.$route.query.teamId) {
      this.teamId = this.$route.query.teamId;
      this.projectId = this.$route.query.projectId;
      this.routeType = this.$route.query.type;
      this.getView();
    } else {
      this.$router.push({ path: "myDemand" });
    }
  },
  computed: {
    ...mapGetters(["getnoImg"])
  },
  methods: {
    //根据路由参数渲染数据
    getView() {
      if (this.$route.query.type === "sele") {
        this.navText = "案例选择";
        httpGet("/v1/authorization/bid/detail/classic", {
          id: this.teamId
        }).then(results => {
          const { httpCode, msg, data } = results.data;
          if (httpCode === 200) {
            this.ruleForm = data;
          } else if (httpCode !== 401) {
            errTips(msg);
          }
        });
      } else {
        if (this.$route.query.type === "progress") {
          this.navText = "团队进度";
        }
        httpGet("/v1/authorization/bid/detail/sendrequirementv", {
          id: this.teamId
        }).then(results => {
          const { httpCode, msg, data } = results.data;
          if (httpCode === 200) {
            this.ruleForm = data;
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
@import "@/assets/scss/demandendView.scss";
</style>