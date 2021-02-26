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
        <div  class="container">
            <router-link
                    class="ttoolset_item"
                    :to="{name:'toolsetView',query:{id:item.id,type:'more'}}"
                    v-for="(item,index) in moreData"
                    :key="index"
            >
                <tool-box :title="item.title"></tool-box>
            </router-link>
        </div>
    </div>
</template>

<script>
    import {httpGet} from "@/utils/http.js";
    import {errTips} from "@/utils/tips.js";
   import ToolBox from "@/view/home/service/toolBox.vue";

    export default {
        name: "IndexToolSet",
        components: {
            ToolBox
        },
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
    .ttoolset_item {
        display: inline-block;
        margin: 34px 22px 34px 22px;
        width: 250px;
        height: 165px;
    }
</style>
