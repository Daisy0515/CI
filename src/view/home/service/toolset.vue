<template>
    <div class="toolset">
        <router-link
                :to="{name:'toolsetView',query:{id:item.id}}"
                v-for="(item,index) in toolsetList"
                :key="index"
                class="toolset_item"
        >
            <el-card>
                <p>{{item.title}}</p>
            </el-card>
        </router-link>
        <router-link to="moreToolset" class="toolset_item">
            <el-card>
                <p>更多</p>
            </el-card>
        </router-link>
    </div>
</template>

<script>
    import {httpGet} from "@/utils/http.js";
    import {errTips} from "@/utils/tips.js";

    export default {
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
    .toolset {
        width: 100%;
        margin: 0 auto;

        .toolset_item {
            cursor: pointer;
            float: left;
            width: 220px;
            text-align: center;
            margin: 0 4% 8% 4%;
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
    }
</style>
