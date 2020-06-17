<!--评审任务查看评价的对话框的组件-->
<template>
    <el-dialog title="评价详情" :visible.sync="dialogEvaluationVisible" :before-close="changeVisible"
               style="width:100%;text-align:left; font-weight: bolder;">
        <el-form :model="form" v-loading="loading">
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-form-item label="项目名称" :label-width="formLabelWidth">
                        <el-input v-model="form.projectName" auto-complete="off" />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="项目编号" :label-width="formLabelWidth">
                        <el-input v-model="form.projectCode " auto-complete="off" />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="评审标题" :label-width="formLabelWidth">
                        <el-input v-model="form.title" auto-complete="off" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-form-item label="开始时间" :label-width="formLabelWidth">
                        <el-input v-model="form.gmtCreate " auto-complete="off"  />
                    </el-form-item>
                </el-col>
                <el-col :span="16">
                    <el-form-item label="评价内容" :label-width="formLabelWidth">
                        <el-input
                                v-model="form.content"
                                type="textarea"
                                :rows="2"
                                placeholder=""
                        />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-table :data="form.fileTable" :header-cell-style="rowClass" >
                    <el-table-column prop="auditor" label="审核人" align="center"> </el-table-column>
                    <el-table-column prop="isPass" label="是否通过" align="center">
						<template slot-scope="scope">
							<span class="tablehidden" v-if="scope.row.isPass == 1">通过</span>
							<span class="tablehidden" v-if="scope.row.isPass == 0">未通过</span>
						</template>
					</el-table-column>
                    <el-table-column prop="score" label="评分" align="center"> </el-table-column>
                </el-table>
            </el-row>
        </el-form>
    </el-dialog>
</template>

<script>
    export default {
        name: "reviewEvaluation",
        props:['form','formLabelWidth','dialogEvaluationVisible','loading'],
        methods:{
            changeVisible(){
                this.$emit('closeEvaluationDialog');
            },
			rowClass() {
			    return "background:#F4F6F9;";
			}
        },
        data(){
            return{

            }
        }
    }
</script>

<style scoped>

</style>

