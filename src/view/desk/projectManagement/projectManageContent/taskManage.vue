<template>
    <div class="gantt" style="width:100%">
        <div class="container deskHeader">
            <div class="ganttHeader">
                <div class="ganttHeader_left">
                    <p :class="watchIndex === false ? 'is-active' : ''">
                        <i class="el-icon-menu"></i>
                        任务管理
                    </p>
                    <p class="ganttHeader_addTask" v-show="watchIndex || showIndex" @click="watchIndex = !watchIndex"
                       :class="watchIndex === true ? 'is-active' : ''">添加任务</p>
                </div>
            </div>
            <div class="ganttHeader_main" v-show="watchIndex">
                <div style="width:100%">
                    <div style="width: 45%; display: inline-table;">
                        <el-form :model="addMission" class="demo-ruleForm">
                            <el-form-item label="任务名称" prop="titleId">
                                <el-select v-model="addMission.titleId" placeholder="请选择任务" @change="getSubtitleList">
                                    <el-option v-for="item in missionTitle" :key="item.id" :label="item.title"
                                               :value="item.id"></el-option>
                                </el-select>


                                <el-popover placement="right" v-model="visible" width="200">
                                    <el-input placeholder="任务名称" v-model="insertMissionTitle.title"></el-input>
                                    <div style="text-align: right; margin-top: 10px">
                                        <el-button size="mini" type="text" @click="visible = false">取消</el-button>
                                        <el-button type="primary" size="mini" @click="insertNewMission">确定</el-button>
                                    </div>

                                    <span class="add" style="margin-left: 20px;" slot="reference">
									<i class="el-icon-plus"></i>
									新建任务
								</span>
                                </el-popover>
                            </el-form-item>
                            <div v-show="addMission.titleId !== 0">
                                <el-form-item label="子任务类型" prop="missionTypeId">
                                    <el-select v-model="addMission.missionTypeId" clearable placeholder="请选择任务类型">

                                        <el-option v-for="item in missionTypeList" :key="item.missionTypeId"
                                                   :label="item.missionName" :value="item.missionTypeId "></el-option>
                                    </el-select>
                                    <el-popover placement="right" v-model="visible1" width="200">
                                        <el-input placeholder="子任务类型名称"
                                                  v-model="insertMissionType.missionName"></el-input>
                                        <div style="text-align: right; margin-top: 10px">
                                            <el-button size="mini" type="text" @click="visible1 = false">取消</el-button>
                                            <el-button type="primary" size="mini" @click="insertNewMissionType">确定
                                            </el-button>
                                        </div>

                                        <span class="add" style="margin-left: 20px;" slot="reference">
										<i class="el-icon-plus"></i>
										添加新的任务类型
									</span>
                                    </el-popover>
                                </el-form-item>

                                <el-form-item label="子任务标题" prop="subtitle">
                                    <el-input class="input_title title" v-model="addMission.subtitle"></el-input>
                                </el-form-item>
                                <el-form-item label="指派人员" prop="participantList">
                                    <el-checkbox-group v-model="addMission.participantList">
                                        <el-checkbox v-for="(item, index) in userList" :key="index" :label="item.id">{{
                                                item.userName
                                            }}
                                        </el-checkbox>
                                    </el-checkbox-group>
                                </el-form-item>
                                <el-form-item label="开始时间" prop="startTime">
                                    <el-date-picker
                                        style="margin-left:0%"
                                        v-model="addMission.startTime"
                                        :picker-options="endDatePicker"
                                        type="date"
                                        placeholder="开始时间"
                                        value-format="yyyy-MM-dd"
                                    ></el-date-picker>
                                </el-form-item>

                                <el-form-item label="截止时间" prop="endTime">
                                    <el-date-picker
                                        style="margin-left:0%"
                                        v-model="addMission.endTime"
                                        :picker-options="endDatePicker"
                                        type="date"
                                        placeholder="截止时间"
                                        value-format="yyyy-MM-dd"
                                    ></el-date-picker>
                                </el-form-item>

                                <el-form-item label="描述" prop="description">
                                    <el-input type="textarea" class="input_textarea " v-model="addMission.description"
                                              :rows="5" style="width:80%;float:left"></el-input>
                                </el-form-item>
                                <el-form-item label="上传附件" prop="sourceFile">
                                    <sourceUpload :fileIndex="2" :uploadIndex="testUploadIndex"
                                                  v-on:setIdCard="uploadFile($event)"/>
                                </el-form-item>
                                <el-form-item class="cancel">
                                    <el-button type="primary" @click="watchIndex = !watchIndex" size="small"
                                               style="width:100px;margin-left:20%">返回
                                    </el-button>
                                    <el-button type="primary" @click="addNewMission" size="small"
                                               style="width:100px;margin-left:10%">保存
                                    </el-button>
                                </el-form-item>
                            </div>
                        </el-form>
                    </div>
                    <div class="leftTable" v-show="addMission.titleId !== 0">
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
                                v-for="(item,index) in missionTitleList"
                                :label="item.title"
                                :value="index"
                                :key="index"
                            >
                                <li>{{ missionInfoList }}</li>
                                <el-table :data="missionInfoList" stripe style="width: 100%">
                                    <el-table-column prop="title" label="子任务名称" width="180"></el-table-column>
                                    <el-table-column prop="missionType" label="子任务类型" width="180"></el-table-column>
                                    <el-table-column prop="status" label="状态" width="180"></el-table-column>
                                    <el-table-column label="操作" width="180">
                                        <template slot-scope="scope">
                                            <el-button type="text" @click="showTaskInfoDialog(scope.row.id)"><i
                                                class="el-icon-search"></i>查看
                                            </el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-tab-pane>
                        </el-tabs>
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
            testUploadIndex: false,//sourceUpload组件内部定义，当这个变量发生变化时，开启文件上传，上传后会返回一个URL，即文件地址
            teamId: sessionStorage.getItem("teamId"),
            userId: sessionStorage.getItem("userId"),
            projectId: sessionStorage.getItem("projectId"),
            visible: false,
            visible1: false,
            selected: "任务名称",//右上角的框
            selectedMission: 0,//下边的框
            loading: false,
            taskForm: {},
            dialogTaskInfoView: false,
            castId: null,
            watchIndex: false,
            showIndex: true,
            //subMissionTypeName:"",//子任务类型名称，添加新任务名称时使用
            insertMissionTitle: {//新建任务时，post命令需要的参数，/v1/authorization/mission/missiontitle/insert'
                teamId: sessionStorage.getItem("teamId"),
                title: "",
            },
            insertMissionType: {//添加新的任务类型时，post命令需要的参数，/v1/authorization/mission/missiontype/insert
                missionName: "",
                teamId: sessionStorage.getItem("teamId"),
            },
            missionData: {///v1/authorization/manage/mission/get返回的数据
                title: "",
                id: 0,//subtitleId
                description: "",
                startTime: "",
                endTime: "",
                gmtCreat: "",
                gmtModified: "",
                missionTypeName: "",
                paticipantList: [],
                status: 0,
                titleName: "",
            },
            missionInfoList: [{
                id: 0, missionType: "", status: "", title: "",
            }],//当前任务的信息
            missionTitleList: [{missionInfoList: [{id: 0, missionType: "", status: "", title: ""}], title: ""}],//id是subtitleId
            // /v1/authorization/manage/mission/list返回值
            // 下边的分页
            subtitleList: [],//[{id: 0, description: "", subtitle: "",}],//id是subtitleId,相当于在titleId下一级，右上角的框
            // /v1/authorization/mission/subtitle/list返回值
            missionTypeList: [{id: 0, missionTypeId: 0, missionName: "",}],//id是subtitleId,missionTypeId是任务类型Id
            // /v1/authorization/mission/missiontype/list返回值
            missionTitle: [{id: 0, title: ""}],//id是任务的id，即titleId
            // /v1/authorization/mission/missiontitle/list返回值
            userList: [{id: 0, userName: "",}],
            // /v1/authorization/bids/get/content 返回的userList
            addMission: {// /v1/authorization/bids/missioninfo/add上传新任务时需要的参数
                castId: 0,
                description: "",
                endTime: "",
                missionTypeId: "",
                participantList: [],
                resourceName: "",
                sourceFile: "",
                startTime: "",
                subtitle: "",
                titleId: "",
            },
            httpUrlToRepo: '',
            endDatePicker: {
                disabledDate(time) {
                    return time.getTime() < new Date().getTime() - 86400000;
                },
            },
        };
    },
    created: function () {
        this.teamId = sessionStorage.getItem("teamId");
        this.userId = sessionStorage.getItem("userId");
        this.projectId = sessionStorage.getItem("projectId");
        this.routerIndex = this.$route.name;
        if (!this.projectId) {
            errTips("no project");
        }
        this.getCastId(this.projectId);
        this.getMissionTypeList();
        this.getMissionTitle();
        this.getMissionTitleList();
    },
    watch: {
        //监听路由高亮
        $route() {
            this.watchIndex = false;
            this.showIndex = true;
        },
        castId: function () { //ok
            this.addMission.castId = this.castId;
            httpGet("/v1/authorization/bids/get/content", {castId: this.castId}).then(results => {
                const {msg, data, httpCode} = results.data;
                if (httpCode === 200) {
                    this.userList = data.userList;
                } else {
                    errTips(msg);
                }
            })
        },
    },
    methods: {
        ...mapMutations(['settaskList', 'setResource', 'setCache']),
        insertNewMission() {//新建任务
            if (this.insertMissionTitle.title === "") {
                errTips('任务名称不能为空');
                this.visible = false;
                return false;
            }
            httpPost('/v1/authorization/mission/missiontitle/insert', this.insertMissionTitle).then(results => {
                const {msg, httpCode} = results.data;
                if (httpCode === 200) {
                    this.getMissionTitle();
                    this.getMissionTitleList();
                    this.insertMissionTitle.title = '';
                    this.visible = false;
                    successTips('添加任务成功！');
                } else {
                    errTips(msg);
                }
            });
        },
        closeTaskInfoDialog() {//关闭“查看”窗口
            this.getMissionTitleList();
            let tmpId = 0;
            for (let i = 0; i <= this.missionTitle.length; i++) {
                if (this.missionTitle[i].title === this.missionTitleList[this.selectedMission].title) {
                    tmpId = this.missionTitle[i].id;
                    break;
                }
            }
            this.getSubtitleList(tmpId);
            this.dialogTaskInfoView = false;
        },
        //打开任务信息对话框并获取任务信息
        showTaskInfoDialog(val) {//打开“查看”窗口
            httpGet('/v1/authorization/manage/mission/get', {id: val}).then(results => {
                const {msg, data, httpCode} = results.data;
                if (httpCode === 200) {
                    let form = data;
                    form.endTime = specificDate(form.endTime);
                    form.gmtCreate = specificDate(form.gmtCreate);
                    form.gmtModified = specificDate(form.gmtModified);
                    form.startTime = specificDate(form.startTime);
                    form.participantList = form.participantList.toString();
                    this.taskForm = form;
                    this.dialogTaskInfoView = true;
                } else {
                    errTips(msg);
                }
            });
        },
        showSubTask(val) {//显示下方分页
            this.missionInfoList = this.missionTitleList[val].missionInfoList;
        },
        getMissionTitleList() {//获得所有任务的信息，展示在下面分页
            httpGet('/v1/authorization/manage/mission/list', {teamId: this.teamId}).then(results => {
                const {msg, data, httpCode} = results.data;
                if (httpCode === 200) {
                    this.missionTitleList = data.missionTitleList;
                    this.showSubTask(this.selectedMission);
                } else {
                    errTips(msg);
                }
            });

        },
        getMissionTitle() {//获取任务列表，用于“请选择任务”
            httpGet('/v1/authorization/mission/missiontitle/list', {teamId: this.teamId}).then(results => {
                const {msg, data, httpCode} = results.data;
                if (httpCode === 200) {
                    this.missionTitle = data.missionTitle;
                } else {
                    errTips(msg);
                }
            });

        },
        getMissionTypeList() {//获取任务类型列表，用于“请选择任务类型”
            httpGet('/v1/authorization/mission/missiontype/list', {teamId: this.teamId}).then(results => {
                const {msg, data, httpCode} = results.data;
                if (httpCode === 200) {
                    this.missionTypeList = data.missionTypeList;
                } else {
                    errTips(msg);
                }
            });
        },
        getSubtitleList(val) {//获得子任务信息，用在右上角处显示
            httpGet('/v1/authorization/mission/subtitle/list', {teamId: this.teamId, titleId: val}).then(results => {
                const {msg, data, httpCode} = results.data;
                if (httpCode === 200) {
                    this.subtitleList = data.subtitleList;
                } else {
                    errTips(msg);
                }
            });
        },
        getContent() { //获取团队成员，用在“指派人员”
            httpGet("/v1/authorization/bids/get/content", {castId: this.castId}).then(results => {
                const {msg, data, httpCode} = results.data;
                if (httpCode === 200) {
                    this.userList = data.userList;
                } else {
                    errTips(msg);
                }
            })
        },
        //获取任务数据
        // getTask() {
        //   httpGet('/v1/authorization/manage/mission/list', {teamId: this.teamId}).then(results => {
        //     const {msg, data, httpCode} = results.data;
        //     if (httpCode === 200) {
        //       this.missionTitleList = data.missionTitleList;
        //     } else {
        //       errTips(msg);
        //     }
        //   });
        // },

        deleteMission(id) {//删除一个子任务，右上角框里的“删除任务”
            httpDelete(`/v1/authorization/mission/missionsubtitle/delete/${id}`).then(results => {
                const {httpCode, msg} = results.data;
                if (httpCode === 200) {
                    successTips('删除成功');
                } else {
                    errTips(msg);
                }
                this.getSubtitleList(this.addMission.titleId);
                this.getMissionTitleList();
            });
        },
        getCastId(projectId) {//获取当前的投标Id，调用一次就够了
            httpGet("/v1/authorization/manage/castId/get", {projectId: projectId}).then(results => {
                const {msg, data, httpCode} = results.data;
                if (httpCode == 200) {
                    this.castId = data.castId;
                } else {
                    errTips(msg);
                }
            })
        },
        insertNewMissionType() {//"添加新的任务类型"
            if (this.insertMissionType.missionName === '') {
                errTips('任务类型名称不能为空');
                this.visible1 = false;
                return false;
            }
            httpPost('/v1/authorization/mission/missiontype/insert', this.insertMissionType).then(results => {
                const {msg, httpCode} = results.data;
                if (httpCode === 200) {
                    this.getMissionTypeList();
                    successTips('添加任务类型成功！');
                } else {
                    errTips(msg);
                }
                this.getMissionTypeList();
                this.insertMissionType.missionName = '';
                this.visible1 = false;
            });
        },
        // //获取任务列表（标题列表）
        // getMissionList(val) {
        //   httpGet('/v1/authorization/mission/missiontitle/list', {teamId: val}).then(results => {
        //     const {msg, data, httpCode} = results.data;
        //     if (httpCode === 200) {
        //       this.missionList = data.missionTitle;
        //     } else {
        //       errTips(msg);
        //     }
        //   });
        // },
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
        uploadFile(file) {//添加新的任务
            (file) && (this.addMission.sourceFile = file.fileName);
            let dataForm = this.addMission.sourceFile.split('/');
            this.addMission.resourceName = dataForm[dataForm.length - 1];
            if (new Date(this.addMission.startTime.replace(/\-/g, '/')) > new Date(this.addMission.endTime.replace(/\-/g, '/'))) {
                errTips('开始时间不能大于结束时间');
                return false;
            }
            this.addMission.castId = this.castId;
            httpPost('/v1/authorization/bids/missioninfo/add', this.addMission).then(results => {
                const {msg, httpCode} = results.data;
                if (httpCode === 200) {
                    successTips('添加任务成功！');
                    this.getMissionTitleList();
                } else {
                    errTips(msg);
                }
            }).then(() => {
                for (let key in this.addMission) {
                    this.addMission[key] = "";
                }
            });
        },
        addNewMission() {//添加新的任务，点击”保存”后触发这个函数
            this.testUploadIndex = !this.testUploadIndex;//这个变量改变后触发uploadFile函数，具体原因可看上边sourceUpload处代码
        },
        // returnSquare() {
        //   this.$router.push({path: '/desk/taskManage'});
        // },
        rowClass() {
            return 'background:#F4F6F9;';
        },
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