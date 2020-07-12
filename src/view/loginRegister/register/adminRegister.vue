<template>
	<div class="register">
		<Index-Header></Index-Header>
		<div class="container">
			<el-card class="box-card">
				<div slot="header" class="clearfix" style="text-align:center">
					<span>评审管理员注册</span>
				</div>
				<h2 style="text-align: left;font-weight: bolder;margin-top: 2%;">基本资料</h2>
				<div style="text-align: right;">
				<el-form :rules="rules" :model="ruleForm" style="margin-top: 2%;" ref="ruleForm" class="demo-ruleForm">
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item label="姓名" :label-width="formLabelWidth">
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
						<el-col :span="12">
							<div style="text-align: center;">
							<Avatar></Avatar>
							</div>
							
							<!-- <el-form-item label="性别" :label-width="formLabelWidth">
								<el-select v-model="ruleForm.sex" placeholder="请选择性别" style="width: 100%;">
									<el-option label="男" value="1"></el-option>
									<el-option label="女" value="2"></el-option>
									<el-option label="未知" value="3"></el-option>
								</el-select>
							</el-form-item> -->
						</el-col>
					</el-row>
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item label="邮箱" :label-width="formLabelWidth">
								<el-input v-model="ruleForm.email" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="手机" :label-width="formLabelWidth">
								<el-input v-model="ruleForm.phone" :disabled="true"></el-input>
							</el-form-item>
						</el-col>

					</el-row>
					<el-row :gutter="20">
						<el-col :span="12">
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
						<el-col :span="12">
							<el-form-item label="职位" :label-width="formLabelWidth">
								<el-input v-model="ruleForm.position" ></el-input>
							</el-form-item>
						</el-col>

					</el-row>
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item label="职称" :label-width="formLabelWidth">
								<el-input v-model="ruleForm.jobTitle" ></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="个人主页" :label-width="formLabelWidth">
								<el-input v-model="ruleForm.homepage" ></el-input>
							</el-form-item>
						</el-col>

					</el-row>
					<el-row :gutter="20">

						<el-col :span="12">
							<el-form-item label="工作单位" :label-width="formLabelWidth">
								<el-input v-model="ruleForm.workUnit" ></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="部门" :label-width="formLabelWidth">
								<el-input v-model="ruleForm.department" ></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item label="国家" :label-width="formLabelWidth">
								<!-- <el-input v-model="ruleForm.nation" ></el-input> -->
								<foreign-area popularCity="" selectBg="selectGray" groupBg="groupGray" @selectCountry="selectCountry"></foreign-area>
							</el-form-item>
						</el-col>
						<el-col :span="12">
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
						<el-col :span="12">
							<el-form-item label="通讯地址" :label-width="formLabelWidth">
								<el-input v-model="ruleForm.contactAddress" ></el-input>
							</el-form-item>
						</el-col>


						<hr style="width: 100%; color: #303133;">
					</el-row>
					<h2 style="text-align: left;font-weight: bolder;margin-top: 2%;margin-bottom: 2%;">研究兴趣</h2>
					<el-row :gutter="20">
						<el-col :span="19">
						<el-form-item label="研究方向":label-width="formLabelWidth">
							<el-input v-model="researchName" ></el-input>
						</el-form-item>
						</el-col>
						<el-col :span="5">
							<div style="text-align: left;margin-top: 5px;">
							<el-button  type="text" @click="keywordsVisible = true" class="add" ><i class="el-icon-plus"></i>添加</el-button>
							</div>
							
							<el-dialog title="请选择个人研究方向" :visible.sync="keywordsVisible" style="text-align: left;" width="30%">
								<div style="margin-left: 60px;">
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
						</el-col>

					</el-row>
					<!-- <el-row :gutter="20">
					<div style="text-align: left;margin-bottom: 15px;margin-left: 100px;">
						<el-checkbox-group v-model="researchObject" @change="handleCheckedCitiesChange(value)">
						    <el-checkbox v-for="item in researchList" :label="item.researchDirection" :key="item.id" :value="item.id">{{item.researchDirection}}</el-checkbox>
						  </el-checkbox-group>
				
						
					</div>
					</el-row> -->
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item label="个人关键词" :label-width="formLabelWidth">
								<el-input v-model="ruleForm.cruxList" ></el-input>
							</el-form-item>
							
						</el-col>
						<el-col :span="12">
							<div style="text-align: left;margin-top: 10px;">
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
							</div>
						</el-col>
					
					</el-row>
		
					<el-form-item class="cancel" style="text-align: center;">
						<el-button type="primary"  @click="submitForm('ruleForm')" size="medium" style="width:150px;">注册</el-button>
					</el-form-item>
				</el-form>
				</div>





				<!-- <el-form
          :model="companyForm"
          status-icon
          :rules="rules"
          ref="companyForm"
          class="demo-ruleForm"
        >
          <el-form-item prop="companyName" :error="errorList.userError">
            <el-input v-model="companyForm.companyName" placeholder="请输入公司名称">
              <i slot="prefix" class="icon iconfont icon-gongsi00"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="businessLicense" :error="errorList.businessLicenseError">
            <el-input v-model="companyForm.businessLicense" placeholder="请输入统一社会信用代码">
              <i slot="prefix" class="icon iconfont icon-gaikuang1"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="email" :error="errorList.emailError">
            <el-input v-model="companyForm.email" placeholder="请输入邮箱">
              <i slot="prefix" class="icon iconfont icon-youjian"></i>
            </el-input>
          </el-form-item>
          <el-form-item class="city" prop="city">
            <el-cascader
              size="large"
              placeholder="请选择省市"
              :options="options"
              v-model="selectedOptions"
            ></el-cascader>
          </el-form-item>
          <el-form-item prop="address">
            <el-input placeholder="请输入详细地址" v-model="companyForm.address" autocomplete="off">
              <i slot="prefix" class="icon iconfont icon-dizhi"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="phone" :error="errorList.phoneError">
            <el-input placeholder="请输入手机号" v-model="companyForm.phone" autocomplete="off">
              <i slot="prefix" class="icon iconfont icon-dianhua"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="code" :error="errorList.codeError">
            <el-input class="Verification" v-model="companyForm.code" placeholder="请输入验证码">
              <i slot="prefix" class="icon iconfont icon-yanzhengmatianchong"></i>
            </el-input>
            <codeBtn
              :phone="companyForm.phone"
              :codeType="1"
              v-on:setPhoneErr="setPhoneErr($event)"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              placeholder="请输入密码"
              v-model="companyForm.password"
              autocomplete="off"
            >
              <i slot="prefix" class="icon iconfont icon-ziyuanxhdpi"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="checkPass">
            <el-input
              type="password"
              placeholder="请再次输入密码"
              v-model="companyForm.checkPass"
              autocomplete="off"
            >
              <i slot="prefix" class="icon iconfont icon-ziyuanxhdpi"></i>
            </el-input>
          </el-form-item>
          <el-form-item class="Remember" prop="type">
            <el-checkbox-group v-model="companyForm.type">
              <el-checkbox label="我已阅读并同意用户守则" name="type"></el-checkbox>
            </el-checkbox-group>
            <router-link target="_blank" style="margin-left:20px;" to="rules">用户守则</router-link>
          </el-form-item>
          <el-form-item class="register_get">
            <el-button type="primary" @click="submitForm('companyForm')">注册</el-button>
          </el-form-item>
          <el-form-item></el-form-item>
        </el-form> -->
			</el-card>
		</div>
		<Footer></Footer>
	</div>
</template>
<script>
	import {provinceAndCityData,CodeToText} from "element-china-area-data";
	import IndexHeader from "@/common/header/userHeader";
	import Footer from "@/common/footer/footer";
	import {httpPost,httpGet,httpPut} from "@/utils/http.js";
	import codeBtn from "@/common/sendCode/sendPhoneCode";
	import regular from "@/mixins/regular/companyRegister.js";
	import foreignArea from "@/view/loginRegister/register/components/foreignArea";
	import Avatar from "@/common/upload/Avatar";
	import { errTips, successTips } from '@/utils/tips.js';
	export default {
		name: "adminRegister",
		components: {
			foreignArea,
			IndexHeader,
			Footer,
			codeBtn,
			Avatar
		},
		//表单验证
		mixins: [regular],
		data() {
			const generateData = _ => {
			        const data = [];
			      //  const cities = ['上海', '北京', '广州', '深圳', '南京', '西安', '成都'];
			      //  const pinyin = ['shanghai', 'beijing', 'guangzhou', 'shenzhen', 'nanjing', 'xian', 'chengdu'];
			        for (let i=1;i<=4;i++) {
						data.push({
							key:i,
							label:`备选项 ${i}`
						})
					}
			        return data;
			      };
			
			return {
				data: generateData(),
				value: [],
				filterMethod(query, item) {
				  return item.pinyin.indexOf(query) > -1;
				},
				visible: false,
				keywordsVisible:false,
				interest:"",
				formLabelWidth:'100px',
				ruleForm: {
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
					role:4,
					school:"",
					sex :null,
					workUnit :"",
				},
				researchName:[],
				options: provinceAndCityData,
				newcity: CodeToText,
				selectedOptions: [],
				companyForm: {
					companyName: "",
					password: "",
					checkPass: "",
					address: "",
					province: "",
					city: "",
					businessLicense: "",
					email: "",
					code: "",
					phone: "",
					type: []
				},
				researchList:[],
			};
		},
		created: function() {
			this.getResearchList();
			this.getPersonalInfo();
		},
		methods: {
			printValue(){
				console.log(this.value);
				for(var i = 0; i<this.value.length; i++){
					this.researchName.push(this.researchList[this.value[i]-1].researchDirection);
				}
				this.keywordsVisible = false;
			},
			getPersonalInfo(){
				httpGet("/v1/authorization/coreuser/review/register?role=4").then(results => {
					const{httpCode,msg,data} = results.data;
					if (httpCode === 200){
						this.ruleForm.phone=data.phone;
						this.ruleForm.email=data.email;
						this.ruleForm.id = data.id;
					}else {
						errTips(msg);
					}
				})
			},
			setPhoneErr(msg) {
				this.errorList.phoneError = msg;
			},
			//表单提交
			
			selectCountry(val){
				//console.log(val);
				this.ruleForm.nation=val;
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
			
			submitForm(formName){
				this.ruleForm.province = this.newcity[this.selectedOptions[0]];
			 	this.ruleForm.city = this.newcity[this.selectedOptions[1]];
				this.ruleForm.researchDirectionList=this.value;
				//console.log(this.researchObject);
				console.log(this.ruleForm);
				httpPut("/v1/authorization/coreuser/review/user",this.ruleForm).then(results => {
					const{httpCode,msg} = results.data;
					if (httpCode === 200) {
						successTips('注册管理员成功');
					} else {
						errTips(msg);
					}
				})
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
		
		}
		
	}
</script>
<style lang='scss'>
.container{
	.box-card {
	  width: 80%;
	  margin: 5% auto;
	}
	.el-card__header {
	  padding: 20px 0 0 0;
	  font-size: 30px;
	  font-weight: 400;
	  border-bottom: 0;
	}
	.add {
		cursor: pointer;
		color: #8c8c8c;
		
		&:hover {
			color: #3e76b8;
		}
	}
}
</style>
