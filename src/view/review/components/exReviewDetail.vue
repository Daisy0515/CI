<template>
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
	
	
</template>

<script>
	export default {
	    name: "exReviewDetail",
	    props:['form','dialogFormVisible'],
	    methods:{
	        changeVisible(){
	            this.$emit('closeDialog');
	        },
	        handleClickFile(row){
	
	        }
	    },
	    data(){
	        return{
	            // dialogFormVisible:false,
	            // form: {
	            //     name: '',
	            //     purpose:'',
	            //     date1: '',
	            //     date2: '',
	            //     content: '',
	            //     daysBeforeDeadline:'',
	            //     fileTable:[{
	            //         filename:'项目申请书',
	            //         url:''
	            //     }],
	            //     delivery: false,
	            //     type: [],
	            //     resource: '',
	            //     desc: ''
	            // },
	            // formLabelWidth: '100px'
	        }
	    }
	}
</script>

<style>
</style>
