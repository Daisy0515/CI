<template>
	<el-dialog title="评审详情" :visible.sync="dialogFormVisible" :before-close="changeVisible" style="text-align:left; font-weight: bolder;">
			<el-form :model="form" v-loading="loading">
				<el-row :gutter="20">
					<el-col :span="8">
						<el-form-item label="评审标题" :label-width="formLabelWidth">
							<el-input v-model="form.title" auto-complete="off" />
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="评审类型" :label-width="formLabelWidth">
							<el-input v-model="form.title" auto-complete="off" />
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="提交人" :label-width="formLabelWidth">
							<el-input v-model="form.submitName" auto-complete="off" />
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="8">
						<el-form-item label="邀请时间" :label-width="formLabelWidth">
							<el-input v-model="form.gmtCreate" auto-complete="off" />
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="截止时间" :label-width="formLabelWidth">
							<el-input v-model="form.deadline" auto-complete="off" />
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="评审内容" :label-width="formLabelWidth">
							<el-input type="textarea" class="input_textarea" v-model="form.content" :rows="10" style="width:87%;" auto-complete="off" />
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="附件下载" :label-width="formLabelWidth" style="text-align: center">
						    <el-table :data="form.resourceList" :header-cell-style="rowClass">
						        <el-table-column prop="resourceName" label="附件名称" align="center" ></el-table-column>
						        <el-table-column  prop="gmtCreate" label="上传时间" align="center"></el-table-column>
						        <el-table-column label="操作" align="center" >
						            <template slot-scope="scope">
										<a target="_Blank" :href="scope.row.resourceUrl" > 下载 </a>
						            </template>
						        </el-table-column>
						    </el-table>
						</el-form-item>
					</el-col>
				</el-row>
		</el-form>
			<div slot="footer" style="text-align: center;">
				<el-button @click="dialogFormVisible = false" style="margin-right: 10%">取 消</el-button>
				<el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
			</div>
		</el-dialog>
	
	
</template>

<script>
	export default {
	    name: "exReviewDetail",
	    props:['form','dialogFormVisible','formLabelWidth','loading'],
	    methods:{
	        changeVisible(){
	            this.$emit('closeDialog');
	        },
	        rowClass() {
	            return "background:#F4F6F9;";
	        }
	    },
	    data(){
	        return{
	            isReadOnly: true,
	        }
	    }
	}
</script>

<style scoped>
</style>
