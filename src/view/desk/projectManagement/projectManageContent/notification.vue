<template>
    <div class="applicationView">
        <div class="container deskHeader">
            <el-button type="primary" @click="showInitNewNotification" size="medium">
                发起通知
            </el-button>
            <div class="header_top">
                <el-input v-model="searchData.theme" placeholder="请输入通知主题"></el-input>
                <el-select v-model="searchData.type" clearable placeholder="通知类型">
                    <el-option label="会议通知" value="1"></el-option>
                    <el-option label="其他" value="2"></el-option>
                </el-select>
                <el-select v-model="searchData.participantsId" clearable placeholder="发起人">
                    <el-option v-for="item in missionList" :key="item.id" :label="item.missionName"
                               :value="item.id"></el-option>
                </el-select>
                <el-select v-model="searchData.participantsId" clearable placeholder="相关人员">
                    <el-option v-for="item in missionList" :key="item.id" :label="item.missionName"
                               :value="item.id"></el-option>
                </el-select>
                <el-date-picker
                        v-model="searchData.startTime"
                        type="date"
                        placeholder="通知开始时间"
                        value-format="yyyy-MM-dd"
                ></el-date-picker>
                <span style="margin-right: 15px;">到</span>
                <el-date-picker
                        v-model="searchData.endTime"
                        type="date"
                        placeholder="通知结束时间"
                        value-format="yyyy-MM-dd"
                ></el-date-picker>
                <el-button size="primary" @click="searchList()">搜索</el-button>

            </div>


            <div style="margin-top: 30px">
                <el-tabs v-model="selectedNotice" @tab-click="showNotice(selectedNotice)">
                    <el-tab-pane
                        v-for="(item,index) in notificationList"
                        :label="item.theme"
                        :value="index"
                    >
                        <el-table :data="noticeTableList" stripe style="width: 100%">
                            <el-table-column prop="theme" label="通知主题" width="180"></el-table-column>
                            <el-table-column prop="participantsList" label="相关人员" width="180"></el-table-column>
                            <el-table-column prop="notificationTime" label="通知日期" width="180"></el-table-column>
                            <el-table-column label="操作" width="180">
                                <template slot-scope="scope">
                                    <el-button type="text" @click="showNoticeInfoDialog(scope.row.id)"><i class="el-icon-search"></i>详情</el-button>
                                    <el-button type="text" @click="deleteNotice(scope.row.id)">删除</el-button>
                                </template>
                            </el-table-column>


                        </el-table>

                    </el-tab-pane>

                </el-tabs>

                <el-dialog  :visible.sync="noticeVisible" 
                           style="width:100%;text-align:left; font-weight: bolder;">
                    <el-form  v-loading="loading">
                        <el-row :gutter="20">
                            <el-col :span="10">
                                <el-form-item label="通知主题" :label-width="formLabelWidth">
                                    <el-input v-model="noticeData.theme" auto-complete="off" :disabled="true"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item label="通知类型" :label-width="formLabelWidth">
            <!--                        <el-input v-model="form.status " auto-complete="off" :readonly="isReadOnly"/>-->
                                        <el-input v-model="noticeData.type" auto-complete="off" :disabled="true"/>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="10">
                                <el-form-item label="相关人员" :label-width="formLabelWidth">
                                    <el-input v-model="noticeData.participantsList" auto-complete="off" :disabled="true"/>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
            
                                <el-form-item label="通知日期" :label-width="formLabelWidth">
                                    <el-input v-model="noticeData.notificationTime" auto-complete="off" :disabled="true"/>
                                </el-form-item>
            
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="16">
                                <el-form-item label="通知内容" :label-width="formLabelWidth">
                                    <el-input v-model="noticeData.content" type="textarea" :rows="6" placeholder="请输入内容"/>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="16">
                                <el-table
                                :data="noticeData.resourceList"
                                style="width: 100%">
                                <el-table-column
                                    prop="resourceName"
                                    label="文件名称"
                                    width="180">
                                </el-table-column>
                                <el-table-column
                                    prop="userName"
                                    label="上传者"
                                    width="180">
                                </el-table-column>
                                <el-table-column
                                    prop="gmtCreate"
                                    label="上传日期">
                                </el-table-column>
                                <el-table-column label="操作" width="180">
                                    <template slot-scope="scope">
                                        <a target="_Blank" :href="scope.row.resourceUrl">
                                            下载
                                        </a>
    

                                    </template>
                                </el-table-column>
                                </el-table>
                            </el-col>
                        </el-row>
                        <div style="text-align: center;margin-top: 50px">
                            <el-button type="primary" @click="closeNoticeDialog">关闭</el-button>
                        </div>
                    </el-form>
            
                </el-dialog>
            </div>

            <el-card class="box-card0" v-loading="loading">
                <ul class="services">
                    <li class="serviceItem clearfix" v-for="(item, index) in testIssueSumList " :key="index">
                        <div style="border: #d8d8d8 1px solid; padding: 10px 20px 20px 10px; box-shadow: 0 2px 2px 0 rgba(0,0,0,.1);">
                    <li>
                        意见标题：{{item.title}}
                    </li>
                    <li>
                        提交人：{{item.creatorName}}

                    </li>
                    <li>
                        缺陷等级：
                        <span v-if="item.level===1" style="color:red">█马上解决</span>
                        <span v-if="item.level===2" style="color:orange">█急需解决</span>
                        <span v-if="item.level===3" style="color:yellow">█高度重视</span>
                        <span v-if="item.level===4" style="color:green">█正常处理</span>
                        <span v-if="item.level===5" style="color:blue">█低优先级</span>
                    </li>
                    <li>

                        描述：{{item.description}}


                    </li>



        </div>
        </li>
        </ul>
        <el-button type="primary" size="medium" style="width:150px;margin-left:45%;margin-top: 5%;">
            返回
        </el-button>
        </el-card>
        <init-new-notification  :initNewNotificationVisible="newNotificationView"
                                      @closeDialog="closeNewNotification"></init-new-notification>
    </div>
    </div>
</template>
<script>
    import {httpGet, httpPost,httpDelete} from "@/utils/http.js";
    import {specificDate} from "@/utils/getDate.js";
    import {errTips} from "@/utils/tips.js";
    import {mapMutations, mapActions, mapGetters} from "vuex";
    import initNewNotification from '@/view/desk/projectManagement/projectManageContent/component/initNewNotification'
    import {quillEditor} from 'vue-quill-editor'; //调用编辑器
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';

    export default {
        components: {
            quillEditor,
            initNewNotification,
        },
        data() {
            return {
                testIssueSumList: [],
                formLabelWidth: "100px",
                missionList: [],
                id: "",
                newNotificationView:false,
                loading: false,
                typeValue: "",
                ruleForm: {},
                noticeVisible:false,
                searchData: {
                    id: "",
                    missionId: "",

                },
                selectedNotice:0,
                noticeTable:{
                    theme:'',
                    participantsList:'',
                    notificationTime:'',
                    id:'',

                },
                noticeData:{
                    theme:"",
                    participantsList:'',
                    type:"",
                    notificationTime:"",
                    content:"",
                    resourceList:[],
                },
                noticeTableList:[],
                searchData: {
                    pageNo: 1,
                    pageSize: 10,
                    orderType: 'DESC',
                    orderBy: 'id',
                    teamId: null,
                    theme: null,
                    participantsId: null,
                    type: null,
                    startTime:null,
                    endTime:null
                },
                pageData: {
                    pageNo: 1,
                    pageSize: 10,
                    orderType: 'DESC',
                    orderBy: 'id',
                    teamId: null,
                    theme: null,
                    participantsId: null,
                    type: null,
                    startTime:null,
                    endTime:null
                },
                notificationList:[],
                teamId:null
            };
        },
        created: function () {
            this.teamId = this.$route.query.teamId;
            this.pageData.teamId = this.teamId;
            this.getNotification();
            // this.searchData.id = this.$route.query.id;
            // this.testIssueList(this.searchData.id);
            // this.getMissionList(this.searchData.id);
            //alert(this.id);
        },

        methods: {
            ...mapMutations(["setCache"]),
            getNotification(val=this.pageData) {
                
                ///v1/authorization/notification/search/list
                httpGet('v1/authorization/notification/search/list', val).then(results => {
                    const {msg, data, httpCode} = results.data;
                    if (httpCode === 200) {
                        this.notificationList = data.list;
                        console.log(this.notificationList);
                    } else {
                        errTips(msg);
                    }
                    this.showNotice(this.selectedNotice);
                    this.loading = false;
                });
            },
            closeNoticeDialog(){
                this.noticeVisible=false;
            },
            showInitNewNotification(){
                this.newNotificationView=true;
            },
            downloadResource(val){
                console.log(val);
            },
            deleteNotice(val){
                httpDelete(`v1/authorization/notification/notification/delete/${val}`).then(results => {
                    const {msg, data, httpCode} = results.data;
                    if (httpCode === 200) {
                        this.getNotification();
                        //console.log(data);
                    } else {
                        errTips(msg);
                    }
                    this.loading = false;
                });
                
            },
            showNotice(val){
                this.noticeTable.theme = this.notificationList[val].theme;
                this.noticeTable.id = this.notificationList[val].id;
                this.noticeTable.notificationTime = specificDate(this.notificationList[val].notificationTime);
                this.noticeTable.participantsList="";
                for(let i=0;i<this.notificationList[val].userList.length;i++){
                    this.noticeTable.participantsList +=this.notificationList[val].userList[i].userName+"; "
                    //console.log(this.notificationList[val].userList.userName);
                }
                //console.log(this.noticeTable);
                this.noticeTableList.pop();
                this.noticeTableList.push(this.noticeTable);
                
            },
            showNoticeInfoDialog(val){
                this.noticeVisible=true;
                httpGet('v1/authorization/notification/notification/get', {id:val}).then(results => {
                    const {msg, data, httpCode} = results.data;
                    if (httpCode === 200) {
                        
                        //console.log(data);
                    } else {
                        errTips(msg);
                    }
                    this.loading = false;
                    this.noticeData.theme = data.theme;
                    //console.log(data.theme);
                    this.noticeData.id = data.id;
                    if(data.type==1){
                        this.noticeData.type="会议";
                    }
                    if(data.type==2){
                        this.noticeData.type="其他通知";
                    }
                    this.noticeData.notificationTime = specificDate(data.notificationTime);
                    this.noticeData.participantsList="";
                    for(let i=0;i<data.userList.length;i++){
                        this.noticeData.participantsList +=data.userList[i].userName+"; "
                        //console.log(this.notificationList[val].userList.userName);
                    }
                    //console.log(this.noticeData);
                });
                
                httpGet('v1/authorization/notification/resource/list', {id:val}).then(results => {
                    const {msg, data, httpCode} = results.data;
                    if (httpCode === 200) {
                        
                        console.log(data);
                    } else {
                        errTips(msg);
                    }
                    this.loading = false;
                    let resource={
                        gmtCreate:'',
                        resourceName:'',
                        userName:'',
                        resourceUrl:'',
                    }
                    resource.gmtCreate=specificDate(data.gmtCreate);
            
                    while(this.noticeData.resourceList.length>0){
                        this.noticeData.resourceList.pop();
                    }
                    for(let i=0;i<data.resourceList.length;i++){
                        resource.gmtCreate=specificDate(data.resourceList[i].gmtCreate);
                        resource.userName=data.resourceList[i].userName;
                        resource.resourceUrl=data.resourceList[i].resource;
                        resource.resourceName=data.resourceList[i].resourceName;
                        this.noticeData.resourceList.push(resource);
                        //console.log(this.notificationList[val].userList.userName);
                    }
                    console.log(this.noticeData.resourceList);
                });
                

            },
            closeNewNotification(){
                this.newNotificationView=false;
            },
            getMissionList(value) {
                //get /v1/authorization/test/get/bugMission
                httpGet('/v1/authorization/test/get/bugMission', {id: value}).then(results => {
                    const {msg, data, httpCode} = results.data;
                    if (httpCode === 200) {
                        this.missionList = data.missionIdList;
                    } else {
                        errTips(msg);
                    }
                });
            },
            testIssueList(val) {
                this.loading = true;
                //get /v1/authorization/test/get/bugSummary
                httpGet('/v1/authorization/test/get/bugSummary', {id: val}).then(results => {
                    const {msg, data, httpCode} = results.data;
                    if (httpCode === 200) {
                        this.testIssueSumList = data.bugSummaryList;
                    } else if (httpCode === 400) {
                        this.setCache('myTest'); //???????
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                    this.loading = false;
                });
            },

            searchList() {

                this.loading = true;
                //get /v1/authorization/test/get/bugSummary
                httpGet('/v1/authorization/test/get/bugSummary', this.searchData).then(results => {
                    const {msg, data, httpCode} = results.data;
                    if (httpCode === 200) {
                        this.testIssueSumList = data.bugSummaryList;
                    } else if (httpCode === 400) {
                        this.setCache('myTest'); //???????
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                    this.loading = false;
                });
            },


        }
    };
</script>
<style lang='scss'>
    /*@import "@/assets/scss/applicationView.scss";*/

    .applicationView {
        .seeClass {
            color: #3e76b8;
            cursor: pointer;
        }

        .bid_footer {
            .el-input__inner {
                width: 70px;
            }

            .el-pagination {
                text-align: center;
                margin: 50px 0 50px 0;
            }

            .el-pagination.is-background .el-pager li:not(.disabled).active {
                background: #3e76b8;
            }
        }

        .el-table {
            border: 1px solid #d8d8d8;
        }

        /*.buttons {*/
        /*    float: right;*/
        /*}*/

        .header_top {
            margin-top: 15px;
            padding-bottom: 20px;

        }
        .button {
            display: inline-block;
            margin-left: 20px;
        }
        .el-input {
            display: inline-block;
            width: 200px;
            margin-right: 25px;
            margin-bottom: 25px;
        }

        .el-input__inner {
            border: 1px solid #c0c0c0;
            width: 200px;
            height: 35px;
            line-height: 35px;
        }

        .el-table td,
        .el-table th.is-leaf {
            color: black;
            border-bottom: 1px solid #d8d8d8;
        }
    }

    .box-card0 {
        li {
            margin-top: 15px;
            padding-top: 5px;
            color: #666;
            position: relative;
            cursor: pointer;

        }
    }
</style>
