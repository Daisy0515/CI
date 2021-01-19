<template>
    <div>
        <div style="padding-left: 10px;margin-buttom:30px;">
            <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 130%;">
                <el-breadcrumb-item :to="{ path: '/editorIndex' }">评审管理员</el-breadcrumb-item>
                <el-breadcrumb-item :to="{path:'/editorManager'}">评审管理</el-breadcrumb-item>
                <el-breadcrumb-item :to="{path:'/editorReminderEmail'}">发送提醒邮件</el-breadcrumb-item>
                <el-breadcrumb-item>邮件模板</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <h3 style="margin: 20px auto;font-weight: bolder;">已有邮件模板:</h3>
        <el-row>
            <el-button type="primary" size="medium" style="margin-top: 20px;" @click="addNewEmailTemplate"> 添加个人模板
            </el-button>
        </el-row>
        <el-dialog :visible.sync="dialogEmailVisible" width="70%" :before-close="handleEvaluateDialogClose">
            <div slot="title" class="dialog-title">
                <span v-if="isUpdate">修改邮件模板</span>
                <span v-else>添加新的邮件模板</span>
            </div>
            <el-row>
                <el-col :span="2">
                    <span>模板名称:</span>
                </el-col>
                <el-col :span="8">
                    <el-input placeholder="请输入模板名称" v-model="templateName" :readonly="isUpdate"></el-input>
                </el-col>
            </el-row>
            <el-row style="margin-top: 20px;">
                <el-col :offset="3">
                    <p style="font-size: medium;">说明：信件模板一般发送给评审任务中涉及的相关对象，为此，平台提供了与评审任务相关的转义字符:</p>
                </el-col>
            </el-row>
            <el-row>
                <el-col :offset="3">
                    <span style="font-size:16px;font-weight:bolder;margin-top: 10px;">
                        $[专家名],$[管理员名],$[评审任务标题],$[评审类型],$[提交人],$[发布者],$[平台地址]
                    </span>
                </el-col>
            </el-row>
            <el-row style="margin-top:10px;">
                <el-col :offset="3">
                    <span style="font-size: medium;">
                        您可以在信件的任意位置添加上述的转义字符，请保证转义字符的完整性，否则平台将无法识别！详见下面的例子！
                    </span>
                </el-col>
            </el-row>
            <el-row style="margin-top: 10px;">
                <el-col :span="2">
                    <span>信件主体:</span>
                </el-col>
                <el-col :span="18">
                    <el-input type="textarea" :rows="10" :placeholder="newEmailPlaceHolder"
                              v-model="content"></el-input>
                </el-col>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleEvaluateDialogClose">取 消</el-button>
                <el-button type="primary" v-if="isUpdate" @click="updateEmailTemplate">更 新</el-button>
                <el-button type="primary" v-else @click="insertNewEmailTemplate">提 交</el-button>
            </div>
        </el-dialog>
        <el-table :data="emailTemplateList" v-loading="loading" style="margin-top: 20px;margin-left:15%;width:70%;"
                  border>
            <el-table-column property="templateName" label="模板名称" align="center"></el-table-column>
            <el-table-column property="id" label="模板编号" align="center"></el-table-column>
            <el-table-column property="type" label="类型" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.type===1">系统内置</span>
                    <span v-else>个人</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="text" size="medium" @click="handleUpdateFormItem(scope.row)"><i
                            class="el-icon-edit"></i>修改
                    </el-button>
                    <el-button @click="handleDeleteFormItem(scope.row.id)" type="text" size="medium"
                               v-if="scope.row.type===2">
                        <i class="el-icon-delete"></i>删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="bid_footer">
            <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page.sync="pageData.pageNo"
                    :total="totalPage"
                    layout="prev, pager, next, jumper"
            ></el-pagination>
        </div>

    </div>
</template>

<script>
    import {errTips, successTips} from "@/utils/tips.js";
    import {httpGet, httpDelete, httpPost, httpPut} from "@/utils/http.js";
    import {MessageBox} from "element-ui";

    export default {
        name: "mailTemplates",
        data() {
            return {
                loading: false,
                dialogEmailVisible: false,//添加新的邮件模板框的显示控制
                templateName: null,//新的模板名称
                content: null,//新的模板的内容
                isUpdate: false,//是修改还是新增邮件模板
                updateId: null,//待更新邮件模板的id
                emailTemplateList: [],//已有邮件模板的列表
                pageData: {
                    pageNo: 1,
                    pageSize: 10,
                    orderBy: "id",
                    orderType: "DESC",
                },
                totalPage: 0,
                newEmailPlaceHolder: "尊敬的$[专家名]:\n" +
                    "    当前评审任务的标题为$[评审任务标题]，评审类型为$[评审类型]，\n" +
                    ".................\n" +
                    "欢迎你登录平台$[平台地址]查看。\n" +
                    "管理员：$[管理员名]\n",
            };
        },
        created: function () {
            this.getEmailTemplate();
        },
        methods: {
            getEmailTemplate(val = this.pageData) { //获取当前页面的评审信息
                this.loading = true;
                httpGet("/v1/authorization/review/adminemailtemplate/list", val).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode == 200) {
                        this.pageData.pageNo = data.pageNo;
                        this.totalPage = parseInt(data.totalPage + '0');
                        this.emailTemplateList = data.emailTemplateList;
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                    this.loading = false;
                });
            },
            /**点击添加个人模板*/
            addNewEmailTemplate() {
                this.dialogEmailVisible = true;
                this.templateName = null;
                this.content = null;
                this.isUpdate = false;
            },
            insertNewEmailTemplate() {
                if (this.templateName === null || this.templateName.trim() === '') {
                    errTips("请输入模板名称！");
                    return;
                }
                if (this.content === null || this.content.trim() === '') {
                    errTips("请输入信件主体内容！");
                    return;
                }
                httpPost("/v1/authorization/review/adminemailtemplate/insert", {
                    templateName: this.templateName,
                    content: this.content
                }).then(results => {
                    const {httpCode, msg} = results.data;
                    if (httpCode === 200) {
                        successTips("添加模板成功");
                    } else {
                        errTips(msg);
                    }
                    this.dialogEmailVisible = false;
                    this.getEmailTemplate();//重新加载邮件模板列表
                })

            },
            handleUpdateFormItem(row) {
                this.dialogEmailVisible = true;
                this.templateName = row.templateName;
                this.content = row.content;
                this.isUpdate = true;
                this.updateId = row.id;
            },
            /**修改模板时直接关掉会带来的提示，以及防止对弹框外的区域的误触*/
            handleEvaluateDialogClose() {
                MessageBox.confirm("关闭后，新修改的数据将不会保存，确定要关闭窗口么？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    this.dialogEmailVisible = false;
                });
            },
            updateEmailTemplate() {
                if (this.content === null || this.content.trim() === '') {
                    errTips("信件主体内容不能为空！");
                    return;
                }
                httpPut("/v1/authorization/review/adminemailtemplate/update", {
                    id: this.updateId,
                    content: this.content
                }).then(results => {
                    const {httpCode, msg} = results.data;
                    if (httpCode === 200) {
                        successTips("修改模板成功");
                    } else {
                        errTips(msg);
                    }
                    this.dialogEmailVisible = false;
                    this.getEmailTemplate();//重新加载邮件模板列表
                })
            },
            handleDeleteFormItem(id) {
                MessageBox.confirm("此操作将删除此邮件模板, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    httpDelete(
                        `/v1/authorization/review/adminemailtemplate/delete/${id}`
                    ).then(results => {
                        const {msg, httpCode} = results.data;
                        if (httpCode === 200) {
                            this.getEmailTemplate();
                            successTips('删除成功')
                        } else {
                            errTips(msg);
                        }
                    });
                })
            },

            handleCurrentChange(val) { //对应分页栏的换页操作
                this.pageData.pageNo = val;
                this.getEmailTemplate();
            },
        },

    }
</script>

<style scoped>
    .dialog-footer {
        margin-right: 45%;
        margin-top: 10px;
    }

    .bid_footer {
        margin-left: 35%;
        margin-top: 10px;
    }

    .dialog-title {
        font-size: large;
        font-weight: bolder;
    }
</style>
