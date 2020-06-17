<template>
	<!-- <h1>publishercomplete</h1> -->
	<div>
		<div style="padding-left: 10px;">
		<el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 130%;">
		  <el-breadcrumb-item :to="{ path: '/expertIndex' }">评审专家</el-breadcrumb-item>
		  <el-breadcrumb-item>评审中</el-breadcrumb-item>
		
		</el-breadcrumb>
		</div>
	<el-table v-loading="loading" :data="tableData" style="width:1000px;margin:20px auto" :header-cell-style="rowClass">
		<el-table-column fixed prop="projectCode" label="评审标题" align="center">
			<template slot-scope="scope">
				<el-tooltip class="item" effect="dark" :content="scope.row.projectCode" placement="top-start">
					<span class="tablehidden">{{ scope.row.projectCode }}</span>
				</el-tooltip>
			</template>
		</el-table-column>
		<el-table-column prop="projectName" label="评审编号" align="center">
			<template slot-scope="scope">
				<el-tooltip class="item" effect="dark" :content="scope.row.projectName" >
					<span class="tablehidden">{{ scope.row.projectName }}</span>
				</el-tooltip>
			</template>
		</el-table-column>
		<el-table-column prop="title" label="提交人" align="center">
			<template slot-scope="scope">
				<el-tooltip class="item" effect="dark" :content="scope.row.title" >
					<span class="tablehidden">{{ scope.row.title }}</span>
				</el-tooltip>
			</template>
		</el-table-column>
		<el-table-column prop="gmtCreate" label="邀请日期" align="center"></el-table-column>
		<el-table-column prop="deadline" label="接受日期" align="center"></el-table-column>
		<el-table-column prop="deadline" label="截止日期" align="center"></el-table-column>
		<el-table-column prop="title" label="剩余天数" align="center">
			<template slot-scope="scope">
				<span class="tablehidden">{{ scope.row.title }}</span>
			</template>
		</el-table-column>
		<el-table-column prop="status" label="状态" align="center">
		  <template slot-scope="scope">
		    <span v-if="scope.row.status===1">投标中</span>
		    <span v-if="scope.row.status===2">中标</span>
		    <span v-if="scope.row.status===3">结束</span>
		    <span v-if="scope.row.status===4">失败</span>
		  </template>
		</el-table-column>
		<el-table-column prop="accomplishProgress" label="操作" align="center" width="220px">
			<template slot-scope="scope">
				<el-button @click="handleClick(scope.row)" type="text" size="medium"
						   ><i class="el-icon-search"></i>查看详情</el-button>
				<el-button @click="handleEvaluate(scope.row)" type="text" size="medium"
				><i class="el-icon-edit"></i>评价
				</el-button>
				
				
			</template>
		</el-table-column>
	</el-table>
	<el-dialog title="评审意见" :visible.sync="dialogEvaluateVisible"  width="30%" style="text-align:left; font-weight: bolder;">
			<el-form :model="form">
				<el-form-item label="评审结果" :label-width="formLabelWidth">
					<el-select>
						<el-option label="通过" value="1"></el-option>
						<el-option label="需修改" value="2"></el-option>
						<el-option label="不通过" value="3"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="评审得分" :label-width="formLabelWidth" style="width:300px;">
					<el-input v-model="form.name" auto-complete="off" />
				</el-form-item>
				<el-form-item label="评审意见" :label-width="formLabelWidth">
					<el-input type="textarea" class="input_textarea" v-model="form.name" :rows="10" style="width:87%;" auto-complete="off" />
				</el-form-item>
			</el-form>
			
			<div slot="footer" style="text-align: center;">
				<el-button @click="dialogEvaluateVisible = false" style="margin-right: 10%">取 消</el-button>
				<el-button type="primary" @click="dialogEvaluateVisible = false">确 定</el-button>
			</div>
	</el-dialog>
	<el-dialog title="评审详情" :visible.sync="dialogFormVisible" style="text-align:left; font-weight: bolder;">
			<el-form :model="form">
				<el-row :gutter="20">
					<el-col :span="10">
						<el-form-item label="评审标题" :label-width="formLabelWidth">
							<el-input v-model="form.name" auto-complete="off" />
						</el-form-item>
					</el-col>
					<el-col :span="10">
						<el-form-item label="提交人" :label-width="formLabelWidth">
							<el-input v-model="form.name" auto-complete="off" />
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="10">
						<el-form-item label="评审编号" :label-width="formLabelWidth">
							<el-input v-model="form.name" auto-complete="off" />
						</el-form-item>
					</el-col>
					<el-col :span="10">
						<el-form-item label="提交时间" :label-width="formLabelWidth">
							<el-input v-model="form.name" auto-complete="off" />
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="15">
						<el-form-item label="评审内容" :label-width="formLabelWidth">
							<el-input type="textarea" class="input_textarea" v-model="form.name" :rows="10" style="width:87%;" auto-complete="off" />
						</el-form-item>
					</el-col>
					<el-col :span="5">
						<el-button type="primary" @click="dialogFormVisible = false" >附件下载</el-button>
					</el-col>
				</el-row>
		</el-form>
			<div slot="footer" style="text-align: center;">
				<el-button @click="dialogFormVisible = false" style="margin-right: 10%">取 消</el-button>
				<el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
			</div>
		</el-dialog>
	
	
<!-- 	<ex-review-detail :form="form" :dialogFormVisible="dialogFormVisible" @closeDialog="closeDialog"></ex-review-detail> -->
	
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
import exReviewDetail from '@/view/review/components/exReviewDetail';
export default {
	components:{
		  exReviewDetail
	},
  
  data() {
    return { 
      loading: false,  
      tableData: [
		  {projectCode:"111"}
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
	  dialogEvaluateVisible:false,
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
   // this.getView();
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
	  handleEvaluate(row){
		  this.dialogEvaluateVisible = true;
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

