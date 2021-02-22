<template>
    <div class="editorialTeam">
        <div class="Crumbs">
            <div class="container deskHeader">
                <h4>
                    您的位置：
                    <router-link to="myBid">我的投标</router-link>
                    >
                    <span class="active">编辑团队</span>
                </h4>
            </div>
        </div>
        <div class="container deskHeader">
            <div class="header_ele">
                <el-input v-model="userNamePhoneEmail" placeholder="请输入用户名、手机号或邮箱"></el-input>
                <el-button @click="search" type="primary">搜索人员</el-button>

                <el-select id="field" v-model="typeId" clearable placeholder="请选择推荐领域" ref="ad"
                           style="margin-left: 200px;">
                    <el-option
                            :value="item.id"
                            v-for="(item,index) in types"
                            :key="index"
                            :label="item.type"
                    ></el-option>
                </el-select>
                <el-button @click="getTypeUsers" type="primary">推荐用户</el-button>
            </div>
            <div class="editorialTeam_main">
                <div class="main_item clearfix" v-if="addList.userId||typeList.length!==0">
                    <h4 class="userList">搜索列表</h4>

                    <el-card style="float:left" class="item clearfix" v-if="search_flag">
                        <router-link
                                :to="{path:'personalProfile', query:{userId:userId,projectId:projectId,id:addList.userId}}"
                        >
                            <img :src="addList.headurl?addList.headurl:getnoImg"/>
                        </router-link>
                        <div class="item_title">
                            <span>{{addList.name}}</span>
                            <span @click="invite(addList.userId)">
                <i class="el-icon-circle-plus"></i>邀请
              </span>
                            <span @click="cancelInvitation(addList.userId)" v-if="addList.status===1">
                <i class="el-icon-remove"></i>取消邀请
              </span>
                        </div>
                    </el-card>
                    <el-card style="float:left" class="item clearfix" v-for="(user,index) in typeList" :key="index">
                        <router-link
                                :to="{path:'personalProfile', query:{userId:userId,projectId:projectId,id:user.userId}}"
                        >
                            <img :src="user.headurl?user.headurl:getnoImg"/>
                        </router-link>
                        <div class="item_title">
                            <span>{{user.userName}}</span>
                            <span @click="invite(user.userId)" v-if="user.status===0">
                <i class="el-icon-circle-plus"></i>邀请
              </span>

                            <span @click="cancelInvitation(user.userId)" v-if="user.status===1">
                <i class="el-icon-remove"></i>取消邀请
              </span>
                        </div>
                    </el-card>


                </div>
                <div class="main_item">
                    <h4 class="userList">{{userList.competeTeamList.length>0?'成员列表':'暂无成员'}}</h4>
                    <el-card
                            style="float:left"
                            class="item clearfix"
                            v-for="(item, index) in userList.competeTeamList"
                            :key="index"
                    >
                        <router-link
                                :to="{path:'personalProfile', query:{userId:userId,projectId:projectId,id:item.userId}}"
                        >
                            <img :src="item.headurl?item.headurl:getnoImg"/>
                        </router-link>
                        <div class="item_title">
                            <span>{{item.name}}</span>
                            <span @click="deleteUser(item.userId,index)">
                <i class="el-icon-error"></i>删除
              </span>
                        </div>
                    </el-card>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {httpGet, httpPost, httpDelete} from "@/utils/http.js";
    import {mapGetters, mapMutations} from "vuex";
    import {successTips, errTips} from "@/utils/tips.js";
    import {MessageBox} from "element-ui";

    export default {
        components: {},
        data() {
            return {
                search_flag: false,
                types: [],
                typeId: "",
                typeList: [],
                userNamePhoneEmail: "",
                addList: {},
                userList: {
                    competeTeamList: [],
                    typeList: []
                }
            };
        },
        computed: {
            ...mapGetters(["getnoImg"])
        },
        created: function () {
            this.projectId = this.$route.query.projectId;
            this.userId = this.$route.query.userId;
            if (!this.projectId && !this.userId) {
                this.$router.push({path: "myBid"});
                return false;
            }
            this.getView();
        },
        methods: {
            ...mapMutations(["setCache"]),
            //添加用户
            addUser(id) {
                MessageBox.confirm("是否确定将此用户加入至团队？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        let {teamId, competeTeamList} = this.userList;
                        httpPost("/v1/authorization/bids/teamuser/insert", {
                            projectId: this.projectId,
                            userId: id,
                            teamId: teamId
                        }).then(results => {
                            const {httpCode, msg} = results.data;
                            if (httpCode === 200) {
                                successTips("添加成员成功");
                                // this.getView();
                                competeTeamList.push(this.addList);
                            } else if (httpCode !== 401) {
                                errTips(msg);
                            }
                        });
                    })
                    .catch(() => {
                    });
            },

            invite(id) {
                MessageBox.confirm("是否邀请此用户加入至团队？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        let {teamId} = this.userList;
                        httpGet("/v1/authorization/bids/invite/teamuser", {
                            userId: id,
                            teamId: teamId
                        }).then(results => {
                            const {httpCode, msg} = results.data;
                            if (httpCode === 200) {
                                successTips("成功发送邀请！");
                                //邀请后刷新页面
                                if (this.userNamePhoneEmail !== "") {
                                    this.search();
                                }
                                if (this.typeList != "") {
                                    this.getTypeUsers();
                                }
                            } else if (httpCode !== 401) {
                                errTips(msg);
                            }
                        });
                    })
                    .catch(() => {
                    });
            },
            cancelInvitation(id) {
                MessageBox.confirm("是否取消邀请此用户加入至团队？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        let {teamId} = this.userList;
                        httpGet("/v1/authorization/bids/cancel/user", {
                            userId: id,
                            teamId: teamId
                        }).then(results => {
                            const {httpCode, msg} = results.data;
                            if (httpCode === 200) {
                                successTips("成功取消邀请！");
                                //取消邀请后刷新页面
                                if (this.userNamePhoneEmail !== "") {
                                    this.search();
                                }
                                if (this.typeList != "") {
                                    this.getTypeUsers();
                                }
                            } else if (httpCode !== 401) {
                                errTips(msg);
                            }
                        });
                    })
                    .catch(() => {
                    });
            },
            //查询用户
            search() {
                //查找某个用户前将推荐用户下拉框清空
                this.typeId = "";
                //查询某个用户，设置显示单个用户id-card
                this.search_flag = true;
                //将领域用户列表清空
                this.typeList = [];
                let {teamId} = this.userList;
                httpGet("/v1/authorization/bids/select/user", {
                    userNamePhoneEmail: this.userNamePhoneEmail,
                    teamId: teamId
                }).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 200) {
                        this.addList = data;
                        this.addList.headurl === null && (this.addList.headurl = "");
                    } else if (msg === "查询不到此人") {
                        errTips("查询不到此人");
                        this.addList = {};
                    } else if (httpCode !== 401) {
                        this.addList = {};
                        errTips(msg);
                    } else {
                        this.addList = {};
                    }
                });
            },
            //获取某领域下的推荐用户
            getTypeUsers() {
                //推荐某领域用户前将查找用户输入框清空
                this.userNamePhoneEmail = "";
                //设置不显示单个用户id-card
                this.search_flag = false;
                //将单个搜索用户清空
                this.addList = "";
                let {teamId} = this.userList;
                httpGet("/v1/authorization/bids/select/type", {
                    id: this.typeId,
                    teamId: teamId
                }).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 200) {
                        this.typeList = data.typeList;
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                });
            },
            //获取页面数据
            getView() {
                httpGet("/v1/authorization/bids/select/teamuser", {
                    projectId: this.projectId,
                    userId: this.userId
                }).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 200) {
                        this.userList = data;
                        // 筛选得到父类别
                        this.types = this.userList.typeList.filter(function (item) {
                            if (item.parentId === 0)
                                return item;
                        })
                    } else if (httpCode === 400) {
                        this.setCache("myBid");
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                });
            },
            //删除用户
            deleteUser(userId, index) {
                MessageBox.confirm("是否确定将此成员从团队里删除？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        httpDelete(
                            `/v1/authorization/bids/TeamMember/delete/${userId}/${this.projectId}`
                        ).then(results => {
                            const {httpCode, msg} = results.data;
                            if (httpCode === 200) {
                                let {competeTeamList} = this.userList;
                                competeTeamList.splice(index, 1);
                                successTips("删除成员成功");
                            } else if (httpCode !== 401) {
                                errTips(msg);
                            }
                        });
                    })
            }
        }

    };
</script>
<style lang='scss'>
    .editorialTeam {
        .el-card__body {
            padding: 0;

        }

        .main_item {
            margin: 30px 0 30px 0;
        }

        .header_ele {
            margin-top: 15px;
        }

        .userList {
            border-bottom: 1px solid #e8e8e8;
            margin-bottom: 15px;
            padding-bottom: 5px;
        }

        .item {
            position: relative;
            width: 200px;
            // float: left;
            margin-right: 30px;

            img {
                width: 100%;
                height: 200px;
            }

            .addUser {
                position: absolute;
                right: -95px;
                bottom: 3px;
                color: #4c83c3;
                cursor: pointer;

                span {
                    font-weight: 800;
                    font-size: 22px;
                }
            }

            .item_title {
                padding: 5px 0px 10px 0px;
                width: 100%;

                i {
                    margin-right: 3px;
                }

                // .el-icon-circle-plus {
                //   margin-right: 0;
                // }
                // .el-icon-remove {
                //   margin-right: 0;
                // }
                // .el-icon-error {
                //   margin-right: 3px;
                // }
                span {
                    font-size: 13px;
                    cursor: pointer;
                }

                span:nth-child(1) {
                    float: left;
                    margin: 5px 0 5px 7px;
                }

                span:nth-child(2) {
                    margin: 5px 6px 5px 0;
                    float: right;
                }

                span:nth-child(3) {
                    margin: 5px 2px 5px 0;
                    float: right;
                }
            }
        }

        .el-input__inner {
            height: 30px;
            width: 300px;
        }

        .el-input {
            width: 300px;
        }

        button {
            line-height: 10px;
            font-size: 13px;
            margin-left: 20px;
        }
    }
</style>

