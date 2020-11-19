<!--专家搜索评审统计的对话框的组件-->
<template>
    <el-dialog title="评审统计" :visible.sync="dialogFormVisible" :before-close="changeVisible"
               style="width:100%;text-align:left; font-weight: bolder;">

        <el-card class="left-card-menu">
            <h2 style="text-align: left;font-weight: bolder;margin-top: 2%;">当前评审统计</h2>

            <el-row :gutter="20">
                <el-table :data="tableData" style="width:900px;margin:20px auto" :header-cell-style="rowClass">
                    <el-table-column fixed prop="finallyAcceptReviewTime" label="最近一次接受评审" align="center">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" :content="scope.row.finallyAcceptReviewTime"
                                        placement="top-start">
                                <span class="tablehidden">{{ scope.row.finallyAcceptReviewTime }}</span>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column prop="underwayReview" label="进行中的评审" align="center"></el-table-column>
                    <el-table-column prop="unfinishedReview" label="未完成的评审" align="center"></el-table-column>
                </el-table>

            </el-row>

            <h2 style="text-align: left;font-weight: bolder;margin-top: 2%;margin-bottom: 2%;">历史评审邀请统计</h2>

            <el-row :gutter="20">
                <el-table :data="tableData" style="width:900px;margin:20px auto" :header-cell-style="rowClass">
                    <el-table-column fixed prop="inviteSum" label="总共邀请次数" align="center"></el-table-column>
                    <el-table-column prop="inviteAccept" label="接受评审" align="center"></el-table-column>
                    <el-table-column prop="inviteRefuse" label="拒绝评审" align="center"></el-table-column>
                    <el-table-column prop="inviteWithdraw" label="撤回邀请" align="center"></el-table-column>
                    <el-table-column prop="inviteAcceptFront" label="接受评审前被中止" align="center"></el-table-column>
                </el-table>
            </el-row>

            <h2 style="text-align: left;font-weight: bolder;margin-top: 2%;margin-bottom: 2%;">历史评审表现汇总</h2>
            <el-row :gutter="20">
                <el-table :data="tableData" style="width:900px;margin:20px auto" :header-cell-style="rowClass">
                    <el-table-column fixed prop="accomplishReviewSum" label="总共完成的评审" align="center"></el-table-column>
                    <el-table-column prop="onTimeAccomplishReview" label="按时完成评审次数" align="center"></el-table-column>
                    <el-table-column prop="postponeAccomplishReview" label="延期完成评审次数" align="center"></el-table-column>
                    <el-table-column prop="withdrawAllocatedMission" label="撤回已分配任务" align="center"></el-table-column>
                    <el-table-column prop="inviteAcceptRear" label="接受评审后被中止" align="center"></el-table-column>
                    <el-table-column prop="finallyAccomplishReviewTime" label="最近一次完成评审的日期" align="center">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" :content="scope.row.finallyAccomplishReviewTime">
                                <span class="tablehidden">{{ scope.row.finallyAccomplishReviewTime }}</span>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>


            </el-row>
            <h2 style="text-align: left;font-weight: bolder;margin-top: 2%;margin-bottom: 2%;">历史评审平均表现</h2>
            <el-row :gutter="20">
                <el-table :data="tableData" style="width:900px;margin:20px auto" :header-cell-style="rowClass">
                    <el-table-column fixed prop="averageRespondInviteTime" label="平均回应邀请的时间"
                                     align="center"></el-table-column>
                    <el-table-column prop="averageAccomplishReviewTime" label="平均完成评审的时间"
                                     align="center"></el-table-column>
                    <el-table-column prop="averagePostponeDay" label="平均延期天数" align="center"></el-table-column>
                    <el-table-column prop="warn" label="提醒次数" align="center"></el-table-column>
                    <el-table-column prop="averageScore" label="评审平均分数" align="center"></el-table-column>
                </el-table>
            </el-row>
            <h2 style="text-align: left;font-weight: bolder;margin-top: 2%;margin-bottom: 2%;">评审专家建议汇总</h2>
            <el-row :gutter="20">
                <el-table :data="tableData" style="width:900px;margin:20px auto" :header-cell-style="rowClass">
                    <el-table-column fixed prop="pass" label="通过" align="center"></el-table-column>
                    <el-table-column prop="modification" label="通过需修改" align="center"></el-table-column>
                    <el-table-column prop="refuse" label="拒绝" align="center"></el-table-column>
                </el-table>
            </el-row>
        </el-card>
    </el-dialog>
</template>

<script>
    export default {
        name: "reviewStatistic",
        props: {
            tableData: {
                type: Array,
                default: null,
            },
            dialogFormVisible: {
                type: Boolean,
                default: false,
            },
        },
        methods: {
            changeVisible() {
                this.$emit('closeDialog');
            },
            rowClass() {
                return "background:#F4F6F9;";
            }
        },
        data() {
            return {
                formLabelWidth: "80px",
                isReadOnly: true,
            }
        }
    }
</script>

<style scoped>

</style>
