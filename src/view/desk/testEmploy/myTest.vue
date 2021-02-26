<template>
    <div class="myTable">
<!--        <div class="header_two0">-->
<!--            <nav class="c-header c-header&#45;&#45;solid0">-->
<!--                <div class="o-container deskHeader clearfix">-->
<!--                    <ul class="c-header__navigation clearfix">-->
<!--                        <li class="c-header__navigation__item" v-for="item in items" :key="item.title">-->
<!--                            <router-link :class="Header === item.url ? 'header_active' : ''" :to="item.url">-->
<!--                                {{ item.title }}-->
<!--                            </router-link>-->
<!--                        </li>-->
<!--                    </ul>-->
<!--                </div>-->
<!--            </nav>-->
<!--        </div>-->
        <div class="header">
            <div class="container deskHeader">
                <h4>测试发布</h4>
            </div>
        </div>
        <div class="header_top">
            <el-input v-model="searchData.projectName" placeholder="项目名称搜索"></el-input>

            <el-select v-model="searchData.status" clearable placeholder="请选择状态">
                <el-option label="招募中" value="1"></el-option>
                <el-option label="进行中" value="2"></el-option>
                <el-option label="结束" value="3"></el-option>
            </el-select>

            <el-select v-model="searchData.type" clearable placeholder="请选择类型">
                <el-option label="设计" value="1"></el-option>
                <el-option label="软件开发" value="2"></el-option>
                <el-option label="数据科学" value="3"></el-option>
                <el-option label="其他类别" value="4"></el-option>
            </el-select>

            <el-button type="primary" @click="searchList()">搜索</el-button>
            <router-link to="/testEmploy">
                <el-button type="primary">发布内测</el-button>
            </router-link>
        </div>

        <el-table :data="bidTable" style="width:1200px;margin:0 auto" :header-cell-style="rowClass" v-loading="loading">
            <el-table-column fixed prop="projectCode" label="测试编号" align="center">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.projectCode" placement="top-start">
                        <span class="tablehidden">{{ scope.row.projectCode }}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="测试名称" align="center">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.projectName" placement="top-start">
                        <span class="tablehidden">{{ scope.row.projectName }}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="gmtCreate" label="招募开始时间" align="center"></el-table-column>
            <el-table-column prop="deadline" label="招募截止时间" align="center"></el-table-column>
            <el-table-column prop="status" label="状态" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.status === 1">招募中</span>
                    <span v-if="scope.row.status === 2">进行中</span>
                    <span v-if="scope.row.status === 3">结束</span>
                </template>
            </el-table-column>
            <el-table-column prop="type" label="项目类型" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.type === 1">设计</span>
                    <span v-if="scope.row.type === 2">软件开发</span>
                    <span v-if="scope.row.type === 3">数据科学</span>
                    <span v-if="scope.row.type === 4">其他类别 </span>

                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="450">
                <template slot-scope="scope">
                    <router-link v-if="scope.row.status===3||scope.row.status===2"
                                 :to="{ path: 'myTestView', query: { id: scope.row.id } }">
                        <i class="el-icon-search"></i>
                        查看
                    </router-link>
                    <router-link v-if="scope.row.status===1"
                                 :to="{ path: 'myTestView&Edit', query: { id: scope.row.id } }">
                        <i class="el-icon-edit-outline"></i>
                        查看/编辑
                    </router-link>

                    <el-popover placement="right" trigger="click">
                        <div>
                            <el-input style="width: 200px;" v-model="ownNum" :disabled="true">
                                <template slot="prepend">已有人数</template>
                            </el-input>
                        </div>

                        <el-table :data="ruleForm" v-loading="loading1">
                            <el-table-column width="100" property="userName" label="用户名"
                                             align="center"></el-table-column>
                            <el-table-column width="100" property="school" label="学校" align="center">
                                <template slot-scope="scope"><span v-if="scope.row.school===null">暂无 </span></template>
                            </el-table-column>
                            <el-table-column width="150" property="phone" label="手机号" align="center"></el-table-column>
                            <el-table-column width="170" property="email" label="电子邮箱" align="center"></el-table-column>
                            <el-table-column width="100" property="companyName" label="公司名" align="center">
                                <template slot-scope="scope"><span v-if="scope.row.school===null">暂无 </span></template>
                            </el-table-column>
                        </el-table>

                        <router-link to slot="reference" @click.native="getTestUser(scope.row.id)">
                            <i class="icon iconfont icon-tuandui"></i>
                            查看人员
                        </router-link>
                    </el-popover>

                    <router-link :to="{ path: 'editTest', query: {id: scope.row.id } }" v-if="scope.row.status===2">
                        <i class="el-icon-edit"></i>
                        发布任务
                    </router-link>

                    <router-link v-if="scope.row.status===3||scope.row.status===2"
                                 :to="{path:'./testIssueSum',query:{id:scope.row.id}}">
                        <i class="el-icon-tickets"></i>
                        意见汇总
                    </router-link>

                    <router-link @click.native="overTest(scope.row.id)" to v-if="scope.row.status!==3">
                        <i class="el-icon-error"></i>
                        结束
                    </router-link>
                </template>
            </el-table-column>
        </el-table>
        <div class="bid_footer">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="pageData.pageNo" :total="totalPage"
                           layout="prev, pager, next, jumper"></el-pagination>
        </div>
    </div>
</template>
<script>
    import {httpGet, httpPut, httpDelete} from '@/utils/http.js';
    import {specificDate} from '@/utils/getDate.js';
    import timeLimit from '@/mixins/regular/timeLimit.js';
    import {message, successTips, errTips} from '@/utils/tips.js';
    import {MessageBox} from 'element-ui';
    import {mapMutations, mapActions, mapGetters} from 'vuex';

    export default {
        name: 'myBid',
        components: {},
        inject: ['reload'],
        mixins: [timeLimit],
        data() {
            return {
                Header: "myTest",
                items: [
                    {
                        title: "测试发布",
                        url: "myTest"
                    },
                    {
                        title: "测试任务",
                        url: "myTestTask"
                    },

                ],
                selectedOptions: [],
                options: [],
                selestate: [],
                loading: false,
                loading1: false,
                projectList: [],
                totalPage: 0,
                searchData: {
                    pageNo: 1,
                    pageSize: 10,
                    orderType: 'DESC',
                    orderBy: 'id',
                    projectName: '',
                    status: "",
                    type: ""
                },
                pageData: {
                    pageNo: 1,
                    pageSize: 10,
                    orderType: 'DESC',
                    orderBy: 'id',
                    projectName: '',
                    status: "",
                    type: ""
                },
                bidTable: [],
                testId: {
                    id: ""
                },
                ownNum: null,
                ruleForm: []
            };
        },
        created: function () {
            this.getView();
        },

        methods: {


            getTestUser(Id) {
                this.loading1 = true;
                this.ruleForm = [];
                this.ownNum = 0;

                httpGet('/v1/authorization/test/get/testuserinfo', {id: Id}).then(results => {
                    const {msg, data, httpCode} = results.data;
                    if (httpCode === 200) {
                        this.ruleForm = data.testUsetList;
                        this.ownNum = data.testUsetList.length;


                    } else {
                        errTips(msg);
                    }
                    this.loading1 = false;
                });


            },
            //结束测试
            overTest(id) {
                MessageBox.confirm('是否确定将此测试结束？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        this.testId.id = id;
                        httpPut('/v1/authorization/test/teststatus/update', this.testId).then(results => {
                            const {httpCode, msg} = results.data;
                            if (httpCode === 200) {
                                this.getView();
                                successTips('结束成功');
                            } else if (httpCode === 400) {
                                errTips('此投标状态已变更');
                                this.reload();
                            } else if (httpCode !== 401) {
                                errTips(msg);
                            }
                        });
                    })
                    .catch(() => {
                    });
            },
            //搜索查询
            searchList() {
                this.getView(this.searchData);
            },
            handleCurrentChange(val) {
                this.pageData.pageNo = val;
                this.getView();
            },
            //获取页面数据
            getView(val = this.pageData) {
                this.loading = true;

                httpGet('/v1/authorization/test/search/testinfo', val).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode == 200) {
                        this.pageNo = data.pageNo;
                        this.totalPage = parseInt(data.totalPage + '0');

                        let list = data.testInfoList;
                        for (let i of list) {

                            i.gmtCreate = specificDate(i.gmtCreate);
                            i.deadline = specificDate(i.deadline);
                        }
                        Object.assign(this.pageData, val);
                        this.$set(this, 'bidTable', list);
                    } else if (msg == '该条件暂无数据') {
                        this.bidTable = [];
                        message('该条件暂无数据');
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                    this.loading = false;
                });
            },
            rowClass() {
                return 'background:#F4F6F9;';
            }
        }
    };
</script>
<style lang="scss">
    @import '@/assets/scss/myTable.scss';

    .popo-item {
        margin: 10px 0 8px 0;
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
