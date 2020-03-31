<template>
  <div class="teamApplication">
    <div class="header">
      <div class="container deskHeader">
        <h4>团队申请</h4>
      </div>
    </div>
    <div class="container deskHeader">
      <div class="header_top">
        <el-input v-model="searchData.projectName" placeholder="项目名称"></el-input>
        <div class="get_btn">
          <el-button size="primary" @click="searchList">搜索</el-button>
          <router-link to="/teamSquare">
            <el-button size="primary">参与任务</el-button>
          </router-link>
        </div>
      </div>
      <el-table
        :data="teamFrom"
        style="width: 100%"
        :header-cell-style="rowClass"
        v-loading="loading"
      >
        <el-table-column fixed prop="projectCode" label="项目编号" align="center">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              :content="scope.row.projectCode"
              placement="top-start"
            >
              <span class="tablehidden">{{scope.row.projectCode}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="项目名称" align="center">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              :content="scope.row.projectName"
              placement="top-start"
            >
              <span class="tablehidden">{{scope.row.projectName}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="leader" label="团队负责人" align="center"></el-table-column>
        <el-table-column prop="proposer" label="申请人" align="center"></el-table-column>
        <el-table-column prop="gmtCreate" label="添加时间" align="center"></el-table-column>
        <el-table-column prop="type" label="类型" width="150" align="center"></el-table-column>
        <el-table-column prop="status" label="状态" align="center"></el-table-column>
        <el-table-column prop="type" label="项目类型" width="150" align="center"></el-table-column>
        <el-table-column label="操作" prop="province" align="center" width="250">
          <template slot-scope="scope">
            <router-link @click.native="dele(scope)" to v-if="scope.row.status==='失败'">
              <i class="el-icon-delete"></i>
              删除
            </router-link>
            <router-link
              @click.native="pass(scope.row)"
              to
              v-if="scope.row.status==='审核中'&&scope.row.show"
            >
              <i class="el-icon-circle-check"></i>
              通过
            </router-link>
            <router-link
              @click.native="nopass(scope.row)"
              to
              v-if="scope.row.status==='审核中'&&scope.row.show"
            >
              <i class="el-icon-error"></i>
              不通过
            </router-link>
          </template>
        </el-table-column>
      </el-table>
      <div class="bid_footer">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="pageData.pageNo"
          
          :total="totalPage"
          layout="prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { httpGet, httpPut, httpDelete } from "@/utils/http.js";
import { specificDate } from "@/utils/getDate.js";
import { message, errTips, successTips } from "@/utils/tips.js";
import { mapGetters, mapMutations } from "vuex";
import { MessageBox } from "element-ui";
export default {
  components: {},
  name: "teamApplication",
  data() {
    return {
      loading: false,
      selectedOptions: "",
      options: [],
      selestate: [],
      typeList: [],
      totalPage: 0,
      searchData: {
        projectName: "",
        startTime: null,
        endTime: null,
        parentId: null,
        pageSize: 10,
        pageNo: 1,
        orderType: "DESC",
        typeId: null,
        orderBy: "id"
      },
      pageData: {
        projectName: "",
        orderType: "DESC",
        startTime: null,
        endTime: null,
        parentId: null,
        pageNo: 1,
        typeId: null,
        pageSize: 10,
        orderBy: "id"
      },
      teamFrom: []
    };
  },
  created: function() {
    this.getView();
  },
  computed: {
    ...mapGetters(["getuserData"])
  },
  methods: {
    ...mapMutations(["setCache"]),
    rowClass() {
      return "background:#F4F6F9;";
    },
    //搜索查询
    searchList() {
      let { searchData } = this;
      this.getView(searchData);
    },
    //页码变化
    handleCurrentChange(val) {
      this.pageData.pageNo = val;
      this.getView();
    },
    //通过申请
    pass(row) {
      httpPut("/v1/authorization/team/statussucceed/update", {
        id: row.id
      }).then(results => {
        const { httpCode, msg } = results.data;
        if (httpCode === 200) {
          row.status = "成功";
          successTips("已同意此用户加入团队！");
        } else if (httpCode === 400) {
          this.setCache("teamApplication");
        } else if (httpCode !== 401) {
          errTips(msg);
        }
      });
    },
    //获取页面数据
    getView(val=this.pageData) {
      this.loading = true;
      let { userName } = this.getuserData;
      httpGet("/v1/authorization/team/teamapplyfor/get", val).then(results => {
        const { httpCode, msg, data } = results.data;
        if (httpCode === 200) {
          let getData = data;
          this.pageNo = getData.pageNo;
          this.totalPage = parseInt(getData.totalPage + "0");
          let { projectTypeList, teamApplyForList } = getData;
          this.typeList = projectTypeList;
          for (let i of teamApplyForList) {
            for (let p of projectTypeList) {
              if (i.parentId === p.id) {
                i.parentName = p.type;
              }
              if (i.typeId === p.id) {
                i.typetName = p.type;
                i.type = i.parentName + "/" + p.type;
              }
            }
            i.gmtCreate = specificDate(i.gmtCreate);
            i.gmtModified = specificDate(i.gmtModified);
            i.leader === userName && (i.show = true);
          }
          this.teamFrom = teamApplyForList;
          Object.assign(this.pageData, val);
        } else if (msg === "该条件暂无数据") {
          this.teamFrom = [];
          message("该条件暂无数据");
        }
        this.loading = false;
      });
    },
    //不通过
    nopass(row) {
      httpPut("/v1/authorization/team/statuscome/update", { id: row.id }).then(
        results => {
          const { httpCode, msg } = results.data;
          if (httpCode === 200) {
            row.status = "失败";
            message("已拒绝此用户加入此团队！");
          } else if (httpCode === 400) {
            this.setCache("teamApplication");
          } else if (httpCode !== 401) {
            errTips(msg);
          }
        }
      );
    },
    //删除记录
    dele(scope) {
      MessageBox.confirm("此操作将删除此条申请记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        httpDelete(
          `/v1/authorization/team/teamapplyforid/delete/${scope.row.id}`
        ).then(results => {
          const { msg, httpCode } = results.data;
          if (httpCode === 200) {
            this.getView()
            successTips("已成功删除此项申请信息！");
          } else if (httpCode === 400) {
            this.setCache("teamApplication");
          } else if (httpCode !== 401) {
            errTips(msg);
          }
        });
      });
    }
  }
};
</script>
<style lang='scss'>
.teamApplication {
  .bid_footer {
    .el-input__inner {
      width: 70px;
    }
    .el-pagination {
      text-align: center;
      margin: 50px 0 50px 0;
    }
    .el-pagination.is-background .el-pager li:not(.disabled).active {
      background: #3e76b8;
    }
  }
  .el-table {
    border: 1px solid #d8d8d8;
  }
  .get_btn {
    float: right;
  }
  .header_top {
    margin-top: 15px;
    padding-bottom: 20px;
    button {
      margin-left: 20px;
    }
  }
  .el-input {
    display: inline-block;
    width: 200px;
    margin-right: 25px;
  }
  .el-input__inner {
    border: 1px solid #c0c0c0;
    width: 200px;
    height: 35px;
    line-height: 35px;
  }
  .el-table td,
  .el-table th.is-leaf {
    color: black;
    border-bottom: 1px solid #d8d8d8;
  }
}
</style>