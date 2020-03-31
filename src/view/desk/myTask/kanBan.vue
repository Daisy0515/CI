<template>
	<div class="square">
		<div class="responsive resp">
			<div class="header">
				<div class="container deskHeader">
					<h4>
						您的位置：
						<router-link to="myTask">我的任务</router-link>
						>
						<span class="active">看板</span>
					</h4>
				</div>
			</div>
		</div>
		<div class="container">
			<div class="clearfix">
				<nav class="switchPanel boxSize">
					<div class="left_top">
						<ul>
							<li class="leftbq">项目进度</li>
							<li @click="changeleft(item)" v-for="item in projectList" :key="item.projectId">{{ item.projectName }}</li>
						</ul>
					</div>
					<!-- <el-table :data="projectData">
			  <el-table-column fixed prop="projectName" label="项目名称" align="center"></el-table-column>
			
			</el-table> -->

					<!-- <ul class="searchRefinement category">
            <li>
              <a href="javascript:;" class="active">精选：</a>
            </li>

            <li v-for="(item,index) in getNormalType" :key="index">
              <a href="javascript:;" class="toggleLink" style="display: block;">
                <p class="parentClass" @click="expansionType(index,item)">{{item.label}}</p>
                <p
                  class="typeList"
                  v-for="(items) in item.children"
                  :key="items.value"
                  v-show="item.typeIndex"
                  @click="seleType({parentName:item.label,typeName:items.label,parentId:item.id,typeId:items.value})"
                >{{items.label}}</p>
              </a>
            </li>
          </ul> -->
				</nav>
				<div class="panelHold boxSize">
					<div
						class="panel0"
						v-loading="loading"
						style="border: #d8d8d8 1px solid; padding: 20px 20px 20px 20px; width: 110%;margin: 40px auto;box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);"
					>
						<p class="tip" v-show="tipData">暂无数据</p>
						<header class="clearfix"></header>
						<ul class="services">
							<li class="serviceItem clearfix" v-for="(item, index) in progressDetailList" :key="index">
								<div style="border: #d8d8d8 1px solid; padding: 10px 20px 20px 10px; box-shadow: 0 2px 2px 0 rgba(0,0,0,.1);">
									<div class="clearfix rhythmMargin">
										<div class="serviceHeader clearfix">
											<span class="servTitle">
												<h2>
													<a href="javascript:;">{{ item.projectName }}</a>
												</h2>
											</span>
										</div>
										<div class="serviceMeta" style="padding-left: 6px;margin-top: 10px;">
											<p style="color: #666666;font-size: 16px;">任务完成进度</p>
											<el-progress
												:percentage="parseInt((item.missionFinishCount * 100) / (item.missionFinishCount + item.missionTrackingCount))"
												color="#8e71c7"
											></el-progress>
											<br />
											<p style="color: #666666;font-size: 16px;">待解决问题进度</p>
											<el-progress
												:percentage="parseInt((item.bugResolvedCount * 100) / (item.bugResolvedCount + item.bugTrackingCount + item.bugIssueCount))"
												color="#9ed979"
											></el-progress>
										</div>
										<div class="types">
										<ul>
											<li v-for="items in projectTypeList[index]">
												<span>{{typeName[items.missionType]}}</span>:<span style="color: red;">{{items.finish}}</span>-<span>{{items.sum}}</span>
											</li>
										</ul>
										</div>
										<!-- <li v-for="items in projectTypeList[index]">
											<span class="tablehidden" v-if="items.missionType === 1">需求设计</span>
										</li> -->
									</div>
								</div>
							</li>
						</ul>
					</div>
					<div class="pagerHold">
						<el-pagination
							@current-change="handleCurrentChange"
							:current-page.sync="pageData.pageNo"
							:total="totalPage"
							layout="prev, pager, next, jumper"
						></el-pagination>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { httpGet } from '@/utils/http.js';
import { specificDate as getDate } from '@/utils/getDate.js';
import { message } from '@/utils/tips.js';
import { mapGetters, mapActions } from 'vuex';
export default {
	data() {
		return {
			projectList: [],
			progressDetailList: [],
			projectTypeList: [],
			typeName:["任务类型","需求设计","概要设计","详细设计","编码实现","软件测试","部署运维","其他"],
			selected: '最新',
			optList: ['最新', '最热', '查看次数'],
			loading: false,
			tipData: false,
			searchValue: '',
			plazaList: [],
			seleValue: '所有',
			pageNo: 1,
			totalPage: 1,
			parentId: '',
			pageSize: 3,
			typeId: '',
			searchData: {
				name: '',
				parentId: null,
				typeId: null,
				pageNo: 1,
				pageSize: 10,
				orderBy: 'id',
				orderType: 'DESC'
			},
			pageData: {
				name: '',
				pageSize: 10,
				pageNo: 1,
				orderBy: 'id',
				orderType: 'DESC'
			},
			sort: 'id'
		};
	},
	computed: {
		...mapGetters(['getnoImg', 'getNormalType'])
	},
	created: function() {
		//this.getProjectList();
		this.getProjectTypeList();
		//this.getProgressDetailList();
		//获取页面数据
		this.getView();
	},

	methods: {
		...mapActions(['GETNORMALTYPE']),
		getProjectList() {
			httpGet('/v1/authorization/mission/projectid/get').then(results => {
				const { msg, data, httpCode } = results.data;
				if (httpCode === 200) {
					this.projectList = data.projectList;
					alert(this.projectList.length);
					return data.projectList;
				} else if (httpCode === 400) {
					return null;
					//this.setCache('myTask');
				} else if (httpCode !== 401) {
					return null;
					//errTips(msg);
				}
			});
		},
		getProList() {
			return httpGet('/v1/authorization/mission/projectid/get');
		},
		getProTypeList(val) {
			//alert(val);
			return httpGet('/v1/authorization/mission/missiontype/get', { projectId: val });
		},

		async getProjectTypeList() {
			//alert("type");
			let results = await this.getProList();
			// alert(results.data.httpCode);
			if (results.data.httpCode === 200) {
				this.projectList = results.data.data.projectList;
				var len = this.projectList.length;
				for (var i = 0; i < len; i++) {
					// alert(this.projectList[i].projectId);
					let type = await this.getProTypeList(this.projectList[i].projectId);
					this.projectTypeList[i] = type.data.data.typeList;
					//this.progressDetailList[i].typelist = this.projectTypeList[i];
					console.log(this.projectTypeList[i]);
				}
				//console.log(this.progressDetailList);
				//alert(111);
				//alert(this.projectList.length);
			}
			// var len = proList.length;
			// alert(len);
			// for ( var i = 0; i < len; i++) {
			// 	alert(this.projectList[i].projectId);
			// 	httpGet('/v1/authorization/mission/missiontype/get',{id:this.projectList[i].projectId}).then(results => {
			// 		const { msg, data, httpCode } = results.data;
			// 		if (httpCode === 200) {
			// 			this.projectTypeList[i] = data.typeList;
			// 			alert(this.projectTypeList[i]);
			// 		} else if (httpCode === 400) {
			// 			this.setCache('myTask');
			// 		} else if (httpCode !== 401) {
			// 			errTips(msg);
			// 		}
			// 	});
			// }
		},
		changeleft(item) {
			//this.setLeft(item.url);
			//this.$router.push(`/desk/${item.url}`);
			//alert(xxxxx);
			this.$router.push({ path: 'kanBanRight', query: { id: item.projectId } });
			//{ path: 'opinionView', query: { id: scope.row.id } }"
		},
		// getProgressDetailList(){
		// 	httpGet('/v1/authorization/mission/projectprogress/get').then(results => {
		// 		const { msg, data, httpCode } = results.data;
		// 		if (httpCode === 200) {
		// 			this.progressDetailList = data.progressDetailList;
		// 		} else if (httpCode === 400) {
		// 			this.setCache('myTask');
		// 		} else if (httpCode !== 401) {
		// 			errTips(msg);
		// 		}
		// 	});
		// },
		//所有类型
		allData() {
			const empty = {
				name: null,
				typeId: null,
				parentId: null,
				pageNo: null
			};
			Object.assign(this.pageData, empty);
			Object.assign(this.searchData, empty);
			for (let i of this.getNormalType) {
				i.typeIndex = false;
			}
			this.getView();
			this.seleValue = '所有';
		},
		//????
		handleCurrentChange(val) {
			this.pageData.pageNo = val;
			this.getView();
		},

		getView(val = this.pageData) {
			this.loading = true;
			// !value && (value = "所有");
			httpGet('/v1/authorization/mission/projectprogress/get', val).then(results => {
				let getData = results.data;
				if (getData.httpCode === 200) {
					this.progressDetailList = [...getData.data.progressDetailList];
					this.loading = false;
					Object.assign(this.pageData, val);
				} else if (getData.msg === '该条件暂无数据') {
					this.loading = false;
					this.progressDetailList = [];
					this.tipData = true;
					message('暂无数据');
				}
			});
		}
	}
};
</script>
<style lang="scss">
@import '@/assets/scss/square.scss';
.left_top {
	text-align: center;
	ul {
		margin-top: 20px;
	}
	li {
		border-top: 1px solid #d8d8d8;
		margin-top: 15px;
		padding-top: 15px;
		color: #666;
		position: relative;
		cursor: pointer;
		&:hover::before {
			content: '';
			height: 51px;
			top: 0;
			left: 0;
			position: absolute;
			border-left: 5px solid #4c83c3;
		}
	}

	.leftbq::before {
		content: '';
		height: 51px;
		top: 0;
		left: 0;
		position: absolute;
		border-left: 5px solid #4c83c3;
	}
	p {
		font-size: 14px;
	}
	& p:nth-child(3) {
		color: #3e76b8;
	}
}

.types{
	li {
		display: inline-block;
		padding: 8px 8px 0px 8px;
		color: #666666;
		font-size: 16px;
	}
	
}
/* ul {
      margin-top: 50px;
}
li {
  border-top: 1px solid #d8d8d8;
  margin-top: 15px;
  padding-top: 15px;
  color: #666;
  position: relative;
  cursor: pointer;
  &:hover::before {
	content: "";
	height: 51px;
	top: 0;
	left: 0;
	position: absolute;
	border-left: 5px solid #4c83c3;
  }
} */
</style>
