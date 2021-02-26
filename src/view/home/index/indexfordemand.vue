<template>
    <div id="index">
        <main id="main">
            <section class="cc-hero" id="heroImage">
                <div class="cc-hero__lead">
                    <p class="cc-hero__title">发布您的需求</p>
                    <p class="cc-hero__subtitle">提供覆盖生命周期的软件开发服务</p>
                    <p class="cc-hero__title">__</p>
                    <div class="cc-hero__CTA">
                        <div class="ee-inputButton">
                            <el-button @click="myDemand" type="primary">我的需求</el-button>
                            <el-button @click="publishTask" type="primary">发布需求</el-button>
                        </div>
                    </div>
                </div>
            </section>
            <section class="center-section">
                <div class="about-img-text center-text">
                    <p class="iimg-list__left-title noheight_title">ABOUT</p>
                    <p class="iimg-list__left-subtitle">关于我们</p>
                    <p class="iimg-list__left-title iimg-list__left-br">_</p>
                    <p class="about-img-text-content">
                        我们致力于打造真正的涵盖软件生命周期的众包平台<br>
                        构建群智化、生态化、服务化三化融合的软件生态系统<br>
                        吸引众多需求者和开发人员共同参与软件开发使命
                    </p>
                    <el-button @click="aboutUs" type="info">more</el-button>
                </div>
            </section>
            <section class="center-section">
                <div class="center-text">
                    <p class="iimg-list__left-title">PROCESS</p>
                    <p class="iimg-list__left-subtitle">流程介绍</p>
                    <p class="iimg-list__left-title iimg-list__left-br">_</p>
                </div>
                <div class="center-text">
                    <div class='process-line'>
                        <img :src="iconList[0]" class="dash-border">
                        <p class='process-text'>发布评审</p>
                    </div>
                    <img :src="iconList[4]">
                    <div class='process-line'>
                        <img :src="iconList[1]" class="dash-border">
                        <p class='process-text'>选择团队</p>
                    </div>
                    <img :src="iconList[4]">
                    <div class='process-line'>
                        <img :src="iconList[2]" class="dash-border">
                        <p class='process-text'>项目评审</p>
                    </div>
                    <img :src="iconList[4]">
                    <div class='process-line'>
                        <img :src="iconList[3]" class="dash-border">
                        <p class='process-text'>交付&开源</p>
                    </div>

                </div>
            </section>
            <section class="center-section">
                <div style="display: flex; justify-content: space-between;">
                    <div class="iimg-list__left">
                        <p class="iimg-list__left-title">PROCESS ON</p>
                        <p class="iimg-list__left-subtitle">流程介绍</p>
                        <p class="iimg-list__left-title iimg-list__left-br">_</p>

                        <p class="iimg-list__left-subtitle">{{ textList[currentIndex]['title'] }}</p>
                        <p class="iimg-list__left-content">{{ textList[currentIndex]['content'] }}</p>

                    </div>
                    <div class="iimg-list__right">
                        <div class="iimg-list__img">
                            <div class='iimg-list__bottom'>
                                <img :src="imgList[currentIndex]">
                            </div>
                            <img class='iimg-list__top' :src="imgList[(currentIndex+1)%4]">
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
        </main>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                searchData: "",
                imgList:[require('@/assets/img/index/index_demand_service_1.jpg'),
                         require('@/assets/img/index/index_demand_service_2.jpg'),
                         require('@/assets/img/index/index_demand_service_3.jpg'),
                         require('@/assets/img/index/index_demand_service_4.jpg')],
                iconList:[require('@/assets/img/index/icon_publish.png'),
                          require('@/assets/img/index/icon_team.png'),
                          require('@/assets/img/index/icon_review.png'),
                          require('@/assets/img/index/icon_accomplish.png'),
                          require('@/assets/img/index/arrow_right.png')],
                currentIndex: 0,   //默认显示图片
                textList:[
                    {
                        title: '发布需求',
                        content: '在发布需求阶段，\n用户对自己的项目进行详细描述，\n确定项目交付内容与评审流程。'
                    },
                    {
                        title: '选择团队',
                        content: '在确定竞标方后，\n需求方结束竞标过程，\n指定单独或多个竞标方完成需求。'
                    },
                    {
                        title: '评审交付',
                        content: '在中标方交付项目后，\n需求方通过评审系统评审交付内容，\n若评审不通过，竞标方需重新交付内容。'
                    },
                    {
                        title: '交付&开源',
                        content: '在交付内容通过验收后，\n需求结束，\n用户可选择开源该项目，供平台用户学习',
                    }
                ]
            }
        },

        methods: {
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
        padding: 0;
        margin: 136px 20% 136px 20%;
    }
    .iimg-list__white {
        color: #fff;
    }
</style>

