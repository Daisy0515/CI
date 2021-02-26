<template>
    <div class="ttoolset">
        <router-link
                :to="{name:'toolsetView',query:{id:item.id}}"
                v-for="(item,index) in toolsetList"
                :key="index"
                class="ttoolset_item"
        >
           <tool-box :title="item.title"></tool-box>
        </router-link>
        <router-link to="moreToolset" class="ttoolset_item">
           <tool-box title="更多"></tool-box>
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
    .ttoolset_item {
        display: inline-block;
        margin: 34px 22px 34px 22px;
        width: 250px;
        height: 165px;
    }
</style>
