<template>
    <div id="index">
        <main id="main">

            <section class="cc-hero" :style="imgStyle" id="heroImage" @click="homepageView">
                <div class="cc-hero__lead" v-show="isIndexImage">
                    <p class="cc-hero__title">面向服务的群智化生态化</p>
                    <p class="cc-hero__title">软件开发平台</p>
                    <p class="cc-hero__subtitle">提供覆盖生命周期的软件开发服务</p>
                    <p class="cc-hero__title">__</p>
                    <div class="cc-hero__CTA">
                        <div class="ee-inputButton">
                            <el-input placeholder="请输入内容" v-model="searchData">
                            </el-input>
                            <el-button @click.stop="search" slot="append" type="primary">查找项目</el-button>
                            <el-button @click.stop="publishTask" type="primary">发布需求</el-button>
                            <el-button @click.stop="joinTeam" type="primary">加入团队</el-button>
                        </div>
                    </div>
                </div>
                <el-button class="cc-hero__arrow_left" @click.stop="prevImg" size="medium" :circle="true"
                           icon="el-icon-arrow-left"></el-button>
                <el-button class="cc-hero__arrow_right" @click.stop="nextImg" size="medium" :circle="true"
                           icon="el-icon-arrow-right"></el-button>
            </section>
            <section class="center-section" id="service">
                <div style="display: flex; justify-content: space-between;">
                    <div class="iimg-list__left">
                        <p class="iimg-list__left-title">SERVICE</p>
                        <p class="iimg-list__left-subtitle">群智服务特色</p>
                        <p class="iimg-list__left-title iimg-list__left-br">_</p>

                        <p class="iimg-list__left-subtitle">{{ textList[currentIndex]['title'] }}</p>
                        <p class="iimg-list__left-content">{{ textList[currentIndex]['content'] }}</p>

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
                                :class="[currentIndex == index ? 'iimg-list__active': 'iimg-list__noactive']">
                                <a v-show="currentIndex==index">_</a>{{ '0' + (index + 1) }}
                            </li>
                            <li class="iimg-list__noactive iimg-list__white">05</li>
                            <li class="iimg-list__noactive iimg-list__white">06</li>
                        </div>
                    </div>
                </div>
            </section>
            <section class="center-section" id="about">
                <div class="about-img-text center-text">
                    <p class="iimg-list__left-title noheight_title">ABOUT</p>
                    <p class="iimg-list__left-subtitle">关于我们</p>
                    <p class="iimg-list__left-title iimg-list__left-br">_</p>
                    <p class="about-img-text-content" v-if="currentIndex==0">
                        我们致力于打造真正的涵盖软件生命周期的众包平台<br>
                        构建群智化、生态化、服务化三化融合的软件生态系统<br>
                        吸引众多需求者和开发人员共同参与软件开发使命
                    </p>
                    <el-button @click="aboutUs" type="info">more</el-button>
                </div>
            </section>
            <section class="center-section news-img-text">
                <p class="iimg-list__left-title noheight_title">THE NEWS</p>
                <p class="iimg-list__left-subtitle">最新动态</p>
                <p class="iimg-list__left-title iimg-list__left-br">_</p>
                <News/>
            </section>
            <section class="center-section">
                <div class="center-text">
                    <p class="iimg-list__left-title noheight_title">NEW TOOL</p>
                    <p class="iimg-list__left-subtitle">最新工具</p>
                    <p class="iimg-list__left-title iimg-list__left-br">_</p>
                    <IndexToolSet/>
                    <el-button @click="moreTool" type="info">更多工具</el-button>
                </div>
            </section>
        </main>
    </div>
</template>

<script>
import IndexToolSet from './indextoolset.vue';
import News from './news.vue';
import {httpGet} from "@/utils/http.js";
import {errTips} from "@/utils/tips.js";

export default {
    components: {
        IndexToolSet,
        News,
    },
    data() {
        return {
            searchData: "",
            itemId: 21,
            imgList: [require('@/assets/img/index/index_service_1.jpg'),
                require('@/assets/img/index/index_service_2.jpg'),
                require('@/assets/img/index/index_service_3.jpg'),
                require('@/assets/img/index/index_service_4.jpg'),
                require('@/assets/img/index/index_service_5.jpg'),
                require('@/assets/img/index/index_service_6.jpg')],
            currentIndex: 0,
            backgroundImageList: [],   //默认显示图片
            imgStyle: {
                backgroundImage: 'url' + require('@/assets/img/index/index_background.jpg'),
            },
            mark: 0,
            isIndexImage: true,
            // test: "群智服务特色",
            textList: [
                {
                    title: '角色赋能',
                    content: '平台提供多种用户角色，\n包括项目发布者、管理者、开发者等角色，\n多角色无缝切换，多功能自然解耦。'
                },
                {
                    title: '需求理解',
                    content: '在线获取群体协同的面向服务的用户需求，\n构建面向专业领域的用户需求诱导机制，\n捕获和挖掘多变的用户需求。'
                },
                {
                    title: '涉众共融',
                    content: '服务涉众共融的新型软件生态系统，\n借助服务化手段，将个体用户、开发者、服务提供者\n及平台管理者等服务涉众统一纳入软件生态系统环境。'
                },
                {
                    title: '服务推荐',
                    content: '基于个性化信息融合和服务推荐技术，\n设计群智化服务组合的方法，提供群智化\n生态化软件测试与运行质量保障技术方案。',
                },
                {
                    title: '预测调控',
                    content: '基于海量全球流行的软件生态系统及平台衍生的\n项目开发数据，应用人工智能与机器学习技术，\n驱动软件生态系统的度量与挖掘， 引导\n软件生态系统演化的预测与调控。',
                },
                {
                    title: '协同学习',
                    content: '基于大规模群体软件开发知识库，\n实现跨异构社区的知识迁移，\n形成“人-机-服务”协同学习的自适应机制，\n催生复杂多变环境下服务的协同演化。',
                },
            ]
        }
    },
    created: function () {
        this.getImageList();
        //this.play();
    },
    methods: {
        //搜索关键字
        search() {
            this.$router.push({
                name: "classicCase",
                query: {search: this.searchData}
            });
        },
        homepageView() {
            if (this.itemId != 21) {
                this.$router.push({path: 'homepageView', query: {id: this.itemId}});
            }
            //console.log(this.itemId);
        },
        getImageList() {
            httpGet("v1/public/homepage/get/list").then(results => {
                const {httpCode, msg, data} = results.data;
                if (httpCode === 200) {
                    this.backgroundImageList = data.infoList;
                    //console.log(this.backgroundImageList);
                    //console.log(this.imgStyle);
                    //this.imgStyle.backgroundImage=data.infoList[0].imgsrc;
                } else {
                    errTips(msg);
                }
            });
        },
        autoPlay() {
            if (this.mark < this.backgroundImageList.length - 1) {
                this.mark++;
            } else {
                this.mark = 0;
            }
            this.imgStyle.backgroundImage = 'url(' + this.backgroundImageList[this.mark].imgsrc + ')';
            this.itemId = this.backgroundImageList[this.mark].id;
            if (this.backgroundImageList[this.mark].title != "首页") {
                this.isIndexImage = false;
            } else {
                this.isIndexImage = true;
            }
        },
        nextImg() {
            if (this.mark < this.backgroundImageList.length - 1) {
                this.mark++;
            } else {
                this.mark = 0;
            }
            this.imgStyle.backgroundImage = 'url(' + this.backgroundImageList[this.mark].imgsrc + ')';
            this.itemId = this.backgroundImageList[this.mark].id;
            if (this.backgroundImageList[this.mark].title != "首页") {
                this.isIndexImage = false;
            } else {
                this.isIndexImage = true;
            }
        },
        prevImg() {
            if (this.mark > 0) {
                this.mark--;
            } else {
                this.mark = this.backgroundImageList.length - 1;
            }
            this.imgStyle.backgroundImage = 'url(' + this.backgroundImageList[this.mark].imgsrc + ')';
            this.itemId = this.backgroundImageList[this.mark].id;
            if (this.backgroundImageList[this.mark].title != "首页") {
                this.isIndexImage = false;
            } else {
                this.isIndexImage = true;
            }
            //console.log(this.imgStyle.backgroundImage );
            //console.log(this.mark);
        },
        play() {
            setInterval(this.autoPlay, 5000)
        },
        publishTask() {
            this.$router.push({path: "publishTask"});
        },
        joinTeam() {
            this.$router.push({path: "teamSquare"});
        },
        changeImg(index) {
            this.currentIndex = index;
        },
        register() {
            this.$router.push({path: "selectRole"});
        },
        aboutUs() {
            this.$router.push({path: "feature"});
        },
        moreTool() {
            this.$router.push({path: "moreToolset"});
        }
    }
};
</script>
<style lang='scss'>
@import "@/assets/scss/newindex.scss";

.process-line {
    display: inline-block;

    img {
        margin: 0 25px 0 25px;
        vertical-align: middle;
    }

    .dash-border {
        border: dashed 1px #aaa;
    }
}

.process-text {
    width: 108px;
    padding: 0 25px 0 25px;
    display: table-cell;
    font-size: 18px;
    font-family: PingFang HK;
    font-weight: 400;
    color: #011A24;
}
</style>
<style scoped>
.center-section {
    margin: 158px auto 158px auto;
    width: 1100px;
}

.iimg-list__white {
    color: #fff;
}
</style>