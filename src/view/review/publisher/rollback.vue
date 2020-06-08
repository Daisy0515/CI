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
                    <el-button @click="handleClickOpinion(scope.row)" type="text" size="medium"
                    ><i class="el-icon-document"></i>意见回复</el-button>
                    <el-button @click="handleAccept(scope.row)" type="text" size="medium"
                    ><i class="el-icon-check"></i>接受
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <review-detail-dialog :form="form" :formLabelWidth="formLabelWidth"
                              :dialogFormVisible="dialogFormVisible"
                              @closeDialog="closeDialog"></review-detail-dialog>
        <publisher-review-opinion :form="formOpinion" :formLabelWidth="formLabelWidth"
                                  :dialogOpinionVisible="dialogOpinionVisible"
                                  @closeOpinionDialog="closeOpinionDialog"></publisher-review-opinion>
    </div>
</template>

<script>
    import {httpGet, httpDelete} from "@/utils/http.js";
    import { MessageBox } from 'element-ui';
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
            handleAccept(row) {
                MessageBox.confirm('评审材料是否已经齐全，如若齐全，点击确认进入评审中状态', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    successTips('提交成功');
                }).catch(() => {
                    errTips('已取消');
                });
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

