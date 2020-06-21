<template>
  <div class="myTable">
    <div class="Crumbs">
      <div class="container deskHeader">
        <h4>我的投标</h4>
      </div>
    </div>
    <div class="header_top">
      <el-input v-model="searchData.projectName" placeholder="项目名称搜索"></el-input>
      <el-date-picker
        v-model="searchData.startTime"
        type="date"
        placeholder="投标开始时间"
        value-format="yyyy-MM-dd"
        :picker-options="endDatePicker"
      ></el-date-picker>
      <span style="margin-right: 15px;">到</span>
      <el-date-picker
        v-model="searchData.endTime"
        :picker-options="endDatePicker"
        type="date"
        placeholder="投标结束时间"
        value-format="yyyy-MM-dd"
      ></el-date-picker>
      <el-select v-model="selestate" clearable placeholder="请选择状态">
        <el-option label="中标" value="中标"></el-option>
        <el-option label="投标中" value="投标中"></el-option>
        <el-option label="失败" value="失败"></el-option>
        <el-option label="结束" value="结束"></el-option>
      </el-select>
      <el-cascader placeholder="请选择项目类型" :options="getNormalType" clearable v-model="selectedOptions"></el-cascader>
      <el-button type="primary" @click="searchList()">搜索</el-button>
      <router-link to="/biddingSquare">
        <el-button type="primary">参与投标</el-button>
      </router-link>
    </div>
    <el-table
      :data="bidTable"
      style="width:1200px;margin:0 auto"
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
      <el-table-column prop="gmtCreate" label="投标时间" align="center"></el-table-column>
      <el-table-column prop="gmtModified" label="操作时间" align="center"></el-table-column>
      <el-table-column prop="status" label="状态" align="center">
        <template slot-scope="scope">
		<span v-if="scope.row.status===1&&scope.row.isCompetition==1">报名中</span>
		<span v-if="scope.row.status===2&&scope.row.isCompetition==1">比赛中</span>
          <span v-if="scope.row.status===1&&scope.row.isCompetition==0">投标中</span>
          <span v-if="scope.row.status===2&&scope.row.isCompetition==0">中标</span>
          <span v-if="scope.row.status===3">结束</span>
          <span v-if="scope.row.status===4">失败</span>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="项目类型" width="180" align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="350">
        <template slot-scope="scope">
          <router-link :to="{path:'bidView', query:{id:scope.row.id}}">
            <i class="el-icon-search"></i>
            查看
          </router-link>
          <router-link to v-if="!scope.row.status">
            <i class="icon iconfont icon-tuandui"></i>
            {{scope.row.sele}}
          </router-link>
          <router-link to v-if="!scope.row.status">
            <i class="el-icon-edit"></i>
            {{scope.row.edit}}
          </router-link>
          <router-link
            @click.native="getScore(scope.row.id,scope.row.isScore)"
            to
            v-if="scope.row.status===3"
          >
            <i class="icon iconfont icon-fen"></i>
            {{scope.row.isScore?"查看打分":"立即打分"}}
          </router-link>
          <router-link
            :to="{path:'editorialTeam', query:{projectId:scope.row.projectId,userId:scope.row.userId}}"
            v-if="scope.row.status===1||scope.row.status===2"
          >
            <i class="icon iconfont icon-tuandui"></i>
            编辑团队
          </router-link>
          <router-link @click.native="deleteBid(scope.row.id)" to v-if="scope.row.status===4">
            <i class="el-icon-delete"></i>
            删除
          </router-link>
          <router-link
            :to="{ path: 'taskIndex', query: { projectId: scope.row.id } }"
            v-if="scope.row.status===2"
          >
            <i class="el-icon-edit"></i>
            编辑任务
          </router-link>
          <router-link to v-if="!scope.row.status">
            <i class="el-icon-error"></i>
            {{scope.row.ban}}
          </router-link>
		  
		
		  <router-link :to ="{path:'projectDeliver',query:{Id:scope.row.id}}" v-if="scope.row.status===2">
		    <i class="el-icon-success"></i>
			交付
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
</template>
<script>
import { httpGet, httpDelete } from "@/utils/http.js";
import { specificDate } from "@/utils/getDate.js";
import timeLimit from "@/mixins/regular/timeLimit.js";
import { message, successTips, errTips } from "@/utils/tips.js";
import { MessageBox } from "element-ui";
import { mapMutations, mapActions, mapGetters } from "vuex";
export default {
  name: "myBid",
  components: {},
  inject: ["reload"],
  mixins: [timeLimit],
  data() {
    return {
      selectedOptions: [],
      options: [],
      selestate: [],
      loading: false,
      typeList: [],
      totalPage: 0,
      searchData: {
        projectName: "",
        startTime: null,
        endTime: null,
        parentId: null,
        pageNo: 1,
        typeId: null,
        pageSize: 10,
        orderType: "DESC",
        orderBy: "id"
      },
      pageData: {
        pageNo: 1,
        projectName: "",
        startTime: null,
        endTime: null,
        parentId: null,
        typeId: null,
        pageSize: 10,
        orderBy: "id",
        orderType: "DESC"
      },
      bidTable: [],

    };
  },
  created: function() {
    this.GETNORMALTYPE();
    this.getView();
  },
  computed: {
    ...mapGetters(["getNormalType"])
  },
  methods: {
    ...mapMutations(["setCache"]),
    ...mapActions(["GETNORMALTYPE"]),
    //查询是否可以打分
    getScore(id) {
      httpGet("/v1/authorization/bids/personagescore/select", {
        id: id
      }).then(results => {
        const { httpCode, msg, data } = results.data;
        if (data.scoreList.length === 0) {
          errTips("此项目中没有成员");
          return false;
        } else if (httpCode === 400) {
          errTips("此投标状态已变更");
          this.reload();
        } else if (httpCode === 200) {
          this.$router.push({
            path: "bidScoring",
            query: { id: id }
          });
        } else if (httpCode !== 401) {
          errTips(msg);
        }
      });
    },
    //删除投标
    deleteBid(id) {
      MessageBox.confirm("是否确定将此投标删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          httpDelete(`/v1/authorization/bids/castInfo/delete/${id}`).then(
            results => {
              const { httpCode, msg } = results.data;
              if (httpCode === 200) {
                this.getView();
                successTips('删除成功')
              } else if (httpCode === 400) {
                errTips("此投标状态已变更");
                this.reload();
              } else if (httpCode !== 401) {
                errTips(msg);
              }
            }
          );
        })
        .catch(() => {});
    },
    //搜索查询
    searchList() {
      let { selestate, searchData, selectedOptions } = this;
      searchData.parentId = selectedOptions[0];
      searchData.typeId = selectedOptions[1];
      if (selestate === "投标中") {
        searchData.status = 1;
      } else if (selestate === "中标") {
        searchData.status = 2;
      } else if (selestate === "结束") {
        searchData.status = 3;
      } else if (selestate === "失败") {
        searchData.status = 4;
      } else {
        searchData.status = "";
      }
      this.getView(searchData);
    },
    handleCurrentChange(val) {
      this.pageData.pageNo = val;
      this.getView();
    },
    //获取页面数据
    getView(val = this.pageData) {
      this.loading = true;
      httpGet("/v1/authorization/bids/castinfolist/get", val).then(results => {
        const { httpCode, msg, data } = results.data;
        if (httpCode == 200) {
          this.pageNo = data.pageNo;
          this.totalPage = parseInt(data.totalPage + "0");
          let { typeList, list } = data;
          this.typeList = typeList;
          for (let i of list) {
            for (let p of typeList) {
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
          }
          Object.assign(this.pageData, val);
          this.$set(this, "bidTable", list);
        } else if (msg == "该条件暂无数据") {
          this.bidTable = [];
          message("该条件暂无数据");
        } else if (httpCode !== 401) {
          errTips(msg);
        }
        this.loading = false;
      });
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