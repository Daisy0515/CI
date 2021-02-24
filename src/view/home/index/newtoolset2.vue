<template>
    <div class="ttoolset">
        <router-link
                :to="{name:'toolsetView',query:{id:toolsetList[index-1].id}}"
                v-for="index in 5"
                :key="index"
        >
            <div style=" vertical-align:middle; margin-top:8%">
                <img src="./icon.png"
                     style="width:50px; height:50px; border-radius:50%; margin-left: 5%; ">
                <div style="display: inline-block; margin-left:15px;">
                    <div style="margin-bottom: 10px">
                        <a style="font-size: 18px;font-family: PingFang HK;font-weight: 500;color: #011A24;">{{
                                toolsetList[index-1].title
                            }}</a>
                    </div>
                    <div style="margin-top: -5px">
                        <a style="width: 175px;
                    font-size: 14px;
                    font-family: PingFang HK;
                    font-weight: 500;
                    color: #788DA4;
                    ">{{ description[index-1] }} </a>
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
            tag: false,
            description: [],
        };
    },
    created: function () {
        this.getTools();
    },
    watch: {
        tag: {
            handler() {
                this.getDescription();
            }
        },
    },
    methods: {
        getTools() {
            httpGet("/v1/public/share/get/top").then(results => {
                const {httpCode, data, msg} = results.data;
                if (httpCode === 200) {
                    this.toolsetList = data;
                    this.tag = !this.tag;
                } else if (httpCode !== 401) {
                    errTips(msg);
                }
            });
        },
        // getDescription(){
        //     for (let i = 0; i < 5; i++) {
        //         httpGet("/v1/public/share/get/select", {id: this.toolsetList[i].id}).then(
        //                 results => {
        //                     const {httpCode, data, msg} = results.data;
        //                     if (httpCode === 200) {
        //                         let se = data.description;
        //                         if (se === null) {
        //                             se = this.toolsetList[i].title;
        //                         }
        //                         if (se.length < 20) {
        //                             this.toolsetList[i]["description"] = se;
        //                         } else {
        //                             this.toolsetList[i]["description"] = se.slice(0, 20) + "……";
        //                         }
        //                         console.log(81, this.toolsetList[i]);
        //                     } else if (httpCode !== 401) {
        //                         errTips(msg);
        //                     }
        //                 }
        //         );
        //     }
        // },
        getDescription() {
            for (let i = 0; i < 5; i++) {
                httpGet("/v1/public/share/get/select", {id: this.toolsetList[i].id}).then(
                        results => {
                            const {httpCode, data, msg} = results.data;
                            if (httpCode === 200) {
                                let se = data.description;
                                this.description.push(se);
                            } else if (httpCode !== 401) {
                                errTips(msg);
                            }
                        }
                );
            }
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
