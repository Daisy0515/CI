<template>
	<div class="square">
		<router-view :key="$route.fullPath"></router-view>
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
							<router-link to="kanBan"><li>项目进度</li></router-link>

							<li @click="changeleft(item)" v-for="item in projectList" :class="item.projectId === id ? 'leftbq' : ''" :key="item.projectId">
								{{ item.projectName }}
							</li>
						</ul>
					</div>
				</nav>
				<div>
					<el-card class="box-card0">
						<div slot="header" class="clearfix"><span style="font-size: 16px;">待处理</span></div>
						<ul class="services">
							<li class="serviceItem clearfix" v-for="(item, index) in missionPendingList" :key="index">
								<div style="border: #d8d8d8 1px solid; padding: 10px 5px 10px 5px; box-shadow: 0 2px 2px 0 rgba(0,0,0,.1);">
									<div class="clearfix rhythmMargin">
										<div class="serviceHeader clearfix">
											<span class="Title" style="font-size: 14px;">{{ item.content }}</span>
											<span>
												任务类型：
												<span class="tablehidden" v-if="item.missionType === 1">需求设计</span>
												<span class="tablehidden" v-if="item.missionType === 2">概要设计</span>
												<span class="tablehidden" v-if="item.missionType === 3">详细设计</span>
												<span class="tablehidden" v-if="item.missionType === 4">编码实现</span>
												<span class="tablehidden" v-if="item.missionType === 5">软件测试</span>
												<span class="tablehidden" v-if="item.missionType === 6">部署运维</span>
												<span class="tablehidden" v-if="item.missionType === 7">其他</span>
											</span>
										
										</div>
									</div>
								</div>
							</li>
						</ul>
					</el-card>
					<el-card class="box-card0">
						<div slot="header" class="clearfix"><span style="font-size: 16px;">开发中</span></div>
						<ul class="services">
							<li class="serviceItem clearfix" v-for="(item, index) in missionTrackingList" :key="index">
								<div style="border: #d8d8d8 1px solid; padding: 10px 20px 20px 10px; box-shadow: 0 2px 2px 0 rgba(0,0,0,.1);">
									<div class="clearfix rhythmMargin">
										<div class="serviceHeader clearfix">
											<span class="Title0" style="font-weight: 500;">{{ item.content }}</span>
											<span>
												任务类型：
												<span class="tablehidden" v-if="item.missionType === 1">需求设计</span>
												<span class="tablehidden" v-if="item.missionType === 2">概要设计</span>
												<span class="tablehidden" v-if="item.missionType === 3">详细设计</span>
												<span class="tablehidden" v-if="item.missionType === 4">编码实现</span>
												<span class="tablehidden" v-if="item.missionType === 5">软件测试</span>
												<span class="tablehidden" v-if="item.missionType === 6">部署运维</span>
												<span class="tablehidden" v-if="item.missionType === 6">其他</span>
											</span>
										</div>
									</div>
								</div>
							</li>
						</ul>
					</el-card>
					<el-card class="box-card0">
						<div slot="header" class="clearfix"><span style="font-size: 16px;">测试中</span></div>
						<ul class="services">
							<li class="serviceItem clearfix" v-for="(item, index) in missionTestList" :key="index">
								<div style="border: #d8d8d8 1px solid; padding: 10px 20px 20px 10px; box-shadow: 0 2px 2px 0 rgba(0,0,0,.1);">
									<div class="clearfix rhythmMargin">
										<div class="serviceHeader clearfix">
											<span class="Title" style="font-size: 14px;">{{ item.content }}</span>
											<span>
												任务类型：
												<span class="tablehidden" v-if="item.missionType === 1">需求设计</span>
												<span class="tablehidden" v-if="item.missionType === 2">概要设计</span>
												<span class="tablehidden" v-if="item.missionType === 3">详细设计</span>
												<span class="tablehidden" v-if="item.missionType === 4">编码实现</span>
												<span class="tablehidden" v-if="item.missionType === 5">软件测试</span>
												<span class="tablehidden" v-if="item.missionType === 6">部署运维</span>
												<span class="tablehidden" v-if="item.missionType === 6">其他</span>
											</span>
										</div>
									</div>
								</div>
							</li>
						</ul>
					</el-card>
					<el-card class="box-card0">
						<div slot="header" class="clearfix"><span style="font-size: 16px;">已完成</span></div>
						<ul class="services">
							<li class="serviceItem clearfix" v-for="(item, index) in missionFinishList" :key="index">
								<div style="border: #d8d8d8 1px solid; padding: 10px 20px 20px 10px; box-shadow: 0 2px 2px 0 rgba(0,0,0,.1);">
									<div class="clearfix rhythmMargin">
										<div class="serviceHeader clearfix">
											<span class="Title" style="font-size: 14px;">{{ item.content }}</span>
											
											<span>
												任务类型：
												<span class="tablehidden" v-if="item.missionType === 1">
													需求设计
													<router-link :to="{ path: 'viewNeedDesign', query: { id: item.id } }">
														<i class="el-icon-search"></i>
														<span class="Title">查看</span>
													</router-link>
												</span>
												<span class="tablehidden" v-if="item.missionType === 2">
													概要设计
													<router-link style="font-size: 14px" :to="{ path: 'viewOutlineDesign', query: { id: item.id } }">
														<i class="el-icon-search"></i>
														<span class="Title" style="font-size: 14px">查看</span>
													</router-link>
												</span>
												<span class="tablehidden" v-if="item.missionType === 3">
													详细设计
													<router-link style="font-size: 14px" :to="{ path: 'viewDetailedDesign', query: { id: item.id } }">
														<i class="el-icon-search"></i>
														<span class="Title" style="font-size: 14px">查看</span>
													</router-link>
												</span>
												<span class="tablehidden" v-if="item.missionType === 4">编码实现</span>
												<span class="tablehidden" v-if="item.missionType === 5">软件测试</span>
												<span class="tablehidden" v-if="item.missionType === 6">部署运维</span>
												<span class="tablehidden" v-if="item.missionType === 6">其他</span>
											</span>
																					
										</div>
									</div>
								</div>
							</li>
						</ul>
					</el-card>
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
			id: '',
			projectList: [],
			progressDetailList: [],
			missionFinishList: [],
			missionPendingList: [],
			missionTestList: [],
			missionTrackingList: [],
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

			sort: 'id'
		};
	},
	// computed: {
	// 	// key(){
	// 	// 	return this.$route.name?this.
	// 	// }
	// },
	created: function() {
		this.id = this.$route.query.id; //???不确定是不是这么获取
		//alert(this.id);
		this.getProjectList();
		//this.getProgressDetailList();
		//获取页面数据
		this.getView();
	},
	
	
	// watch: {
	//     '$route' (to, from) {
	//         this.$router.go(0);
	//     }
	// },
	
	methods: {
		...mapActions(['GETNORMALTYPE']),
		getProjectList() {
			httpGet('/v1/authorization/mission/projectid/get').then(results => {
				const { msg, data, httpCode } = results.data;
				if (httpCode === 200) {
					this.projectList = data.projectList;
				} else if (httpCode === 400) {
					this.setCache('myTask');
				} else if (httpCode !== 401) {
					errTips(msg);
				}
			});
		},
		changeleft(item) {
			//this.setLeft(item.url);
			//this.$router.push(`/desk/${item.url}`);
			//alert(item.projectId);
			this.$router.push({ path: 'kanBanRight', query: { id: item.projectId } });
		},

		handleCurrentChange(val) {
			this.pageData.pageNo = val;
			this.getView();
		},

		getView() {
			this.loading = true;
			httpGet('/v1/authorization/mission/progressbyproject/get', { id: this.id }).then(results => {
				const { httpCode, msg, data } = results.data;
				if (httpCode === 200) {
					this.missionFinishList = data.missionFinishList;
					this.missionPendingList = data.missionPendingList;
					this.missionTestList = data.missionTestList;
					this.missionTrackingList = data.missionTrackingList;
					this.loading = false;
					Object.assign(this.pageData, val);
				} else if (msg === '该条件暂无数据') {
					this.loading = false;
					this.progressDetailList = [];
					message('暂无数据');
				}
			});
		}
	}
};
</script>
<style lang="scss">
@import '@/assets/scss/square.scss';
.box-card0 {
	text-align: center;
	margin-top: 40px;
	margin-left: 2px;
	width: 18%;
	float: left;
	& ::after {
		content: '';
		clear: both;
		display: table;
	}
	.el-card__body {
		padding: 0;
	}
	span {
		font-size: 14px;
	}
}

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
