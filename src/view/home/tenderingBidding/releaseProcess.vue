<template>
    <div class="releaseProcess">
        <div class="module_secondaryHead guruSearch hasBg">
            <div class="container">
                <div class="module_headerCrumb">
                    <div class="refinery">
                        <div class="h1 searchTitle">
                            <p class="searchTitle">项目发布角色</p>
                        </div>
                    </div>
                    <span class="resultCount"></span>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="main">
                <h1>招投标流程</h1>
                <h2>群智化、生态化、服务化于一体智能招投标系统</h2>
                <ul class="buzhou clearfix">
                    <li>
                        <p>1 填写需求</p>
                        <span>>>></span>
                    </li>
                    <li>
                        <p>2 发布需求</p>
                        <span>>>></span>
                    </li>
                    <li>
                        <p>3 项目经理竞标</p>
                        <span>>>></span>
                    </li>
                    <li>
                        <p>4 项目经理组队</p>
                    </li>
                </ul>
                <ul class="buzhou clearfix">
                    <li>
                        <p>5 选择团队</p>
                        <span>>>></span>
                    </li>
                    <li>
                        <p>6 工作流程执行</p>
                        <span>>>></span>
                    </li>
                    <li>
                        <p>7 招标结束</p>
                    </li>
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
                <router-link to="publishTask">
                    <span>我要发布</span>
                </router-link>
                <router-link to="desk/myDemand">
                    <span>我的需求</span>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {};
        }
    };
</script>
<style lang='scss'>
    @import "@/assets/scss/releaseProcess.scss";
</style>
