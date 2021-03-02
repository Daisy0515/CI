<template>
    <div class="service square">
        <div class="responsive resp">
            <div class="module_secondaryHead guruSearch hasBg">
                <div class="container">
                    <div class="module_headerCrumb">
                        <div class="refinery">
                            <div class="searchTitle">
                                <h1>服务共享</h1>
                                <h2>
                  <span>
                    获取常见的开发工具和开发知识，发扬开源精神，推动平台建设！
                  </span>
                                </h2>
                            </div>
                        </div>
                        <span class="resultCount"></span>
                    </div>
                </div>
            </div>
        </div>
        <div class="container deskHeader" style="height:100%">
            <div class="left-scroll">
                <div class="left_top">
                    <ul>
                        <li
                                @click="changeleft(item)"
                                :class="getleftIndex===item.url ? 'leftbq':''"
                                v-for="item in leftdataOne"
                                :key="item.index"
                        >{{item.name}}
                        </li>
                    </ul>
                </div>
            </div>
            <div class="service_main clearfix">
                <router-view></router-view>
            </div>
        </div>
        <div style="clear:both"></div>
        <Footer/>
    </div>
</template>
<script>
    import {mapGetters, mapMutations} from "vuex";

    export default {
        data() {
            return {
                select: "个人信息",
                leftdataOne: [
                    {
                        name: "工具集",
                        url: "toolset",
                        open: true,
                        formindex: true
                    },
                    {
                        name: "开发动态",
                        url: "knowledgePlaza",
                        open: false,
                        formindex: false
                    },
                    {
                        name: "首页动态",
                        url: "homepageNews",
                        open: false,
                        formindex: false
                    }
                ]
            };
        },
        created: function () {
            this.setLeft(this.$router.currentRoute.name);
        },
        computed: {
            ...mapGetters(["getleftIndex"])
        },
        methods: {
            ...mapMutations(["setLogin", "setLeft"]),
            changeleft(item) {
                this.setLeft(item.url);
                this.$router.push(item.url);
            }
        }
    };
</script>
<style lang='scss'>
    html,
    body,
    #app,
    .desk,
    .service {
        height: 100%;
    }

    .service {
        .left-scroll {
            text-align: center;
            width: 22%;
            float: left;
            height: 100%;

            ul {
                margin-top: 50px;
            }

            border-right: 1px solid #d8d8d8;

            li {
                border-top: 1px solid #d8d8d8;
                margin-top: 15px;
                padding-top: 15px;
                color: #666;
                position: relative;
                cursor: pointer;

                &:hover::before {
                    content: "";
                    height: 51px;
                    top: 0;
                    left: 0;
                    position: absolute;
                    border-left: 5px solid #4c83c3;
                }
            }

            .leftbq::before {
                content: "";
                height: 51px;
                top: 0;
                left: 0;
                position: absolute;
                border-left: 5px solid #4c83c3;
            }
        }

        .service_main {
            box-sizing: border-box;
            float: right;
            width: 75%;
            margin: 40px auto;

            &::before {
                content: "";
                display: table;
                clear: both;
            }

            h3 {
                margin-bottom: 40px;
            }
        }
    }
</style>
