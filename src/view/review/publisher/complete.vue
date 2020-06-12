<template>
    <!-- <h1>publishercomplete</h1> -->
    <div>
		<div style="padding-left: 10px;">
		<el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 130%;">
		  <el-breadcrumb-item :to="{ path: '/publisherIndex' }">项目发布者</el-breadcrumb-item>
		  <el-breadcrumb-item>已完成</el-breadcrumb-item>
		
		</el-breadcrumb>
		</div>
        <el-table v-loading="loading" :data="tableData" style="width:1000px;margin:20px auto"
                  :header-cell-style="rowClass">
            <el-table-column fixed prop="projectCode" label="项目编号" align="center">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.projectCode" placement="top-start">
                        <span class="tablehidden">{{ scope.row.projectCode }}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="projectName" label="项目名称" align="center">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.projectName">
                        <span class="tablehidden">{{ scope.row.projectName }}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="title" label="评审标题" align="center">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.title">
                        <span class="tablehidden">{{ scope.row.title }}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="gmtCreate" label="开始时间" align="center"></el-table-column>
            <el-table-column prop="deadline" label="截止时间" align="center"></el-table-column>
            <el-table-column prop="result" label="结果" align="center">
				<template slot-scope="scope">
				  <span v-if="scope.row.result==1">通过</span>
				  <span v-if="scope.row.result==0">未通过</span>
				  
				</template>
			</el-table-column>
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
    <div class="bid_footer">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="pageData.pageNo"
        :total="totalPage"
        layout="prev, pager, next, jumper"
      ></el-pagination>
    </div>
	</div>
</template>

<script>
    import {httpGet, httpDelete} from "@/utils/http.js";
    import {message, successTips, errTips} from "@/utils/tips.js";
    import reviewEvaluation from '@/view/review/components/reviewEvaluation'
import { specificDate } from '@/utils/getDate.js';
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
                tableData: [],
                    pageData: {
                      pageNo: 1,
                      pageSize: 10,
                      orderBy: "id",
                      orderType: "DESC",
                      role:1,
                      status:4
                    },
                    totalPage: 0,
               
            };
        },
        created: function() {
			this.getView();
        },
        computed: {
        },
        methods: {
			//获取页面数据
			getView(val = this.pageData) {
			  this.loading = true;
			   
			  //get /v1/authorization/review/review/search 
			  httpGet("/v1/authorization/review/review/search", val).then(results => {
			    const { httpCode, msg, data } = results.data;
			    if (httpCode == 200) {
			      this.pageNo = data.pageNo;
			      this.totalPage = parseInt(data.totalPage + '0');
			      
			      let list = data.reviewInfoList ;
			      for (let i of list) {
			      	
			      	i.gmtCreate = specificDate(i.gmtCreate);
			      	i.deadline = specificDate(i.deadline);
			      }
			      Object.assign(this.pageData, val);
			      this.$set(this, 'tableData', list);
			    } else if (msg == "该条件暂无数据") {
			      this.tableData = [];
			      message("该条件暂无数据");
			    } else if (httpCode !== 401) {
			      errTips(msg);
			    }
			    this.loading = false;
			  });
			},
			
			handleCurrentChange(val) {
			  this.pageData.pageNo = val;
			  this.getView();
			},
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
	.bid_footer {
		 text-align: center;
	    margin-top: 20px;
	    .el-input__inner {
	      width: 70px;
	    }
	    .el-pagination {
	      
	      margin: 50px 0 50px 0;
	    }
	  }
</style>

