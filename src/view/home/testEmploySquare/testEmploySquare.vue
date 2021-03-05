<template>
    <div class="square">
        <div class="responsive resp">
            <div class="module_secondaryHead guruSearch hasBg">
                <div class="container">
                    <div class="module_headerCrumb">
                        <div class="refinery">
                            <div class="searchTitle">
                                <p class="searchTitle">
                                    <router-link to="testEmploy">内测招募</router-link>
                                    > 招募广场
                                </p>
                            </div>
                        </div>
                        <span class="resultCount"></span>
                    </div>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="clearfix">
                <nav class="switchPanel boxSize">
                    <p class="refinementHeader">选中分类:</p>
                    <router-link to>
                        <p class="searchActive">
                            {{seleValue}}
                            <i class="el-icon-success" style="float:right;cursor: pointer;"></i>
                        </p>
                    </router-link>
                    <router-link to>
                        <p class="clearList" @click="allData">所有</p>
                    </router-link>
                    <ul class="searchRefinement category">
                        <li>
                            <a href="javascript:;" class="active">精选：</a>
                        </li>

                        <li v-for="(item,index) in getNormalType" :key="index">
                            <a href="javascript:;" class="toggleLink" style="display: block;">
                                <p class="parentClass" @click="seleType({typeName:item.label,type:item.value})">
                                    {{item.label}}</p>

                            </a>
                        </li>
                    </ul>
                </nav>
                <div class="panelHold boxSize">
                    <div class="panel" v-loading="loading">
                        <p class="tip" v-show="tipData">暂无数据</p>
                        <header class="clearfix"></header>

                        <div class="e-input-button">
                            <el-input placeholder="请输入内容" class="input-with-select" style="width: 65%;"
                                      v-model="searchData.projectName">
                                <el-button slot="append" icon="el-icon-search" @click="getView(searchData)"></el-button>
                            </el-input>

                            <el-button @click="testPublish" type="primary" size="large"
                                       style="width:200px; margin-left:5%; ">
                                发布测试
                            </el-button>
                        </div>


                        <!-- <div class="see_apply">
                          <router-link :to="{path:'./testPublish'}">
                            <span>发布测试</span>
                          </router-link>
                        </div> -->

                        <div class="selectClass clearfix">
                            <select v-model="selected" @change="changeSelect">
                                <option v-for="(item,index) in optList" :key="index">{{item}}</option>
                            </select>
                        </div>
                        <ul class="services">
                            <li class="serviceItem clearfix" v-for="(item,index) in iteamTestList" :key="index">
                                <div class="selector"></div>
                                <div class="clearfix rhythmMargin">
                                    <div class="serviceHeader clearfix">
                    <span class="servTitle">
                      <h2>
                        <a href="javascript:;">{{item.projectName}}</a>
                      </h2>
                    </span>
                                        <div class="servfeedback">
                                            <span class="module_badge feedback-score feedback-score_medium">查看次数：</span>
                                            <span class="module_badge">{{item.examineCount}}</span>
                                        </div>
                                        <div :class="item.top===1?'up':''"></div><!--置顶特效-->
                                    </div>
                                    <div class="serviceMeta" style="padding-left: 6px;">
                                        <p class="extras2">截止时间：{{item.deadline}} | 所需人数：已有{{item.ownCount}} /
                                            共需{{item.needCount}}</p>
                                        <p class="desc">{{item.detail}}</p>
                                    </div>
                                </div>
                                <div class="clearfix serviceIdentity">
                                    <div class="serviceIdentity__info">
                                        <div class="module_avatar thirtytwo avatar_table">
                                            <div class="avatar">
                                                <a href="javascript:;" title="头像">
                                                    <img
                                                            :src="item.headurl?item.headurl:getnoImg"
                                                            height="25px"
                                                            width="25px"
                                                            align="absmiddle"
                                                            alt="Scopic Software"
                                                    />
                                                </a>
                                            </div>
                                            <div class="avatarinfo">
                                                <p class="subtext">{{item.names?item.names:'未知'}}</p>
                                            </div>
                                            <div class="see_apply">
                                                <router-link :to="{path:'testView', query:{id:item.id}}">
                                                    <span>查看测试</span>
                                                </router-link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="pagerHold">
                        <el-pagination
                                @current-change="handleCurrentChange"
                                :current-page.sync="pageNo"
                                :total="totalPage"
                                layout="prev, pager, next, jumper"
                        ></el-pagination>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {httpGet} from "@/utils/http.js";
    import {specificDate as getDate} from "@/utils/getDate.js";
    import {message} from "@/utils/tips.js";
    import {mapGetters, mapActions} from "vuex";

    export default {
        data() {
            return {
                selected: "最新",
                optList: ["最新", "最热", "查看次数"],
                loading: false,
                tipData: false,
                searchValue: "",
                iteamTestList: [],
                seleValue: "所有",
                pageNo: 1,
                totalPage: 1,
                //parentId: "",
                pageSize: 3,
                types: [], //????
                searchData: {
                    projectName: "",
                    //parentId: null,
                    type: null,
                    pageNo: 1,
                    pageSize: 10,
                    orderBy: "id",
                    orderType: "DESC"
                },
                pageData: {
                    projectName: "",
                    //parentId: null,
                    type: null,
                    pageSize: 10,
                    pageNo: 1,
                    orderBy: "id",
                    orderType: "DESC"
                },
                sort: "id"
            };
        },
        computed: {
            ...mapGetters(["getnoImg", "getNormalType"])
        },
        created: function () {
            //获取项目类型
            //获取项目类型
            this.GETNORMALTYPE();
            this.getTypeList();
            //获取页面数据
            this.getView();
        },
        methods: {
            ...mapActions(["GETNORMALTYPE"]),
            getTypeList() {
                httpGet("/v1/public/bid/typeall/get").then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 200) {
                        // 筛选得到父类别
                        this.types = data.list.filter(function (item) {
                            if (item.parentId === 0)
                                return item;
                        })
                    }
                })
                //alert(this.types);
            },
            //所有类型
            allData() {
                const empty = {
                    projectName: null,
                    type: null,
                    //parentId: null,
                    pageNo: null
                };
                Object.assign(this.pageData, empty);
                Object.assign(this.searchData, empty);
                for (let i of this.getNormalType) {
                    i.typeIndex = false;
                }
                this.getView();
                this.seleValue = "所有";
            },
            //排序更换
            changeSelect() {
                switch (this.selected) {
                    case "最新":
                        this.sort = "id";
                        break;
                    case "最热":
                        this.sort = "ownCount";
                        break;
                    case "查看次数":
                        this.sort = "examineCount";
                        break;
                }
                this.pageData.orderBy = this.sort;
                this.searchData.orderBy = this.sort;
                this.pageData.pageNo = 1;
                this.getView();
            },
            //页码变化
            handleCurrentChange(val) {
                this.pageData.pageNo = val;
                this.getView();
            },
            //选择类型
            seleType(obj) {
                let {typeName, type} = obj;
                this.seleValue = typeName;
                // this.pageData.parentId = parentId;
                this.pageData.type = type;
                this.pageData.pageNo = 1;
                //this.searchData.parentId = parentId;
                this.searchData.type = type;
                this.getView();
            },

            getView(val = this.pageData) {
                this.loading = true;
                // !value && (value = "所有");
                httpGet("/v1/public/bid/search/itemtest", val).then(results => {
                    let getData = results.data;
                    if (getData.httpCode === 200) {
                        this.iteamTestList = [...getData.data.iteamTestList];
                        this.pageNo = getData.data.pageNo;
                        this.totalPage = parseInt(getData.data.totalPage + "0");
                        for (let i of this.iteamTestList) {
                            i.deadline = getDate(i.deadline);
                        }
                        this.loading = false;
                        this.tipData = false;
                        Object.assign(this.pageData, val);
                    } else if (getData.msg === "该条件暂无数据") {
                        this.loading = false;
                        this.iteamTestList = [];
                        this.tipData = true;
                        message("暂无数据");
                    }
                });
            },

            testPublish() {
                this.$router.push({path: "./testPublish"});
            }
        }
    };
</script>
<style lang='scss'>
    @import "@/assets/scss/square.scss";

    .up:before {
        position: absolute;
        z-index: 1;
        right: 100px;
        top: 5px;
        height: 0;
        padding-right: 10px;
        line-height: 0;
        color: white;
        border: 15px solid #7cabb1;
        background-color: #7cabb1;
        border-right-color: white;
        content: "置顶";
        box-shadow: 0 5px 5px -5px #000;
    }
</style>
