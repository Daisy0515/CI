<template>
    <div class="ttoolset">
        <div v-for="(item, index) in items" :key="index">
            <div style=" vertical-align:middle; margin-top:8%">
                <img src="./icon_manager.png"
                     style="width:80px; height:80px;  margin-left: 7%;  ">
                <div style="display: inline-block; margin-left:15px;">
                    <div style="margin-bottom: 10px; position: relative; margin-top: 10px;">
                        <a style="font-size: 18px;font-family: PingFang HK;font-weight: 500;color: #011A24;">{{
                                item.title
                            }}</a>
                        <a style="width: 40px;height: 14px;font-size: 14px;font-family: Adobe Heiti Std;
                            font-weight: normal;background-color: rgb(2 26 36);color: #cccccc;margin-left: 40px;"
                           v-if="item.status === '开发中'">开发中</a>
                        <a style="width: 41px;height: 14px;font-size: 14px;font-family: Adobe Heiti Std;
                            font-weight: normal;color: #FFFFFF;background-color: rgb(187 198 209);margin-left: 40px;"
                           v-if="item.status === '已结束'">已结束</a>
                        <div style="float:right; position:absolute; right:-180px; top:-3px;width: 77px;height: 14px;
                            font-size: 18px;font-family: PingFang HK;font-weight: 500;color: #788DA4;">
                            No.{{ item.no }}
                        </div>
                    </div>
                    <div style="margin-top: -5px">
                        <a style="width: 175px;
                            font-size: 14px;
                            font-family: PingFang HK;
                            font-weight: 500;
                            color: #788DA4;"
                        >类型：{{ item.type }}&emsp; &emsp; &emsp; &emsp; &emsp;周期：{{ item.period }}天</a>
                    </div>
                    <div style="margin-top: -5px">
                        <a style="width: 175px;
                            font-size: 14px;
                            font-family: PingFang HK;
                            font-weight: 500;
                            color: #788DA4;"
                    > {{ item.post_time }} 天前发布 &emsp; &emsp; &emsp; &emsp; &emsp;&nbsp;&nbsp;&nbsp;{{ item.enroll }}
                            人报名</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {httpGet} from "@/utils/http.js";
import {errTips} from "@/utils/tips.js";

export default {
    name: "ToolSet",
    data() {
        return {

            items: [//biddingSquare.Vue
                {
                    no: 23915,
                    title: "校园跑腿小程序",
                    type: "小程序",
                    period: 20,
                    post_time: 2,
                    enroll: 2,
                    status: "开发中",
                },
                {
                    no: 23915,
                    title: "校园跑腿APP",
                    type: "小程序",
                    period: 20,
                    post_time: 2,
                    enroll: 2,
                    status: "开发中",
                },
                {
                    no: 23915,
                    title: "校园跑腿网站改版",
                    type: "小程序",
                    period: 20,
                    post_time: 2,
                    enroll: 2,
                    status: "已结束",
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
    },
    methods: {}
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
