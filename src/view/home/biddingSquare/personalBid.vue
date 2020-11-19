<template>
    <div class="personalBid">
        <div class="module_secondaryHead guruSearch hasBg">
            <div class="container">
                <div class="module_headerCrumb">
                    <div class="refinery">
                        <div class="searchTitle">
                            <p class="searchTitle">
                                <router-link to="managerProcess">招标投标</router-link>
                                >
                                <router-link to="biddingSquare">招标广场</router-link>
                                >
                                <router-link :to="{path:'applicationView', query:{id:returnId}}">申请查看</router-link>
                                > 个人信息
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="editorialTeam_top clearFix">
                <div class="editorialTeam_left clearFix">
                    <el-card class="card" v-for="(item,index) in competeTeamList" :key="index">
                        <div class="item clearfix">
                            <span class="leader" v-if="index===0"></span>
                            <img :src="item.headurl?item.headurl:getnoImg"/>
                        </div>
                        <p>用户名：{{item.name}}</p>
                    </el-card>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {mapGetters} from "vuex";
    import {httpGet} from "@/utils/http.js";
    import {errTips} from "@/utils/tips.js";

    export default {
        components: {},
        data() {
            return {
                selestate: [],
                competeTeamList: [],
                id: "",
                returnId: ""
            };
        },
        computed: {
            ...mapGetters(["getnoImg"])
        },
        created: function () {
            if (!this.$route.query.id) {
                this.$router.push({path: "biddingSquare"});
                return false;
            }
            this.id = this.$route.query.id;
            this.returnId = this.$route.query.returnId;
            this.getView()
        },
        methods: {
            //获取页面数据
            getView() {
                httpGet("/v1/public/bid/selete/teamuser", {id: this.id}).then(
                    results => {
                        if (results.data.httpCode === 200) {
                            this.competeTeamList = results.data.data.competeTeamList;
                        } else {
                            errTips(results.data.msg);
                            this.$router.push({path: "biddingSquare"});
                        }
                    }
                );
            }
        }
    };
</script>
<style lang='scss'>
    @import "@/assets/scss/personalBid.scss";
</style>
