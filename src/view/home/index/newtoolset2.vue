<template>
    <div class="ttoolset">
        <router-link
                :to="{name:'toolsetView',query:{id:item.id}}"
                v-for="(item,index) in toolsetList"
                :key="index"
        >
            <div style=" vertical-align:middle; margin-top:8%">
                <img src="./icon.png"
                     style="width:50px; height:50px; border-radius:50%; margin-left: 5%; ">
                <div style="display: inline-block; margin-left:15px;">
                    <div style="margin-bottom: 10px">
                        <a style="font-size: 18px;//font-family: PingFang HK;font-weight: 500;color: #011A24;">{{
                                item.title
                            }}</a>
                    </div>
                    <div style="margin-top: -5px">
                        <a style="width: 175px;
                    font-size: 14px;
                    //font-family: PingFang HK;
                    font-weight: 500;
                    color: #788DA4;
                    ">{{ item.description }} </a>
                    </div>
                </div>
            </div>
        </router-link>
    </div>
</template>

<script>
import {httpGet} from "@/utils/http.js";
import {errTips} from "@/utils/tips.js";

export default {
    name: "ToolSet",
    data() {
        return {
            toolsetList: [],
            iconList: [require('./1.png'),
                require('./2.png'),
                require('./3.png'),
                require('./4.png'),
                require('./5.png'),
                require('./6.png'),
                require('./7.png'),
                require('./8.png'),
                require('./9.png'),
                require('./10.png'),
                require('./11.png'),
                require('./12.png'),
                require('./13.png'),
                require('./14.png'),
            ],
        };
    },
    created: function () {
        this.getTools();
    },
    watch: {
    },
    methods: {
        getTools() {
            httpGet("/v1/public/share/get/top").then(results => {
                const {httpCode, data, msg} = results.data;
                if (httpCode === 200) {
                    this.toolsetList = data.slice(0, 5);
                } else if (httpCode !== 401) {
                    errTips(msg);
                }
            });
        },
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
            //font-family: PingFang HK;
            font-weight: 500;
            color: #011A24;
            line-height: 30px;
            margin: 60px 20px 60px 20px;
        }
    }
}
</style>
