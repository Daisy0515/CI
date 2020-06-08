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
                    <el-button @click="handleRollBack(scope.row)" type="text" size="medium"
                    ><i class="el-icon-close"></i>打回
                    </el-button>
                    <el-button @click="handleAccept(scope.row)" type="text" size="medium"
                    ><i class="el-icon-check"></i>接受
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <review-detail-dialog :form="form" :formLabelWidth="formLabelWidth"
                              :dialogFormVisible="dialogFormVisible"
                              @closeDialog="closeDialog"></review-detail-dialog>
        <el-dialog title="打回评审" :visible.sync="dialogRollbackVisible"
                   style="text-align:left; font-weight: bolder;">
            <el-form :model="form">
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="添加意见" :label-width="formLabelWidth">
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
            <div slot="footer" style="margin-right: 35%">
                <el-button @click="dialogRollbackVisible=false" style="margin-right: 10%">取 消</el-button>
                <el-button type="primary" @click="submitRollback">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {httpGet, httpDelete} from "@/utils/http.js";

    import {message, successTips, errTips,} from "@/utils/tips.js";
    import {MessageBox} from 'element-ui';
    import reviewDetailDialog from '@/view/review/components/reviewDetailDialog';

    export default {
        components: {
            reviewDetailDialog,
        },
        data() {
            return {
                loading: false,
                dialogFormVisible: false,
                dialogRollbackVisible: false,
                formLabelWidth: '100px',
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
            handleRollBack(row) {
                this.dialogRollbackVisible = true;
            },
            closeDialog() {
                this.dialogFormVisible = false;
            },
            handleRollback(row) {
                this.dialogRollbackVisible = false;
            },
            submitRollback(){
                this.dialogRollbackVisible = false;
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

