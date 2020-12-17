<template>
    <div class="myTable">

        <div class="header_top">
            <el-select v-model="searchData.missionId" clearable placeholder="任务名称">
                <el-option v-for="item in missionTitleList" :label="item.title" :value="item.id"></el-option>
            </el-select>
            <el-select v-model="searchData.subtitle" clearable placeholder="子任务标题">
                <el-option label="比赛中/中标" value="比赛中/中标"></el-option>
                <el-option label="报名中/投标中" value="报名中/投标中"></el-option>
                <el-option label="失败" value="失败"></el-option>
                <el-option label="结束" value="结束"></el-option>
            </el-select>
            <el-select v-model="searchData.userId" clearable placeholder="上传者">
                <el-option v-for="item in userList" :label="item.userName" :value="item.id"></el-option>
            </el-select>
            <el-date-picker
                    v-model="searchData.startTime"
                    :picker-options="endDatePicker"
                    type="date"
                    placeholder="上传时间"
                    value-format="yyyy-MM-dd"
            ></el-date-picker>


            <el-button type="primary" @click="searchList()">搜索</el-button>

        </div>
        <el-table :data="fileTable" style="width:1200px;margin:0 auto" :header-cell-style="rowClass" v-loading="loading" >
            <el-table-column fixed prop="resourceName" label="文件名称" align="center"></el-table-column>
            <el-table-column prop="titleName" label="所属任务" align="center"></el-table-column>
            <el-table-column prop="subtitle" label="子任务标题" align="center"></el-table-column>
            <el-table-column prop="missionTypeName" label="子任务类型" align="center"></el-table-column>
            <el-table-column prop="gmtCreate" label="上传时间" align="center"></el-table-column>
            <el-table-column prop="userName" label="上传者" align="center"></el-table-column>

            <el-table-column label="下载" align="center" >
                <template slot-scope="scope">
                    <el-checkbox ></el-checkbox>
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
    import {httpGet, httpDelete} from "@/utils/http.js";
    import {specificDate} from "@/utils/getDate.js";
    import timeLimit from "@/mixins/regular/timeLimit.js";
    import {message, successTips, errTips} from "@/utils/tips.js";
    import {MessageBox} from "element-ui";
    import {mapMutations, mapActions, mapGetters} from "vuex";

    export default {
        name: "myBid",
        inject: ["reload"],
        mixins: [timeLimit],
        data() {
            return {
                teamId:null,
                loading: false,
                totalPage: 0,
                searchData: {
                    pageNo: 1,
                    pageSize: 10,
                    orderType: "DESC",
                    orderBy: "id",
                    teamId: null,
                    missionId: null,
                    titleId:null,
                    userId:null,
                    subtitle:null,
                    startTime: null,
                    endTime: null
                },
                pageData: {
                    pageNo: 1,
                    pageSize: 10,
                    orderType: "DESC",
                    orderBy: "id",
                    teamId: null,
                    missionId: null,
                    titleId:null,
                    userId:null,
                    subtitle:null,
                    startTime: null,
                    endTime: null
                },
                fileTable: [],
                userList:[],
                missionTitleList:[]
            };
        },
        created: function () {
            this.teamId = this.$route.query.teamId;
            this.pageData.teamId = this.teamId;
            this.getView();
            this.getUserList();
            this.getMissionList();
        },
        computed: {
            ...mapGetters(["getNormalType"])
        },
        methods: {
            ...mapMutations(["setCache"]),
            ...mapActions(["GETNORMALTYPE"]),
            getMissionList(){
                httpGet("/v1/authorization/manage/missiontitle/list", {
                    teamId: this.teamId
                }).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 200) {
                        this.missionTitleList = data.missionTitle;
                    } else {
                        errTips(msg);
                    }
                });
            },
            getUserList(){
                console.log("获取团队成员");
                httpGet("/v1/authorization/manage/user/list", {
                    teamId: this.teamId
                }).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 200) {
                        this.userList = data.userList;
                    } else {
                        errTips(msg);
                    }
                });
            },

            searchList() {
                // let {selestate, searchData, selectedOptions} = this;
                // searchData.parentId = selectedOptions[0];
                // searchData.typeId = selectedOptions[1];
                // if (selestate.indexOf("投标中")>0) {
                //     searchData.status = 1;
                // } else if (selestate.indexOf("中标")>0) {
                //     searchData.status = 2;
                // } else if (selestate === "结束") {
                //     searchData.status = 3;
                // } else if (selestate === "失败") {
                //     searchData.status = 4;
                // } else {
                //     searchData.status = "";
                // }
                this.getView(searchData);
            },
            handleCurrentChange(val) {
                this.pageData.pageNo = val;
                this.getView();
            },
            //获取页面数据
            getView(val = this.pageData) {
                this.loading = true;
                ///v1/authorization/manage/memberresource/list
                httpGet("/v1/authorization/manage/resource/list", val).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 200) {
                        this.pageNo = data.pageNo;
                        this.totalPage = parseInt(data.totalPage + "0");
                        let list = data.list;

                        for (let i of list) {
                            i.gmtCreate = specificDate(i.gmtCreate);
                        }
                        Object.assign(this.pageData, val);
                        this.$set(this, "fileTable", list);
                    } else if (msg === "该条件暂无数据") {
                        this.fileTable = [];
                        message("该条件暂无数据");
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                    this.loading = false;
                });
            },
            changeBidStatus(item){
                this.bidStatusHeader = item.title;
                this.selestate = item.title;
                this.searchList();
            },
            rowClass() {
                return "background:#F4F6F9;";
            }
        }
    };
</script>
<style lang='scss'>
    @import "@/assets/scss/myTable.scss";
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
</style>
