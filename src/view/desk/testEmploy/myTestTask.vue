<template>
	<div class="myTask">
		<div class="header_two0">
			<nav class="c-header c-header--solid0">
				<div class="o-container deskHeader clearfix">
					<ul class="c-header__navigation clearfix">
						<li class="c-header__navigation__item" v-for="item in items" :key="item.title">
							<router-link :class="Header === item.url ? 'header_active' : ''" :to="item.url">
								{{ item.title }}
							</router-link>
						</li>
					</ul>
				</div>
			</nav>
		</div>
		<div class="header_top">
			<el-input v-model="searchData.missionName" placeholder="任务名称搜索"></el-input>

			<el-select v-model="searchData.status" clearable placeholder="请选择状态">
				<el-option label="执行中" value="1"></el-option>
				<el-option label="结束" value="2"></el-option>
			</el-select>

			<el-button type="primary" @click="searchList()">搜索</el-button>
			<router-link to="/testEmploy"> <el-button type="primary">招募广场</el-button> </router-link>
			
			
			<el-button type="primary" @click="dialogTableVisible = true">已报名测试</el-button>
			<el-dialog title="已报名测试" :visible.sync="dialogTableVisible"  width="40%">
			  <el-table v-loading="loading1" :data="testData">
			    <el-table-column property="projectName" label="测试项目" align="center"></el-table-column>
			    <el-table-column property="deadline" label="测试招募截止时间" align="center" ></el-table-column>
				<el-table-column property="type" label="项目类型" align="center" >
					
						<template slot-scope="scope">
							<span v-if="scope.row.type === 1">设计</span>
							<span v-if="scope.row.type === 2">软件开发</span>
							<span v-if="scope.row.type === 3">数据科学</span>
							<span v-if="scope.row.type === 4">其他类别 </span>
							
						</template>
				</el-table-column>
			    <el-table-column property="address" label="操作" align="center">
					<template slot-scope="scope">
						<router-link to @click.native="exitTest(scope.row.id)"  >
							<i  class="el-icon-circle-close" ></i>
							退出测试
						</router-link>
					</template>
				</el-table-column>
			  </el-table>
			</el-dialog>
			<!-- <router-link to="./addTestIssue"><el-button type="primary">上报缺陷</el-button></router-link> -->
		</div>
		<el-table v-loading="loading" :data="tableData" style="width:1200px;margin:0 auto" :header-cell-style="rowClass">
			<el-table-column fixed prop="projectCode" label="任务编号" align="center">
				<template slot-scope="scope">
					<el-tooltip class="item" effect="dark" :content="scope.row.projectCode" placement="top-start">
						<span class="tablehidden">{{ scope.row.projectCode }}</span>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column prop="testName " label="测试名称" align="center">
				<template slot-scope="scope">
					<el-tooltip class="item" effect="dark" :content="scope.row.testName " placement="top-start">
						<span class="tablehidden">{{ scope.row.testName  }}</span>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column prop="missionName" label="任务名称" align="center">
				<template slot-scope="scope">
					<el-tooltip class="item" effect="dark" :content="scope.row.missionName" placement="top-start">
						<span class="tablehidden">{{ scope.row.missionName }}</span>
					</el-tooltip>
				</template>
			</el-table-column>

			<el-table-column prop="startTime" label="开始时间" align="center"></el-table-column>
			<el-table-column prop="endTime" label="结束时间" align="center"></el-table-column>

			<el-table-column prop="status" label="状态" align="center">
				<template slot-scope="scope">
					<span v-if="scope.row.status === 1">执行中</span>
					<span v-if="scope.row.status === 2">结束</span>
					
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" width="350">
			  <template slot-scope="scope">
				  <el-popover placement="right" trigger="click" width="400">
				  <p>{{scope.row.description}}</p>
				  	<!-- <div class="popo-item">
				  		<el-input type="textarea"  placeholder="所需人数" size="small" v-model="scope.row.description">
				  			
				  		</el-input>
				  	</div> -->
				  
				  	<router-link to slot="reference" >
				  		<i class="el-icon-edit-outline"></i>
				  		查看描述
				  	</router-link>
				  </el-popover>
			  
			    <!-- <span @click="dialogVisible = true">
			    <router-link to>
			    	<i  class="el-icon-document" ></i>
			    	查看描述
			    </router-link>
			    </span> -->
			    <a target="_Blank" :href="scope.row.sourceFile" >
			    	<i class="el-icon-download"></i>
			    	下载附件
			    </a>
				<!-- <router-link
				  :to="{ path: 'opinionView', query: { id: scope.row.id } }"
				> -->
				<router-link 
				:to="{path:'./addTestIssue',query:{testId:scope.row.testId,missionId:scope.row.id}}" >
					<i class="el-icon-edit"></i>
					上报缺陷
				</router-link>
				<router-link :to="{path:'./historyView',query:{id:scope.row.id}}"  >
					<i  class="el-icon-search" ></i>
					查看历史
				</router-link>
			    
			    
			  </template>
			</el-table-column>
			
		</el-table>
		<!-- <el-dialog title="任务描述" :visible.sync="dialogVisible" width="500px">
			<p
				style="width:450px;display:inline-block;word-wrap:break-word; 
word-break:normal;"
			>
				{{ taskDescription }}
			</p>
			<span slot="footer" class="dialog-footer"><el-button type="primary" @click="dialogVisible = false">关闭</el-button></span>
		</el-dialog> -->

		<div class="bid_footer">
			<el-pagination @current-change="handleCurrentChange" :current-page.sync="pageData.pageNo" :total="totalPage" layout="prev, pager, next, jumper"></el-pagination>
		</div>
	</div>
</template>
<script>
import Clipboard from 'clipboard';
import { httpGet,httpDelete, httpPut } from '@/utils/http.js';
import { specificDate } from '@/utils/getDate.js';
import { message, successTips, errTips } from '@/utils/tips.js';
import { mapActions, mapGetters } from 'vuex';
import { MessageBox } from "element-ui";
export default {
	components: {},
	name: 'myTask',
	data() {
		return {
			Header:"myTestTask",
			items: [
			  {
			    title: "测试发布",
			    url: "myTest"
			  },
			  {
			    title: "测试任务",
			    url: "myTestTask"
			  },
			  
			],
			selectedOptions: [],
			typeList: '',
			input: '',
			loading: false,
			loading1: false,
			dialogVisible: false,
			taskDescription: '',
			pageNo: '',
			totalPage: 0,
			searchData: {
				pageNo: 1,
				pageSize: 10,
				orderBy: 'id',
				orderType: 'DESC',
				missionName:"",
				status:""
			},
			pageData: {
				pageNo: 1,
				pageSize: 10,
				orderBy: 'id',
				orderType: 'DESC',
				missionName:"",
				status:""
			},
			pageData1: {
				pageNo: 1,
				pageSize: 100,
				orderBy: 'id',
				orderType: 'DESC',
				projectName:"",
			},
			options: [],
			selestate: [],
			tableData: [],
			ruleForm:[],
			testData:[],
			dialogTableVisible:false
		};
	},
	created: function() {
		//获取项目类型数据
		this.GETNORMALTYPE();
		this.getView(this.pageData);
		this.getTestList(this.pageData1);
	},
	computed: {
		...mapGetters(['getNormalType'])
	},
	methods: {
		//搜索查询
		...mapActions(['GETNORMALTYPE']),
		
		
		getTestList(val){
			//alert(111);
			this.testData=[];
			this.loading1 = true;
			
			httpGet('/v1/authorization/test/search/application', val).then(results => {
				const { httpCode, msg, data } = results.data;
				if (httpCode == 200) {
					let list = data.applicationRecordList;
					for (let i of list) {
						i.deadline = specificDate(i.deadline);
					}
					this.$set(this, 'testData', list);
				} else if (msg == '该条件暂无数据') {
					this.testData = [];
					message('该条件暂无数据');
				} else if (httpCode !== 401) {
					errTips(msg);
				}
				this.loading1 = false;
			});
		},
		exitTest(id) {
			//alert(id);
			MessageBox.confirm('是否确定将此退出此测试？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					//delete /v1/authorization/test/application/delete/{id} 
					httpDelete(`/v1/authorization/test/application/delete/${id}`).then(
					  results => {
					    const { httpCode, msg } = results.data;
					    if (httpCode === 200) {
					      this.getTestList(this.pageData1);
					      successTips('删除成功')
					    } else {
					      errTips(msg);
					    }
					  }
					);
				})
				.catch(() => {});
		},
		searchList() {
			
			this.getView(this.searchData);
		},
		//页码变化
		handleCurrentChange(val) {
			this.pageData.pageNo = val;
			this.getView(this.pageData);
		},
		//获取页面数据
		getView(val) {
			this.loading = true;
			//get /v1/authorization/test/search/testmission 
			httpGet('/v1/authorization/test/search/testmission', val).then(results => {
				const { httpCode, msg, data } = results.data;
				if (httpCode == 200) {
					this.pageNo = data.pageNo;
					this.totalPage = parseInt(data.totalPage + '0');
					let list = data.missionList;
					for (let i of list) {
						i.endTime = specificDate(i.endTime);
						i.startTime = specificDate(i.startTime);
					}
					Object.assign(this.pageData, val);
					this.$set(this, 'tableData', list);
				} else if (msg == '该条件暂无数据') {
					this.tableData = [];
					message('该条件暂无数据');
				} else if (httpCode !== 401) {
					errTips(msg);
				}
				this.loading = false;
			});
		},
		
		rowClass() {
			// background:#619cdf;color:white;font-weight:400
			return 'background:#F4F6F9;';
		}
	}
};
</script>
<style lang="scss">
.myTask {
	i {
		cursor: pointer;
	}
	.Tips {
		text-align: center;
		margin-top: 15px;
		color: #909399a8;
	}
	.slider {
		width: 130px;
		margin-left: 5px;
		text-align: center;
		float: left;
	}
	.btn {
		margin-left: 20px;
		text-align: center;
		float: left;
	}
	.temClass {
		margin-top: 4px;
	}
	.container {
		width: 1200px;
	}
	a {
		margin-right: 5px;
		color: #4c83c3;
	}
	.el-table {
		border: 1px solid #d8d8d8d7;
	}
	.header_top {
		width: 1200px;
		margin: 15px auto;
		padding-bottom: 20px;
		.dao {
			margin: 0 0 0 -25px;
		}
		button {
			margin-left: 20px;
		}
		& button:nth-child(3) {
			color: white;
		}
	}
	.el-input {
		display: inline-block;
		width: 150px;
		margin-right: 25px;
	}
	.el-input__inner {
		border: 1px solid #c0c0c0;
		width: 150px;
		height: 35px;
		line-height: 35px;
	}
	.bid_footer {
		.el-input__inner {
			width: 70px;
		}
		.el-pagination {
			text-align: center;
			margin: 50px 0 50px 0;
		}
		.el-pagination.is-background .el-pager li:not(.disabled).active {
			background: #3e76b8;
		}
	}
	.el-table td,
	.el-table th.is-leaf {
		color: rgba(0, 0, 0, 0.842);
		border-bottom: 1px solid #d8d8d8b4;
	}
	.bid .el-table th,
	.bid .el-table tr {
		background: white;
	}
}
.header_two0 {
	.userImg {
		float: right;
		width: 65px;
		.icon-xiaoxi {
			cursor: pointer;
			font-size: 26px;
			color: white;
			transition: all 0.4s;
			float: left;
			margin-top: 4px;
			&:hover {
				color: rgba(0, 0, 0, 0.74);
			}
		}
		img {
			margin-top: 3px;
			&:hover {
				cursor: pointer;
			}
		}
	}
	a {
		color: #666;
		font-weight: 400;
		width: 100px;
		font-size: 16px;
		&:hover {
			border-bottom: 1.9px solid #4c83c3;
			padding-bottom: 10px;
		}
	}
	.login_two {
		border: 1px solid #fff;
		padding: 5px 13px 5px 13px;
		margin-right: 10px;
		border-radius: 3px;
		&:hover {
			background: #426ea1;
		}
	}
	.register_two {
		background: white;
		color: black;
		padding: 5px 13px 5px 13px;
		border: 1px solid #fff;
		border-radius: 3px;
		&:hover {
			background: #e8e8e8;
		}
	}
	.c-header {
		-webkit-box-shadow: 0 1px 0 rgba(255, 255, 255, 0.2);
		box-shadow: 0 1px 0 rgba(255, 255, 255, 0.2);
		width: 100%;
		z-index: 100;
	}
	.c-header--fixed,
	.c-header--solid0 {
		border-bottom: 1px solid #e8e8e8;
		padding: 15px 0 15px;
	}
	.c-header__row {
		height: 70px;
		padding-top: 20px;
		box-sizing: border-box;
	}
	.c-header__logowrap {
		border: 0;
		height: 30px;
		width: 130px;
		outline: 0;
		margin-right: auto;
		float: left;
	}
	.c-header__logo {
		width: 130px;
		height: 30px;
		fill: #333;
	}
	.c-header__options {
		float: right;
		width: 65px;
		img {
			width: 27px;
			height: 27px;
			border-radius: 50%;
			margin-left: 10px;
		}
	}
	.c-header__options__signin {
		display: inline-block;
	}
	.c-header__navigation {
		width: 940px;
		float: left;
		// text-align: center;
		list-style: none;
	}
	.c-header__navigation__item {
		padding: 0 15px 0 15px;
		display: inline-block;
		vertical-align: middle;
		height: 100%;
		font-size: 14px;
		font-weight: 600;
	}
	.header_active {
		border-bottom: 1.9px solid #4c83c3;
		padding-bottom: 10px;
		// background: #0760c5;
	}
	.c-header--transparent:not(.c-header--fixed) {
		position: absolute;
	}
	.c-header--transparent:not(.c-header--fixed) .c-header__navigation__item a {
		color: #fff;
		text-shadow: 0 0 1px rgba(0, 0, 0, 0.9);
	}
	.c-header--transparent:not(.c-header--fixed) .c-header__options__join {
		border-color: #fff;
		background-color: #fff;
		color: #444;
		font-weight: 400;
	}
	.c-header--transparent:not(.c-header--fixed) .c-header__options__join:hover {
		background-color: #4c83c3;
		border-color: #4c83c3;
		color: #fff;
	}
	.c-header--transparent:not(.c-header--fixed) .c-header__options__signin {
		background-color: transparent;
		border: 1px solid #fff;
		color: #fff;
	}
	.c-header--transparent:not(.c-header--fixed) .c-header__options__signin:hover {
		background-color: #fff;
		color: #444;
	}
	.c-header--breadcrumbs .c-header__logowrap {
		margin-right: 2rem;
	}
	.c-header--breadcrumbs .c-header__breadcrumb,
	.c-header--breadcrumbs .c-header__breadcrumb a {
		font-size: 14px;
		font-size: 0.875rem;
		color: #fff;
		text-shadow: 0 0 1px rgba(0, 0, 0, 0.9);
	}
	.c-header--breadcrumbs .mobileBreadcrumb {
		display: block;
	}
	.c-header--breadcrumbs .fullscreenBreadcrumb {
		display: none;
	}
}

</style>
