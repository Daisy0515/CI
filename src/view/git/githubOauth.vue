<template>
    <div>
        <h2 v-if="!showBindGitDialog">正在处理中，请稍等....</h2>
        <el-dialog :visible.sync="showBindGitDialog" :show-close="false" :close-on-click-modal="false">
            <el-row class="Tips">
                <i class="el-icon-info"></i>如果出现仓库列表一直处于加载中，请刷新当前页面
            </el-row>
            <el-row style="margin-bottom: 10px;">
                <h2>已选择：{{gitName}}平台</h2>
            </el-row>
            <el-row style="margin-bottom: 10px;">
                <el-col :span="3">
                    <h2 style="text-align: center;margin-top: 5px;">用户名：</h2>
                </el-col>
                <el-col :span="5" >
                    <el-input v-model="gitUserName" >
                    </el-input>
                </el-col>
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
    </div>
</template>

<script>
    import {httpGet, httpDelete, httpPost} from '@/utils/http.js';
    import {errTips, successTips} from '@/utils/tips.js';
    export default {
        name: "githubOauth",
        created(){
            this.getCallbackInfo();
        },
        data(){
            return{
                projectId:sessionStorage.getItem("projectId"),
                teamId:sessionStorage.getItem("teamId"),

                showBindGitDialog:false,            //显示绑定仓库的界面
                gitName:"github",
                gitUserName:null,                   //git用户名
                gitUserId:null,                     //git用户id
                reposList:[],                       //用户的公共仓库列表
                reposLoading:false,                 //加载仓库时的提示
                reposIndex:null,                    //用户选择的仓库在仓库列表中的下标
                bindGitLoading:false,               //绑定git时的加载提示

                oauthTypeMapping:{               //oauthType类型的映射
                    "gitlabOfficial":1,
                    "github":2,
                    "gitee":3,
                },
            };
        },
        methods:{
            getCallbackInfo(){
                let code = this.$route.query.code;
                if(code !== null){
                    let data = {
                        code:code,
                        oauthType:2,//1 官方的gitlab 2 github 3 gitee
                    };
                    httpPost('/v1/authorization/coreGitOauth/github/insert', data).then(results => {
                        const {msg, httpCode, data} = results.data;
                        if (httpCode === 200) {
                            this.showBindGitDialog = true;
                            this.gitUserName = data.gitUserName;
                            this.gitUserId = data.gitUserId;
                            this.getReposList(this.gitUserName);
                        } else {
                            errTips(msg);
                        }

                    });
                }else{
                    let error = this.$route.query.error;
                    if(error !== null){     //跳转到git提交信息页面
                        this.goToGitSubmitInfo();
                    }
                }
            },
            /**获取git用户的公开仓库列表**/
            getReposList(gitUserName) {
                this.reposLoading = true;
                httpGet("/v1/authorization/github/repos/list", {userName: gitUserName}).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 200){
                        this.reposList = data.reposList; //单个仓库信息包含name,htmlUrl,url,sshUrl
                    } else {
                        errTips(msg);
                    }
                    this.reposLoading = false;
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
                        this.goToGitSubmitInfo();
                    }else{
                        errTips(msg);
                    }
                    this.bindGitLoading = false;
                });
            },
            goToGitSubmitInfo(){
                //projectManage在created函数里需要teamId,来获取团队信息
                this.$router.push({name:"gitSubmitInfo",query:{teamId:this.teamId}});
            },
        }
    }
</script>

<style scoped>
    .Tips {
        text-align: center;
        margin-top: -30px;
        margin-bottom: 10px;
        color: #909399a8;
    }
</style>
