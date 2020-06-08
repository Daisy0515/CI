<template>
	<!-- <h1>publisherdraft</h1> -->
	<div>
		<el-table v-loading="loading" :data="tableData" style="width:1000px;margin:0 auto" :header-cell-style="rowClass">
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
					<el-button @click="handleClick(scope.row)" type="text" size="medium">
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
		  title="提示"
		  :visible.sync="dialogVisible"
		  width="35%"
		  :before-close="handleClose"
		  style="font-weight: bolder;">
		  
		  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
		  	<el-form-item label="评审标题"  >
				<el-select v-model="ruleForm.demand" placeholder="请选择评审标题">
				        <el-option label="A" value="shanghai"></el-option>
				        <el-option label="B" value="beijing"></el-option>
				</el-select>
			</el-form-item>
		  
		  	<el-form-item label="评审目的" >
				<el-input v-model="ruleForm.functionality" style="width: 85%;"></el-input>
			</el-form-item>
			
			<el-form-item label="截止时间" prop="endTime" >
			  <el-date-picker
			 
			    v-model="ruleForm.endTime"
			    :picker-options="endDatePicker"
			    type="date"
			    placeholder="截止时间"
			    value-format="yyyy-MM-dd"
			  ></el-date-picker>
			</el-form-item>
		  
		  	
		  
		  	<el-form-item label="评审内容" prop="remark">
		  		<el-input type="textarea" class="input_textarea " v-model="ruleForm.remark" :rows="10" style="width:85%;"></el-input>
		  	</el-form-item>
		  
		  	<sourceUpload :uploadIndex="uploadIndex" v-on:setIdCard="setIdCard($event)" />
		  
		  	<el-form-item class="cancel">
		  		<el-button type="primary" @click="returnDO" size="medium" style="width:150px;margin-left:17%">暂存</el-button>
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
				demand: '', //设计约束(没用到)
				design: '', //模块设计说明
				documentsId: null, //文档编号ID （如果这个页面没有用到这个参数是否需要写在ruleForm里面）
				functionality: '', //系统组织结构
				introduction: '', //引言
				missionId: null, //get??
				remark: '', //备注
				sourceFile: '' //原文件
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
			this.dialogVisible = true;
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
