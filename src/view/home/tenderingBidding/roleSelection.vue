<template>
    <div class="Tendering">
        <div class="responsive resp">
            <div class="module_secondaryHead guruSearch hasBg">
                <div class="container">
                    <div class="module_headerCrumb">
                        <div class="refinery">
                            <div class="h1 searchTitle">
                                <p class="searchTitle">招标投标</p>
                            </div>
                        </div>
                        <span class="resultCount"></span>
                    </div>
                </div>
            </div>
        </div>
        <div class="container clearfix">
            <router-link
                    :to="item.url"
                    v-for="(item,index) in list"
                    :key="index"
                    ondragstart="return false"
            >
                <el-card class="role">
                    <i :class="item.icon"></i>
                    <div class="card_text">
                        {{item.soleName}}
                    </div>
                </el-card>
            </router-link>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                list: [
                    {
                        url: "releaseProcess",
                        soleName: "项目发布角色",
                        icon: "icon iconfont icon-faburen"
                    },
                    {
                        url: "managerProcess",
                        soleName: "项目经理角色",
                        icon: "icon iconfont icon-chengshijinglitianchong"
                    },
                    {
                        url: "memberProcess",
                        soleName: "项目成员角色",
                        icon: "icon iconfont icon-yonghu"
                    }
                ]
            };
        }
    };
</script>
<style lang='scss'>
    @import "@/assets/scss/roleSelection.scss";
</style>
