<template>
    <div class="message">

        <div class="header_two0">
            <nav class="c-header c-header--solid0">
                <div class="o-container deskHeader clearfix">
                    <ul class="c-header__navigation clearfix">
                        <li class="c-header__navigation__item" v-for="item in items" :key="item.title" @click="changeTop(item)">
                            <router-link :class="Header === item.url ? 'header_active' : ''" :to="{path:item.url, query:{projectName:projectName,projectId:projectId}}">
                                {{ item.title }}
                            </router-link>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>


        <div style="margin-top: 20px">
            <router-view></router-view>
        </div>

        <div style="clear:both"></div>
        <Footer/>
    </div>
</template>
<script>
    import {mapGetters, mapMutations} from "vuex";

    export default {
        name:"defectManagement",
        data() {
            return {
                Header:"codeDefect",
                projectName:null,
                projectId:null,
                items: [
                    {
                        title: "代码缺陷",
                        url: "codeDefect" //从底层节点匹配，所以不要写全？？
                    },
                    {
                        title: "文档意见",
                        url: "documentComments"
                    },

                ],
            };
        },
        created: function () {
            this.projectName = this.$route.query.projectName;
            this.projectId = this.$route.query.projectId;
        },
        computed: {
            ...mapGetters(["getuserData", "getleftIndex"])
        },
        methods: {
            ...mapMutations(["setLogin", "setLeft"]),
            changeTop(item) {
                this.Header=item.url;
                //this.$router.push({name:item.url});
            }
        }
    };
</script>
<style lang='scss' scoped>
    .header_two0 {
        a {
            color: #666;
            font-weight: 400;
            width: 100px;
            font-size: 16px;

            &:hover {
                border-bottom: 1.9px solid #4c83c3;
                padding-bottom: 10px;
            }
        }

        .c-header {
            -webkit-box-shadow: 0 1px 0 rgba(255, 255, 255, 0.2);
            box-shadow: 0 1px 0 rgba(255, 255, 255, 0.2);
            width: 100%;
            z-index: 100;
        }

        .c-header--fixed,
        .c-header--solid0 {
            border-bottom: 1px solid #e8e8e8;
            padding: 15px 0 15px;
        }

        .c-header__row {
            height: 70px;
            padding-top: 20px;
            box-sizing: border-box;
        }

        .c-header__logowrap {
            border: 0;
            height: 30px;
            width: 130px;
            outline: 0;
            margin-right: auto;
            float: left;
        }

        .c-header__logo {
            width: 130px;
            height: 30px;
            fill: #333;
        }

        .c-header__options {
            float: right;
            width: 65px;

            img {
                width: 27px;
                height: 27px;
                border-radius: 50%;
                margin-left: 10px;
            }
        }

        .c-header__options__signin {
            display: inline-block;
        }

        .c-header__navigation {
            width: 940px;
            float: left;
            // text-align: center;
            list-style: none;
        }

        .c-header__navigation__item {
            padding: 0 15px 0 15px;
            display: inline-block;
            vertical-align: middle;
            height: 100%;
            font-size: 14px;
            font-weight: 600;
        }

        .header_active {
            border-bottom: 1.9px solid #4c83c3;
            padding-bottom: 10px;
            // background: #0760c5;
        }

        .c-header--transparent:not(.c-header--fixed) {
            position: absolute;
        }

        .c-header--transparent:not(.c-header--fixed) .c-header__navigation__item a {
            color: #fff;
            text-shadow: 0 0 1px rgba(0, 0, 0, 0.9);
        }

        .c-header--transparent:not(.c-header--fixed) .c-header__options__join {
            border-color: #fff;
            background-color: #fff;
            color: #444;
            font-weight: 400;
        }

        .c-header--transparent:not(.c-header--fixed) .c-header__options__join:hover {
            background-color: #4c83c3;
            border-color: #4c83c3;
            color: #fff;
        }

        .c-header--transparent:not(.c-header--fixed) .c-header__options__signin {
            background-color: transparent;
            border: 1px solid #fff;
            color: #fff;
        }

        .c-header--transparent:not(.c-header--fixed) .c-header__options__signin:hover {
            background-color: #fff;
            color: #444;
        }

        .c-header--breadcrumbs .c-header__logowrap {
            margin-right: 2rem;
        }

        .c-header--breadcrumbs .c-header__breadcrumb,
        .c-header--breadcrumbs .c-header__breadcrumb a {
            font-size: 14px;
            font-size: 0.875rem;
            color: #fff;
            text-shadow: 0 0 1px rgba(0, 0, 0, 0.9);
        }

        .c-header--breadcrumbs .mobileBreadcrumb {
            display: block;
        }

        .c-header--breadcrumbs .fullscreenBreadcrumb {
            display: none;
        }
    }
</style>
