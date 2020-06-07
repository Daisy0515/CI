<!--评审任务查看评价的对话框的组件-->
<template>
    <el-dialog title="评价详情" :visible.sync="dialogEvaluationVisible" :before-close="changeVisible"
               style="width:100%;text-align:left; font-weight: bolder;">
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
                        <el-input v-model="form.title" auto-complete="off" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-form-item label="开始时间" :label-width="formLabelWidth">
                        <el-input v-model="form.date1" auto-complete="off"  />
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
                <el-table :data="form.fileTable" border >
                    <el-table-column prop="auditor" label="审核人" > </el-table-column>
                    <el-table-column prop="isPass" label="是否通过" > </el-table-column>
                    <el-table-column prop="score" label="评分" > </el-table-column>
                </el-table>
            </el-row>
        </el-form>
    </el-dialog>
</template>

<script>
    export default {
        name: "reviewEvaluation",
        props:['form','formLabelWidth','dialogEvaluationVisible'],
        methods:{
            changeVisible(){
                this.$emit('closeEvaluationDialog');
            },
        },
        data(){
            return{

            }
        }
    }
</script>

<style scoped>

</style>

