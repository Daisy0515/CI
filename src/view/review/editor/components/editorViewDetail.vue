<!--功能：评审管理员查看评审任务详情的对话框的组件
    调用页面：editorReviewList
              submissionSearch(评审管理员：评审搜索任务)-->
<template>
    <el-dialog  title="查看详情" :visible.sync="dialogFormVisible" :before-close="changeVisible"
               style="width:100%;text-align:left; font-weight: bolder;">
        <el-form :model="form" v-loading="loading">
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-form-item label="评审标题" :label-width="formLabelWidth">
                        <el-input v-model="form.title " auto-complete="off" :readonly="isReadOnly"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="评审类型" :label-width="formLabelWidth">
                        <el-input v-model="form.type " auto-complete="off" :readonly="isReadOnly"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="评审编号" :label-width="formLabelWidth">
                        <el-input v-model="form.projectCode " auto-complete="off" :readonly="isReadOnly"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-form-item label="提交人" :label-width="formLabelWidth">
                        <el-input v-model="form.submitName " auto-complete="off" :readonly="isReadOnly"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="提交时间" :label-width="formLabelWidth">
                        <el-input v-model="form.gmtCreate " auto-complete="off"  :readonly="isReadOnly"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="更新时间" :label-width="formLabelWidth">
                        <el-input v-model="form.gmtModified  " auto-complete="off" :readonly="isReadOnly"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="16">
                    <el-form-item label="评审详情" :label-width="formLabelWidth">
                        <el-input v-model="form.content" type="textarea" :rows="6" placeholder="请输入内容" :readonly="isReadOnly"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row >
                <el-col :span="20">
                    <el-table :data="form.resourceList" border :header-cell-style="rowClass" >
                        <el-table-column prop="gmtCreate" label="上传时间"></el-table-column>
                        <el-table-column prop="resourceName" label="附件名称" :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <a target="_Blank" :href="scope.row.resourceUrl" > 下载 </a>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
        </el-form>
    </el-dialog>
</template>

<script>
    export default {
        name: "editorViewDetail",
        props:{
            form:{
                type:Object,
                default:null,
            },
            dialogFormVisible:{
                type:Boolean,
                default:false,
            },
            loading:{
                type:Boolean,
                default:false,
            }
        },
        methods:{
            changeVisible(){
                this.$emit('closeDialog');
            },
			rowClass(){
			    return "background:#F4F6F9;";
			}
        },
        data(){
            return{
                formLabelWidth:"80px",
                isReadOnly: true,
            }
        }
    }
</script>

<style scoped>

</style>
