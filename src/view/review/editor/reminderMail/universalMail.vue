<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size: 130%;margin-bottom: 20px;">
            <el-breadcrumb-item :to="{ path: '/editorManager' }">评审管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/editorReminderEmail' }">发送提醒邮件</el-breadcrumb-item>
            <el-breadcrumb-item>通用邮件模块</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <h2 style="font-weight: bolder;">邮件发送设置</h2>
            </el-row>
            <el-row>
                <el-col style="margin-top: 5px;" :span="2" :offset="3">
                    <span style="font-weight: bolder;font-size: large;">收件方：</span>
                </el-col>
                <el-col :span="6">
                    <el-select v-model="receiver" placeholder="请选择发送对象" size="medium">
                        <el-option label="提交人" value="1"></el-option>
                        <el-option label="评审专家" value="2"></el-option>
                        <el-option label="发布者" value="3"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="6">
                    <el-select v-model="status" placeholder="请选择评审状态" size="medium" v-if="this.receiver==='2'">
                        <el-option label="全部状态" value="1"></el-option>
                        <el-option label="已完成" value="2"></el-option>
                        <el-option label="已撤回评审" value="3"></el-option>
                        <el-option label="评审中(已延期)" value="4"></el-option>
                        <el-option label="评审中" value="5"></el-option>
                        <el-option label="已撤回邀请" value="6"></el-option>
                        <el-option label="已邀请未回复" value="7"></el-option>
                        <el-option label="已拒绝" value="8"></el-option>
                        <el-option label="已中止" value="9"></el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row style="margin-top: 15px;">
                <el-col :offset="3" :span="13" style="margin-top: 5px;">
                    <span style="font-size:large;">您可以根据需要选择平台内置的模板或者用户自己内置的模板: </span>
                </el-col>
                <el-col :span="5">
                    <el-select v-model="templateId" placeholder="请选择模板" clearable>
                        <el-option
                                v-for="item in templateList"
                                :key="item.id"
                                :label="item.templateName"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
        </el-card>
        <div class="myTable">
            <div class="header_top">
                <el-input v-model="searchData.title" placeholder="评审标题"></el-input>
                <el-select v-model="searchData.type" placeholder="请选择评审类型">
                    <el-option v-for="index in typeList" :label="typeList[index]" :value="index"></el-option>
                </el-select>
                <el-input v-model="searchData.projectUserName" placeholder="发布者"></el-input>
                <el-input v-model="searchData.submitterName" placeholder="提交人"></el-input>
                <el-date-picker v-model="searchData.submitTimeStart" type="date" style="width: 150px;"placeholder="提交开始时间"
                                value-format="yyyy-MM-dd" :picker-options="startDatePicker"></el-date-picker>
                <span style="margin-right: 15px;">到</span>
                <el-date-picker v-model="searchData.submitTimeEnd" type="date" style="width: 150px;" placeholder="提交结束时间"
                                value-format="yyyy-MM-dd" :picker-options="endDatePicker"></el-date-picker>
                <el-button type="primary" @click="searchList">搜索</el-button>
            </div>
            <el-table v-loading="loading" :data="tableData" style="width:100%;margin:20px auto" :header-cell-style="rowClass">
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-checkbox v-model="scope.row.isChoose" @change="changeAdminMissionList(scope.row)"></el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="评审标题" align="center">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" :content="scope.row.title">
                            <span class="tablehidden">{{ scope.row.title  }}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="评审类型" align="center">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" :content="scope.row.type+''">
                            <span class="tablehidden">{{ scope.row.type  }}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="id" label="评审编号" align="center">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" :content="scope.row.id+''">
                            <span class="tablehidden">{{ scope.row.id  }}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="submitterName" label="提交人" align="center">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" :content="scope.row.submitterName" placement="top-start">
                            <span class="tablehidden">{{ scope.row.submitterName }}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="submitTime" label="提交时间" align="center"></el-table-column>
                <el-table-column prop="gmtModified" label="更新时间" align="center"></el-table-column>
                <el-table-column prop="status" label="状态" align="center">
                    <template slot-scope="scope">
                        <span v-show="scope.row.status==1">待处理</span>
                        <span v-show="scope.row.status==2">评审中</span>
                        <span v-show="scope.row.status==3">完成</span>
                        <span v-show="scope.row.status==4">中止</span>
                    </template>
                </el-table-column>
                <el-table-column prop="statusExplain" label="评审状态" align="center">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" :content="scope.row.statusExplain">
                            <span class="tablehidden" v-show="id==0">{{ scope.row.statusExplain }}</span>
                        </el-tooltip>
                        <el-button v-show="id!=0" @click="viewReviewDetail(scope.row.id)" type="text" size="medium">
                            查看详情
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="opinion" label="管理员意见" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.opinion===1">接受</span>
                        <span v-if="scope.row.opinion===2">需要修改</span>
                        <span v-if="scope.row.opinion===3">拒绝</span>
                        <span v-if="scope.row.opinion===4">没有意见 </span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="bid_footer">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="pageData.pageNo" :total="totalPage"
                           layout="prev, pager, next, jumper"></el-pagination>
        </div>
        <el-row style="margin-top: 10px;">
            <el-col :offset="10"><el-button type="primary" @click="next">下一步</el-button></el-col>
        </el-row>
        <el-dialog title="定制信件" :visible.sync="nextVisible" width="80%">
            <el-table :data="userList" v-loading="userListLoading">
                <el-table-column property="userName" label="发送对象" ></el-table-column>
                <el-table-column  label="信件模板" >
                    <el-select v-model="templateId" placeholder="请选择模板" disabled>
                        <el-option
                                v-for="item in templateList"
                                :key="item.id"
                                :label="item.templateName"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-table-column>
                <el-table-column property="title" label="操作" >
                    <template slot-scope="scope">
                        <el-button type="text" size="medium" @click="customizeEmail(scope.row)">定制</el-button>
                    </template>
                </el-table-column>
                <el-table-column  label="不发送" >
                    <template slot-scope="scope">
                        <el-checkbox v-model="scope.row.isChoose"></el-checkbox>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog
                    width="60%"
                    title="定制信件"
                    :visible.sync="customizeVisible"
                    append-to-body>
                <el-row style="margin-top: 15px;">
                    <el-col :span="3"> 收件人： </el-col>
                    <el-col :span="10"> <el-input v-model="receiverName"></el-input> </el-col>
                </el-row>
                <el-row style="margin-top: 15px;">
                    <el-col :span="3"> 信件主题： </el-col>
                    <el-col :span="10"> <el-input placeholder="请输入信件的主题"></el-input> </el-col>
                </el-row>
                <el-row style="margin-top: 15px;">
                    <el-col :span="3"> <span>信件主体：</span> </el-col>
                    <el-col :span="18"> <el-input type="textarea" :rows="15" v-model="content"></el-input> </el-col>
                </el-row>
                <el-row style="margin-top: 15px;">
                    <el-button style="margin-left:40%;" @click="customizeVisible=false">关闭</el-button>
                    <el-button type="primary" style="margin-left:30px;" @click="previewEmail">预览</el-button>
                </el-row>
                <!-- 定制邮件框中预览信件的对话框-->
                <el-dialog
                        width="60%"
                        title="预览"
                        :visible.sync="previewVisible"
                        append-to-body>
                    <el-row>
                        <el-col :span="3"> <span>信件内容</span> </el-col>
                        <el-col :span="18">
                            <el-input type="'textarea" rows="15" readonly="true" ></el-input>
                        </el-col>
                    </el-row>
                </el-dialog>
            </el-dialog>
        </el-dialog>
    </div>
</template>

<script>
    import timeLimit from "@/mixins/regular/timeLimitForReview.js";
    import {httpGet, httpPost} from "@/utils/http.js";
    import {message, successTips, errTips} from "@/utils/tips.js";
    import {specificDate} from '@/utils/getDate.js';

    export default {
        name: "universalMail",
        mixins: [timeLimit],
        data() {
            return {
                /*邮件设置与搜索*/
                templateList:[],//邮箱模板
                searchData: this.getInitialPageOrSearchData(),
                pageData: this.getInitialPageOrSearchData(),
                tableData: [],//搜索的结果
                loading: false,//搜索时加载
                typeList: [],//评审类型的集合

                /*下一步按钮要提交给后台的数据*/
                templateId:null,//选择的邮件模板的
                status:null,// 评审专家状态 1全部状态2已完成3已撤回评审4评审中（已延期）5评审中6已撤回邀请7已邀请未回复8已拒绝9已中止
                receiver:null,//收件方1提交人2评审专家3评审发布者 ,
                adminMissionList:[],//管理员任务编号ID集合 ,

                /*对话框显示的属性*/
                userList: [],//待发送邮件的用户信息
                userListLoading:false,//获取userList时的加载提示
                nextVisible:false,//下一步对应的谈话框是否显示
                customizeVisible:false,//针对特定的任务进行定制框的显示

                /*点击定制后用到的属性*/
                content:null,//模板信件主体
                emailList:[],//用户名邮箱信息集合 ,
                customizeUserList:[],//姓名集合
                adminMissionId:null,//管理员任务编号id ,
                receiverName:null,//收件人姓名
                previewVisible:false,//控制预览页面的显示

                options: [],
                dialogChooseVisible: false,
                id: "",
                dialogFormVisible: false, //控制表单对话框是否显示

                totalPage: 0,
                reviewDetail: {},//查看详情的对话框
                allReviewProcessList: {},//以评审的id为键，评审的processName为值存储所有评审流程的
            };
        },
        created() {
            this.getView();
            this.getTypeList();
            this.getEmailTemplate();
        },
        methods: {
            /**获取邮箱模板*/
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
            /**获取评审任务*/
            getView(val = this.pageData) {
                this.loading = true;
                httpGet("/v1/authorization/review/admin/search", val).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode == 200) {
                        this.pageNo = data.pageNo;
                        this.totalPage = parseInt(data.totalPage + '0');
                        let list = data.adminMissionList;
                        for (let i of list) {
                            i.gmtModified = specificDate(i.gmtModified);
                            i.submitTime = specificDate(i.submitTime);
                        }
                        Object.assign(this.pageData, val);
                        this.tableData = list // this.$set(this, 'tableData', list);
                    } else {
                        this.tableData = [];
                        errTips(msg);
                    }
                    this.loading = false;
                });
            },
            /**初始化PageData和SearchData*/
            getInitialPageOrSearchData() {
                return {
                    pageNo: 1,
                    pageSize: 10,
                    orderBy: "id",
                    orderType: "DESC",
                    type: null,
                    submitterName: null,
                    projectUserName: null,
                    submitTimeStart: null,
                    submitTimeEnd: null,
                    expertAccomplishCount: this.expertAccomplishCount,
                    status: this.status,
                    statusExplain: this.statusExplain,
                };
            },
            /**当前评审*/
            getTypeList() {
                httpGet("/v1/authorization/review/type/get").then(results => {
                    const { httpCode, msg, data } = results.data;
                    if (httpCode == 200) {
                        this.typeList = data.typeList;
                    } else {
                        this.typeList = [];
                        errTips(msg);
                    }
                });
            },
            /**查看第三方评审详情*/
            viewReviewDetail(val) {
                httpGet("/v1/authorization/review/expertinviterecord/list", {id: val}).then(results => {
                    const { httpCode, msg, data } = results.data;
                    if (httpCode == 200) {
                        this.opinion = data.opinion;
                        let userList = data.userList;
                        for (let i of userList) {
                            i.gmtCreate = specificDate(i.gmtCreate);
                        }
                        this.userList = userList;
                    } else {
                        this.typeList = [];
                        errTips(msg);
                    }
                });
                this.dialogChooseVisible = true;
            },
            /**搜索列表*/
            searchList() {
                this.getView(this.searchData);
            },
            /**改变管理员任务编号集合*/
            changeAdminMissionList(row){
                if(row.isChoose===true){
                    this.adminMissionList.push(row.id);
                }else{
                    let index = this.adminMissionList.indexOf(row.id);
                    this.adminMissionList.splice(index,1);
                }
            },
            /**是否允许点击下一步*/
            nextIsOk(){
                if(this.receiver===null){
                    errTips("请选择发送对象！");
                    return ;
                }
                if(this.receiver===2&&this.status===null){
                    errTips("请选择评审专家的评审状态！");
                    return ;
                }
                if(this.templateId===null){
                    errTips("请选择发送的模板！");
                    return ;
                }
                if(this.adminMissionList.length===0){
                    errTips("请选择相关的评审任务!");
                    return;
                }
            },
            /**点击下一步的操作*/
            next(){
                this.nextIsOk();
                this.userList = [];//清空之前的
                let data = {
                    adminMissionList: this.adminMissionList,
                    receiver:parseInt(this.receiver),
                    status:parseInt(this.status),
                    templateId:this.templateId,
                }
                this.nextVisible = true;
                this.userListLoading = true;
                console.log("data",data);
                httpPost("/v1/authorization/review/admincurrentemail/get",data).then(results=>{
                    const {httpCode,msg,data} = results.data;
                    if(httpCode===200){
                        this.userList = data.userList;
                    }else{
                        errTips(msg);
                    }
                    this.userListLoading = false;
                });

            },
            /**定制信件对话框中的定制操作*/
            customizeEmail(row){
                console.log("row",row);
                this.customizeVisible = true;
                let data = {
                    adminMissionId: row.id,
                    receiver:parseInt(row.receiver),
                    userId:row.userId,
                }
                httpPost("/v1/authorization/review/admincurrentemail/update",data).then(results=>{
                    const {httpCode,msg,data} = results.data;
                    if(httpCode===200){
                        this.receiverName = data.userList[0];//在通用邮件的定制框中，一次只有一个收件人，在评审任务中点击的“发送邮件”可能是多个
                        this.customizeUserList = data.userList;
                        this.content = data.content;
                        this.emailList = data.emailList;
                        this.adminMissionId = data.adminMissionId;

                        console.log("this.receiver",this.receiver,"data.receiver",data.receiver);
                        console.log("this.status",this.status,"data.status",data.status);
                        console.log("data.userList",data.userList);
                        console.log("this.emailList",this.emailList);
                    }else{
                        errTips(msg);
                    }
                });
            },
            /**预览邮件内容*/
            previewEmail(){

            },
            handleCurrentChange(val) {
                this.pageData.pageNo = val;
                this.getView();
            },
            rowClass() {
                return "background:#F4F6F9;";
            }
        }
    }
</script>

<style lang="scss">
    @import "@/assets/scss/myTable.scss";
    .bid_footer{
        margin-left: 35%;
    }
</style>
