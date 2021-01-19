<template>
    <div class="applicationView">
        <div class="hasBg">
            <div class="container">
                <div class="module_headerCrumb">
                    <div class="searchTitle">
                        <p class="searchTitle">
                            <router-link to="service">工具集</router-link>
                            >
                            更多
                        </p>
                    </div>
                    <span class="resultCount"></span>
                </div>
            </div>
        </div>
        <div class="container">
            <router-link
                    class="toolset_item"
                    :to="{name:'toolsetView',query:{id:item.id,type:'more'}}"
                    v-for="(item,index) in moreData"
                    :key="index"
            >
                <el-card>
                    <p>{{item.title}}</p>
                </el-card>
            </router-link>
        </div>
    </div>
</template>

<script>
    import {httpGet} from "@/utils/http.js";
    import {errTips} from "@/utils/tips.js";

    export default {
        data() {
            return {
                moreData: []
            };
        },
        created: function () {
            httpGet('/v1/public/share/get/all').then(results => {
                const {httpCode, msg, data} = results.data;
                if (httpCode === 200) {
                    this.moreData = data;
                } else if (httpCode !== 500 && httpCode !== 401) {
                    errTips(msg)
                }
            })
        }
    };
</script>
<style lang='scss'>
    .toolset_item {
        cursor: pointer;
        float: left;
        width: 255px;
        text-align: center;
        margin: 4% 4% 5% 4%;
        height: 180px;

        & :hover {
            background: #f0f0f0;
        }

        .el-card {
            height: 100%;
        }

        .el-card__body {
            height: 100%;
            padding: 0;
        }

        p {
            line-height: 170px;
        }
    }
</style>
