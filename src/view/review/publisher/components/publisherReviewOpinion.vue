<template>
    <el-dialog title="评审材料意见" :visible.sync="dialogOpinionVisible" :before-close="changeVisible"
               style="width:100%;text-align:left; font-weight: bolder;">
        <el-form :model="form" v-loading="loading">
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-form-item label="项目名称" :label-width="formLabelWidth">
                        <el-input v-model="form.projectName " auto-complete="off"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="项目编号" :label-width="formLabelWidth">
                        <el-input v-model="form.projectCode " auto-complete="off"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="开始时间" :label-width="formLabelWidth">
                        <el-input v-model="form.gmtCreate " auto-complete="off"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-form-item label="评审标题" :label-width="formLabelWidth">
                        <el-input v-model="form.title" auto-complete="off"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="提交人" :label-width="formLabelWidth">
                        <el-input v-model="form.userName " auto-complete="off"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-button @click="insertNewOpinion" type="primary" size="medium"
                               style="margin-left: 30%">添加新的意见
                    </el-button>
                </el-col>
            </el-row>
            <el-row>
                <el-table :data="form.reviewOpinionList " :header-cell-style="rowClass">
                    <el-table-column prop="id" label="意见编号" align="center"></el-table-column>
                    <el-table-column prop="submitTime" label="提交日期" align="center"></el-table-column>
                    <el-table-column prop="deadline" label="回复截止日期" align="center"></el-table-column>
                    <el-table-column prop="details" label="意见详情" align="center"></el-table-column>
                    <el-table-column prop="writeBack" label="回复详情" align="center"></el-table-column>
                </el-table>
            </el-row>
        </el-form>
        <el-dialog width="30%" :visible.sync="innerVisible" append-to-body center>
            <el-row :gutter="10" style="margin-bottom: 30px;">
                <el-col :span="6"><span>回复截止日期:</span></el-col>
                <el-col :span="18">
                    <el-date-picker
                            v-model="ruleForm.deadline"
                            type="date"
                            :picker-options="endDatePickerForDeadLine"
                            placeholder="选择日期">
                    </el-date-picker>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="6"><span>新的意见: </span></el-col>
                <el-col :span="18">
                    <el-input
                            v-model="ruleForm.details"
                            type="textarea"
                            :rows="2"
                            maxlength="100"
                            show-word-limit
                            placeholder="请输入内容"/>
                </el-col>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button @click="innerVisible = false" style="margin-right: 30px;">取 消</el-button>
                <el-button type="primary" @click="submitOpinion" v-prevent-click>提交</el-button>
            </div>
        </el-dialog>
    </el-dialog>
</template>

<script>
    import {httpGet, httpPost, httpPut} from '@/utils/http.js';
    import {successTips, errTips} from '@/utils/tips.js';

    export default {
        name: "publisherReviewOpinion",
        data() {
            return {
                endDatePickerForDeadLine: { //截止日期不能早于当下时间
                    disabledDate(time) {
                        return time.getTime() <= new Date().getTime() - 8.64e6;
                    }
                },
                formLabelWidth: '100px',
                endDate: '',
                innerVisible: false,
                ruleForm: {
                    deadline: "",
                    details: "",
                    reviewInfoId: null
                }
            }
        },
        props: {
            form: {
                type: Object,
                default: {}
            },
            dialogOpinionVisible: {
                type: Boolean,
                default: false,
            },
            loading: {
                type: Boolean,
                default: false,
            }
        },
        methods: {
            changeVisible() {
                this.$emit('closeOpinionDialog');
            },
            insertNewOpinion() {
                this.innerVisible = true;
            },
            submitOpinion() {
                this.ruleForm.reviewInfoId = this.form.id;
                //post /v1/authorization/review/opinion/insert
                httpPost('/v1/authorization/review/opinion/insert', this.ruleForm).then(results => {
                    const {data, msg, httpCode} = results.data;
                    if (httpCode === 200) {
                        successTips("新增意见成功！");
                        this.ruleForm = "";
                        this.innerVisible = false;
                        this.changeVisible();
                    } else {
                        errTips(msg);
                    }
                })

                //提交意见
            },
            rowClass() {
                return "background:#F4F6F9;";
            }
        },

    }
</script>

<style scoped>

</style>

