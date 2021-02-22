<template>
    <div class="ttoolset">
        <router-link :to="{path:'applicationAccession', query:{id:item.id}}" v-for="(item, index) in plazaList" :key="index">
            <div style=" vertical-align:middle; margin-top:8%">
                <img src="./icon.png"
                     style="width:50px; height:50px; border-radius:50%; margin-left: 5%; ">
                <div style="display: inline-block; margin-left:15px;">
                    <div style="margin-bottom: 10px">
                        <a style="font-size: 18px;font-family: PingFang HK;font-weight: 500;color: #011A24;">{{
                                item.teamName
                            }}</a>
                    </div>
                    <div style="margin-top: -5px">
                        <a style="width: 175px;
                    font-size: 14px;
                    font-family: PingFang HK;
                    font-weight: 500;
                    color: #788DA4;"
                    >{{ item.requirement }} </a>
                    </div>
                </div>
            </div>
        </router-link>
    </div>
</template>

<script>
import {httpGet} from "@/utils/http.js";
import {errTips, message} from "@/utils/tips.js";
import {specificDate} from "@/utils/getDate";

export default {
    name: "ToolSet",
    data() {
        return {
            pageData: {
                name: "",
                parentId: null,
                typeId: null,
                pageSize: 10,
                pageNo: 1,
                orderBy: "id",
                orderType: "DESC"
            },
            plazaList:[],
            teams: [
                {
                    name: "优枫科技",
                    member: 6,
                    project: 123,
                },
                {
                    name: "花鲤在线",
                    member: 30,
                    project: 120,
                },
                {
                    name: "KEVINA工作室",
                    member: 12,
                    project: 102,
                },
                {
                    name: "TONY工作室",
                    member: null,
                    project: 102,
                }, {
                    name: "TIM工作室",
                    member: 12,
                    project: null,
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
        this.getTeams();
    },
    methods: {
        getTeams(val = this.pageData) {
            this.loading = true;
            httpGet("/v1/public/bid/search/getteaminfo", val).then(results => {
                let getData = results.data;
                if (getData.httpCode === 200) {
                    this.plazaList = [...getData.data.teamGroupInfoList].slice(0, 5);
                    console.log("98", this.plazaList);
                    this.pageData.pageNo = getData.data.pageNo;
                    this.totalPage = parseInt(getData.data.totalPage + "0");
                    for (let i of this.plazaList) {
                        i.gmtCreate = specificDate(i.gmtCreate);
                    }
                    this.loading = false;
                    this.tipData = false;
                    Object.assign(this.pageData, val);
                    // this.seleValue = value;
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
