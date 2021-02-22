<template>
    <div id="index">
        <main id="main">
            <section class="cc-hero" id="heroImage">
                    <div class="cc-hero__lead">
                        <p class="cc-hero__title">面向服务的群智化生态化</p>
                        <p class="cc-hero__title">软件开发平台</p>
                        <p class="cc-hero__subtitle">提供覆盖生命周期的软件开发服务</p>
                        <p class="cc-hero__title">__</p>
                        <div class="cc-hero__CTA">
                            <div class="ee-inputButton">
                                <el-input placeholder="请输入内容" v-model="searchData">
                                    <el-button @click="search" slot="append" type="primary">查找项目</el-button>
                                </el-input>
                                <el-button @click="publishTask" type="primary">发布需求</el-button>
                                <el-button @click="joinTeam" type="primary">加入团队</el-button>
                            </div>
                        </div>
                    </div>
            </section>
            <section class="center-section">
                <div class="iimg-list__left">
                    <p class="iimg-list__left-title">SERVICE</p>
                    <p class="iimg-list__left-subtitle">群智服务特色</p>
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
                                     <a v-show="currentIndex==index">_</a>{{'0'+(index+1)}}</li>
                    </div>
                </div>

            </section>
            <section class="center-section">
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
                    <ToolSet/>
                    <el-button @click="moreTool" type="info">更多工具</el-button>
                </div>
            </section>
        </main>
    </div>
</template>

<script>
    import ToolSet from './newtoolset.vue';
    import News from './news.vue';
    export default {
        components: {
           ToolSet,
           News,
        },
        data() {
            return {
                searchData: "",
                imgList:[require('@/assets/img/index/index_service_1.jpg'),
                        require('@/assets/img/index/index_service_2.jpg'),
                        require('@/assets/img/index/index_service_3.jpg'),
                        require('@/assets/img/index/index_service_4.jpg'),
                        require('@/assets/img/index/index_service_5.jpg'),
                        require('@/assets/img/index/index_service_6.jpg')],
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
</style>
<style scoped>
    .el-input-group__append .el-button--primary {
        color: #fff;
        background-color: #80CCD0;
    }
    .ee-inputButton >>> .el-input-group__append{
        border:none;
    }
    .el-button--primary {
        color: #fff;
        background-color: #80CCD0;
        border-color: #80CCD0;
        border-radius:  0;
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
        border-radius:  0;
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
</style>

