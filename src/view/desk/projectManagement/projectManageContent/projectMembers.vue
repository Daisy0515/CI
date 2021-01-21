<template>
    <div class="editorialTeam">
        <div class="Crumbs" v-if="manager_role">
            <div class="header_two0">
<!--                <nav class="c-header c-header&#45;&#45;solid0">-->
                    <div class="o-container deskHeader clearfix">
                        <ul class="c-header__navigation clearfix">
                            <li @click="selected = item.value" class="c-header__navigation__item" v-for="item in items" :key="item.title">

                                <router-link :class="selected === item.value ? 'header_active' : ''" to>
                                    {{ item.title }}
                                </router-link>
                            </li>
                        </ul>
                    </div>
<!--                </nav>-->
            </div>
        </div>
<!--        成员管理模块-->
        <div class="container deskHeader" v-show="selected === 1">
            <div class="header_ele" v-if="manager_role">
                <el-input v-model="userNamePhoneEmail" placeholder="请输入用户名、手机号或邮箱"></el-input>
                <el-button @click="search" type="primary">搜索人员</el-button>

                <el-select id="field" v-model="typeId" clearable placeholder="请选择推荐领域" ref="ad"
                           style="margin-left: 50px;">
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
                <div class="main_item clearfix" v-if="(addList.userId||typeList.length!==0) && manager_role">
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
                            <span @click="invite(user.userId)">
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
                        <div class="item_title" v-if="!manager_role">
                            <span style="text-align:center; display:block; width:100%; margin-left:0px">{{item.name}}</span>
                        </div>
                        <div class="item_title" v-if="manager_role">
                            <span>{{item.name}}</span>
                            <span @click="deleteUser(item.userId,index)" >
                                <i class="el-icon-error"></i>删除
                            </span>
                        </div>
                    </el-card>
                </div>
            </div>
        </div>
<!--        队员申请模块-->
        <div class="teamApplication" v-show="selected === 2" v-if="manager_role">
        <div class="container deskHeader" >
            <el-table
                    :data="teamFrom"
                    style="width: 100%"
            >
                <el-table-column prop="proposer" label="申请人" align="center"></el-table-column>
                <el-table-column prop="gmtCreate" label="申请时间" align="center"></el-table-column>
                <el-table-column prop="status" label="状态" align="center"></el-table-column>
                <el-table-column label="操作" prop="province" align="center" width="250">
                    <template slot-scope="scope">
                        <router-link @click.native="dele(scope)" to v-if="scope.row.status==='失败'">
                            <i class="el-icon-delete"></i>
                            删除
                        </router-link>
                        <router-link
                                @click.native="pass(scope.row)"
                                to
                                v-if="scope.row.status==='审核中'&&scope.row.show"
                        >
                            <i class="el-icon-circle-check"></i>
                            通过
                        </router-link>
                        <router-link
                                @click.native="nopass(scope.row)"
                                to
                                v-if="scope.row.status==='审核中'&&scope.row.show"
                        >
                            <i class="el-icon-error"></i>
                            不通过
                        </router-link>
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
        </div>
    </div>
</template>

<script>
    import {httpGet, httpPost, httpDelete} from "@/utils/http.js";
    import {mapGetters} from "vuex";
    import {successTips, errTips, message} from "@/utils/tips.js";
    import {MessageBox} from "element-ui";
    import {specificDate} from "@/utils/getDate.js";
    export default {
        data() {
            return {
                manager_role: true,
                projectName:null,
                selected:1,//决定显示哪一个页面
                items: [
                    {
                        title: "成员管理",
                        value: 1
                    },
                    {
                        title: "队员申请",
                        value: 2
                    },
                ],
                search_flag: false,
                types: [],
                typeId: "",
                typeList: [],
                userNamePhoneEmail: "",
                addList: {},
                userList: {
                    competeTeamList: [],
                    typeList: []
                },
                userId:null,

                totalPage: 0,
                pageData: {
                    projectName: this.projectName,
                    pageSize: 10,
                    pageNo: 1,
                    orderType: "DESC",
                    typeId: null,
                    orderBy: "id",
                    role:2
                },
                teamFrom: []
            };
        },
        computed: {
            ...mapGetters(["getHeader", "getnoImg"])
        },
        created: function () {
            this.projectName = sessionStorage.getItem('projectName');
            this.projectId = sessionStorage.getItem('projectId');
            this.userId = sessionStorage.getItem('userId');
            this.manager_role = parseInt(sessionStorage.getItem('projectRole')) === 2;
            if (!this.projectId && !this.userId) {
                message("没有团队消息！");
            }
            this.getView();
            this.getApplication();
        },
        methods: {
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
                    } else {
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
            },
            getApplication(val=this.pageData){
                val.projectName = this.projectName;
                httpGet("/v1/authorization/team/teamapplyfor/get", val).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 200) {
                        let getData = data;
                        this.pageNo = getData.pageNo;
                        this.teamFrom = getData.teamApplyForList;
                        let { teamApplyForList} = getData;
                        for (let i of teamApplyForList) {
                            i.gmtCreate = specificDate(i.gmtCreate);
                        }
                        Object.assign(this.pageData, val);
                    } else if (msg === "该条件暂无数据") {
                        this.teamFrom = [];
                    }
                });
            }
        }

    }
</script>

<style lang='scss' scoped>
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
    .header_two0 {
        .userImg {
            float: right;
            width: 65px;

            .icon-xiaoxi {
                cursor: pointer;
                font-size: 26px;
                color: white;
                transition: all 0.4s;
                float: left;
                margin-top: 4px;

                &:hover {
                    color: rgba(0, 0, 0, 0.74);
                }
            }

            img {
                margin-top: 3px;

                &:hover {
                    cursor: pointer;
                }
            }
        }

        a {
            color: #666;
            font-weight: 400;
            width: 100px;
            font-size: 16px;

            &:hover {
                border-bottom: 1.9px solid #4c83c3;
                padding-bottom: 10px;
            }
        }

        .login_two {
            border: 1px solid #fff;
            padding: 5px 13px 5px 13px;
            margin-right: 10px;
            border-radius: 3px;

            &:hover {
                background: #426ea1;
            }
        }

        .register_two {
            background: white;
            color: black;
            padding: 5px 13px 5px 13px;
            border: 1px solid #fff;
            border-radius: 3px;

            &:hover {
                background: #e8e8e8;
            }
        }

        .c-header {
            -webkit-box-shadow: 0 1px 0 rgba(255, 255, 255, 0.2);
            box-shadow: 0 1px 0 rgba(255, 255, 255, 0.2);
            width: 100%;
            z-index: 100;
        }

        .c-header--fixed,
        .c-header--solid0 {
            border-bottom: 1px solid #e8e8e8;
            padding: 15px 0 15px;
        }

        .c-header__row {
            height: 70px;
            padding-top: 20px;
            box-sizing: border-box;
        }

        .c-header__logowrap {
            border: 0;
            height: 30px;
            width: 130px;
            outline: 0;
            margin-right: auto;
            float: left;
        }

        .c-header__logo {
            width: 130px;
            height: 30px;
            fill: #333;
        }

        .c-header__options {
            float: right;
            width: 65px;

            img {
                width: 27px;
                height: 27px;
                border-radius: 50%;
                margin-left: 10px;
            }
        }

        .c-header__options__signin {
            display: inline-block;
        }

        .c-header__navigation {
            width: 940px;
            float: left;
            // text-align: center;
            list-style: none;
        }

        .c-header__navigation__item {
            padding: 0 15px 0 15px;
            display: inline-block;
            vertical-align: middle;
            height: 100%;
            font-size: 14px;
            font-weight: 600;
        }

        .header_active {
            border-bottom: 1.9px solid #4c83c3;
            padding-bottom: 10px;
            // background: #0760c5;
        }

        .c-header--transparent:not(.c-header--fixed) {
            position: absolute;
        }

        .c-header--transparent:not(.c-header--fixed) .c-header__navigation__item a {
            color: #fff;
            text-shadow: 0 0 1px rgba(0, 0, 0, 0.9);
        }

        .c-header--transparent:not(.c-header--fixed) .c-header__options__join {
            border-color: #fff;
            background-color: #fff;
            color: #444;
            font-weight: 400;
        }

        .c-header--transparent:not(.c-header--fixed) .c-header__options__join:hover {
            background-color: #4c83c3;
            border-color: #4c83c3;
            color: #fff;
        }

        .c-header--transparent:not(.c-header--fixed) .c-header__options__signin {
            background-color: transparent;
            border: 1px solid #fff;
            color: #fff;
        }

        .c-header--transparent:not(.c-header--fixed) .c-header__options__signin:hover {
            background-color: #fff;
            color: #444;
        }

        .c-header--breadcrumbs .c-header__logowrap {
            margin-right: 2rem;
        }

        .c-header--breadcrumbs .c-header__breadcrumb,
        .c-header--breadcrumbs .c-header__breadcrumb a {
            font-size: 14px;
            font-size: 0.875rem;
            color: #fff;
            text-shadow: 0 0 1px rgba(0, 0, 0, 0.9);
        }

        .c-header--breadcrumbs .mobileBreadcrumb {
            display: block;
        }

        .c-header--breadcrumbs .fullscreenBreadcrumb {
            display: none;
        }
    }
    .teamApplication {
        .bid_footer {
            .el-input__inner {
                width: 70px;
            }

            .el-pagination {
                text-align: center;
                margin: 50px 0 50px 0;
            }

            .el-pagination.is-background .el-pager li:not(.disabled).active {
                background: #3e76b8;
            }
        }

        .el-table {
            border: 1px solid #d8d8d8;
        }

        .get_btn {
            float: right;
        }

        .header_top {
            margin-top: 15px;
            padding-bottom: 20px;

            button {
                margin-left: 20px;
            }
        }

        .el-input {
            display: inline-block;
            width: 200px;
            margin-right: 25px;
        }

        .el-input__inner {
            border: 1px solid #c0c0c0;
            width: 200px;
            height: 35px;
            line-height: 35px;
        }

        .el-table td,
        .el-table th.is-leaf {
            color: black;
            border-bottom: 1px solid #d8d8d8;
        }
    }
</style>
