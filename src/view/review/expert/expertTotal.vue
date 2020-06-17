<template>
	<div>
		<div style="padding-left: 10px;">
		<el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 130%;margin-bottom: 20px;">
		  <el-breadcrumb-item :to="{ path: '/expertInformation' }">信息维护</el-breadcrumb-item>
		  <el-breadcrumb-item>评审统计信息</el-breadcrumb-item>
		
		</el-breadcrumb>
		</div>
		<el-card class="left-card-menu">
			<h1 style="text-align: center">评审统计信息</h1>
			<hr style="width: 100%; color: #303133;">
			<h2 style="text-align: left;font-weight: bolder;margin-top: 2%;">当前评审统计</h2>
			<el-form
			:rules="rules"
			:model="ruleForm"
			style="margin-top: 2%;"
			ref="ruleForm" class="demo-ruleForm">
			<el-row :gutter="20">
				<el-table v-loading="loading" :data="tableData" style="width:900px;margin:20px auto" :header-cell-style="rowClass">
					<el-table-column fixed prop="projectCode" label="最近一次接受评审" align="center">
						<template slot-scope="scope">
							<el-tooltip class="item" effect="dark" :content="scope.row.projectCode" placement="top-start">
								<span class="tablehidden">{{ scope.row.projectCode }}</span>
							</el-tooltip>
						</template>
					</el-table-column>
					<el-table-column prop="projectName" label="进行中的评审" align="center">
						<template slot-scope="scope">
							<el-tooltip class="item" effect="dark" :content="scope.row.projectName" >
								<span class="tablehidden">{{ scope.row.projectName }}</span>
							</el-tooltip>
						</template>
					</el-table-column>
					<el-table-column prop="title" label="未完成的评审" align="center">
						<template slot-scope="scope">
							<el-tooltip class="item" effect="dark" :content="scope.row.title" >
								<span class="tablehidden">{{ scope.row.title }}</span>
							</el-tooltip>
						</template>
					</el-table-column>
				</el-table>
				<!-- <hr style="width: 100%; color: #303133;"> -->
			</el-row>

			<h2 style="text-align: left;font-weight: bolder;margin-top: 2%;margin-bottom: 2%;">历史评审邀请统计</h2>
			
			<el-row :gutter="20">
				<el-table v-loading="loading" :data="tableData" style="width:900px;margin:20px auto" :header-cell-style="rowClass">
					<el-table-column fixed prop="projectCode" label="总共邀请次数" align="center">
						<template slot-scope="scope">
							<el-tooltip class="item" effect="dark" :content="scope.row.projectCode" placement="top-start">
								<span class="tablehidden">{{ scope.row.projectCode }}</span>
							</el-tooltip>
						</template>
					</el-table-column>
					<el-table-column prop="projectName" label="接受评审" align="center">
						<template slot-scope="scope">
							<el-tooltip class="item" effect="dark" :content="scope.row.projectName" >
								<span class="tablehidden">{{ scope.row.projectName }}</span>
							</el-tooltip>
						</template>
					</el-table-column>
					<el-table-column prop="title" label="拒绝评审" align="center">
						<template slot-scope="scope">
							<el-tooltip class="item" effect="dark" :content="scope.row.title" >
								<span class="tablehidden">{{ scope.row.title }}</span>
							</el-tooltip>
						</template>
					</el-table-column>
					<el-table-column prop="title" label="撤回邀请" align="center">
						<template slot-scope="scope">
							<el-tooltip class="item" effect="dark" :content="scope.row.title" >
								<span class="tablehidden">{{ scope.row.title }}</span>
							</el-tooltip>
						</template>
					</el-table-column>
					<el-table-column prop="title" label="接受评审前被中止" align="center">
						<template slot-scope="scope">
							<el-tooltip class="item" effect="dark" :content="scope.row.title" >
								<span class="tablehidden">{{ scope.row.title }}</span>
							</el-tooltip>
						</template>
					</el-table-column>
				</el-table>
			<!-- 	<hr style="width: 100%; color: #303133;"> -->
			</el-row>
			
			<h2 style="text-align: left;font-weight: bolder;margin-top: 2%;margin-bottom: 2%;">历史评审表现汇总</h2>
			<el-row :gutter="20">
				
				<el-table v-loading="loading" :data="tableData" style="width:900px;margin:20px auto" :header-cell-style="rowClass">
						<el-table-column fixed prop="projectCode" label="总共完成的评审" align="center">
							<template slot-scope="scope">
								<el-tooltip class="item" effect="dark" :content="scope.row.projectCode" placement="top-start">
									<span class="tablehidden">{{ scope.row.projectCode }}</span>
								</el-tooltip>
							</template>
						</el-table-column>
						<el-table-column prop="projectName" label="按时完成评审次数" align="center">
							<template slot-scope="scope">
								<el-tooltip class="item" effect="dark" :content="scope.row.projectName" >
									<span class="tablehidden">{{ scope.row.projectName }}</span>
								</el-tooltip>
							</template>
						</el-table-column>
						<el-table-column prop="title" label="延期完成评审次数" align="center">
							<template slot-scope="scope">
								<el-tooltip class="item" effect="dark" :content="scope.row.title" >
									<span class="tablehidden">{{ scope.row.title }}</span>
								</el-tooltip>
							</template>
						</el-table-column>
						<el-table-column prop="title" label="撤回已分配任务" align="center">
							<template slot-scope="scope">
								<el-tooltip class="item" effect="dark" :content="scope.row.title" >
									<span class="tablehidden">{{ scope.row.title }}</span>
								</el-tooltip>
							</template>
						</el-table-column>
						<el-table-column prop="title" label="接受评审后被中止" align="center">
							<template slot-scope="scope">
								<el-tooltip class="item" effect="dark" :content="scope.row.title" >
									<span class="tablehidden">{{ scope.row.title }}</span>
								</el-tooltip>
							</template>
						</el-table-column>
						<el-table-column prop="title" label="最近一次完成评审的日期" align="center">
							<template slot-scope="scope">
								<el-tooltip class="item" effect="dark" :content="scope.row.title" >
									<span class="tablehidden">{{ scope.row.title }}</span>
								</el-tooltip>
							</template>
						</el-table-column>
				</el-table>
				
		
			</el-row>
			<h2 style="text-align: left;font-weight: bolder;margin-top: 2%;margin-bottom: 2%;">历史评审平均表现</h2>
			<el-row :gutter="20">
				
				<el-table v-loading="loading" :data="tableData" style="width:900px;margin:20px auto" :header-cell-style="rowClass">
						<el-table-column fixed prop="projectCode" label="平均回应邀请的时间" align="center">
							<template slot-scope="scope">
								<el-tooltip class="item" effect="dark" :content="scope.row.projectCode" placement="top-start">
									<span class="tablehidden">{{ scope.row.projectCode }}</span>
								</el-tooltip>
							</template>
						</el-table-column>
						<el-table-column prop="projectName" label="平均完成评审的时间" align="center">
							<template slot-scope="scope">
								<el-tooltip class="item" effect="dark" :content="scope.row.projectName" >
									<span class="tablehidden">{{ scope.row.projectName }}</span>
								</el-tooltip>
							</template>
						</el-table-column>
						<el-table-column prop="title" label="平均延期天数" align="center">
							<template slot-scope="scope">
								<el-tooltip class="item" effect="dark" :content="scope.row.title" >
									<span class="tablehidden">{{ scope.row.title }}</span>
								</el-tooltip>
							</template>
						</el-table-column>
						<el-table-column prop="title" label="提醒次数" align="center">
							<template slot-scope="scope">
								<el-tooltip class="item" effect="dark" :content="scope.row.title" >
									<span class="tablehidden">{{ scope.row.title }}</span>
								</el-tooltip>
							</template>
						</el-table-column>
						<el-table-column prop="title" label="评审平均分数" align="center">
							<template slot-scope="scope">
								<el-tooltip class="item" effect="dark" :content="scope.row.title" >
									<span class="tablehidden">{{ scope.row.title }}</span>
								</el-tooltip>
							</template>
						</el-table-column>
						
				</el-table>
				
					
			</el-row>
			<h2 style="text-align: left;font-weight: bolder;margin-top: 2%;margin-bottom: 2%;">评审专家建议汇总</h2>
			<el-row :gutter="20">
				
				<el-table v-loading="loading" :data="tableData" style="width:900px;margin:20px auto" :header-cell-style="rowClass">
						<el-table-column fixed prop="projectCode" label="通过" align="center">
							<template slot-scope="scope">
								<el-tooltip class="item" effect="dark" :content="scope.row.projectCode" placement="top-start">
									<span class="tablehidden">{{ scope.row.projectCode }}</span>
								</el-tooltip>
							</template>
						</el-table-column>
						<el-table-column prop="projectName" label="通过需修改" align="center">
							<template slot-scope="scope">
								<el-tooltip class="item" effect="dark" :content="scope.row.projectName" >
									<span class="tablehidden">{{ scope.row.projectName }}</span>
								</el-tooltip>
							</template>
						</el-table-column>
						<el-table-column prop="title" label="拒绝" align="center">
							<template slot-scope="scope">
								<el-tooltip class="item" effect="dark" :content="scope.row.title" >
									<span class="tablehidden">{{ scope.row.title }}</span>
								</el-tooltip>
							</template>
						</el-table-column>
			
				</el-table>
				
					
			</el-row>
			
			<el-form-item class="cancel" style="text-align: center;">
				<el-button type="primary" @click="Return" size="medium" style="width:150px;">返回</el-button>
			</el-form-item>
			</el-form>
			
		</el-card>
	</div>
</template>

<script>
	export default{
		data(){
			return {
				loading: false,
				tableData: [
						  {projectCode:"111"}
				],  
				ruleForm:{
					password: "",
					checkPass: "",
					userName: "",
					code: "",
					phone: "",
					email: "",
					workUnit: "",
					type: []
				},
			}
		},
		methods:{
			Return(){
				this.$router.push({ path: './expertInformation' });
			},
			rowClass() {
			  return "background:#F4F6F9;";
			}
		}
	}
</script>

<style>
</style>
