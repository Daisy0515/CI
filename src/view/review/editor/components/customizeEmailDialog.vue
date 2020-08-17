<template>
    <el-dialog title="已选择对象" :visible.sync="visible" width="80%" :before-close="closeSelectedUserDialog">
        <el-table :data="userList" v-loading="userListLoading">
            <el-table-column property="userName" label="发送对象"></el-table-column>
            <el-table-column property="title" label="评审标题"></el-table-column>
            <el-table-column property="id" label="评审编号"></el-table-column>
            <el-table-column label="信件模板">
                <el-select v-model="templateId" placeholder="请选择模板" disabled>
                    <el-option
                            v-for="item in templateList"
                            :key="item.id"
                            :label="item.templateName"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-table-column>
            <el-table-column property="title" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="medium" @click="customizeEmail(scope.row,scope.$index)">定制</el-button>
                </template>
            </el-table-column>
            <el-table-column label="发送">
                <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.isInvite"></el-checkbox>
                </template>
            </el-table-column>
        </el-table>
        <el-row style="margin-top: 15px;">
            <el-button style="margin-left:33%;" @click="closeSelectedUserDialog">关闭</el-button>
            <el-button type="primary" style="margin-left:30px;" @click="customizeEmailGlobally">全局定制</el-button>
            <el-button type="primary" style="margin-left:30px;" @click="sendAllEmail" :loading="sendAllEmailLoading">
                发送全部
            </el-button>
        </el-row>
        <el-dialog width="60%" title="定制信件" :visible.sync="customizeVisible" append-to-body
                   :before-close="closeCustomizeDialog">
            <el-row style="margin-top: 15px;">
                <el-col :span="3"> 收件人：</el-col>
                <el-col :span="10" style="margin-top: -10px;">
                    <el-input v-model="receiverName" :readonly="true" size="medium"></el-input>
                </el-col>
            </el-row>
            <el-row style="margin-top: 15px;">
                <el-col :span="3"> 抄送：</el-col>
                <el-col :span="10">
                    <el-checkbox v-model="duplicate.isAdmin">管理员</el-checkbox>
                    <el-checkbox v-model="duplicate.isProjectUser">发布者</el-checkbox>
                </el-col>
            </el-row>
            <el-row style="margin-top: 15px;">
                <el-col :span="3"> 信件主题：</el-col>
                <el-col :span="10" style="margin-top: -5px;">
                    <el-input placeholder="请输入信件的主题" size="medium" v-model="emailConfig.theme"></el-input>
                </el-col>
            </el-row>
            <el-row style="margin-top: 15px;">
                <el-col :span="3"><span>信件主体：</span></el-col>
                <el-col :span="18">
                    <el-input type="textarea" :rows="15" v-model="emailConfig.content"></el-input>
                </el-col>
            </el-row>
            <el-row style="margin-top: 15px;">
                <el-button style="margin-left:33%;" @click="closeCustomizeDialog">关闭</el-button>
                <el-button type="primary" style="margin-left:30px;" @click="saveEmailInfo">保存</el-button>
                <el-button type="primary" style="margin-left:30px;" @click="previewEmail">预览</el-button>
            </el-row>
            <!-- 定制邮件框中预览信件的对话框-->
            <el-dialog width="60%" title="预览信件" :visible.sync="previewVisible" append-to-body>
                <el-row>
                    <el-col :span="3"><span>信件内容</span></el-col>
                    <el-col :span="18">
                        <el-input type="textarea" rows="15" :readonly="true" v-model="emailPreviewContent"></el-input>
                    </el-col>
                </el-row>
                <el-row>
                    <el-button style="margin-left:45%;margin-top: 10px;" @click="previewVisible=false">关闭</el-button>
                </el-row>
            </el-dialog>
        </el-dialog>
    </el-dialog>
</template>

<script>
    import {httpGet, httpPost} from "@/utils/http.js";
    import {message, successTips, errTips} from "@/utils/tips.js";
    import deepCopyObject from "@/utils/deepCopyObject";
    import {MessageBox} from 'element-ui';

    export default {
        name: "customizeEmailDialog",
        props: {
            visible: {//控制组件的显示
                type: Boolean,
                default: false,
            },
            userListLoading: {//已选择的发送邮件对象列表的加载
                type: Boolean,
                default: false,
            },
            receiver: {//邮件的接收者
                type: [Number, String],
            },
            templateId: {//邮件的模板号
                type: Number,
            },
            userList: {//已选择的发送邮件对象
                type: Array,
                default: () => [],
            },
            templateList: {//邮件模板的列表
                type: Array,
                default: () => [],
            }

        },
        data() {
            return {

                customizeVisible: false,//针对特定的任务进行定制框的显示
                sendAllEmailLoading: false,//发送邮件时，按钮的加载提示，防止重复提交

                /*点击定制，定制信件对话框，用到的属性*/
                selectedUserIndex: null,//定制的信件在已选择对象列表中的下标(index)
                previewContent: null,
                userId: null,//用户编号id
                duplicate: this.getInitDuplicate(),//邮件抄送的设置
                emailConfig: this.getInitEmailConfig(),//信件需要定制的内容
                emailPreviewContent: null,//信件主体预览
                adminMissionId: null,//管理员任务编号id
                receiverName: null,//收件人姓名
                previewVisible: false,//控制预览页面的显示
                global: false,//是否进行全局定制
            };
        },
        methods: {

            /**初始化emailConfig*/
            getInitEmailConfig() {//用户设置的信件模板与信件主题,初始化为null
                return {
                    content: null,
                    theme: null,
                }
            },

            /**初始化duplicate*/
            getInitDuplicate() {
                return {
                    isAdmin: false,//管理员
                    isProjectUser: false,//发布者
                };
            },

            /**已选择对象对话框：关闭对话框*/
            closeSelectedUserDialog() {
                this.$emit("closeDialog");
            },

            /**定制信件页面：获取信件模板等相关信息*/
            getEmailContentInfo(row) {
                this.customizeVisible = true;
                this.userId = row.userId;//预先赋值，在预览信件内容的时候需要这个属性
                this.duplicate = deepCopyObject(row.duplicate);//初始化抄送选项
                this.adminMissionId = row.id;//管理员任务编号
                if (row.emailConfig === null) {//定制信件框没有保存过内容
                    let data = {
                        adminMissionId: row.id,//管理员任务编号
                        receiver: parseInt(this.receiver),
                        userId: row.userId,
                    };
                    console.log("data", data);
                    httpPost("/v1/authorization/review/admincurrentemail/update", data).then(results => {
                        const {httpCode, msg, data} = results.data;
                        if (httpCode === 200) {
                            this.emailConfig.theme = null;
                            this.emailConfig.content = data.content;
                        } else {
                            errTips(msg);
                        }
                    });
                } else {     //定制信件保存过
                    this.emailConfig = deepCopyObject(row.emailConfig);
                }
            },

            /**已选择对象对话框：全局定制的数据显示*/
            customizeEmailGlobally() {
                this.global = true;         //开启全局定制
                let index = 0;              //考虑到发送的邮件最少只有1封，故index取最小值
                let row = deepCopyObject(this.userList[index]);
                let receiverNameList = '';  //全局定制的时候，设置所有邀请的收件人名
                for (let item of this.userList) {
                    if (item.isInvite) {      //该信件的邀请是勾选上的
                        receiverNameList += item.userName + "; ";
                    }
                }
                this.receiverName = receiverNameList; //重新设置userList,将userList中的所有专家赋值到receiverName中
                row.emailConfig = null;     //全局定制的数据一定要从后端返回，
                this.getEmailContentInfo(row);
            },

            /**已选择对象对话框：点击列表中的定制的内容显示，row：需要定制信件的已有信息，index：表示该邮件在列表中的下标*/
            customizeEmail(row, index) {
                this.global = false;            //关闭全局定制
                this.selectedUserIndex = index; //预先赋值，在保存信件内容的时候需要这个属性
                this.receiverName = row.userName;
                this.getEmailContentInfo(row);
            },

            /**定制信件对话框：保存修改*/
            saveEmailInfo() {
                if (this.global) {//全局定制为每一封信件设置相同的内容
                    for (let item of this.userList) {
                        console.log("item.isInvite", item.isInvite);
                        if (item.isInvite) {//该信件的邀请是勾选上的
                            item.duplicate = deepCopyObject(this.duplicate);
                            item.emailConfig = deepCopyObject(this.emailConfig);
                        }
                    }
                } else {
                    this.userList[this.selectedUserIndex].duplicate = deepCopyObject(this.duplicate);
                    this.userList[this.selectedUserIndex].emailConfig = deepCopyObject(this.emailConfig);
                }
                this.customizeVisible = false;
            },

            /**已选择对象对话框：发送全部信件*/
            sendAllEmail() {
                this.sendAllEmailLoading = true;
                let data = {
                    receiver: this.receiver,
                    templateId: this.templateId,
                    userList: this.userList,
                };
                httpPost("/v1/authorization/review/admincurrentemail/insert", data).then(results => {
                    const {httpCode, msg} = results.data;
                    if (httpCode === 200) {
                        successTips("邮件已经成功发送");
                    } else {
                        errTips(msg);
                    }
                    this.sendAllEmailLoading = false;
                });
            },

            /**定制信件对话框：关闭对话框*/
            closeCustomizeDialog() {
                MessageBox.confirm("直接关闭窗口，新修改的内容将不会保存？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {//点击确定后执行
                    this.customizeVisible = false;
                }).catch(() => {
                });//点击取消后执行，没有这个会报错 Uncaught (in promise) cancel
            },

            /**定制信件对话框：预览邮件内容*/
            previewEmail() {
                let data = {
                    adminMissionId: this.adminMissionId,
                    emailContent: this.emailConfig.content,
                    receiver: this.receiver,
                    userId: this.userId,
                };
                this.previewVisible = true;//预览信件框打开
                console.log("preview_data", data);
                httpPost("/v1/authorization/review/admincurrentemailpreview/get", data).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 200) {
                        this.emailPreviewContent = data.content;//信件主体内容(显示) ,
                    } else {
                        errTips(msg);
                    }
                });
            },
        }
    }
</script>

<style scoped>

</style>
