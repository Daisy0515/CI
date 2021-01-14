<template>
    <div v-loading="verifyGitBindLoading" element-loading-background="rgba(255, 255, 255, 1)">
        <!--绑定代码托管平台的阶段,未绑定git平台时显示-->
        <div v-if="!hasBind">
            <p class="Tips">
                <i class="el-icon-info"></i>平台提供了基于gitLab的代码托管(私有仓库模式)以及对第三方托管平台公开仓库的支持，例如：github,gitlab,gitee等。用户可以查看仓库的提交记录、pull
                requests等信息。代码的托管平台只能选择1个，选择后将不能修改。
            </p>
            <el-row>
                <el-col :span="6" :offset="4">
                    <el-card style="width: 150px;height: 150px; margin: 10px auto;">
                        <img :src="gitLabLogo" class="logoCSS">
                    </el-card>
                    <div style="text-align: center;">
                        <el-button type="primary" @click="bindCosineGitLab()"> 平台的gitLab</el-button>
                    </div>
                </el-col>
                <el-col :span="6" :offset="4">
                    <el-card style="width: 150px;height: 150px; margin: 10px auto;">
                        <img :src="gitLabLogo" class="logoCSS">
                    </el-card>
                    <div style="text-align: center;">
                        <el-button type="primary" @click="chooseThirdPartyGit('gitlabOfficial')"> 连接gitLab(官方)</el-button>
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6" :offset="4">
                    <el-card style="width: 150px;height: 150px; margin: 10px auto;">
                        <img :src="githubInfo.githubLogo" class="logoCSS">
                    </el-card>
                    <div style="text-align: center;">
                        <a :href="'https://github.com/login/oauth/authorize?client_id=' +githubInfo.clientId+ '&redirect_uri='+githubInfo.redirectUrl">
                            <el-button type="primary" > 连接github</el-button>
                        </a>
<!--                        <el-button type="primary" @click="chooseThirdPartyGit('github')"> 连接github</el-button>-->
                    </div>
                </el-col>
                <el-col :span="6" :offset="4">
                    <el-card style="width: 150px;height: 150px; margin: 10px auto;">
                        <img :src="giteeLogo" class="logoCSS">
                    </el-card>
                    <div style="text-align: center;">
                        <el-button type="primary" @click="chooseThirdPartyGit('gitee')"> 连接gitee</el-button>
                    </div>
                </el-col>
            </el-row>
            <!-- 绑定平台的对话框 -->
            <el-dialog :visible.sync="showBindGitDialog">
                <el-row>
                    <h3>已选择：{{gitName}}平台</h3>
                </el-row>
                <el-row style="margin-bottom: 10px;">
                    <el-col :span="5" :offset="2">
                        <el-input v-model="gitUserName" placeholder="请输入用户名">
                        </el-input>
                    </el-col>
                    <el-col :span="2" :offset="1" v-if="!showVerifyResult">
                        <el-button type="primary" size="small" @click="verifyGitUser(gitUserName)"
                                   :loading="existUserLoading">验证
                        </el-button>
                    </el-col>
                    <el-col :span="2" :offset="1">
                        <i class="el-icon-success" v-if="showVerifyResult"
                           style="color: #5daf34;margin-top: 10%;margin-left: 20%;">
                        </i>
                    </el-col>
                </el-row>
                <el-row v-if="showReposList">
                    <el-col :span="6" :offset="2">
                        <el-select v-model="reposIndex" placeholder="请选择仓库" style="width:83%;"
                                   :loading="reposLoading">
                            <el-option
                                v-for="(item,index) in reposList"
                                    :key="index"
                                    :label="item.name"
                                    :value="index">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="5">
                        <el-button type="primary" size="small" @click="beforeBindThirdGit"
                                   :loading="bindGitLoading">绑定
                        </el-button>
                    </el-col>
                </el-row>
            </el-dialog>
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
                <el-tab-pane label="branches" name="branches" v-loading="gitInfoListLoading" element-loading-text="拼命加载中"
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
                <el-tab-pane label="issues" name="issues" v-loading="gitInfoListLoading" element-loading-text="拼命加载中"
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
                <el-tab-pane label="pull request" name="pulls" v-loading="gitInfoListLoading" element-loading-text="拼命加载中"
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

                <el-tab-pane label="commits" name="commits" v-loading="gitInfoListLoading" element-loading-text="拼命加载中"
                             element-loading-background="rgba(255, 255, 255, 1)">
                    <el-row>
                        <el-col :span="4" style="font-size: 20px;margin-top:5px;">
                            <span >请选择分支：</span>
                        </el-col>
                        <el-col :span="6" style="margin-bottom: 10px;">
                            <el-select v-model="commits.selectedBranch" placeholder="请选择分支" style="width:83%;" @change="getNewBranchCommits">
                                <el-option
                                        v-for="(item,index) in branches.list"
                                        :key="index"
                                        :label="item.branches"
                                        :value="item.branches">
                                </el-option>
                            </el-select>
                        </el-col>
                    </el-row>
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

                /**git平台绑定阶段用到的信息**/
                gitLabLogo: require("@/assets/img/git/gitLab.jpg"),

                giteeLogo: require("@/assets/img/git/gitee.png"),

                githubInfo:{ //github授权相关的信息
                    githubLogo: require("@/assets/img/git/github.jpg"),
                    clientId:"3aec007a081933c8a3ad",
                    clientSecret:"aa01e4f4fac25aee9439d50293b11305dbfb7b09",
                    redirectUrl:"http://localhost:8080/oauth/github/redirect",
                },
                verifyGitBindLoading:false,      //查询团队git绑定信息时，加载提示信息
                showBindGitProcess: true,        //显示绑定git平台过程的部分，用户没有绑定git平台时使用
                showBindGitDialog: false,        //显示用户输入平台名称与仓库名的界面

                reposIndex:null,                 //用户选择的仓库在仓库列表中的下标
                existUserLoading: false,         //验证用户是否存在时加载
                showReposList:false,             //连接git平台时，展示git仓库列表
                showVerifyResult:false,          //验证通过时，显示的图标结果
                reposLoading:false,              //公开仓库加载时的提示

                bindGitLoading:false,            //绑定git时的加载提示
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
                },
                issues:{
                    list:[],                        //仓库的issues列表
                    currentList:[],                 //当前页的提交记录
                    pageNo:1,                       //当前页的页码
                },
                pulls:{                             //仓库的Pull request数据
                    list:[],                        //仓库分支列表
                    currentList:[],                 //当前页的提交记录
                    pageNo:1,                       //当前页的页码
                },
                commits:{                           //仓库的commits数据
                    list:[],
                    currentList:[],
                    pageNo:1,
                    selectedBranch:null,            //用户选择的分支
                    branchesLoading:false           //commits页面获取用户分支时加载的提示
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

            /**选择第三方的git平台**/
            chooseThirdPartyGit(gitName) {
                this.showBindGitDialog = true;
                this.gitName = gitName;
                //对话框属性置空
                this.gitUserName = null;      //用户名
                this.showVerifyResult = false;//用户名验证结果
                this.showReposList = false;   //公开仓库显示
                this.reposList = [];          //仓库列表
                this.reposIndex = null;       //用户选择的仓库的下标
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
            /**准备绑定git的数据**/
            beforeBindThirdGit(){
                if(this.reposIndex===null){
                    errTips("请选择仓库!");
                    return;
                }
                let data = {
                    gitUserName:this.gitUserName,
                    projectId:this.projectId,
                    teamId:this.teamId,
                    isThirdOauth:true,
                    oauthType : this.oauthTypeMapping[this.gitName],
                };
                let reposInfo = this.reposList[this.reposIndex];
                if(this.gitName.indexOf("gitlab")>=0){      //团队选择的是gitlab平台
                    data.gitProjectId = reposInfo.id;
                }
                data.reposName = reposInfo.name;
                data.reposHttpUrl = reposInfo.htmlUrl;
                data.reposSshUrl = reposInfo.sshUrl;
                console.log("bind data:",data);
                this.bindGit(data);
            },
            /**绑定第三方的git平台**/
            bindGit(data){
                this.bindGitLoading = true;
                httpPost("/v1/authorization/manage/projectManageGitOauth/insert",data).then(results=>{
                    const {httpCode, msg} = results.data;
                    if (httpCode === 200){
                        successTips("绑定成功！");
                        this.getGitBindInfo(); //获取用户绑定的git信息
                    }else{
                        errTips(msg);
                    }
                    this.bindGitLoading = false;
                });
            },


            /**-----------------------------------------展示git信息部分的函数-----------------------------------------**/
            /**验证用户名是否存在**/
            verifyGitUser(gitUserName) {
                if(gitUserName === null || gitUserName.trim() === ""){
                    errTips("请输入用户名！");
                    return;
                }
                this.existUserLoading = true;       //加载验证的提示
                let url = "/v1/authorization/"+this.gitName+"/verify/get";
                httpGet(url, {userName: gitUserName}).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 200){
                        if (data.userName === null){
                            errTips("当前用户不存在，请重新输入！");
                        } else {
                            this.gitUserName = data.userName;
                            this.showVerifyResult = true;               //验证通过
                            this.showReposList = true;                  //显示仓库的列表
                            this.reposLoading = true;                   //仓库加载提示
                            this.getReposList(this.gitUserName);

                        }
                    } else {
                        errTips(msg);
                    }
                    this.existUserLoading = false;
                });
            },

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
                    if(this.branches.list.length===0){
                        this.getBranchesList(this.gitUserName,this.gitName,this.reposName,this.gitProjectId).then(()=>{
                            let branch = this.branches.list[0].branches;
                            this.commits.selectedBranch = branch;
                            this.getCommitsList(this.gitUserName,this.gitName,this.reposName,this.gitProjectId,branch);
                        });
                    }else{
                        let branch = this.branches.list[0].branches;
                        this.commits.selectedBranch = branch;
                        this.getCommitsList(this.gitUserName,this.gitName,this.reposName,this.gitProjectId,branch);
                    }

                }
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
                    this.reposLoading = false;
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
                this.gitInfoListLoading = true;
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
                    this.gitInfoListLoading = false;
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
                this.gitInfoListLoading = true;
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
                    this.gitInfoListLoading = false;
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
                this.gitInfoListLoading = true;
                httpGet(url,data).then(results=>{
                    const {httpCode, msg, data} = results.data;
                    if(httpCode === 200){
                        this.branches.list = data.branchesList  ; //单个仓库信息包含branches(分支名称),url
                    } else {
                        errTips(msg);
                    }
                    this.gitInfoListLoading = false;
                    this.handleCurrentChange(1);
                });
            },

            /**根据用户选择的仓库选择指定分支的提交记录**/
            getNewBranchCommits(){
                this.getCommitsList(this.gitUserName, this.gitName, this.reposName, this.gitProjectId, this.commits.selectedBranch);
            },
            /**获取git公开仓库的指定分支的提交记录**/
            getCommitsList(userName, gitName, reposName, gitProjectId, branch){
                let url = "/v1/authorization/"+ gitName +"/commitsbranches/list";
                let data = {};
                if(gitName.indexOf("gitlab")>=0){
                    data.reposId = gitProjectId;
                    data.refName = branch;
                }else{
                    data.userName = userName;
                    data.repos = reposName;
                    data.branch = branch;
                }
                this.gitInfoListLoading = true;
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
                    this.gitInfoListLoading = false;
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
