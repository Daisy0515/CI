<template>
    <div class="message">
        <div class="header">
            <div class="container deskHeader">
                <h3>
                    <router-link  :to="{name:'projectManageList'}">返回上一级</router-link>
                    <span style="margin-left:10%;">当前项目：{{projectName}}</span>
                    <span style="margin-left:10%;"> 团队名称：{{teamName}}</span>
                </h3>
            </div>
        </div>
        <div class="container deskHeader" style="height:100%">
            <div class="left-scroll">
                <div class="left_top">
                    <ul v-if="showDataLeftOne">
                        <li
                            @click="changeleft(item)"
                            :class="getleftIndex===item.url ? 'leftbq':''"
                            v-for="item in leftDataOne"
                            :key="item.index"
                        >{{item.name}}
                        </li>
                    </ul>
                    <ul v-if="!showDataLeftOne">
                        <li
                                @click="changeleft(item)"
                                :class="getleftIndex===item.url ? 'leftbq':''"
                                v-for="item in leftDataTwo"
                                :key="item.index"
                        >{{item.name}}
                        </li>
                    </ul>
                </div>
            </div>
            <div class="message_main clearfix">
                <router-view></router-view>
            </div>
        </div>
        <div style="clear:both"></div>
        <Footer/>
    </div>
</template>
<script>
    import {mapGetters, mapMutations} from "vuex";
    import {httpGet} from "../../../utils/http";
    import {errTips} from "../../../utils/tips";

    export default {
        name:"projectManageContent",
        data() {
            return {
                select: "项目进度",
                leftDataOne: [ //项目经理角色对应的左侧导航栏
                    {
                        name: "项目进度",
                        url: "projectProgress",
                    },
                    {
                        name: "任务管理",
                        url: "taskManage",
                    },
                    {
                        name: "项目文件",
                        url: "projectFile",
                    },
                    {
                        name: "项目成员",
                        url: "projectMembers",
                    },
                    {
                        name: "git提交信息",
                        url: "gitSubmitInfo",
                    },
                    {
                        name: "通知",
                        url: "notification",
                    },
                    {
                        name: "缺陷管理",
                        url: "defectManagement",
                    },


                ],
                leftDataTwo: [//项目开发者角色对应的左侧导航栏
                    {
                        name: "项目进度",
                        url: "projectProgress",
                    },

                ],
                projectName:"", //项目名称
                teamName:"",    //团队名称
                projectId:null, //项目编号
                teamId:null, //团队编号
                userId:null,
                showDataLeftOne:true,
            };
        },
        created: function () {
            this.setLeft(this.$router.currentRoute.name);
            this.showDataLeftOne = parseInt(sessionStorage.getItem('projectRole')) === 2; //true 项目经理角色 false 开发者角色
            this.teamId = this.$route.query.teamId;
            if(this.teamId === undefined){
                this.teamId = sessionStorage.getItem("teamId");
            }
            this.getTeamInfo(this.teamId);
        },
        computed: {
            ...mapGetters(["getuserData", "getleftIndex"])
        },
        methods: {
            ...mapMutations(["setLogin", "setLeft"]),
            changeleft(item) {
                this.setLeft(item.url);
                this.$router.push({name:item.url,query:{projectId:this.projectId,teamId:this.teamId}});
            },
            /**获取团队的信息**/
            getTeamInfo(teamId){
                httpGet("/v1/authorization/manage/manage/get",{teamId:teamId}).then(results=>{
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 200) {
                        this.projectId = data.projectId;
                        this.teamName = data.teamName;
                        this.projectName = data.projectName;
                        sessionStorage.setItem("teamId",this.teamId);
                        sessionStorage.setItem("projectId",this.projectId);
                        sessionStorage.setItem("teamName",this.teamName);
                        sessionStorage.setItem("projectName",this.projectName);
                    }else{
                        errTips(msg);
                    }

                });
            }
        }
    };
</script>
<style lang='scss'>
    html,
    body,
    #app,
    .desk,
    .message {
        height: 100%;
    }

    .message {
        .el-step__head.is-process {
            color: #4c83c3;
        }

        .el-step__title.is-process {
            color: #4c83c3;
        }

        .el-input__inner {
            height: 35px;
            background: rgb(251, 251, 251);
        }

        .left-scroll {
            text-align: center;
            width: 12%;
            float: left;
            height: 100%;
            border-right: 1px solid #d8d8d8;

            .left_top {
                margin-top: 40px;

                .el-upload {
                    width: 90px;
                    height: 90px;
                    display: block;
                }

                .avatar-uploader-icon {
                    width: 90px;
                    height: 90px;
                    display: block;
                    line-height: 90px;
                }

                p {
                    font-size: 14px;
                }

                & p:nth-child(3) {
                    color: #3e76b8;
                }

                .changeHead {
                    color: #4c83c3;
                    font-size: 13px;
                    cursor: pointer;
                    margin-top: 5px;
                }
            }

            ul {
                margin-top: 50px;
            }

            li {
                border-top: 1px solid #d8d8d8;
                margin-top: 15px;
                padding-top: 15px;
                color: #666;
                position: relative;
                cursor: pointer;

                &:hover::before {
                    content: "";
                    height: 51px;
                    top: 0;
                    left: 0;
                    position: absolute;
                    border-left: 5px solid #4c83c3;
                }
            }

            .leftbq::before {
                content: "";
                height: 51px;
                top: 0;
                left: 0;
                position: absolute;
                border-left: 5px solid #4c83c3;
            }
        }

        .message_main {
            box-sizing: border-box;
            border: 1px solid #d8d8d8;
            float: right;
            padding: 30px 40px 50px 30px;
            width: 85%;
            margin: 40px auto;

            &::before {
                content: "";
                display: table;
                clear: both;
            }

            h3 {
                margin-bottom: 40px;
            }
        }

        .avatar-uploader {
            display: inline-block;
        }

        .avatar-uploader .el-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }

        .avatar-uploader .el-upload:hover {
            border-color: #409eff;
        }

        .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            line-height: 178px;
            text-align: center;
        }

        .left_top {
            .avatar {
                width: 100%;
                height: 100%;
                display: block;
            }
        }

        .addWork {
            margin-bottom: 20px;

            span {
                margin-left: 30px;
            }

            i {
                float: right;
            }
        }
    }
</style>
