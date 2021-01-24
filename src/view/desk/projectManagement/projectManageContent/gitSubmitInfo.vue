<template>
    <div v-loading="verifyGitBindLoading" element-loading-background="rgba(255, 255, 255, 1)">
        <!--绑定代码托管平台的阶段,未绑定git平台时显示-->
        <div v-if="!hasBind">
            <p class="Tips">
                <i class="el-icon-info"></i>平台提供了基于gitLab的代码托管(私有仓库模式)以及对第三方托管平台公开仓库的支持，例如：github,gitlab,gitee等。用户可以查看仓库的提交记录、pull
                requests等信息。代码的托管平台只能选择1个，选择后将不能修改。受限于网络限制，平台提供的gitlab以及gitee能提供较为友好的体验！
            </p>
            <el-row>
                <el-col :span="6" :offset="4">
                    <el-card style="width: 150px;height: 150px; margin: 10px auto;">
                        <img :src="gitlabInfo.logo" class="logoCSS">
                    </el-card>
                    <div style="text-align: center;">
                        <el-button type="primary" @click="bindCosineGitLab()"> 平台的gitLab</el-button>
                    </div>
                </el-col>
                <el-col :span="6" :offset="4">
                    <el-card style="width: 150px;height: 150px; margin: 10px auto;">
                        <img :src="giteeInfo.logo" class="logoCSS">
                    </el-card>
                    <div style="text-align: center;">
                        <a :href="giteeInfo.authUrl">
                            <el-button type="primary"> 连接gitee</el-button>
                        </a>
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6" :offset="4">
                    <el-card style="width: 150px;height: 150px; margin: 10px auto;">
                        <img :src="githubInfo.logo" class="logoCSS">
                    </el-card>
                    <div style="text-align: center;">
                        <a :href="githubInfo.authUrl">
                            <el-button type="primary" > 连接github</el-button>
                        </a>
                    </div>
                </el-col>
                <el-col :span="6" :offset="4">
                    <el-card style="width: 150px;height: 150px; margin: 10px auto;">
                        <img :src="gitlabInfo.logo" class="logoCSS">
                    </el-card>
                    <div style="text-align: center;">
                        <a :href="gitlabInfo.authUrl">
                            <el-button type="primary" > 连接gitlab</el-button>
                        </a>
                    </div>
                </el-col>
            </el-row>
        </div >
        <!--展示代码托管平台信息的阶段-->
        <div v-if="hasBind">
            <div>
                <el-card style="margin: -10px auto 20px auto;">
                    <h2>仓库名称：{{reposName}}</h2>
                    <h2>仓库地址：{{reposHttpUrl}}</h2>
                </el-card>
            </div>
            <el-tabs v-model="activeName" @tab-click="handleTabClick" :tab-position="tabPosition" >
                <el-tab-pane label="branches" name="branches" v-loading="branches.listLoading" element-loading-text="拼命加载中"
                             element-loading-background="rgba(255, 255, 255, 1)">
                    <div class="panelHold boxSize">
                        <div class="panel" >
                            <p class="tip" v-show="branches.list.length===0">暂无数据</p>
                            <ul class="services">
                                <li class="serviceItem clearfix" v-for="(item,index) in branches.currentList" :key="index">
                                    <div class="clearfix rhythmMargin">
                                          <el-card style="width:70%;margin-bottom: 10px;">
                                              <a :href="item.url" target="_blank">{{item.branches}}</a>
                                          </el-card>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="issues" name="issues" v-loading="issues.listLoading" element-loading-text="拼命加载中"
                             element-loading-background="rgba(255, 255, 255, 1)">
                    <div class="panelHold boxSize">
                        <div class="panel" >
                            <p class="tip" v-show="issues.list.length===0">暂无数据</p>
                            <ul class="services">
                                <li class="serviceItem clearfix" v-for="(item,index) in issues.currentList" :key="index">
                                    <div class="clearfix rhythmMargin">
                                        <el-card style="width:70%;margin-bottom: 10px;">
                                            <a :href="item.url" target="_blank">{{item.message}}</a>
                                            <el-row style="color: #8c939d">
                                                {{item.state}} -- {{item.date}}
                                            </el-row>
                                        </el-card>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="pull request" name="pulls" v-loading="pulls.listLoading" element-loading-text="拼命加载中"
                             element-loading-background="rgba(255, 255, 255, 1)">
                    <div class="panelHold boxSize">
                        <div class="panel">
                            <p class="tip" v-show="pulls.list.length===0" >暂无数据</p>
                            <ul class="services">
                                <li class="serviceItem clearfix" v-for="(item,index) in pulls.currentList" :key="index">
                                    <div class="clearfix rhythmMargin">
                                        <el-card style="width:70%;margin-bottom: 10px;">
                                            <a :href="item.url" target="_blank">{{item.message}}</a>
                                            <el-row style="color: #8c939d">
                                                {{item.state}} -- {{item.date}}
                                            </el-row>
                                        </el-card>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </el-tab-pane>

                <el-tab-pane label="commits" name="commits" v-loading="commits.listLoading" element-loading-text="拼命加载中"
                             element-loading-background="rgba(255, 255, 255, 1)">
                    <div class="panelHold boxSize">
                        <div class="panel" >
                            <p class="tip" v-show="commits.list.length===0">暂无数据</p>
                            <ul class="services">
                                <li class="serviceItem clearfix" v-for="(item,index) in commits.currentList" :key="index">
                                    <div class="clearfix rhythmMargin">
                                        <el-card style="width:70%;margin-bottom: 10px;">
                                            <a :href="item.url" target="_blank">
                                                {{item.message}}
                                            </a>
                                            <el-row style="color: #8c939d">
                                                {{item.name}} --- {{item.date}}
                                            </el-row>
                                        </el-card>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </el-tab-pane>
                <el-pagination style="margin-left: 20%;"
                               @current-change="handleCurrentChange"
                               :current-page.sync="currentGitInfo.pageNo"
                               :total="currentGitInfo.list.length"
                               layout="total, prev, pager, next, jumper"
                ></el-pagination>
            </el-tabs>
        </div>
    </div>
</template>

<script>
    import {errTips,successTips} from "@/utils/tips.js";
    import {httpGet,httpPost} from "@/utils/http";
    import {specificDate} from "@/utils/getDate";
    import {MessageBox} from 'element-ui';
    import {githubInfo,gitlabInfo,giteeInfo} from '@/common/oauth/oauthSetting'
    export default {
        name: "gitSubmitInfo",
        created(){
            this.getGitBindInfo();   //获取当前团队是否绑定git平台以及相关信息
        },
        watch:{
            hasBind:function (newVal) {
                if(newVal === true){    //当前团队已经绑定过了平台，接下来获取数据
                    this.getBranchesList(this.gitUserName,this.gitName,this.reposName,this.gitProjectId);
                    this.currentGitInfo = this.branches;
                }
            },
            activeName:function(newVal){       //newVal可能的取值: branches, issues, commits, pulls
                this.currentGitInfo = this[newVal];
            },
        },
        data() {
            return {
                /**通用变量**/
                projectId: sessionStorage.getItem("projectId"),
                teamId: sessionStorage.getItem("teamId"),
                hasBind: false,          //当前团队是否已经绑定了平台
                gitName: null,           //团队选择的git平台名称，目前有3种：gitlab,gitee,github
                gitUserName: null,       //用户(项目经理角色)第三方git平台的用户名
                reposName:null,          //团队绑定的仓库名称
                reposHttpUrl:null,       //团队绑定的仓库名称的http地址
                reposSshUrl:null,        //团队绑定的仓库名称的ssh地址
                gitProjectId:null,       //仓库的id(gitlab专用)
                gitUrl:null,             //当前仓库的地址
                verifyGitBindLoading:false, //加载用户平台绑定信息时查看的数据

                /**git平台绑定阶段用到的信息**/
                githubInfo:githubInfo, //官方github授权相关的信息
                gitlabInfo:gitlabInfo, //官方gitlab授权相关的信息
                giteeInfo:giteeInfo,   //官方gitee授权相关的信息

                oauthTypeMapping:{               //oauthType类型的映射
                    "gitlab":0,
                    "gitlabOfficial":1,
                    "github":2,
                    "gitee":3,
                },
                oauthNameList:["gitlab","gitlabOfficial","github","gitee"],

                /**----------------------------------git仓库信息展示模块------------------------------------**/
                activeName:"branches",            //git仓库信息当前展示的栏目(包括:issues, branches, commits, pull request)
                tabPosition:"left",               //git信息展示栏目的位置(包含: top, bottom, left, right)
                gitInfoList:[],
                gitInfoListLoading:false,         //git信息里加载的提示
                reposList:[],                     //用户的公共仓库列表
                branches:{
                    list:[],                        //仓库分支列表
                    currentList:[],                 //当前页的提交记录
                    pageNo:1,                       //当前页的页码
                    listLoading: false,             //当前页面列表的加载
                },
                issues:{
                    list:[],                        //仓库的issues列表
                    currentList:[],                 //当前页的提交记录
                    pageNo:1,                       //当前页的页码
                    listLoading: false,             //当前页面列表的加载
                },
                pulls:{                             //仓库的Pull request数据
                    list:[],                        //仓库分支列表
                    currentList:[],                 //当前页的提交记录
                    pageNo:1,                       //当前页的页码
                    listLoading: false,             //当前页面列表的加载
                },
                commits:{                           //仓库的commits数据
                    list:[],
                    currentList:[],
                    pageNo:1,
                    listLoading: false,             //当前页面列表的加载
                },
                currentGitInfo:{                    //存储当前页git信息显示的数据
                    list:[],
                    currentList:[],
                    pageNo:1,
                },
                pageSize:10,                      //git信息每页显示的数据数目
            }
        },
        methods: {

            /**获取用户是否已经绑定git平台**/
            getGitBindInfo(){
                this.verifyGitBindLoading = true;
                httpGet("/v1/authorization/manage/gitBindInfo/get",{projectId:this.projectId,teamId:this.teamId}).then(results=>{
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 200){
                        this.gitProjectId = data.gitProjectId;
                        this.reposName = data.repos;
                        this.reposHttpUrl = data.reposHttpUrl;
                        this.reposSshUrl = data.reposSshUrl;
                        this.gitUserName = data.gitUserName;
                        this.gitName = this.oauthNameList[parseInt(data.oauthType)];
                        this.hasBind = data.hasBind;
                    }else{
                        errTips(msg);
                    }
                    this.verifyGitBindLoading = false;
                });
            },

            /**绑定平台的gitlab平台**/
            bindCosineGitLab(){
                this.gitName = "gitlab";
                MessageBox.confirm("确认选择平台提供的gitlab么，确定后将无法修改？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    let param = {
                        gitUserName:this.gitUserName,
                        projectId:this.projectId,
                        teamId:this.teamId,
                        isThirdOauth:false,
                    };
                    httpGet("/v1/authorization/team/teamGitInfo/get",{teamId:this.teamId}).then(results=>{
                        const {httpCode, msg, data} = results.data;
                        if (httpCode === 200){
                            param.gitProjectId = data.gitProjectId;
                            param.reposHttpUrl = data.htmlUrl;
                            param.reposSshUrl = data.sshUrl;
                            param.reposName = data.reposName;
                            param.oauthType = 0;
                            param.isThirdOauth = false;
                            this.bindGit(param);//在获取完teamGitInfo后绑定git的信息
                        }else{
                            errTips(msg);
                        }
                    });
                }).catch(() => {
                });
            },

            /**绑定git平台**/
            bindGit(data){
                httpPost("/v1/authorization/manage/projectManageGitOauth/insert",data).then(results=>{
                    const {httpCode, msg} = results.data;
                    if (httpCode === 200){
                        successTips("绑定成功！");
                        this.getGitBindInfo(); //获取用户绑定的git信息
                    }else{
                        errTips(msg);
                    }
                });
            },

            /**-----------------------------------------展示git信息部分的函数-----------------------------------------**/

            /**处理git展示信息的切换**/
            handleTabClick(tab) {
                if(tab.label==="branches"&&this.branches.list.length===0){
                    this.getBranchesList(this.gitUserName,this.gitName,this.reposName,this.gitProjectId);
                }
                if(tab.label==="issues"&&this.issues.list.length===0){
                    this.getIssuesList(this.gitUserName,this.gitName,this.reposName,this.gitProjectId);
                }
                if(tab.label==="pull request"&&this.pulls.list.length===0){
                    this.getPullsList(this.gitUserName,this.gitName,this.reposName,this.gitProjectId);
                }
                if(tab.label==="commits"&&this.commits.list.length===0){
                    this.getCommitsList(this.gitUserName,this.gitName,this.reposName,this.gitProjectId);
                }
                this.handleCurrentChange(this[this.activeName].pageNo);//未加载新数据时，恢复原来数据访问的页数
            },

            /**获取git用户的公开仓库列表**/
            getReposList(gitUserName) {
                httpGet("/v1/authorization/" + this.gitName + "/repos/list", {userName: gitUserName}).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 200){
                        this.reposList = data.reposList; //单个仓库信息包含name,htmlUrl,url,sshUrl
                    } else {
                        errTips(msg);
                    }
                });
            },

            /**获取git公开仓库的issueList**/
            getIssuesList(userName, gitName, reposName, gitProjectId){
                let url = "/v1/authorization/"+ gitName +"/issues/list";
                let data = {userName:userName};
                if(gitName.indexOf("gitlab")>=0){
                    data.reposId = gitProjectId;
                }else{
                    data.repos = reposName;
                }
                this.issues.listLoading = true;
                httpGet(url,data).then(results=>{
                    const {httpCode, msg, data} = results.data;
                    if(httpCode === 200){
                        for(let item of data.issuesList){
                            item.date = specificDate(item.date);
                        }
                        this.issues.list  = data.issuesList ; //单个仓库信息包含date,id,message,state,url
                    } else {
                        errTips(msg);
                    }
                    this.issues.listLoading = false;
                    this.handleCurrentChange(1);
                });
            },

            /**获取git公开仓库的pullsList**/
            getPullsList(userName, gitName, reposName, gitProjectId){
                let url = "/v1/authorization/"+ gitName +"/pulls/list";
                let data = {userName:userName};
                if(gitName.indexOf("gitlab")>=0){
                    data.reposId = gitProjectId;
                }else{
                    data.repos = reposName;
                }
                this.pulls.listLoading = true;
                httpGet(url,data).then(results=>{
                    const {httpCode, msg, data} = results.data;
                    if(httpCode === 200){
                        for(let item of data.pullsList){
                            item.date = specificDate(item.date);
                        }
                        this.pulls.list = data.pullsList  ; //单个仓库信息包含date,message,state,url
                    } else {
                        errTips(msg);
                    }
                    this.pulls.listLoading = false;
                    this.handleCurrentChange(1);
                });
            },

            /**获取git公开仓库的branchesList**/
            getBranchesList(userName, gitName, reposName, gitProjectId){
                let url = "/v1/authorization/"+ gitName +"/branches/list";
                let data = {userName:userName};
                if(gitName.indexOf("gitlab")>=0){
                    data.reposId = gitProjectId;
                }else{
                    data.repos = reposName;
                }
                this.branches.listLoading = true;
                httpGet(url,data).then(results=>{
                    const {httpCode, msg, data} = results.data;
                    if(httpCode === 200){
                        this.branches.list = data.branchesList  ; //单个仓库信息包含branches(分支名称),url
                    } else {
                        errTips(msg);
                    }
                    this.branches.listLoading = false;
                    this.handleCurrentChange(1);
                });
            },

            /**获取git公开仓库的提交记录**/
            getCommitsList(userName, gitName, reposName, gitProjectId){
                let url = "/v1/authorization/"+ gitName +"/commits/list";
                let data = {};
                if(gitName.indexOf("gitlab")>=0){
                    data.reposId = gitProjectId;
                }else{
                    data.userName = userName;
                    data.repos = reposName;
                }
                this.commits.listLoading = true;
                httpGet(url,data).then(results=>{
                    const {httpCode, msg, data} = results.data;
                    if(httpCode === 200){
                        for(let item of data.commitsList){
                            item.date = specificDate(item.date);
                        }
                        this.commits.list = data.commitsList   ; //单个仓库信息包含branches(分支名称),url
                    } else {
                        errTips(msg);
                    }
                    this.commits.listLoading = false;
                    this.handleCurrentChange(1);
                });
            },

            /**处理git信息的分页请求**/
            handleCurrentChange(newPageNo){ //activeName 表示 branches, issues, pulls, commits
                //此处是后端无法做分页的功能，所以前端做了
                this[this.activeName].pageNo = newPageNo;
                this[this.activeName].currentList = this[this.activeName].list.slice((newPageNo-1)*this.pageSize,newPageNo*this.pageSize);
            },
        }
    }
</script>

<style lang="scss"  scoped>
    @import "@/assets/scss/square.scss";
    .tip{
        margin-top: 10%;
        margin-left:20%;
        width:100px;
        height:100px;
        size: 32px;
    }
    .Tips {
        text-align: center;
        margin: 0px auto;
        color: #909399a8;
    }

    .logoCSS {
        width: 100px;
        height: 100px;
        margin-right: 30px;
    }
</style>
