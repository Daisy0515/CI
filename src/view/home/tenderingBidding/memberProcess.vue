<template>
    <div class="memberProcess">
        <div class="module_secondaryHead guruSearch hasBg">
            <div class="container">
                <div class="module_headerCrumb">
                    <div class="refinery">
                        <div class="h1 searchTitle">
                            <p class="searchTitle">项目成员角色</p>
                        </div>
                    </div>
                    <span class="resultCount"></span>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="main">
                <h1>加入团队流程</h1>
                <h2>群智化、生态化、服务化于一体智能招投标系统</h2>
                <ul class="buzhou clearfix">
                    <li>
                        <p>1 填写信息</p>
                        <span>>>></span>
                    </li>
                    <li>
                        <p>2 加入团队</p>
                        <span>>>></span>
                    </li>
                    <!-- <li><p>4 工作流执行</p></li> -->
                    <ul class="fenzhi">
                        <li>3.1 成功中标</li>
                        <li>3.2 未中标团队自动解散</li>
                    </ul>
                    <li>
                        <span>>>></span>
                        <p>4 项目执行</p></li>
                </ul>
                <ul class="processItem clearfix">
                    <li class="stats_item">
                        <i class="icon iconfont icon-zhihui"></i>
                        <p>群智化</p>
                    </li>
                    <li class="stats_item">
                        <i class="icon iconfont icon-zhihuishu"></i>
                        <p>生态化</p>
                    </li>
                    <li class="stats_item">
                        <i class="icon iconfont icon-fuwu"></i>
                        <p>服务化</p>
                    </li>
                </ul>
            </div>
            <div class="processBottom">
                <router-link to="teamSquare">
                    <span>团队广场</span>
                </router-link>
                <router-link to="desk/teamApplication">
                    <span>团队申请</span>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {};
        },
        methods: {}
    };
</script>
<style lang='scss'>
    @import "@/assets/scss/memberProcess.scss";
</style>
