<template>
    <publisher :pageName="pageName" :timeStatus="timeStatus"></publisher>
</template>

<script>
    import publisher from '@/view/review/publisher/components/publisher'
    export default {
        components:{publisher},
        data() {
            return {
                pageName:"已经超时",
                timeStatus:2,
            };
        },
    };
</script>
