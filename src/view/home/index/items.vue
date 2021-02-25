<template>
    <div class="ttoolset">
        <router-link :to="{path:'applicationView', query:{id:item.id}}" v-for="(item, index) in plazaList" :key="index">
<!--        <div v-for="(item, index) in items" :key="index">-->
            <div style=" vertical-align:middle; margin-top:8%">
                <img src="./icon_manager.png"
                     style="width:80px; height:80px;  margin-left: 7%;  ">
                <div style="display: inline-block; margin-left:15px;">
                    <div style="margin-bottom: 10px; position: relative; margin-top: 10px;">
                        <a style="font-size: 18px;font-family: PingFang HK;font-weight: 500;color: #011A24;">{{
                                item.name
                            }}</a>
<!--                        <a style="width: 40px;height: 14px;font-size: 14px;font-family: Adobe Heiti Std;-->
<!--                            font-weight: normal;background-color: rgb(2 26 36);color: #cccccc;margin-left: 40px;"-->
<!--                           v-if="item.status === '开发中'">开发中</a>-->
<!--                        <a style="width: 41px;height: 14px;font-size: 14px;font-family: Adobe Heiti Std;-->
<!--                            font-weight: normal;color: #FFFFFF;background-color: rgb(187 198 209);margin-left: 40px;"-->
<!--                           v-if="item.status === '已结束'">已结束</a>-->
                        <div style="float:right; position:absolute; right:-80px; top:-3px;width: 77px;height: 14px;
                            font-size: 18px;font-family: PingFang HK;font-weight: 500;color: #788DA4;">
                            No.{{ item.id }}
                        </div>
                    </div>
                    <div style="margin-top: -5px">
                        <a style="width: 175px;
                            font-size: 14px;
                            font-family: PingFang HK;
                            font-weight: 500;
                            color: #788DA4;"
                        >需求：{{ item.requirement }}</a>
                    </div>
                    <div style="margin-top: -5px">
                        <a style="width: 175px;
                            font-size: 14px;
                            font-family: PingFang HK;
                            font-weight: 500;
                            color: #788DA4;"
                        >发布者：{{ item.names }}&emsp; &emsp; &emsp; &emsp; &emsp;发布时间：{{ item.gmtCreate }}</a>
                    </div>
                    <div style="margin-top: -5px">
                        <a style="width: 175px;
                            font-size: 14px;
                            font-family: PingFang HK;
                            font-weight: 500;
                            color: #788DA4;"
                    > 已有{{ item.examineCount }}人查看&emsp; &emsp; &emsp; &emsp; &emsp;已有{{ item.participationCount }} 人报名</a>
                    </div>
                </div>
            </div>
<!--        </div>-->
        </router-link>
    </div>
</template>

<script>
import {httpGet} from "@/utils/http.js";
import {errTips, message} from "@/utils/tips.js";
import {specificDate as getDate} from "@/utils/getDate";

export default {
    name: "ToolSet",
    data() {
        return {
            plazaList:[],
            pageData: {
                name: "",
                parentId: null,
                typeId: null,
                pageSize: 10,
                pageNo: 1,
                orderBy: "id",
                orderType: "DESC"
            },
            items: [//biddingSquare.Vue
                {
                    no: 23915,
                    title: "校园跑腿小程序",
                    type: "小程序",
                    period: 20,
                    post_time: 2,
                    enroll: 2,
                    status: "开发中",
                    requirement: "lalalalalalalalala",
                },
                {
                    no: 23915,
                    title: "校园跑腿APP",
                    type: "小程序",
                    period: 20,
                    post_time: 2,
                    enroll: 2,
                    status: "开发中",
                    requirement: "lalalalalalalalala",
                },
                {
                    no: 23915,
                    title: "校园跑腿网站改版",
                    type: "小程序",
                    period: 20,
                    post_time: 2,
                    enroll: 2,
                    status: "已结束",
                    requirement: "lalalalalalalalala",
                },
            ]
        };
    },
    created: function () {
        httpGet("/v1/public/share/get/top").then(results => {
            const {httpCode, data, msg} = results.data;
            if (httpCode === 200) {
                this.toolsetList = data;
            } else if (httpCode !== 401) {
                errTips(msg);
            }
        });
        this.getView();
    },
    methods: {
        getView(val = this.pageData) {
            this.loading = true;
            // !value && (value = "所有");
            httpGet("/v1/public/bid/search/getplaza", val).then(results => {
                let getData = results.data;
                console.log("getData:", getData);
                if (getData.httpCode === 200) {
                    this.plazaList = [...getData.data.plazaList].slice(0, 3);
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
.ttoolset {
    width: 100%;

    .ttoolset_item {
        opacity: 0.8;
        box-shadow: 25px 0 25px -25px #999, -25px 0 25px -25px #999;
        cursor: pointer;
        // float: left;
        display: inline-block;
        width: 165px;
        margin-right: 30px;
        margin-bottom: 68px;
        height: 165px;


        & :hover {
            background: #80CCD0;
            color: #FFFFFF;
            box-shadow: 25px 0 25px -25px #ABC8CC, -25px 0 25px -25px #ABC8CC;
        }

        .el-card {
            height: 100%;
            border: none;
        }

        .el-card__body {
            height: 100%;
            padding: 0;
        }

        p {
            font-size: 24px;
            font-family: PingFang HK;
            font-weight: 500;
            color: #011A24;
            line-height: 30px;
            margin: 60px 20px 60px 20px;
        }
    }
}
</style>
