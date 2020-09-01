<template>
  <div class="myTable">

    <div class="Crumbs">
      <div class="container deskHeader">
        <h4>
          您的位置：
          <router-link to="myDemand">我的需求</router-link>>
          <el-button type="text" @click="$router.go(-1)">案例选择</el-button>>
<!--          <router-link :to="{path:'caseSelect', query:{projectId:teamId}}">案例选择</router-link>>-->
          <span class="active">资源下载</span>
        </h4>
      </div>
    </div>
    
 
    <div class="myTable" style="margin-top:20px">
      <el-table
        :data="tableData"
        style="width:1200px;margin:0 auto;"
        :header-cell-style="rowClass"
      > 
        <el-table-column fixed prop="shortId" label="编号" align="center" width="250">
          <template slot-scope="scope">
            <div class="dot"></div>
            <div class="line" v-if="scope.$index<tableData.length-1"></div> 
            <el-tooltip
              class="item"
              effect="dark"
              :content="scope.row.shortId"
              placement="top-start"
            >
              <span class="tablehidden">{{scope.row.shortId}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="日期" align="center" width="250">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.createdAt" placement="top-start">
              <span class="tablehidden">{{scope.row.createdAt}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="作者" align="center" width="250">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.authorName" placement="top-start">
              <span class="tablehidden">{{scope.row.authorName}}</span>
            </el-tooltip>
          </template>
        </el-table-column>     
        <el-table-column prop="title" label="注释" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.title" placement="top-start">
              <span class="tablehidden">{{scope.row.title}}</span>
            </el-tooltip>
          </template>
        </el-table-column>

      </el-table>
    
      <div class="bid_footer">
      </div>
    </div>
    <div class="bid_footer">
      
      <div style="width:1200px;margin:0 auto;">
        git资源地址:
        <input id="httpUrlToRepo" class="address"
                  autocomplete="off"
                  style="width:300px;"
                  v-model="httpUrlToRepo"
                  disabled="disabled"
                />
        <el-button class="btn" 
          type="primary" 
            size="mini" 
            style="margin-left:20px" 
            v-on:click="copyAddress">
            复制地址</el-button>
        <router-link to="/git-1" style="margin-left:20px">如何使用git</router-link>
      </div>
    </div>
    
  </div>
</template>
<script>

import Clipboard from 'clipboard'
import { httpGet, httpPut, httpDelete } from "@/utils/http.js";
import { specificDate } from "@/utils/getDate.js";
import { successTips, message, errTips } from "@/utils/tips.js";
import { mapMutations, mapActions, mapGetters } from "vuex";
import { MessageBox } from "element-ui";
import timeLimit from "@/mixins/regular/timeLimit.js";
export default {
  mixins: [timeLimit],
  name: "myDemand",
  components: {
  },
  data() {
    return {
      teamId:"",
      tableData: [],
      httpUrlToRepo:"",
      items: [
        {
          tag: '2019-02-12',
          content: '测试内容'
        },
        {
          tag: '2019-02-13',
          type: 'circle',
          content: '练习内容'
        }
      ]
    };
  },
  created: function() {
    //获取项目类型数据
    this.teamId=this.$route.query.id;
    this.getView();
    //this.use(LightTimeline);
  },
 
  methods: {   
    //获取页面数据
    getView(val=this.pageData) {
       httpGet(`/v1/authorization/bid/gitlab/commit?id=${this.teamId}`)
       .then(results => {
        const { msg, data, httpCode } = results.data;
         if (httpCode === 200) {
          let {commitList,httpUrlToRepo} = data;
          this.$set(this, "httpUrlToRepo", httpUrlToRepo);
          this.$set(this, "tableData", commitList);
        } else if (httpCode === 400) {
          this.setCache("myBid");
        } else if (httpCode !== 401) {
          errTips(msg);
        }
      });
   
    },
    copyAddress: function (event) {   
      var gitAddress=this.httpUrlToRepo;  
      var clipboard = new Clipboard('.btn',{
        text: function () {
          return gitAddress;
        }
      });
      clipboard.on('success', e => {
       console.log('复制成功')
        // 释放内存
        clipboard.destroy()
      });
      clipboard.on('error', e => {
        // 不支持复制
         console.log('该浏览器不支持自动复制')
        // 释放内存
         clipboard.destroy()
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
.dot{
  width: 10px;
	height: 10px;
	border-radius: 50%;
	background-color:red;
	position: absolute;
	margin:auto;
  left:30px;
  top:20px;
}    

.line{           
width: 2px;
height: 40px;
background: red;
vertical-align: top;
margin:auto;
position: absolute;
left:34px;
top:30px;
}
  


</style>