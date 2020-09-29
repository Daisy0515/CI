<!--功能：查看已选择的发送信件的对象列表，定制与发送信件，外加中止任务功能，
    调用页面：1.universalMail(评审管理员：评审管理/发送提醒邮件/通用邮件)，
              2.editorOpinionAndDecision(评审管理员：评审任务中的意见与决定，中止任务)
              3.customizeAndSendEmail(评审管理员：评审管理/发送提醒邮件/评审专家提醒or评审专家邀请未回复/评审专家搜索结果/定制与发送邮件)
-->
<template>
    <el-dialog title="已选择对象" :visible.sync="visible" width="80%" :close-on-click-modal="false" :before-close="closeSelectedUserDialog">
        <p class="Tips" >
            <i class="el-icon-info"></i>
            全局定制的编辑在保存后对所有邮件产生影响，如果需要对个别邮件再进一步的单独定制，
            可以在全局定制完成后，再通过个别信件的定制来进行个性化定制。
        </p>
        <el-table :data="userList" v-loading="userListLoading">
            <el-table-column property="name" label="发送对象"></el-table-column>
            <el-table-column property="title" label="评审标题" v-if="usedBy!=='editorOpinionAndDecision'"></el-table-column>
            <el-table-column property="status" label="评审状态" v-if="usedBy==='editorOpinionAndDecision'"></el-table-column>
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
            <el-table-column label="发送" v-if="usedBy!=='editorOpinionAndDecision'">
                <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.isSent"></el-checkbox>
                </template>
            </el-table-column>
        </el-table>
        <div style="text-align:center;margin: 15px auto;" >
            <el-button  @click="closeSelectedUserDialog">关闭</el-button>
            <el-button type="primary" style="margin-left:30px;" @click="customizeEmailGlobally">全局定制</el-button>
            <el-button type="primary" style="margin-left:30px;" v-if="usedBy!=='editorOpinionAndDecision'"
                       @click="sendAllEmail" :loading="sendAllEmailLoading">发送邮件
            </el-button>
            <template v-if="usedBy==='editorOpinionAndDecision'">
                <el-button type="primary" style="margin-left:30px;" @click="suspendAndSendEmail(1)">中止任务</el-button>
                <el-button type="primary" style="margin-left:30px;" @click="suspendAndSendEmail(2)">中止任务发送邮件</el-button>
            </template>
        </div>
        <el-dialog width="60%" title="定制信件" :visible.sync="customizeVisible" append-to-body :before-close="closeCustomizeDialog">
            <el-row style="margin-top: 15px;">
                <el-col :span="3"> 收件人：</el-col>
                <el-col :span="10" style="margin-top: -10px;">
                    <el-input v-model="emailInfo.receiverName" :readonly="true" size="medium"></el-input>
                </el-col>
            </el-row>
            <el-row style="margin-top: 15px;">
                <el-col :span="3"> 抄送：</el-col>
                <el-col :span="10">
                    <el-checkbox v-model="emailInfo.duplicate.isAdmin">管理员</el-checkbox>
                    <el-checkbox v-model="emailInfo.duplicate.isProjectUser">发布者</el-checkbox>
                </el-col>
            </el-row>
            <el-row style="margin-top: 15px;">
                <el-col :span="3"> 信件主题：</el-col>
                <el-col :span="10" style="margin-top: -5px;">
                    <el-input placeholder="请输入信件的主题" size="medium" v-model="emailInfo.emailConfig.theme"></el-input>
                </el-col>
            </el-row>
            <el-row style="margin-top: 15px;">
                <el-col :span="3"><span>信件主体：</span></el-col>
                <el-col :span="18">
                    <el-input type="textarea" :rows="15" v-model="emailInfo.emailConfig.content"></el-input>
                </el-col>
            </el-row>
            <div style="text-align:center;margin: 15px auto;">
                <el-button @click="closeCustomizeDialog">关闭</el-button>
                <el-button type="primary" style="margin-left:30px;" @click="saveEmailInfo">保存</el-button>
                <el-button type="primary" style="margin-left:30px;" @click="previewEmail">预览</el-button>
            </div>
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
    import {httpGet, httpPost,httpPut} from "@/utils/http.js";
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
            },
            usedBy:{//使用本组件的页面名称
                type:String
            }

        },
        data() {
            return {

                customizeVisible: false,//针对特定的任务进行定制框的显示
                sendAllEmailLoading: false,//发送邮件时，按钮的加载提示，防止重复提交

                /*点击定制，定制信件对话框，用到的属性*/
                selectedUserIndex: null,//定制的信件在已选择对象列表中的下标(index)
                openedEmailInfo:{},//点击定制后，存储该封信件相关的信息,例如userId:用户编号，adminMissionId:管理员任务编号
                globalCustomizeInfo:null,//存储全局定制的信息，第一次全局定制后，再次打开时，显示的信息
                emailPreviewContent: null,//信件主体预览
                previewVisible: false,//控制预览页面的显示
                global: false,//是否进行全局定制
                emailInfo:{                                 //用于存储每一封信显示的内容
                    receiverName: null,                     //收件人姓名
                    duplicate: this.getInitDuplicate(),     //邮件抄送的设置
                    emailConfig: this.getInitEmailConfig(), //信件需要定制的内容
                }
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
                this.globalCustomizeInfo = null;//清除已经保存的全局定制信息
                this.$emit("closeDialog");
            },
            /**定制信件对话框：关闭对话框*/
            closeCustomizeDialog() {
                MessageBox.confirm("直接关闭窗口，新修改的内容将不会保存？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {//点击确定后执行
                    this.customizeVisible = false;
                }).catch(() => {});//点击取消后执行，没有这个会报错 Uncaught (in promise) cancel
            },


            /**定制信件页面：获取信件模板的http方法*/
            httpMethodForGetEmailContentInfo(url,data){
                httpPost(url, data).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 200) {
                        this.emailInfo.emailConfig.theme = null;
                        this.emailInfo.emailConfig.content = data.content;
                    } else {
                        errTips(msg);
                    }
                });
            },
            /**universalMail页面调用，定制信件页面：获取信件模板等相关信息*/
            getEmailContentInfoForUniversalMail(row){
                this.emailInfo.duplicate = deepCopyObject(row.duplicate);//初始化抄送选项
                this.openedEmailInfo = deepCopyObject(row);//将当前打开的信件存储到openedEmailInfo，userId和adminMissionId在后续的查看预览里可以用到。
                if (row.emailConfig === null){//定制信件框没有保存过内容
                    let data = {
                        adminMissionId: row.adminMissionId,//管理员任务编号
                        receiver: parseInt(this.receiver),//接收对象 提交人、发布者、评审专家
                        userId: row.userId,
                        templateId:this.templateId,
                    };
                    console.log("data", data);
                    let url = "/v1/authorization/review/admincurrentemail/update";
                    this.httpMethodForGetEmailContentInfo(url,data);
                } else {     //定制信件保存过
                    this.emailInfo.emailConfig = deepCopyObject(row.emailConfig);
                }
            },
            /**CustomizeAndSendEmail页面调用，定制信件页面：获取信件模板等相关信息*/
            getEmailContentInfoForCustomizeAndSendEmail(row) {
                this.emailInfo.duplicate = deepCopyObject(row.duplicate);//初始化抄送选项
                this.openedEmailInfo = deepCopyObject(row);//将当前打开的信件存储到openedEmailInfo，在预览信件内容的时候需要用户的id,adminMissionId
                if (row.emailConfig === null) {      //定制信件框没有保存过内容
                    let idList = [];                //评审专家邀请编号ID集合
                    for(let item of this.userList){
                        idList.push(item.id);       //由于每一封信件返回来的信件都是一样的,所以取消了该专家是否被邀请的判断
                    }
                    let data = {
                        idList:idList,
                        templateId:this.templateId,
                    };
                    let url = "/v1/authorization/review/expertemail/update";
                    this.httpMethodForGetEmailContentInfo(url,data);
                } else {     //定制信件保存过
                    this.emailInfo.emailConfig = deepCopyObject(row.emailConfig);
                }
            },
            /**editorOpinionAndDecision页面调用，定制信件页面：获取信件模板等相关信息*/
            getEmailContentInfoForEditorOpinionAndDecision(row){
                this.emailInfo.duplicate = deepCopyObject(row.duplicate);//初始化抄送选项
                this.openedEmailInfo = deepCopyObject(row);//将当前打开的信件存储到openedEmailInfo，在预览信件内容的时候需要userId,adminMissionId
                if (row.emailConfig === null) {//定制信件框没有保存过内容
                    let data = {
                        adminMissionId: row.adminMissionId,//管理员任务编号
                        receiver: parseInt(this.receiver),//接收对象 提交人、发布者、评审专家
                        userId: row.userId,
                        templateId:this.templateId,
                    };
                    let url = "/v1/authorization/review/endmissionemailconfig/update";
                    this.httpMethodForGetEmailContentInfo(url,data);
                } else {     //定制信件保存过
                    this.emailInfo.emailConfig = deepCopyObject(row.emailConfig);
                }
            },
            /**定制信件页面：获取信件模板等相关信息*/
            getEmailContentInfo(row){
                if(this.usedBy==="universalMail"){
                    this.getEmailContentInfoForUniversalMail(row);
                }else if(this.usedBy==="customizeAndSendEmail"){
                    this.getEmailContentInfoForCustomizeAndSendEmail(row);
                }else if(this.usedBy==="editorOpinionAndDecision"){
                    this.getEmailContentInfoForEditorOpinionAndDecision(row);
                }
            },
            /**已选择对象对话框：全局定制的数据显示*/
            customizeEmailGlobally(){
                this.global = true;         //开启全局定制
                let index = 0;              //考虑到发送的邮件最少只有1封，故index取最小值
                let row = deepCopyObject(this.userList[index]); //第一次点开全局定制时，显示的内容为第一封信件后台返回的内容
                this.emailInfo.receiverName = row.name; //全局定制的时候，收件人姓名仅仅以第一个人的为例
                this.customizeVisible = true;
                if(this.globalCustomizeInfo===null){
                    row.emailConfig = null;     //全局定制的数据第一次要从后端返回，
                    this.getEmailContentInfo(row);
                }else{                          //已经全局定制过信件，就展示上一次的信息
                    this.openedEmailInfo = deepCopyObject(row);//将当前打开的信件存储到openedEmailInfo，在预览信件内容的时候需要userId,adminMissionId
                    this.emailInfo = deepCopyObject(this.globalCustomizeInfo);
                }

            },
            /**已选择对象对话框：点击列表中的定制的内容显示，row：需要定制信件的已有信息，index：表示该邮件在列表中的下标*/
            customizeEmail(row, index) {
                this.global = false;            //关闭全局定制
                this.selectedUserIndex = index; //预先赋值，在保存信件内容的时候需要这个属性
                this.emailInfo.receiverName = row.name;
                this.customizeVisible = true;
                this.getEmailContentInfo(row);
            },


            /**定制信件对话框：保存修改*/
            saveEmailInfo() {
                if (this.global) {//全局定制为每一封信件设置相同的内容
                    for (let item of this.userList) {
                        item.duplicate = deepCopyObject(this.emailInfo.duplicate);
                        item.emailConfig = deepCopyObject(this.emailInfo.emailConfig);
                    }
                    this.globalCustomizeInfo = deepCopyObject(this.emailInfo);//保存全局定制的结果
                } else {
                    this.userList[this.selectedUserIndex].duplicate = deepCopyObject(this.emailInfo.duplicate);
                    this.userList[this.selectedUserIndex].emailConfig = deepCopyObject(this.emailInfo.emailConfig);
                }
                this.customizeVisible = false;
            },


            /**发送信件用到的http方法*/
            httpMethodForSendEmail(url,data){
                httpPost(url, data).then(results => {
                    const {httpCode, msg} = results.data;
                    if (httpCode === 200) {
                        successTips("邮件已经成功发送");
                    } else {
                        errTips(msg);
                    }
                    this.sendAllEmailLoading = false;
                });
            },
            /**UniversalMail页面调用：已选择对象对话框：发送全部信件*/
            sendAllEmailForUniversalMail() {
                this.sendAllEmailLoading = true;
                let userList = this.userList;
                for(let item of userList){
                    item.isInvite = item.isSent;//后台接口中给的属性是isInvite
                }
                let data = {
                    receiver: this.receiver,
                    templateId: this.templateId,
                    userList: userList,
                };
                let url = "/v1/authorization/review/admincurrentemail/insert";
                this.httpMethodForSendEmail(url,data);
            },
            /**CustomizeAndSendEmail页面调用：已选择对象对话框：发送全部信件*/
            sendAllEmailForCustomizeAndSendEmail(){
                this.sendAllEmailLoading = true;
                let userList = this.userList;
                for(let item of userList){
                    item.isRemind = item.isSent; //后台接口中给的属性是isRemind,转换一下
                }
                let data = {
                    templateId: this.templateId,
                    previewList: userList,
                };
                console.log("customize data:",JSON.stringify(data));
                let url = "/v1/authorization/review/expertemailall/send";
                this.httpMethodForSendEmail(url,data);
            },
            /**已选择对象对话框：发送全部信件*/
            sendAllEmail(){
                if(this.usedBy==="universalMail"){
                    this.sendAllEmailForUniversalMail();
                }
                if(this.usedBy==="customizeAndSendEmail"){
                    this.sendAllEmailForCustomizeAndSendEmail();
                }

            },


            /**预览信件用到的http方法*/
            httpMethodForPreviewEmail(url, data){
                httpPost(url, data).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 200) {
                        this.emailPreviewContent = data.content;//信件主体内容(显示) ,
                    } else {
                        errTips(msg);
                    }
                });
            },
            /**universalMail页面调用，定制信件对话框：预览邮件内容*/
            previewEmailForUniversalMail(){
                let data = {
                    adminMissionId: this.openedEmailInfo.adminMissionId,
                    emailContent: this.emailInfo.emailConfig.content,
                    receiver: this.receiver,
                    userId: this.openedEmailInfo.userId,
                };
                this.previewVisible = true;//预览信件框打开
                console.log("preview_data", data);
                let url = "/v1/authorization/review/admincurrentemailpreview/get";
                this.httpMethodForPreviewEmail(url, data)
            },
            /**customizeAndSendEmail页面调用，定制信件对话框：预览邮件内容*/
            previewEmailForCustomizeAndSendEmail() {
                let idList = [];                        //评审专家邀请编号ID集合
                idList.push(this.openedEmailInfo.id);   //在预览的时候只要传递一个id就可以了，这块是后台设计的不是很好，应该传1个id就可以了
                let data = {
                    idList:idList,
                    content: this.emailInfo.emailConfig.content,
                    templateId:this.templateId,
                };
                console.log("customize data:",data);
                this.previewVisible = true;//预览信件框打开
                let url = "/v1/authorization/review/expertemailpreview/get";
                this.httpMethodForPreviewEmail(url, data)
            },
            /**editorOpinionAndDecision页面调用，定制信件对话框：预览邮件内容*/
            previewEmailForEditorOpinionAndDecision(){
                let data = {
                    adminMissionId: this.openedEmailInfo.adminMissionId,
                    emailContent: this.emailInfo.emailConfig.content,
                    userId: this.openedEmailInfo.userId,
                };
                this.previewVisible = true;//预览信件框打开
                console.log("preview_data", data);
                let url = "/v1/authorization/review/expertinviteemailconfig/get";
                this.httpMethodForPreviewEmail(url, data);
            },
            /**定制信件对话框：预览邮件内容*/
            previewEmail(){
                if(this.usedBy==="universalMail"){
                    this.previewEmailForUniversalMail();
                }
                if(this.usedBy==="customizeAndSendEmail"){
                    this.previewEmailForCustomizeAndSendEmail();
                }
                if(this.usedBy==="editorOpinionAndDecision"){
                    this.previewEmailForEditorOpinionAndDecision();
                }
            },


            /**中止任务用到的方法*/
            suspendAndSendEmail(type){
                let data = {
                    id:this.userList[0].adminMissionId,//管理员任务编号ID ,列表里的每一个
                    type:type,                         //操作类型 1中止任务不发送邮件2中止任务并发送邮件 (
                    userList:this.userList,            //用户信息对象
                };
                httpPut("/v1/authorization/review/adminmissionstaus/update",data).then(results=>{
                    const {httpCode, msg} = results.data;
                    if(httpCode===200){
                        successTips("中止任务成功！");
                    }else{
                        errTips(msg);
                    }
                    this.$emit("closeDialog",true); //true表明用户中止了任务，对于关闭对话框后页面的跳转有影响
                });
            },
        }
    }
</script>

<style lang="scss" scoped>
    .Tips {
        text-align: center;
        margin: 10px  auto;
        color: #909399a8;
    }
</style>
