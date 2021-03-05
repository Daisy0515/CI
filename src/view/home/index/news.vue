<template>
<div>
    <div v-for="(item, index) in messageList" :key=index>
        <div class="news-item">
            <el-button @click="moreNews" type="info" v-if="index==0">more</el-button>
            <div :class="[index==messageList.length-1 ? 'margin-top-31' : '' , 'news-left']">
                <p>0{{index + 1}}</p>
            </div>
            
            <div :class="[index==messageList.length-1 ? 'margin-top-31' : '' , 'news-right']">
                <router-link :to="item['url']">
                    <p class='news-right-title'>{{item['title']}}</p>
                    <p class='news-right-content'>{{item['digest']}}>>>详情</p>
                </router-link>
            </div>

            <div class='icon-right' v-if="index==messageList.length - 1">
                <img class='disable-cursor' :src="iconUrl[0]" v-show="isFirstPage">
                <img  @click="prevPage" :src="iconUrl[2]" v-show="!isFirstPage">
            </div>
            <div class='icon-right'  v-if="index==messageList.length - 1">
                <img class='disable-cursor' :src="iconUrl[1]" v-show="isEndPage">
                <img  @click="nextPage" :src="iconUrl[3]" v-show="!isEndPage">
            </div>
        </div>
        <hr class="news-hr" v-if="index==0 && index!=messageList.length-1">
        <hr class="news-hr" v-if="index==1" style="margin-bottom: 0">
    </div>
</div>
</template>

<script>
    import {httpGet} from "@/utils/http.js";
    import {errTips} from "@/utils/tips.js";

    export default {
        name: "News",
        data() {
            return {
                iconUrl: [require('@/assets/img/index/news_up_0.png'),
                          require('@/assets/img/index/news_down_0.png'),
                          require('@/assets/img/index/news_up_1.png'),
                          require('@/assets/img/index/news_down_1.png')],
                pageData: {
                    pageSize: 3,
                    pageNo: 1,
                    orderBy: "id",
                    orderType: "DESC",
                },
                pageNo: 1,
                totalPage: 0,
                messageList: [
                    {
                        month: 'December',
                        date: '00',
                        title: 'COSINE平台全1.2.0新版本正式上线',
                        digest: '平台提供多种用户角色，包括项目发布者、管理者、开发者等角色，多角色无缝切换， 多功能自然解耦。',
                        url: ''
                    },
                    {
                        month: 'December',
                        date: '11',
                        title: 'COSINE平台全1.2.0新版本正式上线',
                        digest: '平台提供多种用户角色，包括项目发布者、管理者、开发者等角色，多角色无缝切换， 多功能自然解耦。',
                        url: ''
                    },
                    {
                        month: 'December',
                        date: '22',
                        title: 'COSINE平台全1.2.0新版本正式上线',
                        digest: '平台提供多种用户角色，包括项目发布者、管理者、开发者等角色，多角色无缝切换， 多功能自然解耦。',
                        url: ''
                    },
                ]
            };
        },
        created: function () {
            this.getViewData();
        },
        computed: {
            isEndPage(){
                if (this.pageNo == this.totalPage) return true
                return false
            },
            // 判断是否是第一页
            isFirstPage(){
                if (this.pageNo == 1) return true
                return false
            }
        },
        methods: {
            moreNews() {
                this.$router.push({path: "knowledgePlaza"});
            },
            getViewData() {
                httpGet("/v1/public/share/get/list", this.pageData).then(results => {
                    const {httpCode, data, msg} = results.data;
                    if (httpCode === 200) {
                        this.messageList = data.infoList;
                        this.pageNo = data.pageNo;
                        this.totalPage = Math.floor(data.totalCount / 3);
                        for (let i of data.infoList) {
                            if (i.digest.length > 70) {
                                i.digest = i.digest.substr(0,70);
                            }
                            i.url = "knowledgeView?id=" + i.id;
                        }
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                });
            },
            prevPage() {
                this.pageData.pageNo = this.pageData.pageNo - 1;
                this.getViewData();
            },
            nextPage() {
                this.pageData.pageNo = this.pageData.pageNo + 1;
                this.getViewData();
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
            font-size: 72px;
            line-height: 97px;
        }
        float: left;
    }
    .news-right {
        margin-left: 66px;
        p {    
            //font-family: PingFang HK;
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
        color: #011A24;
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
        margin: 31px 0px 31px 0px;
    }
    .margin-top-31 {
        margin-top: 31px;
    }
    .icon-right {
        overflow: hidden;
        img {
            float: right;
            margin-right: 100px;
        }
        
    }
    .disable-cursor {
        cursor: not-allowed;
    }
</style>
