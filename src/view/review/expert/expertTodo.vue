<template>
	<!-- <h1>publishercomplete</h1> -->
	<div>
		<div style="padding-left: 10px;">
		<el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 130%;">
		  <el-breadcrumb-item :to="{ path: '/expertIndex' }">评审专家</el-breadcrumb-item>
		  <el-breadcrumb-item>待处理</el-breadcrumb-item>
		
		</el-breadcrumb>
		</div>
		<div class="myTable">
			<div class="header_top">
				
				<el-input v-model="searchData.type" placeholder="请输入评审类型"></el-input>
				<el-input v-model="searchData.title" placeholder="请输入评审标题"></el-input>
				<el-date-picker v-model="searchData.gmtCreateStart" type="date" placeholder="创建开始时间"
				 value-format="yyyy-MM-dd"></el-date-picker>
				<span style="margin-right:15px">到</span>
				<el-date-picker v-model="searchData.gmtCreateEnd" type="date" placeholder="创建结束时间"
				 value-format="yyyy-MM-dd"></el-date-picker>
				<el-button type="primary" @click="searchList()">搜索</el-button>
			</div>
		
		</div>
		
	<el-table v-loading="loading" :data="tableData" style="width:1000px;margin:20px auto" :header-cell-style="rowClass">
		<el-table-column fixed prop="title" label="评审标题" align="center">
			<template slot-scope="scope">
				<el-tooltip class="item" effect="dark" content="scope.row.title" placement="top-start">
					<span class="tablehidden">{{ scope.row.title }}</span>
				</el-tooltip>
			</template>
		</el-table-column>
		<el-table-column prop="reviewId" label="评审编号" align="center">
			<template slot-scope="scope">
				<el-tooltip class="item" effect="dark" content="scope.row.reviewId" >
					<span class="tablehidden">{{ scope.row.reviewId}}</span>
				</el-tooltip>
			</template>
		</el-table-column>
		<el-table-column prop="type" label="评审类型" align="center">
			<template slot-scope="scope">
				<el-tooltip class="item" effect="dark" content="scope.row.type" >
					<span class="tablehidden">{{ scope.row.type}}</span>
				</el-tooltip>
			</template>
		</el-table-column>
		<el-table-column prop="gmtCreate" label="邀请日期" align="center"></el-table-column>
		<el-table-column prop="deadline" label="截止日期" align="center"></el-table-column>
		<el-table-column prop="gmtModified" label="更新日期" align="center"></el-table-column>
		<el-table-column prop="surplus" label="剩余天数" align="center">
			<template slot-scope="scope">
				<span class="tablehidden">{{ scope.row.surplus }}</span>
			</template>
		</el-table-column>
		<el-table-column prop="status" label="状态" align="center">
		  <template slot-scope="scope">
		    <span v-if="scope.row.status===1">待处理</span>
		    <span v-if="scope.row.status===2">评审中</span>
		    <span v-if="scope.row.status===3">已完成</span>
		    <span v-if="scope.row.status===4">中止</span>
		  </template>
		</el-table-column>
		<el-table-column prop="accomplishProgress" label="操作" align="center" width="220px">
			<template slot-scope="scope">
				<el-button @click="handleClickDetail(scope.row.reviewId)" type="text" size="medium"
						   ><i class="el-icon-search"></i>查看详情</el-button>
				<el-button @click="handleRollBack(scope.row.id)" type="text" size="medium"
				><i class="el-icon-close"></i>打回
				</el-button>
				<el-button @click="handleAccept(scope.row.id)" type="text" size="medium"
				><i class="el-icon-check"></i>接受
				</el-button>
				
			</template>
		</el-table-column>
	</el-table>
	<el-dialog title="拒绝评审" :visible.sync="dialogRollbackVisible"  style="text-align:left; font-weight: bolder;">
	    <el-form :model="postForm">
	        <el-row>
	            <el-col :span="20">
	                <el-form-item label="拒绝原因" :label-width="formLabelWidth">
	                    <el-input
	                            v-model="postForm.reply"
	                            type="textarea"
	                            :rows="3"
	                            placeholder="请输入内容"
	                    />
	                </el-form-item>
	            </el-col>
	        </el-row>
	    </el-form>
	    <div slot="footer" style="margin-right: 35%">
	        <el-button @click="dialogRollbackVisible=false" style="margin-right: 10%">取 消</el-button>
	        <el-button type="primary" @click="submitRollback" v-prevent-click>确 定</el-button>
	    </div>
	</el-dialog>
	
	
	<ex-review-detail :form="formReviewDetail" :formLabelWidth="formLabelWidth"
	                      :dialogFormVisible="dialogFormVisible"
	                      :loading="formReviewDetailLoading"
	                      @closeDialog="closeDialog"></ex-review-detail>
	
	
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
import { httpGet, httpDelete,httpPut } from "@/utils/http.js";
import { specificDate } from '@/utils/getDate.js';
import { message, successTips, errTips } from "@/utils/tips.js";
import reviewDetailDialog from '@/view/review/components/reviewDetailDialog';
import exReviewDetail from '@/view/review/components/exReviewDetail.vue'
import {MessageBox} from 'element-ui';

export default {
	components: {
	    reviewDetailDialog,
		exReviewDetail
	},
  
  data() {
    return { 
		dialogRollbackVisible: false,//控制打回对话框是否可见
		formReviewDetailLoading: false,//打开详情，加载转圈提示
		dialogFormVisible: false,//控制详情对话框是否可见
		formLabelWidth: '100px',
      loading: false,  
      tableData: [],  
	  pageData: {
	  	pageNo: 1,
	  	pageSize: 10,
	  	orderBy: "id",
	  	orderType: "DESC",
	  	type: null,
	  	submitTimeStart: null,
	  	submitTimeEnd: null,
	  	status: 1
	  },
	  searchData: {
	  	pageNo: 1,
	  	pageSize: 10,
	  	orderBy: "id",
	  	orderType: "DESC",
	  	type: null,
	  	submitTimeStart: null,
	  	submitTimeEnd: null,
	  	status: 1
	  },  
	  totalPage: 0,
		postForm:{
			id:null,
			type:null,
			reply:null
		},
		formReviewDetail:{},
		// form: {//表单中的信息，保存打回评审时填写的信息
		//     details: "",
		//     reviewInfoId: null,
		//     deadline: "",
		// },
    };
  },
  created: function() {
    this.getView();
  },
  computed: {
    
  },
  methods: { 
	  submitRollback() {//提交打回信息
		  
		  
	      httpPut('/v1/authorization/review/expertinvite/update', this.postForm).then(results => {
	          const {data, msg, httpCode} = results.data;
	          if (httpCode === 200) {
	              successTips("已拒绝评审！");
	              this.postForm.id = null;
	              this.postForm.type = null;
	              this.postForm.reply = null;
	              this.getView();
	              this.dialogRollbackVisible = false;
	          } else {
	              errTips(msg);
	          }
	      })
	  },
	  handleRollBack(val) {//点击查看打回中
	      this.dialogRollbackVisible = true;
	      this.postForm.id = val;
		  this.postForm.type = 2;
		 
	  },
	  handleAccept(val) {
	      MessageBox.confirm("接受任务将进入评审中状态，是否接受？", "提示", {
	          confirmButtonText: "确定",
	          cancelButtonText: "取消",
	          type: "warning"
	      }).then(() => {
			  //put /v1/authorization/review/expertinvite/update 
			  this.postForm.id = val;
			  this.postForm.type = 1;
	              httpPut('/v1/authorization/review/expertinvite/update', this.postForm).then(results => {
	                  const {data, msg, httpCode} = results.data;
	                  if (httpCode === 200) {
	                      successTips("已接受评审！");
	                      this.getView();
	                  } else {
	                      errTips(msg);
	                  }
	              });
	          }) .catch(() => {});
	  
	  },
	  closeDialog() {
	      this.dialogFormVisible = false;
	  },
	  handleClickDetail(val) {//点击查看详情
	      this.dialogFormVisible = true;
	      this.formReviewDetailLoading = true;
	      //get /v1/authorization/review/review/get
	      httpGet("/v1/authorization/review/review/get", {id: val}).then(results => {
	          const {httpCode, msg, data} = results.data;
	          if (httpCode == 200) {
	              data.deadline = specificDate(data.deadline);
	              data.gmtCreate = specificDate(data.gmtCreate);
	              this.formReviewDetail = data;
	          } else if (msg == "该条件暂无数据") {
	              this.formReviewDetail = {};
	              message("该条件暂无数据");
	          } else if (httpCode !== 401) {
	              errTips(msg);
	          }
	          this.formReviewDetailLoading = false;
	      });
	  },
	  
	  searchList(){
	  	if (this.searchData.tpye == "") {this.searchData.type == null}
	  	if (this.searchData.submitTimeStart == "") {this.searchData.submitTimeStart == null}
	  	if (this.searchData.submitTimeEnd == "") {this.searchData.submitTimeEnd == null}
	  	
	  	this.getView(this.searchData);
	  },
	  
	  getView(val = this.pageData) {
	  	if (this.pageData.tpye == "") {this.pageData.type == null}
	  	if (this.pageData.submitTimeStart == "") {this.pageData.submitTimeStart == null}
	  	if (this.pageData.submitTimeEnd == "") {this.pageData.submitTimeEnd == null}
	  	
	  	this.loading = true;
	  
	  	//get /v1/authorization/review/expertinvite/search 
	  	httpGet("/v1/authorization/review/expertinvite/search", val).then(results => {
	  		const {
	  			httpCode,
	  			msg,
	  			data
	  		} = results.data;
	  		if (httpCode == 200) {
	  			this.pageNo = data.pageNo;
	  			this.totalPage = parseInt(data.totalPage + '0');
	  
	  			let list = data.expertInviteList;
	  			for (let i of list) {
	  				i.gmtModified = specificDate(i.gmtModified);
	  				i.gmtCreate = specificDate(i.gmtCreate);
	  				i.deadline = specificDate(i.deadline);
	  			}
	  			Object.assign(this.pageData, val);
	  			this.$set(this, 'tableData', list);
	  		} else if (msg == "该条件暂无数据") {
	  			this.tableData = [];
	  			message("该条件暂无数据");
	  		} else if (httpCode !== 401) {
	  			errTips(msg);
	  		}
	  		this.loading = false;
	  	});
	  },
	  
	  
	  handleCurrentChange(val) {
	    this.pageData.pageNo = val;
	    this.getView();
	  },
	  handleClick(row) {
	  	this.dialogFormVisible = true;
	  },
	  handleClickFile(row){
	  
	  },
	rowClass() {
      return "background:#F4F6F9;";
    }
  }
};

</script>

<style lang='scss'>
@import "@/assets/scss/myTable.scss";
.bid_footer {
	 text-align: center;
    margin-top: 20px;
    .el-input__inner {
      width: 70px;
    }
    .el-pagination {
      
      margin: 50px 0 50px 0;
    }
  }
</style>

