<template>
	<!-- <h1>publishercomplete</h1> -->
	<div>
	<el-table v-loading="loading" :data="tableData" style="width:1000px;margin:0 auto" :header-cell-style="rowClass">
		<el-table-column fixed prop="projectCode" label="项目编号" align="center">
			<template slot-scope="scope">
				<el-tooltip class="item" effect="dark" :content="scope.row.projectCode" placement="top-start">
					<span class="tablehidden">{{ scope.row.projectCode }}</span>
				</el-tooltip>
			</template>
		</el-table-column>
		<el-table-column prop="projectName" label="项目名称" align="center">
			<template slot-scope="scope">
				<el-tooltip class="item" effect="dark" :content="scope.row.projectName" >
					<span class="tablehidden">{{ scope.row.projectName }}</span>
				</el-tooltip>
			</template>
		</el-table-column>
		<el-table-column prop="title" label="评审标题" align="center">
			<template slot-scope="scope">
				<el-tooltip class="item" effect="dark" :content="scope.row.title" >
					<span class="tablehidden">{{ scope.row.title }}</span>
				</el-tooltip>
			</template>
		</el-table-column>
		<el-table-column prop="gmtCreate" label="开始时间" align="center"></el-table-column>
		<el-table-column prop="deadline" label="截止时间" align="center"></el-table-column>
	
		<el-table-column prop="accomplishProgress" label="操作" align="center" width="280px">
			<template slot-scope="scope">
				<el-button @click="handleClick(scope.row)" type="text" size="medium"
						   ><i class="el-icon-search"></i>查看详情</el-button>
				<!-- <router-link :to="{path:'bidView', query:{id:scope.row.id}}">
				  <i class="el-icon-search"></i>
				  查看详情
				</router-link> -->
				
			</template>
		</el-table-column>
	</el-table>
	<el-dialog title="评审详情" :visible.sync="dialogFormVisible" style="width:100%;text-align:left; font-weight: bolder;">
		<el-form :model="form">
			<el-row :gutter="20">
				<el-col :span="8">
					<el-form-item label="项目名称" :label-width="formLabelWidth">
						<el-input v-model="form.name" auto-complete="off" />
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="项目编号" :label-width="formLabelWidth">
						<el-input v-model="form.id" auto-complete="off" />
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="评审标题" :label-width="formLabelWidth">
						<el-input v-model="form.name" auto-complete="off" />
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="8">
					<el-form-item label="评审目的" :label-width="formLabelWidth">
						<el-input v-model="form.purpose" auto-complete="off" />
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="开始时间" :label-width="formLabelWidth">
						<el-input v-model="form.date1" auto-complete="off"  />
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="截止时间" :label-width="formLabelWidth">
						<el-input v-model="form.date2" auto-complete="off" />
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="8">
					<el-form-item label="截止前提醒" :label-width="formLabelWidth">
						<el-input v-model="form.daysBeforeDeadline" auto-complete="off" placeholder="请输入天数" />
					</el-form-item>
				</el-col>
				<el-col :span="16">
					<el-form-item label="评审内容" :label-width="formLabelWidth">
						<el-input
								v-model="form.content"
								type="textarea"
								:rows="2"
								placeholder="请输入内容"
						/>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="10">
					<el-form-item label="附件下载" :label-width="formLabelWidth" style="text-align: center">
						<el-table
								:data="form.fileTable"
								border
								>
							<el-table-column
									prop="filename"
									label="附件名称"
									>
							</el-table-column>
							<el-table-column
									label="操作"
									>
								<template slot-scope="scope">
									<el-button @click="handleClickFile(scope.row)" type="text" size="medium"
											   style="margin-left: 30%"
											   >下载</el-button>
								</template>
							</el-table-column>
						</el-table>
					</el-form-item>
				</el-col>
			</el-row>
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
import { httpGet, httpDelete } from "@/utils/http.js";
import { specificDate } from '@/utils/getDate.js';
import { message, successTips, errTips } from "@/utils/tips.js";

export default {
  
  data() {
    return { 
      loading: false,  
      tableData: [
		  
	  ],  
	  pageData: {
	    pageNo: 1,
	    pageSize: 10,
	    orderBy: "id",
	    orderType: "DESC",
	    role:2,
	    status:1
	  },
	  totalPage: 0,
	  dialogFormVisible: false,
	  form: {
	  	name: '',
	  	purpose:'',
	  	date1: '',
	  	date2: '',
	  	content: '',
	  	daysBeforeDeadline:'',
	  	fileTable:[{
	  		filename:'项目申请书',
	  		url:''
	  	}],
	  	delivery: false,
	  	type: [],
	  	resource: '',
	  	desc: ''
	  },
	  formLabelWidth: '100px'
    };
  },
  created: function() {
    this.getView();
  },
  computed: {
    
  },
  methods: { 
	  getView(val = this.pageData) {
	    this.loading = true;
	     
	    //get /v1/authorization/review/review/search 
	    httpGet("/v1/authorization/review/review/search", val).then(results => {
	      const { httpCode, msg, data } = results.data;
	      if (httpCode == 200) {
	        this.pageNo = data.pageNo;
	        this.totalPage = parseInt(data.totalPage + '0');
	        
	        let list = data.reviewInfoList ;
	        for (let i of list) {
	        	
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

<style>
@import "/src/assets/scss/myTable.scss";
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

