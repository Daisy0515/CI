<!--评审任务查看详情的对话框的组件-->
<template>
    <el-dialog  title="评审详情" :visible.sync="dialogFormVisible" :before-close="changeVisible"
               style="width:100%;text-align:left; font-weight: bolder;">
        <el-form :model="form" v-loading="loading">
            <el-row :gutter="10">
                <el-col :span="8">
                    <el-form-item label="项目名称" :label-width="formLabelWidth">
                        <el-input v-model="form.projectName" auto-complete="off" :readonly="isReadOnly"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="项目编号" :label-width="formLabelWidth">
                        <el-input v-model="form.projectCode " auto-complete="off" :readonly="isReadOnly"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="评审标题" :label-width="formLabelWidth">
                        <el-input v-model="form.title" auto-complete="off" :readonly="isReadOnly"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-form-item label="评审目的" :label-width="formLabelWidth">
                        <el-input v-model="form.purpose" auto-complete="off" :readonly="isReadOnly"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="开始时间" :label-width="formLabelWidth">
                        <el-input v-model="form.gmtCreate " auto-complete="off"  :readonly="isReadOnly"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="截止时间" :label-width="formLabelWidth">
                        <el-input v-model="form.deadline " auto-complete="off" :readonly="isReadOnly"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-form-item label="截止前提醒" :label-width="formLabelWidth">
                        <el-input v-model="form.warn " auto-complete="off" placeholder="请输入天数" :readonly="isReadOnly">
						<template slot="append">天</template>
						</el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="16">
                    <el-form-item label="评审内容" :label-width="formLabelWidth">
                        <el-input v-model="form.content" type="textarea" :rows="2" placeholder="请输入内容" :readonly="isReadOnly"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col >
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
    </el-dialog>
</template>

<script>
    export default {
        name: "reviewDetailDialog",
        props:['form','formLabelWidth','dialogFormVisible','loading'],
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
