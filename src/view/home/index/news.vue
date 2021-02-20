<template>
<div>
    <div class="news-item">
        <el-button @click="moreNews" type="info">more</el-button>
        <div class='news-left'>
            <p class='news-left-date'>{{messageList[0]['date']}}</p>
            <p class='news-left-month'>{{messageList[0]['month']}}</p>
        </div>
        
        <div class='news-right'>
            <p class='news-right-title'>{{messageList[0]['title']}}</p>
            <p class='news-right-content'>
                <a>{{messageList[0]['content']}}>>>详情</a>
            </p>
        </div>
        
    </div>
    <hr class="news-hr">
    <div class="news-item">
        <div class='news-left margin-top-31'>
            <p class='news-left-date'>{{messageList[1]['date']}}</p>
            <p class='news-left-month'>{{messageList[1]['month']}}</p>
        </div>

        <div class='news-right margin-top-31'>
            <p class='news-right-title'>{{messageList[1]['title']}}</p>
            <p class='news-right-content'>
                <a>{{messageList[1]['content']}}>>>详情</a>
            </p>
        </div>
    </div>
    <hr class="news-hr" style="margin-bottom: 0">
    <div class="news-item" >
        <div class='news-left margin-top-31'>
            <p class='news-left-date'>{{messageList[2]['date']}}</p>
            <p class='news-left-month'>{{messageList[2]['month']}}</p>
        </div>

        <div class='news-right margin-top-31'>
            <p class='news-right-title'>{{messageList[2]['title']}}</p>
            <p class='news-right-content'>
                <a>{{messageList[2]['content']}}>>>详情</a>
            </p>
        </div>
        <div class='icon-right'>
            <img :src="iconUrl[2]">
            <img :src="iconUrl[0]" class="icon-right__left">
        </div>
        <div class='icon-right'>
            <img :src="iconUrl[1]">
            <img :src="iconUrl[3]" class="icon-right__left">
        </div>
        <!-- <img :src="iconUrl[2]" style="float:right"> -->
        <!-- <img :src="iconUrl[3]" style="float:right"> -->
    </div>
</div>
</template>

<script>
    // import {httpGet} from "@/utils/http.js";
    // import {errTips} from "@/utils/tips.js";

    export default {
        name: "News",
        data() {
            return {
                iconUrl: [require('@/assets/img/index/news_up_0.png'),
                          require('@/assets/img/index/news_down_0.png'),
                          require('@/assets/img/index/news_up_1.png'),
                          require('@/assets/img/index/news_down_1.png')],
                messageList: [
                    {
                        month: 'December',
                        date: '00',
                        title: 'COSINE平台全1.2.0新版本正式上线',
                        content: '平台提供多种用户角色，包括项目发布者、管理者、开发者等角色，多角色无缝切换， 多功能自然解耦。'
                    },
                    {
                        month: 'December',
                        date: '11',
                        title: 'COSINE平台全1.2.0新版本正式上线',
                        content: '平台提供多种用户角色，包括项目发布者、管理者、开发者等角色，多角色无缝切换， 多功能自然解耦。'
                    },
                    {
                        month: 'December',
                        date: '22',
                        title: 'COSINE平台全1.2.0新版本正式上线',
                        content: '平台提供多种用户角色，包括项目发布者、管理者、开发者等角色，多角色无缝切换， 多功能自然解耦。'
                    },
                ]
            };
        },
        created: function () {
        },
        methods: {
            moreNews() {
                
            }
        }
    };
</script>
<style lang='scss'>
    .news-item {
        overflow: hidden;
        .el-button {
            float: right;
            margin-right: 100px;
        }
        .el-button--info {
            color: #fff;
            background-color: #011A24;
            border-color: #011A24;
            border-radius:  0;
        }
        .el-button--info:focus,
        .el-button--info:hover {
            background: #2b333e;
            border-color: #2b333e;
            color: #fff;
        }
    }
    .news-left {
        width: 97px;
        height: 97px;
        background: #011A24;
        p {     
            font-family: DIN Alternate;
            font-weight: bold;
            color: #CCCCCC;
            text-align: center;
        }
        float: left;
    }
    .news-left-date {
        font-size: 72px;
        line-height: 75px;
    }
    .news-left-month {
        line-height: 10px;
        font-size: 16px;
        opacity: 0.5;
    }
    .news-right {
        margin-left: 66px;
        p {    
            font-family: PingFang HK;
        }
        float: left;
    }
    .news-right-title {
        font-size: 18px;
        font-weight: 500;
        color: #011A24;
    }
    .news-right-content {
        font-size: 16px;
        font-weight: 400;
        a {
            color: #011A24;
        }
        opacity: 0.7;
        margin-top: 31px;
        width: 600px;
    }
    .news-hr {
        border: 0;
        height: 1px;
        background: #788DA4;
        opacity: 0.47;
        width: 738px;
        margin: 31px 0px 0px 0px;
    }
    .margin-top-31 {
        margin-top: 31px;
    }
    .icon-right {
        overflow: hidden;
        img {
            float: right;
        }
    }
    .icon-right__left {
        margin-right: 30px;
    }
</style>
