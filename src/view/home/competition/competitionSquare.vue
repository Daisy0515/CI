<template>
  <div class="square">
    <div class="responsive resp">
      <div class="module_secondaryHead guruSearch hasBg">
        <div class="container">
          <div class="module_headerCrumb">
            <div class="refinery">
              <div class="searchTitle">
                <p class="searchTitle">
                  <router-link to="competitionSquare">竞赛广场</router-link>
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
                <p class="parentClass" @click="expansionType(index,item)">{{item.label}}</p>
                <p
                  class="typeList"
                  v-for="(items) in item.children"
                  :key="items.value"
                  v-show="item.typeIndex"
                  @click="seleType({parentName:item.label,typeName:items.label,parentId:item.id,typeId:items.value})"
                >{{items.label}}</p>
              </a>
            </li>
          </ul>
        </nav>
        <div class="panelHold boxSize">
          <div class="panel" v-loading="loading">
            <p class="tip" v-show="tipData">暂无数据</p>
            <header class="clearfix"></header>
            <el-input placeholder="请输入内容" class="input-with-select" v-model="searchData.name">
              <el-button slot="append" icon="el-icon-search" @click="getView(searchData)"></el-button>
            </el-input>
            <div class="selectClass clearfix">
              <select v-model="selected" @change="changeSelect">
                <option v-for="(item,index) in optList" :key="index">{{item}}</option>
              </select>
            </div>
            <ul class="services">
              <li class="serviceItem clearfix" v-for="(item,index) in plazaList" :key="index">
                <div class="selector"></div>
                <div class="clearfix rhythmMargin">
                  <div class="serviceHeader clearfix">
                    <span class="servTitle">
                      <h2>
                        <a href="javascript:;">{{item.name}}</a>
                      </h2>
                    </span>
                    <div class="servfeedback">
                      <span class="module_badge feedback-score feedback-score_medium">查看次数：</span>
                      <span class="module_badge">{{item.examineCount}}</span>
                    </div>
                  </div>
                  <div class="serviceMeta" style="padding-left: 6px;">
                    <p class="extras2">{{item.gmtCreate}} 共有{{item.participationCount}}个团队参与竞标</p>
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
                        <router-link :to="{path:'competitionView', query:{id:item.id}}">
                          <span>竞赛详情</span>
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
import { httpGet } from "@/utils/http.js";
import { specificDate as getDate } from "@/utils/getDate.js";
import { message } from "@/utils/tips.js";
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      selected: "最新",
      optList: ["最新", "最热", "查看次数"],
      loading: false,
      tipData: false,
      searchValue: "",
      plazaList: [],
      seleValue: "所有",
      pageNo: 1,
      totalPage: 1,
      parentId: "",
      pageSize: 3,
      typeId: "",
      searchData: {
        name: "",
        parentId: null,
        typeId: null,
        pageNo: 1,
        pageSize: 10,
        orderBy: "id",
        orderType: "DESC"
      },
      pageData: {
        name: "",
        parentId: null,
        typeId: null,
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
  created: function() {
    //获取项目类型
    this.GETNORMALTYPE();
    //获取页面数据
    this.getView();
  },
  methods: {
    ...mapActions(["GETNORMALTYPE"]),
    //所有类型
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
        case "最热":
          this.sort = "participationCount";
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
      let { parentName, typeName, parentId, typeId } = obj;
      this.seleValue = parentName + "/" + typeName;
      this.pageData.parentId = parentId;
      this.pageData.typeId = typeId;
      this.pageData.pageNo = 1;
      this.searchData.parentId = parentId;
      this.searchData.typeId = typeId;
      this.getView();
    },
    //展开类型
    expansionType(index, item) {
      let { getNormalType } = this;
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
    getView(val = this.pageData) {
      this.loading = true;
      // !value && (value = "所有");
	  
//get /v1/public/bid/search/competition 
      httpGet("/v1/public/bid/search/competition", val).then(results => {
        let getData = results.data;
        if (getData.httpCode === 200) {
          this.plazaList = [...getData.data.plazaList];
          this.pageNo = getData.data.pageNo;
          this.totalPage = parseInt(getData.data.totalPage + "0");
          for (let i of this.plazaList) {
            i.gmtCreate = getDate(i.gmtCreate);
          }
          this.loading = false;
          this.tipData = false;
          Object.assign(this.pageData, val);
        } else if (getData.msg === "该条件暂无数据") {
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
</style>