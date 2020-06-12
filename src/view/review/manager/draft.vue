<template>
	<!-- <h1>publisherdraft</h1> -->
	<div>
		<div style="padding-left: 10px;">
		<el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 130%;">
		  <el-breadcrumb-item :to="{ path: '/managerIndex' }">项目经理</el-breadcrumb-item>
		  <el-breadcrumb-item>草稿箱</el-breadcrumb-item>
		
		</el-breadcrumb>
		</div>  
		<el-table v-loading="loading" :data="tableData" style="width:1000px;margin:20px auto" :header-cell-style="rowClass">
			<el-table-column fixed prop="projectCode" label="项目编号" align="center">
				<template slot-scope="scope">
					<el-tooltip class="item" effect="dark" :content="scope.row.projectCode" placement="top-start">
						<span class="tablehidden">{{ scope.row.projectCode }}</span>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column prop="projectName " label="项目名称" align="center">
				<template slot-scope="scope">
					<el-tooltip class="item" effect="dark" :content="scope.row.projectName">
						<span class="tablehidden">{{ scope.row.projectName }}</span>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column prop="title " label="评审标题" align="center">
				<template slot-scope="scope">
					<el-tooltip class="item" effect="dark" :content="scope.row.title ">
						<span class="tablehidden">{{ scope.row.title  }}</span>
					</el-tooltip>
				</template>
			</el-table-column>

			<el-table-column prop="phases" label="评审阶段" align="center">
				<template slot-scope="scope">
					<el-tooltip class="item" effect="dark" :content="scope.row.phases ">
						<span class="tablehidden">{{ scope.row.phases  }}</span>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column prop="accomplishProgress" label="操作" align="center">
				<template slot-scope="scope">
					<el-button @click="handleClick(scope.row.id)" type="text" size="medium">
						<i class="el-icon-edit"></i>
						编辑
					</el-button>

					<el-button @click="deleteDraft(scope.row)" type="text" size="medium">
						<i class="el-icon-delete"></i>
						删除
					</el-button>

					<!-- <router-link
				  :to="{ path: 'taskIndex', query: { projectId: scope.row.id } }"
				>
				  <i class="el-icon-edit"></i>
				  编辑
				</router-link>
				<router-link @click.native="deleteBid(scope.row.id)" to >
				  <i class="el-icon-delete"></i>
				  删除
				</router-link> -->
				</template>
			</el-table-column>
		</el-table>
		
		<el-dialog
		  title="编辑"
		  :visible.sync="dialogVisible"
		  width="35%"
		  :before-close="handleClose"
		  style="font-weight: bolder;">
		  
		  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
		  	<el-form-item label="评审标题"  >
				<el-input v-model="ruleForm.title" style="width: 85%;"></el-input>
				
			</el-form-item>
		  
		  	<el-form-item label="评审目的" >
				<el-input v-model="ruleForm.purpose" style="width: 85%;"></el-input>
			</el-form-item>
			
			<el-form-item label="截止时间" prop="endTime" >
			  <el-date-picker
			 
			    v-model="ruleForm.deadline"
			    :picker-options="endDatePicker"
			    type="date"
			    placeholder="截止时间"
			    value-format="yyyy-MM-dd"
			  ></el-date-picker>
			</el-form-item>
		  
		  	
		  
		  	<el-form-item label="评审内容" prop="remark">
		  		<el-input type="textarea" class="input_textarea " v-model="ruleForm.content " :rows="10" style="width:85%;"></el-input>
		  	</el-form-item>
		  
		  	<sourceUpload :uploadIndex="uploadIndex" v-on:setIdCard="setIdCard($event)" />
		  
		  	<el-form-item class="cancel">
		  		<el-button type="primary" @click="saveForm('ruleForm')" size="medium" style="width:150px;margin-left:17%">暂存</el-button>
		  		<el-button type="primary" @click="submitForm('ruleForm')" size="medium" style="width:150px;margin-left:25%">提交</el-button>
		  	</el-form-item>
		  </el-form>
		  
		</el-dialog>
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
import { httpGet, httpDelete } from '@/utils/http.js';
import { specificDate } from '@/utils/getDate.js';
import { message, successTips, errTips } from '@/utils/tips.js';
import sourceUpload from '@/common/upload/resourceUpload';
export default {
	components: {
		sourceUpload
	},

	data() {
		return {
			loading: false,
			dialogVisible: false,
			tableData: [],
			ruleForm: {
				content:"",
				deadline:"",
				gmtCreate:"",
				id:null,
				projectCode:"",
				projectId:null,
				projectName:"",
				purpose:"",
				resourceList:[],
				result:null,
				title:"",
				type:null,
				warn:null
			},
			formLabelWidth: '260px',
			pageData: {
			  pageNo: 1,
			  pageSize: 10,
			  orderBy: "id",
			  orderType: "DESC"
			},
			totalPage: 0,
		};
	},
	created: function() {
	  this.getView();
	},
	computed: {},
	methods: {
		//获取页面数据
		getView(val = this.pageData) {
		  this.loading = true;
		  //get /v1/authorization/review/draft/search 
		  httpGet("/v1/authorization/review/draft/search", val).then(results => {
		    const { httpCode, msg, data } = results.data;
		    if (httpCode == 200) {
		      this.pageNo = data.pageNo;
		      this.totalPage = parseInt(data.totalPage + "0");
		      this.tableData = data.reviewDraftList;
			  Object.assign(this.pageData, val);
		    } else if (msg == "该条件暂无数据") {
		      this.bidTable = [];
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
			// get /v1/authorization/review/draft/get 
			httpGet("/v1/authorization/review/draft/get", {id:row}).then(results => {
			  const { httpCode, msg, data } = results.data;
			  if (httpCode == 200) {
			    this.ruleForm=data;
				this.ruleForm.deadline=specificDate(data.deadline);
				this.ruleForm.gmtCreate=specificDate(data.gmtCreate);
				
			  } else {
			    errTips(msg);
			  }
			  this.dialogVisible = true;
			});
			// this.dialogVisible = true;
		},
		saveForm(){
			this.$refs[formName].validate(valid => {
				if (valid) {
					//this.setIdCard();
					// this.ruleForm.sourceFile ? this.setIdCard() : (this.uploadIndex = !this.uploadIndex);
					this.uploadIndex = !this.uploadIndex;
				} else {
					return false;
				}
			});
		},
		rowClass() {
			return 'background:#F4F6F9;';
		}
	}
};
</script>

<style>
/* @import '/src/assets/scss/myTable.scss'; */
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
/* .bid_footer {
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
	} */
</style>
