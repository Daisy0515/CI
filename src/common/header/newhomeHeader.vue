<template>
    <div class="homeHead clearfix">
        <nav class="c-header " style="color: white;">
            <div class="o-container">
                <div class="c-header__row">
                    <div class="c-header__logowrap">
                        <router-link :to="indexUrl">
                            <img :src="logoUrl">
                        </router-link>
                    </div>
                    <div class="cc-header__options" v-if="!getUser">
                        <router-link to="login" class="lloginBtn"><a href>登入</a></router-link>
                        <router-link to="selectRole" class="rregisterBtn">注册</router-link>
                    </div>
                    <div>
                        <ul class="c-header__navigation">
                            <li class="c-header__navigation__item" v-for="item in items" :key="item.title">
                                <router-link :to="item.url">
                                    <a v-bind:href="item.url" v-bind:title="title" style="
font-size: 14px;
font-family: PingFang HK;
font-weight: 300;
color: #011A24;">{{ item.title }}</a>
                                </router-link>
                            </li>
                            <li class="c-header__navigation__item">
                                <a :href="landaryUrl" target="_blank" style="
font-size: 14px;
font-family: PingFang HK;
font-weight: 300;
color: #011A24;">蓝凌云平台</a>
                            </li>
                        </ul>
                    </div>
                    <div class="avatar">
                        <HeadUser v-if="getUser"/>
                    </div>
                </div>
            </div>
        </nav>
    </div>
</template>
<script>
import {mapGetters} from "vuex";
import HeadUser from "@/common/headUser/newheadUser";

export default {
    components: {
        HeadUser
    },
    name: "homeHead",
    data: function () {
        return {
            title: "群智化平台",
            logoUrl: require("@/assets/img/index/cosine_logo_black.png"),
            indexUrl: "index",
            messageList: [],
            landaryUrl: "http://39.108.172.142:7676/portal/usr/login?accessToken=" + JSON.parse(sessionStorage.getItem("userToken")),
            items: [
                {
                    title: "竞赛专区",
                    url: "competitionSquare"
                },
                {
                    title: "开源项目",
                    url: "classicCase"
                },
                {
                    title: "服务共享",
                    url: "service"
                },
                {
                    title: "关于我们",
                    url: "feature"
                }
            ]

        };
    },
    created: function () {
    },
    computed: {
        ...mapGetters(["getUser"])
    },
    mounted: function () {
    },
    methods: {}
};
</script>
<style lang='scss'>
@import "@/assets/scss/homeHead.scss";

</style>
