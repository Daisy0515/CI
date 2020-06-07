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
			<el-table-column prop="name" label="项目名称" align="center">
				<template slot-scope="scope">
					<el-tooltip class="item" effect="dark" :content="scope.row.projectName">
						<span class="tablehidden">{{ scope.row.projectName }}</span>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column prop="content" label="评审标题" align="center">
				<template slot-scope="scope">
					<el-tooltip class="item" effect="dark" :content="scope.row.content">
						<span class="tablehidden">{{ scope.row.content }}</span>
					</el-tooltip>
				</template>
			</el-table-column>

			<el-table-column prop="statusName" label="评审阶段" align="center"></el-table-column>
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
		  <!-- <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
		  </span> -->
		</el-dialog>
		<!-- <el-dialog title="评审详情" :visible.sync="dialogFormVisible" style="width:70%;font-weight: bolder;">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
				<el-form-item label="评审标题"><el-input v-model="ruleForm.introduction" style="width:40%;"></el-input></el-form-item>

				<el-form-item label="评审目的"><el-input v-model="ruleForm.functionality" style="width:40%;"></el-input></el-form-item>

				<el-form-item label="截止时间"><el-input v-model="ruleForm.design" :rows="10" style="width:40%;"></el-input></el-form-item>

				<el-form-item label="评审内容" prop="remark">
					<el-input type="textarea" class="input_textarea " v-model="ruleForm.remark" :rows="10" style="width:50%;"></el-input>
				</el-form-item>

				<sourceUpload :uploadIndex="uploadIndex" v-on:setIdCard="setIdCard($event)" />

				<el-form-item class="cancel">
					<el-button type="primary" @click="returnDO" size="medium" style="width:150px;margin-left:25%">返回</el-button>
					<el-button type="primary" @click="submitForm('ruleForm')" size="medium" style="width:150px;margin-left:25%">保存</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	 --></div>
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
			tableData: [{ projectCode: 111 }],
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
			formLabelWidth: '260px'
		};
	},
	created: function() {},
	computed: {},
	methods: {
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
@import '/src/assets/scss/myTable.scss';
</style>
