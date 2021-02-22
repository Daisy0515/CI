<template>
    <div class="homePublic clearfix">
        <newHomeHead v-if="isNewHeader"/>
        <homeHead v-else/>
        <div style="clear:both"></div>
        <router-view style="min-height:90%"></router-view>
        <div style="clear:both"></div>
        <Footer-Index/>
    </div>
</template>
<script>
    import FooterIndex from "@/common/footer/footer";
    import newHomeHead from "@/common/header/newhomeHeader";
    import homeHead from "@/common/header/newhomeHeader";

    export default {
        name: "homePublic",
        components: {
            FooterIndex,
            homeHead,
            newHomeHead
        },
        data: function () {
            return {
                isNewHeader: true
            };
        },
        created: function () {
        },
        computed: {
        },
        mounted: function () {
        },
        methods: {
        },
        watch: {
            $route(to){
                if(to.name == "index"){
                    this.isNewHeader = true;
                } else {
                    this.isNewHeader = false;
                }
            }
        }

    };
</script>
<style lang='scss'>
    .homePublic {
        height: 100%;
        min-height: 100%;
    }
</style>
