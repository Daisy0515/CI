<template>
  <div class="classicSelect">
    <div class="Crumbs">
      <div class="container deskHeader">
        <h4>
          您的位置：
          <router-link to="myDemand">我的需求</router-link>>
          <span class="active">案例选择</span>
        </h4>
      </div>
    </div>
    <div class="container deskHeader">
      <el-table
        ref="singleTable"
        :data="caseForm"
        style="width: 100%"
        :header-cell-style="rowClass"
        v-loading="loading"
        :row-class-name="tableRowClassName"
      >
        <el-table-column :label="isChoose?'状态':'选择'" width="80" align="center">
          <template slot-scope="scope">
            <el-radio class="radio" v-model="seleId" :label="scope.row.id" v-if="isChoose!=1"></el-radio>
            <span v-if="scope.row.isChoose===1">经典案例</span>
          </template>
        </el-table-column>
        <el-table-column prop="leaderName" label="团队组长" align="center"></el-table-column>
        <el-table-column prop="count" label="人员个数" align="center"></el-table-column>
        <el-table-column prop="taskModified" label="最后更新时间" align="center"></el-table-column>
        <el-table-column prop="accomplishProgress" label="完成进度" align="center"></el-table-column>
        <el-table-column prop="uploadResource" label="结果下载" align="center">
          <template slot-scope="scope">
            <a
              target="_Blank"
              :href="scope.row.uploadResource"
            >{{scope.row.uploadResource?'结果下载':'暂无附件'}}</a>
          </template>
        </el-table-column>
        <el-table-column label="资源下载" align="center">
          <template slot-scope="scope">
            <router-link
              :to="{path:'download', query:{id:scope.row.id}}"
              class="progressBtn"
            >
              <i class="el-icon-search"></i>
              资源下载
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="province" align="center">
          <template slot-scope="scope">
            <router-link
              v-if="!isChoose?true:scope.row.isChoose"
              :to="{path:'demandendView', query:{projectId:projectId,teamId:scope.row.id,type:'sele'}}"
            >
              <i class="el-icon-search"></i>
              明细
            </router-link>
          </template>
        </el-table-column>
      </el-table>
      <div class="btn">
        <router-link to="myDemand">
          <el-button type="primary">返回</el-button>
        </router-link>
        <el-button type="primary" v-if="!isChoose" @click="seleClassic">确定选取</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { httpGet, httpPost } from "@/utils/http.js";
import { specificDate } from "@/utils/getDate.js";
import { successTips, errTips } from "@/utils/tips.js";
import { mapMutations } from "vuex";
export default {
  components: {},
  data() {
    return {
      projectId: "",
      loading: true,
      caseForm: [],
      currentRow: null,
      seleId: "",
      isChoose: false
    };
  },
  created: function() {
    this.projectId = this.$route.query.projectId;
    if (!this.projectId) {
      this.$router.push("myDemand");
      return false;
    }
    this.getView();
  },
  methods: {
    ...mapMutations(["setCache"]),
    //获取案例数据
    getView() {
      httpGet("/v1/authorization/bid/classic/teaminfo", {
        id: this.projectId
      }).then(results => {
        const { httpCode, msg, data } = results.data;
        if (httpCode === 200) {
          for (let i of data.sendList) {
            i.taskModified = specificDate(i.taskModified);
            i.accomplishProgress = i.accomplishProgress + "%";
            if (i.isChoose === 1) {
              this.isChoose = true;
            }
          }
          this.loading = false;
          this.caseForm = data.sendList;
        } else if (httpCode === 400) {
          this.setCache("myDemand");
        } else if (httpCode !== 401) {
          errTips(msg);
        }
      });
    },
    tableRowClassName({ row }) {
      // alert(row.isChoose)
      if (row.isChoose == 1) {
        return "classicClass";
      }
    },
    //选择经典案例
    seleClassic() {
      if (this.seleId === "") {
        errTips("请选择一个案例");
        return false;
      }
      httpPost("/v1/authorization/bid/classic/insert", {
        teamId: this.seleId
      }).then(results => {
        const { httpCode, msg } = results.data;
        if (httpCode === 200) {
          successTips("选择成功");
          this.setCache("myDemand");
        } else if (httpCode !== 401) {
          errTips(msg);
        }
      });
    },
    rowClass() {
      return "background:#F4F6F9;";
    }
  }
};
</script>
<style lang='scss'>
.el-table .classicClass {
  background: oldlace;
}
.el-radio__label {
  display: none;
}
.classicSelect {
  .el-table--striped .el-table__body tr.el-table__row--striped.current-row td,
  .el-table__body tr.current-row > td,
  .el-table__body tr.hover-row.current-row > td,
  .el-table__body tr.hover-row.el-table__row--striped.current-row > td,
  .el-table__body tr.hover-row.el-table__row--striped > td,
  .el-table__body tr.hover-row > td {
    background: oldlace;
  }
  .el-table {
    border: 1px solid #d8d8d8;
    margin-top: 40px;
  }
  .btn {
    float: right;
  }
  button {
    margin: 40px 0 0 20px;
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