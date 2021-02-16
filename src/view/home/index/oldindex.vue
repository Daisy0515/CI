<template>
    <div id="index">
        <main id="main" class="hp2018">
            <section class="c-hero c-hero--enhanced" id="heroImage">
                <div class="o-container">
                    <div class="c-hero__lead">
                        <h1 class="c-hero__title">发布与解决需求</h1>
                        <h2 class="c-hero__subtitle">具有丰富经验的技术专家以及企业单位</h2>
                        <div class="u-clearfix c-hero__CTA">
                            <div class="e-inputButton">
                                <el-input placeholder="请输入内容" v-model="searchData" class="input-with-select">
                                    <el-button @click="search" slot="append" icon="el-icon-search"></el-button>
                                </el-input>
                                <el-button @click="publishTask" type="primary">发布需求</el-button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section class="c-hpSection c-hpSection--paddingBottom0 c-hpSection--paddingTop0">
                <div class="c-stats c-box">
                    <div class="o-container">
                        <div class="u-clearfix">
                            <div class="c-stats__item" v-for="(item,index) in labelList" :key="index">
                                <i :class="'icon iconfont '+item.icon"></i>
                                <strong class="c-stats__number">{{item.title}}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div></div>
            <section class="c-hpSection c-hpSection--grey">
                <div class="o-container">
                    <h2 class="c-hpTitle">多种群智成果</h2>
                    <ul class="c-categories clearfix">
                        <li
                                v-for="(item,index) in containerData"
                                :key="index"
                                @click="typeList(item.index,item.title)"
                                class="c-categories__category c-box"
                        >
                            <router-link to class="c-categories__category__link">
                                <i :class="item.icon"></i>
                                <span class="c-categories__category__text">{{item.title}}</span>
                            </router-link>
                        </li>
                    </ul>
                    <div style="clear:both"></div>
                    <div class="u-textCenter">
                        <router-link to="classicCase" class="More" title="查看更多">查看更多</router-link>
                    </div>
                </div>
            </section>

            <section class="c-hpSection c-hpSection--white">
                <div class="o-container">
                    <h2 class="c-hpTitle">
                        平台优势
                        <br/>
                        <span class="u-textLightGrey u-textLarge"></span>
                    </h2>
                    <div class="c-media c-media--right clearfix">
                        <div class="c-media__image clearfix">
                            <div style="margin-bottom:50px"></div>
                            <i class="icon iconfont icon-icon_jingque"></i>
                        </div>
                        <div class="c-media__copy">
                            <h3 class="c-media__title">更精准</h3>
                            <p class="u-lineHeightLarge">精准搜索需求和资源，为接包方推荐与他们技能相匹配的需求，为需求方推荐与需求相匹配的接包方。</p>
                        </div>
                    </div>

                    <div class="c-media c-media--left clearfix">
                        <div class="c-media__image clearfix">
                            <div style="margin-bottom:50px"></div>
                            <i class="icon iconfont icon-tuoyuan"></i>
                        </div>
                        <div class="c-media__copy">
                            <h3 class="c-media__title">可跟踪</h3>
                            <p class="u-lineHeightLarge">项目管理透明化,通过在线甘特图，需求方能对项目进度进行可视化跟踪。</p>
                        </div>
                    </div>

                    <div class="c-media c-media--right clearfix">
                        <div class="c-media__image">
                            <div style="margin-bottom:50px"></div>
                            <i class="icon iconfont icon-kongzhi"></i>
                        </div>
                        <div class="c-media__copy">
                            <h3 class="c-media__title">可控制</h3>
                            <p class="u-lineHeightLarge">需求方可以通过系统催促项目进度，确保项目按期完成，特殊情况下可以终止项目。</p>
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
                files: [],
                searchData: "",
                labelList: [
                    {title: "群智化", icon: "icon-zhihui"},
                    {title: "生态化", icon: "icon-zhihuishu"},
                    {title: "服务化", icon: "icon-fuwu"}
                ],
                containerData: [
                    {
                        index: 1,
                        title: "设计服务",
                        icon: "icon iconfont icon-design"
                    },
                    {
                        index: 2,
                        title: "软件开发",
                        icon: "icon iconfont icon-android"
                    },
                    {
                        index: 3,
                        title: "数据科学",
                        icon: "icon iconfont icon-data1"
                    },
                    {
                        index: 4,
                        title: "其他类别",
                        icon: "icon iconfont icon-other"
                    }
                ]
            };
        },
        methods: {
            //搜索关键字
            search() {
                this.$router.push({
                    name: "classicCase",
                    query: {search: this.searchData}
                });
            },
            //选择类型
            typeList(val, title) {
                this.$router.push({
                    name: "classicCase",
                    query: {type: val, title: title}
                });
            },
            publishTask() {
                this.$router.push({path: "publishTask"});
            }
        }
    };
</script>
<style lang='scss'>
    @import "@/assets/scss/index.scss";
</style>

