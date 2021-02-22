<template>
    <div class="ttoolset">
        <router-link
                :to="{name:'toolsetView',query:{id:item.id}}"
                v-for="(item,index) in toolsetList"
                :key="index"
                class="ttoolset_item"
        >
            <el-card>
                <p>{{item.title}}</p>
            </el-card>
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
                toolsetList: []
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
            box-shadow:25px 0 25px -25px #999, -25px 0 25px -25px #999;
            cursor: pointer;
            // float: left;
            display: inline-block;
            width: 165px;
            margin-right:30px;
            margin-bottom: 68px;
            height: 165px;
            

            & :hover {
                background: #80CCD0;
                color: #FFFFFF;
                box-shadow:25px 0 25px -25px #ABC8CC, -25px 0 25px -25px #ABC8CC;
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
                margin:60px 20px 60px 20px;
            }
        }
    }
</style>
