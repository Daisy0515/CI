<template>
  <div class="teamApplication">
    <div class="header">
      <div class="container deskHeader">
        <h4>缺陷跟踪</h4>
      </div>
    </div>
	
    <div class="container deskHeader">
		<br>
		<span style="color: #4478b4; font-size: 120%;" @click="toIssueManage">
			代码缺陷&nbsp;&nbsp;
		</span>
		<span @click="toDocumentOpinion">
			文档意见
		</span>
			
		
      <el-dialog :title="title" :visible.sync="diaIndex" width="30%">
        <p
          style="word-wrap:break-word;width:100%;display:inline-block"
        >{{content}}</p>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="diaIndex = false">确 定</el-button>
        </span>
      </el-dialog>
      <div class="header_top">
        <el-input v-model="searchData.projectName" placeholder="请输入项目名称"></el-input>
        <el-select v-model="searchData.level" clearable placeholder="请选择缺陷等级">
            <el-option label="█马上解决" value="1" style="color:red"></el-option>
            <el-option label="█急需解决" value="2" style="color:orange"></el-option>
            <el-option label="█高度重视" value="3" style="color:#FFE153"></el-option>
            <el-option label="█正常处理" value="4" style="color:green"></el-option>
            <el-option label="█低优先级" value="5" style="color:blue"></el-option>
        </el-select>
        <el-select v-model="searchData.status" clearable placeholder="请选择状态">
            <el-option label="待解决" value="1"></el-option>
            <el-option label="解决中" value="2"></el-option>
            <el-option label="已解决" value="3"></el-option>
            <el-option label="已结束" value="4"></el-option>
        </el-select>
        <input type="radio" v-on:click="changeRadio" :checked="checked"/>是否指派给我
        <div class="buttons">
          <router-link :to="{path:'issueAdd'}">
            <el-button type="primary" size="middle"
              @click="routerIndex='issueAdd'"
            >新增</el-button>
          </router-link>          
          <el-button size="primary" @click="searchList()">搜索</el-button> 
		<router-link :to="{path:'issueVisualization'}">
		  <el-button type="primary" size="middle"
			
		  >可视化</el-button>
		</router-link>
        </div>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        :header-cell-style="rowClass"
        v-loading="loading"
      >
        <el-table-column fixed prop="projectCode" label="项目编号" align="center">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              :content="String(scope.row.projectCode)"
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
        <el-table-column prop="creatorName" label="创建人" align="center">
          <template slot-scope="scope">
            <span class="tablehidden">{{scope.row.creatorName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="appointName" label="当前指派人" align="center">
          <template slot-scope="scope">
            <span class="tablehidden">{{scope.row.appointName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" align="center">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              :content="scope.row.title"
              placement="top-start"
            >
            <span class="tablehidden">{{scope.row.title}}</span>
            </el-tooltip>
          </template>
       </el-table-column>
        <el-table-column prop="operateTime" label="最后操作时间" align="center" width="200">
          <template slot-scope="scope">
            <span class="tablehidden">{{scope.row.gmtModified}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="level" label="等级" align="center">
          <template slot-scope="scope">
            <span class="tablehidden" v-if="scope.row.level===1" style="color:red;">█马上解决</span>
            <span class="tablehidden" v-if="scope.row.level===2" style="color:orange;">█急需解决</span>
            <span class="tablehidden" v-if="scope.row.level===3" style="color:#FFE153;">█高度重视</span>
            <span class="tablehidden" v-if="scope.row.level===4" style="color:green;">█正常处理</span>
            <span class="tablehidden" v-if="scope.row.level===5" style="color:blue;">█低优先级</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center">
          <template slot-scope="scope">
            <span class="tablehidden" v-if="scope.row.status===1">待解决</span>
            <span class="tablehidden" v-if="scope.row.status===2">解决中</span>
            <span class="tablehidden" v-if="scope.row.status===3">已解决</span>
            <span class="tablehidden" v-if="scope.row.status===4">结束</span>
          </template>
        </el-table-column>
        <el-table-column prop="operation" label="操作" align="center" width="200">
          <template slot-scope="scope">  
		  <!-- 不理解 -->
            <router-link @click.native="edit(scope.row.creatorId,scope.row.appointId,scope.row.id)" to>
              <i class="el-icon-edit"></i>
              编辑
            </router-link>
            <router-link
              :to="{ path: 'viewHistory', query: { id: scope.row.id } }"
            >
              <i class="el-icon-search"></i>
              查看历史
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
import { message, errTips, successTips } from "@/utils/tips.js";
import { mapMutations } from "vuex";
import { MessageBox } from "element-ui";
import { hoursSeconds } from "@/utils/getDate.js";
export default {
  components: {},
  name: "issueManage",
  data() {
    return {
      userId:null,
      checked:false,
      loading: false,
      totalPage: 0,
      searchData: {
        projectName: "",
        level:null,
        status:null,
        is:0,
        pageSize: 10,
        pageNo: 1,
        orderType: "DESC",
        orderBy: "id"
      },
      pageData: {
        projectName: "",
        level:null,
        status:null,
        is:0,
        orderType: "DESC",
        pageNo: 1,
        pageSize: 10,
        orderBy: "id"
      },
      tableData: []
    };
  },
  created: function() {
    this.getView();
  },
  methods: {
    ...mapMutations(["setCache"]),
    changeRadio: function(event) {
      if(this.checked===true){
        this.checked=false;
        this.searchData.is=0;
        this.pageData.is=0;
      }else{
        this.checked=true;
        this.searchData.is=1;
        this.pageData.is=1;
      }
    },
	toIssueManage() {
	  this.$router.push({ path: "./issueManage" });
	},
	toDocumentOpinion() {
	  this.$router.push({ path: "./documentOpinion" });
	},

    rowClass() {
      return "background:#F4F6F9;";
    },
    openDia(content,title) {
      this.diaIndex = !this.diaIndex;
      this.content = content;
      this.title = title
    },
    //新增缺陷
    newAdd(){

    },
    //搜索查询
    searchList() {
      let { searchData } = this; //???
      this.getView(searchData);
    },
    //页码变化
    handleCurrentChange(val) {
      this.pageData.pageNo = val;
      this.getView();
    },
    //获取页面数据
    getView(val = this.pageData) {  //???
      this.loading = true;
      httpGet("/v1/authorization/bug/search/get", val).then(results => {
        const { httpCode, msg, data } = results.data;
        if (httpCode === 200) {
          let getData = data;
          this.pageNo = getData.pageNo;
          this.userId = getData.userId;
          this.totalPage = parseInt(getData.totalPage + "0");
          let { list } = getData;
          for (let i of list) {
            i.gmtModified = hoursSeconds(i.gmtModified);
          }
          this.tableData = list;
          Object.assign(this.pageData, val);
        } else if (msg === "该条件暂无数据") {
          this.tableData = [];
          message("该条件暂无数据");
        }
        this.loading = false;
      });
    },
    edit(creatorId,appointId,id){
      if(creatorId===this.userId){
        this.$router.push({path: 'issueEditCreator',query:{id:id}});
      }else{
        if(appointId===this.userId){
          this.$router.push({path: 'issueEditAppoint',query:{id:id}});
        }
        else{
          message("没有权限编辑！");
        }
      }
    }
  }
};
</script>
<style lang='scss'>
.teamApplication {
    .seeClass{
        color: #3e76b8;
        cursor: pointer;
    }
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
  .buttons {
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

