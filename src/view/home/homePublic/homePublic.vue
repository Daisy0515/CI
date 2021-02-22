<template>
    <div class="homePublic clearfix">
        <newHomeHead/>
        <div style="clear:both"></div>
        <router-view style="min-height:90%"></router-view>
        <div style="clear:both"></div>
        <Footer-Index/>
    </div>
</template>
<script>
    import FooterIndex from "@/common/footer/footer";
    import newHomeHead from "@/common/header/newhomeHeader";

    export default {
        name: "homePublic",
        components: {
            FooterIndex,
            newHomeHead
        },
        data: function () {
        },
        created: function () {
        },
        computed: {
        },
        mounted: function () {
        },
        methods: {
        },

    };
</script>
<style lang='scss'>
    .homePublic {
        height: 100%;
        min-height: 100%;
    }
</style>
