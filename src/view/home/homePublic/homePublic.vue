<template>
    <div class="homePublic clearfix">
        <homeHead/>
        <div style="clear:both"></div>
        <router-view style="min-height:90%"></router-view>
        <div style="clear:both"></div>
        <Footer-Index/>
    </div>
</template>
<script>
    import FooterIndex from "@/common/footer/footer";
    import homeHead from "@/common/header/homeHeader";

    export default {
        name: "homePublic",
        components: {
            FooterIndex,
            homeHead
        },
        data: function () {
            return {};
        },
        created: function () {

        },
        computed: {},
        mounted: function () {
        },
        methods: {}
    };
</script>
<style lang='scss'>
    .homePublic {
        height: 100%;
        min-height: 100%;
    }
</style>
