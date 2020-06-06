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
		<el-table-column prop="name" label="项目名称" align="center">
			<template slot-scope="scope">
				<el-tooltip class="item" effect="dark" :content="scope.row.projectName" >
					<span class="tablehidden">{{ scope.row.projectName }}</span>
				</el-tooltip>
			</template>
		</el-table-column>
		<el-table-column prop="content" label="评审标题" align="center">
			<template slot-scope="scope">
				<el-tooltip class="item" effect="dark" :content="scope.row.content" >
					<span class="tablehidden">{{ scope.row.content }}</span>
				</el-tooltip>
			</template>
		</el-table-column>
		<el-table-column prop="gmtCreate" label="开始时间" align="center"></el-table-column>
		<el-table-column prop="gmtModified" label="截止时间" align="center"></el-table-column>
	
		<el-table-column prop="accomplishProgress" label="操作" align="center" width="280px">
			<template slot-scope="scope">
				<!-- <router-link :to="{path:'bidView', query:{id:scope.row.id}}">
				  <i class="el-icon-search"></i>
				  查看详情
				</router-link>
				<router-link :to="{path:'bidView', query:{id:scope.row.id}}">
				  <i class="el-icon-document"></i>
				  查看意见
				</router-link>
				<router-link
				  :to="{ path: 'taskIndex', query: { projectId: scope.row.id } }"
				  
				>
				  <i class="el-icon-refresh"></i>
				  重新提交
				</router-link> -->
				<el-button @click="handleClickDetail(scope.row)" type="text" size="medium"
						   ><i class="el-icon-search"></i>查看详情</el-button>
				<el-button @click="handleClickOpinion(scope.row)" type="text" size="medium"
						   ><i class="el-icon-document"></i>查看意见</el-button>
				<el-button @click="handleClickSubmit(scope.row)" type="text" size="medium"
						   ><i class="el-icon-refresh"></i>重新提交</el-button>
				<!-- <router-link :to="{path:'bidView', query:{id:scope.row.id}}">
				  <i class="el-icon-document"></i>
				  意见回复
				</router-link>
				<router-link
				  :to="{ path: 'taskIndex', query: { projectId: scope.row.id } }"
				  
				>
				  <i class="el-icon-check"></i>
				  接受
				</router-link> -->
			</template>
		</el-table-column>
	</el-table>
	<review-detail-dialog :form="form" :formLabelWidth="formLabelWidth"
						  :dialogFormVisible="dialogFormVisible"
						  @closeDialog="closeDialog"></review-detail-dialog>
	<submit-review :form="formSubmit" :formLabelWidth="formLabelWidth"
				   :dialogSubmitVisible="dialogSubmitVisible"
				   @closeSubmitDialog="closeSubmitDialog"></submit-review>
	</div>
</template>

<script>
import { httpGet, httpDelete } from "@/utils/http.js";

import { message, successTips, errTips } from "@/utils/tips.js";
import reviewDetailDialog from '@/view/review/components/reviewDetailDialog';
import submitReview from '@/view/review/components/submitReview';

export default {
  components: {reviewDetailDialog,submitReview},
  data() {
    return {
		dialogFormVisible: false,//控制表单对话框是否显示
		dialogSubmitVisible: false,//控制重新提交框是否显示
		dialogOpinionVisible: false,//控制意见详情框是否显示
      loading: false,  
      tableData: [
		  {projectCode:111}
	  ],  
	  form: {//表单中的信息
	  	name: '',
	  	purpose: '',
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
	  formSubmit: {//表单中的信息
	  	name: '',
	  	purpose: '',
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
	  formLabelWidth: '100px'//控制表单中输入框的尺寸
    };
  },
  created: function() {
    
  },
  computed: {
    
  },
  methods: { 
	handleClickDetail(row) {
		this.dialogFormVisible = true;
	},
	handleClickSubmit(row){
		this.dialogSubmitVisible = true;
	},
	closeDialog(){
		this.dialogFormVisible = false;
	},
	closeSubmitDialog(){
		this.dialogSubmitVisible = false;
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
</style>

