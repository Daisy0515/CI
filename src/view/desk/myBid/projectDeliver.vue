<template>
	<div class="editorialTeam">
		<div class="Crumbs">
			<div class="container deskHeader">
				<h4>
					您的位置：
					<router-link to="myBid">我的投标</router-link>
					>
					<span class="active">项目交付</span>
				</h4>
			</div>
		</div>
		<div class="container deskHeader">
			<el-table :data="ReviewTable" style="width:900px;margin:50px auto;" :header-cell-style="rowClass" v-loading="loading">
				<el-table-column label="评审状态" align="center">
					<el-table-column fixed prop="title" label="评审标题" align="center">
						<template slot-scope="scope">
							<el-tooltip class="item" effect="dark" :content="scope.row.title" placement="top-start">
								<span class="tablehidden">{{ scope.row.title }}</span>
							</el-tooltip>
						</template>
					</el-table-column>
					<el-table-column prop="content" label="评审内容" align="center">
						<template slot-scope="scope">
							<el-tooltip class="item" effect="dark" :content="scope.row.content" placement="top-start">
								<span class="tablehidden">{{ scope.row.content }}</span>
							</el-tooltip>
						</template>
					</el-table-column>

					<el-table-column prop="result" label="状态" align="center">
						<template slot-scope="scope">
							<span v-if="scope.row.result === true">通过</span>
							<span v-if="scope.row.result === false">未通过</span>
						</template>
					</el-table-column>

					<el-table-column label="操作" align="center" width="350">
						<template slot-scope="scope">
							<router-link :to="{ path: 'bidView', query: { id: scope.row.id } }">
								<i class="el-icon-search"></i>
								查看
							</router-link>
						</template>
					</el-table-column>
				</el-table-column>
			</el-table>

			<p class="Tips">
				<i class="el-icon-info"></i>
				只有当前项目的所有评审通过才能进行交付；多次上传资源只保留最后一次的上传
			</p>
			<el-table :data="ResourceTable" style="width:900px;margin:50px auto;" :header-cell-style="rowClass" v-loading="loading">
				<el-table-column label="资源上传" align="center">
					<el-table-column prop="id" label="编号" align="center">
						<template slot-scope="scope">
							<el-tooltip class="item" effect="dark" :content="scope.row.id" placement="top-start">
								<span class="tablehidden">{{ scope.row.id }}</span>
							</el-tooltip>
						</template>
					</el-table-column>
					<el-table-column fixed prop="resourceName" label="资源名称" align="center">
						<template slot-scope="scope">
							<el-tooltip class="item" effect="dark" :content="scope.row.resourceName" placement="top-start">
								<span class="tablehidden">{{ scope.row.resourceName }}</span>
							</el-tooltip>
						</template>
					</el-table-column>
					<el-table-column prop="remark" label="备注" align="center">
						<template slot-scope="scope">
							<el-tooltip class="item" effect="dark" :content="scope.row.remark" placement="top-start">
								<span class="tablehidden">{{ scope.row.remark }}</span>
							</el-tooltip>
						</template>
					</el-table-column>

					<el-table-column prop="status" label="状态" align="center">

					</el-table-column>

					<el-table-column label="操作" align="center" width="350">
						<template slot-scope="scope">
							<sourceUpload :uploadIndex="uploadIndex" :fileIndex="scope.row.id" v-on:setIdCard="setIdCard2(data=$event,id=scope.row.id)" />
							<!-- <el-upload class="upload-demo"
							ref="upload" action="localhost"
							:on-preview="handlePreview"
							:on-remove="handleRemove"
							:file-list="fileList2"
							list-type="picture"
							:data="QQQ"
							:limit="1"
							:on-success="onSuccess"
							:on-error="onError">
							<el-button size="small" type="primary">点击上传图片</el-button>
							<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
							</el-upload> -->
						</template>
					</el-table-column>
				</el-table-column>
			</el-table>
			<div class="cancel">
				<el-button type="primary" @click="returnMybid" size="medium" style="width:150px;margin-left:25%">返回</el-button>
				<el-button type="primary" @click="submitForm" size="medium" style="width:150px;margin-left:25%">提交</el-button>
			</div>
		</div>
	</div>
</template>
<script>
import { httpGet, httpPost, httpDelete,httpPut } from '@/utils/http.js';
import { mapGetters, mapMutations } from 'vuex';
import { successTips, errTips } from '@/utils/tips.js';
import { MessageBox } from 'element-ui';
import sourceUpload from '@/common/upload/resourceUpload';
export default {
	components: {
		sourceUpload
	},
	data() {
		return {
			uploadIndex:false,
			resourceId:"",
			resourceUrl:"",
			resourceUrlList:[],
			goUpload: true,
			fileName: 'bidTask',
			loading: false,
			Id: '',
			ReviewTable: [],
			ResourceTable: [],
			ReviewList: [],
			ruleForm:{
				resourceUrlList:[]
			}
		};
	},

	created: function() {
		this.Id = this.$route.query.Id;
		if (!this.Id) {
			this.$router.push({ path: 'myBid' });
			return false;
		}
		this.getView();
	},
	watch:{
		resourceUrlList:function(val){
			console.log('%s, %s',this.resourceUrlList.length,this.ResourceTable.length);

			if (this.resourceUrlList.length==this.ResourceTable.length){

				console.log(this.resourceUrlList);
				for ( var i = 0;i<this.resourceUrlList.length;i++){
					console.log(i,this.resourceUrlList[i].resourceUrl);
					if(this.resourceUrlList[i].resourceUrl==null){
						this.resourceUrlList[i].resourceUrl = this.ResourceTable[i].resourceUrl;
					}
				}
				this.ruleForm.resourceUrlList=this.resourceUrlList;
				httpPut(
				  "/v1/authorization/review/team/update",
				  this.ruleForm
				).then(results => {
				  const { msg, httpCode } = results.data;
				  if (httpCode === 200) {
				    successTips("提交成功");
					this.$router.push({ path: './mybid' });
				  } else {
				//	this.uploadIndex=false;
				    errTips(msg);
				  }
				});
			}
		}
	},


	methods: {
		...mapMutations(['setCache']),
		returnMybid() {
			this.$router.push({ path: './mybid' });
		},

		sortBykey(arr,key){
		  return arr.sort(function (a, b) {
			let x = a[key]
			let y = b[key]
			return ((x < y) ? -1 : (x > y) ? 1 : 0)
		  })
		},
		getView() {
			this.loading = true;
			//get /v1/authorization/review/team/list

			//get /v1/authorization/review/team/list
			httpGet('/v1/authorization/review/team/list', {
				id: this.Id
			}).then(results => {
				const { httpCode, msg, data } = results.data;
				if (httpCode === 200) {
					this.ReviewTable = data.reviewStatusList;
					console.log("reviewTable:",this.ReviewTable);
					this.ResourceTable = data.reviewTeamList;
					this.loading = false;
				} else if (httpCode === 400) {
					this.setCache('myBid');
				} else if (httpCode !== 401) {
					errTips(msg);
				}
			});
		},
		setIdCard2(data,id) {
			//console.log(this.uploadIndex);
			//alert(22);
			this.resourceUrl=data.fileName;
			this.resourceId=id;
			var item = {id:this.resourceId,resourceUrl:this.resourceUrl};
			console.log(item);
			this.resourceUrlList.push(item);
			this.resourceUrlList = this.sortBykey(this.resourceUrlList,'id')
		},
		submitForm() {
			this.uploadIndex=true;

			//this.setIdCard2();
			 // this.resourceUrl ? this.setIdCard2() : (this.uploadIndex = !this.uploadIndex);
				// alert(22);
				// console.log(this.resourceUrlList);
				// httpPut(
				//   "/v1/authorization/review/team/update",
				//   this.resourceUrlList
				// ).then(results => {
				//   const { msg, httpCode } = results.data;
				//   if (httpCode === 200) {
				//     successTips("提交成功");
				// 	this.$router.push({ path: './mybid' });
				//   } else {
				//     errTips(msg);
				//   }
				// });
		}
	}
};
</script>
<style lang="scss">
.Tips {
	text-align: center;
	margin-top: 15px;
	color: #909399a8;
}
</style>
