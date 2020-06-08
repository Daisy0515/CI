<template>
    <!-- <h1>publishercomplete</h1> -->
    <div>
        <el-table v-loading="loading" :data="tableData" style="width:1000px;margin:0 auto"
                  :header-cell-style="rowClass">
            <el-table-column fixed prop="projectCode" label="项目编号" align="center">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.projectCode" placement="top-start">
                        <span class="tablehidden">{{ scope.row.projectCode }}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="项目名称" align="center">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.projectName">
                        <span class="tablehidden">{{ scope.row.projectName }}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="content" label="评审标题" align="center">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.content">
                        <span class="tablehidden">{{ scope.row.content }}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="gmtCreate" label="开始时间" align="center"></el-table-column>
            <el-table-column prop="gmtModified" label="截止时间" align="center"></el-table-column>

            <el-table-column prop="accomplishProgress" label="操作" align="center" width="280px">
                <template slot-scope="scope">
                    <el-button @click="handleClickDetail(scope.row)" type="text" size="medium"
                    ><i class="el-icon-search"></i>查看详情
                    </el-button>
                    <el-button @click="handleClickOpinion(scope.row)" type="text" size="medium" style="margin-right: 10px"
                    ><i class="el-icon-document"></i>意见</el-button>
                    <el-button @click="handleClickEvaluate(scope.row)" type="text" size="medium" style="margin-right: 10px"
                    ><i class="el-icon-edit"></i>评价</el-button>
                    <!-- <router-link :to="{path:'bidView', query:{id:scope.row.id}}">
                      <i class="el-icon-message"></i>
                      意见回复
                    </router-link>
                    <router-link
                      :to="{ path: 'taskIndex', query: { projectId: scope.row.id } }"

                    >
                      <i class="el-icon-edit"></i>
                      修改提交
                    </router-link> -->
                </template>
            </el-table-column>
        </el-table>
        <review-detail-dialog :form="form" :formLabelWidth="formLabelWidth"
                              :dialogFormVisible="dialogFormVisible"
                              @closeDialog="closeDialog"></review-detail-dialog>
        <publisher-review-opinion :form="formOpinion" :formLabelWidth="formLabelWidth"
                                  :dialogOpinionVisible="dialogOpinionVisible"
                                  @closeOpinionDialog="closeOpinionDialog"></publisher-review-opinion>
        <el-dialog title="tips:提交评价，代表本次评审结束，感谢您的评审" :visible.sync="dialogEvaluateVisible" style="width:100%;text-align:left; font-weight: bolder;" center>
            <el-form :model="form">
                <el-row :gutter="20">
                    <el-col :span="10">
                        <el-form-item label="评审标题" :label-width="formLabelWidth">
                            <el-input v-model="form.name" auto-complete="off" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="是否通过" :label-width="formLabelWidth">
                            <el-radio v-model="isPass" label="1">通过</el-radio>
                            <el-radio v-model="isPass" label="2">未通过</el-radio>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="10">
                        <el-form-item label="评审得分" :label-width="formLabelWidth">
                            <el-input v-model="form.score" auto-complete="off" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="评价内容" :label-width="formLabelWidth">
                            <el-input
                                    v-model="form.content"
                                    type="textarea"
                                    :rows="3"
                                    placeholder="请输入内容"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer" >
                <el-button @click="dialogEvaluateVisible = false" style="margin-right: 30px;">取 消</el-button>
                <el-button type="primary" @click="submitEvaluate">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {httpGet, httpDelete} from "@/utils/http.js";
    import {message, successTips, errTips} from "@/utils/tips.js";
    import reviewDetailDialog from '@/view/review/components/reviewDetailDialog';
    import publisherReviewOpinion from '@/view/review/components/publisherReviewOpinion';
    export default {
        components: {
            reviewDetailDialog,
            publisherReviewOpinion,
        },
        data() {
            return {
                loading: false,
                dialogFormVisible: false,
                dialogOpinionVisible:false,
                dialogEvaluateVisible:false,
                formLabelWidth: '100px',
                formOpinion: {//表单中的信息
                    name: '',
                    id:'',
                    title:'',
                    purpose: '',
                    date1: '',
                    date2: '',
                    content: '',
                    daysBeforeDeadline:'',
                    opinions:[{
                        opinionId:'yj123456789',
                        submitDate:'2020-04-05',
                        endDate:'2020-04-10',
                        opinionDetail:'论文引用格式有问题',
                    }],
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
                },
                form: {//表单中的信息
                    name: '',
                    purpose: '',
                    date1: '',
                    date2: '',
                    content: '',
                    daysBeforeDeadline: '',
                    fileTable: [{
                        filename: '项目申请书',
                        url: ''
                    }],
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
                },
                tableData: [
                    {projectCode: 111},
                ],
            };
        },
        created: function () {

        },
        computed: {},
        methods: {
            handleClickDetail() {
                this.dialogFormVisible = true;
            },
            closeDialog() {
                this.dialogFormVisible = false;
            },
            handleClickOpinion(row){
                this.dialogOpinionVisible = true;
            },
            closeOpinionDialog(){
                this.dialogOpinionVisible = false;
            },
            handleClickEvaluate(row){
                this.dialogEvaluateVisible = true;
            },
            closeEvaluateDialog(){
                this.dialogEvaluateVisible = false;
            },
            submitEvaluate(){
                this.dialogEvaluateVisible = false;
                //提交评价
            },
            rowClass() {
                return "background:#F4F6F9;";
            }
        }
    };

</script>

<style>
    @import "/src/assets/scss/myTable.scss";
</style>

