<template>
	<div class="manager-container">
		<div style="padding-left: 10px;">
		<el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 130%;margin-bottom: 20px;">
		  <el-breadcrumb-item :to="{ path: '/expertInformation' }">信息维护</el-breadcrumb-item>
		  <el-breadcrumb-item>专家信息</el-breadcrumb-item>
		
		</el-breadcrumb>
		</div>
		<el-row :gutter="40">
			<el-col :span="20">
				<el-card class="left-card-menu">
					<h1 style="text-align: center">专家信息</h1>
					<hr style="width: 100%; color: #303133;">
					<h2 style="text-align: left;font-weight: bolder;margin-top: 2%;">基本资料</h2>
					<div class="detail">
					<el-form :model="ruleForm" style="margin-top: 2%;" ref="ruleForm" class="demo-ruleForm">
						<el-row :gutter="20">
							<el-col :span="10">
								<el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
									<el-input v-model="ruleForm.name" ></el-input>
								</el-form-item>
								<el-form-item label="性别" :label-width="formLabelWidth">
									<el-select v-model="ruleForm.sex" placeholder="请选择性别" style="width: 100%;">
										<el-option label="男" value="1"></el-option>
										<el-option label="女" value="2"></el-option>
										<el-option label="未知" value="3"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="10">
								<div style="text-align: center;">
								<Avatar></Avatar>
								</div>
								
							</el-col>
						</el-row>
						<el-row :gutter="20">
							<el-col :span="10">
								<el-form-item label="邮箱" :label-width="formLabelWidth">
									<el-input v-model="ruleForm.email" :disabled="true"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="10">
								<el-form-item label="手机" :label-width="formLabelWidth">
									<el-input v-model="ruleForm.phone" :disabled="true"></el-input>
								</el-form-item>
							</el-col>
					
						</el-row>
						<el-row :gutter="20">
							<el-col :span="10">
								<el-form-item label="学历" :label-width="formLabelWidth">
									<el-select v-model="ruleForm.education" placeholder="请选择学历" style="width: 100%;">
										<el-option label="高中" value="1"></el-option>
										<el-option label="大专" value="2"></el-option>
										<el-option label="本科" value="3"></el-option>
										<el-option label="研究生" value="4"></el-option>
										<el-option label="博士" value="5"></el-option>
										<el-option label="博士后" value="6"></el-option>
										<el-option label="院士" value="7"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="10">
								<el-form-item label="职位" :label-width="formLabelWidth">
									<el-input v-model="ruleForm.position" ></el-input>
								</el-form-item>
							</el-col>
					
						</el-row>
						<el-row :gutter="20">
							<el-col :span="10">
								<el-form-item label="职称" :label-width="formLabelWidth">
									<el-input v-model="ruleForm.jobTitle" ></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="10">
								<el-form-item label="个人主页" :label-width="formLabelWidth">
									<el-input v-model="ruleForm.homepage" ></el-input>
								</el-form-item>
							</el-col>
					
						</el-row>
						<el-row :gutter="20">
					
							<el-col :span="10">
								<el-form-item label="工作单位" :label-width="formLabelWidth">
									<el-input v-model="ruleForm.workUnit" ></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="10">
								<el-form-item label="部门" :label-width="formLabelWidth">
									<el-input v-model="ruleForm.department" ></el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row :gutter="20">
							<el-col :span="10">
								<el-form-item label="国家" :label-width="formLabelWidth">
									<!-- <el-input v-model="ruleForm.nation" ></el-input> -->
									<foreign-area :selected="ruleForm.nation" selectBg="selectGray" groupBg="groupGray" @selectCountry="selectCountry"></foreign-area>
								</el-form-item>
							</el-col>
							<el-col :span="10">
								<el-form-item label="省市/自治区":label-width="formLabelWidth">
									<el-cascader
									  size="large"
									  placeholder="请选择省市"
									  :options="options"
									  v-model="selectedOptions"
									  style="width: 100%;"
									></el-cascader>
								</el-form-item>
							</el-col>
					
					
						</el-row>
						<el-row :gutter="20">
							<el-col :span="10">
								<el-form-item label="通讯地址" :label-width="formLabelWidth">
									<el-input v-model="ruleForm.contactAddress" ></el-input>
								</el-form-item>
							</el-col>
					
					
							<hr style="width: 100%; color: #303133;">
						</el-row>
						<h2 style="text-align: left;font-weight: bolder;margin-top: 2%;margin-bottom: 2%;">研究兴趣</h2>
						<el-row :gutter="20">
							
							<el-form-item label="研究方向":label-width="formLabelWidth" prop="researchDirection">
								<el-input v-model="researchName" style="width: 70%" readonly="true"></el-input>
								<el-button  type="text" @click="keywordsVisible = true" class="add" ><i class="el-icon-plus"></i>添加</el-button>
							</el-form-item>
				
							<el-dialog title="请选择个人研究方向" :visible.sync="keywordsVisible" style="text-align: left;" width="50%">
								<div style="margin: 0 auto">
								<el-transfer
								
								 v-model="value"
								 :data="data">
							   </el-transfer>
							   </div>
							  <div slot="footer" class="dialog-footer">
								<el-button @click="keywordsVisible = false">取 消</el-button>
								<el-button type="primary" @click="printValue">确 定</el-button>
							  </div>
							</el-dialog>
			
					
						</el-row>
						<el-row :gutter="20">
							<el-form-item label="个人关键词" :label-width="formLabelWidth">
								<el-input v-model="ruleForm.cruxList" style="width: 70%" readonly="true"></el-input>
								<el-popover placement="right" v-model="visible" width="200">
									<el-input placeholder="关键词" v-model="interest"></el-input>
									<div style="text-align: right; margin-top: 10px">
										<el-button size="mini" type="text" @click="visible = false">取消</el-button>
										<el-button type="primary" size="mini" @click="addMission">确定</el-button>
									</div>
								
									<span class="add" slot="reference">
										<i class="el-icon-plus"></i>
										新建关键词
									</span>
								</el-popover>
							</el-form-item>
							
							
						
						</el-row>
							
						
					</el-form>
					</div>
					<div style="text-align: center;">
						<el-button type="primary"  @click="submitForm('ruleForm')" size="medium" style="width:150px;">修改</el-button>
					</div>
				</el-card>
			</el-col>

		</el-row>
	

	</div>
</template>

<script>
	import { httpGet, httpDelete } from "@/utils/http.js";
	import { specificDate } from '@/utils/getDate.js';
	import { message, successTips, errTips } from "@/utils/tips.js";
	import {provinceAndCityData,CodeToText} from "element-china-area-data";
	import foreignArea from "@/view/loginRegister/register/components/foreignArea";
	import Avatar from "@/common/upload/Avatar";
	export default {
		components: {
			foreignArea,
			Avatar
		},
		data() {
			// const generateData = _ => {
			//         const data = [];
			//       //  const cities = ['上海', '北京', '广州', '深圳', '南京', '西安', '成都'];
			//       //  const pinyin = ['shanghai', 'beijing', 'guangzhou', 'shenzhen', 'nanjing', 'xian', 'chengdu'];
			//         for (let i=1;i<=4;i++) {
			// 			data.push({
			// 				key:i,
			// 				label:`备选项 ${i}`
			// 			})
			// 		}
			//         return data;
			//       };
			return {
				// data: generateData(),
				selectedOptions: [],
				researchName:[],
				data:[],
				value: [],
				filterMethod(query, item) {
				  return item.pinyin.indexOf(query) > -1;
				},
				keywordsVisible:false,
				visible:false,
				interest:"",
				formLabelWidth:'100px',
				ED:["无","高中","大专","本科","研究生","博士","博士后","院士"],
				Nation:'',
				options: provinceAndCityData,
				newcity: CodeToText,
				ruleForm:{
					address: "",
					city: "",
					contactAddress: "",
					cruxList:[],
					department: "",
					education:null,
					email: "",
					headurl:"",
					homepage:"",
					id:null,
					jobTitle:"",
					name:"",
					nation:"",
					phone:"",
					position:"",
					province:"",
					researchDirectionList:[],
					role:3,
					school:"",
					sex :null,
					workUnit :"",
				},
				
			}
		},
		computed: {
		},
		created: function() {
		  
		  this.getResearchList();
		  this.getView();
		  
		},
		methods: {
			submitForm(formName){
				this.ruleForm.province = this.newcity[this.selectedOptions[0]];
			 	this.ruleForm.city = this.newcity[this.selectedOptions[1]];
				this.ruleForm.researchDirectionList=this.value;
				//console.log(this.researchObject);
				console.log(this.ruleForm);
				httpPut("/v1/authorization/coreuser/review/user",this.ruleForm).then(results => {
					const{httpCode,msg} = results.data;
					if (httpCode === 200) {
						successTips('注册评审专家成功');
					} else {
						errTips(msg);
					}
				})
			},
			selectCountry(val){
				//console.log(val);
				this.ruleForm.nation=val;
			},
			printValue(){
				console.log(this.value);
				for(var i = 0; i<this.value.length; i++){
					this.researchName.push(this.researchList[this.value[i]-1].researchDirection);
				}
				this.keywordsVisible = false;
			},
			addMission() {
				if (this.interest==''){
					errTips('关键词不能为空');
					this.visible=false;
					return false;
				} else {
					this.ruleForm.cruxList.push(this.interest);
					this.interest="";
					this.visible=false;
				}
				
			},
			getResearchList(){
				httpGet("/v1/public/coreuser/list/research").then(results => {
					const{httpCode,msg,data} = results.data;
					if (httpCode === 200){
						this.researchList=data.researchDirectionList;
						console.log(this.researchList);
						this.data = [];
						for (var i=0;i<this.researchList.length;i++){
						          this.data.push({
						            label: this.researchList[i].researchDirection,
						            key: this.researchList[i].id
						         //   pinyin: pinyin[index]
						          });
						 }
						 console.log(this.data);
					}else {
						errTips(msg);
					}
				})
			},
			getView(){
				
				httpGet("/v1/authorization/coreuser/reviewexpert/get").then(results => {
				  const { httpCode, msg, data } = results.data;
				  if (httpCode == 200) {
				    this.ruleForm=data;
					if (this.ruleForm.sex == 1){
						this.ruleForm.sex='男';
					} else if (this.ruleForm.sex == 2){
						this.ruleForm.sex='女';
					} else {
						this.ruleForm.sex='未知';
					}
					
					this.ruleForm.education = this.ED[this.ruleForm.education];
					this.Nation = {value:this.ruleForm.nation, label:this.ruleForm.nation};
					this.researchName = this.ruleForm.researchDirectionList;
					//console.log(this.value);
					var index;
					for (let i of this.ruleForm.researchDirectionList){
						index = this.researchList.map(item => item.researchDirection).indexOf(i) + 1;
						this.value.push(index);
					}
					console.log("value:",this.value);
					
				  } else {
				    errTips(msg);
				  }
				  
				});
			},
			handleChange(file, fileList) {
				this.fileList = fileList.slice(-3)
			},
			closeSubmitDialog(){
				this.dialogSubmitVisible = false;
			},
		}
	}
</script>

<style lang="scss" scoped>
.detail{
	.el-input {
		//display: inline-block;
		width: 240px;
		
	}
	.el-select{
		width: 240px;
	}
	
}
.container{
	.add {
		
		cursor: pointer;
		color: #8c8c8c;
		margin-left: 10px;
		&:hover {
			color: #3e76b8;
		}
	}
}
</style>
