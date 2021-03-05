<template>
    <div class="knowledgeView">
        <div class="hasBg">
            <div class="container">
                <div class="module_headerCrumb">
                    <div class="searchTitle">
                        <p class="searchTitle">
                            <router-link to="homepageNews">知识广场</router-link>
                            >
                            查看
                        </p>
                    </div>
                    <span class="resultCount"></span>
                </div>
            </div>
        </div>
        <div class="container back">
            <div class="box-knowledgeView clearfix">
                <h1 style="margin-bottom:20px">{{viewData.title}}</h1>
                <div style="width:100%;" v-html="viewData.content"></div>
                <div class="knowledgeView_bottom">
                    <a :href="viewData.url" target="_blank">
                        <i class="el-icon-download"></i>点击下载资源
                    </a>
                    <div style="clear:both"></div>
                    <!-- <div style="clear:both"></div> -->
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {httpGet} from "@/utils/http.js";
    import {specificDate} from "@/utils/getDate.js";
    import {errTips, message} from "@/utils/tips.js";

    export default {
        data() {
            return {
                viewData: {}
            };
        },
        watch: {
            $route() {
                if (this.$route.query.id) {
                    this.getView();
                }
            }
        },
        created: function () {
            if (!this.$route.query.id) {
                this.$router.push({name: "homepageNews"});
                return false;
            }
            this.getView();
        },
        methods: {
            getView() {
                httpGet("/v1/public/homepage/get/select", {
                    id: this.$route.query.id
                }).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 200) {
                        this.viewData = data;
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                });
            },
        }
    };
</script>
<style lang='scss'>
    .knowledgeView {
        background: #f3f3f3;
        padding-bottom: 20px;

        .back {
            background: white;
            margin-top: 20px;
        }

        .box-knowledgeView {
            box-sizing: border-box;
            padding: 20px;
            width: 100%;
            letter-spacing: 1px;
            text-align: center;

            h1 {
                text-align: center;
            }

            p {
                margin-top: 20px;
                text-align: left;
                color: rgba(85, 85, 85, 1);
                font-size: 16px;
                line-height: 28px;
            }

            .knowledgeView_title {
                border-bottom: 1px solid #f8f8f8;
                padding-bottom: 15px;

                span {
                    width: 25%;
                    color: rgba(85, 85, 85, 1);
                    display: inline-block;
                }
            }

            .clearfix {
                border-top: 1px solid #f8f8f8;
                padding-top: 10px;
            }

            .knowledgeView_bottom {
                margin-top: 5%;
                margin-bottom: 10px;

                a {
                    float: right;
                    margin-bottom: 10px;
                }

                span {
                    &:hover {
                        color: #7cabb1;
                        cursor: pointer;
                    }
                }

                & span:nth-child(1) {
                    float: left;
                }

                & span:nth-child(2) {
                    float: right;
                }
            }
        }
    }
</style>
