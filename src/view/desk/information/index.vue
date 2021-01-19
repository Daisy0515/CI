<template>
    <div class="message">
        <div class="container deskHeader" style="height:100%">
            <div class="left-scroll">
                <div class="left_top">
                    <Avatar></Avatar>
                    <ul v-if="getuserData.role===1">
                        <li
                                @click="changeleft(item)"
                                :class="getleftIndex===item.url ? 'leftbq':''"
                                v-for="item in leftdataOne"
                                :key="item.index"
                        >{{item.name}}
                        </li>
                    </ul>
                    <ul v-if="getuserData.role==2">
                        <li
                                @click="changeleft(item)"
                                :class="getleftIndex===item.url ? 'leftbq':''"
                                v-for="item in leftdataTwo"
                                :key="item.index"
                        >{{item.name}}
                        </li>
                    </ul>
                </div>
            </div>
            <div class="message_main clearfix">
                <router-view></router-view>
            </div>
        </div>
        <div style="clear:both"></div>
        <Footer/>
    </div>
</template>
<script>
    import {mapGetters, mapMutations} from "vuex";
    import Avatar from "@/common/upload/Avatar";

    export default {
        components: {
            Avatar
        },
        data() {
            return {
                select: "个人信息",
                leftdataOne: [
                    {
                        name: "个人信息",
                        url: "changePersonal",
                        open: true,
                        formindex: true
                    },
                    {
                        name: "修改密码",
                        url: "changePassword",
                        open: false,
                        formindex: false
                    },
                    {
                        name: "个人简介",
                        url: "introduction",
                        open: false,
                        formindex: false
                    }
                ],
                leftdataTwo: [
                    {
                        name: "公司信息",
                        url: "changeCompany",
                        open: false,
                        formindex: false
                    },
                    {
                        name: "修改密码",
                        url: "changePassword",
                        open: false,
                        formindex: false
                    }
                ],
                ruleForm: {
                    pass: "",
                    checkPass: "",
                    name: "",
                    region: "",
                    date1: "",
                    date2: "",
                    delivery: false,
                    type: [],
                    resource: "",
                    desc: ""
                }
            };
        },
        created: function () {
            this.setLeft(this.$router.currentRoute.name);
        },
        computed: {
            ...mapGetters(["getuserData", "getleftIndex"])
        },
        methods: {
            ...mapMutations(["setLogin", "setLeft"]),
            changeleft(item) {
                this.setLeft(item.url);
                this.$router.push(`/desk/${item.url}`);
            }
        }
    };
</script>
<style lang='scss'>
    html,
    body,
    #app,
    .desk,
    .message {
        height: 100%;
    }

    .message {
        .el-step__head.is-process {
            color: #4c83c3;
        }

        .el-step__title.is-process {
            color: #4c83c3;
        }

        .el-input__inner {
            height: 35px;
            background: rgb(251, 251, 251);
        }

        .left-scroll {
            text-align: center;
            width: 22%;
            float: left;
            height: 100%;
            border-right: 1px solid #d8d8d8;

            .left_top {
                margin-top: 40px;

                .el-upload {
                    width: 90px;
                    height: 90px;
                    display: block;
                }

                .avatar-uploader-icon {
                    width: 90px;
                    height: 90px;
                    display: block;
                    line-height: 90px;
                }

                p {
                    font-size: 14px;
                }

                & p:nth-child(3) {
                    color: #3e76b8;
                }

                .changeHead {
                    color: #4c83c3;
                    font-size: 13px;
                    cursor: pointer;
                    margin-top: 5px;
                }
            }

            ul {
                margin-top: 50px;
            }

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

        .message_main {
            box-sizing: border-box;
            border: 1px solid #d8d8d8;
            float: right;
            padding: 30px 40px 50px 30px;
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

        .avatar-uploader {
            display: inline-block;
        }

        .avatar-uploader .el-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }

        .avatar-uploader .el-upload:hover {
            border-color: #409eff;
        }

        .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            line-height: 178px;
            text-align: center;
        }

        .left_top {
            .avatar {
                width: 100%;
                height: 100%;
                display: block;
            }
        }

        .addWork {
            margin-bottom: 20px;

            span {
                margin-left: 30px;
            }

            i {
                float: right;
            }
        }
    }
</style>
