<template>
    <div class="myTable">

        <div class="header_top">
            <el-select v-model="searchData.titleId" clearable placeholder="所属任务">
                <el-option v-for="(item, index) in missionTitleList" :label="item.title" :value="item.id" :key="index"></el-option>
            </el-select>
            <el-input v-model="searchData.subtitle" clearable placeholder="子任务标题"></el-input>
            <el-select v-model="searchData.userId" clearable placeholder="上传者">
                <el-option v-for="(item, index) in userList" :label="item.userName" :value="item.id" :key="index"></el-option>
            </el-select>
            <el-date-picker
                    v-model="searchData.startTime"
                    :picker-options="startDatePicker"
                    type="date"
                    placeholder="上传时间"
                    value-format="yyyy-MM-dd"
            ></el-date-picker>
            <span style="margin-left: -10px;margin-right:5px;">到</span>
            <el-date-picker
                    v-model="searchData.endTime"
                    :picker-options="endDatePicker"
                    type="date"
                    placeholder="上传时间"
                    value-format="yyyy-MM-dd"
            ></el-date-picker>

            <el-button type="primary" @click="searchList()" style="margin-left: 2px;">搜索</el-button>

        </div>
        <el-table :data="fileTable" style="width:1200px;margin:0 auto" v-loading="loading"
                  @selection-change="handleSelectionChange" :header-cell-style="rowClass" >
            <el-table-column fixed prop="resourceName" label="文件名称" align="center">
                <template slot-scope="scope">
                    <a :href="scope.row.resource" target="_blank">{{scope.row.resourceName}}</a>
                </template>
            </el-table-column>
            <el-table-column prop="titleName" label="所属任务" align="center"></el-table-column>
            <el-table-column prop="subtitle" label="子任务标题" align="center"></el-table-column>
            <el-table-column prop="missionTypeName" label="子任务类型" align="center"></el-table-column>
            <el-table-column prop="gmtCreate" label="上传时间" align="center"></el-table-column>
            <el-table-column prop="userName" label="上传者" align="center"></el-table-column>
            <el-table-column type="selection" width="70px" header-align="center"
                             label-class-name="setDownloadName" align="center"></el-table-column>
            <!-- <el-table-column label="操作" align="center" >
                <template slot-scope="scope">
                    <router-link @click.native="downloadFile(scope.row)" to>
                            <i class="el-icon-download"></i>
                            下载
                    </router-link>
                </template>
            </el-table-column> -->
        </el-table>
        <div class="bid_footer">
            <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page.sync="searchData.pageNo"
                    :total="totalPage"
                    layout="prev, pager, next, jumper"
            ></el-pagination>
        </div>
    </div>
</template>
<script>
    import {httpGet} from "@/utils/http.js";
    import {specificDate} from "@/utils/getDate.js";
    import timeLimit from "@/mixins/regular/timeLimit.js";
    import {message, errTips} from "@/utils/tips.js";
    import {mapMutations} from "vuex";

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
                fileTable: [],
                userList:[],
                missionTitleList:[],
            };
        },
        created: function () {
            this.teamId = sessionStorage.getItem('teamId');
            this.searchData.teamId = this.teamId;
            this.getView();
            this.getUserList();
            this.getMissionList();
        },
        computed: {
        },
        methods: {
            ...mapMutations(["setCache"]),
            handleSelectionChange(val) {
            //val 为选中数据的集合
                this.multipleSelection = val;
            },
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
                this.getView();
                
            },
            handleCurrentChange(val) {
                this.searchData.pageNo = val;
                this.getView();
            },
            //获取页面数据
            getView(val = this.searchData) {
                this.loading = true;
                httpGet("/v1/authorization/manage/resource/list", val).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 200) {
                        this.pageNo = data.pageNo;
                        this.totalPage = parseInt(data.totalPage + "0");
                        let list = data.list;

                        for (let i of list) {
                            i.gmtCreate = specificDate(i.gmtCreate);
                            if(i.resourceName === null){
                                let resouArray = i.resource.split('/');
                                i.resourceName = resouArray[resouArray.length-1];
                            }

                        }
                        Object.assign(this.searchData, val);
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
    .el-table /deep/.setDownloadName .cell .el-checkbox__inner{
        margin-left: -30px;
        position:relative;
    }
    .el-table /deep/.setDownloadName .cell:before{
        content:"下载";
        position:absolute;
        right:11px;
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
</style>
