<template>
    <div class="publishtask">
        <div id="aspnetForm" class="responsive resp">
            <div class="module_secondaryHead guruSearch hasBg">
                <div class="container">
                    <div class="module_headerCrumb">
                        <div class="refinery">
                            <div class="h1 searchTitle">
                                <p class="searchTitle">
                                    <router-link to="releaseProcess">招标投标</router-link>
                                    > 发布需求
                                </p>
                            </div>
                        </div>
                        <span class="resultCount"></span>
                    </div>
                </div>
            </div>
        </div>
        <div class="container">
            <Publish/>
        </div>
    </div>
</template>

<script>
    import Publish from '@/common/publish/publish.vue'

    export default {
        components: {
            Publish
        },
        data() {
            return {};
        },
    }
</script>
