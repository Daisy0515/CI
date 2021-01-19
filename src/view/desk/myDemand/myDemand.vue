<template>
    <div class="myTable">
        <div class="header_two0">
            <nav class="c-header c-header--solid0">
                <div class="o-container deskHeader clearfix">
                    <ul class="c-header__navigation clearfix">
                        <li class="c-header__navigation__item" v-for="item in demandStatus" :key="item.title"
                            @click="changeDemandStatus(item)">
                            <span :class="demandStatusHeader === item.title ? 'header_active' : ''" >
                                {{ item.title }}
                            </span>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
        <div class="header_top">
            <el-input v-model="searchData.name" placeholder="项目名称搜索"></el-input>
            <el-date-picker
                    v-model="searchData.startTime"
                    :picker-options="startDatePicker"
                    type="date"
                    placeholder="创建开始时间"
                    value-format="yyyy-MM-dd"
            ></el-date-picker>
            <span style="margin-right:15px">到</span>
            <el-date-picker
                    v-model="searchData.endTime"
                    :picker-options="endDatePicker"
                    type="date"
                    placeholder="创建结束时间"
                    value-format="yyyy-MM-dd"
            ></el-date-picker>
<!--            <el-select v-model="selestate" placeholder="请选择状态" clearable>-->
<!--                <el-option label="竞标中" value="竞标中"></el-option>-->
<!--                <el-option label="执行中" value="执行中"></el-option>-->
<!--                <el-option label="放弃" value="放弃"></el-option>-->
<!--                <el-option label="非法需求" value="非法需求"></el-option>-->
<!--                <el-option label="完成" value="完成"></el-option>-->
<!--            </el-select>-->
            <el-cascader :options="getNormalType" placeholder="请选择项目类型" change-on-select v-model="selectedOptions"
                         clearable></el-cascader>
            <el-button type="primary" @click="searchList()">搜索</el-button>
            <router-link to="demandPublish">
                <el-button type="primary">我要发布</el-button>
            </router-link>
        </div>
        <el-table
                v-loading="loading"
                :data="tableData"
                style="width:1200px;margin:0 auto;"
                :header-cell-style="rowClass"
        >
            <el-table-column fixed prop="projectId" label="项目编号" align="center">
                <template slot-scope="scope">
                    <el-tooltip
                            class="item"
                            effect="dark"
                            :content="scope.row.projectId"
                            placement="top-start"
                    >
                        <span class="tablehidden">{{scope.row.projectId}}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="项目名称" align="center">
                <template slot-scope="scope">
                    <router-link :to="{path:'demandView', query:{projectId:scope.row.projectId,id:scope.row.id}}"
                            v-if="scope.row.status===5||scope.row.status===1||scope.row.status===2||scope.row.status===3" >
                        <el-tooltip class="item" effect="dark" :content="scope.row.name" placement="top-start">
                            <span class="tablehidden">{{scope.row.name}}</span>
                        </el-tooltip>
                    </router-link>
                </template>
            </el-table-column>
            <el-table-column prop="gmtCreate" label="创建时间" align="center"></el-table-column>
            <el-table-column prop="gmtModified" label="操作时间" align="center"></el-table-column>
            <el-table-column label="状态" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.status===1">竞标中</span>
                    <span v-if="scope.row.status===2">执行中</span>
                    <span v-if="scope.row.status===3">完成</span>
                    <span v-if="scope.row.status===4">非法需求</span>
                    <span v-if="scope.row.status===5">放弃</span>
                </template>
            </el-table-column>
            <el-table-column prop="type" label="项目类型" align="center" width="180"></el-table-column>
            <el-table-column label="操作" align="center" width="340">
                <template slot-scope="scope">
                    <router-link :to="{path:'demandView', query:{projectId:scope.row.projectId,id:scope.row.id}}"
                                 v-if="scope.row.status===5||scope.row.status===1||scope.row.status===2||scope.row.status===3" >
                        <i class="el-icon-search"></i>
                        查看
                    </router-link>
                    <router-link
                            :to="{path:'overCompetition', query:{projectId:scope.row.id}}"
                            v-if="scope.row.status===1&&scope.row.isCompetition===true "
                    >
                        <i class="icon iconfont icon-tuandui"></i>
                        结束报名
                    </router-link>
                    <router-link
                            :to="{path:'teamSelect', query:{projectId:scope.row.id}}"
                            v-if="scope.row.status===1&&scope.row.isCompetition===false"
                    >
                        <i class="icon iconfont icon-tuandui"></i>
                        选择团队
                    </router-link>
                    <router-link to v-if="scope.row.edit">
                        <i class="el-icon-edit"></i>
                        {{scope.row.edit}}
                    </router-link>
                    <router-link
                            :to="{path:'demandScoring', query:{id:scope.row.id}}"
                            v-if="scope.row.status===3"
                    >
                        <i class="icon iconfont icon-fen"></i>
                        {{scope.row.isScore?"查看打分":"立即打分"}}
                    </router-link>
                    <router-link
                            :to="{path:'teamProgress', query:{projectId:scope.row.id}}"
                            v-if="scope.row.status===2"
                    >
                        <i class="el-icon-date"></i>
                        团队进度
                    </router-link>
                    <router-link
                            :to="{path:'teamList', query:{projectId:scope.row.id}}"
                            v-if="scope.row.status===3"
                    >
                        <i class="el-icon-date"></i>
                        团队列表
                    </router-link>
                    <router-link
                            :to="{path:'caseSelect', query:{projectId:scope.row.id}}"
                            v-if="scope.row.status===3"
                    >
                        <i class="el-icon-document"></i>
                        {{scope.row.isClassic===1?'查看案例':'案例选择'}}
                    </router-link>
                    <!--  <router-link
                        :to="{path:'viewDelivery', query:{projectId:scope.row.id,Id:scope.row.id}}"
                        v-if="scope.row.status===3"
                      >
                        <i class="el-icon-search"></i>
                        查看交付
                      </router-link> -->
                    <router-link
                            @click.native="deleteProject(scope.row.id)"
                            to
                            v-if="scope.row.status===5||scope.row.status===4"
                    >
                        <i class="el-icon-delete"></i>
                        删除
                    </router-link>
                    <router-link @click.native="giveUp(scope.row)" to v-if="scope.row.status===1">
                        <i class="el-icon-error"></i>
                        放弃
                    </router-link>
                    <router-link
                            :to="{path:'demandEnd', query:{projectId:scope.row.id}}"
                            v-if="scope.row.status===2"
                    >
                        <i class="el-icon-remove"></i>
                        结束
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
</template>
<script>
    import {httpGet, httpPut, httpDelete} from "@/utils/http.js";
    import {specificDate} from "@/utils/getDate.js";
    import {successTips, message, errTips} from "@/utils/tips.js";
    import {mapMutations, mapActions, mapGetters} from "vuex";
    import {MessageBox} from "element-ui";
    import timeLimit from "@/mixins/regular/timeLimit.js";

    export default {
        mixins: [timeLimit],
        name: "myDemand",
        components: {},
        data() {
            return {
                selectedOptions: [],
                typeList: "",
                loading: false,
                totalPage: 0,
                searchData: {
                    name: "",
                    startTime: null,
                    endTime: null,
                    parentId: null,
                    typeId: null,
                    pageNo: 1,
                    pageSize: 10,
                    orderBy: "id",
                    orderType: "DESC"
                },
                pageData: {
                    name: "",
                    startTime: null,
                    endTime: null,
                    parentId: null,
                    typeId: null,
                    pageSize: 10,
                    pageNo: 1,
                    orderBy: "id",
                    orderType: "DESC"
                },
                options: [],
                selestate: "全部",
                tableData: [],
                demandStatusHeader: "全部",
                demandStatus:[
                    {
                        status:null,
                        title:"全部",
                    },
                    {
                        status:1,
                        title:"竞标中",
                    },
                    {
                        status:2,
                        title:"执行中",
                    },
                    {
                        status:3,
                        title:"完成",
                    },
                    {
                        status:4,
                        title:"非法需求",
                    },
                    {
                        status:5,
                        title:"放弃",
                    },
                ],
            };
        },
        created: function () {
            //获取项目类型数据
            this.GETNORMALTYPE();
            this.searchList();
        },
        computed: {
            ...mapGetters(["getNormalType"])
        },
        methods: {
            ...mapMutations(["setCache"]),
            ...mapActions(["GETNORMALTYPE"]),
            //删除需求
            deleteProject(id) {
                MessageBox.confirm("此操作将删除此需求, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        httpDelete(
                            `/v1/authorization/bid/projectrequirementv/delete/${id}`
                        ).then(results => {
                            const {msg, httpCode} = results.data;
                            if (httpCode === 200) {
                                this.getView()
                                successTips('删除成功')
                            } else if (httpCode === 400) {
                                errTips("页面丟失");
                                this.setCache("myDemand");
                            } else if (httpCode != 500 && httpCode != 401) {
                                errTips(msg);
                            }
                        });
                    })
            },
            //放弃需求
            giveUp(val) {
                MessageBox.confirm("此操作将放弃此需求, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        httpPut("/v1/authorization/bid/giveup/update", {id: val.id}).then(
                            results => {
                                const {msg, httpCode} = results.data;
                                if (httpCode === 200) {
                                    successTips("已成功放弃此需求");
                                    val.status = 5;
                                } else if (httpCode !== 401) {
                                    errTips(msg);
                                }
                            }
                        );
                    })
            },
            //获取页面数据
            getView(val = this.pageData) {
                this.loading = true;
                httpGet("/v1/authorization/bid/search/get", val).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 200) {
                        // this.pageNo = pageNo;
                        this.totalPage = parseInt(data.totalPage + "0");
                        let {typeList, list} = data;
                        this.typeList = typeList;
                        for (let i of list) {
                            for (let p of typeList) {
                                if (i.parentId === p.id) {
                                    i.parentName = p.type;
                                }
                                if (i.typeId === p.id) {
                                    i.typetName = p.type;
                                    i.type = i.parentName + "/" + p.type;
                                }
                            }
                            i.gmtCreate = specificDate(i.gmtCreate);
                            i.gmtModified = specificDate(i.gmtModified);
                        }

                        this.$set(this, "tableData", list);
                        // this.pageData = val;
                        Object.assign(this.pageData, val);
                    } else if (msg == "该条件暂无数据") {
                        this.tableData = [];
                        message("该条件暂无数据");
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                    this.loading = false;
                });
            },
            //页码变化
            handleCurrentChange(val){
                this.pageData.pageNo = val;
                this.getView();
            },
            //搜索
            searchList() {
                let {selestate, searchData, selectedOptions} = this;
                searchData.parentId = selectedOptions[0];
                searchData.typeId = selectedOptions[1];
                if (selestate === "竞标中") {
                    searchData.status = 1;
                } else if (selestate === "执行中") {
                    searchData.status = 2;
                } else if (selestate === "完成") {
                    searchData.status = 3;
                } else if (selestate === "非法需求") {
                    searchData.status = 4;
                } else if (selestate === "放弃") {
                    searchData.status = 5;
                } else {
                    searchData.status = "";
                }
                this.getView(searchData);
            },
            changeDemandStatus(item){
                this.demandStatusHeader = item.title;
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
