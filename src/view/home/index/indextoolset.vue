<template>
    <div>
        <router-link
                :to="{name:'toolsetView',query:{id:item.id}}"
                v-for="(item,index) in toolsetList"
                :key="index"
                class="index_toolset_item"
        >
        <tool-box :title="item.title"></tool-box>
        </router-link>
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
    .index_toolset_item {
        display: inline-block;
        margin: 0px 15px 68px 15px;
        width: 165px;
        height: 165px;
    }
</style>
