<template>
    <publisher :pageName="pageName" :timeStatus="timeStatus"></publisher>
</template>

<script>
    import publisher from '@/view/review/components/publisher'
    export default {
        components:{publisher},
        data() {
            return {
                pageName:"即将超时",
                timeStatus:1,
            };
        },
    };
</script>
