<template>
    <div class="header_two">
        <nav class="c-header c-header--solid">
            <div class="o-container deskHeader clearfix">
                <div class="c-header__row__review ">
                    <div class="c-header__logowrap">
                        <router-link :to="indexUrl">
                            <div id="topnav-gurulogo" v-bind:href="indexUrl" style="display:block">
                                <title id="logo-title">{{title}}</title>
                                <img :src="logoUrl">
                            </div>
                        </router-link>
                    </div>
                    <HeadUser/>
                    <div style="display: inline-block;float:right; margin-right:20px;">
                        <span style="color: white">评审角色：</span>
                        <el-select style="width:130px;" v-model="value" placeholder="请选择" @change="roleChange">
                            <el-option
                                    v-for="item in permissionList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                            />
                        </el-select>
                    </div>
                </div>
            </div>
        </nav>
    </div>
</template>
<script>
    import {mapGetters, mapMutations} from "vuex";
    import HeadUser from "@/common/headUser/headUser";
    import {httpGet} from "@/utils/http.js";

    export default {
        components: {
            HeadUser
        },
        props: ["imageUrl"],
        name: "reviewLayout",
        data: function () {
            return {
                //1:项目发布者, 2:项目经理, 3:评审专家, 4:评审管理员,原本想写成permissionList:[],
                // 但是这种写法的点击角色切换时会出现id对应的数字到name的切换
                permissionList: [{
                    id: 1,
                    name: '项目发布者'
                }, {
                    id: 2,
                    name: '项目经理'
                }, {
                    id: 3,
                    name: '评审专家'
                }, {
                    id: 4,
                    name: '评审管理员'
                }],
                value: 1,
                title: "群智化平台",
                logoUrl: require("@/assets/img/homepage/logo.png"),
                indexUrl: "/index",
                headActive: "工作台",
                items: [
                    {
                        title: "工作台",
                        url: "project"
                    },
                    {
                        title: "我的需求",
                        url: "myDemand"
                    },
                    {
                        title: "我的投标",
                        url: "myBid"
                    },
                    {
                        title: "我的任务",
                        url: "myTask"
                    },
                    {
                        title: "团队申请",
                        url: "teamApplication"
                    },


                ],
                loginUrl: "login",
                registerUrl: "selectRole"
            };
        },
        created: function () {
            this.setPermissionList();
            /*通过地址栏进入页面时，根据路由判断角色*/
            let currentRouteName = this.$route.name;
            if (currentRouteName.indexOf('publisher') >= 0) {
                this.value = 1;
            } else if (currentRouteName.indexOf('manager') >= 0) {
                this.value = 2;
            } else if (currentRouteName.indexOf('expert') >= 0) {
                this.value = 3;
            } else if (currentRouteName.indexOf('editor') >= 0) {
                this.value = 4;
            }
            let routerName = this.$router.currentRoute.meta.routerIndex;
            this.setHeader(routerName);
        },
        watch: {
            $route() {
                let routerName = this.$router.currentRoute.meta.routerIndex;
                this.setHeader(routerName);
            }
        },
        computed: {
            ...mapGetters(["getHeader", "getReviewPermissionList"])
        },
        methods: {
            setPermissionList() {
                this.permissionList = JSON.parse(sessionStorage.getItem("reviewPermissionList"));
            },
            tiaoDesk() {
                this.setHeader("project");
            },
            roleChange() {//角色切换
                let role = this.value;
                if (role === 1) {//跳转项目发布者
                    this.$router.push('/publisherIndex');
                } else if (role === 2) {//跳转项目经理
                    this.$router.push('/managerIndex');
                } else if (role === 3) { //跳转评审专家
                    this.$router.push('/expertIndex');
                } else { //跳转评审管理员
                    this.$router.push('/editorIndex');
                }

            },
            ...mapMutations(["setHeader"])
        },

    };
</script>
<style lang="scss" scoped>
    .useCard_two {
        .Userremind {
            margin: -12px;

            a {
                color: black;
            }

            .UserremindItem {
                padding: 10px 15px 10px 15px;
                cursor: pointer;

                &:hover {
                    background: #e8e8e8;
                }
            }
        }
    }

    .header_two {
        .userImg {
            float: right;
            width: 65px;

            .icon-xiaoxi {
                cursor: pointer;
                font-size: 26px;
                color: white;
                transition: all 0.4s;
                float: left;
                margin-top: 4px;

                &:hover {
                    color: rgba(0, 0, 0, 0.74);
                }
            }

            img {
                margin-top: 3px;

                &:hover {
                    cursor: pointer;
                }
            }
        }

        a {
            color: white;
            font-weight: 400;
            width: 100px;
            font-size: 14px;

            &:hover {
                border-bottom: 1.9px solid white;
                padding-bottom: 10px;
            }
        }

        .login_two {
            border: 1px solid #fff;
            padding: 5px 13px 5px 13px;
            margin-right: 10px;
            border-radius: 3px;

            &:hover {
                background: #426ea1;
            }
        }

        .register_two {
            background: white;
            color: black;
            padding: 5px 13px 5px 13px;
            border: 1px solid #fff;
            border-radius: 3px;

            &:hover {
                background: #e8e8e8;
            }
        }

        .c-header {
            -webkit-box-shadow: 0 1px 0 rgba(255, 255, 255, 0.2);
            box-shadow: 0 1px 0 rgba(255, 255, 255, 0.2);
            width: 100%;
            z-index: 100;
        }

        .c-header--fixed,
        .c-header--solid {
            background: #7cabb1;
        }

        .c-header__row__review {
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
            text-align: center;
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
            border-bottom: 1.9px solid white;
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
            background-color: #7cabb1;
            border-color: #7cabb1;
            color: #fff;
        }

        .c-header--transparent:not(.c-header--fixed) .c-header__options__signin {
            background-color: transparent;
            border: 1px solid #fff;
            color: #fff;
        }

        .c-header--transparent:not(.c-header--fixed)
        .c-header__options__signin:hover {
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
