<template>
	<div class="myTask">
		<div class="Crumbs">
			<div class="container deskHeader"><h4>我的任务</h4></div>
		</div>
		<div class="container deskHeader">
			<p class="Tips">
				<i class="el-icon-info"></i>
				组员请务必使用git托管资源，后期验收全部以git仓库中master分支为验收标准，请点击
				<router-link to="/git-2">如何使用git</router-link>
				查看如何使用
			</p>
		</div>
		<div class="header_top">
			<el-input v-model="searchData.projectName" placeholder="项目名称搜索"></el-input>
			<el-input v-model="searchData.content" placeholder="任务名称"></el-input>
			<el-cascader placeholder="请选择项目类型" :options="getNormalType" change-on-select v-model="selectedOptions" clearable></el-cascader>
			<el-button type="primary" @click="searchList">搜索</el-button>
			<router-link to="/teamSquare"><el-button type="primary">参与任务</el-button></router-link>
			<router-link to="./kanBan"><el-button type="primary">看板</el-button></router-link>
		</div>
		<el-table v-loading="loading" :data="tableData" style="width:1200px;margin:0 auto" :header-cell-style="rowClass">
			<el-table-column fixed prop="projectCode" label="项目编号" align="center">
				<template slot-scope="scope">
					<el-tooltip class="item" effect="dark" :content="scope.row.projectCode" placement="top-start">
						<span class="tablehidden">{{ scope.row.projectCode }}</span>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column prop="name" label="项目名称" align="center">
				<template slot-scope="scope">
					<el-tooltip class="item" effect="dark" :content="scope.row.projectName" placement="top-start">
						<span class="tablehidden">{{ scope.row.projectName }}</span>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column prop="content" label="任务名称" align="center">
				<template slot-scope="scope">
					<el-tooltip class="item" effect="dark" :content="scope.row.content" placement="top-start">
						<span class="tablehidden">{{ scope.row.content }}/{{ scope.row.subtitle}}</span>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column prop="startTime" label="开始时间" align="center"></el-table-column>
			<el-table-column prop="endTime" label="结束时间" align="center"></el-table-column>
			<el-table-column prop="gmtModified" label="更新时间" align="center"></el-table-column>
			<el-table-column prop="type" label="项目类型" align="center"></el-table-column>
			<el-table-column prop="missionTypeId" label="任务类型" align="center" :formatter="formatType"></el-table-column>
			<el-table-column prop="statusName" label="状态" align="center"></el-table-column>
			<el-table-column prop="accomplishProgress" label="操作" align="center" width="400">
				<template slot-scope="scope" class="operation">
					<!-- <span class="tablehidden">{{scope.row.missionTypeId}}</span> -->
					<!-- <el-slider
						class="slider"
						@change="sliderChange(scope.row)"
						v-model="scope.row.accomplishProgress"
						:disabled="scope.row.progress === 100 || scope.row.statusName === '结束'"
						width="50"
					></el-slider> -->
					<el-button type="primary" size="mini" class="btn" :data-clipboard-text="scope.row.httpUrlToRepo" v-on:click="copyAddress()">复制git地址</el-button>

					<!-- 记得改path             -->
					<router-link
						class="temClass"
						
						:to="{ path: 'viewTask', query: { id: scope.row.id } }"
					>
						<i class="el-icon-document"></i>
						查看任务
					</router-link>
					
					<router-link class="temClass" :to="{ path: 'needDesign', query: { id: scope.row.id } }" v-show="scope.row.missionTypeId === 1">
						<i class="el-icon-edit"></i>
						提交文档
					</router-link>
					<router-link class="temClass" :to="{ path: 'outlineDesign', query: { id: scope.row.id } }" v-show="scope.row.missionTypeId === 2">
						<i class="el-icon-edit"></i>
						提交文档
					</router-link>
					<router-link class="temClass" :to="{ path: 'detailedDesign', query: { id: scope.row.id } }" v-show="scope.row.missionTypeId === 3">
						<i class="el-icon-edit"></i>
						提交文档
					</router-link>
					
					<!-- 
					<router-link to class="temClass" v-show="!(scope.row.missionTypeId === 3 || scope.row.missionTypeId === 1 || scope.row.missionTypeId === 2)"  >
						<i class="el-icon-upload2"></i>
						上传资源
					</router-link> -->
					
					
					

					

					<router-link class="temClass" v-show="scope.row.progress === 100" :to="{ path: 'resourceManagement', query: { id: scope.row.id } }">
						<i class="el-icon-search"></i>
						资源明细
					</router-link>
					<!-- <span class="tablehidden">{{scope.row.progress}}</span> -->
					<router-link to class="temClass" v-show="scope.row.progress != 100" @click.native="sliderChange(scope.row)" >
						<i class="el-icon-success"></i>
						完成
					</router-link>
				</template>
			</el-table-column>
		</el-table>
		
		<div class="bid_footer">
			<el-pagination @current-change="handleCurrentChange" :current-page.sync="pageData.pageNo" :total="totalPage" layout="prev, pager, next, jumper"></el-pagination>
		</div>
	</div>
</template>
<script>
import Clipboard from 'clipboard';
import { httpGet, httpPut } from '@/utils/http.js';
import { specificDate } from '@/utils/getDate.js';
import { message, successTips, errTips } from '@/utils/tips.js';
import { mapActions, mapGetters } from 'vuex';
import sourceUpload from '@/common/upload/resourceUpload';
import { dialog } from "element-ui";
export default {
	components: {},
	name: 'myTask',
	data() {
		return {
			uploadIndex: false,
			selectedOptions: [],
			missionTypeName: [],
			typeList: '',
			input: '',
			loading: false,
			dialogFormVisible: false,
			visible: false,
			form: {
			          name: '',
			          region: '',
			          date1: '',
			          date2: '',
			          delivery: false,
			          type: [],
			          resource: '',
			          desc: ''
			        },
			formLabelWidth: '120px',
			taskDescription: '',
			pageNo: '',
			totalPage: 0,
			searchData: {
				projectName: '',
				content: '',
				parentId: null,
				typeId: null,
				pageNo: 1,
				pageSize: 10,
				orderBy: 'id',
				orderType: 'DESC',
				httpUrlToRepo: ''
			},
			pageData: {
				projectName: '',
				content: '',
				parentId: null,
				pageNo: 1,
				typeId: null,
				pageSize: 10,
				orderBy: 'id',
				orderType: 'DESC',
				httpUrlToRepo: ''
			},
			options: [],
			selestate: [],
			tableData: []
		};
	},
	created: function() {
		//获取项目类型数据
		this.GETNORMALTYPE();
		this.getView(this.pageData);
	},
	computed: {
		...mapGetters(['getNormalType'])
	},
	methods: {
		//搜索查询
		...mapActions(['GETNORMALTYPE']),
		uploadFile(val){
			MessageBox.confirm("是否确定将此投标删除？", "提示", {
			  confirmButtonText: "确定",
			  cancelButtonText: "取消",
			  type: "warning"
			})
			  .then(() => {
			    httpDelete(`/v1/authorization/bids/castInfo/delete/${id}`).then(
			      results => {
			        const { httpCode, msg } = results.data;
			        if (httpCode === 200) {
			          this.getView();
			          successTips('删除成功')
			        } else if (httpCode === 400) {
			          errTips("此投标状态已变更");
			          this.reload();
			        } else if (httpCode !== 401) {
			          errTips(msg);
			        }
			      }
			    );
			  })
			  .catch(() => {});
		},
		   
		needDesign() {
			this.$router.push({ path: 'needDesign' });
		},
		formatType: function(row, column) {
			//alert(row.missionTypeId);
			for (var i = 0; i < this.missionTypeName.length; i++) {
				console.log(this.missionTypeName[i]);
				if (this.missionTypeName[i].id == row.missionTypeId) {
					return this.missionTypeName[i].missionName;
				}
			}
			return false;
		},
		//复制Git地址
		copyAddress() {
			var clipboard = new Clipboard('.btn');
			clipboard.on('success', e => {
				console.log('复制成功');
				// 释放内存
				clipboard.destroy();
			});
			clipboard.on('error', e => {
				// 不支持复制
				console.log('该浏览器不支持自动复制');
				// 释放内存
				clipboard.destroy();
			});
		},
		searchList() {
			let { selestate, searchData, selectedOptions } = this;
			searchData.parentId = selectedOptions[0];
			searchData.typeId = selectedOptions[1];
			if (selestate === '投标中') {
				searchData.status = 1;
			} else if (selestate === '中标') {
				searchData.status = 2;
			} else if (selestate === '结束') {
				searchData.status = 3;
			} else if (selestate === '失败') {
				searchData.status = 4;
			} else {
				searchData.status = '';
			}
			this.getView(searchData);
		},
		//页码变化
		handleCurrentChange(val) {
			this.pageData.pageNo = val;
			this.getView(this.pageData);
		},
		//获取页面数据
		getView(val) {
			this.loading = true;
			httpGet('/v1/authorization/mission/missioninfo/listall', val).then(results => {
				const { httpCode, msg, data } = results.data;
				if (httpCode == 200) {
					this.pageNo = data.pageNo;
					this.totalPage = parseInt(data.totalPage + '0');
					let { typeList, missList: list } = data;
					this.typeList = typeList;
					this.missionTypeName = data.missionTypeList;
					//alert(this.missionTypeName[0].missionName);
					// console.log(this.missionTypeName);
					for (let i of list) {
						for (let p of typeList) {
							if (i.parentId === p.id) {
								i.parentName = p.type;
							}
							if (i.typeId === p.id) {
								i.typetName = p.type;
								i.type = i.parentName + '/' + p.type;
							}
						}
						i.progress = i.accomplishProgress;
						i.endTime = specificDate(i.endTime);
						i.gmtModified = specificDate(i.gmtModified);
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
		//滑动进度条
		sliderChange(val) {
			if (val.progress === 100) {
				val.accomplishProgress = val.progress;
				return false;
			}
			httpPut('/v1/authorization/mission/accomplishprogress/update', {
				accomplishProgress: 100,
				id: val.id
			}).then(results => {
				const { httpCode, msg } = results.data;
				if (httpCode === 200) {
					val.progress = val.accomplishProgress;
					successTips('任务进度已更新');
					if (val.accomplishProgress === 100) {
						val.statusName = '结束';
					}
					this.getView(this.pageData);
				} else {
					errTips(msg);
					val.accomplishProgress = val.progress;
				}
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
</style>
