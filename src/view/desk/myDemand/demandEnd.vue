<template>
  <div class="demandEnd">
    <div class="Crumbs">
      <div class="container deskHeader">
        <h4>
          您的位置：
          <router-link to="myDemand">我的需求</router-link>>
          <span class="active">结束需求</span>
        </h4>
      </div>
    </div>
    <div class="container deskHeader">
      <el-table
        :data="endForm"
        style="width: 100%"
        :header-cell-style="rowClass"
        v-loading="loading"
      >
        <el-table-column fixed prop="leaderName" label="团队组长" align="center"></el-table-column>
        <el-table-column prop="count" label="人员个数" align="center"></el-table-column>
        <el-table-column prop="taskModified" label="最后更新时间" align="center"></el-table-column>
        <el-table-column prop="accomplishProgress" label="完成进度" align="center"></el-table-column>
        <el-table-column prop="uploadResource" label="结果下载" align="center">
          <template slot-scope="scope">
            <a
              v-if="scope.row.uploadResource===null"
              :href="scope.row.uploadResource"
              target="_Blank"
            >暂无附件</a>
            <a
              v-if="scope.row.uploadResource!=null"
              :href="scope.row.uploadResource"
              target="_Blank"
            >结果下载</a>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="province" align="center">
          <template slot-scope="scope">
            <router-link
              :to="{path:'demandendView', query:{projectId:projectId,type:'end',teamId:scope.row.id}}"
            >
              <i class="el-icon-search"></i>
              明细
            </router-link>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="endDemand">结束需求</el-button>
    </div>
  </div>
</template>
<script>
import { httpGet, httpPut } from "@/utils/http.js";
import { hoursSeconds } from "@/utils/getDate.js";
import { mapMutations } from "vuex";
import { errTips, successTips } from "@/utils/tips.js";
export default {
  components: {},
  data() {
    return {
      projectId: "",
      loading: false,
      endForm: []
    };
  },
  created: function() {
    this.loading = true;
    if (!this.$route.query.projectId) {
      this.$router.push({ path: "myDemand" });
      return false;
    }
    this.projectId = this.$route.query.projectId;
    this.getView();
  },
  methods: {
    ...mapMutations(["setCache"]),
    //获取页面数据
    getView() {
      httpGet("/v1/authorization/bid/sendrequirementv/teaminfo", {
        id: this.projectId
      }).then(results => {
        const { httpCode, msg, data } = results.data;
        if (httpCode === 200) {
          for (let i of data.sendList) {
            i.taskModified = hoursSeconds(i.taskModified, true);
            i.accomplishProgress = i.accomplishProgress + "%";
          }
          this.loading = false;
          this.endForm = data.sendList;
        } else if (httpCode === 400) {
          errTips("页面丟失");
          this.setCache("myDemand");
        } else if (httpCode !== 401) {
          errTips(msg);
        }
      });
    },
    //结束需求
    endDemand() {
      httpPut("/v1/authorization/bid/send/sendrequirementv", {
        id: this.projectId
      }).then(results => {
        const { httpCode, msg } = results.data;
        if (httpCode === 200) {
          successTips("已结束此需求");
          this.setCache("myDemand");
        } else if (httpCode !== 401) {
          errTips(msg);
        }
      });
    },
    rowClass() {
      return "background:#f8f8f8";
    }
  }
};
</script>
<style lang='scss'>
.demandEnd {
  .el-table {
    border: 1px solid #d8d8d8;
    margin-top: 40px;
  }
  .el-input {
    display: inline-block;
    width: 150px;
    margin-right: 25px;
  }
  .el-input__inner {
    border: 1px solid #c0c0c0;
    width: 150px;
    height: 35px;
    line-height: 35px;
  }
  .el-table td,
  .el-table th.is-leaf {
    color: black;
    border-bottom: 1px solid #d8d8d8;
  }
  button {
    float: right;
    margin-top: 30px;
  }
}
</style>