<template>
    <div class="clearfix" style="margin-bottom: 50px;">
        <nav class="cc-header">
            <div class="cc-header__row">
                <div class="cc-header__logowrap">
                        <router-link :to="indexUrl">
                            <img :src="logoUrl">
                        </router-link>
                </div>
                <div class="cc-header__options" v-if="!getUser">
                    <router-link to="login" class="lloginBtn"><a href >登入</a></router-link>
                    <router-link to="selectRole" class="rregisterBtn">注册</router-link>
                </div>

                <ul class="cc-header__navigation">
                    <li class="cc-header__navigation__item" v-for="item in items" :key="item.title">
                        <router-link :to="item.url">
                            <a v-bind:href="item.url" v-bind:title="title">{{item.title}}</a>
                        </router-link>
                    </li>
                    <li class="cc-header__navigation__item">
                        <a :href="landaryUrl" target="_blank">蓝凌云平台</a>
                    </li>
                </ul>
                <HeadUser v-if="getUser"/>
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
        name: "newHomeHead",
        data: function () {
            return {
                title: "群智化平台",
                logoUrl: require("@/assets/img/index/cosine_logo.png"),
                indexUrl: "index",
                messageList: [],
                landaryUrl:"http://39.108.172.142:7676/portal/home/index.html?accessToken="+JSON.parse(sessionStorage.getItem("userToken"))+"#/myProj",
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
    .cc-header {
		width: 100%;
		z-index: 100;
		border: 1px solid #80CCD0;
        background: #fff;
        position: absolute;
        white-space:nowrap; 
        height: 100px;
	}

	.cc-header__row {
		height: 100px;
	}

    .cc-header__options {
        margin-left: auto;
        float: right;
    }

    .lloginBtn{
        border: 1px solid #80CCD0;

        padding:5px 15px 5px 15px;

        font-size: 12px;
        font-family: PingFang HK;
        font-weight: 300;
        color: #80CCD0;
        line-height: 100px;
    }

    .rregisterBtn{
        border: 1px solid #011A24;
        padding:5px 15px 5px 15px;
        opacity: 0.5;

        font-size: 12px;
        font-family: PingFang HK;
        font-weight: 300;
        color: #011A24;
        line-height: 100px;

        margin: 0px 390px 0px 29px;
    }

    .cc-header__navigation{
        width: 550px;
        margin-left: 16%;
        margin-right: 0px;
        text-align: center;
        float: left;
    }

    .cc-header__navigation__item {
        display: inline-block;
        vertical-align: middle;
        padding: 0px 0px 0px 43px;

        font-size: 14px;
        font-family: PingFang HK;
        font-weight: 300;
       
        line-height: 100px;

        a {
            color: #011A24;
        }

    }

    .cc-header__logowrap {
        border: 0;
        outline: 0;
        margin-left: 388px;
        float: left;
        line-height: 100px;
        margin-top: 10px;
}

    .hasBg {
        background: url("../../assets/img/homepage/space.jpg");
        //padding: 59px 0 15px 0;
    }
</style>
