<template>
    <div class="editor-container">
        <el-card>
            <el-row style="margin-bottom: 10px;"><h1 style="text-align: left">发送邮件</h1></el-row>
            <el-row>
                <h3>说明：系统已经内置了几种常见的模板，请跟据需要选择合适的模板，然后点击“定制信件”进行下一步信息的填充</h3>
            </el-row>
            <el-row style="margin-top: 10px;">
                <el-select v-model="templateId" placeholder="请选择模板" clearable>
                    <el-option
                            v-for="item in templateList"
                            :key="item.id"
                            :label="item.templateName"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-row>
            <el-row style="margin-top: 30px;">
                <el-button style="margin-left:-10%;" @click="goBack">返回</el-button>
                <el-button type="primary" style="margin-left:30px;" @click="ToCustomizeEmail">定制信件</el-button>
                <el-button type="primary" style="margin-left:30px;" @click="previewAndSendEmail">预览与发送</el-button>
            </el-row>
        </el-card>
        <el-dialog title="定制信件" :visible.sync="customizeEmailVisible" width="80%">
            <el-table :data="infoList" v-loading="infoListLoading">
                <el-table-column property="userName" label="评审专家" ></el-table-column>
                <el-table-column property="id" label="评审编号" ></el-table-column>
                <el-table-column property="title" label="评审标题" ></el-table-column>
                <el-table-column property="templateName" label="信件模板" ></el-table-column>
                <el-table-column property="title" label="操作" >
                    <template slot-scope="scope">
                        <el-button type="text" size="medium" @click="customizeEmail">定制</el-button>
                    </template>
                </el-table-column>
                <el-table-column  label="不发送" ></el-table-column>
            </el-table>
            <!-- 定制信件的对话框 -->
            <el-dialog
                    width="60%"
                    title="定制信件"
                    :visible.sync="innerVisible"
                    append-to-body>
                <el-row>
                    <el-col :span="6">
                        From:
                    </el-col>
                    <el-col :span="18">
                        <el-input placeholder="当前管理员的邮件"></el-input>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        信件主题
                    </el-col>
                    <el-col :span="18">
                        <el-input placeholder="信件的主题"></el-input>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <span>信件主体</span>
                    </el-col>
                    <el-col :span="18">
                        <el-input type="'text" rows="8"></el-input>
                    </el-col>
                </el-row>
                <el-row>
                    <el-button style="margin-left:-10%;" @click="goBack">关闭</el-button>
                    <el-button type="primary" style="margin-left:30px;" @click="previewEmail">预览</el-button>
                </el-row>
                <!-- 定制邮件框中预览信件的对话框-->
                <el-dialog
                        width="60%"
                        title="预览"
                        :visible.sync="previewVisible"
                        append-to-body>
                    <el-row>
                        <el-col :span="6">
                            <span>信件内容</span>
                        </el-col>
                        <el-col :span="18">
                            <el-input type="'text" rows="8" readonly="true"></el-input>
                        </el-col>
                    </el-row>
                </el-dialog>
            </el-dialog>
        </el-dialog>
    </div>
</template>

<script>
    import {errTips} from "@/utils/tips.js";
    import {httpGet,httpPost} from "@/utils/http";

    export default {
        props:{
            expertIdList:{
                type:String,
            }
        },
        data(){
            return {
                templateList:[],//下拉框中的评审模板列表
                templateId:null,//在模板下拉框中选择的模板Id
                idList:[],//评审专家邀请编号ID集合 ,
                customizeEmailVisible:false,//定制邮件对话框是否显示
                infoList:[],//被选中发邮件的专家信息列表
                infoListLoading:false,

                previewVisible:false,//定制邮件中的预览框显示
            }
        },
        created(){
            this.getEmailTemplate();
            this.idList = JSON.parse(this.expertIdList);
        },
        methods: {
            getEmailTemplate(){
                httpGet('/v1/authorization/review/emailtemplate/get').then(results=>{
                    const {httpCode, msg, data} = results.data;
                    if (httpCode == 200) {
                        this.templateList = data.templateList;
                    } else {
                        errTips(msg);
                    }
                })
            },

            goBack(){
                this.$router.go(-1);
            },
            ToCustomizeEmail(){//进入定制信件的对话框
                if(this.templateId===null||this.templateId===''){
                    // errTips("请先选择邮件模板！");
                    // return ;
                }
                this.customizeEmailVisible = true;
                this.infoListLoading = true;
                httpPost('/v1/authorization/review/getadmincurrentinfo/get',{idList:this.idList,templateId:this.templateId}).then(results=>{
                    const {httpCode, msg, data} = results.data;
                    if (httpCode == 200){
                        this.infoList = data.infoList;
                    } else {
                        errTips(msg);
                    }
                })
            },
            customizeEmail(){//在对框框里，对特定对象的信件进行定制。


            },
            previewAndSendEmail(){

            },
            /**定制邮件中的预览操作*/
            previewEmail(){

            },
            rowClass() {
                return "background:#F4F6F9;";
            }
        }
    }
</script>

<style lang="scss" scoped>
    .editor {
        &-container {
            text-align: center;
        }

        &-button {
            margin-top: 0px;
            margin-bottom: 10px;
            font-size: 15px;
        }

        .text {
            font-size: 14px;
        }

        .item {
            padding: 18px 0;
        }

    }
</style>
