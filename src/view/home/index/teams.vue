<template>
    <div class="ttoolset">
        <router-link :to="{path:'applicationAccession', query:{id:item.id}}" v-for="(item, index) in plazaList" :key="index">
            <div style=" vertical-align:middle; margin-top:8%">
                <img :src="item.headurl"
                     style="width:50px; height:50px; border-radius:50%; margin-left: 5%; ">
                <div style="display: inline-block; margin-left:15px;">
                    <div style="margin-bottom: 10px">
                        <a style="font-size: 18px;//font-family: PingFang HK;font-weight: 500;color: #011A24;">{{
                                item.teamName
                            }}</a>
                    </div>
                    <div style="margin-top: -5px; ">
                        <a style="
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
        };
    },
    created: function () {
        this.getTeams();
    },
    methods: {
        checkImgExists(imgUrl) {
            return new Promise(function(resolve, reject) {
                var ImgObj = new Image();
                ImgObj.src = imgUrl;
                ImgObj.onload = function(res) {
                    resolve(res);
                }
                ImgObj.onerror = function(err) {
                    reject(err)
                }
            })
        },
        getTeams(val = this.pageData) {
            this.loading = true;
            httpGet("/v1/public/bid/search/getteaminfo", val).then(results => {
                let getData = results.data;
                if (getData.httpCode === 200) {
                    this.plazaList = [...getData.data.teamGroupInfoList].slice(0, 5);
                    console.log(58, this.plazaList);
                    this.pageData.pageNo = getData.data.pageNo;
                    this.totalPage = parseInt(getData.data.totalPage + "0");
                    for (let i of this.plazaList) {
                        i.gmtCreate = specificDate(i.gmtCreate);
                    }
                    this.loading = false;
                    this.tipData = false;
                    Object.assign(this.pageData, val);
                    for(let i=0; i<5; i++){
                        this.checkImgExists(this.plazaList[i].headurl).then(()=>{

                        }).catch(()=>{
                            this.plazaList[i].headurl = require("./icon.png");
                        })
                        if(this.plazaList[i].teamName!==null && this.plazaList[i].teamName.length > 15){
                            this.plazaList[i].teamName = this.plazaList[i].teamName.slice(0, 15) + "……";
                        }
                        if(this.plazaList[i].requirement.length > 20){
                            this.plazaList[i].requirement = this.plazaList[i].requirement.slice(0, 15) + "……";
                        }
                    }
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
