<template>
  <div class="myTable">
    <div class="header">
      <div class="container deskHeader">
        <h4>
          您的位置：
          <router-link to="issueManage">缺陷跟踪</router-link>>
          <span class="active">查看历史</span>
        </h4>
      </div>
    </div>
    <div class="container deskHeader">
      <el-table
        
        :data="ruleForm"
        style="width: 100%;margin-top:30px"
        msgStatus
        :header-cell-style="rowClass"
      >
        <el-table-column prop="content" :label=title align="left">
          <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            :content="scope.row.userName"
            placement="top-start"
          >
            <span class="tablehidden">{{scope.row.userName}}</span>
          </el-tooltip>
          &nbsp;
          <el-tooltip
            class="item"
            effect="dark"
            :content="scope.row.content"
            placement="top-start"
          >
            <span class="tablehidden">{{scope.row.content}}</span>
          </el-tooltip>
          &nbsp;
          <el-tooltip
            class="item"
            effect="dark"
            :content="scope.row.status"
            placement="top-start"
          >
          <span class="tablehidden" v-if="scope.row.status===1" style="color:red">待解决</span>
            <span class="tablehidden" v-if="scope.row.status===2"  style="color:red">解决中</span>
            <span class="tablehidden" v-if="scope.row.status===3"  style="color:red">已解决</span>
            <span class="tablehidden" v-if="scope.row.status===4"  style="color:red">结束</span>
          </el-tooltip>
          &nbsp;
          <el-tooltip
            class="item"
            effect="dark"
            :content="scope.row.gmtCreate"
            placement="top-start"
          >
            <span class="tablehidden">{{scope.row.gmtCreate}}</span>
          </el-tooltip>
        </template>
        </el-table-column>        
      </el-table>  
      <el-button type="primary" @click="$router.back(-1)" size="medium" style="width:150px;display:block;margin:20px auto">返回</el-button>    
    </div>
  </div>
</template>
<script>
import { httpGet, httpPut, httpDelete } from "@/utils/http.js";
import { hoursSeconds } from "@/utils/getDate.js";
import { successTips, message, errTips } from "@/utils/tips.js";
import { MessageBox } from "element-ui";
import { mapGetters, mapActions } from "vuex";
export default {
  components: {},
  data() {
    return {
      id:null,
      title:"",
      ruleForm: [],
      loading: false
    };
  },
  created: function() {
    this.id = this.$route.query.id;   
    if (!this.id) {
      this.$router.push("issueManage");
      return false;
    }
    this.getView();
  },
  
  methods: {    
    //获取页面数据
    getView() {
      this.loading = true;
      
      httpGet(`/v1/authorization/bug/get/history?id=${this.id}`).then(
        results => {
          const { httpCode } = results.data;
          if (httpCode === 200) {
            let newData = results.data.data;
            let { historyList,title } = newData;
            for (let i of historyList) {
            i.gmtCreate = hoursSeconds(i.gmtCreate);
          }
          this.ruleForm = historyList;
          this.title=title;
          } else if (httpCode === 400) {
            errTips("页面丟失");
            this.setCache("issueManage");
          }
        }
      );
    },
    
	rowClass() {
      return "background:#F4F6F9;";
    }
  }
};
</script>
<style lang='scss'>
@import "@/assets/scss/myTable.scss";
</style>