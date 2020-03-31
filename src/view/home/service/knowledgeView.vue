<template>
  <div class="knowledgeView">
    <div class="hasBg">
      <div class="container">
        <div class="module_headerCrumb">
          <div class="searchTitle">
            <p class="searchTitle">
              <router-link to="knowledgePlaza">知识广场</router-link>>
              查看
            </p>
          </div>
          <span class="resultCount"></span>
        </div>
      </div>
    </div>
    <div class="container back">
      <div class="box-knowledgeView clearfix">
        <h1 style="margin-bottom:20px">{{viewData.title}}</h1>
        <div class="knowledgeView_title">
          <span>时间：{{viewData.gmtCreate}}</span>
          <span>来源：{{viewData.source}}</span>
          <span>
            <i class="icon iconfont icon-yonghu1"></i>
            作者：{{viewData.author }}
          </span>
          <span>类型：{{viewData.type===1?'论文':'专利'}}</span>
        </div>
        <div style="width:100%;" v-html="viewData.content"></div>
        <div class="knowledgeView_bottom">
          <a :href="viewData.sourceFile" target="_blank">
            <i class="el-icon-download"></i>点击下载资源
          </a>
          <div style="clear:both"></div>
          <div class="clearfix">
            <span @click="update(viewData.upId)">上一篇：{{viewData.upTitle}}</span>
            <span @click="update(viewData.downId)">下一篇：{{viewData.downTitle}}</span>
          </div>
          <!-- <div style="clear:both"></div> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { httpGet } from "@/utils/http.js";
import { specificDate } from "@/utils/getDate.js";
import { errTips, message } from "@/utils/tips.js";
export default {
  data() {
    return {
      viewData: {}
    };
  },
  watch: {
    $route() {
      if (this.$route.query.id) {
        this.getView();
      }
    }
  },
  created: function() {
    if (!this.$route.query.id) {
      this.$router.push({ name: "knowledgePlaza" });
      return false;
    }
    this.getView();
  },
  methods: {
    getView() {
      httpGet("/v1/public/share/get/knowledge", {
        id: this.$route.query.id
      }).then(results => {
        const { httpCode, msg, data } = results.data;
        if (httpCode === 200) {
          data.gmtCreate = specificDate(data.gmtCreate);
          this.viewData = data;
        } else if (httpCode !== 401) {
          errTips(msg);
        }
      });
    },
    update(id) {
      if (!id) {
        message("没有更多了");
        return false;
      }
      this.$router.push({ path: "knowledgeView", query: { id: id } });
    }
  }
};
</script>
<style lang='scss'>
.knowledgeView {
  background: #f3f3f3;
  padding-bottom: 20px;
  .back {
    background: white;
    margin-top: 20px;
  }
  .box-knowledgeView {
    box-sizing: border-box;
    padding: 20px;
    width: 100%;
    letter-spacing: 1px;
    text-align: center;
    h1 {
      text-align: center;
    }
    p {
      margin-top: 20px;
      text-align: left;
      color: rgba(85, 85, 85, 1);
      font-size: 16px;
      line-height: 28px;
    }
    .knowledgeView_title {
      border-bottom: 1px solid #f8f8f8;
      padding-bottom: 15px;
      span {
        width: 25%;
        color: rgba(85, 85, 85, 1);
        display: inline-block;
      }
    }
    .clearfix {
      border-top: 1px solid #f8f8f8;
      padding-top: 10px;
    }
    .knowledgeView_bottom {
      margin-top: 5%;
      margin-bottom: 10px;
      a {
        float: right;
        margin-bottom: 10px;
      }
      span {
        &:hover {
          color: #4c83c3;
          cursor: pointer;
        }
      }
      & span:nth-child(1) {
        float: left;
      }
      & span:nth-child(2) {
        float: right;
      }
    }
  }
}
</style>