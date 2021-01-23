<template>
  <div class="gantt" style="width:100%">
    <div class="container deskHeader">
      <div class="ganttHeader">
        <div class="ganttHeader_left">
          <p :class="watchIndex == false ? 'is-active' : ''">
            <i class="el-icon-menu"></i>
            任务管理
          </p>

          <p class="ganttHeader_addTask" v-show="watchIndex || showIndex" @click="watchIndex = !watchIndex"
             :class="watchIndex == true ? 'is-active' : ''">添加任务</p>
        </div>
      </div>
      <div class="ganttHeader_main" v-show="watchIndex">
        <div style="width:100%">
          <div style="width: 45%; display: inline-table;">
            <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm">
              <el-form-item label="任务名称" prop="titleId">
                <el-select v-model="ruleForm.titleId" placeholder="请选择任务" @change="getSubList">
                  <el-option v-for="item in missionList" :key="item.id" :label="item.title"
                             :value="item.id"></el-option>
                </el-select>

                <el-popover placement="right" v-model="visible" width="200">
                  <el-input placeholder="任务名称" v-model="missionForm.title"></el-input>
                  <div style="text-align: right; margin-top: 10px">
                    <el-button size="mini" type="text" @click="visible = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="addMission">确定</el-button>
                  </div>

                  <span class="add" style="margin-left: 20px;" slot="reference">
									<i class="el-icon-plus"></i>
									新建任务
								</span>
                </el-popover>
              </el-form-item>
              <div v-show="ruleForm.titleId != 0">
                <el-form-item label="子任务类型" prop="missionTypeId">
                  <el-select v-model="ruleForm.missionTypeId" clearable placeholder="请选择任务类型">

                    <el-option v-for="item in missionTypeList" :key="item.missionTypeId"
                               :label="item.missionName" :value="item.missionTypeId "></el-option>
                  </el-select>
                  <el-popover placement="right" v-model="visible1" width="200">
                    <el-input placeholder="子任务类型名称" v-model="typeForm.missionName"></el-input>
                    <div style="text-align: right; margin-top: 10px">
                      <el-button size="mini" type="text" @click="visible1 = false">取消</el-button>
                      <el-button type="primary" size="mini" @click="addType">确定</el-button>
                    </div>

                    <span class="add" style="margin-left: 20px;" slot="reference">
										<i class="el-icon-plus"></i>
										添加新的任务类型
									</span>
                  </el-popover>
                </el-form-item>

                <el-form-item label="子任务标题" prop="subtitle">
                  <el-input class="input_title title" v-model="ruleForm.subtitle"></el-input>
                </el-form-item>

                <el-form-item label="指派人员" prop="participantList">
                  <el-checkbox-group v-model="ruleForm.participantList">
                    <el-checkbox v-for="(item, index) in userList" :key="index" :label="item.id">{{
                        item.userName
                      }}
                    </el-checkbox>
                  </el-checkbox-group>
                </el-form-item>

                <el-form-item label="开始时间" prop="startTime">
                  <el-date-picker
                      style="margin-left:0%"
                      v-model="ruleForm.startTime"
                      :picker-options="endDatePicker"
                      type="date"
                      placeholder="开始时间"
                      value-format="yyyy-MM-dd"
                  ></el-date-picker>
                </el-form-item>

                <el-form-item label="截止时间" prop="endTime">
                  <el-date-picker
                      style="margin-left:0%"
                      v-model="ruleForm.endTime"
                      :picker-options="endDatePicker"
                      type="date"
                      placeholder="截止时间"
                      value-format="yyyy-MM-dd"
                  ></el-date-picker>
                </el-form-item>

                <el-form-item label="描述" prop="description">
                  <el-input type="textarea" class="input_textarea " v-model="ruleForm.description"
                            :rows="5" style="width:80%;float:left"></el-input>
                </el-form-item>
                <el-form-item label="上传附件" prop="sourceFile">
                  <!-- 此处改为文件上传 -->
                  <sourceUpload :uploadIndex="testUploadIndex" :fileIndex="2"
                                v-on:setIdCard="setIdCard2($event)"/>
                </el-form-item>
                <el-form-item class="cancel">
                  <el-button type="primary" @click="returnSquare" size="small"
                             style="width:100px;margin-left:20%">返回
                  </el-button>
                  <el-button type="primary" @click="submitForm('ruleForm')" size="small"
                             style="width:100px;margin-left:10%">保存
                  </el-button>
                </el-form-item>
              </div>
            </el-form>
          </div>
          <div class="leftTable" v-show="ruleForm.titleId != 0">
            <el-card :body-style="{ width: '90%' }">
              <div slot="header" style="color: #4c83c3;font-weight: 600;">
                <span style="margin-left: 15px;">{{ selected }}</span>
              </div>
              <el-table :data="subtitleList" style="width:100%;" :header-cell-style="rowClass"
                        v-loading="loading">
                <el-table-column prop="subtitle" label="任务名称" align="center">
                  <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.subtitle"
                                placement="top-start">
                      <span class="tablehidden">{{ scope.row.subtitle }}</span>
                    </el-tooltip>
                  </template>
                </el-table-column>

                <el-table-column prop="description" label="任务描述" width="220" align="center">
                  <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.description"
                                placement="top-start">
                      <span class="tablehidden">{{ scope.row.description }}</span>
                    </el-tooltip>
                  </template>
                </el-table-column>

                <el-table-column prop="operation" label="删除任务" align="center">
                  <template slot-scope="scope">
                    <i style="cursor: pointer;" @click="deleteMission(scope.row.id)"
                       class="el-icon-error"></i>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </div>
        </div>
      </div>

      <div class="ganttIndex" style="width:100%;height: 100%;">
        <div class="ganttIndexMain" style="margin-bottom: 30px;">
          <div class="gitAddress">
            git仓库地址:
            <input id="httpUrlToRepo" class="address" autocomplete="off" style="width:300px;"
                   v-model="httpUrlToRepo" disabled="disabled"/>
            <el-button class="btn" type="primary" size="mini" style="margin-left:20px"
                       v-on:click="copyAddress">复制地址
            </el-button>
            <router-link to="/git-2" style="margin-left:20px;color:blue">如何使用git</router-link>
          </div>
          <div style="margin-top: 30px">
            <el-tabs v-model="selectedMission" @tab-click="showSubTask(selectedMission)">
              <el-tab-pane
                  v-for="(item,index) in allMissionList"
                  :label="item.title"
                  :value="index"
                  :key="index"
              >
                <el-table :data="taskTable" stripe style="width: 100%">
                  <el-table-column prop="title" label="子任务名称" width="180"></el-table-column>
                  <el-table-column prop="missionType" label="子任务类型" width="180"></el-table-column>
                  <el-table-column prop="status" label="状态" width="180"></el-table-column>
                  <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                      <el-button type="text" @click="showTaskInfoDialog(scope.row.id)"><i class="el-icon-search"></i>查看
                      </el-button>

                    </template>
                  </el-table-column>


                </el-table>

              </el-tab-pane>

            </el-tabs>

            <!--                        <expert-information :ruleForm="personalForm" :dialogFormVisible="informationView"-->
            <!--                                            @closeDialog="closeInformationDialog"></expert-information>-->
          </div>
          <dialog-task-info :form="taskForm" :dialogFormVisible="dialogTaskInfoView"
                            @closeDialog="closeTaskInfoDialog"></dialog-task-info>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import Clipboard from 'clipboard';
import {mapGetters, mapMutations} from 'vuex';
import dialogTaskInfo from '@/view/desk/projectManagement/projectManageContent/component/dialogTaskInfo'
import {httpGet, httpDelete, httpPost} from '@/utils/http.js';
import {specificDate} from '@/utils/getDate.js';
import {errTips, successTips} from '@/utils/tips.js';
import sourceUpload from '@/common/upload/resourceUpload';
import timeLimit from '@/mixins/regular/timeLimit.js';
import DialogTaskInfo from "./component/dialogTaskInfo";

export default {
  mixins: [timeLimit],
  components: {
    DialogTaskInfo,
    sourceUpload,
    dialogTaskInfo
  },
  data: function () {
    return {
      taskForm: {},
      dialogTaskInfoView: false, //控制任务信息对话框
      loading: false,
      selected: '任务名称',
      visible: false,
      visible1: false,
      selectedMission: 0,
      subtitleList: [],
      missionList: [],
      missionTypeList: [],
      missionForm: {
        teamId: '',
        title: ''
      },
      typeForm: {
        teamId: '',
        missionName: ''
      },
      titleId: '',
      ruleForm: {
        castId: '',
        description: '',
        endTime: '',
        missionTypeId: '',
        participantList: [],
        sourceFile: '',
        startTime: '',
        subtitle: '',
        titleId: ''
      },
      uploadIndex: false,
      testUploadIndex: false,
      contentList: [],
      userList: [],
      fileName: 'bidTask',
      qiniuData: {
        key: '',
        token: ''
      },
      goUpload: true,
      fileList: [],
      showIndex: true,
      watchIndex: false,
      typeIndex: 0,
      projectId: '',
      teamId: '',
      routerIndex: '',
      userSele: [{name: 'xxs'}, {name: 'xwr'}, {name: 'ssd'}],
      startTime: '',
      endTime: '',
      content: '',
      select: '',
      restaurants: [],
      tasks: {
        user: [],
        data: [],
        links: []
      },
      messages: [],
      httpUrlToRepo: '',
      endDatePicker: {
        disabledDate(time) {
          return time.getTime() < new Date().getTime() - 86400000;
        },
      },
      allMissionList: [], //存储下面的任务列表
      taskTable: []
    };
  },
  created: function () {
    this.routerIndex = this.$route.name;
    this.projectId = this.$route.query.teamId;
    if (!this.projectId) {
      errTips("no project");
    }
    this.getContent();
    // this.settaskList([]);
    this.getTask();
    this.getAllMissionList();

  },
  watch: {
    //监听路由高亮
    $route() {
      this.watchIndex = false;
      this.showIndex = true;
    },

    // 'selectedMission':function(val) { //监听切换状态-计划单
    //     console.log()
    //     // 注释，根据val的不同，跳转到不同
    // },

  },
  methods: {
    ...mapMutations(['settaskList', 'setResource', 'setCache']),
    //关闭任务信息对话框
    closeTaskInfoDialog() {
      this.dialogTaskInfoView = false;
    },
    //打开任务信息对话框并获取任务信息
    showTaskInfoDialog(val) {
      this.dialogTaskInfoView = true;
      httpGet('/v1/authorization/manage/mission/get', {id: val}).then(results => {
        const {msg, data, httpCode} = results.data;
        if (httpCode == 200) {
          let form = data;
          form.endTime = specificDate(form.endTime);
          form.gmtCreate = specificDate(form.gmtCreate);
          form.gmtModified = specificDate(form.gmtModified);
          form.startTime = specificDate(form.startTime);
          form.participantList = form.participantList.toString();
          if (form.status == 1) form.status = "执行中";
          if (form.status == 2) form.status = "完成";
          if (form.status == 3) form.status = "放弃";
          this.taskForm = form;
        } else {
          errTips(msg);
        }
      });
    },
    showSubTask(val) {
      this.taskTable = this.allMissionList[val].missionInfoList;
    },
    getAllMissionList() {
      httpGet('/v1/authorization/manage/mission/list', {teamId: this.projectId}).then(results => {
        const {msg, data, httpCode} = results.data;
        if (httpCode == 200) {
          this.allMissionList = data.missionTitleList;
          this.showSubTask(this.selectedMission);
        } else {
          errTips(msg);
        }
      });
    },
    deleteMission(id) {
      httpDelete(`/v1/authorization/mission/missionsubtitle/delete/${id}`).then(results => {
        const {httpCode, msg} = results.data;
        if (httpCode === 200) {
          successTips('删除成功');
        } else {
          errTips(msg);
        }
        this.getSubList(this.titleId);
        this.getAllMissionList();
        this.getTask();
      });
    },
    getSubList: function (value) {
      this.selected = this.missionList.find(item => {
        return item.id === value;
      }).title;
      this.titleId = value;
      this.loading = true;
      httpGet('/v1/authorization/mission/subtitle/list', {
        teamId: this.teamId,
        titleId: value
      }).then(results => {
        const {msg, data, httpCode} = results.data;
        if (httpCode == 200) {
          this.subtitleList = data.subtitleList;
        } else {
          errTips(msg);
        }
        this.loading = false;
      });
    },
    addMission() {
      this.missionForm.teamId = this.teamId;
      if (this.missionForm.title == '') {
        errTips('任务名称不能为空');
        this.visible = false;
        return false;
      }
      httpPost('/v1/authorization/mission/missiontitle/insert', this.missionForm).then(results => {
        const {msg, httpCode} = results.data;
        if (httpCode === 200) {
          successTips('添加任务成功！');
          this.getAllMissionList();
        } else {
          errTips(msg);
        }
        this.getMissionList(this.teamId);
        this.missionForm.title = '';
        this.visible = false;
      });
    },
    addType() {
      this.typeForm.teamId = this.teamId;
      if (this.typeForm.missionName == '') {
        errTips('任务类型名称不能为空');
        this.visible1 = false;
        return false;
      }
      httpPost('/v1/authorization/mission/missiontype/insert', this.typeForm).then(results => {
        const {msg, httpCode} = results.data;
        if (httpCode === 200) {
          successTips('添加任务类型成功！');
          this.getAllMissionList();
        } else {
          errTips(msg);
        }
        this.getMissionType(this.teamId);
        this.typeForm.missionName = '';
        this.visible1 = false;
      });
    },
    //获取任务列表（标题列表）
    getMissionList(val) {
      httpGet('/v1/authorization/mission/missiontitle/list', {teamId: val}).then(results => {
        const {msg, data, httpCode} = results.data;
        if (httpCode == 200) {
          this.missionList = data.missionTitle;
        } else {
          errTips(msg);
        }
      });
    },
    //获取任务列表（标题列表）
    getMissionType(val) {
      httpGet('/v1/authorization/mission/missiontype/list', {teamId: val}).then(results => {
        const {msg, data, httpCode} = results.data;
        if (httpCode == 200) {
          this.missionTypeList = data.missionTypeList;
        } else {
          errTips(msg);
        }
      });
    },
    //上传资源
    setIdCard(data) {
      httpGet('/v1/authorization/bids/resource/upload', {
        castId: this.projectId,
        uploadResource: data.fileName
      }).then(results => {
        const {httpCode, msg} = results.data;
        if (httpCode === 200) {
          successTips('上传成功');
          this.setResource(data);
        } else if (httpCode !== 401) {
          errTips(msg);
        }
      });
    },
    //复制Git地址
    copyAddress: function (event) {
      var gitAddress = this.httpUrlToRepo;
      var clipboard = new Clipboard('.btn', {
        text: function () {
          return gitAddress;
        }
      });
      clipboard.on('success', e => {
        successTips('复制git地址成功');
        // 释放内存
        clipboard.destroy();
      });
      clipboard.on('error', e => {
        // 不支持复制
        errTips('该浏览器不支持自动复制');
        // 释放内存
        clipboard.destroy();
      });
    },

    //获取任务数据
    getTask() {
      httpGet('/v1/authorization/bids/missioninfo/get', {
        castId: this.projectId
      }).then(results => {
        const {msg, data, httpCode} = results.data;
        if (httpCode === 200) {
          this.$set(this, 'httpUrlToRepo', data.httpUrlToRepo);
          this.$set(this, 'teamId', data.teamId);
          this.userList = data.userList;
          this.setResource(data.uploadResource);
          let taskList = [...data.missList];
          taskList.forEach(item => {
            item.userList = this.userList;
            item.participantNames = '';
            for (let i of item.participantList) {
              for (let p of this.userList) {
                if (i === p.id) {
                  item.participantNames = item.participantNames + p.userName + ' ';
                }
              }
            }

            item.endTime = specificDate(item.endTime);
            item.startTime = specificDate(item.startTime);
            item.changeTask = false;
            item.changeTitle = item.content;
            item.describeModel = item.description;
            item.upData = {
              accomplishProgress: item.accomplishProgress,
              endTime: item.endTime,
              id: item.id,
              startTime: item.startTime
            };
          });
          this.settaskList(taskList);
          this.getMissionList(this.teamId);
          this.getMissionType(this.teamId);
        } else if (httpCode === 400) {
          this.setCache('myBid');
        } else if (httpCode !== 401) {
          errTips(msg);
        }
      });
    },

    //获得标题下拉框及可选成员信息
    getContent() {
      httpGet(`/v1/authorization/bids/get/content?castId=${this.projectId}`).then(results => {
        const {msg, data, httpCode} = results.data;
        if (httpCode === 200) {
          this.contentList = data.contentList;
          this.userList = data.userList;
        } else if (httpCode === 400) {
          this.setCache('');
        } else if (httpCode !== 401) {
          errTips(msg);
        }
      });
    },

    setIdCard2(data) {
      data && (this.ruleForm.sourceFile = data.fileName);
      httpPost('/v1/authorization/bids/missioninfo/add', this.ruleForm).then(results => {
        const {msg, httpCode} = results.data;
        if (httpCode === 200) {
          successTips('添加任务成功！');
        } else {
          errTips(msg);
        }
        // console.log(data);
        this.getContent();
        this.getTask();
        this.getSubList(this.ruleForm.titleId);
        this.ruleForm.description = '';
        this.ruleForm.endTime = '';
        this.ruleForm.missionTypeId = '';
        this.ruleForm.participantList = [];
        this.ruleForm.sourceFile = '';
        this.ruleForm.startTime = '';
        this.ruleForm.subtitle = '';
        this.ruleForm.titleId = '';
      });
    },

    //添加任务
    submitForm(formName) {
      //alert(1111111);
      if (new Date(this.ruleForm.startTime.replace(/\-/g, '/')) > new Date(this.ruleForm.endTime.replace(/\-/g, '/'))) {
        errTips('开始时间不能大于结束时间');
        return false;
      }
      this.ruleForm.castId = this.projectId;
      this.ruleForm.sourceFile ? this.setIdCard2() : (this.testUploadIndex = !this.testUploadIndex);
    },
    returnSquare() {
      this.$router.push({path: '/desk/taskManage'});
    },
    rowClass() {
      return 'background:#F4F6F9;';
    }
  }
}
</script>

<style lang="scss" scoped>
.gantt {
  .Tips {
    text-align: center;
    margin-top: 15px;
    color: #909399a8;
  }

  .header {
    padding: 15px 0 15px 0;

    h4 {
      margin: 0;
    }
  }

  a {
    color: black;
    text-decoration: none;
  }

  .taskdata {
    background: transparent;
    border-color: transparent;
    font-size: 14px;
  }

  .taskdata:focus,
  .taskdata:hover {
    color: black;
    border-color: transparent;
    background: transparent;
  }

  .getBtn {
    margin-top: 15px;
  }

  .el-input {
    width: 250px;
    margin-right: 20px;
  }

  .el-input--suffix .el-input__inner {
    width: 250px;
  }

  .ganttHeader {
    margin-top: 5px;
    margin-bottom: 5px;
    padding-bottom: 10px;
  }

  .ganttHeader_left {
    float: left;

    p {
      display: inline-block;
      margin-right: 10px;
      font-size: 17px;
    }

    .ganttHeader_addTask {
      cursor: pointer;
      font-size: 13px;
      margin-top: 3px;

      &:hover {
        color: #3e76b8;
      }
    }
  }

  .ganttHeader_right {
    float: right;
  }

  .ganttHeader_right p {
    float: left;
    margin-left: 20px;
  }

  .ganttHeader::after {
    content: '';
    display: table;
    clear: both;
  }

  .el-range-editor.el-input__inner {
    width: 400px;
  }

  .left-container {
    margin-top: 20px;
  }
}

.popo-item {
  margin-bottom: 10px;
}

.is-active {
  color: #3e76b8;
}

.el-icon-circle-plus {
  font-size: 16px;
}

.gantt_hor_scroll {
  display: none;
}

.ganttIndex {
  .ganttIndexMain {
    border-top: 1px solid #e8e8e8;
    margin-top: 30px;

    & > ul {
      margin-top: 35px;
    }
  }

  .gitAddress {
    margin-top: 20px;
    font-size: 14px;

    i:hover {
      cursor: pointer;
    }
  }
}

.ganttHeader_main {
  // width: 50%;
  // float: left;
  .add {
    cursor: pointer;
    color: #8c8c8c;

    &:hover {
      color: #3e76b8;
    }
  }
}

.leftTable {
  width: 45%;
  height: 100%;
  display: inline-table;
  float: right;
  padding-left: 30px;
  border-left: 1px solid #e8e8e8;
}

</style>
