<template>
  <div class="applicationAccession">
      <div class="module_secondaryHead guruSearch hasBg">
        <div class="container">
          <div class="module_headerCrumb">
            <div class="refinery">
              <div class="h1 searchTitle">
                <p class="searchTitle">
                  <router-link to="memberProcess">招标投标</router-link>>
                  <router-link to="teamSquare">团队广场</router-link>> 申请加入
                </p>
              </div>
            </div>
            <span class="resultCount"></span>
          </div>
        </div>
      </div>
    <div class="container">
      <el-card class="box-card0">
        <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm">
          <el-form-item label="项目名称：">
            <span>{{ruleForm.requirementv.name}}</span>
          </el-form-item>
          <el-form-item label="项目类型:">
            <span>{{parentValue}}</span>
          </el-form-item>
          <el-form-item label="项目子类型:">
            <span>{{typeValue}}</span>
          </el-form-item>
          <el-form-item label="一句话描述需求：">
            <span>{{ruleForm.requirementv.requirement}}</span>
          </el-form-item>
          <el-form-item label="详细描述：">
            <p class="detail">{{ruleForm.requirementv.detail}}</p>
          </el-form-item>
          <el-form-item label="附件：">
            <a
              target="_Blank"
              :href="ruleForm.requirementv.accessory"
              v-if="ruleForm.requirementv.accessory&&getUser"
            >下载附件</a>
            <a v-if="!ruleForm.requirementv.accessory&&getUser" target="_Blank">暂无附件</a>
            <a href="javascript:void(0)" v-if="!getUser">登录才能下载附件</a>
          </el-form-item>
          <el-form-item label="发布时间：">
            <span>{{ruleForm.requirementv.gmtCreate}}</span>
          </el-form-item>
          <el-form-item class="borderTop" label="团队描述需求：">
            <span>{{ruleForm.projectCognize}}</span>
          </el-form-item>
          <el-form-item label="团队详细描述：">
            <p class="detail">{{ruleForm.detailedPlanning}}</p>
          </el-form-item>
          <el-form-item label="团队附件：">
            <a target="_Blank" :href="ruleForm.accessory" v-if="ruleForm.accessory&&getUser">下载附件</a>
            <a v-if="!ruleForm.accessory&&getUser" target="_Blank">暂无附件</a>
            <a v-if="!getUser" href="javascript:void(0)">登录才能下载附件</a>
          </el-form-item>
          <el-form-item label="竞标团队：" class="borderTop">
            <p v-if="ruleForm.competeTeamList.length===0">暂无团队</p>
            <div class="userItem" v-for="(item,index) in ruleForm.competeTeamList" :key="index">
                <img :src="item.headurl" v-if="item.headurl" />
                <img :src="getnoImg" v-if="!item.headurl" />
              <p>{{item.name?item.name:"暂无昵称"}}</p>
            </div>
          </el-form-item>
          <el-form-item class="publish">
            <el-button type="primary" @click="submitForm('ruleForm')" size="medium">加入团队</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import { httpGet, httpPost } from "@/utils/http.js";
import { specificDate } from "@/utils/getDate.js";
import { mapGetters, mapActions } from "vuex";
import { errTips } from "@/utils/tips.js";
export default {
  data() {
    return {
      id: "",
      parentValue: "",
      typeValue: "",
      ruleForm: {
        requirementv: {},
        competeTeamList: []
      }
    };
  },
  computed: {
    ...mapGetters(["getnoImg", "getUser", "getAllType"])
  },
  created: function() {
    //获取项目类型
    this.GETALLTYPE();
  },
  watch: {
     //监听获取项目类型数据完成后渲染页面
    getAllType() {
      httpGet("/v1/public/bid/selete/applyforinfo", {
        id: this.$route.query.id
      }).then(results => {
        const { httpCode, msg, data } = results.data;
        if (httpCode === 200) {
          for (let ele of this.getAllType) {
            if (ele.id == data.requirementv.parentId) {
              this.$set(this, "parentValue", ele.type);
            }
            if (ele.id == data.requirementv.typeId) {
              this.$set(this, "typeValue", ele.type);
            }
          }
          data.requirementv.gmtCreate = specificDate(data.requirementv.gmtCreate);
          this.ruleForm = data;
        } else if (httpCode === 400) {
          this.$router.push({ path: "teamSquare" });
        } else if (httpCode !== 401) {
          errTips(msg);
        }
      });
    }
  },
  methods: {
    ...mapActions(["GETALLTYPE"]),
    //提交表单
    submitForm() {
      httpPost("/v1/authorization/bid/teamapplyfor/insert", {
        id: this.$route.query.id
      }).then(results => {
        const { httpCode, msg } = results.data;
        if (httpCode === 200) {
          this.$router.push({ path: "desk/teamApplication" });
        } else if (msg === "accessToken is required") {
          errTips("未登录不能加入团队");
        } else if (httpCode !== 401) {
          errTips(msg);
        }
      });
    }
  }
};
</script>
<style lang='scss'>
@import "@/assets/scss/applicationAccession.scss";
</style>