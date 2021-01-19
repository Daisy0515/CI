<!--
评审管理员的操作里的发送邮件功能
-->
<template>
    <!-- 不用的页面 -->
    <div class="myTableEmail">
        <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 130%;">
            <el-breadcrumb-item><a class="Link" href="javascript:history.back(-1)">返回上一级</a></el-breadcrumb-item>
            <el-breadcrumb-item>发送邮件</el-breadcrumb-item>

        </el-breadcrumb>
        <h1 style="text-align: center;margin-top:20px">发送邮件</h1>
        <h2 style="text-align: center;font-weight: bolder;margin-top: 20px;">评审标题：
            <span style="font-weight: 400;">{{title}}</span>
        </h2>
        <div class="searchBloack">
            <p class="Tips">
                <i class="el-icon-info"></i>
                系统已经预配置了一些 不同类型信件内容，请跟据需要进行选择，然后点击“定制信件”进行下一步信息的填充
            </p>
            <el-select v-model="searchData.receiver" clearable placeholder="收件方">
                <el-option label="提交人" value="1"></el-option>
                <el-option label="评审专家" value="2"></el-option>
                <el-option label="评审发布者" value="3"></el-option>
            </el-select>

            <el-select v-model="searchData.status" clearable placeholder="评审专家状态" style="margin-left: 20px"
                       v-if="searchData.receiver==='2'">
                <el-option label="全部状态" value="1"></el-option>
                <el-option label="已完成" value="2"></el-option>
                <el-option label="已撤回评审" value="3"></el-option>
                <el-option label="评审中（已延期）" value="4"></el-option>
                <el-option label="评审中" value="5"></el-option>
                <el-option label="已撤回邀请" value="6"></el-option>
                <el-option label="已邀请未回复" value="7"></el-option>
                <el-option label="已拒绝" value="8"></el-option>
                <el-option label="已中止" value="9"></el-option>
            </el-select>

            <el-button type="primary" @click="editEmail" style="margin-left: 20px">定制邮件</el-button>
        </div>
        <div v-if="containerShow === true">
            <h2 style="text-align: center;margin-top:20px">
                定制信件---管理员发送给
                <span v-if="searchData.receiver === '1' ">提交人</span>
                <span v-if="searchData.receiver==='2'">评审专家</span>
                <span v-if="searchData.receiver==='3'">评审发布者</span>
            </h2>
            <div style="margin-top: 20px;">
                <div style="width: 75%; margin:0 auto;">
                    <el-form :label-position="'left'" label-width="100px" :model="emailForm">
                        <el-form-item label="收件人:">
                            <el-checkbox-group v-model="userNameList">
                                <el-checkbox v-for="item,index in emailList" :label="item.name"
                                             @change="handleCheckedUserChange($event,index)"></el-checkbox>
                            </el-checkbox-group>

                        </el-form-item>

                        <el-form-item label="信件主题:">
                            <el-input v-model="emailForm.emailConfig.theme" style="width: 90%;">

                            </el-input>
                        </el-form-item>
                        <el-form-item label="抄送:">
                            <el-checkbox-group v-model="checkList" @change="selectCC">
                                <el-checkbox label="管理员"></el-checkbox>
                                <el-checkbox label="发布者"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item label="信件主体:">
                            <el-input type="textarea" v-model="emailForm.emailConfig.content" rows="10"
                                      style="width: 90%;">

                            </el-input>
                        </el-form-item>
                    </el-form>
                    <div style="text-align: center;">
                        <el-button @click="clearEmailForm">清空</el-button>
                        <el-button type="primary" @click="preview()" style="margin-left: 100px;">预览</el-button>
                    </div>
                    <el-dialog width="40%" title="邮件预览" :visible.sync="emailePrviewVisible">

                        <p v-html="previewArea"></p>
                        <div style="text-align: center;margin-top: 20px;">
                            <el-button @click="emailePrviewVisible=false" size="mini">取消</el-button>
                            <el-button type="primary" @click="send()" style="margin-left: 100px;" size="mini">发送
                            </el-button>
                        </div>

                    </el-dialog>
                </div>
            </div>
        </div>


    </div>

</template>

<script>
    import {
        httpGet,
        httpPut,
        httpPost,
        httpDelete
    } from "@/utils/http.js";
    import {
        message,
        successTips,
        errTips
    } from "@/utils/tips.js";
    import {
        specificDate
    } from '@/utils/getDate.js';

    export default {

        data() {
            return {
                emailePrviewVisible: false,
                previewArea: null,
                userNameList: [],
                checkList: [],
                id: null,
                title: null,
                containerShow: false,
                searchData: {
                    id: null,
                    receiver: null,
                    status: null
                },
                emailForm: {
                    adminMissionId: null,
                    duplicate: {isAdmin: false, isProjectUser: false},
                    emailConfig: {content: null, theme: null},
                    receiver: null,
                    status: null,
                    userList: [],
                },
                emailList: []
            };
        },
        created: function () {
            this.id = this.$route.query.id;
            this.searchData.id = this.id;
            //this.reviewId = this.$route.query.reviewId;

            this.getView();

        },
        computed: {},
        methods: {
            clearEmailForm() {
                this.emailForm.emailConfig = {content: null, theme: null};

            },
            send() {
                //post /v1/authorization/review/adminmissionemailtemplatepreview/insert
                httpPost("/v1/authorization/review/adminmissionemailtemplatepreview/insert", this.emailForm).then(results => {
                    const {
                        httpCode,
                        msg,
                        data
                    } = results.data;
                    if (httpCode == 200) {
                        successTips("发送成功！");
                        this.emailePrviewVisible = false;

                    } else {

                        errTips(msg);
                    }

                })
            },
            preview(val) {

                this.emailePrviewVisible = true;
                //post /v1/authorization/review/adminmissionemailtemplatepreview/get
                httpPost("/v1/authorization/review/adminmissionemailtemplatepreview/get", this.emailForm).then(results => {
                    const {
                        httpCode,
                        msg,
                        data
                    } = results.data;
                    if (httpCode == 200) {
                        this.previewArea = data.content;

                    } else {

                        errTips(msg);
                    }

                })
                // let i = this.emailForm.index;
                // this.infoList[i].emailConfig = this.emailForm.config;
                // this.emailForm.config =
                //console.log("2:",this.infoList);

                //this.emailForm.config = {};
            },
            selectCC() {
                //console.log(this.checkList);
                var item = {isAdmin: false, isProjectUser: false};
                for (let i of this.checkList) {
                    if (i === "管理员") item.isAdmin = true;
                    if (i === "发布者") item.isProjectUser = true;
                }
                this.emailForm.duplicate = item;
                console.log(this.emailForm.duplicate);
            },
            handleCheckedUserChange(value, index) {
                console.log(value);
                console.log(index);
                if (value === true) {
                    let item = this.emailList[index];
                    this.emailForm.userList.push(item);
                }
                if (value === false) {
                    let item = this.emailList[index];
                    let arr = this.emailForm.userList;
                    for (let i = 0; i < arr.length; i++) {
                        if (item.id === arr[i].id) {
                            arr.splice(i, 1);
                            break;
                        }
                    }
                }
                console.log("emailForm.userList:", this.emailForm.userList);
            },
            /*定制邮件*/
            editEmail() {
                //console.log("searchData:", this.searchData);
                //get /v1/authorization/review/adminmissionemailtemplate/update
                this.userNameList = [];
                this.checkList = [];
                httpGet("/v1/authorization/review/adminmissionemailtemplate/update", this.searchData).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode == 200) {
                        this.emailForm.adminMissionId = data.adminMissionId;
                        this.emailForm.emailConfig.content = data.content;
                        this.emailList = data.emailList;
                        this.emailForm.receiver = data.receiver;
                        this.emailForm.status = data.status;


                    } else {
                        errTips(msg);
                    }

                });
                this.containerShow = true;
            },
            getView() {

                //get /v1/authorization/review/adminmissionemail/get
                httpGet("/v1/authorization/review/adminmissionemail/get", {
                    id: this.id
                }).then(results => {
                    const {
                        httpCode,
                        msg,
                        data
                    } = results.data;
                    if (httpCode == 200) {

                        this.title = data.title;


                    } else {
                        errTips(msg);
                    }

                });
            },

        }
    };
</script>

<style lang="scss">
    .Link {
        color: black;
    }

    .searchBloack {
        text-align: center;

        .Tips {

            margin-bottom: 20px;
            margin-top: 15px;
            color: #909399a8;
        }

        .el-select {
        }
    }
</style>
