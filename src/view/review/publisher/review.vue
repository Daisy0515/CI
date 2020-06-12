<template>
    <!-- <h1>publishercomplete</h1> -->
    <div>
		<div style="padding-left: 10px;">
		<el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 130%;">
		  <el-breadcrumb-item :to="{ path: '/publisherIndex' }">项目发布者</el-breadcrumb-item>
		  <el-breadcrumb-item>评审者</el-breadcrumb-item>
		
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
    import reviewDetailDialog from '@/view/review/components/reviewDetailDialog';
    import publisherReviewOpinion from '@/view/review/components/publisherReviewOpinion';
    import { specificDate } from '@/utils/getDate.js';
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
                    
                ],
				pageData: {
				  pageNo: 1,
				  pageSize: 10,
				  orderBy: "id",
				  orderType: "DESC",
				  role:1,
				  status:2
				},
				totalPage: 0,
            };
        },
        created: function () {
			this.getView();
        },
        computed: {},
        methods: {
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

