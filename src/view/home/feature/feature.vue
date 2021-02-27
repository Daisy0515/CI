<template>
    <div class="feature">
        <main id="main" role="main" class="hp2018">
            <section class="c-hero c-hero--enhanced" id="heroImage">
                <div class="o-container">
                    <div class="c-hero__lead">
                        <h1 class="c-hero__title">关于我们</h1>
                        <!-- <h2 class="c-hero__copy u-marginBottom0">更便捷. 易管理. 快搜索.</h2> -->
                    </div>
                </div>
            </section>
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
                        <p>
                            <strong>
                                使命：
                                <br>
                            </strong>为软件众包需求者和众多开发者提供一个可靠便捷的众包平台。
                        </p>
                        <br>
                        <p>
                            <strong>
                                口号：
                                <br>
                            </strong>促进众包软件开发中的竞争与合作。
                        </p>
                        <br>
                        <p>
                            <strong>产品理念</strong>
                            <br>群智化、生态化、服务化
                        </p>
                        <br>
                        <p class="characteristic">
                            <strong>产品设计特点</strong>
                            <br><span>更精准</span>
                            <br>精准搜索需求和资源，为接包方推荐与他们技能相匹配的需求，为需求方推荐与需求相匹配
                            <br><span>可跟踪</span>
                            <br>项目管理透明化,通过在线甘特图，需求方能对项目进度进行可视化跟踪
                            <br><span>可控制</span>
                            <br>需求方可以通过系统催促项目进度，确保项目按期完成，特殊情况下可以终止项目。
                        </p>
                    </div>
                    <div class="contact">
                        <p>项目贡献者</p>
                        <el-row>
                            <el-col :span="8" v-for="i in pics.length" :key="i">
                                <el-avatar :size="100" :src="require(''+pics[i-1])">
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
            pics:  ["./伍映吉.jpg","./于琼.jpg","./董丽.jpg","./施鉴洋.png", "./许文健.png", "./袁琦.png", "./邵卢娇.png", "./郑俊进.png", "./任庆吉.png"],
            names: ["伍映吉", "于琼", "董丽", "施鉴洋", "许文健", "袁琦", "邵卢娇", "郑俊进", "任庆吉"],
            occus: ["硕士", "硕士","博士在读", "博士在读", "硕士在读", "硕士在读", "硕士在读", "硕士在读", "硕士在读"],
            homes: ["","https://github.com/yq0000","https://github.com/Amelie01","https://github.com/CNFightingSjy", "https://github.com/xwj1427698750", "https://github.com/Daisy0515",
                "https://github.com/sljslj","https://github.com/waitwind001", "https://github.com/RenQJ",],
        }
    },
};


</script>
<style lang='scss'>
@import "@/assets/scss/feature.scss";
</style>
