<template>
  <div class="teamApplication">
    <div class="header">
      <div class="container deskHeader">
        <h4>我的收藏</h4>
      </div>
    </div>
    <div class="container deskHeader">
      <div class="header_top">
        <el-input v-model="searchData.projectName" placeholder="请输入项目名称"></el-input>
        <div class="get_btn">
          <el-button size="primary" @click="searchList">搜索</el-button>
          <router-link to="/classicCase">
            <el-button size="primary">更多资源</el-button>
          </router-link>
        </div>
      </div>
      <el-table
        v-loading="loading"
        :data="collectFrom"
        style="width: 100%"
        :header-cell-style="rowClass"
      >
        <el-table-column prop="projectName" label="项目名称" align="center"></el-table-column>
        <el-table-column prop="gmtCreate" label="收藏时间" align="center"></el-table-column>
        <el-table-column label="操作" prop="province" align="center" width="300">
          <template slot-scope="scope">
            <router-link @click.native="seeView(scope.row.classicId)" to>
              <i class="el-icon-search"></i>
              查看
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
import { httpGet } from "@/utils/http.js";
import { specificDate } from "@/utils/getDate.js";
import { errTips, message } from "@/utils/tips.js";
export default {
  name: "myCollection",
  components: {},
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
        typeId: null
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
      collectFrom: []
    };
  },
  created: function() {
    this.getForm(this.pageData);
  },
  methods: {
    rowClass() {
      return "background:#F4F6F9;";
    },
    //查询
    searchList() {
      let { searchData } = this;
      this.getForm(searchData);
    },
    //页码变化
    handleCurrentChange(val) {
      this.pageData.pageNo = val;
      this.getForm(this.pageData);
    },
    //查看
    seeView(id) {
      httpGet("/v1/authorization/bid/classic/selectinfo", { id }).then(
        results => {
          const { httpCode, msg } = results.data;
          if (httpCode === 200) {
            this.$router.push({
              name: "caseDetails",
              query: { id, type: "desk" }
            });
          } else if (msg === "该案例已下架，无法查看") {
            errTips("该案例不存在或已下架");
          } else if (httpCode !== 401) {
            errTips(msg);
          }
        }
      );
    },
    //获取页面数据
    getForm(val) {
      this.loading = true;
      httpGet("/v1/authorization/classic/listsearch/classic", val).then(
        results => {
          const { msg, data, httpCode } = results.data;
          if (httpCode == 200) {
            this.pageNo = data.pageNo;
            this.totalPage = parseInt(data.totalPage + "0");
            let { collectList } = data;
            for (let i of collectList) {
              i.gmtCreate = specificDate(i.gmtCreate);
            }
            this.collectFrom = collectList;
            this.loading = false;
            Object.assign(this.pageData, val);
          } else if (msg == "该条件暂无数据") {
            this.loading = false;
            this.collectFrom = [];
            message("该条件暂无数据");
          } else if (httpCode !== 401) {
            errTips(msg);
          }
        }
      );
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