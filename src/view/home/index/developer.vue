<template>
    <div id="index">
        <main id="main">
            <section class="cc-hero" id="heroImage">
                <div class="cc-hero__lead">
                    <p class="cc-hero__title">加入专业的团队</p>
                    <p class="cc-hero__subtitle">在人-机-服务协同环境下调和共振、同生共长</p>
                    <p class="cc-hero__title">__</p>
                    <div class="cc-hero__CTA">
                        <div class="ee-inputButton">
                            <el-button @click="publishTask" type="primary">我的项目</el-button>
                            <el-button @click="joinTeam" type="primary">加入团队</el-button>
                        </div>
                    </div>
                </div>
            </section>
            <section style="padding: 68px 20% 68px 20%;">
                <div class="team">
                    <div class="title">NEW TEAM</div>
                    <div class="title_zh">最新团队</div>
                    <div class="more">
                        <button class="more_bu">more</button>
                    </div>
                    <div class="border"></div>
                    <div style="margin: 20px; padding-top: 40px">
                        <Teams></Teams>
                    </div>
                </div>
                <div class="team" style="float: right">
                    <div class="title">NEW TOOL</div>
                    <div class="title_zh">最新工具</div>
                    <div class="more">
                        <button class="more_bu">more</button>
                    </div>
                    <div class="border"></div>
                    <div style="margin: 20px; padding-top: 40px">
                        <ToolSet></ToolSet>
                    </div>

                </div>
            </section>
            <section class="center-section">
                <!--                <div class="process">PROCESS</div>-->
                <!--                <div class="process1">竞标流程指南</div>-->
                <!--                <div class="border_pro"></div>-->
                <div class="center-text">
                    <p class="iimg-list__left-title noheight_title">PROCESS</p>
                    <p class="iimg-list__left-subtitle">竞标流程指南</p>
                    <p class="iimg-list__left-title iimg-list__left-br">_</p>
                </div>

                <div class="image">
                    <div style="display:inline-block">
                        <img src="@/assets/img/index/index_developer_1.png" class="process_img">
                        <p>加入团队</p>
                    </div>
                    <div style="display:inline-block">
                        <img src="@/assets/img/index/arrow_right.png" class="arrow">
                    </div>
                    <div style="display:inline-block">
                        <img src="@/assets/img/index/index_developer_2.png" class="process_img">
                        <p>项目研发</p>
                    </div>
                    <div style="display:inline-block">
                        <img src="@/assets/img/index/arrow_right.png" class="arrow">
                    </div>
                    <div style="display:inline-block">
                        <img src="@/assets/img/index/index_developer_3.png" class="process_img">
                        <p>交付成果</p>
                    </div>

                </div>

            </section>

            <section class="center-section">
                <div class="iimg-list__left">
                    <p class="iimg-list__left-title">PROCESS ON</p>
                    <p class="iimg-list__left-subtitle">流程介绍</p>
                    <p class="iimg-list__left-title iimg-list__left-br">_</p>

                    <p class="iimg-list__left-subtitle" v-if="currentIndex==0">角色赋能</p>
                    <p class="iimg-list__left-content" v-if="currentIndex==0">
                        平台提供多种用户角色，<br>包括项目发布者、管理者、开发者等角色，<br>多角色无缝切换，多功能自然解耦。
                    </p>
                    <el-button @click="register" type="primary" size="small">立即注册</el-button>
                </div>
                <div class="iimg-list__right">
                    <div class="iimg-list__img">
                        <div class='iimg-list__bottom'>
                            <img :src="imgList[currentIndex]">
                        </div>
                        <img class='iimg-list__top' :src="imgList[(currentIndex+1)%6]">
                    </div>

                    <div class="iimg-list__text">
                        <li v-for="(item,index) in imgList" :key="index" @click="changeImg(index)"
                            :class="[currentIndex == index ? 'iimg-list__active': 'iimg-list__noactive',
                                     currentIndex == index && index == 5 ? 'iimg-list__lastactive': '']">
                            <a v-show="currentIndex==index">_</a>{{ '0' + (index + 1) }}
                        </li>
                    </div>
                </div>
            </section>
        </main>
    </div>
</template>

<script>
import ToolSet from './newtoolset2.vue';
import Teams from './teams.vue';

export default {
    components: {
        ToolSet,
        Teams,
    },
    data() {
        return {
            searchData: "",
            imgList: [require('@/assets/img/index/index_service_1.jpg'),
                require('@/assets/img/index/index_service_2.jpg'),
                require('@/assets/img/index/index_service_3.jpg'),
                require('@/assets/img/index/index_service_4.jpg'),
                require('@/assets/img/index/index_service_5.jpg'),
                require('@/assets/img/index/index_service_6.jpg')],
            iconList: [require('@/assets/img/index/index_developer_1.png'),
                require('@/assets/img/index/index_developer_2.png'),
                require('@/assets/img/index/index_developer_3.png'),
                require('@/assets/img/index/arrow_right.png')],
            currentIndex: 0,   //默认显示图片
        }
    },
    methods: {
        //搜索关键字
        search() {
            this.$router.push({
                name: "classicCase",
                query: {search: this.searchData}
            });
        },

        joinTeam() {
            this.$router.push({path: "teamSquare"});
        },

        register() {
            this.$router.push({path: "selectRole"});
        },

        moreTool() {
            this.$router.push({path: "moreToolset"});
        },
        changeImg(index) {
            this.currentIndex = index;
        },
        myDemand() {
            this.$router.push({path: "desk/myDemand"});
        },
        publishTask() {
            this.$router.push({path: "publishTask"});
        },
        aboutUs() {
            this.$router.push({path: "feature"});
        },
    }
};
</script>
<style lang='scss'>
@import "@/assets/scss/newindex.scss";
</style>
<style scoped>
.el-input-group__append .el-button--primary {
    color: #fff;
    background-color: #80CCD0;
}

.ee-inputButton >>> .el-input-group__append {
    border: none;
}

.el-button--primary {
    color: #fff;
    background-color: #80CCD0;
    border-color: #80CCD0;
    border-radius: 0;
}

.el-button--primary:focus,
.el-button--primary:hover {
    background: #ABC8CC;
    border-color: #ABC8CC;
    color: #fff;
}

.el-button--info {
    color: #fff;
    background-color: #011A24;
    border-color: #011A24;
    border-radius: 0;
}

.el-button--info:focus,
.el-button--info:hover {
    background: #2b333e;
    border-color: #2b333e;
    color: #fff;
}

.noheight_title {
    line-height: 50px;
}

.team {
    background-color: white;
    height: 755px;
    width: 455px;
    display: inline-block;
    box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.1);
    position: relative;
    top: -150px;
}

.title {
    width: 302px;
    height: 43px;
    font-size: 60px;
    font-family: DIN Condensed;
    font-weight: bold;
    color: #011A24;
    line-height: 114px;
    margin-left: 10%;
    margin-top: 10%;
}

.title_zh {
    width: 81px;
    height: 17px;
    font-size: 18px;
    font-family: PingFang HK;
    font-weight: 500;
    color: #011A24;
    line-height: 114px;
    margin-top: 5%;
    margin-left: 10%;
}

.border {
    width: 30px;
    height: 6px;
    background: #011A24;
    margin-left: 10%;
    margin-top: 15%
}

.more {
    float: right;
    margin-right: 10%;
}

.more_bu {
    width: 81px;
    height: 29px;
    font-size: 18px;
    font-family: DIN Alternate;
    font-weight: bold;
    color: #CCCCCC;
    background-color: black;
    margin-top: 30%;
}

.arrow {
    margin-bottom: 90px;
}

.process {
    margin: 0 auto;
    width: 176px;
    height: 44px;
    font-size: 60px;
    font-family: DIN Condensed;
    font-weight: bold;
    color: #011A24;
    line-height: 115px;
}

.process1 {
    margin: 0 auto;
    padding-top: 20px;
    width: 117px;
    height: 17px;
    font-size: 18px;
    font-family: PingFang HK;
    font-weight: 500;
    color: #011A24;
    line-height: 115px;
}

.image {
    text-align: center;
    margin: 20px;
}

.process_img {
    width: 106px;
    height: 106px;
    margin: 50px;
    border: dashed 1px #aaa;
}

.border_pro {
    margin: 0 auto;
    width: 30px;
    height: 6px;
    background: #011A24;
}

/*.process_img1 {*/
/*    background-color: red;*/
/*    margin-top: 6%;*/
/*    margin-left: 9%;*/
/*    position: relative;*/
/*}*/

/*.process_img2 {*/
/*    background-color: black;*/
/*    margin-top: 6%;*/
/*    position: relative;*/
/*    right: -10%;*/
/*}*/

/*.process_img3 {*/
/*    background-color: #1e7e34;*/
/*    margin-top: 6%;*/
/*    position: relative;*/
/*    right: -20%;*/
/*}*/
</style>

