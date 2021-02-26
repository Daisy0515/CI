<template>
    <div id="index">
        <main id="main">
            <section class="cc-hero" id="heroImage">
                <div class="cc-hero__lead">
                    <p class="cc-hero__title">聚集群体的智慧</p>
                    <p class="cc-hero__subtitle">构建涉众共融的群智化新型软件开发环境</p>
                    <p class="cc-hero__title">__</p>
                    <div class="cc-hero__CTA">
                        <div class="ee-inputButton">
                            <el-button @click="myProject" type="primary">我的项目</el-button>
                            <el-button @click="joinTeam" type="primary">参与竞标</el-button>
                        </div>
                    </div>
                </div>
            </section>
            <section class="center-section" style="margin: 158px auto 0 auto;">
                <div class="team1">
                    <div class="title">NEW ITEM</div>
                    <div class="title_zh">最新需求</div>
                    <div class="more">
                        <button class="more_bu" @click="moreDemands">more</button>
                    </div>
                    <div class="border"></div>
                    <div style="margin: 20px; padding-top: 30px">
                        <Items></Items>
                    </div>
                </div>
                <div class="team2" style="float: right">
                    <div class="title">PROJECT</div>
                    <div class="title_zh">最新开源</div>
                    <div class="more">
                        <button class="more_bu" @click="moreOpenSource">more</button>
                    </div>
                    <div class="border"></div>
                    <div style="margin: 20px; padding-top: 40px">
                        <Projects></Projects>
                    </div>

                </div>
            </section>
            <section class="center-section" style="margin: 0 auto 158px auto;">
                <div class="center-text">
                    <p class="iimg-list__left-title noheight_title">PROCESS</p>
                    <p class="iimg-list__left-subtitle">竞标流程指南</p>
                    <p class="iimg-list__left-title iimg-list__left-br">_</p>
                </div>
                <div style="display: flex;justify-content: space-between">
                    <div class="image">
                        <div style="display:inline-block">
                            <img src="@/assets/img/index/index_manager_1.png" class="process_img">
                            <p>竞标</p>
                        </div>
                        <div style="display:inline-block">
                            <img src="@/assets/img/index/arrow_right.png" class="arrow">
                        </div>
                        <div style="display:inline-block">
                            <img src="@/assets/img/index/index_manager_2.png" class="process_img">
                            <p>邀请开发者</p>
                        </div>
                        <div style="display:inline-block">
                            <img src="@/assets/img/index/arrow_right.png" class="arrow">
                        </div>
                        <div style="display:inline-block">
                            <img src="@/assets/img/index/index_manager_3.png" class="process_img">
                            <p>项目管理</p>
                        </div>
                        <div style="display:inline-block">
                            <img src="@/assets/img/index/arrow_right.png" class="arrow">
                        </div>
                        <div style="display:inline-block">
                            <img src="@/assets/img/index/index_manager_4.png" class="process_img">
                            <p>交付成果</p>
                        </div>
                        <div style="display:inline-block">
                            <img src="@/assets/img/index/arrow_right.png" class="arrow">
                        </div>
                        <div style="display:inline-block">
                            <img src="@/assets/img/index/index_manager_5.png" class="process_img">
                            <p>反馈评价</p>
                        </div>
                    </div>
                </div>
            </section>
            <section class="center-section">
                <div style="display: flex; justify-content: space-between;">
                    <div class="iimg-list__left">
                        <p class="iimg-list__left-title">PROCESS ON</p>
                        <p class="iimg-list__left-subtitle">流程介绍</p>
                        <p class="iimg-list__left-title iimg-list__left-br">_</p>

                        <p class="iimg-list__left-subtitle" v-if="currentIndex==0">竞标</p>
                        <p class="iimg-list__left-content" v-if="currentIndex==0">需求方发布需求后，<br>平台用户可报名参与竞标。<br><br></p>
                        <p class="iimg-list__left-subtitle" v-if="currentIndex==1">邀请开发者</p>
                        <p class="iimg-list__left-content" v-if="currentIndex==1">竞标用户可以在平台邀请其他开发者参与项目，<br>平台还可根据竞标用户需求来推荐合适的开发者。<br><br>
                        </p>
                        <p class="iimg-list__left-subtitle" v-if="currentIndex==2">项目管理</p>
                        <p class="iimg-list__left-content" v-if="currentIndex==2">平台为研发团队提供完善的项目管理功能，<br>研发成员可以高效地完成项目任务，<br>实时地追踪项目研发中的缺陷，及时更新。
                        </p>
                        <p class="iimg-list__left-subtitle" v-if="currentIndex==3">交付成果</p>
                        <p class="iimg-list__left-content" v-if="currentIndex==3">在完成交付任务后，<br>中标用户上传交付任务，<br>需求方可验收交付内容。
                        </p>
                        <p class="iimg-list__left-subtitle" v-if="currentIndex==4">反馈评价</p>
                        <p class="iimg-list__left-content" v-if="currentIndex==4">在验收通过后，需求方给予中标方反馈与评价。<br><br><br></p>
                    </div>
                    <div class="iimg-list__right">
                        <div class="iimg-list__img">
                            <div class='iimg-list__bottom'>
                                <img :src="imgList[currentIndex]">
                            </div>
                            <img class='iimg-list__top' :src="imgList[(currentIndex+1)%5]">
                        </div>

                        <div class="iimg-list__text">
                            <li v-for="(item,index) in imgList" :key="index" @click="changeImg(index)"
                                :class="[currentIndex == index ? 'iimg-list__active': 'iimg-list__noactive',
                                     currentIndex == index && index == 4 ? 'iimg-list__lastactive': '']">
                                <a v-show="currentIndex==index">_</a>{{ '0' + (index + 1) }}
                            </li>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </div>
</template>

<script>
import Items from './items.vue';
import Projects from './projects.vue';

export default {
    components: {
        Items,
        Projects,
    },
    data() {
        return {
            searchData: "",
            imgList: [require('@/assets/img/index/index_service_1.jpg'),
                require('@/assets/img/index/index_service_2.jpg'),
                require('@/assets/img/index/index_service_3.jpg'),
                require('@/assets/img/index/index_service_4.jpg'),
                require('@/assets/img/index/index_service_5.jpg'),],
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
            this.$router.push({path: "biddingSquare"});
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
        myProject() {
            this.$router.push({path: "desk/projectManageList"});
        },
        moreOpenSource() {
            this.$router.push({path: "classicCase"});
        },
        moreDemands() {
            this.$router.push({path: "biddingSquare"});
        }
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

.team1 {
    background-color: white;
    height: 755px;
    width: 555px;
    display: inline-block;
    box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.1);
    position: relative;
    top: -250px;
}

.team2 {
    background-color: white;
    height: 755px;
    width: 355px;
    display: inline-block;
    box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.1);
    position: relative;
    top: -250px;
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
    margin-top: 50px;
}

.title_zh {
    width: 81px;
    height: 17px;
    font-size: 18px;
    font-family: PingFang HK;
    font-weight: 500;
    color: #011A24;
    line-height: 114px;
    margin-top: 40px;
    margin-left: 10%;
}

.border {
    width: 30px;
    height: 6px;
    background: #011A24;
    margin-left: 10%;
    margin-top: 100px;
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
    width: 80px;
    height: 80px;
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

