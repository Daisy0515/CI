<!--专家搜索评审统计的对话框的组件-->
<template>
    <el-dialog  title="专家信息" :visible.sync="dialogFormVisible" :before-close="changeVisible"
               style="width:100%;text-align:left; font-weight: bolder;">
        <div style="width: 70%; margin: 0 auto;">
            <el-row :gutter="40">
            	<el-col >
            		
            			<h2 style="text-align: left;font-weight: bolder;margin-top: 2%;">基本资料</h2>
            		
            			<el-form :model="ruleForm" style="margin-top: 2%;" ref="ruleForm" class="demo-ruleForm">
            				<el-row :gutter="20">
            					<el-col :span="12">
            						<el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
            							<el-input v-model="ruleForm.name" :disabled="true"></el-input>
            						</el-form-item>
            						<el-form-item label="性别" :label-width="formLabelWidth">
										<el-input v-model="ruleForm.sex" :disabled="true"></el-input>
            							<!-- <el-select v-model="ruleForm.sex" placeholder="请选择性别" style="width: 100%;">
            								<el-option label="男" value="1"></el-option>
            								<el-option label="女" value="2"></el-option>
            								<el-option label="未知" value="3"></el-option>
            							</el-select> -->
            						</el-form-item>
            					</el-col>
            					<el-col :span="12">
            						<div style="text-align: center;">
            						<img :src="ruleForm.headurl" class="rounded-circle">
            						</div>
            						
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
										<el-input v-model="ruleForm.education" :disabled="true"></el-input>
            							<!-- <el-select v-model="ruleForm.education" placeholder="请选择学历" style="width: 100%;">
            								<el-option label="高中" value="1"></el-option>
            								<el-option label="大专" value="2"></el-option>
            								<el-option label="本科" value="3"></el-option>
            								<el-option label="研究生" value="4"></el-option>
            								<el-option label="博士" value="5"></el-option>
            								<el-option label="博士后" value="6"></el-option>
            								<el-option label="院士" value="7"></el-option>
            							</el-select> -->
            						</el-form-item>
            					</el-col>
            					<el-col :span="12">
            						<el-form-item label="职位" :label-width="formLabelWidth">
            							<el-input v-model="ruleForm.position" :disabled="true"></el-input>
            						</el-form-item>
            					</el-col>
            			
            				</el-row>
            				<el-row :gutter="20">
            					<el-col :span="12">
            						<el-form-item label="职称" :label-width="formLabelWidth">
            							<el-input v-model="ruleForm.jobTitle" :disabled="true"></el-input>
            						</el-form-item>
            					</el-col>
            					<el-col :span="12">
            						<el-form-item label="个人主页" :label-width="formLabelWidth">
            							<el-input v-model="ruleForm.homepage" :disabled="true"></el-input>
            						</el-form-item>
            					</el-col>
            			
            				</el-row>
            				<el-row :gutter="20">
            			
            					<el-col :span="12">
            						<el-form-item label="工作单位" :label-width="formLabelWidth">
            							<el-input v-model="ruleForm.workUnit" :disabled="true"></el-input>
            						</el-form-item>
            					</el-col>
            					<el-col :span="12">
            						<el-form-item label="部门" :label-width="formLabelWidth">
            							<el-input v-model="ruleForm.department" :disabled="true"></el-input>
            						</el-form-item>
            					</el-col>
            				</el-row>
            				<el-row :gutter="20">
            					<el-col :span="12">
									<el-form-item label="国家":label-width="formLabelWidth">
										<el-input v-model="ruleForm.nation" :disabled="true"></el-input>
									</el-form-item>
            					</el-col>
            					<el-col :span="12">
            						<el-form-item label="省市/自治区":label-width="formLabelWidth">
            							<el-input v-model="ruleForm.province" :disabled="true"></el-input>
            						</el-form-item>
            					</el-col>
            				</el-row>
            				<el-row :gutter="20">
            					<el-col :span="12">
            						<el-form-item label="通讯地址" :label-width="formLabelWidth">
            							<el-input v-model="ruleForm.contactAddress" :disabled="true"></el-input>
            						</el-form-item>
            					</el-col>
            					<hr style="width: 100%; color: #303133;">
            				</el-row>
            				<h2 style="text-align: left;font-weight: bolder;margin-top: 2%;margin-bottom: 2%;">研究兴趣</h2>
            				<el-row :gutter="20">
            					<el-form-item label="研究方向":label-width="formLabelWidth" prop="researchDirection">
            						<el-input v-model="ruleForm.researchDirectionList" style="width: 100%" :disabled="true"></el-input>
            						
            					</el-form-item>
            				</el-row>
            				<el-row :gutter="20">
            					<el-form-item label="个人关键词" :label-width="formLabelWidth">
            						<el-input v-model="ruleForm.cruxList" :disabled="true" style="width: 100%"></el-input>
            					</el-form-item>
            				</el-row>
            			</el-form>
            	
            
            		
            	</el-col>
     
            </el-row>
          </div>
	
    </el-dialog>
</template>

<script>
    export default {
        name: "expertInformation",
        props:{
            ruleForm:{
                type:Object,
                default:null,
            },
            dialogFormVisible:{
                type:Boolean,
                default:false,
            },
        },
        methods:{
            changeVisible(){
                this.$emit('closeDialog');
            },
			rowClass(){
			    return "background:#F4F6F9;";
			}
        },
        data(){
            return{
                formLabelWidth:"100px",
                isReadOnly: true,
            }
        }
    }
</script>

<style scoped>

</style>
