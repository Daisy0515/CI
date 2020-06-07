<template>
	<div>
	<!-- <h1>publishercomplete</h1> -->
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
				<el-button @click="handleClickDetail(scope.row)" type="text" size="medium"
				><i class="el-icon-search"></i>查看详情</el-button>
				<el-button @click="handleClickOpinion(scope.row)" type="text" size="medium"
				><i class="el-icon-document"></i>意见回复</el-button>
				<el-button @click="handleClickSubmit(scope.row)" type="text" size="medium"
				><i class="el-icon-refresh"></i>修改提交</el-button>
                <!--				<router-link :to="{path:'bidView', query:{id:scope.row.id}}">
				  <i class="el-icon-search"></i>
				  查看详情
				</router-link>
				<router-link :to="{path:'bidView', query:{id:scope.row.id}}">
				  <i class="el-icon-message"></i>
				  意见回复
				</router-link>
				<router-link
				  :to="{ path: 'taskIndex', query: { projectId: scope.row.id } }"

				>
				  <i class="el-icon-edit"></i>
				  修改提交
				</router-link>-->
				<!-- <router-link :to="{path:'bidView', query:{id:scope.row.id}}">
				  <i class="el-icon-message"></i>
				  意见
				</router-link>
				<router-link
				  :to="{ path: 'taskIndex', query: { projectId: scope.row.id } }"

				>
				  <i class="el-icon-edit"></i>
				  评价
				</router-link> -->
			</template>
		</el-table-column>
	</el-table>
	<review-detail-dialog :form="form" :formLabelWidth="formLabelWidth"
						  :dialogFormVisible="dialogFormVisible"
						  @closeDialog="closeDialog"></review-detail-dialog>
	<submit-review :form="formSubmit" :formLabelWidth="formLabelWidth"  :title="submitTitle" :isShowSubmitHistory="isShowSubmitHistory"
				   :dialogSubmitVisible="dialogSubmitVisible"
				   @closeSubmitDialog="closeSubmitDialog"></submit-review>
	<review-opinion :form="formOpinion" :formLabelWidth="formLabelWidth"
					:dialogOpinionVisible="dialogOpinionVisible"
					@closeOpinionDialog="closeOpinionDialog"></review-opinion>
	</div>

</template>

<script>
import { httpGet, httpDelete } from "@/utils/http.js";

import { message, successTips, errTips } from "@/utils/tips.js";
import reviewDetailDialog from '@/view/review/components/reviewDetailDialog';
import submitReview from '@/view/review/components/submitReview';
import reviewOpinion from '@/view/review/components/reviewOpinion'
export default {
  components: {reviewDetailDialog,submitReview,reviewOpinion},
  data() {
	  return {
		  submitTitle:'修改提交',
		  isShowSubmitHistory:true,//在修改提交评审的表单里是否显示提交历史
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
				  submitDate:'2020-04-11',
				  filename:'项目申请书',
				  url:''
			  }],
			  delivery: false,
			  type: [],
			  resource: '',
			  desc: ''
		  },
		  formOpinion: {//表单中的信息
			  name: '',
			  id:'',
			  title:'',
			  purpose: '',
			  date1: '',
			  date2: '',
			  content: '',
			  daysBeforeDeadline:'',
			  opinions:[{
				  opinionId:'yj123456789',
				  submitDate:'2020-04-05',
				  endDate:'2020-04-10',
				  opinionDetail:'论文引用格式有问题',
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
	  handleClickOpinion(row){
		  this.dialogOpinionVisible = true;
	  },
	  closeDialog(){
		  this.dialogFormVisible = false;
	  },
	  closeSubmitDialog(){
		  this.dialogSubmitVisible = false;
	  },
	  closeOpinionDialog(){
		  this.dialogOpinionVisible = false;
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

