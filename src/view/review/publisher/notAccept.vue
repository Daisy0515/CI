<template>
    <!-- <h1>publishercomplete</h1> -->
    <div>
		
<div style="padding-left: 10px;">
		<el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 130%;">
		  <el-breadcrumb-item :to="{ path: '/publisherIndex' }">项目发布者</el-breadcrumb-item>
		  <el-breadcrumb-item>未接受</el-breadcrumb-item>
		
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
                    <el-button @click="handleClickDetail(scope.row.id)" type="text" size="medium"
                    ><i class="el-icon-search"></i>查看详情
                    </el-button>
                    <el-button @click="handleRollBack(scope.row.id)" type="text" size="medium"
                    ><i class="el-icon-close"></i>打回
                    </el-button>
                    <el-button @click="handleAccept(scope.row.id)" type="text" size="medium"
                    ><i class="el-icon-check"></i>接受
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <review-detail-dialog :form="form1" :formLabelWidth="formLabelWidth"
                              :dialogFormVisible="dialogFormVisible"
							  :loading="form1Loading"
                              @closeDialog="closeDialog"></review-detail-dialog>
        <el-dialog title="打回评审" :visible.sync="dialogRollbackVisible"
                   style="text-align:left; font-weight: bolder;">
            <el-form :model="form">
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="添加意见" :label-width="formLabelWidth">
                            <el-input
                                    v-model="form.details"
                                    type="textarea"
                                    :rows="3"
                                    placeholder="请输入内容"
                            />
                        </el-form-item>
						<el-form-item label="截止时间" prop="deadline" :label-width="formLabelWidth">
						  <el-date-picker
						 
						    v-model="form.deadline"
						    :picker-options="endDatePicker"
						    type="date"
						    placeholder="截止时间"
						    value-format="yyyy-MM-dd"
						  ></el-date-picker>
						</el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" style="margin-right: 35%">
                <el-button @click="dialogRollbackVisible=false" style="margin-right: 10%">取 消</el-button>
                <el-button type="primary" @click="submitRollback">确 定</el-button>
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
    import {httpGet, httpDelete,httpPut,httpPost} from "@/utils/http.js";
import { specificDate } from '@/utils/getDate.js';
    import {message, successTips, errTips,} from "@/utils/tips.js";
    import {MessageBox} from 'element-ui';
    import reviewDetailDialog from '@/view/review/components/reviewDetailDialog';

    export default {
        components: {
            reviewDetailDialog,
        },
        data() {
            return {
				endDatePicker: {
					disabledDate(time) {
							return time.getTime() <= new Date().getTime() - 8.64e6;
					},
				},
                loading: false,
                dialogFormVisible: false,
                dialogRollbackVisible: false,
                formLabelWidth: '100px',
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
                form: {//表单中的信息
                    details:"",
					reviewInfoId:null,
					deadline:"",
                },
                tableData: [
                    
                ],
				pageData: {
				  pageNo: 1,
				  pageSize: 10,
				  orderBy: "id",
				  orderType: "DESC",
				  role:1,
				  status:1
				},
				totalPage: 0,
				form1Loading:false,
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
				//get /v1/authorization/review/review/get 
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
				//console.log(this.form1);
            },
            handleRollBack(val) {
                this.dialogRollbackVisible = true;
				this.form.reviewInfoId = val;
				
				//post /v1/authorization/review/opinion/insert 
				// httpPut('/v1/authorization/review/status/update',{id:val}).then(results=>{
				// 	const { data, msg, httpCode } = results.data;
				// 	if (httpCode === 200) {
				// 		successTips("已接受评审！");
				// 		this.getView();
				// 	} else {
				// 		errTips(msg);
				// 	}
				// })	
            },
            closeDialog() {
                this.dialogFormVisible = false;
            },
            handleRollback(val) {
                this.dialogRollbackVisible = false;
            },
            submitRollback(){
				httpPost('/v1/authorization/review/opinion/insert',this.form).then(results=>{
					const { data, msg, httpCode } = results.data;
					if (httpCode === 200) {
						successTips("已打回评审！");
						this.form="";
						this.getView();
						 this.dialogRollbackVisible = false;
					} else {
						errTips(msg);
					}
				})
                // this.dialogRollbackVisible = false;
				
            },
            handleAccept(val) {
                httpPut('/v1/authorization/review/status/update',{id:val}).then(results=>{
                	const { data, msg, httpCode } = results.data;
                	if (httpCode === 200) {
                		successTips("已接受评审！");
                		this.getView();
                	} else {
                		errTips(msg);
                	}
                })	
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

