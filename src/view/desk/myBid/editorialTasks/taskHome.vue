
<template>
	<div class="ganttIndex" style="width:100%">
		<ul class="taskMain">
			<li class="main-index" v-for="(item, index) in gettaskList" :key="index">
				<span class="topBom">
					<i v-if="index != 0 && gettaskList.length != 1" @click="topBtb(index, item.id)" class="icon iconfont icon-tubiaozhizuo-2"></i>
					<i v-if="index != gettaskList.length - 1" @click="botBtb(index, item.id)" class="icon iconfont icon-tubiaozhizuo-1"></i>
				</span>
				<span @click="(dialogVisible = true), (dialogIndex = index)" v-show="!item.changeTask" class="taskName">{{ item.content }}</span>
				<span @click="(dialogVisible = true), (dialogIndex = index)" v-show="!item.changeTask" class="taskName">{{ item.subtitle }}</span>
				<!-- 这里有问题 -->
				<i @click="(dialogVisible = true), (dialogIndex = index)" class="el-icon-document"></i>

				<el-input v-show="item.changeTask" v-model="item.changeTitle" placeholder="请输入内容" style="width:250px;margin-right:10px" size="small"></el-input>
				<el-button
					@click="changeTaskName({ content: item.changeTitle, id: item.upData.id, userId: item.upData.userId }, item)"
					v-show="item.changeTask"
					size="small"
					style="color:white;background:#4c83c3;margin-left:10px;"
				>
					确定
				</el-button>
				<el-button
					v-show="item.changeTask"
					size="small"
					@click="
						item.changeTask = !item.changeTask;
						item.changeTitle = item.content;
					"
				>
					取消
				</el-button>
				<el-popover placement="right" trigger="click" @hide="changeProgress(item.upData, item)">
					<div class="popo-item">
						<el-select v-model="item.upData.userId" slot="prepend" placeholder="请选择用户" size="small" style="width:100%">
							<el-option v-for="(items, index) in item.userList" :key="index" :value="items.id" :label="items.userName"></el-option>
						</el-select>
					</div>

					<div class="popo-item">
						<el-date-picker
							format="yyyy 年 MM 月 dd 日"
							value-format="yyyy-MM-dd"
							v-model="item.upData.startTime"
							type="date"
							style="width:100%"
							size="small"
							placeholder="开始时间"
							:picker-options="endDatePicker"
							:editable="false"
							:clearable="false"
						></el-date-picker>
					</div>
					<div class="popo-item">
						<el-date-picker
							format="yyyy 年 MM 月 dd 日"
							value-format="yyyy-MM-dd"
							size="small"
							v-model="item.upData.endTime"
							type="date"
							style="width:100%"
							placeholder="结束时间"
							:picker-options="endDatePicker"
							:editable="false"
							:clearable="false"
						></el-date-picker>
					</div>

					<div class="popo-item">
						<el-input placeholder="完成度" size="small" :disabled="item.upData.accomplishProgress === 100 ? true : false" v-model="item.upData.accomplishProgress">
							<template slot="append">
								%
							</template>
						</el-input>
					</div>
					<el-button slot="reference" v-show="!item.changeTask" style="color:#909399">
						{{ item.select }}
						<!-- 参与者改为多个人的用户名 -->
						<span v-show="!item.select">{{ item.participantNames }}，{{ item.startTime }} 至 {{ item.endTime }}，完成度{{ item.accomplishProgress }}%</span>
						<span v-show="item.select">，</span>
						{{ item.statDate }}
						<span v-show="item.enDate">至</span>
						{{ item.enDate }}
						<span v-show="item.enDate">，完成度：70%</span>
					</el-button>
				</el-popover>
				<i @click="item.changeTask = !item.changeTask" class="el-icon-edit"></i>
				<i @click="deleTask(item.id, index)" class="el-icon-delete"></i>
			</li>
		</ul>
		<!-- </div> -->
		<el-dialog
			v-if="gettaskList.length > 0"
			title="任务描述"
			:visible.sync="dialogVisible"
			width="600px"
			@open="changeSuccess = false"
			@close="handleClose(gettaskList[dialogIndex])"
		>
			<el-input type="textarea" :rows="10" placeholder="请输入描述" v-model="gettaskList[dialogIndex].description"></el-input>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false" size="small">取 消</el-button>
				<el-button type="primary" @click="changeDescription(gettaskList[dialogIndex])" size="small">确 定</el-button>
			</span>
		</el-dialog>
		<el-dialog title="历史记录" :visible.sync="dialogVisible_two" width="700px">
			<ul class="uploadItem">
				<li v-for="(item, index) in uploadList" :key="index">
					<span>于 {{ item.gmtCreate }} 上传的资源：</span>
					<a :href="item.resource" target="_blank">点击查看</a>
				</li>
			</ul>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible_two = false" size="small">取 消</el-button>
				<el-button type="primary" size="small" @click="dialogVisible_two = false">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { httpGet, httpPut, httpDelete } from '@/utils/http.js';
import { successTips, errTips } from '@/utils/tips.js';
import { MessageBox } from 'element-ui';
import { specificDate } from '@/utils/getDate.js';
export default {
	data: function() {
		return {
			dialogVisible: false,
			dialogVisible_two: false,
			changeSuccess: false,
			progress: 70,
			dialogIndex: 0,
			messages: [],
			uploadResource: '',
			uploadList: [],
			httpUrlToRepo: '',
			endDatePicker: {
				disabledDate(time) {
						return time.getTime() < new Date().getTime()- 86400000 ;
				},
			},
		};
	},

	computed: {
		...mapGetters(['gettaskList', 'getuploadResource'])
	},
	mounted: function() {},
	methods: {
		...mapMutations(['settaskList', 'setOrder', 'setCache']),
		//历史上传记录
		openHistory() {
			this.dialogVisible_two = true;
			httpGet('/v1/authorization/bids/select/resource', {
				castId: this.$route.query.projectId
			}).then(results => {
				const { httpCode, data, msg } = results.data;
				if (httpCode === 200) {
					for (let i of data.resourceList) {
						i.gmtCreate = specificDate(i.gmtCreate);
					}
					this.uploadList = data.resourceList;
				} else if (httpCode !== 401) {
					errTips(msg);
				}
			});
		},
		//更新任务进度
		changeProgress(end, start) {
			const progressYz = /^(0|[1-9][0-9]?|100)$/;
			if (new Date(end.startTime.replace(/\-/g, '/')) > new Date(end.endTime.replace(/\-/g, '/'))) {
				errTips('开始时间不能大于结束时间');
				return false;
			} else if (!progressYz.test(start.upData.accomplishProgress)) {
				errTips('进度请填写0到100');
			} else if (
				start.upData.accomplishProgress != start.accomplishProgress ||
				start.upData.startTime != start.startTime ||
				start.upData.userId != start.userId ||
				start.upData.endTime != start.endTime
			) {
				let startCompare = new Date(end.startTime);
				let endCompare = new Date(end.endTime);
				let sustainTime = (endCompare - startCompare) / (1000 * 60 * 60 * 24) + 1;
				end.sustainTime = sustainTime;
				this.changeTaskName(end, start);
			}
		},
		//任务上移
		topBtb(index, taskId) {
			httpPut('/v1/authorization/bids/ordersup/update', { id: taskId }).then(results => {
				const { httpCode, msg } = results.data;
				if (httpCode === 200) {
					this.setOrder({ index1: index - 1, index2: index });
				} else if (httpCode === 400) {
					this.setCache('myBid');
				} else if (httpCode !== 401) {
					errTips(msg);
				}
			});
		},
		//任务下移
		botBtb(index, taskId) {
			httpPut('/v1/authorization/bids/ordersdown/update', { id: taskId }).then(results => {
				const { httpCode, msg } = results.data;
				if (httpCode === 200) {
					this.setOrder({ index1: index + 1, index2: index });
				} else if (httpCode === 400) {
					this.setCache('myBid');
				} else if (httpCode !== 401) {
					errTips(msg);
				}
			});
		},
		//修改任务名称
		changeTaskName(endValue, startValue) {
			if (startValue.changeTitle.length > 20) {
				errTips('任务名称不可超过20个字');
				return false;
			}
			httpPut('/v1/authorization/bids/missioninfo/update', endValue).then(results => {
				const { httpCode, msg } = results.data;
				if (httpCode === 200) {
					startValue.changeTask = false;
					Object.assign(startValue, endValue);
					this.settaskList(this.gettaskList);
					successTips('任务已更新');
				} else if (httpCode === 400) {
					this.setCache('myBid');
				} else if (httpCode !== 401) {
					errTips(msg);
				}
			});
		},
		//关闭任务描述弹窗事件
		handleClose(value) {
			if (!this.changeSuccess) {
				value.description = value.describeModel;
			}
		},
		//修改任务描述
		changeDescription(value) {
			if (value.description && value.description.length > 300) {
				errTips('任务描述不可超过300个字');
				return false;
			}
			let newValue = {
				description: value.description,
				id: value.id,
				userId: value.userId
			};
			httpPut('/v1/authorization/bids/missioninfo/update', newValue).then(results => {
				const { httpCode, msg } = results.data;
				if (httpCode === 200) {
					this.changeSuccess = true;
					value.describeModel = value.description;
					this.dialogVisible = false;
					successTips('任务已更新');
				} else if (httpCode === 400) {
					this.setCache('myBid');
				} else if (httpCode !== 401) {
					errTips(msg);
				}
			});
		},
		//删除任务
		deleTask(id, index) {
			let newList = [...this.gettaskList];
			MessageBox.confirm('是否确定将此任务删除？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				httpDelete(`/v1/authorization/bids/missioninfo/delete/${id}`).then(results => {
					const { httpCode, msg } = results.data;
					if (results.data.httpCode === 200) {
						newList.splice(index, 1);
						this.settaskList(newList);
						//this.getSubList(this.titleId);
						successTips('此任务已删除');
					} else if (httpCode === 400) {
						this.setCache('myBid');
					} else if (httpCode !== 401) {
						errTips(msg);
					}
				});
			});
		}
	}
};
</script>
<style lang="scss">
.ganttIndex {
	.icon-shang {
		margin-right: 0;
	}
	.uploadItem {
		margin: 10px 0 5px 0;
		li {
			margin-bottom: 12px;
		}
	}
	.topBom {
		display: inline-block;
		line-height: 9px;
		margin-right: 5px;
	}
	.topBom i {
		display: block;
		font-size: 12px;
	}
	.icon-xia {
		margin-right: 10px;
	}

	.ganttIndexMain {
		border-top: 1px solid #e8e8e8;
		margin-top: 30px;
		& > ul {
			margin-top: 35px;
		}
	}
	.uoloadHistory {
		margin-left: 40px;
		color: rgb(144, 147, 153);
		&:hover {
			cursor: pointer;
			color: #3e76b8;
		}
	}
	.main-index {
		.el-button {
			background: #f8f8f8;
			border-color: #d0d0d0;
			padding: 5px;
			font-size: 13px;
			&:focus,
			&:hover {
				color: black;
				border-color: #d0d0d0;
				background: #f8f8f8;
			}
		}
	}

	.main-index {
		margin-top: 10px;
		font-size: 14px;
		i:hover {
			cursor: pointer;
		}
		.el-icon-edit {
			margin-left: 8px;
		}
	}
	.taskName {
		margin-right: 10px;
		line-height: -12px;
		cursor: pointer;
	}
	.taskName:hover {
		color: #3e76b8;
	}
	.el-dialog__body {
		padding-top: 5px;
		padding-bottom: 5px;
	}
}
.popo-item {
	margin: 10px 0 8px 0;
}

.dialog-footer {
	& span button:nth-child(1) {
		background: #3e76b8;
		color: white;
	}
}
</style>
