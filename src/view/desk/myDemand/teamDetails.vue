<template>
  <div class="demandendView">
    <div class="Crumbs">
      <div class="container deskHeader">
        <h4>
          您的位置：
          <router-link to="myDemand">我的需求</router-link>>
          <router-link :to="{path:'teamSelect', query:{projectId:projectId}}">选择团队</router-link>>
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
          <el-form-item label="团队详细描述：">
            <p class="detail">{{ruleForm.detailedPlanning }}</p>
          </el-form-item>
          <el-form-item label="团队附件：">
            <a target="_Blank" :href="ruleForm.accessory" v-if="ruleForm.accessory">下载附件</a>
            <a target="_Blank" href="javascript:void(0)" v-if="!ruleForm.accessory">暂无附件</a>
          </el-form-item>
          <el-form-item class="userBorder">
            <div
              class="leader_position"
              v-for="(item,index) in ruleForm.competeTeamList"
              :key="index"
            >
              <span v-if="index===0" class="user_logo"></span>
              <div class="userImg">
                <router-link
                  :to="{path:'selectInformation', query:{projectId:projectId,userId:item.userId,teamId:teamId}}"
                >
                  <img :src="item.headurl?item.headurl:getnoImg" />
                </router-link>
                <p>
                  {{item.name}}
                  <!-- <span class="leader" v-if="index===0">（leader）</span> -->
                </p>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import { httpGet } from "@/utils/http.js";
import { mapGetters } from "vuex";
import { errTips } from "@/utils/tips.js";
export default {
  data() {
    return {
      projectId: "",
      id: "",
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
    this.projectId = this.$route.query.projectId;
    this.teamId = this.$route.query.teamId;
    if (!this.projectId || !this.teamId) {
      this.$router.push({ path: "myDemand" });
      return false;
    }
    this.getView()
  },
  computed: {
    ...mapGetters(["getnoImg"])
  },
  methods: {
    getView() {
      httpGet("/v1/authorization/bid/select/teamdetailinfo", {
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
};
</script>
<style lang='scss'>
@import "@/assets/scss/demandendView.scss";
</style>
<style lang="scss">
</style>