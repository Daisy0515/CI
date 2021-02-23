<template>
    <div class="square">
        <div class="responsive resp">
            <div class="module_secondaryHead guruSearch hasBg">
                <div class="container">
                    <div class="module_headerCrumb">
                        <div class="refinery">
                            <div class="h1 searchTitle">
                                <h1>经典案例</h1>
                                <h2>
                  <span>
                    搜索最符合您的经典案例，点击
                    <router-link to="publishtask">发布需求</router-link>。可以发布任务群智群策!
                  </span>
                                </h2>
                            </div>
                        </div>
                        <span class="resultCount"></span>
                    </div>
                </div>
            </div>
        </div>
        <div class="container">
            <article class="clearfix">
                <nav class="switchPanel boxSize">
                    <p class="refinementHeader">选中分类:</p>
                    <router-link to>
                        <p class="searchActive">
                            {{ seleValue }}
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
                                <p class="parentClass" @click="expansionType(index,item)">{{ item.label }}</p>
                                <p
                                        class="typeList"
                                        v-for="(items) in item.children"
                                        :key="items.value"
                                        v-show="item.typeIndex"
                                        @click="seleType({parentName:item.label,typeName:items.label,parentId:item.id,typeId:items.value})"
                                >{{ items.label }}</p>
                            </a>
                        </li>
                    </ul>
                </nav>

                <div class="panelHold boxSize" id="panelHold">
                    <div class="panel" v-loading="loading">
                        <p class="tip" v-show="tipData">暂无数据</p>
                        <header class="clearfix"></header>
                        <el-input
                                placeholder="请输入内容"
                                class="input-with-select"
                                v-model="searchData.projectName"
                        >
                            <el-button slot="append" icon="el-icon-search" @click="getView(searchData)"></el-button>
                        </el-input>
                        <div class="selectClass clearfix">
                            <select v-model="selected" @change="changeSelect">
                                <option>请选择</option>
                                <option v-for="(item,index) in optList" :key="index">{{ item }}</option>
                            </select>
                        </div>
                        <ul class="services">
                            <li class="serviceItem clearfix" v-for="(item,index) in plazaList" :key="index">
                                <div class="selector"></div>
                                <div class="clearfix rhythmMargin">
                                    <div class="serviceHeader clearfix">
                    <span class="servTitle">
                      <h2>
                        <a href="javascript:;">{{ item.projectName }}</a>
                      </h2>
                    </span>
                                        <div class="servfeedback">
                      <span class="small_icon">
                        <i
                                @click="zanCollection(item,1)"
                                :class="item.isCollect ===1?'icon iconfont icon-shoucang1':'icon iconfont icon-shoucang'"
                        ></i>
                        {{ item.collectCount }}
                      </span>
                                            <span class="small_icon">
                        <i
                                @click="zanCollection(item,2)"
                                :class="item.isGive===1?'icon iconfont icon-dianzan1':'icon iconfont icon-dianzan2'"
                        ></i>
                        {{ item.giveCount }}
                      </span>
                                            <span class="small_icon">
                        <i class="icon iconfont icon-xiazai"></i>
                        {{ item.loadCount }}
                      </span>
                                            <span class="small_icon">
                        <i class="icon iconfont icon-chakan"></i>
                        {{ item.examineCount }}
                      </span>
                                        </div>
                                    </div>
                                    <div :class="item.top===1?'up':''"></div><!--置顶特效-->
                                    <div class="serviceMeta" style="padding-left: 6px;">
                                        <p class="extras2">{{ item.gmtCreate }}</p>
                                        <p class="desc">{{ item.detail }}</p>
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
                                                <p class="subtext">{{ item.name ? item.name : '未知' }}</p>
                                            </div>
                                            <div class="see_apply">
                                                <router-link :to="{path:'caseDetails', query:{id:item.id}}">
                                                    <span>查看</span>
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
            </article>
        </div>
    </div>
</template>

<script>
import {httpGet, httpPut} from "@/utils/http.js";
import {specificDate as getDate} from "@/utils/getDate.js";
import {message, successTips} from "@/utils/tips.js";
import {mapGetters, mapActions} from "vuex";

export default {
    data() {
        return {
            selected: "请选择",
            optList: ["最新", "下载次数", "查看次数"],
            loading: false,
            searchValue: "",
            plazaList: [],
            seleValue: "所有",
            tipData: false,
            pageNo: 1,
            totalPage: 1,
            parentId: "",
            pageSize: 10,
            typeId: "",
            sort: "id",
            searchData: {
                projectName: "",
                parentId: null,
                typeId: null,
                pageNo: 1,
                pageSize: 10,
                orderBy: "id",
                orderType: "DESC"
            },
            pageData: {
                projectName: "",
                parentId: null,
                typeId: null,
                pageSize: 10,
                pageNo: 1,
                orderBy: "id",
                orderType: "DESC"
            }
        };
    },
    created: function () {
        //获取项目类型
        this.GETNORMALTYPE();
        if (this.$route.query.search) {
            this.searchData.projectName = this.$route.query.search;
            this.getView(this.searchData);
        } else if (this.$route.query.type) {
            this.pageData.parentId = this.$route.query.type;
            this.seleValue = this.$route.query.title;
            this.getView();
        } else {
            this.getView();
        }
    },
    computed: {
        ...mapGetters(["getuserData", "getnoImg", "getNormalType"])
    },
    methods: {
        ...mapActions(["GETNORMALTYPE"]),
        zanCollection(item, status) {
            httpPut("/v1/authorization/classic/collectgive/classic", {
                id: item.id,
                status: status
            }).then(results => {
                if (results.data.httpCode === 200) {
                    if (status === 1) {
                        item.isCollect === 1 ? (item.isCollect = 0) : (item.isCollect = 1);
                        item.isCollect === 1
                                ? (item.collectCount += 1)
                                : (item.collectCount -= 1);
                        item.isCollect === 1
                                ? successTips("收藏成功")
                                : successTips("已取消收藏");
                    } else if (status === 2) {
                        item.isGive === 1 ? (item.isGive = 0) : (item.isGive = 1);
                        item.isGive === 1 ? (item.giveCount += 1) : (item.giveCount -= 1);
                        item.isGive === 1
                                ? successTips("点赞成功")
                                : successTips("已取消点赞");
                    }
                } else if (results.data.httpCode === 400) {
                    message("请登录账号再进行此操作");
                }
            });
        },
        allData() {
            const empty = {
                name: null,
                typeId: null,
                parentId: null,
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
                case "下载次数":
                    this.sort = "loadCount";
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
            let {parentName, typeName, parentId, typeId} = obj;
            this.seleValue = parentName + "/" + typeName;
            this.pageData.parentId = parentId;
            this.pageData.typeId = typeId;
            this.searchData.parentId = parentId;
            this.searchData.typeId = typeId;
            this.pageData.pageNo = 1;
            this.getView();
        },
        //展开类型
        expansionType(index, item) {
            let {getNormalType} = this;
            if (getNormalType[index].typeIndex) {
                getNormalType[index].typeIndex = !getNormalType[index].typeIndex;
                return false;
            }
            for (let i of getNormalType) {
                i.typeIndex = false;
            }
            getNormalType[index].typeIndex = !getNormalType[index].typeIndex;
            this.pageData.parentId = item.value;
            this.pageData.typeId = "";
            this.seleValue = item.label;
            this.getView();
        },
        //获取页面数据
        getView(val = this.pageData) {
            this.loading = true;
            // !value && (value = "所有");
            httpGet("/v1/public/bid/classiccase/list", val).then(results => {
                let getData = results.data;
                if (getData.httpCode === 200) {
                    this.plazaList = [...getData.data.classicCaseList];
                    this.pageData.pageNo = getData.data.pageNo;
                    this.totalPage = parseInt(getData.data.totalPage + "0");
                    for (let i of this.plazaList) {
                        i.gmtCreate = getDate(i.gmtCreate);
                    }
                    this.loading = false;
                    Object.assign(this.pageData, val);
                    this.tipData = false;
                    // this.seleValue = value;
                } else if (getData.msg == "该条件暂无数据") {
                    this.loading = false;
                    this.plazaList = [];
                    this.tipData = true;
                    message("暂无数据");
                }
            });
        }
    }
};
</script>
<style lang='scss'>
@import "@/assets/scss/square.scss";

.up:before {
    position: absolute;
    z-index: 1;
    right: 170px;
    top: 5px;
    height: 0;
    padding-right: 10px;
    line-height: 0;
    color: white;
    border: 15px solid #4c83c3;
    background-color: #4c83c3;
    border-right-color: white;
    content: "置顶";
    box-shadow: 0 5px 5px -5px #000;
}
</style>
