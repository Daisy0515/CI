<template>
    <div class="feature ">
        <main id="main" role="main" class="hp2018">
            <!-- <section class="hasBg c-hero--enhanced" id="heroImage">
                <div class="o-container">
                    <div class="module_headerCrumb">
                        <div class="searchTitle">
                            <h1>关于我们</h1>
                        </div>
                        <!-- <h2 class="c-hero__copy u-marginBottom0">更便捷. 易管理. 快搜索.</h2> -->
                    <!-- </div>
                </div>
            </section> -->
            <div class="responsive resp">
            <div class="module_secondaryHead guruSearch hasBg" style="height: 120px;">
                <div class="container">
                    <div class="module_headerCrumb">
                        <div>
                            <div class="searchTitle">
                                <h2 style="position: absolute; top:120px">关于我们</h2>
                            </div>
                        </div>
                        <span class="resultCount"></span>
                    </div>
                </div>
            </div>
        </div>
            <div class="container">
                <div class="about_count">
                    <div class="about_top">
                        <p class="abo">
                            我们致力于打造真正的涵盖软件生命周期的众包平台
                            <br>构建群智化、生态化、服务化三化融合的软件生态系统
                            <br>吸引众多需求者和开发人员共同参与软件开发使命
                            <br>
                        </p>
                        <br>
                        <br>
                        <br>
                           
                    </div>
                    <div class="contact">
                        <p>合作单位</p>
                        <el-row>
                            <el-col :span="8" v-for="i in cooperativeSchool.length" :key="i">
                                <el-avatar  :size="80" :src="cooperativeSchool[i-1]">
                                </el-avatar>
                                <br>
                                <span>{{ schoolName[i - 1] }}</span>
                                <br>
                                <br>
                                <br>
                                <br>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="contact">
                        <p>项目贡献者</p>
                        <el-row>
                            <el-col :span="8" v-for="i in pics.length" :key="i">
                                <el-avatar :size="100" :src="pics[i-1]">
                                </el-avatar>
                                <br>
                                <span>姓名：{{ names[i - 1] }}</span>
                                <br>
                                <span>学历：{{ occus[i - 1] }}</span>
                                <br>
                                <span>主页：</span>
                                <a :href="homes[i-1]" target="_blank" v-if="homes[i-1] !== ''">个人主页</a>
                                <span v-if="homes[i-1] === ''">暂无</span>
                                <br>
                                <br>
                                <br>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="contact">
                        <p>联系方式</p>
                        <p>哈尔滨工业大学（深圳）</p>
                        <p>联系方式：cosineHIT@163.com</p>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
import {Avatar} from 'element-ui';

export default {
    methods: {},
    data() {
        return {
            cooperativeSchool:[require("@/assets/img/cooperativeSchool/beijingyoudian.jpg"),require("@/assets/img/cooperativeSchool/dongnan.jpg"),require("@/assets/img/cooperativeSchool/landary.jpg"),
            require("@/assets/img/cooperativeSchool/nanjing.png"),require("@/assets/img/cooperativeSchool/shandong.jpg"),require("@/assets/img/cooperativeSchool/shanghaijiaotong.jpg"),
            require("@/assets/img/cooperativeSchool/wuhan.jpg"),require("@/assets/img/cooperativeSchool/zhongnan.png"),require("@/assets/img/cooperativeSchool/zhongshan.jpg"),
            require("@/assets/img/cooperativeSchool/zhonguokuangye.png"),],
            schoolName:["北京邮电大学","  东南大学","  蓝凌","  南京大学","  山东大学","上海交通大学","  武汉大学","  中南大学","  中山大学","中国矿业大学"],
            pics: [require("@/assets/img/contributor/zhj.jpg"), require("@/assets/img/contributor/wyj.jpg"), require("@/assets/img/contributor/yq.jpg"), require("@/assets/img/contributor/dl.jpg"),
                require("@/assets/img/contributor/sjy.jpg"), require("@/assets/img/contributor/xwj.jpg"), require("@/assets/img/contributor/yuanqi.jpg"),
                require("@/assets/img/contributor/slj.jpg"), require("@/assets/img/contributor/zjj.jpg"), require("@/assets/img/contributor/rqj.jpg")],
            names: ["张海军", "伍映吉", "于琼", "董丽", "施鉴洋", "许文健", "袁琦", "邵卢娇", "郑俊进", "任庆吉"],
            occus: ["博士（教授）", "硕士", "硕士", "博士在读", "博士在读", "硕士在读", "硕士在读", "硕士在读", "硕士在读", "硕士在读"],
            homes: ["https://www.dl2link.com/", "", "https://github.com/yq0000", "https://github.com/Amelie01", "https://github.com/CNFightingSjy", "https://github.com/xwj1427698750", "https://github.com/Daisy0515",
                "https://github.com/sljslj", "https://github.com/waitwind001", "https://github.com/RenQJ",],
        }
    },
};


</script>
<style lang='scss'>
@import "@/assets/scss/feature.scss";
</style>
