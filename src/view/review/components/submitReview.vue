<!--发起评审-->
<template>
    <el-dialog title="发起评审" :visible.sync="dialogSubmitVisible" :before-close="changeSubmitVisible"
               style="text-align:left; font-weight: bolder;">
        <el-form :model="form">
            <el-row :gutter="20">
                <el-col :span="10">
                    <el-form-item label="项目标题" :label-width="formLabelWidth">
                        <el-input v-model="form.name" auto-complete="off" />
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="评审类型" :label-width="formLabelWidth">
                        <el-select v-model="form.type" placeholder="请选择评审类型">
                            <el-option label="区域一" value="shanghai" />
                            <el-option label="区域二" value="beijing" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="10">
                    <el-form-item label="评审标题" :label-width="formLabelWidth">
                        <el-input v-model="form.name" auto-complete="off" />
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="评审目的" :label-width="formLabelWidth">
                        <el-input v-model="form.name" auto-complete="off" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="10">
                    <el-form-item label="截止时间" :label-width="formLabelWidth">
                        <el-date-picker
                                v-model="form.date1"
                                size="small"
                                type="date"
                                placeholder="选择日期"
                                style="width:100%"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="截止前提醒" :label-width="formLabelWidth">
                        <el-input v-model="form.date2" auto-complete="off" placeholder="请输入天数" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10">
                    <el-form-item label="评审内容" :label-width="formLabelWidth">
                        <el-input
                                v-model="form.content"
                                type="textarea"
                                :rows="3"
                                placeholder="请输入内容"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="上传附件" :label-width="formLabelWidth">
                        <el-upload
                                class="upload-demo"
                                action="https://jsonplaceholder.typicode.com/posts/"
                                :on-change="handleChange"
                                :file-list="form.fileList"
                        >
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传pdf文件，且不超过500kb</div>
                        </el-upload>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" style="margin-right: 35%">
            <el-button @click="storeReview" style="margin-right: 10%">暂存</el-button>
            <el-button type="primary" @click="submitReview">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        props:['form','formLabelWidth','dialogSubmitVisible'],
        methods:{
            changeSubmitVisible(){//传递消息给父组件
                this.$emit('closeSubmitDialog');
            },
            storeReview(){//暂存评审
                this.$emit('closeDialog');
            },
            submitReview(){//提交评审
                this.$emit('closeDialog');
            },
            handleClickFile(row){

            },
            handleChange(){

            }
        },
        name: "submitReview"
    }
</script>

<style scoped>

</style>
