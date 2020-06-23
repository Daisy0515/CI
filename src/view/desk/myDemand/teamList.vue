<template>
  <div class="teamProgress">
    <div class="Crumbs">
      <div class="container deskHeader">
        <h4>
          您的位置：
          <router-link to="myDemand">我的需求</router-link>>
          <span class="active">团队列表</span>
        </h4>
      </div>
    </div>
    <div class="container deskHeader">
      <el-table
        v-loading="loading"
        :data="progressForm"
        style="width: 100%"
        :header-cell-style="rowClass"
      >
        <el-table-column fixed prop="leaderName" label="团队组长" align="center"></el-table-column>
        <el-table-column prop="count" label="人员个数" align="center"></el-table-column>
        <el-table-column prop="gmtModified" label="最后更新时间" align="center"></el-table-column>
        <el-table-column prop="dayCount" label="距上一次更新天数" align="center"></el-table-column>
        <el-table-column prop="accomplishProgress" label="完成进度" align="center"></el-table-column>
        <el-table-column label="操作" prop="province" align="center" width="380px">
          <template slot-scope="scope">
           
			<router-link
			  :to="{path:'viewDelivery', query:{projectId:projectId,Id:scope.row.id}}"
			  
			>
			  <i class="el-icon-search"></i>
			  查看交付
			</router-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { httpGet } from "@/utils/http.js";
import { hoursSeconds as getDate } from "@/utils/getDate.js";
import { errTips } from "@/utils/tips.js";
export default {
  components: {},
  data() {
    return {
      projectId: "",
      loading: false,
      progressForm: []
    };
  },
  created: function() {
    this.loading = true;
    if (this.$route.query.projectId) {
      this.projectId = this.$route.query.projectId;
    } else {
      this.$router.push({ path: "myDemand" });
      return false;
    }
    this.getView();
  },
  methods: {
    //获取页面数据
    getView() {
      httpGet(`/v1/authorization/bid/finish/get?id=${this.projectId}`).then(
        results => {
          let { httpCode, msg } = results.data;
          if (httpCode === 200) {
            this.progressForm = results.data.data.planList;
            for (let i of this.progressForm) {
              i.gmtModified = getDate(i.gmtModified);
              i.accomplishProgress = i.accomplishProgress + "%";
            }
            this.loading = false;
          } else if (httpCode === 400) {
            errTips("页面丟失");
            this.$router.push({ path: "myDemand" });
          } else if (httpCode !== 401) {
            errTips(msg);
          }
        }
      );
    },
    //查看是否存在任务信息
    seeProgress(id) {
      httpGet("/v1/authorization/bids/ganttchart/get", {
        id: id
      }).then(results => {
        const { httpCode, msg } = results.data;
        if (httpCode === 200) {
          this.$router.push({
            path: "schedule",
            query: { id: id, projectId: this.projectId }
          });
        } else if (msg === "不存在任务信息") {
          errTips("暂未创建任务");
        } else if (httpCode === 400) {
          errTips("页面丟失");
          this.$router.push({ path: "myDemand" });
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
.teamProgress {
  .el-table {
    border: 1px solid #d8d8d8;
    margin-top: 40px;
  }
  .progressBtn {
    cursor: pointer;
    color: #3e76b8;
  }

  .header_top {
    margin-top: 15px;
    padding-bottom: 20px;
    button {
      margin-left: 20px;
      border: 1px solid #c0c0c0;
    }
    & button:nth-child(3) {
      background: #3e76b8;
      color: white;
    }
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
  .footer {
    margin-bottom: 20px;
    .el-input__inner {
      width: 70px;
    }
    .el-pagination {
      text-align: center;
      margin: 50px 0 50px 0;
    }
  }
}
</style>