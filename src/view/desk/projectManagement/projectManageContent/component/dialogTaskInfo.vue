<!--功能：任务管理页面调用的查看任务详情
    调用页面：task Manage
             -->
<template>
  <el-dialog :title="localForm.titleName" :visible.sync="dialogFormVisible" :before-close="changeVisible"
             style="width:100%;text-align:left; font-weight: bolder;">
    <el-form :model="localForm" v-loading="loading">
      <el-row>
        <el-col :span="10">
          <el-form-item label="子任务名称:" :label-width="formLabelWidth">
            <span>{{ localForm.subtitle }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="子任务类型:" :label-width="formLabelWidth">
            <span>{{ localForm.missionTypeName }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="任务创建时间:" :label-width="formLabelWidth">
            <span>{{ localForm.gmtCreate }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="任务修改时间:" :label-width="formLabelWidth">
            <span>{{ localForm.gmtModified }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="执行人:" :label-width="formLabelWidth">
          <span>{{ localForm.participantList }}</span>
        </el-form-item>
      </el-row>
      <el-row>
        <el-col :span="13">
          <el-form-item label="执行时间:" :label-width="formLabelWidth">
            <el-date-picker
                v-model="localForm.startTime"
                type="date"
                placeholder="开始时间"
                value-format="yyyy-MM-dd"
            ></el-date-picker>
            到
            <el-date-picker
                v-model="localForm.endTime"
                type="date"
                placeholder="开始时间"
                value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="任务状态:" :label-width="formLabelWidth">
            <el-select v-model="localForm.status">
              <el-option :value="1" label="执行中"></el-option>
              <el-option :value="2" label="完成"></el-option>
              <el-option :value="3" label="放弃"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="任务描述:" :label-width="formLabelWidth">
            <el-input v-model="localForm.description" type="textarea" :rows="6" placeholder="请输入内容"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-table :data="fileTable" border :header-cell-style="rowClass">
          <el-table-column prop="resourceName" label="附件名称" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="gmtCreate" label="上传时间"></el-table-column>
          <el-table-column prop="userRole" label="角色" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.role === 1">项目经理</span>
              <span v-else>开发者</span>
            </template>
          </el-table-column>
          <el-table-column prop="userName" label="上传者" align="center"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <a target="_Blank" :href="scope.row.resource"> 下载 </a>
            </template>
          </el-table-column>
        </el-table>
        <div class="bid_footer">
          <el-pagination
              style="text-align: center;margin-top: 10px;"
              @current-change="nextFilePage"
              :current-page.sync="filePageData.pageNo"
              layout="prev, pager, next, jumper"
              :page-count="filePageData.totalPage"
          ></el-pagination>
        </div>
      </el-row>
      <div style="text-align:center">
        <sourceUpload :uploadIndex="uploadIndex" v-on:setIdCard="setIdCard($event)"/>
        <el-button type="primary" size="mini" @click="uploadFile">确定上传</el-button>
      </div>
      <div style="text-align: center;margin-top: 50px">
        <el-button type="primary" @click="update">保存修改</el-button>
      </div>
    </el-form>

  </el-dialog>
</template>

<script>
import {httpGet, httpPut, httpPost} from '@/utils/http.js';
import {errTips, successTips} from '@/utils/tips.js';
import {specificDate} from "@/utils/getDate.js";
import sourceUpload from "@/common/upload/resourceUpload";

export default {
  components: {
    sourceUpload
  },
  name: "editorViewDetail",
  props: {
    form: {
      type: Object,
      default: () => {
      },
    },
    dialogFormVisible: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      localForm: {}, //父组件传递下来的参数被修改会出现警告，故采用了本地的副本
      formLabelWidth: "100px",
      isReadOnly: true,
      fileTable: [], //当前任务的文件列表
      fileTableLoading: false,
      filePageData: {
        pageNo: 1,
        pageSize: 5,
        totalPage: 0,
        orderBy: "id",
        orderType: "DESC",
        missionId: null,
      },
      uploadIndex: false,
      insertResource:{
        missionId: this.form.id,
        resource:"",
        resourceName:"",
      }
    }
  },
  watch: {
    form: function (newForm) {
      this.localForm = newForm;
      this.getFileTable(this.localForm.id);
    }
  },
  methods: {
    changeVisible() {
      this.$emit('closeDialog');
    },
    update() {
      let dataForm = this.form;
      httpPut("/v1/authorization/manage/mission/update", dataForm).then(results => {
        const {httpCode} = results.data;
        if (httpCode === 200) {
          successTips("修改成功！");
        } else {
          errTips("修改失败！");
        }
      })
    },

    getFileTable(missionId) {
      this.fileTableLoading = true;
      this.filePageData.missionId = missionId;
      httpGet("/v1/authorization/manage/resource/list", this.filePageData).then(results => {
        const {httpCode, msg, data} = results.data;
        if (httpCode === 200) {
          this.fileTable = data.list;
          this.filePageData.totalPage = parseInt(data.totalPage);
          for (let i of this.fileTable) {
            i.gmtCreate = specificDate(i.gmtCreate);
            if (i.resourceName === null) {
              let resouArray = i.resource.split('/');
              i.resourceName = resouArray[resouArray.length - 1];
            }
          }
        } else if (msg === "该条件暂无数据") {
          this.fileTable = [];
        } else {
          errTips("获取文件信息失败:", msg);
        }
        this.fileTableLoading = false;
      });
    },

    nextFilePage(val) {
      this.filePageData.pageNo = val;
      this.getFileTable(this.filePageData.missionId);
    },
    rowClass() {
      return "background:#F4F6F9;";
    },
    uploadFile() {
      this.uploadIndex = !this.uploadIndex;
    },
    setIdCard(file) {
      if(!file){
        errTips("请先选择文件！");
      }else{
        console.log("218", file);
        (file) && (this.insertResource.resource = file);
        let dataForm = this.insertResource.resource.split('/');
        this.insertResource.resourceName = dataForm[dataForm.length - 1];
        this.insertResource.missionId = this.form.id;
        httpPost("/v1/authorization/manage/resource/insert", this.insertResource).then(results => {
          const {httpCode, msg, data} = results.data;
          if (httpCode === 200) {
            successTips('上传文件成功！');
            this.getFileTable(this.filePageData.missionId);
            console.log("232", this.fileTable);
          } else if (httpCode !== 401) {
            errTips(msg);
          } else {
            alert(httpCode);
          }
        });
      }
    },
  },

}
</script>

<style scoped>
.myForm .el-form-item__label {
  font-size: 17px;
  color: black;
  font-weight: bolder;
}
</style>
