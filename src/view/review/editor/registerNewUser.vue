<template>
	<div class="manager-container">
		<div style="padding-left: 10px;">
			<el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 130%;margin-bottom: 20px;">
				<el-breadcrumb-item :to="{ path: '/editorManager' }">评审管理</el-breadcrumb-item>
				<el-breadcrumb-item>注册新用户</el-breadcrumb-item>

			</el-breadcrumb>
		</div>
		<el-row :gutter="40">
			<el-col :span="20">

				<el-card class="left-card-menu">
					<!-- <h1 style="text-align: center">注册新用户</h1> -->
					<el-form :rules="rules" :model="ruleForm" :label-position="left" label-width="120px" style="margin-top: 2%;" ref="ruleForm"
					 class="demo-ruleForm" status-icon>
						<el-form-item label="由本平台进行专家资格校验" label-width="200px">
							<label v-for="(item, index) in isSee" :key="index">
								<input name="Fruit" type="radio" :value="item.value" v-model="ruleForm.checkedValue" />
								{{ item.value }}
							</label>
						</el-form-item>
						<hr style="width: 100%; color: #303133;">
						<h2 style="text-align: left;font-weight: bolder;margin-top: 2%;">检索新用户是否已在平台注册：</h2>
						<el-input v-model="keywords" placeholder="用户名/手机号/邮箱" style="width:50%;margin-top: 2%;margin-right: 20px;"
						 auto-complete="off"></el-input>
						<el-button type="primary" @click="searchUser()">搜索</el-button>
						<div v-show="searchForm == true">
							<el-table :data="searchData " :header-cell-style="rowClass" style="margin-top:10px;">
								<el-table-column prop="userName" label="用户名"> </el-table-column>
								<el-table-column prop="phone" label="手机"></el-table-column>
								<el-table-column prop="email" label="邮箱"></el-table-column>
								<el-table-column prop="role" label="角色">
									<template slot-scope="scope">
										<span v-if="scope.row.role==1">项目发布者</span>
										<span v-if="scope.row.role==2">项目经理</span>
										<span v-if="scope.row.role==3">评审专家</span>
										<span v-if="scope.row.role==4">评审管理员</span>
									</template>
								</el-table-column>
								<el-table-column label="操作">
									<template slot-scope="scope">
										<el-button @click="chooseUser(scope.row.id)" type="text" size="medium">设为评审专家</el-button>

									</template>
								</el-table-column>
							</el-table>
						</div>
						<div v-show="haveUser == false">
							<h2 style="text-align: left;font-weight: bolder;margin-top: 2%;margin-bottom: 2%;">登录新用户</h2>
							<el-form-item label="请输入用户名" prop="userName" :error="errorList.userError">
								<el-input v-model="ruleForm.userName" style="width:40%" autocomplete="off"></el-input>
							</el-form-item>
							<el-form-item label="手机" prop="phone" :error="errorList.phoneError">
								<el-input v-model="ruleForm.phone" style="width:40%" autocomplete="off"></el-input>
							</el-form-item>
							<el-form-item label="邮箱" :error="errorList.emailError" prop="email">
								<el-input v-model="ruleForm.email" style="width:40%" autocomplete="off"></el-input>
							</el-form-item>
							<el-form-item label="请输入密码" prop="password" :error="errorList.passError">
								<el-input type="password" v-model="ruleForm.password" style="width:40%" autocomplete="off"></el-input>
							</el-form-item>
							<el-form-item label="请再次输入密码" prop="checkPass" :error="errorList.passError">
								<el-input type="password" v-model="ruleForm.checkPass" style="width:40%" autocomplete="off"></el-input>
							</el-form-item>
							<div style="text-align: center;">
								<el-button type="primary" @click="submitForm('ruleForm')" size="medium" style="width:150px;">注册</el-button>
							</div>
						</div>

					</el-form>

	<!-- </div> -->
	</el-card>
	</el-col>
	</el-row>


	</div>
</template>

<script>
	import {
		httpGet,
		httpPost,
		httpPut,
		httpDelete
	} from "@/utils/http.js";
	import {
		message,
		successTips,
		errTips
	} from "@/utils/tips.js";
	import regular from "@/mixins/regular/registerNewUser.js";

	export default {
		name: 'registerNewUser',
		mixins: [regular],
		data() {
			return {
				isSee: [{
					value: '是'
				}, {
					value: '否'
				}],
				keywords: "",
				searchForm: false,
				searchData: [],
				keywordsVisible: false,
				haveUser: true,
				imageUrl: '',
				ruleForm: {
					checkPass: "",
					checkedValue: "否",
					address: "",
					city: "",
					//contactAddress: "",
					cruxList: [],
					department: "",
					education: null,
					email: "",
					headurl: "",
					homepage: "",
					//id:null,
					jobTitle: "",
					//name:"",
					nation: "",
					password: "",
					phone: "",
					position: "",
					province: "",
					researchDirectionList: [],
					role: 4,
					school: "",
					sex: null,
					userName: "",
					workUnit: "",
				},
			}
		},
		computed: {},
		created: function() {
			// this.getView();
		},
		methods: {
			submitForm(formName) {

				console.log(this.ruleForm);
				httpPost("/v1/authorization/coreuser/review/costmer", this.ruleForm).then(results => {
					const {
						httpCode,
						msg
					} = results.data;
					if (httpCode === 200) {
						successTips('注册新用户成功');
					} else {
						errTips(msg);
					}
					this.keywords = "",
						Object.assign(this.$ruleForm, this.$options.ruleForm())
				})


			},
			//注册已有用户为专家
			chooseUser(val) {

				httpGet("/v1/authorization/coreuser/review/byidregister", {
					id: val
				}).then(results => {
					const {
						httpCode,
						msg,
						data
					} = results.data;

					if (httpCode === 200) {
						this.ruleForm = data;
						//console.log(this.ruleForm);
						httpPut("/v1/authorization/coreuser/review/user", this.ruleForm).then(results => {
							const {
								httpCode,
								msg
							} = results.data;
							if (httpCode === 200) {
								successTips('用户已变为专家');
							} else {
								errTips(msg);
							}
							this.keywords = "",
							Object.assign(this.$ruleForm, this.$options.ruleForm())
							//console.log(this.ruleForm);
						})
					} else {
						this.searchData = [];
						this.haveUser = false;
						errTips(msg);
					}
					this.searchForm = true;
				});


			},
			searchUser() {
				this.searchData = [];
				httpGet("/v1/authorization/coreuser/review/user", {
					userNamePhoneEmail: this.keywords
				}).then(results => {
					const {
						httpCode,
						msg,
						data
					} = results.data;

					if (httpCode === 200) {
						this.searchData.push({
							email: data.email,
							id: data.id,
							phone: data.phone,
							role: data.role,
							userName: data.userName
						});
					} else {
						this.searchData = [];
						this.haveUser = false;
						errTips(msg);
					}
					this.searchForm = true;
				});
			},

			rowClass() {
				return "background:#F4F6F9;";
			}
		}
	}
</script>

<style lang="scss" scoped>
	.add {
		cursor: pointer;
		color: #8c8c8c;

		&:hover {
			color: #3e76b8;
		}
	}

	.avatar-uploader .el-upload {
		border: 1px solid #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}

	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}

	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 100px;
		height: 100px;
		line-height: 100px;
		text-align: center;
	}

	.avatar {
		width: 100px;
		height: 100px;
		display: block;
	}
</style>
