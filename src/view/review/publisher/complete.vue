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
            <el-table-column prop="statusName" label="结果" align="center"></el-table-column>
            <el-table-column prop="accomplishProgress" label="操作" align="center">
                <template slot-scope="scope">
                    <el-button @click="handleEvaluateDetail(scope.row)" type="text" size="medium"
                    ><i class="el-icon-search"></i>查看评价</el-button>
                </template>
            </el-table-column>
        </el-table>
        <review-evaluation :form="form" :formLabelWidth="formLabelWidth"
                           :dialogEvaluationVisible="dialogEvaluationVisible"
                           @closeEvaluationDialog="closeEvaluationDialog"></review-evaluation>
    </div>
</template>

<script>
    import {httpGet, httpDelete} from "@/utils/http.js";
    import {message, successTips, errTips} from "@/utils/tips.js";
    import reviewEvaluation from '@/view/review/components/reviewEvaluation'

    export default {
        components:{reviewEvaluation},
        data() {
            return {
                loading: false,
                dialogEvaluationVisible:false,
                formLabelWidth:'100px',
                form:{
                    fileTable:[{
                        auditor:"ABC",
                        isPass: '是',
                        score: '70'
                    }],
                },
                tableData: [
                    {projectCode:111}
                ],
            };
        },
        created: function() {
        },
        computed: {
        },
        methods: {
            handleEvaluateDetail(row){
                this.dialogEvaluationVisible = true;
            },
            closeEvaluationDialog(){
                this.dialogEvaluationVisible = false;
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

