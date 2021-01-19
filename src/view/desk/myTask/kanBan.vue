<!--
功能：查看所参与的正在进行中的项目的进度
引用：我的任务的看板
-->
<template>
    <div class="square">
        <div class="responsive resp">
            <div class="header">
                <div class="container deskHeader">
                    <h4>
                        您的位置：
                        <router-link to="myTask">我的任务</router-link>
                        >
                        <span class="active">看板</span>
                    </h4>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="clearfix">
                <nav class="switchPanel boxSize">
                    <div class="left_top">
                        <ul>
                            <li class="leftbq">{{seleValue}}</li>
                            <br/>
                            <br/>
                            <li @click="showProgress">项目进度</li>
                            <li @click="showProject(item)" v-for="item in projectList" :key="item.projectId">{{
                                item.projectName }}
                            </li>
                        </ul>
                    </div>
                </nav>
                <div class="panelHold boxSize" v-show="kbRight == false">
                    <div class="panel0" v-loading="loading">
                        <p class="tip" v-show="tipData">暂无数据</p>
                        <header class="clearfix"></header>
                        <ul class="services">
                            <li class="serviceItem clearfix" v-for="(item, index) in progressDetailList" :key="index">
                                <div style="border: #d8d8d8 1px solid; padding: 10px 20px 20px 10px; box-shadow: 0 2px 2px 0 rgba(0,0,0,.1);">
                                    <div class="clearfix rhythmMargin">
                                        <div class="serviceHeader clearfix">
											<span class="servTitle">
												<h2>
													<a href="javascript:;">{{ item.projectName }}</a>
												</h2>
											</span>
                                        </div>
                                        <div class="serviceMeta" style="padding-left: 6px;margin-top: 10px;">
                                            <p style="color: #666666;font-size: 16px;">任务完成进度</p>
                                            <el-progress
                                                    :percentage="(item.missionFinishCount + item.missionTrackingCount)==0?0:parseInt((item.missionFinishCount * 100) / (item.missionFinishCount + item.missionTrackingCount))"
                                                    color="#8e71c7"
                                            ></el-progress>
                                            <p style="font-size: 14px;color: #969896;"
                                               v-show="(item.missionFinishCount + item.missionTrackingCount)==0">
                                                暂无进度</p>
                                            <br/>
                                            <p style="color: #666666;font-size: 16px;">待解决缺陷进度</p>
                                            <el-progress
                                                    :percentage="(item.bugResolvedCount + item.bugTrackingCount + item.bugIssueCount)==0?0:parseInt((item.bugResolvedCount * 100) / (item.bugResolvedCount + item.bugTrackingCount + item.bugIssueCount))"
                                                    color="#9ed979"
                                            ></el-progress>
                                            <p style="font-size: 14px;color: #969896;"
                                               v-show="(item.bugResolvedCount + item.bugTrackingCount + item.bugIssueCount)==0">
                                                暂无缺陷</p>
                                        </div>
                                        <div class="types" v-loading="loadingTypes">
                                            <ul>
                                                <li v-for="items in projectTypeList[index]">
                                                    <span>{{ typeName[items.missionType] }}</span>
                                                    :
                                                    <span style="color: red;">{{ items.finish }}</span>
                                                    -
                                                    <span>{{ items.sum }}</span>
                                                </li>
                                            </ul>
                                        </div>
                                        <!-- <li v-for="items in projectTypeList[index]">
                                            <span class="tablehidden" v-if="items.missionType === 1">需求设计</span>
                                        </li> -->
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div v-show="kbRight == true">
                    <el-card class="box-card0" v-loading="loading">
                        <div slot="header" class="clearfix"><span style="font-size: 16px;">待处理</span></div>
                        <ul class="services">
                            <li class="serviceItem clearfix" v-for="(item, index) in missionPendingList" :key="index">
                                <div style="border: #d8d8d8 1px solid; padding: 10px 5px 10px 5px; box-shadow: 0 2px 2px 0 rgba(0,0,0,.1);">
                                    <div class="clearfix rhythmMargin">
                                        <div class="serviceHeader clearfix">
                                            <span class="Title" style="font-size: 14px;">{{ item.content }}/{{item.subtitle}} </span>
                                            <span>
												任务类型：
												<span>{{item.missionTypeName}}</span>
                                                <!-- <span class="tablehidden" v-if="item.missionType === 1">需求设计</span>
                                                <span class="tablehidden" v-if="item.missionType === 2">概要设计</span>
                                                <span class="tablehidden" v-if="item.missionType === 3">详细设计</span>
                                                <span class="tablehidden" v-if="item.missionType === 4">编码实现</span>
                                                <span class="tablehidden" v-if="item.missionType === 5">软件测试</span>
                                                <span class="tablehidden" v-if="item.missionType === 6">部署运维</span>
                                                <span class="tablehidden" v-if="item.missionType === 7">其他</span> -->
											</span>

                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </el-card>
                    <el-card class="box-card0" v-loading="loading">
                        <div slot="header" class="clearfix"><span style="font-size: 16px;">开发中</span></div>
                        <ul class="services">
                            <li class="serviceItem clearfix" v-for="(item, index) in missionTrackingList" :key="index">
                                <div style="border: #d8d8d8 1px solid; padding: 10px 20px 20px 10px; box-shadow: 0 2px 2px 0 rgba(0,0,0,.1);">
                                    <div class="clearfix rhythmMargin">
                                        <div class="serviceHeader clearfix">
                                            <span class="Title0" style="font-weight: 500;">{{ item.content }}/{{item.subtitle}} </span>
                                            <span>
												任务类型：
												<span>{{item.missionTypeName}}</span>
                                                <!-- <span class="tablehidden" v-if="item.missionType === 1">需求设计</span>
                                                <span class="tablehidden" v-if="item.missionType === 2">概要设计</span>
                                                <span class="tablehidden" v-if="item.missionType === 3">详细设计</span>
                                                <span class="tablehidden" v-if="item.missionType === 4">编码实现</span>
                                                <span class="tablehidden" v-if="item.missionType === 5">软件测试</span>
                                                <span class="tablehidden" v-if="item.missionType === 6">部署运维</span>
                                                <span class="tablehidden" v-if="item.missionType === 7">其他</span> -->
											</span>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </el-card>
                    <el-card class="box-card0" v-loading="loading">
                        <div slot="header" class="clearfix"><span style="font-size: 16px;">测试中</span></div>
                        <ul class="services">
                            <li class="serviceItem clearfix" v-for="(item, index) in missionTestList" :key="index">
                                <div style="border: #d8d8d8 1px solid; padding: 10px 20px 20px 10px; box-shadow: 0 2px 2px 0 rgba(0,0,0,.1);">
                                    <div class="clearfix rhythmMargin">
                                        <div class="serviceHeader clearfix">
                                            <span class="Title" style="font-size: 14px;">{{ item.content }}/{{item.subtitle}} </span>
                                            <span>
												任务类型：
												<span>{{item.missionTypeName}}</span>
                                                <!-- <span class="tablehidden" v-if="item.missionType === 1">需求设计</span>
                                                <span class="tablehidden" v-if="item.missionType === 2">概要设计</span>
                                                <span class="tablehidden" v-if="item.missionType === 3">详细设计</span>
                                                <span class="tablehidden" v-if="item.missionType === 4">编码实现</span>
                                                <span class="tablehidden" v-if="item.missionType === 5">软件测试</span>
                                                <span class="tablehidden" v-if="item.missionType === 6">部署运维</span>
                                                <span class="tablehidden" v-if="item.missionType === 7">其他</span> -->
											</span>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </el-card>
                    <el-card class="box-card0" v-loading="loading">
                        <div slot="header" class="clearfix"><span style="font-size: 16px;">已完成</span></div>
                        <ul class="services">
                            <li class="serviceItem clearfix" v-for="(item, index) in missionFinishList" :key="index">
                                <div style="border: #d8d8d8 1px solid; padding: 10px 20px 20px 10px; box-shadow: 0 2px 2px 0 rgba(0,0,0,.1);">
                                    <div class="clearfix rhythmMargin">
                                        <div class="serviceHeader clearfix">
                                            <span class="Title" style="font-size: 14px;">{{ item.content }}/{{item.subtitle}} </span>

                                            <span>
												任务类型：
												<span class="tablehidden" v-if="item.missionType === 1">
													需求设计
													<router-link
                                                            :to="{ path: 'viewNeedDesign', query: { id: item.id } }">
														<i class="el-icon-search"></i>
														<span class="Title">查看</span>
													</router-link>
												</span>
												<span class="tablehidden" v-if="item.missionType === 2">
													概要设计
													<router-link style="font-size: 14px"
                                                                 :to="{ path: 'viewOutlineDesign', query: { id: item.id } }">
														<i class="el-icon-search"></i>
														<span class="Title" style="font-size: 14px">查看</span>
													</router-link>
												</span>
												<span class="tablehidden" v-if="item.missionType === 3">
													详细设计
													<router-link style="font-size: 14px"
                                                                 :to="{ path: 'viewDetailedDesign', query: { id: item.id } }">
														<i class="el-icon-search"></i>
														<span class="Title" style="font-size: 14px">查看</span>
													</router-link>
												</span>
												<span class="tablehidden"
                                                      v-if="!(item.missionType === 3||item.missionType === 2||item.missionType === 1)">{{item.missionTypeName}}</span>
                                                <!-- <span class="tablehidden" v-if="item.missionType === 4">编码实现</span>
                                                <span class="tablehidden" v-if="item.missionType === 5">软件测试</span>
                                                <span class="tablehidden" v-if="item.missionType === 6">部署运维</span>
                                                <span class="tablehidden" v-if="item.missionType === 7">其他</span> -->
											</span>

                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </el-card>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    import {httpGet} from '@/utils/http.js';
    import {specificDate as getDate} from '@/utils/getDate.js';
    import {message} from '@/utils/tips.js';
    import {mapGetters, mapActions} from 'vuex';

    export default {
        data() {
            return {
                kbRight: false,
                projectList: [],
                progressDetailList: [],
                projectTypeList: [],
                missionFinishList: [],
                missionPendingList: [],
                missionTestList: [],
                missionTypeName: [],
                missionTrackingList: [],
                typeName: ['任务类型', '需求设计', '概要设计', '详细设计', '编码实现', '软件测试', '部署运维', '其他'],
                selected: '最新',
                optList: ['最新', '最热', '查看次数'],
                loading: false,
                loadingTypes: false,
                tipData: false,
                searchValue: '',
                plazaList: [],
                seleValue: '项目进度',
                pageNo: 1,
                totalPage: 1,
                parentId: '',
                pageSize: 3,
                typeId: '',

                sort: 'id'
            };
        },
        computed: {
            ...mapGetters(['getnoImg', 'getNormalType'])
        },
        created: function () {
            this.getProjectTypeList();
            //获取页面数据
            this.getView();
            this.getMissionType();
        },

        methods: {
            ...mapActions(['GETNORMALTYPE']),

            getMissionType() {
                httpGet(`/v1/public/bid/missiontypeall/all`).then(results => {
                    const {data, msg, httpCode} = results.data;
                    if (httpCode === 200) {
                        this.missionTypeName = data.missionTypeList;
                    } else {
                        errTips(msg);
                    }
                });

            },

            getProList() {
                return httpGet('/v1/authorization/mission/projectid/get');
            },
            getProTypeList(val) {
                return httpGet('/v1/authorization/mission/missiontype/get', {projectId: val});
            },

            async getProjectTypeList() {
                let results = await this.getProList();
                if (results.data.httpCode === 200) {
                    this.projectList = results.data.data.projectList;
                    var len = this.projectList.length;
                    this.loadingTypes = true;
                    for (var i = 0; i < len; i++) {
                        let type = await this.getProTypeList(this.projectList[i].projectId);
                        this.projectTypeList[i] = type.data.data.typeList;
                    }
                    this.loadingTypes = false;
                }
            },
            showProgress() {
                this.kbRight = false;
                this.seleValue = "项目进度";
                this.getView();
            },
            showProject(item) {
                this.kbRight = true;
                this.seleValue = item.projectName;
                this.getViewP(item.projectId);
            },
            getViewP(val) {
                this.loading = true;

                httpGet('/v1/authorization/mission/progressbyproject/get', {id: val}).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 200) {
                        this.missionFinishList = data.missionFinishList;
                        this.missionPendingList = data.missionPendingList;
                        this.missionTestList = data.missionTestList;
                        this.missionTrackingList = data.missionTrackingList;
                        this.loading = false;
                        Object.assign(this.pageData, val);
                    } else {
                        this.loading = false;
                        this.missionFinishList = [];
                        this.missionPendingList = [];
                        this.missionTestList = [];
                        this.missionTrackingList = [];
                        this.progressDetailList = [];
                        message('暂无数据');
                    }
                });
            },

            getView(val) {
                this.loading = true;
                httpGet('/v1/authorization/mission/projectprogress/get', val).then(results => {
                    let getData = results.data;
                    if (getData.httpCode === 200) {
                        this.progressDetailList = [...getData.data.progressDetailList];
                        this.loading = false;
                    } else if (getData.msg === '该条件暂无数据') {
                        this.loading = false;
                        this.progressDetailList = [];
                        this.tipData = true;
                        message('暂无数据');
                    }
                });
            }
        }
    };
</script>
<style lang="scss">
    @import '@/assets/scss/square.scss';

    .box-card0 {
        text-align: center;
        margin-top: 40px;
        margin-left: 2px;
        width: 18%;
        float: left;

        & ::after {
            content: '';
            clear: both;
            display: table;
        }

        .el-card__body {
            padding: 0;
        }

        span {
            font-size: 14px;
        }
    }

    .panelHold {
        .panel0 {
            border: #d8d8d8 1px solid;
            padding: 20px 20px 20px 20px;
            width: 110%;
            margin: 40px auto;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
        }
    }

    .container {
        .switchPanel {
            width: 18%;
            margin: 30px 1% 0 0;
            float: left;
        }
    }

    .left_top {
        text-align: center;

        ul {
            margin-top: 20px;
        }

        li {
            border-top: 1px solid #d8d8d8;
            margin-top: 15px;
            padding-top: 15px;
            color: #666;
            position: relative;
            cursor: pointer;

            &:hover::before {
                content: '';
                height: 51px;
                top: 0;
                left: 0;
                position: absolute;
                border-left: 5px solid #4c83c3;
            }
        }

        .leftbq::before {
            content: '';
            height: 51px;
            top: 0;
            left: 0;
            position: absolute;
            border-left: 5px solid #4c83c3;
        }

        p {
            font-size: 14px;
        }

        & p:nth-child(3) {
            color: #3e76b8;
        }
    }

    .types {
        li {
            display: inline-block;
            padding: 8px 8px 0px 8px;
            color: #666666;
            font-size: 16px;
        }
    }

</style>
