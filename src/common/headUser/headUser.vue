<template>
    <div class="c-header__options">
        <div class="userImg">
            <el-popover placement="top-end" width="320" trigger="hover" @show='GETMESSAGE' popper-class="userCard">
                <ul class="remind">
                    <h4>站内消息</h4>
                    <li
                            @click="CHANGEMESSAGESTATE({ id: item.id, index: index })"
                            class="remindItem"
                            v-for="(item,index) in getMessageList"
                            :key="index"
                    >
                        <p class="messageText">{{item.content}}</p>
                    </li>
                    <li class="noMessage" v-if="getMessageList.length===0">暂无新的消息</li>
                    <router-link :to="{name:'myMessage'}">所有消息</router-link>
                </ul>
                <el-badge :is-dot="getMessageList.length!==0?true:false" slot="reference" class="badge">
                    <i class="icon iconfont icon-xiaoxi"></i>
                </el-badge>
            </el-popover>
            <el-popover placement="top-start" width="200" trigger="hover" popper-class="useCard_two">
                <ul class="Userremind">
                    <li class="UserNameItem">Hi, {{getuserData.userName}}!</li>
                    <router-link :to="{name:'desk'}">
                        <li class="UserremindItem">工作台</li>
                    </router-link>
                    <router-link :to="{name:'managerIndex'}">
                        <li class="UserremindItem">评审系统</li>
                    </router-link>
                    <li @click="SETLOGOUT('index')" class="UserremindItem">退出</li>
                </ul>
                <img class="redCircle" :src="getuserData.headurl?getuserData.headurl:getnoImg" slot="reference"/>
            </el-popover>
        </div>
    </div>
</template>
<script>
    import {mapGetters, mapMutations, mapActions} from "vuex";

    export default {
        name: "homeHead",
        data: function () {
            return {
                title: "群智化平台",
                logoUrl: require("@/assets/img/homepage/logo.png"),
                indexUrl: "index",
                messageList: []
            };
        },
        computed: {
            ...mapGetters(["getnoImg", "getuserData", "getMessageList"])
        },
        methods: {
            ...mapMutations(["setLogin", "setLogout", "setImgurl"]),
            ...mapActions(["GETMESSAGE", "CHANGEMESSAGESTATE", "SETLOGOUT"]),
        }
    };
</script>
<style lang='scss'>
    .c-header__options {
        margin-left: auto;
        float: right;
    }

    .userImg {
        margin: auto 0;

        .icon-xiaoxi {
            cursor: pointer;
            font-size: 26px;
            float: left;
            margin-top: 3px;
            color: #ffffff;
            transition: all 0.4s;

            &:hover {
                color: #7ea3ce;
            }
        }

        .badge {
            margin-top: -20px;
        }

        img {
            margin: 3px 0 0 10px;
            width: 27px;
            height: 27px;
            border-radius: 20px;

            &:hover {
                cursor: pointer;
            }
        }
    }

    .userCard {
        .remind {
            margin: -13px;
            padding: 0;

            .remindItem {
                color: #575454;
                letter-spacing: 0.5px;
                cursor: pointer;
                border-top: 1px solid #e8e8e8;
                padding: 7px 12px 7px 12px;

                &:hover .messageText {
                    background: #e8e8e8;
                    cursor: pointer;
                }

                &:hover {
                    background: #e8e8e8;
                }
            }

            .messageText {
                display: -webkit-box;
                -webkit-line-clamp: 2; /*限制在一个块元素显示的文本的行数*/
                -webkit-box-orient: vertical;
                overflow: hidden;
                padding: 0;
                background: #ffffff;
                border: 0;
                text-align: left;
            }

            h4 {
                font-size: 15px;
                font-weight: 600;
                margin: 7px 0 10px 10px;
            }

            a {
                display: inline-block;
                width: 100%;
                text-align: center;
                background: #d1d0d0;
                padding: 5px 0 5px 0;
                font-size: 13px;
                color: #333;

                &:hover {
                    color: #4c83c3;
                }
            }

            .noMessage {
                text-align: center;
                border-top: 1px solid #e8e8e8;
                padding: 7px;
            }
        }
    }

    .useCard_two {
        .Userremind {
            margin: -12px;

            a {
                color: black;
            }

            .UserremindItem {
                padding: 10px 0 10px 20px;
                cursor: pointer;

                &:hover {
                    background: #e8e8e8;
                }
            }

            .UserNameItem {
                color: #000;
                font-weight: bold;
                padding: 10px 0 10px 20px;
                cursor: pointer;
            }
        }
    }
</style>
