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
			<el-table-column prop="submitName" label="提交人" align="center">
			    <template slot-scope="scope">
			        <el-tooltip class="item" effect="dark" :content="scope.row.submitName">
			            <span class="tablehidden">{{ scope.row.submitName }}</span>
			        </el-tooltip>
			    </template>
			</el-table-column>
            <el-table-column prop="gmtCreate" label="开始时间" align="center"></el-table-column>
            <el-table-column prop="deadline" label="截止时间" align="center"></el-table-column>

            <el-table-column prop="accomplishProgress" label="操作" align="center" width="280px">
                <template slot-scope="scope">
                    <el-button @click="handleClickDetail(scope.row.id)" type="text" size="medium"
                    ><i class="el-icon-search"></i>查看详情
                    </el-button>
                    <el-button @click="handleClickOpinion(scope.row.id)" type="text" size="medium" style="margin-right: 10px"
                    ><i class="el-icon-document"></i>意见</el-button>
                    <el-button @click="handleClickEvaluate(scope.row.id,scope.row.title)" type="text" size="medium" style="margin-right: 10px"
                    ><i class="el-icon-edit"></i>评价</el-button>

                </template>
            </el-table-column>
        </el-table>
        <review-detail-dialog :form="form1" :formLabelWidth="formLabelWidth"
                              :dialogFormVisible="dialogFormVisible"
							  :loading="form1Loading"
                              @closeDialog="closeDialog"></review-detail-dialog>
        <publisher-review-opinion :form="formOpinion" :formLabelWidth="formLabelWidth"
                                  :dialogOpinionVisible="dialogOpinionVisible"
								  :loading="form2Loading"
                                  @closeOpinionDialog="closeOpinionDialog"></publisher-review-opinion>
        <el-dialog title="tips:提交评价，代表本次评审结束，感谢您的评审" :visible.sync="dialogEvaluateVisible" style="width:100%;text-align:left; font-weight: bolder;" center>
            <el-form :model="form2">
                <el-row :gutter="20">
                    <el-col :span="10">
                        <el-form-item label="评审标题" :label-width="formLabelWidth">
                            <el-input v-model="evaluateTitle"  :disabled="true" auto-complete="off" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="是否通过" :label-width="formLabelWidth">
                            <el-radio v-model="form2.result" label="true">通过</el-radio>
                            <el-radio v-model="form2.result" label="false">未通过</el-radio>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="10">
                        <el-form-item label="评审得分" :label-width="formLabelWidth">
                            <el-input v-model="form2.score" auto-complete="off" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="评价内容" :label-width="formLabelWidth">
                            <el-input
                                    v-model="form2.content"
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
                <el-button type="primary" @click="submitEvaluate" v-prevent-click>提交</el-button>
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
    import {httpGet, httpDelete,httpPost} from "@/utils/http.js";
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
                    gmtCreate :"",
					projectCode :"",
					projectName :"",
					reviewOpinionList :[],
					title :"",
					userName :"",
                },
				form1:{
					projectName:"",
					projectCode:null,
					title:"",
					purpose:"",
					gmtCreate :"",
					deadline :"",
					warn :null,
					content :"",
					resourceList :[],
				},
				form2:{
					content:"",
					result :null,
					reviewInfoId:null,
					score :null,

				},
				form1Loading:false,
				form2Loading:false,
                evaluateTitle:"",
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
            handleClickDetail(val) {
                this.dialogFormVisible = true;
				this.form1Loading=true;
				httpGet("/v1/authorization/review/review/get", {id:val}).then(results => {
				  const { httpCode, msg, data } = results.data;
				  if (httpCode == 200) {
				    this.form1 = data;
					this.form1.deadline=specificDate(this.form1.deadline);
					this.form1.gmtCreate=specificDate(this.form1.gmtCreate);
				  } else if (msg == "该条件暂无数据") {
				    this.form1="";
				    message("该条件暂无数据");
				  } else if (httpCode !== 401) {
				    errTips(msg);
				  }
				  this.form1Loading = false;
				});
            },
            closeDialog() {
                this.dialogFormVisible = false;
            },
            handleClickOpinion(val){
                this.dialogOpinionVisible = true;
				this.form2Loading=true;
				//get /v1/authorization/review/opinion/list
				httpGet("/v1/authorization/review/opinion/list", {id:val}).then(results => {
				  const { httpCode, msg, data } = results.data;
				  if (httpCode == 200) {
				    this.formOpinion = data;
					this.formOpinion.gmtCreate=specificDate(this.formOpinion.gmtCreate);
					let list = data.reviewOpinionList;
					console.log(list);
					for (let i of list) {
						i.submitTime = specificDate(i.submitTime);
						i.deadline  = specificDate(i.deadline);
					}
					 this.formOpinion.reviewOpinionList=list;
					console.log(123);
				  } else if (msg == "该条件暂无数据") {
				    this.formOpinion="";
				    message("该条件暂无数据");
				  } else if (httpCode !== 401) {
				    errTips(msg);
				  }
				  this.form2Loading = false;
				});
            },
            closeOpinionDialog(){
                this.dialogOpinionVisible = false;
            },
            handleClickEvaluate(val,title){
                this.dialogEvaluateVisible = true;
				//post /v1/authorization/review/evaluate/insert
				this.form2.reviewInfoId=val;
				this.evaluateTitle = title;

            },
            closeEvaluateDialog(){
                this.dialogEvaluateVisible = false;
            },
            submitEvaluate(){
				httpPost('/v1/authorization/review/evaluate/insert',this.form2).then(results=>{
					const { data, msg, httpCode } = results.data;
					if (httpCode === 200) {
						successTips("评价结束");
						this.getView();
						this.evaluateTitle="";
						this.form2.content="";
						//content:"",
						this.form2.result="";
						this.form2.reviewInfoId="";
						this.form2.score="";
						this.dialogEvaluateVisible = false;
					} else {
						errTips(msg);
					}
				})
                this.dialogEvaluateVisible = false;

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

