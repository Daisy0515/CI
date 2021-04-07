<template>
    <div class="clearfix">
        <nav class="c-header c-header--solid" style="color: white;">
            <div class="o-container">
                <div class="c-header__row">
                    <div class="c-header__logowrap">
                        <router-link :to="indexUrl">
                            <a style="width: 68px;height: 27px;font-size: 38px;font-family: DIN Condensed;
                            font-weight: bold;color: #FFFFFF;position: relative;bottom: 5px;">COSINE</a>
<!--                            <img :src="logoUrl">-->
                        </router-link>
                    </div>
                    <div>
                        <ul class="c-header__navigation">
                            <li class="c-header__navigation__item" v-for="item in items" :key="item.title">
                                <router-link :to="item.url">
                                    <a v-bind:href="item.url" v-bind:title="title" style="font-size: 14px;
                                    font-family: PingFang HK;font-weight: 300;color: white;">{{ item.title }}</a>
                                </router-link>
                            </li>
                            <li class="c-header__navigation__item">
                                <a :href="landaryUrl" target="_blank" @click="isLogin('message',$event)" style="
font-size: 14px;
font-family: PingFang HK;
font-weight: 300;
color: white;">蓝凌云平台</a>
                            </li>
                        </ul>
                    </div>
                    <div class="cc-header__options" v-if="!getUser">
                        <router-link to="login" class="lloginBtn"><a href>登入</a></router-link>
                        <router-link to="selectRole" class="rregisterBtn">注册</router-link>
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
            logoUrl: require("@/assets/img/index/cosine_logo.png"),
            indexUrl: "index",
            messageList: [],
            landaryUrl: "http://39.108.172.142:7676/portal/usr/login",
            items: [
                {
                    title: "首页",
                    url: "index"
                },
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
        if(sessionStorage.getItem("userToken") !== "") {
            this.landaryUrl = this.landaryUrl + "?accessToken=" + JSON.parse(sessionStorage.getItem("userToken"));
        }
      // console.log("jiu");
    },
    computed: {
        ...mapGetters(["getUser"])
    },
    mounted: function () {
    },
    methods: {
        isLogin(message,event){
            //console.log("aaa");
            if(sessionStorage.getItem("userToken") == "") {
                this.$router.push({path:"login"});
                event.preventDefault()
            }else{
               window.open(this.landaryUrl);
               //this.$router.push(this.landaryUrl);
            }
        }
    }
};
</script>
<style lang='scss'>
@import "@/assets/scss/homeHead.scss";
</style>
