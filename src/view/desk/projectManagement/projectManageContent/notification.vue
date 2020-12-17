<template>
    <div class="applicationView">
        <div class="container deskHeader">
            <div class="header_top">
                <el-input v-model="searchData.theme" placeholder="请输入通知主题"></el-input>
                <el-select v-model="searchData.type" clearable placeholder="通知类型">
                    <el-option label="会议通知" value="1"></el-option>
                    <el-option label="其他" value="2"></el-option>
                </el-select>
                <el-select v-model="searchData.participantsId" clearable placeholder="发起人">
                    <el-option v-for="item in missionList" :key="item.id" :label="item.missionName"
                               :value="item.id"></el-option>
                </el-select>
                <el-select v-model="searchData.participantsId" clearable placeholder="相关人员">
                    <el-option v-for="item in missionList" :key="item.id" :label="item.missionName"
                               :value="item.id"></el-option>
                </el-select>
                <el-date-picker
                        v-model="searchData.startTime"
                        type="date"
                        placeholder="通知开始时间"
                        value-format="yyyy-MM-dd"
                        :picker-options="endDatePicker"
                ></el-date-picker>
                <span style="margin-right: 15px;">到</span>
                <el-date-picker
                        v-model="searchData.endTime"
                        :picker-options="endDatePicker"
                        type="date"
                        placeholder="通知结束时间"
                        value-format="yyyy-MM-dd"
                ></el-date-picker>
                <el-button size="primary" @click="searchList()">搜索</el-button>

            </div>
            <el-card class="box-card0" v-loading="loading">
                <ul class="services">
                    <li class="serviceItem clearfix" v-for="(item, index) in testIssueSumList " :key="index">
                        <div style="border: #d8d8d8 1px solid; padding: 10px 20px 20px 10px; box-shadow: 0 2px 2px 0 rgba(0,0,0,.1);">
                    <li>
                        意见标题：{{item.title}}
                    </li>
                    <li>
                        提交人：{{item.creatorName}}

                    </li>
                    <li>
                        缺陷等级：
                        <span v-if="item.level===1" style="color:red">█马上解决</span>
                        <span v-if="item.level===2" style="color:orange">█急需解决</span>
                        <span v-if="item.level===3" style="color:yellow">█高度重视</span>
                        <span v-if="item.level===4" style="color:green">█正常处理</span>
                        <span v-if="item.level===5" style="color:blue">█低优先级</span>
                    </li>
                    <li>

                        描述：{{item.description}}


                    </li>



        </div>
        </li>
        </ul>
        <el-button type="primary" @click="returnDO" size="medium" style="width:150px;margin-left:45%;margin-top: 5%;">
            返回
        </el-button>
        </el-card>
    </div>
    </div>
</template>
<script>
    import {httpGet, httpPost} from "@/utils/http.js";
    import {specificDate} from "@/utils/getDate.js";
    import {errTips} from "@/utils/tips.js";
    import {mapMutations, mapActions, mapGetters} from "vuex";
    import {quillEditor} from 'vue-quill-editor'; //调用编辑器
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';

    export default {
        components: {
            quillEditor,
        },
        data() {
            return {
                testIssueSumList: [],
                missionList: [],
                id: "",

                loading: false,
                typeValue: "",
                ruleForm: {},
                searchData: {
                    id: "",
                    missionId: "",

                },


                searchData: {
                    pageNo: 1,
                    pageSize: 10,
                    orderType: 'DESC',
                    orderBy: 'id',
                    teamId: null,
                    theme: null,
                    participantsId: null,
                    type: null,
                    startTime:null,
                    endTime:null
                },
                pageData: {
                    pageNo: 1,
                    pageSize: 10,
                    orderType: 'DESC',
                    orderBy: 'id',
                    teamId: null,
                    theme: null,
                    participantsId: null,
                    type: null,
                    startTime:null,
                    endTime:null
                },
                notificationList:[],
                teamId:null
            };
        },
        created: function () {
            this.teamId = this.$route.query.teamId;
            this.pageData.teamId = this.teamId;
            this.getNotification();
            // this.searchData.id = this.$route.query.id;
            // this.testIssueList(this.searchData.id);
            // this.getMissionList(this.searchData.id);
            //alert(this.id);
        },

        methods: {
            ...mapMutations(["setCache"]),
            getNotification(val=this.pageData) {
                ///v1/authorization/notification/search/list
                httpGet('v1/authorization/notification/search/list', val).then(results => {
                    const {msg, data, httpCode} = results.data;
                    if (httpCode === 200) {
                        this.notificationList = data.list;
                    } else {
                        errTips(msg);
                    }
                    this.loading = false;
                });
            },
            getMissionList(value) {
                //get /v1/authorization/test/get/bugMission
                httpGet('/v1/authorization/test/get/bugMission', {id: value}).then(results => {
                    const {msg, data, httpCode} = results.data;
                    if (httpCode === 200) {
                        this.missionList = data.missionIdList;
                    } else {
                        errTips(msg);
                    }
                });
            },
            testIssueList(val) {
                this.loading = true;
                //get /v1/authorization/test/get/bugSummary
                httpGet('/v1/authorization/test/get/bugSummary', {id: val}).then(results => {
                    const {msg, data, httpCode} = results.data;
                    if (httpCode === 200) {
                        this.testIssueSumList = data.bugSummaryList;
                    } else if (httpCode === 400) {
                        this.setCache('myTest'); //???????
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                    this.loading = false;
                });
            },

            searchList() {

                this.loading = true;
                //get /v1/authorization/test/get/bugSummary
                httpGet('/v1/authorization/test/get/bugSummary', this.searchData).then(results => {
                    const {msg, data, httpCode} = results.data;
                    if (httpCode === 200) {
                        this.testIssueSumList = data.bugSummaryList;
                    } else if (httpCode === 400) {
                        this.setCache('myTest'); //???????
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                    this.loading = false;
                });
            },


        }
    };
</script>
<style lang='scss'>
    /*@import "@/assets/scss/applicationView.scss";*/

    .applicationView {
        .seeClass {
            color: #3e76b8;
            cursor: pointer;
        }

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

        /*.buttons {*/
        /*    float: right;*/
        /*}*/

        .header_top {
            margin-top: 15px;
            padding-bottom: 20px;

        }
        .button {
            display: inline-block;
            margin-left: 20px;
        }
        .el-input {
            display: inline-block;
            width: 200px;
            margin-right: 25px;
            margin-bottom: 25px;
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

    .box-card0 {
        li {
            margin-top: 15px;
            padding-top: 5px;
            color: #666;
            position: relative;
            cursor: pointer;

        }
    }
</style>
