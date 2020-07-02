<template>
    <el-dialog title="评审材料意见" :visible.sync="dialogOpinionVisible" :before-close="changeVisible"
               style="width:100%;text-align:left; font-weight: bolder;">
        <el-form :model="localForm" v-loading="loading">
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-form-item label="项目名称" :label-width="formLabelWidth">
                        <el-input v-model="localForm.projectName" auto-complete="off" :readonly="isReadOnly"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="项目编号" :label-width="formLabelWidth">
                        <el-input v-model="localForm.projectCode" auto-complete="off" :readonly="isReadOnly"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="开始时间" :label-width="formLabelWidth">
                        <el-input v-model="localForm.gmtCreate" auto-complete="off"  :readonly="isReadOnly"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-form-item label="评审标题" :label-width="formLabelWidth">
                        <el-input v-model="localForm.title" auto-complete="off" :readonly="isReadOnly"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row >
                <el-table :data="localForm.reviewOpinionList " border >
                    <el-table-column prop="id" label="意见编号" > </el-table-column>
                    <el-table-column prop="submitTime" label="提交日期"></el-table-column>
                    <el-table-column prop="deadline" label="回复截止日期"></el-table-column>
                    <el-table-column prop="details" label="意见详情"></el-table-column>
                    <el-table-column prop="writeBack" label="回复详情"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope" style="display: inline">
                            <el-button @click="insertReply(scope.row)" type="text" size="medium" style="margin-left: 30%"
                                       v-if="scope.row.writeBack===null" >添加回复</el-button>
                            <el-button @click="" type="text" size="medium" style="margin-left: 30%;color: black;" v-else >已回复</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>
        </el-form>
        <el-dialog width="30%" :visible.sync="innerVisible" append-to-body>
            <el-row :gutter="10">
                <el-col :span="4"><span>回复内容: </span></el-col>
                <el-col :span="20">
                    <el-input v-model="OpinionReply" type="textarea" :rows="2" placeholder="请输入内容"/>
                </el-col>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button @click="innerVisible = false">取 消</el-button>
                <el-button type="primary" @click="replyOpinion" v-prevent-click>提交</el-button>
            </div>
        </el-dialog>
    </el-dialog>
</template>

<script>
    import { httpPut } from "@/utils/http.js";
    import {errTips, successTips} from "@/utils/tips.js";

    export default {
        name: "reviewOpinion",
        data(){
            return {
                innerVisible:false,
                isReadOnly:true,
                localForm:this.form,//form的内容在当前组件里面会被修改，会出现警告，需要在本地
                selectedRow:null,//点击查看评价时，选中的行信息
                OpinionReply:null,//针对意见的回复
            }
        },
        watch:{
            form:function(val){
                this.localForm = val;//父组件一开始的form是空的，向服务器请求数据后填充form，监听父组件传递过来的form是否发生变化
            }
        },
        props:['form','formLabelWidth','dialogOpinionVisible','loading'],
        methods:{
            changeVisible(){
                this.$emit('closeOpinionDialog');
            },
            insertReply(row){
                this.innerVisible = true;
                this.selectedRow = row;
            },
            replyOpinion(){
                this.innerVisible = false;
                //提交回复
                let param = {"id": this.selectedRow.id,"writeBack": this.OpinionReply};
                httpPut("/v1/authorization/review/writeback/insert",param).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode == 200) {
                        successTips("提交回复成功！");
                        this.OpinionReply = null;
                        this.$emit('updateOpinion',{'id':this.form.id});//提交成功，更新意见详情页面的信息
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                });

            },
        },

    }
</script>

<style scoped>

</style>
