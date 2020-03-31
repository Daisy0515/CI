<template>
  <div class="applicationView">
    <div class="Crumbs">
      <div class="container deskHeader">
        <h4>
          您的位置：
          <router-link to="myDemand">我的需求</router-link>>
          <span class="active">查看</span>
        </h4>
      </div>
    </div>
    <div class="container deskHeader">
      <el-card class="box-card0">
        <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm">
          <el-form-item label="项目名称：">
            <span>{{ruleForm.name}}</span>
          </el-form-item>
          <el-form-item label="项目类型:">
            <span>{{parentValue}}</span>
          </el-form-item>
          <el-form-item label="项目子类型:">
            <span>{{typeValue}}</span>
          </el-form-item>
          <el-form-item label="一句话描述需求：">
            <span>{{ruleForm.requirement}}</span>
          </el-form-item>
          <el-form-item label="详细描述：">
            <p class="detail">{{ruleForm.detail}}</p>
          </el-form-item>
          <el-form-item label="附件：">
            <a :href="ruleForm.accessory" target="_Blank" v-if="ruleForm.accessory">下载附件</a>
            <a target="_Blank" v-if="!ruleForm.accessory">暂无附件</a>
          </el-form-item>
          <el-form-item label="发布时间：">
            <span>{{ruleForm.gmtCreate}}</span>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>
<script>
import { httpGet } from "@/utils/http.js";
import { specificDate } from "@/utils/getDate.js";
import { errTips } from "@/utils/tips.js";
import { mapMutations, mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      id: "",
      list: [{ value: "是" }, { value: "否" }],
      parentValue: "",
      typeValue: "",
      ruleForm: {}
    };
  },
  created: function() {
    if (!this.$route.query.id) {
      this.$router.push({ path: "myDemand" });
      return false;
    }
    this.id = this.$route.query.id;
    this.GETALLTYPE();
    //获取项目类型
  },
  watch: {
    //监听获取项目类型完成后渲染数据
    getAllType() {
      httpGet(`/v1/authorization/bid/single/get?projectId=${this.id}`).then(
        results => {
          const { httpCode } = results.data;
          if (httpCode === 200) {
            let newData = results.data.data;
            for (let ele of this.getAllType) {
              if (ele.id == newData.parentId) {
                this.$set(this, "parentValue", ele.type);
              } else if (ele.id == newData.typeId) {
                this.$set(this, "typeValue", ele.type);
              }
            }
            newData.gmtCreate = specificDate(newData.gmtCreate);
            this.ruleForm = newData;
          } else if (httpCode === 400) {
            errTips("页面丟失");
            this.setCache("myDemand");
          }
        }
      );
    }
  },
  computed: {
    ...mapGetters(["getAllType"])
  },
  methods: {
    ...mapMutations(["setCache"]),
    ...mapActions(["GETALLTYPE"])
  }
};
</script>
<style lang='scss'>
@import "@/assets/scss/applicationView.scss";
</style>