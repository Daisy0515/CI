<template>
    <el-dialog title="评审材料意见" :visible.sync="dialogOpinionVisible" :before-close="Visible"
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
                    <el-form-item label="评审目的" :label-width="formLabelWidth">
                        <el-input v-model="form.purpose" auto-complete="off" />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="开始时间" :label-width="formLabelWidth">
                        <el-input v-model="form.date1" auto-complete="off"  />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="截止时间" :label-width="formLabelWidth">
                        <el-input v-model="form.date2" auto-complete="off" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-form-item label="截止前提醒" :label-width="formLabelWidth">
                        <el-input v-model="form.daysBeforeDeadline" auto-complete="off" placeholder="请输入天数" />
                    </el-form-item>
                </el-col>
                <el-col :span="16">
                    <el-form-item label="评审内容" :label-width="formLabelWidth">
                        <el-input
                                v-model="form.content"
                                type="textarea"
                                :rows="2"
                                placeholder="请输入内容"
                        />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10">
                    <el-form-item label="附件下载" :label-width="formLabelWidth" style="text-align: center">
                        <el-table
                                :data="form.fileTable"
                                border
                        >
                            <el-table-column
                                    prop="filename"
                                    label="附件名称"
                            >
                            </el-table-column>
                            <el-table-column
                                    label="操作"
                            >
                                <template slot-scope="scope">
                                    <el-button @click="handleClickFile(scope.row)" type="text" size="medium"
                                               style="margin-left: 30%"
                                    >下载</el-button>
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
        name: "reviewOpinion"
    }
</script>

<style scoped>

</style>
