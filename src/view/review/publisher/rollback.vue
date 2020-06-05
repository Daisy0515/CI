<template>
	<!-- <h1>publishercomplete</h1> -->
	<el-table v-loading="loading" :data="tableData" style="width:1000px;margin:0 auto" :header-cell-style="rowClass">
		<el-table-column fixed prop="projectCode" label="项目编号" align="center">
			<template slot-scope="scope">
				<el-tooltip class="item" effect="dark" :content="scope.row.projectCode" placement="top-start">
					<span class="tablehidden">{{ scope.row.projectCode }}</span>
				</el-tooltip>
			</template>
		</el-table-column>
		<el-table-column prop="name" label="项目名称" align="center">
			<template slot-scope="scope">
				<el-tooltip class="item" effect="dark" :content="scope.row.projectName" >
					<span class="tablehidden">{{ scope.row.projectName }}</span>
				</el-tooltip>
			</template>
		</el-table-column>
		<el-table-column prop="content" label="评审标题" align="center">
			<template slot-scope="scope">
				<el-tooltip class="item" effect="dark" :content="scope.row.content" >
					<span class="tablehidden">{{ scope.row.content }}</span>
				</el-tooltip>
			</template>
		</el-table-column>
		<el-table-column prop="gmtCreate" label="开始时间" align="center"></el-table-column>
		<el-table-column prop="gmtModified" label="截止时间" align="center"></el-table-column>
	
		<el-table-column prop="accomplishProgress" label="操作" align="center" width="280px">
			<template slot-scope="scope">
				<router-link :to="{path:'bidView', query:{id:scope.row.id}}">
				  <i class="el-icon-search"></i>
				  查看详情
				</router-link>
				<router-link :to="{path:'bidView', query:{id:scope.row.id}}">
				  <i class="el-icon-document"></i>
				  查看意见
				</router-link>
				<router-link
				  :to="{ path: 'taskIndex', query: { projectId: scope.row.id } }"
				  
				>
				  <i class="el-icon-refresh"></i>
				  重新提交
				</router-link>
			</template>
		</el-table-column>
	</el-table>
	
</template>

<script>
import { httpGet, httpDelete } from "@/utils/http.js";

import { message, successTips, errTips } from "@/utils/tips.js";

export default {
  
  data() {
    return { 
      loading: false,  
      tableData: [
		  {projectCode:111}
	  ],  
    };
  },
  created: function() {
    
  },
  computed: {
    
  },
  methods: { 
	rowClass() {
      return "background:#F4F6F9;";
    }
  }
};

</script>

<style>
@import "/src/assets/scss/myTable.scss";
</style>

