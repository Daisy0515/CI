<template>
    <el-dialog title="评审材料意见" :visible.sync="dialogOpinionVisible" :before-close="changeVisible"
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
                    <el-form-item label="开始时间" :label-width="formLabelWidth">
                        <el-input v-model="form.date1" auto-complete="off"  />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-form-item label="评审标题" :label-width="formLabelWidth">
                        <el-input v-model="form.title" auto-complete="off" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row >
                <el-table :data="form.opinions" border >
                    <el-table-column prop="opinionId" label="意见编号" > </el-table-column>
                    <el-table-column prop="submitDate" label="提交日期"></el-table-column>
                    <el-table-column prop="endDate" label="回复截止日期"></el-table-column>
                    <el-table-column prop="opinionDetail" label="意见详情"></el-table-column>
                    <el-table-column prop="replyDetail" label="回复详情"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope" style="display: inline">
                            <el-button @click="insertReply(scope.row)" type="text" size="medium"
                                       style="margin-left: 30%"
                            >添加回复</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>
        </el-form>
        <el-dialog width="30%" :visible.sync="innerVisible" append-to-body>
            <el-row gutter="10">
                <el-col span="4"><span>回复内容: </span></el-col>
                <el-col span="20">
                    <el-input
                        v-model="form.content"
                        type="textarea"
                        :rows="2"
                        placeholder="请输入内容"/>
                </el-col>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button @click="innerVisible = false">取 消</el-button>
                <el-button type="primary" @click="replyOpinion">提交</el-button>
            </div>
        </el-dialog>
    </el-dialog>
</template>

<script>
    export default {
        name: "reviewOpinion",
        data(){
            return {
                innerVisible:false,
            }
        },
        props:['form','formLabelWidth','dialogOpinionVisible'],
        methods:{
            changeVisible(){
                this.$emit('closeOpinionDialog');
            },
            insertReply(row){
                this.innerVisible = true;
            },
            replyOpinion(){
                this.innerVisible = false;
                //提交回复
            },
            handleClickFile(row){

            }
        },

    }
</script>

<style scoped>

</style>
