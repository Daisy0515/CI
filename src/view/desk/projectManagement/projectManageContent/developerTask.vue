<template>
    <div class="myTable">
        <div class="header_two0">
            <ul class="c-header__navigation clearfix">
                <li class="c-header__navigation__item" v-for="item in items" :key="item.title"
                    @click="changeTaskStatus(item)">
                    <router-link :class="selectedHeader === item.value ? 'header_active' : ''" to>
                        {{ item.title }}
                    </router-link>
                </li>
            </ul>
            <br/>
        </div>

        <div class="header_top">
            <br/>
            <el-input v-model="pageData.content" placeholder="任务名称" clearable></el-input>
            <el-input v-model="pageData.subtitle" placeholder="子任务名称" clearable></el-input>
            <el-select placeholder="请选择子任务类型" v-model="pageData.missionTypeId" clearable>
                <el-option v-for="item in missionTypeList" :key="item.id" :label="item.missionName"
                           :value="item.id"></el-option>
            </el-select>
            <el-button type="primary" @click="searchList()">搜索</el-button>
        </div>

        <el-table :data="taskTable" style="width:1200px;margin:0 auto" v-loading="missionTableLoading">
            <el-table-column fixed prop="subtitle" label="子任务名称" align="center">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.projectName" placement="top-start">
                        <div style="color: #7cabb1" @click="taskView(scope.row.id)">{{scope.row.subtitle}}</div>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="missionType" label="子任务类型" align="center"></el-table-column>
            <el-table-column prop="content" label="任务名称" align="center"></el-table-column>
            <el-table-column prop="statusName" label="状态" align="center"></el-table-column>
            <el-table-column prop="startTime" label="开始时间" align="center"></el-table-column>
            <el-table-column prop="endTime" label="结束时间" align="center"></el-table-column>
            <el-table-column prop="gmtModified" label="更新时间" align="center"></el-table-column>

            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="primary" plain size="small" @click="taskView(scope.row.id)">
                        <i class="el-icon-search"></i>
                        查看任务
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="bid_footer">
            <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page.sync="pageData.pageNo"
                    :total="pageData.totalPage"
                    layout="prev, pager, next, jumper"
            ></el-pagination>
        </div>

        <el-dialog :title="taskInfo.subtitle" :visible.sync="dialogTaskInfoVisible"
                   :close-on-click-modal="false" @close='closeDialog' class="myDialog">
            <el-form :model="taskInfo" ref="taskInfo" class="myForm">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="任务类型:">
                            <h3 style="width:100%;margin:0px;">{{taskInfo.missionTypeName}}</h3>
                        </el-form-item>
                    </el-col>
                    <el-col :span="13">
                        <el-form-item label="任务状态:" style="pointer-events: none;">
                            <h3 style="width:100%;margin:0px;">{{taskInfo.statusName}}</h3>
                        </el-form-item>
                    </el-col>
                    <el-col :span="3">
                        <el-form-item v-if="typeTemplate!==null">
                            <a :href="typeTemplate" target="_blank" style="font-size:17px; font-weight:bold;">参考模板</a>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="任务创建时间:">
                            <h3 style="width:100%;margin:0px;">{{taskInfo.gmtCreate}}</h3>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="任务修改时间:">
                        <h3 style="width:100%;margin:0px;">{{taskInfo.gmtModified}}</h3>
                    </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item label="执行人:">
                    <h3 style="width:100%;margin:0px;">{{taskInfo.participants}}</h3>
                </el-form-item>
                <el-row>
                    <el-col :span="5">
                        <el-form-item label="任务执行时间:">
                            <h3 style="width:100%;margin:0px;">{{taskInfo.startTime}}</h3>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="到">
                            <h3 style="width:100%;margin:0px;">{{taskInfo.endTime}}</h3>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item label="任务描述:">
                    <el-input type="textarea" autosize style="resize:none;width:90%;border:2px solid gray;"  readonly="readonly"
                              v-model="taskInfo.description">
                    </el-input>
                </el-form-item>
            </el-form>
            <hr style="margin-bottom:20px">
            <el-table :data="fileTable" style="width:1200px;margin:0 auto" v-loading="fileTableLoading">
                <el-table-column prop="resourceName" label="文件名称" align="center">
                    <template slot-scope="scope">
                        <a :href="scope.row.resource" target="_blank">
                            {{scope.row.resourceName}}
                        </a>
                    </template>
                </el-table-column>
                <el-table-column prop="userName" label="上传者" align="center"></el-table-column>
                <el-table-column prop="userRole" label="角色" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.role === 1">项目经理</span>
                        <span v-else>开发者</span>
                    </template>
                </el-table-column>
                <el-table-column prop="gmtCreate" label="上传时间" align="center"></el-table-column>
                <el-table-column label="下载" align="center">
                    <template slot-scope="scope">
                        <a :href="scope.row.resource" target="_blank">
                            <el-button type="primary" size="small">
                                <i class="el-icon-download">下载</i>
                            </el-button>
                        </a>
                    </template>
                </el-table-column>
            </el-table>
            <div class="bid_footer">
                <el-pagination
                        style="margin: 10px"
                        @current-change="nextFilePage"
                        :current-page.sync="filePageData.pageNo"
                        :total="filePageData.totalPage"
                        layout="prev, pager, next, jumper"
                ></el-pagination>
            </div>
            <div style="text-align:center">
                <sourceUpload :uploadIndex="uploadIndex" v-on:setIdCard="setIdCard($event)"/>
                <el-button type="primary" size="mini" @click="uploadFile()">确定上传</el-button>
            </div>

        </el-dialog>
    </div>

</template>

<script>
    import {httpGet, httpPost} from "@/utils/http.js";
    import {message, successTips, errTips} from "@/utils/tips.js";
    import {specificDate} from "@/utils/getDate.js";
    import sourceUpload from "@/common/upload/resourceUpload";

    export default {
        components: {
            sourceUpload
        },
        data() {
            return {
                typeTemplate: null,
                uploadIndex: false,
                sourceFile: null,
                teamId: null,
                projectName: null,
                dialogTaskInfoVisible: false,
                missionTypeList: [],
                selectedHeader: 1,//决定显示哪一个页面
                pageData: {
                    pageNo: 1,
                    pageSize: 10,
                    totalPage: 0,
                    orderBy: "id",
                    orderType: "DESC",
                    status: 1,
                    projectName: null,
                    content: null,
                    subtitle: null,
                    missionTypeId: null,
                },
                filePageData: {
                    pageNo: 1,
                    pageSize: 5,
                    totalPage: 0,
                    orderBy: "id",
                    orderType: "DESC",
                    missionId: "",
                },
                taskInfo: {
                    titleName: null,
                    missionTypeName: null,
                    statusName: null,
                    description: null,
                    gmtModified: null,
                    gmtCreate: null,
                    startTime: null,
                    endTime: null,
                    participants: null,
                },
                fileTable: [],
                taskTable: [],
                items: [
                    {
                        title: "执行中",
                        value: 1
                    },
                    {
                        title: "已完成",
                        value: 2
                    },
                    {
                        title: "全部",
                        value: 0
                    },
                    {
                        title: "放弃",
                        value: 3
                    },
                ],
                fileTableLoading: false,
                missionTableLoading: false,
            };
        },
        computed: {},
        created: function () {
            this.projectName = sessionStorage.getItem('projectName');
            this.teamId = sessionStorage.getItem("teamId");
            this.getMissionType(this.teamId);
            this.getView();
        },
        methods: {
            /**获取子任务类型搜索下拉框**/
            getMissionType(val) {
                httpGet("/v1/authorization/manage/missiontype/list", {teamId: val}).then(results => {
                    const {msg, httpCode, data} = results.data;
                    if (httpCode === 200) {
                        this.missionTypeList = data.missionTypeList;
                    } else {
                        errTips(msg);
                    }
                });
            },
            searchList() {
                let {selectedHeader, pageData} = this;
                pageData.status = selectedHeader;
                this.getView();
            },

            getView(val = this.pageData) {
                this.missionTableLoading = true;
                let {teamId, selectedHeader} = this;
                val.teamId = teamId;
                val.status = selectedHeader;
                httpGet("/v1/authorization/mission/missioninfo/listall", val).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 200) {
                        this.pageData.pageNo = data.pageNo;
                        this.pageData.totalPage = parseInt(data.totalPage);
                        let {missList, missionTypeList} = data;

                        for (let i of missList) {
                            for (let p of missionTypeList) {
                                if (i.missionTypeId === p.id) {
                                    i.missionType = p.missionName;
                                }
                            }
                            i.startTime = specificDate(i.startTime);
                            i.gmtModified = specificDate(i.gmtModified);
                            i.endTime = specificDate(i.endTime);
                        }
                        // Object.assign(this.pageData, val);
                        this.$set(this, "taskTable", missList);
                    } else if (msg === "该条件暂无数据") {
                        this.taskTable = [];
                        message("该条件暂无数据");
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                    this.missionTableLoading = false;
                });
            },

            changeTaskStatus(item) {
                this.selectedHeader = item.value;
                this.getView();
            },

            handleCurrentChange(val) {
                this.pageData.pageNo = val;
                this.getView();
            },

            nextFilePage(val) {
                this.filePageData.pageNo = val;
                this.getFileTable(this.filePageData.missionId);
            },

            /***获取单个任务的所有相关数据***/
            taskView(missionId) {
                this.dialogTaskInfoVisible = true;
                this.getTaskDetail(missionId);
                this.getFileTable(missionId);
                this.getTemplate(missionId);
            },
            /***获取单个任务的详情(除了文件列表)***/
            getTaskDetail(missionId) {
                return httpGet("/v1/authorization/manage/mission/get", {id: missionId}).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 200) {
                        data.gmtCreate = specificDate(data.gmtCreate);
                        data.gmtModified = specificDate(data.gmtModified);
                        data.startTime = specificDate(data.startTime);
                        data.endTime = specificDate(data.endTime);

                        if (data.status === 1) {
                            data.statusName = "执行中";
                        } else if (data.status === 2) {
                            data.statusName = "已完成";
                        } else {
                            data.statusName = "放弃";
                        }

                        data.participants = data.participantList.join(',');
                        this.taskInfo = data;
                    } else {
                        errTips("获取任务信息失败:", msg);
                    }
                });
            },

            /***获取单个任务详情里的文件列表数据 分页***/
            getFileTable(missionId) {
                this.fileTableLoading = true;
                this.filePageData.missionId = missionId;
                return httpGet("/v1/authorization/manage/resource/list", this.filePageData).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 200) {
                        this.fileTable = data.list;
                        this.filePageData.pageNo = data.pageNo;
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

            /***根据任务id获取当前任务的参考模板**/
            getTemplate(missionId) {
                return httpGet("/v1/authorization/manage/typetemplate/get", {id: missionId}).then(results => {
                    const {httpCode, data} = results.data;
                    if (httpCode === 200) {
                        this.typeTemplate = data.resource;
                    } else {
                        errTips("获取参考模板失败:");
                    }
                });
            },

            setIdCard(data) {
                if (data === "") {
                    errTips("请先选择文件！")
                } else {
                    data && (this.sourceFile = data);
                    let param = {
                        missionId: this.filePageData.missionId,
                        resource: this.sourceFile,
                        resourceName: this.sourceFile.split('/')[this.sourceFile.split('/').length - 1]
                    };
                    // console.log(param);
                    httpPost("/v1/authorization/manage/resource/insert", param).then(results => {
                        const {msg, httpCode} = results.data;
                        if (httpCode === 200) {
                            successTips('上传文件成功！');
                            this.getFileTable(this.filePageData.missionId);
                        } else if (httpCode !== 401) {
                            errTips(msg);
                        } else {
                            alert(httpCode);
                        }
                    });
                    this.sourceFile = null;
                }

            },

            uploadFile() {
                this.sourceFile ? this.setIdCard() : (this.uploadIndex = !this.uploadIndex);
            },

            closeDialog() {
                this.dialogTaskInfoVisible = false;
            }
        }

    }
</script>

<style lang='scss' scoped>
    @import "@/assets/scss/myTable.scss";

    .header_two0 {
        a {
            color: #666;
            font-weight: 400;
            width: 100px;
            font-size: 16px;

            &:hover {
                border-bottom: 1.9px solid #7cabb1;
                padding-bottom: 10px;
            }
        }

        .c-header__navigation {
            width: 940px;
            float: left;
            // text-align: center;
            list-style: none;
        }

        .c-header__navigation__item {
            padding: 0 15px 0 15px;
            display: inline-block;
            vertical-align: middle;
            height: 100%;
            font-size: 14px;
            font-weight: 600;
        }

        .header_active {
            border-bottom: 1.9px solid #7cabb1;
            padding-bottom: 10px;
            // background: #0760c5;
        }
    }

    .myTable {
        .el-cascader {
            width: 200px;
        }

        .el-input {
            width: 200px;
        }
    }

</style>

<style>
    .myDialog .el-dialog {
        width: 60%;
        height: auto;
    }

    .myDialog .el-dialog__title {
        font-size: 20px;
        font-weight: bolder;
    }

    .myDialog .el-dialog__body {
        padding-top: 0px;
    }

    .myForm .el-form-item__label {
        font-size: 17px;
        color: black;
        font-weight: bolder;
    }

    .myForm .el-form-item {
        padding: 0px;
        height: auto;
        margin: 0px;
    }

</style>
