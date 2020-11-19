<template>
    <div class="homeHead clearfix">
        <nav class="c-header c-header--solid">
            <div class="o-container">
                <div class="c-header__row">
                    <div class="c-header__logowrap">
                        <router-link :to="indexUrl">
                            <a v-bind:href="indexUrl" style="display:block">
                                <title id="logo-title">{{title}}</title>
                                <img :src="logoUrl">
                            </a>
                        </router-link>
                    </div>
                    <div class="c-header__options" v-if="!getUser">
                        <router-link to="login">
                            <a href class="loginBtn">登入</a>
                        </router-link>
                        <router-link to="selectRole" class="registerBtn">注册</router-link>
                    </div>
                    <ul class="c-header__navigation">
                        <li class="c-header__navigation__item" v-for="item in items1" :key="item.title">
                            <router-link :to="item.url">
                                <a v-bind:href="item.url" v-bind:title="title">{{item.title}}</a>
                            </router-link>
                        </li>
                        <li class="c-header__navigation__item">
                            <a href="http://39.108.172.142:7676/portal/user/login.html">蓝凌云平台</a>
                        </li>
                        <li class="c-header__navigation__item" v-for="item in items2" :key="item.title">
                            <router-link :to="item.url">
                                <a v-bind:href="item.url" v-bind:title="title">{{item.title}}</a>
                            </router-link>
                        </li>
                    </ul>
                    <HeadUser v-if="getUser"/>
                </div>
            </div>
        </nav>
    </div>
</template>
<script>
    import {mapGetters} from "vuex";
    import HeadUser from "@/common/headUser/headUser";

    export default {
        components: {
            HeadUser
        },
        name: "homeHead",
        data: function () {
            return {
                title: "群智化平台",
                logoUrl: require("@/assets/img/homepage/logo.png"),
                indexUrl: "index",
                messageList: [],
                items1: [
                    {
                        title: "招标投标",
                        url: "roleSelection"
                    },
                    {
                        title: "竞赛广场",
                        url: "competitionSquare"
                    },
                    {
                        title: "内测招募",
                        url: "testEmploy"
                    },
                    {
                        title: "经典案例",
                        url: "classicCase"
                    },
                    {
                        title: "服务共享",
                        url: "service"
                    }
                ],
                items2: [
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
