<template>
    <div class="desk clearfix">
        <Index-Header :imageUrl="getuserData&&getuserData.headurl"></Index-Header>
        <keep-alive :include="getInclude">
            <router-view v-if="$route.meta.keepAlive" class="height_main"
                         :imageUrl="getuserData&&getuserData.headurl"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive" class="height_main"
                     :imageUrl="getuserData&&getuserData.headurl"></router-view>
        <div style="clear:both"></div>
        <Footer/>
    </div>
</template>

<script>
    import {mapGetters, mapMutations} from "vuex";
    import IndexHeader from "@/common/header/deskHeader";
    import Footer from "@/common/footer/footer";

    export default {
        components: {
            IndexHeader,
            Footer
        },
        data() {
            return {
                imageUrl: "",
                include: []
            };
        },
        watch: {
            $route(to, from) {
                //如果 要 to(进入) 的页面是需要 keepAlive 缓存的，把 name push 进 include数组
                if (to.meta.keepAlive) {
                    !this.getInclude.includes(to.name) && this.getInclude.push(to.name);
                    this.refreshCache(this.getInclude);
                }
                //判断是否需要将组件缓存
                if (from.meta.keepAlive && to.meta.deepth === from.meta.deepth) {
                    var index = this.getInclude.indexOf(from.name);
                    index !== -1 && this.getInclude.splice(index, 1);
                    this.refreshCache(this.getInclude);
                }
                // if (from.meta.keepAlive && to.meta.deepth < from.meta.deepth) {
                //   console.log(to.meta.deepth);
                //   var index = this.include.indexOf(from.name);
                //   index !== -1 && this.include.splice(index, 1);
                //   console.log(this.include)
                // }
            }
        },
        computed: {
            ...mapGetters(["getuserData", "getInclude"])
        },
        methods: {
            ...mapMutations(["setImgurl", "setLogin", "setCache", "refreshCache"])
        }
    };
</script>
<style lang='scss'>
    @import "@/assets/scss/desk.scss";
</style>
